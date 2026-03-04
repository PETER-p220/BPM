<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span v-if="[1, 6, 7].includes(userRole)">Approve or reject employee leave requests</span>
            <span v-else>Manage your leave requests</span>
          </p>
        </div>
        <div class="flex gap-3">
          <button
            v-if="![1, 6, 7].includes(userRole)"
            @click="showModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            New Leave Request
          </button>
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
              <p class="text-sm font-medium text-gray-500">Total Leaves</p>
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
              <i class="fas fa-calendar-day text-purple-600"></i>
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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              v-model="filters.search"
              placeholder="Search by employee name..."
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="6" class="px-6 py-4 text-center">
                  <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredLeaves.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
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
                    v-if="leave.status === 'pending' && [1, 2, 6, 7].includes(userRole)"
                    @click="approveLeave(leave)"
                    class="text-green-600 hover:text-green-900 mr-3"
                    title="Approve"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  
                  <button
                    v-if="leave.status === 'pending' && [1, 2, 6, 7].includes(userRole)"
                    @click="rejectLeave(leave)"
                    class="text-red-600 hover:text-red-900 mr-3"
                    title="Reject"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  
                  <button
                    v-if="canEditLeave(leave)"
                    @click="editLeave(leave)"
                    class="text-yellow-600 hover:text-yellow-900 mr-3"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  
                  <button
                    v-if="canDeleteLeave(leave)"
                    @click="deleteLeave(leave.id)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Leave Request' : 'Create Leave Request' }}
          </h3>
          
          <form @submit.prevent="submitLeave">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Employee <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.employee_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.employee_id }"
                >
                  <option value="">Select Employee</option>
                  <option v-for="employee in filteredEmployees" :key="employee.user_id" :value="employee.user_id">
                    {{ employee.name }} - {{ employee.department }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.leave_type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.leave_type }"
                >
                  <option value="">Select Type</option>
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="form.start_date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.start_date }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="form.end_date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.end_date }"
                />
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Reason <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.reason"
                rows="4"
                required
                placeholder="Enter leave reason..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': !form.reason }"
              ></textarea>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ isEditing ? 'Update' : 'Create' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeViewModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Leave Request Details
          </h3>
          
          <div v-if="selectedLeave" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <p class="text-gray-900 font-medium">{{ selectedLeave.employee?.name }}</p>
                <p class="text-gray-500 text-sm">{{ selectedLeave.employee?.email }}</p>
                <p class="text-gray-500 text-sm">{{ selectedLeave.employee?.department?.name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="getLeaveTypeClass(selectedLeave.leave_type)">
                  {{ formatLeaveType(selectedLeave.leave_type) }}
                </span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <p class="text-gray-900">{{ formatDate(selectedLeave.start_date) }} - {{ formatDate(selectedLeave.end_date) }}</p>
                <p class="text-gray-500 text-sm">{{ selectedLeave.days }} days</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="getStatusClass(selectedLeave.status)">
                  {{ formatStatus(selectedLeave.status) }}
                </span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700 whitespace-pre-wrap">{{ selectedLeave.reason }}</p>
              </div>
            </div>
            
            <div v-if="selectedLeave.rejection_reason" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
              <div class="p-4 bg-red-50 rounded-lg">
                <p class="text-red-700 whitespace-pre-wrap">{{ selectedLeave.rejection_reason }}</p>
              </div>
            </div>
            
            <div v-if="selectedLeave.approver" class="mt-4 pt-4 border-t">
              <label class="block text-sm font-medium text-gray-700 mb-1">Processed By</label>
              <p class="text-gray-900">{{ selectedLeave.approver?.name }}</p>
              <p class="text-gray-500 text-sm">{{ selectedLeave.approver?.email }}</p>
              <p class="text-gray-500 text-sm">{{ formatDate(selectedLeave.approved_at) }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeViewModal"
              class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-times mr-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeRejectModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Reject Leave Request
          </h3>
          
          <form @submit.prevent="submitRejection">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="rejectionReason"
                rows="4"
                required
                placeholder="Enter reason for rejection..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              ></textarea>
            </div>
            
            <div class="flex justify-end gap-3">
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
                <span v-else>Reject</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { saveAs } from 'file-saver'
import * as XLSX from '@e965/xlsx'

const toast = useToast()

const leaves = ref([])
const employees = ref([])
const departments = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const showRejectModal = ref(false)
const isEditing = ref(false)
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

// Get current user and role
const currentUser = ref(null)
const userRole = ref(null)

// Initialize user data
onMounted(() => {
  const user = localStorage.getItem('user')
  const roleId = localStorage.getItem('role_id')
  
  if (user && roleId) {
    currentUser.value = JSON.parse(user)
    userRole.value = parseInt(roleId)
  }
})

// Filter employees based on user role
const filteredEmployees = computed(() => {
  if (!employees.value.length) return []
  
  // If user is HR, Admin, or CEO, show all employees
  if ([1, 2, 6, 7].includes(userRole.value)) {
    return employees.value
  }
  
  // For regular users (3, 4, 5), show only themselves
  if (currentUser.value) {
    return employees.value.filter(emp => emp.user_id === currentUser.value.user_id)
  }
  
  return []
})

const filters = ref({
  search: '',
  status: '',
  department_id: '',
  leave_type: ''
})

const form = ref({
  employee_id: '',
  leave_type: '',
  start_date: '',
  end_date: '',
  reason: ''
})

const filteredLeaves = computed(() => {
  let filtered = leaves.value

  // Role-based filtering: Regular users can only see their own leaves
  // HR/Admin/CEO can see all leaves for approval
  if (currentUser.value && ![1, 2, 6, 7].includes(userRole.value)) {
    filtered = filtered.filter(leave => leave.employee_id === currentUser.value.user_id)
  }

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
    
    // Fetch leaves, employees, and departments in parallel, statistics is optional
    const [leavesResponse, employeesResponse, departmentsResponse] = await Promise.all([
      axios.get('/api/leaves'),
      axios.get('/api/all/users'),
      axios.get('/api/departments')
    ])

    leaves.value = leavesResponse.data.data || []
    employees.value = employeesResponse.data.users || employeesResponse.data || []
    departments.value = departmentsResponse.data.departments || []

    // Fetch statistics separately
    try {
      console.log('Fetching statistics...')
      const statsResponse = await axios.get('/api/leaves/statistics')
      console.log('Statistics response:', statsResponse.data)
      
      if (statsResponse.data.status && statsResponse.data.data) {
        statistics.value = statsResponse.data.data
        console.log('Statistics loaded:', statistics.value)
      } else {
        console.warn('Invalid statistics response format:', statsResponse.data)
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
      console.error('Statistics endpoint error:', statsError.response?.data || statsError)
      toast.error('Failed to load statistics')
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

    // Debug: Log loaded data
    console.log('Employees loaded:', employees.value)
    console.log('Departments loaded:', departments.value)

    toast.success('Data loaded successfully')
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error('Failed to load data')
  } finally {
    isLoading.value = false
  }
}

async function submitLeave() {
  try {
    isSubmitting.value = true
    
    const submissionData = {
      ...form.value,
      start_date: form.value.start_date,
      end_date: form.value.end_date
    }

    if (isEditing.value) {
      await axios.put(`/api/leaves/${form.value.id}`, submissionData)
      toast.success('Leave request updated successfully')
    } else {
      await axios.post('/api/leaves', submissionData)
      toast.success('Leave request created successfully')
    }
    
    closeModal()
    await fetchData()
  } catch (error) {
    console.error('Submit error:', error)
    if (error.response?.data?.errors) {
      Object.values(error.response.data.errors).forEach(errors => {
        errors.forEach(error => toast.error(error))
      })
    } else {
      toast.error('Failed to save leave request')
    }
  } finally {
    isSubmitting.value = false
  }
}

async function approveLeave(leave) {
  if (!confirm(`Are you sure you want to approve this leave request for ${leave.employee?.name}?`)) {
    return
  }

  try {
    await axios.post(`/api/leaves/${leave.id}/approve`)
    toast.success('Leave request approved successfully')
    await fetchData()
  } catch (error) {
    console.error('Approve error:', error)
    toast.error('Failed to approve leave request')
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

async function deleteLeave(id) {
  if (!confirm('Are you sure you want to delete this leave request?')) {
    return
  }

  try {
    await axios.delete(`/api/leaves/${id}`)
    toast.success('Leave request deleted successfully')
    await fetchData()
  } catch (error) {
    console.error('Delete error:', error)
    toast.error('Failed to delete leave request')
  }
}

function viewLeave(leave) {
  selectedLeave.value = leave
  showViewModal.value = true
}

function editLeave(leave) {
  isEditing.value = true
  form.value = { ...leave }
  showModal.value = true
}

function rejectLeave(leave) {
  selectedLeave.value = leave
  showRejectModal.value = true
}

function closeModal() {
  showModal.value = false
  isEditing.value = false
  form.value = {
    employee_id: '',
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  }
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

// Watch for modal opening to auto-select current user for regular users
watch(showModal, (newValue) => {
  if (newValue && !isEditing.value) {
    // When opening new leave request modal
    if (currentUser.value && ![1, 2, 6, 7].includes(userRole.value)) {
      // Auto-select current user for regular users
      form.value.employee_id = currentUser.value.user_id
    }
  }
})

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
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    approved: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    rejected: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    cancelled: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.pending
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
  return new Date(dateString).toLocaleDateString()
}

// Permission helper functions
function canEditLeave(leave) {
  // HR/Admin/CEO can edit any leave
  if ([1, 2, 6, 7].includes(userRole.value)) {
    return true
  }
  
  // Regular users can only edit their own pending leaves
  if (currentUser.value && leave.employee_id === currentUser.value.user_id) {
    return leave.status === 'pending' || leave.status === 'Pending'
  }
  
  return false
}

function canDeleteLeave(leave) {
  // HR/Admin/CEO can delete any leave
  if ([1, 2, 6, 7].includes(userRole.value)) {
    return true
  }
  
  // Regular users can only delete their own pending leaves
  if (currentUser.value && leave.employee_id === currentUser.value.user_id) {
    return leave.status === 'pending' || leave.status === 'Pending'
  }
  
  return false
}

async function exportToExcel() {
  try {
    const data = filteredLeaves.value.map((leave, index) => ({
      'No': index + 1,
      'Employee Name': leave.employee?.name || 'N/A',
      'Email': leave.employee?.email || 'N/A',
      'Department': leave.employee?.department?.name || 'N/A',
      'Leave Type': formatLeaveType(leave.leave_type),
      'Start Date': formatDate(leave.start_date),
      'End Date': formatDate(leave.end_date),
      'Days': leave.days,
      'Status': formatStatus(leave.status),
      'Requested Date': formatDate(leave.created_at),
      'Reason': leave.reason
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Requests')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `leave_requests_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    toast.success('Leave requests exported successfully')
  } catch (error) {
    console.error('Export error:', error)
    toast.error('Failed to export leave requests')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
