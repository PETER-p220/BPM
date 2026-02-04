<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200/70 dark:border-neutral-800">
        
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-white/10 rounded-lg">
              <i class="fas fa-file-signature text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold tracking-tight">Submit Project Update</h2>
              <p class="text-sm text-slate-300 mt-0.5">Add progress update with title(s), description & attachments</p>
            </div>
          </div>
          <router-link
            to="/accntnant-view-update"
            class="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitUpdate" class="p-6 lg:p-8 space-y-7">
          <!-- Multiple Titles -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Update Title(s) <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                @click="addTitle"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
              >
                <i class="fas fa-plus mr-1.5"></i> Add another title
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(title, index) in updateData.titles"
                :key="index"
                class="flex items-center gap-3"
              >
                <input
                  v-model="updateData.titles[index]"
                  type="text"
                  required
                  placeholder="e.g. Completed foundation works – Phase 1"
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
                />
                <button
                  v-if="updateData.titles.length > 1"
                  type="button"
                  @click="removeTitle(index)"
                  class="p-2.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  title="Remove this title"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description / Progress Notes
            </label>
            <textarea
              v-model="updateData.description"
              rows="5"
              placeholder="Describe what was accomplished, challenges faced, next steps, etc..."
              class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all resize-y min-h-[120px]"
            ></textarea>
          </div>

          <!-- Attachments – Two columns on larger screens -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Photo (optional)
              </label>
              <div
                class="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-indigo-500/60 transition-all cursor-pointer group"
                @click="$refs.photoInput.click()"
              >
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                />

                <div v-if="!updateData.update_photo">
                  <i class="fas fa-image text-4xl text-gray-400 dark:text-neutral-600 group-hover:text-indigo-500 transition-colors mb-3"></i>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">
                    <span class="font-medium text-indigo-600 dark:text-indigo-400">Click to upload photo</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                    JPG, PNG • max 5 MB
                  </p>
                </div>

                <div v-else class="flex items-center gap-4 py-2">
                  <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <i class="fas fa-image text-blue-600 dark:text-blue-400 text-2xl"></i>
                  </div>
                  <div class="text-left flex-1">
                    <p class="font-medium text-gray-900 dark:text-white truncate max-w-[240px]">
                      {{ updateData.update_photo.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">
                      {{ (updateData.update_photo.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="updateData.update_photo = null"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- File Upload (PDF / Excel / etc.) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supporting Document (optional)
              </label>
              <div
                class="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-indigo-500/60 transition-all cursor-pointer group"
                @click="$refs.fileInput.click()"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  @change="handleFileUpload"
                />

                <div v-if="!updateData.update_file">
                  <i class="fas fa-file-alt text-4xl text-gray-400 dark:text-neutral-600 group-hover:text-indigo-500 transition-colors mb-3"></i>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">
                    <span class="font-medium text-indigo-600 dark:text-indigo-400">Click to upload file</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                    PDF, Excel, Word • max 10 MB
                  </p>
                </div>

                <div v-else class="flex items-center gap-4 py-2">
                  <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <i class="fas fa-file-pdf text-green-600 dark:text-green-400 text-2xl"></i>
                  </div>
                  <div class="text-left flex-1">
                    <p class="font-medium text-gray-900 dark:text-white truncate max-w-[240px]">
                      {{ updateData.update_file.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">
                      {{ (updateData.update_file.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="updateData.update_file = null"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit / Cancel -->
          <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
            <router-link
              to="/accntnant-view-update"
              class="px-6 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-700 font-medium transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-arrow-left"></i>
              Cancel
            </router-link>

            <button
              type="submit"
              :disabled="isLoading || !canSubmit"
              class="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-w-[180px]"
            >
              <template v-if="isLoading">
                <i class="fas fa-spinner fa-spin"></i>
                Submitting...
              </template>
              <template v-else>
                <i class="fas fa-paper-plane"></i>
                Submit Update
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const updateData = ref({
  titles: [''],
  description: '',
  update_photo: null,
  update_file: null,
})

const isLoading = ref(false)

const canSubmit = computed(() => {
  return updateData.value.titles.every(t => t.trim()) && 
         (updateData.value.description.trim() || updateData.value.update_photo || updateData.value.update_file)
})

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

function handlePhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image must be under 5 MB')
    return
  }

  updateData.value.update_photo = file
}

function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    toast.error('File must be under 10 MB')
    return
  }

  updateData.value.update_file = file
}

async function submitUpdate() {
  if (!canSubmit.value) {
    toast.warning('Please provide at least a title and some content (description or attachment)')
    return
  }

  isLoading.value = true

  try {
    const formData = new FormData()

    // Append titles as array
    updateData.value.titles.forEach((title, i) => {
      if (title.trim()) {
        formData.append(`titles[${i}]`, title.trim())
      }
    })

    if (updateData.value.description.trim()) {
      formData.append('description', updateData.value.description.trim())
    }

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
    router.push('/accntnant-view-update')
  } catch (error) {
    let msg = 'Failed to submit update'

    if (error.response?.data?.message) {
      msg = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      msg = errors.join(' • ')
    }

    toast.error(msg)
  } finally {
    isLoading.value = false
  }
}
</script>