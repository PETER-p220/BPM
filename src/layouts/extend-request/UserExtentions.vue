<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Extension 
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Manage and track project extension requests
            </p>
          </div>
          <router-link to="/create/extentions-for-project">
            <button class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
              <i class="fas fa-plus mr-2"></i>
              Create Extension Request
            </button>
          </router-link>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by project, engineer, item, reason, status..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <button
              @click="exportToExcel"
              class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <i class="fas fa-file-excel mr-2"></i>
              Export Excel
            </button>
            <button
              @click="exportToPDF"
              class="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <i class="fas fa-file-pdf mr-2"></i>
              Export PDF
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wider">Total Requests</p>
                <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ totalRequests }}</p>
              </div>
              <i class="fas fa-calendar-plus text-blue-400 text-2xl"></i>
            </div>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-yellow-600 dark:text-yellow-300 uppercase tracking-wider">Pending</p>
                <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{{ pendingRequests }}</p>
              </div>
              <i class="fas fa-clock text-yellow-400 text-2xl"></i>
            </div>
          </div>
          <div class="bg-green-50 dark:bg-green-900 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-green-600 dark:text-green-300 uppercase tracking-wider">Accepted</p>
                <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ acceptedRequests }}</p>
              </div>
              <i class="fas fa-check-circle text-green-400 text-2xl"></i>
            </div>
          </div>
          <div class="bg-red-50 dark:bg-red-900 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-red-600 dark:text-red-300 uppercase tracking-wider">Rejected</p>
                <p class="text-2xl font-bold text-red-900 dark:text-red-100">{{ rejectedRequests }}</p>
              </div>
              <i class="fas fa-times-circle text-red-400 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects List -->
      <div v-if="filteredProjects.length > 0" class="space-y-6">
        <div
          v-for="project in filteredProjects"
          :key="project.project_id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Project Header -->
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-calendar-alt text-white"></i>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ project.project_name }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ project.requests.length }} extension {{ project.requests.length === 1 ? 'request' : 'requests' }}
                  </p>
                </div>
              </div>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                Project ID: {{ project.project_id }}
              </span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    #
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Engineer
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Item Description
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Extension Details
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Reason
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(request, index) in project.requests"
                  :key="request.extend_id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs font-bold">
                          {{ (request.user?.name || 'NA').charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {{ request.user?.name || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                      {{ request.analysis?.item_description || 'N/A' }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm">
                      <div class="flex items-center mb-1">
                        <i class="fas fa-sort-amount-up text-purple-500 text-xs mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400 text-xs">Qty:</span>
                        <span class="ml-1 font-medium text-gray-900 dark:text-gray-100">{{ request.quantity_extended || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="fas fa-dollar-sign text-green-500 text-xs mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400 text-xs">Amount:</span>
                        <span class="ml-1 font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(request.amount_extended) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                      <button
                        v-if="request.reason_for_extend"
                        @click="showReasonModal(request)"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <i class="fas fa-eye mr-1"></i>
                        View reason
                      </button>
                      <span v-else class="text-gray-400">No reason provided</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': request.status === 'pending',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': request.status === 'accepted',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': request.status === 'rejected'
                      }"
                      class="px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-full"
                    >
                      <span
                        :class="{
                          'bg-yellow-500': request.status === 'pending',
                          'bg-green-500': request.status === 'accepted',
                          'bg-red-500': request.status === 'rejected'
                        }"
                        class="w-2 h-2 rounded-full mr-2"
                      ></span>
                      {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(request.created_at) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12">
        <div class="flex flex-col items-center justify-center">
          <i class="fas fa-calendar-times text-gray-300 dark:text-gray-600 text-6xl mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No extension requests found</h3>
          <p class="text-gray-500 dark:text-gray-400 text-center mb-6">
            {{ filter ? 'Try adjusting your search criteria' : 'Create your first extension request to get started' }}
          </p>
          <router-link to="/create/extentions-for-project">
            <button class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
              <i class="fas fa-plus mr-2"></i>
              Create Extension Request
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Reason Modal -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeReasonModal"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80"></div>

          <!-- Modal panel -->
          <div class="relative inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-comment-alt text-white"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Extension Reason</h2>
                    <p class="text-purple-100 text-sm">Request justification details</p>
                  </div>
                </div>
                <button
                  @click="closeReasonModal"
                  class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-6">
              <div v-if="selectedRequest" class="space-y-4">
                <!-- Request Info -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Request Information</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Engineer:</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedRequest.user?.name || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Item:</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedRequest.analysis?.item_description || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Quantity:</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedRequest.quantity_extended || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(selectedRequest.amount_extended) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Reason -->
                <div class="bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-500 rounded-lg p-4">
                  <h3 class="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    Reason for Extension
                  </h3>
                  <p class="text-sm text-purple-800 dark:text-purple-200">
                    {{ selectedRequest.reason_for_extend || 'No reason provided' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
              <button
                @click="closeReasonModal"
                class="px-6 py-2.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const extensionRequests = ref([]);
const filter = ref('');
const showModal = ref(false);
const selectedRequest = ref(null);

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('/api/loggedUserExtentions');
    if (response.data.status) {
      extensionRequests.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch extension requests');
    }
  } catch (error) {
    handleError(error);
  }
}

// Show reason modal
function showReasonModal(request) {
  selectedRequest.value = request;
  showModal.value = true;
}

// Close reason modal
function closeReasonModal() {
  showModal.value = false;
  selectedRequest.value = null;
}

// Format date to East Africa Time
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

// Format currency
function formatCurrency(amount) {
  if (!amount || amount === 'N/A') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Group requests by project_id
const groupedByProject = computed(() => {
  const grouped = {};
  extensionRequests.value.forEach((request) => {
    const projectId = request.project_id;
    if (!grouped[projectId]) {
      grouped[projectId] = {
        project_id: projectId,
        project_name: request.project?.project_name || 'Unknown Project',
        requests: [],
      };
    }
    grouped[projectId].requests.push(request);
  });
  return Object.values(grouped);
});

// Computed Property for Filtering
const filteredProjects = computed(() => {
  return groupedByProject.value
    .map((project) => {
      const filteredRequests = project.requests.filter((request) => {
        const searchText = filter.value.toLowerCase();
        return (
          (request.user?.name?.toLowerCase() || '').includes(searchText) ||
          (request.analysis?.item_description?.toLowerCase() || '').includes(searchText) ||
          (request.quantity_extended?.toString() || '').includes(searchText) ||
          (request.amount_extended?.toString() || '').includes(searchText) ||
          (request.reason_for_extend?.toLowerCase() || '').includes(searchText) ||
          (request.status?.toLowerCase() || '').includes(searchText) ||
          (project.project_name?.toLowerCase() || '').includes(searchText)
        );
      });
      return { ...project, requests: filteredRequests };
    })
    .filter((project) => project.requests.length > 0);
});

// Statistics
const totalRequests = computed(() => extensionRequests.value.length);
const pendingRequests = computed(() => extensionRequests.value.filter(r => r.status === 'pending').length);
const acceptedRequests = computed(() => extensionRequests.value.filter(r => r.status === 'accepted').length);
const rejectedRequests = computed(() => extensionRequests.value.filter(r => r.status === 'rejected').length);

// Handle Errors
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Export to Excel
function exportToExcel() {
  try {
    const data = filteredProjects.value.flatMap((project) =>
      project.requests.map((request, index) => ({
        'Project Name': project.project_name,
        No: index + 1,
        Engineer: request.user?.name || 'N/A',
        'Item Description': request.analysis?.item_description || 'N/A',
        'Quantity Extended': request.quantity_extended || 'N/A',
        'Amount Extended': request.amount_extended || 'N/A',
        'Reason for Extension': request.reason_for_extend || 'N/A',
        Status: request.status || 'N/A',
        'Created At': formatDate(request.created_at) || 'N/A',
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Extension Requests');
    XLSX.writeFile(workbook, 'Extension_Requests.xlsx');
    toast.success('Excel file exported successfully!');
  } catch (error) {
    handleError(error);
  }
}

// Export to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Extension Requests Report', 14, 15);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text(`Total Requests: ${totalRequests.value}`, 14, 27);

    let startY = 35;

    filteredProjects.value.forEach((project, projectIndex) => {
      if (projectIndex > 0) {
        doc.addPage();
        startY = 15;
      }

      // Project header
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Project: ${project.project_name}`, 14, startY);
      
      const data = project.requests.map((request, index) => [
        index + 1,
        request.user?.name || 'N/A',
        request.analysis?.item_description || 'N/A',
        request.quantity_extended || 'N/A',
        request.amount_extended || 'N/A',
        request.status || 'N/A',
      ]);

      autoTable(doc, {
        startY: startY + 5,
        head: [['#', 'Engineer', 'Item', 'Qty Extended', 'Amount', 'Status']],
        body: data,
        theme: 'striped',
        headStyles: {
          fillColor: [147, 51, 234],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
      });

      startY = doc.lastAutoTable.finalY + 10;
    });

    doc.save('Extension_Requests.pdf');
    toast.success('PDF exported successfully!');
  } catch (error) {
    handleError(error);
  }
}
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .inline-block,
.modal-leave-active .inline-block {
  transition: all 0.3s ease;
}

.modal-enter-from .inline-block,
.modal-leave-to .inline-block {
  transform: scale(0.95);
  opacity: 0;
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
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>