<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Attendance Report</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View daily attendance records by date
        </p>
      </div>
    </div>

    <!-- Filter & Actions -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="flex flex-col sm:flex-row sm:items-end gap-4">
        <!-- Date Picker -->
        <div class="flex-1 max-w-xs">
          <label for="selectedDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Date
          </label>
          <input
            id="selectedDate"
            type="date"
            v-model="selectedDate"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="fetchReport"
            :disabled="isLoading || !selectedDate"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
            <span v-else>Fetch Report</span>
          </button>

          <button
            @click="exportToExcel"
            :disabled="isLoading || !reportData.length"
            class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export Excel
          </button>

          <button
            @click="exportToPDF"
            :disabled="isLoading || !reportData.length"
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
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading attendance records...</p>
    </div>

    <!-- Table -->
    <div v-else-if="reportData.length > 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason (if absent)</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(attendance, index) in paginatedData"
              :key="attendance.att_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ attendance.user?.name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClasses(attendance.is_present)"
                  class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                >
                  {{ attendance.is_present ? 'Present' : 'Absent' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ attendance.if_not_present_and_have_reason || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(attendance.created_at) }}
              </td>
            </tr>

            <!-- Empty row fallback -->
            <tr v-if="paginatedData.length === 0">
              <td colspan="5" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                No attendance records found for the selected date
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
        No attendance data available
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Select a date to view records
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="reportData.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedData.length }} of {{ reportData.length }} records
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
          :disabled="currentPage * itemsPerPage >= reportData.length"
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
import { ref, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const selectedDate = ref('')
const reportData = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return reportData.value.slice(start, start + itemsPerPage)
})

async function fetchReport() {
  if (!selectedDate.value) {
    toast.error('Please select a date')
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('api/attendance/fetch-daily-report', {
      date: selectedDate.value,
    })

    if (response.data.status === 'success') {
      reportData.value = response.data.data || []
      if (reportData.value.length === 0) {
        toast.info('No attendance records found for the selected date')
      }
    } else {
      toast.error(response.data.message || 'No data found')
    }
  } catch (error) {
    toast.error('Error fetching report: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusClasses(isPresent) {
  return isPresent
    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
}

function exportToExcel() {
  if (!reportData.value.length) {
    toast.warning('No data to export')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(
    reportData.value.map((attendance, index) => ({
      No: index + 1,
      Name: attendance.user?.name || 'N/A',
      Status: attendance.is_present ? 'Present' : 'Absent',
      Reason: attendance.if_not_present_and_have_reason || '—',
      Date: attendance.created_at ? formatDate(attendance.created_at) : 'N/A'
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report')
  XLSX.writeFile(workbook, 'Attendance_Report.xlsx')
}

function exportToPDF() {
  if (!reportData.value.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Attendance Report', 14, 20)

  autoTable(doc, {
    head: [['No', 'Name', 'Status', 'Reason', 'Date']],
    body: reportData.value.map((attendance, index) => [
      index + 1,
      attendance.user?.name || 'N/A',
      attendance.is_present ? 'Present' : 'Absent',
      attendance.if_not_present_and_have_reason || '—',
      attendance.created_at ? formatDate(attendance.created_at) : 'N/A'
    ]),
    startY: 30,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [75, 85, 99] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save('Attendance_Report.pdf')
}

function changePage(newPage) {
  if (newPage < 1 || newPage > Math.ceil(reportData.value.length / itemsPerPage)) return
  currentPage.value = newPage
}
</script>