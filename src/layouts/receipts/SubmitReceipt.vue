<template>
    <div class="py-5 add-receipt" style="font-family: 'cygre', serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-plus"></i> Submit Receipt</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Receipt Submission Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
  
            <!-- Accountant Selection -->
            <div class="row">
              <div class="col-sm-6">
                <label for="accountantSelect" class="form-label">Select Accountant</label>
                <select id="accountantSelect" class="w-full px-3 py-2 border rounded form-control" v-model="receiptData.accountant_id">
                  <option v-for="accountant in accountants" :key="accountant.user_id" :value="accountant.user_id">{{ accountant.name }}</option>
                </select>
              </div>
            </div>
  
            <!-- Description and File Upload -->
            <div class="mt-4 row">
                <div class="col-sm-6">
                <label for="receiptFile" class=" form-label">Upload Receipt (Image)</label>
                <input type="file" id="receiptFile" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
              </div>
              <div class="col-sm-6">
                <label for="description" class=" form-label">Description</label>
                <textarea id="description" class="w-full px-3 py-2 border rounded form-control" v-model="receiptData.description"></textarea>
              </div>
        
            </div>
  
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="submitReceipt" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
                <i class="fa fa-upload"></i> Save changes
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/my/receipt" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  const receiptData = ref({
    accountant_id: '',
    description: '',
    receipt_file: null,
  });
  const accountants = ref([]);
  const isLoading = ref(false);
  
  // Fetch accountants on component mount
  onMounted(async () => {
    await fetchAccountants();
  });
  
  // Fetch accountants from API
  async function fetchAccountants() {
    try {
      const response = await axios.get('api/dropdown/accountants'); // Assuming "engineers" are accountants
      accountants.value = response.data.users;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Handle file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      receiptData.value.receipt_file = file;
    } else {
      toast.error('Please upload a valid image file (JPG, PNG, GIF).');
    }
  }
  
  // Submit receipt
  async function submitReceipt() {
    isLoading.value = true;
  
    // Validation
    if (!receiptData.value.accountant_id || !receiptData.value.receipt_file) {
      toast.error('Please fill in all required fields.');
      isLoading.value = false;
      return;
    }
  
    const formData = new FormData();
    formData.append('accountant_id', receiptData.value.accountant_id);
    formData.append('receipt_file', receiptData.value.receipt_file);
    formData.append('description', receiptData.value.description);
  
    try {
      const response = await axios.post('api/receipts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      router.push('/my/receipt');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Handle errors
  function handleError(error) {
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
    toast.error(message);
  }
  </script>
  