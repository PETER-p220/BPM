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

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <i class="fas fa-exclamation-circle text-4xl"></i>
      </div>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="fetchDashboardData" 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Retry
      </button>
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
            <span class="value">{{ dashboardData.tenders.registered }}</span>
          </div>
          <div class="stat-row">
            <span class="label">Assigned</span>
            <span class="value">{{ dashboardData.tenders.assigned }}</span>
          </div>
          <div class="stat-row">
            <span class="label">Submitted</span>
            <span class="value">{{ dashboardData.tenders.submitted }}</span>
          </div>
          <div class="stat-row">
            <span class="label">In Progress</span>
            <span class="value">{{ dashboardData.tenders.inProgress }}</span>
          </div>
          <div class="stat-row warning">
            <span class="label">Deadline Reached</span>
            <span class="value">{{ dashboardData.tenders.deadlineReached }}</span>
          </div>
          <div class="stat-row danger">
            <span class="label">Expired</span>
            <span class="value">{{ dashboardData.tenders.expired }}</span>
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
            <span class="value">{{ dashboardData.projects.total }}</span>
          </div>
          <div class="stat-row">
            <span class="label">In Progress</span>
            <span class="value">{{ dashboardData.projects.inProgress }}</span>
          </div>
          <div class="stat-row success">
            <span class="label">Completed</span>
            <span class="value">{{ dashboardData.projects.completed }}</span>
          </div>
          <div class="stat-row danger">
            <span class="label">Failed</span>
            <span class="value">{{ dashboardData.projects.failed }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

// ── State ────────────────────────────────────────────────
const isLoading = ref(true)
const error = ref(null)

const dashboardData = ref({
  tenders: {
    registered: 0,
    assigned: 0,
    submitted: 0,
    inProgress: 0,
    deadlineReached: 0,
    expired: 0
  },
  projects: {
    total: 0,
    inProgress: 0,
    completed: 0,
    failed: 0
  }
})

// ── Fetch Dashboard Data (Single API Call) ───────────────
const fetchDashboardData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { data } = await axios.get('api/dashboard/stats')
    
    // Update dashboard data - handle both direct data and nested data formats
    const responseData = data.data || data
    
    dashboardData.value = {
      tenders: {
        registered: Number(responseData.tenders?.registered || 0),
        assigned: Number(responseData.tenders?.assigned || 0),
        submitted: Number(responseData.tenders?.submitted || 0),
        inProgress: Number(responseData.tenders?.inProgress || 0),
        deadlineReached: Number(responseData.tenders?.deadlineReached || 0),
        expired: Number(responseData.tenders?.expired || 0)
      },
      projects: {
        total: Number(responseData.projects?.total || 0),
        inProgress: Number(responseData.projects?.inProgress || 0),
        completed: Number(responseData.projects?.completed || 0),
        failed: Number(responseData.projects?.failed || 0)
      }
    }
  } catch (err) {
    console.error('Dashboard data loading failed:', err)
    error.value = 'Failed to load dashboard data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
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
