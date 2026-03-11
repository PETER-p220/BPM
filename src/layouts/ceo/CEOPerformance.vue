<template>
  <div class="perf-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Performance Evaluations</h1>
        <p class="page-subtitle">Review and manage all employee performance evaluations</p>
      </div>
      <div class="page-header-right">
        <button @click="exportToExcel" class="btn-export">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Export Excel
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-card--blue">
        <div class="stat-card-body">
          <div class="stat-info">
            <p class="stat-label">Total Evaluations</p>
            <p class="stat-value">{{ statistics.total }}</p>
          </div>
          <div class="stat-icon-wrap stat-icon-wrap--blue">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-card-body">
          <div class="stat-info">
            <p class="stat-label">Outstanding</p>
            <p class="stat-value">{{ statistics.outstanding }}</p>
          </div>
          <div class="stat-icon-wrap stat-icon-wrap--green">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--amber">
        <div class="stat-card-body">
          <div class="stat-info">
            <p class="stat-label">Needs Improvement</p>
            <p class="stat-value">{{ statistics.needs_improvement }}</p>
          </div>
          <div class="stat-icon-wrap stat-icon-wrap--amber">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--red">
        <div class="stat-card-body">
          <div class="stat-info">
            <p class="stat-label">Unsatisfactory</p>
            <p class="stat-value">{{ statistics.unsatisfactory }}</p>
          </div>
          <div class="stat-icon-wrap stat-icon-wrap--red">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-card">
      <div class="filter-grid">
        <div class="filter-field">
          <label class="filter-label">Search Employee</label>
          <div class="input-wrap">
            <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by name..."
              class="filter-input filter-input--icon"
            >
          </div>
        </div>

        <div class="filter-field">
          <label class="filter-label">Department</label>
          <select v-model="filters.department" class="filter-input">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.department_id" :value="dept.department_id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-field">
          <label class="filter-label">Status</label>
          <select v-model="filters.status" class="filter-input">
            <option value="">All Status</option>
            <option value="outstanding">Outstanding</option>
            <option value="exceeds_expectations">Exceeds Expectations</option>
            <option value="meets_expectations">Meets Expectations</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="unsatisfactory">Unsatisfactory</option>
          </select>
        </div>

        <div class="filter-field">
          <label class="filter-label">Review Period</label>
          <input
            v-model="filters.review_period"
            type="text"
            placeholder="e.g., 2024-Q1"
            class="filter-input"
          >
        </div>
      </div>

      <div class="filter-actions">
        <button @click="fetchEvaluations" class="btn btn--primary">Apply Filters</button>
        <button @click="clearFilters" class="btn btn--ghost">Clear</button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Review Period</th>
              <th>Overall Rating</th>
              <th>Status</th>
              <th>Review Date</th>
              <th>Reviewer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="table-empty">
                <div class="loading-wrap">
                  <div class="spinner"></div>
                  <span>Loading evaluations…</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredEvaluations.length === 0">
              <td colspan="8" class="table-empty">
                <div class="empty-wrap">
                  <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>No performance evaluations found</span>
                </div>
              </td>
            </tr>
            <tr v-for="item in filteredEvaluations" :key="item.id" class="table-row">
              <td>
                <div class="employee-name">{{ item.employee?.name }}</div>
                <div class="employee-email">{{ item.employee?.email }}</div>
              </td>
              <td class="text-secondary">{{ item.employee?.department?.name }}</td>
              <td class="text-secondary">{{ item.review_period }}</td>
              <td>
                <div class="rating-wrap">
                  <span class="rating-score">{{ item.overall_rating }}/5</span>
                  <div class="stars">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="star"
                      :class="i <= item.overall_rating ? 'star--filled' : 'star--empty'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', `status-badge--${item.status}`]">
                  {{ formatStatus(item.status) }}
                </span>
              </td>
              <td class="text-secondary">{{ formatDate(item.review_date) }}</td>
              <td class="text-secondary">{{ item.reviewer?.name }}</td>
              <td>
                <button @click="viewEvaluation(item)" class="btn-view">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Evaluation Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeViewModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Performance Evaluation Details
          </h3>
          
          <div v-if="selectedEvaluation" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <p class="text-gray-900 font-medium">{{ selectedEvaluation.employee?.name }}</p>
                <p class="text-gray-500 text-sm">{{ selectedEvaluation.employee?.email }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p class="text-gray-900">{{ selectedEvaluation.employee?.department?.name || selectedEvaluation.employee?.department_id }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Review Period</label>
                <p class="text-gray-900">{{ selectedEvaluation.review_period }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Review Date</label>
                <p class="text-gray-900">{{ formatDate(selectedEvaluation.review_date) }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Knowledge</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-blue-600">{{ selectedEvaluation.job_knowledge }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" :style="{width: (selectedEvaluation.job_knowledge / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Work Quality</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-green-600">{{ selectedEvaluation.work_quality }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-green-600 h-2 rounded-full" :style="{width: (selectedEvaluation.work_quality / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Productivity</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-purple-600">{{ selectedEvaluation.productivity }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-purple-600 h-2 rounded-full" :style="{width: (selectedEvaluation.productivity / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Communication</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-yellow-600">{{ selectedEvaluation.communication }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-yellow-600 h-2 rounded-full" :style="{width: (selectedEvaluation.communication / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teamwork</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-indigo-600">{{ selectedEvaluation.teamwork }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-indigo-600 h-2 rounded-full" :style="{width: (selectedEvaluation.teamwork / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Initiative</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-red-600">{{ selectedEvaluation.initiative }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-red-600 h-2 rounded-full" :style="{width: (selectedEvaluation.initiative / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
              <div class="flex items-center">
                <span class="text-3xl font-bold text-gray-900">{{ selectedEvaluation.overall_rating }}/5</span>
                <div class="ml-3">
                  <span class="px-3 py-1 rounded-full text-sm font-medium" 
                    :class="getRatingClass(selectedEvaluation.overall_rating)">
                    {{ getRatingText(selectedEvaluation.overall_rating) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="selectedEvaluation.overall_comments" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700 whitespace-pre-wrap">{{ selectedEvaluation.overall_comments }}</p>
              </div>
            </div>
            
            <div v-if="selectedEvaluation.reviewer" class="mt-4 pt-4 border-t">
              <label class="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
              <p class="text-gray-900">{{ selectedEvaluation.reviewer?.name }}</p>
              <p class="text-gray-500 text-sm">{{ selectedEvaluation.reviewer?.email }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeViewModal"
              class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-times mr-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'

const evaluations = ref([])
const departments = ref([])
const isLoading = ref(false)
const showViewModal = ref(false)
const selectedEvaluation = ref(null)
const statistics = ref({
  total: 0,
  outstanding: 0,
  exceeds_expectations: 0,
  meets_expectations: 0,
  needs_improvement: 0,
  unsatisfactory: 0
})

const filters = ref({
  search: '',
  department: '',
  status: '',
  review_period: ''
})

// ✅ Fixed: renamed `eval` (reserved word in strict mode) → `evaluation`
const filteredEvaluations = computed(() => {
  let filtered = evaluations.value

  if (filters.value.search) {
    filtered = filtered.filter(evaluation => 
      evaluation.employee?.name?.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.department) {
    filtered = filtered.filter(evaluation => 
      evaluation.employee?.department_id == filters.value.department
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(evaluation => evaluation.status === filters.value.status)
  }

  if (filters.value.review_period) {
    filtered = filtered.filter(evaluation => 
      evaluation.review_period?.toLowerCase().includes(filters.value.review_period.toLowerCase())
    )
  }

  return filtered
})

onMounted(async () => {
  await Promise.all([
    fetchEvaluations(),
    fetchDepartments()
  ])
})

async function fetchEvaluations() {
  isLoading.value = true
  try {
    console.log('Fetching CEO evaluations...')
    const response = await axios.get('/api/ceo/performance/evaluations')
    console.log('CEO API Response:', response.data)
    evaluations.value = response.data.data || []
    calculateStatistics()
    console.log('Evaluations loaded:', evaluations.value.length)
  } catch (error) {
    console.error('Error fetching CEO evaluations:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
    }
  } finally {
    isLoading.value = false
  }
}

async function fetchDepartments() {
  try {
    const response = await axios.get('/api/all/departments')
    departments.value = response.data.departments || []
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

function calculateStatistics() {
  const stats = {
    total: evaluations.value.length,
    outstanding: 0,
    exceeds_expectations: 0,
    meets_expectations: 0,
    needs_improvement: 0,
    unsatisfactory: 0
  }

  evaluations.value.forEach(item => {
    if (stats[item.status] !== undefined) stats[item.status]++
  })

  statistics.value = stats
}

function clearFilters() {
  filters.value = {
    search: '',
    department: '',
    status: '',
    review_period: ''
  }
}

function getStatusClass(status) {
  const classes = {
    outstanding: 'bg-green-100 text-green-800',
    exceeds_expectations: 'bg-blue-100 text-blue-800',
    meets_expectations: 'bg-yellow-100 text-yellow-800',
    needs_improvement: 'bg-orange-100 text-orange-800',
    unsatisfactory: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function formatStatus(status) {
  return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || status
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function viewEvaluation(item) {
  selectedEvaluation.value = item
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedEvaluation.value = null
}

function getRatingClass(rating) {
  if (rating >= 4.5) return 'bg-green-100 text-green-800'
  if (rating >= 3.5) return 'bg-blue-100 text-blue-800'
  if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getRatingText(rating) {
  if (rating >= 4.5) return 'Outstanding'
  if (rating >= 3.5) return 'Exceeds Expectations'
  if (rating >= 2.5) return 'Meets Expectations'
  if (rating >= 1.5) return 'Needs Improvement'
  return 'Unsatisfactory'
}

function exportToExcel() {
  console.log('Export to Excel')
}
</script>

<style scoped>
@import url('https://fonts.2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.perf-container {
  padding: 2rem;
  min-height: 100vh;
  background: #f4f6fb;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #0f172a;
}

/* ── Page Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.12s ease;
}

.btn-export:hover { background: #15803d; transform: translateY(-1px); }
.btn-icon { width: 16px; height: 16px; }

/* ── Stat Cards ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px;
  height: 100%;
}

.stat-card--blue::before  { background: #3b82f6; }
.stat-card--green::before { background: #22c55e; }
.stat-card--amber::before { background: #f59e0b; }
.stat-card--red::before   { background: #ef4444; }

.stat-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.35rem 1.35rem 1.35rem 1.65rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.4rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-icon-wrap {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap--blue  { background: #dbeafe; }
.stat-icon-wrap--green { background: #dcfce7; }
.stat-icon-wrap--amber { background: #fef9c3; }
.stat-icon-wrap--red   { background: #fee2e2; }

.stat-icon {
  width: 22px;
  height: 22px;
}

.stat-card--blue  .stat-icon { color: #2563eb; }
.stat-card--green .stat-icon { color: #16a34a; }
.stat-card--amber .stat-icon { color: #d97706; }
.stat-card--red   .stat-icon { color: #dc2626; }

/* ── Filter Card ── */
.filter-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 1.35rem 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.1rem;
}

.filter-field { display: flex; flex-direction: column; }

.filter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.45rem;
}

.input-wrap { position: relative; }

.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: #94a3b8;
  pointer-events: none;
}

.filter-input {
  width: 100%;
  padding: 0.6rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  appearance: none;
}

.filter-input--icon { padding-left: 2.1rem; }

.filter-input:focus {
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.filter-input::placeholder { color: #94a3b8; }

.filter-actions {
  display: flex;
  gap: 0.625rem;
  padding-top: 0.25rem;
  border-top: 1px solid #f1f5f9;
  margin-top: 0.25rem;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn--primary {
  background: #2563eb;
  color: #fff;
}
.btn--primary:hover { background: #1d4ed8; }

.btn--ghost {
  background: #f1f5f9;
  color: #374151;
  border: 1.5px solid #e2e8f0;
}
.btn--ghost:hover { background: #e2e8f0; }

/* ── Table Card ── */
.table-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-scroll { overflow-x: auto; }
.table-scroll::-webkit-scrollbar { height: 5px; }
.table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.data-table th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
  white-space: nowrap;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.1s ease;
}

.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #f8fafc; }

.data-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
}

.employee-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.875rem;
}

.employee-email {
  font-size: 0.775rem;
  color: #94a3b8;
  margin-top: 1px;
}

.text-secondary { color: #475569; font-size: 0.875rem; }

/* ── Rating ── */
.rating-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-score {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

.stars { display: flex; gap: 1px; }

.star { width: 14px; height: 14px; }
.star--filled { color: #f59e0b; }
.star--empty  { color: #e2e8f0; }

/* ── Status Badges ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.status-badge--outstanding         { background: #dcfce7; color: #15803d; }
.status-badge--exceeds_expectations { background: #dbeafe; color: #1d4ed8; }
.status-badge--meets_expectations   { background: #fef9c3; color: #a16207; }
.status-badge--needs_improvement    { background: #ffedd5; color: #c2410c; }
.status-badge--unsatisfactory       { background: #fee2e2; color: #b91c1c; }

/* ── View Button ── */
.btn-view {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.875rem;
  background: #eff6ff;
  color: #2563eb;
  border: 1.5px solid #bfdbfe;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-view:hover {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

/* ── Empty & Loading ── */
.table-empty {
  text-align: center;
  padding: 3.5rem 1rem !important;
}

.loading-wrap,
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon { width: 36px; height: 36px; opacity: 0.35; }

/* ── Responsive ── */
@media (max-width: 1280px) {
  .stats-grid   { grid-template-columns: repeat(2, 1fr); }
  .filter-grid  { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .perf-container { padding: 1rem; }
  .stats-grid     { grid-template-columns: 1fr; }
  .filter-grid    { grid-template-columns: 1fr; }
  .page-header    { flex-direction: column; }
}
</style>