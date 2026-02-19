<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header + Controls -->
      <div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            My Updates
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your submitted progress updates
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Export Buttons -->
          <button
            @click="exportToExcel"
            :disabled="loading || !updates.length"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>

          <button
            @click="exportToPDF"
            :disabled="loading || !updates.length"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>

          <!-- Submit New -->
          <router-link to="/user/submit-update">
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Submit Update
            </button>
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex min-h-[50vh] items-center justify-center">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-500"></div>
          <p class="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading your updates...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!updates.length"
        class="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div class="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <svg class="h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
          No updates submitted yet
        </h3>
        <p class="mt-3 max-w-md text-gray-600 dark:text-gray-400">
          Once you submit progress updates, they will appear here for easy tracking and review.
        </p>
        <router-link to="/submit-update" class="mt-8 inline-block">
          <button class="rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
            Submit Your First Update
          </button>
        </router-link>
      </div>

      <!-- Updates Grid -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="update in paginatedUpdates"
          :key="update.chat_id"
          class="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
          @click="viewUpdateDetails(update.chat_id)"
        >
          <!-- Image / Media -->
          <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              v-if="update.update_photo"
              :src="update.update_photo"
              alt="Update photo"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-gray-400 dark:text-gray-600"
            >
              <svg class="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- File Badge -->
            <div
              v-if="update.update_file"
              class="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              File
            </div>
          </div>

          <!-- Card Content -->
          <div class="flex flex-1 flex-col p-5">
            <h3 class="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ update.title || 'Untitled Update' }}
            </h3>

            <div class="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ update.user_name || 'You' }}</span>
            </div>

            <div class="mb-4 text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(update.created_at) }}
            </div>

            <p v-if="update.description" class="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {{ update.description }}
            </p>

            <!-- View Button -->
            <div class="mt-auto">
              <button
                class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                View Details
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ startIndex + 1 }} – {{ Math.min(startIndex + itemsPerPage, filteredUpdates.length) }}
          </span>
          of
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ filteredUpdates.length }}</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
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
              'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage >= totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
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
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const updates = ref([])
const currentPage = ref(1)
const itemsPerPage = 12
const loading = ref(false)

onMounted(async () => {
  await fetchUpdates()
})

async function fetchUpdates() {
  loading.value = true
  try {
    const { data } = await axios.get('/my/updates')
    if (data.data) {
      updates.value = data.data.map(u => ({
        chat_id: u.chat_id,
        title: u.title,
        user_name: u.user?.name || 'You',
        created_at: u.created_at,
        update_photo: u.update_photo,
        description: u.description,
        update_file: u.update_file
      }))
    }
  } catch (err) {
    toast.error('Could not load your updates')
  } finally {
    loading.value = false
  }
}

function viewUpdateDetails(chat_id) {
  router.push({ name: 'EditUserUpdate', params: { chat_id } })
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

const filteredUpdates = computed(() => updates.value) // add filter later if needed

const paginatedUpdates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUpdates.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredUpdates.value.length / itemsPerPage) || 1)

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (cur <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (cur >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', cur - 1, cur, cur + 1, '…', total].filter(p => p !== '…' || p === '…')
})

// ──────────────────────────────────────────────
//               EXPORT FUNCTIONS
// ──────────────────────────────────────────────

function exportToExcel() {
  if (!updates.value.length) {
    toast.info('No updates to export')
    return
  }

  const rows = updates.value.map((u, i) => ({
    No: i + 1,
    Title: u.title || '—',
    Description: u.description || '—',
    'Has Photo': u.update_photo ? 'Yes' : 'No',
    'Has File': u.update_file ? 'Yes' : 'No',
    Submitted: formatDate(u.created_at)
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'My Updates')
  XLSX.writeFile(wb, `My_Updates_${new Date().toISOString().split('T')[0]}.xlsx`)

  toast.success('Exported to Excel')
}

function exportToPDF() {
  if (!updates.value.length) {
    toast.info('No updates to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('My Submitted Updates', 14, 22)

  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

  autoTable(doc, {
    head: [['No', 'Title', 'Description', 'Photo', 'File', 'Submitted']],
    body: updates.value.map((u, i) => [
      i + 1,
      u.title || '—',
      u.description?.substring(0, 120) + (u.description?.length > 120 ? '...' : '') || '—',
      u.update_photo ? 'Yes' : 'No',
      u.update_file ? 'Yes' : 'No',
      formatDate(u.created_at)
    ]),
    startY: 38,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 246, 255] }
  })

  doc.save(`My_Updates_${new Date().toISOString().split('T')[0]}.pdf`)
  toast.success('Exported to PDF')
}
</script>

<style scoped>
/* Card hover lift + shadow */
.group:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Image hover zoom */
img {
  transition: transform 0.7s ease;
}
</style>