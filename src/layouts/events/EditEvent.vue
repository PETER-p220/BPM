<template>
    <div class="py-5 edit-event" style="font-family: 'Euclid Circular', sans-serif;">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Event</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Event Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Edit Event</h3>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="eventType" class="font-semibold form-label">Event Type</label>
                <input type="text" id="eventType" class="w-full px-3 py-2 border rounded form-control" v-model="eventData.event_type" />
              </div>
              <div class="mt-4">
                <label for="eventDate" class="font-semibold form-label">Event Date</label>
                <input type="date" id="eventDate" class="w-full px-3 py-2 border rounded form-control" v-model="eventData.date_for_event" />
              </div>
              <div class="mt-4">
                <label for="eventAddress" class="font-semibold form-label">Physical Address</label>
                <input type="text" id="eventAddress" class="w-full px-3 py-2 border rounded form-control" v-model="eventData.physical_address" />
              </div>
              <div class="mt-4">
                <label for="eventStatus" class="font-semibold form-label">Event Status</label>
                <select id="eventStatus" class="w-full px-3 py-2 border rounded form-control" v-model="eventData.event_status">
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
            
            <!-- Buttons and Loading Spinner -->
            <div class="flex gap-4 mt-4">
              <button
                @click="updateEvent"
                class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700"
                style="background-color: #154360;"
                :disabled="isLoading"  
              >
              <span v-if="isLoading" class="flex items-center gap-2">
                <i class="items-center gap-4 fa fa-spinner fa-spin"></i> Loading...
              </span>
                Update Event
                
              </button>
  
              <!-- Show the loading spinner when isLoading is true -->
              
  
              <button 
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                <a href="my/events"><i class="fa fa-times"></i> Cancel</a>
              </button>
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
  
  const eventData = ref({
    event_type: '',
    date_for_event: '',
    physical_address: '',
    event_status: ''
  });
  
  const isLoading = ref(false);  // Track loading state
  
  onMounted(async () => {
    await fetchEventData();
  });
  
  async function fetchEventData() {
    try {
      const response = await axios.get(`api/events/${route.params.event_id}`);
      eventData.value = response.data; // Corrected assignment
    } catch (error) {
      handleError(error);
    }
  }
  
  async function updateEvent() {
    isLoading.value = true;  // Start loading
    try {
      const response = await axios.put(`api/events/${route.params.event_id}`, eventData.value);
      toast.success('Event updated successfully');
      router.push('/my/events');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;  // Stop loading
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
  .edit-event {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  