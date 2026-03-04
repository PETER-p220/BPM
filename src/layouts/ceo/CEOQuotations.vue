<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-['DM_Sans',sans-serif]">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Quotation Management</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Review and approve price schedules</p>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm">
              <span class="text-slate-500 dark:text-slate-400">Total:</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ quotations.length }}</span>
            </div>
            <button @click="exportData" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <!-- Filter Tabs -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-1">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
              activeTab === tab.value
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.count > 0" class="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search and Actions -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search quotations..."
            class="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="approveSelected"
            :disabled="selectedQuotations.length === 0"
            class="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Approve Selected ({{ selectedQuotations.length }})
          </button>
          
          <button
            @click="rejectSelected"
            :disabled="selectedQuotations.length === 0"
            class="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject Selected ({{ selectedQuotations.length }})
          </button>
        </div>
      </div>

      <!-- Quotations Table -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th class="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    :checked="selectedQuotations.length === filteredQuotations.length && filteredQuotations.length > 0"
                    class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quotation</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Submitted By</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Total Investment</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Profit</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="quotation in paginatedQuotations" :key="quotation.tender_id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4">
                  <input
                    type="checkbox"
                    v-model="selectedQuotations"
                    :value="quotation.tender_id"
                    class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 dark:text-white">{{ quotation.tender?.title }}</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">{{ quotation.items?.length || 0 }} items</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {{ (quotation.user?.name || '?')[0]?.toUpperCase() }}
                    </div>
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ quotation.user?.name || '—' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(quotation.total_investment) }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span :class="quotation.projected_profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-semibold">
                      {{ formatCurrency(quotation.projected_profit) }}
                    </span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ quotation.projected_profit_percentage }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(quotation.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClasses(quotation.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ quotation.status?.toUpperCase() || 'PENDING' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="viewQuotation(quotation)" class="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="quotation.status === 'pending'"
                      @click="approveQuotation(quotation)"
                      class="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="quotation.status === 'pending'"
                      @click="rejectQuotation(quotation)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredQuotations.length) }} of {{ filteredQuotations.length }} results
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span class="px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approval Modal -->
    <div v-if="showApprovalModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
          {{ modalMode === 'approve' ? 'Approve Quotation' : 'Reject Quotation' }}
        </h3>
        
        <div v-if="modalMode === 'reject'" class="mb-4">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason for Rejection</label>
          <textarea
            v-model="rejectionReason"
            rows="4"
            placeholder="Please provide a reason for rejection..."
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>
        
        <div class="flex gap-3">
          <button @click="closeModal" class="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
            Cancel
          </button>
          <button
            @click="confirmAction"
            :disabled="modalMode === 'reject' && !rejectionReason.trim()"
            class="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            :class="modalMode === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
          >
            {{ modalMode === 'approve' ? 'Approve' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const quotations = ref([]);
const selectedQuotations = ref([]);
const searchQuery = ref('');
const activeTab = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// Modal state
const showApprovalModal = ref(false);
const modalMode = ref('approve');
const rejectionReason = ref('');
const selectedQuotation = ref(null);

const statusTabs = computed(() => [
  { label: 'All Quotations', value: 'all', count: quotations.value.length },
  { label: 'Pending', value: 'pending', count: quotations.value.filter(q => q.status === 'pending').length },
  { label: 'Approved', value: 'approved', count: quotations.value.filter(q => ['approved', 'passed'].includes(q.status)).length },
  { label: 'Rejected', value: 'rejected', count: quotations.value.filter(q => q.status === 'rejected').length }
]);

const filteredQuotations = computed(() => {
  let filtered = quotations.value;
  
  // Filter by status
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(q => q.status === activeTab.value || (activeTab.value === 'approved' && q.status === 'passed'));
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(q => 
      q.tender?.title?.toLowerCase().includes(query) ||
      q.user?.name?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredQuotations.value.length / itemsPerPage));

const paginatedQuotations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredQuotations.value.slice(start, start + itemsPerPage);
});

onMounted(async () => {
  await fetchQuotations();
});

async function fetchQuotations() {
  try {
    const response = await axios.get('/api/price-shedules');
    quotations.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching quotations:', error);
    toast.error('Failed to load quotations');
  }
}

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'passed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatCurrency(value) {
  if (!value) return 'TZS 0';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function toggleSelectAll() {
  if (selectedQuotations.value.length === filteredQuotations.value.length) {
    selectedQuotations.value = [];
  } else {
    selectedQuotations.value = filteredQuotations.value.map(q => q.tender_id);
  }
}

function viewQuotation(quotation) {
  // Navigate to quotation details
  window.open(`/admin/manage-schedule?view=${quotation.tender_id}`, '_blank');
}

function approveQuotation(quotation) {
  selectedQuotation.value = quotation;
  modalMode.value = 'approve';
  showApprovalModal.value = true;
}

function rejectQuotation(quotation) {
  selectedQuotation.value = quotation;
  modalMode.value = 'reject';
  rejectionReason.value = '';
  showApprovalModal.value = true;
}

function approveSelected() {
  if (selectedQuotations.value.length === 0) return;
  modalMode.value = 'approve';
  selectedQuotation.value = null;
  showApprovalModal.value = true;
}

function rejectSelected() {
  if (selectedQuotations.value.length === 0) return;
  modalMode.value = 'reject';
  selectedQuotation.value = null;
  rejectionReason.value = '';
  showApprovalModal.value = true;
}

async function confirmAction() {
  try {
    const quotationIds = selectedQuotation.value ? [selectedQuotation.value.tender_id] : selectedQuotations.value;
    const payload = {
      tender_ids: quotationIds,
      status: modalMode.value,
      reason: modalMode.value === 'reject' ? rejectionReason.value : null
    };

    const response = await axios.post('/api/ceo/quotation-approval', payload);
    
    if (response.data.status) {
      toast.success(`Quotation(s) ${modalMode.value}d successfully`);
      await fetchQuotations();
      closeModal();
    }
  } catch (error) {
    console.error('Error approving/rejecting quotation:', error);
    toast.error('Failed to process approval');
  }
}

function closeModal() {
  showApprovalModal.value = false;
  selectedQuotation.value = null;
  rejectionReason.value = '';
}

function exportData() {
  // Export functionality
  const data = filteredQuotations.value.map(q => ({
    'Tender Title': q.tender?.title,
    'Submitted By': q.user?.name,
    'Total Investment': q.total_investment,
    'Projected Profit': q.projected_profit,
    'Profit %': q.projected_profit_percentage,
    'Status': q.status,
    'Submitted Date': q.created_at,
    'Items Count': q.items?.length || 0
  }));
  
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quotations_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
</script>
