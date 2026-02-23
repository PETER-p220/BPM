<template>
  <div class="rp">

    <!-- ── Header ── -->
    <div class="rp-header">
      <div class="rp-header__titles">
        <p class="rp-header__eye">Tender Management</p>
        <h1 class="rp-header__h1">Tender Reports</h1>
        <p class="rp-header__sub">Search and export tender records by date range and type</p>
      </div>

      <!-- Filter bar -->
      <div class="rp-filters">
        <div class="rp-filter">
          <label class="rp-label">From Date</label>
          <div class="rp-input-wrap">
            <svg class="rp-input-icon" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#94a3b8" stroke-width="1.5"/><path d="M3 8h14" stroke="#94a3b8" stroke-width="1.5"/><path d="M7 2v3M13 2v3" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input type="date" v-model="fromDate" class="rp-input" />
          </div>
        </div>

        <div class="rp-filter">
          <label class="rp-label">To Date</label>
          <div class="rp-input-wrap">
            <svg class="rp-input-icon" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#94a3b8" stroke-width="1.5"/><path d="M3 8h14" stroke="#94a3b8" stroke-width="1.5"/><path d="M7 2v3M13 2v3" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input type="date" v-model="toDate" class="rp-input" />
          </div>
        </div>

        <div class="rp-filter rp-filter--wide">
          <label class="rp-label">Tender Type</label>
          <div class="rp-input-wrap rp-select-wrap">
            <svg class="rp-input-icon" viewBox="0 0 20 20" fill="none"><path d="M4 6h12M6 10h8M8 14h4" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/></svg>
            <select v-model="selectedTenderType" class="rp-input rp-select">
              <option value="all-tenders">All Types</option>
              <option v-for="t in tenderTypes" :key="t.type_id" :value="t.tender_type">{{ t.tender_type }}</option>
            </select>
            <svg class="rp-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>

        <div class="rp-filter-actions">
          <button class="rp-btn rp-btn--fetch" @click="fetchReport" :disabled="isFetching">
            <svg v-if="!isFetching" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5" stroke="currentColor" stroke-width="1.75"/><path d="M15 15l-3-3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
            <svg v-else class="spin" viewBox="0 0 20 20" fill="none"><path d="M10 3a7 7 0 1 1-7 7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
            {{ isFetching ? 'Fetching…' : 'Fetch Report' }}
          </button>

          <button class="rp-btn rp-btn--excel" @click="exportToExcel" :disabled="!tenders.length">
            <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Excel
          </button>

          <button class="rp-btn rp-btn--pdf" @click="exportToPDF" :disabled="!tenders.length">
            <svg viewBox="0 0 20 20" fill="none"><path d="M5 3h7l4 4v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <!-- ── Result bar ── -->
    <div class="rp-meta" v-if="tenders.length">
      <span class="rp-meta__total"><strong>{{ filteredTenders.length }}</strong> records</span>
      <span class="rp-meta__divider"></span>
      <span class="rp-meta__page">Page {{ currentPage }} of {{ totalPages }}</span>
    </div>

    <!-- ── Table ── -->
    <div class="rp-table-card">
      <div class="rp-table-scroll">
        <table class="rp-table" id="tenderTable">
          <thead>
            <tr>
              <th class="th-no">#</th>
              <th class="th-title">Title</th>
              <th>Type</th>
              <th>Tender No.</th>
              <th>Entity</th>
              <th class="th-center">File</th>
              <th>Published</th>
              <th>Submission</th>
              <th>Expires</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="paginatedTenders.length">
              <tr v-for="(tender, index) in paginatedTenders" :key="tender.tender_id">
                <td class="td-no">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="td-title">{{ tender.title }}</td>
                <td><span class="badge badge--type">{{ tender.tender_type }}</span></td>
                <td class="td-mono">{{ tender.tender_number }}</td>
                <td class="td-entity">{{ tender.procurement_entity }}</td>
                <td class="th-center">
                  <button class="dl-btn" @click="downloadTenderPdf(tender.attachment)">
                    <svg viewBox="0 0 20 20" fill="none"><path d="M10 3v9m0 0l-3-3m3 3l3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 14v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                    Download
                  </button>
                </td>
                <td class="td-mono">{{ formatDate(tender.date_of_Publication) }}</td>
                <td class="td-mono">{{ formatDate(tender.bid_submission) }}</td>
                <td>
                  <span :class="['badge', getExpClass(tender.expired_at)]">
                    {{ formatDate(tender.expired_at) }}
                  </span>
                </td>
                <td class="td-mono td-muted">{{ formatDate(tender.created_at) }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="10" class="td-empty">
                <div class="empty-box">
                  <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="10" width="32" height="28" rx="4" stroke="#cbd5e1" stroke-width="2"/><path d="M16 20h16M16 26h10" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/></svg>
                  <p>No records found</p>
                  <span>Set a date range and click Fetch Report</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Pagination ── -->
    <div v-if="totalPages > 1" class="rp-pagination">
      <button class="pg-btn pg-arrow" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        <svg viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <template v-for="(p, i) in visiblePages" :key="i">
        <span v-if="p === '…'" class="pg-ellipsis">…</span>
        <button v-else class="pg-btn" :class="{ 'pg-btn--active': p === currentPage }" @click="changePage(p)">{{ p }}</button>
      </template>

      <button class="pg-btn pg-arrow" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
        <svg viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>

    <!-- ── Toast ── -->
    <transition name="toast-up">
      <div v-if="toastMsg" :class="['rp-toast', `rp-toast--${toastType}`]">
        <svg v-if="toastType === 'success'" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg v-else viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 7v4M10 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ toastMsg }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const tenders            = ref([]);
const tenderTypes        = ref([]);
const fromDate           = ref('');
const toDate             = ref('');
const selectedTenderType = ref('all-tenders');
const currentPage        = ref(1);
const itemsPerPage       = 10;
const isFetching         = ref(false);
const toastMsg           = ref('');
const toastType          = ref('success');
let   toastTimer         = null;

onMounted(fetchTenderTypes);

async function fetchTenderTypes() {
  try {
    const res = await axios.get('api/types/tenders');
    tenderTypes.value = res.data.data;
  } catch (e) { console.error(e); }
}

async function fetchReport() {
  isFetching.value = true;
  try {
    const res = await axios.get('api/reportTenders', {
      params: { from: fromDate.value, to: toDate.value, tender_type: selectedTenderType.value }
    });
    if (res.data.status) {
      tenders.value = res.data.data;
      currentPage.value = 1;
      toast('Tenders fetched successfully.', 'success');
    } else {
      toast('No tenders found.', 'error');
    }
  } catch { toast('Error fetching report.', 'error'); }
  finally { isFetching.value = false; }
}

function exportToExcel() {
  const ws = XLSX.utils.json_to_sheet(tenders.value.map((t, i) => ({
    No: i + 1, Title: t.title, 'Tender Type': t.tender_type,
    'Tender Number': t.tender_number, 'Procurement Entity': t.procurement_entity,
    'Date of Publication': formatDate(t.date_of_Publication),
    'Date of Submission': formatDate(t.bid_submission),
    'Expiration Date': formatDate(t.expired_at), 'Created At': formatDate(t.created_at),
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tenders');
  XLSX.writeFile(wb, 'tenders.xlsx');
}

function exportToPDF() {
  try {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['No','Title','Type','Tender No.','Entity','Published','Submission','Expires','Created']],
      body: tenders.value.map((t, i) => [
        i+1, t.title, t.tender_type, t.tender_number, t.procurement_entity,
        formatDate(t.date_of_Publication), formatDate(t.bid_submission),
        formatDate(t.expired_at), formatDate(t.created_at),
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241] },
    });
    doc.save('tenders.pdf');
  } catch { toast('Error generating PDF.', 'error'); }
}

const filteredTenders  = computed(() => tenders.value);
const totalPages       = computed(() => Math.max(1, Math.ceil(filteredTenders.value.length / itemsPerPage)));
const paginatedTenders = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage;
  return filteredTenders.value.slice(s, s + itemsPerPage);
});

const visiblePages = computed(() => {
  const total = totalPages.value, cur = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const p = [1];
  if (cur > 3) p.push('…');
  for (let x = Math.max(2, cur - 1); x <= Math.min(total - 1, cur + 1); x++) p.push(x);
  if (cur < total - 2) p.push('…');
  p.push(total);
  return p;
});

function changePage(n) {
  if (n >= 1 && n <= totalPages.value) currentPage.value = n;
}

function formatDate(d) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getExpClass(exp) {
  if (!exp) return '';
  const diff = new Date(exp) - Date.now();
  if (diff < 0) return 'badge--expired';
  if (diff < 7 * 86400000) return 'badge--soon';
  return 'badge--ok';
}

function toast(msg, type = 'success') {
  clearTimeout(toastTimer);
  toastMsg.value  = msg;
  toastType.value = type;
  toastTimer = setTimeout(() => { toastMsg.value = ''; }, 3500);
}

function downloadTenderPdf(url) {
  if (url) window.open(url, '_blank');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── Design tokens ── */
.rp {
  --white:       #ffffff;
  --surface:     #f8fafc;
  --surface2:    #f1f5f9;
  --border:      #e2e8f0;
  --border-soft: #f1f5f9;
  --text:        #0f172a;
  --text-2:      #475569;
  --text-3:      #94a3b8;
  --indigo:      #6366f1;
  --indigo-soft: #eef2ff;
  --green:       #10b981;
  --green-soft:  #ecfdf5;
  --red:         #f43f5e;
  --red-soft:    #fff1f2;
  --amber:       #f59e0b;
  --amber-soft:  #fffbeb;
  --radius-sm:   6px;
  --radius:      10px;
  --radius-lg:   14px;
  --shadow:      0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);

  min-height: 100vh;
  background: var(--surface);
  padding: 32px 28px 48px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text);
  margin-top: 60px;
}

/* ── Header card ── */
.rp-header {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 32px 26px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.rp-header__eye {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--indigo);
  margin-bottom: 6px;
}

.rp-header__h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -.03em;
  color: var(--text);
  margin-bottom: 4px;
}

.rp-header__sub {
  font-size: 13px;
  color: var(--text-2);
  margin-bottom: 24px;
}

/* ── Filters ── */
.rp-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

.rp-filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rp-filter--wide { min-width: 180px; }

.rp-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-2);
}

.rp-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.rp-input-icon {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  pointer-events: none;
}

.rp-input {
  height: 40px;
  padding: 0 12px 0 32px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  color: var(--text);
  background: var(--white);
  outline: none;
  appearance: none;
  width: 100%;
  transition: border-color .15s, box-shadow .15s;
}

.rp-input:focus {
  border-color: var(--indigo);
  box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}

.rp-select { padding-right: 30px; cursor: pointer; }

.rp-chevron {
  position: absolute;
  right: 9px;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

/* ── Action buttons ── */
.rp-filter-actions {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.rp-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-sm);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}

.rp-btn svg { width: 15px; height: 15px; flex-shrink: 0; }
.rp-btn:disabled { opacity: .45; cursor: not-allowed; }
.rp-btn:not(:disabled):active { transform: scale(.97); }

.rp-btn--fetch {
  background: var(--indigo);
  color: #fff;
  border-color: var(--indigo);
  box-shadow: 0 2px 8px rgba(99,102,241,.25);
}
.rp-btn--fetch:not(:disabled):hover {
  background: #4f46e5;
  border-color: #4f46e5;
  box-shadow: 0 4px 14px rgba(99,102,241,.35);
}

.rp-btn--excel {
  background: var(--green-soft);
  color: var(--green);
  border-color: #a7f3d0;
}
.rp-btn--excel:not(:disabled):hover { border-color: var(--green); }

.rp-btn--pdf {
  background: var(--red-soft);
  color: var(--red);
  border-color: #fecdd3;
}
.rp-btn--pdf:not(:disabled):hover { border-color: var(--red); }

/* ── Meta bar ── */
.rp-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--text-2);
}

.rp-meta strong { color: var(--text); font-weight: 700; }
.rp-meta__divider { width: 1px; height: 14px; background: var(--border); }

/* ── Table card ── */
.rp-table-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 16px;
  contain: layout style;
}

.rp-table-scroll { overflow-x: auto; }

.rp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

/* Head */
.rp-table thead {
  background: var(--surface);
  border-bottom: 1.5px solid var(--border);
}

.rp-table th {
  padding: 13px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--text-3);
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
}

.th-no    { width: 52px; }
.th-title { min-width: 200px; }
.th-center { text-align: center; }

/* Body rows */
.rp-table tbody tr {
  border-bottom: 1px solid var(--border-soft);
  transition: background .1s;
}

.rp-table tbody tr:last-child { border-bottom: none; }
.rp-table tbody tr:hover { background: #fafbff; }

.rp-table td {
  padding: 13px 16px;
  vertical-align: middle;
  color: var(--text);
}

.td-no     { color: var(--text-3); font-size: 12px; font-family: 'JetBrains Mono', monospace; }
.td-title  { font-weight: 500; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-mono   { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); }
.td-muted  { color: var(--text-3); }
.td-entity { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-2); }

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid transparent;
  white-space: nowrap;
}

.badge--type    { background: var(--indigo-soft); color: var(--indigo); border-color: #c7d2fe; }
.badge--ok      { background: var(--green-soft);  color: #065f46; border-color: #a7f3d0; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.badge--soon    { background: var(--amber-soft);  color: #92400e; border-color: #fde68a; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.badge--expired { background: var(--red-soft);    color: #9f1239; border-color: #fecdd3; font-family: 'JetBrains Mono', monospace; font-size: 11px; }

/* Download button */
.dl-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-2);
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
  margin: 0 auto;
}

.dl-btn svg { width: 13px; height: 13px; }
.dl-btn:hover { background: var(--indigo-soft); color: var(--indigo); border-color: #c7d2fe; }

/* Empty state */
.td-empty { padding: 0 !important; }

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 64px 24px;
  text-align: center;
}

.empty-box svg  { width: 56px; height: 56px; margin-bottom: 4px; }
.empty-box p    { font-size: 15px; font-weight: 600; color: var(--text); }
.empty-box span { font-size: 13px; color: var(--text-3); }

/* ── Pagination ── */
.rp-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding-bottom: 12px;
}

.pg-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--white);
  color: var(--text-2);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
  box-shadow: var(--shadow-sm);
}

.pg-btn:disabled { opacity: .35; cursor: not-allowed; }
.pg-btn:not(:disabled):hover { border-color: var(--indigo); color: var(--indigo); background: var(--indigo-soft); }
.pg-btn--active { background: var(--indigo); color: #fff; border-color: var(--indigo); box-shadow: 0 2px 8px rgba(99,102,241,.25); }
.pg-btn--active:hover { background: var(--indigo) !important; color: #fff !important; }

.pg-arrow svg { width: 15px; height: 15px; }

.pg-ellipsis {
  font-size: 14px;
  color: var(--text-3);
  padding: 0 4px;
  user-select: none;
}

/* ── Spinner ── */
.spin { animation: spinning .7s linear infinite; }
@keyframes spinning { to { transform: rotate(360deg); } }

/* ── Toast ── */
.rp-toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 20px;
  border-radius: var(--radius);
  font-size: 13.5px;
  font-weight: 600;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}

.rp-toast svg { width: 17px; height: 17px; flex-shrink: 0; }
.rp-toast--success { background: #0f172a; color: #fff; }
.rp-toast--error   { background: var(--red); color: #fff; }

.toast-up-enter-active, .toast-up-leave-active { transition: opacity .25s ease, transform .25s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(12px); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .rp { padding: 16px 14px 40px; }
  .rp-header { padding: 20px 20px 18px; }
  .rp-filters { gap: 10px; }
  .rp-filter { width: 100%; }
  .rp-filter--wide { min-width: unset; }
  .rp-input { width: 100%; }
  .rp-filter-actions { width: 100%; }
  .rp-btn { flex: 1; justify-content: center; }
}
</style>