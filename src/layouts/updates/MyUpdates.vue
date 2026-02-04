<template>
    <div class="p-4 space-y-4" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <PageHeader title="Table" subtitle="Updates">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <router-link to="/add-update">
            <BaseButton @click="addNewUpdate" style="background-color: #2e4053;" class="w-full sm:w-auto">
              Add New Update
              <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
            </BaseButton>
          </router-link>
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
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(update, index) in filteredUpdates" :key="update.update_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ update.description }}</td>
              <td class="table-data">{{ update.event ? update.event.event_type : 'N/A' }}</td> <!-- Added check for event object -->
              <td class="table-data">
                <i @click="editUpdate(update.update_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
              </td>
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
  
  const updates = ref([]);
  const filter = ref('');
  
  // Fetch updates when component is mounted
  onMounted(async () => {
    await fetchUpdates();
  });
  
  // Function to fetch updates from API
  async function fetchUpdates() {
    try {
      const response = await axios.get('api/my/updates');
      updates.value = response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Computed property to filter updates based on input
  const filteredUpdates = computed(() => {
    return updates.value.filter(update =>
      update.description.toLowerCase().includes(filter.value.toLowerCase()) ||
      (update.event && update.event.event_type.toLowerCase().includes(filter.value.toLowerCase())) // Fixed filter logic
    );
  });
  
  // Navigate to edit update page
  function editUpdate(updateId) {
    router.push({ name: 'EditUpdate', params: { update_id: updateId } });
  }
  
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
  