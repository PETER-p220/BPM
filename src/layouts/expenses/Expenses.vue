<template>
  <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
    <PageHeader title="Expense Requests" subtitle="Expense Requests">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
      </div>
    </PageHeader>

    <div class="flex items-center mb-4 space-x-4">
      <!-- Search Input -->
      <input
        type="text"
        v-model="filter"
        placeholder="Search..."
        class="w-full p-2 border rounded sm:w-auto"
      />
    
      <!-- Export to Excel Button -->
      <button @click="exportToExcel" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
            style="background-color:white;color:#edbb99;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
              Export to Excel 
              <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
            </button>
          
            <button @click="exportToPDF" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
            style="background-color:white;color:#edbb99;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
              Export to PDF 
              <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
            </button>
    </div>
    

    <div class="overflow-x-auto">
      <table class="w-full divide-y divide-x-0-gray-200 text-c rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
        <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Agent</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Item/Items</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Amount</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(expense, index) in filteredData" :key="expense.id">
            <td class="table-data">{{ index + 1 }}</td>
            <td class="table-data">{{ expense.application.full_name }}</td>
            <td class="table-data">{{ expense.item }}</td>
            <td class="table-data">{{ expense.description }}</td>
            <td class="table-data">{{ expense.amount }}</td>
            <td class="table-data">
              <p class="text-center btn" :style="{ backgroundColor: expense.status === 'approved' ? '#28a745' : '#ffc107', color: 'white' }">
                {{ expense.status }}
              </p>
            </td>
            <td class="table-data">
              <i @click="editExpense(expense.request_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
            </td>
          </tr>
        </tbody>
      </table>
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
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const expenses = ref([]);
const filter = ref('');

// Fetch expenses when component is mounted
onMounted(async () => {
  await fetchExpenses();
});

// Function to fetch expenses from API
async function fetchExpenses() {
  try {
    const response = await axios.get('api/expenses');  // Ensure this route is correct
    expenses.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter expenses based on input
const filteredData = computed(() => {
  return expenses.value.filter(expense =>
    expense.item.toLowerCase().includes(filter.value.toLowerCase()) ||
    expense.description.toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Navigate to edit expense page
function editExpense(expenseId) {
  router.push({ name: 'EditExpense', params: { request_id: expenseId } });
}



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
  const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(expense => ({
    Item: expense.item,
    Description: expense.description,
    Amount: expense.amount,
    Status: expense.status
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  XLSX.writeFile(workbook, 'Expenses.xlsx');
}

// Export filtered data to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = "Expense Data";
  const headers = [['No', 'Item', 'Description', 'Amount', 'Status']];
  const data = filteredData.value.map((expense, index) => [
    index + 1,
    expense.item,
    expense.description,
    expense.amount,
    expense.status
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(12);
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30
  });

  doc.save('Expenses.pdf');
}
</script>

  
  <style scoped>
  .custom-toast-body {
    display: flex;
    justify-content: space-between;
  }
  
  .confirm-btn, .cancel-btn {
    padding: 6px 12px;
    margin-left: 10px;
    background-color: #21618c;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .confirm-btn {
    background-color: #1a5a63;
  }
  
  .cancel-btn {
    background-color: #b53b0a;
  }
  
  .table-data {
    padding: 8px;
    text-align: left;
    font-size: 14px;
  }
  </style>
  