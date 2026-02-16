<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif">
    <div class="container px-4 mx-auto max-w-4xl">
      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <button 
            @click="closeModal" 
            class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-200"
            title="Go back"
          >
            <i class="fa fa-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Create Insurance Bond</h1>
            <p class="text-sm text-gray-600 mt-1">Upload and manage insurance bond documentation</p>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Form Content -->
        <div class="p-8">
          <form @submit.prevent="createInsuranceBond">
            <!-- Tender Selection Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">1</span>
                Tender Information
              </h2>
              
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label for="tenderSelect" class="block text-sm font-medium text-gray-700 mb-2">
                    Select Tender <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select 
                      id="tenderSelect" 
                      v-model="insuranceBondData.tender_id"
                      class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      :class="{'border-red-300 focus:ring-red-500': showErrors && !insuranceBondData.tender_id}"
                      required
                    >
                      <option value="" disabled>Choose a tender from the list</option>
                      <option 
                        v-for="tender in tenders" 
                        :key="tender.tender_id" 
                        :value="tender.tender_id"
                      >
                        {{ tender.title }}
                      </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <i class="fa fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  <p v-if="showErrors && !insuranceBondData.tender_id" class="mt-1 text-sm text-red-600">
                    Please select a tender
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Document Upload Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">2</span>
                Document Upload
              </h2>
              
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label for="insuranceFile" class="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Bond Document <span class="text-red-500">*</span>
                  </label>
                  <div 
                    class="relative border-2 border-dashed rounded-lg p-6 transition-all"
                    :class="[
                      insuranceBondData.insurance_file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400',
                      showErrors && !insuranceBondData.insurance_file ? 'border-red-300 bg-red-50' : ''
                    ]"
                  >
                    <input 
                      type="file" 
                      id="insuranceFile" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handleFileUpload"
                      accept=".pdf"
                      required
                    />
                    <div class="text-center">
                      <div class="mb-3">
                        <i 
                          class="text-4xl"
                          :class="insuranceBondData.insurance_file ? 'fa fa-check-circle text-green-500' : 'fa fa-cloud-upload text-gray-400'"
                        ></i>
                      </div>
                      <div v-if="!insuranceBondData.insurance_file">
                        <p class="text-sm font-medium text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p class="text-xs text-gray-500">
                          PDF files only (Max 10MB)
                        </p>
                      </div>
                      <div v-else>
                        <p class="text-sm font-medium text-green-700 mb-1">
                          <i class="fa fa-file-pdf mr-1"></i> {{ insuranceBondData.insurance_file.name }}
                        </p>
                        <p class="text-xs text-green-600">
                          {{ formatFileSize(insuranceBondData.insurance_file.size) }} • Click to replace
                        </p>
                      </div>
                    </div>
                  </div>
                  <p v-if="showErrors && !insuranceBondData.insurance_file" class="mt-1 text-sm text-red-600">
                    Please upload an insurance bond document
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Notification Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">3</span>
                Notification Settings
              </h2>
              
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label for="receiverEmail" class="block text-sm font-medium text-gray-700 mb-2">
                    Receiver Email
                    <span class="text-gray-500 font-normal ml-1">(Optional)</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <i class="fa fa-envelope text-gray-400"></i>
                    </div>
                    <input 
                      type="email" 
                      id="receiverEmail" 
                      v-model="insuranceBondData.receiver_email"
                      class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      :class="{'border-red-300 focus:ring-red-500': emailError}"
                      placeholder="example@company.com"
                    />
                  </div>
                  <p v-if="emailError" class="mt-1 text-sm text-red-600">
                    Please enter a valid email address
                  </p>
                  <p v-else class="mt-1 text-xs text-gray-500">
                    An email notification will be sent to this address upon successful creation
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
              <router-link 
                to="/insurance-bond" 
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
                <i :class="isLoading ? 'fa fa-spinner fa-spin' : 'fa fa-check'"></i>
                <span>{{ isLoading ? 'Creating...' : 'Create Insurance Bond' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const insuranceBondData = ref({
  tender_id: '',
  insurance_file: null,
  receiver_email: '',
});

const tenders = ref([]);
const isLoading = ref(false);
const showErrors = ref(false);

// Computed property for email validation
const emailError = computed(() => {
  if (!insuranceBondData.value.receiver_email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(insuranceBondData.value.receiver_email);
});

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
    handleError(error, 'Failed to load tenders');
  }
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    insuranceBondData.value.insurance_file = null;
    return;
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    toast.error('Please upload a PDF file only');
    event.target.value = '';
    return;
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB');
    event.target.value = '';
    return;
  }

  insuranceBondData.value.insurance_file = file;
  showErrors.value = false;
}

// Format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Create insurance bond
async function createInsuranceBond() {
  showErrors.value = true;

  // Validation
  if (!insuranceBondData.value.tender_id || !insuranceBondData.value.insurance_file) {
    toast.error('Please fill in all required fields');
    return;
  }

  // Validate receiver_email if provided
  if (insuranceBondData.value.receiver_email && emailError.value) {
    toast.error('Please enter a valid receiver email');
    return;
  }

  isLoading.value = true;

  const formData = new FormData();
  formData.append('tender_id', insuranceBondData.value.tender_id);
  formData.append('insurance_file', insuranceBondData.value.insurance_file);
  if (insuranceBondData.value.receiver_email) {
    formData.append('receiver_email', insuranceBondData.value.receiver_email);
  }

  try {
    const response = await axios.post('api/insurance-bond', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.status) {
      toast.success(response.data.message || 'Insurance bond created successfully');
      router.push('/insurance-bond');
    } else {
      toast.error(response.data.message || 'Failed to create insurance bond');
    }
  } catch (error) {
    handleError(error, 'Failed to create insurance bond');
  } finally {
    isLoading.value = false;
  }
}

// Handle errors with context
function handleError(error, defaultMessage = 'An unexpected error occurred') {
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
    if (error.response.data.results?.insurance_bond?.error) {
      message += ': ' + error.response.data.results.insurance_bond.error;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
}

// Close modal/navigate back
function closeModal() {
  router.push('/insurance-bond');
}
</script>

<style scoped>
/* Custom scrollbar for select dropdown */
select {
  background-image: none;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus,
select:focus {
  outline: none;
}

/* Loading state for button */
button:disabled {
  cursor: not-allowed;
}
</style>