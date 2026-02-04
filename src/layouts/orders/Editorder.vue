<template>
  <div class="py-5 edit-user" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-user-edit"></i> Edit Order</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Order Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Order</h3>
          
          <!-- Loading Spinner -->
          <span v-if="isLoading" class="flex items-center gap-2 mt-4">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2" v-if="!isLoading">
            <div>
              <label for="userName" class="font-semibold form-label">Name</label>
              <input type="text" id="userName" class="w-full px-3 py-2 border rounded form-control" v-model="userData.full_name" required />
            </div>
            <div>
              <label for="userEmail" class="font-semibold form-label">Email</label>
              <input type="email" id="userEmail" class="w-full px-3 py-2 border rounded form-control" v-model="userData.email" required />
            </div>
          </div>

          <!-- New fields for phone, address, and event details -->
          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2" v-if="!isLoading">
            <div>
              <label for="userPhone" class="font-semibold form-label">Phone</label>
              <input type="text" id="userPhone" class="w-full px-3 py-2 border rounded form-control" v-model="userData.phone_number" required />
            </div>
            <div>
              <label for="userAddress" class="font-semibold form-label">Address</label>
              <input type="text" id="userAddress" class="w-full px-3 py-2 border rounded form-control" v-model="userData.address" required />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2" v-if="!isLoading">
            <div>
              <label for="eventType" class="font-semibold form-label">Event Name</label>
              <input type="text" id="eventType" class="w-full px-3 py-2 border rounded form-control" v-model="userData.card_type" required />
            </div>

            <div>
              <label for="isRecieved" class="font-semibold form-label">Confirmation Status</label>
              <select id="isRecieved" class="w-full px-3 py-2 border rounded form-control" v-model="userData.is_confirmed" required>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2" v-if="!isLoading">
            <div>
              <label for="isComplete" class="font-semibold form-label">Completion Status</label>
              <select id="isComplete" class="w-full px-3 py-2 border rounded form-control" v-model="userData.is_complete" required>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label for="agentId" class="font-semibold form-label">Select Agent</label>
              <select id="agentId" class="w-full px-3 py-2 border rounded form-control" v-model="userData.agent_id" required>
                <option v-for="agent in agents" :key="agent.agent_id" :value="agent.agent_id">{{ agent.full_name }}</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4 mt-4" v-if="!isLoading">
            <button @click="updateOrder" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">Update Order</button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/orders"><i class="fa fa-times"></i> Cancel</a>
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

const userData = ref({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  card_type: '',
  is_confirmed: 'pending',
  is_complete: 'pending',
  agent_id: '',
});

const agents = ref([]);
const isLoading = ref(false); // Loading state

onMounted(async () => {
  await fetchOrderData();
  await fetchAgents();  // Fetch agent data
});

// Fetch order data by order_id
async function fetchOrderData() {
  isLoading.value = true; // Start loading
  try {
    const response = await axios.get(`api/orders/${route.params.order_id}`);
    if (response.data && response.data.data) {
      userData.value = { ...response.data.data }; // Ensure data is assigned correctly
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // End loading
  }
}

// Fetch agent data for dropdown
async function fetchAgents() {
  isLoading.value = true; // Start loading
  try {
    const response = await axios.get('api/agents/dropdown');
    agents.value = response.data.data || [];
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // End loading
  }
}

// Update order data
async function updateOrder() {
  isLoading.value = true; // Start loading
  try {
    const response = await axios.put(`api/orders/${route.params.order_id}`, userData.value);
    toast.success(response.data.message);
    router.push('/orders'); // Navigate back to orders list
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

  