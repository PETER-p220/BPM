<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">HR Management</h1>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <button @click="showAddEmployee = true" class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">👤</div>
          <div class="font-semibold">Add Employee</div>
          <div class="text-sm text-gray-500">Onboard new staff</div>
        </button>
        
        <button @click="showLeaveRequest = true" class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">📅</div>
          <div class="font-semibold">Leave Requests</div>
          <div class="text-sm text-gray-500">Manage time off</div>
        </button>
        
        <button @click="showPayroll = true" class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">💰</div>
          <div class="font-semibold">Payroll</div>
          <div class="text-sm text-gray-500">Process salaries</div>
        </button>
        
        <button @click="showPerformance = true" class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">📊</div>
          <div class="font-semibold">Performance</div>
          <div class="text-sm text-gray-500">Reviews & goals</div>
        </button>
      </div>

      <!-- HR Stats -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalEmployees }}</div>
          <div class="text-sm text-gray-500">Total Employees</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-green-600">{{ stats.activeToday }}</div>
          <div class="text-sm text-gray-500">Active Today</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-yellow-600">{{ stats.pendingLeave }}</div>
          <div class="text-sm text-gray-500">Pending Leave</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-purple-600">{{ stats.newHires }}</div>
          <div class="text-sm text-gray-500">New Hires</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-red-600">{{ stats.openPositions }}</div>
          <div class="text-sm text-gray-500">Open Positions</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- Employee Directory -->
        <div class="col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold">Employee Directory</h2>
                <div class="flex gap-2">
                  <input v-model="searchQuery" placeholder="Search employees..." class="px-3 py-2 border rounded-lg" />
                  <select v-model="departmentFilter" class="px-3 py-2 border rounded-lg">
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4">
                <div v-for="employee in filteredEmployees" :key="employee.id" class="border rounded-lg p-4 hover:bg-gray-50">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span class="font-semibold text-indigo-600">{{ employee.initials }}</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold">{{ employee.name }}</h3>
                      <p class="text-sm text-gray-500">{{ employee.position }}</p>
                      <p class="text-xs text-gray-400">{{ employee.department }}</p>
                    </div>
                    <div class="text-right">
                      <div :class="getStatusClass(employee.status)" class="px-2 py-1 text-xs rounded">
                        {{ employee.status }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">{{ employee.employeeId }}</div>
                    </div>
                  </div>
                  
                  <div class="mt-3 flex justify-between text-xs text-gray-500">
                    <span>📧 {{ employee.email }}</span>
                    <span>📱 {{ employee.phone }}</span>
                    <span>🏢 {{ employee.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Upcoming Birthdays -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="font-semibold mb-4">Upcoming Birthdays</h3>
            <div class="space-y-3">
              <div v-for="birthday in upcomingBirthdays" :key="birthday.id" class="flex items-center gap-3">
                <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  🎂
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ birthday.name }}</div>
                  <div class="text-xs text-gray-500">{{ birthday.date }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="font-semibold mb-4">Recent Activities</h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="text-sm">
                <div class="font-medium">{{ activity.title }}</div>
                <div class="text-xs text-gray-500">{{ activity.time }} by {{ activity.by }}</div>
              </div>
            </div>
          </div>

          <!-- Announcements -->
          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="font-semibold mb-4">📢 HR Announcements</h3>
            <div class="space-y-2 text-sm">
              <div>• Performance reviews start next week</div>
              <div>• New health insurance plan effective April 1</div>
              <div>• Team building event on March 25</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Employee Modal -->
    <div v-if="showAddEmployee" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Add New Employee</h2>
          <button @click="showAddEmployee = false" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <form @submit.prevent="addEmployee" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">First Name</label>
              <input v-model="newEmployee.firstName" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Last Name</label>
              <input v-model="newEmployee.lastName" required class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input v-model="newEmployee.email" type="email" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Phone</label>
              <input v-model="newEmployee.phone" required class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Position</label>
              <input v-model="newEmployee.position" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Department</label>
              <select v-model="newEmployee.department" required class="w-full border rounded-lg px-3 py-2">
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Start Date</label>
              <input v-model="newEmployee.startDate" type="date" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Salary</label>
              <input v-model="newEmployee.salary" type="number" required class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          
          <div class="flex gap-2">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Add Employee
            </button>
            <button type="button" @click="showAddEmployee = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showAddEmployee = ref(false)
const showLeaveRequest = ref(false)
const showPayroll = ref(false)
const showPerformance = ref(false)

const searchQuery = ref('')
const departmentFilter = ref('')

const stats = ref({
  totalEmployees: 124,
  activeToday: 118,
  pendingLeave: 8,
  newHires: 5,
  openPositions: 3
})

const employees = ref([
  {
    id: 1,
    name: 'John Doe',
    initials: 'JD',
    position: 'Senior Developer',
    department: 'IT',
    email: 'john.doe@company.com',
    phone: '+1234567890',
    location: 'Office A',
    status: 'Active',
    employeeId: 'EMP001'
  },
  {
    id: 2,
    name: 'Jane Smith',
    initials: 'JS',
    position: 'HR Manager',
    department: 'HR',
    email: 'jane.smith@company.com',
    phone: '+1234567891',
    location: 'Office B',
    status: 'Active',
    employeeId: 'EMP002'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    initials: 'MJ',
    position: 'Financial Analyst',
    department: 'Finance',
    email: 'mike.johnson@company.com',
    phone: '+1234567892',
    location: 'Office A',
    status: 'On Leave',
    employeeId: 'EMP003'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    initials: 'SW',
    position: 'Operations Manager',
    department: 'Operations',
    email: 'sarah.wilson@company.com',
    phone: '+1234567893',
    location: 'Office C',
    status: 'Active',
    employeeId: 'EMP004'
  }
])

const upcomingBirthdays = ref([
  { id: 1, name: 'John Doe', date: 'March 20' },
  { id: 2, name: 'Jane Smith', date: 'March 22' },
  { id: 3, name: 'Mike Johnson', date: 'March 25' }
])

const recentActivities = ref([
  { id: 1, title: 'New employee onboarded', time: '2 hours ago', by: 'HR Team' },
  { id: 2, title: 'Leave request approved', time: '4 hours ago', by: 'Jane Smith' },
  { id: 3, title: 'Performance review completed', time: '1 day ago', by: 'John Doe' }
])

const newEmployee = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  startDate: '',
  salary: ''
})

const filteredEmployees = computed(() => {
  return employees.value.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDepartment = !departmentFilter.value || employee.department === departmentFilter.value
    return matchesSearch && matchesDepartment
  })
})

function getStatusClass(status) {
  const classes = {
    Active: 'bg-green-100 text-green-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function addEmployee() {
  alert(`Adding employee: ${newEmployee.value.firstName} ${newEmployee.value.lastName}`)
  showAddEmployee.value = false
  // Reset form
  newEmployee.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    startDate: '',
    salary: ''
  }
}
</script>
