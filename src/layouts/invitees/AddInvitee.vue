<template>
    <div class="py-5 add-invitee" style="font-family: 'Euclid Circular', sans-serif;">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-plus"></i> Add New Invitee</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- New Invitee Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Add New Invitee</h3>
  
            <!-- Form Fields -->
            <div class="mb-4">
              <label for="name" class="font-semibold form-label">Invitee Name</label>
              <input type="text" id="name" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.name" />
            </div>
            <div class="mb-4">
              <label for="email" class="font-semibold form-label">Email</label>
              <input type="email" id="email" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.email" />
            </div>
            <div class="mb-4">
              <label for="phone" class="font-semibold form-label">Phone</label>
              <input type="text" id="phone" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.phone" />
            </div>
            <div class="mb-4">
              <label for="eventId" class="font-semibold form-label">Event</label>
              <select id="eventId" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.event_id">
                <option value="">Select Event</option>
                <option v-for="event in events" :key="event.event_id" :value="event.event_id">
                  {{ event.event_type }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="singleAmount" class="font-semibold form-label">Single Amount</label>
              <input type="number" id="singleAmount" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.for_single_amount" placeholder=".eg 20000.00" />
            </div>
            <div class="mb-4">
              <label for="doubleAmount" class="font-semibold form-label">Double Amount</label>
              <input type="number" id="doubleAmount" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.for_double_amount" placeholder=".eg 30000.00"/>
            </div>
            <div class="mb-4">
              <label for="venue" class="font-semibold form-label">Venue</label>
              <input type="text" id="venue" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.venue" />
            </div>
            <div class="mb-4">
              <label for="eventTime" class="font-semibold form-label">Event Time</label>
              <input type="datetime-local" id="eventTime" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.event_time" />
            </div>
            <div class="mb-4">
              <label for="physicalAddress" class="font-semibold form-label">Physical Address</label>
              <input type="text" id="physicalAddress" class="w-full px-3 py-2 border rounded form-control" v-model="newInviteeData.physical_address" />
            </div>
  
            <!-- Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="addInvitee" :disabled="isLoading" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
                <i class="fa fa-plus"></i> Add Invitee
                 <!-- Loading Spinner -->
            <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
              </button>
              <span>
                <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                  <a href="my/invitees"><i class="fa fa-times"></i> Cancel</a>
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
import { useToast } from 'vue-toastification';

const toast = useToast();
const events = ref([]);
const newInviteeData = ref({
  name: '',
  email: '',
  phone: '',
  event_id: '',
  for_single_amount: null,
  for_double_amount: null,
  venue: '',
  event_time: '',
  physical_address: '',
});
const isLoading = ref(false);

// Fetch events for dropdown
const fetchEvents = async () => {
  try {
    const response = await axios.get('api/dropdown/events');
    events.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add new invitee function
async function addInvitee() {
  isLoading.value = true; // Set loading state to true
  try {
    const response = await axios.post('api/invitees', newInviteeData.value);
    toast.success('Invitee added successfully');
    // Clear the form after a successful addition
    newInviteeData.value = {
      name: '',
      email: '',
      phone: '',
      event_id: '',
      for_single_amount: null,
      for_double_amount: null,
      venue: '',
      event_time: '',
      physical_address: '',
    };
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Reset loading state
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

// Fetch events on component load
onMounted(() => {
  fetchEvents();
});
</script>

  
  <style scoped>
  .add-invitee {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  