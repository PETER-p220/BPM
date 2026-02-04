<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto font-sans">
    <PageHeader subtitle="Tenders">
      <!-- If you want to add "Create New Tender" button back -->
      <!--
      <router-link to="/create-tender">
        <BaseButton variant="primary" size="md" class="inline-flex items-center">
          <i class="fas fa-plus mr-2"></i>
          Register New Tender
        </BaseButton>
      </router-link>
      -->
    </PageHeader>

    <!-- Search -->
    <div class="relative max-w-lg">
      <input
        v-model="filter"
        type="search"
        placeholder="Search by title, number, entity..."
        class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <i class="fas fa-search text-gray-400"></i>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/60">
            <tr>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-12">
                No
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Title
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Source
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Type
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Tender No.
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Entity
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                File
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Published
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Submission
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Expires
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Created
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr
              v-for="(tender, index) in paginatedTenders"
              :key="tender.tender_id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                {{ tender.title || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ tender.tender_source || 'N/A' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ tender.tender_type || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ tender.tender_number || '—' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                {{ tender.procurement_entity || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <button
                  v-if="tender.attachment"
                  @click="downloadTenderPdf(tender.attachment)"
                  class="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                  title="Download tender document"
                >
                  <i class="fas fa-file-pdf mr-1.5"></i>
                  Download
                </button>
                <span v-else class="text-gray-400 italic">No file</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(tender.date_of_Publication) || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(tender.bid_submission) || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  class="inline-flex px-3 py-1 text-xs font-medium rounded-full text-white"
                  :class="getExpirationClass(tender.expired_at)"
                >
                  {{ formatDate(tender.expired_at, true) || 'N/A' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(tender.created_at) || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <div class="flex items-center gap-4">
                  <button
                    @click="editTender(tender.tender_id)"
                    class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                    title="View / Edit tender"
                  >
                    <i class="fas fa-eye text-lg"></i>
                  </button>
                  <button
                    v-if="tender.attachment"
                    @click="downloadTenderPdf(tender.attachment)"
                    class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition"
                    title="Download attachment"
                  >
                    <i class="fas fa-download text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Loading / Empty state -->
            <tr v-if="loading || paginatedTenders.length === 0">
              <td colspan="12" class="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center gap-3">
                  <i v-if="loading" class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
                  <i v-else class="fas fa-file-contract text-4xl opacity-50"></i>
                  <p class="font-medium">
                    {{ loading ? 'Loading tenders...' : 'No tenders found' }}
                  </p>
                  <p class="text-sm" v-if="!loading">
                    {{ filter ? 'Try adjusting your search' : 'No tenders registered yet' }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredTenders.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }} of {{ filteredTenders.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <button
          :disabled="currentPage * itemsPerPage >= filteredTenders.length"
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
import { saveAs } from 'file-saver'

const router = useRouter()
const toast = useToast()

const tenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

// Fetch data
onMounted(async () => {
  await fetchTenders()
})

async function fetchTenders() {
  loading.value = true
  try {
    const response = await axios.get('/api/tenders')
    tenders.value = response.data?.data || []
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

// Filtering & Pagination
const filteredTenders = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return tenders.value

  return tenders.value.filter(tender =>
    Object.values(tender).some(val =>
      String(val ?? '').toLowerCase().includes(term)
    )
  )
})

const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTenders.value.slice(start, start + itemsPerPage)
})

// Date formatting
function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    })
  } catch {
    return dateStr
  }
}

// Expiration badge class
function getExpirationClass(expiredAt) {
  if (!expiredAt) return 'bg-gray-500'
  const now = new Date()
  const exp = new Date(expiredAt)
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'bg-red-600'
  if (diffDays <= 3) return 'bg-red-500'
  if (diffDays <= 7) return 'bg-yellow-500'
  return 'bg-green-500'
}

// Actions
function editTender(tenderId) {
  router.push({ name: 'EditTender', params: { tender_id: tenderId } })
}

async function downloadTenderPdf(url) {
  if (!url) return
  try {
    const response = await axios.get(url, { responseType: 'blob' })
    saveAs(response.data, `tender_${Date.now()}.pdf`)
    toast.success('File downloaded')
  } catch (error) {
    handleError(error)
  }
}

function changePage(page) {
  if (page < 1) return
  if (page > Math.ceil(filteredTenders.value.length / itemsPerPage)) return
  currentPage.value = page
}

function handleError(error) {
  let msg = 'An unexpected error occurred'
  if (error.response?.data?.message) msg = error.response.data.message
  else if (error.response) msg = error.response.statusText || `Error ${error.response.status}`
  else if (error.request) msg = 'No response from server. Check connection.'
  else msg = error.message

  toast.error(msg, { timeout: 7000 })
}
</script>