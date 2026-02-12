<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="closeModal"
          class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to Requests
        </button>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Gradient Header -->
          <div class="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-shopping-cart text-white text-xl"></i>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-white">Create Purchase Request</h1>
                  <p class="text-slate-100 text-sm">Submit a new purchase request for approval</p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <!-- Form Body -->
          <div class="p-8">
            <form @submit.prevent="createRequestForPurchase" class="space-y-6">
              <!-- Section 1: Project & Item Selection -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  Project & Item Details
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Project Selection -->
                  <div class="form-group md:col-span-2">
                    <label for="projectSelect" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-folder text-slate-500 mr-2"></i>
                      Select Project *
                    </label>
                    <select
                      id="projectSelect"
                      v-model="requestData.project_id"
                      @change="fetchAnalysisItems"
                      required
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a project</option>
                      <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                        {{ project.project_name }}
                      </option>
                    </select>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <i class="fas fa-info-circle text-xs mr-1"></i>
                      Select the project for which you're requesting a purchase
                    </p>
                  </div>

                  <!-- Analysis Item Selection -->
                  <div class="form-group md:col-span-2">
                    <label for="analysisSelect" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-box text-slate-500 mr-2"></i>
                      Select Analysis Item *
                    </label>
                    <select
                      id="analysisSelect"
                      v-model="requestData.analysis_id"
                      :disabled="!requestData.project_id"
                      @change="onAnalysisSelected"
                      required
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose an analysis item</option>
                      <option v-for="analysis in analysisItems" :key="analysis.analysis_id" :value="analysis.analysis_id">
                        {{ analysis.items?.[0] || analysis.item_description || 'N/A' }}
                        (Qty: {{ analysis.quantity || 0 }}, Amount: {{ formatCurrency(analysis.amount) }})
                      </option>
                    </select>
                    <p v-if="!requestData.project_id" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <i class="fas fa-lock text-xs mr-1"></i>
                      Please select a project first
                    </p>
                  </div>

                  <!-- Available Item Info -->
                  <div v-if="selectedAnalysis" class="md:col-span-2 bg-slate-50 dark:bg-slate-900 border-l-4 border-slate-500 rounded-lg p-4">
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                      <i class="fas fa-info-circle mr-2"></i>
                      Available Resources
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-slate-700 dark:text-slate-300 mb-1">Available Quantity</p>
                        <p class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ selectedAnalysis.quantity || 0 }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-slate-700 dark:text-slate-300 mb-1">Available Amount</p>
                        <p class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(selectedAnalysis.amount) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Purchase Details -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-calculator text-green-500 mr-2"></i>
                  Purchase Details
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Quantity Purchased -->
                  <div class="form-group">
                    <label for="quantityPurchased" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-hashtag text-green-500 mr-2"></i>
                      Quantity Purchased *
                    </label>
                    <input
                      type="number"
                      id="quantityPurchased"
                      v-model="requestData.quantity_purchased"
                      :max="selectedAnalysis?.quantity || undefined"
                      min="1"
                      step="1"
                      required
                      placeholder="Enter quantity"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                    <p v-if="selectedAnalysis" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <i class="fas fa-info-circle text-xs mr-1"></i>
                      Maximum available: {{ selectedAnalysis.quantity || 0 }}
                    </p>
                    <p v-if="quantityExceedsLimit" class="mt-1 text-xs text-red-600 dark:text-red-400">
                      <i class="fas fa-exclamation-triangle text-xs mr-1"></i>
                      Quantity exceeds available limit!
                    </p>
                  </div>

                  <!-- Amount Purchased -->
                  <div class="form-group">
                    <label for="amountPurchased" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-dollar-sign text-green-500 mr-2"></i>
                      Amount Purchased *
                    </label>
                    <input
                      type="number"
                      id="amountPurchased"
                      v-model="requestData.amount_purchased"
                      :max="selectedAnalysis?.amount || undefined"
                      min="0"
                      step="0.01"
                      required
                      placeholder="Enter amount (e.g., 4000.00)"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                    <p v-if="selectedAnalysis" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <i class="fas fa-info-circle text-xs mr-1"></i>
                      Maximum available: {{ formatCurrency(selectedAnalysis.amount) }}
                    </p>
                    <p v-if="amountExceedsLimit" class="mt-1 text-xs text-red-600 dark:text-red-400">
                      <i class="fas fa-exclamation-triangle text-xs mr-1"></i>
                      Amount exceeds available budget!
                    </p>
                  </div>
                </div>
              </div>

              <!-- Section 3: Vendor Information -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-store text-purple-500 mr-2"></i>
                  Vendor Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Vendor Name -->
                  <div class="form-group md:col-span-2">
                    <label for="vendorName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-building text-purple-500 mr-2"></i>
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      id="vendorName"
                      v-model="requestData.VendorName"
                      required
                      placeholder="Enter vendor/supplier name"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <!-- Vendor Account Number -->
                  <div class="form-group">
                    <label for="vendorAccountNumber" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-university text-purple-500 mr-2"></i>
                      Account Number *
                    </label>
                    <input
                      type="text"
                      id="vendorAccountNumber"
                      v-model="requestData.VendorAccountNumber"
                      required
                      placeholder="Enter vendor account number"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <!-- Vendor Contact -->
                  <div class="form-group">
                    <label for="vendorContact" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i class="fas fa-phone text-purple-500 mr-2"></i>
                      Contact Information *
                    </label>
                    <input
                      type="text"
                      id="vendorContact"
                      v-model="requestData.VendorContact"
                      required
                      placeholder="Phone number or email"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Validation Summary -->
              <div v-if="validationErrors.length > 0" class="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 rounded-lg p-4">
                <div class="flex items-start">
                  <i class="fas fa-exclamation-circle text-red-500 mt-1 mr-3"></i>
                  <div>
                    <h4 class="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">Please fix the following errors:</h4>
                    <ul class="list-disc list-inside text-sm text-red-700 dark:text-red-200 space-y-1">
                      <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                  All fields marked with * are required
                </p>
                <div class="flex gap-3 w-full sm:w-auto">
                  <router-link
                    to="/user/requests"
                    class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 font-medium transition-all shadow-sm"
                  >
                    <i class="fas fa-times mr-2"></i>
                    Cancel
                  </router-link>
                  <button
                    type="submit"
                    :disabled="isLoading || !isFormValid"
                    class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i v-if="!isLoading" class="fas fa-paper-plane mr-2"></i>
                    <i v-else class="fas fa-spinner fa-spin mr-2"></i>
                    {{ isLoading ? 'Submitting...' : 'Submit Request' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
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

const requestData = ref({
  project_id: '',
  analysis_id: '',
  quantity_purchased: null,
  amount_purchased: null,
  VendorName: '',
  VendorAccountNumber: '',
  VendorContact: '',
});

const projects = ref([]);
const analysisItems = ref([]);
const selectedAnalysis = ref(null);
const isLoading = ref(false);

// Fetch projects on component mount
onMounted(async () => {
  await fetchProjects();
});

// Computed properties for validation
const quantityExceedsLimit = computed(() => {
  if (!selectedAnalysis.value || !requestData.value.quantity_purchased) return false;
  return requestData.value.quantity_purchased > selectedAnalysis.value.quantity;
});

const amountExceedsLimit = computed(() => {
  if (!selectedAnalysis.value || !requestData.value.amount_purchased) return false;
  return requestData.value.amount_purchased > selectedAnalysis.value.amount;
});

const validationErrors = computed(() => {
  const errors = [];
  if (quantityExceedsLimit.value) {
    errors.push('Quantity exceeds available limit');
  }
  if (amountExceedsLimit.value) {
    errors.push('Amount exceeds available budget');
  }
  return errors;
});

const isFormValid = computed(() => {
  return (
    requestData.value.project_id &&
    requestData.value.analysis_id &&
    requestData.value.quantity_purchased &&
    requestData.value.amount_purchased &&
    requestData.value.VendorName &&
    requestData.value.VendorAccountNumber &&
    requestData.value.VendorContact &&
    !quantityExceedsLimit.value &&
    !amountExceedsLimit.value
  );
});

const formProgress = computed(() => {
  let filledFields = 0;
  const totalFields = 7;
  
  if (requestData.value.project_id) filledFields++;
  if (requestData.value.analysis_id) filledFields++;
  if (requestData.value.quantity_purchased) filledFields++;
  if (requestData.value.amount_purchased) filledFields++;
  if (requestData.value.VendorName) filledFields++;
  if (requestData.value.VendorAccountNumber) filledFields++;
  if (requestData.value.VendorContact) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
});

// Format currency
function formatCurrency(amount) {
  if (!amount) return 'TZS 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Handle analysis selection
function onAnalysisSelected() {
  selectedAnalysis.value = analysisItems.value.find(
    item => item.analysis_id === requestData.value.analysis_id
  ) || null;
}

// Fetch projects from API
async function fetchProjects() {
  try {
    const response = await axios.get('/api/dropdown/projects');
    if (response.data.status && Array.isArray(response.data.data)) {
      projects.value = response.data.data;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  }
}

// Fetch analysis items based on selected project
async function fetchAnalysisItems() {
  analysisItems.value = [];
  requestData.value.analysis_id = '';
  selectedAnalysis.value = null;
  
  if (!requestData.value.project_id) return;

  try {
    const response = await axios.get('/api/items-dropdown', {
      params: { project_id: requestData.value.project_id },
    });
    if (response.data.status === 200) {
      analysisItems.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch analysis items');
    }
  } catch (error) {
    handleError(error);
  }
}

// Create request for purchase
async function createRequestForPurchase() {
  // Final validation
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields correctly.');
    return;
  }

  isLoading.value = true;

  const payload = {
    project_id: requestData.value.project_id,
    analysis_id: requestData.value.analysis_id,
    quantity_purchased: requestData.value.quantity_purchased,
    amount_purchased: requestData.value.amount_purchased,
    VendorName: requestData.value.VendorName.trim(),
    VendorAccountNumber: requestData.value.VendorAccountNumber.trim(),
    VendorContact: requestData.value.VendorContact.trim(),
  };

  try {
    const response = await axios.post('/api/request-for-purchase', payload);

    if (response.data.status) {
      toast.success(response.data.message || 'Purchase request created successfully!');
      
      // Delay navigation to show success message
      setTimeout(() => {
        router.push('/user/requests');
      }, 1000);
    } else {
      toast.error(response.data.message || 'Failed to create purchase request');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Handle errors
function handleError(error) {
  let message = 'An unexpected error occurred.';
  if (error.response) {
    if (error.response.status === 400 && error.response.data.errors) {
      message = Object.values(error.response.data.errors).flat().join(' ');
    } else if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
      if (error.response.data.results?.request_for_purchase?.error) {
        message += ': ' + error.response.data.results.request_for_purchase.error;
      }
    } else if (error.response.status === 500) {
      message = error.response.data.message || 'Server error occurred.';
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Close modal
function closeModal() {
  router.push('/user/requests');
}
</script>

<style scoped>
/* Smooth transitions */
.form-group input,
.form-group select {
  transition: all 0.2s ease-in-out;
}

.form-group input:focus,
.form-group select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

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
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animation for progress bar */
@keyframes progress {
  from {
    width: 0%;
  }
}
</style>