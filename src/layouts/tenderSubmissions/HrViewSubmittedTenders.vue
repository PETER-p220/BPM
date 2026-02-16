<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Submitted Tenders</h1>
            <p class="text-sm text-gray-600 mt-1">View and manage all tender submissions</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Statistics Cards -->
      <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <i class="fas fa-file-alt text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Submissions</p>
              <p class="text-2xl font-bold text-gray-900">{{ users.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <i class="fas fa-users text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Unique Engineers</p>
              <p class="text-2xl font-bold text-gray-900">{{ uniqueEngineersCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <i class="fas fa-calendar-check text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ thisMonthCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
              <i class="fas fa-clock text-orange-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600">Latest Submission</p>
              <p class="text-sm font-semibold text-gray-900">{{ latestSubmission }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Export Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by title, number, engineer, or date..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              v-if="filter"
              @click="filter = ''"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <i class="fas fa-times text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="exportToExcel"
              :disabled="isExporting"
              class="inline-flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isExporting ? 'fas fa-spinner fa-spin' : 'fas fa-file-excel'"></i>
              <span class="hidden sm:inline">Export Excel</span>
            </button>
            
            <button
              @click="exportToPDF"
              :disabled="isExporting"
              class="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isExporting ? 'fas fa-spinner fa-spin' : 'fas fa-file-pdf'"></i>
              <span class="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
        
        <div v-if="filter" class="mt-3 text-sm text-gray-600">
          Found <span class="font-semibold text-gray-900">{{ filteredData.length }}</span> submission(s) matching your search
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Loading submissions...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <i class="fas fa-inbox text-6xl text-gray-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
          <p class="text-gray-600">Tender submissions will appear here once engineers start submitting</p>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Engineer</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tender Details</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Document</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="(assignedtender, index) in paginatedData" 
                :key="assignedtender.submission_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <i class="fas fa-user text-blue-600"></i>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ assignedtender.user.name }}</div>
                      <div class="text-xs text-gray-500">{{ assignedtender.user.email || 'N/A' }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {{ assignedtender.tender.title }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      <span class="font-mono bg-gray-100 px-2 py-0.5 rounded">
                        {{ assignedtender.tender.tender_number }}
                      </span>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    <i class="fas fa-file-pdf"></i>
                    PDF Available
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(assignedtender.created_at) }}</div>
                  <div class="text-xs text-gray-500">{{ formatRelativeDate(assignedtender.created_at) }}</div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="downloadTenderPdf(assignedtender.submission_document)"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm shadow-sm hover:shadow-md"
                  >
                    <i class="fas fa-download"></i>
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredData.length > itemsPerPage" class="mt-6 flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div class="text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
          <span class="font-semibold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> of 
          <span class="font-semibold text-gray-900">{{ filteredData.length }}</span> submissions
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            :disabled="currentPage === 1" 
            @click="changePage(currentPage - 1)" 
            class="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
            <span class="hidden sm:inline">Previous</span>
          </button>
          
          <div class="flex items-center gap-1">
            <span class="px-4 py-2 text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
          </div>
          
          <button 
            :disabled="currentPage >= totalPages" 
            @click="changePage(currentPage + 1)" 
            class="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="hidden sm:inline">Next</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
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

const users = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(true);
const isExporting = ref(false);

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  isLoading.value = true;
  try {
    const response = await axios.get('api/submit/tender');
    users.value = response.data.data;
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Computed statistics
const uniqueEngineersCount = computed(() => {
  const uniqueEngineers = new Set(users.value.map(u => u.user.name));
  return uniqueEngineers.size;
});

const thisMonthCount = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return users.value.filter(u => {
    const submissionDate = new Date(u.created_at);
    return submissionDate.getMonth() === currentMonth && 
           submissionDate.getFullYear() === currentYear;
  }).length;
});

const latestSubmission = computed(() => {
  if (users.value.length === 0) return 'N/A';
  
  const latest = users.value.reduce((latest, current) => {
    return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
  });
  
  return formatRelativeDate(latest.created_at);
});

// Computed Property for Filtering
const filteredData = computed(() => {
  if (!filter.value) return users.value;
  
  return users.value.filter(entry => {
    const searchText = filter.value.toLowerCase();
    return (
      (entry.user?.name?.toLowerCase() || '').includes(searchText) ||
      (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
      (entry.tender?.tender_number?.toLowerCase() || '').includes(searchText) ||
      (entry.created_at?.toLowerCase() || '').includes(searchText)
    );
  });
});

// Computed Property for Paginated Data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

// Download Tender PDF
async function downloadTenderPdf(attachment) {
  if (!attachment) {
    toast.error('No document available for download');
    return;
  }

  try {
    const response = await axios.get(attachment, { responseType: 'blob' });
    const fileName = attachment.split('/').pop() || 'submission_document.pdf';
    saveAs(response.data, fileName);
    toast.success('Document downloaded successfully');
  } catch (error) {
    handleError(error, 'Failed to download document');
  }
}

// Change Page Function
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

// Format relative date
function formatRelativeDate(date) {
  if (!date) return 'N/A';
  
  const now = new Date();
  const submissionDate = new Date(date);
  const diffTime = Math.abs(now - submissionDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w ago`;
  } else {
    return formatDate(date);
  }
}

// Handle Errors
function handleError(error, defaultMessage = 'An unexpected error occurred') {
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
}

// Export to Excel
async function exportToExcel() {
  isExporting.value = true;
  
  try {
    const dataToExport = filteredData.value.map((entry, index) => ({
      No: index + 1,
      Engineer: entry.user?.name || 'N/A',
      Email: entry.user?.email || 'N/A',
      TenderTitle: entry.tender?.title || 'N/A',
      TenderNumber: entry.tender?.tender_number || 'N/A',
      SubmissionDocument: entry.submission_document || 'N/A',
      SubmittedAt: formatDate(entry.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 20 }, // Engineer
      { wch: 25 }, // Email
      { wch: 30 }, // Tender Title
      { wch: 15 }, // Tender Number
      { wch: 40 }, // Submission Document
      { wch: 20 }, // Submitted At
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submitted Tenders');
    XLSX.writeFile(workbook, `Submitted_Tenders_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Excel file exported successfully');
  } catch (error) {
    toast.error('Failed to export Excel file');
    console.error('Export error:', error);
  } finally {
    isExporting.value = false;
  }
}

// Export to PDF
async function exportToPDF() {
  isExporting.value = true;
  
  try {
    const doc = new jsPDF();
    const title = 'Submitted Tenders Report';
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Submissions: ${filteredData.value.length}`, 14, 36);
    
    // Table
    const headers = [['#', 'Engineer', 'Tender Title', 'Tender Number', 'Submitted At']];
    const data = filteredData.value.map((entry, index) => [
      index + 1,
      entry.user?.name || 'N/A',
      entry.tender?.title || 'N/A',
      entry.tender?.tender_number || 'N/A',
      formatDate(entry.created_at),
    ]);

    autoTable(doc, { 
      head: headers, 
      body: data, 
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { 
        fillColor: [46, 64, 83],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`Submitted_Tenders_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success('PDF file exported successfully');
  } catch (error) {
    toast.error('Failed to export PDF file');
    console.error('Export error:', error);
  } finally {
    isExporting.value = false;
  }
}
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Sticky header */
.sticky {
  position: sticky;
  top: 0;
}

/* Truncate text */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>