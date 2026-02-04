<template>
    <div class="py-5 add-timetable" style="font-family: 'Euclid Circular', sans-serif;">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-plus"></i> Add New Time Table</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- New Time Table Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Add New Time Table</h3>
            <div class="mb-4">
              <label for="eventId" class="font-semibold form-label">Event</label>
              <select id="eventId" class="w-full px-3 py-2 border rounded form-control" v-model="newTimeTableData.event_id">
                <option value="">Select Event</option>
                <option v-for="event in events" :key="event.event_id" :value="event.event_id">
                  {{ event.event_type }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="startDate" class="font-semibold form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.start_date"
              />
            </div>
            <div class="mb-4">
              <label for="endDate" class="font-semibold form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.end_date"
              />
            </div>
            <div class="mb-4">
              <label for="startTime" class="font-semibold form-label">Start Time</label>
              <input
                type="time"
                id="startTime"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.start_time"
                @change="calculateDuration"
              />
            </div>
            <div class="mb-4">
              <label for="endTime" class="font-semibold form-label">End Time</label>
              <input
                type="time"
                id="endTime"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.end_time"
                @change="calculateDuration"
              />
            </div>
            <div class="mb-4">
              <label for="duration" class="font-semibold form-label">Duration</label>
              <input
                type="text"
                id="duration"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.duration"
                readonly
              />
            </div>
            <div class="mb-4">
              <label for="venue" class="font-semibold form-label">Venue</label>
              <input
                type="text"
                id="venue"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.venue"
              />
            </div>
            <div class="mb-4">
              <label for="physicalLocation" class="font-semibold form-label">Physical Location</label>
              <input
                type="text"
                id="physicalLocation"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newTimeTableData.physical_location"
              />
            </div>
            <div class="mb-4">
              <label for="status" class="font-semibold form-label">Status</label>
              <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="newTimeTableData.status">
                <option value="">Select Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="canceled">Canceled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div class="flex gap-4 mt-4">
              <button
                @click="addTimeTable"
                class="px-4 py-2 text-white rounded hover:bg-blue-700"
                style="background-color: #154360;"
              >
                <i class="fa fa-plus"></i> Add Time Table
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
import { useToast } from 'vue-toastification';

const toast = useToast();
const newTimeTableData = ref({
  event_id: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  duration: '',
  venue: '',
  physical_location: '',
  status: '',
});
const events = ref([]);

// Fetch events for the dropdown
const fetchEvents = async () => {
  try {
    const response = await axios.get('api/dropdown/events');
    events.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add new time table function
async function addTimeTable() {
  try {
    const response = await axios.post('api/time-table', newTimeTableData.value);
    toast.success('Time table created successfully');
    // Clear the form after a successful addition
    newTimeTableData.value = {
      event_id: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      duration: '',
      venue: '',
      physical_location: '',
      status: ''
    };
  } catch (error) {
    handleError(error);
  }
}

// Error handling
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

// Function to calculate duration based on start and end times
function calculateDuration() {
  const startTime = newTimeTableData.value.start_time;
  const endTime = newTimeTableData.value.end_time;

  if (startTime && endTime) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const durationInMilliseconds = end - start;

    if (durationInMilliseconds < 0) {
      toast.error("End time cannot be earlier than start time.");
      return;
    }

    const durationInMinutes = Math.floor(durationInMilliseconds / 60000);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    newTimeTableData.value.duration = `${hours}h ${minutes}m`;
  }
}

// Fetch events on component mount
onMounted(fetchEvents);
</script>

  
  <style scoped>
  .add-event {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  