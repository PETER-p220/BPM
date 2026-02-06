<template>
  <div class="p-6 min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-3xl mx-auto">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-800 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="fas fa-plus text-lg"></i>
            <h2 class="text-xl font-semibold">Create Project Extension</h2>
          </div>
          <button
            @click="closeModal"
            class="text-gray-300 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
            title="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6">
          <form @submit.prevent="createProjectExtension" class="space-y-6">
            <!-- Project Selection -->
            <div>
              <label for="project" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Project <span class="text-red-500">*</span>
              </label>
              <select
                id="project"
                v-model="requestData.project_id"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="">-- Select a project --</option>
                <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                  {{ project.project_name }}
                </option>
              </select>
            </div>

            <!-- Extended Date -->
            <div>
              <label for="extendedDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Extended Date <span class="text-red-500">*</span>
              </label>
              <input
                id="extendedDate"
                type="date"
                v-model="requestData.extended_date"
                :min="tomorrow"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be a future date
              </p>
            </div>

            <!-- File Upload -->
            <div>
              <label for="extendLetterFile" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Extension Letter (PDF, max 2MB) <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center justify-center w-full">
                <label
                  for="extendLetterFile"
                  class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      class="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      PDF file only (max 2MB)
                    </p>
                  </div>
                  <input
                    id="extendLetterFile"
                    type="file"
                    class="hidden"
                    accept="application/pdf"
                    @change="handleFileUpload"
                  />
                </label>
              </div>

              <!-- Selected file name -->
              <div v-if="requestData.extend_letter_file" class="mt-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i class="fas fa-file-pdf text-red-500"></i>
                <span class="truncate max-w-xs">{{ requestData.extend_letter_file.name }}</span>
                <button
                  @click="clearFile"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isLoading"
                class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
              >
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin"></i> Creating...
                </span>
                <span v-else>
                  <i class="fas fa-plus mr-2"></i> Save Extension
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const requestData = ref({
  project_id: '',
  extended_date: '',
  extend_letter_file: null
})

const projects = ref([])
const isLoading = ref(false)

// Min date = tomorrow
const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

onMounted(async () => {
  await fetchProjects()
})

async function fetchProjects() {
  try {
    const response = await axios.get('/api/dropdown/projects')
    if (response.data.status && Array.isArray(response.data.data)) {
      projects.value = response.data.data
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load projects')
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed')
    event.target.value = ''
    return
  }

  // Validate file size (2MB = 2 * 1024 * 1024 bytes)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File size must not exceed 2MB')
    event.target.value = ''
    return
  }

  requestData.value.extend_letter_file = file
}

function clearFile() {
  requestData.value.extend_letter_file = null
  // Reset file input
  const fileInput = document.getElementById('extendLetterFile')
  if (fileInput) fileInput.value = ''
}

async function createProjectExtension() {
  isLoading.value = true

  // Basic client-side validation
  if (!requestData.value.project_id) {
    toast.error('Please select a project')
    isLoading.value = false
    return
  }

  if (!requestData.value.extended_date) {
    toast.error('Please select an extended date')
    isLoading.value = false
    return
  }

  if (!requestData.value.extend_letter_file) {
    toast.error('Please upload the extension letter (PDF)')
    isLoading.value = false
    return
  }

  const formData = new FormData()
  formData.append('project_id', requestData.value.project_id)
  formData.append('extended_date', requestData.value.extended_date)
  formData.append('extend_letter_file', requestData.value.extend_letter_file)

  try {
    const response = await axios.post('/api/project-extension', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.status) {
      toast.success(response.data.message || 'Project extension created successfully')
      router.push('/extended-project')
    } else {
      toast.error(response.data.message || 'Failed to create extension')
    }
  } catch (error) {
    let message = 'An error occurred while creating the extension'
    if (error.response?.data?.message) {
      message = error.response.data.message
    } else if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join(' ')
    }
    toast.error(message)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  router.push('/extended-project')
}
</script>