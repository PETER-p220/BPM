<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Receipt Reports</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Search and export receipt reports by date range
        </p>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
        <!-- From Date -->
        <div>
          <label for="fromDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            id="fromDate"
            type="date"
            v-model="fromDate"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- To Date -->
        <div>
          <label for="toDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <input
            id="toDate"
            type="date"
            v-model="toDate"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
          <button
            @click="fetchReport"
            :disabled="isLoading"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
            <span v-else>Fetch Report</span>
          </button>

          <button
            @click="exportToExcel"
            :disabled="isLoading || !receipts.length"
            class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export Excel
          </button>

          <button
            @click="exportToPDF"
            :disabled="isLoading || !receipts.length"
            class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading receipt report...</p>
    </div>

    <!-- Table (shown when there is data) -->
    <div v-else-if="receipts.length > 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt File</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(receipt, index) in paginatedReceipts"
              :key="receipt.receipt_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ receipt.user?.name || '—' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ receipt.description || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                <button
                  v-if="receipt.receipt_file"
                  @click="viewReceipt(receipt.receipt_file)"
                  class="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Receipt
                </button>
                <span v-else class="text-gray-400 text-xs">No file</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(receipt.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State (only shown when no data and not loading) -->
    <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        No receipt reports available
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Select a date range and fetch the report
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredReceipts.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedReceipts.length }} of {{ filteredReceipts.length }} receipts
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
          :disabled="currentPage * itemsPerPage >= filteredReceipts.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toastMessage"
      :class="toastClass"
      class="fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/axios'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useToast } from 'vue-toastification'

const toast = useToast()

const receipts = ref([])
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)
const toastMessage = ref('')
const toastClass = ref('bg-green-500 text-white')

async function fetchReport() {
  if (!fromDate.value || !toDate.value) {
    toast.error('Please select both From and To dates')
    return
  }

  isLoading.value = true

  try {
    const response = await axios.get('/api/reports/for-receipts', {
      params: {
        from: fromDate.value,
        to: toDate.value,
      },
    })
    receipts.value = response.data.data || []
    toastMessage.value = response.data.message || 'Report loaded successfully'
    toastClass.value = 'bg-green-500 text-white'
  } catch (error) {
    toastMessage.value = error.response?.data?.message || 'An error occurred while fetching the report.'
    toastClass.value = 'bg-red-500 text-white'
  } finally {
    isLoading.value = false
  }
}

const filteredReceipts = computed(() => receipts.value)

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredReceipts.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredReceipts.value.length / itemsPerPage)) return
  currentPage.value = page
}

function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('en-GB', options)
}

// Open receipt image/file in new tab (works for JPEG, PNG, PDF, etc.)
function viewReceipt(url) {
  if (!url) {
    toast.error('No receipt file available')
    return
  }
  
  // Open the URL in a new tab — browser will display JPEG directly
  window.open(url, '_blank')
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(
    filteredReceipts.value.map((receipt, index) => ({
      No: (currentPage.value - 1) * itemsPerPage + index + 1,
      User: receipt.user?.name || 'N/A',
      Description: receipt.description || 'N/A',
      "Receipt File": receipt.receipt_file ? 'Yes' : 'No',
      "Created At": formatDate(receipt.created_at) || 'N/A'
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts')
  XLSX.writeFile(workbook, 'Receipts_Report.xlsx')
}

function exportToPDF() {
  const doc = new jsPDF()
  const tableColumn = ["No", "Engineer", "Description", "Receipt File", "Submitted At"]
  const tableRows = []

  filteredReceipts.value.forEach((receipt, index) => {
    const receiptData = [
      (currentPage.value - 1) * itemsPerPage + index + 1,
      receipt.user?.name || 'N/A',
      receipt.description || 'N/A',
      receipt.receipt_file ? 'Yes' : 'No',
      formatDate(receipt.created_at) || 'N/A'
    ]
    tableRows.push(receiptData)
  })

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 128] },
    styles: { fontSize: 10 },
  })

  doc.text("Receipt Reports", 14, 15)
  doc.save('Receipts_Report.pdf')
}
</script>

<style scoped>
/* Toast fade-in animation */
.fixed {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>