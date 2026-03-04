<template>
  <div class="page-shell">

    <!-- ── Page header ──────────────────────────────── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Award &amp; Tender Reports</h1>
        <p class="page-sub">Track awarded tenders and report cases where no award was granted</p>
      </div>
      <div class="header-actions">
        <button @click="showReportModal = true" class="btn btn-danger">
          <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report Non-Awarded
        </button>

        <div class="export-group">
          <span class="export-label">Export Awards</span>
          <button @click="exportAwardsCSV" :disabled="loading || awards.length === 0" class="btn btn-outline btn-sm">
            <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
          <button @click="exportAwardsPDF" :disabled="loading || awards.length === 0" class="btn btn-dark btn-sm">
            <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <!-- ── Summary cards ─────────────────────────────── -->
    <div class="summary-grid" v-if="!loading">
      <div class="stat-card">
        <div class="stat-icon icon-amber">
          <i class="fas fa-lightbulb"></i>
        </div>
        <div>
          <p class="stat-label">Intentions</p>
          <p class="stat-value">{{ summary.intentions }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-blue">
          <i class="fas fa-envelope"></i>
        </div>
        <div>
          <p class="stat-label">Award Letters</p>
          <p class="stat-value">{{ summary.award_letters }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-green">
          <i class="fas fa-check-circle"></i>
        </div>
        <div>
          <p class="stat-label">Approved / Awarded</p>
          <p class="stat-value">{{ summary.approved }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-violet">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div>
          <p class="stat-label">Total Value</p>
          <p class="stat-value stat-value--sm">{{ formatCurrency(summary.total_value) }}</p>
        </div>
      </div>
    </div>

    <!-- ── Filters ────────────────────────────────────── -->
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
        <button @click="fetchAwards" :disabled="loading" class="btn btn-dark btn-sm">
          <svg v-if="loading" class="btn-icon spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="8"/>
          </svg>
          Apply Filters
        </button>
        <button @click="resetFilters" class="btn btn-outline btn-sm">Reset</button>
      </div>
    </div>

    <!-- ── Awards table ───────────────────────────────── -->
    <div class="panel panel--flush">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Award Records</h2>
          <p class="panel-sub">Intentions, award letters, and contract awards</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-center">
        <div class="spinner"></div>
        <p class="state-text">Loading award records…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="awards.length === 0" class="state-center">
        <svg class="state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="state-title">No records found</h3>
        <p class="state-text">Try adjusting your filters or there are no matching records yet.</p>
      </div>

      <!-- Table -->
      <div v-else>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Award ID</th>
                <th>Tender Title</th>
                <th>Company</th>
                <th>Type</th>
                <th class="text-right">Value</th>
                <th class="text-center">Status</th>
                <th class="text-center">Award Date</th>
                <th class="text-center">Actions</th>
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
                  <button @click="downloadAward(award)" class="icon-btn icon-btn--green" title="Download">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <p class="pag-info">Showing <strong>{{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, awards.length) }}</strong> of <strong>{{ awards.length }}</strong></p>
          <div class="pag-controls">
            <button @click="previousPage" :disabled="currentPage === 1" class="pag-btn"><i class="fas fa-chevron-left"></i></button>
            <span class="pag-current">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages" class="pag-btn"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Non-awarded reports table ──────────────────── -->
    <div class="panel panel--flush">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Non-Awarded Tender Reports</h2>
          <p class="panel-sub">Reports for tenders that were not awarded</p>
        </div>
        <div class="export-group">
          <span class="export-label">Export</span>
          <button @click="exportNonAwardedCSV" :disabled="nonAwardedReports.length === 0" class="btn btn-outline btn-sm">CSV</button>
          <button @click="exportNonAwardedPDF" :disabled="nonAwardedReports.length === 0" class="btn btn-dark btn-sm">PDF</button>
        </div>
      </div>

      <div v-if="reportsLoading" class="state-center">
        <div class="spinner spinner--red"></div>
        <p class="state-text">Loading non-awarded reports…</p>
      </div>

      <div v-else-if="nonAwardedReports.length === 0" class="state-center">
        <svg class="state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="state-title">No reports yet</h3>
        <p class="state-text">No non-awarded tender reports have been submitted.</p>
      </div>

      <div v-else>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Tender Title</th>
                <th>Company</th>
                <th>Issue Type</th>
                <th>Reported By</th>
                <th class="text-center">Date</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in nonAwardedReports" :key="report.id" class="table-row">
                <td class="td-mono">#{{ report.id || '—' }}</td>
                <td class="td-title" :title="report.tender_title">{{ report.tender_title || '—' }}</td>
                <td>{{ report.company_name || '—' }}</td>
                <td><span :class="['badge', getReportTypeClass(report.report_type)]">{{ formatReportType(report.report_type) }}</span></td>
                <td>{{ report.reported_by || '—' }}</td>
                <td class="text-center">{{ formatDate(report.created_at) }}</td>
                <td class="text-center td-actions">
                  <button @click="viewReportDetails(report)" class="icon-btn icon-btn--blue" title="View Details">
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

    <!-- ── Non-Awarded Report Modal ───────────────────── -->
    <Teleport to="body">
      <div v-if="showReportModal" class="modal-backdrop" @click.self="showReportModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Report Non-Awarded Tender</h3>
            <button @click="showReportModal = false" class="modal-close">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitNonAwardedReport" class="modal-body">
            <div class="form-grid">
              <!-- Tender selection -->
              <div class="form-field form-field--full">
                <label class="field-label">Select Tender <span class="req">*</span></label>
                <select v-model="reportForm.tender_id" required class="field-input">
                  <option value="">Choose a tender…</option>
                  <option v-if="availableTenders.length === 0" disabled>No expired tenders available</option>
                  <option v-for="tender in availableTenders" :key="tender.id" :value="tender.id">
                    {{ tender.title }} — {{ tender.company_name || 'Unknown Company' }}
                    {{ tender.expired_at ? `(Expired: ${formatDate(tender.expired_at)})` : '' }}
                  </option>
                </select>
                <p class="field-hint">{{ availableTenders.length }} expired tender(s) available for reporting</p>
              </div>

              <!-- Issue type -->
              <div class="form-field">
                <label class="field-label">Issue Type <span class="req">*</span></label>
                <select v-model="reportForm.report_type" required class="field-input">
                  <option value="">Select type…</option>
                  <option value="technical">Technical Issues</option>
                  <option value="financial">Financial Issues</option>
                  <option value="compliance">Compliance / Legal</option>
                  <option value="documentation">Documentation Problems</option>
                  <option value="other">Other Issues</option>
                </select>
              </div>

              <!-- Detailed reason -->
              <div class="form-field form-field--full">
                <label class="field-label">Detailed Reason <span class="req">*</span></label>
                <textarea v-model="reportForm.reason" required rows="5" placeholder="Please provide detailed reasons why this tender was not awarded…" class="field-input field-textarea"></textarea>
              </div>

              <!-- Recommendations -->
              <div class="form-field form-field--full">
                <label class="field-label">Recommendations <span class="field-hint-inline">(optional)</span></label>
                <textarea v-model="reportForm.recommendations" rows="3" placeholder="Any recommendations for future tenders…" class="field-input field-textarea"></textarea>
              </div>

              <!-- File upload -->
              <div class="form-field form-field--full">
                <label class="field-label">Supporting Document <span class="field-hint-inline">(PDF, max 10 MB)</span></label>
                <div class="file-drop" :class="{ 'file-drop--has': reportForm.file }">
                  <svg class="file-drop-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <p v-if="!reportForm.file" class="file-drop-text">
                    <label class="file-drop-cta">Upload PDF<input type="file" accept=".pdf" @change="handleFileUpload" class="sr-only" /></label>
                    &nbsp;or drag and drop
                  </p>
                  <p v-else class="file-drop-selected">
                    <i class="fas fa-file-pdf"></i>
                    {{ reportForm.file.name }} ({{ (reportForm.file.size / 1024 / 1024).toFixed(2) }} MB)
                    <button type="button" @click="reportForm.file = null" class="file-remove">Remove</button>
                  </p>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="showReportModal = false" class="btn btn-outline">Cancel</button>
              <button type="submit" :disabled="isSubmitting || !reportForm.tender_id || !reportForm.report_type || !reportForm.reason" class="btn btn-danger">
                <svg v-if="isSubmitting" class="btn-icon spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="8"/></svg>
                {{ isSubmitting ? 'Submitting…' : 'Submit Report' }}
              </button>
            </div>
          </form>
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

// ── State ──────────────────────────────────────────────
const loading        = ref(false)
const reportsLoading = ref(false)
const showReportModal = ref(false)
const isSubmitting   = ref(false)

const awards            = ref([])
const nonAwardedReports = ref([])
const availableTenders  = ref([])

const summary = ref({ intentions: 0, award_letters: 0, approved: 0, total_value: 0 })

const filters = ref({ award_type: '', date_from: '', date_to: '', status: '' })

const currentPage  = ref(1)
const perPage      = ref(15)
const totalPages   = computed(() => Math.max(1, Math.ceil(awards.value.length / perPage.value)))
const pagedAwards  = computed(() => awards.value.slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value))

const reportForm = ref({ tender_id: '', report_type: '', reason: '', recommendations: '', file: null })

// ── PDF helpers (dynamic import of jsPDF) ─────────────
const loadJsPDF = async () => {
  // Use CDN builds loaded via script tags if not bundled
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
  const doc = new JsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

  const pageW = doc.internal.pageSize.getWidth()
  const now   = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Header bar
  doc.setFillColor(15, 17, 23)
  doc.rect(0, 0, pageW, 52, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text(title, 36, 24)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(180, 180, 180)
  doc.text(subtitle, 36, 38)
  doc.text(`Generated: ${now}`, pageW - 36, 38, { align: 'right' })

  // Optional summary block
  let startY = 72
  if (summaryRows && summaryRows.length) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const cellW = (pageW - 72) / summaryRows.length
    summaryRows.forEach((item, i) => {
      const x = 36 + i * cellW
      doc.setFillColor(248, 248, 246)
      doc.roundedRect(x, startY, cellW - 8, 36, 3, 3, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(item.label, x + 8, startY + 13)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(20, 20, 20)
      doc.text(String(item.value), x + 8, startY + 28)
    })
    startY += 52
  }

  // Table
  doc.autoTable({
    startY,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 17, 23],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
      textColor: [40, 40, 40],
    },
    alternateRowStyles: { fillColor: [249, 249, 247] },
    tableLineColor: [230, 230, 225],
    tableLineWidth: 0.5,
    margin: { left: 36, right: 36 },
    styles: { overflow: 'linebreak', cellWidth: 'wrap' },
    columnStyles: { 0: { cellWidth: 'auto' } },
    didDrawPage: (data) => {
      doc.setFontSize(8)
      doc.setTextColor(160, 160, 160)
      doc.text(`Page ${data.pageNumber}`, pageW / 2, doc.internal.pageSize.getHeight() - 18, { align: 'center' })
    }
  })

  doc.save(filename)
}

// ── Export: Awards PDF ─────────────────────────────────
const exportAwardsPDF = async () => {
  try {
    toast.info('Generating PDF…')
    const columns = ['Award ID', 'Tender Title', 'Company', 'Type', 'Value (TZS)', 'Status', 'Award Date']
    const rows = awards.value.map(a => [
      a.award_id || '—',
      a.tender_title || '—',
      a.company_name || '—',
      formatType(a.type),
      formatCurrency(a.value),
      formatStatus(a.status),
      formatDate(a.award_date)
    ])
    await buildPDF({
      title: 'Award & Tender Report',
      subtitle: 'Intentions, award letters, and contract awards',
      columns,
      rows,
      filename: `award_report_${today()}.pdf`,
      summaryRows: [
        { label: 'Total Records', value: awards.value.length },
        { label: 'Intentions', value: summary.value.intentions },
        { label: 'Award Letters', value: summary.value.award_letters },
        { label: 'Approved / Awarded', value: summary.value.approved },
        { label: 'Total Value', value: formatCurrency(summary.value.total_value) },
      ]
    })
    toast.success('PDF exported successfully!')
  } catch (e) {
    console.error(e)
    toast.error('PDF export failed.')
  }
}

// ── Export: Awards CSV ────────────────────────────────
const exportAwardsCSV = () => {
  const h = ['Award ID', 'Tender Title', 'Company', 'Type', 'Value', 'Status', 'Award Date']
  const rows = awards.value.map(a => [
    `"${a.award_id || ''}"`,
    `"${a.tender_title || ''}"`,
    `"${a.company_name || ''}"`,
    `"${formatType(a.type)}"`,
    `"${formatCurrency(a.value)}"`,
    `"${formatStatus(a.status)}"`,
    `"${formatDate(a.award_date)}"`
  ])
  downloadCSV([h.join(','), ...rows.map(r => r.join(','))].join('\n'), `award_report_${today()}.csv`)
  toast.success('CSV exported!')
}

// ── Export: Non-Awarded PDF ───────────────────────────
const exportNonAwardedPDF = async () => {
  try {
    toast.info('Generating PDF…')
    const columns = ['Report ID', 'Tender Title', 'Company', 'Issue Type', 'Reported By', 'Date']
    const rows = nonAwardedReports.value.map(r => [
      `#${r.id || '—'}`,
      r.tender_title || '—',
      r.company_name || '—',
      formatReportType(r.report_type),
      r.reported_by || '—',
      formatDate(r.created_at)
    ])
    await buildPDF({
      title: 'Non-Awarded Tender Reports',
      subtitle: 'Tenders that were not awarded and submitted issue reports',
      columns,
      rows,
      filename: `non_awarded_report_${today()}.pdf`,
      summaryRows: [
        { label: 'Total Reports', value: nonAwardedReports.value.length },
      ]
    })
    toast.success('PDF exported successfully!')
  } catch (e) {
    console.error(e)
    toast.error('PDF export failed.')
  }
}

// ── Export: Non-Awarded CSV ───────────────────────────
const exportNonAwardedCSV = () => {
  const h = ['Report ID', 'Tender Title', 'Company', 'Issue Type', 'Reported By', 'Date']
  const rows = nonAwardedReports.value.map(r => [
    `"#${r.id || ''}"`,
    `"${r.tender_title || ''}"`,
    `"${r.company_name || ''}"`,
    `"${formatReportType(r.report_type)}"`,
    `"${r.reported_by || ''}"`,
    `"${formatDate(r.created_at)}"`
  ])
  downloadCSV([h.join(','), ...rows.map(r => r.join(','))].join('\n'), `non_awarded_report_${today()}.csv`)
  toast.success('CSV exported!')
}

// ── Utilities ─────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0]

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value))
}

const formatDate = (d) => {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatType = (type) => ({ intention: 'Intention', letter: 'Award Letter', contract: 'Contract' }[type] || (type ? type[0].toUpperCase() + type.slice(1) : '—'))
const formatStatus = (s) => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '—'

const getAwardTypeClass = (type) => ({
  intention: 'badge--amber',
  letter: 'badge--blue',
  contract: 'badge--violet'
}[type] || 'badge--gray')

const getStatusClass = (status) => ({
  draft: 'badge--gray',
  submitted: 'badge--blue',
  approved: 'badge--green',
  rejected: 'badge--red',
  awarded: 'badge--violet'
}[(status || '').toLowerCase()] || 'badge--gray')

const formatReportType = (type) => ({ technical: 'Technical', financial: 'Financial', compliance: 'Compliance', documentation: 'Documentation', other: 'Other' }[type] || type)

const getReportTypeClass = (type) => ({
  technical: 'badge--red',
  financial: 'badge--amber',
  compliance: 'badge--orange',
  documentation: 'badge--blue',
  other: 'badge--gray'
}[type] || 'badge--gray')

// ── API ───────────────────────────────────────────────
const fetchAwards = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, per_page: perPage.value, ...filters.value }
    const [intRes, letRes, awdRes] = await Promise.all([
      axios.get('/api/intention-to-award', { params }),
      axios.get('/api/award-letter', { params }),
      axios.get('/api/awarded-tender', { params })
    ])
    const all = [
      ...(intRes.data.data || []).map(i => ({ id: i.id, award_id: i.intention_id || `INT-${i.id}`, tender_title: i.tender_title || i.title || '—', company_name: i.company_name || '—', type: 'intention', value: Number(i.value) || 0, status: i.status || 'draft', award_date: i.created_at || i.award_date, document: i.intention_file })),
      ...(letRes.data.data || []).map(i => ({ id: i.id, award_id: i.letter_id || `LET-${i.id}`, tender_title: i.tender_title || i.title || '—', company_name: i.company_name || '—', type: 'letter', value: Number(i.value) || 0, status: i.status || 'draft', award_date: i.created_at || i.award_date, document: i.awardletter_file })),
      ...(awdRes.data.data || []).map(i => ({ id: i.id, award_id: i.award_id || `AWD-${i.id}`, tender_title: i.tender_title || i.title || '—', company_name: i.company_name || '—', type: 'contract', value: Number(i.value) || 0, status: 'awarded', award_date: i.created_at || i.award_date, document: i.awarded_document }))
    ]
    let filtered = all
    if (filters.value.award_type) filtered = filtered.filter(a => a.type === filters.value.award_type)
    if (filters.value.status) filtered = filtered.filter(a => a.status === filters.value.status)
    if (filters.value.date_from) filtered = filtered.filter(a => new Date(a.award_date) >= new Date(filters.value.date_from))
    if (filters.value.date_to) filtered = filtered.filter(a => new Date(a.award_date) <= new Date(filters.value.date_to))
    awards.value = filtered
    summary.value = {
      intentions: all.filter(a => a.type === 'intention').length,
      award_letters: all.filter(a => a.type === 'letter').length,
      approved: filtered.filter(a => ['approved', 'awarded'].includes(a.status)).length,
      total_value: filtered.reduce((s, a) => s + (a.value || 0), 0)
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to load award data')
    awards.value = []
  } finally {
    loading.value = false
  }
}

const fetchAvailableTenders = async () => {
  try {
    const res = await axios.get('/api/tenders/available-for-reporting')
    availableTenders.value = res.data || []
  } catch { availableTenders.value = [] }
}

const fetchNonAwardedReports = async () => {
  reportsLoading.value = true
  try {
    const res = await axios.get('/api/tender-reports/non-awarded')
    nonAwardedReports.value = res.data || []
  } catch { nonAwardedReports.value = [] } finally { reportsLoading.value = false }
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
    reportForm.value.file = file
  } else {
    toast.error('Please upload a valid PDF file (max 10 MB)')
    e.target.value = ''
  }
}

const submitNonAwardedReport = async () => {
  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('tender_id', reportForm.value.tender_id)
    fd.append('report_type', reportForm.value.report_type)
    fd.append('reason', reportForm.value.reason.trim())
    if (reportForm.value.recommendations.trim()) fd.append('recommendations', reportForm.value.recommendations.trim())
    if (reportForm.value.file) fd.append('supporting_document', reportForm.value.file)
    await axios.post('/api/tender-reports/non-awarded', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Report submitted successfully')
    reportForm.value = { tender_id: '', report_type: '', reason: '', recommendations: '', file: null }
    showReportModal.value = false
    await fetchNonAwardedReports()
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to submit report')
  } finally {
    isSubmitting.value = false }
}

const resetFilters = () => { filters.value = { award_type: '', date_from: '', date_to: '', status: '' } }
const previousPage = () => { if (currentPage.value > 1) { currentPage.value--; } }
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; } }
const viewDetails = (award) => toast.info(`Viewing ${award.type} details…`)
const downloadAward = (award) => toast.info('Downloading document…')
const viewReportDetails = (report) => toast.info(`Viewing report #${report.id}`)
const downloadReportDocument = async (report) => {
  try {
    const res = await axios.get(`/api/tender-reports/${report.id}/document`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = Object.assign(document.createElement('a'), { href: url, download: `non_awarded_report_${report.id}.pdf` })
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    toast.success('Downloaded!')
  } catch { toast.error('Download failed.') }
}

onMounted(() => { fetchAwards(); fetchAvailableTenders(); fetchNonAwardedReports() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Shell ── */
.page-shell {
  min-height: 100vh;
  background: #f4f4f0;
  font-family: 'Sora', sans-serif;
  color: #1a1a1a;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Page header ── */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; }
.page-sub { font-size: 13.5px; color: #888; margin-top: 3px; }
.header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  border: none;
  transition: background 0.15s, opacity 0.15s;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-dark { background: #111; color: #fff; }
.btn-dark:hover:not(:disabled) { background: #2a2a2a; }
.btn-danger { background: #dc2626; color: #fff; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-outline { background: transparent; color: #444; border: 1.5px solid #d0d0d0; }
.btn-outline:hover:not(:disabled) { background: #eee; }
.btn-sm { padding: 8px 13px; font-size: 12.5px; }
.btn-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* ── Export group ── */
.export-group { display: flex; align-items: center; gap: 6px; }
.export-label { font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 4px; }

/* ── Summary cards ── */
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.15s;
}
.stat-card:hover { box-shadow: 0 4px 20px #0000000b; }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.icon-amber { background: #fef9c3; color: #d97706; }
.icon-blue  { background: #eff6ff; color: #2563eb; }
.icon-green { background: #f0fdf4; color: #16a34a; }
.icon-violet{ background: #f5f3ff; color: #7c3aed; }
.stat-label { font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
.stat-value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; margin-top: 2px; }
.stat-value--sm { font-size: 18px; }

/* ── Panel ── */
.panel {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px 24px;
}
.panel--flush { padding: 0; }
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0ee;
  gap: 12px;
}
.panel-title { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
.panel-sub { font-size: 13px; color: #888; margin-top: 2px; }

/* ── Filters ── */
.filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.filter-actions { display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #555; }
.field-hint { font-size: 11.5px; color: #999; margin-top: 4px; }
.field-hint-inline { font-weight: 400; color: #999; font-size: 11px; }
.req { color: #dc2626; }
.field-input {
  border: 1.5px solid #d4d4d4;
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 13.5px;
  font-family: 'Sora', sans-serif;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-appearance: none;
}
.field-input:focus { border-color: #111; box-shadow: 0 0 0 3px #1111110f; background: #fff; }
.field-textarea { resize: vertical; min-height: 90px; }

/* ── Table ── */
.table-scroll { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table thead { background: #f8f8f6; border-bottom: 1px solid #e5e5e5; }
.data-table th {
  padding: 12px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.data-table th.text-right { text-align: right; }
.data-table th.text-center { text-align: center; }
.table-row { border-bottom: 1px solid #f0f0ee; transition: background 0.1s; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #fafaf8; }
.data-table td { padding: 13px 18px; vertical-align: middle; }
.data-table td.text-right { text-align: right; }
.data-table td.text-center { text-align: center; }
.td-mono { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: #555; white-space: nowrap; }
.td-num { font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
.td-title { font-weight: 500; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-actions { display: flex; gap: 8px; justify-content: center; }

/* ── Icon buttons ── */
.icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s;
}
.icon-btn svg { width: 15px; height: 15px; }
.icon-btn--blue { background: #eff6ff; color: #2563eb; }
.icon-btn--blue:hover { background: #dbeafe; }
.icon-btn--green { background: #f0fdf4; color: #16a34a; }
.icon-btn--green:hover { background: #dcfce7; }

/* ── Badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: capitalize;
}
.badge--green  { background: #dcfce7; color: #15803d; }
.badge--amber  { background: #fef9c3; color: #92400e; }
.badge--blue   { background: #dbeafe; color: #1d4ed8; }
.badge--violet { background: #ede9fe; color: #6d28d9; }
.badge--red    { background: #fee2e2; color: #b91c1c; }
.badge--orange { background: #ffedd5; color: #c2410c; }
.badge--gray   { background: #f3f4f6; color: #4b5563; }

/* ── States ── */
.state-center { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 24px; gap: 12px; }
.state-icon { width: 56px; height: 56px; color: #ccc; }
.state-title { font-size: 17px; font-weight: 600; color: #333; }
.state-text { font-size: 13.5px; color: #aaa; text-align: center; }
.spinner { width: 36px; height: 36px; border: 3px solid #e5e5e5; border-top-color: #111; border-radius: 50%; animation: spin 0.7s linear infinite; }
.spinner--red { border-top-color: #dc2626; }

/* ── Pagination ── */
.pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid #f0f0ee; }
.pag-info { font-size: 13px; color: #888; }
.pag-controls { display: flex; align-items: center; gap: 8px; }
.pag-btn {
  width: 32px;
  height: 32px;
  border: 1.5px solid #d4d4d4;
  border-radius: 7px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  font-size: 12px;
  transition: background 0.12s;
}
.pag-btn:hover:not(:disabled) { background: #f5f5f5; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-current { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: #555; min-width: 48px; text-align: center; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #00000066;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
  backdrop-filter: blur(2px);
}
.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 660px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px #00000030;
}
.modal-header {
  background: #0f1117;
  padding: 20px 24px;
  border-radius: 14px 14px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title { font-size: 16px; font-weight: 700; color: #fff; }
.modal-close { background: none; border: none; color: #aaa; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: color 0.15s; }
.modal-close:hover { color: #fff; }
.modal-close svg { width: 20px; height: 20px; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 0; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 20px; border-top: 1px solid #f0f0ee; margin-top: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field--full { grid-column: 1 / -1; }

/* ── File drop ── */
.file-drop {
  border: 2px dashed #d4d4d4;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: border-color 0.15s, background 0.15s;
}
.file-drop:hover { border-color: #aaa; background: #fafafa; }
.file-drop--has { border-color: #16a34a; background: #f0fdf4; }
.file-drop-icon { width: 36px; height: 36px; color: #ccc; margin: 0 auto 10px; }
.file-drop-text { font-size: 13.5px; color: #666; }
.file-drop-cta { color: #2563eb; font-weight: 600; cursor: pointer; text-decoration: underline; text-decoration-color: transparent; transition: text-decoration-color 0.15s; }
.file-drop-cta:hover { text-decoration-color: currentColor; }
.file-drop-selected { font-size: 13.5px; color: #15803d; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
.file-remove { background: none; border: none; font-size: 12px; color: #dc2626; cursor: pointer; font-family: 'Sora', sans-serif; text-decoration: underline; padding: 0; }

/* ── Animations ── */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.7s linear infinite; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .filter-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .page-shell { padding: 20px 16px; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .filter-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .header-actions { width: 100%; }
}
</style>