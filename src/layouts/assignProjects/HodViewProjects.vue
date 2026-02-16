<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assigned Projects</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Projects assigned to staff — review documents, approve, track status & performance
      </p>
    </div>

    <!-- Controls -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full max-w-lg">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by project name, assignee, status..."
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pl-10 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
        />
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          @click="exportToExcel"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-sm"
        >
          <svg class="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM13.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 9H3a1 1 0 110-2h11.586l-1.293-1.293z" />
          </svg>
          Excel
        </button>

        <button
          @click="exportToPDF"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition shadow-sm"
        >
          <svg class="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0114 3.586L17.414 7A2 2 0 0118 8.414V16a2 2 0 01-2 2h-1.528A6 6 0 004.528 18H4a2 2 0 01-2-2V6a2 2 0 012-2z" clip-rule="evenodd" />
          </svg>
          PDF
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-700/50">
            <tr>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">No</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Project</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Assigned To</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Created By</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Start → End</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Budget</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Docs</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Approved</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Accepted</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Performance</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Created</th>
              <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr v-if="loading" class="text-center">
              <td colspan="13" class="py-16 text-gray-500 dark:text-gray-400">
                Loading assigned projects...
              </td>
            </tr>

            <tr v-else-if="filteredProjects.length === 0" class="text-center">
              <td colspan="13" class="py-16 text-gray-500 dark:text-gray-400">
                No projects found matching your search.
              </td>
            </tr>

            <tr
              v-for="(project, index) in filteredProjects"
              :key="project.project_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
              <td class="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
              <td class="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                {{ project.project_name || '—' }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ project.user?.name || '—' }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ project.created_by || '—' }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(project.start_date) }} → {{ formatDate(project.end_date) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {{ formatCurrency(project.budget) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm space-x-2">
                <button
                  v-if="project.document_url"
                  @click="downloadFile(project.document_url, 'project-document')"
                  class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-medium"
                >
                  Document
                </button>
                <button
                  v-if="project.contract_url"
                  @click="downloadFile(project.contract_url, 'contract')"
                  class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-medium"
                >
                  Contract
                </button>
                <span v-if="!project.document_url && !project.contract_url" class="text-gray-400 text-xs">—</span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <span :class="getStatusClasses(project.project_status)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {{ project.project_status || 'Unknown' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <span :class="getBooleanClasses(project.is_viewed)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {{ project.is_viewed ?? 'No' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <span :class="getBooleanClasses(project.is_accepted)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {{ project.is_accepted ?? 'No' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <span :class="getPerformanceClasses(project.performance_status)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {{ project.performance_status || '—' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(project.created_at) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-center">
                <button
                  @click="editProject(project.project_id)"
                  class="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Review / Approve
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
        <div>Showing {{ filteredProjects.length }} of {{ projects.length }} projects</div>
        <!-- Future pagination -->
        <div class="flex gap-2">
          <button class="rounded border px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40" disabled>Previous</button>
          <button class="rounded border px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40" disabled>Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

const router = useRouter();
const toast = useToast();

const projects = ref([]);
const filter = ref('');
const loading = ref(false);

onMounted(async () => {
  await fetchProjects();
});

async function fetchProjects() {
  loading.value = true;
  try {
    const response = await axios.get('api/hod/projects');
    projects.value = (response.data.data || []).map(p => ({
      ...p,
      document_url: p.document,
      contract_url: p.contract,
      user_name: p.user?.name || '—',
    }));
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
}

function editProject(projectId) {
  router.push({ name: 'ApproveAssignedProject', params: { project_id: projectId } });
}

async function downloadFile(url, type = 'file') {
  if (!url) {
    toast.warning(`No ${type} available`);
    return;
  }
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const filename = url.split('/').pop() || `${type}.pdf`;
    saveAs(response.data, filename);
    toast.success(`${type} download started`);
  } catch (error) {
    handleError(error);
  }
}

const filteredProjects = computed(() => {
  if (!filter.value.trim()) return projects.value;

  const term = filter.value.toLowerCase();
  return projects.value.filter(p =>
    p.project_name?.toLowerCase().includes(term) ||
    p.user?.name?.toLowerCase().includes(term) ||
    p.created_by?.toLowerCase().includes(term) ||
    p.project_status?.toLowerCase().includes(term) ||
    p.performance_status?.toLowerCase().includes(term)
  );
});

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatCurrency(value) {
  if (!value) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0
  }).format(value);
}

function getStatusClasses(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('ongoing') || s.includes('in progress')) return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
  if (s.includes('completed')) return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
  if (s.includes('delayed') || s.includes('overdue')) return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

function getBooleanClasses(value) {
  if (value === true || value === 'Yes' || value === 'Approved' || value === 'Accepted') {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300';
  }
  if (value === false || value === 'No' || value === 'Pending') {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-800/30 dark:text-rose-300';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

function getPerformanceClasses(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('good') || s.includes('excellent')) return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
  if (s.includes('fair') || s.includes('average')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
  if (s.includes('poor') || s.includes('needs improvement')) return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

function handleError(error) {
  let msg = 'Something went wrong';
  if (error.response?.data?.message) msg = error.response.data.message;
  else if (error.message) msg = error.message;
  toast.error(msg);
}

// Export functions (kept similar but improved safety)
function exportToExcel() {
  if (!filteredProjects.value.length) return toast.info('No data to export');

  const data = filteredProjects.value.map((p, i) => ({
    No: i + 1,
    ProjectName: p.project_name || '',
    AssignedTo: p.user?.name || '',
    CreatedBy: p.created_by || '',
    StartDate: p.start_date || '',
    EndDate: p.end_date || '',
    Budget: p.budget || '',
    Status: p.project_status || '',
    Approved: p.is_viewed || '',
    Accepted: p.is_accepted || '',
    Performance: p.performance_status || '',
    CreatedAt: p.created_at ? new Date(p.created_at).toLocaleString() : ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Assigned Projects');
  XLSX.writeFile(wb, 'Assigned_Projects.xlsx');
}

function exportToPDF() {
  if (!filteredProjects.value.length) return toast.info('No data to export');

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Assigned Projects Report', 14, 20);

  const tableData = filteredProjects.value.map(p => [
    p.project_name || '',
    p.user?.name || '',
    p.created_by || '',
    formatDate(p.start_date),
    formatDate(p.end_date),
    formatCurrency(p.budget),
    p.project_status || '',
    p.is_viewed ?? 'No',
    p.is_accepted ?? 'No',
    p.performance_status || '',
    formatDate(p.created_at)
  ]);

  autoTable(doc, {
    head: [['Project', 'Assigned To', 'Created By', 'Start', 'End', 'Budget', 'Status', 'Approved', 'Accepted', 'Performance', 'Created']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    alternateRowStyles: { fillColor: [243, 244, 246] }
  });

  doc.save('Assigned_Projects.pdf');
}
</script>