<template>
  <div class="p-4 py-5 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
    <PageHeader subtitle="Analyses">
      <div class="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
        <router-link to="/create/analysis" class="self-end sm:self-auto">
          <BaseButton style="background-color: #0d4063;" class="w-full sm:w-auto">
            Create New Analysis
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>
      </div>
    </PageHeader>

    <div class="flex items-center mb-4">
      <input
        type="text"
        v-model="filter"
        placeholder="Search by Project Name..."
        class="w-full p-2 border rounded sm:w-auto"
      />
    </div>

    <!-- Full-Width Container -->
    <div class="space-y-4">
      <div
        v-for="project in filteredProjects"
        :key="project.project_id"
        class="w-full p-4 bg-white rounded-lg shadow-lg"
      >
        <h3 class="mb-2 text-lg font-semibold text-gray-800">Project: {{ project.project.project_name }}</h3>
        <!-- Update Analysis Form -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <input
            type="file"
            :id="'excel_file_' + project.project_id"
            accept=".xlsx,.xls"
            @change="handleFileChange($event, project.project_id)"
            class="w-full sm:w-auto border border-gray-300 rounded-md p-2"
          />
          <BaseButton
            style="background-color: #0d4063;"
            class="w-full sm:w-auto mt-2 sm:mt-0"
            @click="updateAnalysis(project.project_id)"
            :disabled="uploadingProjectId === project.project_id"
          >
            {{ uploadingProjectId === project.project_id ? 'Uploading...' : 'Update Analysis' }}
            <span class="ml-2" aria-hidden="true"><i class="fas fa-upload"></i></span>
          </BaseButton>
        </div>
        <p class="text-sm text-gray-600">Project Manager: {{ project.user?.name || 'N/A' }}</p>
        <p class="text-sm text-gray-600">Created: {{ formatDate(project.created_at) }}</p>
        <div class="mt-2">
          <span
            :class="statusButtonClass(project.status)"
            class="inline-block px-3 py-1 text-sm font-medium rounded-full"
          >
            {{ project.status }}
          </span>
          <p v-if="project.status === 'rejected' && project.reason_for_reject" class="mt-1 text-sm text-red-600">
            Reason: {{ project.reason_for_reject }}
          </p>
        </div>

        <!-- Project-Level Totals -->
        <div class="mt-2 text-sm text-gray-700">
          <p><strong>Total Amount(VAT Excl):</strong> {{ formatCurrency(project.total_amount_vat_excl) }}</p>
          <p><strong>Total Amount(VAT Incl):</strong> {{ formatCurrency(project.total_amount_vat_incl) }}</p>
          <p><strong>Amount Needed:</strong> {{ formatCurrency(project.total_amount_needed) }}</p>
          <p><strong>Site Contingency:</strong> {{ formatCurrency(project.site_contingency) }}</p>
          <p><strong>Total Investment:</strong> {{ formatCurrency(project.total_investment) }}</p>
          <p><strong>Projected Profit:</strong> {{ formatCurrency(project.projected_profit) }} ({{ project.projected_profit_percentage }}%)</p>
        </div>

        <!-- Analysis Details with Grouped Headings -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700">Analysis Items</h4>
          <div class="mt-2 overflow-x-auto">
            <div class="flex flex-col">
              <!-- Grouped Headings -->
              <div class="flex space-x-2 text-sm font-semibold text-gray-600 bg-gray-100 p-2 rounded-t">
                <span class="w-10 flex-shrink-0"></span> <!-- S/N -->
                <span class="w-80 flex-shrink-0"></span> <!-- Description -->
                <span class="w-20 flex-shrink-0 text-center whitespace-nowrap">QUOTED PRICES (VAT EXCL)</span>
                <span class="w-10 flex-shrink-0"></span> <!-- Unit -->
                <span class="w-24 flex-shrink-0"></span> <!-- Q. Rate -->
                <span class="w-28 flex-shrink-0"></span> <!-- Q. Amount -->
                <span class="w-20 flex-shrink-0 text-center whitespace-nowrap">BUYING PRICES (VAT INCL)</span>
                <span class="w-24 flex-shrink-0"></span> <!-- Rate -->
                <span class="w-28 flex-shrink-0"></span> <!-- Amount -->
                <span class="w-20 flex-shrink-0"></span> <!-- Source -->
                <span class="w-20 flex-shrink-0"></span> <!-- Urgent -->
              </div>
              <!-- Column Headings -->
              <div class="flex space-x-2 text-sm font-semibold text-gray-600 bg-gray-100 p-2">
                <span class="w-10 flex-shrink-0">S/N</span>
                <span class="w-80 flex-shrink-0">Description</span>
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
              <div v-for="item in project.items" :key="item.analysis_id" class="flex space-x-2 text-sm border-t pt-2">
                <span class="w-10 flex-shrink-0">{{ item.serial_number }}</span>
                <span class="w-80 flex-shrink-0 truncate">{{ item.item_description || 'N/A' }}</span>
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
        v-if="!filteredProjects.length"
        class="w-full p-4 text-center text-gray-500 bg-white rounded-lg shadow-lg"
      >
        No analyses found for the current filter.
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
        :disabled="currentPage * itemsPerPage >= allProjects.length"
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

const analyses = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const toast = useToast();
const selectedFiles = ref({}); // Store selected files per project
const uploadingProjectId = ref(null); // Track which project is uploading

onMounted(async () => {
  await fetchAnalyses();
});

async function fetchAnalyses() {
  try {
    const response = await axios.get('/api/user-analysis');
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      const groupedAnalyses = groupByProject(response.data.data);
      analyses.value = groupedAnalyses;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  }
}

function groupByProject(data) {
  const grouped = {};
  data.forEach(item => {
    const projectId = item.project_id;
    if (!grouped[projectId]) {
      grouped[projectId] = {
        project_id: projectId,
        project: item.project,
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

    if (item.total_amount_vat_excl && !grouped[projectId].total_amount_vat_excl) {
      grouped[projectId].total_amount_vat_excl = item.total_amount_vat_excl;
      grouped[projectId].total_amount_vat_incl = item.total_amount_vat_incl;
      grouped[projectId].total_amount_needed = item.total_amount_needed;
      grouped[projectId].site_contingency = item.site_contingency;
      grouped[projectId].total_investment = item.total_investment;
      grouped[projectId].projected_profit = item.projected_profit;
      grouped[projectId].projected_profit_percentage = item.projected_profit_percentage;
    }

    if (item.item_description || item.serial_number?.match(/^[A-M\s]+$/)) {
      grouped[projectId].items.push(item);
    }
  });

  return Object.values(grouped);
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
  if (status === 'approved') return 'bg-green-500 text-white';
  if (status === 'rejected') return 'bg-red-500 text-white';
  return 'bg-gray-500 text-white';
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
  if (page > 0 && page <= Math.ceil(allProjects.value.length / itemsPerPage)) {
    currentPage.value = page;
  }
}

function handleFileChange(event, projectId) {
  selectedFiles.value[projectId] = event.target.files[0];
}

async function updateAnalysis(projectId) {
  const excelFile = selectedFiles.value[projectId];
  if (!excelFile) {
    toast.error('Please select an Excel file');
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
      toast.success(`Successfully imported ${response.data.rows_imported} rows`);
      await fetchAnalyses(); // Refresh the project list
      selectedFiles.value[projectId] = null; // Clear the file input
      document.getElementById(`excel_file_${projectId}`).value = ''; // Reset file input
    } else {
      throw new Error(response.data.message || 'Failed to update analysis');
    }
  } catch (error) {
    handleError(error);
  } finally {
    uploadingProjectId.value = null;
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
</style>