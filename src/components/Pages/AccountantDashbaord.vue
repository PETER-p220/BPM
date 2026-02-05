<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">Accountant Dashboard</h1>
          <p class="dashboard-subtitle">Financial overview and analytics</p>
        </div>
        <div class="header-actions">
          <div class="live-indicator">
            <span class="pulse-dot"></span>
            <span>Live</span>
          </div>
          <button class="refresh-btn" @click="refreshData">
            <i class="fas fa-sync-alt" :class="{ 'spinning': isRefreshing }"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="overview-card">
        <div class="overview-icon receipts">
          <i class="fas fa-receipt"></i>
        </div>
        <div class="overview-content">
          <div class="overview-value">{{ totalSubmitted }}</div>
          <div class="overview-label">Total Receipts</div>
          <div class="overview-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>+12% from last month</span>
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon projects">
          <i class="fas fa-project-diagram"></i>
        </div>
        <div class="overview-content">
          <div class="overview-value">{{ totalProjects }}</div>
          <div class="overview-label">Total Projects</div>
          <div class="overview-change neutral">
            <i class="fas fa-minus"></i>
            <span>No change</span>
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon success">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="overview-content">
          <div class="overview-value">{{ totalApproved }}</div>
          <div class="overview-label">Approved</div>
          <div class="overview-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>+8% from last month</span>
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="overview-content">
          <div class="overview-value">{{ pendingCount }}</div>
          <div class="overview-label">Pending</div>
          <div class="overview-change warning">
            <i class="fas fa-arrow-up"></i>
            <span>+3 new today</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Receipt Details Card -->
        <div class="detail-card">
          <div class="card-header">
            <h3 class="card-title">Receipt Submissions</h3>
            <div class="card-badge receipts-badge">{{ totalSubmitted }} Total</div>
          </div>
          <div class="card-body">
            <div v-if="isLoading.receipts" class="loading-state">
              <div class="loading-spinner"></div>
              <span>Loading data...</span>
            </div>
            <div v-else-if="errorMessage.receipts" class="error-state">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.receipts }}</span>
              <button @click="fetchTotalReceipts" class="retry-btn">Retry</button>
            </div>
            <div v-else class="receipt-stats">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-details">
                  <div class="stat-value">{{ totalSubmitted }}</div>
                  <div class="stat-label">This Month</div>
                </div>
              </div>
              <div class="progress-section">
                <div class="progress-header">
                  <span>Monthly Progress</span>
                  <span class="progress-percentage">75%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill receipts-progress" style="width: 75%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Status Card -->
        <div class="detail-card">
          <div class="card-header">
            <h3 class="card-title">Project Status</h3>
            <div class="card-badge projects-badge">{{ totalProjects }} Total</div>
          </div>
          <div class="card-body">
            <div v-if="isLoading.requests" class="loading-state">
              <div class="loading-spinner"></div>
              <span>Loading data...</span>
            </div>
            <div v-else-if="errorMessage.requests" class="error-state">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ errorMessage.requests }}</span>
              <button @click="fetchAllRequests" class="retry-btn">Retry</button>
            </div>
            <div v-else class="status-breakdown">
              <div class="status-item approved">
                <div class="status-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ totalApproved }}</div>
                  <div class="status-label">Approved</div>
                  <div class="status-percentage">{{ successRate }}%</div>
                </div>
              </div>
              <div class="status-item rejected">
                <div class="status-icon">
                  <i class="fas fa-times-circle"></i>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ totalRejected }}</div>
                  <div class="status-label">Rejected</div>
                  <div class="status-percentage">{{ rejectionRate }}%</div>
                </div>
              </div>
              <div class="status-item pending">
                <div class="status-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ pendingCount }}</div>
                  <div class="status-label">Pending</div>
                  <div class="status-percentage">{{ pendingRate }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Charts -->
      <div class="right-column">
        <!-- Performance Chart -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">Performance Overview</h3>
            <div class="chart-actions">
              <button class="chart-btn active">
                <i class="fas fa-chart-pie"></i>
              </button>
              <button class="chart-btn">
                <i class="fas fa-chart-bar"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <apexchart 
              v-if="hasData"
              type="donut" 
              :options="statusOptions" 
              :series="statusSeries" 
              height="280"
            />
            <div v-else class="no-data">
              <i class="fas fa-chart-pie"></i>
              <span>No data available</span>
            </div>
          </div>
        </div>

        <!-- Success Rate Card -->
        <div class="metric-card">
          <div class="card-header">
            <h3 class="card-title">Success Rate</h3>
            <div class="metric-badge">{{ successRate }}%</div>
          </div>
          <div class="card-body">
            <div class="gauge-container">
              <apexchart 
                v-if="hasData"
                type="radialBar" 
                :options="gaugeOptions" 
                :series="[successRate]" 
                height="200"
              />
              <div v-else class="no-data">
                <i class="fas fa-tachometer-alt"></i>
                <span>No data available</span>
              </div>
            </div>
            <div class="metric-description">
              <p>{{ successRate > 70 ? 'Excellent performance!' : 'Room for improvement' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights Section -->
    <div class="insights-section" v-if="hasData">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-lightbulb"></i>
          Key Insights
        </h2>
      </div>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon success">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">Strong Performance</h4>
            <p class="insight-text">Success rate of {{ successRate }}% is {{ successRate > 70 ? 'above' : 'below' }} target</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon info">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">Activity Summary</h4>
            <p class="insight-text">{{ totalProjects }} projects with {{ totalSubmitted }} receipts</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon warning">
            <i class="fas fa-tasks"></i>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">Pending Actions</h4>
            <p class="insight-text">{{ pendingCount }} items require attention</p>
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

// Chart configurations
const statusSeries = computed(() => [
  totalApproved.value,
  totalRejected.value,
  pendingCount.value
]);

const statusOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  labels: ['Approved', 'Rejected', 'Pending'],
  colors: ['#10b981', '#ef4444', '#f59e0b'],
  legend: {
    position: 'bottom',
    fontSize: '13px',
    fontWeight: '600'
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => Math.round(val) + '%',
    style: {
      fontSize: '14px',
      fontWeight: '700',
      colors: ['#fff']
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%'
      }
    }
  }
});

const gaugeOptions = ref({
  chart: {
    type: 'radialBar',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '65%'
      },
      track: {
        background: '#f1f5f9'
      },
      dataLabels: {
        show: true,
        value: {
          fontSize: '24px',
          fontWeight: '700',
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
      gradientToColors: ['#10b981'],
      inverseColors: false
    }
  },
  colors: ['#10b981'],
  labels: ['Success Rate']
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

.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header */
.dashboard-header {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.dashboard-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #166534;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

.refresh-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.refresh-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.refresh-btn i.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.overview-icon {
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

.overview-icon.receipts {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.overview-icon.projects {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.overview-icon.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.overview-icon.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.overview-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.overview-change {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.overview-change.positive {
  color: #059669;
}

.overview-change.neutral {
  color: #64748b;
}

.overview-change.warning {
  color: #d97706;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Cards */
.detail-card, .chart-card, .metric-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.detail-card {
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.card-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.receipts-badge {
  background: #dbeafe;
  color: #1e40af;
}

.projects-badge {
  background: #f3e8ff;
  color: #7c3aed;
}

.metric-badge {
  background: #dcfce7;
  color: #166534;
}

.card-body {
  padding: 1.25rem;
}

/* Loading & Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f1f5f9;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.error-state {
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Receipt Stats */
.receipt-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1rem;
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
}

.progress-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
}

.progress-percentage {
  color: #3b82f6;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.receipts-progress {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

/* Status Breakdown */
.status-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.status-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.status-item.approved {
  border-left: 3px solid #10b981;
}

.status-item.rejected {
  border-left: 3px solid #ef4444;
}

.status-item.pending {
  border-left: 3px solid #f59e0b;
}

.status-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: white;
}

.status-item.approved .status-icon {
  background: #10b981;
}

.status-item.rejected .status-icon {
  background: #ef4444;
}

.status-item.pending .status-icon {
  background: #f59e0b;
}

.status-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.status-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
}

.status-percentage {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f1f5f9;
}

.status-item.approved .status-percentage {
  color: #059669;
}

.status-item.rejected .status-percentage {
  color: #dc2626;
}

.status-item.pending .status-percentage {
  color: #d97706;
}

/* Chart Actions */
.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.chart-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.chart-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.chart-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Gauge */
.gauge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.metric-description {
  text-align: center;
}

.metric-description p {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

/* No Data */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #64748b;
  font-size: 0.875rem;
}

.no-data i {
  font-size: 2rem;
  opacity: 0.5;
}

/* Insights */
.insights-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #f59e0b;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.insight-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid transparent;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.insight-icon.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.insight-icon.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.insight-icon.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.insight-text {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
