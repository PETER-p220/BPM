<template>
  <div class="edit-department min-h-screen bg-gray-50/40 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl">
      <!-- Card -->
      <div class="overflow-hidden rounded-xl border bg-white shadow-sm">
        <!-- Header -->
        <div class="flex items-center justify-between border-b bg-gray-50/80 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-blue-100 p-2 text-blue-700">
              <i class="fa fa-building"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Edit Department</h2>
          </div>

          <button
            type="button"
            class="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            @click="closeModal"
          >
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-8">
          <div v-if="isLoading" class="flex justify-center py-12">
            <div class="flex items-center gap-3 text-gray-500">
              <i class="fa fa-spinner fa-spin text-xl"></i>
              <span>Loading department data...</span>
            </div>
          </div>

          <div v-else class="space-y-6">
            <!-- Name -->
            <div>
              <label
                for="departmentName"
                class="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Department Name
              </label>
              <input
                id="departmentName"
                v-model="departmentData.name"
                type="text"
                class="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Human Resources"
              />
            </div>

            <!-- Location -->
            <div>
              <label
                for="departmentLocation"
                class="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Location / Address
              </label>
              <textarea
                id="departmentLocation"
                v-model="departmentData.location"
                rows="3"
                class="block w-full rounded-lg border border-gray-700/20 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y transition"
                placeholder="Building name, floor, room number, etc."
              />
            </div>
          </div>
        </div>

        <!-- Footer / Actions -->
        <div class="flex items-center justify-end gap-4 border-t bg-gray-50/60 px-6 py-5">
          <router-link
            to="/departments"
            class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <i class="fa fa-times"></i>
            Cancel
          </router-link>

          <button
            type="button"
            @click="updateDepartment"
            :disabled="isLoading || !departmentData.name.trim()"
            class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span v-if="isLoading">
              <i class="fa fa-spinner fa-spin"></i>
              Saving...
            </span>
            <span v-else>
              <i class="fa fa-check"></i>
              Save Changes
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const departmentData = ref({
  name: '',
  location: ''
})

const isLoading = ref(false)

onMounted(async () => {
  await fetchDepartmentData()
})

async function fetchDepartmentData() {
  isLoading.value = true
  try {
    const res = await axios.get(`/api/departments/${route.params.department_id}`)
    departmentData.value = res.data.data || res.data
  } catch (err) {
    handleError(err)
  } finally {
    isLoading.value = false
  }
}

async function updateDepartment() {
  if (!departmentData.value.name.trim()) {
    toast.warning('Department name is required')
    return
  }

  isLoading.value = true
  try {
    await axios.put(`/api/departments/${route.params.department_id}`, departmentData.value)
    toast.success('Department updated successfully')
    router.push('/departments')
  } catch (err) {
    handleError(err)
  } finally {
    isLoading.value = false
  }
}

function handleError(error) {
  let msg = 'Something went wrong'
  if (error?.response?.data?.message) {
    msg = error.response.data.message
  } else if (error?.message) {
    msg = error.message
  }
  toast.error(msg)
}

function closeModal() {
  router.push('/departments')
}
</script>

<style scoped>
/* Optional: smoother focus ring for accessibility */
input:focus,
textarea:focus {
  outline: none;
  ring: 2px solid theme('colors.blue.500');
}
</style>