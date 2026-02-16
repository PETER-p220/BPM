<template>
  <div class="dashboard-container">
    <!-- Top Navigation Bar -->
    <div class="top-nav">
      <div class="nav-left">
        <h1 class="brand-title">
          <i class="fas fa-chart-pie"></i>
          Admin Dashboard
        </h1>
      </div>
      <div class="nav-right">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search analytics..." />
        </div>
        <button class="refresh-btn" @click="refreshAllData" :disabled="isRefreshing">
          <i class="fas fa-sync-alt" :class="{ 'spinning': isRefreshing }"></i>
        </button>
        <div class="date-badge">
          <i class="fas fa-calendar-alt"></i>
          {{ currentDate }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Quick Stats Overview -->
      <div class="quick-stats">
        <div class="quick-stat-card primary">
          <div class="stat-icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTenders }}</span>
            <span class="stat-label">Total Tenders</span>
          </div>
          <div class="stat-trend positive">
            <i class="fas fa-arrow-up"></i> 12%
          </div>
        </div>

        <div class="quick-stat-card success">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalCompletedProjects }}</span>
            <span class="stat-label">Completed Projects</span>
          </div>
          <div class="stat-trend positive">
            <i class="fas fa-arrow-up"></i> 8%
          </div>
        </div>

        <div class="quick-stat-card warning">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalOnProgressTenders }}</span>
            <span class="stat-label">In Progress</span>
          </div>
          <div class="stat-trend neutral">
            <i class="fas fa-minus"></i> 0%
          </div>
        </div>

        <div class="quick-stat-card danger">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalExpiredTenders }}</span>
            <span class="stat-label">Expired Tenders</span>
          </div>
          <div class="stat-trend negative">
            <i class="fas fa-arrow-down"></i> 5%
          </div>
        </div>
      </div>

      <!-- Main Grid Layout -->
      <div class="main-grid">
        <!-- Left Column -->
        <div class="left-column">
          <!-- Tenders Management Card -->
          <div class="data-card">
            <div class="card-header-pro">
              <div class="header-left">
                <div class="header-icon tenders-gradient">
                  <i class="fas fa-file-contract"></i>
                </div>
                <div class="header-text">
                  <h3>Tenders Management</h3>
                  <p>Track and monitor all tender activities</p>
                </div>
              </div>
              <div class="header-actions">
                <button class="action-btn">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="card-body-pro">
              <div class="metric-grid">
                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Registered</span>
                    <span class="metric-badge primary">{{ totalTenders }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill primary" :style="{ width: calculatePercentage(totalTenders, totalTenders) + '%' }"></div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Assigned</span>
                    <span class="metric-badge info">{{ totalAssignedTenders }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill info" :style="{ width: calculatePercentage(totalAssignedTenders, totalTenders) + '%' }"></div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Submitted</span>
                    <span class="metric-badge success">{{ totalTenderSubmissions }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill success" :style="{ width: calculatePercentage(totalTenderSubmissions, totalTenders) + '%' }"></div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">In Progress</span>
                    <span class="metric-badge warning">{{ totalOnProgressTenders }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill warning" :style="{ width: calculatePercentage(totalOnProgressTenders, totalTenders) + '%' }"></div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Deadline Reached</span>
                    <span class="metric-badge orange">{{ totalDeadlineReachedTenders }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill orange" :style="{ width: calculatePercentage(totalDeadlineReachedTenders, totalTenders) + '%' }"></div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-label">Expired</span>
                    <span class="metric-badge danger">{{ totalExpiredTenders }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill danger" :style="{ width: calculatePercentage(totalExpiredTenders, totalTenders) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Overview Card -->
          <div class="data-card">
            <div class="card-header-pro">
              <div class="header-left">
                <div class="header-icon projects-gradient">
                  <i class="fas fa-project-diagram"></i>
                </div>
                <div class="header-text">
                  <h3>Projects Overview</h3>
                  <p>Monitor project status and completion</p>
                </div>
              </div>
            </div>
            <div class="card-body-pro">
              <div class="projects-summary">
                <div class="summary-stat">
                  <div class="summary-icon total">
                    <i class="fas fa-tasks"></i>
                  </div>
                  <div class="summary-details">
                    <span class="summary-value">{{ totalProjects }}</span>
                    <span class="summary-label">Total Projects</span>
                  </div>
                </div>

                <div class="summary-stat">
                  <div class="summary-icon progress">
                    <i class="fas fa-spinner"></i>
                  </div>
                  <div class="summary-details">
                    <span class="summary-value">{{ totalOnProgressProjects }}</span>
                    <span class="summary-label">In Progress</span>
                  </div>
                </div>

                <div class="summary-stat">
                  <div class="summary-icon completed">
                    <i class="fas fa-check-double"></i>
                  </div>
                  <div class="summary-details">
                    <span class="summary-value">{{ totalCompletedProjects }}</span>
                    <span class="summary-label">Completed</span>
                  </div>
                </div>

                <div class="summary-stat">
                  <div class="summary-icon failed">
                    <i class="fas fa-times-circle"></i>
                  </div>
                  <div class="summary-details">
                    <span class="summary-value">{{ totalFailedProjects }}</span>
                    <span class="summary-label">Failed</span>
                  </div>
                </div>
              </div>

              <div class="completion-rate">
                <div class="rate-header">
                  <span>Project Completion Rate</span>
                  <span class="rate-value">{{ projectCompletionRate }}%</span>
                </div>
                <div class="rate-progress">
                  <div class="rate-fill" :style="{ width: projectCompletionRate + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Organization Stats -->
          <div class="data-card compact">
            <div class="card-header-pro">
              <div class="header-left">
                <div class="header-icon users-gradient">
                  <i class="fas fa-users-cog"></i>
                </div>
                <div class="header-text">
                  <h3>Organization</h3>
                  <p>Users and departments</p>
                </div>
              </div>
            </div>
            <div class="card-body-pro">
              <div class="org-stats">
                <div class="org-stat-item">
                  <i class="fas fa-user-shield"></i>
                  <div class="org-stat-info">
                    <span class="org-value">{{ totalRoles }}</span>
                    <span class="org-label">User Roles</span>
                  </div>
                </div>
                <div class="org-stat-item">
                  <i class="fas fa-users"></i>
                  <div class="org-stat-info">
                    <span class="org-value">{{ totalUsers }}</span>
                    <span class="org-label">Total Users</span>
                  </div>
                </div>
                <div class="org-stat-item">
                  <i class="fas fa-building"></i>
                  <div class="org-stat-info">
                    <span class="org-value">{{ totalDepartments }}</span>
                    <span class="org-label">Departments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analyses Card -->
          <div class="data-card compact">
            <div class="card-header-pro">
              <div class="header-left">
                <div class="header-icon analyses-gradient">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="header-text">
                  <h3>Analyses</h3>
                  <p>Budget and approvals</p>
                </div>
              </div>
            </div>
            <div class="card-body-pro">
              <div class="analyses-stats">
                <div class="budget-display">
                  <span class="budget-label">Total Budget Required</span>
                  <span class="budget-amount">{{ formatCurrency(totalAmountRequired) }}</span>
                </div>
                <div class="analyses-grid">
                  <div class="analysis-item">
                    <span class="analysis-label">Submitted</span>
                    <span class="analysis-value">{{ totalAnalyses }}</span>
                  </div>
                  <div class="analysis-item success">
                    <span class="analysis-label">Approved</span>
                    <span class="analysis-value">{{ totalPassedAnalyses }}</span>
                  </div>
                  <div class="analysis-item danger">
                    <span class="analysis-label">Rejected</span>
                    <span class="analysis-value">{{ totalRejectedAnalyses }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quotations Card -->
          <div class="data-card compact">
            <div class="card-header-pro">
              <div class="header-left">
                <div class="header-icon quotations-gradient">
                  <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <div class="header-text">
                  <h3>Quotations</h3>
                  <p>Submission status</p>
                </div>
              </div>
            </div>
            <div class="card-body-pro">
              <div class="quotations-grid">
                <div class="quotation-stat">
                  <div class="quotation-icon">
                    <i class="fas fa-paper-plane"></i>
                  </div>
                  <span class="quotation-value">{{ totalSchedules }}</span>
                  <span class="quotation-label">Submitted</span>
                </div>
                <div class="quotation-stat success">
                  <div class="quotation-icon">
                    <i class="fas fa-check"></i>
                  </div>
                  <span class="quotation-value">{{ totalPassedSchedules }}</span>
                  <span class="quotation-label">Approved</span>
                </div>
                <div class="quotation-stat danger">
                  <div class="quotation-icon">
                    <i class="fas fa-times"></i>
                  </div>
                  <span class="quotation-value">{{ totalRejectedSchedules }}</span>
                  <span class="quotation-label">Rejected</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Requests Card -->
          <div class="data-card compact">
            <div class="card-header-pro">
              <div class="header-left">
                <div class="header-icon requests-gradient">
                  <i class="fas fa-inbox"></i>
                </div>
                <div class="header-text">
                  <h3>Requests</h3>
                  <p>Approval workflow</p>
                </div>
              </div>
            </div>
            <div class="card-body-pro">
              <div class="requests-stats">
                <div class="request-item total">
                  <span class="request-count">{{ totalRequests }}</span>
                  <span class="request-label">Total Submitted</span>
                </div>
                <div class="request-divider"></div>
                <div class="request-item approved">
                  <span class="request-count">{{ approvedRequests }}</span>
                  <span class="request-label">Approved</span>
                </div>
                <div class="request-divider"></div>
                <div class="request-item rejected">
                  <span class="request-count">{{ rejectedRequests }}</span>
                  <span class="request-label">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="chart-section">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrapper">
              <h3>Performance Analytics</h3>
              <p>Comprehensive overview of key metrics</p>
            </div>
            <div class="chart-controls">
              <button class="chart-control-btn active">
                <i class="fas fa-chart-bar"></i> Bar
              </button>
              <button class="chart-control-btn">
                <i class="fas fa-chart-line"></i> Line
              </button>
              <button class="chart-control-btn">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
          <div class="chart-body">
            <apexchart 
              type="bar" 
              :options="chartOptions" 
              :series="chartSeries" 
              height="400"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import VueApexCharts from 'vue3-apexcharts';

// Utility Functions
const formatCurrency = (value) => {
  if (!value) return 'TZS 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Reactive State
const isRefreshing = ref(false);
const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  weekday: 'short', 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}));

// Data State
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
const totalUsers = ref(0);
const totalRoles = ref(0);
const totalDepartments = ref(0);
const totalAnalyses = ref(0);
const totalPassedAnalyses = ref(0);
const totalRejectedAnalyses = ref(0);
const totalAmountRequired = ref(0);
const totalSchedules = ref(0);
const totalPassedSchedules = ref(0);
const totalRejectedSchedules = ref(0);
const totalRequests = ref(0);
const approvedRequests = ref(0);
const rejectedRequests = ref(0);

// Computed Properties
const projectCompletionRate = computed(() => {
  if (totalProjects.value === 0) return 0;
  return Math.round((totalCompletedProjects.value / totalProjects.value) * 100);
});

// Chart Configuration
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
  colors: ['#8B4513', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#14b8a6'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 10,
      columnWidth: '65%',
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
    offsetY: -25,
    style: {
      fontSize: '14px',
      fontWeight: '700',
      colors: ['#1f2937']
    }
  },
  legend: {
    show: false
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 3,
    padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    }
  },
  xaxis: {
    categories: [
      'Registered',
      'Assigned',
      'Submitted',
      'Projects',
      'Analyses',
      'Requests',
      'Completed'
    ],
    labels: {
      style: {
        fontSize: '13px',
        fontWeight: '600',
        colors: '#6b7280'
      }
    },
    axisBorder: {
      show: true,
      color: '#e5e7eb'
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '13px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  }
});

const chartSeries = computed(() => [
  {
    name: 'Count',
    data: [
      totalTenders.value,
      totalAssignedTenders.value,
      totalTenderSubmissions.value,
      totalProjects.value,
      totalAnalyses.value || 0,
      totalRequests.value || 0,
      totalCompletedProjects.value
    ]
  }
]);

// API Functions
const fetchTotalTenders = async () => {
  try {
    const response = await axios.get('api/count/registered-tenders');
    totalTenders.value = response.data.registered_tenders;
  } catch (error) {
    console.error('Error fetching total tenders:', error);
  }
};

const fetchTotalAssignedTenders = async () => {
  try {
    const response = await axios.get('api/count/all-assigned/tenders');
    totalAssignedTenders.value = response.data.assignedCount;
  } catch (error) {
    console.error('Error fetching assigned tenders:', error);
  }
};

const fetchTotalTenderSubmissions = async () => {
  try {
    const response = await axios.get('api/count/tenders-submissions');
    totalTenderSubmissions.value = response.data.submitted_tenders;
  } catch (error) {
    console.error('Error fetching tender submissions:', error);
  }
};

const fetchTotalProjects = async () => {
  try {
    const response = await axios.get('api/count/total-projects');
    totalProjects.value = response.data.count_total_projects;
  } catch (error) {
    console.error('Error fetching total projects:', error);
  }
};

const fetchTotalFailedProjects = async () => {
  try {
    const response = await axios.get('api/count/failed-projects');
    totalFailedProjects.value = response.data.total_failed_projects;
  } catch (error) {
    console.error('Error fetching failed projects:', error);
  }
};

const fetchTotalCompletedProjects = async () => {
  try {
    const response = await axios.get('api/count/completed-projects');
    totalCompletedProjects.value = response.data.total_completed_projects;
  } catch (error) {
    console.error('Error fetching completed projects:', error);
  }
};

const fetchTotalOnProgressTenders = async () => {
  try {
    const response = await axios.get('api/count/on-progress/tender');
    if (response.data.status) {
      totalOnProgressTenders.value = response.data.onProgressCount;
    }
  } catch (error) {
    console.error('Error fetching on-progress tenders:', error);
  }
};

const fetchTotalOnProgressProjects = async () => {
  try {
    const response = await axios.get('api/count/all/on-progress/projects');
    totalOnProgressProjects.value = response.data.total_on_progress_projects;
  } catch (error) {
    console.error('Error fetching on-progress projects:', error);
  }
};

const fetchTotalDeadlineReachedTenders = async () => {
  try {
    const response = await axios.get('api/count/all/deadline-reached-tenders');
    totalDeadlineReachedTenders.value = response.data.expired_tenders;
  } catch (error) {
    console.error('Error fetching tenders nearing deadline:', error);
  }
};

const fetchTotalExpiredTenders = async () => {
  try {
    const response = await axios.get('api/count/all-expired/tenders');
    totalExpiredTenders.value = response.data.expired_tenders;
  } catch (error) {
    console.error('Error fetching expired tenders:', error);
  }
};

const fetchTotalUsers = async () => {
  try {
    const response = await axios.get('api/count/users');
    totalUsers.value = response.data.total_users;
  } catch (error) {
    console.error('Error fetching total users:', error);
  }
};

const fetchTotalRoles = async () => {
  try {
    const response = await axios.get('api/count/roles');
    totalRoles.value = response.data.user_roles;
  } catch (error) {
    console.error('Error fetching total roles:', error);
  }
};

const fetchTotalDepartments = async () => {
  try {
    const response = await axios.get('api/count/departments');
    totalDepartments.value = response.data.total_departments;
  } catch (error) {
    console.error('Error fetching total departments:', error);
  }
};

// Analyses API functions
const fetchTotalAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses');
    totalAnalyses.value = response.data.total_count;
  } catch (error) {
    console.error('Error fetching total analyses:', error);
  }
};

const fetchTotalPassedAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses/passed');
    totalPassedAnalyses.value = response.data.passed_count;
  } catch (error) {
    console.error('Error fetching passed analyses:', error);
  }
};

const fetchTotalRejectedAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses/rejected');
    totalRejectedAnalyses.value = response.data.rejected_count;
  } catch (error) {
    console.error('Error fetching rejected analyses:', error);
  }
};

const fetchTotalAmountRequired = async () => {
  try {
    const response = await axios.get('api/count/all/total-amount-required');
    totalAmountRequired.value = response.data.total_amount_required;
  } catch (error) {
    console.error('Error fetching total amount required:', error);
  }
};

// Quotations API functions
const fetchTotalSchedules = async () => {
  try {
    const response = await axios.get('api/count-all/schedule');
    totalSchedules.value = response.data.total_count;
  } catch (error) {
    console.error('Error fetching total schedules:', error);
  }
};

const fetchTotalPassedSchedules = async () => {
  try {
    const response = await axios.get('api/count-passed/schedule');
    totalPassedSchedules.value = response.data.passed_count;
  } catch (error) {
    console.error('Error fetching passed schedules:', error);
  }
};

const fetchTotalRejectedSchedules = async () => {
  try {
    const response = await axios.get('api/count-rejected/schedule');
    totalRejectedSchedules.value = response.data.rejected_count;
  } catch (error) {
    console.error('Error fetching rejected schedules:', error);
  }
};

// Requests API functions
const fetchTotalRequests = async () => {
  try {
    const response = await axios.get('api/count-all/requests');
    totalRequests.value = response.data.totalRequests;
  } catch (error) {
    console.error('Error fetching total requests:', error);
  }
};

const fetchApprovedRequests = async () => {
  try {
    const response = await axios.get('api/count-approved/requests');
    approvedRequests.value = response.data.approvedRequests;
  } catch (error) {
    console.error('Error fetching approved requests:', error);
  }
};

const fetchRejectedRequests = async () => {
  try {
    const response = await axios.get('api/count-rejected/requests');
    rejectedRequests.value = response.data.rejectedRequests;
  } catch (error) {
    console.error('Error fetching rejected requests:', error);
  }
};

const refreshAllData = async () => {
  isRefreshing.value = true;
  await Promise.all([
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
    fetchTotalUsers(),
    fetchTotalRoles(),
    fetchTotalDepartments(),
    fetchTotalAnalyses(),
    fetchTotalPassedAnalyses(),
    fetchTotalRejectedAnalyses(),
    fetchTotalAmountRequired(),
    fetchTotalSchedules(),
    fetchTotalPassedSchedules(),
    fetchTotalRejectedSchedules(),
    fetchTotalRequests(),
    fetchApprovedRequests(),
    fetchRejectedRequests()
  ]);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 500);
};

onMounted(() => {
  refreshAllData();
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
  background: #ffffff;
  position: relative;
  overflow-x: hidden;
}

/* Top Navigation */
.top-nav {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-title i {
  color: #667eea;
  font-size: 1.25rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-box i {
  color: #9ca3af;
  font-size: 0.8rem;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.8125rem;
  color: #1f2937;
  width: 180px;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.refresh-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.date-badge {
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-badge i {
  color: #667eea;
}

/* Main Content */
.dashboard-content {
  padding: 1.25rem;
  position: relative;
  z-index: 1;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
  animation: fadeInUp 0.5s ease-out;
}

.quick-stat-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.quick-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.quick-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.quick-stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #8B4513 0%, #a0522d 100%);
}

.quick-stat-card.success .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.quick-stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.quick-stat-card.danger .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.stat-trend.positive {
  background: #d1fae5;
  color: #065f46;
}

.stat-trend.negative {
  background: #fee2e2;
  color: #991b1b;
}

.stat-trend.neutral {
  background: #f3f4f6;
  color: #4b5563;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

/* Data Cards */
.data-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.data-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-card:not(:last-child) {
  margin-bottom: 1rem;
}

.card-header-pro {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tenders-gradient {
  background: linear-gradient(135deg, #8B4513 0%, #a0522d 100%);
}

.projects-gradient {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.users-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.analyses-gradient {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.quotations-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.requests-gradient {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.header-text h3 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.125rem;
}

.header-text p {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-btn {
  background: #f3f4f6;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.card-body-pro {
  padding: 1.25rem;
}

/* Metric Grid */
.metric-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #4b5563;
}

.metric-badge {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  color: white;
}

.metric-badge.primary {
  background: linear-gradient(135deg, #8B4513 0%, #a0522d 100%);
}

.metric-badge.info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.metric-badge.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.metric-badge.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.metric-badge.orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.metric-badge.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease;
}

.progress-fill.primary {
  background: linear-gradient(90deg, #8B4513 0%, #a0522d 100%);
}

.progress-fill.info {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.progress-fill.success {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.progress-fill.warning {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.progress-fill.orange {
  background: linear-gradient(90deg, #fb923c 0%, #f97316 100%);
}

.progress-fill.danger {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

/* Projects Summary */
.projects-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}

.summary-stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.summary-stat:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: white;
}

.summary-icon.total {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.summary-icon.progress {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.summary-icon.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.summary-icon.failed {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.summary-value {
  font-size: 1.375rem;
  font-weight: 800;
  color: #1f2937;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.completion-rate {
  padding: 1rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 10px;
}

.rate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.8125rem;
}

.rate-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: #2563eb;
}

.rate-progress {
  height: 10px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  transition: width 0.8s ease;
}

/* Organization Stats */
.org-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.org-stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.org-stat-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.org-stat-item i {
  font-size: 1.125rem;
  color: #3b82f6;
  width: 32px;
  text-align: center;
}

.org-stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
}

.org-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: #1f2937;
}

.org-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* Analyses Stats */
.analyses-stats {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.budget-display {
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: center;
}

.budget-label {
  font-size: 0.75rem;
  color: #92400e;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.budget-amount {
  font-size: 1.25rem;
  font-weight: 800;
  color: #78350f;
}

.analyses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
}

.analysis-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  text-align: center;
  transition: all 0.2s ease;
}

.analysis-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.analysis-item.success {
  border-top: 3px solid #10b981;
}

.analysis-item.danger {
  border-top: 3px solid #ef4444;
}

.analysis-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.analysis-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: #1f2937;
}

/* Quotations Grid */
.quotations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.quotation-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s ease;
  text-align: center;
}

.quotation-stat:hover {
  background: #f3f4f6;
  transform: translateY(-3px);
}

.quotation-stat.success {
  border-top: 3px solid #10b981;
}

.quotation-stat.danger {
  border-top: 3px solid #ef4444;
}

.quotation-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #6b7280;
}

.quotation-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: #1f2937;
}

.quotation-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* Requests Stats */
.requests-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.75rem;
}

.request-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem;
  flex: 1;
}

.request-count {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
}

.request-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-align: center;
}

.request-item.total .request-count {
  color: #6366f1;
}

.request-item.approved .request-count {
  color: #10b981;
}

.request-item.rejected .request-count {
  color: #ef4444;
}

.request-divider {
  width: 1px;
  height: 50px;
  background: #e5e7eb;
}

/* Chart Section */
.chart-section {
  animation: fadeInUp 0.5s ease-out 0.4s both;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.chart-header {
  padding: 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.chart-title-wrapper h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.125rem;
}

.chart-title-wrapper p {
  font-size: 0.75rem;
  color: #6b7280;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.chart-control-btn {
  padding: 0.5rem 0.875rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.chart-control-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.chart-control-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.chart-body {
  padding: 1.25rem;
}

/* Responsive Design */
@media (max-width: 1280px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .projects-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-content {
    padding: 1rem;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .nav-right {
    width: 100%;
    justify-content: space-between;
  }

  .search-box {
    flex: 1;
  }

  .search-box input {
    width: 100%;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .projects-summary {
    grid-template-columns: 1fr;
  }

  .analyses-grid,
  .quotations-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .chart-controls {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .dashboard-content {
    padding: 0.75rem;
  }

  .brand-title {
    font-size: 1rem;
  }

  .card-header-pro {
    padding: 0.875rem 1rem;
  }

  .card-body-pro {
    padding: 1rem;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }

  .header-text h3 {
    font-size: 0.875rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading Animation */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}
</style>