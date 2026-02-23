<template>
  <div class="tender-page">
    <!-- Background mesh -->
    <div class="bg-mesh"></div>

    <div class="page-wrapper">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-badge">Reports</div>
          <h1 class="page-title">Submitted Tenders</h1>
          <p class="page-subtitle">Filter and export tender submission records by date range and type</p>
        </div>
        <div class="header-stats" v-if="submissions.length">
          <div class="stat-pill">
            <span class="stat-number">{{ filteredSubmissions.length }}</span>
            <span class="stat-label">Records</span>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="filters-card">
        <div class="filters-grid">
          <div class="field-group">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              From Date
            </label>
            <input type="date" v-model="fromDate" class="field-input" />
          </div>

          <div class="field-group">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              To Date
            </label>
            <input type="date" v-model="toDate" class="field-input" />
          </div>

          <div class="field-group">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
              Tender Type
            </label>
            <select v-model="selectedTenderType" class="field-input field-select">
              <option value="all-tenders">All Tender Types</option>
              <option v-for="type in tenderTypes" :key="type.tender_type" :value="type.tender_type">
                {{ type.tender_type }}
              </option>
            </select>
          </div>

          <div class="actions-group">
            <button @click="fetchReport" class="btn btn-primary" :class="{ loading: isFetching }" :disabled="isFetching">
              <svg v-if="!isFetching" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span class="spinner" v-if="isFetching"></span>
              {{ isFetching ? 'Fetching...' : 'Fetch Report' }}
            </button>

            <button @click="exportToExcel" class="btn btn-excel" :disabled="!filteredSubmissions.length">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
              Excel
            </button>

            <button @click="exportToPDF" class="btn btn-pdf" :disabled="!filteredSubmissions.length">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h3"/></svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <!-- Empty state -->
        <div v-if="!filteredSubmissions.length && !isFetching" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <h3>No records found</h3>
          <p>Select a date range and fetch the report to view submissions.</p>
        </div>

        <!-- Table -->
        <div v-else class="table-wrapper">
          <table class="data-table" id="tenderTable">
            <thead>
              <tr>
                <th class="col-no">#</th>
                <th>Engineer</th>
                <th>Title</th>
                <th>Tender Number</th>
                <th>Status</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(submission, index) in paginatedSubmissions"
                :key="submission.submission_id"
                class="table-row"
                :style="{ animationDelay: `${index * 40}ms` }"
              >
                <td class="col-no">
                  <span class="row-num">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
                </td>
                <td>
                  <div class="engineer-cell">
                    <div class="avatar">{{ submission.user.name.charAt(0).toUpperCase() }}</div>
                    <span>{{ submission.user.name }}</span>
                  </div>
                </td>
                <td class="title-cell">{{ submission.tender.title }}</td>
                <td>
                  <span class="tender-num">{{ submission.tender.tender_number }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(submission.is_submitted)">
                    {{ submission.is_submitted }}
                  </span>
                </td>
                <td class="date-cell">{{ formatDate(submission.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredSubmissions.length" class="pagination">
          <span class="pagination-info">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredSubmissions.length) }} of {{ filteredSubmissions.length }}
          </span>
          <div class="pagination-controls">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages" class="page-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastMessage" :class="['toast', toastType]">
        <svg v-if="toastType === 'toast-success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const submissions = ref([]);
const tenderTypes = ref([]);
const fromDate = ref('');
const toDate = ref('');
const selectedTenderType = ref('all-tenders');
const currentPage = ref(1);
const itemsPerPage = 10;
const toastMessage = ref('');
const toastType = ref('toast-success');
const isFetching = ref(false);

onMounted(async () => {
  await fetchTenderTypes();
});

async function fetchTenderTypes() {
  try {
    const response = await axios.get('api/tender/types/for-submittedtenders');
    tenderTypes.value = response.data.data;
  } catch (error) {
    console.error('Error fetching tender types:', error);
  }
}

async function fetchReport() {
  isFetching.value = true;
  try {
    const response = await axios.get('api/submittedtenders-reports', {
      params: {
        from: fromDate.value,
        to: toDate.value,
        tender_type: selectedTenderType.value,
      },
    });
    submissions.value = response.data.data;
    currentPage.value = 1;
    showToast(response.data.message || 'Report fetched successfully.', 'toast-success');
  } catch (error) {
    console.error('Error fetching report:', error);
    showToast(error.response?.data?.message || 'An error occurred while fetching the report.', 'toast-error');
  } finally {
    isFetching.value = false;
  }
}

function showToast(message, type = 'toast-success') {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => { toastMessage.value = ''; }, 3500);
}

const filteredSubmissions = computed(() => submissions.value);

const totalPages = computed(() => Math.ceil(filteredSubmissions.value.length / itemsPerPage));

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredSubmissions.value.slice(start, start + itemsPerPage);
});

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getStatusClass(status) {
  const s = String(status).toLowerCase();
  if (s === 'submitted' || s === 'true' || s === '1') return 'status-submitted';
  if (s === 'pending') return 'status-pending';
  return 'status-default';
}

function exportToExcel() {
  const dataForExport = filteredSubmissions.value.map((submission, index) => ({
    No: index + 1,
    Engineer: submission.user.name,
    Title: submission.tender.title,
    'Tender Number': submission.tender.tender_number,
    'Submission Status': submission.is_submitted,
    'Submitted At': formatDate(submission.created_at),
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataForExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tender Submissions');
  XLSX.writeFile(workbook, 'tender_submissions.xlsx');
}

function exportToPDF() {
  const doc = new jsPDF();
  doc.autoTable({
    head: [['No', 'Engineer', 'Title', 'Tender Number', 'Status', 'Submitted At']],
    body: filteredSubmissions.value.map((submission, index) => [
      index + 1,
      submission.user.name,
      submission.tender.title,
      submission.tender.tender_number,
      submission.is_submitted,
      formatDate(submission.created_at),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [15, 118, 110] },
  });
  doc.save('tender_submissions.pdf');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── Base ── */
.tender-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Sora', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.bg-mesh {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 10% 0%, rgba(15, 118, 110, 0.07) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 90% 100%, rgba(99, 102, 241, 0.06) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.page-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 32px 60px;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.header-badge {
  display: inline-block;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 100px;
  margin-bottom: 10px;
  border: 1px solid rgba(15, 118, 110, 0.2);
}

.page-title {
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #0f766e;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
}

/* ── Filters Card ── */
.filters-card {
  background: white;
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
  margin-bottom: 20px;
}

.filters-grid {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-width: 160px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.field-input {
  height: 42px;
  padding: 0 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  color: #1e293b;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: #0f766e;
  background: white;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  cursor: pointer;
}

/* ── Buttons ── */
.actions-group {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: blue;
  color: white;
  box-shadow: 0 2px 8px rgba(15, 118, 110, 0.3);
}

.btn-excel {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.25);
}

.btn-pdf {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Table Card ── */
.table-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background: #f8fafc;
  border-bottom: 2px solid #f1f5f9;
}

.data-table th {
  padding: 14px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.data-table td {
  padding: 14px 20px;
  font-size: 14px;
  color: #334155;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}

.table-row {
  animation: rowIn 0.3s ease both;
  transition: background 0.15s;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

@keyframes rowIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.col-no {
  width: 56px;
}

.row-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.engineer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f766e, #0d9488);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title-cell {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tender-num {
  font-family: 'DM Mono', monospace;
  font-size: 12.5px;
  color: #475569;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
}

.date-cell {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
}

/* ── Status Badge ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 11px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.status-submitted {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.status-pending {
  background: rgba(234, 179, 8, 0.1);
  color: #a16207;
  border: 1px solid rgba(234, 179, 8, 0.2);
}

.status-default {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}

.pagination-info {
  font-size: 13px;
  color: #94a3b8;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  border-color: #0f766e;
  color: #0f766e;
  background: rgba(15, 118, 110, 0.05);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  min-width: 60px;
  text-align: center;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 24px;
  gap: 12px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  margin-bottom: 4px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.empty-state p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  text-align: center;
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 9999;
}

.toast-success {
  background: #0f766e;
  color: white;
}

.toast-error {
  background: #dc2626;
  color: white;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-wrapper { padding: 24px 16px 40px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .filters-grid { flex-direction: column; }
  .field-group { min-width: unset; }
  .actions-group { width: 100%; }
  .btn { flex: 1; justify-content: center; }
  .page-title { font-size: 24px; }
}
</style>