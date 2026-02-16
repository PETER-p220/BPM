<template>
  <div class="p-4 space-y-4" style="font-family: 'Trirong', sans-serif; font-size: 17px">
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isAdmin ? 'All Department Updates' : 'Department Updates' }}
        </h1>
        <p class="text-gray-600">
          {{ isAdmin ? 'View all department updates from all departments' : 'Share and view daily work updates' }}
        </p>
      </div>
      
      <!-- Add Update Button - Only for non-admin users -->
      <div v-if="canAddUpdate" class="flex flex-col sm:flex-row sm:space-x-2">
        <BaseButton @click="showAddUpdateModal = true" style="background-color: #2e4053;" class="w-full sm:w-auto">
          Add New Update
          <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
        </BaseButton>
      </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-4">
      <input
        type="text"
        v-model="filter"
        placeholder="Search updates..."
        class="flex-1 p-2 border rounded"
      />
      <select
        v-model="dateFilter"
        class="p-2 border rounded"
      >
        <option value="">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>

    <!-- Updates Table -->
    <div class="overflow-x-auto">
      <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
        <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Title</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Attachments</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-4 text-center">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="ml-2">Loading updates...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredUpdates.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              No updates found
            </td>
          </tr>
          <tr v-else v-for="(update, index) in filteredUpdates" :key="update.update_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-sm font-medium">
              {{ update.titles && update.titles.length > 0 ? update.titles[0] : 'No Title' }}
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="max-w-xs truncate" :title="update.description">
                {{ update.description || 'No Description' }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm">
              {{ formatDate(update.created_at) }}
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex space-x-2">
                <span v-if="update.photo" class="text-blue-600">
                  <i class="fas fa-image"></i>
                </span>
                <span v-if="update.file" class="text-green-600">
                  <i class="fas fa-file"></i>
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex space-x-2">
                <button @click="editUpdate(update)" class="text-blue-600 hover:text-blue-800" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="viewUpdate(update)" class="text-green-600 hover:text-green-800" title="View">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="deleteUpdate(update.update_id)" class="text-red-600 hover:text-red-800" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Update Modal -->
    <div v-if="showAddUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ getFormTitle() }}
        </h3>
        
        <form @submit.prevent="submitUpdate">
          <!-- Common Fields -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              v-model="newUpdate.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newUpdate.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <!-- Department-Specific Fields -->
          <div v-if="userRole === 2" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              v-model="newUpdate.department"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div v-if="userRole === 3" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              v-model="newUpdate.project_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          <div v-if="userRole === 5" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Financial Category</label>
            <select
              v-model="newUpdate.financial_category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Revenue">Revenue</option>
              <option value="Expenses">Expenses</option>
              <option value="Budget">Budget</option>
              <option value="Audit">Audit</option>
            </select>
          </div>

          <div v-if="userRole === 6" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">HR Category</label>
            <select
              v-model="newUpdate.hr_category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Training">Training</option>
              <option value="Performance">Performance</option>
              <option value="Policy">Policy</option>
            </select>
          </div>

          <!-- File Uploads -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Photo (Optional)</label>
            <input
              type="file"
              @change="handlePhotoUpload"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div v-if="photoPreview" class="mt-2">
              <img :src="photoPreview" alt="Preview" class="h-20 w-20 object-cover rounded" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Document (Optional)</label>
            <input
              type="file"
              @change="handleFileUpload"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeAddModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Update Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Update Details</h3>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="selectedUpdate">
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-700">Title</h4>
              <p>{{ selectedUpdate.titles && selectedUpdate.titles.length > 0 ? selectedUpdate.titles[0] : 'No Title' }}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700">Description</h4>
              <p class="whitespace-pre-wrap">{{ selectedUpdate.description }}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700">Date</h4>
              <p>{{ formatDate(selectedUpdate.created_at) }}</p>
            </div>
            <div v-if="selectedUpdate.photo">
              <h4 class="font-semibold text-gray-700">Photo</h4>
              <img :src="selectedUpdate.photo" alt="Update Photo" class="max-w-full h-auto rounded" />
            </div>
            <div v-if="selectedUpdate.file">
              <h4 class="font-semibold text-gray-700">File</h4>
              <a :href="selectedUpdate.file" target="_blank" class="text-blue-600 hover:text-blue-800">
                <i class="fas fa-download"></i> Download File
              </a>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button @click="closeViewModal" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
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
import { useToast } from 'vue-toastification'
import axios from 'axios'
import BaseButton from '@components/Form/BaseButton.vue'

const toast = useToast()

// Get current user role
const currentUser = ref(null)
const userRole = ref(null)

// Reactive data
const updates = ref([])
const isLoading = ref(false)
const filter = ref('')
const dateFilter = ref('')
const showAddUpdateModal = ref(false)
const showViewModal = ref(false)
const selectedUpdate = ref(null)

// Form data
const newUpdate = ref({
  title: '',
  description: '',
  photo: null,
  file: null,
  department: '',
  project_name: '',
  financial_category: '',
  hr_category: ''
})

const isSubmitting = ref(false)

const photoPreview = ref('')

// Methods
const getFormTitle = () => {
  switch (userRole.value) {
    case 2: return 'HOD Update - Department Management'
    case 3: return 'Engineer Update - Project Progress'
    case 5: return 'Accountant Update - Financial Report'
    case 6: return 'HR Update - Human Resources'
    default: return 'Department Update'
  }
}

// Computed properties
const isAdmin = computed(() => userRole.value === 1)
const canAddUpdate = computed(() => userRole.value && !isAdmin.value)

const filteredUpdates = computed(() => {
  let filtered = updates.value

  // Apply text filter
  if (filter.value) {
    const searchTerm = filter.value.toLowerCase()
    filtered = filtered.filter(update => {
      const title = update.titles && update.titles.length > 0 ? update.titles[0].toLowerCase() : ''
      const description = update.description ? update.description.toLowerCase() : ''
      return title.includes(searchTerm) || description.includes(searchTerm)
    })
  }

  // Apply date filter
  if (dateFilter.value) {
    const now = new Date()
    filtered = filtered.filter(update => {
      const updateDate = new Date(update.created_at)
      
      switch (dateFilter.value) {
        case 'today':
          return updateDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return updateDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return updateDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered
})

// Methods
const fetchUpdates = async () => {
  isLoading.value = true
  try {
    let endpoint = '/my/updates'
    
    // Use different endpoints based on user role
    if (isAdmin.value) {
      endpoint = '/api/admin/all-updates'  // Admin sees all updates
    } else if (userRole.value) {
      endpoint = '/api/department-updates'  // Each department sees all updates
    } else {
      endpoint = '/my/updates'  // Fallback to personal updates
    }
    
    const response = await axios.get(endpoint)
    updates.value = response.data.data || response.data
  } catch (error) {
    console.error('Error fetching updates:', error)
    toast.error('Failed to load updates')
  } finally {
    isLoading.value = false
  }
}

const submitUpdate = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('titles[]', newUpdate.value.title)
    formData.append('description', newUpdate.value.description)
    
    if (newUpdate.value.photo) {
      formData.append('photo', newUpdate.value.photo)
    }
    
    if (newUpdate.value.file) {
      formData.append('file', newUpdate.value.file)
    }

    const response = await axios.post('/project/activities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.status === 'success') {
      toast.success('Update added successfully')
      closeAddModal()
      await fetchUpdates()
    } else {
      toast.error('Failed to add update')
    }
  } catch (error) {
    console.error('Error submitting update:', error)
    toast.error('Failed to add update')
  } finally {
    isSubmitting.value = false
  }
}

const editUpdate = (update) => {
  // TODO: Implement edit functionality
  toast.info('Edit functionality coming soon')
}

const viewUpdate = (update) => {
  selectedUpdate.value = update
  showViewModal.value = true
}

const deleteUpdate = async (updateId) => {
  if (!confirm('Are you sure you want to delete this update?')) return
  
  try {
    await axios.delete(`/project/activities/${updateId}`)
    toast.success('Update deleted successfully')
    await fetchUpdates()
  } catch (error) {
    console.error('Error deleting update:', error)
    toast.error('Failed to delete update')
  }
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newUpdate.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newUpdate.value.file = file
  }
}

const closeAddModal = () => {
  showAddUpdateModal.value = false
  resetForm()
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedUpdate.value = null
}

const resetForm = () => {
  newUpdate.value = {
    title: '',
    description: '',
    photo: null,
    file: null
  }
  photoPreview.value = ''
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  // Get current user info
  const token = localStorage.getItem('token')
  const roleId = localStorage.getItem('role_id')
  
  if (token && roleId) {
    currentUser.value = JSON.parse(localStorage.getItem('user') || '{}')
    userRole.value = parseInt(roleId)
  }
  
  fetchUpdates()
})
</script>

<style scoped>
.rounded-table {
  border-radius: 8px;
  overflow: hidden;
}

.table-data {
  padding: 12px 16px;
  font-size: 14px;
  vertical-align: middle;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.max-w-xs {
  max-width: 20rem;
}
</style>
