<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Edit User
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Update user profile information
          </p>
        </div>

        <button
          @click="closeModal"
          class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Form Card -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div class="border-b border-gray-200 bg-gray-50 px-6 py-5 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Profile
          </h2>
        </div>

        <form @submit.prevent="updateUser" class="p-6 lg:p-8 space-y-8">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Name -->
            <div>
              <label for="userName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                id="userName"
                v-model="userData.name"
                type="text"
                required
                placeholder="Enter full name"
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="userEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                id="userEmail"
                v-model="userData.email"
                type="email"
                required
                placeholder="user@example.com"
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all duration-200"
              />
            </div>

            <!-- Role -->
            <div>
              <label for="userRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Role <span class="text-red-500">*</span>
              </label>
              <select
                id="userRole"
                v-model="userData.role_id"
                required
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 transition-all duration-200"
              >
                <option value="" disabled>Select role</option>
                <option v-for="role in roles" :key="role.role_id" :value="role.role_id">
                  {{ role.category }}
                </option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label for="userStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Account Status <span class="text-red-500">*</span>
              </label>
              <select
                id="userStatus"
                v-model="userData.status"
                required
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 transition-all duration-200"
              >
                <option value="is_active">Active</option>
                <option value="not_active">Not Active</option>
              </select>
            </div>

            <!-- Department -->
            <div class="sm:col-span-2">
              <label for="userDepartment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Department (Optional)
              </label>
              <select
                id="userDepartment"
                v-model="userData.department_id"
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 transition-all duration-200"
              >
                <option value="">No department</option>
                <option v-for="dept in departments" :key="dept.department_id" :value="dept.department_id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Password -->
            <div class="sm:col-span-2">
              <label for="userPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                New Password (optional – leave blank to keep current)
              </label>
              <input
                id="userPassword"
                v-model="userData.password"
                type="password"
                autocomplete="new-password"
                placeholder="••••••••"
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all duration-200"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Minimum 8 characters. Changing password will log user out of all devices.
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-4 pt-8 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:justify-end">
            <router-link
              to="/users"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </router-link>

            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 transition-all"
            >
              <svg v-if="isLoading" class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const userData = ref({
  name: '',
  email: '',
  role_id: '',
  department_id: '',
  status: 'is_active',
  password: ''
})

const roles = ref([])
const departments = ref([])
const isLoading = ref(false)

onMounted(async () => {
  await Promise.all([
    fetchUserData(),
    fetchRoles(),
    fetchDepartments()
  ])
})

async function fetchUserData() {
  try {
    const response = await axios.get(`api/user/${route.params.user_id}`)
    userData.value = response.data
  } catch (err) {
    handleError(err)
  }
}

async function fetchRoles() {
  try {
    const response = await axios.get('api/auth/roles')
    roles.value = response.data || []
  } catch (err) {
    handleError(err)
  }
}

async function fetchDepartments() {
  try {
    const response = await axios.get('api/dropdown/department')
    departments.value = response.data?.departments || []
  } catch (err) {
    handleError(err)
  }
}

async function updateUser() {
  if (!userData.value.name?.trim()) {
    toast.warning('Name is required')
    return
  }

  isLoading.value = true

  try {
    const payload = { ...userData.value }
    // Remove password if empty
    if (!payload.password?.trim()) delete payload.password

    const response = await axios.put(`api/user/${route.params.user_id}`, payload)
    toast.success(response.data.message || 'User updated successfully')
    router.push('/users')
  } catch (err) {
    handleError(err)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  router.push('/users')
}

function handleError(error) {
  const msg = error.response?.data?.message || 'Failed to update user'
  toast.error(msg)
}
</script>

<style scoped>
/* Better focus rings */
input:focus,
select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Smooth button hover */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}
</style>