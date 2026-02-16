<template>
  <div class="min-h-screen py-8 px-4 bg-white" style="font-family: 'Inter', 'Segoe UI', sans-serif;">
    <div class="container mx-auto max-w-7xl">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Departments</h1>
            <p class="text-gray-600">Manage organizational departments and locations</p>
          </div>
          <router-link to="/create-department">
            <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md">
              <i class="fas fa-plus"></i>
              Create New Department
            </button>
          </router-link>
        </div>

        <!-- Stats Bar -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-700 font-medium mb-1">Total Departments</p>
                <p class="text-2xl font-bold text-blue-900">{{ departments.length }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <i class="fas fa-building text-blue-700 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-700 font-medium mb-1">With Locations</p>
                <p class="text-2xl font-bold text-green-900">{{ departmentsWithLocation }}</p>
              </div>
              <div class="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <i class="fas fa-map-marker-alt text-green-700 text-xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-700 font-medium mb-1">Filtered Results</p>
                <p class="text-2xl font-bold text-purple-900">{{ filteredDepartments.length }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <i class="fas fa-filter text-purple-700 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="filter"
              type="search"
              placeholder="Search by department name or location..."
              class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              v-if="filter"
              @click="filter = ''"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="fas fa-info-circle text-blue-500"></i>
            <span>{{ filteredDepartments.length }} {{ filteredDepartments.length === 1 ? 'department' : 'departments' }} found</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white border border-gray-200 rounded-xl shadow-sm p-12">
        <div class="flex flex-col items-center justify-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 font-medium">Loading departments...</p>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Department Name
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="(dept, index) in paginatedDepartments"
                :key="dept.department_id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-building text-blue-600"></i>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">{{ dept.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="dept.location" class="flex items-center gap-2 text-sm text-gray-600">
                    <i class="fas fa-map-marker-alt text-gray-400"></i>
                    {{ dept.location }}
                  </div>
                  <span v-else class="text-sm text-gray-400">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="editDepartment(dept.department_id)"
                      class="inline-flex items-center justify-center w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:shadow-md"
                      title="Edit department"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="confirmDelete(dept.department_id, dept.name)"
                      class="inline-flex items-center justify-center w-9 h-9 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 hover:shadow-md"
                      title="Delete department"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="paginatedDepartments.length === 0">
                <td colspan="4" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-folder-open text-4xl text-gray-400"></i>
                    </div>
                    <div>
                      <p class="text-lg font-semibold text-gray-900 mb-1">No departments found</p>
                      <p class="text-sm text-gray-600">
                        {{ filter ? 'Try adjusting your search criteria' : 'Get started by creating your first department' }}
                      </p>
                    </div>
                    <router-link v-if="!filter" to="/create-department">
                      <button class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 mt-2">
                        <i class="fas fa-plus"></i>
                        Create First Department
                      </button>
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div v-if="filteredDepartments.length > 0" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="text-sm text-gray-600">
              Showing <span class="font-semibold text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
              <span class="font-semibold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredDepartments.length) }}</span> of 
              <span class="font-semibold text-gray-900">{{ filteredDepartments.length }}</span> results
            </div>

            <div class="flex items-center gap-2">
              <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i class="fas fa-chevron-left mr-2"></i>
                Previous
              </button>

              <!-- Page numbers -->
              <div class="hidden sm:flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200',
                    page === currentPage
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                :disabled="currentPage * itemsPerPage >= filteredDepartments.length"
                @click="changePage(currentPage + 1)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <i class="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
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
import Swal from 'sweetalert2'

const router = useRouter()
const toast = useToast()

const departments = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

// Fetch data
onMounted(async () => {
  await fetchDepartments()
})

async function fetchDepartments() {
  loading.value = true
  try {
    const response = await axios.get('/api/departments')
    departments.value = response.data?.data || []
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// Computed stats
const departmentsWithLocation = computed(() => {
  return departments.value.filter(d => d.location && d.location.trim() !== '').length
})

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

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredDepartments.value.length / itemsPerPage)
})

// Visible page numbers for pagination
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Actions
function editDepartment(deptId) {
  router.push({ name: 'EditDepartment', params: { department_id: deptId } })
}

async function confirmDelete(deptId, name) {
  const result = await Swal.fire({
    title: 'Delete Department?',
    html: `
      <div class="text-left">
        <p class="text-gray-700 mb-3">You are about to delete the department:</p>
        <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <p class="font-semibold text-red-900">${name || 'this department'}</p>
        </div>
        <p class="text-gray-600 text-sm">
          <i class="fas fa-exclamation-triangle text-amber-500 mr-1"></i>
          This action cannot be undone and may affect associated records.
        </p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '<i class="fas fa-trash mr-2"></i>Yes, Delete',
    cancelButtonText: '<i class="fas fa-times mr-2"></i>Cancel',
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'rounded-lg font-medium px-5 py-2.5',
      cancelButton: 'rounded-lg font-medium px-5 py-2.5'
    }
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
    
    // Adjust current page if needed
    if (paginatedDepartments.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    handleError(error)
  }
}

function changePage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleError(error) {
  let msg = 'An unexpected error occurred'

  if (error.response?.data?.message) {
    msg = error.response.data.message
  } else if (error.response?.data?.error) {
    msg = error.response.data.error
  } else if (error.response) {
    msg = error.response.statusText || `Server error (${error.response.status})`
  } else if (error.request) {
    msg = 'No response from server. Check your network.'
  } else {
    msg = error.message
  }

  toast.error(msg, { timeout: 7000 })
  console.error('Error:', error)
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Table hover effects */
tbody tr {
  position: relative;
}

tbody tr::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

tbody tr:hover::after {
  transform: scaleX(1);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

button:disabled {
  transform: none;
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: fadeIn 0.4s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f9fafb;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Focus visible for accessibility */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>