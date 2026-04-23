<template>
  <div class="min-h-full bg-[#edf4fb] px-4 py-4 lg:px-5">
    <div class="mx-auto max-w-7xl">

      <!-- Header -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">Accountant</p>
            <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63]">My Budgets</h1>
            <p class="mt-1 text-sm text-[#67819d]">Track submissions & approval status</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-2xl border border-[#d7e4f1] bg-white/95 px-3 py-2 shadow-sm">
            <svg class="h-4 w-4 text-[#7a93af]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <select v-model="fiscalYear" @change="loadBudgets" class="bg-transparent text-sm font-semibold text-[#183b63] outline-none">
              <option value="2029">FY 2029</option><option value="2028">FY 2028</option><option value="2027">FY 2027</option><option value="2026">FY 2026</option><option value="2025">FY 2025</option>
            </select>
          </div>
          <button @click="openCreateModal" class="rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,96,182,0.24)] transition-all hover:brightness-105">+ Create Budget</button>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-[0_8px_18px_rgba(18,58,99,0.05)]">
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Total</p>
          <p class="mt-1 text-lg font-bold text-[#183b63]">{{ stats.total }}</p>
        </div>
        <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-[0_8px_18px_rgba(18,58,99,0.05)]">
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Approved</p>
          <p class="mt-1 text-lg font-bold text-green-600">{{ stats.approved }}</p>
        </div>
        <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-[0_8px_18px_rgba(18,58,99,0.05)]">
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Pending</p>
          <p class="mt-1 text-lg font-bold text-amber-600">{{ stats.pending }}</p>
        </div>
        <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-[0_8px_18px_rgba(18,58,99,0.05)]">
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Rejected</p>
          <p class="mt-1 text-lg font-bold text-red-600">{{ stats.rejected }}</p>
        </div>
      </div>

      <!-- Budgets Table -->
      <div class="overflow-hidden rounded-[24px] border border-[#d9e6f3] bg-white shadow-[0_14px_34px_rgba(18,58,99,0.08)]">
        <!-- Filters -->
        <div class="flex items-center justify-between border-b border-[#e6eef7] bg-[linear-gradient(135deg,#f4f8ff_0%,#ffffff_100%)] px-5 py-3.5">
          <h2 class="text-sm font-bold text-[#183b63]">Budget Submissions</h2>
          <div class="flex items-center gap-2">
            <input v-model="searchQuery" type="text" placeholder="Search..."
              class="rounded-xl border border-[#d7e4f1] bg-white px-3 py-2 text-sm text-[#183b63] placeholder-[#99afc5] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12" />
            <select v-model="statusFilter" class="rounded-xl border border-[#d7e4f1] bg-white px-3 py-2 text-sm text-[#183b63] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12">
              <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#e6eef7] bg-[#f7faff]">
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Target</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Type</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Amount</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Period</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Status</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Approved By</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Submitted</th>
                <th class="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2f7]">
              <tr v-if="loading">
                <td colspan="8" class="px-5 py-8 text-center">
                  <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#2b74d7] border-t-transparent"></div>
                  <p class="mt-2 text-xs text-[#7a93af]">Loading budgets...</p>
                </td>
              </tr>
              <tr v-else-if="filteredBudgets.length === 0">
                <td colspan="8" class="px-5 py-8 text-center text-sm text-[#7a93af]">No budgets found</td>
              </tr>
              <tr v-for="budget in filteredBudgets" :key="budget.id" class="transition-colors hover:bg-[#f7faff]">
                <td class="px-5 py-3.5">
                  <p class="font-semibold text-[#183b63]">{{ budget.target_label || budget.department?.name || 'N/A' }}</p>
                  <p class="text-xs text-[#6f86a0]">by {{ budget.creator?.name || '—' }}</p>
                </td>
                <td class="px-5 py-3.5">
                  <span class="rounded-full bg-[#edf4ff] px-2 py-0.5 text-[11px] font-semibold text-[#2d6aaf]">{{ budget.type_label || budget.allocation_type || 'Department' }}</span>
                </td>
                <td class="px-5 py-3.5 font-semibold text-[#1f5aa6]">{{ formatCurrency(budget.allocated_amount) }}</td>
                <td class="px-5 py-3.5 capitalize text-[#4d6782]">{{ budget.period }}</td>
                <td class="px-5 py-3.5">
                  <span :class="getStatusColor(budget.status)" class="rounded-full px-2.5 py-0.5 text-xs font-semibold">{{ budget.status }}</span>
                </td>
                <td class="px-5 py-3.5 text-[#4d6782]">{{ budget.approver?.name || '—' }}</td>
                <td class="px-5 py-3.5 text-[#6f86a0]">{{ formatDate(budget.created_at) }}</td>
                <td class="px-5 py-3.5">
                  <button v-if="budget.status === 'rejected'" @click="showRejectionDetails(budget)" class="text-xs font-semibold text-[#1f5aa6] hover:underline">View Reason</button>
                  <span v-else class="text-[#a3b5c8]">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="showRejectionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#123a63]/32 p-4 backdrop-blur-[6px]">
      <div class="w-full max-w-md rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6 shadow-[0_30px_70px_rgba(18,58,99,0.24)]">
        <h3 class="mb-3 text-base font-bold text-[#183b63]">Rejection Reason</h3>
        <div class="rounded-xl border border-red-200 bg-red-50 p-4">
          <p class="text-sm text-red-700">{{ selectedBudget?.rejection_reason }}</p>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-[#7a93af]">
          <span>Rejected by: {{ selectedBudget?.approver?.name }}</span>
          <span>{{ formatDate(selectedBudget?.approved_at) }}</span>
        </div>
        <button @click="showRejectionModal = false" class="mt-4 w-full rounded-xl border border-[#d7e4f1] py-2.5 text-sm font-medium text-[#4d6782] transition-colors hover:bg-[#f4f8ff]">Close</button>
      </div>
    </div>

    <!-- Create Budget Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Create Budget</h3>
              <p class="text-xs text-slate-500 mt-0.5">Submit a new budget allocation for CEO approval</p>
            </div>
            <button @click="closeCreateModal" class="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="createBudget" class="px-6 py-5 space-y-4">
            <!-- Allocation Type -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Budget For *</label>
              <select v-model="budgetForm.allocation_type"
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="department">Department</option>
                <option value="project">Project</option>
                <option value="awarded_tender">Awarded Tender</option>
              </select>
            </div>

            <!-- Allocation Source -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">{{ budgetSourceLabel }} *</label>
              <select v-model="selectedBudgetTargetId" required
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="">Select {{ budgetSourceLabel }}</option>
                <option v-for="source in budgetSourceOptions" :key="source.id" :value="source.id">
                  {{ source.label }}
                </option>
              </select>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Budget Amount (TZS) *</label>
              <input
                type="text" inputmode="numeric" required
                :value="displayAmount"
                @input="onMoneyInput($event)"
                placeholder="0"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>

            <!-- Period + Fiscal Year -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Period *</label>
                <select v-model="budgetForm.period" required
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="">Select Period</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Fiscal Year *</label>
                <select v-model="budgetForm.fiscal_year" required
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="2029">FY 2029</option>
                  <option value="2028">FY 2028</option>
                  <option value="2027">FY 2027</option>
                  <option value="2026">FY 2026</option>
                  <option value="2025">FY 2025</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea v-model="budgetForm.description" rows="3"
                        placeholder="Optional details about this budget allocation..."
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"></textarea>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button type="button" @click="closeCreateModal"
                      class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="submitting"
                      class="px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] hover:brightness-105 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="submitting">Submitting...</span>
                <span v-else>Submit for Approval</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

// ── List state ──
const loading = ref(false)
const budgets = ref([])
const fiscalYear = ref('2026')
const searchQuery = ref('')
const statusFilter = ref('')
const showRejectionModal = ref(false)
const selectedBudget = ref(null)

// ── Create modal state ──
const showCreateModal = ref(false)
const submitting = ref(false)
const budgetSources = ref({ departments: [], projects: [], awarded_tenders: [] })

const budgetForm = ref({
  allocation_type: 'department',
  department_id: '',
  project_id: '',
  award_id: '',
  allocated_amount: '',
  period: '',
  description: '',
  fiscal_year: '2026'
})

const displayAmount = computed(() => {
  const raw = budgetForm.value.allocated_amount
  if (!raw) return ''
  return Number(raw).toLocaleString()
})

function onMoneyInput(e) {
  const digits = e.target.value.replace(/[^0-9]/g, '')
  budgetForm.value.allocated_amount = digits
  e.target.value = digits ? Number(digits).toLocaleString() : ''
}

const budgetSourceLabel = computed(() => {
  const map = { department: 'Department', project: 'Project', awarded_tender: 'Awarded Tender' }
  return map[budgetForm.value.allocation_type] || 'Source'
})

const budgetSourceOptions = computed(() => {
  const type = budgetForm.value.allocation_type
  if (type === 'department') return (budgetSources.value.departments || []).map(d => ({ id: d.department_id, label: d.name }))
  if (type === 'project') return (budgetSources.value.projects || []).map(p => ({ id: p.project_id, label: p.project_name }))
  if (type === 'awarded_tender') return (budgetSources.value.awarded_tenders || []).map(a => ({ id: a.id, label: a.title || `Award #${a.id}` }))
  return []
})

const selectedBudgetTargetId = computed({
  get() {
    const type = budgetForm.value.allocation_type
    if (type === 'department') return budgetForm.value.department_id
    if (type === 'project') return budgetForm.value.project_id
    if (type === 'awarded_tender') return budgetForm.value.award_id
    return ''
  },
  set(val) {
    const type = budgetForm.value.allocation_type
    budgetForm.value.department_id = type === 'department' ? val : ''
    budgetForm.value.project_id = type === 'project' ? val : ''
    budgetForm.value.award_id = type === 'awarded_tender' ? val : ''
  }
})

watch(() => budgetForm.value.allocation_type, () => {
  budgetForm.value.department_id = ''
  budgetForm.value.project_id = ''
  budgetForm.value.award_id = ''
})

const openCreateModal = async () => {
  showCreateModal.value = true
  try {
    const res = await axios.get('/api/budget/sources')
    budgetSources.value = res.data || { departments: [], projects: [], awarded_tenders: [] }
  } catch (e) {
    toast.error('Failed to load budget sources')
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  resetForm()
}

const resetForm = () => {
  budgetForm.value = { allocation_type: 'department', department_id: '', project_id: '', award_id: '', allocated_amount: '', period: '', description: '', fiscal_year: '2026' }
}

const createBudget = async () => {
  submitting.value = true
  try {
    const res = await axios.post('api/budget/create', budgetForm.value)
    if (res.data.status === 'success') {
      toast.success('Budget submitted for CEO approval')
      closeCreateModal()
      loadBudgets()
    } else {
      toast.error(res.data.message || 'Failed to submit budget')
    }
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to submit budget')
  } finally {
    submitting.value = false
  }
}

const filteredBudgets = computed(() => {
  let filtered = budgets.value
  if (statusFilter.value) filtered = filtered.filter(b => b.status === statusFilter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(b =>
      b.target_label?.toLowerCase().includes(q) ||
      b.department?.name?.toLowerCase().includes(q) ||
      b.creator?.name?.toLowerCase().includes(q) ||
      b.type_label?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    )
  }
  return filtered
})

const stats = computed(() => ({
  total: budgets.value.length,
  approved: budgets.value.filter(b => b.status === 'approved').length,
  pending: budgets.value.filter(b => b.status === 'pending').length,
  rejected: budgets.value.filter(b => b.status === 'rejected').length
}))

const loadBudgets = async () => {
  loading.value = true
  try {
    const res = await axios.get(`api/budget/my-budgets?fiscal_year=${fiscalYear.value}`)
    budgets.value = res.data.data || []
  } catch (e) {
    toast.error('Failed to load budgets')
    budgets.value = []
  } finally {
    loading.value = false
  }
}

const showRejectionDetails = (budget) => { selectedBudget.value = budget; showRejectionModal.value = true }

const formatCurrency = (v) => {
  if (!v) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'text-amber-700 bg-amber-100'
    case 'approved': return 'text-green-700 bg-green-100'
    case 'rejected': return 'text-red-700 bg-red-100'
    default: return 'text-[#5f7892] bg-[#edf4ff]'
  }
}

onMounted(() => { loadBudgets() })
</script>