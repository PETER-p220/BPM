<template>
  <div class="min-h-screen bg-[#edf4fb] px-6 py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] shadow-[0_4px_12px_rgba(25,79,146,0.25)]">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <h1 class="text-[22px] font-bold tracking-tight text-[#183b63]">Project Extensions</h1>
          <p class="mt-0.5 text-[13px] text-[#7a93af]">View and manage all project extension requests</p>
        </div>
      </div>

      <router-link to="/extend-project">
        <button class="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(25,79,146,0.25)] transition hover:shadow-[0_6px_18px_rgba(25,79,146,0.35)]">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Create Extension
        </button>
      </router-link>
    </div>

    <!-- Search & Export -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by project name, date..."
          class="w-full rounded-xl border border-[#d9e6f3] bg-white/90 py-2.5 pl-10 pr-4 text-sm text-[#183b63] shadow-[0_2px_8px_rgba(18,58,99,0.04)] outline-none transition placeholder:text-[#a4b8cf] focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/20"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#7a93af]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="exportToExcel"
          class="inline-flex items-center gap-1.5 rounded-xl border border-[#d9e6f3] bg-white px-4 py-2 text-[13px] font-semibold text-[#1f9d8b] shadow-sm transition hover:bg-[#f0fdf9] hover:border-[#1f9d8b]/30"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Excel
        </button>
        <button
          @click="exportToPDF"
          class="inline-flex items-center gap-1.5 rounded-xl border border-[#d9e6f3] bg-white px-4 py-2 text-[13px] font-semibold text-[#d95f43] shadow-sm transition hover:bg-[#fef5f3] hover:border-[#d95f43]/30"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          PDF
        </button>
      </div>
    </div>

    <!-- Main Table -->
    <div class="rounded-2xl border border-[#dbe7f3] bg-white/95 shadow-[0_8px_18px_rgba(18,58,99,0.05)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-[#f7faff] border-b border-[#e4edf7]">
              <th class="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">No</th>
              <th class="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Project</th>
              <th class="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Extended Date</th>
              <th class="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Letter File</th>
              <th class="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Created At</th>
              <th class="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Updated At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#edf2fa]">
            <tr
              v-for="(extension, index) in paginatedExtensions"
              :key="extension.extension_id"
              class="transition-colors hover:bg-[#f7faff]"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-[#67819d]">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#183b63]">
                {{ extension.project?.project_name || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                {{ formatDate(extension.extended_date) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <button
                  v-if="extension.extend_letter_file"
                  @click="downloadFile(extension.extend_letter_file, `extension_${extension.extension_id}.pdf`)"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:shadow-md"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </button>
                <span v-else class="text-[11px] text-[#a4b8cf]">No file</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                {{ formatDate(extension.created_at) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                {{ formatDate(extension.updated_at) }}
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="paginatedExtensions.length === 0">
              <td colspan="6" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center">
                  <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4fb]">
                    <svg class="h-7 w-7 text-[#7d94ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p class="text-[15px] font-semibold text-[#183b63]">No extensions found</p>
                  <p class="mt-1 text-[13px] text-[#7a93af]">Try adjusting your search or create a new extension</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-[13px] text-[#7a93af]">
        Showing {{ paginatedExtensions.length }} of {{ filteredExtensions.length }} extensions
      </p>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] shadow-sm transition hover:bg-[#f7faff] disabled:opacity-40"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <span class="px-3 text-[13px] font-semibold text-[#183b63]">
          Page {{ currentPage }}
        </span>

        <button
          :disabled="currentPage * itemsPerPage >= filteredExtensions.length"
          @click="changePage(currentPage + 1)"
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] shadow-sm transition hover:bg-[#f7faff] disabled:opacity-40"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
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
    headStyles: { fillColor: [25, 79, 146] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save('Project_Extensions.pdf')
}
</script>