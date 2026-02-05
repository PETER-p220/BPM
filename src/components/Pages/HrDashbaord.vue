<template>
  <div class="dashboard-container">
    <!-- Compact Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Admin Dashboard</h1>
        <p class="dashboard-subtitle">System-wide metrics and overview</p>
      </div>
      <div class="header-stats">
        <div class="quick-stat">
          <span class="quick-stat-label">Total Items</span>
          <span class="quick-stat-value">{{ totalSystemItems }}</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-label">Active</span>
          <span class="quick-stat-value">{{ totalActiveItems }}</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-label">Completion</span>
          <span class="quick-stat-value">{{ systemCompletionRate }}%</span>
        </div>
      </div>
    </div>

    <!-- Compact Stats Grid -->
    <div class="stats-grid">
      <!-- Tenders Card -->
      <div class="stat-card">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper tenders">
              <i class="fas fa-file-contract"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Tenders</h3>
              <span class="card-badge">{{ totalTenders }} Registered</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('tenders')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div class="metrics-grid">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalAssignedTenders }}</span>
                <span class="metric-label">Assigned</span>
              </div>
            </div>
            <div class="metric-item success">
              <div class="metric-icon">
                <i class="fas fa-paper-plane"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalTenderSubmissions }}</span>
                <span class="metric-label">Submitted</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">
                <i class="fas fa-hourglass-half"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalOnProgressTenders }}</span>
                <span class="metric-label">In Progress</span>
              </div>
            </div>
            <div class="metric-item warning">
              <div class="metric-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalDeadlineReachedTenders }}</span>
                <span class="metric-label">Due Soon</span>
              </div>
            </div>
            <div class="metric-item danger">
              <div class="metric-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalExpiredTenders }}</span>
                <span class="metric-label">Expired</span>
              </div>
            </div>
            <div class="metric-item info">
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ tenderCompletionRate }}%</span>
                <span class="metric-label">Completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Requests Card -->
      <div class="stat-card">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper requests">
              <i class="fas fa-inbox"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Requests</h3>
              <span class="card-badge">{{ totalRequests }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('requests')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div class="metrics-grid three-col">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-inbox"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalRequests }}</span>
                <span class="metric-label">Submitted</span>
              </div>
            </div>
            <div class="metric-item success">
              <div class="metric-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ approvedRequests }}</span>
                <span class="metric-label">Approved</span>
              </div>
            </div>
            <div class="metric-item danger">
              <div class="metric-icon">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ rejectedRequests }}</span>
                <span class="metric-label">Rejected</span>
              </div>
            </div>
            <div class="metric-item info">
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ requestApprovalRate }}%</span>
                <span class="metric-label">Approval Rate</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ pendingRequests }}</span>
                <span class="metric-label">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Card -->
      <div class="stat-card">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper projects">
              <i class="fas fa-project-diagram"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Projects</h3>
              <span class="card-badge">{{ totalProjects }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('projects')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div class="metrics-grid">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-tasks"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalProjects }}</span>
                <span class="metric-label">Total</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">
                <i class="fas fa-spinner"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalOnProgressProjects }}</span>
                <span class="metric-label">Active</span>
              </div>
            </div>
            <div class="metric-item success">
              <div class="metric-icon">
                <i class="fas fa-check-double"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalCompletedProjects }}</span>
                <span class="metric-label">Completed</span>
              </div>
            </div>
            <div class="metric-item danger">
              <div class="metric-icon">
                <i class="fas fa-times"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalFailedProjects }}</span>
                <span class="metric-label">Failed</span>
              </div>
            </div>
            <div class="metric-item info">
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ projectSuccessRate }}%</span>
                <span class="metric-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Metrics Cards -->
      <div class="stat-card compact">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper schedules">
              <i class="fas fa-file-invoice-dollar"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Price Schedules</h3>
              <span class="card-badge">{{ totalSchedules }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('schedules')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="compact-stat">
            <div class="compact-stat-item">
              <i class="fas fa-clipboard-check"></i>
              <span class="compact-value">{{ totalSchedules }}</span>
              <span class="compact-label">Submitted</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card compact">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper analyses">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Analyses</h3>
              <span class="card-badge">{{ totalAnalyses }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('analyses')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="compact-stat">
            <div class="compact-stat-item">
              <i class="fas fa-chart-bar"></i>
              <span class="compact-value">{{ totalAnalyses }}</span>
              <span class="compact-label">Submitted</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section">
      <div class="section-header">
        <div class="header-content">
          <h2 class="section-title">System Overview</h2>
          <p class="section-subtitle">Comprehensive statistics across all modules</p>
        </div>
        <div class="section-actions">
          <button class="filter-btn active">
            <i class="fas fa-chart-bar"></i>
            All Data
          </button>
          <button class="filter-btn">
            <i class="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>
      
      <div class="chart-wrapper">
        <apexchart 
          type="bar" 
          :options="chartOptions" 
          :series="chartSeries" 
          height="380"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import VueApexCharts from 'vue3-apexcharts';

// Reactive state
const totalTenders = ref(0);
const totalAssignedTenders = ref(0);
const totalTenderSubmissions = ref(0);
const totalProjects = ref(0);
const totalFailedProjects = ref(0);
const totalCompletedProjects = ref(0);
const totalOnProgressTenders = ref(0);
const totalDeadlineReachedTenders = ref(0);
const totalExpiredTenders = ref(0);
const totalOnProgressProjects = ref(0);
const totalAnalyses = ref(0);
const totalSchedules = ref(0);
const totalRequests = ref(0);
const approvedRequests = ref(0);
const rejectedRequests = ref(0);

// Computed values
const totalSystemItems = computed(() => {
  return totalTenders.value + totalRequests.value + totalProjects.value + 
         totalSchedules.value + totalAnalyses.value;
});

const totalActiveItems = computed(() => {
  return totalOnProgressTenders.value + totalOnProgressProjects.value;
});

const systemCompletionRate = computed(() => {
  const completed = totalTenderSubmissions.value + approvedRequests.value + totalCompletedProjects.value;
  const total = totalTenders.value + totalRequests.value + totalProjects.value;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

const tenderCompletionRate = computed(() => {
  const total = totalTenders.value;
  return total > 0 ? Math.round((totalTenderSubmissions.value / total) * 100) : 0;
});

const requestApprovalRate = computed(() => {
  const total = totalRequests.value;
  return total > 0 ? Math.round((approvedRequests.value / total) * 100) : 0;
});

const pendingRequests = computed(() => {
  return totalRequests.value - approvedRequests.value - rejectedRequests.value;
});

const projectSuccessRate = computed(() => {
  const total = totalProjects.value;
  return total > 0 ? Math.round((totalCompletedProjects.value / total) * 100) : 0;
});

// Chart configuration
const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    },
    fontFamily: 'Inter, sans-serif',
    background: 'transparent'
  },
  colors: ['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 6,
      columnWidth: '55%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function(val) {
      return val;
    },
    offsetY: -20,
    style: {
      fontSize: '11px',
      fontWeight: '600',
      colors: ['#1f2937']
    }
  },
  legend: {
    show: false
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    padding: {
      top: 0,
      right: 15,
      bottom: 0,
      left: 15
    }
  },
  xaxis: {
    categories: [
      'Registered',
      'Assigned',
      'Submitted',
      'Schedules',
      'Analyses',
      'Requests',
      'Projects'
    ],
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: '#6b7280'
      },
      rotate: -45,
      rotateAlways: false
    },
    axisBorder: {
      show: true,
      color: '#e5e7eb'
    },
    axisTicks: {
      show: true,
      color: '#e5e7eb'
    }
  },
  yaxis: {
    min: 0,
    tickAmount: 5,
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '11px'
    },
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 320
        },
        plotOptions: {
          bar: {
            columnWidth: '65%'
          }
        }
      }
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          height: 280
        },
        plotOptions: {
          bar: {
            columnWidth: '75%'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        }
      }
    }
  ]
});

const chartSeries = computed(() => [
  {
    name: 'Count',
    data: [
      totalTenders.value,
      totalAssignedTenders.value,
      totalTenderSubmissions.value,
      totalSchedules.value,
      totalAnalyses.value,
      totalRequests.value,
      totalProjects.value
    ]
  }
]);

// Navigation
const navigate = (section) => {
  console.log('Navigate to:', section);
};

// API Functions
const fetchTotalTenders = async () => {
  try {
    const response = await axios.get('api/count/registered-tenders');
    totalTenders.value = response.data.registered_tenders || 0;
  } catch (error) {
    console.error('Error fetching total tenders:', error);
  }
};

const fetchTotalAssignedTenders = async () => {
  try {
    const response = await axios.get('api/count/all-assigned/tenders');
    totalAssignedTenders.value = response.data.assignedCount || 0;
  } catch (error) {
    console.error('Error fetching assigned tenders:', error);
  }
};

const fetchTotalTenderSubmissions = async () => {
  try {
    const response = await axios.get('api/count/tenders-submissions');
    totalTenderSubmissions.value = response.data.submitted_tenders || 0;
  } catch (error) {
    console.error('Error fetching tender submissions:', error);
  }
};

const fetchTotalProjects = async () => {
  try {
    const response = await axios.get('api/count/total-projects');
    totalProjects.value = response.data.count_total_projects || 0;
  } catch (error) {
    console.error('Error fetching total projects:', error);
  }
};

const fetchTotalFailedProjects = async () => {
  try {
    const response = await axios.get('api/count/failed-projects');
    totalFailedProjects.value = response.data.total_failed_projects || 0;
  } catch (error) {
    console.error('Error fetching failed projects:', error);
  }
};

const fetchTotalCompletedProjects = async () => {
  try {
    const response = await axios.get('api/count/completed-projects');
    totalCompletedProjects.value = response.data.total_completed_projects || 0;
  } catch (error) {
    console.error('Error fetching completed projects:', error);
  }
};

const fetchTotalOnProgressTenders = async () => {
  try {
    const response = await axios.get('api/count/on-progress/tender');
    if (response.data.status) {
      totalOnProgressTenders.value = response.data.onProgressCount || 0;
    }
  } catch (error) {
    console.error('Error fetching on-progress tenders:', error);
  }
};

const fetchTotalOnProgressProjects = async () => {
  try {
    const response = await axios.get('api/count/all/on-progress/projects');
    totalOnProgressProjects.value = response.data.total_on_progress_projects || 0;
  } catch (error) {
    console.error('Error fetching on-progress projects:', error);
  }
};

const fetchTotalDeadlineReachedTenders = async () => {
  try {
    const response = await axios.get('api/count/all/deadline-reached-tenders');
    totalDeadlineReachedTenders.value = response.data.expired_tenders || 0;
  } catch (error) {
    console.error('Error fetching tenders nearing deadline:', error);
  }
};

const fetchTotalExpiredTenders = async () => {
  try {
    const response = await axios.get('api/count/all-expired/tenders');
    totalExpiredTenders.value = response.data.expired_tenders || 0;
  } catch (error) {
    console.error('Error fetching expired tenders:', error);
  }
};

const fetchTotalAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses');
    totalAnalyses.value = response.data.total_count || 0;
  } catch (error) {
    console.error('Error fetching total analyses:', error);
  }
};

const fetchTotalSchedules = async () => {
  try {
    const response = await axios.get('api/count-all/schedule');
    totalSchedules.value = response.data.total_count || 0;
  } catch (error) {
    console.error('Error fetching total schedules:', error);
  }
};

const fetchTotalRequests = async () => {
  try {
    const response = await axios.get('api/count-all/requests');
    totalRequests.value = response.data.totalRequests || 0;
  } catch (error) {
    console.error('Error fetching total requests:', error);
  }
};

const fetchApprovedRequests = async () => {
  try {
    const response = await axios.get('api/count-approved/requests');
    approvedRequests.value = response.data.approvedRequests || 0;
  } catch (error) {
    console.error('Error fetching approved requests:', error);
  }
};

const fetchRejectedRequests = async () => {
  try {
    const response = await axios.get('api/count-rejected/requests');
    rejectedRequests.value = response.data.rejectedRequests || 0;
  } catch (error) {
    console.error('Error fetching rejected requests:', error);
  }
};

onMounted(() => {
  Promise.all([
    fetchTotalTenders(),
    fetchTotalAssignedTenders(),
    fetchTotalTenderSubmissions(),
    fetchTotalProjects(),
    fetchTotalFailedProjects(),
    fetchTotalCompletedProjects(),
    fetchTotalOnProgressTenders(),
    fetchTotalOnProgressProjects(),
    fetchTotalDeadlineReachedTenders(),
    fetchTotalExpiredTenders(),
    fetchTotalAnalyses(),
    fetchTotalSchedules(),
    fetchTotalRequests(),
    fetchApprovedRequests(),
    fetchRejectedRequests()
  ]);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.25rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.header-content {
  flex: 1;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
}

.dashboard-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.quick-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 8px;
}

.quick-stat-label {
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.quick-stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Stat Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.compact {
  min-height: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.icon-wrapper.tenders {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.icon-wrapper.requests {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.icon-wrapper.projects {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.icon-wrapper.schedules {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.icon-wrapper.analyses {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.header-text {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.125rem;
  letter-spacing: -0.01em;
}

.card-badge {
  display: inline-block;
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  background: #f1f5f9;
  border-radius: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.action-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: translateX(2px);
}

.card-body {
  min-height: 120px;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
}

.metrics-grid.three-col {
  grid-template-columns: repeat(2, 1fr);
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #cbd5e1;
  transition: all 0.2s ease;
}

.metric-item:hover {
  background: #f1f5f9;
  transform: translateX(2px);
}

.metric-item.primary {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-left-color: #3b82f6;
}

.metric-item.success {
  border-left-color: #10b981;
}

.metric-item.warning {
  border-left-color: #f59e0b;
}

.metric-item.danger {
  border-left-color: #ef4444;
}

.metric-item.info {
  border-left-color: #8b5cf6;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #64748b;
  background: white;
  flex-shrink: 0;
}

.metric-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Compact Stat */
.compact-stat {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.compact-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  width: 100%;
  text-align: center;
}

.compact-stat-item i {
  font-size: 1.5rem;
  color: #6366f1;
}

.compact-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.compact-label {
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.section-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.filter-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.filter-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-color: #4f46e5;
}

.chart-wrapper {
  width: 100%;
  padding: 0.5rem 0;
}

/* Responsive Design */
@media (max-width: 1280px) {
  .header-stats .quick-stat:last-child {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .header-stats {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .section-actions {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .dashboard-title {
    font-size: 1.25rem;
  }

  .dashboard-subtitle {
    font-size: 0.75rem;
  }

  .stat-card {
    padding: 0.875rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid.three-col {
    grid-template-columns: 1fr;
  }

  .chart-section {
    padding: 1rem;
  }
}
</style>