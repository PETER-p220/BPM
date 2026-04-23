<template>
  <div class="min-h-screen px-4 py-4 lg:px-5"
       style="background: radial-gradient(circle at top right, rgba(48,120,221,0.08), transparent 22%), linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);">
    <div class="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/84 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- ── HERO ── -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="pointer-events-none absolute right-6 top-3 h-24 w-24 opacity-35"
             style="background-image: radial-gradient(#2b74d7 1.2px, transparent 1.2px); background-size: 10px 10px;"></div>

        <div class="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]"
                 style="background: linear-gradient(135deg,#194f92,#2f78dd);">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em]" style="color:#2d6aaf;">Executive Review</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight lg:text-[28px]" style="color:#183b63;">Staff Requests</h1>
              <p class="mt-1.5 text-sm leading-6" style="color:#67819d;">Review, approve or reject staff requests across all departments.</p>
            </div>
          </div>

          <!-- Analytics cards -->
          <div class="flex shrink-0 flex-wrap gap-3">
            <div class="flex items-center gap-3 rounded-[18px] px-4 py-3"
                 style="background: linear-gradient(135deg,#164c93,#2f78dd); min-width:120px;">
              <div class="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/15">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <div>
                <p class="text-lg font-bold text-white">{{ allRequests.length }}</p>
                <p class="text-[10px] uppercase tracking-wider text-white/72">Total</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-[18px] px-4 py-3"
                 style="background:#fffbeb; border:1px solid #fde68a; min-width:120px;">
              <div class="flex h-9 w-9 items-center justify-center rounded-[10px]" style="background:#fef3c7;">
                <svg class="h-4 w-4" style="color:#d97706;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-lg font-bold" style="color:#92400e;">{{ pendingTotal }}</p>
                <p class="text-[10px] uppercase tracking-wider" style="color:#b45309;">Pending</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-[18px] px-4 py-3"
                 style="background:#f0fdf4; border:1px solid #86efac; min-width:120px;">
              <div class="flex h-9 w-9 items-center justify-center rounded-[10px]" style="background:#dcfce7;">
                <svg class="h-4 w-4" style="color:#16a34a;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-lg font-bold" style="color:#166534;">{{ approvedTotal }}</p>
                <p class="text-[10px] uppercase tracking-wider" style="color:#15803d;">Approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BODY ── -->
      <div class="flex-1 bg-[linear-gradient(180deg,#fbfdff_0%,#f7fbff_100%)] p-4">
        <!-- Tab nav -->
        <div class="mb-4 flex gap-2 overflow-x-auto pb-1">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                  class="flex shrink-0 items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition-all"
                  :style="activeTab === tab.id
                    ? 'background: linear-gradient(135deg,#194f92,#2f78dd); color:#fff; box-shadow:0 6px 16px rgba(35,96,182,0.22);'
                    : 'background:#f3f8ff; border:1px solid #d9e6f3; color:#4e6781;'">
            <span>{{ tab.label }}</span>
            <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  :style="activeTab === tab.id ? 'background:rgba(255,255,255,0.25); color:#fff;' : 'background:#d9e6f3; color:#2d6aaf;'">
              {{ getTabRecords(tab.id).length }}
            </span>
          </button>
        </div>

        <!-- Tab panels -->
        <div v-for="tab in tabs" :key="tab.id" v-show="activeTab === tab.id">
          <div class="overflow-hidden rounded-[24px] border border-[#d9e6f3] bg-white shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="flex items-center justify-between border-b border-[#e6eef7] px-6 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em]" style="color:#7d94ac;">{{ tab.label }}</p>
                <h2 class="mt-1 text-base font-bold" style="color:#183b63;">{{ tab.title }}</h2>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#edf4ff; color:#1f5aa6;">
                {{ pendingForTab(tab.id) }} pending
              </span>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="px-6 py-10 text-center">
              <div class="inline-block h-6 w-6 animate-spin rounded-full border-b-2" style="border-color:#2f78dd;"></div>
              <p class="mt-2 text-sm" style="color:#8aa0b7;">Loading...</p>
            </div>

            <!-- Table -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead style="background:#f3f8ff;">
                  <tr style="border-bottom: 1px solid #dce9f7;">
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Requester</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Details</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Submitted</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y" style="border-color:#e8f0f8;">
                  <tr v-if="getTabRecords(tab.id).length === 0">
                    <td colspan="5" class="px-6 py-12 text-center">
                      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style="background:#e9f2ff;">
                        <svg class="h-5 w-5" style="color:#2b74d7;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                        </svg>
                      </div>
                      <p class="text-sm font-semibold" style="color:#183b63;">No {{ tab.label.toLowerCase() }} requests</p>
                      <p class="mt-1 text-xs" style="color:#8aa0b7;">All clear — no pending requests here.</p>
                    </td>
                  </tr>
                  <tr v-for="req in getTabRecords(tab.id)" :key="req.id || req.leave_id || req.request_id"
                      class="transition-colors hover:bg-[#f8fbff]">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                             style="background: linear-gradient(135deg,#194f92,#2f78dd);">
                          {{ (req.user_name || req.name || '?').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <p class="font-semibold" style="color:#183b63;">{{ req.user_name || req.name || 'Staff' }}</p>
                          <p class="text-xs" style="color:#8aa0b7;">{{ req.department || req.user_email || '' }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="font-semibold" style="color:#183b63;">{{ req.title || req.description || req.reason || req.item || '—' }}</p>
                      <p class="mt-0.5 text-xs" style="color:#8aa0b7;">
                        <span v-if="req.leave_type" class="mr-2">{{ req.leave_type }}</span>
                        <span v-if="req.amount">{{ formatCurrency(req.amount) }}</span>
                        <span v-if="req.start_date"> · {{ formatDate(req.start_date) }} – {{ formatDate(req.end_date) }}</span>
                      </p>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-xs" style="color:#7a93af;">
                      {{ formatDate(req.created_at) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            :style="getStatusStyle(req.status || req.is_approved)">
                        {{ formatStatus(req.status || req.is_approved) }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div v-if="isPending(req)" class="flex items-center gap-2">
                        <button @click="approve(tab.id, req)"
                                :disabled="req._processing"
                                class="rounded-[8px] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-105 disabled:opacity-50"
                                style="background:linear-gradient(135deg,#15803d,#22c55e);">
                          Approve
                        </button>
                        <button @click="openReject(tab.id, req)"
                                :disabled="req._processing"
                                class="rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
                                style="background:#fef2f2; border:1px solid #fecaca; color:#dc2626;">
                          Reject
                        </button>
                      </div>
                      <span v-else class="text-xs" style="color:#8aa0b7;">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Dialog -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="rejectDialog.open" class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(14,34,64,0.45); backdrop-filter:blur(4px);"
             @click.self="closeReject">
          <div class="w-full max-w-md overflow-hidden rounded-[24px] bg-white"
               style="border:1px solid #d6e4f2; box-shadow:0 32px 80px rgba(18,58,99,0.24);">
            <div class="flex items-center justify-between px-6 py-4"
                 style="border-bottom:1px solid #e8f0f8; background:linear-gradient(135deg,#fff5f5 0%,#ffffff 100%);">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-[12px]" style="background:#fef2f2;">
                  <svg class="h-4 w-4" style="color:#dc2626;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-[15px] font-bold" style="color:#183b63;">Reject Request</h2>
                  <p class="mt-0.5 text-[11px]" style="color:#7a93af;">Provide a reason for rejection</p>
                </div>
              </div>
              <button @click="closeReject" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50" style="color:#7a93af;">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="px-6 py-5 space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Rejection Reason</label>
                <textarea v-model="rejectDialog.reason" rows="4" placeholder="Explain why this request is being rejected..."
                          class="w-full resize-none rounded-[10px] px-3 py-2.5 text-sm outline-none"
                          style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;"></textarea>
              </div>
              <div class="flex justify-end gap-3" style="border-top:1px solid #e8f0f8; padding-top:16px;">
                <button @click="closeReject" class="rounded-[10px] px-4 py-2 text-sm font-semibold" style="background:#f3f8ff; color:#183b63; border:1px solid #d7e4f1;">Cancel</button>
                <button @click="confirmReject" :disabled="!rejectDialog.reason.trim() || rejectDialog.submitting"
                        class="rounded-[10px] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        style="background:linear-gradient(135deg,#dc2626,#ef4444);">
                  <span v-if="rejectDialog.submitting">Rejecting...</span>
                  <span v-else>Confirm Rejection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

const loading = ref(false)
const activeTab = ref('leave')

const leaveRequests = ref([])
const financialRequests = ref([])
const purchaseRequests = ref([])
const generalRequests = ref([])

const rejectDialog = ref({ open: false, tabId: null, req: null, reason: '', submitting: false })

const tabs = [
  { id: 'leave', label: 'Leave', title: 'Leave Requests' },
  { id: 'financial', label: 'Financial', title: 'Financial Requests' },
  { id: 'purchase', label: 'Purchase', title: 'Purchase Requests' },
  { id: 'general', label: 'General', title: 'General Requests' },
]

const allRequests = computed(() => [
  ...leaveRequests.value,
  ...financialRequests.value,
  ...purchaseRequests.value,
  ...generalRequests.value,
])

const pendingTotal = computed(() => allRequests.value.filter(r => isPending(r)).length)
const approvedTotal = computed(() => allRequests.value.filter(r => isApproved(r)).length)

function isPending(req) {
  const s = String(req.status || req.is_approved || 'pending').toLowerCase()
  return s === 'pending' || s === '0' || s === 'false'
}
function isApproved(req) {
  const s = String(req.status || req.is_approved || '').toLowerCase()
  return s === 'approved' || s === 'accepted' || s === '1' || s === 'true'
}

function getTabRecords(tabId) {
  const map = { leave: leaveRequests, financial: financialRequests, purchase: purchaseRequests, general: generalRequests }
  return (map[tabId] || ref([])).value
}

function pendingForTab(tabId) {
  return getTabRecords(tabId).filter(r => isPending(r)).length
}

// Endpoint resolver
function resolveEndpoint(tabId) {
  const map = {
    leave: 'api/leave-requests',
    financial: 'api/financial-requests',
    purchase: 'api/requests-for-projects',
    general: 'api/general-requests',
  }
  return map[tabId]
}

function setRecords(tabId, data) {
  const map = { leave: leaveRequests, financial: financialRequests, purchase: purchaseRequests, general: generalRequests }
  if (map[tabId]) map[tabId].value = data
}

onMounted(async () => {
  loading.value = true
  const endpoints = ['api/leave-requests', 'api/financial-requests', 'api/requests-for-projects', 'api/general-requests']
  const tabIds = ['leave', 'financial', 'purchase', 'general']
  const results = await Promise.allSettled(endpoints.map(ep => axios.get(ep)))
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') setRecords(tabIds[i], r.value.data.data || [])
  })
  loading.value = false
})

async function approve(tabId, req) {
  req._processing = true
  const id = req.id || req.leave_id || req.request_id
  try {
    await axios.put(`${resolveEndpoint(tabId)}/${id}`, { status: 'approved' })
    toast.success('Request approved')
    const res = await axios.get(resolveEndpoint(tabId))
    setRecords(tabId, res.data.data || [])
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to approve request')
    req._processing = false
  }
}

function openReject(tabId, req) {
  rejectDialog.value = { open: true, tabId, req, reason: '', submitting: false }
}

function closeReject() {
  rejectDialog.value = { open: false, tabId: null, req: null, reason: '', submitting: false }
}

async function confirmReject() {
  const { tabId, req, reason } = rejectDialog.value
  rejectDialog.value.submitting = true
  const id = req.id || req.leave_id || req.request_id
  try {
    await axios.put(`${resolveEndpoint(tabId)}/${id}`, { status: 'rejected', rejection_reason: reason })
    toast.success('Request rejected')
    const res = await axios.get(resolveEndpoint(tabId))
    setRecords(tabId, res.data.data || [])
    closeReject()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to reject request')
    rejectDialog.value.submitting = false
  }
}

function getStatusStyle(status) {
  const s = String(status || 'pending').toLowerCase()
  if (s === 'approved' || s === 'accepted' || s === '1' || s === 'true') return 'background:#f0fdf4; color:#166534;'
  if (s === 'rejected' || s === 'declined') return 'background:#fef2f2; color:#991b1b;'
  return 'background:#fffbeb; color:#92400e;'
}

function formatStatus(status) {
  const s = String(status || 'pending').toLowerCase()
  if (s === '1' || s === 'true') return 'Approved'
  if (s === '0' || s === 'false') return 'Pending'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(v) {
  if (!v) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(v)
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
