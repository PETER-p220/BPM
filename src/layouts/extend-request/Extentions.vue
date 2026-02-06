<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Extension Requests</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and manage project extension requests
        </p>
      </div>
    </div>

    <!-- Search & Export -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by project, engineer, reason..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="exportToExcel"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>

        <button
          @click="exportToPDF"
          class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Description</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty Extended</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount Extended</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rejection Reason</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(request, index) in paginatedRequests"
              :key="request.extend_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ request.project?.project_name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ request.user?.name || '—' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                {{ request.analysis?.item_description || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-300">
                {{ request.quantity_extended || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                {{ formatCurrency(request.amount_extended) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                {{ request.reason_for_extend || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClasses(request.status)"
                  class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                >
                  {{ request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : '—' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                <div v-if="request.status === 'rejected' && request.rejection_reason">
                  <span class="truncate max-w-xs">{{ request.rejection_reason }}</span>
                  <button
                    @click="showRejectionReason(request.rejection_reason)"
                    class="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    title="View full reason"
                  >
                    <i class="fas fa-info-circle"></i>
                  </button>
                </div>
                <span v-else>—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(request.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                <div v-if="request.status === 'pending'" class="flex justify-center gap-3">
                  <button
                    @click="openDialog(request, 'accepted')"
                    class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Approve"
                  >
                    <i class="fas fa-check-circle text-lg"></i>
                  </button>
                  <button
                    @click="openDialog(request, 'rejected')"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Reject"
                  >
                    <i class="fas fa-times-circle text-lg"></i>
                  </button>
                </div>
                <span v-else>—</span>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="paginatedRequests.length === 0">
              <td colspan="11" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-lg font-medium">No extension requests found</p>
                  <p class="mt-1">Try adjusting your search filter</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedRequests.length }} of {{ filteredRequests.length }} requests
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
          :disabled="currentPage * itemsPerPage >= filteredRequests.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Approve / Reject Dialog -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }} Extension Request
        </h3>

        <p class="mb-6 text-gray-600 dark:text-gray-400">
          Are you sure you want to {{ dialogStatus === 'accepted' ? 'approve' : 'reject' }} this request?
        </p>

        <div v-if="dialogStatus === 'rejected'" class="mb-6">
          <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rejection Reason <span class="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            v-model="rejectionReason"
            rows="3"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Enter reason for rejection..."
            required
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="showDialog = false"
            class="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            @click="submitStatus"
            :disabled="dialogStatus === 'rejected' && !rejectionReason.trim()"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="dialogStatus === 'accepted'">Approve</span>
            <span v-else>Reject</span>
          </button>
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
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const extensionRequests = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showDialog = ref(false)
const dialogStatus = ref('')
const selectedRequest = ref(null)
const rejectionReason = ref('')

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  try {
    const response = await axios.get('/api/extend-request')
    if (response.data.status) {
      extensionRequests.value = response.data.data.map(request => ({
        ...request,
        rejection_reason: request.rejection_reason || null
      }))
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load extension requests')
  }
}

const filteredRequests = computed(() => {
  if (!filter.value.trim()) return extensionRequests.value

  const search = filter.value.toLowerCase()
  return extensionRequests.value.filter(r =>
    r.project?.project_name?.toLowerCase().includes(search) ||
    r.user?.name?.toLowerCase().includes(search) ||
    r.analysis?.item_description?.toLowerCase().includes(search) ||
    r.reason_for_extend?.toLowerCase().includes(search) ||
    r.status?.toLowerCase().includes(search) ||
    r.rejection_reason?.toLowerCase().includes(search)
  )
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRequests.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredRequests.value.length / itemsPerPage)) return
  currentPage.value = page
}

function openDialog(request, status) {
  selectedRequest.value = request
  dialogStatus.value = status
  rejectionReason.value = ''
  showDialog.value = true
}

async function submitStatus() {
  if (dialogStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    toast.error('Rejection reason is required')
    return
  }

  try {
    const payload = {
      extend_id: selectedRequest.value.extend_id,
      status: dialogStatus.value,
      rejection_reason: dialogStatus.value === 'rejected' ? rejectionReason.value.trim() : null
    }

    const response = await axios.post('/api/extention/approve', payload)

    if (response.data.status) {
      toast.success(`Request ${dialogStatus.value} successfully`)
      await fetchData()
      showDialog.value = false
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update request')
    await fetchData()
  }
}

function showRejectionReason(reason) {
  toast.info(`Rejection Reason: ${reason}`, { timeout: 8000 })
}

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi'
  }).format(date)
}

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'accepted':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

function exportToExcel() {
  if (!filteredRequests.value.length) {
    toast.warning('No data to export')
    return
  }

  const data = filteredRequests.value.map((r, index) => ({
    No: index + 1,
    Project: r.project?.project_name || '—',
    Engineer: r.user?.name || '—',
    'Item Description': r.analysis?.item_description || '—',
    'Qty Extended': r.quantity_extended || '—',
    'Amount Extended': r.amount_extended || '—',
    Reason: r.reason_for_extend || '—',
    Status: r.status || '—',
    'Rejection Reason': r.status === 'rejected' ? r.rejection_reason || '—' : '—',
    'Created At': formatDate(r.created_at) || '—'
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Extension Requests')
  XLSX.writeFile(workbook, 'Extension_Requests.xlsx')
}

function exportToPDF() {
  if (!filteredRequests.value.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Extension Requests Report', 14, 20)

  const tableData = filteredRequests.value.map((r, index) => [
    index + 1,
    r.project?.project_name || '—',
    r.user?.name || '—',
    r.analysis?.item_description || '—',
    r.quantity_extended || '—',
    formatCurrency(r.amount_extended),
    r.reason_for_extend || '—',
    r.status || '—',
    r.status === 'rejected' ? r.rejection_reason || '—' : '—',
    formatDate(r.created_at) || '—'
  ])

  autoTable(doc, {
    head: [['No', 'Project', 'Engineer', 'Item Description', 'Qty Extended', 'Amount Extended', 'Reason', 'Status', 'Rejection Reason', 'Created At']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [75, 85, 99] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save('Extension_Requests.pdf')
}
</script>