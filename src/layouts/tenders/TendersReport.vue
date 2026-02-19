<template>
  <div class="tr-root">

    <!-- Page Header -->
    <div class="tr-header">
      <div class="tr-header-left">
        <p class="tr-eyebrow">Reports</p>
        <h1 class="tr-title">Tender Reports</h1>
        <p class="tr-subtitle">Search and export tender records by date range and type</p>
      </div>
      <div v-if="tenders.length" class="records-badge">
        <span class="records-num">{{ tenders.length }}</span>
        <span class="records-lbl">Records</span>
      </div>
    </div>

    <!-- Filter Panel -->
    <div class="filter-panel">
      <div class="filter-panel-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filter Records
      </div>

      <div class="filter-grid">
        <div class="field">
          <label class="field-lbl">From Date</label>
          <input type="date" v-model="fromDate" class="field-input" :max="toDate || undefined" />
        </div>

        <div class="field">
          <label class="field-lbl">To Date</label>
          <input type="date" v-model="toDate" class="field-input" :min="fromDate || undefined" />
        </div>

        <div class="field">
          <label class="field-lbl">Tender Type</label>
          <select v-model="selectedTenderType" class="field-input field-select">
            <option value="all-tenders">All Tenders</option>
            <option v-for="type in tenderTypes" :key="type.type_id" :value="type.tender_type">
              {{ type.tender_type }}
            </option>
          </select>
        </div>

        <div class="filter-actions">
          <button class="btn btn-blue" @click="fetchReport" :disabled="isLoading">
            <span v-if="isLoading" class="spin"></span>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            {{ isLoading ? 'Loading…' : 'Fetch Report' }}
          </button>
          <button class="btn btn-green" @click="exportToExcel" :disabled="!tenders.length">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
            Excel
          </button>
          <button class="btn btn-red" @click="exportToPDF" :disabled="!tenders.length">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="state-box">
      <div class="loader"></div>
      <p class="state-msg">Fetching tender records…</p>
    </div>

    <!-- Table -->
    <div v-else-if="filteredTenders.length" class="table-card">
      <!-- Table topbar -->
      <div class="table-topbar">
        <p class="table-count">
          Showing <strong>{{ startIdx }}–{{ endIdx }}</strong> of <strong>{{ filteredTenders.length }}</strong> tenders
        </p>
        <div class="perpage-wrap">
          <span class="perpage-lbl">Rows</span>
          <select v-model="itemsPerPage" @change="currentPage = 1" class="perpage-sel">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th style="width:50px">#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Tender No.</th>
              <th>Procurement Entity</th>
              <th style="text-align:center">File</th>
              <th>Publication</th>
              <th>Submission</th>
              <th>Expiry</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tender, index) in paginatedTenders" :key="tender.tender_id" class="tbl-row">
              <td class="td-num">{{ startIdx + index }}</td>

              <td class="td-title">
                <span class="title-text" :title="tender.title">{{ tender.title }}</span>
              </td>

              <td>
                <span class="type-tag">{{ tender.tender_type }}</span>
              </td>

              <td class="td-mono">{{ tender.tender_number || '—' }}</td>

              <td class="td-entity">{{ tender.procurement_entity || '—' }}</td>

              <td style="text-align:center">
                <button
                  v-if="tender.attachment"
                  class="dl-btn"
                  @click="downloadTenderPdf(tender.attachment)"
                  title="Download tender file"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </button>
                <span v-else class="td-dash">—</span>
              </td>

              <td class="td-date">{{ formatDate(tender.date_of_Publication) }}</td>
              <td class="td-date">{{ formatDate(tender.bid_submission) }}</td>

              <!-- Expiry with status -->
              <td>
                <span class="expiry-badge" :class="getExpiryClass(tender.expired_at)">
                  <span class="expiry-dot"></span>
                  {{ formatDate(tender.expired_at) }}
                </span>
              </td>

              <td class="td-date">{{ formatDate(tender.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button class="pg-btn" @click="changePage(1)" :disabled="currentPage === 1">«</button>
        <button class="pg-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">‹</button>
        <button
          v-for="p in visiblePages"
          :key="p"
          class="pg-num"
          :class="{ 'pg-num--active': p === currentPage, 'pg-num--dot': p === '…' }"
          @click="typeof p === 'number' && changePage(p)"
          :disabled="p === '…'"
        >{{ p }}</button>
        <button class="pg-btn" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">›</button>
        <button class="pg-btn" @click="changePage(totalPages)" :disabled="currentPage >= totalPages">»</button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="state-box">
      <div class="empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 7.414V19a2 2 0 01-2 2z"/></svg>
      </div>
      <p class="state-title">No tenders found</p>
      <p class="state-msg">Select a date range and click <strong>Fetch Report</strong> to load records</p>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastMessage" class="toast-box" :class="`toast-box--${toastType}`">
        <svg v-if="toastType === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        {{ toastMessage }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const tenders = ref([])
const tenderTypes = ref([])
const fromDate = ref('')
const toDate = ref('')
const selectedTenderType = ref('all-tenders')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

onMounted(fetchTenderTypes)

async function fetchTenderTypes() {
  try {
    const res = await axios.get('api/types/tenders')
    tenderTypes.value = res.data.data
  } catch (e) { console.error(e) }
}

async function fetchReport() {
  isLoading.value = true
  try {
    const res = await axios.get('api/reportTenders', {
      params: { from: fromDate.value, to: toDate.value, tender_type: selectedTenderType.value }
    })
    if (res.data.status) {
      tenders.value = res.data.data
      currentPage.value = 1
      showToast(`${tenders.value.length} tender${tenders.value.length !== 1 ? 's' : ''} loaded`, 'success')
    } else {
      showToast('No tenders found for the selected filters', 'error')
    }
  } catch (e) {
    showToast('There is no tender available for the selected period.', 'error')
  } finally {
    isLoading.value = false
  }
}

function showToast(msg, type = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3500)
}

// Computed
const filteredTenders = computed(() => tenders.value)

const totalPages = computed(() => Math.ceil(filteredTenders.value.length / itemsPerPage.value))

const startIdx = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIdx   = computed(() => Math.min(startIdx.value + itemsPerPage.value - 1, filteredTenders.value.length))

const paginatedTenders = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage.value
  return filteredTenders.value.slice(s, s + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const t = totalPages.value, c = currentPage.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  if (c <= 4)      return [1,2,3,4,5,'…',t]
  if (c >= t - 3)  return [1,'…',t-4,t-3,t-2,t-1,t]
  return [1,'…',c-1,c,c+1,'…',t]
})

function changePage(p) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

// Helpers
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
function formatDate(d) {
  if (!d) return '—'
  try { return dateFmt.format(new Date(d)) } catch { return '—' }
}

function getExpiryClass(expiredAt) {
  if (!expiredAt) return 'expiry-badge--neutral'
  const diff = new Date(expiredAt) - new Date()
  if (diff < 0) return 'expiry-badge--expired'
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'expiry-badge--soon'
  return 'expiry-badge--active'
}

function downloadTenderPdf(attachment) {
  if (!attachment) return
  const a = document.createElement('a')
  a.href = attachment
  a.target = '_blank'
  a.download = ''
  document.body.appendChild(a); a.click(); a.remove()
}

// Export
function exportToExcel() {
  if (!tenders.value.length) return
  const ws = XLSX.utils.json_to_sheet(tenders.value.map((t, i) => ({
    No: i + 1,
    Title: t.title,
    'Tender Type': t.tender_type,
    'Tender Number': t.tender_number,
    'Procurement Entity': t.procurement_entity,
    'Publication Date': formatDate(t.date_of_Publication),
    'Submission Date': formatDate(t.bid_submission),
    'Expiry Date': formatDate(t.expired_at),
    'Created At': formatDate(t.created_at),
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tenders')
  XLSX.writeFile(wb, `Tenders_Report_${fromDate.value || 'all'}.xlsx`)
}

function exportToPDF() {
  if (!tenders.value.length) return
  const doc = new jsPDF()
  doc.setFontSize(16).setFont('helvetica','bold')
  doc.text('Tender Reports', 14, 18)
  doc.setFont('helvetica','normal').setFontSize(9).setTextColor(100)
  doc.text(`Generated: ${formatDate(new Date())}   |   Type: ${selectedTenderType.value}`, 14, 26)
  autoTable(doc, {
    startY: 32,
    head: [['#','Title','Type','Tender No.','Entity','Publication','Submission','Expiry']],
    body: tenders.value.map((t, i) => [
      i+1, t.title, t.tender_type, t.tender_number, t.procurement_entity,
      formatDate(t.date_of_Publication), formatDate(t.bid_submission), formatDate(t.expired_at)
    ]),
    styles: { fontSize: 7.5, cellPadding: 3 },
    headStyles: { fillColor: [37,99,235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241,245,249] },
    columnStyles: { 1: { cellWidth: 40 }, 4: { cellWidth: 35 } }
  })
  doc.save(`Tenders_Report_${fromDate.value || 'all'}.pdf`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.tr-root {
  --bg:           #f1f5f9;
  --white:        #ffffff;
  --surface:      #f8fafc;
  --border:       #e2e8f0;
  --border-mid:   #cbd5e1;
  --text:         #0f172a;
  --text-2:       #334155;
  --text-muted:   #64748b;
  --blue:         #2563eb;
  --blue-d:       #1d4ed8;
  --blue-bg:      #dbeafe;
  --blue-border:  #bfdbfe;
  --blue-text:    #1e40af;
  --green:        #15803d;
  --green-bg:     #dcfce7;
  --green-border: #bbf7d0;
  --red:          #b91c1c;
  --red-bg:       #fee2e2;
  --red-border:   #fecaca;
  --yellow:       #b45309;
  --yellow-bg:    #fef9c3;
  --yellow-border:#fde68a;
  --gray-bg:      #f1f5f9;
  --radius:       12px;
  --font:         'Plus Jakarta Sans', sans-serif;
  --mono:         'IBM Plex Mono', monospace;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.5;
  padding: 28px 24px 64px;
}

/* ── Header ── */
.tr-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tr-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 5px;
}

.tr-title {
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1.2;
}

.tr-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.records-badge {
  background: var(--blue);
  border-radius: 12px;
  padding: 10px 20px;
  text-align: center;
  flex-shrink: 0;
}
.records-num {
  display: block;
  font-size: 28px;
  font-weight: 800;
  font-family: var(--mono);
  color: #ffffff;
  line-height: 1;
}
.records-lbl {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #bfdbfe;
  margin-top: 3px;
}

/* ── Filter Panel ── */
.filter-panel {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px #0f172a0d;
}

.filter-panel-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 14px;
  align-items: end;
}

@media (max-width: 800px) { .filter-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 540px) { .filter-grid { grid-template-columns: 1fr; } }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-lbl {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
}

.field-input {
  height: 40px;
  padding: 0 12px;
  background: var(--white);
  border: 1.5px solid var(--border-mid);
  border-radius: 8px;
  font-family: var(--font);
  font-size: 13px;
  color: var(--text);
  outline: none;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-bg); }

.field-select { cursor: pointer; padding-right: 8px; }

.filter-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: flex-end;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

.btn-blue {
  background: var(--blue);
  color: #ffffff;
  border-color: var(--blue);
  box-shadow: 0 1px 3px #2563eb33;
}
.btn-blue:not(:disabled):hover {
  background: var(--blue-d);
  border-color: var(--blue-d);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px #2563eb44;
}

.btn-green {
  background: var(--green-bg);
  color: var(--green);
  border-color: var(--green-border);
}
.btn-green:not(:disabled):hover { background: #bbf7d0; }

.btn-red {
  background: var(--red-bg);
  color: var(--red);
  border-color: var(--red-border);
}
.btn-red:not(:disabled):hover { background: #fecaca; }

/* ── State boxes ── */
.state-box {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 64px 24px;
  text-align: center;
  box-shadow: 0 1px 3px #0f172a0d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loader {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-mid);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.spin {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid #ffffff55;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.empty-icon { color: var(--border-mid); }
.state-title { font-size: 17px; font-weight: 700; color: var(--text-2); }
.state-msg { font-size: 13px; color: var(--text-muted); }

/* ── Table Card ── */
.table-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 1px 3px #0f172a0d;
  overflow: hidden;
}

.table-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  border-bottom: 1.5px solid var(--border);
  background: var(--surface);
  flex-wrap: wrap;
  gap: 10px;
}

.table-count { font-size: 13px; color: var(--text-muted); }
.table-count strong { color: var(--text); font-weight: 700; }

.perpage-wrap { display: flex; align-items: center; gap: 8px; }
.perpage-lbl { font-size: 12px; color: var(--text-muted); font-weight: 500; }

.perpage-sel {
  height: 30px;
  padding: 0 8px;
  background: var(--white);
  border: 1.5px solid var(--border-mid);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  outline: none;
  cursor: pointer;
}

.tbl-wrap { overflow-x: auto; }

.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tbl thead tr {
  background: var(--surface);
  border-bottom: 2px solid var(--border);
}

.tbl th {
  padding: 11px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}

.tbl-row {
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}
.tbl-row:last-child { border-bottom: none; }
.tbl-row:hover { background: #f0f7ff; }

.tbl td { padding: 13px 14px; vertical-align: middle; }

.td-num  { font-family: var(--mono); font-size: 12px; color: var(--text-muted); text-align: center; }
.td-mono { font-family: var(--mono); font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.td-date { font-family: var(--mono); font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.td-dash { color: var(--border-mid); font-size: 16px; }

.td-title { max-width: 200px; }
.title-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
}

.td-entity { max-width: 160px; color: var(--text-2); }

/* Type tag */
.type-tag {
  display: inline-block;
  background: var(--blue-bg);
  color: var(--blue-text);
  border: 1.5px solid var(--blue-border);
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

/* Download button */
.dl-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: var(--blue-bg);
  color: var(--blue-text);
  border: 1.5px solid var(--blue-border);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font);
  cursor: pointer;
  transition: all 0.13s;
  white-space: nowrap;
}
.dl-btn:hover { background: var(--blue-border); }

/* Expiry badge */
.expiry-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--mono);
  white-space: nowrap;
  border: 1.5px solid;
}

.expiry-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.expiry-badge--active  { background: var(--green-bg); color: var(--green); border-color: var(--green-border); }
.expiry-badge--active  .expiry-dot { background: #22c55e; }

.expiry-badge--soon    { background: var(--yellow-bg); color: var(--yellow); border-color: var(--yellow-border); }
.expiry-badge--soon    .expiry-dot { background: #f59e0b; }

.expiry-badge--expired { background: var(--red-bg); color: var(--red); border-color: var(--red-border); }
.expiry-badge--expired .expiry-dot { background: #ef4444; }

.expiry-badge--neutral { background: var(--surface); color: var(--text-muted); border-color: var(--border); }
.expiry-badge--neutral .expiry-dot { background: var(--border-mid); }

/* ── Pagination ── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 14px;
  border-top: 1.5px solid var(--border);
  background: var(--surface);
  flex-wrap: wrap;
}

.pg-btn, .pg-num {
  min-width: 34px;
  height: 34px;
  padding: 0 6px;
  border-radius: 7px;
  border: 1.5px solid var(--border-mid);
  background: var(--white);
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.13s;
}

.pg-btn:hover:not(:disabled),
.pg-num:hover:not(.pg-num--active):not(.pg-num--dot) {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--blue-bg);
}

.pg-num--active {
  background: var(--blue);
  color: #ffffff;
  border-color: var(--blue);
  font-weight: 700;
}

.pg-num--dot {
  border-color: var(--border);
  background: var(--surface);
  cursor: default;
}

.pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Toast ── */
.toast-box {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px #0f172a33;
  z-index: 9999;
  border: 1.5px solid;
  max-width: 340px;
}

.toast-box--success {
  background: var(--green-bg);
  color: var(--green);
  border-color: var(--green-border);
}

.toast-box--error {
  background: var(--red-bg);
  color: var(--red);
  border-color: var(--red-border);
}

/* ── Toast Transition ── */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.97); }
.toast-leave-to   { opacity: 0; transform: translateY(8px) scale(0.97); }
</style>