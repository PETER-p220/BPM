<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Project Reports</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Search and export project reports by date range
        </p>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
        <!-- From Date -->
        <div>
          <label for="fromDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            id="fromDate"
            type="date"
            v-model="fromDate"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- To Date -->
        <div>
          <label for="toDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <input
            id="toDate"
            type="date"
            v-model="toDate"
            class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
          <button
            @click="fetchReport"
            :disabled="isLoading"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
            <span v-else>Fetch Report</span>
          </button>

          <button
            @click="exportToExcel"
            :disabled="isLoading || !projects.length"
            class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export to Excel
          </button>

          <button
            @click="exportToPDF"
            :disabled="isLoading || !projects.length"
            class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading project reports...</p>
    </div>

    <!-- Table -->
    <div v-else-if="projects.length > 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(project, index) in paginatedProjects"
              :key="project.project_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ project.user?.name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ project.project_name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClasses(project.project_status)"
                  class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                >
                  {{ project.project_status || '—' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(project.start_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(project.end_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(project.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        No project reports available
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Select a date range and fetch the report
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredProjects.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedProjects.length }} of {{ filteredProjects.length }} projects
      </p>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {{ currentPage }}
        </span>

        <button
          :disabled="currentPage * itemsPerPage >= filteredProjects.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toastMessage"
      :class="toastClass"
      class="fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/axios'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const projects = ref([])
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)
const toastMessage = ref('')
const toastClass = ref('bg-green-500 text-white')

async function fetchReport() {
  try {
    const response = await axios.get('/api/reports-for/projects', {
      params: {
        from: fromDate.value,
        to: toDate.value,
      },
    })
    projects.value = response.data.data
    toastMessage.value = response.data.message
    toastClass.value = 'bg-green-500 text-white'
  } catch (error) {
    console.error('Error fetching report:', error)
    toastMessage.value = error.response?.data?.message || 'An error occurred while fetching the report.'
    toastClass.value = 'bg-red-500 text-white'
  }
}

const filteredProjects = computed(() => projects.value)

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProjects.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  currentPage.value = page
}

function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('en-GB', options)
}

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'on-progress':
    case 'in progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(
    filteredProjects.value.map((project, index) => ({
      No: (currentPage.value - 1) * itemsPerPage + index + 1,
      Engineer: project.user?.name || 'N/A',
      'Project Name': project.project_name || 'N/A',
      Status: project.project_status || 'N/A',
      'Start Date': formatDate(project.start_date) || 'N/A',
      'End Date': formatDate(project.end_date) || 'N/A',
      'Assigned At': formatDate(project.created_at) || 'N/A'
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects')
  XLSX.writeFile(workbook, 'projects_report.xlsx')
}

function exportToPDF() {
  const doc = new jsPDF()
  const tableColumn = ["No", "Engineer", "Project Name", "Status", "Start Date", "End Date", "Assigned At"]
  const tableRows = []

  filteredProjects.value.forEach((project, index) => {
    const projectData = [
      (currentPage.value - 1) * itemsPerPage + index + 1,
      project.user?.name || 'N/A',
      project.project_name || 'N/A',
      project.project_status || 'N/A',
      formatDate(project.start_date) || 'N/A',
      formatDate(project.end_date) || 'N/A',
      formatDate(project.created_at) || 'N/A'
    ]
    tableRows.push(projectData)
  })

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 128] },
    styles: { fontSize: 10 },
  })

  doc.text("Project Reports", 14, 15)
  doc.save('projects_report.pdf')
}
</script>

<style scoped>
/* Toast animation */
.fixed {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>