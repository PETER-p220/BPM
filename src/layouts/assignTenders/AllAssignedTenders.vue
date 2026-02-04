<template>
  <div class="assigned-tenders py-8 md:py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Assigned Tenders</h1>
          <p class="mt-1 text-gray-600">View and manage tenders assigned to engineers</p>
        </div>

        <router-link to="/assign-tender">
          <button class="btn-primary flex items-center gap-2">
            <i class="fas fa-plus"></i>
            Assign Tender
          </button>
        </router-link>
      </div>

      <!-- Controls -->
      <div class="mb-6 bg-white shadow rounded-lg p-4 border border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="relative flex-1">
            <input
              v-model="filter"
              type="text"
              placeholder="Search by title, engineer, or tender number..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white shadow rounded-xl p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-gray-200"></div>
        <p class="mt-4 text-gray-600">Loading assigned tenders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedData.length === 0" class="bg-white shadow rounded-xl p-12 text-center">
        <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700">No assigned tenders found</h3>
        <p class="mt-2 text-gray-500">
          {{ filter ? 'Try adjusting your search.' : 'Get started by assigning a new tender.' }}
        </p>
        <router-link to="/assign-tender" class="mt-6 inline-block btn-primary">
          Assign Tender
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tender Type</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Procurement Entity</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tender Number</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Publication Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submission Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Engineer</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attachment</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(tender, index) in paginatedData"
                :key="tender.assign_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ tender.title || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {{ tender.tender_type || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ tender.procurement_entity || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ tender.tender_number || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(tender.date_of_Publication) || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(tender.bid_submission) || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(tender)"
                  >
                    {{ getStatusText(tender) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ tender.user_name || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="tender.attachment"
                    @click="downloadFile(tender.attachment)"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                  >
                    <i class="fas fa-download mr-1.5"></i>
                    Download
                  </button>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editAssignedTender(tender.assign_id)"
                    class="text-indigo-600 hover:text-indigo-900 transition"
                    title="Edit"
                  >
                    <i class="fas fa-edit text-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> of
            <span class="font-medium">{{ filteredData.length }}</span> tenders
          </div>

          <div class="flex gap-2">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              :disabled="currentPage * itemsPerPage >= filteredData.length"
              @click="changePage(currentPage + 1)"
              class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const assignedTenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

onMounted(() => {
  fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('api/assign/tender')
    assignedTenders.value = response.data.data.map(t => ({
      assign_id: t.assign_id,
      title: t.tender?.title || '—',
      tender_type: t.tender?.tender_type || '—',
      procurement_entity: t.tender?.procurement_entity || '—',
      tender_number: t.tender?.tender_number || '—',
      date_of_Publication: t.tender?.date_of_Publication || null,
      bid_submission: t.tender?.bid_submission || null,
      expired_at: t.tender?.expired_at || null,
      user_name: t.user?.name || '—',
      attachment: t.tender?.attachment || null,
      is_assigned: t.is_assigned
    }))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load assigned tenders')
  } finally {
    isLoading.value = false
  }
}

const filteredData = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return assignedTenders.value

  return assignedTenders.value.filter(t =>
    t.title.toLowerCase().includes(term) ||
    t.user_name.toLowerCase().includes(term) ||
    t.tender_number.toLowerCase().includes(term)
  )
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredData.value.length / itemsPerPage)) return
  currentPage.value = page
}

function getStatusText(tender) {
  if (tender.is_assigned === 'submitted') return 'Submitted'
  return 'Due: ' + formatDate(tender.expired_at)
}

function getStatusClass(tender) {
  if (tender.is_assigned === 'submitted') {
    return 'bg-green-100 text-green-800 border border-green-200'
  }

  if (!tender.expired_at) return 'bg-gray-100 text-gray-800'

  const now = new Date()
  const expiry = new Date(tender.expired_at)
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

  if (now > expiry) {
    return 'bg-red-100 text-red-800 border border-red-200'
  } else if (diffDays <= 3) {
    return 'bg-orange-100 text-orange-800 border border-orange-200'
  } else if (diffDays <= 7) {
    return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  } else {
    return 'bg-green-100 text-green-800 border border-green-200'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function downloadFile(url) {
  if (!url) {
    toast.error('No file available')
    return
  }

  window.open(url, '_blank')
}

function editAssignedTender(assignId) {
  router.push({ name: 'EditAssignedTender', params: { assign_id: assignId } })
}
</script>

<style scoped>
.btn-primary {
  background-color: #1e293b;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background-color: #0f172a;
}

.btn-export {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-export.excel {
  border-color: #16a34a;
  color: #166534;
}

.btn-export.excel:hover {
  background-color: #f0fdf4;
}

.btn-export.pdf {
  border-color: #dc2626;
  color: #991b1b;
}

.btn-export.pdf:hover {
  background-color: #fef2f2;
}
</style>