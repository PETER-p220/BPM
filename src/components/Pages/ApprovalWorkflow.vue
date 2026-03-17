<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Approval Workflow</h1>
      
      <div class="grid grid-cols-4 gap-6">
        <!-- Filters Sidebar -->
        <div class="col-span-1">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="font-semibold mb-4">Filters</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Status</label>
                <select v-model="filters.status" class="w-full border rounded-lg px-3 py-2">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Type</label>
                <select v-model="filters.type" class="w-full border rounded-lg px-3 py-2">
                  <option value="">All Types</option>
                  <option value="tender">Tender</option>
                  <option value="project">Project</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Priority</label>
                <select v-model="filters.priority" class="w-full border rounded-lg px-3 py-2">
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <button @click="clearFilters" class="w-full text-indigo-600 hover:text-indigo-700 text-sm">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-span-3 space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg shadow">
              <div class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</div>
              <div class="text-sm text-gray-500">Pending Approval</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <div class="text-2xl font-bold text-green-600">{{ stats.approved }}</div>
              <div class="text-sm text-gray-500">Approved Today</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <div class="text-2xl font-bold text-red-600">{{ stats.rejected }}</div>
              <div class="text-sm text-gray-500">Rejected</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <div class="text-2xl font-bold text-blue-600">{{ stats.urgent }}</div>
              <div class="text-sm text-gray-500">Urgent</div>
            </div>
          </div>

          <!-- Approval Items -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold">Pending Approvals</h2>
                <div class="flex gap-2">
                  <button @click="refreshData" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    🔄 Refresh
                  </button>
                  <button @click="bulkApprove" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    ✅ Bulk Approve
                  </button>
                </div>
              </div>
            </div>
            
            <div class="divide-y">
              <div v-for="item in filteredApprovals" :key="item.id" class="p-6 hover:bg-gray-50">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-semibold">{{ item.title }}</h3>
                      <span :class="getPriorityClass(item.priority)" class="px-2 py-1 text-xs rounded">
                        {{ item.priority }}
                      </span>
                      <span class="px-2 py-1 text-xs bg-gray-100 rounded">
                        {{ item.type }}
                      </span>
                    </div>
                    
                    <p class="text-gray-600 mb-3">{{ item.description }}</p>
                    
                    <div class="flex items-center gap-6 text-sm text-gray-500">
                      <span>👤 {{ item.submitter }}</span>
                      <span>📅 {{ formatDate(item.submittedDate) }}</span>
                      <span>💰 {{ item.amount }}</span>
                    </div>
                    
                    <!-- Workflow Progress -->
                    <div class="mt-4">
                      <div class="flex items-center gap-2">
                        <div v-for="(step, index) in item.workflow" :key="index" class="flex items-center">
                          <div :class="getWorkflowStepClass(step.status)" class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold">
                            {{ step.initial }}
                          </div>
                          <div v-if="index < item.workflow.length - 1" class="w-8 h-1 bg-gray-300"></div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <div v-for="(step, index) in item.workflow" :key="index" class="flex items-center">
                          <div class="text-xs text-gray-500">{{ step.role }}</div>
                          <div v-if="index < item.workflow.length - 1" class="w-8"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-2 ml-4">
                    <button @click="viewDetails(item)" class="px-3 py-1 border rounded-lg hover:bg-gray-50">
                      View
                    </button>
                    <button @click="approveItem(item)" class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Approve
                    </button>
                    <button @click="rejectItem(item)" class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Approval Details</h2>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div v-if="selectedItem" class="space-y-4">
          <div>
            <h3 class="font-semibold mb-2">{{ selectedItem.title }}</h3>
            <p class="text-gray-600">{{ selectedItem.description }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Type</label>
              <p>{{ selectedItem.type }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium">Priority</label>
              <p>{{ selectedItem.priority }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium">Amount</label>
              <p>{{ selectedItem.amount }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium">Submitted</label>
              <p>{{ formatDate(selectedItem.submittedDate) }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Comments</label>
            <textarea v-model="comment" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
          </div>
          
          <div class="flex gap-2">
            <button @click="approveWithComment" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Approve
            </button>
            <button @click="rejectWithComment" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  status: '',
  type: '',
  priority: ''
})

const showModal = ref(false)
const selectedItem = ref(null)
const comment = ref('')

const stats = ref({
  pending: 12,
  approved: 8,
  rejected: 3,
  urgent: 2
})

const approvals = ref([
  {
    id: 1,
    title: 'Office Renovation Project',
    description: 'Renovation of main office building including new furniture and IT infrastructure',
    type: 'project',
    priority: 'high',
    amount: '$50,000',
    submitter: 'John Doe',
    submittedDate: '2024-03-12',
    workflow: [
      { role: 'Submitter', initial: 'JD', status: 'completed' },
      { role: 'HOD', initial: 'MS', status: 'current' },
      { role: 'Finance', initial: 'RJ', status: 'pending' },
      { role: 'CEO', initial: 'AK', status: 'pending' }
    ]
  },
  {
    id: 2,
    title: 'Marketing Campaign Budget',
    description: 'Q2 marketing campaign for product launch across digital platforms',
    type: 'expense',
    priority: 'medium',
    amount: '$15,000',
    submitter: 'Jane Smith',
    submittedDate: '2024-03-11',
    workflow: [
      { role: 'Submitter', initial: 'JS', status: 'completed' },
      { role: 'HOD', initial: 'MS', status: 'completed' },
      { role: 'Finance', initial: 'RJ', status: 'current' },
      { role: 'CEO', initial: 'AK', status: 'pending' }
    ]
  },
  {
    id: 3,
    title: 'IT Infrastructure Tender',
    description: 'Procurement of new servers and networking equipment',
    type: 'tender',
    priority: 'urgent',
    amount: '$120,000',
    submitter: 'Mike Johnson',
    submittedDate: '2024-03-10',
    workflow: [
      { role: 'Submitter', initial: 'MJ', status: 'completed' },
      { role: 'HOD', initial: 'MS', status: 'current' },
      { role: 'Finance', initial: 'RJ', status: 'pending' },
      { role: 'CEO', initial: 'AK', status: 'pending' }
    ]
  }
])

const filteredApprovals = computed(() => {
  return approvals.value.filter(item => {
    if (filters.value.status && item.status !== filters.value.status) return false
    if (filters.value.type && item.type !== filters.value.type) return false
    if (filters.value.priority && item.priority !== filters.value.priority) return false
    return true
  })
})

function getPriorityClass(priority) {
  const classes = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

function getWorkflowStepClass(status) {
  const classes = {
    completed: 'bg-green-500 text-white',
    current: 'bg-blue-500 text-white',
    pending: 'bg-gray-300 text-gray-600'
  }
  return classes[status] || 'bg-gray-300 text-gray-600'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function clearFilters() {
  filters.value = { status: '', type: '', priority: '' }
}

function refreshData() {
  // API call would go here
  console.log('Refreshing data...')
}

function viewDetails(item) {
  selectedItem.value = item
  showModal.value = true
}

function approveItem(item) {
  alert(`Approved: ${item.title}`)
  // Update workflow status
}

function rejectItem(item) {
  alert(`Rejected: ${item.title}`)
  // Update workflow status
}

function bulkApprove() {
  alert('Bulk approve functionality')
}

function approveWithComment() {
  alert(`Approved with comment: ${comment.value}`)
  showModal.value = false
}

function rejectWithComment() {
  alert(`Rejected with comment: ${comment.value}`)
  showModal.value = false
}
</script>
