<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">

      <!-- Header + Action -->
      <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Receipts
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            View and manage all submitted receipts
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="exportReceipts"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-400"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <router-link to="/submit-receipt">
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Receipt
            </button>
          </router-link>
        </div>
      </div>

      <!-- Card + Search & Filter -->
      <div class="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="filter"
              type="text"
              placeholder="Search by name, description, date..."
              class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-red-500 sm:text-sm"
            />
          </div>

          <div class="text-sm font-medium text-gray-500 dark:text-gray-400 sm:whitespace-nowrap">
            {{ filteredReceipts.length }}
            <span class="text-gray-400 dark:text-gray-500">receipt{{ filteredReceipts.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <!-- Desktop Table -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-16 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  #
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Submitted By
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </th>
                <th class="w-44 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th class="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="(receipt, index) in paginatedReceipts"
                :key="receipt.receipt_id"
                class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>

                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-medium text-white">
                      {{ getInitials(receipt.user_name) }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ receipt.user_name }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="line-clamp-2 max-w-xl text-sm text-gray-900 dark:text-gray-100">
                    {{ receipt.description }}
                  </div>
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(receipt.created_at) }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <button
                    @click="downloadFile(receipt.receipt_file, `receipt-${receipt.receipt_id}.jpg`)"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-red-600/30 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 active:bg-red-200 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
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
            :key="receipt.receipt_id"
            class="p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 flex-1 items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  {{ getInitials(receipt.user_name) }}
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ receipt.user_name }}
                  </p>
                  <p class="mt-0.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {{ receipt.description }}
                  </p>
                  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(receipt.created_at) }}
                  </p>
                </div>
              </div>

              <button
                @click="downloadFile(receipt.receipt_file, `receipt-${receipt.receipt_id}.jpg`)"
                class="mt-1 rounded-lg border border-red-600/30 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 active:bg-red-200 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
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
        <div v-if="filteredReceipts.length > itemsPerPage" class="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-5 dark:border-gray-700 sm:flex-row">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span class="font-medium text-gray-900 dark:text-gray-100">
              {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredReceipts.length) }}
            </span>
            to
            <span class="font-medium text-gray-900 dark:text-gray-100">
              {{ Math.min(currentPage * itemsPerPage, filteredReceipts.length) }}
            </span>
            of
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ filteredReceipts.length }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
                'flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>

            <button
              :disabled="currentPage * itemsPerPage >= filteredReceipts.length"
              @click="changePage(currentPage + 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { saveAs } from 'file-saver';

const receipts = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(async () => {
  await fetchReceipts();
});

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
</style>