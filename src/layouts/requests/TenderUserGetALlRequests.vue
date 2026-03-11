<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] font-['DM_Sans',sans-serif]">

    <!-- Top Bar -->
    <div class="bg-white dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Project Requests</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">Manage and track requests for projects</p>
          </div>
        </div>

        <!-- Stats chips -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
            {{ requests.length }} Total
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full text-xs font-semibold text-green-700 dark:text-green-400">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {{ approvedCount }} Approved
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-semibold text-yellow-700 dark:text-yellow-400">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            {{ pendingCount }} Pending
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-full text-xs font-semibold text-red-700 dark:text-red-400">
            {{ rejectedCount }} Rejected
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-5">

      <!-- Search + Filter + Export -->
      <div class="flex flex-col sm:flex-row gap-3 flex-wrap">
        <!-- Search -->
        <div class="relative flex-1 min-w-60 max-w-lg">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by engineer, item or vendor..."
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition text-sm shadow-sm"
          />
          <span v-if="filter" @click="filter = ''; currentPage = 1" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
        </div>

        <!-- Status filter tabs -->
        <div class="flex items-center gap-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="statusFilter = tab.value; currentPage = 1"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
              statusFilter === tab.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Export buttons -->
        <div class="flex items-center gap-2 ml-auto">
          <button
            @click="exportToExcel"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-500/25 whitespace-nowrap"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
          <button
            @click="exportToPDF"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-rose-500/25 whitespace-nowrap"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Export scope hint -->
      <p v-if="filteredRequests.length !== requests.length" class="text-xs text-slate-500 dark:text-slate-400 -mt-2 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Exports include <strong class="text-slate-700 dark:text-slate-300">{{ filteredRequests.length }}</strong> filtered {{ filteredRequests.length === 1 ? 'record' : 'records' }}.
      </p>

      <!-- Table -->
      <div class="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">#</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Engineer</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-48">Item(s)</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vendor</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Account No.</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Account Name</th>
                <th class="px-5 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th class="px-5 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr
                v-for="(request, index) in paginatedRequests"
                :key="request.request_id"
                class="hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors group"
              >
                <!-- # -->
                <td class="px-5 py-4 text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <!-- Engineer -->
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[10px] font-bold text-violet-700 dark:text-violet-300 flex-shrink-0">
                      {{ (request.created_by || '?')[0].toUpperCase() }}
                    </div>
                    <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ request.created_by || '—' }}</span>
                  </div>
                </td>

                <!-- Item -->
                <td class="px-5 py-4">
                  <p class="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate" :title="request.item">
                    {{ request.item || '—' }}
                  </p>
                </td>

                <!-- Vendor -->
                <td class="px-5 py-4">
                  <span class="text-sm text-slate-700 dark:text-slate-300">{{ request.vendor || '—' }}</span>
                </td>

                <!-- Account Number -->
                <td class="px-5 py-4 whitespace-nowrap">
                  <span class="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                    {{ request.vendor_account_number || '—' }}
                  </span>
                </td>

                <!-- Account Name -->
                <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {{ request.vendor_account_name || '—' }}
                </td>

                <!-- Amount -->
                <td class="px-5 py-4 text-right whitespace-nowrap">
                  <span class="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                    {{ formatAmount(request.amount_requested) }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-5 py-4 text-center">
                  <span :class="statusClasses(request.is_approved)" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wide whitespace-nowrap">
                    <span :class="statusDot(request.is_approved)" class="w-1.5 h-1.5 rounded-full"></span>
                    {{ formatStatus(request.is_approved) }}
                  </span>
                </td>

                <!-- Created At -->
                <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(request.created_at) }}
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="!paginatedRequests.length">
                <td colspan="9" class="px-5 py-16 text-center">
                  <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <svg class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No requests found</p>
                  <p class="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
                  <button @click="filter = ''; statusFilter = 'all'; currentPage = 1" class="mt-3 text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline">Clear filters</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination footer -->
        <div class="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Showing
            <span class="font-semibold text-slate-700 dark:text-slate-300">
              {{ filteredRequests.length ? (currentPage - 1) * itemsPerPage + 1 : 0 }}–{{ Math.min(currentPage * itemsPerPage, filteredRequests.length) }}
            </span>
            of
            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ filteredRequests.length }}</span>
            requests
          </p>

          <div class="flex items-center gap-1">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <span
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition',
                currentPage === page
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >{{ page }}</span>

            <button
              :disabled="currentPage * itemsPerPage >= filteredRequests.length"
              @click="changePage(currentPage + 1)"
              class="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const toast = useToast();

// ─── State ────────────────────────────────────────────────────────────────────
const requests = ref([]);
const filter = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
];

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchRequests();
});

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchRequests() {
  try {
    const response = await axios.get('api/requests-for-projects');
    requests.value = response.data.data.map(request => ({
      request_id: request.request_id,
      item: JSON.parse(request.item).join(', '),
      amount_requested: request.amount_requested,
      created_by: request.user.name,
      vendor: request.vender,
      vendor_account_number: request.vendor_account_number,
      vendor_account_name: request.vender_account_name,
      is_approved: request.is_approved,
      created_at: request.created_at,
    }));
  } catch (error) {
    handleError(error);
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const approvedCount = computed(() => requests.value.filter(r => normalizeStatus(r.is_approved) === 'approved').length);
const pendingCount = computed(() => requests.value.filter(r => normalizeStatus(r.is_approved) === 'pending').length);
const rejectedCount = computed(() => requests.value.filter(r => normalizeStatus(r.is_approved) === 'rejected').length);

const filteredRequests = computed(() =>
  requests.value.filter(r => {
    const q = filter.value.toLowerCase();
    const matchesText =
      (r.item || '').toLowerCase().includes(q) ||
      (r.created_by || '').toLowerCase().includes(q) ||
      (r.vendor || '').toLowerCase().includes(q) ||
      (r.vendor_account_name || '').toLowerCase().includes(q);
    const matchesStatus =
      statusFilter.value === 'all' ||
      normalizeStatus(r.is_approved) === statusFilter.value;
    return matchesText && matchesStatus;
  })
);

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRequests.value.length / itemsPerPage)));

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRequests.value.slice(start, start + itemsPerPage);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) message = error.response.data.message || error.response.statusText;
  else if (error.request) message = 'No response from the server. Please check your connection.';
  else message = error.message;
  toast.error(message);
}

function normalizeStatus(val) {
  const v = (val || '').toString().toLowerCase();
  if (['1', 'true', 'approved', 'yes'].includes(v)) return 'approved';
  if (['0', 'false', 'rejected', 'no'].includes(v)) return 'rejected';
  return 'pending';
}

function formatStatus(val) {
  const s = normalizeStatus(val);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function statusClasses(val) {
  switch (normalizeStatus(val)) {
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300 border border-green-200 dark:border-green-500/20';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border border-red-200 dark:border-red-500/20';
    default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/20';
  }
}

function statusDot(val) {
  switch (normalizeStatus(val)) {
    case 'approved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-yellow-500 animate-pulse';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatAmount(val) {
  if (val == null || val === '') return '—';
  const num = Number(val);
  if (isNaN(num)) return val;
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency', currency: 'TZS',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(num);
}

// ─── Exports ──────────────────────────────────────────────────────────────────
function exportToExcel() {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRequests.value.map((entry, i) => ({
        'No': i + 1,
        'Engineer': entry.created_by,
        'Item': entry.item,
        'Vendor': entry.vendor,
        'Vendor Account Number': entry.vendor_account_number,
        'Vendor Account Name': entry.vendor_account_name,
        'Amount Requested': entry.amount_requested,
        'Status': formatStatus(entry.is_approved),
        'Created At': formatDate(entry.created_at),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
    XLSX.writeFile(workbook, `ProjectRequests_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(`Exported ${filteredRequests.value.length} record(s) to Excel`);
  } catch (error) {
    handleError(error);
  }
}

function exportToPDF() {
  try {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Header banner
    doc.setFillColor(109, 40, 217); // violet-700
    doc.rect(0, 0, pageW, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Project Requests Report', 14, 9);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${now}   ·   Records: ${filteredRequests.value.length}`, 14, 16);

    autoTable(doc, {
      startY: 26,
      head: [['#', 'Engineer', 'Item(s)', 'Vendor', 'Acct No.', 'Acct Name', 'Amount', 'Status', 'Created At']],
      body: filteredRequests.value.map((entry, i) => [
        i + 1,
        entry.created_by || '',
        entry.item || '',
        entry.vendor || '',
        entry.vendor_account_number || '',
        entry.vendor_account_name || '',
        formatAmount(entry.amount_requested),
        formatStatus(entry.is_approved),
        formatDate(entry.created_at),
      ]),
      styles: { fontSize: 7, cellPadding: 2.5, lineColor: [226, 232, 240], textColor: [30, 41, 59] },
      headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold', fontSize: 7 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 32 },
        2: { cellWidth: 58 },
        3: { cellWidth: 32 },
        4: { cellWidth: 26 },
        5: { cellWidth: 32 },
        6: { cellWidth: 28, halign: 'right' },
        7: { cellWidth: 20, halign: 'center' },
        8: { cellWidth: 22 },
      },
      willDrawCell(data) {
        if (data.column.index === 7 && data.section === 'body') {
          const v = String(data.cell.raw).toLowerCase();
          if (v === 'approved') doc.setTextColor(22, 101, 52);
          else if (v === 'rejected') doc.setTextColor(153, 27, 27);
          else doc.setTextColor(133, 77, 14);
        }
      },
      didDrawCell(data) {
        if (data.column.index === 7 && data.section === 'body') doc.setTextColor(30, 41, 59);
      },
      margin: { left: 14, right: 14 },
    });

    // Page footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(6); doc.setTextColor(148, 163, 184);
    doc.text(`Page 1`, pageW - 14, pageH - 5, { align: 'right' });

    doc.save(`ProjectRequests_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success(`Exported ${filteredRequests.value.length} record(s) to PDF`);
  } catch (error) {
    handleError(error);
  }
}
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:wght@400;500;600;700&display=swap');
</style>