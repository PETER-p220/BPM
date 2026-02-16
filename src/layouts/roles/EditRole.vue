<template>
  <div class="min-h-screen py-12 px-4 bg-white" style="font-family: 'Inter', 'Segoe UI', sans-serif;">
    <div class="container mx-auto max-w-3xl">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Role</h1>
            <p class="text-gray-600">Update role information and permissions</p>
          </div>
          <button 
            @click="closeModal"
            class="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-all duration-200"
            aria-label="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600 pb-6 border-b border-gray-200">
          <router-link to="/roles" class="hover:text-blue-600 transition-colors">
            <i class="fas fa-shield-alt mr-1"></i>
            Roles
          </router-link>
          <i class="fas fa-chevron-right text-xs text-gray-400"></i>
          <span class="text-gray-900 font-medium">Edit Role</span>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && !roleData.category" class="bg-white border border-gray-200 rounded-xl shadow-sm p-12">
        <div class="flex flex-col items-center justify-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 font-medium">Loading role data...</p>
        </div>
      </div>

      <!-- Main Content Card -->
      <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm">
        <!-- Form Header -->
        <div class="px-8 py-6 border-b border-gray-200">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <i class="fas fa-user-shield text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Role Information</h2>
              <p class="text-sm text-gray-600">Modify the role details below</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="px-8 py-8">
          <form @submit.prevent="updateRole">
            <div class="space-y-6">
              <!-- Role Category -->
              <div>
                <label for="roleCategory" class="block text-sm font-medium text-gray-700 mb-2">
                  Role Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-tag text-gray-400"></i>
                  </div>
                  <input 
                    type="text" 
                    id="roleCategory" 
                    v-model="roleData.category"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Administrator, Manager, User"
                    required
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1">Enter a descriptive name for this role</p>
              </div>

              <!-- Role Description -->
              <div>
                <label for="roleDescription" class="block text-sm font-medium text-gray-700 mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <textarea 
                    id="roleDescription" 
                    v-model="roleData.description"
                    rows="5"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe the responsibilities and permissions associated with this role..."
                    required
                  ></textarea>
                  <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                    {{ roleData.description?.length || 0 }} characters
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <router-link 
                to="/roles"
                class="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <i class="fas fa-arrow-left"></i>
                Back to Roles
              </router-link>
              
              <div class="flex items-center gap-3">
                <router-link 
                  to="/roles"
                  class="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <i class="fas fa-times"></i>
                  Cancel
                </router-link>
                
                <button 
                  type="submit"
                  class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="isLoading"
                >
                  <i class="fas" :class="isLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </form>
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

const roleData = ref({ category: '', description: '' });
const isLoading = ref(false);

onMounted(async () => {
  await fetchRoleData();
});

async function fetchRoleData() {
  isLoading.value = true;
  try {
    const response = await axios.get(`api/auth/roles/${route.params.role_id}`);
    roleData.value = response.data;
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

async function updateRole() {
  // Validate required fields
  if (!roleData.value.category?.trim()) {
    toast.error('Role name is required');
    return;
  }
  
  if (!roleData.value.description?.trim()) {
    toast.error('Role description is required');
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.put(`api/auth/roles/${route.params.role_id}`, roleData.value);
    toast.success('Role updated successfully');
    router.push('/roles');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  router.push('/roles');
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  
  if (error.response?.data?.error) {
    message = error.response.data.error;
  } else if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  
  toast.error(message);
  console.error('Error:', error);
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Form inputs */
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Button hover effects */
button:not(:disabled):hover,
a:hover {
  transform: translateY(-1px);
}

button:not(:disabled):active,
a:active {
  transform: translateY(0);
}

button:disabled {
  transform: none;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Slide up animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: slideUp 0.4s ease-out;
}

/* Focus visible for accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>