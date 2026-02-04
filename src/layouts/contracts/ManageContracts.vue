<template>
  <div class="min-h-screen p-6 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="mx-auto max-w-7xl">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Contracts Management</h1>
            <p class="mt-1 text-sm text-gray-600">Manage and track all your contracts in one place</p>
          </div>
          <router-link to="/register-contract">
            <button 
              class="inline-flex items-center gap-2 px-6 py-3 text-white transition-all rounded-lg shadow-sm hover:shadow-md hover:opacity-90"
              style="background-color: #2e4053;"
            >
              <i class="fas fa-plus"></i>
              <span class="font-medium">Create New Contract</span>
            </button>
          </router-link>
        </div>
      </div>

      <!-- Filters and Actions Bar -->
      <div class="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search Input -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i class="text-gray-400 fas fa-search"></i>
              </div>
              <input
                type="text"
                v-model="filter"
                placeholder="Search contracts by title, category, or status..."
                class="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button 
              @click="exportToExcel" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Export to Excel"
            >
              <i class="text-green-600 fas fa-file-excel"></i>
              <span class="hidden sm:inline">Export Excel</span>
            </button>

            <button 
              @click="exportToPDF" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Export to PDF"
            >
              <i class="text-red-600 fas fa-file-pdf"></i>
              <span class="hidden sm:inline">Export PDF</span>
            </button>

            <button 
              @click="fetchContracts" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Showing <strong>{{ filteredContracts.length }}</strong> of <strong>{{ contracts.length }}</strong> contracts
          </span>
          <span v-if="filter" class="text-blue-600">
            <i class="fas fa-filter"></i> Filter active
          </span>
        </div>
      </div>

      <!-- Contracts Table -->
      <div class="overflow-hidden bg-white rounded-lg shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Contract Title
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Timeline
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Guarantee
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="11" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-4xl text-gray-400 fas fa-spinner fa-spin"></i>
                    <p class="text-gray-600">Loading contracts...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredContracts.length === 0">
                <td colspan="11" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-5xl text-gray-300 fas fa-folder-open"></i>
                    <p class="text-lg font-medium text-gray-900">No contracts found</p>
                    <p class="text-sm text-gray-600">
                      {{ filter ? 'Try adjusting your search criteria' : 'Get started by creating your first contract' }}
                    </p>
                    <router-link 
                      v-if="!filter" 
                      to="/register-contract"
                      class="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition-all rounded-lg shadow-sm hover:opacity-90"
                      style="background-color: #2e4053;"
                    >
                      <i class="fas fa-plus"></i>
                      Create New Contract
                    </router-link>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr 
                v-else
                v-for="(contract, index) in filteredContracts" 
                :key="contract.contract_id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="font-medium">{{ contract.title }}</div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      {{ getInitials(contract.user?.name) }}
                    </div>
                    <span>{{ contract.user?.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="getTimelineBadgeClass(contract.time_line_category)">
                    <i class="fas fa-clock"></i>
                    {{ formatTimelineCategory(contract.time_line_category) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {{ formatDate(contract.start_date) }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {{ formatDate(contract.end_date) }}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <span 
                    class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeClass(contract.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(contract.status)"></span>
                    {{ formatStatus(contract.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {{ contract.performance_guarantee }}%
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <button
                    v-if="contract.pdf_file"
                    @click="downloadFile(contract.pdf_file)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <i class="fas fa-file-pdf"></i>
                    View PDF
                  </button>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {{ formatDate(contract.created_at) }}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editContract(contract.contract_id)"
                      class="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      title="Edit Contract"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="deleteContract(contract.contract_id)"
                      class="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete Contract"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-4 text-xs text-center text-gray-500">
        Last updated: {{ lastUpdated }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const contracts = ref([]);
const filter = ref('');
const isLoading = ref(false);
const lastUpdated = ref('');

onMounted(async () => {
  await fetchContracts();
});

async function fetchContracts() {
  isLoading.value = true;
  try {
    const response = await axios.get('api/contracts');
    contracts.value = response.data.data.map(contract => ({
      contract_id: contract.contract_id,
      title: contract.title || 'N/A',
      user: contract.user || { name: 'N/A' },
      time_line_category: contract.time_line_category || 'N/A',
      start_date: contract.start_date || 'N/A',
      end_date: contract.end_date || 'N/A',
      status: contract.status || 'N/A',
      performance_guarantee: contract.performance_guarantee || 'N/A',
      pdf_file: contract.pdf_file || null,
      created_at: contract.created_at || 'N/A'
    }));
    updateLastUpdated();
    toast.success('Contracts loaded successfully');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function editContract(contractId) {
  router.push({ name: 'EditContract', params: { contract_id: contractId } });
}

async function deleteContract(contractId) {
  if (confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
    try {
      const response = await axios.delete(`api/contracts/${contractId}`);
      toast.success(response.data.message || 'Contract deleted successfully');
      await fetchContracts();
    } catch (error) {
      handleError(error);
    }
  }
}

const filteredContracts = computed(() => {
  if (!filter.value) return contracts.value;
  
  const searchTerm = filter.value.toLowerCase();
  return contracts.value.filter(contract =>
    contract.title.toLowerCase().includes(searchTerm) ||
    contract.time_line_category.toLowerCase().includes(searchTerm) ||
    contract.status.toLowerCase().includes(searchTerm) ||
    (contract.user?.name || '').toLowerCase().includes(searchTerm)
  );
});

// Utility Functions
function getInitials(name) {
  if (!name || name === 'N/A') return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date) {
  if (!date || date === 'N/A') return '—';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

function formatTimelineCategory(category) {
  if (!category || category === 'N/A') return 'N/A';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatStatus(status) {
  if (!status || status === 'N/A') return 'N/A';
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getTimelineBadgeClass(category) {
  const classes = {
    'short-term': 'bg-purple-100 text-purple-700',
    'long-term': 'bg-indigo-100 text-indigo-700'
  };
  return classes[category] || 'bg-gray-100 text-gray-700';
}

function getStatusBadgeClass(status) {
  const classes = {
    'on-progress': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'ended': 'bg-green-100 text-green-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function getStatusDotClass(status) {
  const classes = {
    'on-progress': 'bg-yellow-500',
    'cancelled': 'bg-red-500',
    'ended': 'bg-green-500'
  };
  return classes[status] || 'bg-gray-500';
}

function updateLastUpdated() {
  const now = new Date();
  lastUpdated.value = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function handleError(error) {
  let message = 'An unexpected error occurred. Please try again.';
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    message = Object.values(errors).flat().join(' ');
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
  console.error('Error:', error);
}

// Export Functions
function exportToExcel() {
  try {
    const data = filteredContracts.value.map((contract, index) => ({
      'No': index + 1,
      'Contract Title': contract.title,
      'Created By': contract.user?.name || 'N/A',
      'Timeline Category': formatTimelineCategory(contract.time_line_category),
      'Start Date': formatDate(contract.start_date),
      'End Date': formatDate(contract.end_date),
      'Status': formatStatus(contract.status),
      'Performance Guarantee': `${contract.performance_guarantee}%`,
      'PDF File': contract.pdf_file ? 'Available' : 'N/A',
      'Created At': formatDate(contract.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contracts');
    
    // Auto-size columns
    const maxWidth = 50;
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.min(
        maxWidth,
        Math.max(
          key.length,
          ...data.map(row => String(row[key] || '').length)
        )
      )
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `Contracts_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel file exported successfully');
  } catch (error) {
    handleError(error);
  }
}

function exportToPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 55, 71);
    doc.text('Contracts Report', 14, 15);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const tableData = filteredContracts.value.map((contract, index) => [
      index + 1,
      contract.title,
      contract.user?.name || 'N/A',
      formatTimelineCategory(contract.time_line_category),
      formatDate(contract.start_date),
      formatDate(contract.end_date),
      formatStatus(contract.status),
      `${contract.performance_guarantee}%`,
      formatDate(contract.created_at)
    ]);

    autoTable(doc, {
      startY: 28,
      head: [[
        '#',
        'Contract Title',
        'Created By',
        'Timeline',
        'Start Date',
        'End Date',
        'Status',
        'Guarantee',
        'Created At'
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [40, 55, 71],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20, halign: 'center' },
        8: { cellWidth: 25 }
      },
      margin: { top: 28 }
    });

    doc.save(`Contracts_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF file exported successfully');
  } catch (error) {
    handleError(error);
  }
}

function downloadFile(fileUrl) {
  try {
    window.open(fileUrl, '_blank');
  } catch (error) {
    handleError(error);
    toast.error('Failed to open PDF file');
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: fadeIn 0.3s ease-out;
}

/* Smooth transitions */
button, a, input {
  transition: all 0.2s ease-in-out;
}

/* Table row hover effect */
tbody tr {
  transition: background-color 0.15s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>