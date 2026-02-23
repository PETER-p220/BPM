<template>
  <div class="min-h-screen font-sans antialiased" :class="isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'">

    <!-- ── Navbar ─────────────────────────────────────────── -->
    <nav class="sticky top-0 z-50 border-b backdrop-blur-xl"
      :class="isLightMode ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'">
      <div class="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">

        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <svg class="h-5 w-5 text-white" viewBox="0 0 40 40" fill="none">
              <path d="M8 12L20 4L32 12V28L20 36L8 28V12Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="leading-none">
            <p class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Admin Control</p>
            <p class="text-[10px] font-semibold uppercase tracking-widest" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Analytics Dashboard</p>
          </div>
        </div>

        <!-- Right tools -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <div class="relative hidden sm:block">
            <svg class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input
              type="text"
              placeholder="Search…"
              class="h-8 w-52 rounded-lg border pl-8 pr-3 text-xs font-medium outline-none transition focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              :class="isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700 placeholder:text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500'"
            />
          </div>

          <!-- Date -->
          <div class="hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold md:flex"
            :class="isLightMode ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'">
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            {{ currentDate }}
          </div>

          <!-- Notifications -->
          <button class="relative flex h-8 w-8 items-center justify-center rounded-lg border transition hover:border-blue-500 hover:text-blue-500"
            :class="isLightMode ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-700 bg-slate-800 text-slate-400'">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span class="absolute right-1.5 top-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
          </button>

          <!-- Theme toggle -->
          <button @click="toggleTheme"
            class="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:border-blue-500 hover:text-blue-500"
            :class="isLightMode ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-700 bg-slate-800 text-slate-400'">
            <svg v-if="isLightMode" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Refresh -->
          <button @click="refreshAllData" :disabled="isRefreshing"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50">
            <svg class="h-3.5 w-3.5" :class="{ 'animate-spin': isRefreshing }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- ── Main ───────────────────────────────────────────── -->
    <main class="mx-auto max-w-screen-2xl space-y-6 px-6 py-6">

      <!-- ── Metric Cards ─────────────────────────────────── -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <!-- Total Tenders -->
        <div class="metric-card group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200 hover:shadow-slate-200' : 'bg-slate-900 border-slate-800 hover:shadow-slate-900'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-5 bg-blue-500"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
            </div>
            <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2L10 6H7V10H5V6H2L6 2Z"/></svg>
              12%
            </span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalTenders }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Total Tenders</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">
            {{ totalAssignedTenders }} assigned · {{ totalTenderSubmissions }} submitted
          </p>
        </div>

        <!-- Completed -->
        <div class="metric-card group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200 hover:shadow-slate-200' : 'bg-slate-900 border-slate-800 hover:shadow-slate-900'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-5 bg-emerald-500"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            </div>
            <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2L10 6H7V10H5V6H2L6 2Z"/></svg>
              8%
            </span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalCompletedProjects }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Completed</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">{{ projectCompletionRate }}% completion rate</p>
        </div>

        <!-- In Progress -->
        <div class="metric-card group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200 hover:shadow-slate-200' : 'bg-slate-900 border-slate-800 hover:shadow-slate-900'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-5 bg-amber-500"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            </div>
            <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="5" width="8" height="2" rx="1"/></svg>
              0%
            </span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalOnProgressTenders }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">In Progress</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">{{ totalOnProgressProjects }} active projects</p>
        </div>

        <!-- Expired -->
        <div class="metric-card group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          :class="isLightMode ? 'bg-white border-slate-200 hover:shadow-slate-200' : 'bg-slate-900 border-slate-800 hover:shadow-slate-900'">
          <div class="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-5 bg-red-500"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            </div>
            <span class="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L2 6H5V2H7V6H10L6 10Z"/></svg>
              5%
            </span>
          </div>
          <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalExpiredTenders }}</p>
          <p class="mt-1 text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">Expired</p>
          <p class="mt-3 text-xs font-medium" :class="isLightMode ? 'text-slate-400' : 'text-slate-600'">{{ totalDeadlineReachedTenders }} near deadline</p>
        </div>

      </section>

      <!-- ── Content Grid ─────────────────────────────────── -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-5">

        <!-- Left (3 cols) -->
        <div class="space-y-6 xl:col-span-3">

          <!-- Tenders Pipeline -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="flex items-center justify-between border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <div>
                <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Tenders Pipeline</h3>
                <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Complete lifecycle tracking</p>
              </div>
            </div>
            <div class="space-y-4 p-6">
              <div v-for="row in pipelineRows" :key="row.label" class="flex items-center gap-4">
                <span class="w-32 shrink-0 text-xs font-semibold" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">{{ row.label }}</span>
                <div class="flex flex-1 items-center gap-3">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full" :class="isLightMode ? 'bg-slate-100' : 'bg-slate-800'">
                    <div class="h-full rounded-full transition-all duration-700" :class="row.color" :style="{ width: calculatePercentage(row.value, totalTenders) + '%' }"></div>
                  </div>
                  <span class="w-8 text-right text-sm font-bold" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ row.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Overview -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="flex items-center justify-between border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <div>
                <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Projects Overview</h3>
                <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Real-time monitoring</p>
              </div>
            </div>
            <div class="p-6">
              <div class="mb-6 grid grid-cols-4 gap-3">
                <div v-for="p in projectStats" :key="p.label"
                  class="rounded-xl border p-3 text-center transition hover:-translate-y-0.5"
                  :class="isLightMode ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-800/50'">
                  <div class="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white" :class="p.bg">
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" :d="p.svg" clip-rule="evenodd"/></svg>
                  </div>
                  <p class="text-xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ p.value }}</p>
                  <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">{{ p.label }}</p>
                </div>
              </div>
              <!-- Completion bar -->
              <div class="rounded-xl border p-4" :class="isLightMode ? 'border-blue-100 bg-blue-50' : 'border-blue-900/50 bg-blue-950/30'">
                <div class="mb-2.5 flex items-center justify-between">
                  <span class="text-xs font-semibold" :class="isLightMode ? 'text-slate-600' : 'text-slate-300'">Completion Rate</span>
                  <span class="text-lg font-bold text-blue-600">{{ projectCompletionRate }}%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full" :class="isLightMode ? 'bg-blue-100' : 'bg-blue-900/40'">
                  <div class="h-full rounded-full bg-blue-600 transition-all duration-700" :style="{ width: projectCompletionRate + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="flex items-center justify-between border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <div>
                <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Performance Analytics</h3>
                <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Comprehensive overview</p>
              </div>
            </div>
            <div class="p-4">
              <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="260"/>
            </div>
          </div>

        </div>

        <!-- Right (2 cols) -->
        <div class="space-y-6 xl:col-span-2">

          <!-- Financial -->
          <div class="rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-500/10" :class="isLightMode ? 'bg-white' : 'bg-slate-900'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Financial Overview</h3>
                  <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Budget &amp; analysis</p>
                </div>
                <span class="rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Priority</span>
              </div>
            </div>
            <div class="p-6">
              <div class="mb-4 rounded-xl bg-blue-600 p-4 text-center text-white">
                <p class="mb-1 text-[10px] font-bold uppercase tracking-widest opacity-80">Total Budget</p>
                <p class="text-2xl font-bold tracking-tight">{{ formatCurrency(totalAmountRequired) }}</p>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="rounded-lg border p-3 text-center" :class="isLightMode ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-800/50'">
                  <p class="text-lg font-bold" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalAnalyses }}</p>
                  <p class="text-[10px] font-semibold uppercase tracking-wide" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Submitted</p>
                </div>
                <div class="rounded-lg border border-l-2 border-l-emerald-500 p-3 text-center" :class="isLightMode ? 'border-slate-100 bg-emerald-50' : 'border-slate-800 bg-emerald-950/30'">
                  <p class="text-lg font-bold text-emerald-600">{{ totalPassedAnalyses }}</p>
                  <p class="text-[10px] font-semibold uppercase tracking-wide" :class="isLightMode ? 'text-emerald-600' : 'text-emerald-500'">Approved</p>
                </div>
                <div class="rounded-lg border border-l-2 border-l-red-500 p-3 text-center" :class="isLightMode ? 'border-slate-100 bg-red-50' : 'border-slate-800 bg-red-950/30'">
                  <p class="text-lg font-bold text-red-500">{{ totalRejectedAnalyses }}</p>
                  <p class="text-[10px] font-semibold uppercase tracking-wide" :class="isLightMode ? 'text-red-500' : 'text-red-400'">Rejected</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Organization -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Organization</h3>
              <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Team structure</p>
            </div>
            <div class="space-y-2 p-4">
              <div v-for="org in orgRows" :key="org.label"
                class="flex items-center gap-4 rounded-xl border p-3.5 transition hover:translate-x-1"
                :class="isLightMode ? 'border-slate-100 bg-slate-50' : 'border-slate-800 bg-slate-800/40'">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white">
                  <svg class="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor"><path :d="org.svg"/></svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium" :class="isLightMode ? 'text-slate-500' : 'text-slate-400'">{{ org.label }}</p>
                </div>
                <p class="text-xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ org.value }}</p>
              </div>
            </div>
          </div>

          <!-- Quotations -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Quotations</h3>
              <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Submission status</p>
            </div>
            <div class="p-6">
              <div class="mb-4 rounded-xl p-4 text-center" :class="isLightMode ? 'bg-slate-50' : 'bg-slate-800/50'">
                <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalSchedules }}</p>
                <p class="mt-1 text-xs font-semibold uppercase tracking-wider" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Total Submitted</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-3 rounded-lg border border-l-2 border-l-emerald-500 p-3"
                  :class="isLightMode ? 'border-slate-100 bg-emerald-50' : 'border-slate-800 bg-emerald-950/20'">
                  <svg class="h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  <span class="text-base font-bold text-emerald-600">{{ totalPassedSchedules }}</span>
                  <span class="ml-auto text-xs font-semibold" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Approved</span>
                </div>
                <div class="flex items-center gap-3 rounded-lg border border-l-2 border-l-red-500 p-3"
                  :class="isLightMode ? 'border-slate-100 bg-red-50' : 'border-slate-800 bg-red-950/20'">
                  <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                  <span class="text-base font-bold text-red-500">{{ totalRejectedSchedules }}</span>
                  <span class="ml-auto text-xs font-semibold" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Rejected</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Requests -->
          <div class="rounded-2xl border" :class="isLightMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
            <div class="border-b px-6 py-4" :class="isLightMode ? 'border-slate-100' : 'border-slate-800'">
              <h3 class="text-sm font-700 tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">Requests</h3>
              <p class="text-xs font-medium mt-0.5" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Approval workflow</p>
            </div>
            <div class="p-6">
              <div class="mb-4 rounded-xl p-4 text-center" :class="isLightMode ? 'bg-slate-50' : 'bg-slate-800/50'">
                <p class="text-3xl font-bold tracking-tight" :class="isLightMode ? 'text-slate-900' : 'text-white'">{{ totalRequests }}</p>
                <p class="mt-1 text-xs font-semibold uppercase tracking-wider" :class="isLightMode ? 'text-slate-400' : 'text-slate-500'">Total Requests</p>
              </div>
              <!-- Segmented bar -->
              <div class="mb-3 flex h-2 overflow-hidden rounded-full" :class="isLightMode ? 'bg-slate-100' : 'bg-slate-800'">
                <div class="h-full bg-emerald-500 transition-all duration-700" :style="{ width: calculatePercentage(approvedRequests, totalRequests) + '%' }"></div>
                <div class="h-full bg-red-500 transition-all duration-700" :style="{ width: calculatePercentage(rejectedRequests, totalRequests) + '%' }"></div>
              </div>
              <div class="flex justify-between">
                <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {{ approvedRequests }} Approved
                </div>
                <div class="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                  <span class="h-2 w-2 rounded-full bg-red-500"></span>
                  {{ rejectedRequests }} Rejected
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
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';

const isLightMode = ref(false);
const isRefreshing = ref(false);
const currentDate = ref(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

const toggleTheme = () => {
  isLightMode.value = !isLightMode.value;
  localStorage.setItem('theme', isLightMode.value ? 'light' : 'dark');
};

const formatCurrency = (v) => v
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
  : 'TZS 0';

const calculatePercentage = (v, total) => total ? Math.round((v / total) * 100) : 0;

// ── Data refs ──────────────────────────────────────────────
const totalTenders               = ref(0);
const totalAssignedTenders       = ref(0);
const totalTenderSubmissions     = ref(0);
const totalProjects              = ref(0);
const totalFailedProjects        = ref(0);
const totalCompletedProjects     = ref(0);
const totalOnProgressTenders     = ref(0);
const totalDeadlineReachedTenders = ref(0);
const totalExpiredTenders        = ref(0);
const totalOnProgressProjects    = ref(0);
const totalUsers                 = ref(0);
const totalRoles                 = ref(0);
const totalDepartments           = ref(0);
const totalAnalyses              = ref(0);
const totalPassedAnalyses        = ref(0);
const totalRejectedAnalyses      = ref(0);
const totalAmountRequired        = ref(0);
const totalSchedules             = ref(0);
const totalPassedSchedules       = ref(0);
const totalRejectedSchedules     = ref(0);
const totalRequests              = ref(0);
const approvedRequests           = ref(0);
const rejectedRequests           = ref(0);

// ── Computed ───────────────────────────────────────────────
const projectCompletionRate = computed(() =>
  totalProjects.value ? Math.round((totalCompletedProjects.value / totalProjects.value) * 100) : 0
);

const pipelineRows = computed(() => [
  { label: 'Registered',       value: totalTenders.value,               color: 'bg-blue-500' },
  { label: 'Assigned',         value: totalAssignedTenders.value,       color: 'bg-sky-500' },
  { label: 'Submitted',        value: totalTenderSubmissions.value,     color: 'bg-emerald-500' },
  { label: 'In Progress',      value: totalOnProgressTenders.value,     color: 'bg-amber-500' },
  { label: 'Deadline Reached', value: totalDeadlineReachedTenders.value,color: 'bg-orange-500' },
  { label: 'Expired',          value: totalExpiredTenders.value,        color: 'bg-red-500' },
]);

const projectStats = computed(() => [
  { label: 'Total',    value: totalProjects.value,          bg: 'bg-indigo-500', svg: 'M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' },
  { label: 'Active',   value: totalOnProgressProjects.value, bg: 'bg-amber-500',  svg: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' },
  { label: 'Done',     value: totalCompletedProjects.value, bg: 'bg-emerald-500', svg: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' },
  { label: 'Failed',   value: totalFailedProjects.value,   bg: 'bg-red-500',     svg: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' },
]);

const orgRows = computed(() => [
  { label: 'User Roles',   value: totalRoles.value,       svg: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' },
  { label: 'Total Users',  value: totalUsers.value,       svg: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' },
  { label: 'Departments',  value: totalDepartments.value, svg: 'M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z' },
]);

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
  colors: ['#2563EB', '#0EA5E9', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4'],
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
    categories: ['Registered', 'Assigned', 'Submitted', 'Projects', 'Analyses', 'Requests', 'Completed'],
    labels: { style: { fontSize: '10px', fontWeight: '600', colors: isLightMode.value ? '#64748B' : '#94A3B8' } },
    axisBorder: { color: isLightMode.value ? '#E2E8F0' : '#1E293B' }
  },
  yaxis: { labels: { style: { fontSize: '10px', colors: isLightMode.value ? '#64748B' : '#94A3B8' } } },
  tooltip: { theme: isLightMode.value ? 'light' : 'dark', y: { formatter: (v) => v + ' items' } }
}));

const chartSeries = computed(() => [{
  name: 'Count',
  data: [totalTenders.value, totalAssignedTenders.value, totalTenderSubmissions.value, totalProjects.value, totalAnalyses.value, totalRequests.value, totalCompletedProjects.value]
}]);

// ── Fetch ──────────────────────────────────────────────────
let controller = null;

const refreshAllData = async () => {
  if (isRefreshing.value) return;
  if (controller) controller.abort();
  controller = new AbortController();
  const { signal } = controller;
  isRefreshing.value = true;

  const get = (url) => axios.get(url, { signal }).catch((e) => { if (e.name !== 'CanceledError') console.error(url, e); return null; });

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
    get('api/count-all/schedule'),
    get('api/count-passed/schedule'),
    get('api/count-rejected/schedule'),
    get('api/count-all/requests'),
    get('api/count-approved/requests'),
    get('api/count-rejected/requests'),
  ]);

  if (r1)  totalTenders.value                = r1.data.registered_tenders;
  if (r2)  totalAssignedTenders.value        = r2.data.assignedCount;
  if (r3)  totalTenderSubmissions.value      = r3.data.submitted_tenders;
  if (r4)  totalProjects.value               = r4.data.count_total_projects;
  if (r5)  totalFailedProjects.value         = r5.data.total_failed_projects;
  if (r6)  totalCompletedProjects.value      = r6.data.total_completed_projects;
  if (r7)  totalOnProgressTenders.value      = r7.data.onProgressCount;
  if (r8)  totalOnProgressProjects.value     = r8.data.total_on_progress_projects;
  if (r9)  totalDeadlineReachedTenders.value = r9.data.expired_tenders;
  if (r10) totalExpiredTenders.value         = r10.data.expired_tenders;
  if (r11) totalUsers.value                  = r11.data.total_users;
  if (r12) totalRoles.value                  = r12.data.user_roles;
  if (r13) totalDepartments.value            = r13.data.total_departments;
  if (r14) totalAnalyses.value               = r14.data.total_count;
  if (r15) totalPassedAnalyses.value         = r15.data.passed_count;
  if (r16) totalRejectedAnalyses.value       = r16.data.rejected_count;
  if (r17) totalAmountRequired.value         = r17.data.total_amount_required;
  if (r18) totalSchedules.value              = r18.data.total_count;
  if (r19) totalPassedSchedules.value        = r19.data.passed_count;
  if (r20) totalRejectedSchedules.value      = r20.data.rejected_count;
  if (r21) totalRequests.value               = r21.data.totalRequests;
  if (r22) approvedRequests.value            = r22.data.approvedRequests;
  if (r23) rejectedRequests.value            = r23.data.rejectedRequests;

  isRefreshing.value = false;
};

onMounted(() => {
  if (localStorage.getItem('theme') === 'light') isLightMode.value = true;
  refreshAllData();
});
</script>