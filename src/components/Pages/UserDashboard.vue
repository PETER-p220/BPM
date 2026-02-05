<template>
  <div class="dashboard-container">
    <!-- Compact Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Dashboard Overview</h1>
        <p class="dashboard-subtitle">Real-time work metrics and analytics</p>
      </div>
      <div class="header-stats">
        <div class="quick-stat">
          <span class="quick-stat-label">Total Items</span>
          <span class="quick-stat-value">{{ totalItems }}</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-label">Completion Rate</span>
          <span class="quick-stat-value">{{ completionRate }}%</span>
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
              <span class="card-badge">{{ totalAssignedTenders }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('tenders')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="isLoading.tenders" class="loading-state">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          
          <!-- Error State -->
          <div v-else-if="errorMessage.tenders" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <span>{{ errorMessage.tenders }}</span>
            <button @click="retryFetch('tenders')" class="retry-btn">
              <i class="fas fa-redo"></i>
            </button>
          </div>
          
          <!-- Data State -->
          <div v-else class="metrics-grid">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-clipboard-check"></i>
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
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalExpiredTenders }}</span>
                <span class="metric-label">Expired</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quotations Card -->
      <div class="stat-card">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper quotations">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Quotations</h3>
              <span class="card-badge">{{ totalPriceSchedules }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('quotations')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div v-if="isLoading.priceSchedules" class="loading-state">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          <div v-else-if="errorMessage.priceSchedules" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <span>{{ errorMessage.priceSchedules }}</span>
            <button @click="retryFetch('priceSchedules')" class="retry-btn">
              <i class="fas fa-redo"></i>
            </button>
          </div>
          <div v-else class="metrics-grid">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalPriceSchedules }}</span>
                <span class="metric-label">Submitted</span>
              </div>
            </div>
            <div class="metric-item success">
              <div class="metric-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalPassedPriceSchedules }}</span>
                <span class="metric-label">Approved</span>
              </div>
            </div>
            <div class="metric-item danger">
              <div class="metric-icon">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalRejectedPriceSchedules }}</span>
                <span class="metric-label">Rejected</span>
              </div>
            </div>
            <div class="metric-item info">
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ quotationApprovalRate }}%</span>
                <span class="metric-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analyses Card -->
      <div class="stat-card">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-wrapper analyses">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="header-text">
              <h3 class="card-title">Analyses</h3>
              <span class="card-badge">{{ totalProjectAnalyses }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('analyses')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div v-if="isLoading.analyses" class="loading-state">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          <div v-else-if="errorMessage.analyses" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <span>{{ errorMessage.analyses }}</span>
            <button @click="retryFetch('analyses')" class="retry-btn">
              <i class="fas fa-redo"></i>
            </button>
          </div>
          <div v-else class="metrics-grid">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalProjectAnalyses }}</span>
                <span class="metric-label">Submitted</span>
              </div>
            </div>
            <div class="metric-item success">
              <div class="metric-icon">
                <i class="fas fa-thumbs-up"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalPassedAnalyses }}</span>
                <span class="metric-label">Approved</span>
              </div>
            </div>
            <div class="metric-item danger">
              <div class="metric-icon">
                <i class="fas fa-thumbs-down"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalRejectedAnalyses }}</span>
                <span class="metric-label">Rejected</span>
              </div>
            </div>
            <div class="metric-item info">
              <div class="metric-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ analysisApprovalRate }}%</span>
                <span class="metric-label">Success Rate</span>
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
              <span class="card-badge">{{ totalUserProjects }} Total</span>
            </div>
          </div>
          <button class="action-btn" @click="navigate('projects')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div v-if="isLoading.projects" class="loading-state">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          <div v-else-if="errorMessage.projects" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <span>{{ errorMessage.projects }}</span>
            <button @click="retryFetch('projects')" class="retry-btn">
              <i class="fas fa-redo"></i>
            </button>
          </div>
          <div v-else class="metrics-grid">
            <div class="metric-item primary">
              <div class="metric-icon">
                <i class="fas fa-tasks"></i>
              </div>
              <div class="metric-content">
                <span class="metric-value">{{ totalUserProjects }}</span>
                <span class="metric-label">Assigned</span>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div v-if="hasAnyData" class="analytics-section">
      <div class="section-header">
        <h2 class="section-title">Performance Analytics</h2>
        <div class="section-actions">
          <button class="filter-btn active">
            <i class="fas fa-chart-line"></i>
            Overview
          </button>
          <button class="filter-btn">
            <i class="fas fa-calendar-week"></i>
            This Week
          </button>
          <button class="filter-btn">
            <i class="fas fa-calendar-alt"></i>
            This Month
          </button>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Work Distribution Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrapper">
              <h3 class="chart-title">Work Distribution</h3>
              <span class="chart-subtitle">By category</span>
            </div>
            <button class="chart-action">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>
          <div class="chart-wrapper">
            <apexchart 
              type="donut" 
              :options="workDistributionOptions" 
              :series="workDistributionSeries" 
              height="280"
            />
          </div>
        </div>

        <!-- Status Overview Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrapper">
              <h3 class="chart-title">Status Overview</h3>
              <span class="chart-subtitle">Current state</span>
            </div>
            <button class="chart-action">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>
          <div class="chart-wrapper">
            <apexchart 
              type="bar" 
              :options="statusOverviewOptions" 
              :series="statusOverviewSeries" 
              height="280"
            />
          </div>
        </div>

        <!-- Approval Rate Chart -->
        <div class="chart-card chart-card-wide">
          <div class="chart-header">
            <div class="chart-title-wrapper">
              <h3 class="chart-title">Approval Rate Analysis</h3>
              <span class="chart-subtitle">Success metrics</span>
            </div>
            <button class="chart-action">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>
          <div class="chart-wrapper">
            <apexchart 
              type="bar" 
              :options="approvalRateOptions" 
              :series="approvalRateSeries" 
              height="280"
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

// Computed values
const totalItems = computed(() => {
  return totalAssignedTenders.value + totalPriceSchedules.value + 
         totalProjectAnalyses.value + totalUserProjects.value;
});

const completionRate = computed(() => {
  const completed = totalTenderSubmissions.value + totalPassedPriceSchedules.value + 
                   totalPassedAnalyses.value + totalCompletedProjects.value;
  const total = totalItems.value;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

const quotationApprovalRate = computed(() => {
  const total = totalPriceSchedules.value;
  return total > 0 ? Math.round((totalPassedPriceSchedules.value / total) * 100) : 0;
});

const analysisApprovalRate = computed(() => {
  const total = totalProjectAnalyses.value;
  return total > 0 ? Math.round((totalPassedAnalyses.value / total) * 100) : 0;
});

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
    toolbar: { show: false }
  },
  labels: ['Tenders', 'Quotations', 'Analyses', 'Projects'],
  colors: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'],
  legend: {
    position: 'bottom',
    fontSize: '11px',
    fontWeight: 500,
    offsetY: 0,
  },
  dataLabels: {
    enabled: true,
    formatter: function(val) {
      return Math.round(val) + '%';
    },
    style: {
      fontSize: '11px',
      fontWeight: '600',
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '13px',
            fontWeight: '600',
            color: '#1f2937',
          },
          value: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
          }
        }
      }
    }
  },
  tooltip: {
    style: {
      fontSize: '11px',
    },
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  },
  stroke: {
    width: 2,
    colors: ['#fff']
  }
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
    toolbar: { show: false },
    stacked: true,
  },
  colors: ['#10b981', '#3b82f6', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4,
      columnWidth: '55%',
    }
  },
  xaxis: {
    categories: ['Tenders', 'Quotations', 'Analyses', 'Projects'],
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  legend: {
    position: 'top',
    fontSize: '11px',
    fontWeight: 500,
    horizontalAlign: 'right',
    offsetY: -5,
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    padding: {
      top: -5,
      right: 5,
      bottom: 0,
      left: 5
    }
  },
  tooltip: {
    style: {
      fontSize: '11px',
    },
    y: {
      formatter: function(val) {
        return val + ' items';
      }
    }
  }
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
    toolbar: { show: false },
  },
  colors: ['#10b981', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '50%',
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
    offsetX: 25,
    style: {
      fontSize: '11px',
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
        fontSize: '11px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    },
    max: 100
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: '#6b7280'
      }
    }
  },
  legend: {
    position: 'top',
    fontSize: '11px',
    fontWeight: 500,
    horizontalAlign: 'right',
    offsetY: -5,
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    padding: {
      top: -5,
      right: 5,
      bottom: 0,
      left: 5
    }
  },
  tooltip: {
    style: {
      fontSize: '11px',
    },
    y: {
      formatter: function(val) {
        return val + '%';
      }
    }
  }
});

// API calls
const fetchTenderCounts = async () => {
  isLoading.value.tenders = true;
  errorMessage.value.tenders = '';
  
  try {
    const [assigned, submitted, onProgress, deadline, expired] = await Promise.all([
      axios.get('/api/count/assigned-tenders'),
      axios.get('/api/count/submitted/tender'),
      axios.get('/api/count/on-progress/tender'),
      axios.get('/api/count/deadline-reached/tenders'),
      axios.get('/api/count/expire-tenders')
    ]);
    
    totalAssignedTenders.value = assigned.data.assignedCount || 0;
    totalTenderSubmissions.value = submitted.data.submittedCount || 0;
    totalOnProgressTenders.value = onProgress.data.onProgressCount || 0;
    totalDeadlineReachedTenders.value = deadline.data.expired_tenders || 0;
    totalExpiredTenders.value = expired.data.expired_tenders || 0;
  } catch (error) {
    console.error('Error fetching tender counts:', error);
    errorMessage.value.tenders = 'Failed to load';
  } finally {
    isLoading.value.tenders = false;
  }
};

const fetchPriceScheduleCounts = async () => {
  isLoading.value.priceSchedules = true;
  errorMessage.value.priceSchedules = '';
  
  try {
    const [total, passed, rejected] = await Promise.all([
      axios.get('/api/user/price-schedules/count'),
      axios.get('/api/user/price-schedules/passed/count'),
      axios.get('/api/user/price-schedules/rejected/count')
    ]);
    
    totalPriceSchedules.value = total.data.total_count || 0;
    totalPassedPriceSchedules.value = passed.data.passed_count || 0;
    totalRejectedPriceSchedules.value = rejected.data.rejected_count || 0;
  } catch (error) {
    console.error('Error fetching price schedule counts:', error);
    errorMessage.value.priceSchedules = 'Failed to load';
  } finally {
    isLoading.value.priceSchedules = false;
  }
};

const fetchAnalysisCounts = async () => {
  isLoading.value.analyses = true;
  errorMessage.value.analyses = '';
  
  try {
    const [all, approved, rejected] = await Promise.all([
      axios.get('/api/logged/user-analyses/count'),
      axios.get('/api/user-analyses/approved/count'),
      axios.get('/api/user-analyses/rejected/count')
    ]);
    
    totalProjectAnalyses.value = all.data.total_count || 0;
    totalPassedAnalyses.value = approved.data.approved_count || 0;
    totalRejectedAnalyses.value = rejected.data.rejected_count || 0;
  } catch (error) {
    console.error('Error fetching analysis counts:', error);
    errorMessage.value.analyses = 'Failed to load';
  } finally {
    isLoading.value.analyses = false;
  }
};

const fetchProjectCounts = async () => {
  isLoading.value.projects = true;
  errorMessage.value.projects = '';
  
  try {
    const [all, completed, onProgress, failed] = await Promise.all([
      axios.get('/api/count/user/all-projects'),
      axios.get('/api/count/user/completed-project'),
      axios.get('/api/count/user/on-progress-projects'),
      axios.get('/api/count/users/failed-projects')
    ]);
    
    totalUserProjects.value = all.data.total_projects || 0;
    totalCompletedProjects.value = completed.data.total_completed_projects || 0;
    totalOnProgressProjects.value = onProgress.data.total_on_progress_projects || 0;
    totalFailedProjects.value = failed.data.total_failed_projects || 0;
  } catch (error) {
    console.error('Error fetching project counts:', error);
    errorMessage.value.projects = 'Failed to load';
  } finally {
    isLoading.value.projects = false;
  }
};

const retryFetch = (section) => {
  const fetchMap = {
    tenders: fetchTenderCounts,
    priceSchedules: fetchPriceScheduleCounts,
    analyses: fetchAnalysisCounts,
    projects: fetchProjectCounts
  };
  fetchMap[section]?.();
};

const navigate = (section) => {
  console.log('Navigate to:', section);
  // Implement navigation logic
};

onMounted(() => {
  Promise.all([
    fetchTenderCounts(),
    fetchPriceScheduleCounts(),
    fetchAnalysisCounts(),
    fetchProjectCounts()
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
  gap: 1.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

.icon-wrapper.quotations {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.icon-wrapper.analyses {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.icon-wrapper.projects {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  min-height: 140px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 2rem 1rem;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.75rem;
  text-align: center;
}

.error-state i {
  font-size: 1.25rem;
  color: #dc2626;
}

.retry-btn {
  margin-top: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
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

/* Analytics Section */
.analytics-section {
  margin-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
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

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  border: 1px solid #f1f5f9;
}

.chart-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-card-wide {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.875rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.chart-title-wrapper {
  flex: 1;
}

.chart-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.125rem;
  letter-spacing: -0.01em;
}

.chart-subtitle {
  font-size: 0.6875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chart-action {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.chart-action:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.chart-wrapper {
  position: relative;
  min-height: 280px;
}

/* Responsive Design */
@media (max-width: 1280px) {
  .header-stats {
    display: none;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
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
    overflow-x: auto;
  }

  .filter-btn {
    white-space: nowrap;
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

  .chart-card {
    padding: 0.875rem;
  }

  .chart-wrapper {
    min-height: 260px;
  }
}
</style>