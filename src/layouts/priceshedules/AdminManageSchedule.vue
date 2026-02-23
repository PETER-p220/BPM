<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] font-['DM_Sans',sans-serif]">
    <!-- Top Bar -->
    <div class="bg-white dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Quotations</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">Review & approve price schedules</p>
          </div>
        </div>

        <!-- Stats chips -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-semibold text-yellow-700 dark:text-yellow-400">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            {{ pendingCount }} Pending
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full text-xs font-semibold text-green-700 dark:text-green-400">
            {{ approvedCount }} Approved
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-full text-xs font-semibold text-red-700 dark:text-red-400">
            {{ rejectedCount }} Rejected
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 max-w-lg">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by tender title..."
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm shadow-sm"
          />
          <span v-if="filter" @click="filter = ''" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
        </div>

        <!-- Status filter tabs -->
        <div class="flex items-center gap-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="statusFilter = tab.value"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              statusFilter === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tender Cards -->
      <div class="space-y-5">
        <div
          v-for="(tender, idx) in paginatedTenders"
          :key="tender.tender_id"
          class="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden group hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-200"
          :style="`animation-delay: ${idx * 60}ms`"
        >
          <!-- Card Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white truncate">
                      {{ tender.tender?.title || 'Untitled Tender' }}
                    </h3>
                    <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {{ tender.user?.name || '—' }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {{ formatDate(tender.created_at) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status & Action -->
              <div class="flex items-center gap-3 flex-shrink-0">
                <span :class="statusClasses(tender.status)" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full tracking-wide">
                  <span :class="statusDot(tender.status)" class="w-1.5 h-1.5 rounded-full"></span>
                  {{ tender.status?.toUpperCase() || 'UNKNOWN' }}
                </span>

                <button
                  v-if="tender.status === 'pending'"
                  @click="openApprovalDialog(tender.tender_id)"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Review
                </button>
              </div>
            </div>

            <!-- Rejection reason banner -->
            <div v-if="tender.status === 'rejected' && tender.reason_for_reject" class="mt-3 flex items-start gap-2 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span><strong>Rejection reason:</strong> {{ tender.reason_for_reject }}</span>
            </div>

            <!-- Financial Grid -->
            <div class="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div v-for="stat in getFinancialStats(tender)" :key="stat.label" class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ stat.label }}</p>
                <p class="mt-1 text-sm font-bold truncate" :class="stat.color || 'text-slate-900 dark:text-slate-100'">{{ stat.value }}</p>
              </div>
            </div>
          </div>

          <!-- Schedule Items Table -->
          <div class="px-6 py-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Schedule Items
                <span class="ml-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-full">{{ tender.items?.length || 0 }}</span>
              </h4>

              <!-- Collapse toggle -->
              <button
                @click="toggleItems(tender.tender_id)"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
              >
                {{ collapsedItems[tender.tender_id] ? 'Show items' : 'Hide items' }}
                <svg class="w-3.5 h-3.5 transition-transform" :class="collapsedItems[tender.tender_id] ? '' : 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            <div v-if="!collapsedItems[tender.tender_id]" class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table class="min-w-full text-xs">
                <thead>
                  <tr class="bg-slate-50 dark:bg-slate-800/70">
                    <th class="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">S/N</th>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-64">Description</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Q.Qty</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit</th>
                    <th class="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Q.Rate</th>
                    <th class="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap bg-indigo-50/50 dark:bg-indigo-900/10">Q.Amount</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Qty</th>
                    <th class="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rate</th>
                    <th class="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100/80 dark:bg-slate-700/30">Amount</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgent</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr
                    v-for="item in tender.items"
                    :key="item.price_schedule_id"
                    class="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors"
                  >
                    <td class="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">{{ item.serial_number || '—' }}</td>
                    <td class="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium max-w-64 truncate" :title="item.item_description">{{ item.item_description || '—' }}</td>
                    <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{{ item.quoted_quantity ?? '—' }}</td>
                    <td class="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                      <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">{{ item.quoted_unit || '—' }}</span>
                    </td>
                    <td class="px-4 py-3 text-right text-slate-600 dark:text-slate-300 font-mono">{{ formatCurrency(item.quoted_rate) }}</td>
                    <td class="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100 bg-indigo-50/30 dark:bg-indigo-900/5 font-mono">{{ formatCurrency(item.quoted_amount) }}</td>
                    <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{{ item.quantity ?? '—' }}</td>
                    <td class="px-4 py-3 text-right text-slate-600 dark:text-slate-300 font-mono">{{ formatCurrency(item.rate) }}</td>
                    <td class="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100 bg-slate-50/80 dark:bg-slate-800/30 font-mono">{{ formatCurrency(item.amount) }}</td>
                    <td class="px-4 py-3 text-center text-slate-500 dark:text-slate-400">{{ item.source || '—' }}</td>
                    <td class="px-4 py-3 text-center">
                      <span
                        v-if="item.urgent_status"
                        :class="item.urgent_status?.toLowerCase() === 'yes' || item.urgent_status?.toLowerCase() === 'urgent'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'"
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      >{{ item.urgent_status }}</span>
                      <span v-else class="text-slate-400">—</span>
                    </td>
                  </tr>
                  <tr v-if="!tender.items?.length">
                    <td colspan="11" class="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-xs">No schedule items found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!paginatedTenders.length"
          class="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">No quotations found</h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
          <button @click="filter = ''; statusFilter = 'all'" class="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Clear filters</button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Showing <span class="font-semibold text-slate-700 dark:text-slate-300">{{ paginatedTenders.length }}</span> of <span class="font-semibold text-slate-700 dark:text-slate-300">{{ filteredTenders.length }}</span> quotations
        </p>

        <div class="flex items-center gap-1">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div class="flex items-center gap-1">
            <span
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold cursor-pointer transition',
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >{{ page }}</span>
          </div>

          <button
            :disabled="currentPage * itemsPerPage >= filteredTenders.length"
            @click="changePage(currentPage + 1)"
            class="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Approval Dialog -->
    <Transition name="dialog">
      <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeDialog">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" @click="closeDialog"></div>
        <div class="relative bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
          <!-- Dialog header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Review Quotation</h3>
            </div>
            <button @click="closeDialog" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <!-- Decision toggle -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Decision</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="approvalStatus = 'approved'"
                  :class="[
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all',
                    approvalStatus === 'approved'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-green-300 dark:hover:border-green-700'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  Approve
                </button>
                <button
                  @click="approvalStatus = 'rejected'"
                  :class="[
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all',
                    approvalStatus === 'rejected'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-300 dark:hover:border-red-700'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject
                </button>
              </div>
            </div>

            <!-- Rejection reason -->
            <Transition name="fade">
              <div v-if="approvalStatus === 'rejected'">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Reason for Rejection <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="rejectionReason"
                  rows="4"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Provide a detailed reason for rejection..."
                ></textarea>
                <p class="mt-1 text-xs text-slate-400">{{ rejectionReason.trim().length }} characters</p>
              </div>
            </Transition>

            <!-- Confirm summary -->
            <div :class="approvalStatus === 'approved' ? 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300'" class="px-4 py-3 rounded-xl border text-xs font-medium">
              You are about to <strong>{{ approvalStatus === 'approved' ? 'approve' : 'reject' }}</strong> this tender quotation.
              {{ approvalStatus === 'approved' ? 'The vendor will be notified of the approval.' : 'Please ensure your reason is clear and actionable.' }}
            </div>
          </div>

          <!-- Dialog footer -->
          <div class="px-6 pb-6 flex gap-3">
            <button
              @click="closeDialog"
              class="flex-1 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              @click="submitApproval"
              :disabled="approvalStatus === 'rejected' && !rejectionReason.trim()"
              :class="[
                'flex-1 px-5 py-2.5 text-white text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
                approvalStatus === 'approved' ? 'bg-green-600 hover:bg-green-700 shadow-sm shadow-green-500/25' : 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/25'
              ]"
            >
              <svg v-if="approvalStatus === 'approved'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              {{ approvalStatus === 'approved' ? 'Confirm Approval' : 'Confirm Rejection' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const schedules = ref([]);
const filter = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;
const collapsedItems = reactive({});

const showDialog = ref(false);
const selectedTenderId = ref(null);
const approvalStatus = ref('approved');
const rejectionReason = ref('');

const toast = useToast();

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

onMounted(async () => {
  await fetchSchedules();
});

async function fetchSchedules() {
  try {
    const response = await axios.get('/api/price-shedules');
    if (response.data?.status === 200 && Array.isArray(response.data.data)) {
      schedules.value = groupByTender(response.data.data);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load quotations');
  }
}

function groupByTender(data) {
  // Data is already grouped by backend, just return it
  return data;
}

function getFinancialStats(tender) {
  return [
    { label: 'VAT Excl', value: formatCurrency(tender.total_amount_vat_excl) },
    { label: 'VAT Incl', value: formatCurrency(tender.total_amount_vat_incl) },
    { label: 'Amt Needed', value: formatCurrency(tender.total_amount_needed) },
    { label: 'Contingency', value: formatCurrency(tender.site_contingency) },
    { label: 'Investment', value: formatCurrency(tender.total_investment) },
    {
      label: 'Profit',
      value: `${formatCurrency(tender.projected_profit)} (${tender.projected_profit_percentage}%)`,
      color: tender.projected_profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
  ];
}

const pendingCount = computed(() => schedules.value.filter(t => t.status === 'pending').length);
const approvedCount = computed(() => schedules.value.filter(t => ['approved','passed'].includes(t.status)).length);
const rejectedCount = computed(() => schedules.value.filter(t => t.status === 'rejected').length);

const filteredTenders = computed(() =>
  schedules.value.filter(t => {
    const matchesText = t.tender?.title?.toLowerCase().includes(filter.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || t.status === statusFilter.value;
    return matchesText && matchesStatus;
  })
);

const totalPages = computed(() => Math.ceil(filteredTenders.value.length / itemsPerPage));

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTenders.value.slice(start, start + itemsPerPage);
});

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function toggleItems(tenderId) {
  collapsedItems[tenderId] = !collapsedItems[tenderId];
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function statusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/20';
    case 'approved': case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300 border border-green-200 dark:border-green-500/20';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border border-red-200 dark:border-red-500/20';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  }
}

function statusDot(status) {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-yellow-500';
    case 'approved': case 'passed': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-slate-400';
  }
}

function openApprovalDialog(tenderId) {
  selectedTenderId.value = tenderId;
  approvalStatus.value = 'approved';
  rejectionReason.value = '';
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  selectedTenderId.value = null;
}

async function submitApproval() {
  if (approvalStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    toast.warning('Please provide a reason for rejection');
    return;
  }

  try {
    const payload = {
      tender_id: selectedTenderId.value,
      status: approvalStatus.value,
      reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value.trim() : null
    };

    const response = await axios.post('/api/approve-schedule', payload);

    if (response.data?.status === 200) {
      toast.success(response.data.message || 'Decision submitted successfully');
      await fetchSchedules();
      closeDialog();
    } else {
      throw new Error(response.data?.message || 'Failed to submit decision');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error submitting decision');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-active .relative,
.dialog-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.dialog-enter-from .relative,
.dialog-leave-to .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>