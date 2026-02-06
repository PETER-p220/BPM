<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <PageHeader subtitle="Insurance Bonds">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/create/insurance-bond">
          <BaseButton style="background-color: #2e4053;" class="w-full sm:w-auto">
            Create Insurance Bond
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>
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
        style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px Accountingpx 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;">
        <thead class="bg-gray-50 dark:bg-neutral-700"
          style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Insurance Bond File</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Receiver Email</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(insuranceBond, index) in paginatedData" :key="insuranceBond.insurance_id">
            <td class="table-data">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="table-data">{{ insuranceBond.tender.title }}</td>
            <td class="table-data">
              <button class="btn-block btn" style="width:140px;background-color:#27ae60;color:white;border-radius:17px" 
                @click="downloadInsuranceFile(insuranceBond.insurance_file)">
                Download PDF
              </button>
            </td>
            <td class="table-data">{{ insuranceBond.receiver_email || 'N/A' }}</td>
            <td class="table-data">{{ insuranceBond.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-4">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)" 
        class="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50">
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }}</span>
      <button 
        :disabled="currentPage * itemsPerPage >= filteredData.length" 
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

// Download Insurance Bond File
async function downloadInsuranceFile(fileUrl) {
  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    saveAs(response.data, 'insurance_bond.pdf');
  } catch (error) {
    handleError(error);
  }
}

// Computed Property for Filtering
const filteredData = computed(() => {
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

// Change Page Function
function changePage(page) {
  currentPage.value = page;
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
  const worksheet = XLSX.utils.json_to_sheet(
    paginatedData.value.map((entry, index) => ({
      No: (currentPage.value - 1) * itemsPerPage + index + 1,
      TenderTitle: entry.tender?.title || 'N/A',
      InsuranceBondFile: entry.insurance_file || 'N/A',
      ReceiverEmail: entry.receiver_email || 'N/A',
      CreatedAt: entry.created_at || 'N/A',
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Insurance Bonds');
  XLSX.writeFile(workbook, 'Insurance_Bonds.xlsx');
}

// Export to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = 'Insurance Bonds Data';
  const headers = [['No', 'Tender Title', 'Insurance Bond File', 'Receiver Email', 'Created At']];
  const data = paginatedData.value.map((entry, index) => [
    (currentPage.value - 1) * itemsPerPage + index + 1,
    entry.tender?.title || 'N/A',
    entry.insurance_file || 'N/A',
    entry.receiver_email || 'N/A',
    entry.created_at || 'N/A',
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(12);
  autoTable(doc, { head: headers, body: data, startY: 30 });

  doc.save('Insurance_Bonds.pdf');
}
</script>