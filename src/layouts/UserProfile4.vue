<template>
  <div class="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100" style="font-family: 'Trirong', sans-serif;">
    <div class="container mx-auto max-w-4xl">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <!-- Header with Gradient -->
        <div class="relative h-32 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900">
          <div class="absolute inset-0 bg-black opacity-10"></div>
          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 hover:scale-110 z-10"
            aria-label="Close"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
          
          <!-- Profile Avatar Section -->
          <div class="absolute -bottom-16 left-8 flex items-end gap-4">
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                <div class="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div class="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {{ getInitials(userData.name) }}
                  </div>
                </div>
              </div>
              <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="pt-20 px-8 pb-8">
          <!-- User Name and Role -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ userData.name || 'Loading...' }}</h1>
            <div class="flex items-center gap-3 flex-wrap">
              <span 
                class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold"
                :class="getRoleClass(userData.category)"
              >
                <i class="fas fa-user-tag mr-2"></i>
                {{ userData.category || 'N/A' }}
              </span>
              <span 
                class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold"
                :class="getStatusClass(userData.status)"
              >
                <i class="fas fa-circle text-xs mr-2"></i>
                {{ userData.status || 'N/A' }}
              </span>
            </div>
          </div>

          <!-- Profile Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Email -->
            <div class="group">
              <label class="flex items-center text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                <i class="fas fa-envelope text-blue-500 mr-2"></i>
                Email Address
              </label>
              <div class="relative">
                <input 
                  type="email" 
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 group-hover:border-gray-300"
                  v-model="userData.email" 
                  :class="{ 'bg-white': isEditing && canEditEmail, 'bg-gray-50': !isEditing || !canEditEmail }"
                />
                <button 
                  v-if="!isEditing && canEditEmail"
                  @click="copyToClipboard(userData.email)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Copy email"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <!-- Department -->
            <div class="group">
              <label class="flex items-center text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                <i class="fas fa-building text-purple-500 mr-2"></i>
                Department
              </label>
              <input 
                type="text" 
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200 group-hover:border-gray-300"
                v-model="userData.department" 
                :readonly="isEditing"
                :class="{ 'bg-white': isEditing, 'bg-gray-50': !isEditing }"
              />
            </div>

            <!-- Password Section -->
            <div class="md:col-span-2 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-key text-red-600 mr-2"></i>
                Security Settings
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-4">
                  <div>
                    <label class="flex items-center text-sm font-semibold text-gray-600 mb-2">
                      <i class="fas fa-lock text-red-500 mr-2"></i>
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-all duration-200"
                      placeholder="Enter current password"
                      value="{{$user->password}}"
                      readonly
                    />
                  </div>
                  <div>
                    <label class="flex items-center text-sm font-semibold text-gray-600 mb-2">
                      <i class="fas fa-key text-green-500 mr-2"></i>
                      New Password
                    </label>
                    <input 
                      type="password" 
                      class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-200"
                      placeholder="Enter new password"
                      v-model="passwordData.new_password"
                      :readonly="!isEditing"
                      :class="{ 'bg-white': isEditing, 'bg-gray-50': !isEditing }"
                    />
                  </div>
                  <div>
                    <label class="flex items-center text-sm font-semibold text-gray-600 mb-2">
                      <i class="fas fa-check-circle text-blue-500 mr-2"></i>
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                      placeholder="Confirm new password"
                      v-model="passwordData.new_password_confirmation"
                      :readonly="!isEditing"
                      :class="{ 'bg-white': isEditing, 'bg-gray-50': !isEditing }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Role Details Card -->
            <div class="md:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-id-card text-blue-600 mr-2"></i>
                Account Details
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                  <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <i class="fas fa-user-shield text-blue-600"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Role</p>
                    <p class="text-sm font-bold text-gray-800">{{ userData.category || 'N/A' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                  <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <i class="fas fa-check-circle text-green-600"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Status</p>
                    <p class="text-sm font-bold text-gray-800">{{ userData.status || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <i class="fas fa-clock"></i>
                <span>Last updated: {{ formatDate(new Date()) }}</span>
              </div>
              <div class="flex gap-3">
                <button 
                  v-if="!isEditing"
                  @click="editProfile"
                  class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                  <i class="fas fa-edit"></i>
                  Edit Profile
                </button>
                <button 
                  v-if="isEditing"
                  @click="saveProfile"
                  class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  :disabled="isLoading"
                >
                  <i class="fas fa-save" :class="{ 'fa-spin': isLoading }"></i>
                  Save Changes
                </button>
                <button 
                  v-if="isEditing"
                  @click="cancelEdit"
                  class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                  <i class="fas fa-times"></i>
                  Cancel
                </button>
                <button 
                  v-if="!isEditing"
                  @click="refreshProfile"
                  class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  :disabled="isRefreshing"
                >
                  <i class="fas fa-sync-alt" :class="{ 'fa-spin': isRefreshing }"></i>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Cards (Optional) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Account Type</p>
              <p class="text-2xl font-bold text-gray-800">{{ userData.category || 'N/A' }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user-circle text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Department</p>
              <p class="text-2xl font-bold text-gray-800">{{ userData.department || 'N/A' }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="fas fa-briefcase text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Status</p>
              <p class="text-2xl font-bold text-gray-800">{{ userData.status || 'N/A' }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-heart-pulse text-green-600 text-xl"></i>
            </div>
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
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const isRefreshing = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const canEditEmail = ref(false); // Control email editing

// Object to store fetched user data
const userData = ref({
  name: '',
  email: '',
  category: '',
  status: '',
  department: 'N/A',
});

// Store original data for cancel functionality
const originalUserData = ref({});

// Password data object
const passwordData = ref({
  new_password: '',
  new_password_confirmation: '',
});

// Fetch user profile on component mount
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
    
    // Store original data for cancel functionality
    originalUserData.value = { ...userData.value };
  } catch (error) {
    handleError(error);
  }
}

// Get user initials for avatar
function getInitials(name) {
  if (!name || name === 'N/A') return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Get role badge class
function getRoleClass(role) {
  const roleMap = {
    'admin': 'bg-red-100 text-red-800 border border-red-200',
    'administrator': 'bg-red-100 text-red-800 border border-red-200',
    'manager': 'bg-purple-100 text-purple-800 border border-purple-200',
    'engineer': 'bg-blue-100 text-blue-800 border border-blue-200',
    'user': 'bg-gray-100 text-gray-800 border border-gray-200',
    'default': 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  return roleMap[role?.toLowerCase()] || roleMap['default'];
}

// Get status badge class
function getStatusClass(status) {
  const statusMap = {
    'active': 'bg-green-100 text-green-800 border border-green-200',
    'inactive': 'bg-gray-100 text-gray-800 border border-gray-200',
    'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'suspended': 'bg-red-100 text-red-800 border border-red-200',
    'default': 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  return statusMap[status?.toLowerCase()] || statusMap['default'];
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Email copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy email');
  }
}

// Refresh profile
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

// Edit profile
function editProfile() {
  isEditing.value = true;
}

// Save profile
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
      // Update original data
      originalUserData.value = { ...userData.value };
      // Clear password fields
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

// Cancel edit
function cancelEdit() {
  // Restore original data
  userData.value = { ...originalUserData.value };
  isEditing.value = false;
  toast.info('Changes cancelled');
}

// Close modal
function closeModal() {
  // Emit event or navigate back
  router.go(-1);
}

// Handle errors
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
/* Smooth animations */
@keyframes fadeIn {
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
  animation: fadeIn 0.5s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Input focus effects */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Button hover effects */
button {
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

button:hover::before {
  width: 300px;
  height: 300px;
}

/* Card hover effect */
.bg-white {
  transition: all 0.3s ease;
}

/* Gradient text effect for name */
h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>