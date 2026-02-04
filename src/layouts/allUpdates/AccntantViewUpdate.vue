<template>
  <div class="min-h-screen bg-gray-50/40 dark:bg-neutral-950 pb-12">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Project Updates
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {{ updates.length }} updates • {{ lastUpdateText }}
          </p>
        </div>

        <router-link to="/accntnant/submit-update">
          <BaseButton
            variant="primary"
            size="md"
            class="whitespace-nowrap shadow-sm hover:shadow-md transition-all"
          >
            <i class="fas fa-plus mr-2"></i>
            Submit New Update
          </BaseButton>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl mx-auto">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-neutral-400"
      >
        <svg class="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium">Loading updates...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="updates.length === 0"
        class="text-center py-24 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700"
      >
        <i class="fas fa-file-signature text-6xl text-gray-300 dark:text-neutral-700 mb-6"></i>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No updates yet
        </h3>
        <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          Start by submitting your first project update
        </p>
        <router-link to="/accntnant/submit-update">
          <BaseButton variant="primary">
            Submit First Update
          </BaseButton>
        </router-link>
      </div>

      <!-- Grid of Update Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="update in updates"
          :key="update.chat_id"
          class="group bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200/70 dark:border-neutral-800 overflow-hidden hover:shadow-md hover:border-indigo-300/50 dark:hover:border-indigo-700/50 transition-all duration-200 cursor-pointer"
          @click="viewUpdateDetails(update.chat_id)"
        >
          <!-- Image / Placeholder -->
          <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-neutral-800">
            <img
              v-if="update.update_photo"
              :src="update.update_photo"
              alt="Update photo"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400 dark:text-neutral-600"
            >
              <i class="fas fa-image text-5xl opacity-40"></i>
            </div>

            <!-- Overlay badge -->
            <div class="absolute top-3 right-3 px-2.5 py-1 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              {{ formatDateShort(update.created_at) }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {{ update.title || 'Untitled Update' }}
            </h3>

            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <i class="fas fa-user-circle"></i>
              <span>{{ update.user_name || 'Unknown' }}</span>
            </div>

            <p
              v-if="update.description"
              class="text-sm text-gray-600 dark:text-neutral-300 line-clamp-3"
            >
              {{ update.description }}
            </p>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800 text-xs text-gray-500 dark:text-neutral-500">
              <span>{{ formatDate(update.created_at) }}</span>

              <div class="flex items-center gap-3">
                <span v-if="update.update_file" class="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                  <i class="fas fa-file-alt"></i>
                  File
                </span>
                <span v-if="update.update_photo" class="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <i class="fas fa-image"></i>
                  Photo
                </span>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
              >
                View Details <i class="fas fa-arrow-right ml-2 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const updates = ref([])
const loading = ref(false)

onMounted(() => {
  fetchUpdates()
})

async function fetchUpdates() {
  loading.value = true
  try {
    const { data } = await axios.get('api/updates')
    updates.value = (data.data || []).map(update => ({
      chat_id: update.chat_id,
      title: update.title,
      user_name: update.user?.name || '—',
      created_at: update.created_at,
      update_photo: update.update_photo,
      description: update.description,
      update_file: update.update_file,
    }))
  } catch (err) {
    console.error(err)
    toast.error('Failed to load project updates')
  } finally {
    loading.value = false
  }
}

function viewUpdateDetails(chat_id) {
  router.push({ name: 'AccntantEditUpdate', params: { chat_id } })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const lastUpdateText = computed(() => {
  if (!updates.value.length) return ''
  const latest = new Date(Math.max(...updates.value.map(u => new Date(u.created_at))))
  const diffDays = Math.floor((Date.now() - latest) / 86400000)
  if (diffDays === 0) return 'Updated today'
  if (diffDays === 1) return 'Updated yesterday'
  return `Last update ${diffDays} days ago`
})
</script>