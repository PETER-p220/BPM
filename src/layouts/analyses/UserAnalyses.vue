<template>
  <div class="p-5 md:p-8 space-y-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Analyses</h1>
        <p class="mt-1 text-gray-600">Manage and update your project analyses</p>
      </div>

      <router-link to="/create/analysis">
        <button
          class="inline-flex items-center px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:ring-offset-2"
        >
          <i class="fas fa-plus mr-2"></i>
          Create New Analysis
        </button>
      </router-link>
    </div>

    <!-- Search -->
    <div class="max-w-md">
      <div class="relative">
        <input
          v-model="filter"
          type="text"
          placeholder="Search by project name..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow bg-white shadow-sm"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-blue-900 text-4xl"></i>
      <p class="mt-4 text-gray-600 font-medium">Loading analyses...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Project Cards -->
      <div
        v-for="project in filteredProjects"
        :key="project.project_id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow transition-shadow duration-200"
      >
        <!-- Project Header -->
        <div class="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ project.project?.project_name || 'Unnamed Project' }}
              </h3>
              <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                <span>Manager: {{ project.user?.name || 'N/A' }}</span>
                <span class="hidden sm:inline">·</span>
                <span>Created: {{ formatDate(project.created_at) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3 flex-wrap">
              <span
                :class="statusBadgeClass(project.status)"
                class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
              >
                {{ project.status.charAt(0).toUpperCase() + project.status.slice(1) }}
              </span>

              <div
                v-if="project.status === 'rejected' && project.reason_for_reject"
                class="text-xs text-red-700 bg-red-50 px-3 py-1 rounded border border-red-200"
              >
                Reason: {{ project.reason_for_reject }}
              </div>
            </div>
          </div>
        </div>

        <!-- File Upload Section -->
        <div class="px-6 py-5 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row sm:items-end gap-4">
            <div class="flex-1 min-w-0">
              <label
                :for="'excel_' + project.project_id"
                class="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Update / Replace Analysis (Excel)
              </label>
              <input
                :id="'excel_' + project.project_id"
                type="file"
                accept=".xlsx,.xls"
                @change="handleFileChange($event, project.project_id)"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg bg-gray-50/80"
              />
            </div>

            <button
              @click="updateAnalysis(project.project_id)"
              :disabled="uploadingProjectId === project.project_id || !selectedFiles[project.project_id]"
              class="inline-flex items-center justify-center px-6 py-2.5 min-w-[160px] bg-blue-900 hover:bg-blue-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:ring-offset-2"
            >
              <span v-if="uploadingProjectId === project.project_id">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Uploading...
              </span>
              <template v-else>
                <i class="fas fa-upload mr-2"></i>
                Update Analysis
              </template>
            </button>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h4 class="text-sm font-semibold text-gray-800 mb-4">Financial Summary</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <p class="text-gray-600">Total (VAT Excl)</p>
              <p class="font-medium">{{ formatCurrency(project.total_amount_vat_excl) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Total (VAT Incl)</p>
              <p class="font-medium">{{ formatCurrency(project.total_amount_vat_incl) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Amount Needed</p>
              <p class="font-medium">{{ formatCurrency(project.total_amount_needed) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Site Contingency</p>
              <p class="font-medium">{{ formatCurrency(project.site_contingency) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Total Investment</p>
              <p class="font-medium">{{ formatCurrency(project.total_investment) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Projected Profit</p>
              <p class="font-medium text-green-700">
                {{ formatCurrency(project.projected_profit) }}
                <span class="text-xs ml-1">({{ project.projected_profit_percentage || 0 }}%)</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Analysis Items Table -->
        <div class="px-6 py-5">
          <h4 class="text-sm font-semibold text-gray-800 mb-3">Analysis Items</h4>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">S/N</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 min-w-[200px]">Description</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700">Q. Qty</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700">Unit</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700">Q. Rate</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700">Q. Amount</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700">Qty</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700">Rate</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Source</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Urgent</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="item in project.items"
                  :key="item.analysis_id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm text-gray-700">{{ item.serial_number || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{{ item.item_description || 'N/A' }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-700">{{ item.quoted_quantity || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-700">{{ item.quoted_unit || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-700">{{ formatCurrency(item.quoted_rate) }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-800">{{ formatCurrency(item.quoted_amount) }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-700">{{ item.quantity || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-700">{{ formatCurrency(item.rate) }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-800">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ item.source || 'N/A' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    <span
                      v-if="item.urgent_status"
                      :class="urgentBadgeClass(item.urgent_status)"
                      class="inline-block px-2 py-0.5 text-xs font-medium rounded"
                    >
                      {{ item.urgent_status }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!project.items?.length" class="text-center py-10 text-gray-500 text-sm">
            No analysis items available for this project
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!filteredProjects.length && !loading"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
      >
        <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-700 mt-2">No analyses found</h3>
        <p v-if="filter" class="mt-2 text-gray-500">
          Try clearing the search filter or create a new analysis
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="allProjects.length > itemsPerPage" class="flex justify-center items-center gap-4 pt-8">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <i class="fas fa-chevron-left text-gray-600"></i>
        </button>

        <span class="text-sm font-medium text-gray-700">
          Page {{ currentPage }} of {{ Math.ceil(allProjects.length / itemsPerPage) }}
        </span>

        <button
          :disabled="currentPage >= Math.ceil(allProjects.length / itemsPerPage)"
          @click="changePage(currentPage + 1)"
          class="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <i class="fas fa-chevron-right text-gray-600"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const analyses = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)
const toast = useToast()
const selectedFiles = ref({})
const uploadingProjectId = ref(null)

onMounted(async () => {
  await fetchAnalyses()
})

async function fetchAnalyses() {
  loading.value = true
  try {
    const response = await axios.get('/api/user-analysis')
    if (response.data.status === 200 && Array.isArray(response.data.data)) {
      analyses.value = groupByProject(response.data.data)
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to load analyses')
  } finally {
    loading.value = false
  }
}

function groupByProject(data) {
  const grouped = {}
  data.forEach(item => {
    const projectId = item.project_id
    if (!grouped[projectId]) {
      grouped[projectId] = {
        project_id: projectId,
        project: item.project,
        user: item.user,
        created_at: item.created_at,
        status: item.status,
        reason_for_reject: item.reason_for_reject,
        total_amount_vat_excl: null,
        total_amount_vat_incl: null,
        total_amount_needed: null,
        site_contingency: null,
        total_investment: null,
        projected_profit: null,
        projected_profit_percentage: null,
        items: []
      }
    }

    // Set financials only once (assuming they're consistent per project)
    if (item.total_amount_vat_excl && !grouped[projectId].total_amount_vat_excl) {
      grouped[projectId].total_amount_vat_excl = item.total_amount_vat_excl
      grouped[projectId].total_amount_vat_incl = item.total_amount_vat_incl
      grouped[projectId].total_amount_needed = item.total_amount_needed
      grouped[projectId].site_contingency = item.site_contingency
      grouped[projectId].total_investment = item.total_investment
      grouped[projectId].projected_profit = item.projected_profit
      grouped[projectId].projected_profit_percentage = item.projected_profit_percentage
    }

    // Only add items that seem to be actual analysis rows
    if (item.item_description || item.serial_number) {
      grouped[projectId].items.push(item)
    }
  })

  return Object.values(grouped)
}

const allProjects = computed(() =>
  analyses.value.filter(project =>
    project.project?.project_name?.toLowerCase().includes(filter.value.toLowerCase())
  )
)

const filteredProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allProjects.value.slice(start, end)
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatCurrency(value) {
  if (value === null || value === undefined) return 'N/A'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function statusBadgeClass(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    approved: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200'
  }
  return map[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

function urgentBadgeClass(status) {
  const map = {
    urgent: 'bg-red-100 text-red-700',
    normal: 'bg-green-100 text-green-700',
    low: 'bg-blue-100 text-blue-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function handleFileChange(event, projectId) {
  const file = event.target.files[0]
  if (file) {
    selectedFiles.value[projectId] = file
  }
}

async function updateAnalysis(projectId) {
  const file = selectedFiles.value[projectId]
  if (!file) {
    toast.warning('Please select an Excel file first')
    return
  }

  uploadingProjectId.value = projectId

  const formData = new FormData()
  formData.append('excel_file', file)
  formData.append('project_id', projectId)

  try {
    const response = await axios.post('/api/analysis/update-from-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.status === 200) {
      toast.success(`Updated successfully (${response.data.rows_imported || 0} rows imported)`)
      await fetchAnalyses()
      selectedFiles.value[projectId] = null
      document.getElementById(`excel_${projectId}`).value = ''
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update analysis'
    toast.error(message)
  } finally {
    uploadingProjectId.value = null
  }
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(allProjects.value.length / itemsPerPage)) return
  currentPage.value = page
}
</script>