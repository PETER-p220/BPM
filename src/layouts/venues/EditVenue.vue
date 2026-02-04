<template>
  <div class="py-5 edit-venue" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-edit"></i> Edit Venue</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Venue Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Venue</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="venueName" class="font-semibold form-label">Venue Name</label>
              <input type="text" id="venueName" class="w-full px-3 py-2 border rounded form-control" v-model="venueData.venue_name" />
            </div>
            <div class="mt-4">
              <label for="supervisor" class="font-semibold form-label">Supervisor</label>
              <input type="text" id="supervisor" class="w-full px-3 py-2 border rounded form-control" v-model="venueData.supervisor" />
            </div>
            <div class="mt-4">
              <label for="location" class="font-semibold form-label">Location</label>
              <input type="text" id="location" class="w-full px-3 py-2 border rounded form-control" v-model="venueData.location" />
            </div>
            <div class="mt-4">
              <label for="seats" class="font-semibold form-label">Seats</label>
              <input type="number" id="seats" class="w-full px-3 py-2 border rounded form-control" v-model="venueData.seats" />
            </div>
            <div class="mt-4">
              <label for="isAvailable" class="font-semibold form-label">Availability</label>
              <select id="isAvailable" class="w-full px-3 py-2 border rounded form-control" v-model="venueData.is_available">
                <option value="pending">Pending</option>
                <option value="available">Available</option>
                <option value="on-use">On Use</option>
              </select>
            </div>
          </div>

          

          <div class="flex gap-4 mt-4">
            <button @click="updateVenue" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
              Update Venue
              <!-- Loading Spinner -->
          <span v-if="isLoading" class="flex items-center gap-2 mt-4">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>
            </button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const venueData = ref({
  venue_name: '',
  supervisor: '',
  location: '',
  seats: '',
  is_available: 'pending'
});

const isLoading = ref(false); // New loading state

onMounted(async () => {
  await fetchVenueData();
});

async function fetchVenueData() {
  try {
    isLoading.value = true; // Set loading to true before fetching data
    const response = await axios.get(`api/venues/${route.params.venue_id}`);
    venueData.value = response.data;
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false after fetching data
  }
}

async function updateVenue() {
  try {
    isLoading.value = true; // Set loading to true before making the update request
    const response = await axios.put(`api/venues/${route.params.venue_id}`, venueData.value);
    toast.success('Venue updated successfully');
    router.push('/venues');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false after updating data
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data && error.response.data.error) {
    message = error.response.data.error;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}
</script>

<style scoped>
.edit-venue {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>
