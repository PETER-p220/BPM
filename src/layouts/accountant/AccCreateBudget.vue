<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Create Budget</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Submit New Budget Allocation</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <button @click="$router.push('/accountant/my-budgets')" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
              View My Budgets
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-8">
      <!-- Budget Creation Form -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Budget Details</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in the budget allocation details for CEO approval</p>
        </div>
        
        <form @submit.prevent="createBudget" class="p-6 space-y-6">
          <!-- Department Selection -->   
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Department *
            </label>
            <select v-model="budgetForm.department_id" required
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Select Department</option>
              <option v-for="department in availableDepartments" :key="department.department_id" :value="department.department_id">
                {{ department.name }}
              </option>
            </select>
          </div>

          <!-- Budget Amount -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Budget Amount (TZS) *
            </label>
            <input v-model="budgetForm.allocated_amount" type="number" step="0.01" min="0" required
                   placeholder="Enter amount in Tanzanian Shillings"
                   class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
          </div>

          <!-- Period -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Budget Period *
            </label>
            <select v-model="budgetForm.period" required
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Select Period</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <!-- Fiscal Year -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Fiscal Year *
            </label>
            <select v-model="budgetForm.fiscal_year" required
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Select Fiscal Year</option>
              <option value="2029">FY 2029</option>
              <option value="2028">FY 2028</option>
              <option value="2027">FY 2027</option>
              <option value="2026">FY 2026</option>
              <option value="2025">FY 2025</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea v-model="budgetForm.description" rows="4"
                      placeholder="Provide details about this budget allocation..."
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" @click="resetForm"
                    class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors">
              Reset
            </button>
            <button type="submit" :disabled="submitting"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors">
              <span v-if="submitting">Submitting...</span>
              <span v-else>Submit for Approval</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Recent Submissions -->
      <div v-if="recentBudgets.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Budget Submissions</h3>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Period</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr v-for="budget in recentBudgets" :key="budget.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {{ budget.department?.name || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {{ formatCurrency(budget.allocated_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {{ budget.period }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusColor(budget.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ budget.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {{ formatDate(budget.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

// State
const submitting = ref(false)
const availableDepartments = ref([])
const recentBudgets = ref([])

const budgetForm = ref({
  department_id: '',
  allocated_amount: '',
  period: '',
  description: '',
  fiscal_year: '2026'
})

// Methods
const loadAvailableDepartments = async () => {
  try {
    const response = await axios.get('api/all/departments')
    availableDepartments.value = response.data.departments || []
    
    // Debug: Log the actual data structure
    console.log('Departments data:', availableDepartments.value)
    console.log('Sample department:', availableDepartments.value[0])
  } catch (error) {
    console.error('Error loading departments:', error)
    toast.error('Failed to load departments')
  }
}

const loadRecentBudgets = async () => {
  try {
    const response = await axios.get('api/budget/my-budgets')
    recentBudgets.value = response.data.data?.slice(0, 5) || []
  } catch (error) {
    console.error('Error loading recent budgets:', error)
  }
}

const createBudget = async () => {
  submitting.value = true
  
  try {
    // Debug: Log the form data being sent
    console.log('Submitting budget data:', budgetForm.value)
    
    const response = await axios.post('api/budget/create', budgetForm.value)
    
    // Debug: Log the response
    console.log('Budget creation response:', response.data)
    
    if (response.data.status === 'success') {
      toast.success('Budget submitted successfully for CEO approval')
      resetForm()
      loadRecentBudgets()
    } else {
      toast.error(response.data.message || 'Failed to submit budget')
    }
  } catch (error) {
    // Debug: Log the error response
    console.error('Error creating budget:', error.response?.data || error.message)
    toast.error(error.response?.data?.message || 'Failed to submit budget')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  budgetForm.value = {
    department_id: '',
    allocated_amount: '',
    period: '',
    description: '',
    fiscal_year: '2024'
  }
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
  loadAvailableDepartments()
  loadRecentBudgets()
})
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>
