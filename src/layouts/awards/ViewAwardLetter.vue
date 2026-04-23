<template>
  <div class="award-letters min-h-screen font-['DM_Sans',sans-serif]" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <!-- Header -->
      <div class="mb-8 rounded-2xl px-6 py-5 shadow-sm border border-[#dce7f3]" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%)">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] flex items-center justify-center text-white shadow-md">
              <i class="fas fa-file-contract text-lg"></i>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-[#183b63]">Award Letters</h1>
              <p class="text-[13px] text-[#7a93af]">Manage and track awarded tender letters</p>
            </div>
          </div>

          <router-link to="/create/awarding-letter">
            <button class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-[0_12px_24px_rgba(35,96,182,0.22)] hover:shadow-lg transition-all flex items-center gap-2">
              <i class="fas fa-plus"></i>
              Create Award Letter
            </button>
          </router-link>
        </div>
      </div>

      <!-- Controls -->
      <div class="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-[#dce7f3]">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="relative flex-1">
            <input
              v-model="filter"
              type="text"
              placeholder="Search by tender title..."
              class="w-full pl-10 pr-10 py-2.5 border border-[#d9e6f3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition text-[#183b63] placeholder:text-[#a4b8cf]"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#a4b8cf]"></i>
            <button
              v-if="filter"
              @click="filter = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#a4b8cf] hover:text-[#183b63]"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#dce7f3]">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-[#2f78dd] border-[#edf4fb]"></div>
        <p class="mt-4 text-[#7a93af]">Loading award letters...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedData.length === 0" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#dce7f3]">
        <div class="w-14 h-14 bg-[#edf4fb] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-file-contract text-[#7d94ac] text-2xl"></i>
        </div>
        <h3 class="text-[15px] font-semibold text-[#183b63]">
          {{ filter ? 'No matching award letters found' : 'No award letters yet' }}
        </h3>
        <p class="mt-2 text-[13px] text-[#7a93af]">
          {{ filter ? 'Try adjusting your search.' : 'Create your first award letter to get started.' }}
        </p>
        <router-link to="/create/awarding-letter" class="mt-6 inline-block bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all">
          Create Award Letter
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#dce7f3]">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#edf2fa]">
            <thead class="bg-[#f7faff]">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">No</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Tender</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Award Letter File</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Created At</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-[#edf2fa]">
              <tr
                v-for="(letter, index) in paginatedData"
                :key="letter.award_id"
                class="hover:bg-[#f7faff] transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#67819d] font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#183b63]">
                  {{ letter.tender?.title || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="letter.awardletter_file"
                    @click="downloadAwardLetterFile(letter.awardletter_file)"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-[#2f78dd] bg-[#edf4fb] rounded-xl hover:bg-[#dce7f3] transition"
                  >
                    <i class="fas fa-download mr-1.5"></i>
                    Download PDF
                  </button>
                  <span v-else class="text-[#a4b8cf]">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4a6a8a]">
                  {{ formatDate(letter.created_at) || '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e4edf7] bg-[#f7faff]">
          <div class="text-[13px] text-[#7a93af]">
            Showing <span class="font-semibold text-[#183b63]">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
            <span class="font-semibold text-[#183b63]">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> of
            <span class="font-semibold text-[#183b63]">{{ filteredData.length }}</span> letters
          </div>

          <div class="flex gap-2">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="px-4 py-2 text-sm font-semibold rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              :disabled="currentPage * itemsPerPage >= filteredData.length"
              @click="changePage(currentPage + 1)"
              class="px-4 py-2 text-sm font-semibold rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 transition"
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
      headStyles: { fillColor: [25, 79, 146] },
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
/* Budget design system - scoped styles removed, all inline */
</style>