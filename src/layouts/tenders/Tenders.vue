<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header Section -->
    <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tender Management</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ filteredTenders.length }} {{ filteredTenders.length === 1 ? 'record' : 'records' }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Search -->
            <div class="relative w-full sm:w-80">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model.trim="filter"
                type="search"
                placeholder="Search by title, number, entity..."
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>

            <!-- Export Buttons -->
            <div class="flex items-center gap-2">
              <button
                @click="exportToExcel"
                :disabled="loading || !filteredTenders.length"
                class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>

              <button
                @click="exportToPDF"
                :disabled="loading || !filteredTenders.length"
                class="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>

              <!-- New Tender Button -->
              <router-link to="/create-tender">
                <button
                  class="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Tender
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p class="text-lg font-medium">Loading tenders...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && filteredTenders.length === 0"
        class="bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center"
      >
        <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 7.414V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tenders found</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ filter.trim() ? 'Try adjusting your search' : 'Start by registering a new tender' }}
        </p>
        <div class="mt-6">
          <router-link to="/create-tender">
            <button class="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Register New Tender
            </button>
          </router-link>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">No</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Number</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Entity</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Document</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Published</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Submission</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Created</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
              <tr
                v-for="(tender, index) in paginatedTenders"
                :key="tender.tender_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {{ startIndex + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xl truncate">
                  {{ tender.title || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  {{ tender.tender_type || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                  {{ tender.tender_number || '—' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate hidden lg:table-cell">
                  {{ tender.procurement_entity || '—' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                    v-if="tender.attachment"
                    @click="downloadTenderPdf(tender.attachment, tender.title)"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                    title="Download tender document"
                  >
                    <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <span v-else class="text-gray-400 dark:text-gray-600">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  {{ formatDate(tender.date_of_Publication) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  {{ formatDate(tender.bid_submission) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getExpirationClasses(tender.expired_at)"
                    class="inline-flex px-3 py-1 text-xs font-medium rounded-full border"
                  >
                    {{ formatDate(tender.expired_at) || '—' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  {{ formatDate(tender.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-4">
                    <button
                      @click="viewTender(tender.tender_id)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                      title="View / Edit"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <button
                      v-if="tender.attachment"
                      @click="downloadTenderPdf(tender.attachment, tender.title)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition"
                      title="Download"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing
            <span class="font-medium text-gray-900 dark:text-white">
              {{ startIndex + 1 }}–{{ Math.min(startIndex + itemsPerPage, filteredTenders.length) }}
            </span>
            of
            <span class="font-medium text-gray-900 dark:text-white">{{ filteredTenders.length }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
            >
              Previous
            </button>

            <span class="px-4 py-2 font-medium text-gray-900 dark:text-white">
              Page {{ currentPage }} of {{ Math.ceil(filteredTenders.length / itemsPerPage) || 1 }}
            </span>

            <button
              :disabled="currentPage * itemsPerPage >= filteredTenders.length"
              @click="changePage(currentPage + 1)"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const tenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 12
const loading = ref(false)

onMounted(() => {
  fetchTenders()
})

async function fetchTenders() {
  loading.value = true
  try {
    const { data } = await axios.get('/api/tenders')
    tenders.value = data.data || []
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to load tenders')
  } finally {
    loading.value = false
  }
}

const filteredTenders = computed(() => {
  if (!filter.value.trim()) return tenders.value

  const term = filter.value.toLowerCase().trim()
  return tenders.value.filter(t =>
    [
      t.title,
      t.tender_type,
      t.tender_number,
      t.procurement_entity,
      t.tender_source,
      t.procurement_method,
      t.submission_mode,
      t.bid_currency
    ].some(v => v?.toString().toLowerCase().includes(term))
  )
})

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTenders.value.slice(start, start + itemsPerPage)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getExpirationClasses(expiredAt) {
  if (!expiredAt) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700'

  const exp = new Date(expiredAt)
  const now = new Date()
  const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800/50'
  if (daysLeft <= 7) return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
  return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
}

function changePage(page) {
  const maxPage = Math.ceil(filteredTenders.value.length / itemsPerPage)
  if (page < 1 || page > maxPage) return
  currentPage.value = page
}

function viewTender(id) {
  router.push({ name: 'EditTender', params: { tender_id: id } })
}

// ──────────────────────────────────────────────
//               EXPORT FUNCTIONS
// ──────────────────────────────────────────────

function exportToExcel() {
  if (!filteredTenders.value.length) {
    toast.warning('No data to export')
    return
  }

  const rows = filteredTenders.value.map((t, i) => ({
    No: i + 1,
    Title: t.title || '—',
    Type: t.tender_type || '—',
    Number: t.tender_number || '—',
    Entity: t.procurement_entity || '—',
    'File Available': t.attachment ? 'Yes' : 'No',
    Published: formatDate(t.date_of_Publication),
    Submission: formatDate(t.bid_submission),
    Deadline: formatDate(t.expired_at),
    Created: formatDate(t.created_at)
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tenders')
  XLSX.writeFile(wb, `Tenders_Report_${new Date().toISOString().split('T')[0]}.xlsx`)

  toast.success('Excel file exported')
}

function exportToPDF() {
  if (!filteredTenders.value.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Tender Management Report', 14, 22)

  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

  autoTable(doc, {
    head: [['No', 'Title', 'Type', 'Number', 'Entity', 'File', 'Published', 'Submission', 'Deadline', 'Created']],
    body: filteredTenders.value.map((t, i) => [
      i + 1,
      t.title || '—',
      t.tender_type || '—',
      t.tender_number || '—',
      t.procurement_entity || '—',
      t.attachment ? 'Yes' : 'No',
      formatDate(t.date_of_Publication),
      formatDate(t.bid_submission),
      formatDate(t.expired_at),
      formatDate(t.created_at)
    ]),
    startY: 38,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 246, 255] },
    margin: { top: 38 }
  })

  doc.save(`Tenders_Report_${new Date().toISOString().split('T')[0]}.pdf`)
  toast.success('PDF file exported')
}

async function downloadTenderPdf(url, title = 'tender') {
  if (!url) return toast.warning('No document available')

  try {
    const response = await axios.get(url, { responseType: 'blob' })
    const extension = url.split('.').pop()?.split(/[\?#]/)[0] || 'pdf'
    const safeName = (title || 'tender').replace(/[^a-z0-9]/gi, '_').substring(0, 50)
    const filename = `${safeName}_tender.${extension}`

    saveAs(response.data, filename)
    toast.success('Download started')
  } catch (err) {
    toast.error('Failed to download document')
  }
}
</script>
