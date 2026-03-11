<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 font-['DM_Sans',sans-serif]">
    <!-- Top Navigation -->
    <div class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">Budget Management</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Financial Planning & Analysis</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Fiscal Year Selector -->
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <select v-model="fiscalYear" @change="loadBudgetData" class="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option value="2029">FY 2029</option>
                <option value="2028">FY 2028</option>
                <option value="2027">FY 2027</option>
                <option value="2026">FY 2026</option>
                <option value="2025">FY 2025</option>

          </select>
            </div>
            
            <!-- Action Buttons -->
            <button @click="showBudgetModal = true" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
              + Allocate Budget
            </button>
            <button @click="exportBudgetReport" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </div>
    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- Budget Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              {{ formatCurrency(budgetOverview.total_allocated) }}
            </span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ formatCurrency(budgetOverview.total_allocated) }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Total Allocated</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              {{ formatCurrency(budgetOverview.total_spent) }}
            </span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ formatCurrency(budgetOverview.total_spent) }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span class="text-xs font-medium" :class="budgetOverview.remaining_color">
              {{ formatCurrency(budgetOverview.total_remaining) }}
            </span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ formatCurrency(budgetOverview.total_remaining) }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs font-medium" :class="budgetOverview.utilization_color">
              {{ budgetOverview.utilization_percentage }}%
            </span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ budgetOverview.utilization_percentage }}%</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Utilization</p>
        </div>
      </div>

      <!-- Budget Allocation Chart & Department Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Budget Allocation Chart -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Budget Allocation</h2>
            <div class="flex items-center gap-2">
              <button @click="refreshBudgetData" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <select v-model="chartView" class="text-sm bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1 outline-none">
                <option value="allocation">Allocation</option>
                <option value="utilization">Utilization</option>
                <option value="variance">Variance</option>
              </select>
            </div>
          </div>
          
          <!-- Budget Allocation Chart -->
          <div class="h-80 relative">
            <canvas ref="budgetChartRef" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Department Breakdown -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Department Breakdown</h2>
          
          <div class="space-y-4">
            <div v-for="dept in departmentBudgets" :key="dept.id" class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="dept.color" class="w-3 h-3 rounded-full"></div>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ dept.name }}</span>
                </div>
                <span class="text-sm text-slate-500">{{ formatCurrency(dept.allocated) }}</span>
              </div>
              
              <div class="bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div :class="dept.progressColor" class="h-2 rounded-full transition-all duration-500" 
                     :style="{width: dept.utilization_percentage + '%'}"></div>
              </div>
              
              <div class="flex items-center justify-between text-xs">
                <span :class="dept.statusColor">{{ dept.status }}</span>
                <span class="text-slate-500">{{ dept.utilization_percentage }}% utilized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Trends & Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Budget Trends Chart -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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
        </div>

        <!-- Budget Analytics -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Budget Analytics</h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Growth Rate</span>
                </div>
                <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {{ budgetAnalytics.growth_rate ? '+' + budgetAnalytics.growth_rate + '%' : '+0.0%' }}
                </p>
                <p class="text-xs text-blue-600 dark:text-blue-400">vs last quarter</p>
              </div>
              
              <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-green-700 dark:text-green-300">Efficiency</span>
                </div>
                <p class="text-2xl font-bold text-green-900 dark:text-green-100">
                  {{ budgetAnalytics.efficiency_rate ? budgetAnalytics.efficiency_rate + '%' : '0.0%' }}
                </p>
                <p class="text-xs text-green-600 dark:text-green-400">budget utilization</p>
              </div>
            </div>
            
            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-amber-700 dark:text-amber-300">Top Performing Department</span>
                <div class="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l2.8-2.034a1 1 0 011.118 0l2.8 2.034c.784.57 1.838-.197 1.539-1.118l-1.07-3.292a1 1 0 00-.364-1.118L15.856 6.32a1 1 0 00-.588-1.81h-3.462a1 1 0 01-.95-.69l-1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p class="text-lg font-bold text-amber-900 dark:text-amber-100">
                {{ budgetAnalytics.top_department?.name || 'No data' }}
              </p>
              <p class="text-sm text-amber-600 dark:text-amber-400">
                {{ budgetAnalytics.top_department?.efficiency ? budgetAnalytics.top_department.efficiency + '%' : '0%' }} budget efficiency
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Transactions & Variance Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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

      <!-- Budget Alerts & Notifications -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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

      <!-- Pending Budgets for Approval -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Pending Budgets for Approval</h2>
          <span class="text-sm text-slate-500">{{ pendingBudgets.length }} budgets pending</span>
        </div>
        
        <div v-if="pendingBudgets.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm text-slate-500">No budgets pending approval</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="budget in pendingBudgets" :key="budget.id" 
               class="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">
                  {{ budget.department?.name || 'Unknown Department' }}
                </h3>
                <p class="text-sm text-slate-500">
                  Created by {{ budget.creator?.name || 'Unknown' }} • {{ formatCurrency(budget.allocated_amount) }}
                </p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Pending
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-sm text-slate-600 dark:text-slate-400">
                <span class="capitalize">{{ budget.period }}</span> • {{ budget.fiscal_year }}
              </div>
              <div class="flex gap-2">
                <button @click="approveBudget(budget.id)" 
                        class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                  Approve
                </button>
                <button @click="openRejectModal(budget)" 
                        class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                  Reject
                </button>
              </div>
            </div>
            
            <div v-if="budget.description" class="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {{ budget.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Rejection Reason Modal -->
      <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
</div>
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
  const showRejectModal = ref(false);
  const selectedBudget = ref(null);
  const rejectionReason = ref('');
  
  // Chart references
  const budgetChartRef = ref(null);
  const budgetChartInstance = ref(null);
  const trendChartRef = ref(null);
  const trendChartInstance = ref(null);

  // Forms (CEO only views and approves budgets, doesn't create)
  const budgetForm = ref({
    department_id: '',
    amount: '',
    period: 'monthly',
    description: '',
    fiscal_year: '2026'
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

const trendPeriod = ref('6months');

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
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#64748B',
              font: { size: 12 }
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
            dept.utilization_percentage > 90 ? '#EF4444' : 
            dept.utilization_percentage > 70 ? '#F59E0B' : '#10B981'
          ),
          borderRadius: 8
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
              color: '#64748B'
            },
            grid: {
              color: '#E2E8F0'
            }
          },
          x: {
            ticks: {
              color: '#64748B'
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
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F620',
          tension: 0.4
        }, {
          label: 'Actual',
          data: departments.map(dept => dept.spent),
          borderColor: '#EF4444',
          backgroundColor: '#EF444420',
          tension: 0.4
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
              color: '#64748B'
            },
            grid: {
              color: '#E2E8F0'
            }
          },
          x: {
            ticks: {
              color: '#64748B'
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
              color: '#64748B'
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
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F620',
          tension: 0.4,
          fill: true
        }, {
          label: 'Spent',
          data: [],
          borderColor: '#10B981',
          backgroundColor: '#10B98120',
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
              color: '#64748B'
            },
            grid: {
              color: '#E2E8F0'
            }
          },
          x: {
            ticks: {
              color: '#64748B'
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
              color: '#64748B'
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
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        tension: 0.4,
        fill: true
      }, {
        label: 'Spent',
        data: spentData,
        borderColor: '#10B981',
        backgroundColor: '#10B98120',
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
            color: '#64748B'
          },
          grid: {
            color: '#E2E8F0'
          }
        },
        x: {
          ticks: {
            color: '#64748B'
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
            color: '#64748B'
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
    
    const data = overviewResponse.data.data || overviewResponse.data;
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
    const departments = data.departments || [];
    departmentBudgets.value = departments.map(dept => ({
      ...dept,
      utilization_percentage: dept.utilization_percentage || Math.round((dept.spent / dept.allocated) * 100) || 0,
      progressColor: dept.utilization_percentage > 90 ? 'bg-red-500' : (dept.utilization_percentage > 70 ? 'bg-amber-500' : 'bg-green-500'),
      statusColor: dept.utilization_percentage > 90 ? 'text-red-600' : (dept.utilization_percentage > 70 ? 'text-amber-600' : 'text-green-600'),
      status: dept.utilization_percentage > 90 ? 'Over Budget' : (dept.utilization_percentage > 70 ? 'Warning' : 'On Track')
    }));
    
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
      if (varianceResponse.data?.data) {
        varianceAnalysis.value = varianceResponse.data.data.map(variance => ({
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
    toast.error('Failed to load budget data');
    
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
        utilization_percentage: 63,
        color: 'bg-blue-500',
        progressColor: 'bg-amber-500',
        statusColor: 'text-amber-600',
        status: 'Warning'
      },
      {
        id: 2,
        name: 'Marketing',
        allocated: 800000000,
        spent: 720000000,
        utilization_percentage: 90,
        color: 'bg-green-500',
        progressColor: 'bg-red-500',
        statusColor: 'text-red-600',
        status: 'Over Budget'
      },
      {
        id: 3,
        name: 'Operations',
        allocated: 1200000000,
        spent: 680000000,
        utilization_percentage: 57,
        color: 'bg-amber-500',
        progressColor: 'bg-green-500',
        statusColor: 'text-green-600',
        status: 'On Track'
      },
      {
        id: 4,
        name: 'HR',
        allocated: 600000000,
        spent: 420000000,
        utilization_percentage: 70,
        color: 'bg-purple-500',
        progressColor: 'bg-amber-500',
        statusColor: 'text-amber-600',
        status: 'Warning'
      },
      {
        id: 5,
        name: 'Finance',
        allocated: 900000000,
        spent: 430000000,
        utilization_percentage: 48,
        color: 'bg-red-500',
        progressColor: 'bg-green-500',
        statusColor: 'text-green-600',
        status: 'On Track'
      }
    ];
    
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
    pendingBudgets.value = response.data.data || response.data || [];
    console.log('Pending budgets loaded:', pendingBudgets.value.length);
  } catch (error) {
    console.error('Error loading pending budgets:', error);
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
const refreshBudgetData = () => {
  toast.info('Refreshing budget data...');
  loadBudgetData();
};

const exportBudgetReport = async () => {
  try {
    toast.info('Generating budget report...');
    
    const response = await axios.get(`/api/budget/export?fiscal_year=${fiscalYear.value}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `budget_report_${fiscalYear.value}.xlsx`);
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
  
  // Load both budget data and pending budgets in parallel
  await Promise.all([
    loadBudgetData(),
    loadPendingBudgets()
  ]);
  
  const totalTime = performance.now() - startTime;
  console.log(`Total CEO dashboard load took: ${totalTime.toFixed(2)}ms`);
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>
