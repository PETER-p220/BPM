<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <button 
            @click="closeModal" 
            class="text-gray-600 hover:text-gray-800 transition"
          >
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Create Award Letter</h1>
            <p class="text-gray-600 mt-1">Generate and upload tender award documentation</p>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <!-- Card Header -->
        <div class="bg-slate-800 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <i class="fas fa-award text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-white font-semibold text-lg">Award Letter Details</h2>
              <p class="text-slate-100 text-sm">Complete the form to create an award letter</p>
            </div>
          </div>
          <button 
            @click="closeModal" 
            class="text-white/80 hover:text-white transition"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-8">
          <form @submit.prevent="createAwardLetter" class="space-y-6">
            <!-- Tender Selection -->
            <div>
              <label for="tenderSelect" class="block text-sm font-semibold text-gray-700 mb-2">
                Select Tender <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-file-contract text-gray-400"></i>
                </div>
                <select 
                  id="tenderSelect" 
                  v-model="awardLetterData.tender_id"
                  :class="[
                    'w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-slate-50',
                    !awardLetterData.tender_id && formSubmitted ? 'border-red-300' : 'border-gray-300'
                  ]"
                  required
                >
                  <option value="" disabled>-- Select a tender --</option>
                  <option 
                    v-for="tender in tenders" 
                    :key="tender.tender_id" 
                    :value="tender.tender_id"
                  >
                    {{ tender.title }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Choose the tender for which you're creating the award letter
              </p>
            </div>

            <!-- Award Letter File Upload -->
            <div>
              <label for="awardLetterFile" class="block text-sm font-semibold text-gray-700 mb-2">
                Award Letter Document <span class="text-red-500">*</span>
              </label>
              
              <!-- File Upload Area -->
              <div 
                :class="[
                  'relative border-2 border-dashed rounded-lg p-6 transition-all',
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-slate-50',
                  !awardLetterData.awardletter_file && formSubmitted ? 'border-red-300' : ''
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
              >
                <input 
                  type="file" 
                  id="awardLetterFile" 
                  class="hidden"
                  accept="application/pdf"
                  @change="handleFileUpload"
                  ref="fileInput"
                />
                
                <!-- No file selected state -->
                <div v-if="!awardLetterData.awardletter_file" class="text-center">
                  <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-cloud-upload-alt text-blue-600 text-2xl"></i>
                  </div>
                  <p class="text-gray-700 font-medium mb-1">
                    Drop your PDF file here or 
                    <label for="awardLetterFile" class="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                      browse
                    </label>
                  </p>
                  <p class="text-sm text-gray-500">PDF files only, max 10MB</p>
                </div>

                <!-- File selected state -->
                <div v-else class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-file-pdf text-red-600 text-xl"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">{{ awardLetterData.awardletter_file.name }}</p>
                      <p class="text-sm text-gray-500">{{ formatFileSize(awardLetterData.awardletter_file.size) }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeFile"
                    class="text-red-600 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              
              <p class="mt-2 text-sm text-gray-500">
                <i class="fas fa-shield-alt mr-1"></i>
                Upload the official award letter document in PDF format
              </p>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-6"></div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="!isLoading" class="fas fa-save"></i>
                <i v-else class="fas fa-spinner fa-spin"></i>
                <span>{{ isLoading ? 'Saving...' : 'Save Award Letter' }}</span>
              </button>
              
              <router-link 
                to="/awarding-letter"
                class="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300"
              >
                <i class="fas fa-times"></i>
                <span>Cancel</span>
              </router-link>
            </div>

            <!-- Help Text -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <i class="fas fa-lightbulb text-blue-600 mt-1"></i>
              <div class="text-sm text-blue-800">
                <p class="font-medium mb-1">Tips for creating award letters:</p>
                <ul class="list-disc list-inside space-y-1 text-blue-700">
                  <li>Ensure the PDF is properly formatted and readable</li>
                  <li>Include all necessary legal and contractual information</li>
                  <li>Verify the tender selection before submission</li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Additional Information Card -->
      <div class="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fas fa-info-circle text-amber-600"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Important Information</h3>
            <div class="text-sm text-gray-600 space-y-2">
              <p>• Award letters are official documents that notify successful bidders</p>
              <p>• Ensure all information is accurate before submission</p>
              <p>• The document will be permanently stored and associated with the selected tender</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const awardLetterData = ref({
  tender_id: '',
  awardletter_file: null,
});

const tenders = ref([]);
const isLoading = ref(false);
const isDragging = ref(false);
const formSubmitted = ref(false);
const fileInput = ref(null);

// Fetch tenders on component mount
onMounted(async () => {
  await fetchTenders();
});

// Fetch tenders from API
async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  validateAndSetFile(file);
}

// Handle file drop
function handleFileDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  validateAndSetFile(file);
}

// Validate and set file
function validateAndSetFile(file) {
  if (!file) return;

  // Check file type
  if (file.type !== 'application/pdf') {
    toast.error('Please upload a PDF file only.');
    return;
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB.');
    return;
  }

  awardLetterData.value.awardletter_file = file;
  toast.success('File uploaded successfully!');
}

// Remove file
function removeFile() {
  awardLetterData.value.awardletter_file = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  toast.info('File removed');
}

// Create award letter
async function createAwardLetter() {
  formSubmitted.value = true;
  isLoading.value = true;

  // Validation
  if (!awardLetterData.value.tender_id || !awardLetterData.value.awardletter_file) {
    toast.error('Please fill in all required fields');
    isLoading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append('tender_id', awardLetterData.value.tender_id);
  formData.append('awardletter_file', awardLetterData.value.awardletter_file);

  try {
    const response = await axios.post('api/award-letter', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.status) {
      toast.success(response.data.message || 'Award letter created successfully!');
      // Small delay to show success message before navigation
      setTimeout(() => {
        router.push('/awarding-letter');
      }, 1000);
    } else {
      toast.error(response.data.message || 'Failed to create award letter');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Close modal / navigate back
function closeModal() {
  router.push('/awarding-letter');
}

// Handle errors
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data && error.response.data.message) {
    message = error.response.data.message;
    if (error.response.data.results?.award_letter?.error) {
      message += ': ' + error.response.data.results.award_letter.error;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}
</script>

<style scoped>
/* Custom select arrow */
select {
  background-image: none;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* File upload hover effect */
input[type="file"] + label:hover {
  text-decoration: underline;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>