<template>
  <div class="financial-records-container">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">Financial Records</h1>
          <p class="dashboard-subtitle">Complete financial overview and analytics</p>
        </div>
        <div class="header-actions">
          <div class="export-buttons">
            <button @click="exportPDF" class="export-btn pdf-btn">
              <i class="fas fa-file-pdf"></i>
              Export PDF
            </button>
            <button @click="exportExcel" class="export-btn excel-btn">
              <i class="fas fa-file-excel"></i>
              Export Excel
            </button>
          </div>
          <button class="refresh-btn" @click="refreshData">
            <i class="fas fa-sync-alt" :class="{ 'spinning': isRefreshing }"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Financial Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card income-card">
        <div class="card-icon">
          <i class="fas fa-arrow-up"></i>
        </div>
        <div class="card-content">
          <div class="card-value">TZS {{ formatNumber(stats.totalIncome) }}</div>
          <div class="card-label">Total Income</div>
        </div>
      </div>
      
      <div class="summary-card expense-card">
        <div class="card-icon">
          <i class="fas fa-arrow-down"></i>
        </div>
        <div class="card-content">
          <div class="card-value">TZS {{ formatNumber(stats.totalExpenses) }}</div>
          <div class="card-label">Total Expenses</div>
        </div>
      </div>
      
      <div class="summary-card balance-card">
        <div class="card-icon">
          <i class="fas fa-balance-scale"></i>
        </div>
        <div class="card-content">
          <div class="card-value">TZS {{ formatNumber(stats.netBalance) }}</div>
          <div class="card-label">Net Balance</div>
        </div>
      </div>
      
      <div class="summary-card records-card">
        <div class="card-icon">
          <i class="fas fa-database"></i>
        </div>
        <div class="card-content">
          <div class="card-value">{{ stats.totalRecords }}</div>
          <div class="card-label">Total Records</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Monthly Trends</h3>
        <div class="chart-wrapper">
          <canvas ref="monthlyTrendsChart" width="400" height="200"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Category Breakdown</h3>
        <div class="chart-wrapper">
          <canvas ref="categoryChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Additional Charts Row -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Income vs Expenses Comparison</h3>
        <div class="chart-wrapper">
          <canvas ref="comparisonChart" width="400" height="200"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Weekly Performance</h3>
        <div class="chart-wrapper">
          <canvas ref="weeklyChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Type:</label>
        <select v-model="filters.type" @change="applyFilters">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Category:</label>
        <select v-model="filters.category" @change="applyFilters">
          <option value="">All Categories</option>
          <option value="sales">Sales</option>
          <option value="services">Services</option>
          <option value="operations">Operations</option>
          <option value="salary">Salary</option>
          <option value="utilities">Utilities</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Date:</label>
        <input type="date" v-model="filters.date" @change="applyFilters">
      </div>
      
      <div class="filter-group">
        <label>Search:</label>
        <input type="text" v-model="filters.search" @input="applyFilters" placeholder="Search...">
      </div>
    </div>

    <!-- Records Table -->
    <div class="table-container">
      <div class="table-header">
        <h3>Financial Records</h3>
        <div class="table-info">
          <span>{{ records.length }} records</span>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="records-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ formatDate(record.date) }}</td>
              <td>{{ record.description }}</td>
              <td>
                <span :class="['type-badge', record.type]">
                  {{ record.type.toUpperCase() }}
                </span>
              </td>
              <td>{{ record.category }}</td>
              <td class="amount-cell">
                <span :class="['amount', record.type]">
                  TZS {{ formatNumber(record.amount) }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', record.status]">
                  {{ record.status.toUpperCase() }}
                </span>
              </td>
              <td>{{ record.creator?.name || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import Chart from 'chart.js/auto'

const toast = useToast()

const records = ref([])
const stats = ref({})
const isRefreshing = ref(false)

// Chart references
const monthlyTrendsChart = ref(null)
const categoryChart = ref(null)
const comparisonChart = ref(null)
const weeklyChart = ref(null)

// Chart instances
let monthlyTrendsInstance = null
let categoryInstance = null
let comparisonInstance = null
let weeklyInstance = null

const filters = ref({
  type: '',
  category: '',
  date: '',
  search: ''
})

const fetchRecords = async () => {
  try {
    const response = await axios.get('/api/ceo/financial/records', {
      params: filters.value
    })
    
    if (response.data.status === 'success') {
      records.value = response.data.data
      await nextTick()
      updateCharts()
    }
  } catch (error) {
    toast.error('Failed to fetch records')
    console.error('Error fetching records:', error)
  }
}

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/ceo/financial/records/stats')
    
    if (response.data.status === 'success') {
      stats.value = response.data.data
      await nextTick()
      updateCharts()
    }
  } catch (error) {
    toast.error('Failed to fetch statistics')
    console.error('Error fetching stats:', error)
  }
}

const initializeCharts = () => {
  // Monthly Trends Chart
  if (monthlyTrendsChart.value) {
    const ctx = monthlyTrendsChart.value.getContext('2d')
    monthlyTrendsInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Income',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Expenses',
            data: [],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': TZS ' + context.parsed.y.toLocaleString()
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'TZS ' + value.toLocaleString()
              }
            }
          }
        }
      }
    })
  }

  // Category Breakdown Chart
  if (categoryChart.value) {
    const ctx = categoryChart.value.getContext('2d')
    categoryInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#6b7280'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((context.parsed / total) * 100).toFixed(1)
                return context.label + ': TZS ' + context.parsed.toLocaleString() + ' (' + percentage + '%)'
              }
            }
          }
        }
      }
    })
  }

  // Income vs Expenses Comparison Chart
  if (comparisonChart.value) {
    const ctx = comparisonChart.value.getContext('2d')
    comparisonInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Income',
            data: [],
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Expenses',
            data: [],
            backgroundColor: '#ef4444',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': TZS ' + context.parsed.y.toLocaleString()
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'TZS ' + (value / 1000000).toFixed(1) + 'M'
              }
            }
          }
        }
      }
    })
  }

  // Weekly Performance Chart
  if (weeklyChart.value) {
    const ctx = weeklyChart.value.getContext('2d')
    weeklyInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Net Balance',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Net Balance: TZS ' + context.parsed.y.toLocaleString()
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'TZS ' + (value / 1000000).toFixed(1) + 'M'
              }
            }
          }
        }
      }
    })
  }
}

const generateMonthlyData = (type) => {
  // Generate realistic monthly data based on type
  const baseData = type === 'income' 
    ? [3200000, 3500000, 3100000, 3800000, 4200000, 4500000, 4800000, 5200000, 4900000, 5100000, 4700000, 5300000]
    : [2800000, 2900000, 2700000, 3200000, 3400000, 3600000, 3800000, 3900000, 3700000, 3500000, 3300000, 3800000]
  
  return baseData.map(value => value + Math.random() * 500000 - 250000)
}

const generateCategoryData = () => {
  return [
    8500000,
    6200000,
    4800000,
    7200000,
    2100000,
    1900000
  ].map(value => value + Math.random() * 1000000 - 500000)
}

const updateCharts = () => {
  // Update Monthly Trends Chart with real data
  if (stats.value.monthlyTrends && monthlyTrendsInstance) {
    const monthlyData = stats.value.monthlyTrends
    const labels = monthlyData.map(item => {
      const date = new Date(item.month + '-01')
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    })
    const incomeData = monthlyData.map(item => parseFloat(item.income) || 0)
    const expenseData = monthlyData.map(item => parseFloat(item.expenses) || 0)
    
    monthlyTrendsInstance.data.labels = labels
    monthlyTrendsInstance.data.datasets[0].data = incomeData
    monthlyTrendsInstance.data.datasets[1].data = expenseData
    monthlyTrendsInstance.update()
  }

  // Update Category Breakdown Chart with real data
  if (stats.value.categoryBreakdown && categoryInstance) {
    const categoryData = stats.value.categoryBreakdown
    const labels = categoryData.map(item => item.category || 'Unknown')
    const data = categoryData.map(item => {
      const income = parseFloat(item.income) || 0
      const expenses = parseFloat(item.expenses) || 0
      return income + expenses
    })
    
    categoryInstance.data.labels = labels
    categoryInstance.data.datasets[0].data = data
    categoryInstance.update()
  }

  // Update Income vs Expenses Comparison Chart with real data
  if (stats.value.monthlyTrends && comparisonInstance) {
    const monthlyData = stats.value.monthlyTrends
    const quarterlyData = {
      Q1: { income: 0, expenses: 0 },
      Q2: { income: 0, expenses: 0 },
      Q3: { income: 0, expenses: 0 },
      Q4: { income: 0, expenses: 0 }
    }
    
    monthlyData.forEach(item => {
      const month = new Date(item.month + '-01')
      const quarter = 'Q' + Math.ceil((month.getMonth() + 1) / 3)
      if (quarterlyData[quarter]) {
        quarterlyData[quarter].income += parseFloat(item.income) || 0
        quarterlyData[quarter].expenses += parseFloat(item.expenses) || 0
      }
    })
    
    comparisonInstance.data.datasets[0].data = [
      quarterlyData.Q1.income,
      quarterlyData.Q2.income,
      quarterlyData.Q3.income,
      quarterlyData.Q4.income
    ]
    comparisonInstance.data.datasets[1].data = [
      quarterlyData.Q1.expenses,
      quarterlyData.Q2.expenses,
      quarterlyData.Q3.expenses,
      quarterlyData.Q4.expenses
    ]
    comparisonInstance.update()
  }

  // Update Weekly Performance Chart with real data
  if (stats.value.monthlyTrends && weeklyInstance) {
    const monthlyData = stats.value.monthlyTrends
    const weeklyData = []
    
    // Generate weekly data from monthly data (simplified approach)
    if (monthlyData.length > 0) {
      for (let i = 0; i < 4; i++) {
        const monthIndex = monthlyData.length - 1 - i
        if (monthIndex >= 0) {
          const month = monthlyData[monthIndex]
          const netBalance = (parseFloat(month.income) || 0) - (parseFloat(month.expenses) || 0)
          weeklyData.push(netBalance)
        }
      }
    }
    
    weeklyInstance.data.datasets[0].data = weeklyData.reverse()
    weeklyInstance.update()
  }
}

const refreshData = async () => {
  isRefreshing.value = true
  await Promise.all([fetchRecords(), fetchStats()])
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

const applyFilters = () => {
  fetchRecords()
}

const exportPDF = async () => {
  try {
    const response = await axios.get('/api/ceo/financial/records/export/pdf', {
      params: filters.value,
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `financial_records_${new Date().toISOString().split('T')[0]}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    toast.success('PDF exported successfully')
  } catch (error) {
    toast.error('Failed to export PDF')
    console.error('Error exporting PDF:', error)
  }
}

const exportExcel = async () => {
  try {
    const response = await axios.get('/api/ceo/financial/records/export/excel', {
      params: filters.value,
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `financial_records_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    toast.success('Excel exported successfully')
  } catch (error) {
    toast.error('Failed to export Excel')
    console.error('Error exporting Excel:', error)
  }
}

const formatNumber = (num) => {
  return num ? num.toLocaleString() : '0'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  await fetchRecords()
  await fetchStats()
  await nextTick()
  initializeCharts()
  // Update charts immediately after initialization if data is available
  if (stats.value.monthlyTrends || stats.value.categoryBreakdown) {
    await nextTick()
    updateCharts()
  }
})
</script>

<style scoped>
.financial-records-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-subtitle {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.export-buttons {
  display: flex;
  gap: 0.5rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pdf-btn {
  background-color: #dc2626;
  color: white;
}

.pdf-btn:hover {
  background-color: #b91c1c;
}

.excel-btn {
  background-color: #16a34a;
  color: white;
}

.excel-btn:hover {
  background-color: #15803d;
}

.refresh-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background-color: #f9fafb;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.income-card .card-icon {
  background-color: #dcfce7;
  color: #16a34a;
}

.expense-card .card-icon {
  background-color: #fef2f2;
  color: #dc2626;
}

.balance-card .card-icon {
  background-color: #eff6ff;
  color: #2563eb;
}

.records-card .card-icon {
  background-color: #f3f4f6;
  color: #6b7280;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.card-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.125rem;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.chart-wrapper {
  height: 300px;
  position: relative;
  width: 100%;
}

.filters-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  margin: 0;
  color: #1f2937;
}

.table-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.records-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.records-table tbody tr:hover {
  background-color: #f9fafb;
}

.type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.income {
  background-color: #dcfce7;
  color: #16a34a;
}

.type-badge.expense {
  background-color: #fef2f2;
  color: #dc2626;
}

.amount-cell {
  font-weight: 600;
}

.amount.income {
  color: #16a34a;
}

.amount.expense {
  color: #dc2626;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.verified {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-badge.approved {
  background-color: #dcfce7;
  color: #16a34a;
}
</style>
