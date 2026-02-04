<template>
  <div class="p-4 py-5 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
    <PageHeader subtitle="Quotations">
      <div class="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
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

        <!-- Approve/Reject Button -->
        <div class="mt-4" v-if="tender.status === 'pending'">
          <button
            @click="openApprovalDialog(tender.tender_id)"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Approve/Reject
          </button>
        </div>

        <!-- Schedule Details with Grouped Headings -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700">Schedule Items</h4>
          <div class="mt-2 overflow-x-auto">
            <div class="flex flex-col">
              <!-- Grouped Headings -->
              <div class="flex space-x-2 text-sm font-semibold text-gray-600 bg-gray-100 p-2 rounded-t">
                <span class="w-10 flex-shrink-0"></span>
                <span class="w-80 flex-shrink-0"></span> <!-- Description (increased from w-40) -->
                <span class="w-20 flex-shrink-0 text-center whitespace-nowrap">QUOTED PRICES (VAT EXCL)</span>
                <span class="w-10 flex-shrink-0"></span>
                <span class="w-24 flex-shrink-0"></span>
                <span class="w-28 flex-shrink-0"></span>
                <span class="w-20 flex-shrink-0 text-center whitespace-nowrap">BUYING PRICES (VAT INCL)</span>
                <span class="w-24 flex-shrink-0"></span>
                <span class="w-28 flex-shrink-0"></span>
                <span class="w-20 flex-shrink-0"></span>
                <span class="w-20 flex-shrink-0"></span>
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

    <!-- Approval Dialog -->
    <div v-if="showDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Approve or Reject Tender</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Action</label>
            <select
              v-model="approvalStatus"
              class="mt-1 block w-full p-2 border rounded"
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>
          
          <div v-if="approvalStatus === 'rejected'">
            <label class="block text-sm font-medium text-gray-700">Reason for Rejection</label>
            <textarea
              v-model="rejectionReason"
              class="mt-1 block w-full p-2 border rounded"
              rows="3"
              placeholder="Enter reason for rejection..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              @click="closeDialog"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              @click="submitApproval"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              :disabled="approvalStatus === 'rejected' && !rejectionReason"
            >
              Submit
            </button>
          </div>
        </div>
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
import { useRouter } from 'vue-router';

const schedules = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const toast = useToast();
const router = useRouter();

// Approval dialog state
const showDialog = ref(false);
const selectedTenderId = ref(null);
const approvalStatus = ref('approved');
const rejectionReason = ref('');

onMounted(async () => {
  await fetchSchedules();
});

async function fetchSchedules() {
  try {
    const response = await axios.get('/api/price-shedules'); 
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

    if (item.total_amount_vat_excl && !grouped[tenderId].total_amount_vat_excl) {
      grouped[tenderId].total_amount_vat_excl = item.total_amount_vat_excl;
      grouped[tenderId].total_amount_vat_incl = item.total_amount_vat_incl;
      grouped[tenderId].total_amount_needed = item.total_amount_needed;
      grouped[tenderId].site_contingency = item.site_contingency;
      grouped[tenderId].total_investment = item.total_investment;
      grouped[tenderId].projected_profit = item.projected_profit;
      grouped[tenderId].projected_profit_percentage = item.projected_profit_percentage;
    }

    if (item.item_description || item.serial_number?.match(/^[A-M\s]+$/)) {
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
  try {
    const payload = {
      tender_id: selectedTenderId.value,
      status: approvalStatus.value,
      reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value : null
    };

    const response = await axios.post('/api/approve-schedule', payload);
    
    if (response.data.status === 200) {
      toast.success(response.data.message);
      await fetchSchedules();
      closeDialog();
      router.push('/quotations');
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    handleError(error);
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

.w-full {
  width: 100%;
}

.text-center {
  text-align: center;
}

/* Dialog styles */
.fixed.inset-0 {
  z-index: 50;
}

.bg-white {
  z-index: 51;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>