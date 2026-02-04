<template>
  <div class="py-5 add-venue" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-plus"></i> Add New Venue</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>
  
        <!-- New Venue Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Add New Venue</h3>
          
          <!-- Form fields -->
          <div class="mb-4">
            <label for="venueName" class="font-semibold form-label">Venue Name</label>
            <input
              type="text"
              id="venueName"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newVenueData.venue_name"
            />
          </div>
          <div class="mb-4">
            <label for="supervisor" class="font-semibold form-label">Supervisor</label>
            <input
              type="text"
              id="supervisor"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newVenueData.supervisor"
            />
          </div>
          <div class="mb-4">
            <label for="location" class="font-semibold form-label">Location/Physical Address</label>
            <input
              type="text"
              id="location"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newVenueData.location"
            />
          </div>
          <div class="mb-4">
            <label for="seats" class="font-semibold form-label">Seats (Optional)</label>
            <input
              type="number"
              id="seats"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newVenueData.seats"
            />
          </div>
          <div class="mb-4">
            <label for="isAvailable" class="font-semibold form-label">Availability</label>
            <select
              id="isAvailable"
              class="w-full px-3 py-2 border rounded form-control"
              v-model="newVenueData.is_available"
            >
              <option value="pending">Pending</option>
              <option value="available">Available</option>
              <option value="on-use">On Use</option>
            </select>
          </div>
  
          <div class="flex gap-4 mt-4">
            <button
              @click="addVenue"
              class="px-4 py-2 text-white rounded hover:bg-blue-700"
              style="background-color: #154360;"
              :disabled="isLoading"
            >
              <i class="fa fa-plus"></i> Add Venue
              <!-- Loading Spinner -->
          <span v-if="isLoading" class="flex items-center gap-2 mt-4">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>
            </button>
            <span>
              <button 
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                <a href="/venues"><i class="fa fa-times"></i> Cancel</a>
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
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(false); // Loading state
const newVenueData = ref({
  venue_name: '',
  supervisor: '',
  location: '',
  seats: null,
  is_available: 'pending',
});

// Add new venue function
async function addVenue() {
  isLoading.value = true; // Set loading to true before the request
  try {
    const response = await axios.post('api/venues', newVenueData.value);
    toast.success('Venue added successfully');
    // Clear the form after a successful addition
    newVenueData.value = { venue_name: '', supervisor: '', location: '', seats: null, is_available: 'pending' };
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false after the request
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
  .add-venue {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  