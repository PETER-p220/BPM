<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tenders Management</h1>
            <p class="text-sm text-gray-600 mt-1">View and manage all tender listings</p>
          </div>

          <!-- Export Controls -->
          <div class="flex items-center gap-3 flex-wrap">
            <button
              @click="exportToPDF"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm font-medium"
              :disabled="isExporting"
            >
              <i class="fas fa-file-pdf"></i>
              <span>Export PDF</span>
            </button>

            <button
              @click="exportToExcel"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm font-medium"
              :disabled="isExporting"
            >
              <i class="fas fa-file-excel"></i>
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Statistics Cards -->
      <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <i class="fas fa-file-alt text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Tenders</p>
              <p class="text-2xl font-bold text-gray-900">{{ tenders.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <i class="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Active Tenders</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeTendersCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <i class="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Expiring Soon</p>
              <p class="text-2xl font-bold text-gray-900">{{ expiringSoonCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
              <i class="fas fa-clock text-red-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Expired</p>
              <p class="text-2xl font-bold text-gray-900">{{ expiredCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and View Toggle -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by title, number, entity, or type..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              v-if="filter"
              @click="filter = ''"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <i class="fas fa-times text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>

          <div class="flex gap-2">
            <button
              @click="viewMode = 'table'"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium"
              :class="viewMode === 'table' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <i class="fas fa-table"></i>
              <span class="hidden sm:inline">Table</span>
            </button>
            <button
              @click="viewMode = 'grid'"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium"
              :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <i class="fas fa-th-large"></i>
              <span class="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        <div v-if="filter" class="mt-3 text-sm text-gray-600">
          Found <span class="font-semibold text-gray-900">{{ filteredTenders.length }}</span> tender(s) matching your search
        </div>
      </div>

      <!-- Loading / Empty / Content -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Loading tenders...</p>
        </div>
      </div>

      <div v-else-if="tenders.length === 0" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <i class="fas fa-inbox text-6xl text-gray-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Tenders Yet</h3>
          <p class="text-gray-600 mb-6">Start by creating your first tender</p>
          <router-link to="/create-tender">
            <button
              class="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all font-medium shadow-md"
              style="background-color: #2e4053"
            >
              <i class="fas fa-plus"></i>
              Create First Tender
            </button>
          </router-link>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(tender, index) in paginatedTenders"
          :key="tender.tender_id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group"
          @click="editTender(tender.tender_id)"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :style="getExpirationBadgeStyle(tender.expired_at)"
              >
                {{ getExpirationStatus(tender.expired_at) }}
              </span>
              <span class="text-xs text-gray-500 font-medium">
                #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {{ tender.title }}
            </h3>

            <div class="space-y-2 mb-5 text-sm text-gray-700">
              <div class="flex items-center gap-2">
                <i class="fas fa-hashtag w-4 text-gray-400"></i>
                <span class="font-medium">{{ tender.tender_number }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-building w-4 text-gray-400"></i>
                <span class="truncate">{{ tender.procurement_entity }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-tag w-4 text-gray-400"></i>
                <span>{{ tender.tender_type }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-calendar w-4 text-gray-400"></i>
                <span>Expires: {{ formatDate(tender.expired_at) }}</span>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t border-gray-100">
              <button
                @click.stop="editTender(tender.tender_id)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm"
              >
                <i class="fas fa-eye"></i>
                View
              </button>
              <button
                @click.stop="downloadTenderPdf(tender.attachment)"
                class="inline-flex items-center justify-center px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium text-sm"
                title="Download PDF"
              >
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-max">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Number</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Entity</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Submission</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(tender, index) in paginatedTenders"
                :key="tender.tender_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium max-w-xs truncate">{{ tender.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ tender.tender_source || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono bg-gray-100 px-2.5 py-1 rounded text-xs">
                    {{ tender.tender_number }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ tender.tender_type }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate">{{ tender.procurement_entity }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ tender.tender_source || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(tender.bid_submission) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                    :style="getExpirationBadgeStyle(tender.expired_at)"
                  >
                    {{ getExpirationStatus(tender.expired_at) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editTender(tender.tender_id)"
                      class="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="View / Edit"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="downloadTenderPdf(tender.attachment)"
                      class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Download PDF"
                    >
                      <i class="fas fa-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredTenders.length > itemsPerPage" class="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 gap-4">
        <div class="text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>–
          <span class="font-semibold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }}</span> of
          <span class="font-semibold text-gray-900">{{ filteredTenders.length }}</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="inline-flex items-center gap-2 px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
            Prev
          </button>

          <span class="px-4 py-2 text-sm font-medium text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="inline-flex items-center gap-2 px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <i class="fas fa-chevron-right"></i>
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
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const router = useRouter()
const toast = useToast()

const tenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(true)
const viewMode = ref('table')
const isExporting = ref(false)

onMounted(async () => {
  await fetchTenders()
})

async function fetchTenders() {
  isLoading.value = true
  try {
    const response = await axios.get('api/tenders')
    tenders.value = response.data.data || []
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const activeTendersCount = computed(() =>
  tenders.value.filter(t => !t.expired_at || new Date(t.expired_at) > new Date()).length
)

const expiringSoonCount = computed(() =>
  tenders.value.filter(t => {
    if (!t.expired_at) return false
    const daysLeft = Math.ceil((new Date(t.expired_at) - new Date()) / (1000 * 60 * 60 * 24))
    return daysLeft > 0 && daysLeft <= 3
  }).length
)

const expiredCount = computed(() =>
  tenders.value.filter(t => t.expired_at && new Date(t.expired_at) < new Date()).length
)

const filteredTenders = computed(() => {
  if (!filter.value.trim()) return tenders.value
  const term = filter.value.toLowerCase()
  return tenders.value.filter(t =>
    Object.values(t).some(v => String(v || '').toLowerCase().includes(term))
  )
})

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTenders.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredTenders.value.length / itemsPerPage) || 1)

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getExpirationStatus(expiredAt) {
  if (!expiredAt) return 'No Expiry'
  const diffDays = Math.ceil((new Date(expiredAt) - new Date()) / 86400000)
  if (diffDays < 0) return 'Expired'
  if (diffDays <= 3) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`
  if (diffDays <= 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`
  return 'Active'
}

function getExpirationBadgeStyle(expiredAt) {
  if (!expiredAt) return { backgroundColor: '#e5e7eb', color: '#4b5563' }
  const diffDays = Math.ceil((new Date(expiredAt) - new Date()) / 86400000)
  if (diffDays < 0) return { backgroundColor: '#fee2e2', color: '#991b1b' }
  if (diffDays <= 3) return { backgroundColor: '#fef3c7', color: '#92400e' }
  return { backgroundColor: '#d1fae5', color: '#065f46' }
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function editTender(tenderId) {
  router.push({ name: 'EditTender', params: { tender_id: tenderId } })
}

async function exportToPDF() {
  if (isExporting.value) return
  isExporting.value = true

  try {
    const doc = new jsPDF({ orientation: 'landscape' })

    doc.setFontSize(16)
    doc.text('Tenders List', 14, 20)

    const tableData = filteredTenders.value.map((t, i) => [
      i + 1,
      t.title || '—',
      t.tender_number || '—',
      t.tender_type || '—',
      t.procurement_entity || '—',
      t.tender_source || '—',
      formatDate(t.bid_submission),
      getExpirationStatus(t.expired_at)
    ])

    autoTable(doc, {
      head: [['#', 'Title', 'Number', 'Type', 'Entity', 'Source', 'Submission', 'Status']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
      headStyles: { fillColor: [40, 64, 83], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 45 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 25 }
      },
      margin: { top: 30, left: 14, right: 14 }
    })

    doc.save(`tenders_export_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF exported successfully')
  } catch (err) {
    console.error(err)
    toast.error('Failed to generate PDF')
  } finally {
    isExporting.value = false
  }
}

function exportToExcel() {
  if (isExporting.value) return
  isExporting.value = true

  try {
    const data = filteredTenders.value.map((t, i) => ({
      '#': i + 1,
      Title: t.title || '—',
      Number: t.tender_number || '—',
      Type: t.tender_type || '—',
      Entity: t.procurement_entity || '—',
      Source: t.tender_source || '—',
      'Bid Submission': formatDate(t.bid_submission),
      Status: getExpirationStatus(t.expired_at),
      'Expiry Date': formatDate(t.expired_at)
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tenders')

    XLSX.writeFile(wb, `tenders_export_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel exported successfully')
  } catch (err) {
    console.error(err)
    toast.error('Failed to generate Excel file')
  } finally {
    isExporting.value = false
  }
}

async function downloadTenderPdf(attachment) {
  if (!attachment) {
    toast.error('No attachment available')
    return
  }

  try {
    const response = await axios.get(attachment, { responseType: 'blob' })
    const fileName = attachment.split('/').pop() || 'tender.pdf'
    saveAs(response.data, fileName)
    toast.success('File downloaded')
  } catch (err) {
    handleError(err, 'Failed to download file')
  }
}

function handleError(error, defaultMsg = 'An error occurred') {
  let msg = defaultMsg
  if (error.response?.data?.message) msg = error.response.data.message
  else if (error.request) msg = 'Server not responding. Check connection.'
  else msg = error.message || defaultMsg

  toast.error(msg)
}
</script>

<style scoped>
/* ──────────────────────────────────────────────── */
/* Your existing styles + minor enhancements       */
/* ──────────────────────────────────────────────── */

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:text-blue-700 {
  color: #2563eb;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover lift effect on cards */
.hover\:-translate-y-1:hover {
  transform: translateY(-4px);
}

/* Sticky header support */
.sticky {
  position: sticky;
  top: 0;
}

/* Custom scrollbar for horizontal tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Additional small enhancements */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.rounded-lg {
  border-radius: 0.75rem;
}

.border-gray-200 {
  border-color: #e5e7eb;
}
</style>