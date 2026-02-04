<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px; margin-top: 60px;">
      <PageHeader title="Award Letter Reports" subtitle="Please search report by entering date range" class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-400">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <div class="flex flex-col mb-2">
            <label for="fromDate" class="mb-1">From Date</label>
            <input
              type="date"
              v-model="dateRange.from"
              class="p-2 border rounded"
              id="fromDate"
              required
            />
          </div>
          <div class="flex flex-col mb-2">
            <label for="toDate" class="mb-1">To Date</label>
            <input
              type="date"
              v-model="dateRange.to"
              class="p-2 border rounded"
              id="toDate"
              required
            />
          </div>
          <div class="flex space-x-2 mt-4 sm:mt-0">
            <button
              @click="searchData"
              class="p-2 py-2 bg-blue-500 text-white rounded"
              style="height: 42px; margin-top: 27px; border-radius: 15px;"
            >
              Search
            </button>
            <button
              @click="exportToExcel"
              class="p-2 bg-green-500 text-white rounded ml-2"
              style="height: 42px; margin-top: 27px; border-radius: 15px;"
            >
              Export to Excel
            </button>
            <button
              @click="exportToPDF"
              class="p-2 bg-red-500 text-white rounded ml-2"
              style="height: 42px; margin-top: 27px; border-radius: 15px;"
            >
              Print to PDF
            </button>
          </div>
        </div>
      </PageHeader>
  
      <div class="flex flex-col sm:flex-row sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search..."
          class="w-full p-2 border rounded sm:w-auto"
        />
      </div>
  
      <div v-if="!isSearched" class="text-center text-gray-500">
        Please select a date range and click Search to view reports.
      </div>
      <div v-else-if="isSearched && awardLetters.length === 0" class="text-center text-gray-500">
        No reports found for the selected date range.
      </div>
      <div v-else class="overflow-x-auto" style="margin-top: 30px;">
        <table class="min-w-full divide-y py-5 divide-gray-200 rounded-lg" id="data-table">
          <thead class="bg-teal-10">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created By</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Award Letter File</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(award, index) in paginatedData" :key="award.award_id">
              <td class="px-4 py-2">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-4 py-2">{{ award.tender.title }}</td>
              <td class="px-4 py-2">{{ award.user.name }}</td>
              <td class="px-4 py-2 cursor-pointer">
                <button
                  class="btn-block btn"
                  style="width:140px; background-color:#27ae60; color:white; border-radius:17px"
                  @click="downloadAwardFile(award.award_letter_file)"
                >
                  Download PDF
                </button>
              </td>
              <td class="px-4 py-2">{{ formatDate(award.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="isSearched && awardLetters.length > 0" class="flex justify-center mt-4">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <span class="px-4 py-2">Page {{ currentPage }}</span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage * itemsPerPage >= filteredData.length"
          class="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  import * as XLSX from '@e965/xlsx';
  import jsPDF from 'jspdf';
  import { saveAs } from 'file-saver';
  import autoTable from 'jspdf-autotable';
  
  const toast = useToast();
  
  const awardLetters = ref([]);
  const filter = ref('');
  const dateRange = ref({ from: '', to: '' });
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const isSearched = ref(false);
  
  // Search function triggered by button
  async function searchData() {
    if (!dateRange.value.from || !dateRange.value.to) {
      toast.error('Please select both From and To dates.');
      return;
    }
  
    isSearched.value = true;
    try {
      const params = {
        from: dateRange.value.from,
        to: dateRange.value.to
      };
      const response = await axios.get('api/awards-reports', { params });
      awardLetters.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Download Award Letter File
  async function downloadAwardFile(fileUrl) {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      saveAs(response.data, 'award_letter.pdf');
    } catch (error) {
      handleError(error);
    }
  }
  
  // Format Date
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Computed Property for Filtering
  const filteredData = computed(() => {
    return awardLetters.value.filter(entry => {
      const searchText = filter.value.toLowerCase();
      return (
        (entry.tender?.title?.toLowerCase() || '').includes(searchText) ||
        (entry.user?.name?.toLowerCase() || '').includes(searchText) ||
        (entry.created_at?.toLowerCase() || '').includes(searchText)
      );
    });
  });
  
  // Computed Property for Paginated Data
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredData.value.slice(start, start + itemsPerPage);
  });
  
  // Change Page Function
  function changePage(page) {
    if (page > 0 && page <= Math.ceil(filteredData.value.length / itemsPerPage)) {
      currentPage.value = page;
    }
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
    if (!isSearched.value || awardLetters.value.length === 0) {
      toast.error('Please search for reports before exporting.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      paginatedData.value.map((entry, index) => ({
        No: (currentPage.value - 1) * itemsPerPage + index + 1,
        TenderTitle: entry.tender?.title || 'N/A',
        CreatedBy: entry.user?.name || 'N/A',
        AwardLetterFile: entry.award_letter_file || 'N/A',
        CreatedAt: formatDate(entry.created_at) || 'N/A',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Award Letter Reports');
    XLSX.writeFile(workbook, 'Award_Letter_Reports.xlsx');
  }
  
  // Print to PDF
  function exportToPDF() {
    if (!isSearched.value || awardLetters.value.length === 0) {
      toast.error('Please search for reports before printing.');
      return;
    }
    const doc = new jsPDF();
    const title = 'Award Letter Reports Data';
    const headers = [['No', 'Tender Title', 'Created By', 'Created At']]; // Excluded Award Letter File
    const data = paginatedData.value.map((entry, index) => [
      (currentPage.value - 1) * itemsPerPage + index + 1,
      entry.tender?.title || 'N/A',
      entry.user?.name || 'N/A',
      formatDate(entry.created_at) || 'N/A',
    ]);
  
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(12);
    autoTable(doc, { 
      head: headers, 
      body: data, 
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [46, 64, 83] },
      styles: { fontSize: 10 }
    });
  
    doc.save('Award_Letter_Reports.pdf');
  }
  </script>