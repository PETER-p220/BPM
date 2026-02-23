<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-10 text-center">
        Update Details
      </h1>

      <div
        v-if="chat && !isEditing"
        class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <!-- Image Section -->
        <div class="relative">
          <img
            v-if="chat.update_photo"
            :src="chat.update_photo"
            alt="Update photo"
            class="w-full h-80 object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
          <div
            v-else
            class="h-80 bg-gray-100 flex items-center justify-center text-gray-400 text-lg"
          >
            No image available
          </div>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">
              {{ chat.title }}
            </h2>
            <button
              @click="startEditing"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
            >
              <i class="fas fa-edit"></i>
              <span>Edit</span>
            </button>
          </div>

          <div class="space-y-4 text-gray-700">
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-700">Created:</span>
              {{ new Date(chat.created_at).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}
            </p>

            <div>
              <h3 class="font-medium text-gray-800 mb-2">Description</h3>
              <p class="whitespace-pre-line leading-relaxed">
                {{ chat.description || 'No description provided.' }}
              </p>
            </div>

            <!-- File Download -->
            <div v-if="chat.update_file" class="mt-6">
              <h3 class="font-medium text-gray-800 mb-2">Attachment</h3>
              <button
                @click="downloadFile(chat.update_file, getFileName(chat.update_file))"
                class="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-all font-medium text-sm"
                title="Download file"
              >
                <i class="fas fa-download"></i>
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div
        v-if="chat && isEditing"
        class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <div class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Edit Update</h2>
          
          <form @submit.prevent="saveChanges" class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                v-model="editForm.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Update title"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="editForm.description"
                rows="4"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Update description"
              ></textarea>
            </div>

            <!-- File Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
              <input
                type="file"
                @change="handleFileChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
              <p v-if="chat.update_file && !editForm.new_file" class="mt-2 text-sm text-gray-500">
                Current file: {{ getFileName(chat.update_file) }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="isSaving"
                class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
              >
                <i v-if="isSaving" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
              </button>
              <button
                type="button"
                @click="cancelEditing"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Loading update details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
         
          <router-link to="/hr-view-updates" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Updates</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const chat = ref(null);
const isLoading = ref(true);
const isEditing = ref(false);
const isSaving = ref(false);

// Edit form
const editForm = ref({
  title: '',
  description: '',
  new_file: null
});

// Fetch update details
onMounted(async () => {
  try {
    const response = await axios.get(`api/updates/${route.params.chat_id}`);
    if (response.data.status === 'success') {
      chat.value = response.data.data;
      // Initialize edit form
      editForm.value = {
        title: chat.value.title,
        description: chat.value.description,
        new_file: null
      };
    } else {
      chat.value = null;
    }
  } catch (error) {
    console.error('Error fetching update details:', error);
    chat.value = null;
  } finally {
    isLoading.value = false;
  }
});

// Start editing
const startEditing = () => {
  isEditing.value = true;
  editForm.value = {
    title: chat.value.title,
    description: chat.value.description,
    new_file: null
  };
};

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false;
  editForm.value = {
    title: chat.value.title,
    description: chat.value.description,
    new_file: null
  };
};

// Handle file change
const handleFileChange = (event) => {
  editForm.value.new_file = event.target.files[0];
};

// Save changes
const saveChanges = async () => {
  isSaving.value = true;
  try {
    const formData = new FormData();
    formData.append('title', editForm.value.title);
    formData.append('description', editForm.value.description);
    
    if (editForm.value.new_file) {
      formData.append('update_file', editForm.value.new_file);
    }

    const response = await axios.post(`/api/updates/${route.params.chat_id}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.status === 'success') {
      // Update chat data
      chat.value = response.data.data;
      isEditing.value = false;
      
      // Show success message
      toast.success('Update saved successfully!', {
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        icon: 'fas fa-check-circle'
      });
    }
  } catch (error) {
    console.error('Error saving update:', error);
    toast.error('Failed to save update. Please try again.', {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      icon: 'fas fa-exclamation-circle'
    });
  } finally {
    isSaving.value = false;
  }
};

// Download file function
async function downloadFile(fileUrl, fileName) {
  try {
    // Create a download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

// Extract filename from URL
function getFileName(url) {
  return url.split('/').pop() || 'download';
}
</script>
