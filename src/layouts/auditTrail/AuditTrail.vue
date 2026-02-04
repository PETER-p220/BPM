<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto font-sans">
    <PageHeader title="Audit Trail" subtitle="System Activity Logs" />

    <!-- Search + Export -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="relative flex-1 max-w-lg">
        <input
          v-model="filter"
          type="search"
          placeholder="Search by action or user email..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="exportToExcel"
          :disabled="loading || !filteredData.length"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          <i class="fas fa-file-excel mr-2 text-green-600"></i>
          Export Excel
        </button>

        <button
          @click="exportToPDF"
          :disabled="loading || !filteredData.length"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          <i class="fas fa-file-pdf mr-2 text-red-600"></i>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/60">
            <tr>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                No
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Action
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Category / Role
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                User
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Logged At
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr
              v-for="(entry, index) in paginatedData"
              :key="entry.id || index"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ entry.action || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ entry.category || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ entry.email || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(entry.created_at) || '—' }}
              </td>
            </tr>

            <tr v-if="loading || paginatedData.length === 0">
              <td colspan="5" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center gap-3">
                  <i v-if="loading" class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
                  <i v-else class="fas fa-history text-4xl opacity-50"></i>
                  <p class="font-medium">
                    {{ loading ? 'Loading audit logs...' : 'No audit entries found' }}
                  </p>
                  <p class="text-sm" v-if="!loading">
                    {{ filter ? 'Try adjusting your search' : 'No activity recorded yet' }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredData.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <span class="px-3 py-2 text-sm font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const auditTrail = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 15 // slightly larger default for logs
const loading = ref(false)

// Fetch logs
onMounted(fetchAuditTrail)

async function fetchAuditTrail() {
  loading.value = true
  try {
    const response = await axios.get('/api/audit-trail')
    auditTrail.value = response.data?.audit_trail || []
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// Filtering & Pagination
const filteredData = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return auditTrail.value

  return auditTrail.value.filter(entry =>
    entry.action?.toLowerCase().includes(term) ||
    entry.email?.toLowerCase().includes(term) ||
    entry.category?.toLowerCase().includes(term)
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage) || 1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

// Date formatting (you can improve this with date-fns or dayjs if installed)
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return dateStr
  }
}

// Page navigation
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Exports
function exportToExcel() {
  if (!filteredData.value.length) {
    toast.warning('No data to export')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(
    filteredData.value.map((entry, i) => ({
      No: i + 1,
      Action: entry.action || '',
      Category: entry.category || '',
      User: entry.email || '',
      'Logged At': entry.created_at || '',
      Details: entry.details || ''
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Trail')
  XLSX.writeFile(workbook, 'Audit_Trail.xlsx')
}

function exportToPDF() {
  if (!filteredData.value.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Audit Trail Report', 14, 20)

  autoTable(doc, {
    startY: 28,
    head: [['No', 'Action', 'Category', 'User', 'Logged At', 'Details']],
    body: filteredData.value.map((entry, i) => [
      i + 1,
      entry.action || '—',
      entry.category || '—',
      entry.email || '—',
      formatDate(entry.created_at) || '—',
      entry.details || '—'
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // indigo
    styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
    columnStyles: {
      5: { cellWidth: 60 } // Details column wider
    }
  })

  doc.save('Audit_Trail.pdf')
}

function handleError(error) {
  let msg = 'An unexpected error occurred'
  if (error.response?.data?.error || error.response?.data?.message) {
    msg = error.response.data.error || error.response.data.message
  } else if (error.response) {
    msg = error.response.statusText || `Server error (${error.response.status})`
  } else if (error.request) {
    msg = 'No response from server. Check your connection.'
  } else {
    msg = error.message
  }

  toast.error(msg, { timeout: 7000 })
}
</script>