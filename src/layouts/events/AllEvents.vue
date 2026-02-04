<template>
    <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
      <PageHeader title="Table" subtitle="Events">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
        </div>
      </PageHeader>
  
      <div class="flex items-center mb-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search..."
          class="w-full p-2 border rounded sm:w-auto"
        />
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
          <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Owner</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Type</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Physical Address</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(event, index) in filteredEvents" :key="event.event_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ event.user_name }}</td>
              <td class="table-data">{{ event.event_type }}</td>
              <td class="table-data">{{ event.date_for_event }}</td>
              <td class="table-data">{{ event.physical_address }}</td>
              <td class="table-data"><p class="text-center btn" style="background-color:#1b4f72;color:white">{{ event.event_status }}</p></td>
              
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  

  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/axios'; // Ensure this points to your axios instance
  import { useToast } from 'vue-toastification';
  
  const router = useRouter();
  const toast = useToast();
  
  const events = ref([]);
  const filter = ref('');
  
  // Fetch events when component is mounted
  onMounted(async () => {
    await fetchEvents();
  });
  
  // Function to fetch events from API
  async function fetchEvents() {
    try {
      const response = await axios.get('api/events');
      events.value = response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Computed property to filter events based on input
  const filteredEvents = computed(() => {
    return events.value.filter(event =>
      event.event_type.toLowerCase().includes(filter.value.toLowerCase()) ||
      event.physical_address.toLowerCase().includes(filter.value.toLowerCase()) ||
      event.event_status.toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  
 
  
  
  // Handle errors and display as toast messages
  function handleError(error) {
    let message = 'An unexpected error occurred';
  
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = error.response.statusText;
      }
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
  
    toast.error(message);
  }
  </script>
  


<style scoped>
.custom-toast-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirm-btn, .cancel-btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn {
  background-color: #2196f3;
  color: white;
}
</style>
