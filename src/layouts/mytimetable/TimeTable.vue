<template>
    <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
      <PageHeader title="Time Table" subtitle="Manage Time Tables">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <button
            class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            @click="fetchTimeTables"
          >
            Refresh
          </button>
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
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event ID</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Start Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">End Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Start Time</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">End Time</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Duration</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Venue</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Physical Location</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
              <th class="px-6 py-3 text-sm text-center text-gray-500 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(timeTable, index) in filteredTimeTables" :key="timeTable.time_table_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ timeTable.event.event_type }}</td>
              <td class="table-data">{{ timeTable.start_date }}</td>
              <td class="table-data">{{ timeTable.end_date }}</td>
              <td class="table-data">{{ timeTable.start_time }}</td>
              <td class="table-data">{{ timeTable.end_time }}</td>
              <td class="table-data">{{ timeTable.duration }}</td>
              <td class="table-data">{{ timeTable.venue }}</td>
              <td class="table-data">{{ timeTable.physical_location }}</td>
              <td class="table-data">{{ timeTable.status }}</td>
              <td class="text-center table-data">
                <button
                  class="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                  @click="editTimeTable(timeTable.time_table_id)"
                >
                  Edit
                </button>
                <button
                  class="px-2 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
                  @click="deleteTimeTable(timeTable.time_table_id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  const timeTables = ref([]);
  const filter = ref('');
  
  onMounted(async () => {
    await fetchTimeTables();
  });
  
  // Fetch time tables
  async function fetchTimeTables() {
    try {
      const response = await axios.get('/api/time-tables');
      timeTables.value = response.data; // Ensure backend returns all fields
    } catch (error) {
      handleError(error);
    }
  }
  
  // Delete time table
  async function deleteTimeTable(time_table_id) {
    if (!confirm('Are you sure you want to delete this time table?')) return;
  
    try {
      await axios.delete(`/api/time-tables/${time_table_id}`);
      toast.success('Time table deleted successfully.');
      await fetchTimeTables();
    } catch (error) {
      handleError(error);
    }
  }
  
  // Edit time table
  function editTimeTable(time_table_id) {
    router.push({ name: 'EditTimeTable', params: { time_table_id } });
  }
  
  // Filter time tables
  const filteredTimeTables = computed(() =>
    timeTables.value.filter(table =>
      Object.values(table)
        .join(' ')
        .toLowerCase()
        .includes(filter.value.toLowerCase())
    )
  );
  
  // Error handler
  function handleError(error) {
    let message = 'An unexpected error occurred.';
  
    if (error.response) {
      message = error.response.data.message || error.response.statusText;
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
