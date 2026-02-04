<template>
  <div class="py-5 edit-user" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-user-edit"></i> Edit Booking</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Booking Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Booking</h3>
          
          <!-- Loading Spinner -->
          <span v-if="isLoading" class="flex items-center gap-2 mt-4">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>

          <div v-if="!isLoading">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="userName" class="font-semibold form-label">Name</label>
                <input type="text" id="userName" class="w-full px-3 py-2 border rounded form-control" v-model="userData.name" required />
              </div>
              <div>
                <label for="userEmail" class="font-semibold form-label">Email</label>
                <input type="email" id="userEmail" class="w-full px-3 py-2 border rounded form-control" v-model="userData.email" required />
              </div>
            </div>

            <!-- New fields for phone, address, and dates -->
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="userPhone" class="font-semibold form-label">Phone</label>
                <input type="text" id="userPhone" class="w-full px-3 py-2 border rounded form-control" v-model="userData.phone" required />
              </div>
              <div>
                <label for="userAddress" class="font-semibold form-label">Address</label>
                <input type="text" id="userAddress" class="w-full px-3 py-2 border rounded form-control" v-model="userData.address" required />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="eventType" class="font-semibold form-label">Event Type</label>
                <select id="eventType" class="w-full px-3 py-2 border rounded form-control" v-model="userData.event_type" required>
                  <option value="wedding">Wedding</option>
                  <option value="graduation">Graduation</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="conference">Conference</option>
                  <option value="baby_shower">Baby Shower</option>
                  <option value="corporate_event">Corporate Event</option>
                  <option value="party">Party</option>
                </select>
              </div>
              <div>
                <label for="isConfirmed" class="font-semibold form-label">Booking Status</label>
                <select id="isConfirmed" class="w-full px-3 py-2 border rounded form-control" v-model="userData.is_confirmed" required>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="bookingFrom" class="font-semibold form-label">Booking From</label>
                <input type="date" id="bookingFrom" class="w-full px-3 py-2 border rounded form-control" v-model="userData.booking_from" required />
              </div>
              <div>
                <label for="bookingUpto" class="font-semibold form-label">Booking Upto</label>
                <input type="date" id="bookingUpto" class="w-full px-3 py-2 border rounded form-control" v-model="userData.booking_up_to" required />
              </div>
            </div>

            <div class="flex gap-4 mt-4">
              <button @click="updateBook" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">Update Booking</button>
              <span>
                <router-link to="/requests" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
  <i class="fa fa-times"></i> Cancel
</router-link>

              </span>
            </div>
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
  name: '',
  email: '',
  phone: '',
  address: '',
  event_type: 'wedding',
  booking_from: '',
  booking_up_to: '',
  is_confirmed: 'pending',
});

const venues = ref([]);
const isLoading = ref(true); // Manage loading state

onMounted(async () => {
  await fetchBookingData();
  await fetchVenues();
  isLoading.value = false; // Set loading to false once the data is fetched
});

// Fetch booking data by book_id
async function fetchBookingData() {
  try {
    const response = await axios.get(`api/bookings/${route.params.book_id}`);
    userData.value = response.data;
  } catch (error) {
    handleError(error);
  }
}

// Fetch venues for the dropdown list
async function fetchVenues() {
  try {
    const response = await axios.get('api/venues/dropdown');
    venues.value = response.data; // Assuming the API returns an array of venues
  } catch (error) {
    console.error('Error fetching venues:', error);
    toast.error('Failed to load venues');
  }
}

// Update booking data
async function updateBook() {
  isLoading.value = true; // Set loading to true during the update
  try {
    const response = await axios.put(`api/bookings/${route.params.book_id}`, userData.value);
    toast.success(response.data.message);
    router.push('/requests');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false after the update
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


  
  <style scoped>
  .edit-user {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  