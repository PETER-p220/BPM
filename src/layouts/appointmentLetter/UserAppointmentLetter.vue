<template>
  <div class="p-4 md:p-6 space-y-6" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Appointment Letters</h1>
          <p class="mt-1 text-sm text-gray-600">View and manage your appointment letters</p>
        </div>
      </div>
    </div>

    <!-- Status Summary Cards -->
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
      <div class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-800">Pending Review</p>
            <p class="text-2xl font-bold text-yellow-900">{{ statusCounts.pending }}</p>
            <p class="text-xs text-yellow-700 mt-1">Awaiting your response</p>
          </div>
          <div class="p-3 bg-yellow-200 rounded-full">
            <i class="text-xl text-yellow-700 fas fa-hourglass-half"></i>
          </div>
        </div>
      </div>

      <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-800">Accepted</p>
            <p class="text-2xl font-bold text-green-900">{{ statusCounts.accepted }}</p>
            <p class="text-xs text-green-700 mt-1">Successfully accepted</p>
          </div>
          <div class="p-3 bg-green-200 rounded-full">
            <i class="text-xl text-green-700 fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      <div class="p-4 bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-red-800">Rejected</p>
            <p class="text-2xl font-bold text-red-900">{{ statusCounts.rejected }}</p>
            <p class="text-xs text-red-700 mt-1">Declined offers</p>
          </div>
          <div class="p-3 bg-red-200 rounded-full">
            <i class="text-xl text-red-700 fas fa-times-circle"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert for Pending Letters -->
    <div 
      v-if="statusCounts.pending > 0" 
      class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm animate-pulse"
    >
      <div class="flex items-center gap-3">
        <i class="text-2xl text-yellow-600 fas fa-exclamation-triangle"></i>
        <div>
          <p class="font-semibold text-yellow-900">
            You have {{ statusCounts.pending }} pending appointment {{ statusCounts.pending === 1 ? 'letter' : 'letters' }}
          </p>
          <p class="text-sm text-yellow-800">
            Please review and respond to maintain your application status.
          </p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <input
        v-model="filter"
        type="text"
        placeholder="Search by tender title or status..."
        class="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
      />

      <div class="flex flex-wrap gap-3">
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          @click="exportToExcel"
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-green-600 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors shadow-sm"
        >
          <i class="fas fa-file-excel text-green-600"></i>
          Export Excel
        </button>

        <button
          @click="exportToPDF"
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-600 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
        >
          <i class="fas fa-file-pdf text-red-600"></i>
          Export PDF
        </button>

        <button 
          @click="fetchData" 
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-600 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          :disabled="isLoading"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
      <table class="w-full min-w-max divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              #
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tender Details
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Letter Document
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Timeline
            </th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <!-- Loading State -->
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
                <p class="text-gray-600">Loading appointment letters...</p>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="paginatedData.length === 0">
            <td colspan="6" class="px-6 py-16 text-center text-gray-500">
              <div class="flex flex-col items-center gap-3">
                <i class="fas fa-inbox text-5xl text-gray-300"></i>
                <p class="text-lg font-medium text-gray-900">No appointment letters found</p>
                <p class="text-sm" v-if="filter || statusFilter">Try adjusting your search criteria</p>
                <p class="text-sm text-gray-600" v-else>Your appointment letters will appear here once issued</p>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="(letter, index) in paginatedData"
            :key="letter.letter_id"
            class="hover:bg-gray-50 transition-colors"
            :class="{ 'bg-yellow-50': letter.status === 'pending' }"
          >
            <td class="px-6 py-4 text-gray-700 whitespace-nowrap font-medium">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            
            <!-- Tender Details -->
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <i class="text-blue-500 fas fa-file-contract"></i>
                  <span class="font-semibold text-gray-900">{{ letter.tender?.title || '—' }}</span>
                </div>
                <div class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-hashtag mr-1"></i>
                  ID: {{ letter.tender?.tender_id || 'N/A' }}
                </div>
                <div v-if="letter.tender?.location" class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-map-marker-alt mr-1"></i>
                  {{ letter.tender.location }}
                </div>
              </div>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col gap-2">
                <!-- Status Badge -->
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold w-fit',
                    letter.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse' :
                    letter.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                    letter.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  ]"
                >
                  <i 
                    :class="[
                      'fas text-xs mr-1.5',
                      letter.status === 'pending' ? 'fa-clock text-yellow-600' :
                      letter.status === 'accepted' ? 'fa-check-circle text-green-600' :
                      letter.status === 'rejected' ? 'fa-times-circle text-red-600' :
                      'fa-circle text-gray-600'
                    ]"
                  ></i>
                  {{ letter.status ? letter.status.charAt(0).toUpperCase() + letter.status.slice(1) : 'N/A' }}
                </span>

                <!-- Action Required Badge for Pending -->
                <span 
                  v-if="letter.status === 'pending'" 
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 border border-orange-200 rounded-full w-fit animate-bounce"
                >
                  <i class="mr-1 fas fa-exclamation-circle"></i>
                  Action Required
                </span>

                <!-- Status Updated Time -->
                <div v-if="letter.status_updated_at && letter.status !== 'pending'" class="text-xs text-gray-500">
                  <i class="mr-1 fas fa-history"></i>
                  {{ formatRelativeTime(letter.status_updated_at) }}
                </div>
              </div>
            </td>
            
            <!-- Letter Document -->
            <td class="px-6 py-4">
              <button
                v-if="letter.letter_file"
                @click="downloadLetterFile(letter.letter_file)"
                class="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <i class="fas fa-download"></i>
                Download PDF
              </button>
              <span v-else class="text-gray-400 text-sm flex items-center gap-2">
                <i class="fas fa-file-slash"></i>
                No file available
              </span>
            </td>
            
            <!-- Timeline -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1.5 text-xs">
                <!-- Issued Date -->
                <div class="flex items-center text-gray-600">
                  <i class="mr-2 fas fa-calendar-plus text-blue-500 w-4"></i>
                  <div>
                    <span class="font-medium text-gray-700">Issued:</span>
                    <span class="ml-1">{{ formatDate(letter.created_at) }}</span>
                    <div class="text-gray-500">{{ formatTime(letter.created_at) }}</div>
                  </div>
                </div>
                
                <!-- Response Date (if accepted or rejected) -->
                <div 
                  v-if="letter.status_updated_at && letter.status !== 'pending'" 
                  class="flex items-center text-gray-600"
                >
                  <i 
                    :class="[
                      'mr-2 fas w-4',
                      letter.status === 'accepted' ? 'fa-check text-green-500' : 'fa-times text-red-500'
                    ]"
                  ></i>
                  <div>
                    <span class="font-medium text-gray-700">
                      {{ letter.status === 'accepted' ? 'Accepted:' : 'Rejected:' }}
                    </span>
                    <span class="ml-1">{{ formatDate(letter.status_updated_at) }}</span>
                    <div class="text-gray-500">{{ formatTime(letter.status_updated_at) }}</div>
                  </div>
                </div>
                
                <!-- Pending Indicator -->
                <div v-if="letter.status === 'pending'" class="flex items-center text-yellow-600 font-medium">
                  <i class="mr-2 fas fa-hourglass-half w-4"></i>
                  <span>Awaiting your response</span>
                </div>
              </div>
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <!-- Accept Button for Pending -->
                <router-link
                  v-if="letter.status === 'pending'"
                  :to="{ name: 'AcceptAppointmentLetter', params: { letter_id: letter.letter_id } }"
                  class="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <i class="fas fa-check-circle mr-2"></i>
                  Review & Accept
                </router-link>
                
                <!-- View Details Button for Non-Pending -->
                <button
                  v-else
                  @click="viewDetails(letter)"
                  class="inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i class="fas fa-eye mr-2"></i>
                  View Details
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="filteredData.length > 0"
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2"
    >
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of
        {{ filteredData.length }} letters
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-chevron-left mr-1"></i>
          Previous
        </button>

        <!-- Page Numbers -->
        <div class="hidden sm:flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <span class="sm:hidden px-4 py-2 font-medium text-gray-800">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          :disabled="currentPage * itemsPerPage >= filteredData.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>

    <!-- Last Updated -->
    <div v-if="lastUpdated" class="flex items-center justify-between text-xs text-gray-500 pt-2">
      <span>Last updated: {{ lastUpdated }}</span>
      <span class="flex items-center gap-2">
        <i class="fas fa-circle text-green-500 animate-pulse"></i>
        Auto-refresh enabled
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

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

// Status counts for dashboard
const statusCounts = computed(() => {
  return {
    pending: appointmentLetters.value.filter(l => l.status === 'pending').length,
    accepted: appointmentLetters.value.filter(l => l.status === 'accepted').length,
    rejected: appointmentLetters.value.filter(l => l.status === 'rejected').length
  };
});

onMounted(async () => {
  await fetchData();
  startAutoRefresh();
});

onActivated(async () => {
  await fetchData();
  if (!refreshInterval) {
    startAutoRefresh();
  }
});

onUnmounted(() => {
  stopAutoRefresh();
});

function startAutoRefresh() {
  // Refresh every 30 seconds
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
    const response = await axios.get('api/logged-user-appointment-letters');
    appointmentLetters.value = response.data.data || [];
    updateLastUpdated();
    
    if (!silent) {
      toast.success('Your appointment letters loaded successfully');
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

// Format relative time
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
    handleError(error);
  }
}

function viewDetails(letter) {
  router.push({ name: 'AcceptAppointmentLetter', params: { letter_id: letter.letter_id } });
}

function formatDate(dateString) {
  if (!dateString) return '—';
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

const filteredData = computed(() => {
  let result = appointmentLetters.value;
  
  // Apply text filter
  if (filter.value.trim()) {
    const search = filter.value.toLowerCase().trim();
    result = result.filter((entry) => {
      return (
        entry.tender?.title?.toLowerCase().includes(search) ||
        entry.status?.toLowerCase().includes(search) ||
        entry.tender?.tender_id?.toLowerCase().includes(search)
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

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
  console.error('Error:', error);
}

function exportToExcel() {
  if (filteredData.value.length === 0) {
    toast.info('No data to export');
    return;
  }

  try {
    const data = filteredData.value.map((entry, index) => ({
      No: index + 1,
      'Tender Title': entry.tender?.title || 'N/A',
      'Tender ID': entry.tender?.tender_id || 'N/A',
      Status: entry.status || 'N/A',
      'Letter File': entry.letter_file ? 'Available' : 'N/A',
      'Issued Date': formatDate(entry.created_at) || 'N/A',
      'Status Updated': formatDate(entry.status_updated_at) || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointment Letters');
    
    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      )
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `My_Appointment_Letters_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel file exported successfully!');
  } catch (error) {
    handleError(error);
  }
}

function exportToPDF() {
  if (filteredData.value.length === 0) {
    toast.info('No data to export');
    return;
  }

  try {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('My Appointment Letters', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total: ${filteredData.value.length} | Pending: ${statusCounts.value.pending} | Accepted: ${statusCounts.value.accepted} | Rejected: ${statusCounts.value.rejected}`, 14, 33);

    const tableData = filteredData.value.map((entry, index) => [
      index + 1,
      entry.tender?.title || 'N/A',
      entry.status || 'N/A',
      entry.letter_file ? 'Available' : 'N/A',
      formatDate(entry.created_at) || 'N/A',
      formatDate(entry.status_updated_at) || 'N/A'
    ]);

    autoTable(doc, {
      head: [['No', 'Tender Title', 'Status', 'Letter', 'Issued', 'Updated']],
      body: tableData,
      startY: 38,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 153, 84] },
      alternateRowStyles: { fillColor: [240, 244, 248] },
    });

    doc.save(`My_Appointment_Letters_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF file exported successfully!');
  } catch (error) {
    handleError(error);
  }
}
</script>

<style scoped>
/* Smooth transitions */
button, a, input, select {
  transition: all 0.2s ease-in-out;
}

/* Table row hover effect */
tbody tr {
  transition: background-color 0.15s ease;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}
</style>