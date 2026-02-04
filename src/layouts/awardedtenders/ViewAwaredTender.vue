<template>
    <div class="p-4 space-y-4" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <PageHeader subtitle="Awarded Tenders">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
        </div>
      </PageHeader>
  
      <div class="flex items-center mb-4 space-x-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search..."
          class="w-full p-2 border rounded sm:w-auto"
        />
  
        <button @click="exportToExcel" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color:white;color:#229954;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          Export to Excel
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
        </button>
  
        <button @click="exportToPDF" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color:white;color:#229954;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          Export to PDF
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
        </button>
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table"
          style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;">
          <thead class="bg-gray-50 dark:bg-neutral-700"
            style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is Sent-to</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Awarded Document</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Sent Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(award, index) in filteredData" :key="award.award_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ award.user_name }}</td>
              <td class="table-data">
                <button class="btn-block btn" style="width:230px;background-color:white;color:teal;border-radius:17px" @click="downloadAwardDocument(award.awarded_document)">
                  Download Awarded Document
                </button>
              </td>
              <td class="table-data"><button class="btn-block btn" style="width:110px;background-color:#27ae60;color:white;border-radius:17px">{{ award.is_sent }}</button></td>
              <td class="table-data">{{ award.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/axios'; // Ensure this points to your axios instance
  import { useToast } from 'vue-toastification';
  import * as XLSX from '@e965/xlsx';
  import jsPDF from 'jspdf';
  import { saveAs } from 'file-saver';
  import autoTable from 'jspdf-autotable'; // Import autoTable for table formatting in PDF
  
  const router = useRouter();
  const toast = useToast();
  
  const awards = ref([]);
  const filter = ref('');
  
  // Fetch data when component is mounted
  onMounted(async () => {
    await fetchAwardedTenders();
  });
  
  async function fetchAwardedTenders() {
    try {
      const response = await axios.get('api/my/awarded'); // API to fetch awarded tenders
      awards.value = response.data.data; // Assuming 'data' contains the list of awarded tenders
    } catch (error) {
      handleError(error);
    }
  }
  
  // Function to download the awarded document
  async function downloadAwardDocument(documentUrl) {
    try {
      const response = await axios.get(documentUrl, { responseType: 'blob' });
      const fileBlob = response.data;
      saveAs(fileBlob, 'awarded_tender_document.pdf'); // Download the file with FileSaver.js
    } catch (error) {
      handleError(error);
    }
  }
  
 
  
  // Computed property to filter the data
  const filteredData = computed(() => {
    return awards.value.filter(entry =>
      entry.user_name.toLowerCase().includes(filter.value.toLowerCase()) ||
      entry.is_sent.toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  
  // Handle errors and display as toast messages
  function handleError(error) {
    let message = 'An unexpected error occurred';
  
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = error.response.statusText;
      }
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
  
    toast.error(message);
  }
  
  // Export filtered data to Excel
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(entry => ({
      AwardedBy: entry.user_name,
      AwardedDocument: entry.awarded_document,
      SentStatus: entry.is_sent,
      DateOfAward: entry.created_at
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Awarded Tenders');
    XLSX.writeFile(workbook, 'AwardedTenders.xlsx');
  }
  
  // Export filtered data to PDF
  function exportToPDF() {
    const doc = new jsPDF();
    const title = "Awarded Tender Data";
    const headers = [['No', 'Awarded By', 'Awarded Document', 'Sent Status', 'Date of Award']];
    const data = filteredData.value.map((entry, index) => [
      index + 1,
      entry.user_name,
      entry.awarded_document,
      entry.is_sent,
      entry.created_at
    ]);
  
    doc.text(title, 14, 16);
    autoTable(doc, { head: headers, body: data });
    doc.save('AwardedTenders.pdf');
  }
  </script>
  