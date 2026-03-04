<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">HR Leave Management</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Review and approve employee leave requests</p>
        </div>
        <div class="flex gap-3">
          <button          
            @click="exportToExcel"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >   
            <i class="fas fa-download mr-2"></i>
            Export
          </button>
        </div>
      </div>              
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <i class="fas fa-calendar-alt text-blue-600"></i>      
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Requests</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full">
              <i class="fas fa-clock text-yellow-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Pending</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics.pending }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <i class="fas fa-check-circle text-green-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Approved</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics.approved }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-full">
              <i class="fas fa-times-circle text-red-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Rejected</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics.rejected }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full">
              <i class="fas fa-calendar-week text-purple-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">This Month</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics.this_month }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              v-model="filters.search"
              placeholder="Search by employee name or email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              v-model="filters.department_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.department_id" :value="dept.department_id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              v-model="filters.leave_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
              <option value="emergency">Emergency</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="7" class="px-6 py-4 text-center">
                  <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredLeaves.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  No leave requests found
                </td>
              </tr>
              <tr v-for="leave in filteredLeaves" :key="leave.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ leave.employee?.name }}</div>
                    <div class="text-sm text-gray-500">{{ leave.employee?.email }}</div>
                    <div class="text-xs text-gray-400">{{ leave.employee?.department?.name }}</div>
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="getLeaveTypeClass(leave.leave_type)">
                    {{ formatLeaveType(leave.leave_type) }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(leave.start_date) }} - {{ formatDate(leave.end_date) }}
                  </div>
                  <div class="text-xs text-gray-500">{{ leave.days }} days</div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate" :title="leave.reason">
                    {{ leave.reason }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="getStatusClass(leave.status)">
                    {{ formatStatus(leave.status) }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(leave.created_at) }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    @click="viewLeave(leave)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button
                    v-if="leave.status === 'pending' || leave.status === 'Pending'"
                    @click="approveLeave(leave)"
                    class="text-green-600 hover:text-green-900 mr-3"
                    title="Approve"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  
                  <button
                    v-if="leave.status === 'pending' || leave.status === 'Pending'"
                    @click="rejectLeave(leave)"
                    class="text-red-600 hover:text-red-900"
                    title="Reject"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Leave Request Details</h3>
          
          <div v-if="selectedLeave" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Employee</label>
                <p class="text-sm text-gray-900">{{ selectedLeave.employee?.name }}</p>
                <p class="text-xs text-gray-500">{{ selectedLeave.employee?.email }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Department</label>
                <p class="text-sm text-gray-900">{{ selectedLeave.employee?.department?.name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Leave Type</label>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="getLeaveTypeClass(selectedLeave.leave_type)">
                  {{ formatLeaveType(selectedLeave.leave_type) }}
                </span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="getStatusClass(selectedLeave.status)">
                  {{ formatStatus(selectedLeave.status) }}
                </span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedLeave.start_date) }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedLeave.end_date) }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Reason</label>
              <p class="text-sm text-gray-900">{{ selectedLeave.reason }}</p>
            </div>
            
            <div v-if="selectedLeave.rejection_reason">
              <label class="block text-sm font-medium text-gray-700">Rejection Reason</label>
              <p class="text-sm text-gray-900">{{ selectedLeave.rejection_reason }}</p>
            </div>
            
            <div v-if="selectedLeave.approver_id">
              <label class="block text-sm font-medium text-gray-700">Processed By</label>
              <p class="text-sm text-gray-900">{{ selectedLeave.approver?.name }} on {{ formatDate(selectedLeave.approved_at) }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button
              @click="closeViewModal"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Reject Leave Request</h3>
          
          <div v-if="selectedLeave" class="mb-4">
            <p class="text-sm text-gray-600">
              Rejecting leave request for <strong>{{ selectedLeave.employee?.name }}</strong>
            </p>
          </div>
          
          <form @submit.prevent="submitRejection">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="rejectionReason"
                required
                rows="4"
                placeholder="Please provide a reason for rejection..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeRejectModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <span v-if="isSubmitting">Rejecting...</span>
                <span v-else>Reject Leave</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Approve Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center mb-4">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <i class="fas fa-check h-6 w-6 text-green-600"></i>
            </div>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mb-4">Approve Leave Request</h3>
          
          <div v-if="selectedLeave" class="mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Employee:</span>
                  <p class="text-gray-900">{{ selectedLeave.employee?.name }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Department:</span>
                  <p class="text-gray-900">{{ selectedLeave.employee?.department?.name }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Leave Type:</span>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="getLeaveTypeClass(selectedLeave.leave_type)">
                    {{ formatLeaveType(selectedLeave.leave_type) }}
                  </span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Duration:</span>
                  <p class="text-gray-900">{{ formatDate(selectedLeave.start_date) }} - {{ formatDate(selectedLeave.end_date) }}</p>
                  <p class="text-xs text-gray-500">{{ selectedLeave.days }} days</p>
                </div>
              </div>
              <div class="mt-3">
                <span class="font-medium text-gray-700">Reason:</span>
                <p class="text-gray-900 text-sm">{{ selectedLeave.reason }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              @click="closeApproveModal"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="submitApproval"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-check mr-2"></i>
              <span v-if="isSubmitting">Approving...</span>
              <span v-else>Approve Leave</span>
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
import { saveAs } from 'file-saver'
import * as XLSX from '@e965/xlsx'

const toast = useToast()

const leaves = ref([])
const departments = ref([])
const isLoading = ref(false)
const showViewModal = ref(false)
const showRejectModal = ref(false)
const showApproveModal = ref(false)
const isSubmitting = ref(false)
const selectedLeave = ref(null)
const rejectionReason = ref('')

const statistics = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  cancelled: 0,
  this_month: 0
})

const filters = ref({
  search: '',
  status: '',
  department_id: '',
  leave_type: ''
})

const filteredLeaves = computed(() => {
  let filtered = leaves.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(leave => 
      leave.employee?.name?.toLowerCase().includes(search) ||
      leave.employee?.email?.toLowerCase().includes(search) ||
      leave.employee?.department?.name?.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(leave => leave.status === filters.value.status)
  }

  if (filters.value.department_id) {
    filtered = filtered.filter(leave => leave.employee?.department_id == filters.value.department_id)
  }

  if (filters.value.leave_type) {
    filtered = filtered.filter(leave => leave.leave_type === filters.value.leave_type)
  }

  return filtered
})

async function fetchData() {
  try {
    isLoading.value = true
    
    const [leavesResponse, departmentsResponse] = await Promise.all([
      axios.get('/api/leaves'),
      axios.get('/api/departments')
    ])

    leaves.value = leavesResponse.data.data || []
    departments.value = departmentsResponse.data.departments || []

    // Debug: Log leaves data
    console.log('Fetched leaves:', leaves.value.map(leave => ({
      id: leave.id,
      employee: leave.employee?.name,
      status: leave.status,
      status_type: typeof leave.status
    })))

    // Fetch statistics separately
    try {
      console.log('Fetching HR statistics...')
      const statsResponse = await axios.get('/api/leaves/statistics')
      console.log('HR Statistics response:', statsResponse.data)
      
      if (statsResponse.data.status && statsResponse.data.data) {
        statistics.value = statsResponse.data.data
        console.log('HR Statistics loaded:', statistics.value)
      } else {
        console.warn('Invalid HR statistics response format:', statsResponse.data)
        // Calculate from leaves data as fallback
        statistics.value = {
          total: leaves.value.length,
          pending: leaves.value.filter(l => l.status === 'pending' || l.status === 'Pending').length,
          approved: leaves.value.filter(l => l.status === 'approved' || l.status === 'Approved').length,
          rejected: leaves.value.filter(l => l.status === 'rejected' || l.status === 'Rejected').length,
          cancelled: leaves.value.filter(l => l.status === 'cancelled' || l.status === 'Cancelled').length,
          this_month: leaves.value.filter(l => {
            const date = new Date(l.created_at)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          }).length
        }
      }
    } catch (statsError) {
      console.error('HR Statistics endpoint error:', statsError.response?.data || statsError)
      // Calculate from leaves data as fallback
      statistics.value = {
        total: leaves.value.length,
        pending: leaves.value.filter(l => l.status === 'pending' || l.status === 'Pending').length,
        approved: leaves.value.filter(l => l.status === 'approved' || l.status === 'Approved').length,
        rejected: leaves.value.filter(l => l.status === 'rejected' || l.status === 'Rejected').length,
        cancelled: leaves.value.filter(l => l.status === 'cancelled' || l.status === 'Cancelled').length,
        this_month: leaves.value.filter(l => {
          const date = new Date(l.created_at)
          const now = new Date()
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length
      }
    }

    toast.success('Data loaded successfully')
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error('Failed to load data')
  } finally {
    isLoading.value = false
  }
}

async function approveLeave(leave) {
  console.log('Approve button clicked for leave:', {
    id: leave.id,
    status: leave.status,
    status_type: typeof leave.status,
    employee: leave.employee?.name
  });
  
  // Show custom confirmation modal instead of browser confirm
  selectedLeave.value = leave
  showApproveModal.value = true
}

function rejectLeave(leave) {
  selectedLeave.value = leave
  showRejectModal.value = true
}

async function submitApproval() {
  try {
    isSubmitting.value = true
    const response = await axios.post(`/api/leaves/${selectedLeave.value.id}/approve`)
    console.log('Approve response:', response.data)
    toast.success('Leave request approved successfully')
    closeApproveModal()
    await fetchData()
  } catch (error) {
    console.error('Approve error:', error.response?.data || error)
    toast.error(error.response?.data?.message || 'Failed to approve leave request')
  } finally {
    isSubmitting.value = false
  }
}

async function submitRejection() {
  try {
    isSubmitting.value = true
    await axios.post(`/api/leaves/${selectedLeave.value.id}/reject`, {
      rejection_reason: rejectionReason.value
    })
    toast.success('Leave request rejected successfully')
    closeRejectModal()
    await fetchData()
  } catch (error) {
    console.error('Reject error:', error)
    toast.error('Failed to reject leave request')
  } finally {
    isSubmitting.value = false
  }
}

function viewLeave(leave) {
  selectedLeave.value = leave
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedLeave.value = null
}

function closeRejectModal() {
  showRejectModal.value = false
  selectedLeave.value = null
  rejectionReason.value = ''
}

function closeApproveModal() {
  showApproveModal.value = false
  selectedLeave.value = null
}

function clearFilters() {
  filters.value = {
    search: '',
    status: '',
    department_id: '',
    leave_type: ''
  }
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getLeaveTypeClass(type) {
  const classes = {
    sick: 'bg-blue-100 text-blue-800',
    vacation: 'bg-green-100 text-green-800',
    maternity: 'bg-purple-100 text-purple-800',
    paternity: 'bg-indigo-100 text-indigo-800',
    emergency: 'bg-red-100 text-red-800',
    unpaid: 'bg-gray-100 text-gray-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

function formatStatus(status) {
  return status ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : status
}

function formatLeaveType(type) {
  return type ? type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : type
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function exportToExcel() {
  try {
    const exportData = filteredLeaves.value.map(leave => ({
      'Employee Name': leave.employee?.name || 'N/A',
      'Email': leave.employee?.email || 'N/A',
      'Department': leave.employee?.department?.name || 'N/A',
      'Leave Type': formatLeaveType(leave.leave_type),
      'Start Date': formatDate(leave.start_date),
      'End Date': formatDate(leave.end_date),
      'Days': leave.days || 0,
      'Reason': leave.reason || '',
      'Status': formatStatus(leave.status),
      'Requested Date': formatDate(leave.created_at),
      'Rejection Reason': leave.rejection_reason || '',
      'Approved By': leave.approver?.name || '',
      'Approved Date': formatDate(leave.approved_at)
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Leave Requests')
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    saveAs(data, `leave_requests_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Export completed successfully')
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Failed to export data')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
