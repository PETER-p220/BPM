<template>
  <div class="py-5 add-request" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-plus"></i> Create Request for Purchase</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Request for Purchase Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>

          <!-- Project Selection -->
          <div class="row">
            <div class="col-sm-6">
              <label for="projectSelect" class="form-label">Select Project</label>
              <select
                id="projectSelect"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.project_id"
                @change="fetchAnalysisItems"
              >
                <option value="">Select a project</option>
                <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                  {{ project.project_name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Analysis Item Selection -->
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="analysisSelect" class="form-label">Select Analysis Item</label>
              <select
                id="analysisSelect"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.analysis_id"
                :disabled="!requestData.project_id"
                @change="onAnalysisSelected"
              >
                <option value="">Select an analysis item</option>
                <option v-for="analysis in analysisItems" :key="analysis.analysis_id" :value="analysis.analysis_id">
                  {{ analysis.items?.[0] || analysis.item_description || 'N/A' }}
                  (Qty: {{ analysis.quantity || 0 }}, Amount: {{ analysis.amount || 0 }})
                </option>
              </select>
              <div v-if="selectedAnalysis" class="mt-2 text-sm text-gray-600">
                <p><strong>Available Quantity:</strong> {{ selectedAnalysis.quantity || 0 }}</p>
                <p><strong>Available Amount:</strong> {{ selectedAnalysis.amount || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Quantity Purchased -->
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="quantityPurchased" class="form-label">Quantity Purchased</label>
              <input
                type="number"
                id="quantityPurchased"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.quantity_purchased"
                min="1"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <!-- Amount Purchased -->
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="amountPurchased" class="form-label">Amount Purchased</label>
              <input
                type="number"
                id="amountPurchased"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.amount_purchased"
                min="0"
                step="0.01"
                placeholder="Enter amount eg.  4000.00"
              />
            </div>
          </div>

          <!-- Vendor Details Section -->
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="vendorName" class="form-label">Vendor Name</label>
              <input
                type="text"
                id="vendorName"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.VendorName"
                placeholder="Enter vendor name"
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="vendorAccountNumber" class="form-label">Vendor Account Number</label>
              <input
                type="text"
                id="vendorAccountNumber"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.VendorAccountNumber"
                placeholder="Enter vendor account number"
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="vendorContact" class="form-label">Vendor Contact</label>
              <input
                type="text"
                id="vendorContact"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.VendorContact"
                placeholder="Enter vendor contact (e.g., phone or email)"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button
              @click="createRequestForPurchase"
              class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700"
              style="background-color: #283747;"
              :disabled="isLoading"
            >
              <i class="fa fa-plus"></i> Save Request
              <span v-if="isLoading" class="flex items-center gap-2">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link
                to="/user/requests"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                <i class="fa fa-times"></i> Cancel
              </router-link>
            </span>
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

// Handle analysis selection
function onAnalysisSelected() {
  selectedAnalysis.value = analysisItems.value.find(item => item.analysis_id === requestData.value.analysis_id) || null;
  
  // Auto-set max values based on available quantity/amount
  if (selectedAnalysis.value) {
    // Set max for quantity input
    const quantityInput = document.getElementById('quantityPurchased');
    if (quantityInput) {
      quantityInput.max = selectedAnalysis.value.quantity || 0;
    }
    
    // Set max for amount input
    const amountInput = document.getElementById('amountPurchased');
    if (amountInput) {
      amountInput.max = selectedAnalysis.value.amount || 0;
    }
  }
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
  analysisItems.value = []; // Reset analysis items
  requestData.value.analysis_id = ''; // Reset selected analysis
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
  isLoading.value = true;

  // Validation
  if (
    !requestData.value.project_id ||
    !requestData.value.analysis_id ||
    !requestData.value.quantity_purchased ||
    !requestData.value.amount_purchased ||
    !requestData.value.VendorName ||
    !requestData.value.VendorAccountNumber ||
    !requestData.value.VendorContact
  ) {
    toast.error('Please fill in all required fields.');
    isLoading.value = false;
    return;
  }

  if (requestData.value.quantity_purchased < 1) {
    toast.error('Quantity purchased must be at least 1.');
    isLoading.value = false;
    return;
  }

  if (requestData.value.amount_purchased < 0) {
    toast.error('Amount purchased cannot be negative.');
    isLoading.value = false;
    return;
  }

  if (requestData.value.VendorName.trim() === '') {
    toast.error('Vendor name cannot be empty.');
    isLoading.value = false;
    return;
  }

  if (requestData.value.VendorAccountNumber.trim() === '') {
    toast.error('Vendor account number cannot be empty.');
    isLoading.value = false;
    return;
  }

  if (requestData.value.VendorContact.trim() === '') {
    toast.error('Vendor contact cannot be empty.');
    isLoading.value = false;
    return;
  }

  const payload = {
    project_id: requestData.value.project_id,
    analysis_id: requestData.value.analysis_id,
    quantity_purchased: requestData.value.quantity_purchased,
    amount_purchased: requestData.value.amount_purchased,
    VendorName: requestData.value.VendorName,
    VendorAccountNumber: requestData.value.VendorAccountNumber,
    VendorContact: requestData.value.VendorContact,
  };

  try {
    const response = await axios.post('/api/request-for-purchase', payload);

    if (response.data.status) {
      toast.success(response.data.message);
      router.push('/user/requests');
    } else {
      toast.error(response.data.message);
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
.add-request .card {
  border-radius: 8px;
}

.card-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.form-control {
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #283747;
  outline: none;
}
</style>