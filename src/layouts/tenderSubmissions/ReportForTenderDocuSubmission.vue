<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px; margin-top: 60px;">
      <PageHeader title="Submitted  Tenders" subtitle="Please search report by entering date range" class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-400">
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
              <option value="all-tenders">All Tender Types</option>
              <option v-for="type in tenderTypes" :key="type.tender_type" :value="type.tender_type">
                {{ type.tender_type }}
              </option>
            </select>
          </div>
  
          <div class="flex space-x-2 mt-4 sm:mt-0">
            <button @click="fetchReport" class="p-2 py-2 bg-blue-500 text-white rounded" style="height: 42px; margin-top: 27px; border-radius: 15px;">
              Fetch Report
            </button>
  
            <button @click="exportToExcel" class="p-2 bg-green-500 text-white rounded ml-2" style="height: 42px; margin-top: 27px; border-radius: 15px;">
              Export to Excel
            </button>
            <button @click="exportToPDF" class="p-2 bg-red-500 text-white rounded ml-2" style="height: 42px; margin-top: 27px; border-radius: 15px;">
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
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Engineer</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Title</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Number</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Submission Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(submission, index) in paginatedSubmissions" :key="submission.submission_id">
              <td class="px-4 py-2">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-4 py-2">{{ submission.user.name }}</td>
              <td class="px-4 py-2">{{ submission.tender.title }}</td>
              <td class="px-4 py-2">{{ submission.tender.tender_number }}</td>
              <td class="px-4 py-2">{{ submission.is_submitted }}</td>
              <td class="px-4 py-2">{{ formatDate(submission.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="!filteredSubmissions.length" class="text-center text-gray-500">
        No records found.
      </div>
  
      <div class="flex justify-center mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded">
          Previous
        </button>
        <span class="px-4 py-2">Page {{ currentPage }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage * itemsPerPage >= filteredSubmissions.length" class="px-4 py-2 bg-gray-300 rounded">
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
  import 'jspdf-autotable';
  
  const submissions = ref([]);
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
      const response = await axios.get('api/tender/types/for-submittedtenders');
      tenderTypes.value = response.data.data;
    } catch (error) {
      console.error('Error fetching tender types:', error);
    }
  }
  
  async function fetchReport() {
    try {
      const response = await axios.get('api/submittedtenders-reports', {
        params: {
          from: fromDate.value,
          to: toDate.value,
          tender_type: selectedTenderType.value,
        },
      });
      submissions.value = response.data.data;
      toastMessage.value = response.data.message;
    } catch (error) {
      console.error('Error fetching report:', error);
      toastMessage.value = error.response?.data?.message || 'An error occurred while fetching the report.';
    }
  }
  
  const filteredSubmissions = computed(() => {
    return submissions.value; // Implement filtering logic if needed
  });
  
  const paginatedSubmissions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredSubmissions.value.slice(start, start + itemsPerPage);
  });
  
  function changePage(page) {
    currentPage.value = page;
  }
  
  function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  }
  
  function exportToExcel() {
    const dataForExport = filteredSubmissions.value.map((submission, index) => ({
      No: (currentPage.value - 1) * itemsPerPage + index + 1,
      Engineer: submission.user.name,
      Title: submission.tender.title,
      'Tender Number': submission.tender.tender_number,
      'Submission Status': submission.is_submitted,
      'Created At': formatDate(submission.created_at),
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tender Submissions');
    XLSX.writeFile(workbook, 'tender_submissions.xlsx');
  }
  
  function exportToPDF() {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['No', 'Engineer', 'Title', 'Tender Number', 'Submission Status', 'Submitted At']],
      body: filteredSubmissions.value.map((submission, index) => [
        (currentPage.value - 1) * itemsPerPage + index + 1,
        submission.user.name,
        submission.tender.title,
        submission.tender.tender_number,
        submission.is_submitted,
        formatDate(submission.created_at),
      ]),
    });
    doc.save('tender_submissions.pdf');
  }
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  