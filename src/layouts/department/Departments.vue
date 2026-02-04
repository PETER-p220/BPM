<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto font-sans">
    <PageHeader subtitle="Departments">
      <router-link to="/create-department">
        <BaseButton
          variant="primary"
          size="md"
          class="w-full sm:w-auto inline-flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Create New Department
        </BaseButton>
      </router-link>
    </PageHeader>

    <!-- Search -->
    <div class="relative max-w-md">
      <input
        v-model="filter"
        type="search"
        placeholder="Search by name or location..."
        class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <i class="fas fa-search text-gray-400"></i>
      </div>
    </div>

    <!-- Table Container -->
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
                Location
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr
              v-for="(dept, index) in paginatedDepartments"
              :key="dept.department_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ dept.name }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ dept.location || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <div class="flex items-center gap-5">
                  <button
                    @click="editDepartment(dept.department_id)"
                    class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                    title="Edit department"
                  >
                    <i class="fas fa-edit text-lg"></i>
                  </button>
                  <button
                    @click="confirmDelete(dept.department_id, dept.name)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Delete department"
                  >
                    <i class="fas fa-trash text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty / Loading state -->
            <tr v-if="loading || paginatedDepartments.length === 0">
              <td colspan="4" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center gap-3">
                  <i v-if="loading" class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
                  <i v-else class="fas fa-folder-open text-4xl opacity-50"></i>
                  <p class="font-medium">
                    {{ loading ? 'Loading departments...' : 'No departments found' }}
                  </p>
                  <p class="text-sm" v-if="!loading">
                    Try adjusting your search or create a new department.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredDepartments.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredDepartments.length) }} of {{ filteredDepartments.length }}
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
          :disabled="currentPage * itemsPerPage >= filteredDepartments.length"
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

const router = useRouter()
const toast = useToast()

const departments = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10 // increased to 10 – more modern default
const loading = ref(false)

// Fetch data
onMounted(async () => {
  await fetchDepartments()
})

async function fetchDepartments() {
  loading.value = true
  try {
    const response = await axios.get('/api/departments')
    departments.value = response.data?.data || [] // safe access
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// Filtering & Pagination
const filteredDepartments = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return departments.value

  return departments.value.filter(dept =>
    dept.name?.toLowerCase().includes(term) ||
    dept.location?.toLowerCase().includes(term)
  )
})

const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDepartments.value.slice(start, start + itemsPerPage)
})

// Actions
function editDepartment(deptId) {
  router.push({ name: 'EditDepartment', params: { department_id: deptId } })
}

async function confirmDelete(deptId, name) {
  const result = await Swal.fire({
    title: 'Delete Department?',
    html: `You are about to permanently delete <strong>"${name || 'this department'}"</strong>.<br>
           This action cannot be undone and may affect associated records.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true
  })

  if (result.isConfirmed) {
    await deleteDepartment(deptId)
  }
}

async function deleteDepartment(deptId) {
  try {
    await axios.delete(`/api/departments/${deptId}`)
    departments.value = departments.value.filter(d => d.department_id !== deptId)
    toast.success('Department deleted successfully')
  } catch (error) {
    handleError(error)
  }
}

function changePage(page) {
  const maxPage = Math.ceil(filteredDepartments.value.length / itemsPerPage)
  if (page >= 1 && page <= maxPage) {
    currentPage.value = page
  }
}

function handleError(error) {
  let msg = 'An unexpected error occurred'

  if (error.response?.data?.message) {
    msg = error.response.data.message
  } else if (error.response) {
    msg = error.response.statusText || `Server error (${error.response.status})`
  } else if (error.request) {
    msg = 'No response from server. Check your network.'
  } else {
    msg = error.message
  }

  toast.error(msg, { timeout: 7000 })
}
</script>