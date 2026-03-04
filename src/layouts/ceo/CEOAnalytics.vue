<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">CEO Analytics Dashboard</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Advanced Business Intelligence</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Date Range Selector -->
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <select v-model="dateRange" class="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            
            <div class="text-right">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ user?.name || 'CEO' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Chief Executive Officer</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
              {{ (user?.name || 'CEO')[0]?.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- Executive Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="metric in executiveMetrics" :key="metric.id" 
             class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-4">
            <div :class="metric.iconBg" class="w-12 h-12 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" :class="metric.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="metric.icon" />
              </svg>
            </div>
            <span :class="metric.trendBg" class="text-xs font-medium px-2 py-1 rounded-full">
              {{ metric.trend }}
            </span>
          </div>
          <h3 v-if="loading" class="text-2xl font-bold text-slate-900 dark:text-white mb-1 animate-pulse">
            <div class="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </h3>
          <h3 v-else class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ metric.value }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ metric.title }}</p>
          <div class="mt-3 flex items-center gap-2">
            <div class="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div :class="metric.progressColor" class="h-2 rounded-full transition-all duration-500" :style="{width: metric.progress + '%'}"></div>
            </div>
            <span class="text-xs text-slate-500">{{ metric.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- Advanced Analytics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue Analytics -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Revenue Analytics</h2>
            <div class="flex items-center gap-2">
              <button @click="refreshRevenueData" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <select v-model="revenueView" class="text-sm bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1 outline-none">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          
          <!-- Revenue Chart Placeholder -->
          <div class="h-64 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <div class="text-center">
              <svg class="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-sm text-slate-500">Revenue Chart Visualization</p>
              <p class="text-xs text-slate-400 mt-1">Interactive chart will be implemented here</p>
            </div>
          </div>
          
          <!-- Revenue Metrics -->
          <div class="grid grid-cols-3 gap-4 mt-6">
            <div class="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(revenueMetrics.total) }}</p>
              <p class="text-xs text-slate-500">Total Revenue</p>
            </div>
            <div class="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ revenueMetrics.growth }}%</p>
              <p class="text-xs text-slate-500">Growth Rate</p>
            </div>
            <div class="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(revenueMetrics.average) }}</p>
              <p class="text-xs text-slate-500">Average</p>
            </div>
          </div>
        </div>

        <!-- Budget Overview -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Budget Overview</h2>
            <button @click="navigateToBudget" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View Details →
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="budget in budgetMetrics" :key="budget.category" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ budget.category }}</span>
                <span class="text-sm text-slate-500">{{ formatCurrency(budget.spent) }} / {{ formatCurrency(budget.allocated) }}</span>
              </div>
              <div class="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div :class="budget.color" class="h-2 rounded-full transition-all duration-500" 
                     :style="{width: budget.percentage + '%'}"></div>
              </div>
              <p class="text-xs" :class="budget.textColor">{{ budget.status }}</p>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget Utilization</span>
              <span class="text-lg font-bold" :class="overallBudgetUtilization.color">{{ overallBudgetUtilization.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance & Risk Matrix -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Performance Scorecards -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Performance Scorecards</h2>
            <button @click="navigateToPerformance" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Manage →
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="scorecard in performanceScorecards" :key="scorecard.department" 
                 class="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">{{ scorecard.department }}</h3>
                  <p class="text-xs text-slate-500">{{ scorecard.manager }}</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold" :class="scorecard.scoreColor">{{ scorecard.score }}/100</p>
                  <p class="text-xs" :class="scorecard.gradeColor">{{ scorecard.grade }}</p>
                </div>
              </div>
              
              <div class="space-y-2">
                <div v-for="kpi in scorecard.kpis.slice(0, 3)" :key="kpi.name" class="flex items-center justify-between text-xs">
                  <span class="text-slate-600 dark:text-slate-400">{{ kpi.name }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div :class="kpi.color" class="h-1.5 rounded-full" :style="{width: kpi.percentage + '%'}"></div>
                    </div>
                    <span :class="kpi.textColor">{{ kpi.value }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Assessment Matrix -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Risk Assessment Matrix</h2>
            <button @click="navigateToRisk" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Assess →
            </button>
          </div>
          
          <!-- Risk Matrix Grid -->
          <div class="grid grid-cols-5 gap-2 mb-4">
            <div></div>
            <div class="text-xs text-center text-slate-500 font-medium">Very Low</div>
            <div class="text-xs text-center text-slate-500 font-medium">Low</div>
            <div class="text-xs text-center text-slate-500 font-medium">Medium</div>
            <div class="text-xs text-center text-slate-500 font-medium">High</div>
            
            <div class="text-xs text-center text-slate-500 font-medium">Very High</div>
            <div class="h-12 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-red-700 dark:text-red-300">{{ getRiskCount('very-high', 'very-high') }}</span>
            </div>
            <div class="h-12 bg-red-50 dark:bg-red-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-red-600 dark:text-red-400">{{ getRiskCount('very-high', 'high') }}</span>
            </div>
            <div class="h-12 bg-amber-50 dark:bg-amber-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-amber-600 dark:text-amber-400">{{ getRiskCount('very-high', 'medium') }}</span>
            </div>
            <div class="h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-yellow-600 dark:text-yellow-400">{{ getRiskCount('very-high', 'low') }}</span>
            </div>
            
            <div class="text-xs text-center text-slate-500 font-medium">High</div>
            <div class="h-12 bg-red-50 dark:bg-red-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-red-600 dark:text-red-400">{{ getRiskCount('high', 'very-high') }}</span>
            </div>
            <div class="h-12 bg-amber-100 dark:bg-amber-900/30 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-amber-700 dark:text-amber-300">{{ getRiskCount('high', 'high') }}</span>
            </div>
            <div class="h-12 bg-amber-50 dark:bg-amber-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-amber-600 dark:text-amber-400">{{ getRiskCount('high', 'medium') }}</span>
            </div>
            <div class="h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-yellow-600 dark:text-yellow-400">{{ getRiskCount('high', 'low') }}</span>
            </div>
            
            <div class="text-xs text-center text-slate-500 font-medium">Medium</div>
            <div class="h-12 bg-amber-50 dark:bg-amber-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-amber-600 dark:text-amber-400">{{ getRiskCount('medium', 'very-high') }}</span>
            </div>
            <div class="h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-yellow-600 dark:text-yellow-400">{{ getRiskCount('medium', 'high') }}</span>
            </div>
            <div class="h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-yellow-700 dark:text-yellow-300">{{ getRiskCount('medium', 'medium') }}</span>
            </div>
            <div class="h-12 bg-green-50 dark:bg-green-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-green-600 dark:text-green-400">{{ getRiskCount('medium', 'low') }}</span>
            </div>
            
            <div class="text-xs text-center text-slate-500 font-medium">Low</div>
            <div class="h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-yellow-600 dark:text-yellow-400">{{ getRiskCount('low', 'very-high') }}</span>
            </div>
            <div class="h-12 bg-green-50 dark:bg-green-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-green-600 dark:text-green-400">{{ getRiskCount('low', 'high') }}</span>
            </div>
            <div class="h-12 bg-green-50 dark:bg-green-900/20 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-green-600 dark:text-green-400">{{ getRiskCount('low', 'medium') }}</span>
            </div>
            <div class="h-12 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
              <span class="text-xs font-medium text-green-700 dark:text-green-300">{{ getRiskCount('low', 'low') }}</span>
            </div>
          </div>
          
          <!-- Risk Summary -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p class="text-lg font-bold text-red-600">{{ criticalRisks }}</p>
              <p class="text-xs text-red-600">Critical Risks</p>
            </div>
            <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p class="text-lg font-bold text-amber-600">{{ highRisks }}</p>
              <p class="text-xs text-amber-600">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Reports -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <button v-for="action in quickActions" :key="action.id" @click="handleQuickAction(action)"
                    class="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
              <div :class="action.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" :class="action.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                </svg>
              </div>
              <div class="flex-1 text-left">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ action.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ action.description }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Reports -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Reports</h2>
            <button @click="navigateToReports" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All →
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="report in recentReports" :key="report.id" 
                 class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div class="flex items-center gap-3">
                <div :class="report.iconBg" class="w-8 h-8 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4" :class="report.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="report.icon" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ report.title }}</p>
                  <p class="text-xs text-slate-500">{{ report.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400">{{ report.date }}</span>
                <button @click="downloadReport(report)" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                  <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const loading = ref(true);
const dateRange = ref('30d');
const revenueView = ref('monthly');

// User data
const user = ref(null);

// Executive Metrics
const executiveMetrics = ref([]);

// Revenue Metrics
const revenueMetrics = ref({
  total: 0,
  growth: 0,
  average: 0
});

// Budget Metrics
const budgetMetrics = ref([]);

// Performance Scorecards
const performanceScorecards = ref([]);

// Risk Matrix Data
const riskData = ref([]);

// Quick Actions
const quickActions = ref([]);

// Recent Reports
const recentReports = ref([]);

// Computed properties
const overallBudgetUtilization = computed(() => {
  const totalAllocated = budgetMetrics.value.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgetMetrics.value.reduce((sum, budget) => sum + budget.spent, 0);
  const percentage = Math.round((totalSpent / totalAllocated) * 100);
  
  let color = 'text-green-600';
  if (percentage > 90) color = 'text-red-600';
  else if (percentage > 75) color = 'text-amber-600';
  
  return { percentage, color };
});

const criticalRisks = computed(() => {
  return riskData.value.filter(risk => 
    (risk.impact === 'very-high' && risk.probability !== 'low') ||
    (risk.impact === 'high' && risk.probability === 'high')
  ).length;
});

const highRisks = computed(() => {
  return riskData.value.filter(risk => 
    risk.impact === 'high' && risk.probability !== 'low' ||
    risk.impact === 'medium' && risk.probability === 'high'
  ).length;
});

// Methods
const formatCurrency = (value) => {
  if (!value) return 'TZS 0';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getRiskCount = (impact, probability) => {
  return riskData.value.filter(risk => 
    risk.impact === impact && risk.probability === probability
  ).length;
};

const refreshRevenueData = async () => {
  toast.info('Refreshing revenue data...');
  // Implement actual data refresh logic
};

const navigateToBudget = () => {
  window.location.href = '/ceo/budget';
};

const navigateToPerformance = () => {
  window.location.href = '/ceo/performance';
};

const navigateToRisk = () => {
  window.location.href = '/ceo/risk';
};

const navigateToReports = () => {
  window.location.href = '/ceo/reports';
};

const handleQuickAction = (action) => {
  toast.info(`Executing: ${action.title}`);
  // Implement quick action logic
};

const downloadReport = (report) => {
  toast.info(`Downloading: ${report.title}`);
  // Implement report download logic
};

const fetchUser = async () => {
  try {
    const response = await axios.get('/api/user/profile');
    user.value = response.data?.data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    user.value = null;
  }
};

const fetchAnalyticsData = async () => {
  try {
    // Fetch real analytics data from API
    const [metricsResponse, revenueResponse, budgetResponse] = await Promise.all([
      axios.get('/api/analytics/metrics'),
      axios.get('/api/analytics/revenue'),
      axios.get('/api/analytics/budget')
    ]);
    
    // Update executive metrics with real data
    const metricsData = metricsResponse.data.data;
    executiveMetrics.value = [
      {
        id: 1,
        title: 'Total Revenue',
        value: `TZS ${(metricsData.total_revenue / 1000000).toFixed(1)}M`,
        trend: `+${metricsData.revenue_growth}%`,
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trendBg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        progress: Math.min(metricsData.revenue_growth + 50, 100),
        progressColor: 'bg-purple-500'
      },
      {
        id: 2,
        title: 'Active Projects',
        value: metricsData.active_projects.toString(),
        trend: '+12.3%',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trendBg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        progress: 65,
        progressColor: 'bg-green-500'
      },
      {
        id: 3,
        title: 'Team Performance',
        value: `${metricsData.team_performance}%`,
        trend: '+5.2%',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trendBg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        progress: metricsData.team_performance,
        progressColor: 'bg-blue-500'
      },
      {
        id: 4,
        title: 'Risk Score',
        value: metricsData.risk_score > 70 ? 'High' : metricsData.risk_score > 40 ? 'Medium' : 'Low',
        trend: `-${metricsData.risk_score}%`,
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
        iconBg: metricsData.risk_score > 70 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: metricsData.risk_score > 70 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400',
        trendBg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        progress: metricsData.risk_score,
        progressColor: metricsData.risk_score > 70 ? 'bg-red-500' : 'bg-amber-500'
      }
    ];
    
    // Update revenue metrics
    const revenueData = revenueResponse.data.data;
    revenueMetrics.value = {
      total: revenueData.total_revenue || 0,
      growth: revenueData.growth_rate || 0,
      average: revenueData.average_revenue || 0
    };
    
    // Update budget metrics
    const budgetData = budgetResponse.data.data;
    budgetMetrics.value = budgetData.budgetCategories || [];
    
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    toast.error('Failed to load analytics data');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchUser(),
    fetchAnalyticsData()
  ]);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* Custom animations */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
</style>
