<template>
  <div class="min-h-screen bg-[#f5f6fa]">

    <!-- Header -->
    <div class="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Dashboard Overview</h1>
          <p class="mt-0.5 text-sm text-gray-400">Your analytics at a glance</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-right">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Items</p>
            <p class="text-base font-extrabold text-gray-900 tabular-nums">{{ totalItems }}</p>
          </div>
          <div class="rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-right">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Completion</p>
            <p class="text-base font-extrabold text-white tabular-nums">{{ completionRate }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 py-8 space-y-6">

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <!-- Tenders -->
        <StatCard
          title="Tenders"
          :total="totalAssignedTenders"
          unit="Total"
          :loading="isLoading.tenders"
          :error="errorMessage.tenders"
          accent="indigo"
          @retry="fetchTenderCounts"
          @navigate="navigate('tenders')"
        >
          <MetricTile label="Submitted"   :value="totalTenderSubmissions"      color="indigo" />
          <MetricTile label="In Progress" :value="totalOnProgressTenders"      color="amber" />
          <MetricTile label="Due Soon"    :value="totalDeadlineReachedTenders" color="amber" />
          <MetricTile label="Expired"     :value="totalExpiredTenders"         color="red" />
        </StatCard>

        <!-- Quotations -->
        <StatCard
          title="Quotations"
          :total="totalPriceSchedules"
          unit="Total"
          :loading="isLoading.priceSchedules"
          :error="errorMessage.priceSchedules"
          accent="cyan"
          @retry="fetchPriceScheduleCounts"
          @navigate="navigate('quotations')"
        >
          <MetricTile label="Submitted" :value="totalPriceSchedules"         color="indigo" />
          <MetricTile label="Approved"  :value="totalPassedPriceSchedules"   color="teal" />
          <MetricTile label="Rejected"  :value="totalRejectedPriceSchedules" color="red" />
          <MetricTile label="Rate"      :value="quotationApprovalRate + '%'" color="indigo" />
        </StatCard>

        <!-- Analyses -->
        <StatCard
          title="Analyses"
          :total="totalProjectAnalyses"
          unit="Total"
          :loading="isLoading.analyses"
          :error="errorMessage.analyses"
          accent="teal"
          @retry="fetchAnalysisCounts"
          @navigate="navigate('analyses')"
        >
          <MetricTile label="Submitted" :value="totalProjectAnalyses"  color="indigo" />
          <MetricTile label="Approved"  :value="totalPassedAnalyses"   color="teal" />
          <MetricTile label="Rejected"  :value="totalRejectedAnalyses" color="red" />
          <MetricTile label="Rate"      :value="analysisApprovalRate + '%'" color="indigo" />
        </StatCard>

        <!-- Projects -->
        <StatCard
          title="Projects"
          :total="totalUserProjects"
          unit="Total"
          :loading="isLoading.projects"
          :error="errorMessage.projects"
          accent="amber"
          @retry="fetchProjectCounts"
          @navigate="navigate('projects')"
        >
          <MetricTile label="Assigned"   :value="totalUserProjects"       color="indigo" />
          <MetricTile label="Active"     :value="totalOnProgressProjects" color="amber" />
          <MetricTile label="Completed"  :value="totalCompletedProjects"  color="teal" />
          <MetricTile label="Failed"     :value="totalFailedProjects"     color="red" />
        </StatCard>

      </div>

      <!-- Charts (only when data loaded) -->
      <div v-if="hasAnyData" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <!-- Work Distribution donut -->
        <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm p-5">
          <div class="pb-3 mb-3 border-b border-gray-100">
            <p class="text-sm font-bold text-gray-900">Work Distribution</p>
            <p class="text-xs text-gray-400 mt-0.5">By category</p>
          </div>
          <apexchart type="donut" :options="donutOptions" :series="donutSeries" height="240" />
        </div>

        <!-- Status stacked bar -->
        <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm p-5">
          <div class="pb-3 mb-3 border-b border-gray-100">
            <p class="text-sm font-bold text-gray-900">Status Overview</p>
            <p class="text-xs text-gray-400 mt-0.5">Current state</p>
          </div>
          <apexchart type="bar" :options="stackedOptions" :series="stackedSeries" height="240" />
        </div>

        <!-- Approval rate horizontal bar -->
        <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm p-5">
          <div class="pb-3 mb-3 border-b border-gray-100">
            <p class="text-sm font-bold text-gray-900">Approval Rates</p>
            <p class="text-xs text-gray-400 mt-0.5">Success metrics</p>
          </div>
          <apexchart type="bar" :options="approvalOptions" :series="approvalSeries" height="240" />
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'

// ── State ──────────────────────────────────────────────────
const totalAssignedTenders        = ref(0)
const totalTenderSubmissions      = ref(0)
const totalOnProgressTenders      = ref(0)
const totalDeadlineReachedTenders = ref(0)
const totalExpiredTenders         = ref(0)

const totalProjectAnalyses        = ref(0)
const totalPassedAnalyses         = ref(0)
const totalRejectedAnalyses       = ref(0)

const totalPriceSchedules         = ref(0)
const totalPassedPriceSchedules   = ref(0)
const totalRejectedPriceSchedules = ref(0)

const totalUserProjects           = ref(0)
const totalCompletedProjects      = ref(0)
const totalOnProgressProjects     = ref(0)
const totalFailedProjects         = ref(0)

const isLoading    = ref({ tenders: true, priceSchedules: true, analyses: true, projects: true })
const errorMessage = ref({ tenders: '',   priceSchedules: '',   analyses: '',   projects: ''   })

// ── Computed ───────────────────────────────────────────────
const totalItems = computed(() =>
  totalAssignedTenders.value + totalPriceSchedules.value +
  totalProjectAnalyses.value + totalUserProjects.value
)

const completionRate = computed(() => {
  const done  = totalTenderSubmissions.value + totalPassedPriceSchedules.value +
                totalPassedAnalyses.value    + totalCompletedProjects.value
  const total = totalItems.value
  return total > 0 ? Math.round((done / total) * 100) : 0
})

const quotationApprovalRate = computed(() => {
  const t = totalPriceSchedules.value
  return t > 0 ? Math.round((totalPassedPriceSchedules.value / t) * 100) : 0
})

const analysisApprovalRate = computed(() => {
  const t = totalProjectAnalyses.value
  return t > 0 ? Math.round((totalPassedAnalyses.value / t) * 100) : 0
})

const hasAnyData = computed(() =>
  totalAssignedTenders.value > 0 || totalPriceSchedules.value > 0 ||
  totalProjectAnalyses.value > 0 || totalUserProjects.value > 0
)

// ── Chart configs ─────────────────────────────────────────
const GRID = { borderColor: '#f3f4f6', strokeDashArray: 3 }
const LABEL = { fontSize: '10px', fontWeight: '600', colors: '#9ca3af' }
const COLORS = ['#6366f1', '#0891b2', '#10b981', '#d97706']

const donutSeries = computed(() => [
  totalAssignedTenders.value, totalPriceSchedules.value,
  totalProjectAnalyses.value, totalUserProjects.value,
])

const donutOptions = {
  chart: { type: 'donut', toolbar: { show: false }, fontFamily: 'inherit', animations: { speed: 400 } },
  labels: ['Tenders', 'Quotations', 'Analyses', 'Projects'],
  colors: COLORS,
  legend: { position: 'bottom', fontSize: '11px' },
  dataLabels: { enabled: true, formatter: v => Math.round(v) + '%', style: { fontSize: '11px' } },
  plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', fontWeight: '600', color: '#374151' } } } } },
  stroke: { width: 2, colors: ['#fff'] },
  tooltip: { y: { formatter: v => v + ' items' } },
}

const stackedSeries = computed(() => [
  { name: 'Completed',   data: [totalTenderSubmissions.value, totalPassedPriceSchedules.value, totalPassedAnalyses.value, totalCompletedProjects.value] },
  { name: 'In Progress', data: [totalOnProgressTenders.value, 0, 0, totalOnProgressProjects.value] },
  { name: 'Issues',      data: [totalDeadlineReachedTenders.value + totalExpiredTenders.value, totalRejectedPriceSchedules.value, totalRejectedAnalyses.value, totalFailedProjects.value] },
])

const stackedOptions = {
  chart: { type: 'bar', toolbar: { show: false }, stacked: true, fontFamily: 'inherit', animations: { speed: 400 } },
  colors: ['#10b981', '#6366f1', '#ef4444'],
  plotOptions: { bar: { borderRadius: 3, columnWidth: '52%' } },
  xaxis: { categories: ['Tenders', 'Quotations', 'Analyses', 'Projects'], labels: { style: LABEL } },
  yaxis: { labels: { style: LABEL } },
  legend: { position: 'top', fontSize: '11px', horizontalAlign: 'right' },
  dataLabels: { enabled: false },
  grid: GRID,
  tooltip: { y: { formatter: v => v + ' items' } },
}

const approvalSeries = computed(() => {
  const qt = totalPriceSchedules.value || 1
  const at = totalProjectAnalyses.value || 1
  return [
    { name: 'Approved', data: [Math.round((totalPassedPriceSchedules.value / qt) * 100), Math.round((totalPassedAnalyses.value / at) * 100)] },
    { name: 'Rejected', data: [Math.round((totalRejectedPriceSchedules.value / qt) * 100), Math.round((totalRejectedAnalyses.value / at) * 100)] },
  ]
})

const approvalOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', animations: { speed: 400 } },
  colors: ['#10b981', '#ef4444'],
  plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '48%', dataLabels: { position: 'top' } } },
  dataLabels: { enabled: true, formatter: v => v + '%', offsetX: 22, style: { fontSize: '11px', fontWeight: '600', colors: ['#374151'] } },
  xaxis: { categories: ['Quotations', 'Analyses'], labels: { formatter: v => v + '%', style: LABEL }, max: 100 },
  yaxis: { labels: { style: LABEL } },
  legend: { position: 'top', fontSize: '11px', horizontalAlign: 'right' },
  grid: GRID,
  tooltip: { y: { formatter: v => v + '%' } },
}

// ── Fetch (each section loads independently, no blocking) ──
const fetchTenderCounts = async () => {
  isLoading.value.tenders = true
  errorMessage.value.tenders = ''
  try {
    const [a, b, c, d, e] = await Promise.all([
      axios.get('/api/count/assigned-tenders'),
      axios.get('/api/count/submitted/tender'),
      axios.get('/api/count/on-progress/tender'),
      axios.get('/api/count/deadline-reached/tenders'),
      axios.get('/api/count/expire-tenders'),
    ])
    totalAssignedTenders.value        = a.data.assignedCount || 0
    totalTenderSubmissions.value      = b.data.submittedCount || 0
    totalOnProgressTenders.value      = c.data.onProgressCount || 0
    totalDeadlineReachedTenders.value = d.data.expired_tenders || 0
    totalExpiredTenders.value         = e.data.expired_tenders || 0
  } catch {
    errorMessage.value.tenders = 'Failed to load'
  } finally {
    isLoading.value.tenders = false
  }
}

const fetchPriceScheduleCounts = async () => {
  isLoading.value.priceSchedules = true
  errorMessage.value.priceSchedules = ''
  try {
    const [a, b, c] = await Promise.all([
      axios.get('/api/user/price-schedules/count'),
      axios.get('/api/user/price-schedules/passed/count'),
      axios.get('/api/user/price-schedules/rejected/count'),
    ])
    totalPriceSchedules.value         = a.data.total_count || 0
    totalPassedPriceSchedules.value   = b.data.passed_count || 0
    totalRejectedPriceSchedules.value = c.data.rejected_count || 0
  } catch {
    errorMessage.value.priceSchedules = 'Failed to load'
  } finally {
    isLoading.value.priceSchedules = false
  }
}

const fetchAnalysisCounts = async () => {
  isLoading.value.analyses = true
  errorMessage.value.analyses = ''
  try {
    const [a, b, c] = await Promise.all([
      axios.get('/api/logged/user-analyses/count'),
      axios.get('/api/user-analyses/approved/count'),
      axios.get('/api/user-analyses/rejected/count'),
    ])
    totalProjectAnalyses.value  = a.data.total_count || 0
    totalPassedAnalyses.value   = b.data.approved_count || 0
    totalRejectedAnalyses.value = c.data.rejected_count || 0
  } catch {
    errorMessage.value.analyses = 'Failed to load'
  } finally {
    isLoading.value.analyses = false
  }
}

const fetchProjectCounts = async () => {
  isLoading.value.projects = true
  errorMessage.value.projects = ''
  try {
    const [a, b, c, d] = await Promise.all([
      axios.get('/api/count/user/all-projects'),
      axios.get('/api/count/user/completed-project'),
      axios.get('/api/count/user/on-progress-projects'),
      axios.get('/api/count/users/failed-projects'),
    ])
    totalUserProjects.value       = a.data.total_projects || 0
    totalCompletedProjects.value  = b.data.total_completed_projects || 0
    totalOnProgressProjects.value = c.data.total_on_progress_projects || 0
    totalFailedProjects.value     = d.data.total_failed_projects || 0
  } catch {
    errorMessage.value.projects = 'Failed to load'
  } finally {
    isLoading.value.projects = false
  }
}

const navigate = (section) => console.log('Navigate to:', section)

// Fire all 4 fetches at the same time — no blocking
onMounted(() => {
  fetchTenderCounts()
  fetchPriceScheduleCounts()
  fetchAnalysisCounts()
  fetchProjectCounts()
})
</script>

<script>
// ── Sub-components ─────────────────────────────────────────
const accentMap = {
  indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600',
  cyan:   'bg-cyan-50   border-cyan-100   text-cyan-600',
  teal:   'bg-teal-50   border-teal-100   text-teal-600',
  amber:  'bg-amber-50  border-amber-100  text-amber-600',
  red:    'bg-rose-50   border-rose-100   text-rose-600',
  gray:   'bg-gray-50   border-gray-100   text-gray-600',
}

const topBar = {
  indigo: 'bg-indigo-500',
  cyan:   'bg-cyan-500',
  teal:   'bg-teal-500',
  amber:  'bg-amber-500',
  red:    'bg-rose-500',
}

const colorMap = {
  indigo: 'text-indigo-600',
  teal:   'text-teal-600',
  amber:  'text-amber-600',
  red:    'text-rose-600',
  gray:   'text-gray-700',
}

// StatCard wraps each section with loading/error/retry handling
const StatCard = {
  props: ['title', 'total', 'unit', 'loading', 'error', 'accent'],
  emits: ['retry', 'navigate'],
  setup(p) {
    return { bar: topBar[p.accent] || topBar.indigo, iconBg: accentMap[p.accent] || accentMap.indigo }
  },
  template: `
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
      <!-- top accent bar -->
      <div :class="bar" class="h-0.5 w-full"></div>

      <!-- Header -->
      <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-gray-900">{{ title }}</p>
          <p class="text-xs text-gray-400 tabular-nums">{{ total }} {{ unit }}</p>
        </div>
        <button @click="$emit('navigate')"
          class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all flex-shrink-0">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-5 py-4 min-h-[140px]">
        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-2 gap-2">
          <div v-for="i in 4" :key="i" class="h-14 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex flex-col items-center justify-center h-24 gap-2 text-center">
          <p class="text-xs font-medium text-rose-600">{{ error }}</p>
          <button @click="$emit('retry')"
            class="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-all">
            Retry
          </button>
        </div>

        <!-- Data -->
        <div v-else class="grid grid-cols-2 gap-2">
          <slot />
        </div>
      </div>
    </div>
  `
}

const MetricTile = {
  props: ['label', 'value', 'color'],
  setup(p) { return { vc: colorMap[p.color] || colorMap.gray } },
  template: `
    <div class="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
      <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ label }}</p>
      <p :class="vc" class="text-lg font-extrabold tabular-nums leading-none">{{ value }}</p>
    </div>
  `
}
</script>