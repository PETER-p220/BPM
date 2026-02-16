<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Purchase Requests
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Manage and review all purchase requests across projects
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-if="filteredProjects.length"
            @click="exportToExcel"
            :disabled="exporting"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>

          <button
            v-if="filteredProjects.length"
            @click="exportToPDF"
            :disabled="exporting"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            <svg class="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <div class="relative max-w-lg">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by project, engineer, vendor, item, status..."
            class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-sm transition-all duration-200"
          />
          <button
            v-if="filter"
            @click="filter = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <div
          v-for="project in filteredProjects"
          :key="project.project_id"
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 transition-all duration-200 hover:shadow-md"
        >
          <!-- Project Header -->
          <div class="flex items-center justify-between bg-gray-50 px-6 py-4 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <svg class="h-5 w-5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {{ project.project_name || 'Unnamed Project' }}
            </h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ project.requests.length }} request{{ project.requests.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/30">
                <tr>
                  <th class="w-12 px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">No</th>
                  <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Engineer</th>
                  <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Item</th>
                  <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Vendor</th>
                  <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                  <th class="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Qty</th>
                  <th class="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                  <th class="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</th>
                  <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
                  <th class="w-32 px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-700">
                <tr
                  v-for="(request, index) in project.requests"
                  :key="request.request_for_id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150"
                >
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ index + 1 }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ request.user?.name || '—' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    {{ request.analysis?.item_description || '—' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {{ request.VendorName || '—' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ request.VendorContact || '—' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                    {{ request.quantity_purchased || '—' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ request.amount_purchased ? formatCurrency(request.amount_purchased) : '—' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      class="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': request.status === 'pending',
                        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': request.status === 'accepted',
                        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': request.status === 'rejected'
                      }"
                    >
                      {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    <span v-if="request.status === 'rejected' && request.rejection_reason">
                      {{ request.rejection_reason }}
                      <button
                        @click.stop="showRejectionReason(request.rejection_reason)"
                        class="ml-2 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                        title="View full reason"
                      >
                        <i class="fas fa-info-circle"></i>
                      </button>
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(request.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-center text-sm">
                    <div v-if="request.status === 'pending'" class="flex items-center justify-center gap-2">
                      <button
                        @click.stop="openDialog(request, 'accepted')"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-60"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        @click.stop="openDialog(request, 'rejected')"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-60"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                    <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No requests message per project -->
          <div
            v-if="!project.requests.length"
            class="py-12 text-center text-gray-500 dark:text-gray-400 italic"
          >
            No purchase requests found for this project
          </div>
        </div>

        <!-- Global Empty State -->
        <div
          v-if="!filteredProjects.length && !isLoading"
          class="py-20 text-center text-gray-500 dark:text-gray-400"
        >
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium">
            {{ filter ? 'No matching requests found' : 'No purchase requests yet' }}
          </h3>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <div
        v-if="showDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        @click="showDialog = false"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          @click.stop
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }} Request
          </h3>

          <p class="mb-6 text-gray-600 dark:text-gray-300">
            Are you sure you want to
            <span class="font-medium" :class="dialogStatus === 'accepted' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ dialogStatus === 'accepted' ? 'approve' : 'reject' }}
            </span>
            this purchase request?
          </p>

          <div v-if="dialogStatus === 'rejected'" class="mb-6">
            <label for="rejection_reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rejection Reason <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="rejectionReason"
              id="rejection_reason"
              rows="4"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all"
              placeholder="Please provide a clear reason for rejection..."
              required
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="showDialog = false"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitStatus"
              :disabled="dialogStatus === 'rejected' && !rejectionReason.trim()"
              class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all disabled:opacity-60"
              :class="dialogStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
            >
              <svg v-if="dialogStatus === 'accepted'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
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
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const purchaseRequests = ref([])
const filter = ref('')
const showDialog = ref(false)
const dialogStatus = ref('')
const selectedRequest = ref(null)
const rejectionReason = ref('')
const exporting = ref(false)

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  try {
    const response = await axios.get('/api/request-for-purchase')
    if (response.data.status) {
      purchaseRequests.value = response.data.data.map(r => ({
        ...r,
        rejection_reason: r.rejection_reason || null
      }))
    }
  } catch (err) {
    toast.error('Failed to load purchase requests')
    console.error(err)
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
      request_for_id: selectedRequest.value.request_for_id,
      status: dialogStatus.value
    }
    if (dialogStatus.value === 'rejected') {
      payload.rejection_reason = rejectionReason.value.trim()
    }

    const response = await axios.post('/api/requests/update', payload)
    if (response.data.status) {
      toast.success(`Request ${dialogStatus.value} successfully. Notification sent.`)
      await fetchData()
      showDialog.value = false
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update request')
    await fetchData() // refresh anyway
  }
}

function showRejectionReason(reason) {
  toast.info(`Rejection Reason: ${reason}`, { timeout: 8000 })
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi'
  }).format(new Date(dateString))
}

function formatCurrency(amount) {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0
  }).format(amount)
}

const groupedByProject = computed(() => {
  const grouped = {}
  purchaseRequests.value.forEach(r => {
    const pid = r.project_id
    if (!grouped[pid]) {
      grouped[pid] = {
        project_id: pid,
        project_name: r.project?.project_name || 'Unknown Project',
        requests: []
      }
    }
    grouped[pid].requests.push(r)
  })
  return Object.values(grouped)
})

const filteredProjects = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return groupedByProject.value

  return groupedByProject.value
    .map(p => {
      const filteredReq = p.requests.filter(r =>
        (r.user?.name || '').toLowerCase().includes(term) ||
        (r.analysis?.item_description || '').toLowerCase().includes(term) ||
        (r.VendorName || '').toLowerCase().includes(term) ||
        (r.VendorAccountNumber || '').toLowerCase().includes(term) ||
        (r.VendorContact || '').toLowerCase().includes(term) ||
        (r.status || '').toLowerCase().includes(term) ||
        (r.rejection_reason || '').toLowerCase().includes(term) ||
        (p.project_name || '').toLowerCase().includes(term)
      )
      return { ...p, requests: filteredReq }
    })
    .filter(p => p.requests.length > 0)
})

function exportToExcel() {
  exporting.value = true
  try {
    const flatData = filteredProjects.value.flatMap(p =>
      p.requests.map((r, i) => ({
        'Project': p.project_name,
        'No': i + 1,
        'Engineer': r.user?.name || '—',
        'Item Description': r.analysis?.item_description || '—',
        'Vendor Name': r.VendorName || '—',
        'Vendor Account': r.VendorAccountNumber || '—',
        'Vendor Contact': r.VendorContact || '—',
        'Quantity': r.quantity_purchased || '—',
        'Amount (TZS)': r.amount_purchased || '—',
        'Status': r.status?.charAt(0).toUpperCase() + r.status?.slice(1) || '—',
        'Rejection Reason': r.status === 'rejected' ? r.rejection_reason || '—' : '—',
        'Created At': formatDate(r.created_at) || '—'
      }))
    )

    const ws = XLSX.utils.json_to_sheet(flatData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Requests')
    XLSX.writeFile(wb, 'Purchase_Requests.xlsx')
    toast.success('Excel exported')
  } catch (err) {
    toast.error('Export failed')
  } finally {
    exporting.value = false
  }
}

function exportToPDF() {
  exporting.value = true
  try {
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('Purchase Requests Report', 14, 20)

    let startY = 30

    filteredProjects.value.forEach((p, idx) => {
      if (idx > 0) startY += 10

      doc.setFontSize(13)
      doc.text(p.project_name || 'Project', 14, startY)
      startY += 8

      const headers = [
        ['No', 'Engineer', 'Item', 'Vendor', 'Contact', 'Qty', 'Amount', 'Status', 'Reason', 'Created']
      ]
      const body = p.requests.map((r, i) => [
        i + 1,
        r.user?.name || '—',
        r.analysis?.item_description || '—',
        r.VendorName || '—',
        r.VendorContact || '—',
        r.quantity_purchased || '—',
        r.amount_purchased ? formatCurrency(r.amount_purchased) : '—',
        r.status?.charAt(0).toUpperCase() + r.status?.slice(1) || '—',
        r.status === 'rejected' ? r.rejection_reason || '—' : '—',
        formatDate(r.created_at) || '—'
      ])

      autoTable(doc, {
        head: headers,
        body,
        startY,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [45, 55, 72], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 45 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 12 },
          6: { cellWidth: 25 },
          7: { cellWidth: 20 },
          8: { cellWidth: 35 },
          9: { cellWidth: 30 }
        },
        margin: { left: 14, right: 14 }
      })

      startY = doc.lastAutoTable.finalY + 15
    })

    doc.save(`purchase_requests_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF exported')
  } catch (err) {
    toast.error('PDF export failed')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.rounded-xl {
  border-radius: 1rem;
}

.shadow-sm {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>