<template>
  <div class="budget-page-shell min-h-screen font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="budget-topbar border-b border-[#dbe7f3] shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] flex items-center justify-center shadow-[0_16px_34px_rgba(35,96,182,0.24)]">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Budget Management</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Financial Planning & Analysis</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Fiscal Year Selector -->
            <div class="flex items-center gap-2 rounded-xl border border-[#d7e4f1] bg-white/95 px-3 py-2 shadow-[0_8px_18px_rgba(18,58,99,0.05)]">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <select v-model="fiscalYear" @change="loadBudgetData" class="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option v-for="fy in fiscalYears" :key="fy" :value="String(fy)">FY {{ fy }}</option>

          </select>
            </div>
            
            <!-- Action Buttons -->
            <button @click="showBudgetModal = true" class="px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white text-sm font-medium shadow-[0_12px_24px_rgba(35,96,182,0.18)] transition-all hover:brightness-105">
              + Allocate Budget
            </button>
            <button @click="openPaymentModal" class="px-4 py-2 rounded-xl bg-white border border-[#d7e4f1] text-[#194f92] text-sm font-medium shadow-[0_8px_18px_rgba(18,58,99,0.07)] transition-all hover:bg-[#f0f6ff] hover:border-[#b3cce8]">
              + Add Payment
            </button>
            <button @click="exportBudgetReport" class="px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#e53945_0%,#cf1d2f_100%)] text-white text-sm font-medium shadow-[0_12px_24px_rgba(207,29,47,0.22)] transition-all hover:brightness-105">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 py-6 space-y-6 budget-content">
      <!-- Budget Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="budget-stat-card bg-white dark:bg-slate-800 rounded-xl px-5 py-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg style="width:17px;height:17px" class="text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              Total Allocated
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(budgetOverview.total_allocated) }}</h3>
        </div>

        <div class="budget-stat-card bg-white dark:bg-slate-800 rounded-xl px-5 py-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg style="width:17px;height:17px" class="text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              Total Spent
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(budgetOverview.total_spent) }}</h3>
        </div>

        <div class="budget-stat-card bg-white dark:bg-slate-800 rounded-xl px-5 py-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg style="width:17px;height:17px" class="text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400  dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              Utilization
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ budgetOverview.utilization_percentage }}%</h3>
       
        </div>

        <!-- Pending Approvals Count -->
        <div class="budget-stat-card bg-white dark:bg-slate-800 rounded-xl px-5 py-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg style="width:17px;height:17px" class="text-red-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-amber-700 dark:text-amber-400  dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
              Pending Approvals
            </span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ pendingBudgets.length }}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Needs Action</p>
        </div>
      </div>

      <!-- Budget Trends (full-width row) -->
      <!-- <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Budget Trends</h2>
          <div class="flex items-center gap-2">
            <select v-model="trendPeriod" @change="updateTrendChart" class="text-sm bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1 outline-none">
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
              <option value="2years">2 Years</option>
            </select>
          </div>
        </div>
        <div class="h-64 relative">
          <canvas ref="trendChartRef" class="w-full h-full"></canvas>
        </div>
      </div> -->

      <!-- Pie Chart | Department Breakdown | Budget Analytics — side by side -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        <!-- Column 1: Pie / Allocation Chart -->
        <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Budget Allocation</h2>
            <div class="flex items-center gap-1.5">
              <button @click="refreshBudgetData" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <select v-model="chartView" class="text-xs bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1 outline-none">
                <option value="allocation">Allocation</option>
                <option value="utilization">Utilization</option>
                <option value="variance">Variance</option>
              </select>
            </div>
          </div>
          <div class="flex-1 relative min-h-[220px]">
            <canvas ref="budgetChartRef" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Column 2: Department Breakdown -->
        <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-5">Department Breakdown</h2>
          <div class="space-y-4">
            <div v-for="dept in departmentBudgets" :key="dept.id" class="space-y-1.5">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: dept.colorHex }"></div>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{{ dept.name }}</span>
                </div>
                <span class="rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap" :style="{ backgroundColor: dept.colorSoft, color: dept.colorText }">
                  {{ formatCurrency(dept.allocated) }}
                </span>
              </div>
              <div class="rounded-full h-2 overflow-hidden" :style="{ backgroundColor: dept.trackColor }">
                <div class="h-2 rounded-full transition-all duration-500"
                     :style="{ width: dept.utilization_percentage + '%', backgroundColor: dept.colorHex }"></div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium" :style="{ color: dept.colorText }">{{ dept.status }}</span>
                <span class="text-slate-400">{{ dept.utilization_percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3: Pending Budgets for Approval -->
        <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Pending Approvals</h2>
            <span class="text-xs font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full">{{ pendingBudgets.length }} pending</span>
          </div>

          <div v-if="pendingBudgets.length === 0" class="flex-1 flex flex-col items-center justify-center py-8">
            <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-slate-400">No budgets pending approval</p>
          </div>

          <div v-else class="space-y-3 overflow-y-auto flex-1 pr-0.5">
            <div v-for="budget in pendingBudgets" :key="budget.id"
                 class="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
              <div class="flex items-start justify-between gap-2 mb-2.5">
                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {{ budget.department?.name || 'Unknown Department' }}
                  </h3>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ budget.creator?.name || 'Unknown' }} &bull; {{ formatCurrency(budget.allocated_amount) }}
                  </p>
                </div>
                <span class="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Pending
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400 capitalize">{{ budget.period }} &bull; {{ budget.fiscal_year }}</span>
                <div class="flex gap-1.5">
                  <button @click="approveBudget(budget.id)"
                          class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors">
                    Approve
                  </button>
                  <button @click="openRejectModal(budget)"
                          class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors">
                    Reject
                  </button>
                </div>
              </div>
              <div v-if="budget.description" class="mt-2 text-xs text-slate-400 truncate">{{ budget.description }}</div>
            </div>
          </div>
        </div>


      </div>

      <!-- Budget Transactions & Variance Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Transactions -->
        <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            <button @click="showTransactionModal = true" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Add Transaction →
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="transaction in recentTransactions" :key="transaction.id" 
                 class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div class="flex items-center gap-3">
                <div :class="transaction.iconBg" class="w-8 h-8 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4" :class="transaction.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="transaction.icon" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ transaction.description }}</p>
                  <p class="text-xs text-slate-500">{{ transaction.category }} • {{ transaction.date }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold" :class="transaction.amountColor">
                  {{ transaction.type === 'expense' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
                </p>
                <p class="text-xs text-slate-500">{{ transaction.department }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Variance Analysis -->
        <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Variance Analysis</h2>
            <select v-model="variancePeriod" class="text-sm bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1 outline-none">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          
          <div class="space-y-4">
            <div v-for="variance in varianceAnalysis" :key="variance.department" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ variance.department }}</span>
                <span class="text-sm font-bold" :class="variance.varianceColor">
                  {{ variance.variance > 0 ? '+' : '' }}{{ formatCurrency(variance.variance) }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <p class="text-slate-500">Budgeted</p>
                  <p class="font-semibold">{{ formatCurrency(variance.budgeted) }}</p>
                </div>
                <div class="p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <p class="text-slate-500">Actual</p>
                  <p class="font-semibold">{{ formatCurrency(variance.actual) }}</p>
                </div>
              </div>
              
              <div class="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div :class="variance.barColor" class="h-2 rounded-full transition-all duration-500" 
                     :style="{width: Math.abs(variance.variance_percentage) + '%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Alerts | Budget Analytics – side by side -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      <!-- Budget Alerts & Notifications -->
      <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Budget Alerts</h2>
          <button @click="markAllAsRead" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Mark All as Read
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="alert in budgetAlerts" :key="alert.id" 
               class="flex items-center gap-4 p-4 border-l-4" :class="alert.borderColor">
            <div :class="alert.iconBg" class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" :class="alert.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="alert.icon" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ alert.title }}</p>
              <p class="text-xs text-slate-500">{{ alert.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">{{ alert.time }}</span>
              <button @click="dismissAlert(alert.id)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Analytics -->
      <div class="budget-panel bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-5">Budget Analytics</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl" :style="{ backgroundColor: '#edf4ff' }">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-lg flex items-center justify-center" :style="{ backgroundColor: chartPalette.blue }">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span class="text-xs font-semibold" :style="{ color: chartPalette.navy }">Growth</span>
              </div>
              <p class="text-xl font-bold" :style="{ color: chartPalette.navy }">
                {{ budgetAnalytics.growth_rate ? '+' + budgetAnalytics.growth_rate + '%' : '+0.0%' }}
              </p>
              <p class="text-xs mt-0.5" :style="{ color: chartPalette.blue }">vs last quarter</p>
            </div>

            <div class="p-3.5 rounded-xl" :style="{ backgroundColor: '#ebf8f6' }">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-lg flex items-center justify-center" :style="{ backgroundColor: chartPalette.teal }">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-xs font-semibold" :style="{ color: '#14695d' }">Efficiency</span>
              </div>
              <p class="text-xl font-bold" :style="{ color: '#14695d' }">
                {{ budgetAnalytics.efficiency_rate ? budgetAnalytics.efficiency_rate + '%' : '0.0%' }}
              </p>
              <p class="text-xs mt-0.5" :style="{ color: chartPalette.teal }">budget utilization</p>
            </div>
          </div>

          <div class="p-4 rounded-xl" :style="{ backgroundColor: '#fff6e8' }">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold" :style="{ color: '#9b6c12' }">Top Department</span>
              <div class="w-5 h-5 rounded-full flex items-center justify-center" :style="{ backgroundColor: chartPalette.amber }">
                <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l2.8-2.034a1 1 0 011.118 0l2.8 2.034c.784.57 1.838-.197 1.539-1.118l-1.07-3.292a1 1 0 00-.364-1.118L15.856 6.32a1 1 0 00-.588-1.81h-3.462a1 1 0 01-.95-.69l-1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-base font-bold" :style="{ color: '#7b5610' }">
              {{ budgetAnalytics.top_department?.name || 'No data' }}
            </p>
            <p class="text-xs mt-0.5" :style="{ color: '#b68016' }">
              {{ budgetAnalytics.top_department?.efficiency ? budgetAnalytics.top_department.efficiency + '%' : '0%' }} budget efficiency
            </p>
          </div>

          <div class="space-y-2 pt-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Overview</p>
            <div v-for="dept in departmentBudgets.slice(0, 4)" :key="'mini-' + dept.id"
                 class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: dept.colorHex }"></div>
                <span class="text-slate-600 dark:text-slate-300 truncate max-w-[80px]">{{ dept.name }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="font-semibold" :style="{ color: dept.colorText }">{{ dept.utilization_percentage }}%</span>
                <span class="text-slate-400">used</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div><!-- end Budget Alerts + Pending Approvals grid -->

      <!-- Add Payment Modal -->
      <Teleport to="body">
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Record Payment</h3>
              <p class="text-xs text-slate-500 mt-0.5">Mark a payment made against an approved budget</p>
            </div>
            <button @click="closePaymentModal" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="submitPayment" class="px-6 py-5 space-y-4">
            <!-- Budget selector with searchable dropdown -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Budget / Department *</label>
              <input type="hidden" v-model="paymentForm.budget_id" required />
              <div class="relative">
                <input
                  type="text"
                  :value="budgetDropdownOpen ? budgetSearch : (selectedPaymentBudget ? selectedPaymentBudget.department_name + '  —  FY' + selectedPaymentBudget.fiscal_year : '')"
                  @input="budgetSearch = $event.target.value; budgetDropdownOpen = true"
                  @focus="budgetDropdownOpen = true; budgetSearch = ''"
                  @blur="setTimeout(() => { budgetDropdownOpen = false }, 150)"
                  placeholder="Select or search a budget..."
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                <!-- Dropdown -->
                <div v-if="budgetDropdownOpen"
                     class="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                  <div v-if="approvedBudgets.length === 0" class="px-4 py-3 text-sm text-slate-400 text-center">Loading budgets...</div>
                  <div v-else-if="filteredBudgets.length === 0" class="px-4 py-3 text-sm text-slate-400 text-center">No matching budgets</div>
                  <button
                    v-for="b in filteredBudgets" :key="b.id"
                    type="button"
                    @mousedown.prevent="paymentForm.budget_id = b.id; budgetDropdownOpen = false"
                    class="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                    :class="paymentForm.budget_id === b.id ? 'bg-blue-50 dark:bg-slate-700' : ''">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <p class="text-sm font-medium text-slate-900 dark:text-white">{{ b.department_name }}</p>
                        <p class="text-xs text-slate-500">{{ b.period }} &bull; FY{{ b.fiscal_year }}</p>
                      </div>
                      <div class="text-right shrink-0">
                        <p class="text-xs font-semibold text-[#194f92]">{{ formatCurrency(b.allocated_amount) }}</p>
                        <p class="text-xs" :class="b.remaining < 0 ? 'text-red-500' : 'text-green-600'">
                          {{ b.remaining >= 0 ? 'Left: ' : 'Over: ' }}{{ formatCurrency(Math.abs(b.remaining)) }}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <!-- Hint after selection -->
              <div v-if="selectedPaymentBudget" class="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                <span>Spent: <strong class="text-slate-700">{{ formatCurrency(selectedPaymentBudget.spent_amount) }}</strong></span>
                <span>Remaining:
                  <strong :class="selectedPaymentBudget.remaining < 0 ? 'text-red-500' : 'text-green-600'">
                    {{ formatCurrency(selectedPaymentBudget.remaining) }}
                  </strong>
                </span>
              </div>
            </div>
            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Payment Amount (TZS) *</label>
              <input
                type="text" inputmode="numeric" required
                :value="paymentForm.amount ? Number(paymentForm.amount).toLocaleString() : ''"
                @input="onMoneyInput($event, paymentForm, 'amount')"
                placeholder="0"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Payment Date</label>
              <input v-model="paymentForm.paid_at" type="date"
                     class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description / Reference</label>
              <textarea v-model="paymentForm.description" rows="2"
                        placeholder="e.g. Invoice #1023, supplier name..."
                        class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"></textarea>
            </div>
            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button type="button" @click="closePaymentModal"
                      class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="submittingPayment"
                      class="px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] hover:brightness-105 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="submittingPayment">Saving...</span>
                <span v-else>Record Payment</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      </Teleport>

      <!-- Allocate Budget Modal (CEO — auto-approved) -->
      <Teleport to="body">
      <div v-if="showBudgetModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Allocate Budget</h3>
              <p class="text-xs text-slate-500 mt-0.5">Budget allocated by CEO is approved immediately</p>
            </div>
            <button @click="closeBudgetModal" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitBudget" class="px-6 py-5 space-y-4">
            <!-- Allocation Type -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Budget For *</label>
              <select v-model="budgetForm.allocation_type"
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="department">Department</option>
                <option value="project">Project</option>
                <option value="awarded_tender">Awarded Tender</option>
              </select>
            </div>

            <!-- Allocation Source -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ budgetSourceLabel }} *</label>
              <select v-model="selectedBudgetTargetId" required
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="">Select {{ budgetSourceLabel }}</option>
                <option v-for="source in budgetSourceOptions" :key="source.id" :value="String(source.id)">
                  {{ source.subtitle ? `${source.label} — ${source.subtitle}` : source.label }}
                </option>
              </select>
              <p v-if="selectedBudgetSource?.subtitle" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {{ selectedBudgetSource.subtitle }}
              </p>
              <p v-if="budgetForm.allocation_type === 'awarded_tender' && selectedBudgetSource?.award_document" class="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Certification attached and available for this awarded tender.
              </p>
            </div>

            <div v-if="budgetForm.allocation_type === 'department' && availableDepartments.length" class="rounded-xl border border-[#dce7f3] bg-[#f8fbff] px-3 py-2.5">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Active Budget Targets</p>
              <p class="mt-1 text-xs text-[#51627c]">{{ availableDepartments.length }} current targets are already present on the dashboard for this fiscal year.</p>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Budget Amount (TZS) *</label>
              <input
                type="text" inputmode="numeric" required
                :value="budgetForm.allocated_amount ? Number(budgetForm.allocated_amount).toLocaleString() : ''"
                @input="onMoneyInput($event, budgetForm, 'allocated_amount')"
                placeholder="0"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>

            <!-- Period + Fiscal Year (side by side) -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Period *</label>
                <select v-model="budgetForm.period" required
                        class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fiscal Year *</label>
                <select v-model="budgetForm.fiscal_year" required
                        class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option v-for="fy in fiscalYears" :key="fy" :value="String(fy)">FY {{ fy }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <textarea v-model="budgetForm.description" rows="3"
                        placeholder="Provide details about this budget allocation..."
                        class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"></textarea>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button type="button" @click="closeBudgetModal"
                      class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="submittingBudget"
                      class="px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] hover:brightness-105 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="submittingBudget">Allocating...</span>
                <span v-else>Allocate &amp; Approve</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      </Teleport>

      <!-- Rejection Reason Modal -->
      <Teleport to="body">
      <div v-if="showRejectModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Reject Budget</h3>
          
          <div class="mb-4">
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Budget for: <strong>{{ selectedBudget?.department?.name || 'Unknown Department' }}</strong>
            </p>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Amount: {{ formatCurrency(selectedBudget?.allocated_amount || 0) }}
            </p>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Rejection Reason *
            </label>
            <textarea v-model="rejectionReason" rows="3" required
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Please provide a reason for rejecting this budget..."></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button @click="closeRejectModal"
                    class="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg">
              Cancel
            </button>
            <button @click="confirmReject"
                    :disabled="!rejectionReason.trim()"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
              Reject Budget
            </button>
          </div>
        </div>
      </div>
      </Teleport>
</div>
    </div>
  </template>

  <script setup>
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from 'vue';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  import { Chart, registerables } from 'chart.js';
  
  // Register Chart.js components
  Chart.register(...registerables);
  
  const toast = useToast();

  // State
  const fiscalYear = ref('2026');
  const chartView = ref('allocation');
  const variancePeriod = ref('monthly');
  const showTransactionModal = ref(false);
  const showBudgetModal = ref(false);
  const submittingBudget = ref(false);
  const showPaymentModal = ref(false);
  const submittingPayment = ref(false);
  const showRejectModal = ref(false);
  const selectedBudget = ref(null);
  const rejectionReason = ref('');
  const budgetSources = ref({ departments: [], projects: [], awarded_tenders: [] });
  const approvedBudgets = ref([]);
  
  // Chart references
  const budgetChartRef = ref(null);
  const budgetChartInstance = ref(null);
  const trendChartRef = ref(null);
  const trendChartInstance = ref(null);

  // Forms
  const budgetForm = ref({
    allocation_type: 'department',
    department_id: '',
    project_id: '',
    award_id: '',
    allocated_amount: '',
    period: 'monthly',
    description: '',
    fiscal_year: String(new Date().getFullYear())
  });

  const paymentForm = ref({
    budget_id: '',
    amount: '',
    paid_at: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Computed: dynamic fiscal years (current year −2 to current year +3)
  const currentYear = new Date().getFullYear();
  const fiscalYears = computed(() => {
    const years = [];
    for (let y = currentYear + 3; y >= currentYear - 2; y--) years.push(y);
    return years;
  });

  // Currently selected budget in payment form (for remaining display)
  const selectedPaymentBudget = computed(() => {
    if (!paymentForm.value.budget_id) return null;
    return approvedBudgets.value.find(b => b.id === paymentForm.value.budget_id) ?? null;
    // remaining is already on each item from the API
  });

  // Combobox search state for budget selector
  const budgetSearch = ref('');
  const budgetDropdownOpen = ref(false);
  const filteredBudgets = computed(() => {
    const q = budgetSearch.value.toLowerCase().trim();
    if (!q) return approvedBudgets.value;
    return approvedBudgets.value.filter(b =>
      b.department_name.toLowerCase().includes(q) ||
      String(b.fiscal_year).includes(q) ||
      (b.period ?? '').toLowerCase().includes(q) ||
      (b.description ?? '').toLowerCase().includes(q)
    );
  });

  // Data
  const budgetOverview = ref({
    total_allocated: 0,
    total_spent: 0,
    total_remaining: 0,
    utilization_percentage: 0,
    remaining_color: 'text-green-600',
    utilization_color: 'text-green-600'
  });

const departmentBudgets = ref([]);

const recentTransactions = ref([]);

const varianceAnalysis = ref([]);
const budgetAlerts = ref([]);
const pendingBudgets = ref([]);
const budgetAnalytics = ref({});

const availableDepartments = computed(() => {
  return departmentBudgets.value.map(dept => ({
    id: dept.id,
    name: dept.name
  }));
});

const budgetSourceOptions = computed(() => {
  if (budgetForm.value.allocation_type === 'project') {
    return budgetSources.value.projects ?? [];
  }
  if (budgetForm.value.allocation_type === 'awarded_tender') {
    return budgetSources.value.awarded_tenders ?? [];
  }
  return budgetSources.value.departments ?? [];
});

const budgetSourceLabel = computed(() => {
  if (budgetForm.value.allocation_type === 'project') return 'Project';
  if (budgetForm.value.allocation_type === 'awarded_tender') return 'Awarded Tender';
  return 'Department';
});

const selectedBudgetTargetId = computed({
  get() {
    if (budgetForm.value.allocation_type === 'project') return budgetForm.value.project_id ? String(budgetForm.value.project_id) : '';
    if (budgetForm.value.allocation_type === 'awarded_tender') return budgetForm.value.award_id ? String(budgetForm.value.award_id) : '';
    return budgetForm.value.department_id ? String(budgetForm.value.department_id) : '';
  },
  set(value) {
    budgetForm.value.department_id = '';
    budgetForm.value.project_id = '';
    budgetForm.value.award_id = '';

    if (!value) return;

    if (budgetForm.value.allocation_type === 'project') {
      budgetForm.value.project_id = Number(value);
      return;
    }

    if (budgetForm.value.allocation_type === 'awarded_tender') {
      budgetForm.value.award_id = Number(value);
      return;
    }

    budgetForm.value.department_id = Number(value);
  }
});

const selectedBudgetSource = computed(() => {
  const selectedId = selectedBudgetTargetId.value;
  if (!selectedId) return null;
  return budgetSourceOptions.value.find(source => String(source.id) === String(selectedId)) ?? null;
});

watch(() => budgetForm.value.allocation_type, () => {
  budgetForm.value.department_id = '';
  budgetForm.value.project_id = '';
  budgetForm.value.award_id = '';
});

const trendPeriod = ref('6months');

const chartPalette = {
  navy: '#194f92',
  blue: '#2f78dd',
  sky: '#5ea3f5',
  teal: '#1f9d8b',
  amber: '#d7a12c',
  coral: '#d95f43',
  slate: '#7b8ba8',
  ink: '#51627c',
  grid: '#d9e5f1'
};

const departmentChartColors = [
  chartPalette.navy,
  chartPalette.blue,
  chartPalette.sky,
  chartPalette.teal,
  chartPalette.amber,
  chartPalette.coral,
  chartPalette.slate,
  '#3a8fb7',
  '#7298d4',
  '#b6c6de'
];

const getDepartmentPalette = (index) => {
  const colorHex = departmentChartColors[index % departmentChartColors.length];

  return {
    colorHex,
    colorSoft: `${colorHex}18`,
    colorText: colorHex,
    trackColor: `${colorHex}26`
  };
};

const decorateDepartmentBudget = (dept, index) => {
  const utilization = dept.utilization_percentage || (dept.allocated ? Math.round(((dept.spent || 0) / dept.allocated) * 100) : 0) || 0;
  const palette = getDepartmentPalette(index);

  return {
    ...dept,
    utilization_percentage: utilization,
    status: utilization > 90 ? 'Over Budget' : (utilization > 70 ? 'Warning' : 'On Track'),
    ...palette
  };
};

// Chart data preparation
const prepareBudgetChartData = () => {
  const departments = departmentBudgets.value;
  
  if (chartView.value === 'allocation') {
    return {
      type: 'doughnut',
      data: {
        labels: departments.map(dept => dept.name),
        datasets: [{
          data: departments.map(dept => dept.allocated),
          backgroundColor: departments.map((_, index) => getDepartmentPalette(index).colorHex),
          borderColor: '#f8fbff',
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: chartPalette.ink,
              font: { size: 11 },
              boxWidth: 12,
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return context.label + ': ' + formatCurrency(context.raw);
              }
            }
          }
        }
      }
    };
  } else if (chartView.value === 'utilization') {
    return {
      type: 'bar',
      data: {
        labels: departments.map(dept => dept.name),
        datasets: [{
          label: 'Budget Utilization %',
          data: departments.map(dept => dept.utilization_percentage),
          backgroundColor: departments.map(dept => 
            dept.utilization_percentage > 90 ? chartPalette.coral : 
            dept.utilization_percentage > 70 ? chartPalette.amber : chartPalette.blue
          ),
          borderColor: departments.map(dept => 
            dept.utilization_percentage > 90 ? '#b84833' : 
            dept.utilization_percentage > 70 ? '#b8891b' : chartPalette.navy
          ),
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 26,
          categoryPercentage: 0.62,
          barPercentage: 0.72
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
              color: chartPalette.ink
            },
            grid: {
              color: chartPalette.grid
            }
          },
          x: {
            ticks: {
              color: chartPalette.ink
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  } else {
    // Variance view
    return {
      type: 'line',
      data: {
        labels: departments.map(dept => dept.name),
        datasets: [{
          label: 'Budgeted',
          data: departments.map(dept => dept.allocated),
          borderColor: chartPalette.blue,
          backgroundColor: '#2f78dd1f',
          tension: 0.36,
          fill: true
        }, {
          label: 'Actual',
          data: departments.map(dept => dept.spent),
          borderColor: chartPalette.coral,
          backgroundColor: '#d95f4318',
          tension: 0.36,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value),
              color: chartPalette.ink
            },
            grid: {
              color: chartPalette.grid
            }
          },
          x: {
            ticks: {
              color: chartPalette.ink
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
                color: chartPalette.ink
            }
          }
        }
      }
    };
  }
};

const prepareTrendChartData = () => {
  // Use real trend data from API if available, otherwise use empty structure
  const trendData = budgetOverview.value.trend_data || [];
  
  if (trendData.length === 0) {
    // Return empty chart structure if no data
    return {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Allocated',
          data: [],
          borderColor: chartPalette.blue,
          backgroundColor: '#2f78dd18',
          tension: 0.4,
          fill: true
        }, {
          label: 'Spent',
          data: [],
          borderColor: chartPalette.teal,
          backgroundColor: '#1f9d8b18',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value),
              color: chartPalette.ink
            },
            grid: {
              color: chartPalette.grid
            }
          },
          x: {
            ticks: {
              color: chartPalette.ink
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
                color: chartPalette.ink
            }
          }
        }
      }
    };
  }
  
  // Process real trend data
  const labels = trendData.map(item => {
    const date = new Date(item.period);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });
  
  const allocatedData = trendData.map(item => item.allocated || 0);
  const spentData = trendData.map(item => item.spent || 0);
  
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Allocated',
        data: allocatedData,
        borderColor: chartPalette.blue,
        backgroundColor: '#2f78dd18',
        tension: 0.4,
        fill: true
      }, {
        label: 'Spent',
        data: spentData,
        borderColor: chartPalette.teal,
        backgroundColor: '#1f9d8b18',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value),
            color: chartPalette.ink
          },
          grid: {
            color: chartPalette.grid
          }
        },
        x: {
          ticks: {
            color: chartPalette.ink
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: chartPalette.ink
          }
        }
      }
    }
  };
};

const createBudgetChart = () => {
  if (budgetChartInstance.value) {
    budgetChartInstance.value.destroy();
  }
  
  const ctx = budgetChartRef.value?.getContext('2d');
  if (ctx) {
    budgetChartInstance.value = new Chart(ctx, prepareBudgetChartData());
  }
};

const createTrendChart = () => {
  if (trendChartInstance.value) {
    trendChartInstance.value.destroy();
  }
  
  const ctx = trendChartRef.value?.getContext('2d');
  if (ctx) {
    trendChartInstance.value = new Chart(ctx, prepareTrendChartData());
  }
};

const updateBudgetChart = () => {
  createBudgetChart();
};

const updateTrendChart = async () => {
  try {
    // Load trend data based on selected period
    const trendResponse = await axios.get(`/api/budget/trends?period=${trendPeriod.value}&fiscal_year=${fiscalYear.value}`);
    
    if (trendResponse.data.data) {
      budgetOverview.value.trend_data = trendResponse.data.data;
    }
    
    createTrendChart();
  } catch (error) {
    console.error('Error loading trend data:', error);
    // Create empty chart if trend data fails
    createTrendChart();
  }
};

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

const loadBudgetData = async () => {
  try {
    console.log('Starting budget data load...');
    const startTime = performance.now();
    
    // Load main budget overview
    const overviewResponse = await axios.get(`/api/budget/overview?fiscal_year=${fiscalYear.value}`);
    const endTime = performance.now();
    console.log(`Budget overview API took: ${(endTime - startTime).toFixed(2)}ms`);
    
    const data = overviewResponse.data.data || overviewResponse.data || {};
    // Handle both old and new data structures
    budgetOverview.value = {
      total_allocated: data.total_allocated || 0,
      total_spent: data.total_spent || 0,
      total_remaining: (data.total_allocated || 0) - (data.total_spent || 0),
      utilization_percentage: data.overall_utilization || data.utilization_percentage || 0,
      remaining_color: 'text-green-600',
      utilization_color: (data.overall_utilization || data.utilization_percentage || 0) > 90 ? 'text-red-600' : ((data.overall_utilization || data.utilization_percentage || 0) > 70 ? 'text-amber-600' : 'text-green-600'),
      // Add trend data from API
      trend_data: data.trend_data || []
    };
    
    // Process department budgets with proper structure
    const departments = Array.isArray(data.departments) ? data.departments : [];
    departmentBudgets.value = departments.map((dept, index) => decorateDepartmentBudget(dept, index));
    
    // Load additional analytics data
    try {
      const [analyticsResponse, transactionsResponse, varianceResponse, alertsResponse] = await Promise.all([
        axios.get(`/api/budget/analytics?fiscal_year=${fiscalYear.value}`),
        axios.get(`/api/budget/transactions?limit=10`),
        axios.get(`/api/budget/variance?period=${variancePeriod.value}`),
        axios.get(`/api/budget/alerts`)
      ]);
      
      // Update analytics data
      if (analyticsResponse.data?.data) {
        budgetAnalytics.value = analyticsResponse.data.data;
      }
      
      // Update transactions
      if (transactionsResponse.data?.data) {
        recentTransactions.value = transactionsResponse.data.data.map(transaction => ({
          ...transaction,
          iconBg: transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100',
          iconColor: transaction.type === 'expense' ? 'text-red-600' : 'text-green-600',
          amountColor: transaction.type === 'expense' ? 'text-red-600' : 'text-green-600',
          icon: transaction.type === 'expense' ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        }));
      }
      
      // Update variance analysis
      const varianceRows = varianceResponse.data?.data?.variances || varianceResponse.data?.data || [];
      if (Array.isArray(varianceRows)) {
        varianceAnalysis.value = varianceRows.map(variance => ({
          ...variance,
          varianceColor: variance.variance > 0 ? 'text-red-600' : 'text-green-600',
          barColor: variance.variance > 0 ? 'bg-red-500' : 'bg-green-500'
        }));
      }
      
      // Update alerts
      if (alertsResponse.data?.data) {
        budgetAlerts.value = alertsResponse.data.data.map(alert => ({
          ...alert,
          borderColor: alert.severity === 'high' ? 'border-red-500' : (alert.severity === 'medium' ? 'border-amber-500' : 'border-blue-500'),
          iconBg: alert.severity === 'high' ? 'bg-red-100' : (alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'),
          iconColor: alert.severity === 'high' ? 'text-red-600' : (alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600')
        }));
      }
      
    } catch (analyticsError) {
      console.warn('Failed to load additional analytics data:', analyticsError);
      // Continue without analytics data
    }
    
    // Initialize charts after data is loaded
    await nextTick();
    createBudgetChart();
    createTrendChart();
    
    const totalTime = performance.now() - startTime;
    console.log(`Total budget data load took: ${totalTime.toFixed(2)}ms`);
  } catch (error) {
    console.error('Error loading budget data:', error);
    toast.error(error.response?.data?.message || 'Failed to load budget data');
    
    // Set fallback mock data for demonstration
    const mockData = {
      total_allocated: 5000000000,
      total_spent: 3200000000,
      total_remaining: 1800000000,
      utilization_percentage: 64,
      remaining_color: 'text-green-600',
      utilization_color: 'text-amber-600',
      trend_data: []
    };
    
    budgetOverview.value = mockData;
    
    // Mock department data
    departmentBudgets.value = [
      {
        id: 1,
        name: 'Engineering',
        allocated: 1500000000,
        spent: 950000000,
        utilization_percentage: 63
      },
      {
        id: 2,
        name: 'Marketing',
        allocated: 800000000,
        spent: 720000000,
        utilization_percentage: 90
      },
      {
        id: 3,
        name: 'Operations',
        allocated: 1200000000,
        spent: 680000000,
        utilization_percentage: 57
      },
      {
        id: 4,
        name: 'HR',
        allocated: 600000000,
        spent: 420000000,
        utilization_percentage: 70
      },
      {
        id: 5,
        name: 'Finance',
        allocated: 900000000,
        spent: 430000000,
        utilization_percentage: 48
      }
    ].map((dept, index) => decorateDepartmentBudget(dept, index));
    
    // Mock analytics
    budgetAnalytics.value = {
      growth_rate: 12.5,
      efficiency_rate: 78.3,
      top_department: {
        name: 'Engineering',
        efficiency: 85.2
      }
    };
    
    // Mock transactions
    recentTransactions.value = [
      {
        id: 1,
        description: 'Office Supplies Purchase',
        category: 'Operations',
        amount: 2500000,
        type: 'expense',
        department: 'Operations',
        date: '2024-01-15',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        amountColor: 'text-red-600',
        icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        id: 2,
        description: 'Software License Renewal',
        category: 'Technology',
        amount: 5000000,
        type: 'expense',
        department: 'Engineering',
        date: '2024-01-14',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        amountColor: 'text-red-600',
        icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        id: 3,
        description: 'Client Payment Received',
        category: 'Revenue',
        amount: 15000000,
        type: 'income',
        department: 'Finance',
        date: '2024-01-13',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        amountColor: 'text-green-600',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    ];
    
    // Mock variance analysis
    varianceAnalysis.value = [
      {
        department: 'Engineering',
        budgeted: 1500000000,
        actual: 950000000,
        variance: -550000000,
        variance_percentage: 37,
        varianceColor: 'text-green-600',
        barColor: 'bg-green-500'
      },
      {
        department: 'Marketing',
        budgeted: 800000000,
        actual: 720000000,
        variance: -80000000,
        variance_percentage: 10,
        varianceColor: 'text-green-600',
        barColor: 'bg-green-500'
      }
    ];
    
    // Mock alerts
    budgetAlerts.value = [
      {
        id: 1,
        title: 'Marketing Budget Alert',
        description: 'Marketing department has utilized 90% of allocated budget',
        severity: 'high',
        time: '2 hours ago',
        borderColor: 'border-red-500',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        id: 2,
        title: 'Quarterly Report Due',
        description: 'Q4 budget variance report is due for submission',
        severity: 'medium',
        time: '1 day ago',
        borderColor: 'border-amber-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      }
    ];
    
    // Initialize charts with mock data
    await nextTick();
    createBudgetChart();
    createTrendChart();
  }
};
const loadPendingBudgets = async () => {
  try {
    console.log('Loading pending budgets for fiscal year:', fiscalYear.value);
    const response = await axios.get(`/api/budget/pending?fiscal_year=${fiscalYear.value}`);
    console.log('Pending budgets response:', response.data);
    pendingBudgets.value = Array.isArray(response.data.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
    console.log('Pending budgets loaded:', pendingBudgets.value.length);
  } catch (error) {
    console.error('Error loading pending budgets:', error);
    toast.error(error.response?.data?.message || 'Failed to load pending budgets');
    // Set mock pending budgets for demonstration
    pendingBudgets.value = [
      {
        id: 1,
        allocated_amount: 500000000,
        period: 'quarterly',
        fiscal_year: '2026',
        description: 'Q1 2026 budget allocation for product development initiatives',
        creator: { name: 'John Doe' },
        department: { name: 'Engineering' }
      },
      {
        id: 2,
        allocated_amount: 300000000,
        period: 'monthly',
        fiscal_year: '2026',
        description: 'Marketing campaign budget for Q1 2026',
        creator: { name: 'Jane Smith' },
        department: { name: 'Marketing' }
      }
    ];
  }
};
const approveBudget = async (budgetId) => {
  try {
    const response = await axios.post(`/api/budget/${budgetId}/approve`);
    
    if (response.data.status === 'success') {
      toast.success('Budget approved successfully');
      loadPendingBudgets();
      loadBudgetData();
    } else {
      toast.error(response.data.message || 'Failed to approve budget');
    }
  } catch (error) {
    console.error('Error approving budget:', error);
    toast.error('Failed to approve budget');
  }
};
const rejectBudget = async (budgetId, reason) => {
  try {
    const response = await axios.post(`/api/budget/${budgetId}/reject`, {
      rejection_reason: reason
    });
    if (response.data.status === 'success') {
      toast.success('Budget rejected successfully');
      loadPendingBudgets();
    } else {
      toast.error(response.data.message || 'Failed to reject budget');
    }
  } catch (error) {
    console.error('Error rejecting budget:', error);
    toast.error('Failed to reject budget');
  }
};

const openRejectModal = (budget) => {
  selectedBudget.value = budget;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  selectedBudget.value = null;
  rejectionReason.value = '';
};

const confirmReject = async () => {
  if (!rejectionReason.value.trim() || !selectedBudget.value) {
    return;
  }
  
  try {
    const response = await axios.post(`/api/budget/${selectedBudget.value.id}/reject`, {
      rejection_reason: rejectionReason.value
    });
    
    if (response.data.status === 'success') {
      toast.success('Budget rejected successfully');
      closeRejectModal();
      loadPendingBudgets();
    } else {
      toast.error(response.data.message || 'Failed to reject budget');
    }
  } catch (error) {
    console.error('Error rejecting budget:', error);
    toast.error('Failed to reject budget');
  }
};
const loadBudgetSources = async () => {
  try {
    const response = await axios.get('api/budget/sources');
    if (response.data.status === 'success') {
      budgetSources.value = response.data.data || { departments: [], projects: [], awarded_tenders: [] };
    }
  } catch (error) {
    console.error('Error loading budget sources:', error);
  }
};

const closeBudgetModal = () => {
  showBudgetModal.value = false;
  budgetForm.value = {
    allocation_type: 'department',
    department_id: '',
    project_id: '',
    award_id: '',
    allocated_amount: '',
    period: 'monthly',
    description: '',
    fiscal_year: fiscalYear.value
  };
};

// ── Payment modal ──────────────────────────────────────────────────────────
const loadApprovedBudgets = async () => {
  try {
    const res = await axios.get('api/budget/approved');
    if (res.data.status === 'success') {
      approvedBudgets.value = res.data.data ?? [];
    }
  } catch (err) {
    console.error('Failed to load approved budgets:', err);
  }
};

// Strip commas and store raw digits; formats display with thousand separators
const onMoneyInput = (e, form, field) => {
  const digits = e.target.value.replace(/[^0-9]/g, '');
  form[field] = digits;
  e.target.value = digits ? Number(digits).toLocaleString() : '';
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  paymentForm.value = { budget_id: '', amount: '', paid_at: new Date().toISOString().split('T')[0], description: '' };
  budgetSearch.value = '';
  budgetDropdownOpen.value = false;
};

const openPaymentModal = async () => {
  showPaymentModal.value = true;
  await loadApprovedBudgets();
};

const submitPayment = async () => {
  if (!paymentForm.value.budget_id || !paymentForm.value.amount) {
    toast.error('Please select a budget and enter an amount.');
    return;
  }
  submittingPayment.value = true;
  try {
    const res = await axios.post('api/budget/payment', paymentForm.value);
    if (res.data.status === 'success') {
      toast.success('Payment recorded successfully');
      closePaymentModal();
      await loadBudgetData();
    } else {
      toast.error(res.data.message || 'Failed to record payment');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to record payment');
  } finally {
    submittingPayment.value = false;
  }
};

const submitBudget = async () => {
  if (!selectedBudgetTargetId.value) {
    toast.error(`Please select a ${budgetSourceLabel.value.toLowerCase()}.`);
    return;
  }

  submittingBudget.value = true;
  try {
    const response = await axios.post('api/budget/create-direct', budgetForm.value);
    if (response.data.status === 'success') {
      toast.success('Budget allocated and approved successfully');
      closeBudgetModal();
      await Promise.all([loadBudgetData(), loadPendingBudgets()]);
    } else {
      toast.error(response.data.message || 'Failed to allocate budget');
    }
  } catch (error) {
    console.error('Error allocating budget:', error);
    toast.error(error.response?.data?.message || 'Failed to allocate budget');
  } finally {
    submittingBudget.value = false;
  }
};

const refreshBudgetData = () => {
  toast.info('Refreshing budget data...');
  loadBudgetData();
};

const exportBudgetReport = async () => {
  try {
    toast.info('Generating budget report...');

    const rows = departmentBudgets.value.map((department) => ({
      Department: department.name,
      Allocated: department.allocated || 0,
      Spent: department.spent || 0,
      Remaining: (department.allocated || 0) - (department.spent || 0),
      Utilization: `${department.utilization_percentage || 0}%`,
      Status: department.status || 'Unknown'
    }));

    if (!rows.length) {
      toast.warning('No budget data available to export');
      return;
    }

    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map((row) => Object.values(row).map((value) => `"${value}"`).join(','))
    ].join('\n');

    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `budget_report_${fiscalYear.value}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Budget report exported successfully');
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export budget report');
  }
};

// Watch for chart view changes
watch(chartView, () => {
  updateBudgetChart();
});

// Cleanup charts on unmount
onUnmounted(() => {
  if (budgetChartInstance.value) {
    budgetChartInstance.value.destroy();
  }
  if (trendChartInstance.value) {
    trendChartInstance.value.destroy();
  }
});

const dismissAlert = (alertId) => {
  budgetAlerts.value = budgetAlerts.value.filter(alert => alert.id !== alertId);
  toast.success('Alert dismissed');
};

const markAllAsRead = () => {
  budgetAlerts.value = [];
  toast.success('All alerts marked as read');
};
// Lifecycle
onMounted(async () => {
  console.log('CEO BudgetManagement mounted - loading data...');
  const startTime = performance.now();
  
  // Load budget data, pending budgets, and departments in parallel
  await Promise.all([
    loadBudgetData(),
    loadPendingBudgets(),
    loadBudgetSources()
  ]);
  
  const totalTime = performance.now() - startTime;
  console.log(`Total CEO dashboard load took: ${totalTime.toFixed(2)}ms`);
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.budget-page-shell {
  background:
    radial-gradient(circle at top right, rgba(48, 120, 221, 0.08), transparent 22%),
    linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);
}

.budget-topbar {
  background: linear-gradient(135deg, #eef5ff 0%, #ffffff 46%, #f7fbff 100%);
}

.budget-content {
  position: relative;
}

.budget-stat-card,
.budget-panel {
  border-color: #dce7f3;
  box-shadow: 0 16px 34px rgba(18, 58, 99, 0.08);
}

.budget-stat-card {
  position: relative;
  overflow: hidden;
}

.budget-stat-card::before {
  content: '';
  position: absolute;
  inset: auto -18% -42% auto;
  width: 140px;
  height: 140px;
  border-radius: 9999px;
  background: rgba(6, 100, 231, 0.05);
}
</style>
