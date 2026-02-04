<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Project Analyses</h1>
            <p class="text-sm text-gray-600">Manage and track your project analysis submissions</p>
          </div>
          <router-link to="/create/analysis">
            <button class="btn-primary group">
              <span>Create New Analysis</span>
              <i class="fas fa-plus ml-2 group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by project name..."
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p class="text-gray-600">Loading analyses...</p>
        </div>
      </div>

      <!-- Projects List -->
      <div v-else class="space-y-6">
        <div
          v-for="project in filteredProjects"
          :key="project.project_id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <!-- Project Header -->
          <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-white mb-2">
                  {{ project.project.project_name }}
                </h2>
                <div class="flex flex-wrap gap-4 text-sm text-gray-200">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-user-circle"></i>
                    <span>{{ project.user?.name || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Created: {{ formatDate(project.created_at) }}</span>
                  </div>
                  <div v-if="project.updated_at && project.updated_at !== project.created_at" class="flex items-center gap-2">
                    <i class="fas fa-sync-alt"></i>
                    <span>Updated: {{ formatDate(project.updated_at) }}</span>
                  </div>
                  <div v-if="project.tender" class="flex items-center gap-2">
                    <i class="fas fa-file-contract"></i>
                    <span>Tender: {{ project.tender.title || 'N/A' }}</span>
                  </div>
                </div>
              </div>
              <div>
                <span :class="getStatusClass(project.status)" class="status-badge">
                  <i :class="getStatusIcon(project.status)" class="mr-1"></i>
                  {{ project.status }}
                </span>
              </div>
            </div>
            
            <!-- Rejection Reason -->
            <div v-if="project.status === 'rejected' && project.reason_for_reject" 
                 class="mt-3 bg-red-900/20 border border-red-400/30 rounded-lg p-3">
              <p class="text-sm text-red-200">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <strong>Rejection Reason:</strong> {{ project.reason_for_reject }}
              </p>
            </div>
          </div>

          <!-- Project Content -->
          <div class="p-6">
            <!-- Update Analysis Section -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <i class="fas fa-upload mr-2"></i>
                Update Analysis Data
              </h3>
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex-1">
                  <label :for="'excel_file_' + project.project_id" class="file-upload-label">
                    <input
                      type="file"
                      :id="'excel_file_' + project.project_id"
                      accept=".xlsx,.xls"
                      @change="handleFileChange($event, project.project_id)"
                      class="hidden"
                    />
                    <div class="flex items-center justify-center gap-2 cursor-pointer">
                      <i class="fas fa-file-excel text-green-600"></i>
                      <span class="text-sm">
                        {{ selectedFiles[project.project_id]?.name || 'Choose Excel file...' }}
                      </span>
                    </div>
                  </label>
                </div>
                <button
                  @click="updateAnalysis(project.project_id)"
                  :disabled="uploadingProjectId === project.project_id || !selectedFiles[project.project_id]"
                  class="btn-secondary whitespace-nowrap"
                >
                  <i :class="uploadingProjectId === project.project_id ? 'fas fa-spinner fa-spin' : 'fas fa-upload'" class="mr-2"></i>
                  {{ uploadingProjectId === project.project_id ? 'Uploading...' : 'Update Analysis' }}
                </button>
              </div>
            </div>

            <!-- Financial Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div class="summary-card">
                <div class="summary-card-icon bg-blue-100 text-blue-600">
                  <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <div>
                  <p class="summary-card-label">Total Amount (VAT Excl)</p>
                  <p class="summary-card-value">{{ formatCurrency(project.total_amount_vat_excl) }}</p>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-card-icon bg-green-100 text-green-600">
                  <i class="fas fa-receipt"></i>
                </div>
                <div>
                  <p class="summary-card-label">Total Amount (VAT Incl)</p>
                  <p class="summary-card-value">{{ formatCurrency(project.total_amount_vat_incl) }}</p>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-card-icon bg-purple-100 text-purple-600">
                  <i class="fas fa-money-bill-wave"></i>
                </div>
                <div>
                  <p class="summary-card-label">Amount Needed</p>
                  <p class="summary-card-value">{{ formatCurrency(project.total_amount_needed) }}</p>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-card-icon bg-orange-100 text-orange-600">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <p class="summary-card-label">Site Contingency</p>
                  <p class="summary-card-value">{{ formatCurrency(project.site_contingency) }}</p>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-card-icon bg-indigo-100 text-indigo-600">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div>
                  <p class="summary-card-label">Total Investment</p>
                  <p class="summary-card-value">{{ formatCurrency(project.total_investment) }}</p>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-card-icon bg-emerald-100 text-emerald-600">
                  <i class="fas fa-hand-holding-usd"></i>
                </div>
                <div>
                  <p class="summary-card-label">Projected Profit</p>
                  <p class="summary-card-value">
                    <span :class="project.projected_profit >= 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ formatCurrency(project.projected_profit) }}
                    </span>
                    <span v-if="project.projected_profit_percentage !== null" class="text-sm font-normal text-gray-500 ml-1">
                      ({{ parseFloat(project.projected_profit_percentage || 0).toFixed(2) }}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Analysis Items Table -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  <span>
                    <i class="fas fa-list mr-2"></i>
                    Analysis Items
                  </span>
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ project.items.length }} items
                  </span>
                </h3>
              </div>
              
              <div v-if="project.items.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="table-header" style="min-width: 60px;">S/N</th>
                      <th class="table-header" style="min-width: 250px;">Description</th>
                      <th class="table-header text-center" colspan="4">
                        <div class="text-xs font-semibold text-blue-700 mb-1">QUOTED PRICES (VAT EXCL)</div>
                      </th>
                      <th class="table-header text-center" colspan="3">
                        <div class="text-xs font-semibold text-green-700 mb-1">BUYING PRICES (VAT INCL)</div>
                      </th>
                      <th class="table-header" style="min-width: 120px;">Source</th>
                      <th class="table-header" style="min-width: 100px;">Status</th>
                    </tr>
                    <tr class="bg-gray-50">
                      <th class="table-subheader"></th>
                      <th class="table-subheader"></th>
                      <th class="table-subheader">Q. Qty</th>
                      <th class="table-subheader">Unit</th>
                      <th class="table-subheader">Q. Rate</th>
                      <th class="table-subheader">Q. Amount</th>
                      <th class="table-subheader">Qty</th>
                      <th class="table-subheader">Rate</th>
                      <th class="table-subheader">Amount</th>
                      <th class="table-subheader"></th>
                      <th class="table-subheader"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr 
                      v-for="item in project.items" 
                      :key="item.analysis_id" 
                      class="hover:bg-gray-50 transition-colors"
                      :class="item.serial_number === 'No' ? 'bg-blue-50/50 font-medium border-t-2 border-blue-200' : ''"
                    >
                      <td class="table-cell text-center font-medium" :class="item.serial_number === 'No' ? 'text-blue-900' : 'text-gray-900'">
                        {{ item.serial_number || '-' }}
                      </td>
                      <td class="table-cell" :class="item.serial_number === 'No' ? 'font-semibold text-blue-900' : ''">
                        <div class="max-w-xs" :title="item.item_description">
                          {{ item.item_description || 'N/A' }}
                        </div>
                      </td>
                      <td class="table-cell text-right">{{ formatNumber(item.quoted_quantity) }}</td>
                      <td class="table-cell text-center">
                        <span v-if="item.quoted_unit" class="px-2 py-1 bg-gray-100 rounded text-xs">
                          {{ item.quoted_unit }}
                        </span>
                        <span v-else class="text-gray-400">-</span>
                      </td>
                      <td class="table-cell text-right">{{ formatCurrency(item.quoted_rate) }}</td>
                      <td class="table-cell text-right font-medium text-blue-700">{{ formatCurrency(item.quoted_amount) }}</td>
                      <td class="table-cell text-right">{{ formatNumber(item.quantity) }}</td>
                      <td class="table-cell text-right">{{ formatCurrency(item.rate) }}</td>
                      <td class="table-cell text-right font-medium text-green-700">{{ formatCurrency(item.amount) }}</td>
                      <td class="table-cell">
                        <span v-if="item.source" class="text-xs text-gray-600 truncate block max-w-[120px]" :title="item.source">
                          {{ item.source }}
                        </span>
                        <span v-else class="text-gray-400">N/A</span>
                      </td>
                      <td class="table-cell text-center">
                        <span v-if="item.urgent_status" :class="getUrgentStatusClass(item.urgent_status)" class="urgent-badge">
                          {{ item.urgent_status }}
                        </span>
                        <span v-else class="text-gray-400 text-xs">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- No Items Message -->
              <div v-else class="p-8 text-center bg-gray-50">
                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500 text-sm">No analysis items found for this project</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!filteredProjects.length"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No analyses found</h3>
          <p class="text-gray-500 mb-6">Try adjusting your search criteria or create a new analysis</p>
          <router-link to="/create/analysis">
            <button class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Create New Analysis
            </button>
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="mt-6 flex items-center justify-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="flex items-center gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'pagination-btn',
              currentPage === page ? 'pagination-btn-active' : ''
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const analyses = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const toast = useToast();
const selectedFiles = ref({});
const uploadingProjectId = ref(null);
const loading = ref(true);

onMounted(async () => {
  await fetchAnalyses();
});

async function fetchAnalyses() {
  loading.value = true;
  try {
    const response = await axios.get('/api/user-analysis');
    console.log('API Response:', response.data); // Debug log
    
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      const groupedAnalyses = groupByProject(response.data.data);
      analyses.value = groupedAnalyses;
      console.log('Grouped Analyses:', groupedAnalyses); // Debug log
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
}

function groupByProject(data) {
  console.log('Raw data to group:', data); // Debug log
  
  const grouped = {};
  
  data.forEach(item => {
    const projectId = item.project_id;
    
    // Initialize project group if it doesn't exist
    if (!grouped[projectId]) {
      grouped[projectId] = {
        project_id: projectId,
        project: item.project || {},
        user: item.user || {},
        tender: item.tender || null,
        created_at: item.created_at,
        updated_at: item.updated_at,
        status: item.status || 'pending',
        reason_for_reject: item.reason_for_reject || null,
        // Financial fields - will be populated from first item with values
        total_amount_vat_excl: item.total_amount_vat_excl || null,
        total_amount_vat_incl: item.total_amount_vat_incl || null,
        total_amount_needed: item.total_amount_needed || null,
        site_contingency: item.site_contingency || null,
        total_investment: item.total_investment || null,
        projected_profit: item.projected_profit || null,
        projected_profit_percentage: item.projected_profit_percentage || null,
        items: []
      };
    }

    // Update financial totals if the current item has non-null values
    // This ensures we get the financial data even if it's not in the first item
    if (item.total_amount_vat_excl !== null && item.total_amount_vat_excl !== undefined) {
      grouped[projectId].total_amount_vat_excl = item.total_amount_vat_excl;
    }
    if (item.total_amount_vat_incl !== null && item.total_amount_vat_incl !== undefined) {
      grouped[projectId].total_amount_vat_incl = item.total_amount_vat_incl;
    }
    if (item.total_amount_needed !== null && item.total_amount_needed !== undefined) {
      grouped[projectId].total_amount_needed = item.total_amount_needed;
    }
    if (item.site_contingency !== null && item.site_contingency !== undefined) {
      grouped[projectId].site_contingency = item.site_contingency;
    }
    if (item.total_investment !== null && item.total_investment !== undefined) {
      grouped[projectId].total_investment = item.total_investment;
    }
    if (item.projected_profit !== null && item.projected_profit !== undefined) {
      grouped[projectId].projected_profit = item.projected_profit;
    }
    if (item.projected_profit_percentage !== null && item.projected_profit_percentage !== undefined) {
      grouped[projectId].projected_profit_percentage = item.projected_profit_percentage;
    }

    // Add ALL items to the items array
    // The serial_number might be "No", "1", "2", etc., so we include everything
    grouped[projectId].items.push({
      analysis_id: item.analysis_id,
      serial_number: item.serial_number,
      item_description: item.item_description,
      quoted_quantity: item.quoted_quantity,
      quoted_unit: item.quoted_unit,
      quoted_rate: item.quoted_rate,
      quoted_amount: item.quoted_amount,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      source: item.source,
      urgent_status: item.urgent_status
    });
  });

  // Convert grouped object to array and sort by most recent
  const result = Object.values(grouped).sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  console.log('Grouped result:', result); // Debug log
  
  return result;
}

const allProjects = computed(() =>
  analyses.value.filter(project =>
    project.project?.project_name?.toLowerCase().includes(filter.value.toLowerCase()) || !filter.value
  )
);

const filteredProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allProjects.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(allProjects.value.length / itemsPerPage));

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'N/A';
  
  if (numValue === 0) return 'TZS 0.00';
  
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '-';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '-';
  
  return new Intl.NumberFormat('en-TZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numValue);
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300'
  };
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
}

function getStatusIcon(status) {
  const icons = {
    pending: 'fas fa-clock',
    approved: 'fas fa-check-circle',
    rejected: 'fas fa-times-circle'
  };
  return icons[status] || 'fas fa-question-circle';
}

function getUrgentStatusClass(status) {
  const classes = {
    urgent: 'bg-red-100 text-red-700',
    normal: 'bg-blue-100 text-blue-700',
    low: 'bg-gray-100 text-gray-700'
  };
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-600';
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
    if (error.response.status === 422 && error.response.data.errors) {
      message += ': ' + Object.values(error.response.data.errors).flat().join(', ');
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handleFileChange(event, projectId) {
  const file = event.target.files[0];
  if (file) {
    selectedFiles.value[projectId] = file;
  }
}

async function updateAnalysis(projectId) {
  const excelFile = selectedFiles.value[projectId];
  if (!excelFile) {
    toast.error('Please select an Excel file');
    return;
  }

  // Validate file type
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!validTypes.includes(excelFile.type)) {
    toast.error('Only Excel files (.xlsx or .xls) are allowed');
    return;
  }

  // Validate file size (10MB)
  if (excelFile.size > 10 * 1024 * 1024) {
    toast.error('File size must not exceed 10MB');
    return;
  }

  uploadingProjectId.value = projectId;
  const formData = new FormData();
  formData.append('excel_file', excelFile);
  formData.append('project_id', projectId);

  try {
    const response = await axios.post('/api/analysis/update-from-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.status === 200) {
      toast.success(
        `Successfully updated analysis! ${response.data.rows_imported || 0} rows imported.`
      );
      
      // Refresh the analyses list
      await fetchAnalyses();
      
      // Clear the file input
      selectedFiles.value[projectId] = null;
      const fileInputElement = document.getElementById(`excel_file_${projectId}`);
      if (fileInputElement) {
        fileInputElement.value = '';
      }
    } else {
      throw new Error(response.data.message || 'Failed to update analysis');
    }
  } catch (error) {
    // Handle specific error cases from backend
    if (error.response?.status === 404) {
      toast.error('No existing analyses found for this project. Please create a new analysis first.');
    } else if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const errorMessages = errors ? Object.values(errors).flat().join(', ') : 'Validation failed';
      toast.error(errorMessages);
    } else {
      handleError(error);
    }
  } finally {
    uploadingProjectId.value = null;
  }
}
</script>

<style scoped>
/* Button Styles */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Status Badge */
.status-badge {
  @apply inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full border shadow-sm;
}

/* Summary Cards */
.summary-card {
  @apply flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200;
}

.summary-card-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0;
}

.summary-card-label {
  @apply text-xs font-medium text-gray-600 uppercase tracking-wide mb-1;
}

.summary-card-value {
  @apply text-lg font-bold text-gray-900;
}

/* Table Styles */
.table-header {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider;
}

.table-subheader {
  @apply px-4 py-2 text-left text-xs font-medium text-gray-600;
}

.table-cell {
  @apply px-4 py-3 text-sm text-gray-900 whitespace-nowrap;
}

/* File Upload */
.file-upload-label {
  @apply block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer;
}

/* Urgent Status Badge */
.urgent-badge {
  @apply inline-block px-2 py-1 text-xs font-medium rounded-full;
}

/* Pagination */
.pagination-btn {
  @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.pagination-btn-active {
  @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
}

/* Scrollbar Styling */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #f7fafc;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.3s ease-out;
}
</style>