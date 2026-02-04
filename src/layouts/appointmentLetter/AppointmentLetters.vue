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
            <span v-if="filter" class="ml-2 text-blue-600">
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
                  Engineer
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Tender
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Letter Document
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Issued Date
                </th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="6" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-4xl text-gray-400 fas fa-spinner fa-spin"></i>
                    <p class="text-gray-600">Loading appointment letters...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="paginatedData.length === 0">
                <td colspan="6" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-5xl text-gray-300 fas fa-file-signature"></i>
                    <p class="text-lg font-medium text-gray-900">No appointment letters found</p>
                    <p class="text-sm text-gray-600">
                      {{ filter ? 'Try adjusting your search criteria' : 'Get started by creating your first appointment letter' }}
                    </p>
                    <router-link 
                      v-if="!filter" 
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
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      {{ getInitials(appointmentLetter.user?.name) }}
                    </div>
                    <div>
                      <div class="font-medium">{{ appointmentLetter.user?.name || 'N/A' }}</div>
                      <div class="text-xs text-gray-500">Engineer</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="max-w-xs">
                    <div class="font-medium truncate">{{ appointmentLetter.tender?.title || 'N/A' }}</div>
                    <div class="text-xs text-gray-500">Tender Project</div>
                  </div>
                </td>
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
                  <span v-else class="text-gray-400">No file</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ formatDate(appointmentLetter.created_at) }}</span>
                    <span class="text-xs text-gray-500">{{ formatTime(appointmentLetter.created_at) }}</span>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-2">
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
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const appointmentLetters = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(false);
const lastUpdated = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  isLoading.value = true;
  try {
    const response = await axios.get('api/appointment-letter');
    appointmentLetters.value = response.data.data || [];
    updateLastUpdated();
    toast.success('Appointment letters loaded successfully');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
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
  if (!filter.value) return appointmentLetters.value;
  
  const searchText = filter.value.toLowerCase();
  return appointmentLetters.value.filter(entry => {
    return (
      (entry.user?.name?.toLowerCase() || '').includes(searchText) ||
      (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
      (entry.status?.toLowerCase() || '').includes(searchText)
    );
  });
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
  toast.info(`Viewing details for ${appointmentLetter.user?.name || 'Unknown'}`);
  // You can implement a modal or navigation to details page here
}

// Download Appointment Letter File
async function downloadLetterFile(fileUrl) {
  if (!fileUrl) {
    toast.error('No file URL available');
    return;
  }

  try {
    toast.info('Downloading file...');
    
    // Try to open in new tab first (for web URLs)
    if (fileUrl.startsWith('http')) {
      window.open(fileUrl, '_blank');
      toast.success('File opened in new tab');
    } else {
      // For local files, download via axios
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
      'No': index + 1,
      'Engineer': entry.user?.name || 'N/A',
      'Tender Title': entry.tender?.title || 'N/A',
      'Letter File': entry.letter_file ? 'Available' : 'N/A',
      'Status': entry.status || 'N/A',
      'Issued Date': formatDate(entry.created_at),
      'Time': formatTime(entry.created_at)
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
    toast.success('Excel file exported successfully');
  } catch (error) {
    handleError(error, 'Failed to export to Excel');
  }
}

// Export to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 55, 71);
    doc.text('Appointment Letters Report', 14, 15);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const tableData = filteredData.value.map((entry, index) => [
      index + 1,
      entry.user?.name || 'N/A',
      entry.tender?.title || 'N/A',
      entry.letter_file ? 'Available' : 'N/A',
      entry.status || 'N/A',
      formatDate(entry.created_at)
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Engineer', 'Tender Title', 'Letter File', 'Status', 'Issued Date']],
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
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 50 },
        2: { cellWidth: 80 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 }
      },
      margin: { top: 28 }
    });

    doc.save(`Appointment_Letters_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF file exported successfully');
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