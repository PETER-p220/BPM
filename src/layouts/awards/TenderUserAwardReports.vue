<template>
  <div class="page-shell">

    <div class="page-header">
      <div>
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.35rem;">
          <div style="width:44px;height:44px;border-radius:16px;background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-trophy" style="font-size:18px;color:#fff;"></i>
          </div>
        </div>
        <h1 class="page-title">Award &amp; Tender Reports</h1>
        <p class="page-sub">Track awarded tenders and report cases where no award was granted</p>
      </div>
      <div class="header-actions">
        <button @click="openReportModal" class="btn btn-danger">
          <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report Non-Awarded
        </button>
        <div class="export-group">
          <span class="export-label">Export Awards</span>
          <button @click="exportAwardsCSV" :disabled="loading || awards.length === 0" class="btn btn-outline btn-sm">CSV</button>
          <button @click="exportAwardsPDF" :disabled="loading || awards.length === 0" class="btn btn-dark btn-sm">PDF</button>
        </div>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="summary-grid" v-if="!loading">
      <div class="stat-card">
        <div class="stat-icon icon-amber"><i class="fas fa-lightbulb"></i></div>
        <div><p class="stat-label">Intentions</p><p class="stat-value">{{ summary.intentions }}</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-blue"><i class="fas fa-envelope"></i></div>
        <div><p class="stat-label">Award Letters</p><p class="stat-value">{{ summary.award_letters }}</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-green"><i class="fas fa-check-circle"></i></div>
        <div><p class="stat-label">Approved / Awarded</p><p class="stat-value">{{ summary.approved }}</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-violet"><i class="fas fa-dollar-sign"></i></div>
        <div><p class="stat-label">Total Value</p><p class="stat-value stat-value--sm">{{ formatCurrency(summary.total_value) }}</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-red"><i class="fas fa-exclamation-triangle"></i></div>
        <div><p class="stat-label">Not Awarded</p><p class="stat-value">{{ summary.not_awarded }}</p></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="panel">
      <div class="filter-grid">
        <div class="field">
          <label class="field-label">Award Type</label>
          <select v-model="filters.award_type" class="field-input">
            <option value="">All Types</option>
            <option value="intention">Intention to Award</option>
            <option value="letter">Award Letter</option>
            <option value="contract">Contract Award</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Date From</label>
          <input v-model="filters.date_from" type="date" class="field-input" />
        </div>
        <div class="field">
          <label class="field-label">Date To</label>
          <input v-model="filters.date_to" type="date" class="field-input" />
        </div>
        <div class="field">
          <label class="field-label">Status</label>
          <select v-model="filters.status" class="field-input">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="awarded">Awarded</option>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button @click="fetchAwards" :disabled="loading" class="btn btn-dark btn-sm">Apply Filters</button>
        <button @click="resetFilters" class="btn btn-outline btn-sm">Reset</button>
      </div>
    </div>

    <!-- Awards table -->
    <div class="panel panel--flush">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Award Records</h2>
          <p class="panel-sub">Intentions, award letters, and contract awards</p>
        </div>
      </div>
      <div v-if="loading" class="state-center">
        <div class="spinner"></div>
        <p class="state-text">Loading award records…</p>
      </div>
      <div v-else-if="awards.length === 0" class="state-center">
        <h3 class="state-title">No records found</h3>
        <p class="state-text">Try adjusting your filters.</p>
      </div>
      <div v-else>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Award ID</th><th>Tender Title</th><th>Submitted by</th><th>Type</th>
                <th class="text-right">Value</th><th class="text-center">Status</th>
                <th class="text-center">Award Date</th><th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="award in pagedAwards" :key="award.id" class="table-row">
                <td class="td-mono">{{ award.award_id || '—' }}</td>
                <td class="td-title" :title="award.tender_title">{{ award.tender_title || '—' }}</td>
                <td>{{ award.company_name || '—' }}</td>
                <td><span :class="['badge', getAwardTypeClass(award.type)]">{{ formatType(award.type) }}</span></td>
                <td class="text-right td-num">{{ formatCurrency(award.value) }}</td>
                <td class="text-center"><span :class="['badge', getStatusClass(award.status)]">{{ formatStatus(award.status) }}</span></td>
                <td class="text-center">{{ formatDate(award.award_date) }}</td>
                <td class="text-center td-actions">
                  <button @click="viewDetails(award)" class="icon-btn icon-btn--blue" title="View Details">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button @click="downloadAward(award)" class="icon-btn icon-btn--green" title="Download Document">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <p class="pag-info">Showing <strong>{{ (currentPage-1)*perPage+1 }}–{{ Math.min(currentPage*perPage, awards.length) }}</strong> of <strong>{{ awards.length }}</strong></p>
          <div class="pag-controls">
            <button @click="previousPage" :disabled="currentPage===1" class="pag-btn"><i class="fas fa-chevron-left"></i></button>
            <span class="pag-current">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage>=totalPages" class="pag-btn"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Non-awarded reports table -->
    <div class="panel panel--flush">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Non-Awarded Tender Reports</h2>
          <p class="panel-sub">Reports for tenders that were not awarded</p>
        </div>
        <div class="export-group">
          <span class="export-label">Export</span>
          <button @click="exportNonAwardedCSV" :disabled="nonAwardedReports.length===0" class="btn btn-outline btn-sm">CSV</button>
          <button @click="exportNonAwardedPDF" :disabled="nonAwardedReports.length===0" class="btn btn-dark btn-sm">PDF</button>
        </div>
      </div>
      <div v-if="reportsLoading" class="state-center">
        <div class="spinner spinner--red"></div>
        <p class="state-text">Loading reports…</p>
      </div>
      <div v-else-if="nonAwardedReports.length === 0" class="state-center">
        <h3 class="state-title">No reports yet</h3>
        <p class="state-text">No non-awarded tender reports have been submitted.</p>
      </div>
      <div v-else>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Report ID</th><th>Tender Title</th><th>Submitted by:</th>
                <th>Issue Type</th><th>Reported By</th>
                <th class="text-center">Date</th><th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in nonAwardedReports" :key="report.id" class="table-row">
                <td class="td-mono">#{{ report.id || '—' }}</td>
                <td class="td-title">{{ report.tender_title || '—' }}</td>
                <td>{{ report.company_name || '—' }}</td>
                <td><span :class="['badge', getReportTypeClass(report.report_type)]">{{ formatReportType(report.report_type) }}</span></td>
                <td>{{ report.reported_by || '—' }}</td>
                <td class="text-center">{{ formatDate(report.created_at) }}</td>
                <td class="text-center td-actions">
                  <button @click="viewReportDetails(report)" class="icon-btn icon-btn--blue" title="View Report Details">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button v-if="report.supporting_document" @click="downloadReportDocument(report)" class="icon-btn icon-btn--green" title="Download Document">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══ REPORT MODAL ══ -->
    <div v-if="showReportModal" class="modal-backdrop" @mousedown.self="closeReportModal">
      <div class="modal" @mousedown.stop>
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-header-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Report Non-Awarded Tender</h3>
              <p class="modal-subtitle">Step {{ currentStep }} of 3</p>
            </div>
          </div>
          <button class="modal-close" @click="closeReportModal">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-steps">
          <div v-for="n in 3" :key="n" class="step-wrap">
            <div :class="['step-dot', currentStep >= n ? 'step-dot--active' : '', currentStep > n ? 'step-dot--done' : '']">
              <svg v-if="currentStep > n" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              <span v-else>{{ n }}</span>
            </div>
            <span :class="['step-label', currentStep >= n ? 'step-label--active' : '']">
              {{ ['Select Tender','Issue Details','Review & Submit'][n-1] }}
            </span>
          </div>
          <div class="step-connector" :style="{ width: ((currentStep-1)/2*100)+'%' }"></div>
        </div>

        <!-- STEP 1 -->
        <div v-show="currentStep === 1" class="modal-body">
          <div class="step-heading">
            <h4>Which tender was not awarded?</h4>
            <p>Select from expired tenders available for reporting.</p>
          </div>
          <div class="form-field">
            <label class="field-label">Select Tender <span class="req">*</span></label>
            <select v-model="reportForm.tender_id" class="field-input field-input--lg" @change="console.log('Tender selected:', reportForm.tender_id)">
              <option value="">Choose a tender…</option>
              <option v-if="availableTenders.length === 0" disabled>
                {{ nonAwardedReports.length > 0 ? 'All expired tenders already have reports' : 'No expired tenders available' }}
              </option>
              <option v-for="tender in availableTenders" :key="tender.id" :value="String(tender.id)">
                {{ tender.title || 'Untitled Tender' }} (Expired: {{ formatDate(tender.expired_at) }})
              </option>
            </select>
            <p class="field-hint">
              <i class="fas fa-info-circle"></i> 
              {{ availableTenders.length }} expired tender(s) available for reporting
              <span v-if="nonAwardedReports.length > 0">· {{ nonAwardedReports.length }} already reported</span>
            </p>
          </div>
          <div v-if="selectedTender" class="tender-preview">
            <div class="tender-preview-row"><span class="tp-label">Tender</span><span class="tp-value">{{ selectedTender.title }}</span></div>
            <div class="tender-preview-row"><span class="tp-label">Company</span><span class="tp-value">{{ selectedTender.company_name || '—' }}</span></div>
            <div v-if="selectedTender.expired_at" class="tender-preview-row">
              <span class="tp-label">Expired</span><span class="tp-value tp-expired">{{ formatDate(selectedTender.expired_at) }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" @click="closeReportModal">Cancel</button>
            <button type="button" class="btn btn-dark" :disabled="!reportForm.tender_id" @click="goToStep(2)">
              Next: Issue Details
              <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-show="currentStep === 2" class="modal-body">
          <div class="step-heading">
            <h4>What were the issues?</h4>
            <p>Select the issue type and provide a detailed explanation.</p>
          </div>
          <div class="form-field">
            <label class="field-label">Issue Type <span class="req">*</span></label>
            <div class="issue-type-grid">
              <button v-for="t in issueTypes" :key="t.value" type="button"
                :class="['issue-type-btn', reportForm.report_type === t.value ? 'issue-type-btn--active' : '']"
                @click="reportForm.report_type = t.value">
                <span class="issue-type-icon">{{ t.icon }}</span>
                <span class="issue-type-label">{{ t.label }}</span>
              </button>
            </div>
          </div>
          <div class="form-field">
            <label class="field-label">Detailed Reason <span class="req">*</span></label>
            <textarea v-model="reportForm.reason" rows="5" placeholder="Provide detailed reasons why this tender was not awarded…" class="field-input field-textarea"></textarea>
            <p class="field-hint">{{ reportForm.reason.length }} characters</p>
          </div>
          <div class="form-field">
            <label class="field-label">Recommendations <span class="field-hint-inline">(optional)</span></label>
            <textarea v-model="reportForm.recommendations" rows="3" placeholder="Any recommendations for future tenders…" class="field-input field-textarea"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" @click="goToStep(1)">
              <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
            <button type="button" class="btn btn-dark" :disabled="!reportForm.report_type || !reportForm.reason.trim()" @click="goToStep(3)">
              Next: Review
              <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-show="currentStep === 3" class="modal-body">
          <div class="step-heading">
            <h4>Review &amp; Submit</h4>
            <p>Confirm details and attach a supporting PDF if available.</p>
          </div>
          <div class="form-field">
            <label class="field-label">Supporting Document <span class="field-hint-inline">(PDF, max 10 MB — optional)</span></label>
            <div class="file-drop" :class="{ 'file-drop--has': reportForm.file }" @dragover.prevent @drop.prevent="handleFileDrop">
              <template v-if="!reportForm.file">
                <svg class="file-drop-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="file-drop-text">
                  <label class="file-drop-cta">Browse PDF<input type="file" accept=".pdf" @change="handleFileUpload" class="sr-only"/></label>
                  &nbsp;or drag and drop
                </p>
                <p class="file-drop-sub">PDF only · max 10 MB</p>
              </template>
              <template v-else>
                <div class="file-selected">
                  <div class="file-selected-icon"><i class="fas fa-file-pdf"></i></div>
                  <div class="file-selected-info">
                    <p class="file-selected-name">{{ reportForm.file.name }}</p>
                    <p class="file-selected-size">{{ (reportForm.file.size/1024/1024).toFixed(2) }} MB</p>
                  </div>
                  <button type="button" class="file-remove-btn" @click="reportForm.file = null">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </template>
            </div>
          </div>
          <div class="submit-summary">
            <p class="submit-summary-title">Summary</p>
            <div class="submit-summary-grid">
              <div class="ss-item"><span class="ss-label">Tender</span><span class="ss-value">{{ selectedTender?.title || '—' }}</span></div>
              <div class="ss-item"><span class="ss-label">Company</span><span class="ss-value">{{ selectedTender?.company_name || '—' }}</span></div>
              <div class="ss-item"><span class="ss-label">Issue Type</span><span class="ss-value">{{ issueTypes.find(t => t.value === reportForm.report_type)?.label || '—' }}</span></div>
              <div class="ss-item"><span class="ss-label">Document</span><span class="ss-value">{{ reportForm.file ? reportForm.file.name : 'None' }}</span></div>
              <div class="ss-item ss-item--full"><span class="ss-label">Reason</span><span class="ss-value ss-value--muted">{{ reportForm.reason.slice(0,160) }}{{ reportForm.reason.length > 160 ? '…' : '' }}</span></div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" @click="goToStep(2)">
              <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
            <button type="button" class="btn btn-danger" :disabled="isSubmitting" @click="submitNonAwardedReport">
              <svg v-if="isSubmitting" class="btn-icon spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="8"/></svg>
              <svg v-else class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ isSubmitting ? 'Submitting…' : 'Submit Report' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ AWARD DETAIL MODAL ══ -->
    <div v-if="showDetailModal" class="modal-backdrop" @mousedown.self="closeDetailModal">
      <div class="modal modal--detail" @mousedown.stop>
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-header-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Award Record Details</h3>
              <p class="modal-subtitle">{{ selectedDetail?.award_id || '—' }}</p>
            </div>
          </div>
          <button class="modal-close" @click="closeDetailModal">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body" v-if="selectedDetail">
          <!-- Status banner -->
          <div :class="['detail-status-banner', getStatusBannerClass(selectedDetail.status)]">
            <span :class="['badge', getStatusClass(selectedDetail.status)]" style="font-size:13px;padding:5px 14px;">
              {{ formatStatus(selectedDetail.status) }}
            </span>
            <span class="detail-status-date">{{ formatType(selectedDetail.type) }} · {{ formatDate(selectedDetail.award_date) }}</span>
          </div>

          <!-- Main info grid -->
          <div class="detail-grid">
            <div class="detail-section">
              <p class="detail-section-title">Tender Information</p>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-label">Tender Title</span>
                  <span class="detail-value detail-value--strong">{{ selectedDetail.tender_title || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Award ID</span>
                  <span class="detail-value detail-value--mono">{{ selectedDetail.award_id || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Award Type</span>
                  <span class="detail-value">
                    <span :class="['badge', getAwardTypeClass(selectedDetail.type)]">{{ formatType(selectedDetail.type) }}</span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Award Date</span>
                  <span class="detail-value">{{ formatDate(selectedDetail.award_date) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <p class="detail-section-title">Company & Value</p>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-label">Submitted By</span>
                  <span class="detail-value detail-value--strong">{{ selectedDetail.company_name || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Contract Value</span>
                  <span class="detail-value detail-value--value">{{ formatCurrency(selectedDetail.value) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="detail-value">
                    <span :class="['badge', getStatusClass(selectedDetail.status)]">{{ formatStatus(selectedDetail.status) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes / description if present -->
          <div v-if="selectedDetail.description || selectedDetail.notes" class="detail-section detail-section--full">
            <p class="detail-section-title">Notes</p>
            <p class="detail-notes">{{ selectedDetail.description || selectedDetail.notes }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeDetailModal">Close</button>
          <button type="button" class="btn btn-dark" @click="downloadAward(selectedDetail)">
            <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Document
          </button>
        </div>
      </div>
    </div>

    <!-- ══ NON-AWARDED REPORT DETAIL MODAL ══ -->
    <div v-if="showReportDetailModal" class="modal-backdrop" @mousedown.self="closeReportDetailModal">
      <div class="modal modal--detail" @mousedown.stop>
        <!-- Header -->
        <div class="modal-header modal-header--red">
          <div class="modal-header-left">
            <div class="modal-header-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Non-Awarded Report Details</h3>
              <p class="modal-subtitle">Report #{{ selectedReport?.id || '—' }}</p>
            </div>
          </div>
          <button class="modal-close" @click="closeReportDetailModal">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body" v-if="selectedReport">
          <!-- Issue type banner -->
          <div class="detail-status-banner detail-status-banner--issue">
            <span :class="['badge', getReportTypeClass(selectedReport.report_type)]" style="font-size:13px;padding:5px 14px;">
              {{ formatReportType(selectedReport.report_type) }}
            </span>
            <span class="detail-status-date">Submitted {{ formatDate(selectedReport.created_at) }}</span>
          </div>

          <!-- Main info grid -->
          <div class="detail-grid">
            <div class="detail-section">
              <p class="detail-section-title">Tender Information</p>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-label">Tender Title</span>
                  <span class="detail-value detail-value--strong">{{ selectedReport.tender_title || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Report ID</span>
                  <span class="detail-value detail-value--mono">#{{ selectedReport.id || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Issue Type</span>
                  <span class="detail-value">
                    <span :class="['badge', getReportTypeClass(selectedReport.report_type)]">{{ formatReportType(selectedReport.report_type) }}</span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date Reported</span>
                  <span class="detail-value">{{ formatDate(selectedReport.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <p class="detail-section-title">Reporter Information</p>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="detail-label">Submitted By</span>
                  <span class="detail-value detail-value--strong">{{ selectedReport.company_name || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reported By</span>
                  <span class="detail-value">{{ selectedReport.reported_by || '—' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Supporting Doc</span>
                  <span class="detail-value">
                    <span v-if="selectedReport.supporting_document" class="badge badge--green">Attached</span>
                    <span v-else class="badge badge--gray">None</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div class="detail-section detail-section--full">
            <p class="detail-section-title">Reason for Non-Award</p>
            <p class="detail-notes">{{ selectedReport.reason || 'No reason provided.' }}</p>
          </div>

          <!-- Recommendations -->
          <div v-if="selectedReport.recommendations" class="detail-section detail-section--full">
            <p class="detail-section-title">Recommendations</p>
            <p class="detail-notes detail-notes--blue">{{ selectedReport.recommendations }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeReportDetailModal">Close</button>
          <button v-if="selectedReport?.supporting_document" type="button" class="btn btn-dark" @click="downloadReportDocument(selectedReport)">
            <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Document
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

const toast  = useToast()
const router = useRouter()

const loading         = ref(false)
const reportsLoading  = ref(false)
const showReportModal = ref(false)
const isSubmitting    = ref(false)
const currentStep     = ref(1)

// ── Detail modal state ──
const showDetailModal       = ref(false)
const selectedDetail        = ref(null)
const showReportDetailModal = ref(false)
const selectedReport        = ref(null)

const awards            = ref([])
const nonAwardedReports = ref([])
const availableTenders  = ref([])
const summary = ref({ intentions: 0, award_letters: 0, approved: 0, total_value: 0, not_awarded: 0 })
const filters = ref({ award_type: '', date_from: '', date_to: '', status: '' })

const currentPage = ref(1)
const perPage     = ref(15)
const totalPages  = computed(() => Math.max(1, Math.ceil(awards.value.length / perPage.value)))
const pagedAwards = computed(() => awards.value.slice((currentPage.value-1)*perPage.value, currentPage.value*perPage.value))

const reportForm = ref({ tender_id: '', report_type: '', reason: '', recommendations: '', file: null })

const issueTypes = [
  { value: 'technical',     label: 'Technical',     icon: '⚙️' },
  { value: 'financial',     label: 'Financial',     icon: '💰' },
  { value: 'compliance',    label: 'Compliance',    icon: '⚖️' },
  { value: 'documentation', label: 'Documentation', icon: '📄' },
  { value: 'other',         label: 'Other',         icon: '📌' },
]

const selectedTender = computed(() =>
  availableTenders.value.find(t => String(t.id) === String(reportForm.value.tender_id)) ?? null
)

function goToStep(n) { currentStep.value = n }

function openReportModal() {
  reportForm.value = { tender_id: '', report_type: '', reason: '', recommendations: '', file: null }
  currentStep.value = 1
  showReportModal.value = true
}
function closeReportModal() { showReportModal.value = false }

// ── Award detail modal ──
function viewDetails(award) {
  selectedDetail.value = award
  showDetailModal.value = true
}
function closeDetailModal() {
  showDetailModal.value = false
  selectedDetail.value = null
}

// ── Non-awarded report detail modal ──
function viewReportDetails(report) {
  selectedReport.value = report
  showReportDetailModal.value = true
}
function closeReportDetailModal() {
  showReportDetailModal.value = false
  selectedReport.value = null
}

// ── Status banner class helper ──
function getStatusBannerClass(status) {
  const map = {
    draft: 'detail-status-banner--gray',
    submitted: 'detail-status-banner--blue',
    approved: 'detail-status-banner--green',
    rejected: 'detail-status-banner--red',
    awarded: 'detail-status-banner--violet',
  }
  return map[(status||'').toLowerCase()] || 'detail-status-banner--gray'
}

// ── PDF ──────────────────────────────────────────────
const loadJsPDF = async () => {
  if (window.jspdf) return window.jspdf.jsPDF
  return new Promise((resolve, reject) => {
    const s1 = document.createElement('script')
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s1.onload = () => {
      const s2 = document.createElement('script')
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
      s2.onload = () => resolve(window.jspdf.jsPDF)
      s2.onerror = reject
      document.head.appendChild(s2)
    }
    s1.onerror = reject
    document.head.appendChild(s1)
  })
}

const buildPDF = async ({ title, subtitle, columns, rows, filename, summaryRows }) => {
  const JsPDF = await loadJsPDF()
  const doc   = new JsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const now   = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
  doc.setFillColor(25,79,146); doc.rect(0,0,pageW,52,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(255,255,255)
  doc.text(title,36,24)
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(180,180,180)
  doc.text(subtitle,36,38); doc.text(`Generated: ${now}`,pageW-36,38,{align:'right'})
  let startY = 72
  if (summaryRows?.length) {
    const cellW = (pageW-72)/summaryRows.length
    summaryRows.forEach((item,i) => {
      const x = 36+i*cellW
      doc.setFillColor(248,248,246); doc.roundedRect(x,startY,cellW-8,36,3,3,'F')
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(120,120,120)
      doc.text(item.label,x+8,startY+13)
      doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(20,20,20)
      doc.text(String(item.value),x+8,startY+28)
    })
    startY += 52
  }
  doc.autoTable({
    startY, head:[columns], body:rows, theme:'grid',
    headStyles:{ fillColor:[25,79,146], textColor:[255,255,255], fontSize:8, fontStyle:'bold', cellPadding:{top:6,bottom:6,left:8,right:8} },
    bodyStyles:{ fontSize:8, cellPadding:{top:6,bottom:6,left:8,right:8}, textColor:[40,40,40] },
    alternateRowStyles:{ fillColor:[249,249,247] },
    tableLineColor:[230,230,225], tableLineWidth:0.5,
    margin:{ left:36, right:36 },
    didDrawPage:(data) => {
      doc.setFontSize(8); doc.setTextColor(160,160,160)
      doc.text(`Page ${data.pageNumber}`,pageW/2,doc.internal.pageSize.getHeight()-18,{align:'center'})
    }
  })
  doc.save(filename)
}

const today = () => new Date().toISOString().split('T')[0]
const downloadCSV = (content, filename) => {
  const blob = new Blob([content],{type:'text/csv;charset=utf-8;'})
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'),{href:url,download:filename})
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const exportAwardsPDF = async () => {
  try {
    toast.info('Generating PDF…')
    await buildPDF({
      title:'Award & Tender Report', subtitle:'Intentions, award letters, and contract awards',
      columns:['Award ID','Tender Title','Submitted by','Type','Value (TZS)','Status','Award Date'],
      rows:awards.value.map(a=>[a.award_id||'—',a.tender_title||'—',a.company_name||'—',formatType(a.type),formatCurrency(a.value),formatStatus(a.status),formatDate(a.award_date)]),
      filename:`award_report_${today()}.pdf`,
      summaryRows:[
        {label:'Total Records',value:awards.value.length},
        {label:'Intentions',value:summary.value.intentions},
        {label:'Award Letters',value:summary.value.award_letters},
        {label:'Approved/Awarded',value:summary.value.approved},
        {label:'Total Value',value:formatCurrency(summary.value.total_value)},
      ]
    })
    toast.success('PDF exported!')
  } catch(e){ console.error(e); toast.error('PDF export failed.') }
}

const exportAwardsCSV = () => {
  const h = ['Award ID','Tender Title','Submitted by','Type','Value','Status','Award Date']
  const rows = awards.value.map(a=>[`"${a.award_id||''}"`,`"${a.tender_title||''}"`,`"${a.company_name||''}"`,`"${formatType(a.type)}"`,`"${formatCurrency(a.value)}"`,`"${formatStatus(a.status)}"`,`"${formatDate(a.award_date)}"`])
  downloadCSV([h.join(','),...rows.map(r=>r.join(','))].join('\n'),`award_report_${today()}.csv`)
  toast.success('CSV exported!')
}

const exportNonAwardedPDF = async () => {
  try {
    toast.info('Generating PDF…')
    await buildPDF({
      title:'Non-Awarded Tender Reports', subtitle:'Tenders that were not awarded',
      columns:['Report ID','Tender Title','Submitted by','Issue Type','Reported By','Date'],
      rows:nonAwardedReports.value.map(r=>[`#${r.id||'—'}`,r.tender_title||'—',r.company_name||'—',formatReportType(r.report_type),r.reported_by||'—',formatDate(r.created_at)]),
      filename:`non_awarded_report_${today()}.pdf`,
      summaryRows:[{label:'Total Reports',value:nonAwardedReports.value.length}]
    })
    toast.success('PDF exported!')
  } catch(e){ console.error(e); toast.error('PDF export failed.') }
}

const exportNonAwardedCSV = () => {
  const h = ['Report ID','Tender Title','Submitted by','Issue Type','Reported By','Date']
  const rows = nonAwardedReports.value.map(r=>[`"#${r.id||''}"`,`"${r.tender_title||''}"`,`"${r.company_name||''}"`,`"${formatReportType(r.report_type)}"`,`"${r.reported_by||''}"`,`"${formatDate(r.created_at)}"`])
  downloadCSV([h.join(','),...rows.map(r=>r.join(','))].join('\n'),`non_awarded_report_${today()}.csv`)
  toast.success('CSV exported!')
}

const formatCurrency = (v) => {
  if (v==null||isNaN(v)) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ',{style:'currency',currency:'TZS',minimumFractionDigits:0,maximumFractionDigits:0}).format(Number(v))
}
const formatDate = (d) => {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})
}
const formatType        = (t) => ({intention:'Intention',letter:'Award Letter',contract:'Contract'}[t]||(t?t[0].toUpperCase()+t.slice(1):'—'))
const formatStatus      = (s) => s ? s[0].toUpperCase()+s.slice(1).toLowerCase() : '—'
const getAwardTypeClass = (t) => ({intention:'badge--amber',letter:'badge--blue',contract:'badge--violet'}[t]||'badge--gray')
const getStatusClass    = (s) => ({draft:'badge--gray',submitted:'badge--blue',approved:'badge--green',rejected:'badge--red',awarded:'badge--violet'}[(s||'').toLowerCase()]||'badge--gray')
const formatReportType  = (t) => ({technical:'Technical',financial:'Financial',compliance:'Compliance',documentation:'Documentation',other:'Other'}[t]||t)
const getReportTypeClass = (t) => ({technical:'badge--red',financial:'badge--amber',compliance:'badge--orange',documentation:'badge--blue',other:'badge--gray'}[t]||'badge--gray')

const fetchAwards = async () => {
  loading.value = true
  try {
    const params = { page:currentPage.value, per_page:perPage.value, ...filters.value }
    const [intRes,letRes,awdRes] = await Promise.all([
      axios.get('/api/intention-to-award',{params}),
      axios.get('/api/award-letter',{params}),
      axios.get('/api/awarded-tender',{params})
    ])
    const all = [
      ...(intRes.data.data||[]).map(i=>({id:i.id,award_id:i.intention_id||`INT-${i.id}`,tender_title:i.tender?.title||'—',company_name:i.user?.name||'—',type:'intention',value:Number(i.value)||0,status:i.status||'draft',award_date:i.created_at,description:i.description||i.notes||null})),
      ...(letRes.data.data||[]).map(i=>({id:i.id,award_id:i.award_id||`LET-${i.id}`,tender_title:i.tender?.title||'—',company_name:i.user?.name||'—',type:'letter',value:Number(i.value)||0,status:i.status||'draft',award_date:i.created_at,description:i.description||i.notes||null})),
      ...(awdRes.data.data||[]).map(i=>({id:i.id,award_id:i.award_id||`AWD-${i.id}`,tender_title:i.tender?.title||'—',company_name:i.user?.name||'—',type:'contract',value:Number(i.value)||0,status:'awarded',award_date:i.created_at,description:i.description||i.notes||null}))
    ]
    let filtered = all
    if (filters.value.award_type) filtered=filtered.filter(a=>a.type===filters.value.award_type)
    if (filters.value.status)     filtered=filtered.filter(a=>a.status===filters.value.status)
    if (filters.value.date_from)  filtered=filtered.filter(a=>new Date(a.award_date)>=new Date(filters.value.date_from))
    if (filters.value.date_to)    filtered=filtered.filter(a=>new Date(a.award_date)<=new Date(filters.value.date_to))
    awards.value = filtered
    summary.value = {
      intentions:    all.filter(a=>a.type==='intention').length,
      award_letters: all.filter(a=>a.type==='letter').length,
      approved:      filtered.filter(a=>['approved','awarded'].includes(a.status)).length,
      total_value:   filtered.reduce((s,a)=>s+(a.value||0),0),
      not_awarded:  availableTenders.value.length
    }
  } catch(err){ console.error(err); toast.error('Failed to load award data'); awards.value=[] }
  finally{ loading.value=false }
}

const fetchAvailableTenders = async () => {
  try {
    const res = await axios.get('/api/tenders/available-for-reporting')
    let tendersData = res.data
    if (tendersData && typeof tendersData === 'object' && !Array.isArray(tendersData) && tendersData.data) {
      tendersData = tendersData.data
    }
    let allTenders = Array.isArray(tendersData) ? tendersData : []
    
    // Filter out tenders that already have reports
    const reportedTenderIds = nonAwardedReports.value.map(report => report.tender_id)
    availableTenders.value = allTenders.filter(tender => !reportedTenderIds.includes(tender.id))
  } catch (error) {
    console.error('Error fetching available tenders:', error)
    availableTenders.value = []
  }
}

const fetchNonAwardedReports = async () => {
  reportsLoading.value = true
  try {
    const res = await axios.get('/api/tender-reports/non-awarded')
    nonAwardedReports.value = res.data || []
  } catch { nonAwardedReports.value = [] }
  finally { reportsLoading.value = false }
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file && file.type==='application/pdf' && file.size<=10*1024*1024) {
    reportForm.value.file = file
  } else {
    toast.error('Please upload a valid PDF file (max 10 MB)')
    e.target.value = ''
  }
}

const handleFileDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && file.type==='application/pdf' && file.size<=10*1024*1024) {
    reportForm.value.file = file
  } else {
    toast.error('Please drop a valid PDF file (max 10 MB)')
  }
}

const submitNonAwardedReport = async () => {
  if (!reportForm.value.tender_id || !reportForm.value.report_type || !reportForm.value.reason.trim()) {
    toast.error('Please fill in all required fields')
    return
  }
  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('tender_id',   reportForm.value.tender_id)
    fd.append('report_type', reportForm.value.report_type)
    fd.append('reason',      reportForm.value.reason.trim())
    if (reportForm.value.recommendations.trim()) fd.append('recommendations', reportForm.value.recommendations.trim())
    if (reportForm.value.file) fd.append('supporting_document', reportForm.value.file)
    await axios.post('/api/tender-reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Report submitted successfully!')
    closeReportModal()
    await fetchNonAwardedReports()
    await fetchAvailableTenders() // Refresh available tenders to remove the reported one
  } catch(e) {
    toast.error(e.response?.data?.message || 'Failed to submit report')
  } finally {
    isSubmitting.value = false
  }
}

const resetFilters  = () => { filters.value = { award_type:'', date_from:'', date_to:'', status:'' } }
const previousPage  = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage      = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

const downloadAward = (award) => toast.info('Downloading document…')

const downloadReportDocument = async (report) => {
  try {
    const res = await axios.get(`/api/tender-reports/${report.id}/document`,{responseType:'blob'})
    const url = URL.createObjectURL(new Blob([res.data]))
    const a   = Object.assign(document.createElement('a'),{href:url,download:`non_awarded_report_${report.id}.pdf`})
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    toast.success('Downloaded!')
  } catch { toast.error('Download failed.') }
}

onMounted(async () => { 
  await fetchNonAwardedReports()
  await fetchAvailableTenders()
  fetchAwards()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.page-shell{min-height:100vh;background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%);font-family:'DM Sans',sans-serif;color:#183b63;padding:36px 40px;display:flex;flex-direction:column;gap:24px}

/* Header */
.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.page-title{font-size:26px;font-weight:700;letter-spacing:-0.03em;color:#183b63}
.page-sub{font-size:13.5px;color:#7a93af;margin-top:3px}
.header-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:7px;border-radius:12px;padding:10px 18px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;border:none;transition:background 0.15s,opacity 0.15s,box-shadow 0.15s}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn-dark{background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);color:#fff;box-shadow:0 8px 20px rgba(35,96,182,0.18)}.btn-dark:hover:not(:disabled){box-shadow:0 12px 24px rgba(35,96,182,0.28)}
.btn-danger{background:#dc2626;color:#fff}.btn-danger:hover:not(:disabled){background:#b91c1c}
.btn-outline{background:transparent;color:#4a6a8a;border:1.5px solid #d9e6f3}.btn-outline:hover:not(:disabled){background:#f7faff}
.btn-sm{padding:8px 13px;font-size:12.5px}
.btn-icon{width:16px;height:16px;flex-shrink:0}

.export-group{display:flex;align-items:center;gap:6px}
.export-label{font-size:12px;font-weight:600;color:#7d94ac;text-transform:uppercase;letter-spacing:.05em;margin-right:4px}

/* Summary */
.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.stat-card{background:#fff;border:1px solid #dce7f3;border-radius:16px;padding:20px;display:flex;align-items:center;gap:16px;transition:box-shadow 0.15s}
.stat-card:hover{box-shadow:0 4px 20px rgba(25,79,146,0.08)}
.stat-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.icon-amber{background:#fef5e7;color:#d97706}.icon-blue{background:#edf4fb;color:#2f78dd}
.icon-green{background:#edfaf7;color:#1f9d8b}.icon-violet{background:#f3edfb;color:#7c3aed}
.icon-red{background:#fef2f0;color:#e87461}
.stat-label{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#7d94ac}
.stat-value{font-size:28px;font-weight:700;letter-spacing:-0.03em;margin-top:2px;color:#183b63}
.stat-value--sm{font-size:18px}

/* Panel */
.panel{background:#fff;border:1px solid #dce7f3;border-radius:16px;padding:20px 24px}
.panel--flush{padding:0}
.panel-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #edf2fa;gap:12px}
.panel-title{font-size:16px;font-weight:700;letter-spacing:-0.02em;color:#183b63}
.panel-sub{font-size:13px;color:#7a93af;margin-top:2px}

/* Filters */
.filter-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.filter-actions{display:flex;gap:8px;margin-top:16px;justify-content:flex-end}
.field{display:flex;flex-direction:column;gap:6px}
.field-label{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#7d94ac}
.field-hint{font-size:11.5px;color:#a4b8cf;margin-top:4px;display:flex;align-items:center;gap:4px}
.field-hint-inline{font-weight:400;color:#a4b8cf;font-size:11px}
.req{color:#dc2626}
.field-input{border:1.5px solid #d9e6f3;border-radius:12px;padding:9px 12px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:#183b63;background:#fff;outline:none;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
.field-input--lg{padding:11px 14px;font-size:14px}
.field-input:focus{border-color:#2f78dd;box-shadow:0 0 0 3px rgba(47,120,221,0.12)}
.field-textarea{resize:vertical;min-height:100px}

/* Table */
.table-scroll{overflow-x:auto}
.data-table{width:100%;border-collapse:collapse;font-size:13.5px}
.data-table thead{background:#f7faff;border-bottom:1px solid #edf2fa}
.data-table th{padding:12px 18px;text-align:left;font-size:11px;font-weight:600;color:#7d94ac;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
.data-table th.text-right{text-align:right}.data-table th.text-center{text-align:center}
.table-row{border-bottom:1px solid #edf2fa;transition:background .1s}
.table-row:last-child{border-bottom:none}.table-row:hover{background:#f7faff}
.data-table td{padding:13px 18px;vertical-align:middle;color:#4a6a8a}
.data-table td.text-right{text-align:right}.data-table td.text-center{text-align:center}
.td-mono{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#67819d;white-space:nowrap}
.td-num{font-family:'IBM Plex Mono',monospace;font-size:13px}
.td-title{font-weight:500;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#183b63}
.td-actions{display:flex;gap:8px;justify-content:center}

.icon-btn{width:30px;height:30px;border-radius:10px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .12s}
.icon-btn svg{width:15px;height:15px}
.icon-btn--blue{background:#edf4fb;color:#2f78dd}.icon-btn--blue:hover{background:#dce7f3}
.icon-btn--green{background:#edfaf7;color:#1f9d8b}.icon-btn--green:hover{background:#d4f3ec}

.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;text-transform:capitalize}
.badge--green{background:#dcfce7;color:#15803d}.badge--amber{background:#fef9c3;color:#92400e}
.badge--blue{background:#dbeafe;color:#1d4ed8}.badge--violet{background:#ede9fe;color:#6d28d9}
.badge--red{background:#fee2e2;color:#b91c1c}.badge--orange{background:#ffedd5;color:#c2410c}
.badge--gray{background:#f3f4f6;color:#4b5563}

.state-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;gap:12px}
.state-title{font-size:17px;font-weight:600;color:#183b63}.state-text{font-size:13.5px;color:#7a93af;text-align:center}
.spinner{width:36px;height:36px;border:3px solid #dce7f3;border-top-color:#2f78dd;border-radius:50%;animation:spin .7s linear infinite}
.spinner--red{border-top-color:#dc2626}

.pagination{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-top:1px solid #edf2fa}
.pag-info{font-size:13px;color:#7a93af}
.pag-controls{display:flex;align-items:center;gap:8px}
.pag-btn{width:32px;height:32px;border:1.5px solid #d9e6f3;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#4a6a8a;font-size:12px;transition:background .12s}
.pag-btn:hover:not(:disabled){background:#f7faff;border-color:#2f78dd}.pag-btn:disabled{opacity:.4;cursor:not-allowed}
.pag-current{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#4a6a8a;min-width:48px;text-align:center}

/* ══ MODAL ══ */
.modal-backdrop{position:fixed;inset:0;background:#00000070;display:flex;align-items:center;justify-content:center;z-index:9999;padding:24px;backdrop-filter:blur(3px)}
.modal{background:#fff;border-radius:16px;width:100%;max-width:680px;max-height:92vh;overflow-y:auto;box-shadow:0 32px 80px #00000040;border:1px solid #dce7f3}
.modal--detail{max-width:700px}

.modal-header{background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);padding:20px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between}
.modal-header--red{background:#7f1d1d}
.modal-header-left{display:flex;align-items:center;gap:14px}
.modal-header-icon{width:40px;height:40px;border-radius:12px;background:#ffffff20;display:flex;align-items:center;justify-content:center}
.modal-header-icon svg{width:20px;height:20px;color:#fff}
.modal-title{font-size:15px;font-weight:700;color:#fff}
.modal-subtitle{font-size:12px;color:rgba(255,255,255,0.6);margin-top:2px}
.modal-close{background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:6px;display:flex;align-items:center;border-radius:8px;transition:color .15s,background .15s}
.modal-close:hover{color:#fff;background:#ffffff20}
.modal-close svg{width:18px;height:18px}

/* Step indicator */
.modal-steps{position:relative;display:flex;align-items:center;justify-content:space-between;padding:20px 40px;border-bottom:1px solid #edf2fa;background:#f7faff;overflow:hidden}
.step-wrap{display:flex;flex-direction:column;align-items:center;gap:6px;z-index:1}
.step-dot{width:32px;height:32px;border-radius:50%;background:#dce7f3;color:#7a93af;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #dce7f3;transition:all .25s}
.step-dot--active{background:linear-gradient(135deg,#194f92,#2f78dd);color:#fff;border-color:#2f78dd}
.step-dot--done{background:#1f9d8b;color:#fff;border-color:#1f9d8b}
.step-label{font-size:11px;font-weight:600;color:#a4b8cf;transition:color .25s;white-space:nowrap}
.step-label--active{color:#183b63}
.step-connector{position:absolute;top:36px;left:40px;height:2px;background:linear-gradient(135deg,#194f92,#2f78dd);transition:width .3s ease;z-index:0}
.modal-steps::before{content:'';position:absolute;top:36px;left:40px;right:40px;height:2px;background:#dce7f3;z-index:0}

/* Modal body */
.modal-body{padding:24px 28px;display:flex;flex-direction:column;gap:20px}
.step-heading h4{font-size:15px;font-weight:700;color:#183b63}
.step-heading p{font-size:13px;color:#7a93af;margin-top:4px}

.form-field{display:flex;flex-direction:column;gap:6px}

/* Tender preview */
.tender-preview{background:#f7faff;border:1px solid #dce7f3;border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.tender-preview-row{display:flex;gap:12px;align-items:baseline}
.tp-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7d94ac;min-width:64px}
.tp-value{font-size:13.5px;font-weight:500;color:#183b63}
.tp-expired{color:#dc2626}

/* Issue types */
.issue-type-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.issue-type-btn{display:flex;flex-direction:column;align-items:center;gap:7px;padding:14px 8px;border-radius:12px;border:1.5px solid #dce7f3;background:#fff;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
.issue-type-btn:hover{border-color:#2f78dd;background:#f7faff;transform:translateY(-1px)}
.issue-type-btn--active{border-color:#2f78dd;background:linear-gradient(135deg,#194f92,#2f78dd)}
.issue-type-btn--active .issue-type-label{color:#fff}
.issue-type-icon{font-size:22px}
.issue-type-label{font-size:11px;font-weight:600;color:#4a6a8a;text-align:center}

/* File drop */
.file-drop{border:2px dashed #d9e6f3;border-radius:12px;padding:32px 24px;text-align:center;transition:all .15s;cursor:pointer}
.file-drop:hover{border-color:#2f78dd;background:#f7faff}
.file-drop--has{border-color:#1f9d8b;background:#edfaf7;border-style:solid}
.file-drop-icon{width:40px;height:40px;color:#a4b8cf;margin:0 auto 12px}
.file-drop-text{font-size:14px;color:#4a6a8a}
.file-drop-sub{font-size:12px;color:#a4b8cf;margin-top:6px}
.file-drop-cta{color:#2f78dd;font-weight:600;cursor:pointer;text-decoration:underline}
.file-selected{display:flex;align-items:center;gap:14px}
.file-selected-icon{width:44px;height:44px;background:#fee2e2;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#dc2626;font-size:20px;flex-shrink:0}
.file-selected-info{flex:1;text-align:left}
.file-selected-name{font-size:13.5px;font-weight:600;color:#183b63}
.file-selected-size{font-size:12px;color:#7a93af;margin-top:2px}
.file-remove-btn{width:30px;height:30px;border-radius:8px;border:1.5px solid #dce7f3;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#7a93af;transition:all .15s;flex-shrink:0}
.file-remove-btn:hover{border-color:#dc2626;color:#dc2626;background:#fee2e2}
.file-remove-btn svg{width:14px;height:14px}

/* Submit summary */
.submit-summary{background:#f7faff;border:1px solid #dce7f3;border-radius:12px;padding:16px 18px}
.submit-summary-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7d94ac;margin-bottom:14px}
.submit-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ss-item{display:flex;flex-direction:column;gap:4px}
.ss-item--full{grid-column:1/-1}
.ss-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#a4b8cf}
.ss-value{font-size:13px;font-weight:500;color:#183b63}
.ss-value--muted{color:#4a6a8a;font-weight:400;line-height:1.5}

/* Modal footer */
.modal-footer{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:20px 28px;border-top:1px solid #edf2fa;margin-top:4px}

/* ══ DETAIL MODAL SPECIFIC ══ */
.detail-status-banner{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;border:1px solid #dce7f3;background:#f7faff}
.detail-status-banner--gray{background:#f9fafb;border-color:#dce7f3}
.detail-status-banner--blue{background:#edf4fb;border-color:#bfdbfe}
.detail-status-banner--green{background:#edfaf7;border-color:#bbf7d0}
.detail-status-banner--red{background:#fef2f0;border-color:#fecdd3}
.detail-status-banner--violet{background:#f3edfb;border-color:#ddd6fe}
.detail-status-banner--issue{background:#fef5e7;border-color:#fed7aa}
.detail-status-date{font-size:12.5px;color:#7a93af;margin-left:auto}

.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.detail-section{background:#f7faff;border:1px solid #dce7f3;border-radius:12px;padding:16px}
.detail-section--full{grid-column:1/-1;background:#f7faff;border:1px solid #dce7f3;border-radius:12px;padding:16px}
.detail-section-title{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#7d94ac;margin-bottom:12px}
.detail-rows{display:flex;flex-direction:column;gap:10px}
.detail-row{display:flex;flex-direction:column;gap:3px}
.detail-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#a4b8cf}
.detail-value{font-size:13.5px;color:#183b63}
.detail-value--strong{font-weight:600}
.detail-value--mono{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:#67819d}
.detail-value--value{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:700;color:#183b63}
.detail-notes{font-size:13.5px;color:#4a6a8a;line-height:1.7;white-space:pre-wrap}
.detail-notes--blue{color:#194f92;background:#edf4fb;border-radius:10px;padding:10px 14px;font-size:13px}

@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin .7s linear infinite}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}

@media(max-width:1100px){.summary-grid{grid-template-columns:repeat(2,1fr)}.filter-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .page-shell{padding:20px 16px}
  .summary-grid{grid-template-columns:repeat(2,1fr)}
  .filter-grid{grid-template-columns:1fr}
  .issue-type-grid{grid-template-columns:repeat(3,1fr)}
  .submit-summary-grid{grid-column:1/-1}
  .header-actions{width:100%}
  .modal-steps{padding:16px 20px}
  .step-label{display:none}
  .detail-grid{grid-template-columns:1fr}
}
</style>