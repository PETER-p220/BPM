<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] font-['DM_Sans',sans-serif]">

    <!-- Top Bar -->
    <div class="bg-white dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Receipts</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">View and download submitted receipts</p>
          </div>
        </div>

        <!-- Stats chips -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
            {{ receipts.length }} Total
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

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 max-w-lg">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by user, description or status..."
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm shadow-sm"
          />
          <span v-if="filter" @click="filter = ''" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
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
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">#</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-64">Description</th>
                <th class="px-5 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Receipt File</th>
                <th class="px-5 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approval Status</th>
                <th class="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr
                v-for="(receipt, index) in paginatedReceipts"
                :key="receipt.receipt_id"
                class="hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors group"
              >
                <!-- # -->
                <td class="px-5 py-4 text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <!-- User -->
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                      {{ (receipt.user_name || '?')[0].toUpperCase() }}
                    </div>
                    <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ receipt.user_name || '—' }}</span>
                  </div>
                </td>

                <!-- Description -->
                <td class="px-5 py-4">
                  <p class="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate" :title="receipt.description">
                    {{ receipt.description || '—' }}
                  </p>
                </td>

                <!-- Receipt File -->
                <td class="px-5 py-4 text-center">
                  <button
                    @click="downloadFile(receipt.receipt_file, 'receipt.jpg')"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 text-xs font-bold rounded-lg transition-all group-hover:shadow-sm"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </td>

                <!-- Approval Status -->
                <td class="px-5 py-4 text-center">
                  <span :class="approvalClasses(receipt.is_approved)" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wide whitespace-nowrap">
                    <span :class="approvalDot(receipt.is_approved)" class="w-1.5 h-1.5 rounded-full"></span>
                    {{ formatApproval(receipt.is_approved) }}
                  </span>
                </td>

                <!-- Created At -->
                <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(receipt.created_at) }}
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="!paginatedReceipts.length">
                <td colspan="6" class="px-5 py-16 text-center">
                  <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <svg class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No receipts found</p>
                  <p class="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
                  <button @click="filter = ''; statusFilter = 'all'" class="mt-3 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">Clear filters</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination footer -->
        <div class="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Showing
            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredReceipts.length) }}–{{ Math.min(currentPage * itemsPerPage, filteredReceipts.length) }}</span>
            of
            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ filteredReceipts.length }}</span>
            receipts
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
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >{{ page }}</span>

            <button
              :disabled="currentPage * itemsPerPage >= filteredReceipts.length"
              @click="changePage(currentPage + 1)"
              class="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== PREVIEW MODAL ===== -->
    <Transition name="dialog">
      <div v-if="previewUrl" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="previewUrl = null"></div>
        <div class="relative bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Receipt Preview</h3>
            <div class="flex items-center gap-2">
              <button
                @click="downloadFile(previewUrl, 'receipt.jpg')"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download
              </button>
              <button @click="previewUrl = null" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="p-4 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 min-h-64">
            <img :src="previewUrl" alt="Receipt" class="max-h-[60vh] max-w-full rounded-xl object-contain shadow-md" @error="imgError = true" />
            <div v-if="imgError" class="text-center text-slate-400 text-sm">
              <svg class="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Cannot preview this file type. Please download to view.
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { saveAs } from 'file-saver';

// ─── State ────────────────────────────────────────────────────────────────────
const receipts = ref([]);
const filter = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;
const previewUrl = ref(null);
const imgError = ref(false);

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
];

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchReceipts();
});

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchReceipts() {
  try {
    const response = await axios.get('api/receipts');
    receipts.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const approvedCount = computed(() => receipts.value.filter(r => normalizeStatus(r.is_approved) === 'approved').length);
const pendingCount = computed(() => receipts.value.filter(r => normalizeStatus(r.is_approved) === 'pending').length);
const rejectedCount = computed(() => receipts.value.filter(r => normalizeStatus(r.is_approved) === 'rejected').length);

const filteredReceipts = computed(() =>
  receipts.value.filter(r => {
    const q = filter.value.toLowerCase();
    const matchesText =
      (r.user_name || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.is_approved || '').toLowerCase().includes(q) ||
      (r.created_at || '').toLowerCase().includes(q);
    const matchesStatus =
      statusFilter.value === 'all' ||
      normalizeStatus(r.is_approved) === statusFilter.value;
    return matchesText && matchesStatus;
  })
);

const totalPages = computed(() => Math.max(1, Math.ceil(filteredReceipts.value.length / itemsPerPage)));
const paginatedReceipts = computed(() =>
  filteredReceipts.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function normalizeStatus(val) {
  const v = (val || '').toString().toLowerCase();
  if (['1', 'true', 'approved', 'yes'].includes(v)) return 'approved';
  if (['0', 'false', 'rejected', 'no'].includes(v)) return 'rejected';
  return 'pending';
}

function formatApproval(val) {
  const s = normalizeStatus(val);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function approvalClasses(val) {
  switch (normalizeStatus(val)) {
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300 border border-green-200 dark:border-green-500/20';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border border-red-200 dark:border-red-500/20';
    default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/20';
  }
}

function approvalDot(val) {
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

function downloadFile(fileUrl, fileName) {
  saveAs(fileUrl, fileName);
}

function openPreview(fileUrl) {
  imgError.value = false;
  previewUrl.value = fileUrl;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.dialog-enter-active, .dialog-leave-active { transition: opacity 0.2s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; }
</style>