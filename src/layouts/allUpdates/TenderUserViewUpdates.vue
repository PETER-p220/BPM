<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Project Updates</h1>
            <p class="text-sm text-gray-600 mt-1">View and manage all project updates</p>
          </div>
          <router-link to="/tenderuser-submitupdate">
            <button 
              class="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md"
              style="background-color: #2e4053"
            >
              <i class="fas fa-plus"></i>
              <span>Submit Update</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Loading updates...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="updates.length === 0" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <i class="fas fa-inbox text-6xl text-gray-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Updates Yet</h3>
          <p class="text-gray-600 mb-6">Start by creating your first project update</p>
          <router-link to="/tenderuser-submitupdate">
            <button 
              class="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all font-medium"
              style="background-color: #2e4053"
            >
              <i class="fas fa-plus"></i>
              <span>Create First Update</span>
            </button>
          </router-link>
        </div>
      </div>

      <!-- Updates Grid -->
      <div v-else>
        <!-- Stats Summary -->
        <div class="mb-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <i class="fas fa-clipboard-list text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Total Updates</p>
                <p class="text-2xl font-bold text-gray-900">{{ updates.length }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <i class="fas fa-file-alt text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">With Files</p>
                <p class="text-2xl font-bold text-gray-900">{{ updatesWithFiles }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <i class="fas fa-image text-purple-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">With Images</p>
                <p class="text-2xl font-bold text-gray-900">{{ updatesWithImages }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                <i class="fas fa-clock text-orange-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Latest Update</p>
                <p class="text-sm font-semibold text-gray-900">{{ formatRelativeDate(latestUpdate) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Updates Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(update, index) in updates"
            :key="index"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            @click="viewUpdateDetails(update.chat_id)"
          >
            <!-- Image Section -->
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img 
                v-if="update.update_photo" 
                :src="update.update_photo" 
                class="object-cover w-full h-full transition-transform group-hover:scale-105" 
                alt="Update Image"
                @error="handleImageError"
              />
              <div v-else class="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                <i class="fas fa-file-alt text-4xl text-gray-400"></i>
              </div>
              
              <!-- Overlay badges -->
              <div class="absolute top-3 right-3 flex gap-2">
                <span v-if="update.update_file" class="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                  <i class="fas fa-paperclip text-gray-500"></i>
                  File
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-5">
              <!-- Title -->
              <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                {{ update.title }}
              </h3>

              <!-- User Info -->
              <div class="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <i class="fas fa-user text-blue-600 text-xs"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ update.user_name }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(update.created_at) }}</p>
                </div>
              </div>

              <!-- Description -->
              <p 
                v-if="update.description" 
                class="text-sm text-gray-600 mb-4 line-clamp-3"
              >
                {{ update.description }}
              </p>
              <p v-else class="text-sm text-gray-400 italic mb-4">
                No description available
              </p>

              <!-- Action Buttons -->
              <div class="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  @click.stop="viewUpdateDetails(update.chat_id)"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-all font-medium text-sm"
                  style="background-color: #2e4053"
                >
                  <i class="fas fa-eye"></i>
                  <span>View Details</span>
                </button>
                
                <button 
                  v-if="update.update_file"
                  @click.stop="downloadFile(update.update_file, getFileName(update.update_file))"
                  class="inline-flex items-center justify-center px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-all font-medium text-sm"
                  title="Download file"
                >
                  <i class="fas fa-download"></i>
                </button>
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
const isLoading = ref(true);

// Computed statistics
const updatesWithFiles = computed(() => {
  return updates.value.filter(update => update.update_file).length;
});

const updatesWithImages = computed(() => {
  return updates.value.filter(update => update.update_photo).length;
});

const latestUpdate = computed(() => {
  if (updates.value.length === 0) return null;
  return updates.value.reduce((latest, update) => {
    return new Date(update.created_at) > new Date(latest.created_at) ? update : latest;
  }).created_at;
});

// Fetch data when component is mounted
onMounted(async () => {
  await fetchUpdates();
});

// Fetch project updates for current user only
async function fetchUpdates() {
  isLoading.value = true;
  try {
    const response = await axios.get('api/my/updates');
    // Sort by created_at descending (newest first)
    updates.value = response.data.data
      .map(update => ({
        chat_id: update.chat_id,
        title: update.title,
        user_name: update.user.name,
        created_at: update.created_at,
        update_photo: update.update_photo,
        description: update.description,
        update_file: update.update_file,
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Navigate to update details page with chat_id
function viewUpdateDetails(chat_id) {
  router.push({ name: 'TenderUserEditUpdates', params: { chat_id } });
}

// Download file function
async function downloadFile(fileUrl, fileName) {
  try {
    // Create a download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to download file');
  }
}

// Extract filename from URL
function getFileName(fileUrl) {
  if (!fileUrl) return 'download';
  
  // Extract filename from URL path
  const urlParts = fileUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  
  // Remove any query parameters
  return fileName.split('?')[0];
}

// Handle image loading errors
function handleImageError(event) {
  event.target.style.display = 'none';
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
  const d = new Date(date);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('en-US', options);
}

// Format relative date for latest update
function formatRelativeDate(date) {
  if (!date) return 'N/A';
  
  const now = new Date();
  const updateDate = new Date(date);
  const diffTime = Math.abs(now - updateDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return formatDate(date);
  }
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
.group:hover {
  transform: translateY(-4px);
}

/* Sticky header */
.sticky {
  position: sticky;
  top: 0;
}
</style>