<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Executive Dashboard</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">CEO Control Center</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
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
      <!-- Key Performance Indicators -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Tenders -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              {{ stats.totalTenders > 0 ? '+' : '' }}{{ getTenderGrowth() }}% this month
            </span>
          </div>
          <h3 v-if="loading" class="text-2xl font-bold text-slate-900 dark:text-white mb-1 animate-pulse">
            <div class="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </h3>
          <h3 v-else class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stats.totalTenders || 0 }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Total Tenders</p>
        </div>

        <!-- Active Projects -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              {{ stats.activeProjects > 0 ? '+' : '' }}{{ getProjectGrowth() }}% this month
            </span>
          </div>
          <h3 v-if="loading" class="text-2xl font-bold text-slate-900 dark:text-white mb-1 animate-pulse">
            <div class="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </h3>
          <h3 v-else class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stats.activeProjects || 0 }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Active Projects</p>
        </div>

        <!-- Pending Approvals -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
              {{ stats.pendingApprovals || 0 }} pending
            </span>
          </div>
          <h3 v-if="loading" class="text-2xl font-bold text-slate-900 dark:text-white mb-1 animate-pulse">
            <div class="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </h3>
          <h3 v-else class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stats.pendingApprovals || 0 }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Pending Approvals</p>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              {{ getRevenueGrowth() }}% this quarter
            </span>
          </div>
          <h3 v-if="loading" class="text-2xl font-bold text-slate-900 dark:text-white mb-1 animate-pulse">
            <div class="h-8 w-24 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </h3>
          <h3 v-else class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ formatCurrency(stats.totalRevenue) }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
        </div>
      </div>

      <!-- Budget Reduction Tracker -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Budget Reduction Summary -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Budget Reduction Tracker
            <span v-if="budgetReductions.projects_count > 0" class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
              {{ budgetReductions.projects_count }} projects
            </span>
          </h2>
          
          <div v-if="budgetLoading" class="space-y-4">
            <div class="animate-pulse">
              <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
              <div class="h-8 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/40">
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-300">Total Budget Reduced</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatCurrency(budgetReductions.total_reduced_budget) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ budgetReductions.overall_reduction_percentage.toFixed(1) }}%</p>
                <p class="text-xs text-red-600 dark:text-red-400 font-medium">Overall Reduction</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/40">
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-300">Current Budget</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(budgetReductions.total_current_budget) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ ((100 - budgetReductions.overall_reduction_percentage)).toFixed(1) }}%</p>
                <p class="text-xs text-green-600 dark:text-green-400 font-medium">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Budget Reductions -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Budget Reductions
          </h2>
          
          <div v-if="budgetLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                <div class="flex-1">
                  <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="budgetReductions.recent_reductions.length === 0" class="text-center py-8">
            <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">No budget reductions yet</p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Budget reductions will appear when analyses are approved</p>
          </div>
          
          <div v-else class="space-y-3">
            <div v-for="reduction in budgetReductions.recent_reductions" :key="reduction.project_id" class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
              <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ reduction.project_name }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-slate-500 dark:text-slate-400">{{ reduction.analyses_count }} analyses</span>
                  <span class="text-xs text-red-600 dark:text-red-400 font-medium">
                    -{{ formatCurrency(reduction.reduction_amount) }} ({{ reduction.reduction_percentage.toFixed(1) }}%)
                  </span>
                  <span class="text-xs text-slate-400 dark:text-slate-500">• {{ getTimeAgo(reduction.last_updated) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div class="space-y-3">
            <router-link to="/ceo/tenders" class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
              <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">Manage Tenders</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">View and approve tenders</p>
              </div>
            </router-link>

            <router-link to="/ceo/quotations" class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
              <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">Review Quotations</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Price schedule approvals</p>
              </div>
            </router-link>

            <router-link to="/ceo/reports" class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
              <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">View Reports</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Analytics & insights</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Pending Approvals -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Approvals
            <span v-if="pendingItems.length > 0" class="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
              {{ pendingItems.length }}
            </span>
          </h2>
          
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                <div class="flex-1">
                  <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="pendingItems.length === 0" class="text-center py-8">
            <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">No pending approvals</p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">All systems running smoothly</p>
          </div>
          
          <div v-else class="space-y-3">
            <div v-for="item in pendingItems" :key="item.id" class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
              <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ item.title }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-slate-500 dark:text-slate-400">{{ item.type }}</span>
                  <span v-if="item.priority" :class="`px-1.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`">
                    {{ item.priority }}
                  </span>
                  <span class="text-xs text-slate-400 dark:text-slate-500">• {{ item.time }}</span>
                </div>
              </div>
              <button @click="handleApproval(item)" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors">
                Review
              </button>
            </div>
          </div>
        </div>

        <!-- System Health -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            System Health
            <span v-if="systemHealth?.overall" :class="`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(systemHealth.overall)}`">
              {{ systemHealth.overall }}
            </span>
          </h2>
          
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="flex items-center justify-between">
                <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-20"></div>
                <div class="h-6 bg-slate-200 dark:bg-slate-600 rounded w-16"></div>
              </div>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-300">API Status</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500">{{ systemHealth.components?.api?.response_time || 'Unknown' }}</span>
                <span :class="`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(systemHealth.components?.api?.status)}`">
                  {{ systemHealth.components?.api?.status || 'Unknown' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-300">Database</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500">{{ systemHealth.components?.database?.response_time || systemHealth.components?.database?.connection || 'Unknown' }}</span>
                <span :class="`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(systemHealth.components?.database?.status)}`">
                  {{ systemHealth.components?.database?.status || 'Unknown' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-300">Storage</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500">{{ systemHealth.components?.storage?.usage_percentage || 0 }}% Used</span>
                <span :class="`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(systemHealth.components?.storage?.status)}`">
                  {{ systemHealth.components?.storage?.status || 'Unknown' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-300">Last Backup</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500">{{ systemHealth.components?.backup?.time_ago || 'Unknown' }}</span>
                <span :class="`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(systemHealth.components?.backup?.status)}`">
                  {{ systemHealth.components?.backup?.status || 'Unknown' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Timeline -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activity
        </h2>
        <div class="space-y-4">
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex gap-4 animate-pulse">
              <div class="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex-shrink-0"></div>
              <div class="flex-1">
                <div class="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-2"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          <div v-else-if="recentActivities.length === 0" class="text-center py-8">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Activity will appear here</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div :class="activity.iconBg" class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" :class="activity.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.icon" />
                  </svg>
                </div>
                <div v-if="activity.showLine" class="w-0.5 h-16 bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <div class="flex-1 pb-8">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ activity.title }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ activity.description }}</p>
                  </div>
                  <span class="text-xs text-slate-400 dark:text-slate-500">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { optimizedRequest, requestWithRetry } from '@/utils/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const user = ref(null);
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

// Auto-refresh intervals
let refreshInterval = null;
let healthCheckInterval = null;

onMounted(async () => {
  // Initial data load
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

  // Set up auto-refresh (every 5 minutes for main data)
  refreshInterval = setInterval(() => {
    Promise.all([
      fetchDashboardData(),
      fetchPendingApprovals(),
      fetchRecentActivities(),
      fetchTrends(),
      fetchBudgetReductions()
    ]);
  }, 5 * 60 * 1000);

  // Set up health check (every 2 minutes)
  healthCheckInterval = setInterval(() => {
    fetchSystemHealth();
  }, 2 * 60 * 1000);
});

onUnmounted(() => {
  // Clean up intervals
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
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
      activeProjects: projects.filter(p => p.status === 'active').length,
      pendingApprovals: quotations.filter(q => q.status === 'pending').length,
      totalRevenue: projects.reduce((s, p) => s + (p.value || 0), 0),
      totalAwards: 0,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      failedProjects: projects.filter(p => p.status === 'failed').length,
      totalBudget: projects.reduce((s, p) => s + (p.value || 0), 0)
    };
  } catch (error) {
    console.error('Fallback dashboard fetch failed:', error);
    toast.error('Failed to load dashboard statistics');
    
    // Set fallback values to prevent undefined errors
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
    // Fetch pending tenders and projects that need CEO approval
    const [deadlineTenders, failedProjects] = await Promise.all([
      optimizedRequest('/api/count/deadline-reached/tenders'),
      optimizedRequest('/api/count/failed-projects')
    ]);

    const deadlineCount = deadlineTenders.data?.count || 0;
    const failedCount = failedProjects.data?.total_failed_projects || 0;

    const pendingTenders = Array(deadlineCount).fill(0).map((_, i) => ({
      id: `tender-${i}`,
      title: `Tender #${i + 1} - Deadline Reached`,
      type: 'Tender',
      time: getTimeAgo('deadline'),
      priority: 'high'
    }));

    const pendingProjects = Array(failedCount).fill(0).map((_, i) => ({
      id: `project-${i}`,
      title: `Project #${i + 1} - Failed Status`,
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
    const data = response?.data || {
      total_original_budget: 0,
      total_reduced_budget: 0,
      total_current_budget: 0,
      overall_reduction_percentage: 0,
      projects_count: 0,
      recent_reductions: [],
      budget_reduction_trend: []
    };
    
    budgetReductions.value = data;
  } catch (error) {
    console.error('Error fetching budget reductions:', error);
    toast.error('Failed to load budget reductions');
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
    // Fetch recent activities from various sources
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
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
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
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
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
    // Set fallback values
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
    trends.value = {
      tender_growth: 0,
      project_growth: 0,
      revenue_growth: 0
    };
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

function handleApproval(item) {
  // Navigate to appropriate approval page
  if (item.type === 'Tender') {
    window.location.href = '/ceo/tenders';
  } else if (item.type === 'Project') {
    window.location.href = '/ceo/reports';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    case 'medium': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
    default: return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'operational':
    case 'healthy':
    case 'completed':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    case 'warning':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
    case 'error':
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    case 'loading':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    case 'degraded':
    case 'unknown':
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'operational':
    case 'healthy':
    case 'completed':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
    case 'error':
    case 'critical':
      return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'loading':
      return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
}

function getTenderGrowth() {
  return trends.value.tender_growth;
}

function getProjectGrowth() {
  return trends.value.project_growth;
}

function getRevenueGrowth() {
  return trends.value.revenue_growth;
}

function getTimeAgo(type) {
  const now = new Date();
  let timeAgo;
  
  switch(type) {
    case 'awarded':
      timeAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000)); // 2 hours ago
      break;
    case 'completed':
      timeAgo = new Date(now.getTime() - (5 * 60 * 60 * 1000)); // 5 hours ago
      break;
    case 'deadline':
      timeAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000)); // 1 hour ago
      break;
    case 'failed':
      timeAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000)); // 3 hours ago
      break;
    default:
      timeAgo = new Date(now.getTime() - (30 * 60 * 1000)); // 30 minutes ago
  }
  
  const diff = now - timeAgo;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
}
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* Custom animations */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
</style>
