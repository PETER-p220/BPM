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

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <input
        v-model="filter"
        type="text"
        placeholder="Search by tender title or status..."
        class="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
      />

      <div class="flex flex-wrap gap-3">
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
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tender</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Letter File</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issued Date</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
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
                <i class="fas fa-inbox text-4xl text-gray-300"></i>
                <p>No appointment letters found</p>
                <p class="text-sm" v-if="filter">Try adjusting your search</p>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="(letter, index) in paginatedData"
            :key="letter.letter_id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-gray-700 whitespace-nowrap">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-6 py-4 text-gray-900 font-medium">
              {{ letter.tender?.title || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold',
                  letter.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  letter.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                  letter.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                ]"
              >
                <i 
                  :class="[
                    'fas fa-circle text-xs mr-1.5',
                    letter.status === 'pending' ? 'text-yellow-600' :
                    letter.status === 'accepted' ? 'text-green-600' :
                    letter.status === 'rejected' ? 'text-red-600' :
                    'text-gray-600'
                  ]"
                ></i>
                {{ letter.status ? letter.status.charAt(0).toUpperCase() + letter.status.slice(1) : 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button
                v-if="letter.letter_file"
                @click="downloadLetterFile(letter.letter_file)"
                class="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <i class="fas fa-download"></i>
                Download PDF
              </button>
              <span v-else class="text-gray-400 text-sm">No file</span>
            </td>
            <td class="px-6 py-4 text-gray-600 whitespace-nowrap">
              <div class="flex flex-col">
                <span class="font-medium">{{ formatDate(letter.created_at) }}</span>
                <span class="text-xs text-gray-500">{{ formatTime(letter.created_at) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <router-link
                v-if="letter.status === 'pending'"
                :to="{ name: 'AcceptAppointmentLetter', params: { letter_id: letter.letter_id } }"
                class="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <i class="fas fa-check mr-1.5"></i>
                Accept
              </router-link>
              <button
                v-else
                @click="viewDetails(letter)"
                class="inline-flex items-center justify-center px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i class="fas fa-eye mr-1.5"></i>
                View
              </button>
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
    <div v-if="lastUpdated" class="text-xs text-center text-gray-500 pt-2">
      Last updated: {{ lastUpdated }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated } from 'vue';
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
const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(false);
const lastUpdated = ref('');

onMounted(async () => {
  await fetchData();
});

// Refresh data when component is activated (when navigating back)
onActivated(async () => {
  await fetchData();
});

async function fetchData() {
  isLoading.value = true;
  try {
    // Fetch only current user's appointment letters using correct route name
    const response = await axios.get('api/logged-user-appointment-letters');
    appointmentLetters.value = response.data.data || [];
    updateLastUpdated();
    toast.success('Your appointment letters loaded successfully');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
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
  if (!filter.value.trim()) return appointmentLetters.value;

  const search = filter.value.toLowerCase().trim();
  return appointmentLetters.value.filter((entry) => {
    return (
      entry.tender?.title?.toLowerCase().includes(search) ||
      entry.status?.toLowerCase().includes(search)
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
      Tender: entry.tender?.title || 'N/A',
      Status: entry.status || 'N/A',
      LetterFile: entry.letter_file ? 'Available' : 'N/A',
      IssuedDate: formatDate(entry.created_at) || 'N/A',
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

    const tableData = filteredData.value.map((entry, index) => [
      index + 1,
      entry.tender?.title || 'N/A',
      entry.status || 'N/A',
      entry.letter_file ? 'Available' : 'N/A',
      formatDate(entry.created_at) || 'N/A',
    ]);

    autoTable(doc, {
      head: [['No', 'Tender Title', 'Status', 'Letter File', 'Issued Date']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 10 },
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
button, a, input {
  transition: all 0.2s ease-in-out;
}

/* Table row hover effect */
tbody tr {
  transition: background-color 0.15s ease;
}
</style>