<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5 tenders-page-shell">
    <div class="tenders-frame mx-auto flex h-[calc(100vh-32px)] max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/84 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">
      <!-- Header -->
      <div class="tenders-hero relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="pointer-events-none absolute right-6 top-3 h-24 w-24 opacity-35" style="background-image: radial-gradient(#2b74d7 1.2px, transparent 1.2px); background-size: 10px 10px;"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">CEO Workspace</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63] lg:text-[28px]">Tender Quotations</h1>
              <p class="mt-1.5 max-w-2xl text-sm leading-6 text-[#67819d]">Review submitted quotations, inspect price schedules, and move each tender through quoted, approved, rejected, and submitted states from one executive dashboard.</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 text-right shadow-[0_8px_18px_rgba(18,58,99,0.06)] md:block">
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Visible</p>
              <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ filteredTenders.length }} tender{{ filteredTenders.length !== 1 ? 's' : '' }}</p>
            </div>
            <button @click="exportData" class="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#e53945_0%,#cf1d2f_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(207,29,47,0.24)] transition-all hover:brightness-105">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
        <div class="relative mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div class="tenders-stat rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-sm">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Quoted</p>
            <p class="mt-1 text-lg font-bold text-[#183b63]">{{ statusTabs.find(tab => tab.value === 'quoted')?.count || 0 }}</p>
          </div>
          <div class="tenders-stat rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-sm">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Approved</p>
            <p class="mt-1 text-lg font-bold text-[#183b63]">{{ statusTabs.find(tab => tab.value === 'approved')?.count || 0 }}</p>
          </div>
          <div class="tenders-stat rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-sm">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Rejected</p>
            <p class="mt-1 text-lg font-bold text-[#183b63]">{{ statusTabs.find(tab => tab.value === 'rejected')?.count || 0 }}</p>
          </div>
          <div class="tenders-stat rounded-2xl border border-[#dbe7f3] bg-white/95 px-4 py-3 shadow-sm">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a93af]">Submitted</p>
            <p class="mt-1 text-lg font-bold text-[#183b63]">{{ statusTabs.find(tab => tab.value === 'submitted')?.count || 0 }}</p>
          </div>
          <div class="tenders-stat rounded-2xl border border-[#1f9d8b]/20 bg-[#f0fdf9] px-4 py-3 shadow-sm">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f9d8b]">Awarded</p>
            <p class="mt-1 text-lg font-bold text-[#166d62]">{{ statusTabs.find(tab => tab.value === 'awarded')?.count || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="flex h-[calc(100vh-248px)] min-h-0">
      <!-- LEFT: Tender List -->
      <div :class="selectedTender ? 'w-1/2 lg:w-[55%]' : 'w-full'" class="tenders-list-pane flex min-h-0 flex-col overflow-hidden border-r border-[#e4edf6] bg-[linear-gradient(180deg,#fbfdff_0%,#f7fbff_100%)] transition-all duration-300">

        <!-- Status Tabs + Search -->
        <div class="border-b border-[#e6eef7] px-5 pb-3 pt-4 space-y-3 tenders-filter-bar">
          <!-- Tabs -->
          <div class="flex items-center gap-1 flex-wrap">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              @click="setTab(tab.value)"
              :class="[
                'rounded-full px-4 py-1.5 text-xs font-semibold transition-all border tenders-filter-pill',
                activeTab === tab.value
                  ? 'border-[#1d5aa5] bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white shadow-[0_10px_22px_rgba(35,96,182,0.18)]'
                  : 'border-[#d7e4f1] bg-white text-[#5f7892] hover:border-[#aac6e8] hover:bg-[#f2f8ff]'
              ]"
            >
              {{ tab.label }}
              <span v-if="tab.count > 0" class="ml-1 opacity-75">({{ tab.count }})</span>
            </button>
          </div>
          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87a0bb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, number or type..."
              class="tenders-search w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 pl-10 text-sm text-[#183b63] placeholder-[#99afc5] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/12"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex-1 flex flex-col gap-3 overflow-y-auto px-5 py-4">
          <div v-for="i in 5" :key="i" class="animate-pulse rounded-2xl border border-[#e3edf7] bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#dfeaf6] rounded-2xl flex-shrink-0"></div>
              <div class="flex-1">
                <div class="h-4 bg-[#dfeaf6] rounded w-2/3 mb-2"></div>
                <div class="h-3 bg-[#edf3fa] rounded w-1/3"></div>
              </div>
              <div class="h-6 bg-[#e6eef8] rounded-full w-20"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredTenders.length === 0" class="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f2ff] shadow-inner">
            <svg class="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-[#183b63]">No tenders found</p>
          <p class="mt-1 text-xs text-[#8aa0b7]">Try adjusting your filters</p>
        </div>

        <!-- Tender list -->
        <div v-else class="flex-1 overflow-y-auto px-5 py-4 space-y-3 tenders-list-scroll">
          <div
            v-for="tender in paginatedTenders"
            :key="tender.tender_id"
            @click="openDetail(tender)"
            :class="[
              'tender-row cursor-pointer rounded-[22px] border p-4 transition-all duration-150 shadow-sm',
              selectedTender?.tender_id === tender.tender_id
                ? 'border-[#2b74d7] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)] shadow-[0_16px_30px_rgba(35,96,182,0.12)]'
                : 'border-[#e1eaf4] bg-white hover:border-[#9fbfe4] hover:bg-[#fbfdff] hover:shadow-[0_12px_24px_rgba(18,58,99,0.08)]'
            ]"
          >
            <div class="flex items-center gap-3">
              <!-- Icon -->
              <div :class="[
                'tender-row__icon w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0',
                selectedTender?.tender_id === tender.tender_id ? 'bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] shadow-[0_12px_24px_rgba(35,96,182,0.18)]' : 'bg-[#edf4ff]'
              ]">
                <svg class="w-5 h-5" :class="selectedTender?.tender_id === tender.tender_id ? 'text-white' : 'text-blue-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-[#183b63]">{{ tender.title }}</p>
                    <p class="mt-0.5 text-xs text-[#7d93ab]">{{ tender.tender_number || 'No number' }}</p>
                  </div>
                  <span :class="statusBadge(tender.status)" class="tender-row__status px-2.5 py-0.5 text-xs font-semibold rounded-full flex-shrink-0">
                    {{ tender.status?.toUpperCase() || 'PENDING' }}
                  </span>
                </div>
                <div class="flex items-center gap-3 mt-2 flex-wrap tender-row__meta">
                  <span class="rounded-full bg-[#f2f7fd] px-2.5 py-0.5 text-[11px] font-medium text-[#5f7892]">{{ tender.tender_type || 'General' }}</span>
                  <span class="text-xs text-[#c1cfdd]">·</span>
                  <span class="text-xs font-semibold text-[#1f5aa6]">{{ formatCurrency(tender.value) }}</span>
                  <span class="text-xs text-[#c1cfdd]">·</span>
                  <span class="text-xs text-[#6f86a0]">Deadline: {{ formatDate(tender.bid_submission) }}</span>
                  <!-- Quotation indicator -->
                  <span v-if="getQuotation(tender.tender_id)" class="rounded-full bg-[#edf2ff] px-2 py-0.5 text-[11px] font-semibold text-[#5667cf]">
                    Has Quotation
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-1 pt-3 pb-2">
            <p class="text-xs text-[#7f96ae]">{{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }} of {{ filteredTenders.length }}</p>
            <div class="flex items-center gap-1">
              <button @click="currentPage--" :disabled="currentPage === 1" class="rounded-lg border border-[#d7e4f1] p-1.5 text-[#6f86a0] hover:bg-[#f3f8ff] disabled:opacity-40">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span class="px-2 text-xs font-medium text-[#4d6782]">{{ currentPage }} / {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage >= totalPages" class="rounded-lg border border-[#d7e4f1] p-1.5 text-[#6f86a0] hover:bg-[#f3f8ff] disabled:opacity-40">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Detail Drawer -->
      <div v-if="selectedTender" class="w-1/2 lg:w-[45%] flex flex-col overflow-hidden border-l border-[#e4edf6] bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)]">
        <!-- Drawer Header -->
        <div class="flex items-center justify-between border-b border-[#e4edf6] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)] px-5 py-4">
          <div>
            <h2 class="text-sm font-bold text-[#183b63]">Tender Details</h2>
            <p class="mt-0.5 text-[11px] text-[#7a93af]">Executive review panel</p>
          </div>
          <button @click="closeDetail" class="rounded-xl border border-[#d5e3f0] bg-white p-2 text-[#7a93af] transition-colors hover:bg-[#eef5ff] hover:text-[#183b63]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-5">
        
          <!-- Tender Actions -->
          <div v-if="selectedTender.status === 'quoted'" class="flex gap-2">
         
          </div>
          <div v-else-if="selectedTender.status === 'approved'" class="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-3 py-2.5 shadow-sm">
            <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p class="text-sm text-green-700 font-medium">This tender has been approved</p>
          </div>
          <div v-else-if="selectedTender.status === 'rejected'" class="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 shadow-sm">
            <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <p class="text-sm text-red-700 font-medium">This tender was rejected</p>
              <p v-if="selectedTender.ceo_comment" class="text-xs text-red-600 mt-0.5">Reason: {{ selectedTender.ceo_comment }}</p>
            </div>
          </div>
          <div v-else-if="selectedTender.status === 'submitted'" class="space-y-2">
            <div class="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 shadow-sm">
              <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p class="text-sm text-emerald-700 font-medium">Tender submitted to procurement entity</p>
            </div>
            <button @click="openAwardModal(selectedTender)" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1f9d8b_0%,#178f7e_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(31,157,139,0.24)] transition-all hover:brightness-105">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Mark as Awarded
            </button>
          </div>
          <div v-else-if="selectedTender.status === 'awarded'" class="space-y-2">
            <div class="flex items-center gap-2 rounded-2xl border border-[#1f9d8b]/20 bg-[#f0fdf9] px-3 py-2.5 shadow-sm">
              <svg class="w-4 h-4 text-[#1f9d8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p class="text-sm text-[#166d62] font-medium">This tender has been awarded</p>
            </div>
            <div v-if="selectedTender.award_document" class="rounded-2xl border border-[#d9e6f3] bg-white p-3">
              <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Certification Document</span>
              <button @click="viewAwardDocument(selectedTender.award_document)" class="mt-1.5 flex w-full items-center gap-2 rounded-xl border border-[#d5e3f0] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-[#1f5aa6] transition-colors hover:bg-[#eef5ff]">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Certificate
              </button>
            </div>
          </div>

          <!-- Assigned User Info -->
          <div v-if="selectedTender.user" class="rounded-[22px] border border-[#dce7f3] bg-white p-4 shadow-sm">
            <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Assigned To</span>
            <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ selectedTender.user.name }}</p>
            <p class="text-xs text-[#6f86a0]">{{ selectedTender.user.email }}</p>
          </div>

          <!-- Quotation / Price Schedule Section -->
          <div>
            <h3 class="mb-3 flex items-center gap-2 text-sm font-bold text-[#183b63]">
              <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Price Schedule (Quotation)
            </h3>

            <!-- No quotation -->
            <div v-if="!tenderQuotation" class="rounded-[22px] border border-dashed border-[#d8e5f3] bg-white/85 p-6 text-center shadow-sm">
              <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf4ff]">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-[#183b63]">No quotation submitted yet</p>
              <p class="mt-1 text-xs text-[#8aa0b7]">A price schedule has not been set for this tender</p>
            </div>

            <!-- Quotation found -->
            <div v-else class="overflow-hidden rounded-[24px] border border-[#dce7f3] bg-white shadow-[0_14px_34px_rgba(18,58,99,0.08)]">
              <!-- Quotation header -->
              <div class="flex items-center justify-between border-b border-[#e6eef7] bg-[linear-gradient(135deg,#f4f8ff_0%,#ffffff_100%)] px-4 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf2ff]">
                    <svg class="w-4 h-4 text-[#5667cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-[#183b63]">Price Schedule</p>
                    <p class="text-[10px] text-[#7d94ac]">{{ tenderQuotation.items?.length || 0 }} line items · submitted by {{ tenderQuotation.user?.name || '—' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="tenderQuotation.file_path"
                    @click="viewQuotationDocument(tenderQuotation.file_path)"
                    class="rounded-xl border border-[#d5e3f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f5aa6] transition-colors hover:bg-[#eef5ff]"
                  >
                    View Quotation
                  </button>
                  <span :class="statusBadge(tenderQuotation.status)" class="px-2.5 py-0.5 text-xs font-semibold rounded-full">
                    {{ tenderQuotation.status?.toUpperCase() || 'PENDING' }}
                  </span>
                </div>
              </div>

              <!-- Quotation financials -->
              <div class="grid grid-cols-3 gap-3 px-4 py-4 text-xs">
                <div class="rounded-2xl bg-[#f7faff] px-3 py-3">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">VAT Excl</span>
                  <p class="mt-1 text-sm font-bold text-[#183b63]">{{ formatCurrency(tenderQuotation.total_amount_vat_excl) }}</p>
                </div>
                <div class="rounded-2xl bg-[#f7faff] px-3 py-3">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Total Investment</span>
                  <p class="mt-1 text-sm font-bold text-[#183b63]">{{ formatCurrency(tenderQuotation.total_investment) }}</p>
                </div>
                <div class="rounded-2xl bg-[#f7faff] px-3 py-3">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Projected Profit</span>
                  <p :class="tenderQuotation.projected_profit > 0 ? 'text-green-600' : 'text-red-600'" class="mt-1 text-sm font-bold">
                    {{ formatCurrency(tenderQuotation.projected_profit) }}
                    <span class="text-[10px] font-normal">({{ tenderQuotation.projected_profit_percentage }}%)</span>
                  </p>
                </div>
                <div class="col-span-3 rounded-2xl bg-[#f9fbff] px-3 py-3">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Submitted</span>
                  <p class="mt-1 text-sm font-semibold text-[#4f6782]">{{ formatDate(tenderQuotation.created_at) }}</p>
                </div>
              </div>

              <!-- Price schedule items preview (if available) -->
              <div v-if="tenderQuotation.items && tenderQuotation.items.length > 0" class="border-t border-[#edf2f7] px-4 py-3">
                <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Line Items Preview</p>
                <div class="space-y-1.5 max-h-28 overflow-y-auto">
                  <div
                    v-for="(item, i) in tenderQuotation.items.slice(0, 8)"
                    :key="i"
                    class="flex items-center justify-between border-b border-[#f1f5f9] py-1 text-xs"
                  >
                    <span class="max-w-[60%] truncate text-[#516b85]">{{ item.description || item.item_name || `Item ${i + 1}` }}</span>
                    <span class="flex-shrink-0 font-semibold text-[#183b63]">{{ formatCurrency(item.total || item.amount || 0) }}</span>
                  </div>
                  <p v-if="tenderQuotation.items.length > 8" class="pt-1 text-center text-[10px] text-[#91a5bb]">
                    +{{ tenderQuotation.items.length - 8 }} more items
                  </p>
                </div>
              </div>

              <!-- Quotation actions -->
              <div v-if="selectedTender.status === 'quoted'" class="flex gap-2 border-t border-[#edf2f7] px-4 py-3">
                <button
                  @click="openApproval(tenderQuotation, 'quotation', 'approve')"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Approve Quotation
                </button>
                <button
                  @click="openApproval(tenderQuotation, 'quotation', 'reject')"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject Quotation
                </button>
              </div>
              <div v-else-if="['approved','passed'].includes(tenderQuotation.status)" class="border-t border-[#edf2f7] px-4 py-2.5">
                <p class="text-xs text-green-600 font-medium flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Quotation approved
                </p>
              </div>
              <div v-else-if="tenderQuotation.status === 'rejected'" class="border-t border-[#edf2f7] px-4 py-2.5">
                <p class="text-xs text-red-600 font-medium flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Quotation rejected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Award Certificate Upload Modal -->
    <div v-if="showAwardModal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#123a63]/32 p-4 backdrop-blur-[6px]">
      <div class="w-full max-w-md rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6 shadow-[0_30px_70px_rgba(18,58,99,0.24)]">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f7f4] shadow-sm">
            <svg class="w-5 h-5 text-[#1f9d8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-[#183b63]">Mark Tender as Awarded</h3>
            <p class="text-xs text-[#7a93af]">Upload the certification document to complete the award</p>
          </div>
        </div>
        <div class="mb-4">
          <label class="mb-1.5 block text-sm font-medium text-[#4b6681]">Certification Document *</label>
          <div 
            @dragover.prevent="awardDragOver = true" 
            @dragleave.prevent="awardDragOver = false" 
            @drop.prevent="handleAwardFileDrop"
            :class="['relative rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors', awardDragOver ? 'border-[#1f9d8b] bg-[#f0fdf9]' : 'border-[#d7e4f1] bg-[#f9fbff]']"
          >
            <input type="file" ref="awardFileInput" @change="handleAwardFileSelect" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div v-if="!awardFile">
              <svg class="mx-auto h-8 w-8 text-[#91a5bb]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p class="mt-2 text-xs text-[#7a93af]">Drag & drop or click to upload</p>
              <p class="mt-0.5 text-[10px] text-[#a3b5c8]">PDF, DOC, DOCX, JPG, PNG</p>
            </div>
            <div v-else class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5 text-[#1f9d8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span class="text-sm font-medium text-[#183b63] truncate max-w-[200px]">{{ awardFile.name }}</span>
              <button @click.stop="awardFile = null" class="ml-1 text-[#91a5bb] hover:text-red-500"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="closeAwardModal" class="flex-1 rounded-xl border border-[#d7e4f1] py-2.5 text-sm font-medium text-[#4d6782] transition-colors hover:bg-[#f4f8ff]">Cancel</button>
          <button @click="submitAward" :disabled="!awardFile || awardSubmitting" class="flex-1 rounded-xl bg-[linear-gradient(135deg,#1f9d8b_0%,#178f7e_100%)] py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-105 disabled:opacity-50">
            <span v-if="awardSubmitting">Uploading...</span>
            <span v-else>Award Tender</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal (Approve / Reject) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#123a63]/32 p-4 backdrop-blur-[6px]">
      <div class="w-full max-w-md rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6 shadow-[0_30px_70px_rgba(18,58,99,0.24)]">
        <div class="flex items-center gap-3 mb-4">
          <div :class="modalMode === 'approve' ? 'bg-green-100' : 'bg-red-100'" class="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm">
            <svg class="w-5 h-5" :class="modalMode === 'approve' ? 'text-green-600' : 'text-red-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="modalMode === 'approve'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-[#183b63]">{{ modalMode === 'approve' ? 'Approve' : 'Reject' }} {{ modalTarget === 'tender' ? 'Tender' : 'Quotation' }}</h3>
            <p class="text-xs text-[#7a93af]">{{ modalMode === 'approve' ? 'This action will approve the' : 'Please provide a reason for rejecting the' }} {{ modalTarget }}</p>
          </div>
        </div>
        <div v-if="modalMode === 'reject'" class="mb-4">
          <label class="mb-1 block text-sm font-medium text-[#4b6681]">Reason for Rejection</label>
          <textarea
            v-model="rejectionReason"
            rows="3"
            placeholder="Enter rejection reason..."
            class="w-full resize-none rounded-xl border border-[#d7e4f1] bg-white px-3 py-2 text-sm text-[#183b63] outline-none focus:border-[#2b74d7] focus:ring-4 focus:ring-[#2b74d7]/12"
          ></textarea>
        </div>
        <div class="flex gap-3">
          <button @click="closeModal" class="flex-1 rounded-xl border border-[#d7e4f1] py-2.5 text-sm font-medium text-[#4d6782] transition-colors hover:bg-[#f4f8ff]">Cancel</button>
          <button
            @click="confirmAction"
            :disabled="modalMode === 'reject' && !rejectionReason.trim() || submitting"
            :class="modalMode === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
            class="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            <span v-if="submitting">Processing...</span>
            <span v-else>{{ modalMode === 'approve' ? 'Approve' : 'Reject' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

// ── Data ─────────────────────────────────────────────────────────────────────
const tenders = ref([]);
const allQuotations = ref([]);
const loading = ref(true);

// ── List controls ─────────────────────────────────────────────────────────────
const searchQuery = ref('');
const activeTab = ref('all');
const currentPage = ref(1);
const itemsPerPage = 15;

// ── Detail panel ──────────────────────────────────────────────────────────────
const selectedTender = ref(null);

// ── Approval modal ────────────────────────────────────────────────────────────
const showModal = ref(false);
const modalMode = ref('approve');    // 'approve' | 'reject'
const modalTarget = ref('tender');   // 'tender' | 'quotation'
const modalItem = ref(null);         // the tender or quotation object
const rejectionReason = ref('');
const submitting = ref(false);

// ── Award modal ──────────────────────────────────────────────────────────────
const showAwardModal = ref(false);
const awardTender = ref(null);
const awardFile = ref(null);
const awardFileInput = ref(null);
const awardDragOver = ref(false);
const awardSubmitting = ref(false);

// ── Computed ──────────────────────────────────────────────────────────────────
const statusTabs = computed(() => [
  { label: 'All', value: 'all', count: tenders.value.length },
  { label: 'Quoted', value: 'quoted', count: tenders.value.filter(t => t.status === 'quoted').length },
  { label: 'Approved', value: 'approved', count: tenders.value.filter(t => t.status === 'approved').length },
  { label: 'Rejected', value: 'rejected', count: tenders.value.filter(t => t.status === 'rejected').length },
  { label: 'Submitted', value: 'submitted', count: tenders.value.filter(t => t.status === 'submitted').length },
  { label: 'Awarded', value: 'awarded', count: tenders.value.filter(t => t.status === 'awarded').length },
]);

const filteredTenders = computed(() => {
  let list = tenders.value;
  if (activeTab.value !== 'all') {
    list = list.filter(t => t.status === activeTab.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.tender_number?.toLowerCase().includes(q) ||
      t.tender_type?.toLowerCase().includes(q)
    );
  }
  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTenders.value.length / itemsPerPage)));

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTenders.value.slice(start, start + itemsPerPage);
});

const tenderQuotation = computed(() => {
  if (!selectedTender.value) return null;
  return selectedTender.value.quotation || null;
});

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchTenders(), fetchQuotations()]);
});

// ── API ───────────────────────────────────────────────────────────────────────
async function fetchTenders() {
  try {
    loading.value = true;
    const res = await axios.get('/api/ceo/quoted-tenders');
    tenders.value = res.data.data || [];
  } catch (e) {
    toast.error('Failed to load tenders');
  } finally {
    loading.value = false;
  }
}

async function fetchQuotations() {
  // Quotation data is now embedded in tenders from /api/ceo/quoted-tenders
  // This function kept for compatibility
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getQuotation(tenderId) {
  const tender = tenders.value.find(t => t.tender_id === tenderId);
  return tender?.quotation || null;
}

function formatDate(d) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(v) {
  if (!v) return 'TZS 0';
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
}

function statusBadge(status) {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-green-100 text-green-700';
    case 'passed':   return 'bg-green-100 text-green-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    case 'pending':  return 'bg-amber-100 text-amber-700';
    case 'quoted':   return 'bg-indigo-100 text-indigo-700';
    case 'submitted': return 'bg-emerald-100 text-emerald-700';
    case 'awarded':  return 'bg-[#e6f7f4] text-[#166d62]';
    default:         return 'bg-gray-100 text-gray-600';
  }
}

function getQuotationDocumentUrl(filePath) {
  if (!filePath) return null;
  return new URL(`storage/${filePath}`, axios.defaults.baseURL).toString();
}

function viewQuotationDocument(filePath) {
  const url = getQuotationDocumentUrl(filePath);
  if (!url) {
    toast.error('Quotation document is missing');
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

function viewAwardDocument(filePath) {
  if (!filePath) { toast.error('Award document is missing'); return; }
  const url = new URL(`storage/${filePath}`, axios.defaults.baseURL).toString();
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ── Award flow ────────────────────────────────────────────────────────────────
function openAwardModal(tender) {
  awardTender.value = tender;
  awardFile.value = null;
  awardDragOver.value = false;
  showAwardModal.value = true;
}

function closeAwardModal() {
  showAwardModal.value = false;
  awardTender.value = null;
  awardFile.value = null;
}

function handleAwardFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) awardFile.value = file;
}

function handleAwardFileDrop(e) {
  awardDragOver.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) awardFile.value = file;
}

async function submitAward() {
  if (!awardFile.value || !awardTender.value || awardSubmitting.value) return;
  awardSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('tender_id', awardTender.value.tender_id);
    formData.append('awarded_document', awardFile.value);
    const res = await axios.post('/api/ceo/tender-award', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.data.status === 200 || res.data.status === 'success') {
      toast.success('Tender awarded successfully');
      await fetchTenders();
      if (selectedTender.value) {
        selectedTender.value = tenders.value.find(t => t.tender_id === selectedTender.value.tender_id) || null;
      }
      closeAwardModal();
    } else {
      toast.error(res.data.message || 'Failed to award tender');
    }
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to award tender');
  } finally {
    awardSubmitting.value = false;
  }
}

// ── List controls ─────────────────────────────────────────────────────────────
function setTab(value) {
  activeTab.value = value;
  currentPage.value = 1;
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function openDetail(tender) {
  selectedTender.value = tender;
}

function closeDetail() {
  selectedTender.value = null;
}

// ── Approval flow ─────────────────────────────────────────────────────────────
function openApproval(item, target, mode) {
  modalItem.value = item;
  modalTarget.value = target;
  modalMode.value = mode;
  rejectionReason.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  modalItem.value = null;
  rejectionReason.value = '';
}

async function confirmAction() {
  if (submitting.value) return;
  submitting.value = true;
  try {
    if (modalTarget.value === 'tender') {
      const payload = {
        tender_id: modalItem.value.tender_id,
        status: modalMode.value === 'approve' ? 'approved' : 'rejected',
        reason: modalMode.value === 'reject' ? rejectionReason.value : null,
      };
      const res = await axios.post('/api/ceo/quotation-approval', payload);
      if (res.data.status === 200 || res.data.status === 'success') {
        toast.success(`Tender ${modalMode.value}d successfully`);
        await fetchTenders();
        if (selectedTender.value) {
          selectedTender.value = tenders.value.find(t => t.tender_id === selectedTender.value.tender_id) || null;
        }
      } else {
        toast.error(res.data.message || 'Action failed');
      }
    } else {
      const payload = {
        tender_id: modalItem.value.tender_id || selectedTender.value?.tender_id,
        status: modalMode.value === 'approve' ? 'approved' : 'rejected',
        reason: modalMode.value === 'reject' ? rejectionReason.value : null,
      };
      const res = await axios.post('/api/ceo/quotation-approval', payload);
      if (res.data.status === 200 || res.data.status === 'success') {
        toast.success(`Quotation ${modalMode.value}d successfully`);
        await fetchTenders();
        if (selectedTender.value) {
          selectedTender.value = tenders.value.find(t => t.tender_id === selectedTender.value.tender_id) || null;
        }
      } else {
        toast.error(res.data.message || 'Action failed');
      }
    }
    closeModal();
  } catch (e) {
    toast.error('Failed to process action');
    console.error(e);
  } finally {
    submitting.value = false;
  }
}

// ── Export ────────────────────────────────────────────────────────────────────
function exportData() {
  const rows = filteredTenders.value.map(t => ({
    'Tender Number': t.tender_number || '',
    'Title': t.title || '',
    'Type': t.tender_type || '',
    'Value (TZS)': t.value || 0,
    'Status': t.status || '',
    'Bid Deadline': t.bid_submission || '',
    'Created': t.created_at || '',
    'Has Quotation': getQuotation(t.tender_id) ? 'Yes' : 'No',
  }));
  if (!rows.length) return;
  const csv = [
    Object.keys(rows[0]).join(','),
    ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tenders_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.tenders-page-shell {
  background:
    radial-gradient(circle at top right, rgba(48, 120, 221, 0.08), transparent 22%),
    linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);
}

.tenders-frame {
  position: relative;
}

.tenders-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 34px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.tenders-hero {
  box-shadow: inset 0 -1px 0 rgba(220, 232, 245, 0.85);
}

.tenders-stat {
  box-shadow: 0 8px 18px rgba(18, 58, 99, 0.05);
}

.tenders-list-pane {
  position: relative;
}

.tenders-filter-bar {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(248, 251, 255, 0.94));
}

.tenders-filter-pill {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.tenders-search {
  box-shadow: inset 0 1px 2px rgba(14, 40, 79, 0.04), 0 1px 0 rgba(255, 255, 255, 0.8);
}

.tenders-list-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(43, 116, 215, 0.24) transparent;
}

.tenders-list-scroll::-webkit-scrollbar {
  width: 8px;
}

.tenders-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.tenders-list-scroll::-webkit-scrollbar-thumb {
  background: rgba(43, 116, 215, 0.18);
  border-radius: 9999px;
}

.tender-row {
  box-shadow: 0 10px 24px rgba(18, 58, 99, 0.05);
}

.tender-row__icon {
  border: 1px solid rgba(47, 120, 221, 0.1);
}

.tender-row__status {
  letter-spacing: 0.04em;
}

.tender-row__meta {
  row-gap: 0.4rem;
}
</style>
