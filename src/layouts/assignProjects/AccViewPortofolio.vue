<template>
  <div class="py-8 md:py-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Engineers With Projects
          </h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">
            Overview of engineers and their assigned projects
          </p>
        </div>
      </div>

      <!-- Search & Export Controls -->
      <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="relative flex-1">
            <input
              v-model="filter"
              type="text"
              placeholder="Search engineer name or email..."
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
              :disabled="isExporting || isLoading || !filteredUsers.length"
              class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <i class="fas fa-file-excel mr-2"></i>
              Excel
            </button>

            <button
              @click="exportToPDF"
              :disabled="isExporting || isLoading || !filteredUsers.length"
              class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <i class="fas fa-file-pdf mr-2"></i>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading engineers data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
        <i class="fas fa-users-slash text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">No engineers found</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          {{ filter ? 'Try adjusting your search.' : 'No engineers with projects yet.' }}
        </p>
      </div>

      <!-- Main Table -->
      <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Projects</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">In Progress</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Failed</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
              <tr
                v-for="(user, index) in paginatedUsers"
                :key="user.user_id"
                @click="openModal(user)"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ user.name || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {{ user.email || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {{ user.total_projects || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-yellow-600 dark:text-yellow-400">
                  {{ user.on_progress_projects || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 dark:text-green-400">
                  {{ user.completed_projects || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 dark:text-red-400">
                  {{ user.failed_projects || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    :class="user.status === 'is_active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'"
                  >
                    {{ user.status === 'is_active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>

              <!-- Empty row if no data (fallback) -->
              <tr v-if="paginatedUsers.length === 0">
                <td colspan="8" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                  No engineers match your search
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of
          {{ filteredUsers.length }} engineers
        </p>

        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            :disabled="currentPage * itemsPerPage >= filteredUsers.length"
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Engineer Details Modal -->
      <div
        v-if="selectedUser"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        @click="closeModal"
      >
        <div
          class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Engineer Details</h2>
            <button @click="closeModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ selectedUser.name || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ selectedUser.email || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <span
                  class="inline-flex px-3 py-1 text-sm font-medium rounded-full"
                  :class="selectedUser.status === 'is_active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'"
                >
                  {{ selectedUser.status === 'is_active' ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ selectedUser.role || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Department</p>
                <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ selectedUser.department || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400">{{ selectedUser.total_projects || 0 }}</p>
              </div>
            </div>

            <!-- Project Summary Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ selectedUser.on_progress_projects || 0 }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ selectedUser.completed_projects || 0 }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ selectedUser.failed_projects || 0 }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ selectedUser.total_projects || 0 }}</p>
              </div>
            </div>

            <!-- Assigned Projects List -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assigned Projects</h3>

              <div v-if="selectedUser.projects?.length" class="space-y-4">
                <div
                  v-for="project in selectedUser.projects"
                  :key="project.project_id"
                  class="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {{ project.project_name || 'Untitled Project' }}
                      </h4>
                      <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Status:</span>
                        <span :class="getStatusClass(project.project_status)" class="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full">
                          {{ project.project_status || '—' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Start Date</p>
                      <p class="font-medium">{{ project.start_date || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">End Date</p>
                      <p class="font-medium">{{ project.end_date || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Extended Date</p>
                      <p class="font-medium">{{ project.extended_date || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Created By</p>
                      <p class="font-medium">{{ project.created_by || '—' }}</p>
                    </div>
                  </div>

                  <div class="mt-4 text-sm">
                    <p>
                      <span class="text-gray-600 dark:text-gray-400 font-medium">Team Members:</span>
                      {{ project.members?.length ? project.members.join(', ') : 'None assigned' }}
                    </p>
                  </div>

                  <div v-if="project.contract || project.tender" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-if="project.contract">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Contract</p>
                      <p class="text-gray-600 dark:text-gray-400">{{ project.contract.title || '—' }}</p>
                      <p class="text-xs mt-1">Status: {{ project.contract.status || '—' }}</p>
                    </div>
                    <div v-if="project.tender">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Tender</p>
                      <p class="text-gray-600 dark:text-gray-400">{{ project.tender.title || '—' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p v-else class="text-gray-500 dark:text-gray-400 italic mt-4">
                No projects assigned to this engineer yet.
              </p>
            </div>
          </div>

          <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end">
            <button
              @click="closeModal"
              class="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
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
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const users = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedUser = ref(null)
const isLoading = ref(false)
const isExporting = ref(false)

onMounted(() => {
  fetchUsers()
})

async function fetchUsers() {
  isLoading.value = true
  try {
    const response = await axios.get('/api/users-with-project-summary')
    if (response.data.status) {
      users.value = response.data.data || []
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load engineers data')
  } finally {
    isLoading.value = false
  }
}

const filteredUsers = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return users.value

  return users.value.filter(user =>
    user.name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term)
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredUsers.value.length / itemsPerPage)) return
  currentPage.value = page
}

function openModal(user) {
  selectedUser.value = user
}

function closeModal() {
  selectedUser.value = null
}

function getStatusClass(status) {
  const classes = {
    'on-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

async function exportToExcel() {
  isExporting.value = true
  try {
    const data = filteredUsers.value.map((user, index) => ({
      No: index + 1,
      Name: user.name || '—',
      Email: user.email || '—',
      Status: user.status === 'is_active' ? 'Active' : 'Inactive',
      Role: user.role || '—',
      Department: user.department || '—',
      'Total Projects': user.total_projects || 0,
      'On Progress': user.on_progress_projects || 0,
      Completed: user.completed_projects || 0,
      Failed: user.failed_projects || 0
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Engineers')
    XLSX.writeFile(wb, `Engineers_With_Projects_${new Date().toISOString().slice(0,10)}.xlsx`)
  } catch (err) {
    toast.error('Failed to export to Excel')
  } finally {
    isExporting.value = false
  }
}

function exportToPDF() {
  isExporting.value = true
  try {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Engineers With Projects Report', 14, 20)

    const tableData = filteredUsers.value.map((user, index) => [
      index + 1,
      user.name || '—',
      user.email || '—',
      user.status === 'is_active' ? 'Active' : 'Inactive',
      user.role || '—',
      user.department || '—',
      user.total_projects || 0,
      user.on_progress_projects || 0,
      user.completed_projects || 0,
      user.failed_projects || 0
    ])

    autoTable(doc, {
      head: [['No', 'Name', 'Email', 'Status', 'Role', 'Department', 'Total Projects', 'In Progress', 'Completed', 'Failed']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [40, 58, 83] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    })

    doc.save(`Engineers_With_Projects_${new Date().toISOString().slice(0,10)}.pdf`)
  } catch (err) {
    toast.error('Failed to export to PDF')
  } finally {
    isExporting.value = false
  }
}
</script>