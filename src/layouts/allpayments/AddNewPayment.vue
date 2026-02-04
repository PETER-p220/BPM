<template>
  <div class="py-5 add-card" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-plus"></i> Add New Payment</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- New Payment Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Add New Payment</h3>

          <!-- Form Fields -->
          <div class="mb-4">
            <label for="client_name" class="font-semibold form-label">Client Name</label>
            <input type="text" id="client_name" class="w-full px-3 py-2 border rounded form-control" v-model="newPaymentData.client_name" />
          </div>
          
          <div class="mb-4">
            <label for="ref_number" class="font-semibold form-label">Reference Number</label>
            <input type="text" id="ref_number" class="w-full px-3 py-2 border rounded form-control" v-model="newPaymentData.ref_number" />
          </div>
          
          <div class="mb-4">
            <label for="amount" class="font-semibold form-label">Amount</label>
            <input type="number" id="amount" class="w-full px-3 py-2 border rounded form-control" v-model="newPaymentData.amount" placeholder="0.00" />
          </div>
          
          <div class="mb-4">
            <label for="payment_category" class="font-semibold form-label">Payment Category</label>
            <select id="payment_category" class="w-full px-3 py-2 border rounded form-control" v-model="newPaymentData.payment_category">
              <option value="">Select Payment Category</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="payment_status" class="font-semibold form-label">Payment Status</label>
            <select id="payment_status" class="w-full px-3 py-2 border rounded form-control" v-model="newPaymentData.payment_status">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="payment_for" class="font-semibold form-label">Payment For</label>
            <input type="text" id="payment_for" class="w-full px-3 py-2 border rounded form-control" v-model="newPaymentData.payment_for" />
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="addPayment" :disabled="isLoading" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
              <i class="fa fa-plus"></i> Add Payment
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/all-payments"><i class="fa fa-times"></i> Cancel</a>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios'; // Make sure this path is correct
import { useToast } from 'vue-toastification';

const toast = useToast();
const newPaymentData = ref({
  client_name: '',
  ref_number: '',
  amount: null,
  payment_category: '',
  payment_status: 'pending', // Default status
  payment_for: ''
});
const isLoading = ref(false);

async function addPayment() {
  isLoading.value = true;
  try {
    const response = await axios.post('api/payments', newPaymentData.value);
    if (response.status === 201) {
      toast.success('Payment added successfully');
      newPaymentData.value = {
        client_name: '',
        ref_number: '',
        amount: null,
        payment_category: '',
        payment_status: 'pending',
        payment_for: ''
      };
    } else {
      toast.error('Failed to add payment');
    }
  } catch (error) {
    toast.error('An error occurred while adding payment');
  } finally {
    isLoading.value = false;
  }
}
</script>
