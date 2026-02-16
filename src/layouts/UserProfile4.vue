<template>
  <div class="min-h-screen py-12 px-4 bg-white" style="font-family: 'Inter', 'Segoe UI', sans-serif;">
    <div class="container mx-auto max-w-5xl">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p class="text-gray-600">Manage your account information and preferences</p>
          </div>
          <button 
            @click="closeModal"
            class="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-all duration-200"
            aria-label="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <!-- Status Bar -->
        <div class="flex items-center gap-3 pb-6 border-b border-gray-200">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-sm font-medium text-gray-700">{{ userData.status || 'Active' }}</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <i class="fas fa-clock text-gray-400 text-xs"></i>
            <span class="text-sm text-gray-600">Last updated: {{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
        <!-- Profile Header -->
        <div class="px-8 py-6 border-b border-gray-200">
          <div class="flex items-center gap-6">
            <div class="relative">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {{ getInitials(userData.name) }}
              </div>
              <div class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ userData.name || 'Loading...' }}</h2>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <span class="flex items-center gap-1.5">
                  <i class="fas fa-briefcase text-gray-400"></i>
                  {{ userData.category || 'N/A' }}
                </span>
                <span class="text-gray-300">•</span>
                <span class="flex items-center gap-1.5">
                  <i class="fas fa-building text-gray-400"></i>
                  {{ userData.department || 'N/A' }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                v-if="!isEditing"
                @click="editProfile"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <i class="fas fa-edit text-sm"></i>
                Edit Profile
              </button>
              <button 
                v-if="!isEditing"
                @click="refreshProfile"
                class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                :disabled="isRefreshing"
              >
                <i class="fas fa-sync-alt text-sm" :class="{ 'fa-spin': isRefreshing }"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="px-8 py-8">
          <form @submit.prevent="saveProfile">
            <!-- Personal Information Section -->
            <div class="mb-10">
              <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-user text-blue-600 text-sm"></i>
                </div>
                Personal Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    v-model="userData.name"
                    :readonly="!isEditing"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    :class="{ 'bg-gray-50': !isEditing, 'bg-white': isEditing }"
                    placeholder="Enter your full name"
                  />
                </div>

                <!-- Email Address -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="email" 
                      v-model="userData.email"
                      :readonly="!isEditing || !canEditEmail"
                      class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      :class="{ 'bg-gray-50': !isEditing || !canEditEmail, 'bg-white': isEditing && canEditEmail }"
                      placeholder="your.email@company.com"
                    />
                    <button 
                      v-if="!isEditing"
                      type="button"
                      @click="copyToClipboard(userData.email)"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2"
                      title="Copy email"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>

                <!-- Department -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input 
                    type="text" 
                    v-model="userData.department"
                    :readonly="!isEditing"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    :class="{ 'bg-gray-50': !isEditing, 'bg-white': isEditing }"
                    placeholder="e.g., Engineering"
                  />
                </div>

                <!-- Role -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input 
                    type="text" 
                    v-model="userData.category"
                    readonly
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 cursor-not-allowed"
                  />
                  <p class="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
              </div>
            </div>

            <!-- Security Section -->
            <div class="mb-10 pt-10 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-shield-halved text-red-600 text-sm"></i>
                </div>
                Security & Password
              </h3>

              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div class="flex gap-3">
                  <i class="fas fa-info-circle text-amber-600 mt-0.5"></i>
                  <div>
                    <p class="text-sm font-medium text-amber-900 mb-1">Password Requirements</p>
                    <p class="text-sm text-amber-800">Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.</p>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 gap-6">
                <!-- Current Password (Hidden) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 cursor-not-allowed"
                    value="••••••••••••"
                    readonly
                  />
                  <p class="text-xs text-gray-500 mt-1">For security reasons, your current password is hidden</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="isEditing">
                  <!-- New Password -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      v-model="passwordData.new_password"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter new password"
                    />
                  </div>

                  <!-- Confirm New Password -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      v-model="passwordData.new_password_confirmation"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div v-if="!isEditing" class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                  <i class="fas fa-lock mr-2 text-gray-400"></i>
                  Click "Edit Profile" to change your password
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="isEditing" class="flex items-center justify-between pt-6 border-t border-gray-200">
              <button 
                type="button"
                @click="cancelEdit"
                class="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
                :disabled="isLoading"
              >
                <i class="fas fa-save" :class="{ 'fa-spin': isLoading }"></i>
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Account Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <i class="fas fa-user-shield text-blue-600 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1">Account Type</p>
          <p class="text-xl font-bold text-gray-900">{{ userData.category || 'N/A' }}</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <i class="fas fa-building text-purple-600 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1">Department</p>
          <p class="text-xl font-bold text-gray-900">{{ userData.department || 'N/A' }}</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <i class="fas fa-circle-check text-green-600 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1">Account Status</p>
          <p class="text-xl font-bold text-gray-900">{{ userData.status || 'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const isRefreshing = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const canEditEmail = ref(false);

const userData = ref({
  name: '',
  email: '',
  category: '',
  status: '',
  department: '',
});

const originalUserData = ref({});

const passwordData = ref({
  new_password: '',
  new_password_confirmation: '',
});

onMounted(async () => {
  await fetchUserProfile();
});

async function fetchUserProfile() {
  try {
    const response = await axios.get('api/user/profile');
    const fetchedData = response.data;

    userData.value.name = fetchedData.name || 'N/A';
    userData.value.email = fetchedData.email || 'N/A';
    userData.value.category = fetchedData.category || 'N/A';
    userData.value.status = fetchedData.status || 'N/A';
    userData.value.department = fetchedData.department || 'N/A';
    
    originalUserData.value = { ...userData.value };
  } catch (error) {
    handleError(error);
  }
}

function getInitials(name) {
  if (!name || name === 'N/A') return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Email copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy email');
  }
}

async function refreshProfile() {
  isRefreshing.value = true;
  try {
    await fetchUserProfile();
    toast.success('Profile refreshed successfully!');
  } catch (error) {
    handleError(error);
  } finally {
    setTimeout(() => {
      isRefreshing.value = false;
    }, 500);
  }
}

function editProfile() {
  isEditing.value = true;
}

async function saveProfile() {
  isLoading.value = true;
  try {
    const response = await axios.post('api/update-profile', {
      name: userData.value.name,
      email: userData.value.email,
      department: userData.value.department,
      new_password: passwordData.value.new_password,
      new_password_confirmation: passwordData.value.new_password_confirmation,
    });

    if (response.data.status === 200 || response.data.success) {
      toast.success('Profile updated successfully!');
      isEditing.value = false;
      originalUserData.value = { ...userData.value };
      passwordData.value = {
        new_password: '',
        new_password_confirmation: '',
      };
    } else {
      toast.error(response.data.message || 'Failed to update profile');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function cancelEdit() {
  userData.value = { ...originalUserData.value };
  passwordData.value = {
    new_password: '',
    new_password_confirmation: '',
  };
  isEditing.value = false;
  toast.info('Changes cancelled');
}

function closeModal() {
  router.go(-1);
}

function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.statusText) {
    message = error.response.statusText;
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
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input[readonly] {
  cursor: default;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f9fafb;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Card animations */
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
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>