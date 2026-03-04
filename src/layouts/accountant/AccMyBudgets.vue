<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">My Budgets</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Budget Submissions & Status</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Fiscal Year Selector -->
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <select v-model="fiscalYear" @change="loadBudgets" class="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option value="2026">FY 2026</option>
                <option value="2025">FY 2025</option>
                <option value="2024">FY 2024</option>
                <option value="2023">FY 2023</option>
              </select>
            </div>               
            
            <button @click="$router.push('/accountant/create-budget')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
              + Create Budget
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Total Submitted</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Approved</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.approved }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ stats.pending }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Rejected</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.rejected }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Budgets Table -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Budget Submissions</h2>
            <div class="flex items-center gap-2">
              <input v-model="searchQuery" type="text" placeholder="Search budgets..."
                     class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <select v-model="statusFilter" @change="loadBudgets"
                      class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Period</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approved By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center">
                  <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading budgets...</p>
                </td>
              </tr>
              <tr v-else-if="filteredBudgets.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No budgets found
                </td>
              </tr>
              <tr v-for="budget in filteredBudgets" :key="budget.id" class="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-slate-900 dark:text-white">
                      {{ budget.department?.name || 'N/A' }}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                      Created by {{ budget.creator?.name || 'Unknown' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                  {{ formatCurrency(budget.allocated_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                  <span class="capitalize">{{ budget.period }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(budget.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ budget.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                  {{ budget.approver?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(budget.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button v-if="budget.status === 'rejected'" @click="showRejectionDetails(budget)"
                          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    View Reason
                  </button>
                  <span v-else class="text-slate-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Rejection Details Modal -->
    <div v-if="showRejectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Rejection Reason</h3>
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-sm text-red-800 dark:text-red-200">{{ selectedBudget?.rejection_reason }}</p>
        </div>
        <div class="flex items-center justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
          <span>Rejected by: {{ selectedBudget?.approver?.name }}</span>
          <span>{{ formatDate(selectedBudget?.approved_at) }}</span>
        </div>
        <button @click="showRejectionModal = false"
                class="mt-4 w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

// State
const loading = ref(false)
const budgets = ref([])
const fiscalYear = ref('2026')
const searchQuery = ref('')
const statusFilter = ref('')
const showRejectionModal = ref(false)
const selectedBudget = ref(null)

// Computed
const filteredBudgets = computed(() => {
  let filtered = budgets.value

  if (statusFilter.value) {
    filtered = filtered.filter(budget => budget.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(budget => 
      budget.department?.name?.toLowerCase().includes(query) ||
      budget.creator?.name?.toLowerCase().includes(query) ||
      budget.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const stats = computed(() => {
  return {
    total: budgets.value.length,
    approved: budgets.value.filter(b => b.status === 'approved').length,
    pending: budgets.value.filter(b => b.status === 'pending').length,
    rejected: budgets.value.filter(b => b.status === 'rejected').length
  }
})

// Methods
const loadBudgets = async () => {
  loading.value = true
  try {
    const response = await axios.get(`api/budget/my-budgets?fiscal_year=${fiscalYear.value}`)
    budgets.value = response.data.data || []
  } catch (error) {
    console.error('Error loading budgets:', error)
    toast.error('Failed to load budgets')
    budgets.value = []
  } finally {
    loading.value = false
  }
}

const showRejectionDetails = (budget) => {
  selectedBudget.value = budget
  showRejectionModal.value = true
}

const formatCurrency = (value) => {
  if (!value) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'text-amber-600 bg-amber-100/30'
    case 'approved':
      return 'text-green-600 bg-green-100/30'
    case 'rejected':
      return 'text-red-600 bg-red-100/30'
    default:
      return 'text-slate-600 bg-slate-100/30'
  }
}

// Lifecycle
onMounted(() => {
  loadBudgets()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>
