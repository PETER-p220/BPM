<template>
  <div class="p-4 py-5 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
    <PageHeader title="Quotations" subtitle="Quotations">
      <div class="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
        <router-link to="/submit-shedule" class="self-end sm:self-auto">
          <BaseButton style="background-color: #0d4063;" class="w-full sm:w-auto">
            Create New Quoation
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>
      </div>
    </PageHeader>

    <div class="flex items-center mb-4">
      <input
        type="text"
        v-model="filter"
        placeholder="Search by Tender Title..."
        class="w-full p-2 border rounded sm:w-auto"
      />
    </div>

    <!-- Full-Width Container -->
    <div class="space-y-4">
      <div
        v-for="tender in filteredTenders"
        :key="tender.tender_id"
        class="w-full p-4 bg-white rounded-lg shadow-lg"
      >
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Tender: {{ tender.tender.title }}</h3>
        <p class="text-sm text-gray-600">Project Manager: {{ tender.user?.name || 'N/A' }}</p>
        <p class="text-sm text-gray-600">Created: {{ formatDate(tender.created_at) }}</p>
        <div class="mt-2">
          <span
            :class="statusButtonClass(tender.status)"
            class="inline-block px-3 py-1 text-sm font-medium rounded-full"
          >
            {{ tender.status }}
          </span>
          <p v-if="tender.status === 'rejected' && tender.reason_for_reject" class="mt-1 text-sm text-red-600">
            Reason: {{ tender.reason_for_reject }}
          </p>
        </div>

        <!-- Tender-Level Totals -->
        <div class="mt-2 text-sm text-gray-700">
          <p><strong>Total Amount(VAT Excl):</strong> {{ formatCurrency(tender.total_amount_vat_excl) }}</p>
          <p><strong>Total Amount(VAT Incl):</strong> {{ formatCurrency(tender.total_amount_vat_incl) }}</p>
          <p><strong>Amount Needed:</strong> {{ formatCurrency(tender.total_amount_needed) }}</p>
          <p><strong>Site Contingency:</strong> {{ formatCurrency(tender.site_contingency) }}</p>
          <p><strong>Total Investment:</strong> {{ formatCurrency(tender.total_investment) }}</p>
          <p><strong>Projected Profit:</strong> {{ formatCurrency(tender.projected_profit) }} ({{ tender.projected_profit_percentage }}%)</p>
        </div>

        <!-- Schedule Details with Grouped Headings -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700">Schedule Items</h4>
          <div class="mt-2 overflow-x-auto">
            <div class="flex flex-col">
              <!-- Grouped Headings -->
              <div class="flex space-x-2 text-sm font-semibold text-gray-600 bg-gray-100 p-2 rounded-t">
                <span class="w-10 flex-shrink-0"></span> <!-- S/N -->
                <span class="w-80 flex-shrink-0"></span> <!-- Description (increased from w-40) -->
                <span class="w-20 flex-shrink-0 text-center whitespace-nowrap">QUOTED PRICES (VAT EXCL)</span> <!-- Q. Qty -->
                <span class="w-10 flex-shrink-0"></span> <!-- Unit -->
                <span class="w-24 flex-shrink-0"></span> <!-- Q. Rate -->
                <span class="w-28 flex-shrink-0"></span> <!-- Q. Amount -->
                <span class="w-20 flex-shrink-0 text-center whitespace-nowrap">BUYING PRICES (VAT INCL)</span> <!-- Qty -->
                <span class="w-24 flex-shrink-0"></span> <!-- Rate -->
                <span class="w-28 flex-shrink-0"></span> <!-- Amount -->
                <span class="w-20 flex-shrink-0"></span> <!-- Source -->
                <span class="w-20 flex-shrink-0"></span> <!-- Urgent -->
              </div>
              <!-- Column Headings -->
              <div class="flex space-x-2 text-sm font-semibold text-gray-600 bg-gray-100 p-2">
                <span class="w-10 flex-shrink-0">S/N</span>
                <span class="w-80 flex-shrink-0">Description</span> <!-- Description (increased from w-40) -->
                <span class="w-20 flex-shrink-0">Q. Qty</span>
                <span class="w-10 flex-shrink-0">Unit</span>
                <span class="w-24 flex-shrink-0">Q. Rate</span>
                <span class="w-28 flex-shrink-0">Q. Amount</span>
                <span class="w-20 flex-shrink-0">Qty</span>
                <span class="w-24 flex-shrink-0">Rate</span>
                <span class="w-28 flex-shrink-0">Amount</span>
                <span class="w-20 flex-shrink-0">Source</span>
                <span class="w-20 flex-shrink-0">Urgent</span>
              </div>
              <!-- Items -->
              <div v-for="item in tender.items" :key="item.price_schedule_id" class="flex space-x-2 text-sm border-t pt-2">
                <span class="w-10 flex-shrink-0">{{ item.serial_number }}</span>
                <span class="w-80 flex-shrink-0 truncate">{{ item.item_description || 'N/A' }}</span> <!-- Description (increased from w-40) -->
                <span class="w-20 flex-shrink-0">{{ item.quoted_quantity || '-' }}</span>
                <span class="w-10 flex-shrink-0">{{ item.quoted_unit || '-' }}</span>
                <span class="w-24 flex-shrink-0">{{ formatCurrency(item.quoted_rate) }}</span>
                <span class="w-28 flex-shrink-0">{{ formatCurrency(item.quoted_amount) }}</span>
                <span class="w-20 flex-shrink-0">{{ item.quantity || '-' }}</span>
                <span class="w-24 flex-shrink-0">{{ formatCurrency(item.rate) }}</span>
                <span class="w-28 flex-shrink-0">{{ formatCurrency(item.amount) }}</span>
                <span class="w-20 flex-shrink-0">{{ item.source || 'N/A' }}</span>
                <span class="w-20 flex-shrink-0">{{ item.urgent_status || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!filteredTenders.length"
        class="w-full p-4 text-center text-gray-500 bg-white rounded-lg shadow-lg"
      >
        No schedules found for the current filter.
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-4">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
      >
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }}</span>
      <button
        :disabled="currentPage * itemsPerPage >= allTenders.length"
        @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const schedules = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10; // Number of tenders per page
const toast = useToast();

onMounted(async () => {
  await fetchSchedules();
});

async function fetchSchedules() {
  try {
    const response = await axios.get('/api/user-schedule');
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      const groupedSchedules = groupByTender(response.data.data);
      schedules.value = groupedSchedules;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  }
}

// Group schedules by tender_id
function groupByTender(data) {
  const grouped = {};
  data.forEach(item => {
    const tenderId = item.tender_id;
    if (!grouped[tenderId]) {
      grouped[tenderId] = {
        tender_id: tenderId,
        tender: item.tender,
        user: item.user,
        created_at: item.created_at,
        status: item.status,
        reason_for_reject: item.reason_for_reject,
        total_amount_vat_excl: null,
        total_amount_vat_incl: null,
        total_amount_needed: null,
        site_contingency: null,
        total_investment: null,
        projected_profit: null,
        projected_profit_percentage: null,
        items: []
      };
    }

    // Assign totals from the first item that has them
    if (item.total_amount_vat_excl && !grouped[tenderId].total_amount_vat_excl) {
      grouped[tenderId].total_amount_vat_excl = item.total_amount_vat_excl;
      grouped[tenderId].total_amount_vat_incl = item.total_amount_vat_incl;
      grouped[tenderId].total_amount_needed = item.total_amount_needed;
      grouped[tenderId].site_contingency = item.site_contingency;
      grouped[tenderId].total_investment = item.total_investment;
      grouped[tenderId].projected_profit = item.projected_profit;
      grouped[tenderId].projected_profit_percentage = item.projected_profit_percentage;
    }

    // Add all items with descriptions or valid serial numbers
    if (item.item_description || item.serial_number.match(/^[A-M\s]+$/)) {
      grouped[tenderId].items.push(item);
    }
  });

  return Object.values(grouped);
}

const allTenders = computed(() =>
  schedules.value.filter(tender =>
    tender.tender?.title?.toLowerCase().includes(filter.value.toLowerCase()) || !filter.value
  )
);

const filteredTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allTenders.value.slice(start, end);
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(value) {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(value);
}

function statusButtonClass(status) {
  if (status === 'pending') return 'bg-yellow-500 text-white';
  if (status === 'passed') return 'bg-green-500 text-white';
  if (status === 'rejected') return 'bg-red-500 text-white';
  return 'bg-gray-500 text-white';
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function changePage(page) {
  if (page > 0 && page <= Math.ceil(allTenders.value.length / itemsPerPage)) {
    currentPage.value = page;
  }
}
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #edf2f7;
}

/* Ensure full width responsiveness */
.w-full {
  width: 100%;
}

/* Center text for grouped headings */
.text-center {
  text-align: center;
}
</style>