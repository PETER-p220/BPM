<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <button 
            @click="goBack" 
            class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-200"
            title="Go back"
          >
            <i class="fa fa-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Create Tender Update</h1>
            <p class="text-sm text-gray-600 mt-1">Submit updates for tender activities and projects</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Main Form Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form @submit.prevent="submitUpdate">
          <div class="p-8">
            <!-- Update Titles Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">1</span>
                Update Information
              </h2>
              
              <div class="space-y-4">
                <!-- Title -->
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                    Update Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    v-model="form.titles[0]"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{'border-red-300 focus:ring-red-500': showErrors && !form.titles[0]}"
                    placeholder="Enter a clear and descriptive title"
                    required
                  />
                  <p v-if="showErrors && !form.titles[0]" class="mt-1 text-sm text-red-600">
                    Title is required
                  </p>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                    Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    :class="{'border-red-300 focus:ring-red-500': showErrors && !form.description}"
                    placeholder="Provide detailed information about this update..."
                    required
                  ></textarea>
                  <div class="flex items-center justify-between mt-2">
                    <p v-if="showErrors && !form.description" class="text-sm text-red-600">
                      Description is required
                    </p>
                    <p class="text-xs text-gray-400 ml-auto">
                      {{ form.description.length }} characters
                    </p>
                  </div>
                </div>

                <!-- Priority -->
                <div>
                  <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="priority"
                      v-model="form.priority"
                      class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select priority level</option>
                      <option value="low">🟢 Low - Regular updates</option>
                      <option value="medium">🟡 Medium - Important updates</option>
                      <option value="high">🔴 High - Urgent updates</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <i class="fa fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Media Upload Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">2</span>
                Attachments
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Photo Upload -->
                <div>
                  <label for="update_photo" class="block text-sm font-medium text-gray-700 mb-2">
                    Update Photo
                    <span class="text-gray-500 font-normal ml-1">(Optional)</span>
                  </label>
                  <div 
                    class="relative border-2 border-dashed rounded-lg p-6 transition-all"
                    :class="[
                      photoPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    ]"
                  >
                    <input 
                      type="file" 
                      id="update_photo" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handlePhotoChange"
                      accept="image/*"
                    />
                    <div class="text-center" v-if="!photoPreview">
                      <div class="mb-3">
                        <i class="fas fa-image text-4xl text-gray-400"></i>
                      </div>
                      <p class="text-sm font-medium text-gray-700 mb-1">Upload Image</p>
                      <p class="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                    <div v-else class="text-center">
                      <div class="relative inline-block">
                        <img :src="photoPreview" class="max-h-32 rounded-lg shadow-md border border-gray-200 mx-auto" alt="Preview" />
                        <button
                          type="button"
                          @click="removePhoto"
                          class="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                        >
                          <i class="fas fa-times text-xs"></i>
                        </button>
                      </div>
                      <p class="text-xs text-green-600 mt-2">
                        {{ form.update_photo.name }} • {{ formatFileSize(form.update_photo.size) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- File Upload -->
                <div>
                  <label for="update_file" class="block text-sm font-medium text-gray-700 mb-2">
                    Update File
                    <span class="text-gray-500 font-normal ml-1">(Optional)</span>
                  </label>
                  <div 
                    class="relative border-2 border-dashed rounded-lg p-6 transition-all"
                    :class="[
                      form.update_file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    ]"
                  >
                    <input 
                      type="file" 
                      id="update_file" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handleFileChange"
                      accept=".pdf,.xlsx,.csv,.docx,.doc,.xls,.ppt,.pptx"
                    />
                    <div class="text-center">
                      <div class="mb-3">
                        <i 
                          class="text-4xl"
                          :class="form.update_file ? 'fas fa-check-circle text-green-500' : 'fas fa-file text-gray-400'"
                        ></i>
                      </div>
                      <div v-if="!form.update_file">
                        <p class="text-sm font-medium text-gray-700 mb-1">Upload Document</p>
                        <p class="text-xs text-gray-500">PDF, Excel, Word up to 10MB</p>
                      </div>
                      <div v-else>
                        <p class="text-sm font-medium text-green-700 mb-1">
                          <i class="fa fa-file-alt mr-1"></i> {{ form.update_file.name }}
                        </p>
                        <p class="text-xs text-green-600">
                          {{ formatFileSize(form.update_file.size) }} • Click to replace
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between px-8 py-6 bg-gray-50 border-t border-gray-200">
            <button 
              type="button"
              @click="goBack"
              class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
              :disabled="isSubmitting"
            >
              <i class="fa fa-times"></i>
              <span>Cancel</span>
            </button>

            <button 
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 px-8 py-3 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #2e4053"
            >
              <i :class="isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'"></i>
              <span>{{ isSubmitting ? 'Submitting...' : 'Submit Update' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <Transition name="modal">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="closeSuccessModal"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
          <div class="p-6 text-center">
            <!-- Success Icon -->
            <div class="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <i class="fas fa-check text-3xl text-green-600"></i>
            </div>

            <!-- Success Message -->
            <h3 class="text-xl font-bold text-gray-900 mb-2">Update Submitted Successfully!</h3>
            <p class="text-gray-600 mb-6">
              Your update has been successfully submitted and will be visible to all team members.
            </p>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="createAnother"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700"
              >
                <i class="fas fa-plus"></i>
                <span>Create Another</span>
              </button>
              <button
                @click="viewUpdates"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-all font-medium"
                style="background-color: #2e4053"
              >
                <i class="fas fa-list"></i>
                <span>View Updates</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const form = ref({
  titles: [''],
  description: '',
  priority: 'medium',
  update_photo: null,
  update_file: null
});

const isSubmitting = ref(false);
const showErrors = ref(false);
const photoPreview = ref(null);
const showSuccessModal = ref(false);

const submitUpdate = async () => {
  showErrors.value = true;

  // Validation
  if (!form.value.titles[0]?.trim() || !form.value.description?.trim()) {
    toast.error('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const formData = new FormData();
    
    // Send titles as array
    form.value.titles.forEach((title, index) => {
      if (title?.trim()) {
        formData.append(`titles[${index}]`, title.trim());
      }
    });
    
    formData.append('description', form.value.description.trim());
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
    
    if (response.data.status === 'success' || response.status === 200 || response.status === 201) {
      showSuccessModal.value = true;
    } else {
      toast.error(response.data.message || 'Failed to submit update');
    }
  } catch (error) {
    console.error('Error submitting update:', error);
    
    let errorMessage = 'An error occurred while submitting the update';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  
  if (!file) {
    form.value.update_photo = null;
    photoPreview.value = null;
    return;
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid image file (JPG, PNG, GIF, WEBP)');
    event.target.value = '';
    return;
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error('Image size must be less than 10MB');
    event.target.value = '';
    return;
  }

  form.value.update_photo = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  
  if (!file) {
    form.value.update_file = null;
    return;
  }

  // Validate file type
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv'
  ];
  
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid document file (PDF, Word, Excel, PowerPoint, CSV)');
    event.target.value = '';
    return;
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB');
    event.target.value = '';
    return;
  }

  form.value.update_file = file;
};

const removePhoto = () => {
  form.value.update_photo = null;
  photoPreview.value = null;
  const fileInput = document.getElementById('update_photo');
  if (fileInput) fileInput.value = '';
};

const resetForm = () => {
  form.value = {
    titles: [''],
    description: '',
    priority: 'medium',
    update_photo: null,
    update_file: null
  };
  photoPreview.value = null;
  showErrors.value = false;
  
  // Clear file inputs
  const photoInput = document.getElementById('update_photo');
  const fileInput = document.getElementById('update_file');
  if (photoInput) photoInput.value = '';
  if (fileInput) fileInput.value = '';
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  resetForm();
};

const createAnother = () => {
  showSuccessModal.value = false;
  resetForm();
  toast.success('Form cleared. Ready for new update!');
};

const viewUpdates = () => {
  showSuccessModal.value = false;
  router.push('/tenderuser-viewupdate');
};

const goBack = () => {
  router.push('/tenderuser-viewupdate');
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* File input hover effect */
input[type="file"] + div {
  cursor: pointer;
}
</style>