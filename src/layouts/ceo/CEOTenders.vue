<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-['DM_Sans',sans-serif]">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Tender Management</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Review and approve all tenders</p>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm">
              <span class="text-slate-500 dark:text-slate-400">Total:</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ tenders.length }}</span>
            </div>
            <button @click="exportData" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2">
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
                ? 'bg-indigo-600 text-white shadow-sm'
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
            placeholder="Search tenders..."
            class="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="approveSelected"
            :disabled="selectedTenders.length === 0"
            class="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Approve Selected ({{ selectedTenders.length }})
          </button>
          <button
            @click="rejectSelected"
            :disabled="selectedTenders.length === 0"
            class="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject Selected ({{ selectedTenders.length }})
          </button>
        </div>
      </div>

      <!-- Tenders Table -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th class="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    :checked="selectedTenders.length === filteredTenders.length && filteredTenders.length > 0"
                    class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tender</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Value</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Deadline</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="tender in paginatedTenders" :key="tender.tender_id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4">
                  <input
                    type="checkbox"
                    v-model="selectedTenders"
                    :value="tender.tender_id"
                    class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 dark:text-white">{{ tender.title }}</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">{{ tender.tender_number }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                    {{ tender.tender_type || 'General' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(tender.value) }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(tender.created_at) }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(tender.bid_submission) }}
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClasses(tender.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ tender.status?.toUpperCase() || 'PENDING' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="viewTender(tender)" class="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="tender.status === 'pending'"
                      @click="approveTender(tender)"
                      class="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="tender.status === 'pending'"
                      @click="rejectTender(tender)"
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
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }} of {{ filteredTenders.length }} results
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
          {{ modalMode === 'approve' ? 'Approve Tender' : 'Reject Tender' }}
        </h3>
        
        <div v-if="modalMode === 'reject'" class="mb-4">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reason for Rejection</label>
          <textarea
            v-model="rejectionReason"
            rows="4"
            placeholder="Please provide a reason for rejection..."
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
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

    <!-- Tender Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 rounded-t-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Tender Details</h3>
            <button @click="closeDetailsModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div v-if="selectedTender" class="p-6 space-y-6">
          <!-- Tender Information -->
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tender Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Tender Number</span>
                <p class="text-sm text-slate-900 dark:text-white font-medium">{{ selectedTender.tender_number || '—' }}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Title</span>
                <p class="text-sm text-slate-900 dark:text-white font-medium">{{ selectedTender.title || '—' }}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Type</span>
                <p class="text-sm text-slate-900 dark:text-white font-medium">{{ selectedTender.tender_type || 'General' }}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Value</span>
                <p class="text-sm text-slate-900 dark:text-white font-medium">{{ formatCurrency(selectedTender.value) }}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Status</span>
                <div class="mt-1">
                  <span :class="getStatusClasses(selectedTender.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ selectedTender.status?.toUpperCase() || 'PENDING' }}
                  </span>
                </div>
              </div>
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Submitted Date</span>
                <p class="text-sm text-slate-900 dark:text-white font-medium">{{ formatDate(selectedTender.created_at) }}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Submission Deadline</span>
                <p class="text-sm text-slate-900 dark:text-white font-medium">{{ formatDate(selectedTender.bid_submission) }}</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedTender.description" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Description</h4>
            <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{{ selectedTender.description }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              v-if="selectedTender.status === 'pending'"
              @click="approveTender(selectedTender); closeDetailsModal()"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Approve Tender
            </button>
            <button
              v-if="selectedTender.status === 'pending'"
              @click="rejectTender(selectedTender); closeDetailsModal()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject Tender
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

const toast = useToast();

const tenders = ref([]);
const selectedTenders = ref([]);
const searchQuery = ref('');
const activeTab = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// Modal state
const showApprovalModal = ref(false);
const modalMode = ref('approve');
const rejectionReason = ref('');
const selectedTender = ref(null);
const showDetailsModal = ref(false);

const statusTabs = computed(() => [
  { label: 'All Tenders', value: 'all', count: tenders.value.length },
  { label: 'Pending', value: 'pending', count: tenders.value.filter(t => t.status === 'pending').length },
  { label: 'Approved', value: 'approved', count: tenders.value.filter(t => t.status === 'approved').length },
  { label: 'Rejected', value: 'rejected', count: tenders.value.filter(t => t.status === 'rejected').length }
]);

const filteredTenders = computed(() => {
  let filtered = tenders.value;
  
  // Filter by status
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(t => t.status === activeTab.value);
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.title?.toLowerCase().includes(query) ||
      t.tender_number?.toLowerCase().includes(query) ||
      t.tender_type?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredTenders.value.length / itemsPerPage));

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTenders.value.slice(start, start + itemsPerPage);
});

onMounted(async () => {
  await fetchTenders();
});

async function fetchTenders() {
  try {
    const response = await axios.get('/api/tenders');
    tenders.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching tenders:', error);
    toast.error('Failed to load tenders');
  }
}

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
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
  if (selectedTenders.value.length === filteredTenders.value.length) {
    selectedTenders.value = [];
  } else {
    selectedTenders.value = filteredTenders.value.map(t => t.tender_id);
  }
}

function viewTender(tender) {
  selectedTender.value = tender;
  showDetailsModal.value = true;
}

function approveTender(tender) {
  selectedTender.value = tender;
  modalMode.value = 'approve';
  showApprovalModal.value = true;
}

function rejectTender(tender) {
  selectedTender.value = tender;
  modalMode.value = 'reject';
  rejectionReason.value = '';
  showApprovalModal.value = true;
}

function approveSelected() {
  if (selectedTenders.value.length === 0) return;
  modalMode.value = 'approve';
  selectedTender.value = null;
  showApprovalModal.value = true;
}

function rejectSelected() {
  if (selectedTenders.value.length === 0) return;
  modalMode.value = 'reject';
  selectedTender.value = null;
  rejectionReason.value = '';
  showApprovalModal.value = true;
}

async function confirmAction() {
  try {
    const tenderIds = selectedTender.value ? [selectedTender.value.tender_id] : selectedTenders.value;
    const payload = {
      tender_ids: tenderIds,
      status: modalMode.value,
      reason: modalMode.value === 'reject' ? rejectionReason.value : null
    };

    const response = await axios.post('/api/ceo/tender-approval', payload);
    
    if (response.data.status) {
      toast.success(`Tender(s) ${modalMode.value}d successfully`);
      await fetchTenders();
      closeModal();
    }
  } catch (error) {
    console.error('Error approving/rejecting tender:', error);
    toast.error('Failed to process approval');
  }
}

function closeModal() {
  showApprovalModal.value = false;
  selectedTender.value = null;
  rejectionReason.value = '';
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  selectedTender.value = null;
}

function exportData() {
  // Export functionality
  const data = filteredTenders.value.map(t => ({
    'Tender Number': t.tender_number,
    'Title': t.title,
    'Type': t.tender_type,
    'Value': t.value,
    'Status': t.status,
    'Created Date': t.created_at,
    'Deadline': t.bid_submission
  }));
  
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tenders_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
</script>
