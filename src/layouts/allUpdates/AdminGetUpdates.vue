<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 23px">
    <PageHeader subtitle="All  updates here">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/admin/create-update">
          <BaseButton @click="addNewUpdate" style="background-color: #2e4053;" class="w-full sm:w-auto">
            Submit Update 
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>
      </div>
    </PageHeader>

    <div class="py-5 space-y-3">
      <!-- Loop through updates and display them -->
      <div v-for="(groupedUpdates, index) in groupedUpdates" :key="index">
        <!-- Use flexbox for horizontal display with wrapping -->
        <div class="flex flex-wrap justify-start gap-4">
          <!-- Loop through each update and display it -->
          <div
            v-for="(update, updateIndex) in groupedUpdates"
            :key="updateIndex"
            class="w-full p-4 break-words bg-white shadow-md cursor-pointer hover:shadow-xl sm:w-1/2 md:w-1/3 lg:w-1/4"
            @click="viewUpdateDetails(update.chat_id)"
          >
            <div class="flex flex-col">
              <img v-if="update.update_photo" :src="update.update_photo" class="object-cover w-full h-48 mb-4" alt="Update Image" />
              <div class="mb-2 text-lg font-semibold text-teal-700"><strong class="font-semibold">Title:</strong> {{ update.title }}</div>
              <div class="mb-2 text-sm font-semibold text-blue-500">Updated by: {{ update.user_name }}</div>
              <div class="mb-2 text-xs text-gray-600"><strong class="font-semibold text-gray-900">Created At:</strong> {{ formatDate(update.created_at) }}</div>

              <!-- Conditional rendering of description if available -->
              <div v-if="update.description" class="mb-2 text-xs text-gray-700">
                <strong class=" text-gray-900">Description:</strong> {{ update.description }}
              </div>

              <!-- Button to download the update file -->
              <div v-if="update.update_file" class="mb-4">
                <a :href="update.update_file" target="_blank" class="p-2 text-xs text-white bg-teal-700 rounded">
                  <strong class="font-semibold">Download Update File</strong>
                </a>
              </div>

              <BaseButton @click="viewUpdateDetails(update.chat_id)" class="mt-2" style="background-color: #2e4053;">
                More Details.. <i class="fas fa-eye"></i>
              </BaseButton>
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

// Fetch data when component is mounted
onMounted(async () => {
  await fetchUpdates();
});

// Fetch project updates
async function fetchUpdates() {
  try {
    const response = await axios.get('api/updates');
    // Access the `data` field from the response and map it accordingly
    updates.value = response.data.data.map(update => ({
      chat_id: update.chat_id,
      title: update.title,
      user_name: update.user.name,
      created_at: update.created_at,
      update_photo: update.update_photo,
      description: update.description,
      update_file: update.update_file,
    }));
  } catch (error) {
    handleError(error);
  }
}

// Navigate to update details page with chat_id
function viewUpdateDetails(chat_id) {
  router.push({ name: 'AdminPostedEditUpdate', params: { chat_id } });
}

// Group updates by title (or any other field)
const groupedUpdates = computed(() => {
  const groups = {};
  updates.value.forEach(update => {
    if (!groups[update.title]) {
      groups[update.title] = [];
    }
    groups[update.title].push(update);
  });
  return Object.values(groups);
});

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
  return new Date(date).toLocaleString();
}
</script>
