<template>
  <div class="flex h-screen overflow-hidden">
    <!-- ═══════════════ LEFT: TENDER LIST ═══════════════ -->
    <div :class="selectedTender ? 'w-1/2 lg:w-[55%]' : 'w-full'" class="flex flex-col border-r border-[#d9e6f3]">
      <!-- Header -->
      <div class="bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] border-b border-[#dbe7f3] px-6 py-4 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-[#183b63]">Assigned Tenders</h1>
            <p class="text-sm text-[#67819d] mt-0.5">{{ assignedTenders.length }} tender{{ assignedTenders.length !== 1 ? 's' : '' }} assigned to you</p>
          </div>
          <button
            @click="router.push({ name: 'CreateTender' })"
            class="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,96,182,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(35,96,182,0.28)]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Tender
          </button>
        </div>

        <!-- Search -->
        <div class="mt-3 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#67819d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filter"
            type="text"
            placeholder="Search tenders..."
            class="w-full pl-10 pr-4 py-2 rounded-full border border-[#d9e6f3] bg-white text-sm text-[#183b63] placeholder-[#9ab8d8] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/30"
          />
        </div>

        <!-- Status Tabs -->
        <div class="flex gap-2 mt-3 flex-wrap">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeTab = tab.value; currentPage = 1"
            :class="[
              activeTab === tab.value
                ? (tab.value === 'expiring' ? 'bg-amber-500 text-white border-amber-500' : 'bg-[#2f78dd] text-white border-[#2f78dd]')
                : (tab.value === 'expiring' && tab.count > 0 ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' : 'bg-white text-[#183b63] hover:bg-[#deebfd]')
            ]"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors border border-[#d9e6f3]"
          >
            {{ tab.label }} ({{ tab.count }})
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-10 h-10 border-3 border-[#214e62] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="mt-3 text-sm text-[#67819d]">Loading tenders...</p>
        </div>
      </div>

      <!-- Tender List -->
      <div v-else class="flex-1 overflow-y-auto">
        <div v-if="paginatedData.length === 0" class="flex flex-col items-center justify-center h-full text-center px-8">
          <div class="w-16 h-16 bg-[#deebfd] rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-[#67819d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-[#183b63] font-medium">No tenders found</p>
          <p class="text-sm text-[#67819d] mt-1">Try adjusting your search or filter</p>
        </div>

        <div v-else class="divide-y divide-[#e8f0f8]">
          <div
            v-for="tender in paginatedData"
            :key="tender.assign_id"
            @click="selectTender(tender)"
            :class="selectedTender?.assign_id === tender.assign_id ? 'bg-[#eef5ff] border-l-4 border-l-[#2f78dd]' : 'border-l-4 border-l-transparent hover:bg-[#f8fbff]'"
            class="px-5 py-4 cursor-pointer transition-colors"
          >
            <div class="flex items-start gap-3">
              <div
                :class="selectedTender?.assign_id === tender.assign_id ? 'bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white' : 'bg-[#deebfd] text-[#2f78dd]'"
                class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <i class="fas fa-file-contract text-sm"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="text-sm font-semibold text-[#183b63] truncate">{{ tender.title || 'Untitled Tender' }}</h3>
                  <span :class="getStatusClasses(tender)" class="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0">
                    {{ getStatusText(tender) }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-[#67819d]">
                  <span v-if="tender.tender_number" class="flex items-center gap-1">
                    <i class="fas fa-hashtag text-[10px]"></i>{{ tender.tender_number }}
                  </span>
                  <span v-if="tender.tender_type" class="flex items-center gap-1">
                    <i class="fas fa-tag text-[10px]"></i>{{ tender.tender_type }}
                  </span>
                  <span v-if="tender.procurement_entity" class="flex items-center gap-1">
                    <i class="fas fa-building text-[10px]"></i>{{ tender.procurement_entity }}
                  </span>
                </div>
                <div class="flex items-center gap-3 mt-1.5 text-xs text-[#67819d]">
                  <span v-if="tender.bid_submission" class="flex items-center gap-1">
                    <i class="fas fa-calendar-alt text-[10px]"></i>Due: {{ formatDate(tender.bid_submission) }}
                  </span>
                  <span v-if="tender.has_quotation" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#deebfd] text-[#2f78dd] rounded text-[10px] font-medium">
                    <i class="fas fa-file-invoice-dollar text-[9px]"></i>Quotation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredData.length > itemsPerPage" class="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#67819d]">
          <span>{{ paginatedData.length }} of {{ filteredData.length }}</span>
          <div class="flex gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-2 py-1 rounded hover:bg-[#eef5ff] disabled:opacity-40">Prev</button>
            <button @click="currentPage++" :disabled="currentPage * itemsPerPage >= filteredData.length" class="px-2 py-1 rounded hover:bg-[#eef5ff] disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ RIGHT: DETAIL PANEL ═══════════════ -->
      <div v-if="selectedTender" class="w-1/2 lg:w-[45%] flex flex-col bg-white overflow-hidden">
        <!-- Detail Header -->
        <div class="bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] border-b border-[#dbe7f3] px-6 py-4 flex-shrink-0">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h2 class="text-lg font-bold text-[#183b63] leading-tight">{{ selectedTender.title }}</h2>
              <p v-if="selectedTender.tender_number" class="text-sm text-[#67819d] mt-0.5">{{ selectedTender.tender_number }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                v-if="selectedTender.is_assigned === 'on-progress' || selectedTender.is_assigned === 'rejected'"
                @click="openQuotationModal"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white text-xs font-medium rounded-lg hover:bg-[#1a4a88] transition-colors"
              >
                <i class="fas fa-plus text-[10px]"></i>{{ selectedTender.is_assigned === 'rejected' ? 'Re-upload Quotation' : 'Add Quotation' }}
              </button>
              <button
                v-if="selectedTender.is_assigned === 'approved'"
                @click="markAsSubmitted"
                :disabled="isMarkingSubmitted"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <i :class="isMarkingSubmitted ? 'fas fa-spinner fa-spin' : 'fas fa-check'" class="text-[10px]"></i>
                {{ isMarkingSubmitted ? 'Marking...' : 'Mark as Submitted' }}
              </button>
              <button @click="selectedTender = null" class="w-7 h-7 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center text-[#183b63] transition-colors">
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Detail Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Status -->
          <div class="flex items-center gap-3">
            <span :class="getStatusClasses(selectedTender)" class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full">
              {{ getStatusText(selectedTender) }}
            </span>
            <span v-if="selectedTender.is_assigned === 'submitted'" class="text-xs text-green-600 font-medium">
              <i class="fas fa-check-circle mr-1"></i>Submitted
            </span>
          </div>

          <!-- CEO Rejection Reason -->
          <div v-if="selectedTender.is_assigned === 'rejected' && selectedTender.ceo_comment" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-2">
              <i class="fas fa-exclamation-triangle text-red-500 mt-0.5"></i>
              <div>
                <p class="text-sm font-semibold text-red-700">Quotation Rejected by CEO</p>
                <p class="text-xs text-red-600 mt-1">{{ selectedTender.ceo_comment }}</p>
                <p class="text-xs text-red-500 mt-2 italic">Please review the feedback and re-upload an updated quotation.</p>
              </div>
            </div>
          </div>

          <!-- CEO Approval Notice -->
          <div v-if="selectedTender.is_assigned === 'approved'" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-start gap-2">
              <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
              <div>
                <p class="text-sm font-semibold text-green-700">Quotation Approved by CEO</p>
                <p class="text-xs text-green-600 mt-1">You can now mark this tender as submitted once you deliver the physical documents to the procurement entity.</p>
              </div>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div v-for="field in tenderFields" :key="field.label" class="bg-[#f3f8ff] rounded-lg p-3">
              <p class="text-[10px] text-[#67819d] uppercase tracking-wide font-medium">{{ field.label }}</p>
              <p class="text-sm text-[#183b63] font-medium mt-0.5">{{ field.value || '—' }}</p>
            </div>
          </div>

          <!-- Attachment -->
          <div v-if="selectedTender.attachment" class="bg-[#f3f8ff] rounded-lg p-4">
            <p class="text-[10px] text-[#67819d] uppercase tracking-wide font-medium mb-2">Attachment</p>
            <button
              @click="downloadFile(selectedTender.attachment)"
              class="inline-flex items-center gap-2 px-3 py-2 bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white text-xs font-medium rounded-lg hover:bg-[#1a4a88] transition-colors"
            >
              <i class="fas fa-download"></i>Download File
            </button>
          </div>

          <!-- Existing Quotations Section -->
          <div class="border-t border-[#e8f0f8] pt-5">
            <h3 class="text-sm font-semibold text-[#183b63] mb-3 flex items-center gap-2">
              <i class="fas fa-file-invoice-dollar text-[#67819d]"></i>
              Quotations
            </h3>

            <div v-if="tenderQuotations.length === 0" class="bg-[#f3f8ff] rounded-lg p-6 text-center">
              <div class="w-12 h-12 bg-[#deebfd] rounded-full flex items-center justify-center mx-auto mb-3">
                <i class="fas fa-file-invoice text-[#67819d]"></i>
              </div>
              <p class="text-sm text-[#67819d]">No quotations submitted yet</p>
              <button
                @click="openQuotationModal"
                class="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white text-xs font-medium rounded-lg hover:bg-[#1a4a88] transition-colors"
              >
                <i class="fas fa-plus text-[10px]"></i>Add Quotation
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="q in tenderQuotations"
                :key="q.project_id"
                class="bg-[#f3f8ff] border border-[#d9e6f3] rounded-lg p-4"
              >
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-sm font-semibold text-[#183b63]">{{ q.project?.project_name || 'Quotation' }}</p>
                    <p class="text-xs text-[#67819d] mt-0.5">Submitted {{ formatDate(q.created_at) }}</p>
                  </div>
                  <span :class="getQuotationStatusClass(q.status)" class="px-2 py-0.5 text-[10px] font-semibold rounded-full">
                    {{ q.status || 'pending' }}
                  </span>
                </div>

                <!-- Financials -->
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="bg-white rounded p-2">
                    <p class="text-[10px] text-[#67819d]">VAT Excl</p>
                    <p class="text-xs font-bold text-[#183b63]">{{ formatCurrency(q.total_amount_vat_excl) }}</p>
                  </div>
                  <div class="bg-white rounded p-2">
                    <p class="text-[10px] text-[#67819d]">Investment</p>
                    <p class="text-xs font-bold text-[#183b63]">{{ formatCurrency(q.total_investment) }}</p>
                  </div>
                  <div class="bg-white rounded p-2">
                    <p class="text-[10px] text-[#67819d]">Profit</p>
                    <p class="text-xs font-bold" :class="parseFloat(q.projected_profit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ formatCurrency(q.projected_profit) }}
                    </p>
                  </div>
                </div>

                <!-- Items count -->
                <div v-if="q.items?.length" class="mt-2 text-xs text-[#67819d]">
                  <i class="fas fa-list mr-1"></i>{{ q.items.length }} line items
                </div>

                <!-- Rejection reason -->
                <div v-if="q.status === 'rejected' && q.reason_for_reject" class="mt-2 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                  <i class="fas fa-exclamation-circle mr-1"></i>{{ q.reason_for_reject }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- ═══════════════ QUOTATION UPLOAD MODAL ═══════════════ -->
    <Teleport to="body">
        <div
          v-if="showQuotationModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="closeQuotationModal"
        >
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <!-- Modal Header -->
            <div class="px-6 py-4 flex items-center justify-between" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <i class="fas fa-file-invoice-dollar text-white"></i>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-white">Submit Quotation</h3>
                  <p class="text-xs text-[rgba(255,255,255,0.7)]">{{ selectedTender?.title }}</p>
                </div>
              </div>
              <button @click="closeQuotationModal" class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>

            <!-- Modal Body — side by side -->
            <div class="flex">
              <!-- Left: Upload -->
              <div class="flex-1 p-5 space-y-4 border-r border-gray-100">
                <!-- Tender Info -->
                <div class="bg-[#f3f8ff] border border-[#d9e6f3] rounded-lg p-3 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-file-contract text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-[#67819d]">Tender</p>
                    <p class="text-sm font-medium text-[#183b63] truncate">{{ selectedTender?.title }}</p>
                    <p v-if="selectedTender?.tender_number" class="text-xs text-[#67819d]">{{ selectedTender.tender_number }}</p>
                  </div>
                </div>

                <!-- File Upload -->
                <div>
                  <label class="block text-sm font-medium text-[#183b63] mb-1.5">
                    Upload File <span class="text-red-500">*</span>
                  </label>
                  <div
                    class="border-2 border-dashed border-[#d9e6f3] rounded-lg p-5 text-center hover:border-[#214e62] transition-colors cursor-pointer bg-[#f3f8ff]"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                    @click="$refs.fileInput.click()"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept=".xlsx,.xls,.pdf"
                      class="hidden"
                      @change="handleFileUpload"
                    />
                    <div v-if="!quotationData.file" class="space-y-2">
                      <div class="flex items-center justify-center gap-3">
                        <i class="fas fa-file-excel text-2xl text-[#9ab8d8]"></i>
                        <i class="fas fa-file-pdf text-2xl text-[#9ab8d8]"></i>
                      </div>
                      <p class="text-sm text-[#67819d]">
                        Drag & drop or <span class="text-[#2f78dd] font-medium cursor-pointer">browse</span>
                      </p>
                      <p class="text-xs text-[#9ab8d8]">.xlsx, .xls, or .pdf &bull; Max 10MB</p>
                    </div>
                    <div v-else class="flex items-center justify-center gap-3">
                      <i :class="fileIcon" class="text-2xl"></i>
                      <div class="text-left">
                        <p class="text-sm font-medium text-[#183b63]">{{ quotationData.file.name }}</p>
                        <p class="text-xs text-[#67819d]">{{ (quotationData.file.size / 1024 / 1024).toFixed(2) }} MB</p>
                      </div>
                      <button type="button" @click.stop="clearFile" class="ml-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-times-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <p class="text-xs text-[#9ab8d8]">Accepts Excel and PDF files with pricing and analysis data.</p>

                <div class="bg-[#f3f8ff] border border-[#d9e6f3] rounded-lg p-4 space-y-3">
                  <div>
                    <p class="text-sm font-medium text-[#183b63]">Quotation Summary</p>
                    <p class="text-xs text-[#67819d] mt-1">Required for PDF uploads so the CEO can review the financial summary. Excel uploads can still provide their own line items.</p>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="block">
                      <span class="text-xs font-medium text-[#183b63]">Total Amount VAT Excl <span v-if="isPdf" class="text-red-500">*</span></span>
                      <input v-model="quotationData.total_amount_vat_excl" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-[#d9e6f3] bg-white px-3 py-2 text-sm text-[#183b63] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/20" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-medium text-[#183b63]">Total Investment <span v-if="isPdf" class="text-red-500">*</span></span>
                      <input v-model="quotationData.total_investment" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-[#d9e6f3] bg-white px-3 py-2 text-sm text-[#183b63] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/20" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-medium text-[#183b63]">Projected Profit <span v-if="isPdf" class="text-red-500">*</span></span>
                      <input v-model="quotationData.projected_profit" type="number" step="0.01" class="mt-1 w-full rounded-lg border border-[#d9e6f3] bg-white px-3 py-2 text-sm text-[#183b63] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/20" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-medium text-[#183b63]">Projected Profit %</span>
                      <input :value="projectedProfitPercentage" type="number" step="0.01" readonly class="mt-1 w-full rounded-lg border border-[#d9e6f3] bg-[#eef5ff] px-3 py-2 text-sm text-[#183b63]" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-medium text-[#183b63]">Total Amount Needed</span>
                      <input v-model="quotationData.total_amount_needed" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-[#d9e6f3] bg-white px-3 py-2 text-sm text-[#183b63] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/20" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-medium text-[#183b63]">Site Contingency</span>
                      <input v-model="quotationData.site_contingency" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-[#d9e6f3] bg-white px-3 py-2 text-sm text-[#183b63] focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/20" />
                    </label>
                  </div>
                </div>
              </div>

              <!-- Right: Preview -->
              <div class="flex-1 flex flex-col bg-[#f3f8ff]">
                <div class="px-4 py-2.5 border-b border-[#d9e6f3] flex items-center justify-between flex-shrink-0">
                  <p class="text-xs font-medium text-[#183b63] flex items-center gap-1.5">
                    <i class="fas fa-eye text-[#67819d]"></i>Preview
                  </p>
                  <span v-if="quotationData.file" class="text-[10px] text-[#67819d] uppercase font-medium">{{ fileExtension }}</span>
                </div>
                <div class="flex-1 flex items-center justify-center min-h-[220px]">
                  <!-- No file -->
                  <div v-if="!quotationData.file" class="text-center px-6">
                    <div class="w-14 h-14 bg-[#deebfd] rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-file-upload text-xl text-[#9ab8d8]"></i>
                    </div>
                    <p class="text-sm text-[#9ab8d8]">Upload a file to preview</p>
                  </div>
                  <!-- PDF Preview -->
                  <iframe v-else-if="isPdf" :src="filePreviewUrl" class="w-full h-full border-0 min-h-[220px]"></iframe>
                  <!-- Excel Preview -->
                  <div v-else class="text-center px-6">
                    <div class="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-file-excel text-2xl text-green-600"></i>
                    </div>
                    <p class="text-sm font-semibold text-[#183b63]">{{ quotationData.file.name }}</p>
                    <p class="text-xs text-[#67819d] mt-1">{{ (quotationData.file.size / 1024 / 1024).toFixed(2) }} MB &bull; Excel Spreadsheet</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-[#f8fbff] border-t border-[#d9e6f3] flex items-center justify-end gap-3">
              <button
                @click="closeQuotationModal"
                class="px-4 py-2 text-sm font-medium text-[#183b63] bg-white border border-[#d9e6f3] rounded-lg hover:bg-[#f8fbff] transition-colors"
              >
                Cancel
              </button>
              <button
                @click="submitQuotation"
                :disabled="isSubmitting || !isQuotationValid"
                class="px-4 py-2 text-sm font-medium text-white bg-[#2f78dd] rounded-lg hover:bg-[#1a4a88] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-upload"></i>
                {{ isSubmitting ? 'Submitting...' : 'Submit Quotation' }}
              </button>
            </div>
          </div>
        </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

// ── State ──
const assignedTenders = ref([])
const allQuotations = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const isLoading = ref(false)
const selectedTender = ref(null)
const activeTab = ref('all')

// Modal state
const showQuotationModal = ref(false)
const isSubmitting = ref(false)
const isMarkingSubmitted = ref(false)
const fileInput = ref(null)
const filePreviewUrl = ref(null)
const quotationData = ref({
  file: null,
  total_amount_vat_excl: '',
  total_investment: '',
  projected_profit: '',
  total_amount_needed: '',
  site_contingency: '',
})

// ── Lifecycle ──
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([fetchTenders(), fetchQuotations()])
  } finally {
    isLoading.value = false
  }
})

// ── API Calls ──
async function fetchTenders() {
  try {
    const res = await axios.get('api/your/tender')
    assignedTenders.value = (res.data.data || []).map(t => ({
      assign_id: t.assign_id,
      tender_id: t.tender?.tender_id || t.tender_id,
      title: t.tender?.title,
      tender_type: t.tender?.tender_type,
      procurement_entity: t.tender?.procurement_entity,
      tender_number: t.tender?.tender_number,
      date_of_Publication: t.tender?.date_of_Publication,
      bid_submission: t.tender?.bid_submission,
      expired_at: t.tender?.expired_at,
      user_name: t.user?.name,
      attachment: t.tender?.attachment,
      is_assigned: t.is_assigned,
      ceo_comment: t.ceo_comment,
      description: t.tender?.description,
      category: t.tender?.category,
      location: t.tender?.location,
      value: t.tender?.value,
      opening_date: t.tender?.opening_date,
    }))
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to load tenders')
  }
}

async function fetchQuotations() {
  try {
    const res = await axios.get('/api/user-analysis')
    allQuotations.value = res.data?.data || []
  } catch {
    // silent – quotation data is supplementary
  }
}

// ── Computed ──
const statusTabs = computed(() => {
  const all = assignedTenders.value
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7Days = new Date(today)
  in7Days.setDate(in7Days.getDate() + 7)

  const quoted    = all.filter(t => t.is_assigned === 'quoted')
  const approved  = all.filter(t => t.is_assigned === 'approved')
  const rejected  = all.filter(t => t.is_assigned === 'rejected')
  const submitted = all.filter(t => t.is_assigned === 'submitted')
  const expiring  = all.filter(t => {
    if (t.is_assigned !== 'on-progress') return false
    if (!t.bid_submission) return false
    const due = new Date(t.bid_submission)
    return due >= today && due <= in7Days
  })

  return [
    { value: 'all', label: 'All', count: all.length },
    { value: 'quoted', label: 'Quoted', count: quoted.length },
    { value: 'approved', label: 'Approved', count: approved.length },
    { value: 'rejected', label: 'Rejected', count: rejected.length },
    { value: 'submitted', label: 'Submitted', count: submitted.length },
    { value: 'expiring', label: 'Expiring Soon', count: expiring.length },
  ]
})

const filteredData = computed(() => {
  let data = assignedTenders.value
  const search = filter.value.toLowerCase()
  if (search) {
    data = data.filter(t =>
      (t.title || '').toLowerCase().includes(search) ||
      (t.tender_number || '').toLowerCase().includes(search) ||
      (t.procurement_entity || '').toLowerCase().includes(search)
    )
  }
  if (activeTab.value === 'quoted')    data = data.filter(t => t.is_assigned === 'quoted')
  else if (activeTab.value === 'approved')  data = data.filter(t => t.is_assigned === 'approved')
  else if (activeTab.value === 'rejected')  data = data.filter(t => t.is_assigned === 'rejected')
  else if (activeTab.value === 'submitted') data = data.filter(t => t.is_assigned === 'submitted')
  else if (activeTab.value === 'expiring') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const in7Days = new Date(today)
    in7Days.setDate(in7Days.getDate() + 7)
    data = data.filter(t => {
      if (t.is_assigned !== 'on-progress') return false
      if (!t.bid_submission) return false
      const due = new Date(t.bid_submission)
      return due >= today && due <= in7Days
    })
  }

  // Annotate with quotation info
  data = data.map(t => ({
    ...t,
    has_quotation: allQuotations.value.some(q => q.tender_id === t.tender_id)
  }))

  return data
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

const tenderFields = computed(() => {
  if (!selectedTender.value) return []
  const t = selectedTender.value
  return [
    { label: 'Tender Type', value: t.tender_type },
    { label: 'Procurement Entity', value: t.procurement_entity },
    { label: 'Tender Number', value: t.tender_number },
    { label: 'Category', value: t.category },
    { label: 'Location', value: t.location },
    { label: 'Value', value: t.value ? formatCurrency(t.value) : null },
    { label: 'Publication Date', value: formatDate(t.date_of_Publication) },
    { label: 'Submission Deadline', value: formatDate(t.bid_submission) },
    { label: 'Opening Date', value: formatDate(t.opening_date) },
    { label: 'Description', value: t.description },
  ].filter(f => f.value && f.value !== 'N/A')
})

const tenderQuotations = computed(() => {
  if (!selectedTender.value) return []
  return allQuotations.value.filter(q => q.tender_id === selectedTender.value.tender_id)
})

const isQuotationValid = computed(() => {
  if (!quotationData.value.file) return false
  if (!isPdf.value) return true

  return [
    quotationData.value.total_amount_vat_excl,
    quotationData.value.total_investment,
    quotationData.value.projected_profit,
  ].every(value => value !== '' && value !== null)
})

const isPdf = computed(() => quotationData.value.file?.type === 'application/pdf')

const projectedProfitPercentage = computed(() => {
  const vatExcl = parseFloat(quotationData.value.total_amount_vat_excl || 0)
  const projectedProfit = parseFloat(quotationData.value.projected_profit || 0)
  if (!vatExcl) return 0
  return ((projectedProfit / vatExcl) * 100).toFixed(2)
})

const fileExtension = computed(() => {
  if (!quotationData.value.file) return ''
  return quotationData.value.file.name.split('.').pop().toUpperCase()
})

const fileIcon = computed(() => {
  if (isPdf.value) return 'fas fa-file-pdf text-red-500'
  return 'fas fa-file-excel text-green-600'
})

// ── Methods ──
function selectTender(tender) {
  selectedTender.value = selectedTender.value?.assign_id === tender.assign_id ? null : tender
}

function openQuotationModal() {
  quotationData.value = {
    file: null,
    total_amount_vat_excl: '',
    total_investment: '',
    projected_profit: '',
    total_amount_needed: '',
    site_contingency: '',
  }
  filePreviewUrl.value = null
  showQuotationModal.value = true
}

function closeQuotationModal() {
  showQuotationModal.value = false
  quotationData.value = {
    file: null,
    total_amount_vat_excl: '',
    total_investment: '',
    projected_profit: '',
    total_amount_needed: '',
    site_contingency: '',
  }
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
    filePreviewUrl.value = null
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  validateAndSetFile(file)
}

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  validateAndSetFile(file)
}

function validateAndSetFile(file) {
  if (!file) return
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf',
  ]
  if (!validTypes.includes(file.type)) {
    toast.error('Only Excel (.xlsx, .xls) or PDF files are allowed')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must not exceed 10MB')
    return
  }
  if (filePreviewUrl.value) URL.revokeObjectURL(filePreviewUrl.value)
  quotationData.value.file = file
  filePreviewUrl.value = URL.createObjectURL(file)
}

function clearFile() {
  quotationData.value.file = null
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
    filePreviewUrl.value = null
  }
  if (fileInput.value) fileInput.value.value = ''
}

async function submitQuotation() {
  if (!isQuotationValid.value) {
    toast.warning(isPdf.value ? 'Please upload a file and fill in the quotation totals' : 'Please upload a file')
    return
  }
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('tender_id', selectedTender.value.tender_id)
    formData.append('excel_file', quotationData.value.file)
    if (quotationData.value.total_amount_vat_excl !== '') formData.append('total_amount_vat_excl', quotationData.value.total_amount_vat_excl)
    if (quotationData.value.total_investment !== '') formData.append('total_investment', quotationData.value.total_investment)
    if (quotationData.value.projected_profit !== '') formData.append('projected_profit', quotationData.value.projected_profit)
    if (quotationData.value.total_amount_needed !== '') formData.append('total_amount_needed', quotationData.value.total_amount_needed)
    if (quotationData.value.site_contingency !== '') formData.append('site_contingency', quotationData.value.site_contingency)
    if (parseFloat(projectedProfitPercentage.value)) formData.append('projected_profit_percentage', projectedProfitPercentage.value)

    const res = await axios.post('/api/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success(res.data.message || `Quotation submitted successfully (${res.data.rows_imported || 0} rows imported)`)
    closeQuotationModal()
    await Promise.all([fetchTenders(), fetchQuotations()])
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit quotation')
  } finally {
    isSubmitting.value = false
  }
}

async function markAsSubmitted() {
  if (!selectedTender.value || isMarkingSubmitted.value) return
  isMarkingSubmitted.value = true
  try {
    const res = await axios.post('/api/tender/mark-submitted', {
      tender_id: selectedTender.value.tender_id
    })
    toast.success(res.data.message || 'Tender marked as submitted')
    await fetchTenders()
    // Update selected tender
    if (selectedTender.value) {
      const updated = assignedTenders.value.find(t => t.assign_id === selectedTender.value.assign_id)
      if (updated) selectedTender.value = { ...updated }
    }
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to mark as submitted')
  } finally {
    isMarkingSubmitted.value = false
  }
}

function downloadFile(fileUrl) {
  if (!fileUrl) { toast.error('File URL is missing!'); return }
  axios({ url: fileUrl, method: 'GET', responseType: 'blob' })
    .then(res => {
      const blob = new Blob([res.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.setAttribute('download', fileUrl.split('/').pop())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Download started')
    })
    .catch(() => toast.error('Failed to download file'))
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'N/A'
  const num = parseFloat(value)
  if (isNaN(num)) return 'N/A'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

function isExpiringSoon(tender) {
  if (tender.is_assigned !== 'on-progress' || !tender.bid_submission) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7Days = new Date(today)
  in7Days.setDate(in7Days.getDate() + 7)
  const due = new Date(tender.bid_submission)
  return due >= today && due <= in7Days
}

function getStatusText(tender) {
  if (tender.is_assigned === 'on-progress' && isExpiringSoon(tender)) return 'Expiring Soon'
  const statusMap = {
    'on-progress': 'Active',
    'quoted': 'Quoted',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'submitted': 'Submitted',
  }
  return statusMap[tender.is_assigned] || 'Active'
}

function getStatusClasses(tender) {
  if (tender.is_assigned === 'on-progress' && isExpiringSoon(tender)) return 'bg-amber-100 text-amber-700'
  const classMap = {
    'on-progress': 'bg-blue-100 text-blue-700',
    'quoted': 'bg-indigo-100 text-indigo-700',
    'approved': 'bg-green-100 text-green-700',
    'rejected': 'bg-red-100 text-red-700',
    'submitted': 'bg-emerald-100 text-emerald-700',
  }
  return classMap[tender.is_assigned] || 'bg-gray-100 text-gray-600'
}

function getQuotationStatusClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}
</script>


