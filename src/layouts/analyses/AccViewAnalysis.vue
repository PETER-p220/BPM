<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8" style="font-family: 'cygre', serif;">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Project Analyses</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review and manage project cost analyses
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">{{ allProjects.length }}</span> project{{ allProjects.length !== 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            v-model="filter"
            placeholder="Search by project name..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <!-- Projects List -->
      <div class="space-y-6">
        <div
          v-for="project in filteredProjects"
          :key="project.project_id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <!-- Project Header -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-750 p-6 border-b border-gray-200 dark:border-gray-600">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-start gap-3">
                  <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-project-diagram text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ project.project.project_name }}
                    </h3>
                    <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div class="flex items-center gap-1">
                        <i class="fas fa-user text-gray-400"></i>
                        <span>{{ project.user?.name || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <i class="fas fa-calendar text-gray-400"></i>
                        <span>{{ formatDate(project.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Badge -->
              <div>
                <span
                  :class="statusBadgeClass(project.status)"
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <i :class="statusIcon(project.status)" class="mr-2"></i>
                  {{ project.status.charAt(0).toUpperCase() + project.status.slice(1) }}
                </span>
                <p v-if="project.status === 'rejected' && project.reason_for_reject" 
                   class="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  <i class="fas fa-info-circle mr-1"></i>
                  <strong>Reason:</strong> {{ project.reason_for_reject }}
                </p>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="p-6 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <i class="fas fa-chart-line mr-2 text-blue-500"></i>
              Financial Summary
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount (VAT Excl)</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(project.total_amount_vat_excl) }}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount (VAT Incl)</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(project.total_amount_vat_incl) }}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount Needed</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(project.total_amount_needed) }}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Site Contingency</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(project.site_contingency) }}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Investment</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(project.total_investment) }}
                </div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div class="text-xs text-green-700 dark:text-green-400 mb-1">Projected Profit</div>
                <div class="text-lg font-bold text-green-800 dark:text-green-300">
                  {{ formatCurrency(project.projected_profit) }}
                </div>
                <div class="text-xs text-green-600 dark:text-green-400 mt-1">
                  {{ project.projected_profit_percentage }}% margin
                </div>
              </div>
            </div>
          </div>

          <!-- Analysis Items Table -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <i class="fas fa-list mr-2 text-blue-500"></i>
                Analysis Items
                <span class="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {{ project.items.length }}
                </span>
              </h4>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="w-full text-sm">
                <thead class="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th colspan="6" class="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-r border-gray-300 dark:border-gray-600">
                      QUOTED PRICES (VAT EXCL)
                    </th>
                    <th colspan="3" class="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-r border-gray-300 dark:border-gray-600">
                      BUYING PRICES (VAT INCL)
                    </th>
                    <th colspan="2" class="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                      ADDITIONAL INFO
                    </th>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-750">
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">S/N</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Description</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Q. Qty</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Unit</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Q. Rate</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Q. Amount</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Qty</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Rate</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Amount</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">Source</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300">Urgent</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="item in project.items" :key="item.analysis_id" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td class="px-3 py-3 text-gray-900 dark:text-white font-medium">{{ item.serial_number }}</td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300 max-w-xs" :title="item.item_description">
                      {{ item.item_description || 'N/A' }}
                    </td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ item.quoted_quantity || '-' }}</td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ item.quoted_unit || '-' }}</td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ formatCurrency(item.quoted_rate) }}</td>
                    <td class="px-3 py-3 text-gray-900 dark:text-white font-semibold">{{ formatCurrency(item.quoted_amount) }}</td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ item.quantity || '-' }}</td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ formatCurrency(item.rate) }}</td>
                    <td class="px-3 py-3 text-gray-900 dark:text-white font-semibold">{{ formatCurrency(item.amount) }}</td>
                    <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ item.source || 'N/A' }}</td>
                    <td class="px-3 py-3">
                      <span v-if="item.urgent_status === 'Yes'" class="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                        <i class="fas fa-exclamation-circle mr-1"></i>
                        Urgent
                      </span>
                      <span v-else class="text-gray-500 dark:text-gray-400 text-xs">No</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="lg:hidden space-y-3">
              <div
                v-for="item in project.items"
                :key="item.analysis_id"
                class="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="font-semibold text-gray-900 dark:text-white">
                    #{{ item.serial_number }}
                  </div>
                  <span v-if="item.urgent_status === 'Yes'" class="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                    <i class="fas fa-exclamation-circle mr-1"></i>
                    Urgent
                  </span>
                </div>
                
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {{ item.item_description || 'N/A' }}
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">Quoted Amount</div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(item.quoted_amount) }}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">Buying Amount</div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(item.amount) }}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">Source</div>
                    <div class="text-gray-700 dark:text-gray-300">{{ item.source || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">Unit</div>
                    <div class="text-gray-700 dark:text-gray-300">{{ item.quoted_unit || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons (if pending) -->
          <div v-if="project.status === 'pending'" class="p-6 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <div class="flex gap-3 justify-end">
              <button
                @click="openApprovalDialog(project.project_id, 'rejected')"
                class="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <i class="fas fa-times-circle mr-2"></i>
                Reject
              </button>
              <button
                @click="openApprovalDialog(project.project_id, 'approved')"
                class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <i class="fas fa-check-circle mr-2"></i>
                Approve Analysis
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <i class="fas fa-chart-bar text-gray-300 dark:text-gray-600 text-6xl mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No analyses found</h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ filter ? 'Try adjusting your search criteria' : 'No project analyses available at the moment' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing 
          <span class="font-medium">{{ Math.min((currentPage - 1) * itemsPerPage + 1, allProjects.length) }}</span>
          to 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, allProjects.length) }}</span>
          of 
          <span class="font-medium">{{ allProjects.length }}</span>
          projects
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            :disabled="currentPage === 1" 
            @click="changePage(currentPage - 1)" 
            class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            :disabled="currentPage * itemsPerPage >= allProjects.length" 
            @click="changePage(currentPage + 1)" 
            class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Approval Dialog -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ approvalStatus === 'approved' ? 'Approve' : 'Reject' }} Analysis
          </h3>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action</label>
            <select
              v-model="approvalStatus"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>

          <div v-if="approvalStatus === 'rejected'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Rejection <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="rejectionReason"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Please provide a clear reason for rejection..."
            ></textarea>
          </div>
        </div>

        <div class="p-6 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            @click="closeDialog"
            class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitApproval"
            :disabled="approvalStatus === 'rejected' && !rejectionReason"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              approvalStatus === 'approved'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            ]"
          >
            <i :class="approvalStatus === 'approved' ? 'fas fa-check mr-2' : 'fas fa-times mr-2'"></i>
            {{ approvalStatus === 'approved' ? 'Approve' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const analyses = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const toast = useToast();
const router = useRouter();

// Approval dialog state
const showDialog = ref(false);
const selectedProjectId = ref(null);
const approvalStatus = ref('approved');
const rejectionReason = ref('');

onMounted(async () => {
  await fetchAnalyses();
});

async function fetchAnalyses() {
  try {
    const response = await axios.get('/api/analysis');
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

// Group analyses by project_id
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

const totalPages = computed(() => {
  return Math.ceil(allProjects.value.length / itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4);
    } else if (current >= total - 2) {
      pages.push(total - 3, total - 2, total - 1, total);
    } else {
      pages.push(current - 1, current, current + 1);
    }
  }
  
  return pages;
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatCurrency(value) {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(value);
}

function statusBadgeClass(status) {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  };
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
}

function statusIcon(status) {
  const icons = {
    pending: 'fas fa-clock',
    approved: 'fas fa-check-circle',
    rejected: 'fas fa-times-circle'
  };
  return icons[status] || 'fas fa-circle';
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    if (error.response.status === 404) {
      message = error.response.data.message || 'Analysis already approved/rejected. Please contact the administrator.';
    } else if (error.response.status === 422) {
      message = 'Validation failed: ' + Object.values(error.response.data.errors).flat().join(', ');
    } else {
      message = error.response.data.message || error.response.statusText;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openApprovalDialog(projectId, defaultStatus = 'approved') {
  selectedProjectId.value = projectId;
  approvalStatus.value = defaultStatus;
  rejectionReason.value = '';
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  selectedProjectId.value = null;
  rejectionReason.value = '';
}

async function submitApproval() {
  try {
    const payload = {
      project_id: selectedProjectId.value,
      status: approvalStatus.value,
      reason_for_reject: approvalStatus.value === 'rejected' ? rejectionReason.value : null
    };

    const response = await axios.post('/api/approve-analysis', payload);

    if (response.data.status === 200) {
      toast.success(response.data.message);
      await fetchAnalyses();
      closeDialog();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    handleError(error);
  }
}
</script>

<style scoped>
/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #9CA3AF;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #F3F4F6;
}

/* Dark mode scrollbar */
.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #4B5563;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background-color: #1F2937;
}
</style>