<template>
  <div class="min-h-screen p-6 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="mx-auto max-w-7xl">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Appointment Letters</h1>
            <p class="mt-1 text-sm text-gray-600">Manage and track all appointment letters issued to engineers</p>
          </div>
          <router-link to="/create-appointment-letter">
            <button 
              class="inline-flex items-center gap-2 px-6 py-3 text-white transition-all rounded-lg shadow-sm hover:shadow-md hover:opacity-90"
              style="background-color: #2e4053;"
            >
              <i class="fas fa-plus"></i>
              <span class="font-medium">Create Appointment Letter</span>
            </button>
          </router-link>
        </div>
      </div>

      <!-- Status Summary Cards -->
      <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div class="p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Letters</p>
              <p class="text-2xl font-bold text-gray-900">{{ appointmentLetters.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <i class="text-xl text-blue-600 fas fa-file-signature"></i>
            </div>
          </div>
        </div>

        <div class="p-4 bg-white border-l-4 border-yellow-500 rounded-lg shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-yellow-600">{{ statusCounts.pending }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <i class="text-xl text-yellow-600 fas fa-clock"></i>
            </div>
          </div>
        </div>

        <div class="p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Accepted</p>
              <p class="text-2xl font-bold text-green-600">{{ statusCounts.accepted }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <i class="text-xl text-green-600 fas fa-check-circle"></i>
            </div>
          </div>
        </div>

        <div class="p-4 bg-white border-l-4 border-red-500 rounded-lg shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Rejected</p>
              <p class="text-2xl font-bold text-red-600">{{ statusCounts.rejected }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <i class="text-xl text-red-600 fas fa-times-circle"></i>
            </div>
          </div>
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
                placeholder="Search by engineer, tender..."
                class="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
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
              @click="fetchData" 
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
            Showing <strong>{{ paginatedData.length }}</strong> of <strong>{{ filteredData.length }}</strong> appointment letters
            <span v-if="filter || statusFilter" class="ml-2 text-blue-600">
              <i class="fas fa-filter"></i> Filtered from {{ appointmentLetters.length }} total
            </span>
          </span>
          <span class="text-gray-500">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
      </div>

      <!-- Appointment Letters Table -->
      <div class="overflow-hidden bg-white rounded-lg shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Engineer Details
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Tender Information
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Letter Document
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Timeline
                </th>
                <th scope="col" class="px-4 py-3.5 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="7" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-4xl text-gray-400 fas fa-spinner fa-spin"></i>
                    <p class="text-gray-600">Loading appointment letters...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="paginatedData.length === 0">
                <td colspan="7" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-5xl text-gray-300 fas fa-file-signature"></i>
                    <p class="text-lg font-medium text-gray-900">No appointment letters found</p>
                    <p class="text-sm text-gray-600">
                      {{ filter || statusFilter ? 'Try adjusting your search criteria' : 'Get started by creating your first appointment letter' }}
                    </p>
                    <router-link 
                      v-if="!filter && !statusFilter" 
                      to="/create-appointment-letter"
                      class="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition-all rounded-lg shadow-sm hover:opacity-90"
                      style="background-color: #2e4053;"
                    >
                      <i class="fas fa-plus"></i>
                      Create Appointment Letter
                    </router-link>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr 
                v-else
                v-for="(appointmentLetter, index) in paginatedData" 
                :key="appointmentLetter.letter_id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                
                <!-- Engineer Details -->
                <td class="px-4 py-4 text-sm">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      {{ getInitials(appointmentLetter.user?.name) }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-gray-900 truncate">{{ appointmentLetter.user?.name || 'N/A' }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ appointmentLetter.user?.email || 'No email' }}</div>
                    </div>
                  </div>
                </td>
                
                <!-- Tender Information -->
                <td class="px-4 py-4 text-sm">
                  <div class="max-w-xs">
                    <div class="font-medium text-gray-900 truncate" :title="appointmentLetter.tender?.title">
                      {{ appointmentLetter.tender?.title || 'N/A' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      <i class="mr-1 fas fa-hashtag"></i>
                      Tender ID: {{ appointmentLetter.tender?.tender_id || 'N/A' }}
                    </div>
                  </div>
                </td>
                
                <!-- Status with Real-time Updates -->
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex flex-col gap-2">
                    <!-- Status Badge with Animation -->
                    <span
                      :class="[
                        'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300',
                        appointmentLetter.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        appointmentLetter.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200 animate-pulse' :
                        appointmentLetter.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      ]"
                    >
                      <i 
                        :class="[
                          'fas text-xs mr-1.5',
                          appointmentLetter.status === 'pending' ? 'fa-clock text-yellow-600' :
                          appointmentLetter.status === 'accepted' ? 'fa-check-circle text-green-600' :
                          appointmentLetter.status === 'rejected' ? 'fa-times-circle text-red-600' :
                          'fa-circle text-gray-600'
                        ]"
                      ></i>
                      {{ appointmentLetter.status?.charAt(0).toUpperCase() + appointmentLetter.status?.slice(1) || 'N/A' }}
                    </span>
                    
                    <!-- Status Update Time -->
                    <div v-if="appointmentLetter.status_updated_at" class="text-xs text-gray-500">
                      <i class="mr-1 fas fa-history"></i>
                      {{ formatRelativeTime(appointmentLetter.status_updated_at) }}
                    </div>
                    
                    <!-- Status Change Indicator (New) -->
                    <div 
                      v-if="isRecentlyUpdated(appointmentLetter.status_updated_at)"
                      class="inline-flex items-center text-xs font-medium text-blue-600 animate-pulse"
                    >
                      <i class="mr-1 fas fa-sparkles"></i>
                      Recently Updated
                    </div>
                  </div>
                </td>
                
                <!-- Letter Document -->
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <button
                    v-if="appointmentLetter.letter_file"
                    @click="downloadLetterFile(appointmentLetter.letter_file)"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg hover:opacity-90"
                    style="background-color: #27ae60;"
                  >
                    <i class="fas fa-download"></i>
                    Download PDF
                  </button>
                  <span v-else class="text-xs text-gray-400">
                    <i class="mr-1 fas fa-file-slash"></i>
                    No file
                  </span>
                </td>
                
                <!-- Timeline -->
                <td class="px-4 py-4 text-sm">
                  <div class="flex flex-col gap-1 text-xs">
                    <div class="flex items-center text-gray-600">
                      <i class="mr-1.5 fas fa-calendar-plus text-blue-500"></i>
                      <span class="font-medium">Issued:</span>
                      <span class="ml-1">{{ formatDate(appointmentLetter.created_at) }}</span>
                    </div>
                    <div v-if="appointmentLetter.status_updated_at && appointmentLetter.status !== 'pending'" class="flex items-center text-gray-600">
                      <i 
                        :class="[
                          'mr-1.5 fas',
                          appointmentLetter.status === 'accepted' ? 'fa-check text-green-500' : 'fa-times text-red-500'
                        ]"
                      ></i>
                      <span class="font-medium">{{ appointmentLetter.status === 'accepted' ? 'Accepted:' : 'Rejected:' }}</span>
                      <span class="ml-1">{{ formatDate(appointmentLetter.status_updated_at) }}</span>
                    </div>
                    <div v-if="appointmentLetter.status === 'pending'" class="flex items-center text-yellow-600">
                      <i class="mr-1.5 fas fa-hourglass-half"></i>
                      <span class="font-medium">Awaiting Response</span>
                    </div>
                  </div>
                </td>
                
                <!-- Actions -->
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="viewDetails(appointmentLetter)"
                      class="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="appointmentLetter.letter_file"
                      @click="downloadLetterFile(appointmentLetter.letter_file)"
                      class="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                      title="Download Letter"
                    >
                      <i class="fas fa-file-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex flex-col items-center justify-between gap-4 mt-6 sm:flex-row">
        <div class="text-sm text-gray-600">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} results
        </div>
        
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-chevron-left"></i>
            <span class="hidden sm:inline">Previous</span>
          </button>

          <!-- Page Numbers -->
          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                currentPage === page
                  ? 'text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
              :style="currentPage === page ? 'background-color: #2e4053;' : ''"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Next</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Last updated: {{ lastUpdated }}</span>
        <span class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1">
            <i class="fas fa-circle text-green-500 animate-pulse"></i>
            Auto-refresh enabled (30s)
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const appointmentLetters = ref([]);
const filter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(false);
const lastUpdated = ref('');
let refreshInterval = null;

// Status counts for dashboard cards
const statusCounts = computed(() => {
  return {
    pending: appointmentLetters.value.filter(l => l.status === 'pending').length,
    accepted: appointmentLetters.value.filter(l => l.status === 'accepted').length,
    rejected: appointmentLetters.value.filter(l => l.status === 'rejected').length
  };
});

// Refresh data when component is mounted
onMounted(async () => {
  await fetchData();
  startAutoRefresh();
});

// Refresh data when component is activated
onActivated(async () => {
  await fetchData();
  if (!refreshInterval) {
    startAutoRefresh();
  }
});

// Clear interval when component is unmounted
onUnmounted(() => {
  stopAutoRefresh();
});

function startAutoRefresh() {
  // Refresh every 30 seconds to check for status updates
  refreshInterval = setInterval(async () => {
    await fetchData(true); // Silent refresh
  }, 30000);
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

async function fetchData(silent = false) {
  if (!silent) {
    isLoading.value = true;
  }
  
  try {
    const response = await axios.get('api/appointment-letter');
    const newData = response.data.data || [];
    
    // Check for status changes
    if (appointmentLetters.value.length > 0) {
      detectStatusChanges(appointmentLetters.value, newData);
    }
    
    appointmentLetters.value = newData;
    updateLastUpdated();
    
    if (!silent) {
      toast.success('Appointment letters loaded successfully');
    }
  } catch (error) {
    if (!silent) {
      handleError(error);
    }
  } finally {
    if (!silent) {
      isLoading.value = false;
    }
  }
}

// Detect status changes and notify admin
function detectStatusChanges(oldData, newData) {
  console.log('Checking for status changes...');
  console.log('Old data:', oldData);
  console.log('New data:', newData);
  
  newData.forEach(newLetter => {
    const oldLetter = oldData.find(l => l.letter_id === newLetter.letter_id);
    
    if (oldLetter && oldLetter.status !== newLetter.status) {
      console.log(`Status changed for letter ${newLetter.letter_id}: ${oldLetter.status} → ${newLetter.status}`);
      
      // Status changed - show notification
      const engineerName = newLetter.user?.name || 'An engineer';
      const statusText = newLetter.status.charAt(0).toUpperCase() + newLetter.status.slice(1);
      
      if (newLetter.status === 'accepted') {
        toast.success(`${engineerName} has accepted the appointment letter!`, {
          timeout: 5000,
          icon: '✅'
        });
      } else if (newLetter.status === 'rejected') {
        toast.warning(`${engineerName} has rejected the appointment letter.`, {
          timeout: 5000,
          icon: '❌'
        });
      }
    }
  });
}

// Check if status was recently updated (within last 5 minutes)
function isRecentlyUpdated(statusUpdatedAt) {
  if (!statusUpdatedAt) return false;
  const updatedTime = new Date(statusUpdatedAt).getTime();
  const now = new Date().getTime();
  const fiveMinutes = 5 * 60 * 1000;
  return (now - updatedTime) < fiveMinutes;
}

// Format relative time (e.g., "2 hours ago", "just now")
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString);
}

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

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi',
  }).format(date);
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

// Computed Properties
const filteredData = computed(() => {
  let result = appointmentLetters.value;
  
  // Apply text filter
  if (filter.value) {
    const searchText = filter.value.toLowerCase();
    result = result.filter(entry => {
      return (
        (entry.user?.name?.toLowerCase() || '').includes(searchText) ||
        (entry.user?.email?.toLowerCase() || '').includes(searchText) ||
        (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
        (entry.status?.toLowerCase() || '').includes(searchText)
      );
    });
  }
  
  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(entry => entry.status === statusFilter.value);
  }
  
  return result;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, filteredData.value.length);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Page Navigation
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// View Details
function viewDetails(appointmentLetter) {
  router.push(`/view-appointment-letter/${appointmentLetter.letter_id}`);
}

// Download Appointment Letter File
async function downloadLetterFile(fileUrl) {
  if (!fileUrl) {
    toast.error('No file URL available');
    return;
  }

  try {
    toast.info('Downloading file...');
    
    if (fileUrl.startsWith('http')) {
      window.open(fileUrl, '_blank');
      toast.success('File opened in new tab');
    } else {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      const fileName = fileUrl.split('/').pop() || 'appointment_letter.pdf';
      saveAs(response.data, fileName);
      toast.success('File downloaded successfully');
    }
  } catch (error) {
    handleError(error, 'Failed to download file');
  }
}

// Handle Errors
function handleError(error, defaultMessage = 'An unexpected error occurred') {
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.statusText) {
    message = error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
  console.error('Error:', error);
}

// Export to Excel
function exportToExcel() {
  try {
    const data = filteredData.value.map((entry, index) => ({
      No: index + 1,
      Engineer: entry.user?.name || 'N/A',
      Email: entry.user?.email || 'N/A',
      'Tender Title': entry.tender?.title || 'N/A',
      'Tender ID': entry.tender?.tender_id || 'N/A',
      'Letter File': entry.letter_file ? 'Available' : 'N/A',
      Status: entry.status || 'N/A',
      'Issued Date': formatDate(entry.created_at) || 'N/A',
      'Status Updated': formatDate(entry.status_updated_at) || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointment Letters');
    
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

    XLSX.writeFile(workbook, `Appointment_Letters_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel file exported successfully!');
  } catch (error) {
    handleError(error, 'Failed to export to Excel');
  }
}

// Export to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 55, 71);
    doc.text('Appointment Letters Report', 14, 15);
    
    // Add generation date and summary
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text(`Total: ${filteredData.value.length} | Pending: ${statusCounts.value.pending} | Accepted: ${statusCounts.value.accepted} | Rejected: ${statusCounts.value.rejected}`, 14, 27);

    // Prepare table data
    const tableData = filteredData.value.map((entry, index) => [
      index + 1,
      entry.user?.name || 'N/A',
      entry.tender?.title || 'N/A',
      entry.status || 'N/A',
      entry.letter_file ? 'Available' : 'N/A',
      formatDate(entry.created_at),
      formatDate(entry.status_updated_at) || 'N/A'
    ]);

    autoTable(doc, {
      startY: 32,
      head: [['#', 'Engineer', 'Tender Title', 'Status', 'Letter', 'Issued', 'Updated']],
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
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 70 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 }
      }
    });

    doc.save(`Appointment_Letters_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF file exported successfully!');
  } catch (error) {
    handleError(error, 'Failed to export to PDF');
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
button, a, input, select {
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

/* Pulse animation for accepted status */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>