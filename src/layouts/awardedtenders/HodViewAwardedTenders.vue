<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Awarded Tenders</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        List of tenders that have been awarded — view documents and sent status
      </p>
    </div>

    <!-- Controls -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by recipient name or status..."
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pl-10 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
        />
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          @click="exportToExcel"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition shadow-sm"
        >
          <svg class="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM13.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 9H3a1 1 0 110-2h11.586l-1.293-1.293z" />
          </svg>
          Excel
        </button>

        <button
          @click="exportToPDF"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition shadow-sm"
        >
          <svg class="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0114 3.586L17.414 7A2 2 0 0118 8.414V16a2 2 0 01-2 2h-1.528A6 6 0 004.528 18H4a2 2 0 01-2-2V6a2 2 0 012-2z" clip-rule="evenodd" />
          </svg>
          PDF
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-700/50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">No</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Sent To</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Award Document</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Sent Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Awarded At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="py-12 text-gray-500 dark:text-gray-400">
                Loading awarded tenders...
              </td>
            </tr>

            <tr v-else-if="filteredData.length === 0" class="text-center">
              <td colspan="5" class="py-12 text-gray-500 dark:text-gray-400">
                No awarded tenders found matching your search.
              </td>
            </tr>

            <tr
              v-for="(award, index) in filteredData"
              :key="award.award_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{{ award.user_name || '—' }}</td>

              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <button
                  @click="downloadAwardDocument(award.awarded_document)"
                  class="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition disabled:opacity-50"
                  :disabled="!award.awarded_document"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Award Doc
                </button>
              </td>

              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="getSentStatusClasses(award.is_sent)"
                  class="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium"
                >
                  {{ award.is_sent || 'Unknown' }}
                </span>
              </td>

              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(award.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
        <div>Showing {{ filteredData.length }} of {{ awards.length }} awards</div>
        <!-- Placeholder for future pagination -->
        <div class="flex gap-2">
          <button class="rounded border px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40" disabled>Previous</button>
          <button class="rounded border px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40" disabled>Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

const toast = useToast();

const awards = ref([]);
const filter = ref('');
const loading = ref(false);

onMounted(async () => {
  await fetchAwardedTenders();
});

async function fetchAwardedTenders() {
  loading.value = true;
  try {
    const response = await axios.get('api/awarded-tender');
    awards.value = response.data.data || [];
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
}

async function downloadAwardDocument(url) {
  if (!url) {
    toast.warning('No award document available');
    return;
  }
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    saveAs(response.data, 'award-document.pdf');
    toast.success('Download started');
  } catch (error) {
    handleError(error);
  }
}

const filteredData = computed(() => {
  if (!filter.value.trim()) return awards.value;

  const term = filter.value.toLowerCase();
  return awards.value.filter(item =>
    item.user_name?.toLowerCase().includes(term) ||
    item.is_sent?.toLowerCase().includes(term)
  );
});

function getSentStatusClasses(status) {
  const s = (status || '').toLowerCase();
  if (s === 'yes' || s === 'sent') {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300';
  }
  if (s === 'no' || s === 'not sent' || s === 'pending') {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function handleError(error) {
  let msg = 'Something went wrong';
  if (error.response?.data?.message) msg = error.response.data.message;
  else if (error.message) msg = error.message;
  toast.error(msg);
}

function exportToExcel() {
  if (filteredData.value.length === 0) {
    toast.info('No data to export');
    return;
  }

  const data = filteredData.value.map((entry, idx) => ({
    No: idx + 1,
    SentTo: entry.user_name || '',
    SentStatus: entry.is_sent || '',
    AwardedAt: entry.created_at ? new Date(entry.created_at).toLocaleString() : '',
    DocumentUrl: entry.awarded_document || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Awarded Tenders');
  XLSX.writeFile(wb, 'Awarded_Tenders.xlsx');
}

function exportToPDF() {
  if (filteredData.value.length === 0) {
    toast.info('No data to export');
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Awarded Tenders Report', 14, 20);

  const tableData = filteredData.value.map((entry, idx) => [
    idx + 1,
    entry.user_name || '',
    entry.is_sent || '',
    entry.created_at ? new Date(entry.created_at).toLocaleString() : '',
    // We usually don't include long URLs in PDF tables — consider omitting or shortening
  ]);

  autoTable(doc, {
    head: [['No', 'Sent To', 'Sent Status', 'Awarded At']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [45, 212, 191] }, // teal-600
    alternateRowStyles: { fillColor: [240, 253, 250] } // teal-50
  });

  doc.save('Awarded_Tenders.pdf');
}
</script>