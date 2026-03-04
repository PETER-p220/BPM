<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-['DM_Sans',sans-serif]">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">System Reports</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Analytics and business insights</p>
          </div>
          
          <div class="flex items-center gap-3">
            <select v-model="selectedPeriod" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <button @click="generateReport" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tenders</h3>
            <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.totalTenders }}</p>
          <p class="text-xs text-green-600">+12% from last period</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-slate-600 dark:text-slate-400">Active Projects</h3>
            <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.activeProjects }}</p>
          <p class="text-xs text-green-600">+8% from last period</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</h3>
            <svg class="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(metrics.totalRevenue) }}</p>
          <p class="text-xs text-green-600">+24% from last period</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Approvals</h3>
            <svg class="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.pendingApprovals }}</p>
          <p class="text-xs text-amber-600">Requires attention</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tender Status Chart -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Tender Status Overview</h2>
          <div class="space-y-3">
            <div v-for="(value, status) in tenderStatusData" :key="status" class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400 capitalize">{{ status }}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="getStatusColor(status)"
                    :style="{ width: `${(value / metrics.totalTenders) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Trend Chart -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Revenue Trend</h2>
          <div class="space-y-2">
            <div v-for="month in revenueTrend" :key="month.month" class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ month.month }}</span>
              <span class="text-sm font-medium text-slate-900 dark:text-white">{{ formatCurrency(month.revenue) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent System Activities</h2>
        <div class="space-y-3">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.icon" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-900 dark:text-white">{{ activity.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';

const selectedPeriod = ref('30');
const metrics = ref({
  totalTenders: 0,
  activeProjects: 0,
  totalRevenue: 0,
  pendingApprovals: 0
});

const tenderStatusData = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  active: 0
});

const revenueTrend = ref([
  { month: 'January', revenue: 2500000 },
  { month: 'February', revenue: 3200000 },
  { month: 'March', revenue: 2800000 },
  { month: 'April', revenue: 4100000 },
  { month: 'May', revenue: 3800000 },
  { month: 'June', revenue: 5200000 }
]);

const recentActivities = ref([
  {
    id: 1,
    type: 'tender',
    title: 'New Construction Tender Submitted',
    time: '2 hours ago',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  {
    id: 2,
    type: 'approval',
    title: 'Quotation Approved - IT Infrastructure',
    time: '5 hours ago',
    icon: 'M5 13l4 4L19 7'
  },
  {
    id: 3,
    type: 'revenue',
    title: 'New Contract Awarded - Office Supplies',
    time: '1 day ago',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]);

onMounted(async () => {
  await fetchMetrics();
});

async function fetchMetrics() {
  try {
    const [tendersRes, projectsRes, quotationsRes] = await Promise.all([
      axios.get('/api/tenders'),
      axios.get('/api/projects'),
      axios.get('/api/price-shedules')
    ]);

    const tenders = tendersRes.data.data || [];
    const projects = projectsRes.data.data || [];
    const quotations = quotationsRes.data.data || [];

    metrics.value = {
      totalTenders: tenders.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalRevenue: projects.reduce((sum, p) => sum + (p.value || 0), 0),
      pendingApprovals: quotations.filter(q => q.status === 'pending').length
    };

    // Update tender status data
    tenderStatusData.value = {
      pending: tenders.filter(t => t.status === 'pending').length,
      approved: tenders.filter(t => t.status === 'approved').length,
      rejected: tenders.filter(t => t.status === 'rejected').length,
      active: tenders.filter(t => t.status === 'active').length
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
  }
}

function formatCurrency(value) {
  if (!value) return 'TZS 0';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'approved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    case 'active': return 'bg-blue-500';
    case 'pending': return 'bg-amber-500';
    default: return 'bg-slate-500';
  }
}

function getActivityIconClass(type) {
  switch (type) {
    case 'tender': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    case 'approval': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'revenue': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
    default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
  }
}

function generateReport() {
  // Generate comprehensive report
  const reportData = {
    period: selectedPeriod.value,
    metrics: metrics.value,
    tenderStatus: tenderStatusData.value,
    revenueTrend: revenueTrend.value,
    generatedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ceo_report_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}
</script>
