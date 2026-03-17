<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Financial Reports</h1>
      
      <!-- Date Range & Export -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center">
          <div class="flex gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Start Date</label>
              <input v-model="dateRange.start" type="date" class="border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">End Date</label>
              <input v-model="dateRange.end" type="date" class="border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Department</label>
              <select v-model="selectedDepartment" class="border rounded-lg px-4 py-2">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button @click="generateReport" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Generate Report
            </button>
            <button @click="exportPDF" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
              📄 Export PDF
            </button>
            <button @click="exportExcel" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
              📊 Export Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-sm text-gray-500 mb-2">Total Revenue</div>
          <div class="text-2xl font-bold text-green-600">${{ formatNumber(metrics.totalRevenue) }}</div>
          <div class="text-sm text-green-500">+12.5% from last period</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-sm text-gray-500 mb-2">Total Expenses</div>
          <div class="text-2xl font-bold text-red-600">${{ formatNumber(metrics.totalExpenses) }}</div>
          <div class="text-sm text-red-500">+8.3% from last period</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-sm text-gray-500 mb-2">Net Profit</div>
          <div class="text-2xl font-bold text-blue-600">${{ formatNumber(metrics.netProfit) }}</div>
          <div class="text-sm text-blue-500">+18.2% from last period</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-sm text-gray-500 mb-2">Profit Margin</div>
          <div class="text-2xl font-bold text-purple-600">{{ metrics.profitMargin }}%</div>
          <div class="text-sm text-purple-500">+2.1% from last period</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- Revenue Chart -->
        <div class="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Revenue Trend</h2>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <div class="text-4xl mb-2">📈</div>
              <p class="text-gray-500">Revenue chart would be displayed here</p>
              <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </div>

        <!-- Expense Breakdown -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Expense Breakdown</h2>
          <div class="space-y-3">
            <div v-for="expense in expenseBreakdown" :key="expense.category" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div :style="{ backgroundColor: expense.color }" class="w-3 h-3 rounded-full"></div>
                <span class="text-sm">{{ expense.category }}</span>
              </div>
              <div class="text-right">
                <div class="font-semibold">${{ formatNumber(expense.amount) }}</div>
                <div class="text-xs text-gray-500">{{ expense.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="mt-6 bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Financial Details</h2>
            <div class="flex gap-2">
              <button @click="activeTab = 'revenue'" :class="activeTab === 'revenue' ? 'bg-indigo-600 text-white' : 'border'" class="px-4 py-2 rounded-lg">
                Revenue
              </button>
              <button @click="activeTab = 'expenses'" :class="activeTab === 'expenses' ? 'bg-indigo-600 text-white' : 'border'" class="px-4 py-2 rounded-lg">
                Expenses
              </button>
              <button @click="activeTab = 'profit'" :class="activeTab === 'profit' ? 'bg-indigo-600 text-white' : 'border'" class="px-4 py-2 rounded-lg">
                Profit Analysis
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Revenue Table -->
          <div v-if="activeTab === 'revenue'" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2">Date</th>
                  <th class="text-left py-2">Source</th>
                  <th class="text-left py-2">Category</th>
                  <th class="text-right py-2">Amount</th>
                  <th class="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in revenueData" :key="item.id" class="border-b hover:bg-gray-50">
                  <td class="py-3">{{ formatDate(item.date) }}</td>
                  <td class="py-3">{{ item.source }}</td>
                  <td class="py-3">{{ item.category }}</td>
                  <td class="py-3 text-right font-semibold">${{ formatNumber(item.amount) }}</td>
                  <td class="py-3">
                    <span :class="getStatusClass(item.status)" class="px-2 py-1 text-xs rounded">
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Expenses Table -->
          <div v-if="activeTab === 'expenses'" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2">Date</th>
                  <th class="text-left py-2">Department</th>
                  <th class="text-left py-2">Category</th>
                  <th class="text-left py-2">Description</th>
                  <th class="text-right py-2">Amount</th>
                  <th class="text-left py-2">Approved By</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in expenseData" :key="item.id" class="border-b hover:bg-gray-50">
                  <td class="py-3">{{ formatDate(item.date) }}</td>
                  <td class="py-3">{{ item.department }}</td>
                  <td class="py-3">{{ item.category }}</td>
                  <td class="py-3">{{ item.description }}</td>
                  <td class="py-3 text-right font-semibold">${{ formatNumber(item.amount) }}</td>
                  <td class="py-3">{{ item.approvedBy }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Profit Analysis -->
          <div v-if="activeTab === 'profit'" class="space-y-4">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-3">Monthly Profit Trend</h3>
                <div class="space-y-2">
                  <div v-for="month in profitData" :key="month.month" class="flex justify-between items-center">
                    <span class="text-sm">{{ month.month }}</span>
                    <div class="flex items-center gap-2">
                      <div class="w-32 bg-gray-200 rounded-full h-2">
                        <div :style="{ width: month.percentage + '%' }" class="bg-green-500 h-2 rounded-full"></div>
                      </div>
                      <span class="text-sm font-semibold">${{ formatNumber(month.profit) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3">Department Performance</h3>
                <div class="space-y-2">
                  <div v-for="dept in departmentPerformance" :key="dept.name" class="flex justify-between items-center">
                    <span class="text-sm">{{ dept.name }}</span>
                    <span :class="dept.profit > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold">
                      {{ dept.profit > 0 ? '+' : '' }}${{ formatNumber(dept.profit) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref({
  start: '2024-01-01',
  end: '2024-12-31'
})

const selectedDepartment = ref('')
const activeTab = ref('revenue')

const departments = ref([
  { id: 1, name: 'IT Department' },
  { id: 2, name: 'HR Department' },
  { id: 3, name: 'Finance Department' },
  { id: 4, name: 'Operations' }
])

const metrics = ref({
  totalRevenue: 2450000,
  totalExpenses: 1820000,
  netProfit: 630000,
  profitMargin: 25.7
})

const expenseBreakdown = ref([
  { category: 'Salaries', amount: 850000, percentage: 46.7, color: '#3B82F6' },
  { category: 'Operations', amount: 420000, percentage: 23.1, color: '#10B981' },
  { category: 'Marketing', amount: 280000, percentage: 15.4, color: '#F59E0B' },
  { category: 'IT Infrastructure', amount: 180000, percentage: 9.9, color: '#EF4444' },
  { category: 'Other', amount: 90000, percentage: 4.9, color: '#8B5CF6' }
])

const revenueData = ref([
  { id: 1, date: '2024-03-15', source: 'Client A', category: 'Services', amount: 125000, status: 'Paid' },
  { id: 2, date: '2024-03-14', source: 'Client B', category: 'Products', amount: 85000, status: 'Pending' },
  { id: 3, date: '2024-03-13', source: 'Client C', category: 'Services', amount: 95000, status: 'Paid' },
  { id: 4, date: '2024-03-12', source: 'Client D', category: 'Consulting', amount: 120000, status: 'Paid' }
])

const expenseData = ref([
  { id: 1, date: '2024-03-15', department: 'IT', category: 'Software', description: 'New licenses', amount: 15000, approvedBy: 'John Doe' },
  { id: 2, date: '2024-03-14', department: 'HR', category: 'Training', description: 'Employee training', amount: 8000, approvedBy: 'Jane Smith' },
  { id: 3, date: '2024-03-13', department: 'Operations', category: 'Equipment', description: 'Office supplies', amount: 3500, approvedBy: 'Mike Johnson' }
])

const profitData = ref([
  { month: 'January', profit: 45000, percentage: 75 },
  { month: 'February', profit: 52000, percentage: 87 },
  { month: 'March', profit: 68000, percentage: 100 }
])

const departmentPerformance = ref([
  { name: 'IT Department', profit: 125000 },
  { name: 'HR Department', profit: 45000 },
  { name: 'Finance Department', profit: 89000 },
  { name: 'Operations', profit: -12000 }
])

function formatNumber(num) {
  return num.toLocaleString()
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function getStatusClass(status) {
  const classes = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function generateReport() {
  alert('Generating financial report...')
}

function exportPDF() {
  alert('Exporting to PDF...')
}

function exportExcel() {
  alert('Exporting to Excel...')
}
</script>
