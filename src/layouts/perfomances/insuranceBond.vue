<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Insurance Bonds</h1>
            <p class="text-gray-600">Manage and view all insurance bond records</p>
          </div>
          <router-link to="/create/insurance-bond">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center gap-2 hover:scale-105">
              <i class="fas fa-plus"></i>
              <span>Create Insurance Bond</span>
            </button>
          </router-link>
        </div>
      </div>

      <!-- Search and Export Controls -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by tender, email, or date..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <!-- Export Buttons -->
          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="bg-green-50 hover:bg-green-100 text-green-700 font-medium px-5 py-3 rounded-lg border border-green-200 transition-all duration-200 flex items-center gap-2 hover:shadow-md"
            >
              <i class="fas fa-file-excel text-green-600"></i>
              <span class="hidden sm:inline">Export Excel</span>
            </button>
            <button
              @click="exportToPDF"
              class="bg-red-50 hover:bg-red-100 text-red-700 font-medium px-5 py-3 rounded-lg border border-red-200 transition-all duration-200 flex items-center gap-2 hover:shadow-md"
            >
              <i class="fas fa-file-pdf text-red-600"></i>
              <span class="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mt-4 text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-800">{{ paginatedData.length }}</span> of 
          <span class="font-semibold text-gray-800">{{ filteredData.length }}</span> results
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  No
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tender Title
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Bond File
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Receiver Email
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(insuranceBond, index) in paginatedData"
                :key="insuranceBond.insurance_id"
                class="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-800">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span class="font-medium">{{ insuranceBond.tender.title }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="downloadInsuranceFile(insuranceBond.insurance_file)"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shadow-sm hover:shadow-md"
                  >
                    <i class="fas fa-download"></i>
                    <span>Download PDF</span>
                  </button>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-envelope text-gray-400 text-xs"></i>
                    <span>{{ insuranceBond.receiver_email || 'N/A' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar text-gray-400 text-xs"></i>
                    <span>{{ formatDate(insuranceBond.created_at) }}</span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="paginatedData.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <i class="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-lg font-medium mb-1">No insurance bonds found</p>
                    <p class="text-gray-400 text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-600">
              Page <span class="font-semibold text-gray-800">{{ currentPage }}</span> of 
              <span class="font-semibold text-gray-800">{{ totalPages }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="changePage(1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="First Page"
              >
                <i class="fas fa-angle-double-left"></i>
              </button>
              
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
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
                    'px-4 py-2 rounded-lg border transition',
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <span class="hidden sm:inline">Next</span>
                <i class="fas fa-chevron-right text-sm"></i>
              </button>

              <button
                @click="changePage(totalPages)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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