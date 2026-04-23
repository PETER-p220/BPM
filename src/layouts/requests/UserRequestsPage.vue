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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em]" style="color:#2d6aaf;">My Workspace</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight lg:text-[28px]" style="color:#183b63;">My Requests</h1>
              <p class="mt-1.5 max-w-3xl text-sm leading-6" style="color:#67819d;">
                Submit leave or financial requests to management for review and approval.
              </p>
            </div>
          </div>

          <!-- Action buttons + Summary chips -->
          <div class="flex shrink-0 flex-wrap items-center gap-2">
            <!-- Add buttons always visible -->
            <button @click="openModal('leave')"
                    class="inline-flex items-center gap-1.5 rounded-[12px] px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-105"
                    style="background: linear-gradient(135deg,#194f92,#2f78dd); box-shadow:0 6px 16px rgba(35,96,182,0.18);">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Leave
            </button>
            <button @click="openModal('financial')"
                    class="inline-flex items-center gap-1.5 rounded-[12px] px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-105"
                    style="background: linear-gradient(135deg,#1a6b3a,#2ea05a); box-shadow:0 6px 16px rgba(30,107,58,0.18);">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Financial
            </button>

            <!-- Summary chips -->
            <div class="flex items-center gap-2 rounded-[12px] px-3 py-1.5 text-xs font-semibold"
                 style="background:#f3f8ff; border:1px solid #d9e6f3; color:#183b63;">
              <span class="h-2 w-2 rounded-full" style="background:#2f78dd;"></span>
              {{ allRequests.length }} Total
            </div>
            <div class="flex items-center gap-2 rounded-[12px] px-3 py-1.5 text-xs font-semibold"
                 style="background:#fffbeb; border:1px solid #fde68a; color:#92400e;">
              <span class="h-2 w-2 animate-pulse rounded-full" style="background:#f59e0b;"></span>
              {{ pendingCount }} Pending
            </div>
            <div class="flex items-center gap-2 rounded-[12px] px-3 py-1.5 text-xs font-semibold"
                 style="background:#f0fdf4; border:1px solid #86efac; color:#166534;">
              <span class="h-2 w-2 rounded-full" style="background:#22c55e;"></span>
              {{ approvedCount }} Approved
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
              {{ tabCount(tab.id) }}
            </span>
          </button>
        </div>

        <!-- Tab content panels -->
        <div v-for="tab in tabs" :key="tab.id" v-show="activeTab === tab.id">
          <div class="overflow-hidden rounded-[24px] border border-[#d9e6f3] bg-white shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="flex items-center justify-between border-b border-[#e6eef7] px-6 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em]" style="color:#7d94ac;">{{ tab.label }}</p>
                <h2 class="mt-1 text-base font-bold" style="color:#183b63;">{{ tab.title }}</h2>
              </div>
            
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
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Details</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Submitted</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y" style="border-color:#e8f0f8;">
                  <tr v-if="getTabRecords(tab.id).length === 0">
                    <td colspan="4" class="px-6 py-12 text-center">
                      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style="background:#e9f2ff;">
                        <svg class="h-5 w-5" style="color:#2b74d7;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p class="text-sm font-semibold" style="color:#183b63;">No {{ tab.label.toLowerCase() }} requests yet</p>
                      <p class="mt-1 text-xs" style="color:#8aa0b7;">Click "New {{ tab.label }}" to submit one.</p>
                    </td>
                  </tr>
                  <tr v-for="req in getTabRecords(tab.id)" :key="req.id || req.request_id || req.leave_id"
                      class="transition-colors hover:bg-[#f8fbff]">
                    <td class="px-6 py-4">
                      <p class="font-semibold" style="color:#183b63;">{{ req.title || req.description || req.reason || req.item || '—' }}</p>
                      <p class="mt-0.5 text-xs" style="color:#8aa0b7;">
                        <span v-if="req.amount">{{ formatCurrency(req.amount) }}</span>
                        <span v-if="req.start_date"> &middot; {{ formatDate(req.start_date) }} – {{ formatDate(req.end_date) }}</span>
                      </p>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" style="background:#edf4ff; color:#1f5aa6;">
                        {{ req.leave_type || req.category || req.type || tab.label }}
                      </span>
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
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── MODALS ── -->
    <Teleport to="body">
      <!-- Leave Request Modal -->
      <Transition name="modal-fade">
        <div v-if="modalType === 'leave'" class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(14,34,64,0.45); backdrop-filter:blur(4px);"
             @click.self="closeModal">
          <div class="w-full max-w-lg overflow-hidden rounded-[24px] bg-white"
               style="border:1px solid #d6e4f2; box-shadow:0 32px 80px rgba(18,58,99,0.24); max-height:90vh; overflow-y:auto;">
            <div class="flex items-center justify-between px-6 py-4"
                 style="border-bottom:1px solid #e8f0f8; background:linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-[12px] text-white"
                     style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-[15px] font-bold" style="color:#183b63;">New Leave Request</h2>
                  <p class="mt-0.5 text-[11px]" style="color:#7a93af;">Submit a leave request to management</p>
                </div>
              </div>
              <button @click="closeModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#eef5ff]" style="color:#7a93af;">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="submitLeave" class="space-y-4 px-6 py-5">
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Leave Type</label>
                <select v-model="leaveForm.leave_type" required class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;">
                  <option value="">Select type...</option>
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation</option>
                  <option value="maternity">Maternity</option>
                  <option value="paternity">Paternity</option>
                  <option value="emergency">Emergency</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Start Date</label>
                  <input v-model="leaveForm.start_date" type="date" required class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">End Date</label>
                  <input v-model="leaveForm.end_date" type="date" required class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Reason</label>
                <textarea v-model="leaveForm.reason" required rows="3" placeholder="Describe your reason for leave..."
                          class="w-full resize-none rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;"></textarea>
              </div>
              <div class="flex justify-end gap-3 pt-4" style="border-top:1px solid #e8f0f8;">
                <button type="button" @click="closeModal" class="rounded-[10px] px-4 py-2 text-sm font-semibold" style="background:#f3f8ff; color:#183b63; border:1px solid #d7e4f1;">Cancel</button>
                <button type="submit" :disabled="submitting" class="rounded-[10px] px-5 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-60" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                  <span v-if="submitting">Submitting...</span>
                  <span v-else>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Financial Request Modal -->
      <Transition name="modal-fade">
        <div v-if="modalType === 'financial'" class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(14,34,64,0.45); backdrop-filter:blur(4px);"
             @click.self="closeModal">
          <div class="w-full max-w-lg overflow-hidden rounded-[24px] bg-white"
               style="border:1px solid #d6e4f2; box-shadow:0 32px 80px rgba(18,58,99,0.24); max-height:90vh; overflow-y:auto;">
            <div class="flex items-center justify-between px-6 py-4"
                 style="border-bottom:1px solid #e8f0f8; background:linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-[12px] text-white" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-[15px] font-bold" style="color:#183b63;">Financial Request</h2>
                  <p class="mt-0.5 text-[11px]" style="color:#7a93af;">Request funds or reimbursement</p>
                </div>
              </div>
              <button @click="closeModal" class="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#eef5ff]" style="color:#7a93af;">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="submitFinancial" class="space-y-4 px-6 py-5">
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Title</label>
                <input v-model="financialForm.title" type="text" required placeholder="e.g. Travel reimbursement" class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Category</label>
                <select v-model="financialForm.category" required class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;">
                  <option value="">Select category...</option>
                  <option value="reimbursement">Reimbursement</option>
                  <option value="advance">Cash Advance</option>
                  <option value="operational">Operational</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Amount (TZS)</label>
                <input v-model="financialForm.amount" type="number" required min="0" step="0.01" placeholder="Enter amount" class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold" style="color:#4e6781;">Description</label>
                <textarea v-model="financialForm.description" rows="3" required placeholder="Explain the purpose of this financial request..."
                          class="w-full resize-none rounded-[10px] px-3 py-2.5 text-sm outline-none" style="border:1.5px solid #d6e4f2; background:#f8fbff; color:#183b63;"></textarea>
              </div>
              <div class="flex justify-end gap-3 pt-4" style="border-top:1px solid #e8f0f8;">
                <button type="button" @click="closeModal" class="rounded-[10px] px-4 py-2 text-sm font-semibold" style="background:#f3f8ff; color:#183b63; border:1px solid #d7e4f1;">Cancel</button>
                <button type="submit" :disabled="submitting" class="rounded-[10px] px-5 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-60" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                  <span v-if="submitting">Submitting...</span>
                  <span v-else>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <!-- [purchase and general modals removed] -->
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'
import authService from '@/utils/authService'

const toast = useToast()
const currentUser = authService.getCurrentUser()

const loading = ref(false)
const submitting = ref(false)
const activeTab = ref('leave')
const modalType = ref(null)

const leaveRequests = ref([])
const financialRequests = ref([])

const leaveForm = ref({ employee_id: currentUser?.user_id || '', leave_type: '', start_date: '', end_date: '', reason: '' })
const financialForm = ref({ title: '', category: '', amount: '', description: '' })

const tabs = [
  { id: 'leave', label: 'Leave', title: 'Leave Requests' },
  { id: 'financial', label: 'Financial', title: 'Financial Requests' },
]

const allRequests = computed(() => [
  ...leaveRequests.value,
  ...financialRequests.value,
])

const pendingCount = computed(() =>
  allRequests.value.filter(r => {
    const s = String(r.status || r.is_approved || 'pending').toLowerCase()
    return s === 'pending' || s === '0' || s === 'false'
  }).length
)

const approvedCount = computed(() =>
  allRequests.value.filter(r => {
    const s = String(r.status || r.is_approved || '').toLowerCase()
    return s === 'approved' || s === 'accepted' || s === '1' || s === 'true'
  }).length
)

function getTabRecords(tabId) {
  const map = { leave: leaveRequests, financial: financialRequests }
  return (map[tabId] || ref([])).value
}

function tabCount(tabId) {
  return getTabRecords(tabId).length
}

onMounted(async () => {
  loading.value = true
  const results = await Promise.allSettled([
    axios.get('api/leaves'),
    axios.get('api/financial-requests'),
  ])
  if (results[0].status === 'fulfilled') leaveRequests.value = results[0].value.data.data || []
  if (results[1].status === 'fulfilled') financialRequests.value = results[1].value.data.data || []
  loading.value = false
})

function openModal(type) { modalType.value = type }

function closeModal() {
  modalType.value = null
  leaveForm.value = { employee_id: currentUser?.user_id || '', leave_type: '', start_date: '', end_date: '', reason: '' }
  financialForm.value = { title: '', category: '', amount: '', description: '' }
}

async function submitLeave() {
  submitting.value = true
  try {
    await axios.post('api/leaves', leaveForm.value)
    toast.success('Leave request submitted successfully')
    const res = await axios.get('api/leaves')
    leaveRequests.value = res.data.data || []
    closeModal()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to submit leave request')
  } finally { submitting.value = false }
}

async function submitFinancial() {
  submitting.value = true
  try {
    await axios.post('api/financial-requests', financialForm.value)
    toast.success('Financial request submitted successfully')
    const res = await axios.get('api/financial-requests')
    financialRequests.value = res.data.data || []
    closeModal()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to submit financial request')
  } finally { submitting.value = false }
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
