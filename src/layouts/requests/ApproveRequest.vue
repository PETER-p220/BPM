<template>
  <div class="py-5 edit-assignment" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-edit"></i> Approve/Reject Project Request</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Project Request Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>

          <!-- Item Field -->
          <div class="mt-4">
            <label for="item" class=" form-label">Item</label>
            <input type="text" id="item" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.item" disabled />
          </div>

          <!-- Amount Field -->
          <div class="mt-4">
            <label for="amount" class="form-label">Amount</label>
            <input type="number" id="amount" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.amount_requested" disabled />
          </div>

          <!-- Vendor Field -->
          <div class="mt-4">
            <label for="vender" class=" form-label">Vendor</label>
            <input type="text" id="vender" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.vender" disabled />
          </div>

          <!-- Vendor Account Number Field -->
          <div class="mt-4">
            <label for="vendor_account_number" class=" form-label">Vendor Account Number</label>
            <input type="text" id="vendor_account_number" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.vendor_account_number" disabled />
          </div>

          <!-- Vendor Account Name Field -->
          <div class="mt-4">
            <label for="vender_account_name" class=" form-label">Vendor Account Name</label>
            <input type="text" id="vender_account_name" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.vender_account_name" disabled />
          </div>

          <!-- Approval Status Field -->
          <div class="mt-4">
            <label for="is_approved" class=" form-label">Select to approve</label>
            <select id="is_approved" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.is_approved" :disabled="isApprovedDisabled">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4 mt-4">
            <button @click="updateRequest" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
              Save changes
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/approve/all/requests" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const requestData = ref({
  item: '',
  amount_requested: '',
  vender: '',
  vendor_account_number: '',
  vender_account_name: '',
  is_approved: 'pending',
});

const isApprovedDisabled = ref(false);
const isLoading = ref(false);

onMounted(async () => {
  await fetchRequestData();
});

async function fetchRequestData() {
  try {
    const response = await axios.get(`api/requests-for-projects/${route.params.request_id}`);
    const data = response.data.data;

    requestData.value = {
      item: JSON.parse(data.item).join(', '), // Parse and join the item array
      amount_requested: data.amount_requested,
      vender: data.vender,
      vendor_account_number: data.vendor_account_number,
      vender_account_name: data.vender_account_name,
      is_approved: data.is_approved,
    };

    // Disable the approval status field if the request is already approved or rejected
    isApprovedDisabled.value = data.is_approved !== 'pending';
  } catch (error) {
    handleError(error);
  }
}

async function updateRequest() {
  isLoading.value = true;
  try {
    const response = await axios.put(`api/requests-for-projects/${route.params.request_id}`, requestData.value);
    toast.success(response.data.message);
    router.push('/approve/all/requests');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

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

