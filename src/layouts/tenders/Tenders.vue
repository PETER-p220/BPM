<template>
  <div class="min-h-screen bg-gray-50/40 dark:bg-neutral-950 pb-12">
    <!-- Header + Actions -->
    <div class="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Tenders
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {{ filteredTenders.length }} tenders found
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <label class="relative flex items-center">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400 dark:text-neutral-500"></i>
            </span>
            <input
              v-model="filter"
              type="search"
              placeholder="Search tenders..."
              class="pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition w-full sm:w-72"
            />
          </label>

          <router-link to="/create-tender">
            <BaseButton
              variant="primary"
              size="md"
              class="whitespace-nowrap shadow-sm hover:shadow-md transition-all"
            >
              <i class="fas fa-plus mr-2 text-base"></i>
              Register New Tender
            </BaseButton>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl mx-auto">
      <!-- Loading / Empty / Table -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-neutral-400"
      >
        <svg class="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium">Loading tenders...</p>
      </div>

      <div
        v-else-if="filteredTenders.length === 0"
        class="text-center py-24 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700"
      >
        <i class="fas fa-file-contract text-6xl text-gray-300 dark:text-neutral-700 mb-6"></i>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No tenders found
        </h3>
        <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          {{ filter ? 'Try adjusting your search terms' : 'Get started by registering a new tender' }}
        </p>
        <BaseButton v-if="!filter" variant="primary" @click="$router.push('/create-tender')">
          Register First Tender
        </BaseButton>
      </div>

      <div v-else class="bg-white dark:bg-neutral-900 shadow-sm rounded-xl border border-gray-200/70 dark:border-neutral-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
            <thead class="bg-gray-50/70 dark:bg-neutral-800/50">
              <tr>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider w-14">No</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Title</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Source</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Type</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Number</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Entity</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">File</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Published</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Submission</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Deadline</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Created</th>
                <th class="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider w-28">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              <tr
                v-for="(tender, index) in paginatedTenders"
                :key="tender.tender_id"
                class="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40 transition-colors group"
              >
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                  {{ tender.title }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                  {{ tender.tender_source || '—' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                  {{ tender.tender_type || '—' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-neutral-300">
                  {{ tender.tender_number || '—' }}
                </td>
                <td class="px-5 py-4 text-sm text-gray-600 dark:text-neutral-300 max-w-xs truncate">
                  {{ tender.procurement_entity || '—' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="tender.attachment"
                    @click="downloadTenderPdf(tender.attachment, tender.title)"
                    class="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition"
                  >
                    <i class="fas fa-file-pdf mr-1.5"></i> PDF
                  </button>
                  <span v-else class="text-gray-400 dark:text-neutral-600">—</span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                  {{ formatDate(tender.date_of_Publication) }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                  {{ formatDate(tender.bid_submission) }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="getExpirationClasses(tender.expired_at)"
                  >
                    {{ formatDate(tender.expired_at, true) }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                  {{ formatDate(tender.created_at) }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewTender(tender.tender_id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3 transition"
                    title="View details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="tender.attachment"
                    @click="downloadTenderPdf(tender.attachment, tender.title)"
                    class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition"
                    title="Download attachment"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
          <div class="text-sm text-gray-500 dark:text-neutral-400">
            Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }}</span> of
            <span class="font-medium">{{ filteredTenders.length }}</span> tenders
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i class="fas fa-chevron-left mr-1"></i> Prev
            </button>

            <button
              :disabled="currentPage * itemsPerPage >= filteredTenders.length"
              @click="changePage(currentPage + 1)"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next <i class="fas fa-chevron-right ml-1"></i>
            </button>
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
import { saveAs } from 'file-saver'

const router = useRouter()
const toast = useToast()

const tenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

onMounted(() => {
  fetchTenders()
})

async function fetchTenders() {
  loading.value = true
  try {
    const { data } = await axios.get('api/tenders')
    tenders.value = data.data || []
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to load tenders')
  } finally {
    loading.value = false
  }
}

const filteredTenders = computed(() => {
  if (!filter.value.trim()) return tenders.value

  const term = filter.value.toLowerCase()
  return tenders.value.filter(t =>
    Object.values(t).some(v =>
      String(v ?? '').toLowerCase().includes(term)
    )
  )
})

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTenders.value.slice(start, start + itemsPerPage)
})

function formatDate(dateStr, withTime = false) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime && { hour: '2-digit', minute: '2-digit' })
  })
}

function getExpirationClasses(expiredAt) {
  if (!expiredAt) return 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'

  const daysLeft = Math.ceil((new Date(expiredAt) - new Date()) / 86400000)

  if (daysLeft < 0)   return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50'
  if (daysLeft <= 3)  return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 animate-pulse-slow'
  if (daysLeft <= 7)  return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredTenders.value.length / itemsPerPage)) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function viewTender(id) {
  router.push({ name: 'EditTender', params: { tender_id: id } })
  // or use different route name like 'TenderDetail' if you have a view page
}

async function downloadTenderPdf(url, title = 'tender') {
  if (!url) return
  try {
    const response = await axios.get(url, { responseType: 'blob' })
    const fileName = `${title.replace(/\s+/g, '_')}_tender.pdf`
    saveAs(response.data, fileName)
  } catch (err) {
    toast.error('Could not download file. File may be unavailable.')
  }
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>