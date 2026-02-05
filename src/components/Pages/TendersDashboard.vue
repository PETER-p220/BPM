<template>
  <div class="dashboard p-6 bg-gray-50 min-h-[580px] overflow-y-auto">
    <!-- Loading / Skeleton State -->
    <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Skeleton for Tenders Card -->
      <div class="stat-card animate-pulse">
        <div class="card-header">
          <div class="skeleton-icon"></div>
          <div class="skeleton-title h-7 w-32 bg-gray-300 rounded"></div>
        </div>
        <div class="card-body space-y-4">
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Skeleton for Projects Card -->
      <div class="stat-card animate-pulse">
        <div class="card-header">
          <div class="skeleton-icon"></div>
          <div class="skeleton-title h-7 w-32 bg-gray-300 rounded"></div>
        </div>
        <div class="card-body space-y-4">
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
          <div class="skeleton-row h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Real Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tenders Card -->
      <div class="stat-card tenders">
        <div class="card-header">
          <div class="icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <h2>Tenders</h2>
        </div>
        <div class="card-body">
          <div class="stat-row highlight">
            <span class="label">Registered</span>
            <span class="value">{{ totalTenders }}</span>
          </div>
          <div class="stat-row">
            <span class="label">Assigned</span>
            <span class="value">{{ totalAssignedTenders }}</span>
          </div>
          <div class="stat-row">
            <span class="label">Submitted</span>
            <span class="value">{{ totalTenderSubmissions }}</span>
          </div>
          <div class="stat-row">
            <span class="label">In Progress</span>
            <span class="value">{{ totalOnProgressTenders }}</span>
          </div>
          <div class="stat-row warning">
            <span class="label">Deadline Reached</span>
            <span class="value">{{ totalDeadlineReachedTenders }}</span>
          </div>
          <div class="stat-row danger">
            <span class="label">Expired</span>
            <span class="value">{{ totalExpiredTenders }}</span>
          </div>
        </div>
      </div>

      <!-- Projects Card -->
      <div class="stat-card projects">
        <div class="card-header">
          <div class="icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <h2>Projects</h2>
        </div>
        <div class="card-body">
          <div class="stat-row highlight">
            <span class="label">Total Projects</span>
            <span class="value">{{ totalProjects }}</span>
          </div>
          <div class="stat-row">
            <span class="label">In Progress</span>
            <span class="value">{{ totalOnProgressProjects }}</span>
          </div>
          <div class="stat-row success">
            <span class="label">Completed</span>
            <span class="value">{{ totalCompletedProjects }}</span>
          </div>
          <div class="stat-row danger">
            <span class="label">Failed</span>
            <span class="value">{{ totalFailedProjects }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'  // Make sure this path is correct in your project

// ── State ────────────────────────────────────────────────
const isLoading = ref(true)

const totalTenders              = ref(0)
const totalAssignedTenders      = ref(0)
const totalTenderSubmissions    = ref(0)
const totalOnProgressTenders    = ref(0)
const totalDeadlineReachedTenders = ref(0)
const totalExpiredTenders       = ref(0)

const totalProjects             = ref(0)
const totalOnProgressProjects   = ref(0)
const totalCompletedProjects    = ref(0)
const totalFailedProjects       = ref(0)

// ── Fetch Functions ──────────────────────────────────────
const fetchTotalTenders = async () => {
  try {
    const { data } = await axios.get('api/count/registered-tenders')
    totalTenders.value = Number(data.registered_tenders || 0)
  } catch (err) {
    console.error('Failed to load registered tenders:', err)
  }
}

const fetchTotalAssignedTenders = async () => {
  try {
    const { data } = await axios.get('api/count/all-assigned/tenders')
    totalAssignedTenders.value = Number(data.assignedCount || 0)
  } catch (err) {
    console.error('Failed to load assigned tenders:', err)
  }
}

const fetchTotalTenderSubmissions = async () => {
  try {
    const { data } = await axios.get('api/count/tenders-submissions')
    totalTenderSubmissions.value = Number(data.submitted_tenders || 0)
  } catch (err) {
    console.error('Failed to load tender submissions:', err)
  }
}

const fetchTotalOnProgressTenders = async () => {
  try {
    const { data } = await axios.get('api/count/on-progress/tender')
    totalOnProgressTenders.value = Number(data.onProgressCount || 0)
  } catch (err) {
    console.error('Failed to load on-progress tenders:', err)
  }
}

const fetchTotalDeadlineReachedTenders = async () => {
  try {
    const { data } = await axios.get('api/count/all/deadline-reached-tenders')
    totalDeadlineReachedTenders.value = Number(data.expired_tenders || 0)
  } catch (err) {
    console.error('Failed to load deadline reached tenders:', err)
  }
}

const fetchTotalExpiredTenders = async () => {
  try {
    const { data } = await axios.get('api/count/all-expired/tenders')
    totalExpiredTenders.value = Number(data.expired_tenders || 0)
  } catch (err) {
    console.error('Failed to load expired tenders:', err)
  }
}

const fetchTotalProjects = async () => {
  try {
    const { data } = await axios.get('api/count/total-projects')
    totalProjects.value = Number(data.count_total_projects || 0)
  } catch (err) {
    console.error('Failed to load total projects:', err)
  }
}

const fetchTotalOnProgressProjects = async () => {
  try {
    const { data } = await axios.get('api/count/all/on-progress/projects')
    totalOnProgressProjects.value = Number(data.total_on_progress_projects || 0)
  } catch (err) {
    console.error('Failed to load on-progress projects:', err)
  }
}

const fetchTotalCompletedProjects = async () => {
  try {
    const { data } = await axios.get('api/count/completed-projects')
    totalCompletedProjects.value = Number(data.total_completed_projects || 0)
  } catch (err) {
    console.error('Failed to load completed projects:', err)
  }
}

const fetchTotalFailedProjects = async () => {
  try {
    const { data } = await axios.get('api/count/failed-projects')
    totalFailedProjects.value = Number(data.total_failed_projects || 0)
  } catch (err) {
    console.error('Failed to load failed projects:', err)
  }
}

// ── Load all data ────────────────────────────────────────
const fetchAllData = async () => {
  isLoading.value = true; // Optimized: parallel API calls
  try {
    await Promise.all([
      fetchTotalTenders(),
      fetchTotalAssignedTenders(),
      fetchTotalTenderSubmissions(),
      fetchTotalOnProgressTenders(),
      fetchTotalDeadlineReachedTenders(),
      fetchTotalExpiredTenders(),
      fetchTotalProjects(),
      fetchTotalOnProgressProjects(),
      fetchTotalCompletedProjects(),
      fetchTotalFailedProjects()
    ])
  } catch (err) {
    console.error('Dashboard data loading failed:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
.dashboard {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1f2937;
}

/* Card Base */
.stat-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
}

.tenders .icon { background: #dc2626; } /* red-600 */
.projects .icon { background: #16a34a; } /* green-600 */

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.card-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  font-size: 1rem;
}

.stat-row:hover {
  background: #f8fafc;
}

.label {
  color: #4b5563;
  font-weight: 500;
}

.value {
  font-weight: 700;
  color: #111827;
  min-width: 50px;
  text-align: right;
}

/* Status styles */
.highlight {
  background: #eff6ff;
  border-color: #bfdbfe;
  font-weight: 600;
}

.success {
  border-left: 3.5px solid #10b981;
  font-weight: 600;
}

.warning {
  border-left: 3.5px solid #f59e0b;
  font-weight: 600;
}

.danger {
  border-left: 3.5px solid #ef4444;
  font-weight: 600;
}

/* Skeleton loading */
.skeleton-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #e5e7eb;
}

.skeleton-row {
  height: 44px;
}

/* Responsive */
@media (max-width: 1024px) {
  .grid { gap: 1.25rem; }
}
</style>
