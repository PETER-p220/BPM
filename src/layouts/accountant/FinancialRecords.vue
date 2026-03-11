<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Financial Records</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Manage financial transactions and records</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <button @click="showAddRecordModal = true" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              + Add Record
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
              <p class="text-sm text-slate-500 dark:text-slate-400">Total Records</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Income</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(stats.income) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8l-8 8-8-8" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Expenses</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatCurrency(stats.expenses) }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20V4m8 8l-8-8-8 8" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Net Balance</p>
              <p class="text-2xl font-bold" :class="stats.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'">
                {{ formatCurrency(stats.balance) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <input v-model="searchQuery" type="text" placeholder="Search records..."
                   class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>
          <select v-model="typeFilter" @change="loadRecords"
                  class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select v-model="categoryFilter" @change="loadRecords"
                  class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <option value="">All Categories</option>
            <option value="sales">Sales</option>
            <option value="services">Services</option>
            <option value="operations">Operations</option>
            <option value="salary">Salary</option>
            <option value="utilities">Utilities</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <input v-model="dateFilter" type="date" @change="loadRecords"
                 class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
        </div>
      </div>

      <!-- Records Table -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Financial Records</h2>
            <div class="flex items-center gap-2">
              <button @click="exportRecords" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center">
                  <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading records...</p>
                </td>
              </tr>
              <tr v-else-if="filteredRecords.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No records found
                </td>
              </tr>
              <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                  {{ formatDate(record.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-slate-900 dark:text-white">
                      {{ record.description }}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                      Ref: {{ record.reference }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                  <span class="capitalize">{{ record.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeColor(record.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ record.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="record.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ record.type === 'income' ? '+' : '-' }} {{ formatCurrency(record.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(record.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ record.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button @click="editRecord(record)" class="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 mr-3">
                    Edit
                  </button>
                  <button @click="deleteRecord(record.id)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Record Modal -->
    <div v-if="showAddRecordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {{ editingRecord ? 'Edit Record' : 'Add Financial Record' }}
        </h3>
        
        <form @submit.prevent="saveRecord" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
            <input v-model="recordForm.date" type="date" required
                   class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <input v-model="recordForm.description" type="text" required
                   placeholder="Enter description"
                   class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reference</label>
            <input v-model="recordForm.reference" type="text"
                   placeholder="Reference number"
                   class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
            <select v-model="recordForm.type" required
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select v-model="recordForm.category" required
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">Select Category</option>
              <option value="sales">Sales</option>
              <option value="services">Services</option>
              <option value="operations">Operations</option>
              <option value="salary">Salary</option>
              <option value="utilities">Utilities</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (TZS)</label>
            <input v-model="recordForm.amount" type="number" step="0.01" min="0" required
                   placeholder="Enter amount"
                   class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
            <select v-model="recordForm.status" required
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" @click="closeModal"
                    class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="submitting"
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors">
              <span v-if="submitting">Saving...</span>
              <span v-else>{{ editingRecord ? 'Update' : 'Save' }}</span>
            </button>
          </div>
        </form>
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
const submitting = ref(false)
const records = ref([])
const showAddRecordModal = ref(false)
const editingRecord = ref(null)
const searchQuery = ref('')
const typeFilter = ref('')
const categoryFilter = ref('')
const dateFilter = ref('')

const recordForm = ref({
  date: '',
  description: '',
  reference: '',
  type: '',
  category: '',
  amount: '',
  status: 'pending'
})

// Computed
const filteredRecords = computed(() => {
  let filtered = records.value

  if (typeFilter.value) {
    filtered = filtered.filter(record => record.type === typeFilter.value)
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(record => record.category === categoryFilter.value)
  }

  if (dateFilter.value) {
    filtered = filtered.filter(record => record.date === dateFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record => 
      record.description?.toLowerCase().includes(query) ||
      record.reference?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const stats = computed(() => {
  const income = records.value
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
  
  const expenses = records.value
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)

  return {
    total: records.value.length,
    income,
    expenses,
    balance: income - expenses
  }
})

// Methods
const loadRecords = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (typeFilter.value) params.append('type', typeFilter.value)
    if (categoryFilter.value) params.append('category', categoryFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)

    const response = await axios.get(`api/financial/records?${params}`)
    records.value = response.data.data || []
  } catch (error) {
    console.error('Error loading records:', error)
    toast.error('Failed to load records')
    records.value = []
  } finally {
    loading.value = false
  }
}

const saveRecord = async () => {
  submitting.value = true
  
  try {
    const endpoint = editingRecord.value 
      ? `api/financial/records/${editingRecord.value.id}`
      : 'api/financial/records'
    
    const method = editingRecord.value ? 'put' : 'post'
    const response = await axios[method](endpoint, recordForm.value)
    
    if (response.data.status === 'success') {
      toast.success(`Record ${editingRecord.value ? 'updated' : 'created'} successfully`)
      closeModal()
      loadRecords()
    } else {
      toast.error(response.data.message || `Failed to ${editingRecord.value ? 'update' : 'create'} record`)
    }
  } catch (error) {
    console.error('Error saving record:', error)
    toast.error(`Failed to ${editingRecord.value ? 'update' : 'create'} record`)
  } finally {
    submitting.value = false
  }
}

const editRecord = (record) => {
  editingRecord.value = record
  recordForm.value = { ...record }
  showAddRecordModal.value = true
}

const deleteRecord = async (id) => {
  if (!confirm('Are you sure you want to delete this record?')) return
  
  try {
    const response = await axios.delete(`api/financial/records/${id}`)
    if (response.data.status === 'success') {
      toast.success('Record deleted successfully')
      loadRecords()
    } else {
      toast.error(response.data.message || 'Failed to delete record')
    }
  } catch (error) {
    console.error('Error deleting record:', error)
    toast.error('Failed to delete record')
  }
}

const exportRecords = () => {
  // Implementation for exporting records
  toast.info('Export functionality coming soon')
}

const closeModal = () => {
  showAddRecordModal.value = false
  editingRecord.value = null
  recordForm.value = {
    date: '',
    description: '',
    reference: '',
    type: '',
    category: '',
    amount: '',
    status: 'pending'
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

const getTypeColor = (type) => {
  switch (type) {
    case 'income':
      return 'text-green-600 bg-green-100/30'
    case 'expense':
      return 'text-red-600 bg-red-100/30'
    default:
      return 'text-slate-600 bg-slate-100/30'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'text-amber-600 bg-amber-100/30'
    case 'verified':
      return 'text-blue-600 bg-blue-100/30'
    case 'approved':
      return 'text-green-600 bg-green-100/30'
    default:
      return 'text-slate-600 bg-slate-100/30'
  }
}

// Lifecycle
onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>
