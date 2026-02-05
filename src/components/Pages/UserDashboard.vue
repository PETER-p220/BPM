<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">My Dashboard</h1>
      <p class="dashboard-subtitle">Your personalized work overview</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="stats-grid">
      <!-- Tenders Card -->
      <div class="stat-card tenders-card">
        <div class="card-header">
          <div class="icon-wrapper tenders-icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <h2 class="card-title">My Tenders</h2>
        </div>
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="isLoading.tenders" class="loading-state">
            <div class="spinner"></div>
            <span>Loading...</span>
          </div>
          
          <!-- Error State with Retry -->
          <div v-else-if="errorMessage.tenders" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ errorMessage.tenders }}</span>
            <button @click="retryFetch('tenders')" class="retry-button">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
          
          <!-- Data State -->
          <div v-else class="stats-content">
            <div class="stat-row primary-stat">
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
      </div>

      <!-- Quotations Card -->
      <div class="stat-card quotations-card">
        <div class="card-header">
          <div class="icon-wrapper quotations-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <h2 class="card-title">My Quotations</h2>
        </div>
        <div class="card-body">
          <div v-if="isLoading.priceSchedules" class="loading-state">
            <div class="spinner"></div>
            <span>Loading...</span>
          </div>
          <div v-else-if="errorMessage.priceSchedules" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ errorMessage.priceSchedules }}</span>
            <button @click="retryFetch('priceSchedules')" class="retry-button">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
          <div v-else class="stats-content">
            <div class="stat-row primary-stat">
              <span class="stat-label">Submitted</span>
              <span class="stat-value">{{ totalPriceSchedules }}</span>
            </div>
            <div class="stat-row success">
              <span class="stat-label">Approved</span>
              <span class="stat-value">{{ totalPassedPriceSchedules }}</span>
            </div>
            <div class="stat-row danger">
              <span class="stat-label">Rejected</span>
              <span class="stat-value">{{ totalRejectedPriceSchedules }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analyses Card -->
      <div class="stat-card analyses-card">
        <div class="card-header">
          <div class="icon-wrapper analyses-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h2 class="card-title">My Analyses</h2>
        </div>
        <div class="card-body">
          <div v-if="isLoading.analyses" class="loading-state">
            <div class="spinner"></div>
            <span>Loading...</span>
          </div>
          <div v-else-if="errorMessage.analyses" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ errorMessage.analyses }}</span>
            <button @click="retryFetch('analyses')" class="retry-button">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
          <div v-else class="stats-content">
            <div class="stat-row primary-stat">
              <span class="stat-label">Submitted</span>
              <span class="stat-value">{{ totalProjectAnalyses }}</span>
            </div>
            <div class="stat-row success">
              <span class="stat-label">Approved</span>
              <span class="stat-value">{{ totalPassedAnalyses }}</span>
            </div>
            <div class="stat-row danger">
              <span class="stat-label">Rejected</span>
              <span class="stat-value">{{ totalRejectedAnalyses }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Card -->
      <div class="stat-card projects-card">
        <div class="card-header">
          <div class="icon-wrapper projects-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <h2 class="card-title">My Projects</h2>
        </div>
        <div class="card-body">
          <div v-if="isLoading.projects" class="loading-state">
            <div class="spinner"></div>
            <span>Loading...</span>
          </div>
          <div v-else-if="errorMessage.projects" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ errorMessage.projects }}</span>
            <button @click="retryFetch('projects')" class="retry-button">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
          <div v-else class="stats-content">
            <div class="stat-row primary-stat">
              <span class="stat-label">Assigned</span>
              <span class="stat-value">{{ totalUserProjects }}</span>
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
    </div>

    <!-- Analytics Section - Only show if we have data -->
    <div v-if="hasAnyData" class="analytics-section">
      <div class="section-header">
        <h2 class="section-title">Analytics Overview</h2>
        <p class="section-subtitle">Visual insights into your work performance</p>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Work Distribution Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Work Distribution</h3>
          </div>
          <div class="chart-wrapper">
            <apexchart 
              type="donut" 
              :options="workDistributionOptions" 
              :series="workDistributionSeries" 
              height="320"
            />
          </div>
        </div>

        <!-- Status Overview Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Status Overview</h3>
          </div>
          <div class="chart-wrapper">
            <apexchart 
              type="bar" 
              :options="statusOverviewOptions" 
              :series="statusOverviewSeries" 
              height="320"
            />
          </div>
        </div>

        <!-- Performance Trend Chart -->
        <div class="chart-card chart-card-wide">
          <div class="chart-header">
            <h3 class="chart-title">Approval Rate Analysis</h3>
          </div>
          <div class="chart-wrapper">
            <apexchart 
              type="bar" 
              :options="approvalRateOptions" 
              :series="approvalRateSeries" 
              height="320"
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

// Tenders data
const totalAssignedTenders = ref(0);
const totalTenderSubmissions = ref(0);
const totalOnProgressTenders = ref(0);
const totalDeadlineReachedTenders = ref(0);
const totalExpiredTenders = ref(0);

// Analyses data
const totalProjectAnalyses = ref(0);
const totalPassedAnalyses = ref(0);
const totalRejectedAnalyses = ref(0);

// Price Schedules data
const totalPriceSchedules = ref(0);
const totalPassedPriceSchedules = ref(0);
const totalRejectedPriceSchedules = ref(0);

// Projects data
const totalUserProjects = ref(0);
const totalCompletedProjects = ref(0);
const totalOnProgressProjects = ref(0);
const totalFailedProjects = ref(0);

// Loading states
const isLoading = ref({
  tenders: true,
  priceSchedules: true,
  analyses: true,
  projects: true,
});

const errorMessage = ref({
  tenders: '',
  priceSchedules: '',
  analyses: '',
  projects: '',
});

// Check if we have any data to show charts
const hasAnyData = computed(() => {
  return totalAssignedTenders.value > 0 ||
         totalPriceSchedules.value > 0 ||
         totalProjectAnalyses.value > 0 ||
         totalUserProjects.value > 0;
});

// Work Distribution Chart
const workDistributionSeries = computed(() => [
  totalAssignedTenders.value,
  totalPriceSchedules.value,
  totalProjectAnalyses.value,
  totalUserProjects.value
]);

const workDistributionOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif',
  },
  labels: ['Tenders', 'Quotations', 'Analyses', 'Projects'],
  colors: ['#8B4513', '#CD5C5C', '#0e6251', '#186a3b'],
  legend: {
    position: 'bottom',
    fontSize: '13px',
  },
  dataLabels: {
    enabled: true,
    formatter: function(val) {
      return Math.round(val) + '%';
    },
    style: {
      fontSize: '13px',
      fontWeight: '600',
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Work',
            fontSize: '16px',
            fontWeight: '700',
            color: '#1f2937',
            formatter: function(w) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              return total;
            }
          },
          value: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
          }
        }
      }
    }
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  },
  responsive: [{
    breakpoint: 640,
    options: {
      chart: {
        height: 280
      },
      legend: {
        fontSize: '11px'
      }
    }
  }]
});

// Status Overview Chart
const statusOverviewSeries = computed(() => [{
  name: 'Completed',
  data: [
    totalTenderSubmissions.value,
    totalPassedPriceSchedules.value,
    totalPassedAnalyses.value,
    totalCompletedProjects.value
  ]
}, {
  name: 'In Progress',
  data: [
    totalOnProgressTenders.value,
    0,
    0,
    totalOnProgressProjects.value
  ]
}, {
  name: 'Issues',
  data: [
    totalDeadlineReachedTenders.value + totalExpiredTenders.value,
    totalRejectedPriceSchedules.value,
    totalRejectedAnalyses.value,
    totalFailedProjects.value
  ]
}]);

const statusOverviewOptions = ref({
  chart: {
    type: 'bar',
    fontFamily: 'Inter, sans-serif',
    toolbar: {
      show: false
    },
    stacked: true,
  },
  colors: ['#10b981', '#3b82f6', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 6,
      columnWidth: '60%',
    }
  },
  xaxis: {
    categories: ['Tenders', 'Quotations', 'Analyses', 'Projects'],
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  legend: {
    position: 'top',
    fontSize: '13px',
    horizontalAlign: 'right',
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  },
  responsive: [{
    breakpoint: 640,
    options: {
      chart: {
        height: 280
      },
      legend: {
        fontSize: '11px'
      }
    }
  }]
});

// Approval Rate Chart
const approvalRateSeries = computed(() => {
  const quotationTotal = totalPriceSchedules.value || 1;
  const analysisTotal = totalProjectAnalyses.value || 1;
  
  return [{
    name: 'Approved',
    data: [
      Math.round((totalPassedPriceSchedules.value / quotationTotal) * 100),
      Math.round((totalPassedAnalyses.value / analysisTotal) * 100)
    ]
  }, {
    name: 'Rejected',
    data: [
      Math.round((totalRejectedPriceSchedules.value / quotationTotal) * 100),
      Math.round((totalRejectedAnalyses.value / analysisTotal) * 100)
    ]
  }];
});

const approvalRateOptions = ref({
  chart: {
    type: 'bar',
    fontFamily: 'Inter, sans-serif',
    toolbar: {
      show: false
    },
  },
  colors: ['#10b981', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: '60%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function(val) {
      return val + '%';
    },
    offsetX: 30,
    style: {
      fontSize: '13px',
      fontWeight: '600',
      colors: ['#1f2937']
    }
  },
  xaxis: {
    categories: ['Quotations', 'Analyses'],
    labels: {
      formatter: function(val) {
        return val + '%';
      },
      style: {
        fontSize: '12px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    },
    max: 100
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
  legend: {
    position: 'top',
    fontSize: '13px',
    horizontalAlign: 'right',
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return val + '%';
      }
    }
  },
  responsive: [{
    breakpoint: 640,
    options: {
      chart: {
        height: 280
      },
      legend: {
        fontSize: '11px'
      }
    }
  }]
});

// Simplified fetch without timeout/retry (let axios handle it naturally)
const fetchTenderCounts = async () => {
  isLoading.value.tenders = true;
  errorMessage.value.tenders = '';
  
  try {
    const assignedResponse = await axios.get('/api/count/assigned-tenders');
    totalAssignedTenders.value = assignedResponse.data.assignedCount || 0;

    const submittedResponse = await axios.get('/api/count/submitted/tender');
    totalTenderSubmissions.value = submittedResponse.data.submittedCount || 0;

    const onProgressResponse = await axios.get('/api/count/on-progress/tender');
    totalOnProgressTenders.value = onProgressResponse.data.onProgressCount || 0;

    const deadlineResponse = await axios.get('/api/count/deadline-reached/tenders');
    totalDeadlineReachedTenders.value = deadlineResponse.data.expired_tenders || 0;

    const expiredResponse = await axios.get('/api/count/expire-tenders');
    totalExpiredTenders.value = expiredResponse.data.expired_tenders || 0;
  } catch (error) {
    console.error('Error fetching tender counts:', error);
    errorMessage.value.tenders = 'Unable to load data';
  } finally {
    isLoading.value.tenders = false;
  }
};

const fetchPriceScheduleCounts = async () => {
  isLoading.value.priceSchedules = true;
  errorMessage.value.priceSchedules = '';
  
  try {
    const totalResponse = await axios.get('/api/user/price-schedules/count');
    totalPriceSchedules.value = totalResponse.data.total_count || 0;

    const passedResponse = await axios.get('/api/user/price-schedules/passed/count');
    totalPassedPriceSchedules.value = passedResponse.data.passed_count || 0;

    const rejectedResponse = await axios.get('/api/user/price-schedules/rejected/count');
    totalRejectedPriceSchedules.value = rejectedResponse.data.rejected_count || 0;
  } catch (error) {
    console.error('Error fetching price schedule counts:', error);
    errorMessage.value.priceSchedules = 'Unable to load data';
  } finally {
    isLoading.value.priceSchedules = false;
  }
};

const fetchAnalysisCounts = async () => {
  isLoading.value.analyses = true;
  errorMessage.value.analyses = '';
  
  try {
    const allResponse = await axios.get('/api/logged/user-analyses/count');
    totalProjectAnalyses.value = allResponse.data.total_count || 0;

    const approvedResponse = await axios.get('/api/user-analyses/approved/count');
    totalPassedAnalyses.value = approvedResponse.data.approved_count || 0;

    const rejectedResponse = await axios.get('/api/user-analyses/rejected/count');
    totalRejectedAnalyses.value = rejectedResponse.data.rejected_count || 0;
  } catch (error) {
    console.error('Error fetching analysis counts:', error);
    errorMessage.value.analyses = 'Unable to load data';
  } finally {
    isLoading.value.analyses = false;
  }
};

const fetchProjectCounts = async () => {
  isLoading.value.projects = true;
  errorMessage.value.projects = '';
  
  try {
    const allResponse = await axios.get('/api/count/user/all-projects');
    totalUserProjects.value = allResponse.data.total_projects || 0;

    const completedResponse = await axios.get('/api/count/user/completed-project');
    totalCompletedProjects.value = completedResponse.data.total_completed_projects || 0;

    const onProgressResponse = await axios.get('/api/count/user/on-progress-projects');
    totalOnProgressProjects.value = onProgressResponse.data.total_on_progress_projects || 0;

    const failedResponse = await axios.get('/api/count/users/failed-projects');
    totalFailedProjects.value = failedResponse.data.total_failed_projects || 0;
  } catch (error) {
    console.error('Error fetching project counts:', error);
    errorMessage.value.projects = 'Unable to load data';
  } finally {
    isLoading.value.projects = false;
  }
};

// Retry function
const retryFetch = (section) => {
  switch(section) {
    case 'tenders':
      fetchTenderCounts();
      break;
    case 'priceSchedules':
      fetchPriceScheduleCounts();
      break;
    case 'analyses':
      fetchAnalysisCounts();
      break;
    case 'projects':
      fetchProjectCounts();
      break;
  }
};

// Initialize data fetching in parallel for faster load
onMounted(() => {
  Promise.all([
    fetchTenderCounts(),
    fetchPriceScheduleCounts(),
    fetchAnalysisCounts(),
    fetchProjectCounts()
  ]).catch(err => {
    console.error('Dashboard initial load failed:', err);
  });
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
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.5s ease-out;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

/* Card Styles */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 260px;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid #f3f4f6;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.tenders-icon {
  background: linear-gradient(135deg, #8B4513 0%, #a0522d 100%);
}

.quotations-icon {
  background: linear-gradient(135deg, #CD5C5C 0%, #dc143c 100%);
}

.analyses-icon {
  background: linear-gradient(135deg, #0e6251 0%, #1abc9c 100%);
}

.projects-icon {
  background: linear-gradient(135deg, #186a3b 0%, #1e8449 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.01em;
}

.card-body {
  min-height: 160px;
  display: flex;
  flex-direction: column;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.8125rem;
  text-align: center;
  flex: 1;
}

.error-state i {
  font-size: 1.5rem;
  color: #dc2626;
}

.retry-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-button:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.retry-button:active {
  transform: translateY(0);
}

/* Stats Content */
.stats-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 42px;
}

.stat-row:hover {
  background: #f3f4f6;
  transform: translateX(3px);
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

.stat-label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  min-width: 36px;
  text-align: right;
}

/* Analytics Section */
.analytics-section {
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04);
}

.chart-card-wide {
  grid-column: 1 / -1;
}

.chart-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.01em;
}

.chart-wrapper {
  position: relative;
  min-height: 320px;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1280px) {
  .charts-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    gap: 1rem;
  }

  .section-title {
    font-size: 1.625rem;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card-wide {
    grid-column: 1;
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

  .stat-card {
    padding: 1.25rem;
    min-height: 240px;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .chart-card {
    padding: 1.25rem;
  }

  .chart-wrapper {
    min-height: 280px;
  }
}
</style>