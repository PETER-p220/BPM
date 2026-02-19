<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 23px">
    <PageHeader subtitle="All Updates Management">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <!-- Role Filter -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Role:</label>
          <select 
            v-model="selectedRole" 
            @change="filterUpdates"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">HOD</option>
            <option value="3">User</option>
            <option value="4">Tenders</option>
            <option value="5">Accountant</option>
            <option value="6">HR</option>
          </select>
        </div>
        
        <router-link to="/admin/create-update">
          <BaseButton @click="addNewUpdate" style="background-color: #2e4053;" class="w-full sm:w-auto">
            Submit Update 
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>
      </div>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-2xl font-bold text-gray-900">{{ totalUpdates }}</div>
        <div class="text-sm text-gray-600">Total Updates</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-2xl font-bold text-gray-900">{{ filteredUpdates.length }}</div>
        <div class="text-sm text-gray-600">Filtered Updates</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-2xl font-bold text-gray-900">{{ uniqueUsers }}</div>
        <div class="text-sm text-gray-600">Unique Users</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-2xl font-bold text-gray-900">{{ updatesWithImages }}</div>
        <div class="text-sm text-gray-600">With Images</div>
      </div>
    </div>

    <!-- Updates Grid -->
    <div class="py-5 space-y-3">
      <!-- Loop through updates and display them -->
      <div v-for="(groupedUpdates, index) in groupedUpdates" :key="index">
        <!-- Group Header -->
        <div class="mb-4 p-3 bg-gray-100 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ groupedUpdates[0]?.title || 'Untitled Updates' }}</h3>
          <div class="text-sm text-gray-600">{{ groupedUpdates.length }} update(s) in this group</div>
        </div>
        
        <!-- Use flexbox for horizontal display with wrapping -->
        <div class="flex flex-wrap justify-start gap-4">
          <!-- Loop through each update and display it -->
          <div
            v-for="(update, updateIndex) in groupedUpdates"
            :key="updateIndex"
            class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3"
          >
            <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 hover:border-indigo-300">
              <!-- Image Section -->
              <div class="relative h-40 overflow-hidden rounded-t-lg mb-3">
                <img
                  v-if="update.update_photo"
                  :src="update.update_photo"
                  alt="Update Image"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gray-100"
                >
                  <i class="fas fa-image text-4xl text-gray-400"></i>
                </div>

                <!-- Role Badge -->
                <div class="absolute top-2 right-2 px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                  {{ getRoleName(update.user_role_id) }}
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {{ update.title || 'Untitled Update' }}
                </h4>

                <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <i class="fas fa-user-circle"></i>
                  <span>{{ update.user_name || 'Unknown' }}</span>
                  <span class="ml-auto text-xs text-gray-500">{{ formatDate(update.created_at) }}</span>
                </div>

                <p
                  v-if="update.description"
                  class="text-sm text-gray-700 line-clamp-3 mb-3"
                >
                  {{ update.description }}
                </p>

                <!-- File Download Link -->
                <div v-if="update.update_file" class="mb-3">
                  <a 
                    :href="update.update_file" 
                    target="_blank" 
                    class="inline-flex items-center gap-1 px-3 py-1 text-xs text-teal-600 bg-teal-50 rounded hover:bg-teal-100 transition"
                  >
                    <i class="fas fa-file-alt"></i>
                    Download File
                  </a>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between items-center">
                  <button
                    @click="viewUpdateDetails(update.chat_id)"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <i class="fas fa-eye mr-2"></i>
                    View Details
                  </button>
                  <button
                    @click="editUpdate(update.chat_id)"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 transition"
                  >
                    <i class="fas fa-edit mr-2"></i>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const updates = ref([]);
const selectedRole = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  await fetchUpdates();
});

// Fetch project updates
async function fetchUpdates() {
  try {
    const response = await axios.get('api/admin/all-updates');
    // Access the `data` field from response and map it accordingly
    updates.value = response.data.data.map(update => ({
      chat_id: update.chat_id,
      title: update.title,
      user_name: update.user?.name || 'Unknown',
      user_role_id: update.user?.role_id || 3,
      created_at: update.created_at,
      update_photo: update.update_photo,
      description: update.description,
      update_file: update.update_file,
    }));
  } catch (error) {
    handleError(error);
  }
}

// Filter updates based on selected role
const filteredUpdates = computed(() => {
  if (!selectedRole.value) {
    return updates.value;
  }
  return updates.value.filter(update => update.user_role_id === parseInt(selectedRole.value));
});

// Statistics
const totalUpdates = computed(() => updates.value.length);
const uniqueUsers = computed(() => {
  const users = new Set(updates.value.map(u => u.user_name));
  return users.size;
});
const updatesWithImages = computed(() => {
  return updates.value.filter(u => u.update_photo).length;
});

// Get role name from role ID
function getRoleName(roleId) {
  const roles = {
    1: 'Admin',
    2: 'HOD', 
    3: 'User',
    4: 'Tenders',
    5: 'Accountant',
    6: 'HR'
  };
  return roles[roleId] || 'Unknown';
}

// Navigate to update details page with chat_id
function viewUpdateDetails(chat_id) {
  router.push({ name: 'AdminPostedEditUpdate', params: { chat_id } });
}

// Navigate to edit update page
function editUpdate(chat_id) {
  router.push({ name: 'AdminPostedEditUpdate', params: { chat_id } });
}

// Filter updates when role selection changes
function filterUpdates() {
  console.log('Filtering by role:', selectedRole.value);
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Format date to a readable format
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
