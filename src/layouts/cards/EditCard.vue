<template>
  <div class="py-5 add-card" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-plus"></i> {{ cardId ? 'Edit Card' : 'Add New Card' }}</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- New Card Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">{{ cardId ? 'Edit Card' : 'Add New Card' }}</h3>

          <!-- Form Fields -->
          <div class="mb-4">
            <label for="card_type" class="font-semibold form-label">Title for card</label>
            <input type="text" id="card_type" class="w-full px-3 py-2 border rounded form-control" v-model="newCardData.card_type" />
          </div>
          <div class="mb-4">
            <label for="quantity" class="font-semibold form-label">Quantity</label>
            <input type="number" id="quantity" class="w-full px-3 py-2 border rounded form-control" v-model="newCardData.quantity" />
          </div>

          <div class="mb-4">
            <label for="order_id" class="font-semibold form-label">Client/Customer</label>
            <select id="order_id" class="w-full px-3 py-2 border rounded form-control" v-model="newCardData.order_id">
              <option value="">Select Order</option>
              <option v-for="order in orders" :key="order.order_id" :value="order.order_id">
                {{ order.full_name }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="agent_id" class="font-semibold form-label">Agent</label>
            <select id="agent_id" class="w-full px-3 py-2 border rounded form-control" v-model="newCardData.agent_id">
              <option value="">Select Agent</option>
              <option v-for="agent in agents" :key="agent.agent_id" :value="agent.agent_id">
                {{ agent.full_name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="amount" class="font-semibold form-label">Amount</label>
            <input type="number" id="amount" class="w-full px-3 py-2 border rounded form-control" v-model="newCardData.amount" placeholder="0.00" />
          </div>
          <div class="mb-4">
            <label for="status" class="font-semibold form-label">Status</label>
            <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="newCardData.status">
              <option value="pending">Pending</option>
              <option value="created">Created</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="submitCard" :disabled="isLoading" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
              <i class="fa fa-plus"></i> {{ cardId ? 'Update Card' : 'Add Card' }}
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/cards"><i class="fa fa-times"></i> Cancel</a>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const orders = ref([]);
const agents = ref([]);
const newCardData = ref({
  card_type: '',
  quantity: null,
  order_id: '',
  agent_id: '',
  amount: null,
  status: 'pending',
});
const isLoading = ref(false);
const cardId = ref(route.params.card_id || null); // Get card ID from route params

// Fetch orders for dropdown
const fetchOrders = async () => {
  try {
    const response = await axios.get('api/dropdown/orders');
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      orders.value = response.data.data;
    } else {
      toast.error('Failed to load orders.');
    }
  } catch (error) {
    handleError(error);
  }
};

// Fetch agents for dropdown
const fetchAgents = async () => {
  try {
    const response = await axios.get('api/agents/dropdown');
    if (response.data.status === 'success') {
      agents.value = response.data.data;
    } else {
      toast.error('Failed to load agents.');
    }
  } catch (error) {
    handleError(error);
  }
};

// Fetch card data for editing
const fetchCardData = async () => {
  if (cardId.value) {
    try {
      const response = await axios.get(`api/cards/${cardId.value}`);
      if (response.data.status === 'success') {
        newCardData.value = response.data.data; // Populate form fields
      } else {
        toast.error('Failed to load card data.');
      }
    } catch (error) {
      handleError(error);
    }
  }
};

// Update or Add card
const submitCard = async () => {
  isLoading.value = true;
  try {
    const apiUrl = cardId.value ? `api/cards/${cardId.value}` : 'api/cards';
    const method = cardId.value ? 'put' : 'post';
    const response = await axios[method](apiUrl, newCardData.value);
    
    if (response.data.status === 'success') {
      toast.success(`${cardId.value ? 'Card updated' : 'Card added'} successfully`);
      newCardData.value = {
        card_type: '',
        quantity: null,
        order_id: '',
        agent_id: '',
        amount: null,
        status: 'pending',
      };
      if (!cardId.value) router.push('/cards'); // Redirect if adding a new card
    } else {
      toast.error('Failed to submit card.');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

// Handle errors
const handleError = (error) => {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data && error.response.data.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
};

// Fetch data when component is mounted
onMounted(() => {
  fetchOrders();
  fetchAgents();
  fetchCardData();
});
</script>
