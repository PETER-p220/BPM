<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 space-y-6 font-sans">
    <!-- Header -->
    <PageHeader subtitle="View & Manage Purchase Requests">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
        <!-- You can add extra header actions here if needed -->
      </div>
    </PageHeader>

    <!-- Controls: Search + Export -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <input
        v-model="filter"
        type="text"
        placeholder="Search engineer, item, vendor, status..."
        class="w-full sm:w-80 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />

      <div class="flex flex-wrap gap-3">
        <button
          @click="exportToExcel"
          :disabled="isExporting"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-green-700 dark:text-green-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition disabled:opacity-50"
        >
          <i class="fas fa-file-excel"></i>
          Excel
        </button>

        <button
          @click="exportToPDF"
          :disabled="isExporting"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition disabled:opacity-50"
        >
          <i class="fas fa-file-pdf"></i>
          PDF
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12 text-gray-500 dark:text-gray-400">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
      <p>Loading purchase requests...</p>
    </div>

    <!-- No data -->
    <div v-else-if="filteredProjects.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-10 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
      <i class="fas fa-inbox text-5xl opacity-40 mb-4"></i>
      <h3 class="text-lg font-medium">No requests found</h3>
      <p class="mt-2">Try adjusting your search or check back later.</p>
    </div>

    <!-- Projects & Tables -->
    <div v-else class="space-y-8">
      <div
        v-for="project in filteredProjects"
        :key="project.project_id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Project Header -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ project.project_name }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ project.requests.length }} request{{ project.requests.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/30">
              <tr>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engineer</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Rejection</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th class="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(request, idx) in project.requests"
                :key="request.request_for_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ idx + 1 }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ request.user?.name || '—' }}</td>
                <td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" :title="request.analysis?.item_description || '—'">
                  {{ request.analysis?.item_description || '—' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ request.VendorName || '—' }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{{ request.VendorContact || '—' }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ request.quantity_purchased || '—' }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ request.amount_purchased ? formatCurrency(request.amount_purchased) : '—' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span
                    :class="statusBadgeClasses(request.status)"
                    class="inline-flex px-2.5 py-1 text-xs font-medium rounded-full"
                  >
                    {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                  </span>
                </td>
                <td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 hidden lg:table-cell max-w-xs truncate" :title="request.rejection_reason || '—'">
                  {{ request.status === 'rejected' && request.rejection_reason ? request.rejection_reason : '—' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(request.created_at) }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-center text-sm">
                  <div v-if="request.status === 'pending'" class="flex items-center justify-center gap-2">
                    <button
                      @click="openDialog(request, 'accepted')"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition shadow-sm"
                      title="Approve request"
                    >
                      <i class="fas fa-check"></i> Approve
                    </button>
                    <button
                      @click="openDialog(request, 'rejected')"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition shadow-sm"
                      title="Reject request"
                    >
                      <i class="fas fa-times"></i> Reject
                    </button>
                  </div>
                  <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Approve / Reject Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }} Request
          </h3>
        </div>

        <div class="p-6 space-y-5">
          <p class="text-gray-600 dark:text-gray-300">
            Are you sure you want to <strong>{{ dialogStatus === 'accepted' ? 'approve' : 'reject' }}</strong> this purchase request?
          </p>

          <div v-if="dialogStatus === 'rejected'">
            <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rejection Reason <span class="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              v-model="rejectionReason"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-y"
              placeholder="Please provide a clear reason for rejection..."
              :class="{ 'border-red-500': rejectionError }"
            ></textarea>
            <p v-if="rejectionError" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
              Rejection reason is required
            </p>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            @click="closeDialog"
            class="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="submitStatus"
            :disabled="submitting || (dialogStatus === 'rejected' && !rejectionReason.trim())"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition shadow-sm disabled:opacity-60"
            :class="dialogStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
          >
            <span v-if="submitting" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const purchaseRequests = ref([])
const filter = ref('')
const loading = ref(false)
const showDialog = ref(false)
const dialogStatus = ref('')
const selectedRequest = ref(null)
const rejectionReason = ref('')
const rejectionError = ref(false)
const submitting = ref(false)
const isExporting = ref(false)

// ─── Fetch ───────────────────────────────────────
onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const { data } = await axios.get('/api/request-for-purchase')
    if (data.status) {
      purchaseRequests.value = data.data.map(r => ({
        ...r,
        rejection_reason: r.rejection_reason || null
      }))
    } else {
      throw new Error(data.message || 'Failed to load requests')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not load purchase requests')
  } finally {
    loading.value = false
  }
}

// ─── Dialog ──────────────────────────────────────
function openDialog(request, status) {
  selectedRequest.value = request
  dialogStatus.value = status
  rejectionReason.value = ''
  rejectionError.value = false
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  selectedRequest.value = null
}

async function submitStatus() {
  if (dialogStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    rejectionError.value = true
    return
  }

  rejectionError.value = false
  submitting.value = true

  try {
    const payload = {
      request_for_id: selectedRequest.value.request_for_id,
      status: dialogStatus.value,
    }

    if (dialogStatus.value === 'rejected') {
      payload.rejection_reason = rejectionReason.value.trim()
    }

    const { data } = await axios.post('/api/requests/update', payload)

    if (data.status) {
      toast.success(`Request ${dialogStatus.value} successfully. Notification sent.`)
      closeDialog()
      await fetchData()
    } else {
      throw new Error(data.message || 'Update failed')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update request')
  } finally {
    submitting.value = false
  }
}

// ─── Computed ────────────────────────────────────
const groupedByProject = computed(() => {
  const map = {}
  purchaseRequests.value.forEach(r => {
    const pid = r.project_id
    if (!map[pid]) {
      map[pid] = {
        project_id: pid,
        project_name: r.project?.project_name || 'Unnamed Project',
        requests: []
      }
    }
    map[pid].requests.push(r)
  })
  return Object.values(map)
})

const filteredProjects = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return groupedByProject.value

  return groupedByProject.value
    .map(p => ({
      ...p,
      requests: p.requests.filter(r =>
        [r.user?.name, r.analysis?.item_description, r.VendorName, r.VendorContact, r.status, r.rejection_reason, p.project_name]
          .some(v => v?.toLowerCase().includes(term))
      )
    }))
    .filter(p => p.requests.length > 0)
})

// ─── Helpers ─────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi'
  }).format(new Date(dateStr))
}

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // change to TZS or your currency
    minimumFractionDigits: 0
  }).format(value)
}

function statusBadgeClasses(status) {
  const base = 'inline-flex px-2.5 py-1 text-xs font-medium rounded-full'
  if (status === 'pending') return `${base} bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300`
  if (status === 'accepted') return `${base} bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300`
  if (status === 'rejected') return `${base} bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300`
  return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`
}

// ─── Export ──────────────────────────────────────
async function exportToExcel() {
  isExporting.value = true
  try {
    const rows = filteredProjects.value.flatMap(p =>
      p.requests.map((r, i) => ({
        Project: p.project_name,
        No: i + 1,
        Engineer: r.user?.name || '—',
        Item: r.analysis?.item_description || '—',
        Vendor: r.VendorName || '—',
        'Vendor Account': r.VendorAccountNumber || '—',
        Contact: r.VendorContact || '—',
        Quantity: r.quantity_purchased || '—',
        Amount: r.amount_purchased || '—',
        Status: r.status || '—',
        'Rejection Reason': r.status === 'rejected' ? r.rejection_reason || '—' : '—',
        'Created At': formatDate(r.created_at)
      }))
    )

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Requests')
    XLSX.writeFile(wb, 'Purchase_Requests.xlsx')
  } catch (err) {
    toast.error('Export failed')
  } finally {
    isExporting.value = false
  }
}

function exportToPDF() {
  isExporting.value = true
  try {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Purchase Requests Report', 14, 22)

    let y = 30
    filteredProjects.value.forEach((p, idx) => {
      if (idx > 0) y += 10
      doc.setFontSize(14)
      doc.text(p.project_name, 14, y)
      y += 8

      autoTable(doc, {
        startY: y,
        head: [['No', 'Engineer', 'Item', 'Vendor', 'Qty', 'Amount', 'Status', 'Rejection', 'Date']],
        body: p.requests.map((r, i) => [
          i + 1,
          r.user?.name || '—',
          r.analysis?.item_description || '—',
          r.VendorName || '—',
          r.quantity_purchased || '—',
          r.amount_purchased || '—',
          r.status || '—',
          r.status === 'rejected' ? r.rejection_reason || '—' : '—',
          formatDate(r.created_at)
        ]),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [243, 244, 246], textColor: [31, 41, 55] },
        alternateRowStyles: { fillColor: [249, 250, 251] }
      })

      y = doc.lastAutoTable.finalY + 10
    })

    doc.save('Purchase_Requests.pdf')
  } catch (err) {
    toast.error('PDF export failed')
  } finally {
    isExporting.value = false
  }
}
</script>