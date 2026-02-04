<template>
  <div class="create-department py-8 md:py-12 bg-gray-50 min-h-screen">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Card -->
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="bg-slate-800 px-6 py-5 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <i class="fas fa-building text-xl"></i>
            </div>
            <h2 class="text-xl font-semibold">Create New Department</h2>
          </div>

          <router-link
            to="/departments"
            class="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <i class="fas fa-times text-lg"></i>
          </router-link>
        </div>

        <!-- Form Body -->
        <div class="p-6 md:p-8">
          <p class="text-gray-600 mb-8">
            Add a new department by providing its name and location.
          </p>

          <form @submit.prevent="addDepartment" class="space-y-6">
            <!-- Department Name -->
            <div>
              <label for="name" class="form-label">
                Department Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="newDepartmentData.name"
                type="text"
                class="form-input"
                placeholder="e.g. Finance, Human Resources, IT..."
                required
                maxlength="100"
              />
            </div>

            <!-- Location -->
            <div>
              <label for="location" class="form-label">
                Location <span class="text-red-500">*</span>
              </label>
              <input
                id="location"
                v-model="newDepartmentData.location"
                type="text"
                class="form-input"
                placeholder="e.g. Headquarters, Dar es Salaam Branch..."
                required
                maxlength="150"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                class="btn-primary flex-1 flex items-center justify-center gap-2"
                :disabled="isLoading || !isFormValid"
              >
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin"></i> Saving...
                </span>
                <span v-else>
                  <i class="fas fa-save"></i> Save Department
                </span>
              </button>

              <router-link
                to="/departments"
                class="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <i class="fas fa-times"></i> Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

const newDepartmentData = ref({
  name: '',
  location: ''
})

const isLoading = ref(false)

const isFormValid = computed(() => {
  return (
    newDepartmentData.value.name.trim().length > 0 &&
    newDepartmentData.value.location.trim().length > 0
  )
})

async function addDepartment() {
  if (!isFormValid.value) {
    toast.warning('Please fill in all required fields')
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('/api/departments', newDepartmentData.value)

    toast.success(response.data.message || 'Department created successfully')

    // Reset form
    newDepartmentData.value = { name: '', location: '' }

    // Redirect to departments list
    router.push('/departments')
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred'

  if (error.response?.data?.message) {
    message = error.response.data.message
  } else if (error.response?.data?.errors) {
    // Laravel validation errors
    message = Object.values(error.response.data.errors).flat().join(' • ')
  } else if (error.response?.status === 422) {
    message = 'Validation failed. Please check your input.'
  } else if (error.request) {
    message = 'No response from server. Please check your connection.'
  } else {
    message = error.message
  }

  toast.error(message)
}
</script>

<style scoped>
/* Form Controls */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}

.form-input {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-4 transition-colors;
}

.form-input:focus {
  @apply border-blue-500 ring-1 ring-blue-500 ring-opacity-30;
}

/* Buttons */
.btn-primary {
  @apply bg-slate-800 text-white font-medium rounded-lg py-2.5 px-6 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 font-medium rounded-lg py-2.5 px-6 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all;
}

/* Page Layout */
.create-department {
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}
</style>