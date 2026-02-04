<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
    <PageHeader subtitle="Assigned Projects">
      <div class="flex flex-col sm:flex-row sm:space-x-2"></div>
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
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Assigned By</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Start Date</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">End Date</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Contract</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Project Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(project, index) in paginatedProjects" :key="project.project_id">
            <td class="table-data">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="table-data">
              <button @click="openProjectModal(project.project_id)" class="text-blue-600 hover:underline">
                {{ project.project_name || 'NA' }}
              </button>
            </td>
            <td class="table-data">{{ project.created_by || 'NA' }}</td>
            <td class="table-data">{{ formatDate(project.start_date) || 'NA' }}</td>
            <td class="table-data">{{ formatDate(project.end_date) || 'NA' }}</td>
            <td class="table-data">
              <button
                v-if="project.contract?.pdf_file"
                @click="downloadFile(project.contract.pdf_file)"
                class="text-blue-500 hover:underline"
              >
                Download Contract
              </button>
              <span v-else>NA</span>
            </td>
            <td class="table-data">{{ formatDate(project.created_at) || 'NA' }}</td>
            <td class="table-data">
              <button
                :class="{
                  'bg-yellow-500': project.project_status === 'on-progress',
                  'bg-green-500': project.project_status === 'completed',
                  'bg-red-500': project.project_status === 'failed'
                }"
                class="btn text-white rounded-full w-24"
              >
                {{ project.project_status || 'NA' }}
              </button>
            </td>
            <td class="table-data">
              <i
                @click="editProject(project.project_id)"
                class="fas fa-edit"
                style="color:#21618c; font-weight:bold; font-size:17px"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Project Details -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Project Details</h2>
          <button @click="closeProjectModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="selectedProject" class="space-y-4">
          <div>
            <strong>Project Name:</strong> {{ selectedProject.project_name || 'NA' }}
          </div>
          <div>
            <strong>Project ID:</strong> {{ selectedProject.project_id || 'NA' }}
          </div>
          <div>
            <strong>Engineer:</strong> {{ selectedProject.user?.name || 'NA' }}
          </div>
          <div>
            <strong>Team Members:</strong> {{ selectedProject.members?.length ? selectedProject.members.join(', ') : 'NA' }}
          </div>
          <div>
            <strong>Assigned By:</strong> {{ selectedProject.created_by || 'NA' }}
          </div>
          <div>
            <strong>Start Date:</strong> {{ formatDate(selectedProject.start_date) || 'NA' }}
          </div>
          <div>
            <strong>End Date:</strong> {{ formatDate(selectedProject.end_date) || 'NA' }}
          </div>
          <div>
            <strong>Extended Date:</strong> {{ formatDate(selectedProject.extended_date) || 'NA' }}
          </div>
          <div>
            <strong>Status:</strong> {{ selectedProject.project_status || 'NA' }}
          </div>
          <div>
            <strong>Follow Up:</strong> {{ selectedProject.follow_up || 'NA' }}
          </div>
          <div>
            <strong>Created At:</strong> {{ formatDate(selectedProject.created_at) || 'NA' }}
          </div>
          <div>
            <strong>Updated At:</strong> {{ formatDate(selectedProject.updated_at) || 'NA' }}
          </div>
          <div>
            <strong>Contract Title:</strong> {{ selectedProject.contract?.title || 'NA' }}
          </div>
          <div>
            <strong>Contract Timeline Category:</strong> {{ selectedProject.contract?.time_line_category || 'NA' }}
          </div>
          <div>
            <strong>Contract Start Date:</strong> {{ formatDate(selectedProject.contract?.start_date) || 'NA' }}
          </div>
          <div>
            <strong>Contract End Date:</strong> {{ formatDate(selectedProject.contract?.end_date) || 'NA' }}
          </div>
          <div>
            <strong>Contract PDF:</strong> 
            <button
              v-if="selectedProject.contract?.pdf_file"
              @click="downloadFile(selectedProject.contract.pdf_file)"
              class="text-blue-500 hover:underline"
            >
              Download Contract
            </button>
            <span v-else>NA</span>
          </div>
          <div>
            <strong>Contract Status:</strong> {{ selectedProject.contract?.status || 'NA' }}
          </div>
          <div>
            <strong>Performance Guarantee:</strong> {{ selectedProject.contract?.performance_guarantee || 'NA' }}
          </div>
          <div>
            <strong>Tender Type:</strong> {{ selectedProject.tender?.tender_type || 'NA' }}
          </div>
          <div>
            <strong>Tender Attachment:</strong> 
            <button
              v-if="selectedProject.tender?.attachment"
              @click="downloadFile(selectedProject.tender.attachment)"
              class="text-blue-500 hover:underline"
            >
              Download Attachment
            </button>
            <span v-else>NA</span>
          </div>
        </div>
      </div>
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
        :disabled="currentPage * itemsPerPage >= filteredProjects.length" 
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

const projects = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showModal = ref(false);
const selectedProject = ref(null);

// Fetch data when component is mounted
onMounted(async () => {
  await fetchProjects();
});

// Fetch projects data
async function fetchProjects() {
  try {
    const response = await axios.get('api/my/projects');
    projects.value = response.data.data.map(project => ({
      project_id: project.project_id,
      project_name: project.project_name || 'NA',
      user: project.user || { name: 'NA' },
      members: project.members || [],
      created_by: project.created_by || 'NA',
      start_date: project.start_date || 'NA',
      end_date: project.end_date || 'NA',
      extended_date: project.extended_date || 'NA',
      project_status: project.project_status || 'NA',
      contract: project.contract || { 
        title: 'NA',
        time_line_category: 'NA',
        start_date: 'NA',
        end_date: 'NA',
        pdf_file: 'NA',
        status: 'NA',
        performance_guarantee: 'NA'
      },
      tender: project.tender || { 
        tender_type: 'NA',
        attachment: 'NA'
      },
      follow_up: project.follow_up || 'NA',
      created_at: project.created_at || 'NA',
      updated_at: project.updated_at || 'NA'
    }));
  } catch (error) {
    handleError(error);
  }
}

// Open modal and set selected project
async function openProjectModal(projectId) {
  try {
    const project = projects.value.find(p => p.project_id === projectId);
    if (project) {
      selectedProject.value = project;
      showModal.value = true;
    } else {
      toast.error('Project not found');
    }
  } catch (error) {
    handleError(error);
  }
}

// Close modal
function closeProjectModal() {
  showModal.value = false;
  selectedProject.value = null;
}

// Format date to a readable format
function formatDate(date) {
  if (!date || date === 'NA') return 'NA';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Navigate to edit project page
function editProject(projectId) {
  router.push({ name: 'AcceptAssignedProject', params: { project_id: projectId } });
}

// Computed property to filter the projects
const filteredProjects = computed(() => {
  return projects.value.filter(entry =>
    (entry.project_name || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.created_by || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.project_status || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.contract?.title || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.tender?.tender_type || 'NA').toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Computed property for paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProjects.value.slice(start, start + itemsPerPage.value);
});

// Change the current page
function changePage(page) {
  if (page > 0 && page <= Math.ceil(filteredProjects.value.length / itemsPerPage.value)) {
    currentPage.value = page;
  }
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

// Export filtered projects data to Excel
function exportToExcel() {
  try {
    const exportData = filteredProjects.value.map((project, index) => ({
      No: index + 1,
      'Project Name': project.project_name,
      'Engineer': project.user?.name || 'NA',
      'Team Members': project.members?.length ? project.members.join(', ') : 'NA',
      'Assigned By': project.created_by,
      'Start Date': formatDate(project.start_date),
      'End Date': formatDate(project.end_date),
      'Extended Date': formatDate(project.extended_date),
      'Project Status': project.project_status,
      'Contract Title': project.contract?.title || 'NA',
      'Contract Timeline Category': project.contract?.time_line_category || 'NA',
      'Contract Start Date': formatDate(project.contract?.start_date) || 'NA',
      'Contract End Date': formatDate(project.contract?.end_date) || 'NA',
      'Contract PDF': project.contract?.pdf_file || 'NA',
      'Contract Status': project.contract?.status || 'NA',
      'Performance Guarantee': project.contract?.performance_guarantee || 'NA',
      'Tender Type': project.tender?.tender_type || 'NA',
      'Tender Attachment': project.tender?.attachment || 'NA',
      'Created At': formatDate(project.created_at),
      'Updated At': formatDate(project.updated_at),
      'Follow Up': project.follow_up
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
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
    const tableData = paginatedProjects.value.map((project, index) => [
      index + 1 + (currentPage.value - 1) * itemsPerPage.value,
      project.project_name,
      project.user?.name || 'NA',
      project.members?.length ? project.members.join(', ') : 'NA',
      project.created_by,
      formatDate(project.start_date),
      formatDate(project.end_date),
      project.contract?.title || 'NA',
      formatDate(project.created_at),
      project.project_status
    ]);
    autoTable(doc, {
      head: [['No', 'Project Name', 'Engineer', 'Team Members', 'Assigned By', 'Start Date', 'End Date', 'Contract Title', 'Created At', 'Project Status']],
      body: tableData,
    });
    doc.save('ProjectAssignments.pdf');
  } catch (error) {
    handleError(error);
  }
}

// Download file from URL
function downloadFile(url) {
  if (url && url !== 'NA') {
    saveAs(url);
  } else {
    toast.error('No file available for download');
  }
}
</script>

<style scoped>
.table-data {
  padding: 8px 12px;
}
</style>