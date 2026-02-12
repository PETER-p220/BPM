<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">

      <!-- Header -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Purchase Requests
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Manage and track all purchase requests across projects
          </p>
        </div>

        <router-link to="/apply-for/request">
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Request
          </button>
        </router-link>
      </div>

      <!-- Controls + Stats -->
      <div class="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="p-5">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="filter"
                type="text"
                placeholder="Search by project, engineer, item, vendor, status..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-sm"
              />
            </div>

            <!-- Export Buttons -->
            <div class="flex flex-wrap gap-3">
              <button
                @click="exportToExcel"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>

              <button
                @click="exportToPDF"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
              <p class="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Total Requests
              </p>
              <p class="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
                {{ totalRequests }}
              </p>
            </div>
            <div class="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/30">
              <p class="text-xs font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-300">
                Pending
              </p>
              <p class="mt-2 text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {{ pendingRequests }}
              </p>
            </div>
            <div class="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
              <p class="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-300">
                Accepted
              </p>
              <p class="mt-2 text-2xl font-bold text-green-900 dark:text-green-100">
                {{ acceptedRequests }}
              </p>
            </div>
            <div class="rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
              <p class="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
                Rejected
              </p>
              <p class="mt-2 text-2xl font-bold text-red-900 dark:text-red-100">
                {{ rejectedRequests }}
              </p>
            </div>
          </div>
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
                  Project
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Engineer
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Item Description
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Vendor
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Quantity
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Created
                </th>
                <th class="w-32 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="(request, index) in paginatedRequests"
                :key="request.request_for_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ request.project?.project_name || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {{ (request.user?.name || 'NA').charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ request.user?.name || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="max-w-xs px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ request.analysis?.item_description || 'N/A' }}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-gray-100">
                      {{ request.VendorName || 'N/A' }}
                    </div>
                    <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ request.VendorAccountNumber || '—' }}
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-100">
                  {{ request.quantity_purchased || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(request.amount_purchased) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <span
                    :class="statusBadgeClass(request.status)"
                    class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {{ request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'N/A' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(request.created_at) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm">
                  <button
                    v-if="request.status === 'rejected' && request.rejection_reason"
                    @click="showRejectionModal(request)"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
                    title="View rejection reason"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
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
            {{ filter ? 'No matching requests found' : 'No purchase requests yet' }}
          </p>
          <p class="mt-2 text-sm">
            {{ filter ? 'Try adjusting your search' : 'Start by creating a new request' }}
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
              'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
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

      <!-- Rejection Reason Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        @click.self="closeRejectionModal"
      >
        <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Rejection Details
            </h2>
            <button @click="closeRejectionModal" class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <h3 class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Request Summary</h3>
              <dl class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Engineer</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100">{{ selectedRequest?.user?.name || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Item</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100">{{ selectedRequest?.analysis?.item_description || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Amount</dt>
                  <dd class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(selectedRequest?.amount_purchased) }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950/30">
              <h3 class="mb-2 flex items-center text-sm font-semibold text-red-800 dark:text-red-200">
                <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rejection Reason
              </h3>
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ selectedRequest?.rejection_reason || 'No reason provided' }}
              </p>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              @click="closeRejectionModal"
              class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Close
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

const purchaseRequests = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showModal = ref(false)
const selectedRequest = ref(null)

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  try {
    const { data } = await axios.get('/api/logged-user/requests')
    if (data.status) {
      purchaseRequests.value = data.data.map(r => ({
        ...r,
        rejection_reason: r.rejection_reason || null
      }))
    }
  } catch (err) {
    toast.error('Failed to load purchase requests')
  }
}

const filteredRequests = computed(() => {
  if (!filter.value) return purchaseRequests.value

  const term = filter.value.toLowerCase()
  return purchaseRequests.value.filter(r =>
    (r.user?.name || '').toLowerCase().includes(term) ||
    (r.analysis?.item_description || '').toLowerCase().includes(term) ||
    (r.VendorName || '').toLowerCase().includes(term) ||
    (r.VendorAccountNumber || '').toLowerCase().includes(term) ||
    (r.VendorContact || '').toLowerCase().includes(term) ||
    (r.status || '').toLowerCase().includes(term) ||
    (r.project?.project_name || '').toLowerCase().includes(term) ||
    (r.rejection_reason || '').toLowerCase().includes(term)
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

function showRejectionModal(request) {
  selectedRequest.value = request
  showModal.value = true
}

function closeRejectionModal() {
  showModal.value = false
  selectedRequest.value = null
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi'
  }).format(date)
}

function formatCurrency(amount) {
  if (!amount) return 'N/A'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const totalRequests = computed(() => purchaseRequests.value.length)
const pendingRequests = computed(() => purchaseRequests.value.filter(r => r.status === 'pending').length)
const acceptedRequests = computed(() => purchaseRequests.value.filter(r => r.status === 'accepted').length)
const rejectedRequests = computed(() => purchaseRequests.value.filter(r => r.status === 'rejected').length)

function statusBadgeClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  }
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Export functions
function exportToExcel() {
  const data = filteredRequests.value.map((r, i) => ({
    '#': i + 1,
    Project: r.project?.project_name || 'N/A',
    Engineer: r.user?.name || 'N/A',
    'Item Description': r.analysis?.item_description || 'N/A',
    'Vendor Name': r.VendorName || 'N/A',
    'Vendor Account': r.VendorAccountNumber || 'N/A',
    'Vendor Contact': r.VendorContact || 'N/A',
    Quantity: r.quantity_purchased || 'N/A',
    Amount: r.amount_purchased || 'N/A',
    Status: r.status || 'N/A',
    'Rejection Reason': r.status === 'rejected' ? r.rejection_reason || 'N/A' : 'N/A',
    'Created At': formatDate(r.created_at) || 'N/A'
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Purchase Requests')
  XLSX.writeFile(wb, 'purchase_requests.xlsx')
  toast.success('Exported to Excel')
}

function exportToPDF() {
  const doc = new jsPDF('l', 'mm', 'a4')
  doc.setFontSize(16)
  doc.text('Purchase Requests Report', 14, 20)

  const headers = [
    ['#', 'Project', 'Engineer', 'Item', 'Vendor', 'Qty', 'Amount', 'Status', 'Created']
  ]
  const body = filteredRequests.value.map((r, i) => [
    i + 1,
    r.project?.project_name || 'N/A',
    r.user?.name || 'N/A',
    r.analysis?.item_description || 'N/A',
    r.VendorName || 'N/A',
    r.quantity_purchased || '—',
    formatCurrency(r.amount_purchased) || '—',
    r.status || 'N/A',
    formatDate(r.created_at) || '—'
  ])

  autoTable(doc, {
    head: headers,
    body,
    startY: 30,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  })

  doc.save('purchase_requests.pdf')
  toast.success('Exported to PDF')
}
</script>