<template>
    <div class="py-5 edit-timetable" style="font-family: 'Euclid Circular', sans-serif;">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Timetable</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Timetable Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Edit Timetable</h3>
            <div class="grid grid-cols-1 gap-4">
              <!-- Subject Input -->
  
              <!-- Event Dropdown -->
              <div class="mb-4">
                <label for="eventId" class="font-semibold form-label">Event</label>
                <select id="eventId" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.event_id" :disabled="isLoading">
                  <option value="">Select Event</option>
                  <option v-for="event in events" :key="event.event_id" :value="event.event_id">
                    {{ event.event_type }}
                  </option>
                </select>
              </div>
  
              <!-- Start and End Date Inputs -->
              <div class="mt-4">
                <label for="startDate" class="font-semibold form-label">Start Date</label>
                <input type="date" id="startDate" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.start_date" :disabled="isLoading" />
              </div>
              <div class="mt-4">
                <label for="endDate" class="font-semibold form-label">End Date</label>
                <input type="date" id="endDate" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.end_date" :disabled="isLoading" />
              </div>
  
              <!-- Start and End Time Inputs -->
              <div class="mt-4">
                <label for="startTime" class="font-semibold form-label">Start Time</label>
                <input type="time" id="startTime" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.start_time" :disabled="isLoading" />
              </div>
              <div class="mt-4">
                <label for="endTime" class="font-semibold form-label">End Time</label>
                <input type="time" id="endTime" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.end_time" :disabled="isLoading" />
              </div>
  
              <!-- Duration Input -->
              <div class="mt-4">
                <label for="duration" class="font-semibold form-label">Duration</label>
                <input type="text" id="duration" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.duration" :disabled="isLoading" />
              </div>
  
              <!-- Venue Input -->
              <div class="mt-4">
                <label for="venue" class="font-semibold form-label">Venue</label>
                <input type="text" id="venue" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.venue" :disabled="isLoading" />
              </div>
  
              <!-- Physical Location Input -->
              <div class="mt-4">
                <label for="physicalLocation" class="font-semibold form-label">Physical Location</label>
                <input type="text" id="physicalLocation" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.physical_location" :disabled="isLoading" />
              </div>
  
              <!-- Status Dropdown -->
              <div class="mt-4">
                <label for="status" class="font-semibold form-label">Status</label>
                <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="timetableData.status" :disabled="isLoading">
                  <option value="">Select Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="canceled">Canceled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
  
            <!-- Update and Cancel Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="updateTimetable" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;" :disabled="isLoading">
                <span v-if="isLoading"><i class="fa fa-spinner fa-spin"></i> Updating...</span>
                <span v-else>Update Timetable</span>
              </button>
              <span> <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="my/timetable"><i class="fa fa-times"></i> Cancel</a>
              </button></span>
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
  
  // Timetable data and events
  const timetableData = ref({
    event_id: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    duration: '',
    venue: '',
    physical_location: '',
    status: ''
  });
  const events = ref([]);
  const isLoading = ref(false);
  
  // Fetch timetable data and events
  onMounted(async () => {
    await fetchTimetableData();
    await fetchEvents();
  });
  
  // Fetch timetable data for editing
  async function fetchTimetableData() {
    try {
      const response = await axios.get(`api/time-table/${route.params.time_table_id}`);
      timetableData.value = response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Fetch events for the dropdown
  const fetchEvents = async () => {
    try {
      const response = await axios.get('api/dropdown/events');
      events.value = response.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  // Update timetable
  async function updateTimetable() {
    isLoading.value = true;
    try {
      const response = await axios.put(`api/time-table/${route.params.time_table_id}`, timetableData.value);
      toast.success('Timetable updated successfully');
      router.push('/my/timetable');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Handle errors
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
  