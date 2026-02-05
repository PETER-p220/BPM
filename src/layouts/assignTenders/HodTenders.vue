<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 23px">
      <PageHeader title="Assigned Tenders" subtitle="Assigned Tenders">
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
          style="background-color:white;color:#229954 ;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          Export to Excel
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
        </button>
  
        <button @click="exportToPDF" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color:white;color:#229954 ;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          Export to PDF
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
        </button>
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;">
          <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is assigned To</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Title</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Expire Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is assigned?</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">TenderFile</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is Accepted?</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Assigned At</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(assignedtender, index) in filteredData" :key="assignedtender.assign_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ assignedtender.user.name }}</td>
              <td class="table-data">{{ assignedtender.tender.title }}</td>
              <td class="table-data">
                <button class="btn-block btn" style="width:100px;background-color:#c0392b;color:white;border-radius:17px">{{ assignedtender.expire_date }}</button>
              </td>
              <td class="table-data">
                <button class="bg-red-500 btn" style="width:100px;background-color:#f4d03f;color:white;border-radius:17px">{{ assignedtender.status }}</button>
              </td>
              <td class="table-data">
                <button 
                  class="btn-block btn" 
                  style="width:140px;background-color:#27ae60;color:white;border-radius:17px" 
                  @click="downloadTenderPdf(assignedtender.tender.attachment)">
                  Download Pdf File
                </button>
              </td>
              <td class="table-data">
                <button 
                class="btn-block btn" 
                style="width:140px;background-color:#138d75;color:white">
                {{ assignedtender.recieved_status }}</button>
            </td>
            <td class="table-data">{{ assignedtender.date_of_submission }}</td>
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

const users = ref([]);
const filter = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('api/hod/tenders'); // Ensure this is the correct API endpoint
    users.value = response.data.data; // Assuming 'data' contains the list of tenders
  } catch (error) {
    handleError(error);
  }
}

// Function to download tender PDF from the provided attachment URL and save it locally 
async function downloadTenderPdf(attachment) {
  try {
    const response = await axios.get(attachment, { responseType: 'blob' });
    const fileBlob = response.data;
    saveAs(fileBlob, 'tender_attachment.pdf'); // Download the file with FileSaver.js
  } catch (error) {
    handleError(error);
  }
}



// Computed property to filter the data
const filteredData = computed(() => {
  return users.value.filter(entry =>
    entry.tender.title.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.user.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.status.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.recieved_status.toLowerCase().includes(filter.value.toLowerCase())
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
    TenderTitle: entry.tender.title,
    UserName: entry.user.name,
    DateOfSubmission: entry.date_of_submission,
    ExpireDate: entry.expire_date,
    Status: entry.status,
    RecievedStatus: entry.recieved_status
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tender Assignments');
  XLSX.writeFile(workbook, 'TenderAssignments.xlsx');
}

// Export filtered data to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = "Tender Assignment Data";
  const headers = [['No', 'Tender Title', 'User Name', 'Date of Submission', 'Expire Date', 'Status', 'Received Status']];
  const data = filteredData.value.map((entry, index) => [
    index + 1,
    entry.tender.title,
    entry.user.name,
    entry.date_of_submission,
    entry.expire_date,
    entry.status,
    entry.recieved_status
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(12);
  autoTable(doc, { head: headers, body: data, startY: 30 });

  doc.save('TenderAssignments.pdf');
}

// Function to download the attachment file
function downloadAttachment(filename) {
  const link = document.createElement('a');
  link.href = `/uploads/${filename}`;  // Ensure this points to the correct file path
  link.download = filename;
  link.click();
}
</script>
