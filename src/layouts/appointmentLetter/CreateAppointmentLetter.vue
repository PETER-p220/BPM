<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="container px-4 mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Create Appointment Letter</h1>
        <p class="mt-2 text-sm text-gray-600">Generate and assign appointment letters to engineers for specific tenders</p>
      </div>

      <!-- Main Card -->
      <div class="overflow-hidden bg-white shadow-sm rounded-lg">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200" style="background-color: #283747;">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="text-white fa fa-file-signature"></i>
              <h2 class="text-lg font-semibold text-white">Appointment Letter Details</h2>
            </div>
            <router-link 
              to="/appointment-letters" 
              class="text-white transition-colors hover:text-gray-200"
              aria-label="Close"
            >
              <i class="fa fa-times"></i>
            </router-link>
          </div>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="createAppointmentLetter" class="p-6">
          <!-- Assignment Information Section -->
          <div class="mb-6">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-users-cog text-blue-600"></i>
              Assignment Information
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Engineer Selection -->
              <div>
                <label for="engineerSelect" class="block mb-2 text-sm font-medium text-gray-700">
                  Select Engineer <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="text-gray-400 fas fa-user-tie"></i>
                  </div>
                  <select
                    id="engineerSelect"
                    v-model="appointmentLetterData.user_id"
                    class="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    :disabled="isLoading || isLoadingEngineers"
                  >
                    <option value="" disabled>Choose an engineer</option>
                    <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingEngineers"></i>
                  {{ isLoadingEngineers ? 'Loading engineers...' : `${engineers.length} engineers available` }}
                </p>
              </div>

              <!-- Tender Selection -->
              <div>
                <label for="tenderSelect" class="block mb-2 text-sm font-medium text-gray-700">
                  Select Tender <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="text-gray-400 fas fa-folder-open"></i>
                  </div>
                  <select
                    id="tenderSelect"
                    v-model="appointmentLetterData.tender_id"
                    class="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    :disabled="isLoading || isLoadingTenders"
                  >
                    <option value="" disabled>Choose a tender</option>
                    <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                      {{ tender.title }}
                    </option>
                  </select>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingTenders"></i>
                  {{ isLoadingTenders ? 'Loading tenders...' : `${tenders.length} tenders available` }}
                </p>
              </div>
            </div>
          </div>

          <!-- Document Upload Section -->
          <div class="mb-6">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-file-upload text-green-600"></i>
              Document Upload
            </h3>

            <div>
              <label for="appointmentLetterFile" class="block mb-2 text-sm font-medium text-gray-700">
                Appointment Letter Document (PDF) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="file"
                  id="appointmentLetterFile"
                  @change="handleFileUpload"
                  accept="application/pdf"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                  :disabled="isLoading"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Upload the official appointment letter in PDF format (Max 2MB)
              </p>
              
              <!-- File Preview -->
              <div v-if="uploadedFileName" class="flex items-center gap-2 p-3 mt-3 border border-green-200 rounded-lg bg-green-50">
                <i class="text-green-600 fas fa-check-circle"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-green-900">{{ uploadedFileName }}</p>
                  <p class="text-xs text-green-700">{{ formatFileSize(uploadedFileSize) }}</p>
                </div>
                <button
                  type="button"
                  @click="removeFile"
                  class="p-1 text-green-600 transition-colors hover:text-green-800"
                  :disabled="isLoading"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Assignment Preview -->
          <div class="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex items-start gap-3">
              <i class="mt-1 text-blue-600 fas fa-info-circle"></i>
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-blue-900">Assignment Preview</h4>
                <div class="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
                  <div>
                    <p class="text-xs font-medium text-blue-700">Engineer</p>
                    <p class="mt-1 text-sm text-blue-900">
                      {{ getEngineerName(appointmentLetterData.user_id) || 'Not selected' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Tender</p>
                    <p class="mt-1 text-sm text-blue-900">
                      {{ getTenderTitle(appointmentLetterData.tender_id) || 'Not selected' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Document</p>
                    <p class="mt-1 text-sm text-blue-900">
                      {{ uploadedFileName || 'No file uploaded' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
            <router-link 
              to="/appointment-letters" 
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <i class="fa fa-times"></i>
              Cancel
            </router-link>
            
            <button 
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #283747;"
              :class="{ 'hover:opacity-90': !isLoading && isFormValid }"
            >
              <i v-if="!isLoading" class="fa fa-file-signature"></i>
              <i v-else class="fa fa-spinner fa-spin"></i>
              {{ isLoading ? 'Creating...' : 'Create Appointment Letter' }}
            </button>
          </div>
        </form>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

const appointmentLetterData = ref({
  user_id: '',
  tender_id: '',
  appointment_letter_file: null,
});

const engineers = ref([]);
const tenders = ref([]);
const isLoading = ref(false);
const isLoadingEngineers = ref(false);
const isLoadingTenders = ref(false);
const uploadedFileName = ref('');
const uploadedFileSize = ref(0);

// Form validation
const isFormValid = computed(() => {
  return appointmentLetterData.value.user_id !== '' &&
         appointmentLetterData.value.tender_id !== '' &&
         appointmentLetterData.value.appointment_letter_file !== null;
});

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([fetchEngineers(), fetchTenders()]);
});

// Fetch engineers from API
async function fetchEngineers() {
  isLoadingEngineers.value = true;
  try {
    const response = await axios.get('api/dropdown/engineer');
    engineers.value = response.data.users || [];
  } catch (error) {
    handleError(error, 'Failed to load engineers');
  } finally {
    isLoadingEngineers.value = false;
  }
}

// Fetch tenders from API
async function fetchTenders() {
  isLoadingTenders.value = true;
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data || [];
  } catch (error) {
    handleError(error, 'Failed to load tenders');
  } finally {
    isLoadingTenders.value = false;
  }
}

// Get engineer name by ID
function getEngineerName(userId) {
  if (!userId) return null;
  const engineer = engineers.value.find(e => e.user_id === userId);
  return engineer ? engineer.name : null;
}

// Get tender title by ID
function getTenderTitle(tenderId) {
  if (!tenderId) return null;
  const tender = tenders.value.find(t => t.tender_id === tenderId);
  return tender ? tender.title : null;
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    toast.error('Please upload a PDF file.');
    event.target.value = '';
    return;
  }

  // Validate file size (2MB limit)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    toast.error('File size must not exceed 2MB. Please upload a smaller file.');
    event.target.value = '';
    return;
  }

  // Store file info
  appointmentLetterData.value.appointment_letter_file = file;
  uploadedFileName.value = file.name;
  uploadedFileSize.value = file.size;
  
  toast.success(`File "${file.name}" selected successfully`);
}

// Remove uploaded file
function removeFile() {
  appointmentLetterData.value.appointment_letter_file = null;
  uploadedFileName.value = '';
  uploadedFileSize.value = 0;
  
  // Reset file input
  const fileInput = document.getElementById('appointmentLetterFile');
  if (fileInput) {
    fileInput.value = '';
  }
  
  toast.info('File removed');
}

// Create appointment letter
async function createAppointmentLetter() {
  // Validate form before submission
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  // Prepare form data
  const formData = new FormData();
  formData.append('user_id', appointmentLetterData.value.user_id);
  formData.append('tender_id', appointmentLetterData.value.tender_id);
  formData.append('letter_file', appointmentLetterData.value.appointment_letter_file);

  try {
    const response = await axios.post('api/appointment-letter', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status) {
      toast.success(response.data.message || 'Appointment letter created successfully!');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/appointment-letters');
      }, 1000);
    } else {
      toast.error(response.data.message || 'Failed to create appointment letter');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function validateForm() {
  // Engineer validation
  if (!appointmentLetterData.value.user_id) {
    toast.error('Please select an engineer.');
    return false;
  }

  // Tender validation
  if (!appointmentLetterData.value.tender_id) {
    toast.error('Please select a tender.');
    return false;
  }

  // File validation
  if (!appointmentLetterData.value.appointment_letter_file) {
    toast.error('Please upload an appointment letter document.');
    return false;
  }

  return true;
}

// Handle errors
function handleError(error, defaultMessage = 'An unexpected error occurred. Please try again.') {
  let message = defaultMessage;
  
  if (error.response) {
    if (error.response.status === 400 && error.response.data.errors) {
      message = Object.values(error.response.data.errors).flat().join(' ');
    } else if (error.response.data?.message) {
      message = error.response.data.message;
      if (error.response.data.results?.appointment_letter?.error) {
        message += ': ' + error.response.data.results.appointment_letter.error;
      }
    } else if (error.response.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join(' ');
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
  console.error('Appointment letter creation error:', error);
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Smooth transitions */
input, select, button {
  transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus, select:focus {
  outline: none;
}

/* Animation for form */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: slideIn 0.3s ease-out;
}
</style>