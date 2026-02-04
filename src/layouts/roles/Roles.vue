<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto" style="font-family: 'cygre', serif;">
    <PageHeader subtitle="System Roles">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
        <router-link to="/add-role">
          <BaseButton
            variant="primary"
            size="md"
            class="w-full sm:w-auto"
          >
            <i class="fas fa-plus mr-2"></i>
            Create New Role
          </BaseButton>
        </router-link>
      </div>
    </PageHeader>

    <!-- Search -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by category or description..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                No
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Category
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Description
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr
              v-for="(role, index) in paginatedRoles"
              :key="role.role_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ role.category }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ role.description || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <div class="flex items-center gap-4">
                  <button
                    @click="editRole(role.role_id)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    title="Edit role"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDelete(role.role_id, role.category)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Delete role"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="paginatedRoles.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center gap-2">
                  <i class="fas fa-folder-open text-4xl opacity-40"></i>
                  <p>No roles found</p>
                  <p class="text-sm">Try adjusting your search or create a new role.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredRoles.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredRoles.length) }} of {{ filteredRoles.length }} roles
      </div>

      <div class="flex items-center justify-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <button
          :disabled="currentPage * itemsPerPage >= filteredRoles.length"
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
import Swal from 'sweetalert2' // ← Add this import

const router = useRouter()
const toast = useToast()

const roles = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

// Fetch roles
onMounted(async () => {
  await fetchRoles()
})

async function fetchRoles() {
  loading.value = true
  try {
    const response = await axios.get('/api/auth/roles')
    roles.value = response.data || []
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// Filtered & paginated
const filteredRoles = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return roles.value

  return roles.value.filter(role =>
    role.category?.toLowerCase().includes(term) ||
    role.description?.toLowerCase().includes(term)
  )
})

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRoles.value.slice(start, start + itemsPerPage)
})

// Actions
function editRole(roleId) {
  router.push({ name: 'EditRole', params: { role_id: roleId } })
}

async function confirmDelete(roleId, category) {
  const result = await Swal.fire({
    title: 'Delete Role?',
    html: `You are about to delete the role <strong>"${category}"</strong>.<br>
           This action cannot be undone and may affect user permissions.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, Delete Role',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      confirmButton: 'swal2-confirm-btn',
      cancelButton: 'swal2-cancel-btn'
    }
  })

  if (result.isConfirmed) {
    await deleteRole(roleId)
  }
}

async function deleteRole(roleId) {
  try {
    await axios.delete(`/api/auth/roles/${roleId}`)
    roles.value = roles.value.filter(r => r.role_id !== roleId)
    toast.success('Role deleted successfully')
  } catch (error) {
    handleError(error)
  }
}

function changePage(page) {
  if (page >= 1 && page <= Math.ceil(filteredRoles.value.length / itemsPerPage)) {
    currentPage.value = page
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred'

  if (error.response?.data?.message) {
    message = error.response.data.message
  } else if (error.response) {
    message = error.response.statusText || `Error ${error.response.status}`
  } else if (error.request) {
    message = 'No response from server. Please check your network.'
  } else {
    message = error.message
  }

  toast.error(message, { timeout: 6000 })
}
</script>

<style scoped>
/* Optional: enhance button appearance in Swal if needed */
.swal2-confirm-btn {
  @apply font-medium;
}
.swal2-cancel-btn {
  @apply font-medium;
}
</style>