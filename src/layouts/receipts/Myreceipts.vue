<template>
  <div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%);">
    <div class="mx-auto max-w-7xl">

      <!-- Header + Action -->
      <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold" style="color:#183b63;">
            Receipts
          </h1>
          <p class="mt-1.5 text-sm" style="color:#67819d;">
            View and manage all submitted receipts
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="exportReceipts"
            class="inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
            style="border:1px solid #d7e4f1;background:#fff;color:#183b63;"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button
            @click="openReceiptModal"
            class="inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f78dd]"
            style="background:linear-gradient(135deg,#194f92,#2f78dd);"
          >
            <i class="fas fa-receipt" style="font-size:13px;"></i>
            Submit Receipt
          </button>
        </div>
      </div>

      <div class="mb-6 rounded-[20px] bg-white" style="border:1px solid #d9e6f3;box-shadow:0 4px 16px rgba(18,58,99,0.07);">
        <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg class="h-5 w-5" style="color:#9ab8d8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="filter"
              type="text"
              placeholder="Search by name, description, date..."
              class="block w-full rounded-[10px] py-2.5 pl-11 pr-4 text-sm outline-none transition-all"
              style="border:1.5px solid #d6e4f2;background:#f8fbff;color:#183b63;"
            />
          </div>

          <div class="text-sm font-semibold sm:whitespace-nowrap" style="color:#7a93af;">
            {{ filteredReceipts.length }}
            <span style="color:#9ab8d8;">receipt{{ filteredReceipts.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="overflow-hidden rounded-[24px] bg-white" style="border:1px solid #d9e6f3;box-shadow:0 28px 70px rgba(18,58,99,0.12);">

        <!-- Desktop Table -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead style="background:#f3f8ff;">
              <tr>
                <th class="w-16 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">
                  #
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">
                  Submitted By
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">
                  Description
                </th>
                <th class="w-44 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">
                  Date
                </th>
                <th class="w-32 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="(receipt, index) in paginatedReceipts"
                :key="(receipt.source || 'receipt') + '_' + receipt.receipt_id"
                class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium" style="color:#7a93af;">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                      {{ getInitials(receipt.user_name) }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-semibold" style="color:#183b63;">{{ receipt.user_name }}</div>
                      <span v-if="receipt.source === 'financial_record'"
                            class="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style="background:#e8f3ff;color:#1f5aa6;">Financial Record</span>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="line-clamp-2 max-w-xl text-sm" style="color:#4e6781;">{{ receipt.description }}</div>
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-sm" style="color:#7a93af;">{{ formatDate(receipt.created_at) }}</td>

                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <button
                    @click="downloadFile(receipt.receipt_file, `receipt-${receipt.receipt_id}.jpg`)"
                    class="inline-flex items-center gap-1.5 rounded-[8px] px-4 py-1.5 text-sm font-semibold transition-colors"
                    style="border:1px solid #d7e4f1;background:#f3f8ff;color:#2d6aaf;"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="paginatedReceipts.length === 0" class="py-16 text-center">
            <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m4-8V8a4 4 0 00-8 0v1m-4 8h16a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-base font-medium text-gray-600 dark:text-gray-300">
              No receipts found
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ filter ? 'Try different search terms' : 'Start by submitting your first receipt' }}
            </p>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="divide-y divide-gray-200 dark:divide-gray-700 md:hidden">
          <div
            v-for="receipt in paginatedReceipts"
            :key="(receipt.source || 'receipt') + '_' + receipt.receipt_id"
            class="p-5 transition-colors hover:bg-[#f8fbff]"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 flex-1 items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                  {{ getInitials(receipt.user_name) }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-semibold" style="color:#183b63;">{{ receipt.user_name }}</p>
                    <span v-if="receipt.source === 'financial_record'"
                          class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style="background:#e8f3ff;color:#1f5aa6;">Financial Record</span>
                  </div>
                  <p class="mt-0.5 line-clamp-2 text-sm" style="color:#4e6781;">{{ receipt.description }}</p>
                  <p class="mt-1.5 text-xs" style="color:#7a93af;">{{ formatDate(receipt.created_at) }}</p>
                </div>
              </div>

              <button
                @click="downloadFile(receipt.receipt_file, `receipt-${receipt.receipt_id}.jpg`)"
                class="mt-1 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"
                style="border:1px solid #d7e4f1;background:#f3f8ff;color:#2d6aaf;"
              >
                Download
              </button>
            </div>
          </div>

          <div v-if="paginatedReceipts.length === 0" class="py-16 text-center">
            <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m4-8V8a4 4 0 00-8 0v1m-4 8h16a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-base font-medium text-gray-600 dark:text-gray-300">
              No receipts found
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredReceipts.length > itemsPerPage" class="flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row" style="border-top:1px solid #e8f0f8;">
          <div class="text-sm" style="color:#7a93af;">
            Showing
            <span class="font-semibold" style="color:#183b63;">{{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredReceipts.length) }}</span>
            to
            <span class="font-semibold" style="color:#183b63;">{{ Math.min(currentPage * itemsPerPage, filteredReceipts.length) }}</span>
            of
            <span class="font-semibold" style="color:#183b63;">{{ filteredReceipts.length }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="flex h-9 w-9 items-center justify-center rounded-[8px] disabled:opacity-40 transition-all"
              style="border:1px solid #d9e6f3;color:#7a93af;"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'flex h-9 min-w-[2.25rem] items-center justify-center rounded-[8px] text-sm font-semibold transition-colors',
              ]"
              :style="page === currentPage ? 'background:linear-gradient(135deg,#194f92,#2f78dd);color:#fff;border:1px solid #1a4a88;' : 'border:1px solid #d9e6f3;color:#4e78ab;'"
            >
              {{ page }}
            </button>

            <button
              :disabled="currentPage * itemsPerPage >= filteredReceipts.length"
              @click="changePage(currentPage + 1)"
              class="flex h-9 w-9 items-center justify-center rounded-[8px] disabled:opacity-40 transition-all"
              style="border:1px solid #d9e6f3;color:#7a93af;"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Submit Receipt Modal ── -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="receiptModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(14,34,64,0.45);backdrop-filter:blur(4px);"
        @click.self="closeReceiptModal"
      >
        <div
          class="w-full max-w-2xl rounded-[24px] bg-white overflow-hidden"
          style="border:1px solid #d6e4f2;box-shadow:0 32px 80px rgba(18,58,99,0.24);max-height:92vh;display:flex;flex-direction:column;"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 shrink-0" style="border-bottom:1px solid #e8f0f8;background:linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                <i class="fas fa-receipt text-white" style="font-size:13px;"></i>
              </div>
              <div>
                <h2 class="font-bold text-[#183b63]" style="font-size:15px;line-height:1.2;">Submit Receipt</h2>
                <p class="text-[11px] text-[#7a93af] mt-0.5">Upload a receipt image to your accountant</p>
              </div>
            </div>
            <button @click="closeReceiptModal" class="w-8 h-8 rounded-lg flex items-center justify-center text-[#7a93af] hover:bg-[#eef5ff] hover:text-[#183b63] transition-all">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body (scrollable) -->
          <div class="px-6 py-5 space-y-5 overflow-y-auto flex-1">

            <!-- Receipt Type buttons (full width) -->
            <div>
              <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-2">Receipt Type <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="receiptModal.type = 'income'"
                  class="flex items-center justify-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold transition-all"
                  :style="receiptModal.type === 'income' ? 'background:linear-gradient(135deg,#0f7b55,#19a974);color:#fff;border:2px solid #0f7b55;box-shadow:0 4px 14px rgba(15,123,85,0.25);' : 'border:2px solid #d6e4f2;background:#f8fbff;color:#4e6781;'"
                >
                  <i class="fas fa-arrow-circle-up" :style="receiptModal.type === 'income' ? 'color:#fff' : 'color:#19a974'"></i>
                  Income
                </button>
                <button
                  type="button"
                  @click="receiptModal.type = 'expense'"
                  class="flex items-center justify-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold transition-all"
                  :style="receiptModal.type === 'expense' ? 'background:linear-gradient(135deg,#b91c1c,#ef4444);color:#fff;border:2px solid #b91c1c;box-shadow:0 4px 14px rgba(185,28,28,0.2);' : 'border:2px solid #d6e4f2;background:#f8fbff;color:#4e6781;'"
                >
                  <i class="fas fa-arrow-circle-down" :style="receiptModal.type === 'expense' ? 'color:#fff' : 'color:#ef4444'"></i>
                  Expense
                </button>
              </div>
              <p v-if="receiptModal.showErrors && !receiptModal.type" class="mt-1 text-[11px] text-red-500">Please select a type</p>
            </div>

            <!-- Row: Accountant + Date -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Accountant select -->
              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">Select Accountant <span class="text-red-500">*</span></label>
                <select
                  v-model="receiptModal.accountant_id"
                  class="w-full rounded-[10px] px-3 py-2.5 text-sm text-[#183b63] outline-none transition-all"
                  :style="`border:1.5px solid ${receiptModal.showErrors && !receiptModal.accountant_id ? '#e57373' : '#d6e4f2'};background:#fff;`"
                >
                  <option value="" disabled>Choose an accountant…</option>
                  <option v-for="acc in accountants" :key="acc.user_id" :value="acc.user_id">{{ acc.name }}</option>
                </select>
                <p v-if="receiptModal.showErrors && !receiptModal.accountant_id" class="mt-1 text-[11px] text-red-500">Required</p>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">Date</label>
                <input
                  v-model="receiptModal.date"
                  type="date"
                  class="w-full rounded-[10px] px-3 py-2.5 text-sm text-[#183b63] outline-none transition-all"
                  style="border:1.5px solid #d6e4f2;background:#fff;"
                />
              </div>
            </div>

            <!-- File upload (full width) -->
            <div>
              <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">Receipt Image <span class="text-red-500">*</span></label>
              <div
                class="rounded-[12px] p-5 text-center cursor-pointer transition-all"
                :style="`border:2px dashed ${receiptModal.showErrors && !receiptModal.file ? '#e57373' : receiptModal.file ? '#2f78dd' : '#c3d9f5'};background:${receiptModal.file ? '#f0f7ff' : '#f8fbff'};`"
                @click="$refs.receiptFileInput.click()"
                @dragover.prevent
                @drop.prevent="handleReceiptDrop"
              >
                <input ref="receiptFileInput" type="file" accept="image/jpeg,image/png,image/gif" class="hidden" @change="handleReceiptFile" />
                <div v-if="receiptModal.file" class="space-y-1">
                  <i class="fas fa-file-image text-3xl" style="color:#2f78dd;"></i>
                  <p class="text-sm font-semibold text-[#183b63] truncate mx-auto max-w-xs">{{ receiptModal.file.name }}</p>
                  <p class="text-[11px] text-[#7a93af]">{{ formatReceiptFileSize(receiptModal.file.size) }}</p>
                  <button type="button" @click.stop="receiptModal.file = null" class="text-[11px] text-red-500 hover:underline">Remove</button>
                </div>
                <div v-else class="space-y-1.5">
                  <i class="fas fa-cloud-upload-alt text-3xl" style="color:#9ab8d8;"></i>
                  <p class="text-sm text-[#4e6781]">Drag & drop or <span style="color:#2f78dd;font-weight:600;">click to browse</span></p>
                  <p class="text-[11px] text-[#9ab8d8]">JPG, PNG, GIF · max 10 MB</p>
                </div>
              </div>
              <p v-if="receiptModal.showErrors && !receiptModal.file" class="mt-1 text-[11px] text-red-500">Please upload a receipt image</p>
            </div>

            <!-- Row: Reference + Description (2 cols, both optional) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Reference -->
              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">
                  Reference <span class="text-[#b8ccdf] font-normal normal-case" style="font-size:9px;">(optional)</span>
                </label>
                <input
                  v-model="receiptModal.reference"
                  type="text"
                  :placeholder="`e.g. INV-${new Date().getFullYear()}-001`"
                  class="w-full rounded-[10px] px-3 py-2.5 text-sm text-[#183b63] outline-none transition-all"
                  style="border:1.5px solid #d6e4f2;background:#fff;"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">
                  Description <span class="text-[#b8ccdf] font-normal normal-case" style="font-size:9px;">(optional)</span>
                </label>
                <textarea
                  v-model="receiptModal.description"
                  rows="2"
                  placeholder="Purpose, notes…"
                  class="w-full rounded-[10px] px-3 py-2.5 text-sm text-[#183b63] outline-none transition-all resize-none"
                  style="border:1.5px solid #d6e4f2;background:#fff;line-height:1.6;"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between gap-3 px-6 py-4 shrink-0" style="border-top:1px solid #e8f0f8;background:#f8fbff;">
            <button
              @click="closeReceiptModal"
              class="px-5 py-2.5 rounded-[10px] text-sm font-semibold text-[#4e78ab] hover:bg-[#eef5ff] transition-all"
              style="border:1px solid #d6e4f2;"
            >
              Cancel
            </button>
            <button
              @click="submitReceiptModal"
              :disabled="receiptModal.submitting"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white transition-all disabled:opacity-60"
              style="background:linear-gradient(135deg,#194f92,#2f78dd);box-shadow:0 6px 18px rgba(35,96,182,0.22);"
            >
              <i v-if="receiptModal.submitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
              {{ receiptModal.submitting ? 'Submitting…' : 'Submit Receipt' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { saveAs } from 'file-saver';
import { useToast } from 'vue-toastification';

const toast = useToast();

const receipts = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Accountants for the modal
const accountants = ref([]);
const receiptFileInput = ref(null);

function todayDate() {
  return new Date().toISOString().split('T')[0];
}

// Modal state
const receiptModal = ref({
  open: false,
  type: '',
  accountant_id: '',
  date: todayDate(),
  file: null,
  reference: '',
  description: '',
  submitting: false,
  showErrors: false,
});

function openReceiptModal() {
  receiptModal.value = { open: true, type: '', accountant_id: '', date: todayDate(), file: null, reference: '', description: '', submitting: false, showErrors: false };
}
function closeReceiptModal() {
  if (receiptModal.value.submitting) return;
  receiptModal.value.open = false;
}

function handleReceiptFile(e) {
  const file = e.target.files?.[0];
  setReceiptFile(file);
}
function handleReceiptDrop(e) {
  setReceiptFile(e.dataTransfer.files?.[0]);
}
function setReceiptFile(file) {
  if (!file) return;
  const allowed = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG or GIF images are allowed'); return; }
  if (file.size > 10 * 1024 * 1024) { toast.error('File must not exceed 10 MB'); return; }
  receiptModal.value.file = file;
}
function formatReceiptFileSize(bytes) {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function submitReceiptModal() {
  receiptModal.value.showErrors = true;
  if (!receiptModal.value.type || !receiptModal.value.accountant_id || !receiptModal.value.file) return;
  receiptModal.value.submitting = true;
  try {
    const fd = new FormData();
    fd.append('type', receiptModal.value.type);
    fd.append('accountant_id', receiptModal.value.accountant_id);
    fd.append('date', receiptModal.value.date);
    fd.append('receipt_file', receiptModal.value.file);
    if (receiptModal.value.reference.trim()) fd.append('reference', receiptModal.value.reference.trim());
    if (receiptModal.value.description.trim()) fd.append('description', receiptModal.value.description.trim());
    const res = await axios.post('/api/receipts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success(res.data?.message || 'Receipt submitted successfully!');
    closeReceiptModal();
    await fetchReceipts();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to submit receipt.');
  } finally {
    receiptModal.value.submitting = false;
  }
}

onMounted(async () => {
  await Promise.all([fetchReceipts(), fetchAccountants()]);
});

async function fetchAccountants() {
  try {
    const res = await axios.get('/api/dropdown/accountants');
    accountants.value = res.data.users || [];
  } catch {}
}

async function fetchReceipts() {
  try {
    const response = await axios.get('api/my/receipts');
    receipts.value = response.data.data;
  } catch (error) {
    console.error('Error fetching receipts:', error);
  }
}

function downloadFile(fileUrl, fileName) {
  saveAs(fileUrl, fileName);
}

function exportReceipts() {
  try {
    // Create CSV content from filtered receipts
    const headers = ['S/N', 'Submitted By', 'Description', 'Date', 'Receipt File'];
    const rows = filteredReceipts.value.map((receipt, index) => [
      index + 1,
      receipt.user_name,
      receipt.description,
      formatDate(receipt.created_at),
      receipt.receipt_file
    ]);
    
    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `receipts-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    console.log('Receipts exported successfully');
  } catch (error) {
    console.error('Error exporting receipts:', error);
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

const filteredReceipts = computed(() => {
  if (!filter.value) return receipts.value;
  
  const searchTerm = filter.value.toLowerCase();
  return receipts.value.filter(entry =>
    entry.user_name.toLowerCase().includes(searchTerm) ||
    entry.description.toLowerCase().includes(searchTerm) ||
    entry.created_at.toLowerCase().includes(searchTerm)
  );
});

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredReceipts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredReceipts.value.length / itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4);
    } else if (current >= total - 2) {
      pages.push(total - 3, total - 2, total - 1, total);
    } else {
      pages.push(current - 1, current, current + 1);
    }
  }
  
  return pages;
});

function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.rounded-table {
  border-radius: 0.5rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>