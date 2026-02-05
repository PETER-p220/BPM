<template>
  <div class="dashboard">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="breadcrumb">
        <i class="fas fa-home"></i>
        <span>Dashboard</span>
      </div>
      <div class="top-actions">
        <div class="live-indicator">
          <span class="pulse-dot"></span>
          <span>Live Updates</span>
        </div>
        <button class="refresh-btn" @click="refreshData">
          <i class="fas fa-sync-alt" :class="{ 'spinning': isRefreshing }"></i>
        </button>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="welcome-card">
      <div class="welcome-content">
        <h1 class="welcome-title">Welcome Back</h1>
        <p class="welcome-subtitle">Here's what's happening with your projects today</p>
      </div>
      <div class="welcome-stats">
        <div class="quick-stat">
          <i class="fas fa-chart-line"></i>
          <span>{{ successRate }}% Success Rate</span>
        </div>
        <div class="quick-stat">
          <i class="fas fa-tasks"></i>
          <span>{{ totalProjects }} Total Projects</span>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="main-grid">
      <!-- Left Column - Stats Cards -->
      <div class="stats-column">
        <!-- Receipts Card -->
        <div class="modern-card receipts-theme">
          <div class="card-accent"></div>
          <div class="card-header">
            <div class="header-left">
              <div class="card-icon receipts-icon">
                <i class="fas fa-receipt"></i>
              </div>
              <div>
                <h3 class="card-title">Receipt Submissions</h3>
                <p class="card-subtitle">Document tracking</p>
              </div>
            </div>
            <div class="card-badge receipts-badge">Active</div>
          </div>

          <div class="card-content">
            <div v-if="isLoading.receipts" class="modern-loading">
              <div class="loading-spinner"></div>
            </div>

            <div v-else-if="errorMessage.receipts" class="modern-error">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.receipts }}</span>
              <button @click="fetchTotalReceipts" class="error-retry">
                <i class="fas fa-redo"></i>
              </button>
            </div>

            <div v-else class="stat-display">
              <div class="primary-stat">
                <div class="stat-number">{{ totalSubmitted }}</div>
                <div class="stat-label">Total Submissions</div>
              </div>
              <div class="stat-footer">
                <div class="progress-bar">
                  <div class="progress-fill receipts-progress" :style="{ width: '75%' }"></div>
                </div>
                <span class="progress-text">75% of monthly target</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Requests Card -->
        <div class="modern-card requests-theme">
          <div class="card-accent"></div>
          <div class="card-header">
            <div class="header-left">
              <div class="card-icon requests-icon">
                <i class="fas fa-project-diagram"></i>
              </div>
              <div>
                <h3 class="card-title">Project Requests</h3>
                <p class="card-subtitle">Request management</p>
              </div>
            </div>
            <div class="card-badge requests-badge">{{ totalProjects }} Total</div>
          </div>

          <div class="card-content">
            <div v-if="isLoading.requests" class="modern-loading">
              <div class="loading-spinner"></div>
            </div>

            <div v-else-if="errorMessage.requests" class="modern-error">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.requests }}</span>
              <button @click="fetchAllRequests" class="error-retry">
                <i class="fas fa-redo"></i>
              </button>
            </div>

            <div v-else class="requests-breakdown">
              <div class="breakdown-item approved">
                <div class="breakdown-header">
                  <i class="fas fa-check-circle"></i>
                  <span>Approved</span>
                </div>
                <div class="breakdown-value">{{ totalApproved }}</div>
                <div class="breakdown-bar">
                  <div class="bar-fill" :style="{ width: successRate + '%' }"></div>
                </div>
              </div>

              <div class="breakdown-item rejected">
                <div class="breakdown-header">
                  <i class="fas fa-times-circle"></i>
                  <span>Rejected</span>
                </div>
                <div class="breakdown-value">{{ totalRejected }}</div>
                <div class="breakdown-bar">
                  <div class="bar-fill" :style="{ width: rejectionRate + '%' }"></div>
                </div>
              </div>

              <div class="breakdown-item pending">
                <div class="breakdown-header">
                  <i class="fas fa-clock"></i>
                  <span>Pending</span>
                </div>
                <div class="breakdown-value">{{ pendingCount }}</div>
                <div class="breakdown-bar">
                  <div class="bar-fill" :style="{ width: pendingRate + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card success-metric">
            <div class="metric-icon-wrapper">
              <i class="fas fa-thumbs-up"></i>
            </div>
            <div class="metric-details">
              <div class="metric-value">{{ successRate }}%</div>
              <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric-trend positive">
              <i class="fas fa-arrow-up"></i>
              <span>+12%</span>
            </div>
          </div>

          <div class="metric-card danger-metric">
            <div class="metric-icon-wrapper">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="metric-details">
              <div class="metric-value">{{ rejectionRate }}%</div>
              <div class="metric-label">Rejection Rate</div>
            </div>
            <div class="metric-trend negative">
              <i class="fas fa-arrow-down"></i>
              <span>-5%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Charts -->
      <div class="charts-column">
        <!-- Status Overview Chart -->
        <div class="chart-container status-chart">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Status Overview</h3>
              <p class="chart-subtitle">Current distribution</p>
            </div>
            <div class="chart-actions">
              <button class="chart-action-btn active">
                <i class="fas fa-chart-pie"></i>
              </button>
              <button class="chart-action-btn">
                <i class="fas fa-chart-bar"></i>
              </button>
            </div>
          </div>
          <div class="chart-body">
            <apexchart 
              v-if="hasData"
              type="donut" 
              :options="enhancedStatusOptions" 
              :series="statusChartSeries" 
              height="280"
            />
            <div v-else class="no-data">
              <i class="fas fa-chart-pie"></i>
              <span>No data available</span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot approved-dot"></span>
              <span class="legend-label">Approved</span>
              <span class="legend-value">{{ totalApproved }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot rejected-dot"></span>
              <span class="legend-label">Rejected</span>
              <span class="legend-value">{{ totalRejected }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot pending-dot"></span>
              <span class="legend-label">Pending</span>
              <span class="legend-value">{{ pendingCount }}</span>
            </div>
          </div>
        </div>

        <!-- Performance Gauge -->
        <div class="chart-container performance-gauge">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Performance Score</h3>
              <p class="chart-subtitle">Overall approval rate</p>
            </div>
            <div class="score-badge">
              <span class="score-label">Score</span>
              <span class="score-value">{{ performanceScore }}/100</span>
            </div>
          </div>
          <div class="chart-body">
            <apexchart 
              v-if="hasData"
              type="radialBar" 
              :options="enhancedGaugeOptions" 
              :series="approvalRateSeries" 
              height="280"
            />
            <div v-else class="no-data">
              <i class="fas fa-tachometer-alt"></i>
              <span>No data available</span>
            </div>
          </div>
        </div>

        <!-- Comparison Chart -->
        <div class="chart-container comparison-chart">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Comparative Analysis</h3>
              <p class="chart-subtitle">Month over month</p>
            </div>
            <select class="time-filter">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <div class="chart-body">
            <apexchart 
              v-if="hasData"
              type="bar" 
              :options="enhancedBarOptions" 
              :series="comparisonSeries" 
              height="280"
            />
            <div v-else class="no-data">
              <i class="fas fa-chart-bar"></i>
              <span>No data available</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Insights -->
    <div class="insights-section" v-if="hasData">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-lightbulb"></i>
          Key Insights
        </h2>
      </div>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon success-insight">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">Strong Performance</h4>
            <p class="insight-text">Your approval rate is {{ successRate }}%, which is {{ successRate > 70 ? 'above' : 'below' }} the target of 70%</p>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon info-insight">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">Activity Summary</h4>
            <p class="insight-text">{{ totalProjects }} total requests with {{ totalSubmitted }} receipts submitted</p>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon warning-insight">
            <i class="fas fa-tasks"></i>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">Pending Items</h4>
            <p class="insight-text">{{ pendingCount }} requests are awaiting review and action</p>
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

// Reactive data
const totalSubmitted = ref(0);
const totalProjects = ref(0);
const totalApproved = ref(0);
const totalRejected = ref(0);
const isRefreshing = ref(false);

const isLoading = ref({
  receipts: true,
  requests: true,
});

const errorMessage = ref({
  receipts: '',
  requests: '',
});

// Computed values
const hasData = computed(() => {
  return totalSubmitted.value > 0 || totalProjects.value > 0;
});

const successRate = computed(() => {
  if (totalProjects.value === 0) return 0;
  return Math.round((totalApproved.value / totalProjects.value) * 100);
});

const rejectionRate = computed(() => {
  if (totalProjects.value === 0) return 0;
  return Math.round((totalRejected.value / totalProjects.value) * 100);
});

const pendingCount = computed(() => {
  return Math.max(0, totalProjects.value - totalApproved.value - totalRejected.value);
});

const pendingRate = computed(() => {
  if (totalProjects.value === 0) return 0;
  return Math.round((pendingCount.value / totalProjects.value) * 100);
});

const performanceScore = computed(() => {
  return Math.min(100, Math.round(successRate.value * 1.2));
});

// Chart configurations
const statusChartSeries = computed(() => [
  totalApproved.value,
  totalRejected.value,
  pendingCount.value
]);

const enhancedStatusOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    }
  },
  labels: ['Approved', 'Rejected', 'Pending'],
  colors: ['#10b981', '#ef4444', '#f59e0b'],
  legend: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (val) => Math.round(val) + '%',
    style: {
      fontSize: '14px',
      fontWeight: '700',
      colors: ['#fff']
    },
    dropShadow: {
      enabled: true,
      blur: 3,
      opacity: 0.8
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            formatter: () => totalProjects.value
          },
          value: {
            fontSize: '32px',
            fontWeight: '800',
            color: '#1e293b',
          }
        }
      }
    }
  },
  stroke: {
    width: 2,
    colors: ['#fff']
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.15,
      }
    }
  }
});

const approvalRateSeries = computed(() => [successRate.value]);

const enhancedGaugeOptions = ref({
  chart: {
    type: 'radialBar',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        size: '65%',
        background: 'transparent',
      },
      track: {
        background: '#f1f5f9',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: -10,
          fontSize: '16px',
          fontWeight: '600',
          color: '#64748b',
        },
        value: {
          offsetY: 5,
          fontSize: '36px',
          fontWeight: '800',
          color: '#1e293b',
          formatter: (val) => val + '%'
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#06b6d4'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  colors: ['#10b981'],
  labels: ['Approval Rate'],
  stroke: {
    lineCap: 'round'
  }
});

const comparisonSeries = computed(() => [{
  name: 'Current Period',
  data: [totalApproved.value, totalRejected.value, pendingCount.value]
}, {
  name: 'Previous Period',
  data: [
    Math.round(totalApproved.value * 0.85),
    Math.round(totalRejected.value * 1.1),
    Math.round(pendingCount.value * 0.9)
  ]
}]);

const enhancedBarOptions = ref({
  chart: {
    type: 'bar',
    fontFamily: 'Inter, system-ui, sans-serif',
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%',
      dataLabels: {
        position: 'top',
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -25,
    style: {
      fontSize: '12px',
      fontWeight: '700',
      colors: ['#64748b']
    }
  },
  colors: ['#10b981', '#94a3b8'],
  xaxis: {
    categories: ['Approved', 'Rejected', 'Pending'],
    labels: {
      style: {
        fontSize: '13px',
        fontWeight: '600',
        colors: '#64748b'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
        colors: '#64748b'
      }
    }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontSize: '13px',
    fontWeight: '600',
    markers: {
      width: 12,
      height: 12,
      radius: 6,
    }
  },
  tooltip: {
    y: {
      formatter: (val) => val + ' requests'
    }
  }
});

// API calls
const fetchTotalReceipts = async () => {
  isLoading.value.receipts = true;
  errorMessage.value.receipts = '';
  
  try {
    const response = await axios.get('api/count/total-receipts');
    totalSubmitted.value = response.data?.data?.total_receipts || 
                          response.data?.total_receipts || 
                          response.data?.count || 0;
  } catch (error) {
    console.error('Error fetching receipts:', error);
    errorMessage.value.receipts = 'Failed to load data';
  } finally {
    isLoading.value.receipts = false;
  }
};

const fetchAllRequests = async () => {
  isLoading.value.requests = true;
  errorMessage.value.requests = '';
  
  try {
    const [approvedResponse, rejectedResponse] = await Promise.all([
      axios.get('/api/user-analyses/approved/count'),
      axios.get('/api/user-analyses/rejected/count')
    ]);

    totalApproved.value = approvedResponse.data?.approved_count || 
                          approvedResponse.data?.count || 0;
    totalRejected.value = rejectedResponse.data?.rejected_count || 
                          rejectedResponse.data?.count || 0;
    totalProjects.value = totalApproved.value + totalRejected.value;
  } catch (error) {
    console.error('Error fetching requests:', error);
    errorMessage.value.requests = 'Failed to load data';
  } finally {
    isLoading.value.requests = false;
  }
};

const refreshData = async () => {
  isRefreshing.value = true;
  await Promise.all([fetchTotalReceipts(), fetchAllRequests()]);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 500);
};

onMounted(() => {
  fetchTotalReceipts();
  fetchAllRequests();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.25rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.breadcrumb i {
  font-size: 0.875rem;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #10b981;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.9);
  }
}

.refresh-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #f9fafb;
  color: #3b82f6;
  border-color: #3b82f6;
}

.refresh-btn i.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 12px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1);
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.welcome-subtitle {
  font-size: 0.9375rem;
  opacity: 0.9;
}

.welcome-stats {
  display: flex;
  gap: 1.5rem;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
}

.quick-stat i {
  font-size: 1rem;
  opacity: 0.9;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Stats Column */
.stats-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Modern Card */
.modern-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.receipts-theme .card-accent {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.requests-theme .card-accent {
  background: linear-gradient(90deg, #10b981, #059669);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  gap: 0.875rem;
  align-items: center;
}

.card-icon {
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

.receipts-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.requests-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.125rem;
}

.card-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.card-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.receipts-badge {
  background: #fee2e2;
  color: #991b1b;
}

.requests-badge {
  background: #d1fae5;
  color: #065f46;
}

.card-content {
  min-height: 120px;
}

/* Loading & Error States */
.modern-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f1f5f9;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.modern-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.modern-error i {
  font-size: 1.5rem;
}

.error-retry {
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.error-retry:hover {
  background: #b91c1c;
}

/* Stat Display */
.stat-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.primary-stat {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.stat-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #dc2626);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.receipts-progress {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
}

/* Requests Breakdown */
.requests-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.breakdown-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.breakdown-item.approved {
  border-left-color: #10b981;
}

.breakdown-item.rejected {
  border-left-color: #ef4444;
}

.breakdown-item.pending {
  border-left-color: #f59e0b;
}

.breakdown-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.breakdown-item.approved .breakdown-header {
  color: #059669;
}

.breakdown-item.rejected .breakdown-header {
  color: #dc2626;
}

.breakdown-item.pending .breakdown-header {
  color: #d97706;
}

.breakdown-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
}

.breakdown-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.breakdown-bar .bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.breakdown-item.approved .bar-fill {
  background: linear-gradient(90deg, #10b981, #059669);
}

.breakdown-item.rejected .bar-fill {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.breakdown-item.pending .bar-fill {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.success-metric::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.danger-metric::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.metric-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: white;
}

.success-metric .metric-icon-wrapper {
  background: linear-gradient(135deg, #10b981, #059669);
}

.danger-metric .metric-icon-wrapper {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  align-self: flex-start;
}

.metric-trend.positive {
  background: #d1fae5;
  color: #065f46;
}

.metric-trend.negative {
  background: #fee2e2;
  color: #991b1b;
}

/* Charts Column */
.charts-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chart-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.chart-container:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.chart-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.chart-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.chart-actions {
  display: flex;
  gap: 0.375rem;
}

.chart-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-action-btn:hover {
  background: white;
  border-color: #3b82f6;
  color: #3b82f6;
}

.chart-action-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.score-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 8px;
}

.score-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: #1e3a8a;
}

.time-filter {
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.time-filter:hover {
  background: white;
  border-color: #3b82f6;
}

.chart-body {
  position: relative;
  min-height: 280px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 0;
  color: #9ca3af;
}

.no-data i {
  font-size: 3rem;
  opacity: 0.5;
}

.no-data span {
  font-size: 0.9375rem;
  font-weight: 500;
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.approved-dot {
  background: #10b981;
}

.rejected-dot {
  background: #ef4444;
}

.pending-dot {
  background: #f59e0b;
}

.legend-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
  flex: 1;
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

/* Insights Section */
.insights-section {
  margin-top: 1.5rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #f59e0b;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.insight-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s;
}

.insight-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.insight-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.success-insight {
  background: linear-gradient(135deg, #10b981, #059669);
}

.info-insight {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.warning-insight {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.375rem;
}

.insight-text {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .stats-column {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .modern-card {
    flex: 1;
    min-width: 300px;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .welcome-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .welcome-stats {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }

  .quick-stat {
    width: 100%;
    justify-content: flex-start;
  }

  .stats-column {
    flex-direction: column;
  }

  .modern-card {
    min-width: auto;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .chart-legend {
    grid-template-columns: 1fr;
  }
}
</style>