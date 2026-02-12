<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Extension Requests
        </h1>
        <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Review and manage project extension requests
        </p>
      </div>

      <!-- Search + Export -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-lg">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by project, engineer, reason, status..."
            class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-sm transition-all"
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            @click="exportToExcel"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>

          <button
            @click="exportToPDF"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Main Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-12 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  #
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Engineer
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Item Description
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Qty Extended
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Amount Extended
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Reason
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Rejection Reason
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Created At
                </th>
                <th class="w-32 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="(request, index) in paginatedRequests"
                :key="request.extend_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-150"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ request.user?.name || 'N/A' }}
                </td>
                <td class="max-w-xs px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ request.analysis?.item_description || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-100">
                  {{ request.quantity_extended || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(request.amount_extended) }}
                </td>
                <td class="max-w-md px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ request.reason_for_extend || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <span
                    :class="statusBadgeClass(request.status)"
                    class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {{ request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <div v-if="request.status === 'rejected' && request.rejection_reason">
                    <div class="line-clamp-2 max-w-xs" :title="request.rejection_reason">
                      {{ request.rejection_reason }}
                    </div>
                    <button
                      @click="showRejectionReason(request.rejection_reason)"
                      class="mt-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View full reason
                    </button>
                  </div>
                  <span v-else>—</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(request.created_at) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm">
                  <div v-if="request.status === 'pending'" class="flex justify-center gap-2">
                    <button
                      @click="openDialog(request, 'accepted')"
                      class="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Approve
                    </button>
                    <button
                      @click="openDialog(request, 'rejected')"
                      class="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Reject
                    </button>
                  </div>
                  <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-if="paginatedRequests.length === 0"
          class="py-16 text-center text-gray-500 dark:text-gray-400"
        >
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m4-8V8a4 4 0 00-8 0v1m-4 8h16a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <p class="mt-4 text-lg font-medium">
            {{ filter ? 'No matching extension requests found' : 'No extension requests yet' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredRequests.length > itemsPerPage" class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Showing
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredRequests.length) }}
          </span>
          of
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ filteredRequests.length }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'flex h-9 min-w-[36px] items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage * itemsPerPage >= filteredRequests.length"
            @click="changePage(currentPage + 1)"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Approve / Reject Dialog -->
      <div
        v-if="showDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }} Extension Request
          </h3>

          <p class="mt-3 text-gray-600 dark:text-gray-400">
            Are you sure you want to
            <strong>{{ dialogStatus === 'accepted' ? 'approve' : 'reject' }}</strong> this request?
          </p>

          <div v-if="dialogStatus === 'rejected'" class="mt-5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rejection Reason <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="rejectionReason"
              rows="4"
              class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Please provide a clear reason..."
              required
            ></textarea>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button
              @click="showDialog = false"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              @click="submitStatus"
              :disabled="dialogStatus === 'rejected' && !rejectionReason.trim()"
              :class="dialogStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
              class="rounded-lg px-6 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }}
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
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
    const { data } = await axios.get('/api/extend-request')
    if (data.status) {
      extensionRequests.value = data.data.map(r => ({
        ...r,
        rejection_reason: r.rejection_reason || null
      }))
    }
  } catch (err) {
    toast.error('Failed to load extension requests')
  }
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
    }
    if (dialogStatus.value === 'rejected') {
      payload.rejection_reason = rejectionReason.value.trim()
    }

    const { data } = await axios.post('/api/extention/approve', payload)

    if (data.status) {
      toast.success(`Request ${dialogStatus.value} successfully. Notification sent.`)
      await fetchData()
      showDialog.value = false
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update request')
    await fetchData()
  }
}

function showRejectionReason(reason) {
  toast.info(`Rejection Reason: ${reason}`, { timeout: 8000 })
}

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
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

const filteredRequests = computed(() => {
  if (!filter.value) return extensionRequests.value

  const term = filter.value.toLowerCase()
  return extensionRequests.value.filter(r =>
    (r.user?.name || '').toLowerCase().includes(term) ||
    (r.analysis?.item_description || '').toLowerCase().includes(term) ||
    (r.quantity_extended?.toString() || '').includes(term) ||
    (r.amount_extended?.toString() || '').includes(term) ||
    (r.reason_for_extend || '').toLowerCase().includes(term) ||
    (r.status || '').toLowerCase().includes(term) ||
    (r.rejection_reason || '').toLowerCase().includes(term) ||
    (r.project?.project_name || '').toLowerCase().includes(term)
  )
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRequests.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, 5]
  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [current - 2, current - 1, current, current + 1, current + 2].filter(p => p >= 1 && p <= total)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function statusBadgeClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  }
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Export to Excel
function exportToExcel() {
  const data = filteredRequests.value.map((r, i) => ({
    '#': i + 1,
    Engineer: r.user?.name || 'N/A',
    'Item Description': r.analysis?.item_description || 'N/A',
    'Qty Extended': r.quantity_extended || 'N/A',
    'Amount Extended': formatCurrency(r.amount_extended) || 'N/A',
    'Reason': r.reason_for_extend || 'N/A',
    Status: r.status || 'N/A',
    'Rejection Reason': r.status === 'rejected' ? r.rejection_reason || 'N/A' : 'N/A',
    'Created At': formatDate(r.created_at) || 'N/A',
    'Project': r.project?.project_name || 'N/A'
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Extension Requests')
  XLSX.writeFile(wb, 'extension_requests.xlsx')
}

// Export to PDF
function exportToPDF() {
  const doc = new jsPDF('l', 'mm', 'a4')
  doc.setFontSize(16)
  doc.text('Extension Requests', 14, 20)

  const headers = [
    ['#', 'Engineer', 'Item', 'Qty Ext', 'Amount Ext', 'Reason', 'Status', 'Rejection Reason', 'Created']
  ]
  const body = filteredRequests.value.map((r, i) => [
    i + 1,
    r.user?.name || 'N/A',
    r.analysis?.item_description || 'N/A',
    r.quantity_extended || '—',
    formatCurrency(r.amount_extended) || '—',
    r.reason_for_extend || '—',
    r.status || 'N/A',
    r.status === 'rejected' ? r.rejection_reason || 'N/A' : 'N/A',
    formatDate(r.created_at) || '—'
  ])

  autoTable(doc, {
    head: headers,
    body,
    startY: 30,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  })

  doc.save('extension_requests.pdf')
}
</script>