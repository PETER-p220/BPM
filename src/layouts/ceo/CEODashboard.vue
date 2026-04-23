<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5 dashboard-shell">
    <div class="dashboard-frame mx-auto flex min-h-[calc(100vh-32px)] max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/84 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">
      <div class="dashboard-hero relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="pointer-events-none absolute right-6 top-3 h-24 w-24 opacity-35" style="background-image: radial-gradient(#2b74d7 1.2px, transparent 1.2px); background-size: 10px 10px;"></div>

        <div class="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div class="flex min-w-0 items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zM3 21h8v-6H3v6z" />
              </svg>
            </div>

            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63] lg:text-[28px]">Executive Dashboard</h1>
              <p class="mt-1.5 max-w-3xl text-sm leading-6 text-[#67819d]">Monitor operational load, project value, budget movement, and system readiness from a single executive command surface.</p>
            </div>
          </div>

          
        </div>

        <div class="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="analytics-card analytics-card--revenue p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-24 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ formatCurrency(stats.totalRevenue) }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Revenue</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="analytics-card analytics-card--tenders p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-12 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ stats.totalTenders || 0 }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Tenders</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div class="analytics-card analytics-card--projects p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-12 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ stats.activeProjects || 0 }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Active Projects</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="analytics-card analytics-card--pending p-5 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p v-if="loading" class="animate-pulse"><span class="inline-block h-6 w-12 rounded bg-white/30"></span></p>
                <p v-else class="text-xl font-bold">{{ stats.pendingApprovals || 0 }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Pending Approvals</p>
              </div>
              <div class="analytics-card__icon">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-body grid flex-1 grid-cols-1 gap-4 bg-[linear-gradient(180deg,#fbfdff_0%,#f7fbff_100%)] p-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.95fr)]">
        <div class="grid min-h-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section class="workspace-panel flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-[#dce7f3] bg-white shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="workspace-panel__header flex items-center justify-between gap-4 border-b border-[#e6eef7] px-5 py-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Action Queue</p>
                <h2 class="mt-1 text-base font-bold text-[#183b63]">Pending Approvals</h2>
              </div>
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#1f5aa6]">
                {{ filteredPendingItems.length }} item{{ filteredPendingItems.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <div v-if="loading" class="flex-1 space-y-3 px-5 py-4">
              <div v-for="i in 5" :key="i" class="animate-pulse rounded-2xl border border-[#e3edf7] bg-white p-4 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-2xl bg-[#dfeaf6]"></div>
                  <div class="flex-1">
                    <div class="mb-2 h-4 w-2/3 rounded bg-[#dfeaf6]"></div>
                    <div class="h-3 w-1/3 rounded bg-[#edf3fa]"></div>
                  </div>
                  <div class="h-7 w-16 rounded-full bg-[#edf3fa]"></div>
                </div>
              </div>
            </div>

            <div v-else-if="filteredPendingItems.length === 0" class="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f2ff] shadow-inner">
                <svg class="h-7 w-7 text-[#2b74d7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-[#183b63]">{{ searchQuery ? 'No approvals match your search' : 'No pending approvals' }}</p>
              <p class="mt-1 text-xs text-[#8aa0b7]">{{ searchQuery ? 'Try a different keyword.' : 'Everything currently looks clear.' }}</p>
            </div>

            <div v-else class="panel-scroll flex-1 overflow-y-auto px-5 py-4">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-[#edf2f7] text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#88a0b8]">
                    <th class="px-2 py-3">Task</th>
                    <th class="px-2 py-3">Type</th>
                    <th class="px-2 py-3">Priority</th>
                    <th class="px-2 py-3">Age</th>
                    <th class="px-2 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredPendingItems" :key="item.id" class="border-b border-[#f2f6fb] text-[#4e6781] transition-colors hover:bg-[#fbfdff]">
                    <td class="px-2 py-3.5">
                      <p class="font-semibold text-[#183b63]">{{ item.title }}</p>
                      <p class="mt-1 text-xs text-[#8aa0b7]">Executive review required</p>
                    </td>
                    <td class="px-2 py-3.5">
                      <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="item.type === 'Tender' ? 'bg-[#edf4ff] text-[#1f5aa6]' : 'bg-[#f5f1ff] text-[#6b56cf]'">
                        {{ item.type }}
                      </span>
                    </td>
                    <td class="px-2 py-3.5">
                      <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="getPriorityColor(item.priority)">
                        {{ item.priority }}
                      </span>
                    </td>
                    <td class="px-2 py-3.5 text-sm text-[#7a93af]">{{ item.time }}</td>
                    <td class="px-2 py-3.5 text-right">
                      <button @click="handleApproval(item)" class="inline-flex items-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(35,96,182,0.16)] transition-all hover:brightness-105">
                        Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

    
        </div>

        <div class="grid min-h-0 grid-cols-1 gap-4 lg:grid-rows-[auto_auto_minmax(0,1fr)]">
          

          

          <section class="workspace-panel flex min-h-0 flex-col rounded-[28px] border border-[#dce7f3] bg-white p-5 shadow-[0_16px_34px_rgba(18,58,99,0.08)]">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Executive Totals</p>
                <h2 class="mt-1 text-base font-bold text-[#183b63]">Portfolio Overview</h2>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Awards</p>
                <p class="mt-2 text-lg font-bold text-[#183b63]">{{ stats.totalAwards || 0 }}</p>
              </div>
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Completed</p>
                <p class="mt-2 text-lg font-bold text-[#183b63]">{{ stats.completedProjects || 0 }}</p>
              </div>
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Failed</p>
                <p class="mt-2 text-lg font-bold text-[#c24a2d]">{{ stats.failedProjects || 0 }}</p>
              </div>
              <div class="rounded-[22px] border border-[#e6eef7] bg-[#fbfdff] p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Tracked Budget</p>
                <p class="mt-2 text-sm font-bold text-[#183b63]">{{ formatCurrency(stats.totalBudget) }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { optimizedRequest } from '@/utils/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const user = ref(null);
const searchQuery = ref('');
const stats = ref({
  totalTenders: 0,
  activeProjects: 0,
  pendingApprovals: 0,
  totalRevenue: 0,
  totalAwards: 0,
  completedProjects: 0,
  failedProjects: 0,
  totalBudget: 0
});

const pendingItems = ref([]);
const recentActivities = ref([]);
const budgetReductions = ref({
  total_original_budget: 0,
  total_reduced_budget: 0,
  total_current_budget: 0,
  overall_reduction_percentage: 0,
  projects_count: 0,
  recent_reductions: [],
  budget_reduction_trend: []
});
const systemHealth = ref({
  overall: 'loading',
  components: {
    api: { status: 'loading', response_time: 'Checking...' },
    database: { status: 'loading', connection: 'Checking...' },
    storage: { status: 'loading', usage_percentage: 0 },
    backup: { status: 'loading', time_ago: 'Checking...' }
  }
});
const trends = ref({
  tender_growth: 0,
  project_growth: 0,
  revenue_growth: 0
});
const loading = ref(true);
const budgetLoading = ref(true);
const currentTime = ref(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));

const currentDate = computed(() => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

const efficiencyPercent = computed(() => {
  const total = (stats.value.completedProjects || 0) + (stats.value.activeProjects || 0) + (stats.value.failedProjects || 0);
  if (total === 0) return 0;
  return Math.round((stats.value.completedProjects / total) * 100);
});

const filteredPendingItems = computed(() => filterCollection(pendingItems.value, ['title', 'type', 'priority', 'time']));
const filteredRecentActivities = computed(() => filterCollection(recentActivities.value, ['title', 'description', 'time']));

const healthCards = computed(() => {
  const components = systemHealth.value.components || {};
  return [
    { label: 'API', status: components.api?.status, detail: components.api?.response_time || 'No response data' },
    { label: 'Database', status: components.database?.status, detail: components.database?.connection || 'No connection data' },
    { label: 'Storage', status: components.storage?.status, detail: `${components.storage?.usage_percentage || 0}% used` },
    { label: 'Backup', status: components.backup?.status, detail: components.backup?.time_ago || 'No backup status' }
  ];
});

let refreshInterval = null;
let healthCheckInterval = null;
let clockInterval = null;

onMounted(async () => {
  await Promise.all([
    fetchDashboardData(),
    fetchUser(),
    fetchPendingApprovals(),
    fetchRecentActivities(),
    fetchSystemHealth(),
    fetchTrends(),
    fetchBudgetReductions()
  ]);
  loading.value = false;
  budgetLoading.value = false;

  refreshInterval = setInterval(() => {
    Promise.all([
      fetchDashboardData(),
      fetchPendingApprovals(),
      fetchRecentActivities(),
      fetchTrends(),
      fetchBudgetReductions()
    ]);
  }, 5 * 60 * 1000);

  healthCheckInterval = setInterval(() => {
    fetchSystemHealth();
  }, 2 * 60 * 1000);

  clockInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }, 60 * 1000);
});

onUnmounted(() => {
  if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
  if (healthCheckInterval) { clearInterval(healthCheckInterval); healthCheckInterval = null; }
  if (clockInterval) { clearInterval(clockInterval); clockInterval = null; }
});

async function fetchDashboardData() {
  try {
    const response = await optimizedRequest('/api/dashboard/stats');
    const data = response?.data || {};
    stats.value = {
      totalTenders: data.tenders?.registered || 0,
      activeProjects: data.projects?.inProgress || 0,
      pendingApprovals: (data.tenders?.deadlineReached || 0) + (data.projects?.failed || 0),
      totalRevenue: data.projects?.totalBudget || 0,
      totalAwards: data.awards?.total || 0,
      completedProjects: data.projects?.completed || 0,
      failedProjects: data.projects?.failed || 0,
      totalBudget: data.projects?.totalBudget || 0
    };
  } catch (error) {
    console.warn('Primary dashboard/stats unavailable — falling back to individual APIs');
    await fetchDashboardDataFallback();
  }
}

async function fetchDashboardDataFallback() {
  try {
    const [tendersRes, quotationsRes, projectsRes] = await Promise.all([
      optimizedRequest('/api/tenders'),
      optimizedRequest('/api/price-shedules'),
      optimizedRequest('/api/projects')
    ]);
    const tenders = tendersRes.data.data || [];
    const quotations = quotationsRes.data.data || [];
    const projects = projectsRes.data.data || [];
    stats.value = {
      totalTenders: tenders.length,
      activeProjects: projects.filter(project => project.status === 'active').length,
      pendingApprovals: quotations.filter(quotation => quotation.status === 'pending').length,
      totalRevenue: projects.reduce((sum, project) => sum + (project.value || 0), 0),
      totalAwards: 0,
      completedProjects: projects.filter(project => project.status === 'completed').length,
      failedProjects: projects.filter(project => project.status === 'failed').length,
      totalBudget: projects.reduce((sum, project) => sum + (project.value || 0), 0)
    };
  } catch (error) {
    console.error('Fallback dashboard fetch failed:', error);
    toast.error('Failed to load dashboard statistics');
    stats.value = {
      totalTenders: 0,
      activeProjects: 0,
      pendingApprovals: 0,
      totalRevenue: 0,
      totalAwards: 0,
      completedProjects: 0,
      failedProjects: 0,
      totalBudget: 0
    };
  }
}

async function fetchUser() {
  try {
    const response = await optimizedRequest('/api/user/profile');
    user.value = response?.data || null;
  } catch (error) {
    try {
      const response = await optimizedRequest('/api/user');
      user.value = response?.data || null;
    } catch (err) {
      console.error('Error fetching user:', err);
      user.value = null;
    }
  }
}

async function fetchPendingApprovals() {
  try {
    const [deadlineTenders, failedProjects] = await Promise.all([
      optimizedRequest('/api/count/deadline-reached/tenders'),
      optimizedRequest('/api/count/failed-projects')
    ]);
    const deadlineCount = deadlineTenders.data?.count || 0;
    const failedCount = failedProjects.data?.total_failed_projects || 0;
    const pendingTenders = Array(deadlineCount).fill(0).map((_, index) => ({
      id: `tender-${index}`,
      title: `Tender #${index + 1} - Deadline Reached`,
      type: 'Tender',
      time: getTimeAgo('deadline'),
      priority: 'high'
    }));
    const pendingProjects = Array(failedCount).fill(0).map((_, index) => ({
      id: `project-${index}`,
      title: `Project #${index + 1} - Failed Status`,
      type: 'Project',
      time: getTimeAgo('failed'),
      priority: 'medium'
    }));
    pendingItems.value = [...pendingTenders, ...pendingProjects].slice(0, 5);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    pendingItems.value = [];
  }
}

async function fetchBudgetReductions() {
  try {
    const response = await optimizedRequest('/api/budget/reductions');
    budgetReductions.value = response?.data || {
      total_original_budget: 0,
      total_reduced_budget: 0,
      total_current_budget: 0,
      overall_reduction_percentage: 0,
      projects_count: 0,
      recent_reductions: [],
      budget_reduction_trend: []
    };
  } catch (error) {
    console.error('Error fetching budget reductions:', error);
    budgetReductions.value = {
      total_original_budget: 0,
      total_reduced_budget: 0,
      total_current_budget: 0,
      overall_reduction_percentage: 0,
      projects_count: 0,
      recent_reductions: [],
      budget_reduction_trend: []
    };
  } finally {
    budgetLoading.value = false;
  }
}

async function fetchRecentActivities() {
  try {
    const [awardedTenders, completedProjects] = await Promise.all([
      optimizedRequest('/api/count/awarded-tenders'),
      optimizedRequest('/api/count/completed-projects')
    ]);
    const awardedCount = awardedTenders.data?.count || 0;
    const completedCount = completedProjects.data?.total_completed_projects || 0;
    const activities = [];

    if (awardedCount > 0) {
      activities.push({
        id: 1,
        title: 'New Tender Awarded',
        description: `${awardedCount} tenders successfully awarded`,
        time: getTimeAgo('awarded'),
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        showLine: true
      });
    }

    if (completedCount > 0) {
      activities.push({
        id: 2,
        title: 'Projects Completed',
        description: `${completedCount} projects marked as completed`,
        time: getTimeAgo('completed'),
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        showLine: true
      });
    }

    recentActivities.value = activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    recentActivities.value = [];
  }
}

async function fetchSystemHealth() {
  try {
    const response = await optimizedRequest('/api/system/health');
    const data = response?.data || {};
    systemHealth.value = {
      overall: data.overall || 'unknown',
      components: {
        api: data.components?.api || { status: 'unknown', response_time: 'Unknown' },
        database: data.components?.database || { status: 'unknown', connection: 'Unknown' },
        storage: data.components?.storage || { status: 'unknown', usage_percentage: 0 },
        backup: data.components?.backup || { status: 'unknown', time_ago: 'Unknown' }
      }
    };
  } catch (error) {
    console.error('Error fetching system health:', error);
    systemHealth.value = {
      overall: 'error',
      components: {
        api: { status: 'error', response_time: 'Failed' },
        database: { status: 'error', connection: 'Failed' },
        storage: { status: 'error', usage_percentage: 0 },
        backup: { status: 'error', time_ago: 'Failed' }
      }
    };
  }
}

async function fetchTrends() {
  try {
    const response = await optimizedRequest('/api/dashboard/trends');
    const data = response?.data || {};
    trends.value = {
      tender_growth: data.tender_growth || 0,
      project_growth: data.project_growth || 0,
      revenue_growth: data.revenue_growth || 0
    };
  } catch (error) {
    console.error('Error fetching trends:', error);
    trends.value = { tender_growth: 0, project_growth: 0, revenue_growth: 0 };
  }
}

function filterCollection(collection, fields) {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return collection;
  return collection.filter(item => fields.some(field => String(item[field] || '').toLowerCase().includes(query)));
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

function formatTrendValue(value) {
  if (!value) return '0%';
  return `${value > 0 ? '+' : ''}${value}%`;
}

function formatHealthStatus(status) {
  if (!status) return 'Unknown';
  const normalized = String(status).replace(/[_-]/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function handleApproval(item) {
  if (item.type === 'Tender') {
    window.location.href = '/ceo/tenders';
  } else if (item.type === 'Project') {
    window.location.href = '/ceo/reports';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-700';
    case 'medium':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-emerald-50 text-emerald-700';
  }
}

function getTrendTone(value) {
  if (value > 0) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (value < 0) return 'border-red-200 bg-red-50 text-red-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

function getHealthTone(status) {
  switch (String(status || '').toLowerCase()) {
    case 'healthy':
    case 'ok':
    case 'up':
    case 'connected':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'warning':
    case 'degraded':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'error':
    case 'down':
    case 'failed':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'loading':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600';
  }
}

function getTimeAgo(type) {
  const now = new Date();
  let timeAgo;

  switch (type) {
    case 'awarded':
      timeAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
      break;
    case 'completed':
      timeAgo = new Date(now.getTime() - (5 * 60 * 60 * 1000));
      break;
    case 'deadline':
      timeAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));
      break;
    case 'failed':
      timeAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
      break;
    default:
      timeAgo = new Date(now.getTime() - (30 * 60 * 1000));
  }

  const diff = now - timeAgo;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
}
</script>

<style scoped>
.dashboard-shell {
  background:
    radial-gradient(circle at top right, rgba(48, 120, 221, 0.08), transparent 22%),
    linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);
}

.dashboard-frame {
  position: relative;
}

.dashboard-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 34px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.dashboard-hero {
  box-shadow: inset 0 -1px 0 rgba(220, 232, 245, 0.85);
}

.dashboard-body {
  background: linear-gradient(180deg, #fbfdff 0%, #f7fbff 100%);
}

.workspace-panel {
  position: relative;
}

.workspace-panel__header {
  background: linear-gradient(180deg, rgba(243, 248, 255, 0.92), rgba(255, 255, 255, 0.98));
}

.panel-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(43, 116, 215, 0.24) transparent;
}

.panel-scroll::-webkit-scrollbar {
  width: 8px;
}

.panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.panel-scroll::-webkit-scrollbar-thumb {
  background: rgba(43, 116, 215, 0.18);
  border-radius: 9999px;
}

.analytics-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 18px 38px rgba(21, 52, 92, 0.18);
}

.analytics-card::before {
  content: '';
  position: absolute;
  inset: auto -18% -42% auto;
  width: 150px;
  height: 150px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
}

.analytics-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 50%);
  pointer-events: none;
}

.analytics-card--revenue {
  background: linear-gradient(135deg, #164c93 0%, #2f78dd 100%);
}

.analytics-card--tenders {
  background: linear-gradient(135deg, #164c93 0%, #2f78dd 100%);
}

.analytics-card--projects {
  background: linear-gradient(135deg, #2a70cf 0%, #5ea3f5 100%);
}

.analytics-card--pending {
  background: linear-gradient(135deg, #7d96b6 0%, #aab8cb 100%);
}

.analytics-card__icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
</style>
