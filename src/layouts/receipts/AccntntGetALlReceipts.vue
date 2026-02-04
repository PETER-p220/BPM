<template>
  <div class="min-h-screen bg-gray-50/40 dark:bg-neutral-950 pb-12">
    <!-- Sticky Header + Actions -->
    <div class="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Receipts
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {{ filteredReceipts.length }} receipts found
          </p>
        </div>

        <div class="flex items-center gap-4 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-none sm:w-72">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400 dark:text-neutral-500"></i>
            </span>
            <input
              v-model="filter"
              type="search"
              placeholder="Search receipts..."
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl mx-auto">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-neutral-400"
      >
        <svg class="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium">Loading receipts...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredReceipts.length === 0"
        class="text-center py-24 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700"
      >
        <i class="fas fa-receipt text-6xl text-gray-300 dark:text-neutral-700 mb-6"></i>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No receipts found
        </h3>
        <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          {{ filter ? 'Try adjusting your search' : 'No receipts have been submitted yet' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-gray-200/70 dark:border-neutral-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
            <thead class="bg-gray-50/70 dark:bg-neutral-800/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider w-16">No</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Submitted By</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Receipt File</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Submitted At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              <tr
                v-for="(receipt, index) in paginatedReceipts"
                :key="receipt.receipt_id"
                class="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40 transition-colors group"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {{ receipt.user_name || '—' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-neutral-300 max-w-md truncate">
                  {{ receipt.description || 'No description' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="receipt.receipt_file"
                    @click="downloadReceipt(receipt.receipt_file, receipt.description || 'receipt')"
                    class="inline-flex items-center px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition font-medium"
                  >
                    <i class="fas fa-download mr-2"></i>
                    Download Receipt
                  </button>
                  <span v-else class="text-gray-400 dark:text-neutral-600 italic">No file</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                  {{ formatDate(receipt.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
          <div class="text-sm text-gray-500 dark:text-neutral-400">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>–
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredReceipts.length) }}</span> of
            <span class="font-medium">{{ filteredReceipts.length }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition"
            >
              <i class="fas fa-chevron-left mr-1.5"></i> Prev
            </button>

            <button
              :disabled="currentPage * itemsPerPage >= filteredReceipts.length"
              @click="changePage(currentPage + 1)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition"
            >
              Next <i class="fas fa-chevron-right ml-1.5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { saveAs } from 'file-saver'
import { useToast } from 'vue-toastification'

const toast = useToast()

const receipts = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

onMounted(() => {
  fetchReceipts()
})

async function fetchReceipts() {
  loading.value = true
  try {
    const { data } = await axios.get('api/receipts')
    receipts.value = data.data || []
  } catch (err) {
    console.error(err)
    toast.error('Failed to load receipts')
  } finally {
    loading.value = false
  }
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

async function downloadReceipt(url, description = 'receipt') {
  if (!url) {
    toast.warning('No receipt file available')
    return
  }

  try {
    const response = await axios.get(url, { responseType: 'blob' })

    const contentType = response.headers['content-type'] || ''
    const extension = contentType.includes('pdf') ? 'pdf' :
                      contentType.includes('image') ? 'jpg' : 'file'

    const safeName = description
      .replace(/[^a-z0-9]/gi, '_')
      .substring(0, 40) || 'receipt'

    const fileName = `${safeName}_${new Date().toISOString().slice(0,10)}.${extension}`

    saveAs(response.data, fileName)
    toast.success('Download started')
  } catch (err) {
    console.error('Download failed:', err)
    toast.error('Could not download receipt. File may be unavailable.')
  }
}

const filteredReceipts = computed(() => {
  if (!filter.value.trim()) return receipts.value

  const term = filter.value.toLowerCase()
  return receipts.value.filter(r =>
    (r.user_name || '').toLowerCase().includes(term) ||
    (r.description || '').toLowerCase().includes(term) ||
    (r.created_at || '').toLowerCase().includes(term)
  )
})

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredReceipts.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredReceipts.value.length / itemsPerPage)) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>