<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Submit Update
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Share your latest project update or announcement
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

      <!-- Form Card -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div class="border-b border-gray-200 bg-gray-50 px-6 py-5 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            New Update
          </h2>
        </div>

        <form @submit.prevent="submitUpdate" class="p-6 lg:p-8 space-y-8">
          <!-- Multiple Titles -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Title(s) <span class="text-red-500">*</span>
            </label>

            <div class="space-y-3">
              <div
                v-for="(title, index) in updateData.titles"
                :key="index"
                class="flex items-center gap-3"
              >
                <input
                  v-model="updateData.titles[index]"
                  type="text"
                  placeholder="Enter update title..."
                  required
                  class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all"
                />
                <button
                  v-if="updateData.titles.length > 1"
                  type="button"
                  @click="removeTitle(index)"
                  class="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                  title="Remove title"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                @click="addTitle"
                class="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Another Title
              </button>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="updateData.description"
              rows="5"
              placeholder="Provide details about this update..."
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all resize-y"
            ></textarea>
          </div>

          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Photo (optional)
            </label>
            <div class="flex items-center gap-4">
              <label
                class="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                />
              </label>

              <span class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                {{ photoFileName || 'No file selected' }}
              </span>
            </div>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update File (PDF, Excel, etc. – optional)
            </label>
            <div class="flex items-center gap-4">
              <label
                class="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Choose File
                <input
                  type="file"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </label>

              <span class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                {{ fileName || 'No file selected' }}
              </span>
            </div>
          </div>

          <!-- Submit / Cancel -->
          <div class="flex flex-col gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:justify-end">
            <router-link
              to="/user/update"
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
              <span>{{ isLoading ? 'Submitting...' : 'Submit Update' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const updateData = ref({
  titles: [''],
  description: '',
  update_photo: null,
  update_file: null
})

const isLoading = ref(false)
const photoFileName = ref('')
const fileName = ref('')

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    updateData.value.update_photo = file
    photoFileName.value = file.name
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    updateData.value.update_file = file
    fileName.value = file.name
  }
}

function addTitle() {
  updateData.value.titles.push('')
}

function removeTitle(index) {
  if (updateData.value.titles.length > 1) {
    updateData.value.titles.splice(index, 1)
  } else {
    toast.warning('At least one title is required')
  }
}

async function submitUpdate() {
  // Validation
  if (updateData.value.titles.some(t => !t.trim())) {
    toast.error('All titles must be filled')
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()

    // Append titles as array
    updateData.value.titles.forEach((title, index) => {
      formData.append(`titles[${index}]`, title.trim())
    })

    formData.append('description', updateData.value.description.trim())

    if (updateData.value.update_photo) {
      formData.append('update_photo', updateData.value.update_photo)
    }
    if (updateData.value.update_file) {
      formData.append('update_file', updateData.value.update_file)
    }

    const response = await axios.post('api/updates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.success(response.data.message || 'Update submitted successfully')
    router.push('/user/update')
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to submit update'
    toast.error(msg)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  router.push('/user/update')
}
</script>

<style scoped>
/* Smooth focus rings */
input:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* File name truncate */
.truncate {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>