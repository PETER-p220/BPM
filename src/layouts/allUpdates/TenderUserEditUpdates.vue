<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <button 
            @click="goBack"
            class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-200"
            title="Go back"
          >
            <i class="fa fa-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Update Details</h1>
            <p class="text-sm text-gray-600 mt-1">View and manage update information</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="!chat && !error" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Loading update details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <i class="fas fa-exclamation-circle text-6xl text-red-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Update</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button 
            @click="goBack"
            class="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all font-medium"
            style="background-color: #283747"
          >
            <i class="fa fa-arrow-left"></i>
            <span>Go Back</span>
          </button>
        </div>
      </div>

      <!-- Update Details -->
      <div v-else-if="chat" class="max-w-5xl mx-auto">
        <!-- Main Content Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Image Section -->
          <div v-if="chat.update_photo" class="relative w-full h-96 bg-gray-100 overflow-hidden">
            <img
              :src="chat.update_photo"
              alt="Update Image"
              class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              @error="handleImageError"
            />
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 flex items-center gap-2 shadow-lg">
                <i class="fas fa-image text-blue-500"></i>
                Project Image
              </span>
            </div>
          </div>
          <div v-else class="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div class="text-center">
              <i class="fas fa-image text-6xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">No image available</p>
            </div>
          </div>

          <!-- Content Section -->
          <div class="p-8">
            <!-- Header Info -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ chat.title }}</h2>
              
              <div class="flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                  <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <i class="fas fa-calendar text-blue-600"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Created</p>
                    <p class="font-medium text-gray-900">{{ formatDate(chat.created_at) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-gray-600">
                  <div class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                    <i class="fas fa-clock text-green-600"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Time ago</p>
                    <p class="font-medium text-gray-900">{{ formatRelativeDate(chat.created_at) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-gray-600">
                  <div class="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                    <i class="fas fa-user text-purple-600"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Updated by</p>
                    <p class="font-medium text-gray-900">{{ chat.user_name || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i class="fas fa-align-left text-gray-400"></i>
                Description
              </h3>
              <div v-if="chat.description" class="prose prose-gray max-w-none">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ chat.description }}</p>
              </div>
              <p v-else class="text-gray-400 italic">No description provided</p>
            </div>

            <!-- Actions Section -->
            <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <button
                @click="showModal = true"
                class="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md"
                style="background-color: #283747"
              >
                <i class="fas fa-edit"></i>
                <span>Edit Update</span>
              </button>

              <button
                @click="goBack"
                class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                <i class="fa fa-arrow-left"></i>
                <span>Back to List</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Info Card -->
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <i class="fa fa-info-circle text-blue-600 text-xl"></i>
            </div>
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">Update Information</p>
              <p class="text-blue-700">You can edit the title and description of this update. Click the "Edit Update" button to make changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Edit Update</h2>
              <p class="text-sm text-gray-600 mt-0.5">Make changes to your update information</p>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="saveChanges" class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <!-- Title Field -->
            <div class="mb-6">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Update Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{'border-red-300 focus:ring-red-500': showValidation && !form.title}"
                placeholder="Enter update title"
                required
              />
              <p v-if="showValidation && !form.title" class="mt-1 text-sm text-red-600">
                Title is required
              </p>
            </div>

            <!-- Description Field -->
            <div class="mb-6">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                id="description"
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                :class="{'border-red-300 focus:ring-red-500': showValidation && !form.description}"
                placeholder="Enter detailed description"
                required
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <p v-if="showValidation && !form.description" class="text-sm text-red-600">
                  Description is required
                </p>
                <p class="text-xs text-gray-400 ml-auto">
                  {{ form.description.length }} characters
                </p>
              </div>
            </div>

            <!-- Info Box -->
            <div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="flex gap-3">
                <i class="fas fa-exclamation-triangle text-amber-600 mt-0.5"></i>
                <div class="text-sm text-amber-800">
                  <p class="font-medium mb-1">Important Note</p>
                  <p>Changes will be saved immediately and reflected across the system. Please review before saving.</p>
                </div>
              </div>
            </div>
          </form>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              @click="closeModal"
              :disabled="isLoading"
              class="inline-flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fa fa-times"></i>
              <span>Cancel</span>
            </button>
            <button
              type="button"
              @click="saveChanges"
              :disabled="isLoading"
              class="inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #283747"
            >
              <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
              <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';
import axios from '@/axios';

const route = useRoute();
const router = useRouter();
const chat_id = route.params.chat_id;
const chat = ref(null);
const showModal = ref(false);
const isLoading = ref(false);
const showValidation = ref(false);
const error = ref(null);
const toast = useToast();

const form = reactive({
  title: '',
  description: '',
});

// Fetch chat details on mount
onMounted(async () => {
  await fetchChatDetails();
});

async function fetchChatDetails() {
  try {
    const response = await axios.get(`api/updates/${chat_id}`);
    if (response.data.status === 'success') {
      const data = response.data.data;
      chat.value = {
        update_photo: data.update_photo,
        title: data.title,
        created_at: data.created_at,
        description: data.description,
        user_name: data.user?.name || 'Unknown',
      };

      // Populate form fields with the existing chat data
      form.title = data.title;
      form.description = data.description;
    } else {
      error.value = response.data.message || 'Failed to load update details';
      toast.error(error.value);
    }
  } catch (err) {
    console.error('Error fetching chat details:', err);
    error.value = 'An error occurred while fetching update details';
    toast.error(error.value);
  }
}

// Save edited chat data
async function saveChanges() {
  showValidation.value = true;

  // Validation
  if (!form.title.trim() || !form.description.trim()) {
    toast.error('Please fill in all required fields');
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.put(`/api/updates/${chat_id}`, {
      title: form.title.trim(),
      description: form.description.trim(),
    });

    if (response.data.status === 'success') {
      toast.success('Update saved successfully');
      showModal.value = false;
      showValidation.value = false;

      // Update the chat details in the UI with the newly saved data
      chat.value.title = form.title.trim();
      chat.value.description = form.description.trim();
    } else {
      toast.error(response.data.message || 'Failed to save changes');
    }
  } catch (err) {
    console.error('Error saving changes:', err);
    const errorMessage = err.response?.data?.message || 'Failed to save changes';
    toast.error(errorMessage);
  } finally {
    isLoading.value = false;
  }
}

// Close modal
function closeModal() {
  if (isLoading.value) return;
  
  showModal.value = false;
  showValidation.value = false;
  
  // Reset form to current chat values
  if (chat.value) {
    form.title = chat.value.title;
    form.description = chat.value.description;
  }
}

// Go back to list
function goBack() {
  router.push('/tenderuser-viewupdate');
}

// Handle image loading errors
function handleImageError(event) {
  event.target.style.display = 'none';
  event.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
  event.target.parentElement.innerHTML = `
    <div class="text-center">
      <i class="fas fa-image text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">Image unavailable</p>
    </div>
  `;
}

// Format date to a readable format
function formatDate(date) {
  const d = new Date(date);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('en-US', options);
}

// Format relative date
function formatRelativeDate(date) {
  const now = new Date();
  const updateDate = new Date(date);
  const diffTime = Math.abs(now - updateDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus,
textarea:focus {
  outline: none;
}

/* Prose styles for description */
.prose p {
  margin-bottom: 1em;
}

.prose p:last-child {
  margin-bottom: 0;
}

/* Sticky header */
.sticky {
  position: sticky;
  top: 0;
}

/* Whitespace handling */
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>