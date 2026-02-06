<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and approve/reject price schedules and quotations
        </p>
      </div>
    </div>

    <!-- Search -->
    <div class="max-w-2xl">
      <div class="relative">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by tender title..."
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

    <!-- Tender Cards -->
    <div class="space-y-6">
      <div
        v-for="tender in paginatedTenders"
        :key="tender.tender_id"
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <!-- Header Section -->
        <div class="p-5 border-b border-gray-200 dark:border-gray-800">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ tender.tender?.title || 'Untitled Tender' }}
              </h3>
              <div class="mt-1 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Project Manager: {{ tender.user?.name || '—' }}</p>
                <p>Created: {{ formatDate(tender.created_at) }}</p>
              </div>
            </div>

            <div class="flex flex-col items-start sm:items-end gap-2">
              <span
                :class="statusClasses(tender.status)"
                class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
              >
                {{ tender.status?.toUpperCase() || 'UNKNOWN' }}
              </span>

              <div v-if="tender.status === 'rejected' && tender.reason_for_reject" class="text-sm text-red-600 dark:text-red-400 max-w-md">
                Reason: {{ tender.reason_for_reject }}
              </div>

              <button
                v-if="tender.status === 'pending'"
                @click="openApprovalDialog(tender.tender_id)"
                class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
              >
                Review / Approve
              </button>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Total (VAT Excl)</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(tender.total_amount_vat_excl) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Total (VAT Incl)</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(tender.total_amount_vat_incl) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Amount Needed</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(tender.total_amount_needed) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Site Contingency</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(tender.site_contingency) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Total Investment</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(tender.total_investment) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Projected Profit</p>
              <p class="font-medium" :class="profitColor(tender.projected_profit)">
                {{ formatCurrency(tender.projected_profit) }} ({{ tender.projected_profit_percentage }}%)
              </p>
            </div>
          </div>
        </div>

        <!-- Schedule Items -->
        <div class="p-5">
          <h4 class="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
            Schedule Items
          </h4>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">S/N</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-96">Description</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Q. Qty</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">Unit</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Q. Rate</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Q. Amount</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Qty</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Rate</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Amount</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Source</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Urgent</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="item in tender.items"
                  :key="item.price_schedule_id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{{ item.serial_number || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">{{ item.item_description || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{{ item.quoted_quantity || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{{ item.quoted_unit || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">{{ formatCurrency(item.quoted_rate) }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(item.quoted_amount) }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{{ item.quantity || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">{{ formatCurrency(item.rate) }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{{ item.source || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{{ item.urgent_status || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!paginatedTenders.length"
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center"
      >
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No quotations found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search filter or check back later.
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedTenders.length }} of {{ filteredTenders.length }} quotations
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
          :disabled="currentPage * itemsPerPage >= filteredTenders.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Approval Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-5">
          Review Tender Quotation
        </h3>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Decision</label>
            <select
              v-model="approvalStatus"
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>

          <div v-if="approvalStatus === 'rejected'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for Rejection <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="rejectionReason"
              rows="3"
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter detailed reason for rejection..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="closeDialog"
              class="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              @click="submitApproval"
              :disabled="approvalStatus === 'rejected' && !rejectionReason.trim()"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const schedules = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const showDialog = ref(false);
const selectedTenderId = ref(null);
const approvalStatus = ref('approved');
const rejectionReason = ref('');

const toast = useToast();
const router = useRouter();

onMounted(async () => {
  await fetchSchedules();
});

async function fetchSchedules() {
  try {
    const response = await axios.get('/api/price-shedules');
    if (response.data?.status === 200 && Array.isArray(response.data.data)) {
      schedules.value = groupByTender(response.data.data);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load quotations');
  }
}

function groupByTender(data) {
  const grouped = {};
  data.forEach(item => {
    const id = item.tender_id;
    if (!grouped[id]) {
      grouped[id] = {
        tender_id: id,
        tender: item.tender,
        user: item.user,
        created_at: item.created_at,
        status: item.status,
        reason_for_reject: item.reason_for_reject,
        total_amount_vat_excl: item.total_amount_vat_excl,
        total_amount_vat_incl: item.total_amount_vat_incl,
        total_amount_needed: item.total_amount_needed,
        site_contingency: item.site_contingency,
        total_investment: item.total_investment,
        projected_profit: item.projected_profit,
        projected_profit_percentage: item.projected_profit_percentage,
        items: []
      };
    }

    if (item.item_description || item.serial_number?.match(/^[A-M\s]+$/)) {
      grouped[id].items.push(item);
    }
  });
  return Object.values(grouped);
}

const filteredTenders = computed(() =>
  schedules.value.filter(t =>
    t.tender?.title?.toLowerCase().includes(filter.value.toLowerCase())
  )
);

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTenders.value.slice(start, start + itemsPerPage);
});

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredTenders.value.length / itemsPerPage)) return;
  currentPage.value = page;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatCurrency(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function statusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    case 'approved': case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

function profitColor(profit) {
  if (profit == null) return '';
  return profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
}

function openApprovalDialog(tenderId) {
  selectedTenderId.value = tenderId;
  approvalStatus.value = 'approved';
  rejectionReason.value = '';
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  selectedTenderId.value = null;
}

async function submitApproval() {
  if (approvalStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    toast.warning('Please provide a reason for rejection');
    return;
  }

  try {
    const payload = {
      tender_id: selectedTenderId.value,
      status: approvalStatus.value,
      reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value.trim() : null
    };

    const response = await axios.post('/api/approve-schedule', payload);

    if (response.data?.status === 200) {
      toast.success(response.data.message || 'Decision submitted successfully');
      await fetchSchedules();
      closeDialog();
    } else {
      throw new Error(response.data?.message || 'Failed to submit decision');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error submitting decision');
  }
}
</script>