<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 23px">
      <!-- Page Header Section -->
      <PageHeader subtitle="Attendance Report">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <router-link to="/create/userattendance">
            <BaseButton @click="addNewUser" class="w-full sm:w-auto bg-[#2e4053] text-white">
              Create Attendance
              <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
            </BaseButton>
          </router-link>
        </div>
      </PageHeader>
  
      <!-- Date Selector and Fetch Report Button -->
      <div class="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <input
          type="date"
          v-model="selectedDate"
          class="p-2 border rounded"
          placeholder="Select Date"
        />
        <button @click="fetchReport" class="flex items-center p-2 space-x-2 text-white rounded bg-teal-600">
          Fetch Report
        </button>
      </div>
  
      <!-- Export Buttons Section -->
      <div class="flex items-center mb-4 space-x-4">
        <button @click="exportToExcel" class="flex items-center p-2 space-x-2 text-teal rounded hover:bg-green-600">
          Export to Excel
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
        </button>
  
        <button @click="exportToPDF" class="flex items-center p-2 space-x-2 text-teal rounded hover:bg-red-600">
          Export to PDF
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
        </button>
      </div>
  
      <!-- Attendance Report Table -->
      <div class="overflow-x-auto bg-white p-4 rounded-lg shadow-md" v-if="reportData.length > 0">
        <table class="min-w-full divide-y divide-gray-200 rounded-lg dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Name</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Attendance Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Reason (if absent)</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attendance, index) in reportData" :key="attendance.att_id">
              <td class="px-6 py-3">{{ index + 1 }}</td>
              <td class="px-6 py-3">{{ attendance.user.name }}</td>
              <td class="px-6 py-3">{{ attendance.is_present }}</td>
              <td class="px-6 py-3">{{ attendance.if_not_present_and_have_reason || 'N/A' }}</td>
              <td class="px-6 py-3">{{ attendance.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- No data message if reportData is empty -->
      <div v-else class="text-center text-gray-500">
        No attendance data available for the selected date.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from '@/axios'; // Ensure this points to your axios instance
  import { useToast } from 'vue-toastification';
  import * as XLSX from '@e965/xlsx';
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable'; // Import autoTable for table formatting in PDF
  
  const toast = useToast();
  const selectedDate = ref('');
  const reportData = ref([]);
  
  // Function to fetch the attendance report for the selected date
  async function fetchReport() {
    try {
      if (!selectedDate.value) {
        toast.error('Please select a date.');
        return;
      }
      const response = await axios.post('api/attendance/fetch-daily-report', {
        date: selectedDate.value,
      });
      if (response.data.status === 'success') {
        if (response.data.data.length === 0) {
          toast.error('No data found for the selected date.');
        } else {
          reportData.value = response.data.data;
        }
      } else {
        toast.error(response.data.message || 'No data found for the selected date.');
      }
    } catch (error) {
      toast.error('Error fetching report: ' + error.message);
    }
  }
  
  // Export filtered data to Excel
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(reportData.value.map(attendance => ({
      Name: attendance.user.name,
      Status: attendance.is_present,
      Reason: attendance.if_not_present_and_have_reason || 'N/A',
      Date: attendance.created_at
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    XLSX.writeFile(workbook, 'Attendance_Report.xlsx');
  }
  
  // Export filtered data to PDF
  function exportToPDF() {
    const doc = new jsPDF();
    const title = 'Attendance Report';
    const headers = [['No', 'Name', 'Status', 'Reason', 'Date']];
  
    const data = reportData.value.map((attendance, index) => [
      index + 1,
      attendance.user.name,
      attendance.is_present,
      attendance.if_not_present_and_have_reason || 'N/A',
      attendance.created_at,
    ]);
  
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: 'striped',
      headStyles: { fillColor: [44, 62, 80] },
    });
  
    doc.save('Attendance_Report.pdf');
  }
  </script>
  
  <style scoped>
  .custom-toast-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .confirm-btn, .cancel-btn {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }
  
  .confirm-btn {
    background-color: #f44336; /* Red for confirm */
    color: white;
  }
  
  .cancel-btn {
    background-color: #2196f3; /* Blue for cancel */
    color: white;
  }
  </style>
  