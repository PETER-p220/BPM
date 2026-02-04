<template>
  <div class="award-letters py-8 md:py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Award Letters</h1>
          <p class="mt-1 text-gray-600">Manage and track awarded tender letters</p>
        </div>

        <router-link to="/create/awarding-letter">
          <button class="btn-primary flex items-center gap-2">
            <i class="fas fa-plus"></i>
            Create Award Letter
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
              placeholder="Search by tender title..."
              class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <button
              v-if="filter"
              @click="filter = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-white shadow rounded-xl p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-gray-200"></div>
        <p class="mt-4 text-gray-600">Loading award letters...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedData.length === 0" class="bg-white shadow rounded-xl p-12 text-center">
        <i class="fas fa-file-contract text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700">
          {{ filter ? 'No matching award letters found' : 'No award letters yet' }}
        </h3>
        <p class="mt-2 text-gray-500">
          {{ filter ? 'Try adjusting your search.' : 'Create your first award letter to get started.' }}
        </p>
        <router-link to="/create/awarding-letter" class="mt-6 inline-block btn-primary">
          Create Award Letter
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tender</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Award Letter File</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(letter, index) in paginatedData"
                :key="letter.award_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ letter.tender?.title || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="letter.awardletter_file"
                    @click="downloadAwardLetterFile(letter.awardletter_file)"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition"
                  >
                    <i class="fas fa-download mr-1.5"></i>
                    Download PDF
                  </button>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(letter.created_at) || '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> of
            <span class="font-medium">{{ filteredData.length }}</span> letters
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
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const toast = useToast()

const awardLetters = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)
const isExporting = ref(false)

onMounted(() => {
  fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('api/award-letter')
    awardLetters.value = response.data.data || []
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load award letters')
  } finally {
    isLoading.value = false
  }
}

async function downloadAwardLetterFile(fileUrl) {
  if (!fileUrl) {
    toast.error('No file available')
    return
  }

  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' })
    saveAs(response.data, 'award_letter.pdf')
  } catch (error) {
    toast.error('Failed to download award letter')
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

const filteredData = computed(() => {
  const term = filter.value.toLowerCase().trim()
  if (!term) return awardLetters.value

  return awardLetters.value.filter(letter =>
    letter.tender?.title?.toLowerCase().includes(term)
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

async function exportToExcel() {
  isExporting.value = true
  try {
    const data = filteredData.value.map((letter, index) => ({
      No: index + 1,
      Tender: letter.tender?.title || '—',
      'Award Letter File': letter.awardletter_file ? 'Attached' : '—',
      'Created At': formatDate(letter.created_at) || '—'
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Award Letters')
    XLSX.writeFile(wb, `Award_Letters_${new Date().toISOString().slice(0,10)}.xlsx`)
  } catch (err) {
    toast.error('Failed to export to Excel')
  } finally {
    isExporting.value = false
  }
}

function exportToPDF() {
  isExporting.value = true
  try {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Award Letters Report', 14, 20)

    const tableData = filteredData.value.map((letter, index) => [
      index + 1,
      letter.tender?.title || '—',
      letter.awardletter_file ? 'PDF Attached' : '—',
      formatDate(letter.created_at) || '—'
    ])

    autoTable(doc, {
      head: [['No', 'Tender Title', 'Award Letter File', 'Created At']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [40, 58, 83] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    })

    doc.save(`Award_Letters_${new Date().toISOString().slice(0,10)}.pdf`)
  } catch (err) {
    toast.error('Failed to export to PDF')
  } finally {
    isExporting.value = false
  }
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