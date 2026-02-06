<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Project Extensions</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage all project extension requests and approvals
        </p>
      </div>

      <router-link to="/extend-project">
        <button
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Extension
        </button>
      </router-link>
    </div>

    <!-- Search & Export -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by project name, engineer, or reason..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="exportToExcel"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>

        <button
          @click="exportToPDF"
          class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Main Table -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extended Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Letter File</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(extension, index) in paginatedExtensions"
              :key="extension.extension_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" style="white-space: nowrap;">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100" style="white-space: nowrap;">
                {{ extension.project?.project_name || '—' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300" style="white-space: nowrap;">
                {{ formatDate(extension.extended_date) }}
              </td>
              <td class="px-6 py-4 text-sm" style="white-space: nowrap;">
                <button
                  v-if="extension.extend_letter_file"
                  @click="downloadFile(extension.extend_letter_file, `extension_${extension.extension_id}.pdf`)"
                  class="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <span v-else class="text-gray-400 text-xs">No file</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {{ formatDate(extension.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {{ formatDate(extension.updated_at) }}
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="paginatedExtensions.length === 0">
              <td colspan="6" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-lg font-medium">No extensions found</p>
                  <p class="mt-1">Try adjusting your search or create a new extension</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedExtensions.length }} of {{ filteredExtensions.length }} extensions
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
          :disabled="currentPage * itemsPerPage >= filteredExtensions.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const projectExtensions = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  try {
    const response = await axios.get('/api/project-extension')
    if (response.data.status) {
      projectExtensions.value = response.data.data || []
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load project extensions')
  }
}

async function downloadFile(url, filename) {
  if (!url) {
    toast.error('No file available')
    return
  }

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch file')
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    toast.error('Failed to download file')
  }
}

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi'
  }).format(date)
}

const filteredExtensions = computed(() => {
  if (!filter.value.trim()) return projectExtensions.value

  const search = filter.value.toLowerCase()
  return projectExtensions.value.filter(ext =>
    ext.project?.project_name?.toLowerCase().includes(search) ||
    ext.extended_date?.toLowerCase().includes(search) ||
    ext.extend_letter_file?.toLowerCase().includes(search) ||
    ext.created_at?.toLowerCase().includes(search) ||
    ext.updated_at?.toLowerCase().includes(search)
  )
})

const paginatedExtensions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredExtensions.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredExtensions.value.length / itemsPerPage)) return
  currentPage.value = page
}

function exportToExcel() {
  if (!filteredExtensions.value.length) {
    toast.warning('No data to export')
    return
  }

  const data = filteredExtensions.value.map((ext, index) => ({
    No: index + 1,
    Project: ext.project?.project_name || '—',
    'Extended Date': formatDate(ext.extended_date) || '—',
    'Letter File': ext.extend_letter_file ? 'Yes' : 'No',
    'Created At': formatDate(ext.created_at) || '—',
    'Updated At': formatDate(ext.updated_at) || '—'
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Extensions')
  XLSX.writeFile(workbook, 'Project_Extensions.xlsx')
}

function exportToPDF() {
  if (!filteredExtensions.value.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Project Extensions Report', 14, 20)

  const tableData = filteredExtensions.value.map((ext, index) => [
    index + 1,
    ext.project?.project_name || '—',
    formatDate(ext.extended_date) || '—',
    ext.extend_letter_file ? 'Yes' : 'No',
    formatDate(ext.created_at) || '—',
    formatDate(ext.updated_at) || '—'
  ])

  autoTable(doc, {
    head: [['No', 'Project', 'Extended Date', 'Letter File', 'Created At', 'Updated At']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [75, 85, 99] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save('Project_Extensions.pdf')
}
</script>