<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assigned Tenders</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View your assigned tenders and their status
        </p>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <input
        type="text"
        v-model="filter"
        placeholder="Search by title, tender number, entity..."
        class="w-full sm:w-96 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 dark:border-gray-700"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading assigned tenders...</p>
    </div>

    <!-- Table -->
    <div v-else-if="assignedTenders.length > 0" class="bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender Type</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Procurement Entity</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender Number</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Publication Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submission Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attachment</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            <tr
              v-for="(tender, index) in paginatedData"
              :key="tender.assign_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ tender.title || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.tender_type || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.procurement_entity || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ tender.tender_number || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(tender.date_of_Publication) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(tender.bid_submission) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClasses(tender)"
                  class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusText(tender) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                <button
                  v-if="tender.attachment"
                  @click="downloadFile(tender.attachment)"
                  class="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <span v-else class="text-gray-400 text-xs">No file</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        No assigned tenders found
      </p>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Check back later or contact procurement team
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredData.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ paginatedData.length }} of {{ filteredData.length }} tenders
      </p>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Previous
        </button>

        <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {{ currentPage }}
        </span>

        <button
          :disabled="currentPage * itemsPerPage >= filteredData.length"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const assignedTenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('api/your/tender')
    assignedTenders.value = response.data.data.map(tender => ({
      assign_id: tender.assign_id,
      title: tender.tender.title,
      tender_type: tender.tender.tender_type,
      procurement_entity: tender.tender.procurement_entity,
      tender_number: tender.tender.tender_number,
      date_of_Publication: tender.tender.date_of_Publication,
      bid_submission: tender.tender.bid_submission,
      expired_at: tender.tender.expired_at,
      user_name: tender.user.name,
      attachment: tender.tender.attachment,
      is_assigned: tender.is_assigned
    }))
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load assigned tenders')
  } finally {
    isLoading.value = false
  }
}

function downloadFile(fileUrl) {
  if (!fileUrl) {
    toast.error("File URL is missing!")
    return
  }

  axios({
    url: fileUrl,
    method: "GET",
    responseType: "blob",
  })
    .then((response) => {
      const blob = new Blob([response.data])
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.setAttribute("download", fileUrl.split("/").pop())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started")
    })
    .catch((error) => {
      toast.error("Failed to download file. Please try again.")
      console.error("Download error:", error)
    })
}

function formatDate(dateString, includeTime = false) {
  if (!dateString) return "N/A"
  const options = includeTime
    ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'numeric', day: 'numeric' }
  return new Date(dateString).toLocaleString('en-US', options)
}

function getStatusText(tender) {
  if (tender.is_assigned === 'submitted') {
    return "Submitted"
  }
  const currentDate = new Date()
  const expirationDate = new Date(tender.expired_at)
  return currentDate > expirationDate
    ? `Expired ${formatDate(tender.expired_at, true)}`
    : `Due ${formatDate(tender.expired_at, true)}`
}

function getStatusClasses(tender) {
  if (tender.is_assigned === 'submitted') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
  }

  const currentDate = new Date()
  const expirationDate = new Date(tender.expired_at)
  const diffDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24))

  if (currentDate > expirationDate) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  } else if (diffDays <= 3) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
  } else if (diffDays <= 6) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
  } else {
    return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
  }
}

const filteredData = computed(() => {
  const searchText = filter.value.toLowerCase()
  return assignedTenders.value.filter(entry =>
    entry.title.toLowerCase().includes(searchText) ||
    entry.user_name.toLowerCase().includes(searchText)
  )
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

function changePage(newPage) {
  if (newPage > 0 && newPage <= Math.ceil(filteredData.value.length / itemsPerPage)) {
    currentPage.value = newPage
  }
}
</script>