<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Submitted Tenders</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage your submitted tender records
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <router-link to="/submit/tender">
          <button
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Submit Tender
          </button>
        </router-link>
      </div>
    </div>

    <!-- Filter & Export -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search by title, tender number..."
          class="w-full sm:w-80 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />

        <div class="flex flex-col sm:flex-row gap-3 sm:ml-auto">
          <button
            @click="exportToExcel"
            :disabled="!users.length || isLoading"
            class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>

          <button
            @click="exportToPDF"
            :disabled="!users.length || isLoading"
            class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading submitted tenders...</p>
    </div>

    <!-- Table -->
    <div v-else-if="users.length > 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender Title</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender Number</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted Document</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(tender, index) in paginatedData"
              :key="tender.submission_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ tender.tender?.title || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.tender?.tender_number || '—' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                <div class="truncate" :title="tender.qualifications || ''">
                  {{ tender.qualifications || '—' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                <button
                  v-if="tender.submission_document"
                  @click="downloadTenderPdf(tender.submission_document)"
                  class="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <span v-else class="text-gray-400 text-xs">No file</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(tender.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        No submitted tenders found
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Submit a new tender to get started
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredData.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedData.length }} of {{ filteredData.length }} tenders
      </p>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {{ currentPage }}
        </span>

        <button
          :disabled="currentPage * itemsPerPage >= filteredData.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const users = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('api/submitted/tender')
    users.value = response.data.data || []
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load submitted tenders')
  } finally {
    isLoading.value = false
  }
}

async function downloadTenderPdf(url) {
  if (!url) {
    toast.error('No document available')
    return
  }

  try {
    const response = await axios.get(url, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = url.split('/').pop() || 'tender_document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    toast.success('Download started')
  } catch (error) {
    toast.error('Failed to download document')
  }
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filteredData = computed(() => {
  const searchText = filter.value.toLowerCase()
  return users.value.filter(entry => {
    return (
      (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
      (entry.tender?.tender_number?.toLowerCase() || '').includes(searchText) ||
      (entry.created_at?.toLowerCase() || '').includes(searchText)
    )
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  currentPage.value = page
}

function exportToExcel() {
  if (!users.length) {
    toast.warning('No data to export')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(
    filteredData.value.map((entry, index) => ({
      No: index + 1,
      'Tender Title': entry.tender?.title || 'N/A',
      'Tender Number': entry.tender?.tender_number || 'N/A',
      'Submitted Document': entry.submission_document ? 'Yes' : 'No',
      'Submitted At': formatDate(entry.created_at) || 'N/A'
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submitted Tenders')
  XLSX.writeFile(workbook, 'Submitted_Tenders.xlsx')
  toast.success('Exported to Excel')
}

function exportToPDF() {
  if (!users.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Submitted Tenders Report', 14, 22)

  const headers = [['No', 'Tender Title', 'Tender Number', 'Submitted Document', 'Submitted At']]
  const data = filteredData.value.map((entry, index) => [
    index + 1,
    entry.tender?.title || 'N/A',
    entry.tender?.tender_number || 'N/A',
    entry.submission_document ? 'Yes' : 'No',
    formatDate(entry.created_at) || 'N/A'
  ])

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    theme: 'striped',
    headStyles: { fillColor: [46, 64, 83] },
    styles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save('Submitted_Tenders_Report.pdf')
  toast.success('Exported to PDF')
}
</script>
