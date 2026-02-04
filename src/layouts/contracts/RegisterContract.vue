<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="container px-4 mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Create New Contract</h1>
        <p class="mt-2 text-sm text-gray-600">Fill in the details below to create a new contract</p>
      </div>

      <!-- Main Card -->
      <div class="overflow-hidden bg-white shadow-sm rounded-lg">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200" style="background-color: #283747;">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="text-white fa fa-file-contract"></i>
              <h2 class="text-lg font-semibold text-white">Contract Information</h2>
            </div>
            <router-link 
              to="/contracts" 
              class="text-white transition-colors hover:text-gray-200"
              aria-label="Close"
            >
              <i class="fa fa-times"></i>
            </router-link>
          </div>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="storeContract" class="p-6">
          <!-- Contract Title -->
          <div class="mb-6">
            <label for="title" class="block mb-2 text-sm font-medium text-gray-700">
              Contract Title <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="title" 
              v-model="contractData.title"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter contract title"
              required
            />
          </div>

          <!-- Timeline & Dates Row -->
          <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <label for="timeLineCategory" class="block mb-2 text-sm font-medium text-gray-700">
                Timeline Category <span class="text-red-500">*</span>
              </label>
              <select 
                id="timeLineCategory" 
                v-model="contractData.time_line_category"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled>Select timeline</option>
                <option value="short-term">Short-term</option>
                <option value="long-term">Long-term</option>
              </select>
            </div>

            <div>
              <label for="startDate" class="block mb-2 text-sm font-medium text-gray-700">
                Start Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="startDate" 
                v-model="contractData.start_date"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label for="endDate" class="block mb-2 text-sm font-medium text-gray-700">
                End Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="endDate" 
                v-model="contractData.end_date"
                :min="contractData.start_date"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <!-- Status & Performance Guarantee Row -->
          <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <label for="status" class="block mb-2 text-sm font-medium text-gray-700">
                Status <span class="text-red-500">*</span>
              </label>
              <select 
                id="status" 
                v-model="contractData.status"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="on-progress">On Progress</option>
                <option value="cancelled">Cancelled</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            <div>
              <label for="performanceGuarantee" class="block mb-2 text-sm font-medium text-gray-700">
                Performance Guarantee
              </label>
              <input 
                type="text" 
                id="performanceGuarantee" 
                v-model="contractData.performance_guarantee"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., 10% of contract value"
              />
            </div>
          </div>

          <!-- File Upload -->
          <div class="mb-6">
            <label for="pdfFile" class="block mb-2 text-sm font-medium text-gray-700">
              Contract Document (PDF) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input 
                type="file" 
                id="pdfFile" 
                @change="handleFileUpload('pdf_file', $event)"
                accept=".pdf"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Upload the signed contract document in PDF format (Max 10MB)</p>
            <div v-if="uploadedFileName" class="flex items-center gap-2 mt-2 text-sm text-green-600">
              <i class="fa fa-check-circle"></i>
              <span>{{ uploadedFileName }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
            <router-link 
              to="/contracts" 
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <i class="fa fa-times"></i>
              Cancel
            </router-link>
            
            <button 
              type="submit"
              :disabled="isLoading"
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #283747;"
              :class="{ 'hover:opacity-90': !isLoading }"
            >
              <i v-if="!isLoading" class="fa fa-save"></i>
              <i v-else class="fa fa-spinner fa-spin"></i>
              {{ isLoading ? 'Saving...' : 'Save Contract' }}
            </button>
          </div>
        </form>
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

const contractData = ref({
  title: '',
  time_line_category: '',
  start_date: '',
  end_date: '',
  status: 'on-progress',
  performance_guarantee: '',
  pdf_file: null,
});

const isLoading = ref(false);
const uploadedFileName = ref('');

function handleFileUpload(fileKey, event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error('File size exceeds 10MB limit. Please upload a smaller file.');
      event.target.value = ''; // Reset input
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      event.target.value = ''; // Reset input
      return;
    }

    contractData.value[fileKey] = file;
    uploadedFileName.value = file.name;
  }
}

async function storeContract() {
  // Additional validation
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();
    Object.keys(contractData.value).forEach(key => {
      if (contractData.value[key] !== null && contractData.value[key] !== '') {
        formData.append(key, contractData.value[key]);
      }
    });

    const response = await axios.post('api/contracts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success(response.data.message || 'Contract created successfully!');
    router.push('/contracts');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function validateForm() {
  // Check required fields
  if (!contractData.value.title?.trim()) {
    toast.error('Please enter a contract title.');
    return false;
  }

  if (!contractData.value.time_line_category) {
    toast.error('Please select a timeline category.');
    return false;
  }

  if (!contractData.value.start_date) {
    toast.error('Please select a start date.');
    return false;
  }

  if (!contractData.value.end_date) {
    toast.error('Please select an end date.');
    return false;
  }

  // Validate date range
  if (new Date(contractData.value.end_date) < new Date(contractData.value.start_date)) {
    toast.error('End date must be after start date.');
    return false;
  }

  if (!contractData.value.pdf_file) {
    toast.error('Please upload a contract PDF file.');
    return false;
  }

  return true;
}

function handleError(error) {
  let message = 'An unexpected error occurred. Please try again.';
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.data?.errors) {
    // Handle validation errors from backend
    const errors = error.response.data.errors;
    message = Object.values(errors).flat().join(' ');
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }

  toast.error(message);
  console.error('Contract creation error:', error);
}
</script>

<style scoped>
/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
input, select, button {
  transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus, select:focus {
  outline: none;
}
</style>