<template>
  <div class="min-h-screen bg-[#f5f6fa]">

    <!-- Navbar -->
    <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div>
          <p class="text-base font-bold text-gray-900 leading-tight">Admin Control</p>
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Analytics Dashboard</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ currentDate }}
          </span>
          <button @click="refreshAllData" :disabled="isRefreshing"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all">
            <svg :class="isRefreshing ? 'animate-spin' : ''" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </nav>

    <div class="mx-auto max-w-6xl px-6 py-8 space-y-6">

      <!-- Top metric chips -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricChip label="Total Tenders"  :value="totalTenders"            color="indigo" />
        <MetricChip label="Completed"      :value="totalCompletedProjects"  color="teal" />
        <MetricChip label="In Progress"    :value="totalOnProgressTenders"  color="amber" />
        <MetricChip label="Expired"        :value="totalExpiredTenders"     color="red" />
      </div>

      <!-- Main 3-col grid -->
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">

        <!-- Tenders Pipeline -->
        <Panel title="Tenders Pipeline" subtitle="Complete lifecycle tracking" class="xl:col-span-2">
          <div class="space-y-3">
            <div v-for="row in pipelineRows" :key="row.label" class="flex items-center gap-3">
              <span class="w-32 shrink-0 text-xs font-semibold text-gray-500">{{ row.label }}</span>
              <div class="flex flex-1 items-center gap-3">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div class="h-full rounded-full transition-all duration-700" :class="row.color"
                    :style="{ width: pct(row.value, totalTenders) + '%' }"></div>
                </div>
                <span class="w-7 text-right text-sm font-bold text-gray-900 tabular-nums">{{ row.value }}</span>
              </div>
            </div>
          </div>
        </Panel>

        <!-- Organization -->
        <Panel title="Organization" subtitle="Team structure">
          <div class="space-y-2">
            <div v-for="org in orgRows" :key="org.label"
              class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <span class="text-sm text-gray-600">{{ org.label }}</span>
              <span class="text-base font-bold text-gray-900 tabular-nums">{{ org.value }}</span>
            </div>
          </div>
        </Panel>

        <!-- Projects Overview -->
        <Panel title="Projects Overview" subtitle="Real-time monitoring">
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div v-for="p in projectStats" :key="p.label"
              class="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 text-center">
              <p :class="p.color" class="text-xl font-extrabold tabular-nums">{{ p.value }}</p>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">{{ p.label }}</p>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-gray-500">Completion Rate</span>
              <span class="text-xs font-bold text-gray-900">{{ projectCompletionRate }}%</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div class="h-full rounded-full bg-teal-500 transition-all duration-700" :style="{ width: projectCompletionRate + '%' }"></div>
            </div>
          </div>
        </Panel>

        <!-- Financial Overview -->
        <Panel title="Financial Overview" subtitle="Budget & analysis" class="xl:col-span-2">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div class="rounded-lg bg-gray-900 px-4 py-3 text-center">
              <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Total Budget</p>
              <p class="text-lg font-extrabold text-white">{{ formatCurrency(totalAmountRequired) }}</p>
            </div>
            <div class="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-center">
              <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Avg. Analysis</p>
              <p class="text-lg font-extrabold text-gray-900">{{ formatCurrency(averageAnalysisAmount) }}</p>
            </div>
            <div class="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-center">
              <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Approval Rate</p>
              <p class="text-lg font-extrabold text-teal-600">{{ pct(totalPassedAnalyses, totalAnalyses) }}%</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-2">
            <InfoTile label="Submitted" :value="totalAnalyses" />
            <InfoTile label="Approved"  :value="totalPassedAnalyses"   color="teal" />
            <InfoTile label="Rejected"  :value="totalRejectedAnalyses" color="red" />
          </div>
        </Panel>

      </div>

      <!-- Bottom row -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <!-- Quotations -->
        <Panel title="Quotations" subtitle="Submission status">
          <div class="mb-4 rounded-lg bg-gray-50 border border-gray-100 py-4 text-center">
            <p class="text-3xl font-extrabold text-gray-900 tabular-nums">{{ totalSchedules }}</p>
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">Total Submitted</p>
          </div>
          <div class="space-y-2">
            <StatusRow label="Approved" :value="totalPassedSchedules"   color="teal" />
            <StatusRow label="Rejected" :value="totalRejectedSchedules" color="red" />
          </div>
        </Panel>

        <!-- Requests -->
        <Panel title="Requests" subtitle="Approval workflow">
          <div class="mb-4 rounded-lg bg-gray-50 border border-gray-100 py-4 text-center">
            <p class="text-3xl font-extrabold text-gray-900 tabular-nums">{{ totalRequests }}</p>
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">Total Requests</p>
          </div>
          <div class="mb-3 flex h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div class="h-full bg-teal-500 transition-all duration-700" :style="{ width: pct(approvedRequests, totalRequests) + '%' }"></div>
            <div class="h-full bg-rose-500 transition-all duration-700" :style="{ width: pct(rejectedRequests, totalRequests) + '%' }"></div>
          </div>
          <div class="flex justify-between">
            <span class="text-xs font-semibold text-teal-600">{{ approvedRequests }} Approved</span>
            <span class="text-xs font-semibold text-rose-500">{{ rejectedRequests }} Rejected</span>
          </div>
        </Panel>

        <!-- Chart -->
        <Panel title="Performance" subtitle="System analytics">
          <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="200" />
        </Panel>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'

const isRefreshing = ref(false)
const currentDate = ref(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))

const totalTenders                = ref(0)
const totalAssignedTenders        = ref(0)
const totalTenderSubmissions      = ref(0)
const totalProjects               = ref(0)
const totalFailedProjects         = ref(0)
const totalCompletedProjects      = ref(0)
const totalOnProgressTenders      = ref(0)
const totalDeadlineReachedTenders = ref(0)
const totalExpiredTenders         = ref(0)
const totalOnProgressProjects     = ref(0)
const totalUsers                  = ref(0)
const totalRoles                  = ref(0)
const totalDepartments            = ref(0)
const totalAnalyses               = ref(0)
const totalPassedAnalyses         = ref(0)
const totalRejectedAnalyses       = ref(0)
const totalAmountRequired         = ref(0)
const totalApprovedBudget         = ref(0)
const totalPendingBudget          = ref(0)
const averageAnalysisAmount       = ref(0)
const totalSchedules              = ref(0)
const totalPassedSchedules        = ref(0)
const totalRejectedSchedules      = ref(0)
const totalRequests               = ref(0)
const approvedRequests            = ref(0)
const rejectedRequests            = ref(0)

const pct = (v, total) => total ? Math.round((v / total) * 100) : 0

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0)

const projectCompletionRate = computed(() => pct(totalCompletedProjects.value, totalProjects.value))

const pipelineRows = computed(() => [
  { label: 'Registered',    value: totalTenders.value,                color: 'bg-indigo-500' },
  { label: 'Assigned',      value: totalAssignedTenders.value,        color: 'bg-sky-500' },
  { label: 'Submitted',     value: totalTenderSubmissions.value,      color: 'bg-teal-500' },
  { label: 'In Progress',   value: totalOnProgressTenders.value,      color: 'bg-amber-500' },
  { label: 'Due Soon',      value: totalDeadlineReachedTenders.value, color: 'bg-orange-500' },
  { label: 'Expired',       value: totalExpiredTenders.value,         color: 'bg-rose-500' },
])

const projectStats = computed(() => [
  { label: 'Total',  value: totalProjects.value,          color: 'text-indigo-600' },
  { label: 'Active', value: totalOnProgressProjects.value, color: 'text-amber-600' },
  { label: 'Done',   value: totalCompletedProjects.value, color: 'text-teal-600' },
  { label: 'Failed', value: totalFailedProjects.value,    color: 'text-rose-600' },
])

const orgRows = computed(() => [
  { label: 'User Roles',  value: totalRoles.value },
  { label: 'Total Users', value: totalUsers.value },
  { label: 'Departments', value: totalDepartments.value },
])

const chartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
  colors: ['#6366f1', '#0ea5e9', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'],
  plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: '60%' } },
  dataLabels: { enabled: false },
  legend: { show: false },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 3 },
  xaxis: {
    categories: ['Tenders', 'Assigned', 'Submitted', 'Projects', 'Analyses', 'Requests'],
    labels: { style: { fontSize: '10px', fontWeight: '600', colors: '#9ca3af' } },
    axisBorder: { show: false }, axisTicks: { show: false }
  },
  yaxis: { labels: { style: { fontSize: '10px', colors: '#9ca3af' } } },
  tooltip: { style: { fontSize: '12px' }, y: { formatter: v => v + ' items' } }
})

const chartSeries = computed(() => [{
  name: 'Count',
  data: [totalTenders.value, totalAssignedTenders.value, totalTenderSubmissions.value, totalProjects.value, totalAnalyses.value, totalRequests.value]
}])

const refreshAllData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  const get = (url) => axios.get(url).catch(() => null)
  const [r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,r13,r14,r15,r16,r17,r18,r19,r20,r21,r22,r23] = await Promise.all([
    get('api/count/registered-tenders'),
    get('api/count/all-assigned/tenders'),
    get('api/count/tenders-submissions'),
    get('api/count/total-projects'),
    get('api/count/failed-projects'),
    get('api/count/completed-projects'),
    get('api/count/on-progress/tender'),
    get('api/count/all/on-progress/projects'),
    get('api/count/all/deadline-reached-tenders'),
    get('api/count/all-expired/tenders'),
    get('api/count/users'),
    get('api/count/roles'),
    get('api/count/departments'),
    get('api/count/all-analyses'),
    get('api/count/all-analyses/passed'),
    get('api/count/all-analyses/rejected'),
    get('api/count/all/total-amount-required'),
    get('api/user/price-schedules/count'),
    get('api/user/price-schedules/passed/count'),
    get('api/user/price-schedules/rejected/count'),
    get('api/count/requests'),
    get('api/count/user/requests/approved'),
    get('api/count/user/requests/rejected'),
  ])
  if (r1)  totalTenders.value                = r1.data.registered_tenders
  if (r2)  totalAssignedTenders.value        = r2.data.assignedCount
  if (r3)  totalTenderSubmissions.value      = r3.data.submitted_tenders
  if (r4)  totalProjects.value               = r4.data.count_total_projects
  if (r5)  totalFailedProjects.value         = r5.data.total_failed_projects
  if (r6)  totalCompletedProjects.value      = r6.data.total_completed_projects
  if (r7)  totalOnProgressTenders.value      = r7.data.onProgressCount
  if (r8)  totalOnProgressProjects.value     = r8.data.total_on_progress_projects
  if (r9)  totalDeadlineReachedTenders.value = r9.data.expired_tenders
  if (r10) totalExpiredTenders.value         = r10.data.expired_tenders
  if (r11) totalUsers.value                  = r11.data.total_users
  if (r12) totalRoles.value                  = r12.data.user_roles
  if (r13) totalDepartments.value            = r13.data.total_departments
  if (r14) totalAnalyses.value               = r14.data.total_count
  if (r15) totalPassedAnalyses.value         = r15.data.passed_count
  if (r16) totalRejectedAnalyses.value       = r16.data.rejected_count
  if (r17) totalAmountRequired.value         = r17.data.total_amount_required
  // Calculate average analysis amount
  if (r14 && r14.data.total_count > 0) {
    averageAnalysisAmount.value = Math.round(totalAmountRequired.value / r14.data.total_count)
  }
  if (r18) totalSchedules.value              = r18.data.total_count
  if (r19) totalPassedSchedules.value        = r19.data.passed_count
  if (r20) totalRejectedSchedules.value      = r20.data.rejected_count
  if (r21) totalRequests.value               = r21.data.totalRequests
  if (r22) approvedRequests.value            = r22.data.approvedRequests
  if (r23) rejectedRequests.value            = r23.data.rejectedRequests
  isRefreshing.value = false
}

onMounted(() => refreshAllData())
</script>

<script>
const colorMap = {
  indigo: { chip: 'bg-indigo-50 border-indigo-100', val: 'text-indigo-600', tile: 'bg-indigo-50 border-indigo-100', row: 'border-l-indigo-500 bg-indigo-50 text-indigo-600' },
  teal:   { chip: 'bg-teal-50   border-teal-100',   val: 'text-teal-600',   tile: 'bg-teal-50   border-teal-100',   row: 'border-l-teal-500   bg-teal-50   text-teal-600'   },
  amber:  { chip: 'bg-amber-50  border-amber-100',  val: 'text-amber-600',  tile: 'bg-amber-50  border-amber-100',  row: 'border-l-amber-500  bg-amber-50  text-amber-600'  },
  red:    { chip: 'bg-rose-50   border-rose-100',   val: 'text-rose-600',   tile: 'bg-rose-50   border-rose-100',   row: 'border-l-rose-500   bg-rose-50   text-rose-600'   },
  gray:   { chip: 'bg-gray-50   border-gray-100',   val: 'text-gray-700',   tile: 'bg-gray-50   border-gray-100',   row: 'border-l-gray-400   bg-gray-50   text-gray-700'   },
}

const MetricChip = {
  props: ['label', 'value', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div :class="c.chip" class="rounded-xl border px-4 py-3">
      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{{ label }}</p>
      <p :class="c.val" class="text-xl font-extrabold tabular-nums">{{ value }}</p>
    </div>
  `
}

const Panel = {
  props: ['title', 'subtitle'],
  template: `
    <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm p-5">
      <div class="mb-4 pb-4 border-b border-gray-100">
        <p class="text-sm font-bold text-gray-900">{{ title }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  `
}

const InfoTile = {
  props: ['label', 'value', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div :class="c.tile" class="rounded-lg border px-3 py-3 text-center">
      <p :class="c.val" class="text-lg font-extrabold tabular-nums">{{ value }}</p>
      <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">{{ label }}</p>
    </div>
  `
}

const StatusRow = {
  props: ['label', 'value', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div :class="c.row" class="flex items-center justify-between rounded-lg border border-l-2 px-3 py-2.5">
      <span class="text-xs font-semibold">{{ label }}</span>
      <span class="text-sm font-bold tabular-nums">{{ value }}</span>
    </div>
  `
}
</script>