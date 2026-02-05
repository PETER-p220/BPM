<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 23px">
      <PageHeader title="Assigned Projects" subtitle="Assigned Projects">
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
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table"
          style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;">
          <thead class="bg-gray-50 dark:bg-neutral-700"
            style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Project Name</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Assigned To</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created By</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Start Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">End Date</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Budget</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Document</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Contract</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Project Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is Approved </th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is Accepted?</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Perfomance Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(project, index) in filteredProjects" :key="project.project_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ project.project_name }}</td>
              <td class="table-data">{{ project.user.name }}</td>
              <td class="table-data">{{ project.created_by }}</td>
              <td class="table-data">{{ project.start_date }}</td>
              <td class="table-data">{{ project.end_date }}</td>
              <td class="table-data">{{ project.budget }}</td>
              <td class="table-data">
                <button @click="downloadFile(project.document_url)" class="text-blue-500 hover:underline">
                  Download Document
                </button>
              </td>
              <td class="table-data">
                <button @click="downloadFile(project.contract_url)" class="text-blue-500 hover:underline">
                  Download Contract
                </button>
              </td>
              <td class="table-data">{{ project.description }}</td>
              <td class="table-data">
                <button class="bg-red-500 btn" style="width:100px;background-color:#f4d03f;color:white;border-radius:17px">
                  {{ project.project_status }}
                </button>
              </td>
              <td class="table-data">
                <button class="bg-red-500 btn" style="width:100px;background-color:#cb4335;color:white;border-radius:17px">
                  {{ project.is_viewed }}
                </button>
              </td>
              <td class="table-data">
                <button class="bg-red-500 btn" style="width:100px;background-color:#229954;color:white;border-radius:17px">
                  {{ project.is_accepted }}
                </button>
              </td>
              <td class="table-data">
                <button class="bg-red-500 btn" style="width:100px;background-color:#616a6b;color:white;border-radius:17px">
                  {{ project.performance_status }}
                </button>
              </td>
              <td class="table-data">{{ project.created_at }}</td>
              <td class="table-data">
                Approve<i @click="editProject(project.project_id)" class="fas fa-edit"
                  style="color:#21618c;font-weight:bold;font-size:17px"></i>
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
import axios from '@/axios'; // Ensure this points to your axios instance
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable'; // Import autoTable for table formatting in PDF

const router = useRouter();
const toast = useToast();

const projects = ref([]);
const filter = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  await fetchProjects();
});

// Fetch projects data
async function fetchProjects() {
  try {
    const response = await axios.get('api/hod/projects'); // Ensure this is the correct endpoint
    projects.value = response.data.data.map(project => ({
      project_id: project.project_id,
      project_name: project.project_name,
      user: project.user,  // Assuming user is an object with a 'name' field
      created_by: project.created_by,
      start_date: project.start_date,
      end_date: project.end_date,
      budget: project.budget,
      project_status: project.project_status,
      is_viewed:project.is_viewed,
      is_accepted :project.is_accepted,
      document_url: project.document, // Assuming `document` is the URL to the file
      contract_url: project.contract, // Assuming `contract` is the URL to the contract
      contact: project.contact,
      description: project.description,
      performance_status:project.performance_status,
      created_at: project.created_at // Assuming created_at is part of the project object
    }));
  } catch (error) {
    handleError(error);
  }
}

// Navigate to edit project page
function editProject(projectId) {
  router.push({ name: 'ApproveAssignedProject', params: { project_id: projectId } });
}

// Computed property to filter the projects
const filteredProjects = computed(() => {
  return projects.value.filter(entry =>
    entry.project_name.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.created_by.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.project_status.toLowerCase().includes(filter.value.toLowerCase())
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

// Export filtered projects data to Excel
function exportToExcel() {
  try {
    const worksheet = XLSX.utils.json_to_sheet(filteredProjects.value.map(entry => ({
      ProjectName: entry.project_name,
      AssignedTo: entry.user.name,
      CreatedBy: entry.created_by,
      StartDate: entry.start_date,
      EndDate: entry.end_date,
      Budget: entry.budget,
      Document: entry.document_url, // Document link
      Contract: entry.contract_url, // Contract link
      Contact: entry.contact,
      Description: entry.description,
      Status: entry.project_status,
      IsViewed: entry.is_viewed,
      IsAccepted: entry.is_accepted,
      PerfomanceStatus:entry.performance_status,
      CreatedAt: entry.created_at
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Assignments');
    XLSX.writeFile(workbook, 'ProjectAssignments.xlsx');
  } catch (error) {
    handleError(error);
  }
}

// Export filtered projects data to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF();
    const tableData = filteredProjects.value.map(entry => [
      entry.project_name,
      entry.user.name,
      entry.start_date,
      entry.end_date,
      entry.budget,
      entry.document_url, // Document link
      entry.contract_url, // Contract link
      entry.contact,
      entry.description,
      entry.project_status,
      entry.is_viewed,
      entry.is_accepted,
      entry.performance_status,
      entry.created_at
    ]);
    autoTable(doc, {
      head: [
        ['Project Name', 'Assigned To', 'Created By', 'Start Date', 'End Date', 'Budget', 'Document', 'Contract', 'Contact', 'Description', 'Status','isViewed','IsAccepted','PerfomanceStatus', 'Created At']
      ],
      body: tableData
    });
    doc.save('ProjectAssignments.pdf');
  } catch (error) {
    handleError(error);
  }
}

// Function to download a file (PDF, Excel, etc.)
async function downloadFile(fileUrl) {
  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    const file = new Blob([response.data], { type: response.headers['content-type'] });
    saveAs(file, fileUrl.split('/').pop());
  } catch (error) {
    handleError(error);
  }
}
</script>
