<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header + Action -->
      <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            My Updates
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            View and manage your submitted updates
          </p>
        </div>

        <router-link to="/submit-update">
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-95"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Submit New Update
          </button>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading updates...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!updates.length"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">
          No updates yet
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Start by submitting your first update
        </p>
      </div>

      <!-- Grid of Update Cards -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="update in paginatedUpdates"
          :key="update.chat_id"
          class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900"
          @click="viewUpdateDetails(update.chat_id)"
        >
          <!-- Image / Placeholder -->
          <div class="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              v-if="update.update_photo"
              :src="update.update_photo"
              alt="Update photo"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-gray-400 dark:text-gray-600"
            >
              <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ update.title || 'Untitled Update' }}
            </h3>

            <div class="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ update.user_name || 'Unknown' }}</span>
            </div>

            <div class="mb-4 text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(update.created_at) }}
            </div>

            <p v-if="update.description" class="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
              {{ update.description }}
            </p>

            <!-- File Indicator -->
            <div v-if="update.update_file" class="mb-4 flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>File attached</span>
            </div>

            <!-- Action -->
            <button
              class="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              View Details
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination (only if more than one page) -->
      <div v-if="totalPages > 1" class="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Showing
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ (currentPage - 1) * itemsPerPage + 1 }} – {{ Math.min(currentPage * itemsPerPage, updates.length) }}
          </span>
          of
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ updates.length }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 12 // more items per page for grid layout

onMounted(async () => {
  await fetchUpdates()
})

async function fetchUpdates() {
  try {
    const response = await axios.get('api/my/updates')
    if (response.data.data) {
      updates.value = response.data.data.map(u => ({
        chat_id: u.chat_id,
        title: u.title,
        user_name: u.user?.name || 'Unknown',
        created_at: u.created_at,
        update_photo: u.update_photo,
        description: u.description,
        update_file: u.update_file
      }))
    }
  } catch (err) {
    toast.error('Failed to load your updates')
    console.error(err)
  }
}

function viewUpdateDetails(chat_id) {
  router.push({ name: 'EditUserUpdate', params: { chat_id } })
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filteredUpdates = computed(() => {
  if (!filter.value.trim()) return updates.value
  const term = filter.value.toLowerCase()
  return updates.value.filter(u =>
    (u.title || '').toLowerCase().includes(term) ||
    (u.user_name || '').toLowerCase().includes(term) ||
    (u.description || '').toLowerCase().includes(term)
  )
})

const paginatedUpdates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUpdates.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredUpdates.value.length / itemsPerPage) || 1)

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, 5]
  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [current - 2, current - 1, current, current + 1, current + 2].filter(p => p >= 1 && p <= total)
})
</script>

<style scoped>
/* Card hover lift */
.group:hover {
  transform: translateY(-4px);
}

/* Image aspect ratio fix */
.aspect-\[4\/3\] {
  aspect-ratio: 4 / 3;
}
</style>