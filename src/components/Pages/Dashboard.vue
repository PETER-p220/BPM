<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard Overview</h1>
      <p class="dashboard-subtitle">Comprehensive real-time insights and analytics</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="stats-grid">
      <!-- Users & Departments Card -->
      <div class="stat-card users-card">
        <div class="card-header">
          <div class="icon-wrapper users-icon">
            <i class="fas fa-users-cog"></i>
          </div>
          <h2 class="card-title">Users & Departments</h2>
        </div>
        <div class="card-body">
          <div class="stat-row primary-stat">
            <span class="stat-label">User Roles</span>
            <span class="stat-value">{{ totalRoles }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Total Users</span>
            <span class="stat-value">{{ totalUsers }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Departments</span>
            <span class="stat-value">{{ totalDepartments }}</span>
          </div>
        </div>
      </div>

      <!-- Tenders Card -->
      <div class="stat-card tenders-card">
        <div class="card-header">
          <div class="icon-wrapper tenders-icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <h2 class="card-title">Tenders</h2>
        </div>
        <div class="card-body">
          <div class="stat-row primary-stat">
            <span class="stat-label">Registered</span>
            <span class="stat-value">{{ totalTenders }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Assigned</span>
            <span class="stat-value">{{ totalAssignedTenders }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Submitted</span>
            <span class="stat-value">{{ totalTenderSubmissions }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">In Progress</span>
            <span class="stat-value">{{ totalOnProgressTenders }}</span>
          </div>
          <div class="stat-row warning">
            <span class="stat-label">Deadline Reached</span>
            <span class="stat-value">{{ totalDeadlineReachedTenders }}</span>
          </div>
          <div class="stat-row danger">
            <span class="stat-label">Expired</span>
            <span class="stat-value">{{ totalExpiredTenders }}</span>
          </div>
        </div>
      </div>

      <!-- Analyses Card -->
      <div class="stat-card analyses-card">
        <div class="card-header">
          <div class="icon-wrapper analyses-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h2 class="card-title">Analyses</h2>
        </div>
        <div class="card-body">
          <div class="stat-row primary-stat">
            <span class="stat-label">Submitted</span>
            <span class="stat-value">{{ totalAnalyses }}</span>
          </div>
          <div class="stat-row success">
            <span class="stat-label">Approved</span>
            <span class="stat-value">{{ totalPassedAnalyses }}</span>
          </div>
          <div class="stat-row danger">
            <span class="stat-label">Rejected</span>
            <span class="stat-value">{{ totalRejectedAnalyses }}</span>
          </div>
          <div class="stat-row budget-row">
            <span class="stat-label">Total Budget</span>
            <span class="stat-value budget-value">{{ formatCurrency(totalAmountRequired) }}</span>
          </div>
        </div>
      </div>

      <!-- Quotations Card -->
      <div class="stat-card quotations-card">
        <div class="card-header">
          <div class="icon-wrapper quotations-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <h2 class="card-title">Quotations</h2>
        </div>
        <div class="card-body">
          <div class="stat-row primary-stat">
            <span class="stat-label">Submitted</span>
            <span class="stat-value">{{ totalSchedules }}</span>
          </div>
          <div class="stat-row success">
            <span class="stat-label">Approved</span>
            <span class="stat-value">{{ totalPassedSchedules }}</span>
          </div>
          <div class="stat-row danger">
            <span class="stat-label">Rejected</span>
            <span class="stat-value">{{ totalRejectedSchedules }}</span>
          </div>
        </div>
      </div>

      <!-- Requests Card -->
      <div class="stat-card requests-card">
        <div class="card-header">
          <div class="icon-wrapper requests-icon">
            <i class="fas fa-inbox"></i>
          </div>
          <h2 class="card-title">Requests</h2>
        </div>
        <div class="card-body">
          <div class="stat-row primary-stat">
            <span class="stat-label">Total Submitted</span>
            <span class="stat-value">{{ totalRequests }}</span>
          </div>
          <div class="stat-row success">
            <span class="stat-label">Approved</span>
            <span class="stat-value">{{ approvedRequests }}</span>
          </div>
          <div class="stat-row danger">
            <span class="stat-label">Rejected</span>
            <span class="stat-value">{{ rejectedRequests }}</span>
          </div>
        </div>
      </div>

      <!-- Projects Card -->
      <div class="stat-card projects-card">
        <div class="card-header">
          <div class="icon-wrapper projects-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <h2 class="card-title">Projects</h2>
        </div>
        <div class="card-body">
          <div class="stat-row primary-stat">
            <span class="stat-label">Total Projects</span>
            <span class="stat-value">{{ totalProjects }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">In Progress</span>
            <span class="stat-value">{{ totalOnProgressProjects }}</span>
          </div>
          <div class="stat-row success">
            <span class="stat-label">Completed</span>
            <span class="stat-value">{{ totalCompletedProjects }}</span>
          </div>
          <div class="stat-row danger">
            <span class="stat-label">Failed</span>
            <span class="stat-value">{{ totalFailedProjects }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section">
      <div class="chart-header">
        <h2 class="chart-title">Summary Overview</h2>
        <p class="chart-subtitle">Comprehensive statistics across all categories</p>
      </div>
      <div class="chart-wrapper">
        <apexchart 
          type="bar" 
          :options="chartOptions" 
          :series="chartSeries" 
          height="450"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import VueApexCharts from 'vue3-apexcharts';

// Utility function to format currency
const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

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
    fontFamily: 'Inter, system-ui, sans-serif',
    background: 'transparent'
  },
  colors: ['#8B4513', '#2563eb', '#10b981', '#ef4444', '#059669', '#eab308', '#16a34a'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 8,
      columnWidth: '60%',
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
      fontSize: '13px',
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
      right: 20,
      bottom: 0,
      left: 20
    }
  },
  xaxis: {
    categories: [
      'Registered Tenders',
      'Assigned Tenders',
      'Submitted Tenders',
      'Quotations',
      'Analyses',
      'Requests',
      'Projects'
    ],
    labels: {
      style: {
        fontSize: '12px',
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
        fontSize: '12px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '13px'
    },
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  },
  responsive: [
    {
      breakpoint: 1280,
      options: {
        chart: {
          height: 400
        },
        plotOptions: {
          bar: {
            columnWidth: '65%'
          }
        }
      }
    },
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 350
        },
        plotOptions: {
          bar: {
            columnWidth: '70%'
          }
        }
      }
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          height: 300
        },
        plotOptions: {
          bar: {
            columnWidth: '80%'
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

onMounted(() => {
  fetchTotalTenders();
  fetchTotalAssignedTenders();
  fetchTotalTenderSubmissions();
  fetchTotalProjects();
  fetchTotalFailedProjects();
  fetchTotalCompletedProjects();
  fetchTotalOnProgressTenders();
  fetchTotalOnProgressProjects();
  fetchTotalDeadlineReachedTenders();
  fetchTotalExpiredTenders();
  fetchTotalUsers();
  fetchTotalRoles();
  fetchTotalDepartments();
  fetchTotalAnalyses();
  fetchTotalPassedAnalyses();
  fetchTotalRejectedAnalyses();
  fetchTotalAmountRequired();
  fetchTotalSchedules();
  fetchTotalPassedSchedules();
  fetchTotalRejectedSchedules();
  fetchTotalRequests();
  fetchApprovedRequests();
  fetchRejectedRequests();
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header Styles */
.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.dashboard-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 400;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Card Styles */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  flex-shrink: 0;
}

.users-icon {
  background: linear-gradient(135deg, #1f618d 0%, #2980b9 100%);
}

.tenders-icon {
  background: linear-gradient(135deg, #8B4513 0%, #a0522d 100%);
}

.analyses-icon {
  background: linear-gradient(135deg, #0e6251 0%, #1abc9c 100%);
}

.quotations-icon {
  background: linear-gradient(135deg, #CD5C5C 0%, #dc143c 100%);
}

.requests-icon {
  background: linear-gradient(135deg, #9a7d0a 0%, #d4ac0d 100%);
}

.projects-icon {
  background: linear-gradient(135deg, #186a3b 0%, #1e8449 100%);
}

.card-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 48px;
}

.stat-row:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.stat-row.primary-stat {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-left: 3px solid #2563eb;
  font-weight: 600;
}

.stat-row.success {
  border-left: 3px solid #10b981;
}

.stat-row.warning {
  border-left: 3px solid #f59e0b;
}

.stat-row.danger {
  border-left: 3px solid #ef4444;
}

.stat-row.budget-row {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 3px solid #f59e0b;
  font-weight: 600;
}

.stat-label {
  font-size: 0.9375rem;
  color: #4b5563;
  font-weight: 500;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  min-width: 40px;
  text-align: right;
}

.budget-value {
  font-size: 1.125rem;
  color: #92400e;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.chart-subtitle {
  font-size: 1rem;
  color: #6b7280;
}

.chart-wrapper {
  width: 100%;
  padding: 1rem 0;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1536px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 1280px) {
  .dashboard-container {
    padding: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1.5rem;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.75rem;
  }

  .dashboard-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    gap: 1rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
  }

  .stat-value {
    font-size: 1.125rem;
  }

  .chart-section {
    padding: 1.5rem;
  }

  .chart-title {
    font-size: 1.5rem;
  }
}
</style>