<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
    <PageHeader subtitle="Engineers With Projects">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
       
      </div>
    </PageHeader>

    <div class="flex items-center mb-4 space-x-4">
      <input
        type="text"
        v-model="filter"
        placeholder="Search users..."
        class="w-full p-2 border rounded sm:w-auto"
      />
      <button
        v-if="filteredUsers.length"
        @click="exportToExcel"
        class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
        style="background-color:white;color:#229954; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
      >
        Export to Excel
        <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
      </button>
      <button
        v-if="filteredUsers.length"
        @click="exportToPDF"
        class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
        style="background-color:white;color:#229954; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
      >
        Export to PDF
        <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
      </button>
    </div>

    <!-- User List with Project Summary -->
    <div class="space-y-2">
      <div
        v-for="user in paginatedUsers"
        :key="user.user_id"
        @click="openModal(user)"
        class="p-4 bg-gray-100 dark:bg-neutral-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-600"
      >
        <div class="flex justify-between">
          <div>
            <strong>Engineer:</strong> {{ user.name || 'NA' }}<br />
          </div>
          <div>
            <strong>Total Projects:</strong> {{ user.total_projects || 0 }}<br />
         
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="filteredUsers.length" class="flex justify-center mt-4">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
      >
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }}</span>
      <button
        :disabled="currentPage * itemsPerPage >= filteredUsers.length"
        @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Modal for User Details -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="closeModal"
    >
      <div
        class="bg-white dark:bg-neutral-800 p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <h2 class="text-2xl font-bold mb-4">User Details</h2>
        <div class="space-y-2">
          <p><strong>Name:</strong> {{ selectedUser.name || 'NA' }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email || 'NA' }}</p>
          <p><strong>Status:</strong> {{ selectedUser.status || 'NA' }}</p>
          <p><strong>Role:</strong> {{ selectedUser.role || 'NA' }}</p>
          <p><strong>Department:</strong> {{ selectedUser.department || 'NA' }}</p>
          <p><strong>Total Projects:</strong> {{ selectedUser.total_projects || 0 }}</p>
          <p><strong>On Progress Projects:</strong> {{ selectedUser.on_progress_projects || 0 }}</p>
          <p><strong>Completed Projects:</strong> {{ selectedUser.completed_projects || 0 }}</p>
          <p><strong>Failed Projects:</strong> {{ selectedUser.failed_projects || 0 }}</p>
        </div>

        <!-- Project Details -->
        <h3 class="text-xl font-semibold mt-6 mb-2">Projects</h3>
        <div v-if="selectedUser.projects && selectedUser.projects.length" class="space-y-4">
          <div
            v-for="project in selectedUser.projects"
            :key="project.project_id"
            class="p-4 bg-gray-100 dark:bg-neutral-700 rounded"
          >
           
            <p><strong>Project Name:</strong> {{ project.project_name || 'NA' }}</p>
            <p><strong>Status:</strong> {{ project.project_status || 'NA' }}</p>
            <p><strong>Start Date:</strong> {{ project.start_date || 'NA' }}</p>
            <p><strong>End Date:</strong> {{ project.end_date || 'NA' }}</p>
            <p><strong>Extended Date:</strong> {{ project.extended_date || 'NA' }}</p>
            <p><strong>Follow Up:</strong> {{ project.follow_up || 'NA' }}</p>
            <p><strong>Created By:</strong> {{ project.created_by || 'NA' }}</p>
            <p><strong>Members:</strong> {{ project.members && project.members.length ? project.members.join(', ') : 'None' }}</p>
            <p v-if="project.user"><strong>Assigned User:</strong> {{ project.user.name || 'NA' }}</p>
            <div v-if="project.contract">
              <p><strong>Contract Title:</strong> {{ project.contract.title || 'NA' }}</p>
              <p><strong>Contract Status:</strong> {{ project.contract.status || 'NA' }}</p>
              <p><strong>Timeline Category:</strong> {{ project.contract.time_line_category || 'NA' }}</p>
              <p><strong>Performance Guarantee:</strong> {{ project.contract.performance_guarantee || 'NA' }}</p>
            </div>
            <div v-if="project.tender">
              <p><strong>Tender Type:</strong> {{ project.tender.tender_type || 'NA' }}</p>
              <p><strong>Tender Attachment:</strong> {{ project.tender.attachment || 'NA' }}</p>
            </div>
          </div>
        </div>
        <p v-else>No projects assigned to this user.</p>

        <button
          @click="closeModal"
          class="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
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

const users = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedUser = ref(null);

// Fetch users with project summary when component is mounted
onMounted(async () => {
  await fetchUsers();
});

// Fetch users from API
async function fetchUsers() {
  try {
    const response = await axios.get('/api/users-with-project-summary');
    if (response.data.status) {
      users.value = response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter users
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    (user.name || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (user.email || 'NA').toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Computed property for paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

// Change page function
function changePage(page) {
  if (page > 0 && page <= Math.ceil(filteredUsers.value.length / itemsPerPage)) {
    currentPage.value = page;
  }
}

// Open modal with user details
function openModal(user) {
  selectedUser.value = user;
}

// Close modal
function closeModal() {
  selectedUser.value = null;
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from server';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Export to Excel
function exportToExcel() {
  const exportData = filteredUsers.value.map((user, index) => ({
    No: index + 1,
    Name: user.name || 'NA',
    Email: user.email || 'NA',
    Status: user.status || 'NA',
    Role: user.role || 'NA',
    Department: user.department || 'NA',
    'Total Projects': user.total_projects || 0,
    'On Progress Projects': user.on_progress_projects || 0,
    'Completed Projects': user.completed_projects || 0,
    'Failed Projects': user.failed_projects || 0
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'User Project Summary');
  XLSX.writeFile(wb, 'user_project_summary.xlsx');
}

// Export to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const tableData = filteredUsers.value.map((user, index) => [
    index + 1,
    user.name || 'NA',
    user.email || 'NA',
    user.status || 'NA',
    user.role || 'NA',
    user.department || 'NA',
    user.total_projects || 0,
    user.on_progress_projects || 0,
    user.completed_projects || 0,
    user.failed_projects || 0
  ]);

  autoTable(doc, {
    head: ['No', 'Name', 'Email', 'Status', 'Role', 'Department', 'Total Projects', 'On Progress', 'Completed', 'Failed'],
    body: tableData,
  });

  doc.save('user_project_summary.pdf');
}
</script>

<style scoped>
.table-data {
  padding: 1rem;
  text-align: left;
}
</style>