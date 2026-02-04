<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px; margin-top: 60px;">
      <PageHeader title="Project Reports" subtitle="Please search report by entering date range" class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-400">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <div class="flex flex-col mb-2">
            <label for="fromDate" class="mb-1">From Date</label>
            <input type="date" v-model="fromDate" class="p-2 border rounded" id="fromDate" />
          </div>
  
          <div class="flex flex-col mb-2">
            <label for="toDate" class="mb-1">To Date</label>
            <input type="date" v-model="toDate" class="p-2 border rounded" id="toDate" />
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
        <table class="min-w-full divide-y py-5 divide-gray-200 rounded-lg" id="projectTable">
          <thead class="bg-teal-10">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Engineer</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Project Name</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Start Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">End Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Assigned At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, index) in paginatedProjects" :key="project.project_id">
              <td class="px-4 py-2">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-4 py-2">{{ project.user.name }}</td>
              <td class="px-4 py-2">{{ project.project_name }}</td>
              <td class="px-4 py-2">{{ project.project_status }}</td>
              <td class="px-4 py-2">{{ formatDate(project.start_date) }}</td>
              <td class="px-4 py-2">{{ formatDate(project.end_date) }}</td>
              <td class="px-4 py-2">{{ formatDate(project.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="!filteredProjects.length" class="text-center text-gray-500">
        No records found.
      </div>
  
      <div class="flex justify-center mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded">
          Previous
        </button>
        <span class="px-4 py-2">Page {{ currentPage }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage * itemsPerPage >= filteredProjects.length" class="px-4 py-2 bg-gray-300 rounded">
          Next
        </button>
      </div>
  
      <div v-if="toastMessage" :class="toastClass" class="fixed bottom-0 right-0 m-4 p-4 rounded">
        {{ toastMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from '@/axios';
  import { jsPDF } from 'jspdf';
  import autoTable from 'jspdf-autotable';
  import * as XLSX from '@e965/xlsx'; // Import the xlsx library
  
  const projects = ref([]);
  const fromDate = ref('');
  const toDate = ref('');
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const toastMessage = ref('');
  const toastClass = ref('bg-green-500 text-white');
  
  async function fetchReport() {
    try {
      const response = await axios.get('/api/reports-for/projects', {
        params: {
          from: fromDate.value,
          to: toDate.value,
        },
      });
      projects.value = response.data.data;
      toastMessage.value = response.data.message;
    } catch (error) {
      console.error('Error fetching report:', error);
      toastMessage.value = error.response?.data?.message || 'An error occurred while fetching the report.';
    }
  }
  
  const filteredProjects = computed(() => {
    return projects.value; // Implement filtering logic if needed
  });
  
  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredProjects.value.slice(start, start + itemsPerPage);
  });
  
  function changePage(page) {
    currentPage.value = page;
  }
  
  function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  }
  
  function exportToPDF() {
    const doc = new jsPDF();
    const tableColumn = ["No", "Engineer", "Project Name", "Status", "Start Date", "End Date", "Assigned At"];
    const tableRows = [];
  
    // Loop through filtered projects
    filteredProjects.value.forEach((project, index) => {
      const projectData = [
        (currentPage.value - 1) * itemsPerPage + index + 1,
        project.user.name,
        project.project_name,
        project.project_status,
        formatDate(project.start_date),
        formatDate(project.end_date),
        formatDate(project.created_at),
      ];
      tableRows.push(projectData);
    });
  
    // Generate PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 128, 128] },
      styles: { fontSize: 10 },
    });
  
    doc.text("Project Reports", 14, 15);
    doc.save('projects_report.pdf');
  }
  
  // New export to Excel function
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredProjects.value.map((project, index) => ({
      No: (currentPage.value - 1) * itemsPerPage + index + 1,
      Engineer: project.user.name,
      "Project Name": project.project_name,
      Status: project.project_status,
      "Start Date": formatDate(project.start_date),
      "End Date": formatDate(project.end_date),
      "Assigned At": formatDate(project.created_at),
    })));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  
    // Save the Excel file
    XLSX.writeFile(workbook, 'projects_report.xlsx');
  }
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  