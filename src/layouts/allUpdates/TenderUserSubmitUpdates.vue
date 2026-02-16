<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif">
    <div class="container px-4 mx-auto max-w-4xl">
      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <router-link 
            to="/tenderuser-viewupdate" 
            class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-200"
            title="Go back"
          >
            <i class="fa fa-arrow-left"></i>
          </router-link>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Submit Project Update</h1>
            <p class="text-sm text-gray-600 mt-1">Share progress, files, and important information about your project</p>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Form Content -->
        <div class="p-8">
          <form @submit.prevent="submitUpdate">
            
            <!-- Update Titles Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">1</span>
                Update Titles
              </h2>
              
              <div class="space-y-3">
                <div 
                  v-for="(title, index) in updateData.titles" 
                  :key="index"
                  class="flex items-start gap-3 group"
                >
                  <div class="flex-1">
                    <div class="relative">
                      <input 
                        type="text" 
                        v-model="updateData.titles[index]"
                        :placeholder="`Update title ${index + 1}`"
                        class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        :class="{'border-red-300 focus:ring-red-500': showErrors && !title}"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span class="text-xs text-gray-400">#{{ index + 1 }}</span>
                      </div>
                    </div>
                    <p v-if="showErrors && !title" class="mt-1 text-sm text-red-600">
                      This field is required
                    </p>
                  </div>
                  
                  <button 
                    v-if="updateData.titles.length > 1"
                    type="button"
                    @click="removeTitle(index)"
                    class="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all mt-0.5 opacity-0 group-hover:opacity-100"
                    title="Remove this title"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <div v-else class="w-10"></div>
                </div>
              </div>

              <button 
                type="button"
                @click="addTitle"
                class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all font-medium"
              >
                <i class="fa fa-plus-circle"></i>
                <span>Add Another Title</span>
              </button>

              <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-800 flex items-start gap-2">
                  <i class="fa fa-info-circle mt-0.5"></i>
                  <span>You can add multiple update titles to organize different aspects of your project update</span>
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Media Upload Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">2</span>
                Media & Files
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
                      updateData.update_photo ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    ]"
                  >
                    <input 
                      type="file" 
                      id="update_photo" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handlePhotoUpload"
                      accept="image/*"
                    />
                    <div class="text-center">
                      <div class="mb-2">
                        <i 
                          class="text-3xl"
                          :class="updateData.update_photo ? 'fa fa-check-circle text-green-500' : 'fa fa-image text-gray-400'"
                        ></i>
                      </div>
                      <div v-if="!updateData.update_photo">
                        <p class="text-sm font-medium text-gray-700">Upload Image</p>
                        <p class="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                      <div v-else>
                        <p class="text-sm font-medium text-green-700">
                          <i class="fa fa-image mr-1"></i> {{ updateData.update_photo.name }}
                        </p>
                        <p class="text-xs text-green-600 mt-1">
                          {{ formatFileSize(updateData.update_photo.size) }} • Click to replace
                        </p>
                      </div>
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
                      updateData.update_file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    ]"
                  >
                    <input 
                      type="file" 
                      id="update_file" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handleFileUpload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    />
                    <div class="text-center">
                      <div class="mb-2">
                        <i 
                          class="text-3xl"
                          :class="updateData.update_file ? 'fa fa-check-circle text-green-500' : 'fa fa-file text-gray-400'"
                        ></i>
                      </div>
                      <div v-if="!updateData.update_file">
                        <p class="text-sm font-medium text-gray-700">Upload Document</p>
                        <p class="text-xs text-gray-500 mt-1">PDF, Excel, Word up to 10MB</p>
                      </div>
                      <div v-else>
                        <p class="text-sm font-medium text-green-700">
                          <i class="fa fa-file-alt mr-1"></i> {{ updateData.update_file.name }}
                        </p>
                        <p class="text-xs text-green-600 mt-1">
                          {{ formatFileSize(updateData.update_file.size) }} • Click to replace
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Image Preview -->
              <div v-if="photoPreview" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div class="relative inline-block">
                  <img :src="photoPreview" class="max-h-48 rounded-lg shadow-md border border-gray-200" alt="Preview" />
                  <button
                    type="button"
                    @click="removePhoto"
                    class="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <i class="fa fa-times text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Description Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">3</span>
                Description
              </h2>
              
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Update Description
                  <span class="text-gray-500 font-normal ml-1">(Optional)</span>
                </label>
                <textarea 
                  id="description" 
                  v-model="updateData.description"
                  rows="6"
                  placeholder="Provide detailed information about this update..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                ></textarea>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-xs text-gray-500">
                    <i class="fa fa-info-circle mr-1"></i>
                    Describe the progress, challenges, or any important details
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ updateData.description.length }} characters
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
              <router-link 
                to="/tenderuser-viewupdate" 
                class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                <i class="fa fa-times"></i>
                <span>Cancel</span>
              </router-link>

              <button 
                type="submit"
                :disabled="isLoading"
                class="inline-flex items-center gap-2 px-8 py-3 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style="background-color: #283747"
                :class="{'hover:bg-opacity-90': !isLoading}"
              >
                <i :class="isLoading ? 'fa fa-spinner fa-spin' : 'fa fa-paper-plane'"></i>
                <span>{{ isLoading ? 'Submitting...' : 'Submit Update' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const updateData = ref({
  titles: [''], // Array to store multiple titles
  description: '',
  update_photo: null,
  update_file: null,
});

const isLoading = ref(false);
const showErrors = ref(false);
const photoPreview = ref(null);

// Handle photo file upload
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    updateData.value.update_photo = null;
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

  updateData.value.update_photo = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Handle general file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    updateData.value.update_file = null;
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
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid document file (PDF, Word, Excel, PowerPoint)');
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

  updateData.value.update_file = file;
}

// Remove photo preview
function removePhoto() {
  updateData.value.update_photo = null;
  photoPreview.value = null;
  const fileInput = document.getElementById('update_photo');
  if (fileInput) fileInput.value = '';
}

// Format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Add a new title input field
function addTitle() {
  updateData.value.titles.push('');
  toast.info('New title field added');
}

// Remove a title input field
function removeTitle(index) {
  if (updateData.value.titles.length > 1) {
    updateData.value.titles.splice(index, 1);
    toast.info('Title removed');
  } else {
    toast.error('At least one title is required');
  }
}

// Submit update
async function submitUpdate() {
  showErrors.value = true;

  // Validation: Ensure all titles are filled
  const emptyTitles = updateData.value.titles.filter(title => !title.trim());
  if (emptyTitles.length > 0) {
    toast.error('Please fill in all title fields or remove empty ones');
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();
    
    // Add titles
    updateData.value.titles.forEach((title, index) => {
      formData.append(`titles[${index}]`, title.trim());
    });
    
    // Add description
    formData.append('description', updateData.value.description);

    // Add files if present
    if (updateData.value.update_photo) {
      formData.append('update_photo', updateData.value.update_photo);
    }
    if (updateData.value.update_file) {
      formData.append('update_file', updateData.value.update_file);
    }

    const response = await axios.post('api/updates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success(response.data.message || 'Update submitted successfully');
    router.push('/tenderuser-viewupdate');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Handle error
function handleError(error) {
  let message = 'An unexpected error occurred';
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
}
</script>

<style scoped>
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

/* Loading state for button */
button:disabled {
  cursor: not-allowed;
}

/* File input hover effect */
input[type="file"] + div {
  cursor: pointer;
}

/* Group hover effect for remove button */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>