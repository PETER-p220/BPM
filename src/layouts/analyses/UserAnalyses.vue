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

      <!-- Projects Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-white flex items-center gap-2">
              <i class="fas fa-table"></i>
              All Project Analyses
            </h2>
            <span class="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              {{ filteredProjects.length }} of {{ allProjects.length }} projects
            </span>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header" style="min-width:50px;">#</th>
                <th class="table-header" style="min-width:220px;">Project Name</th>
                <th class="table-header text-center" style="min-width:110px;">Status</th>
                <th class="table-header text-center" style="min-width:90px;">Items</th>
                <th class="table-header text-right" style="min-width:160px;">Total (VAT Excl)</th>
                <th class="table-header text-right" style="min-width:160px;">Total (VAT Incl)</th>
                <th class="table-header text-right" style="min-width:150px;">Projected Profit</th>
                <th class="table-header text-center" style="min-width:130px;">Created By</th>
                <th class="table-header text-center" style="min-width:120px;">Created Date</th>
                <th class="table-header text-center" style="min-width:100px;">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(project, index) in filteredProjects"
                :key="project.project_id"
                class="hover:bg-blue-50/40 transition-colors duration-150"
              >
                <td class="table-cell text-center text-gray-400 font-medium text-xs">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="table-cell">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-folder text-slate-500 text-sm"></i>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 leading-tight">{{ project.project?.project_name || 'N/A' }}</div>
                      <div v-if="project.tender" class="text-xs text-gray-400 mt-0.5">
                        <i class="fas fa-file-contract mr-1"></i>{{ project.tender.title || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="table-cell text-center">
                  <span :class="getStatusClass(project.status)" class="status-badge-sm">
                    <i :class="getStatusIcon(project.status)" class="mr-1"></i>
                    {{ project.status }}
                  </span>
                </td>
                <td class="table-cell text-center">
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {{ project.items?.length || 0 }}
                  </span>
                </td>
                <td class="table-cell text-right font-medium text-blue-700">
                  {{ formatCurrency(project.total_amount_vat_excl) }}
                </td>
                <td class="table-cell text-right font-medium text-green-700">
                  {{ formatCurrency(project.total_amount_vat_incl) }}
                </td>
                <td class="table-cell text-right">
                  <span :class="parseFloat(project.projected_profit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">
                    {{ formatCurrency(project.projected_profit) }}
                  </span>
                  <div v-if="project.projected_profit_percentage !== null" class="text-xs text-gray-400">
                    {{ parseFloat(project.projected_profit_percentage || 0).toFixed(2) }}%
                  </div>
                </td>
                <td class="table-cell text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-gray-500 text-xs"></i>
                    </div>
                    <span class="text-sm text-gray-700">{{ project.user?.name || 'N/A' }}</span>
                  </div>
                </td>
                <td class="table-cell text-center text-sm text-gray-600">
                  {{ formatDate(project.created_at) }}
                  <div v-if="project.updated_at && project.updated_at !== project.created_at" class="text-xs text-gray-400 mt-0.5">
                    <i class="fas fa-sync-alt mr-1"></i>{{ formatDate(project.updated_at) }}
                  </div>
                </td>
                <td class="table-cell text-center">
                  <button
                    @click="viewProjectDetails(project)"
                    class="view-btn group"
                    title="View full analysis"
                  >
                    <i class="fas fa-eye mr-1.5 group-hover:scale-110 transition-transform duration-150"></i>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!filteredProjects.length" class="p-12 text-center">
          <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No analyses found</h3>
          <p class="text-gray-500 mb-6">Try adjusting your search criteria or create a new analysis</p>
          <router-link to="/create/analysis">
            <button class="btn-primary">
              <i class="fas fa-plus mr-2"></i>Create New Analysis
            </button>
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="mt-6 flex items-center justify-center gap-2">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="pagination-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="flex items-center gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="['pagination-btn', currentPage === page ? 'pagination-btn-active' : '']"
          >{{ page }}</button>
        </div>
        <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)" class="pagination-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         FULL PROJECT DETAIL MODAL
    ══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showProjectModal && selectedProject"
          class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 backdrop-blur-sm"
          @click.self="closeProjectModal"
        >
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[88vh] flex flex-col overflow-hidden">

            <!-- Modal Sticky Header -->
            <div class="sticky top-0 z-10 bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex-shrink-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg font-semibold text-white truncate">
                    {{ selectedProject.project?.project_name }}
                  </h2>
                  <div class="flex flex-wrap gap-4 text-sm text-gray-300 mt-1">
                    <div class="flex items-center gap-1.5">
                      <i class="fas fa-user-circle"></i>
                      <span>{{ selectedProject.user?.name || 'N/A' }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <i class="fas fa-calendar-alt"></i>
                      <span>Created: {{ formatDate(selectedProject.created_at) }}</span>
                    </div>
                    <div v-if="selectedProject.updated_at && selectedProject.updated_at !== selectedProject.created_at" class="flex items-center gap-1.5">
                      <i class="fas fa-sync-alt"></i>
                      <span>Updated: {{ formatDate(selectedProject.updated_at) }}</span>
                    </div>
                    <div v-if="selectedProject.tender" class="flex items-center gap-1.5">
                      <i class="fas fa-file-contract"></i>
                      <span>{{ selectedProject.tender.title || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <span :class="getStatusClass(selectedProject.status)" class="status-badge">
                    <i :class="getStatusIcon(selectedProject.status)" class="mr-1"></i>
                    {{ selectedProject.status }}
                  </span>
                  <button
                    @click="closeProjectModal"
                    class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-150"
                    title="Close"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Rejection Reason -->
              <div
                v-if="selectedProject.status === 'rejected' && selectedProject.reason_for_reject"
                class="mt-3 bg-red-900/20 border border-red-400/30 rounded-lg p-3"
              >
                <p class="text-sm text-red-200">
                  <i class="fas fa-exclamation-circle mr-2"></i>
                  <strong>Rejection Reason:</strong> {{ selectedProject.reason_for_reject }}
                </p>
              </div>
            </div>

            <!-- Modal Scrollable Body -->
            <div class="overflow-y-auto flex-1 p-6 space-y-6">

              <!-- Update Analysis Section -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <i class="fas fa-upload mr-2"></i>
                  Update Analysis Data
                </h3>
                <div class="flex flex-col sm:flex-row gap-3">
                  <div class="flex-1">
                    <label :for="'modal_excel_' + selectedProject.project_id" class="file-upload-label">
                      <input
                        type="file"
                        :id="'modal_excel_' + selectedProject.project_id"
                        accept=".xlsx,.xls"
                        @change="handleFileChange($event, selectedProject.project_id)"
                        class="hidden"
                      />
                      <div class="flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fas fa-file-excel text-green-600"></i>
                        <span class="text-sm">
                          {{ selectedFiles[selectedProject.project_id]?.name || 'Choose Excel file...' }}
                        </span>
                      </div>
                    </label>
                  </div>
                  <button
                    @click="updateAnalysis(selectedProject.project_id)"
                    :disabled="uploadingProjectId === selectedProject.project_id || !selectedFiles[selectedProject.project_id]"
                    class="btn-secondary whitespace-nowrap"
                  >
                    <i :class="uploadingProjectId === selectedProject.project_id ? 'fas fa-spinner fa-spin' : 'fas fa-upload'" class="mr-2"></i>
                    {{ uploadingProjectId === selectedProject.project_id ? 'Uploading...' : 'Update Analysis' }}
                  </button>
                </div>
              </div>

              <!-- Financial Summary Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="summary-card">
                  <div class="summary-card-icon bg-blue-100 text-blue-600">
                    <i class="fas fa-file-invoice-dollar"></i>
                  </div>
                  <div>
                    <p class="summary-card-label">Total Amount (VAT Excl)</p>
                    <p class="summary-card-value">{{ formatCurrency(selectedProject.total_amount_vat_excl) }}</p>
                  </div>
                </div>
                <div class="summary-card">
                  <div class="summary-card-icon bg-green-100 text-green-600">
                    <i class="fas fa-receipt"></i>
                  </div>
                  <div>
                    <p class="summary-card-label">Total Amount (VAT Incl)</p>
                    <p class="summary-card-value">{{ formatCurrency(selectedProject.total_amount_vat_incl) }}</p>
                  </div>
                </div>
                <div class="summary-card">
                  <div class="summary-card-icon bg-purple-100 text-purple-600">
                    <i class="fas fa-money-bill-wave"></i>
                  </div>
                  <div>
                    <p class="summary-card-label">Amount Needed</p>
                    <p class="summary-card-value">{{ formatCurrency(selectedProject.total_amount_needed) }}</p>
                  </div>
                </div>
                <div class="summary-card">
                  <div class="summary-card-icon bg-orange-100 text-orange-600">
                    <i class="fas fa-exclamation-triangle"></i>
                  </div>
                  <div>
                    <p class="summary-card-label">Site Contingency</p>
                    <p class="summary-card-value">{{ formatCurrency(selectedProject.site_contingency) }}</p>
                  </div>
                </div>
                <div class="summary-card">
                  <div class="summary-card-icon bg-indigo-100 text-indigo-600">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <p class="summary-card-label">Total Investment</p>
                    <p class="summary-card-value">{{ formatCurrency(selectedProject.total_investment) }}</p>
                  </div>
                </div>
                <div class="summary-card">
                  <div class="summary-card-icon bg-emerald-100 text-emerald-600">
                    <i class="fas fa-hand-holding-usd"></i>
                  </div>
                  <div>
                    <p class="summary-card-label">Projected Profit</p>
                    <p class="summary-card-value">
                      <span :class="selectedProject.projected_profit >= 0 ? 'text-emerald-600' : 'text-red-600'">
                        {{ formatCurrency(selectedProject.projected_profit) }}
                      </span>
                      <span v-if="selectedProject.projected_profit_percentage !== null" class="text-sm font-normal text-gray-500 ml-1">
                        ({{ parseFloat(selectedProject.projected_profit_percentage || 0).toFixed(2) }}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Analysis Items Table -->
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i class="fas fa-list"></i>
                    Analysis Items
                  </h3>
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ selectedProject.items.length }} items
                  </span>
                </div>

                <div v-if="selectedProject.items.length > 0" class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                      <tr>
                        <th class="table-header" style="min-width:60px;">S/N</th>
                        <th class="table-header" style="min-width:250px;">Description</th>
                        <th class="table-header text-center" colspan="4">
                          <div class="text-xs font-semibold text-blue-700 mb-1">QUOTED PRICES (VAT EXCL)</div>
                        </th>
                        <th class="table-header text-center" colspan="3">
                          <div class="text-xs font-semibold text-green-700 mb-1">BUYING PRICES (VAT INCL)</div>
                        </th>
                        <th class="table-header" style="min-width:120px;">Source</th>
                        <th class="table-header" style="min-width:100px;">Status</th>
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
                        v-for="item in selectedProject.items"
                        :key="item.analysis_id"
                        class="hover:bg-gray-50 transition-colors"
                        :class="item.serial_number === 'No' ? 'bg-blue-50/50 font-medium border-t-2 border-blue-200' : ''"
                      >
                        <td class="table-cell text-center font-medium" :class="item.serial_number === 'No' ? 'text-blue-900' : 'text-gray-900'">
                          {{ item.serial_number || '-' }}
                        </td>
                        <td class="table-cell" :class="item.serial_number === 'No' ? 'font-semibold text-blue-900' : ''">
                          <div class="max-w-xs" :title="item.item_description">{{ item.item_description || 'N/A' }}</div>
                        </td>
                        <td class="table-cell text-right">{{ formatNumber(item.quoted_quantity) }}</td>
                        <td class="table-cell text-center">
                          <span v-if="item.quoted_unit" class="px-2 py-1 bg-gray-100 rounded text-xs">{{ item.quoted_unit }}</span>
                          <span v-else class="text-gray-400">-</span>
                        </td>
                        <td class="table-cell text-right">{{ formatCurrency(item.quoted_rate) }}</td>
                        <td class="table-cell text-right font-medium text-blue-700">{{ formatCurrency(item.quoted_amount) }}</td>
                        <td class="table-cell text-right">{{ formatNumber(item.quantity) }}</td>
                        <td class="table-cell text-right">{{ formatCurrency(item.rate) }}</td>
                        <td class="table-cell text-right font-medium text-green-700">{{ formatCurrency(item.amount) }}</td>
                        <td class="table-cell">
                          <span v-if="item.source" class="text-xs text-gray-600 truncate block max-w-[120px]" :title="item.source">{{ item.source }}</span>
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

                <div v-else class="p-8 text-center bg-gray-50">
                  <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                  <p class="text-gray-500 text-sm">No analysis items found for this project</p>
                </div>
              </div>

            </div><!-- end scrollable body -->
          </div>
        </div>
      </Transition>
    </Teleport>

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
const showProjectModal = ref(false);
const selectedProject = ref(null);

onMounted(async () => {
  await fetchAnalyses();
});

async function fetchAnalyses() {
  loading.value = true;
  try {
    const response = await axios.get('/api/user-analysis');
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      analyses.value = response.data.data;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
}

function viewProjectDetails(project) {
  selectedProject.value = project;
  showProjectModal.value = true;
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  showProjectModal.value = false;
  selectedProject.value = null;
  document.body.style.overflow = '';
}

const allProjects = computed(() =>
  analyses.value.filter(project =>
    project.project?.project_name?.toLowerCase().includes(filter.value.toLowerCase()) || !filter.value
  )
);

const filteredProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return allProjects.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(allProjects.value.length / itemsPerPage));

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'N/A';
  if (numValue === 0) return 'TZS 0.00';
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numValue);
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '-';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '-';
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(numValue);
}

function getStatusClass(status) {
  const classes = {
    pending:  'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300'
  };
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
}

function getStatusIcon(status) {
  const icons = { pending: 'fas fa-clock', approved: 'fas fa-check-circle', rejected: 'fas fa-times-circle' };
  return icons[status] || 'fas fa-question-circle';
}

function getUrgentStatusClass(status) {
  const classes = { urgent: 'bg-red-100 text-red-700', normal: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-700' };
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
  if (file) selectedFiles.value[projectId] = file;
}

async function updateAnalysis(projectId) {
  const excelFile = selectedFiles.value[projectId];
  if (!excelFile) { toast.error('Please select an Excel file'); return; }

  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  if (!validTypes.includes(excelFile.type)) { toast.error('Only Excel files (.xlsx or .xls) are allowed'); return; }
  if (excelFile.size > 10 * 1024 * 1024) { toast.error('File size must not exceed 10MB'); return; }

  uploadingProjectId.value = projectId;
  const formData = new FormData();
  formData.append('excel_file', excelFile);
  formData.append('project_id', projectId);

  try {
    const response = await axios.post('/api/analysis/update-from-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.status === 200) {
      toast.success(`Successfully updated analysis! ${response.data.rows_imported || 0} rows imported.`);
      await fetchAnalyses();
      selectedFiles.value[projectId] = null;
      const el = document.getElementById(`modal_excel_${projectId}`);
      if (el) el.value = '';
      // Refresh selectedProject data in modal
      if (selectedProject.value?.project_id === projectId) {
        selectedProject.value = analyses.value.find(p => p.project_id === projectId) || null;
      }
    } else {
      throw new Error(response.data.message || 'Failed to update analysis');
    }
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error('No existing analyses found for this project. Please create a new analysis first.');
    } else if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      toast.error(errors ? Object.values(errors).flat().join(', ') : 'Validation failed');
    } else {
      handleError(error);
    }
  } finally {
    uploadingProjectId.value = null;
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.view-btn {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 shadow-sm;
}

/* Status Badge full (modal header) */
.status-badge {
  @apply inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border shadow-sm;
}

/* Status Badge small (table rows) */
.status-badge-sm {
  @apply inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border;
}

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

.table-header {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider;
}

.table-subheader {
  @apply px-4 py-2 text-left text-xs font-medium text-gray-600;
}

.table-cell {
  @apply px-4 py-3 text-sm text-gray-900 whitespace-nowrap;
}

.file-upload-label {
  @apply block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer;
}

.urgent-badge {
  @apply inline-block px-2 py-1 text-xs font-medium rounded-full;
}

.pagination-btn {
  @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.pagination-btn-active {
  @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
}

.overflow-x-auto::-webkit-scrollbar { height: 8px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 4px; }
.overflow-x-auto::-webkit-scrollbar-track { background-color: #f7fafc; }

.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #cbd5e0; border-radius: 4px; }
.overflow-y-auto::-webkit-scrollbar-track { background-color: #f7fafc; }

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from { opacity: 0; }
.modal-leave-to  { opacity: 0; }
.modal-enter-from .bg-white { transform: scale(0.97) translateY(-8px); opacity: 0; }
.modal-leave-to  .bg-white  { transform: scale(0.97) translateY(-8px); opacity: 0; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bg-white { animation: fadeIn 0.3s ease-out; }
</style>