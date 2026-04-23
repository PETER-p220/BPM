<template>
  <div class="min-h-screen p-6" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-[22px] font-bold text-[#183b63] mb-2 flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] flex items-center justify-center shadow-[0_4px_12px_rgba(25,79,146,0.25)]">
                <i class="fas fa-file-contract text-white"></i>
              </div>
              Submitted Tenders
            </h1>
            <p class="text-[13px] text-[#7a93af]">Track and manage all tender submissions</p>
          </div>
          
          <!-- Statistics Cards -->
          <div class="flex gap-4">
            <div class="bg-white/95 rounded-2xl shadow-[0_8px_18px_rgba(18,58,99,0.05)] px-6 py-4 border border-[#dbe7f3]">
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac] mb-1">Total Submissions</p>
              <p class="text-2xl font-bold text-[#183b63]">{{ filteredData.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Export Controls -->
      <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 shadow-[0_8px_18px_rgba(18,58,99,0.05)] p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-[#7a93af]"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by tender title, number, or date..."
              class="w-full pl-10 pr-4 py-3 border border-[#d9e6f3] rounded-xl bg-white/90 text-[#183b63] placeholder:text-[#a4b8cf] shadow-[0_2px_8px_rgba(18,58,99,0.04)] focus:ring-2 focus:ring-[#2f78dd]/20 focus:border-[#2f78dd] outline-none transition"
            />
            <button
              v-if="filter"
              @click="filter = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Export Buttons -->
          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="bg-white hover:bg-[#f0fdf9] text-[#1f9d8b] font-semibold px-5 py-3 rounded-xl border border-[#d9e6f3] hover:border-[#1f9d8b]/30 transition-all flex items-center gap-2 shadow-sm"
              title="Export to Excel"
            >
              <i class="fas fa-file-excel"></i>
              <span class="hidden sm:inline">Excel</span>
            </button>
            <button
              @click="exportToPDF"
              class="bg-white hover:bg-[#fef5f3] text-[#d95f43] font-semibold px-5 py-3 rounded-xl border border-[#d9e6f3] hover:border-[#d95f43]/30 transition-all flex items-center gap-2 shadow-sm"
              title="Export to PDF"
            >
              <i class="fas fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-[13px] text-[#7a93af]">
            Showing <span class="font-semibold text-[#183b63]">{{ paginatedData.length }}</span> of 
            <span class="font-semibold text-[#183b63]">{{ filteredData.length }}</span> submissions
          </div>
          
          <!-- Filter badges -->
          <div v-if="filter" class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Active filter:</span>
            <span class="bg-[#edf4fb] text-[#2f78dd] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
              {{ filter }}
              <button @click="filter = ''" class="hover:text-blue-900">
                <i class="fas fa-times text-xs"></i>
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 shadow-[0_8px_18px_rgba(18,58,99,0.05)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-[#f7faff] border-b border-[#e4edf7]">
                <th class="px-6 py-3.5 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-hashtag text-[#a4b8cf]"></i>
                    No
                  </div>
                </th>
                <th class="px-6 py-3.5 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-user text-[#a4b8cf]"></i>
                    Engineer
                  </div>
                </th>
                <th class="px-6 py-3.5 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-file-alt text-[#a4b8cf]"></i>
                    Tender Title
                  </div>
                </th>
                <th class="px-6 py-3.5 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-barcode text-[#a4b8cf]"></i>
                    Tender Number
                  </div>
                </th>
                <th class="px-6 py-3.5 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-paperclip text-[#a4b8cf]"></i>
                    Document
                  </div>
                </th>
                <th class="px-6 py-3.5 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-clock text-[#a4b8cf]"></i>
                    Submitted At
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2fa]">
              <tr
                v-for="(assignedtender, index) in paginatedData"
                :key="assignedtender.submission_id"
                class="hover:bg-[#f7faff] transition-colors"  
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#67819d] font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] rounded-full flex items-center justify-center text-white font-semibold">
                      {{ getInitials(assignedtender.user.name) }}
                    </div>
                    <div>
                      <p class="font-semibold text-[#183b63]">{{ assignedtender.user.name }}</p>
                      <p class="text-xs text-[#7a93af]">Engineer</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="max-w-xs">
                    <p class="font-semibold text-[#183b63] truncate">{{ assignedtender.tender.title }}</p>
                    <div class="flex items-center gap-1 mt-1">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#edf4fb] text-[#2f78dd]">
                        Active
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 bg-[#2f78dd] rounded-full"></div>
                    <span class="font-mono text-[#4a6a8a]">{{ assignedtender.tender.tender_number }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="downloadTenderPdf(assignedtender.submission_document)"
                    class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] hover:shadow-md text-white font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm group"
                  >
                    <i class="fas fa-download group-hover:animate-bounce"></i>
                    <span>Download</span>
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2 text-[#4a6a8a]">
                      <i class="fas fa-calendar-day text-[#a4b8cf] text-xs"></i>
                      <span>{{ formatDate(assignedtender.created_at) }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-[#7a93af] text-xs">
                      <i class="fas fa-clock text-[#a4b8cf]"></i>
                      <span>{{ formatTime(assignedtender.created_at) }}</span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="paginatedData.length === 0">
                <td colspan="6" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="w-14 h-14 bg-[#edf4fb] rounded-2xl flex items-center justify-center mb-4">
                      <i class="fas fa-inbox text-[#7d94ac] text-2xl"></i>
                    </div>
                    <p class="text-[#183b63] text-[15px] font-semibold mb-2">No submissions found</p>
                    <p class="text-[#7a93af] text-[13px]">
                      {{ filter ? 'Try adjusting your search criteria' : 'No tender submissions yet' }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-[#f7faff] px-6 py-4 border-t border-[#e4edf7]">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-[13px] text-[#7a93af]">
              Page <span class="font-semibold text-[#183b63]">{{ currentPage }}</span> of 
              <span class="font-semibold text-[#183b63]">{{ totalPages }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- First Page -->
              <button
                @click="changePage(1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="First Page"
              >
                <i class="fas fa-angle-double-left"></i>
              </button>
              
              <!-- Previous Page -->
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <i class="fas fa-chevron-left text-sm"></i>
                <span class="hidden sm:inline">Previous</span>
              </button>

              <!-- Page Numbers -->
              <div class="hidden md:flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="page !== '...' && changePage(page)"
                  :disabled="page === '...'"
                  :class="[
                    'px-4 py-2 rounded-xl border transition',
                    page === currentPage
                      ? 'bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white border-[#2f78dd] font-semibold shadow-md'
                      : page === '...'
                      ? 'bg-white text-[#a4b8cf] border-[#d9e6f3] cursor-default'
                      : 'bg-white text-[#4a6a8a] border-[#d9e6f3] hover:bg-[#f7faff]'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <!-- Next Page -->
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-4 py-2 rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <span class="hidden sm:inline">Next</span>
                <i class="fas fa-chevron-right text-sm"></i>
              </button>

              <!-- Last Page -->
              <button
                @click="changePage(totalPages)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-2 rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Last Page"
              >
                <i class="fas fa-angle-double-right"></i>
              </button>
            </div>
          </div>
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

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('api/submitted/tender');
    users.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// Get initials from name
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Format date for better readability
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format time
function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Download Tender PDF
async function downloadTenderPdf(attachment) {
  if (!attachment) {
    toast.error('No file URL provided.');
    return;
  }
  
  try {
    toast.info('Preparing download...');
    
    // Validate URL format
    const urlObj = new URL(attachment, window.location.origin);
    if (!urlObj.pathname) {
      throw new Error('Invalid file path');
    }

    // Fetch file as blob
    const response = await axios.get(attachment, { responseType: 'blob' });
    if (!response.data || response.data.size === 0) {
      throw new Error('File is empty or unavailable');
    }

    // Extract file extension from URL or default to pdf
    const extension = attachment.split('.').pop()?.split('?')[0] || 'pdf';
    const fileName = `tender_submission_${Date.now()}.${extension}`;

    // Trigger download
    saveAs(response.data, fileName);
    toast.success('File downloaded successfully!');
  } catch (error) {
    console.error('Download failed:', error);
    handleError(error);
  }
}

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

// Total pages calculation
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage) || 1;
});

// Visible page numbers for pagination
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

// Change Page Function
function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.value.map((entry, index) => ({
        No: index + 1,
        Engineer: entry.user?.name || 'N/A',
        'Tender Title': entry.tender?.title || 'N/A',
        'Tender Number': entry.tender?.tender_number || 'N/A',
        'Submitted Document': entry.submission_document || 'N/A',
        'Submitted At': formatDate(entry.created_at),
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submitted Tenders');
    XLSX.writeFile(workbook, 'Submitted_Tenders.xlsx');
    toast.success('Excel file exported successfully!');
  } catch (error) {
    toast.error('Failed to export Excel file');
  }
}

// Export to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF();
    const title = 'Submitted Tender Data';
    const headers = [['No', 'Engineer', 'Tender Title', 'Tender Number', 'Submitted At']];
    const data = filteredData.value.map((entry, index) => [
      index + 1,
      entry.user?.name || 'N/A',
      entry.tender?.title || 'N/A',
      entry.tender?.tender_number || 'N/A',
      formatDate(entry.created_at),
    ]);

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(12);
    autoTable(doc, { 
      head: headers, 
      body: data, 
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save('Submitted_Tenders.pdf');
    toast.success('PDF file exported successfully!');
  } catch (error) {
    toast.error('Failed to export PDF file');
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Bounce animation for download icon */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>