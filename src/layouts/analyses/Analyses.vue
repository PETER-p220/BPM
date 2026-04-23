<template>
  <div class="analyses-page min-h-screen bg-[#edf4fb] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Header + Filter + Export -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] shadow-[0_4px_12px_rgba(25,79,146,0.25)]">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div>
            <h1 class="text-[22px] font-bold tracking-tight text-[#183b63]">Project Analyses</h1>
            <p class="mt-0.5 text-[13px] text-[#7a93af]">Review quoted vs actual costs and approve or reject project analyses</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Export Buttons -->
          <div class="flex gap-2">
            <button
              @click="exportToExcel"
              :disabled="!allProjects.length || loading"
              class="inline-flex items-center gap-1.5 rounded-xl border border-[#d9e6f3] bg-white px-4 py-2 text-[13px] font-semibold text-[#1f9d8b] shadow-sm transition hover:bg-[#f0fdf9] hover:border-[#1f9d8b]/30 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export to Excel"
            >
              <i class="fas fa-file-excel"></i>
              <span class="hidden sm:inline">Excel</span>
            </button>
            <button
              @click="exportToPDF"
              :disabled="!allProjects.length || loading"
              class="inline-flex items-center gap-1.5 rounded-xl border border-[#d9e6f3] bg-white px-4 py-2 text-[13px] font-semibold text-[#d95f43] shadow-sm transition hover:bg-[#fef5f3] hover:border-[#d95f43]/30 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export to PDF"
            >
              <i class="fas fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-80">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a93af]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              v-model.trim="filter"
              type="search"
              placeholder="Search project name..."
              class="block w-full rounded-xl border border-[#d9e6f3] bg-white/90 py-2.5 pl-10 pr-4 text-sm text-[#183b63] shadow-[0_2px_8px_rgba(18,58,99,0.04)] outline-none transition placeholder:text-[#a4b8cf] focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-24">
        <div class="flex items-center gap-3 text-[#7a93af]">
          <i class="fa fa-spinner fa-spin text-2xl text-[#2f78dd]"></i>
          <span class="text-lg">Loading project analyses...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!filteredProjects.length"
        class="rounded-2xl border border-[#dbe7f3] bg-white/95 shadow-[0_8px_18px_rgba(18,58,99,0.05)] p-12 text-center"
      >
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4fb]">
          <svg class="h-7 w-7 text-[#7d94ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 class="text-[15px] font-semibold text-[#183b63] mb-2">
          {{ filter ? 'No matching projects found' : 'No analyses available' }}
        </h3>
        <p class="text-[13px] text-[#7a93af]">
          {{ filter ? 'Try a different search term' : 'New analyses will appear here once submitted' }}
        </p>
      </div>

      <!-- ══════════════════════════════════════════════
           PROJECTS SUMMARY TABLE
      ══════════════════════════════════════════════ -->
      <div v-else class="rounded-2xl border border-[#dbe7f3] bg-white/95 shadow-[0_8px_18px_rgba(18,58,99,0.05)] overflow-hidden">
        <div class="bg-[#f7faff] border-b border-[#e4edf7] px-6 py-4 flex items-center justify-between">
          <h2 class="text-[13px] font-semibold text-[#183b63] flex items-center gap-2">
            <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            All Project Analyses
          </h2>
          <span class="rounded-full bg-[#edf4fb] px-3 py-1 text-[11px] font-semibold text-[#2f78dd]">
            {{ filteredProjects.length }} of {{ allProjects.length }} projects
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-[#f7faff] border-b border-[#e4edf7]">
                <th class="th" style="min-width:50px;">#</th>
                <th class="th" style="min-width:220px;">Project Name</th>
                <th class="th text-center" style="min-width:130px;">Manager</th>
                <th class="th text-center" style="min-width:110px;">Status</th>
                <th class="th text-center" style="min-width:80px;">Items</th>
                <th class="th text-right" style="min-width:150px;">VAT Excl</th>
                <th class="th text-right" style="min-width:150px;">VAT Incl</th>
                <th class="th text-right" style="min-width:150px;">Projected Profit</th>
                <th class="th text-center" style="min-width:120px;">Created</th>
                <th class="th text-center" style="min-width:130px;">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2fa]">
              <tr
                v-for="(project, index) in filteredProjects"
                :key="project.project_id"
                class="transition-colors hover:bg-[#f7faff]"
              >
                <!-- # -->
                <td class="td text-center text-[#7d94ac] font-medium text-xs">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <!-- Project Name -->
                <td class="td">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#edf4fb] rounded-lg flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-folder text-[#2f78dd] text-sm"></i>
                    </div>
                    <div class="font-semibold text-[#183b63] leading-tight">
                      {{ project.project?.project_name || 'Unnamed Project' }}
                    </div>
                  </div>
                </td>

                <!-- Manager -->
                <td class="td text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <div class="w-6 h-6 bg-[#edf4fb] rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-[#7d94ac] text-xs"></i>
                    </div>
                    <span class="text-sm text-[#4a6a8a]">{{ project.user?.name || '—' }}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="td text-center">
                  <span :class="statusBadgeClass(project.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border">
                    <i :class="statusIconClass(project.status)" class="mr-1 text-xs"></i>
                    {{ project.status }}
                  </span>
                </td>

                <!-- Items -->
                <td class="td text-center">
                  <span class="bg-[#edf4fb] text-[#2f78dd] text-xs font-semibold px-2.5 py-1 rounded-full">
                    {{ project.items?.length || 0 }}
                  </span>
                </td>

                <!-- VAT Excl -->
                <td class="td text-right font-medium text-[#2f78dd] tabular-nums">
                  {{ formatCurrency(project.total_amount_vat_excl) }}
                </td>

                <!-- VAT Incl -->
                <td class="td text-right font-medium text-[#1f9d8b] tabular-nums">
                  {{ formatCurrency(project.total_amount_vat_incl) }}
                </td>

                <!-- Projected Profit -->
                <td class="td text-right tabular-nums">
                  <span :class="parseFloat(project.projected_profit || 0) >= 0 ? 'text-[#1f9d8b]' : 'text-[#d95f43]'" class="font-semibold">
                    {{ formatCurrency(project.projected_profit) }}
                  </span>
                  <div class="text-xs text-[#7d94ac]">({{ project.projected_profit_percentage || 0 }}%)</div>
                </td>

                <!-- Created -->
                <td class="td text-center text-sm text-[#4a6a8a]">
                  {{ formatDate(project.created_at) }}
                </td>

                <!-- Actions -->
                <td class="td text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="openDetailModal(project)"
                      class="view-btn group"
                      title="View full analysis"
                    >
                      <i class="fas fa-eye mr-1.5 group-hover:scale-110 transition-transform duration-150"></i>
                      View
                    </button>
                    <button
                      v-if="project.status === 'pending'"
                      @click="openApprovalDialog(project.project_id)"
                      class="review-btn"
                      title="Review project"
                    >
                      <i class="fa fa-check-circle mr-1.5"></i>
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] shadow-sm transition hover:bg-[#f7faff] disabled:opacity-40"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="text-[13px] font-semibold text-[#183b63]">
          Page {{ currentPage }} of {{ Math.ceil(allProjects.length / itemsPerPage) }}
        </span>
        <button
          :disabled="currentPage * itemsPerPage >= allProjects.length"
          @click="changePage(currentPage + 1)"
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] shadow-sm transition hover:bg-[#f7faff] disabled:opacity-40"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         FULL PROJECT DETAIL MODAL
    ══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDetailModal && detailProject"
          class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-[#183b63]/40 backdrop-blur-[6px]"
          @click.self="closeDetailModal"
        >
          <div class="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_30px_70px_rgba(18,58,99,0.24)] w-full max-w-6xl max-h-[88vh] flex flex-col overflow-hidden">

            <!-- Modal Header -->
            <div class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-6 py-4 flex-shrink-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg font-semibold text-white truncate">
                    {{ detailProject.project?.project_name || 'Unnamed Project' }}
                  </h2>
                  <div class="flex flex-wrap gap-4 text-sm text-white/70 mt-1">
                    <div class="flex items-center gap-1.5">
                      <i class="fas fa-user-circle"></i>
                      <span>{{ detailProject.user?.name || '—' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="fas fa-calendar-alt"></i>
                      <span>Created: {{ formatDate(detailProject.created_at) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <span :class="statusBadgeClass(detailProject.status)" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm">
                    <i :class="statusIconClass(detailProject.status)" class="mr-1"></i>
                    {{ detailProject.status }}
                  </span>
                  <!-- Review button inside modal for pending -->
                  <button
                    v-if="detailProject.status === 'pending'"
                    @click="openApprovalDialog(detailProject.project_id)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <i class="fa fa-check-circle"></i>
                    Review
                  </button>
                  <button
                    @click="closeDetailModal"
                    class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    title="Close"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <!-- Rejection Reason -->
              <div
                v-if="detailProject.status === 'rejected' && detailProject.reason_for_reject"
                class="mt-3 bg-[#d95f43]/10 border border-[#d95f43]/20 rounded-lg p-3"
              >
                <p class="text-sm text-white/90">
                  <i class="fas fa-exclamation-circle mr-2"></i>
                  <strong>Reason for rejection:</strong> {{ detailProject.reason_for_reject }}
                </p>
              </div>
            </div>

            <!-- Modal Scrollable Body -->
            <div class="overflow-y-auto flex-1 p-6 space-y-6">

              <!-- Financial Summary -->
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div class="fin-card bg-[#edf4fb] border-[#d9e6f3]">
                  <p class="fin-label text-[#2f78dd]">VAT Excl</p>
                  <p class="fin-value text-[#194f92]">{{ formatCurrency(detailProject.total_amount_vat_excl) }}</p>
                </div>
                <div class="fin-card bg-[#f0fdf9] border-[#a7f3d0]">
                  <p class="fin-label text-[#1f9d8b]">VAT Incl</p>
                  <p class="fin-value text-[#0f766e]">{{ formatCurrency(detailProject.total_amount_vat_incl) }}</p>
                </div>
                <div class="fin-card bg-[#faf5ff] border-[#e9d5ff]">
                  <p class="fin-label text-[#7c3aed]">Amount Needed</p>
                  <p class="fin-value text-[#5b21b6]">{{ formatCurrency(detailProject.total_amount_needed) }}</p>
                </div>
                <div class="fin-card bg-[#fdf8ee] border-[#f3e0a3]">
                  <p class="fin-label text-[#d7a12c]">Contingency</p>
                  <p class="fin-value text-[#92702a]">{{ formatCurrency(detailProject.site_contingency) }}</p>
                </div>
                <div class="fin-card bg-[#edf4fb] border-[#d9e6f3]">
                  <p class="fin-label text-[#194f92]">Total Investment</p>
                  <p class="fin-value text-[#183b63]">{{ formatCurrency(detailProject.total_investment) }}</p>
                </div>
                <div class="fin-card bg-[#f0fdf9] border-[#a7f3d0]">
                  <p class="fin-label text-[#1f9d8b]">Projected Profit</p>
                  <p class="fin-value" :class="detailProject.projected_profit >= 0 ? 'text-[#1f9d8b]' : 'text-[#d95f43]'">
                    {{ formatCurrency(detailProject.projected_profit) }}
                    <span class="text-xs font-normal opacity-80 ml-1">({{ detailProject.projected_profit_percentage || '—' }}%)</span>
                  </p>
                </div>
              </div>

              <!-- Analysis Items Table -->
              <div class="border border-[#dbe7f3] rounded-2xl overflow-hidden">
                <div class="bg-[#f7faff] px-4 py-3 border-b border-[#e4edf7] flex items-center justify-between">
                  <h3 class="text-[13px] font-semibold text-[#183b63] flex items-center gap-2">
                    <svg class="h-4 w-4 text-[#2f78dd]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    Analysis Items
                  </h3>
                  <span class="bg-[#edf4fb] text-[#2f78dd] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {{ detailProject.items?.length || 0 }} items
                  </span>
                </div>

                <div v-if="detailProject.items?.length" class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead>
                      <tr class="bg-[#f7faff] border-b border-[#e4edf7]">
                        <th class="th" style="min-width:60px;">S/N</th>
                        <th class="th" style="min-width:260px;">Description</th>
                        <th class="th text-center" colspan="4">
                          <div class="text-[10px] font-semibold text-[#2f78dd] uppercase tracking-[0.18em] mb-1">QUOTED PRICES (VAT EXCL)</div>
                        </th>
                        <th class="th text-center" colspan="3">
                          <div class="text-[10px] font-semibold text-[#1f9d8b] uppercase tracking-[0.18em] mb-1">BUYING PRICES (VAT INCL)</div>
                        </th>
                        <th class="th" style="min-width:110px;">Source</th>
                        <th class="th text-center" style="min-width:90px;">Urgent</th>
                      </tr>
                      <tr class="bg-[#f7faff]/60">
                        <th class="th-sub"></th>
                        <th class="th-sub"></th>
                        <th class="th-sub">Q. Qty</th>
                        <th class="th-sub">Unit</th>
                        <th class="th-sub">Q. Rate</th>
                        <th class="th-sub">Q. Amount</th>
                        <th class="th-sub">Qty</th>
                        <th class="th-sub">Rate</th>
                        <th class="th-sub">Amount</th>
                        <th class="th-sub"></th>
                        <th class="th-sub"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#edf2fa] text-sm text-[#4a6a8a]">
                      <tr
                        v-for="item in detailProject.items"
                        :key="item.analysis_id"
                        class="hover:bg-[#f7faff] transition-colors"
                        :class="item.serial_number === 'No' ? 'bg-[#edf4fb]/50 border-t-2 border-[#2f78dd]/20' : ''"
                      >
                        <td class="td text-center font-medium" :class="item.serial_number === 'No' ? 'text-[#194f92]' : ''">
                          {{ item.serial_number || '—' }}
                        </td>
                        <td class="td" :class="item.serial_number === 'No' ? 'font-semibold text-[#194f92]' : ''">
                          <div class="max-w-xs truncate" :title="item.item_description">
                            {{ item.item_description || '—' }}
                          </div>
                        </td>
                        <td class="td text-center">{{ item.quoted_quantity || '—' }}</td>
                        <td class="td text-center">
                          <span v-if="item.quoted_unit" class="px-2 py-0.5 bg-[#edf4fb] rounded text-xs text-[#4a6a8a]">{{ item.quoted_unit }}</span>
                          <span v-else class="text-[#a4b8cf]">—</span>
                        </td>
                        <td class="td text-right tabular-nums">{{ formatCurrency(item.quoted_rate) }}</td>
                        <td class="td text-right font-medium text-[#2f78dd] tabular-nums">{{ formatCurrency(item.quoted_amount) }}</td>
                        <td class="td text-center">{{ item.quantity || '—' }}</td>
                        <td class="td text-right tabular-nums">{{ formatCurrency(item.rate) }}</td>
                        <td class="td text-right font-medium text-[#1f9d8b] tabular-nums">{{ formatCurrency(item.amount) }}</td>
                        <td class="td text-center text-xs text-[#67819d]">{{ item.source || '—' }}</td>
                        <td class="td text-center">
                          <span
                            v-if="item.urgent_status"
                            :class="{
                              'bg-[#d95f43]/10 text-[#d95f43] font-semibold': item.urgent_status.toLowerCase() === 'yes',
                              'bg-[#edf4fb] text-[#7d94ac]': item.urgent_status.toLowerCase() !== 'yes'
                            }"
                            class="px-2 py-0.5 rounded-full text-xs"
                          >
                            {{ item.urgent_status }}
                          </span>
                          <span v-else class="text-[#a4b8cf]">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-else class="p-8 text-center bg-[#f7faff]">
                  <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4fb]">
                    <svg class="h-6 w-6 text-[#7d94ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p class="text-[13px] text-[#7a93af]">No analysis items found for this project</p>
                </div>
              </div>

            </div><!-- end scrollable body -->
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════
         APPROVAL MODAL
    ══════════════════════════════════════════════ -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-[60] bg-[#183b63]/40 backdrop-blur-[6px] flex items-center justify-center p-4"
      @click.self="closeDialog"
    >
      <div class="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_30px_70px_rgba(18,58,99,0.24)] max-w-md w-full overflow-hidden">
        <div class="px-6 py-5 border-b border-[#e4edf7]">
          <h2 class="text-lg font-semibold text-[#183b63]">Review Project Analysis</h2>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac] mb-2">Decision</label>
            <select
              v-model="approvalStatus"
              class="block w-full rounded-xl border border-[#d9e6f3] bg-white px-4 py-2.5 text-[#183b63] focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20 outline-none transition"
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>

          <div v-if="approvalStatus === 'rejected'">
            <label class="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac] mb-2">
              Reason for Rejection <span class="text-[#d95f43]">*</span>
            </label>
            <textarea
              v-model.trim="rejectionReason"
              rows="4"
              class="block w-full rounded-xl border border-[#d9e6f3] bg-white px-4 py-2.5 text-[#183b63] focus:border-[#d95f43] focus:ring-2 focus:ring-[#d95f43]/20 outline-none resize-y transition placeholder:text-[#a4b8cf]"
              placeholder="Please explain the reason clearly..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 border-t border-[#e4edf7] bg-[#f7faff]">
          <button
            @click="closeDialog"
            class="px-5 py-2.5 text-[13px] font-semibold text-[#4a6a8a] bg-white border border-[#d9e6f3] rounded-xl hover:bg-[#f7faff] transition"
          >
            Cancel
          </button>
          <button
            @click="submitApproval"
            :disabled="approvalStatus === 'rejected' && !rejectionReason.trim()"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl transition shadow-sm"
            :class="{
              'bg-[linear-gradient(135deg,#1f9d8b_0%,#34d399_100%)] hover:shadow-md': approvalStatus === 'approved',
              'bg-[linear-gradient(135deg,#d95f43_0%,#ef8a6e_100%)] hover:shadow-md': approvalStatus === 'rejected',
              'opacity-40 cursor-not-allowed': approvalStatus === 'rejected' && !rejectionReason.trim()
            }"
          >
            <i class="fa fa-check" v-if="approvalStatus === 'approved'"></i>
            <i class="fa fa-ban" v-else></i>
            {{ approvalStatus === 'approved' ? 'Approve' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const toast = useToast()

const analyses = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const loading = ref(false)

const showDialog = ref(false)
const selectedProjectId = ref(null)
const approvalStatus = ref('approved')
const rejectionReason = ref('')

const showDetailModal = ref(false)
const detailProject = ref(null)

onMounted(async () => {
  await fetchAnalyses()
})

async function fetchAnalyses() {
  loading.value = true
  try {
    const res = await axios.get('/api/analysis')
    if (res.data?.status === 200 && Array.isArray(res.data.data)) {
      analyses.value = groupByProject(res.data.data)
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

function groupByProject(data) {
  const grouped = {}
  data.forEach(item => {
    const pid = item.project_id
    if (!grouped[pid]) {
      grouped[pid] = {
        project_id: pid,
        project: item.project,
        user: item.user,
        created_at: item.created_at,
        status: item.status,
        reason_for_reject: item.reason_for_reject,
        total_amount_vat_excl: 0,
        total_amount_vat_incl: 0,
        total_amount_needed: 0,
        site_contingency: 0,
        total_investment: 0,
        projected_profit: 0,
        projected_profit_percentage: 0,
        items: []
      }
    }
    grouped[pid].items.push(item)
    const quotedAmount = parseFloat(item.quoted_amount || (item.quantity * item.rate) || 0)
    const buyingAmount = parseFloat(item.amount || 0)
    const vatRate = 0.18
    const vatAmount = quotedAmount * vatRate
    grouped[pid].total_amount_vat_excl += quotedAmount
    grouped[pid].total_amount_vat_incl += quotedAmount + vatAmount
    grouped[pid].total_amount_needed += buyingAmount
    grouped[pid].site_contingency += quotedAmount * 0.1
    grouped[pid].total_investment += quotedAmount * 1.2
    grouped[pid].projected_profit += quotedAmount - buyingAmount
  })
  Object.values(grouped).forEach(project => {
    if (project.total_amount_vat_incl > 0) {
      project.projected_profit_percentage = Math.round((project.projected_profit / project.total_amount_vat_incl) * 100 * 100) / 100
    }
  })
  return Object.values(grouped)
}

function openDetailModal(project) {
  detailProject.value = project
  showDetailModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeDetailModal() {
  showDetailModal.value = false
  detailProject.value = null
  document.body.style.overflow = ''
}

const allProjects = computed(() =>
  analyses.value.filter(p =>
    p.project?.project_name?.toLowerCase().includes(filter.value.toLowerCase().trim())
  )
)

const filteredProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allProjects.value.slice(start, start + itemsPerPage)
})

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function statusBadgeClass(status) {
  const map = {
    pending:  'bg-[#fdf8ee] text-[#d7a12c] border-[#f3e0a3]',
    approved: 'bg-[#f0fdf9] text-[#1f9d8b] border-[#a7f3d0]',
    rejected: 'bg-[#fef5f3] text-[#d95f43] border-[#fecaca]'
  }
  return map[status] || 'bg-[#edf4fb] text-[#7d94ac] border-[#d9e6f3]'
}

function statusIconClass(status) {
  const map = { pending: 'fas fa-clock', approved: 'fas fa-check-circle', rejected: 'fas fa-times-circle' }
  return map[status] || 'fas fa-question-circle'
}

function handleError(error) {
  let msg = 'An unexpected error occurred'
  if (error?.response) {
    if (error.response.status === 404) {
      msg = error.response.data.message || 'Resource not found or already processed'
    } else if (error.response.status === 422) {
      msg = 'Validation error: ' + Object.values(error.response.data.errors || {}).flat().join(', ')
    } else {
      msg = error.response.data?.message || error.response.statusText
    }
  } else if (error?.request) {
    msg = 'No response from server. Check your connection.'
  } else {
    msg = error.message || 'Unknown error'
  }
  toast.error(msg)
}

function changePage(page) {
  const maxPage = Math.ceil(allProjects.value.length / itemsPerPage)
  if (page >= 1 && page <= maxPage) currentPage.value = page
}

function openApprovalDialog(projectId) {
  selectedProjectId.value = projectId
  approvalStatus.value = 'approved'
  rejectionReason.value = ''
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  selectedProjectId.value = null
}

async function submitApproval() {
  if (approvalStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    toast.warning('Please provide a rejection reason')
    return
  }
  try {
    const payload = {
      project_id: selectedProjectId.value,
      status: approvalStatus.value,
      reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value.trim() : null
    }
    const res = await axios.post('/api/approve-analysis', payload)
    if (res.data?.status === 200) {
      toast.success(res.data.message || 'Status updated successfully')
      await fetchAnalyses()
      closeDialog()
      // Refresh detailProject if it was the one reviewed
      if (detailProject.value?.project_id === selectedProjectId.value) {
        detailProject.value = analyses.value.find(p => p.project_id === selectedProjectId.value) || null
      }
    } else {
      throw new Error(res.data?.message || 'Operation failed')
    }
  } catch (err) {
    handleError(err)
  }
}

function exportToExcel() {
  if (!allProjects.value.length) { toast.warning('No data to export'); return }
  try {
    const exportData = []
    allProjects.value.forEach(project => {
      project.items.forEach(item => {
        exportData.push({
          'S/N': item.serial_number || '',
          'Project Name': project.project?.project_name || '',
          'Project Manager': project.user?.name || '',
          'Status': project.status || '',
          'Created Date': formatDate(project.created_at),
          'Item Description': item.item_description || '',
          'Quoted Quantity': item.quoted_quantity || '',
          'Quoted Unit': item.quoted_unit || '',
          'Quoted Rate': item.quoted_rate || 0,
          'Quoted Amount': item.quoted_amount || 0,
          'Buying Quantity': item.quantity || '',
          'Buying Rate': item.rate || 0,
          'Buying Amount': item.amount || 0,
          'Source': item.source || '',
          'Urgent Status': item.urgent_status || '',
          'Total VAT Excl': project.total_amount_vat_excl || 0,
          'Total VAT Incl': project.total_amount_vat_incl || 0,
          'Amount Needed': project.total_amount_needed || 0,
          'Site Contingency': project.site_contingency || 0,
          'Total Investment': project.total_investment || 0,
          'Projected Profit': project.projected_profit || 0,
          'Profit %': project.projected_profit_percentage || 0
        })
      })
    })
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Analyses')
    worksheet['!cols'] = [
      { wch: 8 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
      { wch: 40 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 20 },
      { wch: 18 }, { wch: 10 }
    ]
    XLSX.writeFile(workbook, `Project_Analyses_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel file exported successfully')
  } catch (error) {
    toast.error('Failed to export Excel file')
  }
}

function exportToPDF() {
  if (!allProjects.value.length) { toast.warning('No data to export'); return }
  try {
    const doc = new jsPDF('l', 'mm', 'a4')
    doc.setFontSize(20)
    doc.setTextColor(31, 41, 55)
    doc.text('Project Analyses Report', 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28)
    doc.text(`Total Projects: ${allProjects.value.length}`, 14, 33)
    doc.text(`Total Items: ${allProjects.value.reduce((sum, p) => sum + p.items.length, 0)}`, 14, 38)
    let yPosition = 50
    allProjects.value.forEach((project, projectIndex) => {
      if (yPosition > 180) { doc.addPage(); yPosition = 20 }
      doc.setFontSize(14)
      doc.setTextColor(31, 41, 55)
      doc.text(`${projectIndex + 1}. ${project.project?.project_name || 'Unnamed Project'}`, 14, yPosition)
      yPosition += 8
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)
      doc.text(`Manager: ${project.user?.name || '—'} | Status: ${project.status || '—'} | Created: ${formatDate(project.created_at)}`, 14, yPosition)
      yPosition += 6
      doc.text(`VAT Excl: ${formatCurrency(project.total_amount_vat_excl)} | VAT Incl: ${formatCurrency(project.total_amount_vat_incl)} | Investment: ${formatCurrency(project.total_investment)} | Profit: ${formatCurrency(project.projected_profit)} (${project.projected_profit_percentage || '—'}%)`, 14, yPosition)
      yPosition += 10
      if (project.items.length > 0) {
        const tableData = project.items.map(item => [
          item.serial_number || '',
          (item.item_description || '').substring(0, 30) + ((item.item_description || '').length > 30 ? '...' : ''),
          item.quoted_quantity || '',
          formatCurrency(item.quoted_rate),
          formatCurrency(item.quoted_amount),
          item.quantity || '',
          formatCurrency(item.rate),
          formatCurrency(item.amount),
          item.source || '',
          item.urgent_status || ''
        ])
        autoTable(doc, {
          head: [['S/N', 'Description', 'Q. Qty', 'Q. Rate', 'Q. Amount', 'Qty', 'Rate', 'Amount', 'Source', 'Urgent']],
          body: tableData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [25, 79, 146], fontSize: 8, fontStyle: 'bold', cellPadding: 2 },
          styles: { fontSize: 7, cellPadding: 2, lineColor: [229, 231, 235], lineWidth: 0.1 },
          alternateRowStyles: { fillColor: [249, 250, 251] },
          columnStyles: {
            0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 2: { cellWidth: 15 },
            3: { cellWidth: 20 }, 4: { cellWidth: 20 }, 5: { cellWidth: 12 },
            6: { cellWidth: 18 }, 7: { cellWidth: 20 }, 8: { cellWidth: 15 }, 9: { cellWidth: 15 }
          }
        })
        yPosition = doc.lastAutoTable.finalY + 10
      } else {
        doc.text('No items found for this project', 14, yPosition)
        yPosition += 10
      }
      if (project.status === 'rejected' && project.reason_for_reject) {
        doc.setTextColor(220, 38, 38)
        doc.text(`Rejection Reason: ${project.reason_for_reject}`, 14, yPosition)
        yPosition += 8
        doc.setTextColor(0, 0, 0)
      }
      yPosition += 10
    })
    doc.save(`Project_Analyses_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF file exported successfully')
  } catch (error) {
    toast.error('Failed to export PDF file')
  }
}
</script>

<style scoped>
.th {
  @apply px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac];
}

.th-sub {
  @apply px-4 py-2 text-left text-[10px] font-medium text-[#7d94ac];
}

.td {
  @apply px-4 py-3 text-sm text-[#183b63] whitespace-nowrap;
}

/* View Button */
.view-btn {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#2f78dd] bg-[#edf4fb] border border-[#d9e6f3] rounded-lg hover:bg-[#194f92] hover:text-white hover:border-[#194f92] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/30 focus:ring-offset-1 transition-all duration-200 shadow-sm;
}

/* Review Button */
.review-btn {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] rounded-lg hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/30 focus:ring-offset-1 transition-all duration-200 shadow-sm;
}

/* Financial card in modal */
.fin-card {
  @apply border rounded-xl p-4;
}

.fin-label {
  @apply text-[10px] font-semibold uppercase tracking-[0.18em] mb-1;
}

.fin-value {
  @apply text-base font-bold;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Scrollbars */
.overflow-x-auto::-webkit-scrollbar { height: 8px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #d9e6f3; border-radius: 4px; }
.overflow-x-auto::-webkit-scrollbar-track { background-color: #f7faff; }
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #d9e6f3; border-radius: 4px; }
.overflow-y-auto::-webkit-scrollbar-track { background-color: #f7faff; }

/* Modal transition */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
</style>