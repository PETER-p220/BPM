<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assigned Tenders</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage all tenders assigned to engineers
        </p>
      </div>

      <!-- You can add actions here later (e.g. Export, Add new) -->
      <div class="flex items-center gap-3">
        <!-- <button class="btn-primary">Assign New Tender</button> -->
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by title or engineer name..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entity
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tender No
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Published
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Submission
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status / Deadline
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Engineer
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Attachment
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(tender, index) in paginatedData"
              :key="tender.assign_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ tender.title || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.tender_type || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.procurement_entity || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.tender_number || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(tender.date_of_Publication) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(tender.bid_submission) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClasses(tender)"
                >
                  {{ getStatusText(tender) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.user_name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  v-if="tender.attachment"
                  @click="downloadFile(tender.attachment)"
                  class="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="paginatedData.length === 0">
              <td colspan="10" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-lg font-medium">No assigned tenders found</p>
                  <p class="mt-1">Try adjusting your search or check back later</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedData.length }} of {{ filteredData.length }} tenders
      </p>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {{ currentPage }}
        </span>

        <button
          :disabled="currentPage * itemsPerPage >= filteredData.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const assignedTenders = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Fetch data
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('api/assign/tender');
    assignedTenders.value = response.data.data.map(item => ({
      assign_id: item.assign_id,
      title: item.tender?.title,
      tender_type: item.tender?.tender_type,
      procurement_entity: item.tender?.procurement_entity,
      tender_number: item.tender?.tender_number,
      date_of_Publication: item.tender?.date_of_Publication,
      bid_submission: item.tender?.bid_submission,
      expired_at: item.tender?.expired_at,
      user_name: item.user?.name,
      attachment: item.tender?.attachment,
      is_assigned: item.is_assigned
    }));
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load assigned tenders');
  }
}

// Computed properties
const filteredData = computed(() => {
  if (!filter.value.trim()) return assignedTenders.value;

  const search = filter.value.toLowerCase();
  return assignedTenders.value.filter(t =>
    t.title?.toLowerCase().includes(search) ||
    t.user_name?.toLowerCase().includes(search)
  );
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// Pagination
function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredData.value.length / itemsPerPage.value)) return;
  currentPage.value = page;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Status helpers
function getStatusText(tender) {
  if (tender.is_assigned === 'submitted') return 'Submitted';
  if (!tender.expired_at) return 'No deadline';

  const daysLeft = daysUntil(tender.expired_at);
  if (daysLeft < 0) return 'Expired';
  return `${daysLeft} days left`;
}

function daysUntil(expiredAt) {
  const now = new Date();
  const end = new Date(expiredAt);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusClasses(tender) {
  if (tender.is_assigned === 'submitted') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
  }

  const days = daysUntil(tender.expired_at);
  if (days < 0) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
  if (days <= 3) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
  if (days <= 7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
  return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
}

// Download
function downloadFile(url) {
  if (!url) {
    toast.error('No file available');
    return;
  }

  axios({
    url,
    method: 'GET',
    responseType: 'blob'
  })
    .then(response => {
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = url.split('/').pop() || 'tender-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(() => {
      toast.error('Failed to download file');
    });
}
</script>