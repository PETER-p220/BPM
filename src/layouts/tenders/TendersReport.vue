<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px;margin-top: 60px;">
      <PageHeader title="Tender Reports" subtitle="Please search  report by enter date range" class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-400">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <div class="flex flex-col mb-2">
            <label for="fromDate" class="mb-1">From Date</label>
            <input type="date" v-model="fromDate" class="p-2 border rounded" id="fromDate" />
          </div>
  
          <div class="flex flex-col mb-2">
            <label for="toDate" class="mb-1">To Date</label>
            <input type="date" v-model="toDate" class="p-2 border rounded" id="toDate" />
          </div>
  
          <div class="flex flex-col mb-2">
            <label for="tenderType" class="mb-1">Tender Type</label>
            <select v-model="selectedTenderType" class="p-2 border rounded" id="tenderType">
              <option value="all-tenders">All Tenders</option>
              <option v-for="type in tenderTypes" :key="type.type_id" :value="type.tender_type">
                {{ type.tender_type }}
              </option>
            </select>
          </div>
  
          <div class="flex space-x-2 mt-4 sm:mt-0">
            <button @click="fetchReport" class="p-2 py-2 bg-blue-500 text-white rounded" style="height: 42px;margin-top: 27px;border-radius: 15px;">
              Fetch Report
            </button>
  
            <button @click="exportToExcel" class="p-2 bg-green-500 text-white rounded ml-2"  style="height: 42px;margin-top: 27px;border-radius: 15px;">
              Export to Excel
            </button>
            <button @click="exportToPDF" class="p-2 bg-red-500 text-white rounded ml-2" style="height: 42px;margin-top: 27px;border-radius: 15px;">
              Export to PDF
            </button>
          </div>
        </div>
      </PageHeader>
  
      <div class="overflow-x-auto" style="margin-top: 30px;">
        <table class="min-w-full divide-y py-5 divide-gray-200 rounded-lg" id="tenderTable">
          <thead class="bg-teal-10">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Title</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Type</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Number</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Procurement Entity</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender File</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date of Publication</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date of Submission</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Expiration Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tender, index) in paginatedTenders" :key="tender.tender_id">
              <td class="px-4 py-2">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-4 py-2">{{ tender.title }}</td>
              <td class="px-4 py-2">{{ tender.tender_type }}</td>
              <td class="px-4 py-2">{{ tender.tender_number }}</td>
              <td class="px-4 py-2">{{ tender.procurement_entity }}</td>
              <td class="px-4 py-2 cursor-pointer" @click="downloadTenderPdf(tender.attachment)">
                <i class="fas fa-download"></i> Download File
              </td>
              <td class="px-4 py-2">{{ formatDate(tender.date_of_Publication) }}</td>
              <td class="px-4 py-2">{{ formatDate(tender.bid_submission) }}</td>
              <td class="px-4 py-2">
                <button :style="getExpirationStyle(tender.expired_at)">
                  {{ formatDate(tender.expired_at, true) }}
                </button>
              </td>
              <td class="px-4 py-2">{{ formatDate(tender.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="!filteredTenders.length" class="text-center text-gray-500">
        No records found.
      </div>
  
      <div class="flex justify-center mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded">
          Previous
        </button>
        <span class="px-4 py-2">Page {{ currentPage }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage * itemsPerPage >= filteredTenders.length" class="px-4 py-2 bg-gray-300 rounded">
          Next
        </button>
      </div>
  
      <div v-if="toastMessage" :class="toastClass" class="fixed bottom-0 right-0 m-4 p-4 rounded">
        {{ toastMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from '@/axios';
  import * as XLSX from '@e965/xlsx';
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable';
  
  const tenders = ref([]);
  const tenderTypes = ref([]);
  const fromDate = ref('');
  const toDate = ref('');
  const selectedTenderType = ref('all-tenders');
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const toastMessage = ref('');
  const toastClass = ref('bg-green-500 text-white');
  
  onMounted(async () => {
    await fetchTenderTypes();
  });
  
  async function fetchTenderTypes() {
    try {
      const response = await axios.get('api/types/tenders');
      tenderTypes.value = response.data.data;
    } catch (error) {
      console.error('Error fetching tender types:', error);
    }
  }
  
  async function fetchReport() {
    try {
      const response = await axios.get('api/reportTenders', {
        params: {
          from: fromDate.value,
          to: toDate.value,
          tender_type: selectedTenderType.value,
        }
      });
      if (response.data.status) {
        tenders.value = response.data.data;
        toastMessage.value = 'Tenders fetched successfully.';
        toastClass.value = 'bg-green-500 text-white';
      } else {
        toastMessage.value = 'Tender not found.';
        toastClass.value = 'bg-red-500 text-white';
      }
    } catch (error) {
      toastMessage.value = 'An error occurred while fetching the report.';
      toastClass.value = 'bg-red-500 text-white';
      console.error('Error fetching report:', error);
    } finally {
      setTimeout(() => {
        toastMessage.value = '';
      }, 3000);
    }
  }
  
  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(tenders.value.map((tender, index) => ({
      No: index + 1,
      Title: tender.title,
      'Tender Type': tender.tender_type,
      'Tender Number': tender.tender_number,
      'Procurement Entity': tender.procurement_entity,
      'Tender File': 'Download File',
      'Date of Publication': formatDate(tender.date_of_Publication),
      'Date of Submission': formatDate(tender.bid_submission),
      'Expiration Date': formatDate(tender.expired_at),
      'Created At': formatDate(tender.created_at),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tenders');
    XLSX.writeFile(wb, 'tenders.xlsx');
  }
  
  function exportToPDF() {
    try {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [['No', 'Title', 'Tender Type', 'Tender Number', 'Procurement Entity', 'Tender File', 'Date of Publication', 'Date of Submission', 'Expiration Date', 'Created At']],
        body: tenders.value.map((tender, index) => ([
          index + 1,
          tender.title,
          tender.tender_type,
          tender.tender_number,
          tender.procurement_entity,
          'Download File',
          formatDate(tender.date_of_Publication),
          formatDate(tender.bid_submission),
          formatDate(tender.expired_at),
          formatDate(tender.created_at),
        ])),
      });
      doc.save('tenders.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toastMessage.value = 'Error generating PDF. Please try again.';
      toastClass.value = 'bg-red-500 text-white';
    }
  }
  
  const filteredTenders = computed(() => {
    return tenders.value; // Adjust filtering logic as needed
  });
  
  const paginatedTenders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredTenders.value.slice(start, start + itemsPerPage);
  });
  
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  }
  
  function getExpirationStyle(expiredAt) {
    // Logic for styling based on expiration
  }
  
  function changePage(newPage) {
    if (newPage > 0 && newPage <= Math.ceil(filteredTenders.value.length / itemsPerPage)) {
      currentPage.value = newPage;
    }
  }
  
  function downloadTenderPdf(attachment) {
    // Implement the logic to download the tender PDF
    console.log(`Downloading tender PDF from: ${attachment}`);
  }
  </script>
  
  <style scoped>
  .toast {
    transition: opacity 0.5s;
  }
  </style>
  