<template>
  <div class="create-update-container">
    <div class="page-header">
      <h2 class="page-title">Create HR Update</h2>
      <p class="page-subtitle">Submit an update for HR activities</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label for="titles" class="form-label">Update Titles</label>
          <input
            type="text"
            id="titles"
            v-model="form.titles"
            class="form-input"
            placeholder="Enter update titles (comma separated)"
            required
          />
        </div>

        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-textarea"
            placeholder="Enter update description"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="priority" class="form-label">Priority</label>
          <select id="priority" v-model="form.priority" class="form-select" required>
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="form-group">
          <label for="update_photo" class="form-label">Update Photo</label>
          <input
            type="file"
            id="update_photo"
            @change="handlePhotoChange"
            class="form-input"
            accept="image/*"
          />
          <div v-if="form.update_photo" class="photo-preview">
            <img :src="form.update_photo" alt="Preview" class="preview-image" />
          </div>
        </div>

        <div class="form-group">
          <label for="update_file" class="form-label">Update File</label>
          <input
            type="file"
            id="update_file"
            @change="handleFileChange"
            class="form-input"
            accept=".pdf,.xlsx,.csv,.docx"
          />
          <div v-if="form.update_file" class="file-info">
            <span class="file-name">{{ form.update_file.name }}</span>
            <span class="file-size">{{ formatFileSize(form.update_file.size) }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Submit Update</span>
            <span v-else>Submitting...</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';

const form = ref({
  titles: [''],
  description: '',
  priority: 'medium',
  update_photo: null,
  update_file: null
});

const isSubmitting = ref(false);

const submitUpdate = async () => {
  if (!form.value.titles[0] || !form.value.description) {
    alert('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const formData = new FormData();
    formData.append('titles', form.value.titles.join(','));
    formData.append('description', form.value.description);
    formData.append('priority', form.value.priority);
    
    if (form.value.update_photo) {
      formData.append('update_photo', form.value.update_photo);
    }
    
    if (form.value.update_file) {
      formData.append('update_file', form.value.update_file);
    }

    const response = await axios.post('/api/updates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.status === 'success') {
      alert('Update submitted successfully!');
      resetForm();
    } else {
      alert('Failed to submit update: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error submitting update:', error);
    alert('An error occurred while submitting the update');
  } finally {
    isSubmitting.value = false;
  }
};

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    form.value.update_photo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.update_photo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.update_file = file;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const resetForm = () => {
  form.value = {
    titles: [''],
    description: '',
    priority: 'medium',
    update_photo: null,
    update_file: null
  };
};
</script>

<style scoped>
.create-update-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
