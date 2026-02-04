<template>
  <div class="engineers-with-projects py-8 md:py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Engineers With Projects</h1>
          <p class="mt-1 text-gray-600">Overview of engineers and their assigned projects</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="mb-6 bg-white shadow rounded-lg p-4 border border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="relative flex-1">
            <input
              v-model="filter"
              type="text"
              placeholder="Search engineer name or email..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>

          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="btn-export excel"
              :disabled="isExporting || isLoading || !filteredUsers.length"
            >
              <i class="fas fa-file-excel mr-2"></i>
              Excel
            </button>

            <button
              @click="exportToPDF"
              class="btn-export pdf"
              :disabled="isExporting || isLoading || !filteredUsers.length"
            >
              <i class="fas fa-file-pdf mr-2"></i>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-white shadow rounded-xl p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-gray-200"></div>
        <p class="mt-4 text-gray-600">Loading engineers data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="bg-white shadow rounded-xl p-12 text-center">
        <i class="fas fa-users-slash text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700">No engineers found</h3>
        <p class="mt-2 text-gray-500">
          {{ filter ? 'Try adjusting your search.' : 'No engineers with projects yet.' }}
        </p>
      </div>

      <!-- Engineer Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in paginatedUsers"
          :key="user.user_id"
          @click="openModal(user)"
          class="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ user.name || '—' }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ user.email || '—' }}</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">{{ user.total_projects || 0 }}</div>
              <p class="text-xs text-gray-500">Projects</p>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="font-medium">In Progress:</span> {{ user.on_progress_projects || 0 }}
            </div>
            <div>
              <span class="font-medium">Completed:</span> {{ user.completed_projects || 0 }}
            </div>
            <div>
              <span class="font-medium">Failed:</span> {{ user.failed_projects || 0 }}
            </div>
            <div>
              <span class="font-medium">Status:</span>
              <span :class="user.status === 'is_active' ? 'text-green-600' : 'text-red-600'">
                {{ user.status === 'is_active' ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > 0" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> of
          <span class="font-medium">{{ filteredUsers.length }}</span> engineers
        </div>

        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            :disabled="currentPage * itemsPerPage >= filteredUsers.length"
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="selectedUser"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-2xl font-bold text-gray-900">Engineer Details</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl">
              ×
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-600">Name</p>
                <p class="text-lg font-medium">{{ selectedUser.name || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="text-lg font-medium">{{ selectedUser.email || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <span
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="selectedUser.status === 'is_active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ selectedUser.status === 'is_active' ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">Role</p>
                <p class="text-lg font-medium">{{ selectedUser.role || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Department</p>
                <p class="text-lg font-medium">{{ selectedUser.department || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Total Projects</p>
                <p class="text-lg font-bold text-blue-600">{{ selectedUser.total_projects || 0 }}</p>
              </div>
            </div>

            <!-- Project Summary -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <div class="text-center">
                <p class="text-sm text-gray-600">In Progress</p>
                <p class="text-xl font-bold text-yellow-600">{{ selectedUser.on_progress_projects || 0 }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600">Completed</p>
                <p class="text-xl font-bold text-green-600">{{ selectedUser.completed_projects || 0 }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600">Failed</p>
                <p class="text-xl font-bold text-red-600">{{ selectedUser.failed_projects || 0 }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-xl font-bold text-gray-900">{{ selectedUser.total_projects || 0 }}</p>
              </div>
            </div>

            <!-- Projects List -->
            <div>
              <h3 class="text-xl font-semibold mb-4">Assigned Projects</h3>
              <div v-if="selectedUser.projects?.length" class="space-y-4">
                <div
                  v-for="project in selectedUser.projects"
                  :key="project.project_id"
                  class="p-5 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div class="flex justify-between items-start">
                    <h4 class="text-lg font-medium text-gray-900">{{ project.project_name || '—' }}</h4>
                    <span
                      class="px-3 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(project.project_status)"
                    >
                      {{ project.project_status || '—' }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600">Start:</span> {{ project.start_date || '—' }}
                    </div>
                    <div>
                      <span class="text-gray-600">End:</span> {{ project.end_date || '—' }}
                    </div>
                    <div>
                      <span class="text-gray-600">Extended:</span> {{ project.extended_date || '—' }}
                    </div>
                    <div>
                      <span class="text-gray-600">Created By:</span> {{ project.created_by || '—' }}
                    </div>
                  </div>

                  <div class="mt-3 text-sm">
                    <p><span class="text-gray-600">Members:</span> 
                      {{ project.members?.length ? project.members.join(', ') : 'None' }}
                    </p>
                  </div>

                  <div v-if="project.contract" class="mt-3 pt-3 border-t border-gray-200">
                    <p class="text-sm font-medium">Contract: {{ project.contract.title || '—' }}</p>
                    <p class="text-sm text-gray-600">Status: {{ project.contract.status || '—' }}</p>
                  </div>

                  <div v-if="project.tender" class="mt-2">
                    <p class="text-sm font-medium">Tender: {{ project.tender.title || '—' }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-500 italic mt-4">No projects assigned to this engineer.</p>
            </div>
          </div>

          <div class="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
            <button
              @click="closeModal"
              class="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
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
    'on-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
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
      'Completed': user.completed_projects || 0,
      'Failed': user.failed_projects || 0
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
    doc.text('Engineers With Projects', 14, 20)

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

<style scoped>
.btn-primary {
  background-color: #1e293b;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background-color: #0f172a;
}

.btn-export {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-export.excel {
  border-color: #16a34a;
  color: #166534;
}

.btn-export.excel:hover {
  background-color: #f0fdf4;
}

.btn-export.pdf {
  border-color: #dc2626;
  color: #991b1b;
}

.btn-export.pdf:hover {
  background-color: #fef2f2;
}
</style>