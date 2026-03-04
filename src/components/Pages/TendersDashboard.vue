<template>
  <div class="min-h-screen bg-[#f5f6fa] dark:bg-[#0d0f14] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Complete view of your tender management system</p>
        </div>
        <button @click="fetchDashboardData" :disabled="isLoading"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-all">
          <svg :class="isLoading ? 'animate-spin' : ''" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="i in 8" :key="i" class="h-20 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-pulse"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 py-16 text-center">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Failed to load dashboard</p>
        <p class="text-xs text-gray-400 mb-4">{{ error }}</p>
        <button @click="fetchDashboardData"
          class="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 transition-all">
          Retry
        </button>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">

        <!-- Quick Stat Chips -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickStat label="Total Tenders"  :value="dashboardData.tenders.registered"  color="indigo" />
          <QuickStat label="Active Projects" :value="dashboardData.projects.inProgress" color="amber" />
          <QuickStat label="Awards"          :value="dashboardData.awards.total"         color="teal" />
          <QuickStat label="Updates"         :value="dashboardData.updates.total"         color="gray" />
        </div>

        <!-- Main 3-column cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          <!-- Tenders Card -->
          <SectionCard title="Tenders" :total="dashboardData.tenders.registered" unit="Registered" color="indigo">
            <MetricRow label="Assigned"    :value="dashboardData.tenders.assigned" />
            <MetricRow label="Submitted"   :value="dashboardData.tenders.submitted"   color="teal" />
            <MetricRow label="In Progress" :value="dashboardData.tenders.inProgress"  color="amber" />
            <MetricRow label="Due Soon"    :value="dashboardData.tenders.deadlineReached" color="amber" />
            <MetricRow label="Expired"     :value="dashboardData.tenders.expired"     color="red" />
            <template #footer>
              <ProgressBar label="Submission Rate" :pct="tenderSubmissionRate" color="indigo" />
            </template>
          </SectionCard>

          <!-- Awards & Performance Card -->
          <SectionCard title="Awards & Performance" :total="dashboardData.awards.total" unit="Total" color="amber">
            <MetricRow label="Intentions"  :value="dashboardData.awards.intentions"             color="amber" />
            <MetricRow label="Letters"     :value="dashboardData.awards.letters"                color="indigo" />
            <MetricRow label="Bonds"       :value="dashboardData.performances.insuranceBonds"   color="teal" />
            <MetricRow label="Security"    :value="dashboardData.performances.securityDeclarations" />
            <MetricRow label="Updates"     :value="dashboardData.updates.total"                 color="amber" />
            <MetricRow label="Recent"      :value="dashboardData.updates.recent" />
          </SectionCard>

          <!-- Projects Card -->
          <SectionCard title="Projects" :total="dashboardData.projects.total" unit="Total" color="teal">
            <MetricRow label="In Progress" :value="dashboardData.projects.inProgress" color="amber" />
            <MetricRow label="Completed"   :value="dashboardData.projects.completed"  color="teal" />
            <MetricRow label="Failed"      :value="dashboardData.projects.failed"     color="red" />
            <template #footer>
              <ProgressBar label="Success Rate" :pct="projectSuccessRate" color="teal" />
            </template>
          </SectionCard>
        </div>

        <!-- System Summary -->
        <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900 p-5">
          <div class="pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-gray-900 dark:text-white">System Overview</p>
              <p class="text-xs text-gray-400 mt-0.5">Overall completion across all modules</p>
            </div>
            <span class="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1">{{ overallCompletion }}% complete</span>
          </div>

          <!-- Summary tiles -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <SummaryTile label="Tenders"     :value="dashboardData.tenders.registered"     color="indigo" />
            <SummaryTile label="Awards"      :value="dashboardData.awards.total"            color="amber" />
            <SummaryTile label="Performance" :value="dashboardData.performances.total"      color="teal" />
            <SummaryTile label="Updates"     :value="dashboardData.updates.total"           color="gray" />
          </div>

          <!-- Overall progress bar -->
          <div class="mb-5">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-gray-500 dark:text-gray-400">Overall Completion</span>
              <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ overallCompletion }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div class="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
                :style="{ width: overallCompletion + '%' }"></div>
            </div>
          </div>

          
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'

const isLoading = ref(true)
const error = ref(null)

const dashboardData = ref({
  tenders:      { registered: 0, assigned: 0, submitted: 0, inProgress: 0, deadlineReached: 0, expired: 0 },
  projects:     { total: 0, inProgress: 0, completed: 0, failed: 0 },
  awards:       { total: 0, intentions: 0, letters: 0 },
  performances: { total: 0, insuranceBonds: 0, securityDeclarations: 0 },
  updates:      { total: 0, recent: 0 }
})

const tenderSubmissionRate = computed(() => {
  const t = dashboardData.value.tenders.registered
  return t > 0 ? Math.round((dashboardData.value.tenders.submitted / t) * 100) : 0
})
const projectSuccessRate = computed(() => {
  const t = dashboardData.value.projects.total
  return t > 0 ? Math.round((dashboardData.value.projects.completed / t) * 100) : 0
})
const overallCompletion = computed(() => {
  const total = dashboardData.value.tenders.registered + dashboardData.value.projects.total +
    dashboardData.value.awards.total + dashboardData.value.performances.total
  if (!total) return 0
  const done = dashboardData.value.tenders.submitted + dashboardData.value.projects.completed + dashboardData.value.awards.letters
  return Math.round((done / total) * 100)
})

const fetchDashboardData = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Fetch general dashboard stats
    const { data } = await axios.get('api/dashboard/stats')
    const d = data.data || data
    
    // Fetch user-specific updates
    let userUpdates = { total: 0, recent: 0 }
    try {
      const updatesResponse = await axios.get('api/my/updates')
      const updatesData = updatesResponse.data.data || []
      userUpdates.total = updatesData.length
      // Count recent updates (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      userUpdates.recent = updatesData.filter(update => 
        new Date(update.created_at) >= sevenDaysAgo
      ).length
    } catch (updatesErr) {
      console.warn('Failed to fetch user updates:', updatesErr)
      // Keep userUpdates as zero if API fails
    }
    
    dashboardData.value = {
      tenders:      { registered: +d.tenders?.registered||0, assigned: +d.tenders?.assigned||0, submitted: +d.tenders?.submitted||0, inProgress: +d.tenders?.inProgress||0, deadlineReached: +d.tenders?.deadlineReached||0, expired: +d.tenders?.expired||0 },
      projects:     { total: +d.projects?.total||0, inProgress: +d.projects?.inProgress||0, completed: +d.projects?.completed||0, failed: +d.projects?.failed||0 },
      awards:       { total: +d.awards?.total||0, intentions: +d.awards?.intentions||0, letters: +d.awards?.letters||0 },
      performances: { total: (+d.performances?.insuranceBonds||0)+(+d.performances?.securityDeclarations||0), insuranceBonds: +d.performances?.insuranceBonds||0, securityDeclarations: +d.performances?.securityDeclarations||0 },
      updates:      userUpdates
    }
  } catch (err) {
    error.value = 'Failed to load dashboard data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDashboardData())
</script>

<script>
const colorMap = {
  indigo: { tile: 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800/20', val: 'text-indigo-600 dark:text-indigo-400', bar: 'from-indigo-500 to-indigo-400', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', btn: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300' },
  amber:  { tile: 'bg-amber-50  border-amber-100  dark:bg-amber-900/10  dark:border-amber-800/20',  val: 'text-amber-600  dark:text-amber-400',  bar: 'from-amber-500  to-amber-400',  badge: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300',  btn: 'bg-amber-50  text-amber-700  hover:bg-amber-100  dark:bg-amber-900/20  dark:text-amber-300'  },
  teal:   { tile: 'bg-teal-50   border-teal-100   dark:bg-teal-900/10   dark:border-teal-800/20',   val: 'text-teal-600   dark:text-teal-400',   bar: 'from-teal-500   to-teal-400',   badge: 'bg-teal-100   text-teal-700   dark:bg-teal-900/30   dark:text-teal-300',   btn: 'bg-teal-50   text-teal-700   hover:bg-teal-100   dark:bg-teal-900/20   dark:text-teal-300'   },
  red:    { tile: 'bg-rose-50   border-rose-100   dark:bg-rose-900/10   dark:border-rose-800/20',   val: 'text-rose-600   dark:text-rose-400',   bar: 'from-rose-500   to-rose-400',   badge: 'bg-rose-100   text-rose-700   dark:bg-rose-900/30   dark:text-rose-300',   btn: 'bg-rose-50   text-rose-700   hover:bg-rose-100   dark:bg-rose-900/20   dark:text-rose-300'   },
  gray:   { tile: 'bg-gray-50   border-gray-100   dark:bg-gray-800/40   dark:border-gray-700/50',   val: 'text-gray-700   dark:text-gray-200',   bar: 'from-gray-500   to-gray-400',   badge: 'bg-gray-100   text-gray-600   dark:bg-gray-800     dark:text-gray-300',   btn: 'bg-gray-100  text-gray-700   hover:bg-gray-200   dark:bg-gray-800     dark:text-gray-300'  },
}

const QuickStat = {
  props: ['label', 'value', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div :class="c.tile" class="rounded-xl border px-4 py-3">
      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{{ label }}</p>
      <p :class="c.val" class="text-xl font-extrabold tabular-nums">{{ value }}</p>
    </div>
  `
}

const SectionCard = {
  props: ['title', 'total', 'unit', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-900 p-5 flex flex-col">
      <!-- Card header -->
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ title }}</p>
        <span :class="c.badge" class="rounded-full px-2.5 py-0.5 text-xs font-semibold">{{ total }} {{ unit }}</span>
      </div>
      <!-- Metrics -->
      <div class="grid grid-cols-2 gap-2 flex-1">
        <slot />
      </div>
      <!-- Optional footer -->
      <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <slot name="footer" />
      </div>
    </div>
  `
}

const MetricRow = {
  props: ['label', 'value', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div :class="c.tile" class="rounded-lg border px-3 py-2.5">
      <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ label }}</p>
      <p :class="c.val" class="text-sm font-bold tabular-nums">{{ value }}</p>
    </div>
  `
}

const ProgressBar = {
  props: ['label', 'pct', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ label }}</span>
        <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ pct }}%</span>
      </div>
      <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div :class="'bg-gradient-to-r ' + c.bar" class="h-1.5 rounded-full transition-all duration-700" :style="{ width: pct + '%' }"></div>
      </div>
    </div>
  `
}

const SummaryTile = {
  props: ['label', 'value', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray } },
  template: `
    <div :class="c.tile" class="rounded-lg border px-3 py-3 text-center">
      <p :class="c.val" class="text-2xl font-extrabold tabular-nums">{{ value }}</p>
      <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">{{ label }}</p>
    </div>
  `
}

const iconPaths = {
  plus:   'M12 4v16m8-8H4',
  upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  trophy: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  chart:  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
}

const ActionBtn = {
  props: ['label', 'icon', 'color'],
  setup(p) { return { c: colorMap[p.color] || colorMap.gray, path: iconPaths[p.icon] } },
  template: `
    <button :class="c.btn" class="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all">
      <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path" />
      </svg>
      {{ label }}
    </button>
  `
}
</script>