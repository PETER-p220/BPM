<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5">
    <div class="mx-auto max-w-4xl">

      <!-- Header -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">Accountant</p>
            <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63]">Create Budget</h1>
            <p class="mt-1 text-sm text-[#67819d]">Submit a new budget allocation for CEO approval</p>
          </div>
        </div>
        <button @click="$router.push('/accountant/my-budgets')" class="rounded-2xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm font-semibold text-[#183b63] shadow-sm transition-colors hover:bg-[#f2f8ff]">View My Budgets</button>
      </div>

      <!-- Form Card -->
      <div class="rounded-[24px] border border-[#d9e6f3] bg-white/95 p-6 shadow-[0_14px_34px_rgba(18,58,99,0.08)]">
        <form @submit.prevent="createBudget" class="space-y-5">

          <!-- Allocation Type -->
          <div>
            <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Allocation Type *</label>
            <div class="flex gap-2">
              <button v-for="opt in allocationTypes" :key="opt.value" type="button" @click="budgetForm.allocation_type = opt.value"
                :class="['flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all',
                  budgetForm.allocation_type === opt.value
                    ? 'border-[#1d5aa5] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_10px_22px_rgba(35,96,182,0.18)]'
                    : 'border-[#d7e4f1] bg-[#f9fbff] text-[#5f7892] hover:border-[#aac6e8] hover:bg-[#f2f8ff]']">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Source Selector -->
          <div>
            <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">{{ budgetSourceLabel }} *</label>
            <select v-model="selectedBudgetTargetId" required
              class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm text-[#183b63] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12">
              <option value="">Select {{ budgetSourceLabel }}</option>
              <option v-for="src in budgetSourceOptions" :key="src.id" :value="src.id">{{ src.label }}</option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Budget Amount (TZS) *</label>
            <input type="text" inputmode="numeric" required :value="displayAmount" @input="onMoneyInput($event, budgetForm, 'allocated_amount')"
              placeholder="0" class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm text-[#183b63] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12" />
          </div>

          <!-- Period + Fiscal Year -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Period *</label>
              <select v-model="budgetForm.period" required class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm text-[#183b63] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12">
                <option value="">Select Period</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Fiscal Year *</label>
              <select v-model="budgetForm.fiscal_year" required class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm text-[#183b63] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12">
                <option value="">Select Year</option>
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
            <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Description</label>
            <textarea v-model="budgetForm.description" rows="3" placeholder="Optional details..."
              class="w-full resize-none rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm text-[#183b63] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12"></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 border-t border-[#e6eef7] pt-5">
            <button type="button" @click="resetForm" class="rounded-xl border border-[#d7e4f1] px-5 py-2.5 text-sm font-medium text-[#4d6782] transition-colors hover:bg-[#f4f8ff]">Reset</button>
            <button type="submit" :disabled="submitting" class="rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,96,182,0.24)] transition-all hover:brightness-105 disabled:opacity-50">
              <span v-if="submitting">Submitting...</span>
              <span v-else>Submit for Approval</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Recent Submissions -->
      <div v-if="recentBudgets.length > 0" class="mt-6">
        <h3 class="mb-3 text-sm font-bold text-[#183b63]">Recent Submissions</h3>
        <div class="overflow-hidden rounded-[20px] border border-[#d9e6f3] bg-white shadow-sm">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#e6eef7] bg-[#f7faff]">
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Target</th>
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Type</th>
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Amount</th>
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Status</th>
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Submitted</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2f7]">
              <tr v-for="budget in recentBudgets" :key="budget.id">
                <td class="px-4 py-3 font-medium text-[#183b63]">{{ budget.target_label || budget.department?.name || 'N/A' }}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full bg-[#edf4ff] px-2 py-0.5 text-[11px] font-semibold text-[#2d6aaf]">{{ budget.type_label || budget.allocation_type || 'Department' }}</span>
                </td>
                <td class="px-4 py-3 font-semibold text-[#1f5aa6]">{{ formatCurrency(budget.allocated_amount) }}</td>
                <td class="px-4 py-3">
                  <span :class="getStatusColor(budget.status)" class="rounded-full px-2 py-0.5 text-xs font-semibold">{{ budget.status }}</span>
                </td>
                <td class="px-4 py-3 text-[#6f86a0]">{{ formatDate(budget.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

const submitting = ref(false)
const budgetSources = ref({ departments: [], projects: [], awarded_tenders: [] })
const recentBudgets = ref([])

const allocationTypes = [
  { value: 'department', label: 'Department' },
  { value: 'project', label: 'Project' },
  { value: 'awarded_tender', label: 'Awarded Tender' },
]

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

function onMoneyInput(e, form, field) {
  const digits = e.target.value.replace(/[^0-9]/g, '')
  form[field] = digits
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

const loadBudgetSources = async () => {
  try {
    const res = await axios.get('/api/budget/sources')
    budgetSources.value = res.data || { departments: [], projects: [], awarded_tenders: [] }
  } catch (e) {
    toast.error('Failed to load budget sources')
  }
}

const loadRecentBudgets = async () => {
  try {
    const res = await axios.get('api/budget/my-budgets')
    recentBudgets.value = res.data.data?.slice(0, 5) || []
  } catch (e) { /* ignore */ }
}

const createBudget = async () => {
  submitting.value = true
  try {
    const res = await axios.post('api/budget/create', budgetForm.value)
    if (res.data.status === 'success') {
      toast.success('Budget submitted for CEO approval')
      resetForm()
      loadRecentBudgets()
    } else {
      toast.error(res.data.message || 'Failed to submit budget')
    }
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to submit budget')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  budgetForm.value = { allocation_type: 'department', department_id: '', project_id: '', award_id: '', allocated_amount: '', period: '', description: '', fiscal_year: '2026' }
}

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

onMounted(() => { loadBudgetSources(); loadRecentBudgets() })
</script>
