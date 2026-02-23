<template>
  <div class="min-h-screen font-sans antialiased" :class="isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'">

    <!-- ── Navbar ─────────────────────────────────────────── -->
    <nav class="sticky top-0 z-50 border-b backdrop-blur-xl"
      :class="isLightMode ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'">
      <div class="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">

        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <svg class="h-5 w-5 text-white" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L36 13V27L20 36L4 27V13L20 4Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="leading-none">
            <p class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">HOD Portal</p>
            <p class="text-[10px] font-semibold uppercase tracking-widest" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Department Dashboard</p>
          </div>
        </div>

        <!-- Right tools -->
        <div class="flex items-center gap-2">

          <!-- Date -->
          <div class="hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold md:flex"
            :class="isLightMode ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'">
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            {{ currentDate }}
          </div>

          <!-- Greeting badge -->
          <div class="hidden items-center rounded-lg border px-3 py-1.5 text-xs font-semibold sm:flex"
            :class="isLightMode ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-indigo-950/40 border-indigo-900 text-indigo-400'">
            Good {{ timeOfDay }}
          </div>

          <!-- Theme toggle -->
          <button @click="toggleTheme"
            class="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:border-indigo-500 hover:text-indigo-500"
            :class="isLightMode ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-700 bg-slate-800 text-slate-400'">
            <svg v-if="isLightMode" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Refresh -->
          <button @click="refreshAll" :disabled="isRefreshing"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50">
            <svg class="h-3.5 w-3.5" :class="{ 'animate-spin': isRefreshing }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- ── Main ───────────────────────────────────────────── -->
    <main class="mx-auto max-w-screen-2xl space-y-6 px-6 py-6">

      <!-- ── Top Metric Cards (4) ─────────────────────────── -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <!-- Total Activities -->
        <div class="relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-indigo-500 opacity-5"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </div>
            <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">Overview</span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">
            {{ projects + projectActivities + assignedTenders }}
          </p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Total Activities</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">
            {{ projects }} projects · {{ projectActivities }} activities
          </p>
        </div>

        <!-- Pending Requests -->
        <div class="relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-amber-500 opacity-5"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">Pending</span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ requests }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Project Requests</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">Awaiting approval</p>
        </div>

        <!-- Assigned Tenders -->
        <div class="relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-500 opacity-5"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">Active</span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ assignedTenders }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Assigned Tenders</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">
            {{ submittedTenders }} submitted
          </p>
        </div>

        <!-- Attendance -->
        <div class="relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-500 opacity-5"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">Records</span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ attendances }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Attendance Records</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">
            {{ meetingMinutes }} meeting minutes
          </p>
        </div>

      </section>

      <!-- ── Content Grid ─────────────────────────────────── -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-5">

        <!-- Left (3 cols) -->
        <div class="space-y-6 xl:col-span-3">

          <!-- Tenders Pipeline -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Tenders Pipeline</h3>
              <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Complete lifecycle tracking</p>
            </div>
            <div class="space-y-4 p-6">
              <div v-for="row in pipelineRows" :key="row.label" class="flex items-center gap-4">
                <span class="w-36 shrink-0 text-xs font-semibold" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">{{ row.label }}</span>
                <div class="flex flex-1 items-center gap-3">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full" :class="isLightMode ? 'bg-slate-100' : 'bg-slate-800'">
                    <div class="h-full rounded-full transition-all duration-700" :class="row.color"
                      :style="{ width: calculatePercentage(row.value, assignedTenders || 1) + '%' }">
                    </div>
                  </div>
                  <span class="w-8 text-right text-sm font-bold" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ row.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Breakdown -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Module Breakdown</h3>
              <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">All department modules at a glance</p>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div v-for="mod in moduleStats" :key="mod.label"
                  class="rounded-xl border p-3 text-center transition hover:-translate-y-0.5"
                  :class="isLightMode ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-800/50'">
                  <div class="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-white" :class="mod.bg">
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" :d="mod.svg" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ mod.value }}</p>
                  <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">{{ mod.label }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Activity Analytics</h3>
              <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Department performance overview</p>
            </div>
            <div class="p-4">
              <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="260"/>
            </div>
          </div>

        </div>

        <!-- Right (2 cols) -->
        <div class="space-y-6 xl:col-span-2">

          <!-- Tenders Summary — featured card -->
          <div class="rounded-2xl border-2 border-indigo-500 shadow-lg shadow-indigo-500/10"
            :class="isLightMode ? 'bg-white' : 'bg-slate-900'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Tenders Summary</h3>
                  <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Assigned, submitted &amp; schedules</p>
                </div>
                <span class="rounded-lg bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Key Data</span>
              </div>
            </div>
            <div class="p-6">
              <div class="mb-4 rounded-xl bg-indigo-600 p-4 text-center text-white">
                <p class="mb-1 text-[10px] font-bold uppercase tracking-widest opacity-80">Total Assigned</p>
                <p class="text-3xl font-bold tracking-tight">{{ assignedTenders }}</p>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="rounded-lg border p-3 text-center"
                  :class="isLightMode ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-800/50'">
                  <p class="text-lg font-bold" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ submittedTenders }}</p>
                  <p class="text-[10px] font-semibold uppercase tracking-wide" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Submitted</p>
                </div>
                <div class="rounded-lg border border-l-2 border-l-emerald-500 p-3 text-center"
                  :class="isLightMode ? 'border-slate-100 bg-emerald-50' : 'border-slate-800 bg-emerald-950/30'">
                  <p class="text-lg font-bold text-emerald-600">{{ awardedTenders }}</p>
                  <p class="text-[10px] font-semibold uppercase tracking-wide" :class="isLightMode ? 'text-emerald-600' : 'text-emerald-500'">Awarded</p>
                </div>
                <div class="rounded-lg border border-l-2 border-l-amber-400 p-3 text-center"
                  :class="isLightMode ? 'border-slate-100 bg-amber-50' : 'border-slate-800 bg-amber-950/30'">
                  <p class="text-lg font-bold text-amber-600">{{ priceSchedules }}</p>
                  <p class="text-[10px] font-semibold uppercase tracking-wide" :class="isLightMode ? 'text-amber-600' : 'text-amber-500'">Schedules</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Department Info -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Department Activity</h3>
              <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Updates &amp; communications</p>
            </div>
            <div class="space-y-2 p-4">
              <div v-for="row in deptRows" :key="row.label"
                class="flex items-center gap-4 rounded-xl border p-3.5 transition hover:translate-x-1"
                :class="isLightMode ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-800/40'">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" :class="row.bg">
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path :d="row.svg"/></svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">{{ row.label }}</p>
                </div>
                <p class="text-xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ row.value }}</p>
              </div>
            </div>
          </div>

          <!-- Projects -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Projects</h3>
              <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Department project overview</p>
            </div>
            <div class="p-6">
              <div class="mb-4 rounded-xl p-4 text-center" :class="isLightMode ? 'bg-slate-50' : 'bg-slate-800/50'">
                <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ projects }}</p>
                <p class="mt-1 text-xs font-semibold uppercase tracking-wider" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Total Projects</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-3 rounded-lg border border-l-2 border-l-emerald-500 p-3"
                  :class="isLightMode ? 'border-slate-100 bg-emerald-50' : 'border-slate-800 bg-emerald-950/20'">
                  <svg class="h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-base font-bold text-emerald-600">{{ projects }}</span>
                  <span class="ml-auto text-xs font-semibold" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Active</span>
                </div>
                <div class="flex items-center gap-3 rounded-lg border border-l-2 border-l-amber-400 p-3"
                  :class="isLightMode ? 'border-slate-100 bg-amber-50' : 'border-slate-800 bg-amber-950/20'">
                  <svg class="h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-base font-bold text-amber-600">{{ projectActivities }}</span>
                  <span class="ml-auto text-xs font-semibold" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Activities</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Requests -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Requests</h3>
              <p class="mt-0.5 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Approval workflow</p>
            </div>
            <div class="p-6">
              <div class="mb-4 rounded-xl p-4 text-center" :class="isLightMode ? 'bg-slate-50' : 'bg-slate-800/50'">
                <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ requests }}</p>
                <p class="mt-1 text-xs font-semibold uppercase tracking-wider" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Total Requests</p>
              </div>
              <div class="mb-3 flex h-2 overflow-hidden rounded-full" :class="isLightMode ? 'bg-slate-100' : 'bg-slate-800'">
                <div class="h-full bg-indigo-500 transition-all duration-700"
                  :style="{ width: calculatePercentage(assignedTenders, assignedTenders + requests || 1) + '%' }"></div>
                <div class="h-full bg-amber-400 transition-all duration-700"
                  :style="{ width: calculatePercentage(requests, assignedTenders + requests || 1) + '%' }"></div>
              </div>
              <div class="flex justify-between">
                <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
                  {{ assignedTenders }} Tenders
                </div>
                <div class="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <span class="h-2 w-2 rounded-full bg-amber-400"></span>
                  {{ requests }} Requests
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from '@/axios';

// ── Theme ──────────────────────────────────────────────────
const isLightMode = ref(false);
const toggleTheme = () => {
  isLightMode.value = !isLightMode.value;
  localStorage.setItem('theme', isLightMode.value ? 'light' : 'dark');
};

// ── Static info ────────────────────────────────────────────
const isRefreshing = ref(false);
const currentDate = ref(
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
);

// ── Data refs ──────────────────────────────────────────────
const assignedTenders   = ref(0);
const submittedTenders  = ref(0);
const awardedTenders    = ref(0);
const priceSchedules    = ref(0);
const projects          = ref(0);
const projectActivities = ref(0);
const chats             = ref(0);
const attendances       = ref(0);
const meetingMinutes    = ref(0);
const requests          = ref(0);

// ── Helpers ────────────────────────────────────────────────
const calculatePercentage = (v, total) => (total ? Math.round((v / total) * 100) : 0);

const timeOfDay = computed(() => {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
});

// ── Pipeline rows ──────────────────────────────────────────
const pipelineRows = computed(() => [
  { label: 'Assigned Tenders',  value: assignedTenders.value,  color: 'bg-indigo-500' },
  { label: 'Submitted Tenders', value: submittedTenders.value, color: 'bg-cyan-500'   },
  { label: 'Awarded Tenders',   value: awardedTenders.value,   color: 'bg-emerald-500'},
  { label: 'Price Schedules',   value: priceSchedules.value,   color: 'bg-amber-500'  },
  { label: 'Dept. Updates',     value: chats.value,            color: 'bg-violet-500' },
  { label: 'Project Requests',  value: requests.value,         color: 'bg-rose-500'   },
]);

// ── Module grid stats ──────────────────────────────────────
const moduleStats = computed(() => [
  { label: 'Assigned',   value: assignedTenders.value,   bg: 'bg-indigo-500', svg: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z' },
  { label: 'Submitted',  value: submittedTenders.value,  bg: 'bg-cyan-500',   svg: 'M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z' },
  { label: 'Projects',   value: projects.value,          bg: 'bg-emerald-500',svg: 'M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z' },
  { label: 'Activities', value: projectActivities.value, bg: 'bg-amber-500',  svg: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { label: 'Updates',    value: chats.value,             bg: 'bg-violet-500', svg: 'M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z' },
  { label: 'Minutes',    value: meetingMinutes.value,    bg: 'bg-purple-500', svg: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Requests',   value: requests.value,          bg: 'bg-rose-500',   svg: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z' },
  { label: 'Attendance', value: attendances.value,       bg: 'bg-blue-500',   svg: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' },
]);

// ── Department rows ────────────────────────────────────────
const deptRows = computed(() => [
  { label: 'Dept. Updates',   value: chats.value,          bg: 'bg-violet-500', svg: 'M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z' },
  { label: 'Meeting Minutes', value: meetingMinutes.value, bg: 'bg-purple-500', svg: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Attendance',      value: attendances.value,    bg: 'bg-blue-500',   svg: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' },
]);

// ── Chart ──────────────────────────────────────────────────
const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
  colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E', '#3B82F6', '#0EA5E9'],
  plotOptions: { bar: { distributed: true, borderRadius: 6, columnWidth: '65%', dataLabels: { position: 'top' } } },
  dataLabels: {
    enabled: true,
    formatter: (v) => v,
    offsetY: -18,
    style: { fontSize: '11px', fontWeight: '700', colors: [isLightMode.value ? '#0F172A' : '#F1F5F9'] }
  },
  legend: { show: false },
  grid: { borderColor: isLightMode.value ? '#E2E8F0' : '#1E293B', strokeDashArray: 3 },
  xaxis: {
    categories: ['Assigned', 'Submitted', 'Projects', 'Activities', 'Updates', 'Requests', 'Minutes', 'Attendance'],
    labels: { style: { fontSize: '10px', fontWeight: '600', colors: isLightMode.value ? '#64748B' : '#94A3B8' } },
    axisBorder: { color: isLightMode.value ? '#E2E8F0' : '#1E293B' }
  },
  yaxis: { labels: { style: { fontSize: '10px', colors: isLightMode.value ? '#64748B' : '#94A3B8' } } },
  tooltip: { theme: isLightMode.value ? 'light' : 'dark', y: { formatter: (v) => v + ' items' } }
}));

const chartSeries = computed(() => [{
  name: 'Count',
  data: [
    assignedTenders.value,
    submittedTenders.value,
    projects.value,
    projectActivities.value,
    chats.value,
    requests.value,
    meetingMinutes.value,
    attendances.value,
  ]
}]);

// ── Fetch ──────────────────────────────────────────────────
let controller = null;

const refreshAll = async () => {
  if (isRefreshing.value) return;
  if (controller) controller.abort();
  controller = new AbortController();
  const { signal } = controller;
  isRefreshing.value = true;

  const get = (url) =>
    axios.get(url, { signal }).catch((e) => {
      if (e.name !== 'CanceledError') console.error(url, e);
      return null;
    });

  const [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10] = await Promise.all([
    get('api/count/hod-tenders'),
    get('api/count/hod-submitted-tenders'),
    get('api/count/hod-awarded-tenders'),
    get('api/count/hod-price-schedules'),
    get('/api/count/hod-projects'),
    get('api/count/proj-activity-for-hod'),
    get('api/count/total-updates'),
    get('api/count/attendances'),
    get('api/count/meeting-minutes'),
    get('api/count/hod-requests'),
  ]);

  if (r1)  assignedTenders.value   = r1.data.count ?? 0;
  if (r2)  submittedTenders.value  = r2.data.count ?? 0;
  if (r3)  awardedTenders.value    = r3.data.count ?? 0;
  if (r4)  priceSchedules.value    = r4.data.count ?? 0;
  if (r5)  projects.value          = r5.data.count_total_hod_projects ?? 0;
  if (r6)  projectActivities.value = r6.data.count ?? 0;
  if (r7)  chats.value             = r7.data.data?.updates_count ?? 0;
  if (r8)  attendances.value       = r8.data.data?.total_attendances ?? 0;
  if (r9)  meetingMinutes.value    = r9.data.total_meeting_minutes ?? 0;
  if (r10) requests.value          = r10.data.count ?? 0;

  isRefreshing.value = false;
};

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  if (localStorage.getItem('theme') === 'light') isLightMode.value = true;
  refreshAll();
});

onUnmounted(() => controller?.abort());
</script>