<template>
  <div class="py-5 edit-expense" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-user-edit"></i> Edit Expense</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Expense Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Expense</h3>

          <!-- Loading Spinner -->
          <span v-if="isLoading" class="flex items-center gap-2 mt-4">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2" v-if="!isLoading">
            <div>
              <label for="item" class="font-semibold form-label">Item</label>
              <input type="text" id="item" class="w-full px-3 py-2 border rounded form-control" v-model="expenseData.item" />
            </div>
            <div>
              <label for="description" class="font-semibold form-label">Description</label>
              <input type="text" id="description" class="w-full px-3 py-2 border rounded form-control" v-model="expenseData.description" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2" v-if="!isLoading">
            <div>
              <label for="amount" class="font-semibold form-label">Amount</label>
              <input type="number" id="amount" class="w-full px-3 py-2 border rounded form-control" v-model="expenseData.amount" min="0" />
            </div>
            <div>
              <label for="status" class="font-semibold form-label">Status</label>
              <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="expenseData.status">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4 mt-4" v-if="!isLoading">
            <button @click="updateExpense" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">Update Expense</button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/expenses"><i class="fa fa-times"></i> Cancel</a>
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
import axios from '@/axios';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const expenseData = ref({
  item: '',
  description: '',
  amount: 0,
  status: 'pending', // Default status
});

const isLoading = ref(false); // Loading state

onMounted(async () => {
  await fetchExpenseData();
});

// Fetch expense data by expense_id
async function fetchExpenseData() {
  isLoading.value = true;
  try {
    const response = await axios.get(`api/expenses/${route.params.request_id}`);
    console.log(response); // Log the response to debug
    if (response.data && response.data.data) {
      expenseData.value = { ...response.data.data };
    } else {
      toast.error('Expense data is empty.');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}


// Update expense data
async function updateExpense() {
  isLoading.value = true; // Start loading
  try {
    const response = await axios.put(`api/expenses/${route.params.request_id}`, expenseData.value);
    toast.success(response.data.message);
    router.push('/expenses'); // Navigate back to expenses list
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // End loading
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

  
    