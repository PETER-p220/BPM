<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto font-sans">
    <PageHeader subtitle="System Users">
      <router-link to="/add-user">
        <BaseButton
          variant="primary"
          size="md"
          class="w-full sm:w-auto inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Create New User
        </BaseButton>
      </router-link>
    </PageHeader>

    <!-- Search + Export -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="filter"
          type="search"
          placeholder="Search by name or email..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="exportToExcel"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/30 transition shadow-sm"
        >
          <i class="fas fa-file-excel mr-2 text-green-600"></i>
          Export Excel
        </button>

        <button
          @click="exportToPDF"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition shadow-sm"
        >
          <i class="fas fa-file-pdf mr-2 text-red-600"></i>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/60">
            <tr>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                No
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Name
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Role
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Department
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr
              v-for="(user, index) in paginatedData"
              :key="user.user_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ user.name || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ user.role || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ user.department || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  class="inline-flex px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(user.status)"
                >
                  {{ user.status || 'Unknown' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ user.email || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <div class="flex items-center gap-5">
                  <button
                    @click="editUser(user.user_id)"
                    class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                    title="Edit user"
                  >
                    <i class="fas fa-edit text-lg"></i>
                  </button>
                  <button
                    @click="confirmDelete(user.user_id, user.name)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Delete user"
                  >
                    <i class="fas fa-trash text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="loading || paginatedData.length === 0">
              <td colspan="7" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center gap-3">
                  <i v-if="loading" class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
                  <i v-else class="fas fa-users-slash text-4xl opacity-50"></i>
                  <p class="font-medium">
                    {{ loading ? 'Loading users...' : 'No users found' }}
                  </p>
                  <p class="text-sm" v-if="!loading">
                    Try adjusting your search or add a new user.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredData.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <button
          :disabled="currentPage * itemsPerPage >= filteredData.length"
          @click="changePage(currentPage + 1)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const users = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

// Fetch users
onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  loading.value = true
  try {
    const response = await axios.get('/api/all/users')
    users.value = response.data?.users || []
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// Filtering & Pagination
const filteredData = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return users.value

  return users.value.filter(user =>
    user.name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term)
  )
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

// Status badge styling
function getStatusClass(status) {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  const s = status.toLowerCase()
  if (s === 'active')    return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
  if (s === 'inactive')  return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  if (s === 'pending')   return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Actions
function editUser(userId) {
  router.push({ name: 'EditUser', params: { user_id: userId } })
}

async function confirmDelete(userId, name) {
  const result = await Swal.fire({
    title: 'Delete User?',
    html: `You are about to permanently delete <strong>"${name || 'this user'}"</strong>.<br>
           This action cannot be undone and may affect system access.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, Delete User',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true
  })

  if (result.isConfirmed) {
    await deleteUser(userId)
  }
}

async function deleteUser(userId) {
  try {
    await axios.delete(`/api/auth/user/${userId}`)
    users.value = users.value.filter(u => u.user_id !== userId)
    toast.success('User deleted successfully')
  } catch (error) {
    handleError(error)
  }
}

function changePage(page) {
  const max = Math.ceil(filteredData.value.length / itemsPerPage)
  if (page >= 1 && page <= max) {
    currentPage.value = page
  }
}

// Exports
function exportToExcel() {
  if (!paginatedData.value.length) {
    toast.warning('No data to export')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(
    paginatedData.value.map((u, i) => ({
      No: (currentPage.value - 1) * itemsPerPage + i + 1,
      Name: u.name || '',
      Role: u.role || '',
      Department: u.department || '',
      'Account Status': u.status || '',
      Email: u.email || ''
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
  XLSX.writeFile(workbook, 'Users_List.xlsx')
}

function exportToPDF() {
  if (!paginatedData.value.length) {
    toast.warning('No data to export')
    return
  }

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Users Report', 14, 22)

  autoTable(doc, {
    startY: 30,
    head: [['No', 'Name', 'Role', 'Department', 'Status', 'Email']],
    body: paginatedData.value.map((u, i) => [
      (currentPage.value - 1) * itemsPerPage + i + 1,
      u.name || '—',
      u.role || '—',
      u.department || '—',
      u.status || '—',
      u.email || '—'
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    styles: { fontSize: 9, cellPadding: 3 }
  })

  doc.save('Users_List.pdf')
}

function handleError(error) {
  let msg = 'An unexpected error occurred'
  if (error.response?.data?.message) msg = error.response.data.message
  else if (error.response) msg = error.response.statusText || `Error ${error.response.status}`
  else if (error.request) msg = 'No response from server. Check connection.'
  else msg = error.message

  toast.error(msg, { timeout: 7000 })
}
</script>