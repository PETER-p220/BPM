<template>
  <div class="min-h-screen font-['DM_Sans',sans-serif] px-4 py-8 sm:px-6 lg:px-8" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <div class="mx-auto max-w-7xl">

      <!-- Header -->
      <div class="mb-8 rounded-2xl px-6 py-5 shadow-sm border border-[#dce7f3]" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%)">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-[#183b63]">All Projects</h1>
            <p class="text-[13px] text-[#7a93af]">Overview and management of all assigned projects</p>
          </div>
          <router-link to="/assign/project">
            <button class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-[0_12px_24px_rgba(35,96,182,0.22)] hover:shadow-lg transition-all flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Assign New Project
            </button>
          </router-link>
        </div>
      </div>

      <!-- Search + Export -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-md">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg class="h-5 w-5 text-[#a4b8cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by name, status, contract..."
            class="block w-full rounded-xl border border-[#d9e6f3] bg-white py-2.5 pl-11 pr-4 text-[#183b63] placeholder:text-[#a4b8cf] focus:border-[#2f78dd] focus:ring-1 focus:ring-[#2f78dd]/30 sm:text-sm"
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            @click="exportToExcel"
            class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#1f9d8b]/30 text-[#1f9d8b] bg-[#edfaf7] hover:bg-[#d4f3ec] transition-all flex items-center gap-2"
          >
            <svg class="h-4 w-4 text-[#1f9d8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>

          <button
            @click="exportToPDF"
            class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#e87461]/30 text-[#e87461] bg-[#fef2f0] hover:bg-[#fde3df] transition-all flex items-center gap-2"
          >
            <svg class="h-4 w-4 text-[#e87461]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      <!-- Table Card -->
      <div class="overflow-hidden rounded-2xl border border-[#dce7f3] bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#edf2fa]">
            <thead class="bg-[#f7faff]">
              <tr>
                <th class="w-12 px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">No</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Project Name</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Engineer</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Created By</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Start Date</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">End Date</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Contract</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Created At</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Status</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Follow Up</th>
                <th class="w-24 px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7d94ac]">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#edf2fa]">
              <tr
                v-for="(project, index) in paginatedProjects"
                :key="project.project_id"
                class="hover:bg-[#f7faff] transition-colors"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#67819d] font-medium">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openProjectModal(project.project_id)"
                    class="text-[#1f9d8b] hover:text-[#194f92] font-semibold hover:underline"
                  >
                    {{ project.project_name }}
                  </button>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#183b63]">
                  {{ project.user.name }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#183b63]">
                  {{ project.created_by }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                  {{ formatDate(project.start_date) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                  {{ formatDate(project.end_date) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                  {{ project.contract.title }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                  {{ formatDate(project.created_at) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="statusBadgeClass(project.project_status)"
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em]"
                  >
                    {{ project.project_status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-[#4a6a8a]">
                  {{ project.follow_up }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <button
                    @click="editProject(project.project_id)"
                    class="text-[#7a93af] hover:text-[#194f92]"
                    title="Edit Project"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div
          v-if="paginatedProjects.length === 0"
          class="py-16 text-center"
        >
          <div class="w-14 h-14 bg-[#edf4fb] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="h-8 w-8 text-[#7d94ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m4-8V8a4 4 0 00-8 0v1m-4 8h16a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-[15px] font-semibold text-[#183b63]">
            {{ filter ? 'No matching projects found' : 'No projects yet' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredProjects.length > itemsPerPage" class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="text-[13px] text-[#7a93af]">
          Showing
          <span class="font-semibold text-[#183b63]">
            {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredProjects.length) }}
          </span>
          of
          <span class="font-semibold text-[#183b63]">{{ filteredProjects.length }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6f3] text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-colors',
              page === currentPage
                ? 'bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white border-[#2f78dd] shadow-md'
                : 'border border-[#d9e6f3] text-[#4a6a8a] hover:bg-[#f7faff]'
            ]"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage * itemsPerPage >= filteredProjects.length"
            @click="changePage(currentPage + 1)"
            class="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6f3] text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Project Details Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      >
        <div class="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Project Details
            </h2>
            <button
              @click="closeProjectModal"
              class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem label="Project Name" :value="selectedProject.project_name" />
            <DetailItem label="Project ID" :value="selectedProject.project_id" />
            <DetailItem label="Engineer" :value="selectedProject.user.name" />
            <DetailItem label="Created By" :value="selectedProject.created_by" />
            <DetailItem label="Start Date" :value="formatDate(selectedProject.start_date)" />
            <DetailItem label="End Date" :value="formatDate(selectedProject.end_date)" />
            <DetailItem label="Extended Date" :value="formatDate(selectedProject.extended_date)" />
            <DetailItem label="Status" :value="selectedProject.project_status" badge />
            <DetailItem label="Follow Up" :value="selectedProject.follow_up" />
            <DetailItem label="Created At" :value="formatDate(selectedProject.created_at)" />
            <DetailItem label="Updated At" :value="formatDate(selectedProject.updated_at)" />
            <DetailItem label="Contract Title" :value="selectedProject.contract.title" />
            <DetailItem label="Contract Timeline" :value="selectedProject.contract.time_line_category" />
            <DetailItem label="Contract Start" :value="formatDate(selectedProject.contract.start_date)" />
            <DetailItem label="Contract End" :value="formatDate(selectedProject.contract.end_date)" />
            <DetailItem label="Contract Status" :value="selectedProject.contract.status" />
            <DetailItem label="Performance Guarantee" :value="selectedProject.contract.performance_guarantee" />
            <DetailItem label="Tender Type" :value="selectedProject.tender.tender_type" />
          </div>

          <div class="mt-6 border-t pt-4 dark:border-gray-700">
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(member, idx) in selectedProject.members"
                :key="idx"
                class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                {{ member }}
              </span>
              <span v-if="!selectedProject.members?.length" class="text-gray-500 dark:text-gray-400">None assigned</span>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="closeProjectModal"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const projects = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showModal = ref(false)
const selectedProject = ref(null)

onMounted(async () => {
  await fetchProjects()
})

async function fetchProjects() {
  try {
    const { data } = await axios.get('api/projects')
    projects.value = data.data.map(p => ({
      ...p,
      project_name: p.project_name || 'N/A',
      user: p.user || { name: 'N/A' },
      members: p.members || [],
      created_by: p.created_by || 'N/A',
      start_date: p.start_date || null,
      end_date: p.end_date || null,
      extended_date: p.extended_date || null,
      project_status: p.project_status || 'N/A',
      follow_up: p.follow_up || 'N/A',
      created_at: p.created_at || null,
      updated_at: p.updated_at || null,
      contract: p.contract || {
        title: 'N/A',
        time_line_category: 'N/A',
        start_date: null,
        end_date: null,
        pdf_file: 'N/A',
        status: 'N/A',
        performance_guarantee: 'N/A'
      },
      tender: p.tender || { tender_type: 'N/A', attachment: 'N/A' }
    }))
  } catch (err) {
    toast.error('Failed to load projects')
    console.error(err)
  }
}

async function openProjectModal(projectId) {
  const project = projects.value.find(p => p.project_id === projectId)
  if (project) {
    selectedProject.value = project
    showModal.value = true
  } else {
    toast.error('Project not found')
  }
}

function closeProjectModal() {
  showModal.value = false
  selectedProject.value = null
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function editProject(projectId) {
  router.push({ name: 'HrEditProject', params: { project_id: projectId } })
}

const filteredProjects = computed(() => {
  if (!filter.value) return projects.value

  const term = filter.value.toLowerCase()
  return projects.value.filter(p =>
    p.project_name.toLowerCase().includes(term) ||
    p.user.name.toLowerCase().includes(term) ||
    p.created_by.toLowerCase().includes(term) ||
    p.project_status.toLowerCase().includes(term) ||
    p.contract.title.toLowerCase().includes(term) ||
    p.follow_up.toLowerCase().includes(term)
  )
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProjects.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5]
  }
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total]
  }

  return [current - 2, current - 1, current, current + 1, current + 2]
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function statusBadgeClass(status) {
  const map = {
    'on-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  }
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Export functions remain mostly the same — just make sure libraries are installed
function exportToExcel() {
  const data = filteredProjects.value.map((p, idx) => ({
    No: idx + 1,
    'Project Name': p.project_name,
    Engineer: p.user.name,
    'Created By': p.created_by,
    'Start Date': formatDate(p.start_date),
    'End Date': formatDate(p.end_date),
    Contract: p.contract.title,
    Status: p.project_status,
    'Follow Up': p.follow_up,
    'Created At': formatDate(p.created_at)
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Projects')
  XLSX.writeFile(wb, 'projects_export.xlsx')
}

function exportToPDF() {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['No', 'Project', 'Engineer', 'Created By', 'Start', 'End', 'Contract', 'Status', 'Follow Up', 'Created']],
    body: paginatedProjects.value.map((p, idx) => [
      idx + 1 + (currentPage.value - 1) * itemsPerPage,
      p.project_name,
      p.user.name,
      p.created_by,
      formatDate(p.start_date),
      formatDate(p.end_date),
      p.contract.title,
      p.project_status,
      p.follow_up,
      formatDate(p.created_at)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [45, 55, 72] }
  })
  doc.save('projects_export.pdf')
}
</script>

