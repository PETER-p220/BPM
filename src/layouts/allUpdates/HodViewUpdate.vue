<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Updates</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Your submitted progress updates and activity reports
      </p>
    </div>

    <!-- Controls -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search your updates..."
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pl-10 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
        />
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <router-link :to="{ name: 'HodSubmitUpdate' }">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-sm"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Submit New Update
        </button>
      </router-link>
    </div>

    <!-- Loading / Empty State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
      <svg class="h-10 w-10 animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p>Loading your updates...</p>
    </div>

    <div v-else-if="filteredUpdates.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-4 text-lg">{{ filter ? 'No updates found matching your search.' : 'You haven\'t submitted any updates yet.' }}</p>
      <p class="mt-2" v-if="!filter">Click the button above to submit your first progress update.</p>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="update in filteredUpdates"
        :key="update.chat_id"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
        @click="viewUpdateDetails(update.chat_id)"
      >
        <!-- Image / Placeholder -->
        <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          <img
            v-if="update.update_photo"
            :src="update.update_photo"
            alt="Update photo"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 flex flex-col flex-grow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {{ update.title || 'Untitled Update' }}
          </h3>

          <div class="text-sm space-y-1 mb-4">
            <p class="text-gray-600 dark:text-gray-300">
              <span class="font-medium">Date:</span> {{ formatDate(update.created_at) }}
            </p>
          </div>

          <p v-if="update.description" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-grow">
            {{ update.description }}
          </p>

          <div class="flex flex-wrap gap-3 mt-auto">
            <button
              v-if="update.update_file"
              @click.stop.prevent="downloadFile(update.update_file)"
              class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download File
            </button>

            <button
              @click.stop="viewUpdateDetails(update.chat_id)"
              class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div v-if="filteredUpdates.length > 0" class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
      Showing {{ filteredUpdates.length }} of {{ updates.length }} updates
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { saveAs } from 'file-saver'

const router = useRouter()
const toast = useToast()

const updates = ref([])
const loading = ref(false)
const filter = ref('')

onMounted(async () => {
  await fetchUpdates()
})

async function fetchUpdates() {
  loading.value = true
  try {
    const response = await axios.get('/api/my/updates') // Correct endpoint for user's updates
    updates.value = (response.data.data || []).map(update => ({
      chat_id: update.chat_id,
      title: update.title || 'Untitled Update',
      created_at: update.created_at,
      update_photo: update.update_photo,
      description: update.description || '',
      update_file: update.update_file,
    }))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load your updates')
  } finally {
    loading.value = false
  }
}

function viewUpdateDetails(chat_id) {
  router.push({ name: 'HodEditUpdate', params: { chat_id } })
}

async function downloadFile(url) {
  if (!url) return
  try {
    const response = await axios.get(url, { responseType: 'blob' })
    const filename = url.split('/').pop() || 'update-file'
    saveAs(response.data, filename)
    toast.success('Download started')
  } catch (err) {
    toast.error('Could not download file')
  }
}

const filteredUpdates = computed(() => {
  if (!filter.value.trim()) return updates.value
  
  const term = filter.value.toLowerCase()
  return updates.value.filter(update =>
    update.title?.toLowerCase().includes(term) ||
    update.description?.toLowerCase().includes(term)
  )
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleImageError(e) {
  e.target.src = '/placeholder-image.jpg' // optional fallback
  e.target.alt = 'Image failed to load'
}
</script>