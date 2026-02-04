<template>
    <div class="py-5 add-update" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Update</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Update Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Edit Update</h3>
            <div class="mb-4">
              <label for="updateDescription" class="font-semibold form-label">Description</label>
              <textarea
                id="updateDescription"
                class="w-full px-3 py-2 border rounded form-control"
                rows="4"
                v-model="newUpdateData.description"
              ></textarea>
            </div>
            <div class="mb-4">
              <label for="eventId" class="font-semibold form-label">Event</label>
              <select
                id="eventId"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newUpdateData.event_id"
              >
                <option value="">Select Event</option>
                <option v-for="event in events" :key="event.event_id" :value="event.event_id">
                  {{ event.event_type }}
                </option>
              </select>
            </div>
            <div class="flex gap-4 mt-4">
              <button
                @click="updateUpdate"
                class="px-4 py-2 text-white rounded hover:bg-blue-700"
                style="background-color: #154360;"
              >
                <i class="fa fa-save"></i> Save Update
                <span v-if="isLoading">
                  <i class="fa fa-spinner fa-spin"></i> Updating...
                </span>
              </button>
  
              <span>
        
                <router-link to="/admin-view/updates" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
  <i class="fa fa-times"></i> Cancel
</router-link>

              </span>
            </div>
  
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // For fetching the update_id from the URL
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const newUpdateData = ref({ description: '', event_id: '' });
const events = ref([]);
const isLoading = ref(false);
const updateId = ref(route.params.update_id);  // Get update_id from the URL

// Fetch events for the dropdown
const fetchEvents = async () => {
  try {
    const response = await axios.get('api/dropdown/events');
    events.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch update data for editing
const fetchUpdate = async () => {
  try {
    const response = await axios.get(`api/updates/${updateId.value}`);
    newUpdateData.value = response.data;  // Populate form with the update details
  } catch (error) {
    handleError(error);
  }
};

// Fetch events and update data when the component is mounted
onMounted(() => {
  fetchEvents();
  if (updateId.value) {
    fetchUpdate();
  }
});

// Update the existing update
async function updateUpdate() {
  isLoading.value = true;
  try {
    const response = await axios.put(`api/updates/${updateId.value}`, newUpdateData.value);
    toast.success('Update edited successfully');
    // Optionally, redirect or perform another action
    router.push('/admin-view/updates');  // Navigate to updates page after success
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Handle error responses
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

// Close modal or reset view
function closeModal() {
  // Logic to close the modal, if applicable
  router.push('/admin-view/updates'); // Navigate to updates page
}
</script>

  
  <style scoped>
  .edit-role {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  