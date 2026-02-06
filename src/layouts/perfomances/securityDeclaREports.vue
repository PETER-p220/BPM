<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Security Declaration Reports</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Search and export security declarations by date range
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
            v-model="dateRange.from"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
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
            v-model="dateRange.to"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
          />
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
          <button
            @click="searchData"
            :disabled="isLoading"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
            <span v-else>Search</span>
          </button>

          <button
            @click="exportToExcel"
            :disabled="isLoading || !securityDeclarations.length"
            class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export to Excel
          </button>

          <button
            @click="exportToPDF"
            :disabled="isLoading || !securityDeclarations.length"
            class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Search Prompt (before any search) -->
    <div v-if="!isSearched" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        No reports yet
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Select a date range and click Search
      </p>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading security declarations...</p>
    </div>

    <!-- Table (when data exists) -->
    <div v-else-if="securityDeclarations.length > 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security Declaration File</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(declaration, index) in paginatedData"
              :key="declaration.declaration_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ declaration.tender?.title || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ declaration.user?.name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                <button
                  v-if="declaration.security_declaration_file"
                  @click="viewDeclarationFile(declaration.security_declaration_file)"
                  class="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View / Download
                </button>
                <span v-else class="text-gray-400 text-xs">No file</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(declaration.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty Search Result -->
    <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        No reports found
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        No security declarations match the selected date range
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="securityDeclarations.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedData.length }} of {{ filteredData.length }} records
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
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const securityDeclarations = ref([])
const filter = ref('')
const dateRange = ref({ from: '', to: '' })
const currentPage = ref(1)
const itemsPerPage = 10
const isSearched = ref(false)
const isLoading = ref(false)
const toastMessage = ref('')
const toastClass = ref('bg-green-500 text-white')

// Search function
async function searchData() {
  if (!dateRange.value.from || !dateRange.value.to) {
    toast.error('Please select both From and To dates.')
    return
  }

  isSearched.value = true
  isLoading.value = true

  try {
    const params = {
      from: dateRange.value.from,
      to: dateRange.value.to
    }
    const response = await axios.get('api/reports/security-declaration', { params })
    securityDeclarations.value = response.data.data || []
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// View / Download security declaration file (opens in new tab)
function viewDeclarationFile(url) {
  if (!url) {
    toast.error('No file available')
    return
  }
  window.open(url, '_blank') // Opens image/PDF in new tab
}

// Format date
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

// Computed filtered data
const filteredData = computed(() => {
  const searchText = filter.value.toLowerCase()
  return securityDeclarations.value.filter(entry => {
    return (
      (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
      (entry.user?.name?.toLowerCase() || '').includes(searchText) ||
      (entry.created_at?.toLowerCase() || '').includes(searchText)
    )
  })
})

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page > 0 && page <= Math.ceil(filteredData.value.length / itemsPerPage)) {
    currentPage.value = page
  }
}

// Error handler
function handleError(error) {
  let message = 'An unexpected error occurred'
  if (error.response) {
    message = error.response.data?.message || error.response.statusText
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.'
  } else {
    message = error.message
  }
  toast.error(message)
}

// Export to Excel
function exportToExcel() {
  if (!isSearched.value || securityDeclarations.value.length === 0) {
    toast.error('Please search for reports before exporting.')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(
    paginatedData.value.map((entry, index) => ({
      No: (currentPage.value - 1) * itemsPerPage + index + 1,
      'Tender Title': entry.tender?.title || 'N/A',
      'Created By': entry.user?.name || 'N/A',
      'Security Declaration File': entry.security_declaration_file || 'N/A',
      'Created At': formatDate(entry.created_at) || 'N/A'
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Security Declaration Reports')
  XLSX.writeFile(workbook, 'Security_Declaration_Reports.xlsx')
}

// Export to PDF
function exportToPDF() {
  if (!isSearched.value || securityDeclarations.value.length === 0) {
    toast.error('Please search for reports before exporting.')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Security Declaration Reports', 14, 22)

  const headers = [['No', 'Tender Title', 'Created By', 'Created At']]
  const data = paginatedData.value.map((entry, index) => [
    (currentPage.value - 1) * itemsPerPage + index + 1,
    entry.tender?.title || 'N/A',
    entry.user?.name || 'N/A',
    formatDate(entry.created_at) || 'N/A'
  ])

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    theme: 'striped',
    headStyles: { fillColor: [46, 64, 83] },
    styles: { fontSize: 10 }
  })

  doc.save('Security_Declaration_Reports.pdf')
}
</script>

<style scoped>
/* Toast animation */
.fixed {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>