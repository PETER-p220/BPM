<template>
  <div class="updates-root">
    <!-- Subtle background grid -->
    <div class="bg-grid" aria-hidden="true"></div>

    <div class="content-wrap">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="header-badge">REPORTS</div>
          <h1 class="page-title">Engineer Updates</h1>
          <p class="page-sub">View, filter and export daily engineer progress updates</p>
        </div>
        <div v-if="reports.length" class="header-stat">
          <span class="stat-num">{{ reports.length }}</span>
          <span class="stat-label">updates</span>
        </div>
      </header>

      <!-- Filter Bar -->
      <section class="filter-card">
        <div class="quick-ranges">
          <button
            v-for="range in quickRanges"
            :key="range.value"
            class="quick-btn"
            :class="{ active: selectedQuickRange === range.value }"
            @click="applyQuickRange(range)"
          >
            {{ range.label }}
          </button>
        </div>

        <div class="filter-grid">
          <div class="field-group">
            <label class="field-label">From</label>
            <input
              type="date"
              v-model="fromDate"
              class="field-input"
              :max="toDate || undefined"
            />
          </div>

          <div class="field-group">
            <label class="field-label">To</label>
            <input
              type="date"
              v-model="toDate"
              class="field-input"
              :min="fromDate || undefined"
            />
          </div>

          <div class="action-group">
            <button class="btn btn-primary" @click="fetchReport" :disabled="isLoading || !fromDate || !toDate">
              <span v-if="isLoading" class="spinner"></span>
              Fetch
            </button>

            <button class="btn btn-ghost" @click="resetFilter" :disabled="isLoading">
              Reset
            </button>

            <button
              class="btn btn-excel"
              @click="exportToExcel"
              :disabled="isLoading || !reports.length"
              title="Export to Excel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
                <line x1="9" y1="11" x2="15" y2="11"/>
              </svg>
              Excel
            </button>

            <button
              class="btn btn-pdf"
              @click="exportToPDF"
              :disabled="isLoading || !reports.length"
              title="Export to PDF"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M9 13h6M9 17h4"/>
              </svg>
              PDF
            </button>
          </div>
        </div>
      </section>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="state-card skeleton-container">
        <div v-for="i in 6" :key="i" class="skeleton-row"></div>
      </div>

      <!-- Table -->
      <div v-else-if="reports.length > 0" class="table-card">
        <div class="table-meta">
          <span class="showing-text">
            Showing <strong>{{ startIndex }}–{{ endIndex }}</strong> of <strong>{{ reports.length }}</strong>
          </span>
          <div class="per-page">
            <label>Per page</label>
            <select v-model="itemsPerPage" @change="currentPage = 1" class="per-page-select">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-no">#</th>
                <th>Engineer</th>
                <th>Title</th>
                <th class="col-desc">Description</th>
                <th>Date</th>
                <th class="col-center">Photo</th>
                <th class="col-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(report, index) in paginatedReports"
                :key="report.chat_id"
                class="table-row"
                @click="viewUpdate(report)"
                tabindex="0"
                @keydown.enter="viewUpdate(report)"
              >
                <td class="col-no text-muted">{{ startIndex + index }}</td>
                <td>
                  <div class="engineer-cell">
                    <div class="avatar" :style="{ background: avatarColor(report.user?.name) }">
                      {{ initials(report.user?.name) }}
                    </div>
                    <span class="engineer-name">{{ report.user?.name || '—' }}</span>
                  </div>
                </td>
                <td>
                  <span class="title-pill" :title="report.title">{{ report.title || '—' }}</span>
                </td>
                <td class="col-desc">
                  <span class="desc-text" :title="report.description || '—'">
                    {{ report.description || '—' }}
                  </span>
                </td>
                <td class="text-muted nowrap">{{ formatDate(report.created_at) }}</td>
                <td class="col-center" @click.stop>
                  <img
                    v-if="report.update_photo"
                    :src="report.update_photo"
                    alt="Update photo"
                    class="thumb"
                    @click="openImageModal(report.update_photo)"
                    loading="lazy"
                  />
                  <span v-else class="no-data">—</span>
                </td>
                <td class="col-center actions-cell" @click.stop>
                  <button
                    class="icon-btn icon-btn--view"
                    @click="viewUpdate(report)"
                    title="View details"
                    aria-label="View update details"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button
                    v-if="report.update_file"
                    class="icon-btn icon-btn--dl"
                    @click="downloadFile(report.update_file, `update_${report.chat_id}.pdf`)"
                    title="Download PDF"
                    aria-label="Download attached file"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="page-btn" @click="changePage(1)" :disabled="currentPage === 1">
            «
          </button>
          <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            <
          </button>

          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-num"
            :class="{ active: p === currentPage, ellipsis: p === '…' }"
            @click="p !== '…' && changePage(p)"
            :disabled="p === '…'"
          >
            {{ p }}
          </button>

          <button class="page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">
            >
          </button>
          <button class="page-btn" @click="changePage(totalPages)" :disabled="currentPage >= totalPages">
            »
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="state-card empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 7.414V19a2 2 0 01-2 2z"/>
        </svg>
        <h3>No updates found</h3>
        <p>Select a date range and fetch the report.</p>
      </div>
    </div>

    <!-- View Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showViewModal" class="modal-backdrop" @click.self="closeViewModal">
          <div class="modal-box">
            <div class="modal-header">
              <div>
                <span class="modal-badge">View Update</span>
                <h2 class="modal-title">{{ selectedUpdate?.title || 'Update Details' }}</h2>
              </div>
              <button class="close-btn" @click="closeViewModal" aria-label="Close">
                ×
              </button>
            </div>

            <div class="modal-body">
              <div class="modal-engineer">
                <div class="avatar avatar--lg" :style="{ background: avatarColor(selectedUpdate?.user?.name) }">
                  {{ initials(selectedUpdate?.user?.name) }}
                </div>
                <div>
                  <div class="modal-eng-name">{{ selectedUpdate?.user?.name || 'Unknown' }}</div>
                  <div class="modal-eng-date">{{ formatDate(selectedUpdate?.created_at) }}</div>
                </div>
              </div>

              <div class="modal-section">
                <div class="section-label">Description</div>
                <div class="section-body">
                  {{ selectedUpdate?.description || 'No description provided.' }}
                </div>
              </div>

              <div v-if="selectedUpdate?.update_photo" class="modal-section">
                <div class="section-label">Photo</div>
                <div class="modal-img-wrap" @click="openImageModal(selectedUpdate.update_photo)">
                  <img :src="selectedUpdate.update_photo" alt="Update photo" class="modal-img"/>
                  <div class="img-overlay">Click to enlarge</div>
                </div>
              </div>

              <div v-if="selectedUpdate?.update_file" class="modal-section">
                <div class="section-label">Attachment</div>
                <button class="btn btn-primary" @click="downloadFile(selectedUpdate.update_file, `update_${selectedUpdate.chat_id}.pdf`)">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Image Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showImageModal" class="lightbox" @click="closeImageModal">
          <button class="close-btn close-btn--light" @click="closeImageModal">×</button>
          <img :src="selectedImage" alt="Full size preview" class="lightbox-img"/>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/axios' // ← adjust import path
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const reports = ref([])
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(20)
const isLoading = ref(false)
const showViewModal = ref(false)
const showImageModal = ref(false)
const selectedUpdate = ref(null)
const selectedImage = ref('')
const selectedQuickRange = ref(null)

// ─── Quick Ranges ───────────────────────────────────────
const quickRanges = [
  { label: 'Today',       value: 'today',       days: 0 },
  { label: 'Yesterday',   value: 'yesterday',   days: 1 },
  { label: 'Last 7 days', value: '7d',          days: 7 },
  { label: 'Last 14 days',value: '14d',         days: 14 },
  { label: 'Last 30 days',value: '30d',         days: 30 },
  { label: 'This month',  value: 'this-month' },
  { label: 'Last month',  value: 'last-month' },
]

function applyQuickRange(range) {
  selectedQuickRange.value = range.value
  const today = new Date()
  let from = new Date()

  if (range.days !== undefined) {
    from.setDate(today.getDate() - range.days)
  } else if (range.value === 'this-month') {
    from = new Date(today.getFullYear(), today.getMonth(), 1)
  } else if (range.value === 'last-month') {
    from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    today.setDate(0) // last day of previous month
  }

  fromDate.value = from.toISOString().split('T')[0]
  toDate.value   = today.toISOString().split('T')[0]

  fetchReport()
}

function resetFilter() {
  fromDate.value = ''
  toDate.value = ''
  selectedQuickRange.value = null
  reports.value = []
  currentPage.value = 1
}

// ─── Computed ────────────────────────────────────────────
const totalPages = computed(() => Math.ceil(reports.value.length / itemsPerPage.value))
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return reports.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex   = computed(() => Math.min(startIndex.value + itemsPerPage.value - 1, reports.value.length))

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  if (cur <= 4) {
    pages.push(1, 2, 3, 4, 5, '…', total)
  } else if (cur >= total - 3) {
    pages.push(1, '…', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '…', cur - 1, cur, cur + 1, '…', total)
  }
  return pages
})

// ─── Helpers ─────────────────────────────────────────────
const PALETTE = ['#2563eb','#0ea5e9','#8b5cf6','#ec4899','#f43f5e','#14b8a6','#22c55e','#f59e0b']

function avatarColor(name) {
  if (!name) return PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2)
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString))
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// ─── API ─────────────────────────────────────────────────
async function fetchReport() {
  if (!fromDate.value || !toDate.value) {
    toast.error('Please select both dates')
    return
  }

  isLoading.value = true
  try {
    const { data } = await axios.get('/api/reports/for-updates', {
      params: { from: fromDate.value, to: toDate.value, exclude_admin: true }
    })
    reports.value = data.data || []
    currentPage.value = 1

    if (!reports.value.length) {
      toast.info('No updates found in this period')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not load updates')
  } finally {
    isLoading.value = false
  }
}

async function downloadFile(url, filename) {
  if (!url) return toast.error('No file available')
  try {
    const res = await axios.get(url, { responseType: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  } catch {
    toast.error('Download failed')
  }
}

// ─── Export ──────────────────────────────────────────────
function exportToExcel() {
  if (!reports.value.length) return toast.warning('No data to export')

  const ws = XLSX.utils.json_to_sheet(
    reports.value.map((r, i) => ({
      '#': i + 1,
      Engineer: r.user?.name || '—',
      Title: r.title || '—',
      Description: r.description || '—',
      'Has Photo': r.update_photo ? 'Yes' : 'No',
      'Has File': r.update_file ? 'Yes' : 'No',
      'Submitted': formatDate(r.created_at)
    }))
  )

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Updates')
  XLSX.writeFile(wb, `Engineer_Updates_${fromDate.value}_to_${toDate.value}.xlsx`)
}

function exportToPDF() {
  if (!reports.value.length) return toast.warning('No data to export')

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Engineer Updates Report', 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Period: ${fromDate.value} – ${toDate.value}   |   Generated: ${formatDate(new Date())}`, 14, 30)

  autoTable(doc, {
    startY: 38,
    head: [['#', 'Engineer', 'Title', 'Description', 'Photo', 'File', 'Date']],
    body: reports.value.map((r, i) => [
      i + 1,
      r.user?.name || '—',
      r.title || '—',
      r.description || '—',
      r.update_photo ? 'Yes' : 'No',
      r.update_file ? 'Yes' : 'No',
      formatDate(r.created_at)
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 3: { cellWidth: 60 } }
  })

  doc.save(`Engineer_Updates_${fromDate.value}_to_${toDate.value}.pdf`)
}

// ─── Modal Handlers ──────────────────────────────────────
function viewUpdate(report) {
  selectedUpdate.value = report
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedUpdate.value = null
}

function openImageModal(src) {
  selectedImage.value = src
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
  selectedImage.value = ''
}
</script>

<style scoped>
/* ==========================================================================
   Modern & Clean Engineer Updates Dashboard – 2025/2026 style
   ========================================================================== */

.updates-root {
  --c-bg:        #f9fafb;
  --c-surface:   #ffffff;
  --c-surface-2: #f1f5f9;
  --c-border:    #e2e8f0;
  --c-border-light: #cbd5e1;
  --c-text:      #0f172a;
  --c-text-muted:#64748b;
  --c-accent:    #2563eb;
  --c-accent-hover: #1d4ed8;
  --c-accent-soft:  rgba(37,99,235,0.07);
  --c-accent-border: rgba(37,99,235,0.14);
  --radius:      12px;
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.06);
  --shadow-md:   0 4px 12px rgba(0,0,0,0.08);
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.content-wrap {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* Header ─────────────────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--c-accent);
  background: var(--c-accent-soft);
  border: 1px solid var(--c-accent-border);
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  display: inline-block;
}

.page-title {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

.page-sub {
  color: var(--c-text-muted);
  font-size: 14px;
  margin-top: 6px;
}

.header-stat {
  text-align: right;
}

.stat-num {
  font-size: 36px;
  font-weight: 700;
  color: var(--c-accent);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Filter ─────────────────────────────────────────────── */
.filter-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 28px;
}

.quick-ranges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.quick-btn {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 20px;
  background: var(--c-surface-2);
  color: var(--c-text-muted);
  border: 1px solid var(--c-border);
  transition: all 0.15s;
}

.quick-btn:hover {
  background: var(--c-accent-soft);
  color: var(--c-accent);
  border-color: var(--c-accent-border);
}

.quick-btn.active {
  background: var(--c-accent);
  color: white;
  border-color: var(--c-accent);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  align-items: flex-end;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-input {
  padding: 10px 14px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  outline: none;
}

.action-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

/* Buttons ────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.15s ease;
  white-space: nowrap;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: red;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: rgb(145, 76, 76);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--c-surface-2);
  color: var(--c-text);
}

.btn-excel {
  background: rgba(22,163,74,0.08);
  color: #15803d;
  border: 1px solid rgba(22,163,74,0.2);
}

.btn-pdf {
  background: rgba(220,38,38,0.08);
  color: #b91c1c;
  border: 1px solid rgba(220,38,38,0.2);
}

/* Loading / Empty ────────────────────────────────────── */
.state-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 80px 24px;
  text-align: center;
}

.state-card svg { opacity: 0.4; margin-bottom: 16px; }
.state-card h3 { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
.state-card p  { color: var(--c-text-muted); }

/* Skeleton ───────────────────────────────────────────── */
.skeleton-container {
  padding: 24px;
}

.skeleton-row {
  height: 72px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.6s infinite;
  border-radius: 10px;
  margin-bottom: 12px;
}

@keyframes loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Table ──────────────────────────────────────────────── */
.table-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
  flex-wrap: wrap;
  gap: 12px;
}

.showing-text { color: var(--c-text-muted); font-size: 13px; }
.showing-text strong { color: var(--c-text); }

.per-page { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.per-page-select {
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  background: white;
}

.table-scroll { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background: var(--c-surface-2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--c-border);
}

.data-table td {
  padding: 16px 18px;
  border-bottom: 1px solid var(--c-border);
  vertical-align: middle;
}

.table-row {
  transition: background 0.18s, transform 0.18s;
  cursor: pointer;
}

.table-row:hover,
.table-row:focus-within {
  background: rgba(37,99,235,0.04);
}

.table-row:last-child td { border-bottom: none; }

.col-no { width: 60px; text-align: center; font-weight: 500; }
.col-center { text-align: center; }
.col-desc { max-width: 280px; }

.engineer-cell { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.avatar--lg { width: 48px; height: 48px; font-size: 18px; border-radius: 12px; }

.engineer-name { font-weight: 600; }

.title-pill {
  background: var(--c-accent-soft);
  color: var(--c-accent);
  border: 1px solid var(--c-accent-border);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  color: var(--c-text-muted);
}

.no-data { color: var(--c-border-light); font-family: monospace; }

.thumb {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--c-border-light);
  cursor: zoom-in;
  transition: transform 0.2s, box-shadow 0.2s;
}

.thumb:hover { transform: scale(1.06); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }

.actions-cell { display: flex; gap: 8px; justify-content: center; }

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.icon-btn--view {
  color: var(--c-accent);
  background: var(--c-accent-soft);
  border: 1px solid var(--c-accent-border);
}

.icon-btn--view:hover { background: rgba(37,99,235,0.15); transform: scale(1.08); }

.icon-btn--dl {
  color: #15803d;
  background: rgba(22,163,74,0.08);
  border: 1px solid rgba(22,163,74,0.2);
}

.icon-btn--dl:hover { background: rgba(22,163,74,0.15); transform: scale(1.08); }

/* Pagination ─────────────────────────────────────────── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 16px;
  border-top: 1px solid var(--c-border);
  flex-wrap: wrap;
}

.page-btn, .page-num {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--c-border);
  background: white;
  color: var(--c-text-muted);
  font-family: monospace;
  font-size: 13px;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled), .page-num:hover:not(.active):not(.ellipsis) {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.page-num.active {
  background: var(--c-accent);
  color: white;
  border-color: var(--c-accent);
}

.page-num.ellipsis {
  border-color: transparent;
  cursor: default;
}

.page-btn:disabled { opacity: 0.4; }

/* Modal ──────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-box {
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 620px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 20px 70px rgba(0,0,0,0.18);
  border: 1px solid var(--c-border-light);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 28px 16px;
  border-bottom: 1px solid var(--c-border);
  gap: 16px;
}

.modal-badge {
  font-family: monospace;
  font-size: 11px;
  color: var(--c-accent);
  background: var(--c-accent-soft);
  border: 1px solid var(--c-accent-border);
  padding: 3px 9px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 6px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  font-size: 24px;
  line-height: 1;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover { background: #fee2e2; color: #dc2626; }

.modal-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-engineer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-eng-name {
  font-size: 17px;
  font-weight: 600;
}

.modal-eng-date {
  font-size: 13px;
  color: var(--c-text-muted);
  font-family: monospace;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.section-body {
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 14px 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-img-wrap {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: zoom-in;
  border: 1px solid var(--c-border);
}

.modal-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
}

.modal-img-wrap:hover .img-overlay { opacity: 1; }

/* Lightbox ───────────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 40px;
}

.lightbox-img {
  max-width: 96%;
  max-height: 94vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.7);
}

.close-btn--light {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 28px;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.close-btn--light:hover { background: rgba(255,255,255,0.3); }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>