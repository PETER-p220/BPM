<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <PageHeader subtitle="Project Extensions">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/extend-project">
          <BaseButton class="w-full sm:w-auto bg-[#192531] text-white">
            Create Project Extension
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
      <button
        @click="exportToExcel"
        class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
        style="background-color: white; color: #229954; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      >
        Export to Excel
        <span class="ml-2" aria-hidden="true">
          <i class="fas fa-file-excel" style="color: #edbb99"></i>
        </span>
      </button>
      <button
        @click="exportToPDF"
        class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
        style="background-color: white; color: #229954; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      >
        Export to PDF
        <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="project in filteredProjects"
        :key="project.project_id"
        class="shadow-lg rounded-lg bg-white dark:bg-dark-header"
      >
        <div
          class="px-6 py-3 bg-gray-50 dark:bg-neutral-700 rounded-t-lg"
          style="box-shadow: rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
        >
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Project: {{ project.project_name }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
                <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Extended Date</th>
                <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Letter File</th>
                <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
                <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Updated At</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
              <tr v-for="(extension, index) in project.extensions" :key="extension.extension_id">
                <td class="table-data">{{ index + 1 }}</td>
                <td class="table-data">{{ formatDate(extension.extended_date) }}</td>
                <td class="table-data">
                  <button
                    @click="downloadFile(extension.extend_letter_file, `extension_${extension.extension_id}.pdf`)"
                    class="text-blue-500 hover:underline"
                  >
                    Download PDF
                  </button>
                </td>
                <td class="table-data">{{ formatDate(extension.created_at) }}</td>
                <td class="table-data">{{ formatDate(extension.updated_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const projectExtensions = ref([]);
const filter = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('/api/project-extension');
    if (response.data.status) {
      projectExtensions.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch project extensions');
    }
  } catch (error) {
    handleError(error);
  }
}

// Download file as a blob to ensure it saves
async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch file');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    toast.error('Failed to download file: ' + error.message);
  }
}

// Format date to East Africa Time
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

// Group extensions by project_id
const groupedByProject = computed(() => {
  const grouped = {};
  projectExtensions.value.forEach((extension) => {
    const projectId = extension.project_id;
    if (!grouped[projectId]) {
      grouped[projectId] = {
        project_id: projectId,
        project_name: extension.project?.project_name || 'Unknown Project',
        extensions: [],
      };
    }
    grouped[projectId].extensions.push(extension);
  });
  return Object.values(grouped);
});

// Computed Property for Filtering
const filteredProjects = computed(() => {
  return groupedByProject.value
    .map((project) => {
      const filteredExtensions = project.extensions.filter((extension) => {
        const searchText = filter.value.toLowerCase();
        return (
          (extension.extended_date || '').toLowerCase().includes(searchText) ||
          (extension.extend_letter_file || '').toLowerCase().includes(searchText) ||
          (project.project_name || '').toLowerCase().includes(searchText)
        );
      });
      return { ...project, extensions: filteredExtensions };
    })
    .filter((project) => project.extensions.length > 0);
});

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
  const data = filteredProjects.value.flatMap((project) =>
    project.extensions.map((extension, index) => ({
      'Project Name': project.project_name,
      No: index + 1,
      'Extended Date': formatDate(extension.extended_date) || 'N/A',
      'Letter File': extension.extend_letter_file || 'N/A',
      'Created At': formatDate(extension.created_at) || 'N/A',
      'Updated At': formatDate(extension.updated_at) || 'N/A',
    }))
  );

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Extensions');
  XLSX.writeFile(workbook, 'Project_Extensions.xlsx');
}

// Export to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = 'Project Extensions Data';
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  filteredProjects.value.forEach((project) => {
    const headers = [['No', 'Extended Date', 'Letter File', 'Created At', 'Updated At']];
    const data = project.extensions.map((extension, index) => [
      index + 1,
      formatDate(extension.extended_date) || 'N/A',
      extension.extend_letter_file || 'N/A',
      formatDate(extension.created_at) || 'N/A',
      formatDate(extension.updated_at) || 'N/A',
    ]);

    doc.setFontSize(14);
    doc.text(project.project_name, 14, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(12);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: doc.lastAutoTable.finalY + 30,
    });
  });

  doc.save('Project_Extensions.pdf');
}
</script>

<style scoped>
.table-data {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200;
}

.rounded-table {
  border-radius: 8px;
  overflow: hidden;
}
</style>