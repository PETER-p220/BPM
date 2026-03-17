<template>
  <div class="compliance-management-container">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Compliance Management</h1>
            <p class="text-gray-600 mt-2">Review and manage compliance submissions</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="exportData"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <i class="fas fa-download mr-2"></i>
              Export
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="financial">Financial Irregularity</option>
              <option value="procurement">Procurement Violation</option>
              <option value="ethical">Ethical Conduct</option>
              <option value="safety">Safety Concern</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              v-model="filters.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              v-model="filters.date_from"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search submissions..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-indigo-100 rounded-full">
              <i class="fas fa-file-alt text-indigo-600"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total Submissions</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.total_submissions }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full">
              <i class="fas fa-clock text-yellow-600"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Review</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.pending_review }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <i class="fas fa-check-circle text-green-600"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Resolved</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.resolved }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-full">
              <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Critical Cases</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.critical_cases }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Submissions Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="submission in submissions" :key="submission.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ submission.reference_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ submission.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getCategoryClass(submission.category)">
                    {{ getCategoryLabel(submission.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(submission.priority)">
                    {{ getPriorityLabel(submission.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(submission.status)">
                    {{ getStatusLabel(submission.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(submission.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    @click="viewSubmission(submission)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="submission.status === 'pending' || submission.status === 'under_review'"
                    @click="reviewSubmission(submission)"
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full z-50">
      <div class="flex min-h-screen items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Compliance Submission Details</h3>
            <button
              @click="showViewModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Reference</h4>
                <p class="text-gray-700">{{ selectedSubmission.reference_number }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Submitted</h4>
                <p class="text-gray-700">{{ formatDate(selectedSubmission.created_at) }}</p>
              </div>
            </div>
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Title</h4>
              <p class="text-gray-700">{{ selectedSubmission.title }}</p>
            </div>
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Category</h4>
              <p class="text-gray-700">{{ getCategoryLabel(selectedSubmission.category) }}</p>
            </div>
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Priority</h4>
              <p class="text-gray-700">{{ getPriorityLabel(selectedSubmission.priority) }}</p>
            </div>
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p class="text-gray-700 whitespace-pre-wrap">{{ selectedSubmission.description }}</p>
            </div>
            <div v-if="selectedSubmission.attachments && selectedSubmission.attachments.length > 0" class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
              <div class="space-y-2">
                <div v-for="attachment in selectedSubmission.attachments" :key="attachment.id" class="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div class="flex items-center">
                    <i class="fas fa-file text-indigo-500 mr-2"></i>
                    <span class="text-sm">{{ attachment.file_name }}</span>
                  </div>
                  <button
                    @click="downloadAttachment(attachment)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full z-50">
      <div class="flex min-h-screen items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Review Compliance Submission</h3>
            <button
              @click="showReviewModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="submitReview" class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Review Status</label>
              <select
                v-model="reviewForm.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select status</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
              <textarea
                v-model="reviewForm.notes"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add review comments..."
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="submittingReview"
                class="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <i v-if="!submittingReview" class="fas fa-check mr-2"></i>
                <i v-if="submittingReview" class="fas fa-spinner fa-spin mr-2"></i>
                {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const showViewModal = ref(false)
const showReviewModal = ref(false)
const submittingReview = ref(false)
const selectedSubmission = ref(null)

const filters = reactive({
  status: '',
  category: '',
  priority: '',
  search: '',
  date_from: ''
})

const submissions = ref([])
const statistics = reactive({
  total_submissions: 0,
  pending_review: 0,
  resolved: 0,
  critical_cases: 0
})

const reviewForm = reactive({
  status: '',
  notes: ''
})

const fetchSubmissions = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.category) params.append('category', filters.category)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.search) params.append('search', filters.search)
    if (filters.date_from) params.append('date_from', filters.date_from)
    
    const response = await axios.get(`/api/compliance/submissions?${params}`)
    
    submissions.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching submissions:', error)
  }
}

const fetchStatistics = async () => {
  try {
    const response = await axios.get('/api/compliance/statistics')
    Object.assign(statistics, response.data)
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

const viewSubmission = (submission) => {
  selectedSubmission.value = submission
  showViewModal.value = true
}

const reviewSubmission = (submission) => {
  selectedSubmission.value = submission
  reviewForm.status = ''
  reviewForm.notes = ''
  showReviewModal.value = true
}

const submitReview = async () => {
  submittingReview.value = true
  
  try {
    await axios.post(`/api/compliance/submissions/${selectedSubmission.value.id}/review`, reviewForm)
    
    // Refresh data
    await fetchSubmissions()
    await fetchStatistics()
    
    showReviewModal.value = false
    selectedSubmission.value = null
    
  } catch (error) {
    console.error('Error submitting review:', error)
    alert('Error submitting review. Please try again.')
  } finally {
    submittingReview.value = false
  }
}

const downloadAttachment = async (attachment) => {
  try {
    const response = await axios.get(`/api/compliance/submissions/${attachment.submission_id}/attachments/${attachment.id}/download`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error downloading attachment:', error)
    alert('Error downloading attachment.')
  }
}

const exportData = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.category) params.append('category', filters.category)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.search) params.append('search', filters.search)
    if (filters.date_from) params.append('date_from', filters.date_from)
    
    const response = await axios.get(`/api/compliance/submissions/export?${params}`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `compliance_submissions_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error exporting data:', error)
    alert('Error exporting data.')
  }
}

const getCategoryLabel = (category) => {
  const labels = {
    financial: 'Financial',
    procurement: 'Procurement',
    ethical: 'Ethical',
    safety: 'Safety',
    other: 'Other'
  }
  return labels[category] || category
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  }
  return labels[priority] || priority
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    under_review: 'Under Review',
    reviewed: 'Reviewed',
    resolved: 'Resolved',
    dismissed: 'Dismissed'
  }
  return labels[status] || status
}

const getCategoryClass = (category) => {
  const classes = {
    financial: 'bg-blue-100 text-blue-800',
    procurement: 'bg-purple-100 text-purple-800',
    ethical: 'bg-green-100 text-green-800',
    safety: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-gray-100 text-gray-800',
    under_review: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Watch filters and fetch data
onMounted(() => {
  fetchSubmissions()
  fetchStatistics()
})
</script>

<style scoped>
.compliance-management-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 2rem 0;
}
</style>
