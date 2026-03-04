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
            <p class="text-xs text-slate-500 dark:text-slate-400">Review &amp; approve price schedules</p>
          </div>
        </div>
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

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-5">
      <!-- Search + Filter + Export -->
      <div class="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div class="relative flex-1 min-w-60 max-w-lg">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="filter" type="text" placeholder="Search by tender title or submitter..."
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm shadow-sm" />
          <span v-if="filter" @click="filter = ''" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
        </div>

        <div class="flex items-center gap-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
          <button v-for="tab in statusTabs" :key="tab.value" @click="statusFilter = tab.value; currentPage = 1"
            :class="['px-3 py-1.5 text-xs font-semibold rounded-lg transition-all', statusFilter === tab.value ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200']">
            {{ tab.label }}
          </button>
        </div>

        <!-- Bulk Export buttons -->
        <div class="flex items-center gap-2 ml-auto">
          <button @click="exportExcel" :disabled="exportingExcel"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-500/25 whitespace-nowrap">
            <svg v-if="!exportingExcel" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ exportingExcel ? 'Exporting...' : 'Export Excel' }}
          </button>
          <button @click="exportPDF" :disabled="exportingPDF"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition shadow-sm shadow-rose-500/25 whitespace-nowrap">
            <svg v-if="!exportingPDF" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ exportingPDF ? 'Exporting...' : 'Export PDF' }}
          </button>
        </div>
      </div>

      <!-- Export scope hint -->
      <p v-if="filteredTenders.length !== schedules.length" class="text-xs text-slate-500 dark:text-slate-400 -mt-2 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Exports include <strong class="text-slate-700 dark:text-slate-300">{{ filteredTenders.length }}</strong> filtered {{ filteredTenders.length === 1 ? 'record' : 'records' }}.
      </p>

      <!-- Table -->
      <div class="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-56">Tender Title</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Submitted By</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th class="px-5 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">VAT Excl</th>
                <th class="px-5 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">VAT Incl</th>
                <th class="px-5 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Amt Needed</th>
                <th class="px-5 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Investment</th>
                <th class="px-5 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Profit</th>
                <th class="px-5 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                <th class="px-5 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky right-0 bg-slate-50 dark:bg-slate-800/60">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr v-for="(tender, idx) in paginatedTenders" :key="tender.tender_id"
                class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                <td class="px-5 py-4 text-xs text-slate-400 font-mono">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900 dark:text-white truncate max-w-52 text-sm" :title="tender.tender?.title">{{ tender.tender?.title || 'Untitled Tender' }}</p>
                      <p v-if="tender.status === 'rejected' && tender.reason_for_reject" class="text-[10px] text-red-500 truncate max-w-52 mt-0.5" :title="tender.reason_for_reject">✕ {{ tender.reason_for_reject }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">{{ (tender.user?.name || '?')[0].toUpperCase() }}</div>
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ tender.user?.name || '—' }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{{ formatDate(tender.created_at) }}</td>
                <td class="px-5 py-4 text-right whitespace-nowrap text-sm font-mono text-slate-700 dark:text-slate-300">{{ formatCurrency(tender.total_amount_vat_excl) }}</td>
                <td class="px-5 py-4 text-right whitespace-nowrap text-sm font-mono text-slate-700 dark:text-slate-300">{{ formatCurrency(tender.total_amount_vat_incl) }}</td>
                <td class="px-5 py-4 text-right whitespace-nowrap text-sm font-mono text-slate-700 dark:text-slate-300">{{ formatCurrency(tender.total_amount_needed) }}</td>
                <td class="px-5 py-4 text-right whitespace-nowrap text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">{{ formatCurrency(tender.total_investment) }}</td>
                <td class="px-5 py-4 text-right whitespace-nowrap">
                  <span :class="tender.projected_profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm font-bold font-mono">{{ formatCurrency(tender.projected_profit) }}</span>
                  <span class="block text-[10px] text-slate-400 text-right">{{ tender.projected_profit_percentage }}%</span>
                </td>
                <td class="px-5 py-4 text-center">
                  <span class="inline-flex items-center justify-center w-7 h-7 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full">{{ tender.items?.length || 0 }}</span>
                </td>
                <td class="px-5 py-4 text-center">
                  <span :class="statusClasses(tender.status)" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wide whitespace-nowrap">
                    <span :class="statusDot(tender.status)" class="w-1.5 h-1.5 rounded-full"></span>
                    {{ tender.status?.toUpperCase() || 'UNKNOWN' }}
                  </span>
                </td>
                <!-- Actions -->
                <td class="px-3 py-4 sticky right-0 bg-white dark:bg-[#0d1424] group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-900/10 transition-colors">
                  <div class="flex items-center justify-center gap-0.5">
                    <!-- View -->
                    <button @click="openViewDialog(tender)" title="View details" class="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <!-- Export PDF (row) -->
                    <button @click="exportSinglePDF(tender)" title="Export as PDF" class="p-1.5 rounded-lg text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </button>
                    <!-- Export Excel (row) -->
                    <button @click="exportSingleExcel(tender)" title="Export as Excel" class="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </button>
                    <!-- Review -->
                    <button v-if="tender.status === 'pending'" @click="openApprovalDialog(tender.tender_id)" title="Review & decide" class="p-1.5 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <!-- Delete -->
                    <button @click="openDeleteDialog(tender)" title="Delete" class="p-1.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!paginatedTenders.length">
                <td colspan="12" class="px-5 py-16 text-center">
                  <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <svg class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No quotations found</p>
                  <p class="text-xs text-slate-400 mt-1">Try adjusting your search or filter criteria.</p>
                  <button @click="filter = ''; statusFilter = 'all'" class="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Clear filters</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination footer -->
        <div class="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Showing <span class="font-semibold text-slate-700 dark:text-slate-300">{{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredTenders.length) }}–{{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }}</span> of <span class="font-semibold text-slate-700 dark:text-slate-300">{{ filteredTenders.length }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span v-for="page in totalPages" :key="page" @click="changePage(page)"
              :class="['w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition', currentPage === page ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800']">{{ page }}</span>
            <button :disabled="currentPage * itemsPerPage >= filteredTenders.length" @click="changePage(currentPage + 1)" class="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== VIEW MODAL ===== -->
    <Transition name="dialog">
      <div v-if="showViewDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" @click="closeViewDialog"></div>
        <div class="relative bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 flex-shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-slate-900 dark:text-white truncate">{{ viewingTender?.tender?.title || 'Untitled' }}</h3>
                <div class="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>{{ viewingTender?.user?.name || '—' }}</span>
                  <span>·</span>
                  <span>{{ formatDate(viewingTender?.created_at) }}</span>
                  <span>·</span>
                  <span :class="statusClasses(viewingTender?.status)" class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full">
                    <span :class="statusDot(viewingTender?.status)" class="w-1.5 h-1.5 rounded-full"></span>
                    {{ viewingTender?.status?.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="closeViewDialog" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-1">
            <div v-if="viewingTender?.status === 'rejected' && viewingTender?.reason_for_reject"
              class="mx-6 mt-5 flex items-start gap-2 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span><strong>Rejection reason:</strong> {{ viewingTender?.reason_for_reject }}</span>
            </div>

            <div class="px-6 py-5">
              <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Financial Summary</h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div v-for="stat in getFinancialStats(viewingTender)" :key="stat.label" class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ stat.label }}</p>
                  <p class="mt-1 text-sm font-bold truncate" :class="stat.color || 'text-slate-900 dark:text-slate-100'">{{ stat.value }}</p>
                </div>
              </div>
            </div>

            <div class="px-6 pb-6">
              <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                Schedule Items <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-full">{{ viewingTender?.items?.length || 0 }}</span>
              </h4>
              <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table class="min-w-full text-xs">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/70">
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">S/N</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider min-w-64">Description</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Q.Qty</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider">Q.Rate</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider bg-indigo-50/50 dark:bg-indigo-900/10">Q.Amount</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Qty</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider bg-slate-100/80 dark:bg-slate-700/30">Amount</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Source</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider">Urgent</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                    <tr v-for="item in viewingTender?.items" :key="item.price_schedule_id" class="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors">
                      <td class="px-4 py-3 font-mono text-slate-500">{{ item.serial_number || '—' }}</td>
                      <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-64 truncate" :title="item.item_description">{{ item.item_description || '—' }}</td>
                      <td class="px-4 py-3 text-center">{{ item.quoted_quantity ?? '—' }}</td>
                      <td class="px-4 py-3 text-center"><span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">{{ item.quoted_unit || '—' }}</span></td>
                      <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(item.quoted_rate) }}</td>
                      <td class="px-4 py-3 text-right font-bold font-mono bg-indigo-50/30 dark:bg-indigo-900/5">{{ formatCurrency(item.quoted_amount) }}</td>
                      <td class="px-4 py-3 text-center">{{ item.quantity ?? '—' }}</td>
                      <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(item.rate) }}</td>
                      <td class="px-4 py-3 text-right font-bold font-mono bg-slate-50/80 dark:bg-slate-800/30">{{ formatCurrency(item.amount) }}</td>
                      <td class="px-4 py-3 text-center text-slate-500">{{ item.source || '—' }}</td>
                      <td class="px-4 py-3 text-center">
                        <span v-if="item.urgent_status" :class="['yes','urgent'].includes(item.urgent_status?.toLowerCase()) ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{{ item.urgent_status }}</span>
                        <span v-else class="text-slate-400">—</span>
                      </td>
                    </tr>
                    <tr v-if="!viewingTender?.items?.length"><td colspan="11" class="px-4 py-8 text-center text-slate-400 text-xs">No schedule items</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex items-center gap-2">
              <button @click="exportSinglePDF(viewingTender)" class="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Export PDF
              </button>
              <button @click="exportSingleExcel(viewingTender)" class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Export Excel
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button @click="closeViewDialog" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition">Close</button>
              <button v-if="viewingTender?.status === 'pending'" @click="closeViewDialog(); openApprovalDialog(viewingTender.tender_id)"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Review &amp; Decide
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== APPROVAL DIALOG ===== -->
    <Transition name="dialog">
      <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" @click="closeDialog"></div>
        <div class="relative bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Review Quotation</h3>
            </div>
            <button @click="closeDialog" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Decision</label>
              <div class="grid grid-cols-2 gap-2">
                <button @click="approvalStatus = 'approved'" :class="['flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all', approvalStatus === 'approved' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-green-300']">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  Approve
                </button>
                <button @click="approvalStatus = 'rejected'" :class="['flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all', approvalStatus === 'rejected' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300']">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject
                </button>
              </div>
            </div>
            <Transition name="fade">
              <div v-if="approvalStatus === 'rejected'">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Reason <span class="text-red-500">*</span></label>
                <textarea v-model="rejectionReason" rows="4" placeholder="Provide a detailed reason..."
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"></textarea>
                <p class="mt-1 text-xs text-slate-400">{{ rejectionReason.trim().length }} characters</p>
              </div>
            </Transition>
            <div :class="approvalStatus === 'approved' ? 'bg-green-50 dark:bg-green-900/15 border-green-200 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/15 border-red-200 text-red-700 dark:text-red-300'" class="px-4 py-3 rounded-xl border text-xs font-medium">
              You are about to <strong>{{ approvalStatus === 'approved' ? 'approve' : 'reject' }}</strong> this tender quotation.
              {{ approvalStatus === 'approved' ? 'The vendor will be notified.' : 'Ensure your reason is clear.' }}
            </div>
          </div>
          <div class="px-6 pb-6 flex gap-3">
            <button @click="closeDialog" class="flex-1 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition">Cancel</button>
            <button @click="submitApproval" :disabled="approvalStatus === 'rejected' && !rejectionReason.trim()"
              :class="['flex-1 px-5 py-2.5 text-white text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2', approvalStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700']">
              <svg v-if="approvalStatus === 'approved'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              {{ approvalStatus === 'approved' ? 'Confirm Approval' : 'Confirm Rejection' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== DELETE DIALOG ===== -->
    <Transition name="dialog">
      <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" @click="closeDeleteDialog"></div>
        <div class="relative bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="p-6 text-center">
            <div class="w-12 h-12 mx-auto rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Delete Quotation?</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Are you sure you want to delete <strong class="text-slate-700 dark:text-slate-300">{{ deletingTender?.tender?.title || 'this quotation' }}</strong>? This cannot be undone.</p>
          </div>
          <div class="px-6 pb-6 flex gap-3">
            <button @click="closeDeleteDialog" class="flex-1 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition">Cancel</button>
            <button @click="confirmDelete" class="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

// ─── State ────────────────────────────────────────────────────────────────────
const schedules = ref([]);
const filter = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

const showDialog = ref(false);
const selectedTenderId = ref(null);
const approvalStatus = ref('approved');
const rejectionReason = ref('');

const showViewDialog = ref(false);
const viewingTender = ref(null);

const showDeleteDialog = ref(false);
const deletingTender = ref(null);

const exportingPDF = ref(false);
const exportingExcel = ref(false);

const toast = useToast();

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => { await fetchSchedules(); });

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchSchedules() {
  try {
    const response = await axios.get('/api/price-shedules');
    if (response.data?.status === 200 && Array.isArray(response.data.data)) {
      schedules.value = response.data.data;
    } else throw new Error('Invalid response format');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load quotations');
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const pendingCount = computed(() => schedules.value.filter(t => t.status === 'pending').length);
const approvedCount = computed(() => schedules.value.filter(t => ['approved', 'passed'].includes(t.status)).length);
const rejectedCount = computed(() => schedules.value.filter(t => t.status === 'rejected').length);

const filteredTenders = computed(() =>
  schedules.value.filter(t => {
    const q = filter.value.toLowerCase();
    const matchesText = t.tender?.title?.toLowerCase().includes(q) || t.user?.name?.toLowerCase().includes(q);
    const matchesStatus = statusFilter.value === 'all' || t.status === statusFilter.value;
    return matchesText && matchesStatus;
  })
);

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTenders.value.length / itemsPerPage)));
const paginatedTenders = computed(() => filteredTenders.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function changePage(page) { if (page >= 1 && page <= totalPages.value) currentPage.value = page; }

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function rawNum(value) { return value == null ? '' : Number(value); }

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

function getFinancialStats(tender) {
  if (!tender) return [];
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

// ─── View ─────────────────────────────────────────────────────────────────────
function openViewDialog(tender) { viewingTender.value = tender; showViewDialog.value = true; }
function closeViewDialog() { showViewDialog.value = false; viewingTender.value = null; }

// ─── Approval ─────────────────────────────────────────────────────────────────
function openApprovalDialog(tenderId) { selectedTenderId.value = tenderId; approvalStatus.value = 'approved'; rejectionReason.value = ''; showDialog.value = true; }
function closeDialog() { showDialog.value = false; selectedTenderId.value = null; }

async function submitApproval() {
  if (approvalStatus.value === 'rejected' && !rejectionReason.value.trim()) { toast.warning('Please provide a reason for rejection'); return; }
  try {
    const payload = { tender_id: selectedTenderId.value, status: approvalStatus.value, reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value.trim() : null };
    const response = await axios.post('/api/approve-schedule', payload);
    if (response.data?.status === 200) { toast.success(response.data.message || 'Decision submitted successfully'); await fetchSchedules(); closeDialog(); }
    else throw new Error(response.data?.message || 'Failed');
  } catch (error) { toast.error(error.response?.data?.message || 'Error submitting decision'); }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
function openDeleteDialog(tender) { deletingTender.value = tender; showDeleteDialog.value = true; }
function closeDeleteDialog() { showDeleteDialog.value = false; deletingTender.value = null; }

async function confirmDelete() {
  try {
    const response = await axios.delete(`/api/price-shedules/${deletingTender.value.tender_id}`);
    if (response.data?.status === 200) { toast.success(response.data.message || 'Deleted successfully'); await fetchSchedules(); closeDeleteDialog(); }
    else throw new Error(response.data?.message || 'Failed to delete');
  } catch (error) { toast.error(error.response?.data?.message || 'Error deleting quotation'); }
}

// ─── EXCEL EXPORT (SheetJS — loaded from CDN on demand) ──────────────────────
async function loadXLSX() {
  if (window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error('Failed to load SheetJS'));
    document.head.appendChild(s);
  });
}

function buildWorkbook(XLSX, tenders) {
  const wb = XLSX.utils.book_new();

  // Sheet 1 – Summary
  const summaryData = [
    ['#', 'Tender Title', 'Submitted By', 'Date', 'Status',
     'VAT Excl (TZS)', 'VAT Incl (TZS)', 'Amt Needed (TZS)',
     'Site Contingency (TZS)', 'Total Investment (TZS)',
     'Projected Profit (TZS)', 'Profit %', 'Items', 'Rejection Reason'],
    ...tenders.map((t, i) => [
      i + 1,
      t.tender?.title || '',
      t.user?.name || '',
      t.created_at ? new Date(t.created_at).toLocaleDateString() : '',
      t.status?.toUpperCase() || '',
      rawNum(t.total_amount_vat_excl),
      rawNum(t.total_amount_vat_incl),
      rawNum(t.total_amount_needed),
      rawNum(t.site_contingency),
      rawNum(t.total_investment),
      rawNum(t.projected_profit),
      t.projected_profit_percentage ?? '',
      t.items?.length || 0,
      t.reason_for_reject || ''
    ])
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1['!cols'] = [
    {wch:5},{wch:42},{wch:22},{wch:14},{wch:12},
    {wch:22},{wch:22},{wch:22},{wch:24},{wch:24},
    {wch:24},{wch:10},{wch:8},{wch:42}
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // Sheet 2 – All Schedule Items
  const itemsData = [
    ['Tender Title', 'Status', 'S/N', 'Description', 'Q.Qty', 'Q.Unit',
     'Q.Rate (TZS)', 'Q.Amount (TZS)', 'Qty', 'Rate (TZS)', 'Amount (TZS)', 'Source', 'Urgent'],
    ...tenders.flatMap(t =>
      (t.items || []).map(item => [
        t.tender?.title || '',
        t.status?.toUpperCase() || '',
        item.serial_number || '',
        item.item_description || '',
        item.quoted_quantity ?? '',
        item.quoted_unit || '',
        rawNum(item.quoted_rate),
        rawNum(item.quoted_amount),
        item.quantity ?? '',
        rawNum(item.rate),
        rawNum(item.amount),
        item.source || '',
        item.urgent_status || ''
      ])
    )
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(itemsData);
  ws2['!cols'] = [
    {wch:38},{wch:12},{wch:8},{wch:50},{wch:8},{wch:8},
    {wch:20},{wch:20},{wch:8},{wch:20},{wch:20},{wch:18},{wch:10}
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Schedule Items');

  return wb;
}

async function exportExcel() {
  if (!filteredTenders.value.length) return toast.warning('No data to export');
  exportingExcel.value = true;
  try {
    const XLSX = await loadXLSX();
    const wb = buildWorkbook(XLSX, filteredTenders.value);
    XLSX.writeFile(wb, `Quotations_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success(`Exported ${filteredTenders.value.length} quotation(s) to Excel`);
  } catch (e) { toast.error('Excel export failed'); console.error(e); }
  finally { exportingExcel.value = false; }
}

async function exportSingleExcel(tender) {
  if (!tender) return;
  try {
    const XLSX = await loadXLSX();
    const wb = buildWorkbook(XLSX, [tender]);
    const name = (tender.tender?.title || 'Quotation').replace(/[^a-z0-9]/gi, '_').slice(0, 40);
    XLSX.writeFile(wb, `${name}_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success('Exported to Excel');
  } catch (e) { toast.error('Excel export failed'); console.error(e); }
}

// ─── PDF EXPORT (jsPDF + autoTable — loaded from CDN on demand) ───────────────
async function loadJsPDF() {
  if (window.jspdf?.jsPDF) return window.jspdf;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = resolve; s.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(s);
  });
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
    s.onload = resolve; s.onerror = () => reject(new Error('Failed to load autoTable'));
    document.head.appendChild(s);
  });
  return window.jspdf;
}

function buildPDF(jspdf, tenders, filename) {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Header banner
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageW, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text('Quotations Report', 14, 9);
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${now}   ·   Total records: ${tenders.length}`, 14, 16);

  // Summary table
  doc.setTextColor(30, 41, 59); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, 28);

  doc.autoTable({
    startY: 31,
    head: [['#', 'Tender Title', 'Submitted By', 'Date', 'Status', 'VAT Excl', 'VAT Incl', 'Amt Needed', 'Investment', 'Profit', '%', 'Items']],
    body: tenders.map((t, i) => [
      i + 1,
      t.tender?.title || '',
      t.user?.name || '',
      t.created_at ? new Date(t.created_at).toLocaleDateString() : '',
      t.status?.toUpperCase() || '',
      formatCurrency(t.total_amount_vat_excl),
      formatCurrency(t.total_amount_vat_incl),
      formatCurrency(t.total_amount_needed),
      formatCurrency(t.total_investment),
      formatCurrency(t.projected_profit),
      `${t.projected_profit_percentage ?? ''}%`,
      t.items?.length || 0
    ]),
    styles: { fontSize: 6.5, cellPadding: 2.2, lineColor: [226, 232, 240], textColor: [30, 41, 59] },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', fontSize: 6.5 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 7 }, 1: { cellWidth: 52 }, 2: { cellWidth: 28 },
      3: { cellWidth: 20 }, 4: { cellWidth: 16 },
      5: { cellWidth: 22, halign: 'right' }, 6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 22, halign: 'right' }, 8: { cellWidth: 22, halign: 'right' },
      9: { cellWidth: 22, halign: 'right' }, 10: { cellWidth: 10, halign: 'right' },
      11: { cellWidth: 9, halign: 'center' }
    },
    willDrawCell(data) {
      // Colour-code status text
      if (data.column.index === 4 && data.section === 'body') {
        const v = String(data.cell.raw).toLowerCase();
        if (v === 'pending') doc.setTextColor(161, 98, 7);
        else if (v === 'approved' || v === 'passed') doc.setTextColor(22, 101, 52);
        else if (v === 'rejected') doc.setTextColor(153, 27, 27);
      }
    },
    didDrawCell(data) {
      if (data.column.index === 4 && data.section === 'body') doc.setTextColor(30, 41, 59);
    },
    margin: { left: 14, right: 14 }
  });

  // Per-tender detail pages
  tenders.forEach(tender => {
    if (!tender.items?.length) return;
    doc.addPage();

    // Sub-header
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(30, 41, 59); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(tender.tender?.title || 'Untitled Tender', 14, 9);
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
    const meta = [
      `By: ${tender.user?.name || '—'}`,
      `Date: ${formatDate(tender.created_at)}`,
      `Status: ${tender.status?.toUpperCase()}`,
      `Investment: ${formatCurrency(tender.total_investment)}`,
      `Profit: ${formatCurrency(tender.projected_profit)} (${tender.projected_profit_percentage}%)`
    ].join('   |   ');
    doc.text(meta, 14, 16);

    let startY = 25;
    if (tender.status === 'rejected' && tender.reason_for_reject) {
      doc.setTextColor(185, 28, 28); doc.setFontSize(6.5);
      doc.text(`Rejection: ${tender.reason_for_reject}`, 14, 22);
      startY = 28;
    }

    doc.autoTable({
      startY,
      head: [['S/N', 'Description', 'Q.Qty', 'Q.Unit', 'Q.Rate', 'Q.Amount', 'Qty', 'Rate', 'Amount', 'Source', 'Urgent']],
      body: tender.items.map(item => [
        item.serial_number || '',
        item.item_description || '',
        item.quoted_quantity ?? '',
        item.quoted_unit || '',
        formatCurrency(item.quoted_rate),
        formatCurrency(item.quoted_amount),
        item.quantity ?? '',
        formatCurrency(item.rate),
        formatCurrency(item.amount),
        item.source || '',
        item.urgent_status || ''
      ]),
      styles: { fontSize: 6.5, cellPadding: 2, lineColor: [226, 232, 240], textColor: [30, 41, 59] },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold', fontSize: 6.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 10 }, 1: { cellWidth: 62 },
        2: { cellWidth: 12, halign: 'center' }, 3: { cellWidth: 12, halign: 'center' },
        4: { cellWidth: 24, halign: 'right' }, 5: { cellWidth: 26, halign: 'right' },
        6: { cellWidth: 12, halign: 'center' },
        7: { cellWidth: 24, halign: 'right' }, 8: { cellWidth: 26, halign: 'right' },
        9: { cellWidth: 20 }, 10: { cellWidth: 14, halign: 'center' }
      },
      margin: { left: 14, right: 14 }
    });

    // Page number footer
    doc.setFontSize(6); doc.setTextColor(148, 163, 184);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageW - 14, pageH - 5, { align: 'right' });
  });

  doc.save(filename);
}

async function exportPDF() {
  if (!filteredTenders.value.length) return toast.warning('No data to export');
  exportingPDF.value = true;
  try {
    const jspdf = await loadJsPDF();
    buildPDF(jspdf, filteredTenders.value, `Quotations_${new Date().toISOString().slice(0,10)}.pdf`);
    toast.success(`Exported ${filteredTenders.value.length} quotation(s) to PDF`);
  } catch (e) { toast.error('PDF export failed'); console.error(e); }
  finally { exportingPDF.value = false; }
}

async function exportSinglePDF(tender) {
  if (!tender) return;
  try {
    const jspdf = await loadJsPDF();
    const name = (tender.tender?.title || 'Quotation').replace(/[^a-z0-9]/gi, '_').slice(0, 40);
    buildPDF(jspdf, [tender], `${name}_${new Date().toISOString().slice(0,10)}.pdf`);
    toast.success('Exported to PDF');
  } catch (e) { toast.error('PDF export failed'); console.error(e); }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.dialog-enter-active, .dialog-leave-active { transition: opacity 0.2s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; }
.dialog-enter-active .relative, .dialog-leave-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.dialog-enter-from .relative, .dialog-leave-to .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>