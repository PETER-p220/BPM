<template>
  <div class="min-h-screen font-['DM_Sans',sans-serif] p-6" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8 rounded-2xl px-6 py-5 shadow-sm border border-[#dce7f3]" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%)">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] flex items-center justify-center text-white shadow-md">
              <i class="fas fa-shield-alt text-lg"></i>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-[#183b63]">Insurance Bonds</h1>
              <p class="text-[13px] text-[#7a93af]">Manage and view all insurance bond records</p>
            </div>
          </div>
          <router-link to="/create/insurance-bond">
            <button class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-[0_12px_24px_rgba(35,96,182,0.22)] hover:shadow-lg transition-all flex items-center gap-2">
              <i class="fas fa-plus"></i>
              <span>Create Insurance Bond</span>
            </button>
          </router-link>
        </div>
      </div>

      <!-- Search and Export Controls -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#dce7f3]">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-[#a4b8cf]"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by tender, email, or date..."
              class="w-full pl-10 pr-4 py-2.5 border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition text-[#183b63] placeholder:text-[#a4b8cf]"
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#1f9d8b]/30 text-[#1f9d8b] bg-[#edfaf7] hover:bg-[#d4f3ec] transition-all flex items-center gap-2"
            >
              <i class="fas fa-file-excel"></i>
              <span class="hidden sm:inline">Excel</span>
            </button>
            <button
              @click="exportToPDF"
              class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#e87461]/30 text-[#e87461] bg-[#fef2f0] hover:bg-[#fde3df] transition-all flex items-center gap-2"
            >
              <i class="fas fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
        <div class="mt-4 text-[13px] text-[#7a93af]">
          Showing <span class="font-semibold text-[#183b63]">{{ paginatedData.length }}</span> of 
          <span class="font-semibold text-[#183b63]">{{ filteredData.length }}</span> results
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#dce7f3]">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#f7faff]">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">No</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Tender Title</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Bond File</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Receiver Email</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Created At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2fa]">
              <tr
                v-for="(insuranceBond, index) in paginatedData"
                :key="insuranceBond.insurance_id"
                class="hover:bg-[#f7faff] transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#67819d] font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm text-[#183b63]">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-[#2f78dd] rounded-full"></div>
                    <span class="font-semibold">{{ insuranceBond.tender.title }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="downloadInsuranceFile(insuranceBond.insurance_file)"
                    class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] hover:shadow-md text-white font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm"
                  >
                    <i class="fas fa-download"></i>
                    <span>Download PDF</span>
                  </button>
                </td>
                <td class="px-6 py-4 text-sm text-[#4a6a8a]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-envelope text-[#a4b8cf] text-xs"></i>
                    <span>{{ insuranceBond.receiver_email || 'N/A' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4a6a8a]">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar text-[#a4b8cf] text-xs"></i>
                    <span>{{ formatDate(insuranceBond.created_at) }}</span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="paginatedData.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="w-14 h-14 bg-[#edf4fb] rounded-2xl flex items-center justify-center mb-4">
                      <i class="fas fa-inbox text-[#7d94ac] text-2xl"></i>
                    </div>
                    <p class="text-[#183b63] text-[15px] font-semibold mb-2">No insurance bonds found</p>
                    <p class="text-[#7a93af] text-[13px]">Try adjusting your search criteria</p>
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
              <button
                @click="changePage(1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="First Page"
              >
                <i class="fas fa-angle-double-left"></i>
              </button>
              
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
                  @click="changePage(page)"
                  :class="[
                    'px-4 py-2 rounded-xl border transition',
                    page === currentPage
                      ? 'bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white border-[#2f78dd] font-semibold shadow-md'
                      : 'bg-white text-[#4a6a8a] border-[#d9e6f3] hover:bg-[#f7faff]'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-4 py-2 rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <span class="hidden sm:inline">Next</span>
                <i class="fas fa-chevron-right text-sm"></i>
              </button>

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

const insuranceBonds = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('api/insurance-bond');
    insuranceBonds.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
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

// Download Insurance Bond File
async function downloadInsuranceFile(fileUrl) {
  try {
    toast.info('Downloading file...');
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    saveAs(response.data, 'insurance_bond.pdf');
    toast.success('File downloaded successfully!');
  } catch (error) {
    handleError(error);
  }
}

// Computed Property for Filtering
const filteredData = computed(() => {
  if (!filter.value) return insuranceBonds.value;
  
  return insuranceBonds.value.filter(entry => {
    const searchText = filter.value.toLowerCase();
    return (
      (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
      (entry.created_at?.toLowerCase() || '').includes(searchText) ||
      (entry.receiver_email?.toLowerCase() || '').includes(searchText)
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
        'Tender Title': entry.tender?.title || 'N/A',
        'Insurance Bond File': entry.insurance_file || 'N/A',
        'Receiver Email': entry.receiver_email || 'N/A',
        'Created At': formatDate(entry.created_at),
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Insurance Bonds');
    XLSX.writeFile(workbook, 'Insurance_Bonds.xlsx');
    toast.success('Excel file exported successfully!');
  } catch (error) {
    toast.error('Failed to export Excel file');
  }
}

// Export to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF();
    const title = 'Insurance Bonds Data';
    const headers = [['No', 'Tender Title', 'Insurance Bond File', 'Receiver Email', 'Created At']];
    const data = filteredData.value.map((entry, index) => [
      index + 1,
      entry.tender?.title || 'N/A',
      entry.insurance_file || 'N/A',
      entry.receiver_email || 'N/A',
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

    doc.save('Insurance_Bonds.pdf');
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
</style>