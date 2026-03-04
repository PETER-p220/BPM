<template>
  <div class="min-h-screen bg-[#f5f6fa] dark:bg-[#0d0f14] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl space-y-6">

      <!-- Header -->
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">HR Dashboard</h1>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">System-wide metrics and overview</p>
        </div>
        <div class="flex gap-3 mt-2 sm:mt-0">
          <SummaryChip label="Total Items" :value="totalSystemItems" />
          <SummaryChip label="Active" :value="totalActiveItems" />
          <SummaryChip label="Completion" :value="systemCompletionRate + '%'" />
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <!-- Tenders -->
        <StatCard title="Tenders" :total="totalTenders" label="Registered" icon="contract" color="indigo" @navigate="navigate('tenders')">
          <MetricRow label="Assigned"    :value="totalAssignedTenders" />
          <MetricRow label="Submitted"   :value="totalTenderSubmissions" color="teal" />
          <MetricRow label="In Progress" :value="totalOnProgressTenders" color="amber" />
          <MetricRow label="Due Soon"    :value="totalDeadlineReachedTenders" color="amber" />
          <MetricRow label="Expired"     :value="totalExpiredTenders" color="red" />
          <MetricRow label="Completion"  :value="tenderCompletionRate + '%'" color="indigo" />
        </StatCard>

        <!-- Requests -->
        <StatCard title="Requests" :total="totalRequests" label="Total" icon="inbox" color="amber" @navigate="navigate('requests')">
          <MetricRow label="Submitted"    :value="totalRequests" />
          <MetricRow label="Approved"     :value="approvedRequests" color="teal" />
          <MetricRow label="Rejected"     :value="rejectedRequests" color="red" />
          <MetricRow label="Pending"      :value="pendingRequests" color="amber" />
          <MetricRow label="Approval Rate" :value="requestApprovalRate + '%'" color="indigo" />
        </StatCard>

        <!-- Projects -->
        <StatCard title="Projects" :total="totalProjects" label="Total" icon="projects" color="teal" @navigate="navigate('projects')">
          <MetricRow label="Active"       :value="totalOnProgressProjects" color="amber" />
          <MetricRow label="Completed"    :value="totalCompletedProjects" color="teal" />
          <MetricRow label="Failed"       :value="totalFailedProjects" color="red" />
          <MetricRow label="Success Rate" :value="projectSuccessRate + '%'" color="indigo" />
        </StatCard>

        <!-- Price Schedules -->
        <StatCard title="Price Schedules" :total="totalSchedules" label="Total" icon="schedules" color="pink" @navigate="navigate('schedules')">
          <MetricRow label="Submitted" :value="totalSchedules" />
        </StatCard>

        <!-- Analyses -->
        <StatCard title="Analyses" :total="totalAnalyses" label="Total" icon="analyses" color="cyan" @navigate="navigate('analyses')">
          <MetricRow label="Submitted" :value="totalAnalyses" />
        </StatCard>

      </div>

      <!-- Chart -->
      <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900 p-5">
        <div class="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">System Overview</p>
            <p class="text-xs text-gray-400 mt-0.5">Comprehensive statistics across all modules</p>
          </div>
        </div>
        <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="320" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import VueApexCharts from 'vue3-apexcharts'

const totalTenders = ref(0)
const totalAssignedTenders = ref(0)
const totalTenderSubmissions = ref(0)
const totalProjects = ref(0)
const totalFailedProjects = ref(0)
const totalCompletedProjects = ref(0)
const totalOnProgressTenders = ref(0)
const totalDeadlineReachedTenders = ref(0)
const totalExpiredTenders = ref(0)
const totalOnProgressProjects = ref(0)
const totalAnalyses = ref(0)
const totalSchedules = ref(0)
const totalRequests = ref(0)
const approvedRequests = ref(0)
const rejectedRequests = ref(0)

const totalSystemItems = computed(() =>
  totalTenders.value + totalRequests.value + totalProjects.value + totalSchedules.value + totalAnalyses.value
)
const totalActiveItems = computed(() =>
  totalOnProgressTenders.value + totalOnProgressProjects.value
)
const systemCompletionRate = computed(() => {
  const completed = totalTenderSubmissions.value + approvedRequests.value + totalCompletedProjects.value
  const total = totalTenders.value + totalRequests.value + totalProjects.value
  return total > 0 ? Math.round((completed / total) * 100) : 0
})
const tenderCompletionRate = computed(() =>
  totalTenders.value > 0 ? Math.round((totalTenderSubmissions.value / totalTenders.value) * 100) : 0
)
const requestApprovalRate = computed(() =>
  totalRequests.value > 0 ? Math.round((approvedRequests.value / totalRequests.value) * 100) : 0
)
const pendingRequests = computed(() =>
  totalRequests.value - approvedRequests.value - rejectedRequests.value
)
const projectSuccessRate = computed(() =>
  totalProjects.value > 0 ? Math.round((totalCompletedProjects.value / totalProjects.value) * 100) : 0
)

const chartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  colors: ['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981'],
  plotOptions: { bar: { distributed: true, borderRadius: 6, columnWidth: '52%', dataLabels: { position: 'top' } } },
  dataLabels: {
    enabled: true,
    offsetY: -18,
    style: { fontSize: '11px', fontWeight: '600', colors: ['#374151'] }
  },
  legend: { show: false },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
  xaxis: {
    categories: ['Registered', 'Assigned', 'Submitted', 'Schedules', 'Analyses', 'Requests', 'Projects'],
    labels: { style: { fontSize: '11px', fontWeight: '500', colors: '#9ca3af' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { labels: { style: { fontSize: '11px', colors: '#9ca3af' } } },
  tooltip: { style: { fontSize: '12px' }, y: { formatter: v => v + ' items' } }
})

const chartSeries = computed(() => [{
  name: 'Count',
  data: [
    totalTenders.value, totalAssignedTenders.value, totalTenderSubmissions.value,
    totalSchedules.value, totalAnalyses.value, totalRequests.value, totalProjects.value
  ]
}])

const navigate = (section) => console.log('Navigate to:', section)

const fetchers = [
  ['api/count/registered-tenders',         r => totalTenders.value              = r.data.registered_tenders || 0],
  ['api/count/all-assigned/tenders',        r => totalAssignedTenders.value      = r.data.assignedCount || 0],
  ['api/count/tenders-submissions',         r => totalTenderSubmissions.value    = r.data.submitted_tenders || 0],
  ['api/count/total-projects',              r => totalProjects.value             = r.data.count_total_projects || 0],
  ['api/count/failed-projects',             r => totalFailedProjects.value       = r.data.total_failed_projects || 0],
  ['api/count/completed-projects',          r => totalCompletedProjects.value    = r.data.total_completed_projects || 0],
  ['api/count/on-progress/tender',          r => totalOnProgressTenders.value    = r.data.onProgressCount || 0],
  ['api/count/all/on-progress/projects',    r => totalOnProgressProjects.value   = r.data.total_on_progress_projects || 0],
  ['api/count/all/deadline-reached-tenders',r => totalDeadlineReachedTenders.value = r.data.expired_tenders || 0],
  ['api/count/all-expired/tenders',         r => totalExpiredTenders.value       = r.data.expired_tenders || 0],
  ['api/count/all-analyses',                r => totalAnalyses.value             = r.data.total_count || 0],
  ['api/count-all/schedule',                r => totalSchedules.value            = r.data.total_count || 0],
  ['api/count-all/requests',                r => totalRequests.value             = r.data.totalRequests || 0],
  ['api/count-approved/requests',           r => approvedRequests.value          = r.data.approvedRequests || 0],
  ['api/count-rejected/requests',           r => rejectedRequests.value          = r.data.rejectedRequests || 0],
]

onMounted(() => {
  Promise.all(fetchers.map(([url, setter]) => axios.get(url).then(setter).catch(() => {})))
})
</script>

<script>
// Sub-components defined inline

const SummaryChip = {
  props: ['label', 'value'],
  template: `
    <div class="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 shadow-sm text-right">
      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ label }}</p>
      <p class="text-base font-extrabold text-gray-900 dark:text-white tabular-nums">{{ value }}</p>
    </div>
  `
}

const iconPaths = {
  contract:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  inbox:     'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  projects:  'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
  schedules: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  analyses:  'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
}

const iconBg = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  amber:  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  teal:   'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  pink:   'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  cyan:   'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
}

const StatCard = {
  props: ['title', 'total', 'label', 'icon', 'color'],
  emits: ['navigate'],
  setup(props) {
    return { path: iconPaths[props.icon] || iconPaths.contract, bg: iconBg[props.color] || iconBg.indigo }
  },
  template: `
    <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900 p-5">
      <!-- Card header -->
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div :class="bg" class="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="h-4.5 w-4.5 h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ title }}</p>
            <p class="text-xs text-gray-400">{{ total }} {{ label }}</p>
          </div>
        </div>
        <button @click="$emit('navigate')"
          class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:border-gray-700 dark:hover:bg-gray-800 transition-all">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <!-- Metrics -->
      <div class="grid grid-cols-2 gap-2">
        <slot />
      </div>
    </div>
  `
}

const metricColor = {
  teal:   'text-teal-600 dark:text-teal-400',
  amber:  'text-amber-600 dark:text-amber-400',
  red:    'text-rose-600 dark:text-rose-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
}

const MetricRow = {
  props: ['label', 'value', 'color'],
  template: `
    <div class="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5">
      <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ label }}</p>
      <p :class="vc" class="text-sm font-bold tabular-nums">{{ value }}</p>
    </div>
  `,
  computed: {
    vc() { return metricColor[this.color] || 'text-gray-900 dark:text-gray-100' }
  }
}
</script>