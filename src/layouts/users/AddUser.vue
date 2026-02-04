<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="container px-4 mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Create New User</h1>
        <p class="mt-2 text-sm text-gray-600">Add a new user to the system with their details and permissions</p>
      </div>

      <!-- Main Card -->
      <div class="overflow-hidden bg-white shadow-sm rounded-lg">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200" style="background-color: #283747;">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="text-white fa fa-user-plus"></i>
              <h2 class="text-lg font-semibold text-white">User Information</h2>
            </div>
            <router-link 
              to="/users" 
              class="text-white transition-colors hover:text-gray-200"
              aria-label="Close"
            >
              <i class="fa fa-times"></i>
            </router-link>
          </div>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="addUser" class="p-6">
          <!-- Personal Information Section -->
          <div class="mb-6">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-user-circle text-blue-600"></i>
              Personal Information
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Name -->
              <div>
                <label for="newUserName" class="block mb-2 text-sm font-medium text-gray-700">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="newUserName"
                  v-model="newUserData.name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter full name"
                  required
                  :disabled="isLoading"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="newUserEmail" class="block mb-2 text-sm font-medium text-gray-700">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="newUserEmail"
                  v-model="newUserData.email"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="user@example.com"
                  required
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>

          <!-- Account Settings Section -->
          <div class="mb-6">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-cog text-green-600"></i>
              Account Settings
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Role -->
              <div>
                <label for="newUserRole" class="block mb-2 text-sm font-medium text-gray-700">
                  Role <span class="text-red-500">*</span>
                </label>
                <select
                  id="newUserRole"
                  v-model="newUserData.role_id"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  :disabled="isLoading || isLoadingRoles"
                >
                  <option value="" disabled>Select a role</option>
                  <option v-for="role in roles" :key="role.role_id" :value="role.role_id">
                    {{ role.category }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingRoles"></i>
                  {{ isLoadingRoles ? 'Loading roles...' : 'Assign user role and permissions' }}
                </p>
              </div>

              <!-- Status -->
              <div>
                <label for="newUserStatus" class="block mb-2 text-sm font-medium text-gray-700">
                  Account Status <span class="text-red-500">*</span>
                </label>
                <select
                  id="newUserStatus"
                  v-model="newUserData.status"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  :disabled="isLoading"
                >
                  <option value="is_active">Active</option>
                  <option value="not_active">Not Active</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Active users can log in to the system</p>
              </div>

              <!-- Department -->
              <div>
                <label for="newUserDepartment" class="block mb-2 text-sm font-medium text-gray-700">
                  Department <span class="text-gray-400">(Optional)</span>
                </label>
                <select
                  id="newUserDepartment"
                  v-model="newUserData.department_id"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :disabled="isLoading || isLoadingDepartments"
                >
                  <option value="">None - No department assigned</option>
                  <option v-for="department in departments" :key="department.department_id" :value="department.department_id">
                    {{ department.name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingDepartments"></i>
                  {{ isLoadingDepartments ? 'Loading departments...' : 'Optional department assignment' }}
                </p>
              </div>

              <!-- Password -->
              <div>
                <label for="newUserPassword" class="block mb-2 text-sm font-medium text-gray-700">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="newUserPassword"
                    v-model="newUserData.password"
                    class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter secure password"
                    required
                    :disabled="isLoading"
                    minlength="6"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                    :disabled="isLoading"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">Minimum 6 characters required</p>
              </div>
            </div>
          </div>


          <!-- Action Buttons -->
          <div class="flex flex-col gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
            <router-link 
              to="/users" 
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <i class="fa fa-times"></i>
              Cancel
            </router-link>
            
            <button 
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #283747;"
              :class="{ 'hover:opacity-90': !isLoading && isFormValid }"
            >
              <i v-if="!isLoading" class="fa fa-user-plus"></i>
              <i v-else class="fa fa-spinner fa-spin"></i>
              {{ isLoading ? 'Creating User...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

const newUserData = ref({
  name: '',
  email: '',
  role_id: '',
  department_id: '',
  status: 'is_active',
  password: '',
});

const roles = ref([]);
const departments = ref([]);
const isLoading = ref(false);
const isLoadingRoles = ref(false);
const isLoadingDepartments = ref(false);
const showPassword = ref(false);

// Form validation
const isFormValid = computed(() => {
  return newUserData.value.name.trim().length > 0 &&
         newUserData.value.email.trim().length > 0 &&
         newUserData.value.role_id !== '' &&
         newUserData.value.password.length >= 6;
});

// Fetch roles and departments on component mount
onMounted(async () => {
  await Promise.all([fetchRoles(), fetchDepartments()]);
});

// Fetch roles from API
async function fetchRoles() {
  isLoadingRoles.value = true;
  try {
    const response = await axios.get('api/auth/roles');
    roles.value = response.data;
  } catch (error) {
    handleError(error, 'Failed to load roles');
  } finally {
    isLoadingRoles.value = false;
  }
}

// Fetch departments from API
async function fetchDepartments() {
  isLoadingDepartments.value = true;
  try {
    const response = await axios.get('api/dropdown/department');
    departments.value = response.data.departments;
  } catch (error) {
    handleError(error, 'Failed to load departments');
  } finally {
    isLoadingDepartments.value = false;
  }
}

// Get role name by ID
function getRoleName(roleId) {
  if (!roleId) return null;
  const role = roles.value.find(r => r.role_id === roleId);
  return role ? role.category : null;
}

// Get department name by ID
function getDepartmentName(departmentId) {
  if (!departmentId) return null;
  const department = departments.value.find(d => d.department_id === departmentId);
  return department ? department.name : null;
}

// Add new user function
async function addUser() {
  // Validate form before submission
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    // Prepare data (exclude department_id if empty)
    const userData = {
      name: newUserData.value.name.trim(),
      email: newUserData.value.email.trim(),
      role_id: newUserData.value.role_id,
      status: newUserData.value.status,
      password: newUserData.value.password,
    };

    // Only include department_id if it has a value
    if (newUserData.value.department_id) {
      userData.department_id = newUserData.value.department_id;
    }

    const response = await axios.post('api/auth/add-user', userData);
    toast.success(response.data.message || 'User created successfully!');
    
    // Reset form
    newUserData.value = {
      name: '',
      email: '',
      role_id: '',
      department_id: '',
      status: 'is_active',
      password: '',
    };
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/users');
    }, 1000);

  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function validateForm() {
  // Name validation
  if (!newUserData.value.name?.trim()) {
    toast.error('Please enter the user\'s full name.');
    return false;
  }

  if (newUserData.value.name.trim().length < 2) {
    toast.error('Name must be at least 2 characters long.');
    return false;
  }

  // Email validation
  if (!newUserData.value.email?.trim()) {
    toast.error('Please enter an email address.');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newUserData.value.email.trim())) {
    toast.error('Please enter a valid email address.');
    return false;
  }

  // Role validation
  if (!newUserData.value.role_id) {
    toast.error('Please select a role for the user.');
    return false;
  }

  // Password validation
  if (!newUserData.value.password) {
    toast.error('Please enter a password.');
    return false;
  }

  if (newUserData.value.password.length < 6) {
    toast.error('Password must be at least 6 characters long.');
    return false;
  }

  // Status validation
  if (!newUserData.value.status) {
    toast.error('Please select an account status.');
    return false;
  }

  return true;
}

function handleError(error, defaultMessage = 'An unexpected error occurred. Please try again.') {
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    message = Object.values(errors).flat().join(' ');
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
  console.error('User creation error:', error);
}
</script>

<style scoped>
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

/* Smooth transitions */
input, select, button {
  transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus, select:focus {
  outline: none;
}

/* Animation for form */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: slideIn 0.3s ease-out;
}
</style>