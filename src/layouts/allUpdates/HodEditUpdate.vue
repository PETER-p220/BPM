<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Update Details
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            View and edit your submitted progress update
          </p>
        </div>

        <button
          @click="showModal = true"
          class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Update
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <svg class="h-12 w-12 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-5 text-gray-600 dark:text-gray-400">Loading update details...</p>
      </div>

      <!-- Not Found -->
      <div v-else-if="!chat && !loading" class="text-center py-24">
        <svg class="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-6 text-xl font-medium text-gray-900 dark:text-gray-100">Update not found</h3>
        <p class="mt-3 text-gray-600 dark:text-gray-400">The requested update could not be loaded.</p>
      </div>

      <!-- Main Content -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <!-- Photo -->
        <div class="relative w-full h-80 sm:h-96 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <img
            v-if="chat.update_photo"
            :src="chat.update_photo"
            alt="Update photo"
            class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            @error="handleImageError"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg class="h-24 w-24 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Details -->
        <div class="p-6 sm:p-8 space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ chat.title || 'Untitled Update' }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Submitted on {{ formatDate(chat.created_at) }}
            </p>
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {{ chat.description || 'No description provided.' }}
            </p>
          </div>

          <div v-if="chat.update_file" class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              :href="chat.update_file"
              target="_blank"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Attached File
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 sm:p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Edit Update
            </h2>
            <button
              @click="showModal = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveChanges" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="6"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition resize-y"
                placeholder="Update details, observations, challenges, next steps..."
              ></textarea>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="showModal = false"
                class="flex-1 py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isLoading || !form.title.trim()"
                class="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const chat_id = route.params.chat_id
const chat = ref(null)
const loading = ref(true)
const showModal = ref(false)
const isLoading = ref(false)

const form = reactive({
  title: '',
  description: '',
})

onMounted(async () => {
  await fetchChatDetails()
})

async function fetchChatDetails() {
  loading.value = true
  try {
    const res = await axios.get(`/api/updates/${chat_id}`)
    if (res.data.status === 'success') {
      const data = res.data.data
      chat.value = {
        update_photo: data.update_photo,
        title: data.title || 'Untitled',
        created_at: data.created_at,
        description: data.description || '',
      }
      // Initialize form
      form.title = chat.value.title
      form.description = chat.value.description
    } else {
      toast.error(res.data.message || 'Update not found')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to load update')
  } finally {
    loading.value = false
  }
}

async function saveChanges() {
  if (!form.title.trim()) {
    toast.warning('Title is required')
    return
  }

  isLoading.value = true

  try {
    const res = await axios.put(`/api/updates/${chat_id}`, {
      title: form.title.trim(),
      description: form.description.trim(),
    })

    if (res.data.status === 'success') {
      toast.success('Update saved successfully')
      chat.value.title = form.title
      chat.value.description = form.description
      showModal.value = false
    } else {
      toast.error(res.data.message || 'Failed to save')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error saving update')
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleImageError(e) {
  e.target.src = '/img/placeholder-wide.jpg' // fallback
}
</script>