<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <PageHeader subtitle="Requests for project">
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
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Engineer</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Item</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Vendor</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Vendor Account Number</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Vendor Account Name</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Amount Requested</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">CreatedAt</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(request, index) in paginatedRequests" :key="request.request_id">
            <td class="table-data">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="table-data">{{ request.created_by }}</td>
            <td class="table-data">{{ request.item }}</td>
            <td class="table-data">{{ request.vendor }}</td>
            <td class="table-data">{{ request.vendor_account_number }}</td>
            <td class="table-data">{{ request.vendor_account_name }}</td>
            <td class="table-data">{{ request.amount_requested }}</td>
            <td class="table-data">
              <button :style="{ backgroundColor: request.is_approved === 'approved' ? 'green' : (request.is_approved === 'rejected' ? '#a93226' : '#f1c40f'), color: 'white' }" class="px-2 py-1 rounded">
  {{ request.is_approved }}
</button>

            </td>
            <td class="table-data">{{ request.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center mt-4">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)" 
        class="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50">
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }}</span>
      <button 
        :disabled="currentPage * itemsPerPage >= filteredRequests.length" 
        @click="changePage(currentPage + 1)" 
        class="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 disabled:opacity-50">
        Next
      </button>
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

const requests = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Fetch data on component mount
onMounted(async () => {
  await fetchRequests();
});

async function fetchRequests() {
  try {
    const response = await axios.get('api/approved/requests');
    requests.value = response.data.data.map(request => ({
      request_id: request.request_id,
      item: JSON.parse(request.item).join(', '), // Parse the item array
      amount_requested: request.amount_requested,
      created_by: request.user.name,
      vendor: request.vender,
      vendor_account_number: request.vendor_account_number,
      vendor_account_name: request.vender_account_name,
      is_approved: request.is_approved, // Added to store approval status
      created_at: request.created_at, // Added to store created date
    }));
  } catch (error) {
    handleError(error);
  }
}

// Filter requests based on search input
const filteredRequests = computed(() => {
  return requests.value.filter(entry =>
    entry.item.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.created_by.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.vendor.toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Paginated requests based on current page
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRequests.value.slice(start, start + itemsPerPage);
});

// Handle pagination change
function changePage(page) {
  if (page > 0 && page <= Math.ceil(filteredRequests.value.length / itemsPerPage)) {
    currentPage.value = page;
  }
}

// Handle errors during requests
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Export data to Excel
function exportToExcel() {
  try {
    const worksheet = XLSX.utils.json_to_sheet(filteredRequests.value.map(entry => ({
      Item: entry.item,
      Vendor: entry.vendor,
      VendorAccountNumber: entry.vendor_account_number,
      VendorAccountName: entry.vendor_account_name,
      AmountRequested: entry.amount_requested,
      CreatedBy: entry.created_by,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
    XLSX.writeFile(workbook, 'Requests.xlsx');
  } catch (error) {
    handleError(error);
  }
}

// Export data to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF();
    const tableData = filteredRequests.value.map(entry => [
      entry.item,
      entry.vendor,
      entry.vendor_account_number,
      entry.vendor_account_name,
      entry.amount_requested,
      entry.created_by,
    ]);
    autoTable(doc, {
      head: [['Item', 'Vendor', 'Vendor Account Number', 'Vendor Account Name', 'Amount Requested', 'Created By']],
      body: tableData,
    });
    doc.save('Requests.pdf');
  } catch (error) {
    handleError(error);
  }
}
</script>
