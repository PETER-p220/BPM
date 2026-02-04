<template>
  <div class="py-5 edit-event" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-edit"></i> Edit Event Payment</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Event Payment Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Event Payment</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="mt-4">
              <label for="amount" class="font-semibold form-label">Amount</label>
              <input type="number" id="amount" class="w-full px-3 py-2 border rounded form-control" v-model="paymentData.amount" />
            </div>
            <div class="mt-4">
              <label for="refNumber" class="font-semibold form-label">Reference Number</label>
              <input type="text" id="refNumber" class="w-full px-3 py-2 border rounded form-control" v-model="paymentData.ref_number" />
            </div>
            <div class="mt-4">
              <label for="paymentStatus" class="font-semibold form-label">Payment Status</label>
              <select id="paymentStatus" class="w-full px-3 py-2 border rounded form-control" v-model="paymentData.payment_status">
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div class="mt-4">
              <label for="paymentMethods" class="font-semibold form-label">Payment Methods</label>
              <input type="text" id="paymentMethods" class="w-full px-3 py-2 border rounded form-control" v-model="paymentData.payment_methods" />
            </div>
          </div>

          <!-- Loading spinner -->
         

          <div class="flex gap-4 mt-4">
            
            <button @click="updatePayment" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
              Update Payment
            </button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/user/payments"><i class="fa fa-times"></i> Cancel</a>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const paymentData = ref({
  amount: '',
  ref_number: '',
  payment_status: '',
  payment_methods: ''
});

// Loading state for the spinner
const isLoading = ref(false);

onMounted(async () => {
  await fetchPaymentData();
});

// Fetch payment data when the component is mounted
async function fetchPaymentData() {
  try {
    const response = await axios.get(`api/event/payments/${route.params.pay_id}`);
    paymentData.value = response.data; // Corrected assignment
  } catch (error) {
    handleError(error);
  }
}

// Update event payment details
async function updatePayment() {
  isLoading.value = true; // Set loading to true when starting the update process
  try {
    const response = await axios.put(`api/event/payments/${route.params.pay_id}`, paymentData.value);
    toast.success('Event payment updated successfully');
    router.push('/user/payments');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false once the process is complete
  }
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response) {
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.response.statusText;
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
  .edit-event {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  