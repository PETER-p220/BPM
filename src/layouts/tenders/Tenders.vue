<template>
  <div class="min-h-screen px-4 py-4 lg:px-5" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%); font-family:'DM Sans',sans-serif;">
    <div class="mx-auto flex flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white shadow-[0_28px_70px_rgba(18,58,99,0.14)]" style="max-width:1580px; height:calc(100vh - 32px);">

      <!-- HEADER -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] px-6 py-5 lg:px-7 flex-shrink-0" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%);">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="pointer-events-none absolute right-6 top-3 h-24 w-24 opacity-35" style="background-image:radial-gradient(#2b74d7 1.2px,transparent 1.2px);background-size:10px 10px;"></div>

        <div class="relative flex items-start justify-between gap-4 flex-wrap">
          <div class="flex min-w-0 items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2d6aaf]">Engineer Portal</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight text-[#183b63] lg:text-[28px]">Tenders</h1>
              <p class="mt-1.5 text-sm leading-6 text-[#67819d]">Browse tenders, click to view details, and submit quotations.</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 flex-wrap justify-end">
            <!-- <button v-if="!selectedTender || !selectedTender.status" @click="openQuotationModal(selectedTender || null)" class="inline-flex items-center gap-2 rounded-xl border border-[#c8dcf2] bg-[#edf4fb] px-4 py-2.5 text-sm font-semibold text-[#194f92] shadow-sm hover:bg-[#d6e9fb] transition-all">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Quote Tender
            </button> -->
            <button @click="openAssignModal(selectedTender)" class="inline-flex items-center gap-2 rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 text-sm font-semibold text-[#183b63] shadow-sm hover:bg-[#f2f8ff] transition-all">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Assign Tender
            </button>
            <button @click="router.push({ name: 'CreateTender' })" class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,96,182,0.22)] hover:brightness-105 transition-all" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Tender
            </button>
          </div>
        </div>

        <!-- Stat mini-cards -->
        <!-- <div class="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="tab in statusTabs.slice(1)" :key="tab.value"
            @click="setTab(tab.value)"
            :class="[
              'rounded-2xl border px-4 py-3 shadow-sm cursor-pointer transition-all',
              tab.value === 'awarded' ? 'border-[#1f9d8b]/20 bg-[#f0fdf9]' : 'border-[#dbe7f3] bg-white hover:bg-[#f7faff]',
              activeTab === tab.value ? 'ring-2 ring-[#2f78dd]/30' : ''
            ]"
          >
            <p :class="['text-[10px] font-semibold uppercase tracking-[0.18em]', tab.value === 'awarded' ? 'text-[#1f9d8b]' : 'text-[#7a93af]']">{{ tab.label }}</p>
            <p :class="['mt-1 text-lg font-bold', tab.value === 'awarded' ? 'text-[#166d62]' : 'text-[#183b63]']">{{ tab.count }}</p>
          </div>
        </div> -->
      </div>

      <!-- SPLIT BODY -->
      <div class="flex flex-1 min-h-0">

        <!-- LEFT: Tender List -->
        <div :class="selectedTender ? 'w-1/2 lg:w-[55%]' : 'w-full'" class="flex min-h-0 flex-col overflow-hidden border-r border-[#e4edf6] transition-all duration-300" style="background:linear-gradient(180deg,#fbfdff 0%,#f7fbff 100%);">

          <!-- Filter bar -->
          <div class="border-b border-[#e6eef7] px-5 pb-3 pt-4 space-y-3 flex-shrink-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button v-for="tab in statusTabs" :key="tab.value" @click="setTab(tab.value)"
                :class="[
                  'rounded-full px-4 py-1.5 text-xs font-semibold transition-all border',
                  activeTab === tab.value
                    ? 'border-[#1d5aa5] text-white shadow-[0_10px_22px_rgba(35,96,182,0.18)]'
                    : 'border-[#d7e4f1] bg-white text-[#5f7892] hover:border-[#aac6e8] hover:bg-[#f2f8ff]'
                ]"
                :style="activeTab === tab.value ? 'background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%)' : ''"
              >
                {{ tab.label }}<span v-if="tab.count > 0" class="ml-1 opacity-75">({{ tab.count }})</span>
              </button>
            </div>
            <div class="flex items-center gap-3">
              <div class="relative flex-1">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87a0bb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="filter" type="text" placeholder="Search by title, number, type or entity..."
                  class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 pl-10 text-sm text-[#183b63] placeholder-[#99afc5] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/10"
                />
              </div>
              <button @click="exportToExcel" :disabled="loading || !filteredTenders.length" class="inline-flex items-center gap-2 rounded-xl border border-[#d7e4f1] bg-white px-3 py-2.5 text-xs font-semibold text-[#183b63] shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-all flex-shrink-0">
                <svg class="w-4 h-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <div v-for="i in 6" :key="i" class="animate-pulse rounded-[22px] border border-[#e3edf7] bg-white p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-[#dfeaf6] rounded-2xl flex-shrink-0"></div>
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
            <p class="mt-1 text-xs text-[#8aa0b7]">Try adjusting your filters or add a new tender</p>
          </div>

          <!-- Tender cards -->
          <div v-else class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <div
              v-for="tender in paginatedTenders"
              :key="tender.tender_id"
              @click="openDetail(tender)"
              :class="[
                'cursor-pointer rounded-[22px] border p-4 transition-all duration-150 shadow-sm',
                selectedTender && selectedTender.tender_id === tender.tender_id
                  ? 'border-[#2b74d7] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)] shadow-[0_16px_30px_rgba(35,96,182,0.12)]'
                  : 'border-[#e1eaf4] bg-white hover:border-[#9fbfe4] hover:bg-[#fbfdff] hover:shadow-[0_12px_24px_rgba(18,58,99,0.08)]'
              ]"
            >
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  :style="selectedTender && selectedTender.tender_id === tender.tender_id ? 'background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%)' : 'background:#edf4ff'">
                  <svg class="w-5 h-5"
                    :class="selectedTender && selectedTender.tender_id === tender.tender_id ? 'text-white' : 'text-blue-600'"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-[#183b63]">{{ tender.title || '—' }}</p>
                      <p class="mt-0.5 text-xs text-[#7d93ab]">{{ tender.tender_number || 'No number' }}</p>
                    </div>
                    <span :class="statusBadgeClass(tender.status)" class="px-2.5 py-0.5 text-xs font-semibold rounded-full flex-shrink-0">
                      {{ tender.status?.toUpperCase() || 'PENDING' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 mt-2 flex-wrap">
                    <span class="rounded-full bg-[#f2f7fd] px-2.5 py-0.5 text-[11px] font-medium text-[#5f7892]">{{ tender.tender_type || 'General' }}</span>
                    <span class="text-xs text-[#c1cfdd]">·</span>
                    <span class="text-xs text-[#6f86a0]">Deadline: {{ formatDate(tender.expired_at) }}</span>
                    <span class="text-xs text-[#c1cfdd]">·</span>
                    <span class="text-xs text-[#6f86a0] truncate max-w-[120px]">{{ tender.procurement_entity || '—' }}</span>
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
        <div v-if="selectedTender" class="w-1/2 lg:w-[45%] flex flex-col overflow-hidden border-l border-[#e4edf6]" style="background:linear-gradient(180deg,#f7fbff 0%,#ffffff 100%);">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between border-b border-[#e4edf6] px-5 py-4 flex-shrink-0" style="background:linear-gradient(135deg,#eff6ff 0%,#ffffff 100%);">
            <div>
              <h2 class="text-sm font-bold text-[#183b63]">Tender Details</h2>
              <p class="mt-0.5 text-[11px] text-[#7a93af]">Click "Quote This Tender" below to submit a quotation</p>
            </div>
            <button @click="closeDetail" class="rounded-xl border border-[#d5e3f0] bg-white p-2 text-[#7a93af] transition-colors hover:bg-[#eef5ff] hover:text-[#183b63]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-4">

            <!-- Title block -->
            <div class="rounded-[22px] border border-[#dce7f3] bg-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_12px_24px_rgba(35,96,182,0.18)]" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-[#183b63] text-sm leading-snug">{{ selectedTender.title || '—' }}</p>
                  <p class="text-xs text-[#7d93ab] mt-0.5">{{ selectedTender.tender_number || 'No number' }}</p>
                  <div class="mt-2">
                    <span :class="statusBadgeClass(selectedTender.status)" class="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full">
                      {{ selectedTender.status?.toUpperCase() || 'PENDING' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-2xl border border-[#dce7f3] bg-white px-4 py-3 shadow-sm">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Type</p>
                <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ selectedTender.tender_type || '—' }}</p>
              </div>
              <div class="rounded-2xl border border-[#dce7f3] bg-white px-4 py-3 shadow-sm">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Deadline</p>
                <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ formatDate(selectedTender.expired_at) }}</p>
                <span :class="expiryBadge(selectedTender.expired_at)" class="mt-1 inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border">
                  {{ expiryLabel(selectedTender.expired_at) }}
                </span>
              </div>
              <div class="col-span-2 rounded-2xl border border-[#dce7f3] bg-white px-4 py-3 shadow-sm">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Procurement Entity</p>
                <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ selectedTender.procurement_entity || '—' }}</p>
              </div>
              <div class="rounded-2xl border border-[#dce7f3] bg-white px-4 py-3 shadow-sm">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Published</p>
                <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ formatDate(selectedTender.date_of_Publication) }}</p>
              </div>
              <div class="rounded-2xl border border-[#dce7f3] bg-white px-4 py-3 shadow-sm">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Bid Submission</p>
                <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ formatDate(selectedTender.bid_submission) }}</p>
              </div>
            </div>

            <!-- Assigned user -->
            <div v-if="selectedTender.user" class="rounded-[22px] border border-[#dce7f3] bg-white p-4 shadow-sm">
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Assigned To</p>
              <p class="mt-1 text-sm font-semibold text-[#183b63]">{{ selectedTender.user.name }}</p>
              <p class="text-xs text-[#6f86a0]">{{ selectedTender.user.email }}</p>
            </div>

            <!-- Attachment -->
            <div v-if="selectedTender.attachment" class="rounded-[22px] border border-[#dce7f3] bg-white p-4 shadow-sm">
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac] mb-2">Tender Document</p>
              <a :href="selectedTender.attachment" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-xl border border-[#d5e3f0] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-[#1f5aa6] transition-colors hover:bg-[#eef5ff]">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Document
              </a>
            </div>

            <!-- Status banners -->
            <div v-if="selectedTender.status === 'awarded'" class="flex items-center gap-2 rounded-2xl border border-[#1f9d8b]/20 bg-[#f0fdf9] px-3 py-2.5 shadow-sm">
              <svg class="w-4 h-4 text-[#1f9d8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p class="text-sm text-[#166d62] font-medium">This tender has been awarded</p>
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
          </div>

          <!-- Drawer Footer -->
          <div class="border-t border-[#e4edf6] px-5 py-4 flex-shrink-0" style="background:linear-gradient(135deg,#f8fbff 0%,#ffffff 100%);">
            <!-- Only pending (unassigned) tenders can be quoted -->
            <button
              v-if="!selectedTender.status"
              @click="openQuotationModal(selectedTender)"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,96,182,0.22)] hover:brightness-105 transition-all"
              style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Quote This Tender
            </button>
            <!-- Assigned to engineer — quoting not available -->
            <div v-else-if="selectedTender.status === 'on-progress'" class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              <p class="text-xs text-amber-700 font-medium">Assigned to an engineer — quoting is handled by the engineer</p>
            </div>
            <!-- Already quoted or further along —cannot re-quote -->
            <div v-else class="flex items-center gap-2 rounded-xl border border-[#d7e4f1] bg-[#f7faff] px-4 py-3">
              <svg class="w-4 h-4 text-[#5f7892] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" /></svg>
              <p class="text-xs text-[#5f7892] font-medium">Quotation already submitted — status: <span class="font-bold uppercase">{{ selectedTender.status }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ASSIGN TENDER MODAL -->
    <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183b63]/40 backdrop-blur-[6px]">
      <div class="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_30px_70px_rgba(18,58,99,0.24)] w-full max-w-md overflow-hidden">
        <!-- Modal Header -->
        <div class="px-6 py-4 flex items-center justify-between" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Assign Tender</h3>
              <p class="text-xs text-white/70">Assign to an engineer / project manager</p>
            </div>
          </div>
          <button @click="closeAssignModal" class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <!-- Tender selector -->
          <div v-if="!assignModalTender">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Select Tender <span class="text-red-500">*</span></label>
            <select v-model="assignData.tender_id" class="w-full px-3 py-2.5 text-sm border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/20 focus:border-[#2f78dd] outline-none bg-white text-[#183b63]">
              <option value="" disabled>Choose a tender</option>
              <option v-for="t in tenders" :key="t.tender_id" :value="t.tender_id">{{ t.title || t.tender_number || 'Tender #' + t.tender_id }}</option>
            </select>
          </div>
          <div v-else class="bg-[#f7faff] rounded-lg px-4 py-3 border border-[#d9e6f3]">
            <p class="text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em] mb-1">Tender</p>
            <p class="text-sm font-semibold text-[#183b63]">{{ assignModalTender.title }}</p>
            <p class="text-xs text-gray-500">{{ assignModalTender.tender_number || 'No number' }}</p>
          </div>

          <!-- Engineer search input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Search Engineer / Project Manager <span class="text-red-500">*</span></label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87a0bb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="engineerSearch" type="text" placeholder="Type engineer name..."
                class="w-full rounded-xl border border-[#d7e4f1] bg-white px-4 py-2.5 pl-10 text-sm text-[#183b63] placeholder-[#99afc5] shadow-[inset_0_1px_2px_rgba(14,40,79,0.04)] focus:border-[#2b74d7] focus:outline-none focus:ring-4 focus:ring-[#2b74d7]/10"
              />
            </div>
          </div>

          <!-- Engineer list -->
          <div class="max-h-52 overflow-y-auto space-y-1.5 rounded-xl border border-[#e4edf6] bg-[#f9fbff] p-2">
            <div v-if="engineersLoading" class="py-4 text-center text-sm text-[#7a93af]">Loading engineers...</div>
            <div v-else-if="filteredEngineers.length === 0" class="py-4 text-center text-sm text-[#7a93af]">No engineers found</div>
            <button
              v-for="eng in filteredEngineers"
              :key="eng.user_id"
              type="button"
              @click="assignData.user_id = eng.user_id"
              :class="[
                'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all border',
                assignData.user_id === eng.user_id
                  ? 'border-[#2b74d7] bg-[#eff6ff] shadow-sm'
                  : 'border-transparent bg-white hover:border-[#c8dcf2] hover:bg-[#f4f9ff]'
              ]"
            >
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">{{ eng.name.charAt(0).toUpperCase() }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-[#183b63] truncate">{{ eng.name }}</p>
              </div>
              <svg v-if="assignData.user_id === eng.user_id" class="w-4 h-4 text-[#2b74d7] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </button>
          </div>
        </div>

        <div class="px-6 pb-6 flex gap-3">
          <button @click="closeAssignModal" class="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            @click="submitAssignment"
            :disabled="assignSubmitting || !assignData.user_id || (!assignModalTender && !assignData.tender_id)"
            class="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2 hover:brightness-105"
            style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);"
          >
            <svg v-if="assignSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span>{{ assignSubmitting ? 'Assigning...' : 'Assign Tender' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- QUOTATION MODAL -->
    <div v-if="showQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183b63]/40 backdrop-blur-[6px]">
      <div class="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_30px_70px_rgba(18,58,99,0.24)] w-full max-w-lg overflow-hidden">
        <div class="px-6 py-4 flex items-center justify-between" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Submit Quotation</h3>
              <p v-if="quotationTender" class="text-xs text-white/70 truncate max-w-xs">{{ quotationTender.title }}</p>
              <p v-else class="text-xs text-white/70">Select a tender to quote</p>
            </div>
          </div>
          <button @click="closeQuotationModal" class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <p class="text-sm text-gray-500">Upload your Excel quotation file. All required fields are marked with <span class="text-red-500">*</span>.</p>

          <div v-if="!quotationTender">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Select Tender <span class="text-red-500">*</span></label>
            <select v-model="quotationData.tender_id" class="w-full px-3 py-2.5 text-sm border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/20 focus:border-[#2f78dd] outline-none bg-white text-[#183b63]">
              <option value="" disabled>Choose a pending tender</option>
              <option v-for="t in pendingTenders" :key="t.tender_id" :value="t.tender_id">{{ t.title || t.tender_number || 'Tender #' + t.tender_id }}</option>
            </select>
            <p v-if="!pendingTenders.length" class="mt-1.5 text-xs text-amber-600">No pending (unassigned) tenders available to quote.</p>
          </div>

          <div v-else class="bg-[#f7faff] rounded-lg px-4 py-3 border border-[#d9e6f3]">
            <p class="text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em] mb-1">Linked Tender</p>
            <p class="text-sm font-semibold text-[#183b63]">{{ quotationTender.title }}</p>
            <p class="text-xs text-gray-500">{{ quotationTender.tender_number || 'No number' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Select Project <span class="text-red-500">*</span></label>
            <select v-model="quotationData.project_id" class="w-full px-3 py-2.5 text-sm border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/20 focus:border-[#2f78dd] outline-none bg-white text-[#183b63]">
              <option value="" disabled>Choose a project</option>
              <option v-for="p in projects" :key="p.project_id" :value="p.project_id">{{ p.project_name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Upload Excel File (.xlsx / .xls) <span class="text-red-500">*</span></label>
            <div
              class="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
              :class="quotationData.excel_file ? 'border-[#1f9d8b] bg-[#f0fdf9]' : 'border-[#d9e6f3] hover:border-[#2f78dd]/50 bg-[#f7faff]'"
              @dragover.prevent
              @drop.prevent="handleQuotationDrop"
              @click="$refs.quotationFileInput.click()"
            >
              <input ref="quotationFileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleQuotationFile" />
              <div v-if="!quotationData.excel_file" class="space-y-2">
                <svg class="w-10 h-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-[#7a93af]">Drag & drop or <span class="text-[#2f78dd] font-medium">browse</span></p>
                <p class="text-xs text-gray-400">.xlsx or .xls only · Max 10MB</p>
              </div>
              <div v-else class="flex items-center justify-center gap-3 text-green-700">
                <svg class="w-8 h-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <div class="text-left">
                  <p class="text-sm font-medium">{{ quotationData.excel_file.name }}</p>
                  <p class="text-xs text-gray-500">{{ (quotationData.excel_file.size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
                <button type="button" @click.stop="clearQuotationFile" class="ml-auto text-red-500 hover:text-red-700">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 pb-6 flex gap-3">
          <button @click="closeQuotationModal" class="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            @click="submitQuotation"
            :disabled="quotationSubmitting || !quotationData.project_id || (!quotationTender && !quotationData.tender_id) || !quotationData.excel_file"
            class="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2 hover:brightness-105"
            style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);"
          >
            <svg v-if="quotationSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span>{{ quotationSubmitting ? 'Submitting...' : 'Submit Quotation' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'

const router = useRouter()
const toast = useToast()

const tenders = ref([])
const loading = ref(false)
const filter = ref('')
const activeTab = ref('all')
const currentPage = ref(1)
const itemsPerPage = 15

const selectedTender = ref(null)

const showAssignModal = ref(false)
const assignModalTender = ref(null)
const engineers = ref([])
const engineerSearch = ref('')
const engineersLoading = ref(false)
const assignData = ref({ tender_id: '', user_id: null })
const assignSubmitting = ref(false)

const filteredEngineers = computed(() => {
  const q = engineerSearch.value.trim().toLowerCase()
  const list = q ? engineers.value.filter(e => e.name.toLowerCase().includes(q)) : engineers.value
  return list.slice(0, 2)
})

// Only unassigned (pending) tenders can be quoted
const pendingTenders = computed(() => tenders.value.filter(t => !t.status))

const showQuotationModal = ref(false)
const quotationTender = ref(null)
const projects = ref([])
const quotationData = ref({ project_id: '', tender_id: null, excel_file: null })
const quotationSubmitting = ref(false)
const quotationFileInput = ref(null)

const statusTabs = computed(() => [
  { label: 'All',       value: 'all',       count: tenders.value.length },
  { label: 'Active',    value: 'active',    count: tenders.value.filter(t => isActive(t)).length },
  { label: 'Quoted',    value: 'quoted',    count: tenders.value.filter(t => t.status === 'quoted').length },
  { label: 'Submitted', value: 'submitted', count: tenders.value.filter(t => t.status === 'submitted').length },
  { label: 'Approved',  value: 'approved',  count: tenders.value.filter(t => t.status === 'approved').length },
  { label: 'Awarded',   value: 'awarded',   count: tenders.value.filter(t => t.status === 'awarded').length },
  { label: 'Expired',   value: 'expired',   count: tenders.value.filter(t => isExpired(t)).length },
])

const filteredTenders = computed(() => {
  let list = tenders.value
  if (activeTab.value === 'active')       list = list.filter(t => isActive(t))
  else if (activeTab.value === 'expired') list = list.filter(t => isExpired(t))
  else if (activeTab.value !== 'all')     list = list.filter(t => t.status === activeTab.value)
  if (filter.value.trim()) {
    const q = filter.value.toLowerCase()
    list = list.filter(t =>
      [t.title, t.tender_type, t.tender_number, t.procurement_entity].some(v => v?.toLowerCase().includes(q))
    )
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTenders.value.length / itemsPerPage)))
const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTenders.value.slice(start, start + itemsPerPage)
})

onMounted(async () => {
  await fetchTenders()
  fetchProjects()
})

async function fetchTenders() {
  loading.value = true
  try {
    const { data } = await axios.get('/api/tenders')
    tenders.value = data.data || []
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to load tenders')
  } finally {
    loading.value = false
  }
}

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/dropdown/projects')
    projects.value = data?.data || []
  } catch {
    // non-critical
  }
}

async function fetchEngineers() {
  if (engineers.value.length) return
  engineersLoading.value = true
  try {
    const { data } = await axios.get('/api/dropdown/engineer')
    engineers.value = data.users || []
  } catch {
    toast.error('Failed to load engineers')
  } finally {
    engineersLoading.value = false
  }
}

function openAssignModal(tender) {
  assignModalTender.value = tender || null
  assignData.value = { tender_id: tender ? tender.tender_id : '', user_id: null }
  engineerSearch.value = ''
  showAssignModal.value = true
  fetchEngineers()
}

function closeAssignModal() {
  showAssignModal.value = false
  assignModalTender.value = null
  assignData.value = { tender_id: '', user_id: null }
  engineerSearch.value = ''
}

async function submitAssignment() {
  const effectiveTenderId = assignModalTender.value ? assignModalTender.value.tender_id : assignData.value.tender_id
  if (!effectiveTenderId || !assignData.value.user_id) {
    toast.warning('Please select a tender and an engineer')
    return
  }
  assignSubmitting.value = true
  try {
    const res = await axios.post('/api/assign/tender', {
      tender_id: effectiveTenderId,
      user_id: assignData.value.user_id
    })
    toast.success(res.data.message || 'Tender assigned successfully')
    closeAssignModal()
    await fetchTenders()
  } catch (err) {
    const msg = err.response?.data?.errors?.tender_id?.[0] || err.response?.data?.message || 'Failed to assign tender'
    toast.error(msg)
  } finally {
    assignSubmitting.value = false
  }
}

function openDetail(tender) { selectedTender.value = tender }
function closeDetail() { selectedTender.value = null }

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysLeft(expiredAt) {
  if (!expiredAt) return null
  return Math.ceil((new Date(expiredAt) - new Date()) / (1000 * 60 * 60 * 24))
}

function isExpired(t)  { const d = daysLeft(t.expired_at); return d !== null && d < 0 }
function isActive(t)   { const d = daysLeft(t.expired_at); return d === null || d > 7 }

function expiryBadge(expiredAt) {
  const d = daysLeft(expiredAt)
  if (d === null) return 'bg-gray-100 text-gray-600 border-gray-200'
  if (d < 0)  return 'bg-red-100 text-red-700 border-red-200'
  if (d <= 7) return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

function expiryLabel(expiredAt) {
  const d = daysLeft(expiredAt)
  if (d === null) return 'No deadline'
  if (d < 0)  return 'Expired'
  if (d === 0) return 'Due today'
  if (d <= 7) return d + 'd left'
  return 'Active'
}

function statusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'quoted':       return 'bg-indigo-100 text-indigo-700'
    case 'submitted':    return 'bg-emerald-100 text-emerald-700'
    case 'approved':     return 'bg-green-100 text-green-700'
    case 'rejected':     return 'bg-red-100 text-red-700'
    case 'awarded':      return 'bg-[#e6f7f4] text-[#166d62]'
    case 'on-progress':  return 'bg-amber-100 text-amber-700'
    case 'pending':      return 'bg-amber-100 text-amber-700'
    default:             return 'bg-gray-100 text-gray-600'
  }
}

function capitalize(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function setTab(value) {
  activeTab.value = value
  currentPage.value = 1
  selectedTender.value = null
}

function openQuotationModal(tender) {
  quotationTender.value = tender
  quotationData.value = { project_id: '', tender_id: tender ? tender.tender_id : null, excel_file: null }
  showQuotationModal.value = true
}

function closeQuotationModal() {
  showQuotationModal.value = false
  quotationTender.value = null
  quotationData.value = { project_id: '', tender_id: null, excel_file: null }
  if (quotationFileInput.value) quotationFileInput.value.value = ''
}

function handleQuotationFile(e) { validateAndSetFile(e.target.files[0]) }
function handleQuotationDrop(e) { validateAndSetFile(e.dataTransfer.files[0]) }

function validateAndSetFile(file) {
  if (!file) return
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  if (!validTypes.includes(file.type)) { toast.error('Only Excel files (.xlsx or .xls) are allowed'); return }
  if (file.size > 10 * 1024 * 1024) { toast.error('File size must not exceed 10MB'); return }
  quotationData.value.excel_file = file
}

function clearQuotationFile() {
  quotationData.value.excel_file = null
  if (quotationFileInput.value) quotationFileInput.value.value = ''
}

async function submitQuotation() {
  const effectiveTenderId = quotationTender.value ? quotationTender.value.tender_id : quotationData.value.tender_id
  if (!quotationData.value.project_id || !effectiveTenderId || !quotationData.value.excel_file) {
    toast.warning('Please fill all required fields')
    return
  }
  // Guard: can only quote a pending (unassigned) tender
  const tender = quotationTender.value || tenders.value.find(t => t.tender_id === effectiveTenderId)
  if (tender?.status) {
    toast.error('This tender has already been assigned/quoted and cannot be quoted again')
    return
  }
  quotationSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('project_id', quotationData.value.project_id)
    formData.append('tender_id', effectiveTenderId)
    formData.append('excel_file', quotationData.value.excel_file)
    const res = await axios.post('/api/analysis', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success(res.data.message || 'Quotation submitted (' + (res.data.rows_imported || 0) + ' rows imported)')
    closeQuotationModal()
    await fetchTenders()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to submit quotation')
  } finally {
    quotationSubmitting.value = false
  }
}

function exportToExcel() {
  if (!filteredTenders.value.length) return toast.warning('No data to export')
  const rows = filteredTenders.value.map((t, i) => ({
    No: i + 1,
    Title: t.title || '—',
    Type: t.tender_type || '—',
    Number: t.tender_number || '—',
    Entity: t.procurement_entity || '—',
    Document: t.attachment ? 'Yes' : 'No',
    Published: formatDate(t.date_of_Publication),
    'Bid Submission': formatDate(t.bid_submission),
    Deadline: formatDate(t.expired_at),
    Status: t.status || expiryLabel(t.expired_at),
    Created: formatDate(t.created_at)
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tenders')
  XLSX.writeFile(wb, 'Tenders_' + new Date().toISOString().split('T')[0] + '.xlsx')
  toast.success('Excel exported')
}
</script>
