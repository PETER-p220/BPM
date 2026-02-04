<template>
  <div class="py-5 add-event" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-plus"></i> Add New Event Payment</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- New Event Payment Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Add Event Payment</h3>

          <!-- Event Type Dropdown -->
          <div class="mb-4">
            <label for="eventId" class="font-semibold form-label">Event</label>
            <select id="eventId" class="w-full px-3 py-2 border rounded form-control" v-model="newEventData.event_id">
              <option value="">Select Event</option>
              <option v-for="event in events" :key="event.event_id" :value="event.event_id">
                {{ event.event_type }}
              </option>
            </select>
          </div>

          <!-- Invitee Dropdown -->
          <div class="mb-4">
            <label for="inviteeId" class="font-semibold form-label">Invitee</label>
            <select id="inviteeId" class="w-full px-3 py-2 border rounded form-control" v-model="newEventData.invitee_id">
              <option value="">Select Invitee</option>
              <option v-for="invitee in invitees" :key="invitee.invitee_id" :value="invitee.invitee_id">
                {{ invitee.name }}
              </option>
            </select>
          </div>

          <!-- Amount Input -->
          <div class="mb-4">
            <label for="amount" class="font-semibold form-label">Amount</label>
            <input
              type="number"
              id="amount"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newEventData.amount"
            />
          </div>

          <!-- Ref Number Input -->
          <div class="mb-4">
            <label for="refNumber" class="font-semibold form-label">Reference Number</label>
            <input
              type="text"
              id="refNumber"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newEventData.ref_number"
            />
          </div>

          <!-- Payment Status Dropdown -->
          <div class="mb-4">
            <label for="paymentStatus" class="font-semibold form-label">Payment Status</label>
            <select
              id="paymentStatus"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newEventData.payment_status"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="partial">Partial</option>
              <option value="total">Total</option>
            </select>
          </div>

          <!-- Payment Method Dropdown -->
          <div class="mb-4">
            <label for="paymentMethod" class="font-semibold form-label">Payment Method</label>
            <select
              id="paymentMethod"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newEventData.payment_methods"
            >
              <option value="credit">Credit</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div class="flex gap-4 mt-4">
            <button
              @click="addEventPayment"
              class="px-4 py-2 text-white rounded hover:bg-blue-700"
              style="background-color: #154360;"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
              <span v-else>
                <i class="fa fa-plus"></i> Add Payment
              </span>
            </button>
            <span>
              <button
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                <a href="user/payments"><i class="fa fa-times"></i> Cancel</a>
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
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(false); // Manage loading state

const newEventData = ref({
  event_id: '',
  invitee_id: '',
  amount: '',
  ref_number: '',
  payment_status: 'pending',
  payment_methods: 'credit'  // Default to 'credit' payment method
});

const events = ref([]);
const invitees = ref([]);

// Fetch events for dropdown
const fetchEvents = async () => {
  try {
    const response = await axios.get('api/dropdown/events');
    events.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch invitees for the selected event
const fetchInvitees = async () => {
  try {
    const response = await axios.get('api/dropdown/invitees');  // Fetch invitees from backend
    invitees.value = response.data;  // Store the fetched invitees in a reactive variable
  } catch (error) {
    handleError(error);
  }
};

// Watch for changes in selected event to fetch invitees
watch(
  () => newEventData.value.event_id,
  (newEventId) => {
    if (newEventId) {
      fetchInvitees(newEventId);
    } else {
      invitees.value = [];
    }
  }
);

// Add event payment function
async function addEventPayment() {
  isLoading.value = true; // Start loading
  try {
    const response = await axios.post('api/event/payments', newEventData.value);
    toast.success('Event payment added successfully');
    newEventData.value = {
      event_id: '',
      invitee_id: '',
      amount: '',
      ref_number: '',
      payment_status: 'pending',
      payment_methods: 'credit'
    };
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Stop loading
  }
}

// Error handling function
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

// Fetch events when the component is mounted
onMounted(() => {
  fetchEvents();
});
</script>


<style scoped>
.add-event {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>
