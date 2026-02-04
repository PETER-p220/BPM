<template>
    <div class="py-5 add-event" style="font-family: 'Euclid Circular', sans-serif;">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-plus"></i> Add New Event</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- New Event Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Add New Event</h3>
            <div class="mb-4">
              <label for="eventType" class="font-semibold form-label">Event Type</label>
              <input
                type="text"
                id="eventType"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newEventData.event_type"
              />
            </div>
            <div class="mb-4">
              <label for="eventDate" class="font-semibold form-label">Date for Event</label>
              <input
                type="date"
                id="eventDate"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newEventData.date_for_event"
              />
            </div>
            <div class="mb-4">
              <label for="eventAddress" class="font-semibold form-label">Physical Address</label>
              <input
                type="text"
                id="eventAddress"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newEventData.physical_address"
              />
            </div>
            <div class="flex gap-4 mt-4">
              <button
                v-bind:disabled="isLoading"  
                @click="addEvent"
                class="px-4 py-2 text-white rounded hover:bg-blue-700"
                style="background-color: #154360;"
              >
              <span v-if="isLoading">
                <i class="items-center gap-4 fa fa-spinner fa-spin"></i> Loading...
              </span>
                <i class="fa fa-plus"></i> Add Event
              </button>
              <span>
                <button 
                  class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <a href="my/events"><i class="fa fa-times"></i> Cancel</a>
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
  const newEventData = ref({ event_type: '', date_for_event: '', physical_address: '' });
  const isLoading = ref(false); // Track loading state
  
  // Add new event function
  async function addEvent() {
    isLoading.value = true;  // Set loading to true when the event is being added
    try {
      const response = await axios.post('api/events', newEventData.value);
      toast.success('Event added successfully');
      // Clear the form after a successful addition
      newEventData.value = { event_type: '', date_for_event: '', physical_address: '' };
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false; // Reset loading state when the request finishes
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
  .add-event {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  