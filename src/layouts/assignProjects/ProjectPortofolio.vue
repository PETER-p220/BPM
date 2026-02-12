<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Engineers With Projects
        </h1>
        <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Overview of engineers and their assigned project statistics
        </p>
      </div>

      <!-- Search + Export -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-md">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by engineer name or email..."
            class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-sm"
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-if="filteredUsers.length"
            @click="exportToExcel"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>

          <button
            v-if="filteredUsers.length"
            @click="exportToPDF"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-12 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  No
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Engineer Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total Projects
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  On Progress
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Completed
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Failed
                </th>
                <th class="w-32 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="(user, index) in paginatedUsers"
                :key="user.user_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                @click="openModal(user)"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ user.name || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ user.email || 'N/A' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ user.total_projects || 0 }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-amber-600 dark:text-amber-400">
                  {{ user.on_progress_projects || 0 }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-green-600 dark:text-green-400">
                  {{ user.completed_projects || 0 }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-red-600 dark:text-red-400">
                  {{ user.failed_projects || 0 }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm">
                  <button
                    @click.stop="openModal(user)"
                    class="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-if="paginatedUsers.length === 0"
          class="py-16 text-center text-gray-500 dark:text-gray-400"
        >
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM6 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="mt-4 text-lg font-medium">
            {{ filter ? 'No matching engineers found' : 'No engineers with projects yet' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Showing
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}
          </span>
          of
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ filteredUsers.length }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
              'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-teal-600 text-white shadow-sm'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage * itemsPerPage >= filteredUsers.length"
            @click="changePage(currentPage + 1)"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- User Details Modal -->
      <div
        v-if="selectedUser"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        @click="closeModal"
      >
        <div
          class="w-full max-w-4xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          @click.stop
        >
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Engineer Details: {{ selectedUser.name || 'N/A' }}
            </h2>
            <button
              @click="closeModal"
              class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label="Name" :value="selectedUser.name" />
            <DetailItem label="Email" :value="selectedUser.email" />
            <DetailItem label="Status" :value="selectedUser.status" />
            <DetailItem label="Role" :value="selectedUser.role" />
            <DetailItem label="Department" :value="selectedUser.department" />
            <DetailItem label="Total Projects" :value="selectedUser.total_projects" />
            <DetailItem label="On Progress" :value="selectedUser.on_progress_projects" color="amber" />
            <DetailItem label="Completed" :value="selectedUser.completed_projects" color="green" />
            <DetailItem label="Failed" :value="selectedUser.failed_projects" color="red" />
          </div>

          <!-- Projects List -->
          <div class="mt-8">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Assigned Projects ({{ selectedUser.projects?.length || 0 }})
            </h3>

            <div v-if="selectedUser.projects?.length" class="space-y-4">
              <div
                v-for="project in selectedUser.projects"
                :key="project.project_id"
                class="rounded-lg border border-gray-200 p-5 dark:border-gray-700"
              >
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem label="Project Name" :value="project.project_name" />
                  <DetailItem label="Status" :value="project.project_status" badge />
                  <DetailItem label="Start Date" :value="formatDate(project.start_date)" />
                  <DetailItem label="End Date" :value="formatDate(project.end_date)" />
                  <DetailItem label="Extended Date" :value="formatDate(project.extended_date)" />
                  <DetailItem label="Follow Up" :value="project.follow_up" />
                  <DetailItem label="Created By" :value="project.created_by" />
                  <DetailItem
                    label="Members"
                    :value="project.members?.length ? project.members.join(', ') : 'None'"
                  />
                  <DetailItem label="Contract Title" :value="project.contract?.title" />
                  <DetailItem label="Contract Status" :value="project.contract?.status" />
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 dark:text-gray-400 italic">
              No projects assigned to this engineer.
            </p>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const users = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedUser = ref(null)

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  try {
    const { data } = await axios.get('/api/users-with-project-summary')
    if (data.status) {
      users.value = data.data
    }
  } catch (err) {
    toast.error('Failed to load engineer data')
    console.error(err)
  }
}

const filteredUsers = computed(() => {
  if (!filter.value) return users.value
  const term = filter.value.toLowerCase()
  return users.value.filter(user =>
    (user.name || '').toLowerCase().includes(term) ||
    (user.email || '').toLowerCase().includes(term)
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, 5]
  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [current - 2, current - 1, current, current + 1, current + 2].filter(p => p >= 1 && p <= total)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function openModal(user) {
  selectedUser.value = user
}

function closeModal() {
  selectedUser.value = null
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

function exportToExcel() {
  const data = filteredUsers.value.map((u, i) => ({
    No: i + 1,
    Name: u.name || 'N/A',
    Email: u.email || 'N/A',
    Status: u.status || 'N/A',
    Role: u.role || 'N/A',
    Department: u.department || 'N/A',
    'Total Projects': u.total_projects || 0,
    'On Progress': u.on_progress_projects || 0,
    Completed: u.completed_projects || 0,
    Failed: u.failed_projects || 0
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Engineers')
  XLSX.writeFile(wb, 'engineers_with_projects.xlsx')
}

function exportToPDF() {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['No', 'Name', 'Email', 'Status', 'Role', 'Dept', 'Total', 'Progress', 'Completed', 'Failed']],
    body: filteredUsers.value.map((u, i) => [
      i + 1,
      u.name || 'N/A',
      u.email || 'N/A',
      u.status || 'N/A',
      u.role || 'N/A',
      u.department || 'N/A',
      u.total_projects || 0,
      u.on_progress_projects || 0,
      u.completed_projects || 0,
      u.failed_projects || 0
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [45, 55, 72] }
  })
  doc.save('engineers_with_projects.pdf')
}
</script>

