<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
    <PageHeader subtitle="Meeting Minutes Report">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/create/meetingmenutes">
          <BaseButton @click="addNewMeetingMinute" class="w-full sm:w-auto bg-[#2e4053] text-white">
            Create Meeting Minute
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>
      </div>
    </PageHeader>

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

    <div class="overflow-x-auto bg-white p-4 rounded-lg shadow-md" v-if="reportData.length > 0">
      <table class="min-w-full divide-y divide-gray-200 rounded-lg dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-neutral-700">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Department Engineer</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Prepared By</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Project</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Minute Points</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Details</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(minute, index) in reportData" :key="minute.minutes_id">
            <td class="px-6 py-3">{{ index + 1 }}</td>
            <td class="px-6 py-3">{{ minute.user?.name || 'N/A' }}</td>
            <td class="px-6 py-3">{{ minute.logged_user?.name || 'N/A' }}</td>
            <td class="px-6 py-3">{{ minute.project?.project_name || 'N/A' }}</td>
            <td class="px-6 py-3">{{ minute.minute_point || 'N/A' }}</td>
            <td class="px-6 py-3">{{ minute.if_more_detail || 'N/A' }}</td>
            <td class="px-6 py-3">{{ minute.created_at ? new Date(minute.created_at).toLocaleString() : 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-500">
      No meeting minutes available for the selected date.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const toast = useToast();
const selectedDate = ref('');
const reportData = ref([]);

async function fetchReport() {
  try {
    if (!selectedDate.value) {
      toast.error('Please select a date.');
      return;
    }
    const response = await axios.post('api/meeting-minutes/report', {
      date: selectedDate.value,
    });
    if (response.data.status === 'success') {
      reportData.value = response.data.data || [];
      if (reportData.value.length === 0) {
        toast.error('No data found for the selected date.');
      }
    } else {
      toast.error(response.data.message || 'No data found for the selected date.');
    }
  } catch (error) {
    toast.error('Error fetching report: ' + error.message);
  }
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(reportData.value.map(minute => ({
    Name: minute.user?.name || 'N/A',
    PreparedBy: minute.logged_user?.name || 'N/A',
    Project: minute.project?.project_name || 'N/A',
    MinutePoints: minute.minute_point || 'N/A',
    Details: minute.if_more_detail || 'N/A',
    Date: minute.created_at ? new Date(minute.created_at).toLocaleString() : 'N/A',
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Meeting Minutes Report');
  XLSX.writeFile(workbook, 'Meeting_Minutes_Report.xlsx');
}

function exportToPDF() {
  const doc = new jsPDF();
  const headers = [['No', 'Name', 'Prepared By', 'Project', 'Minute Points', 'Details', 'Date']];

  const data = reportData.value.map((minute, index) => [
    index + 1,
    minute.user?.name || 'N/A',
    minute.logged_user?.name || 'N/A',
    minute.project?.project_name || 'N/A',
    minute.minute_point || 'N/A',
    minute.if_more_detail || 'N/A',
    minute.created_at ? new Date(minute.created_at).toLocaleString() : 'N/A',
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 20,
    theme: 'striped',
    headStyles: { fillColor: [44, 62, 80] },
  });

  doc.save('Meeting_Minutes_Report.pdf');
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
  background-color: #f44336;
  color: white;
}
.cancel-btn {
  background-color: #2196f3;
  color: white;
}
</style>
