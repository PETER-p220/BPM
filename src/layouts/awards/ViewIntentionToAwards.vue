<template>
  <div class="intentions-page min-h-screen font-['DM_Sans',sans-serif] relative overflow-hidden" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <!-- Ambient background -->
    <div class="ambient-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <!-- Header -->
      <div class="mb-8 rounded-2xl px-6 py-5 shadow-sm border border-[#dce7f3]" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%)">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] flex items-center justify-center text-white shadow-md">
              <i class="fas fa-file-signature text-lg"></i>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-[#183b63]">Intentions to Award</h1>
              <p class="text-[13px] text-[#7a93af]">Manage and track intention to award documents</p>
            </div>
          </div>

          <router-link to="/create/intention-to-award">
            <button class="bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-[0_12px_24px_rgba(35,96,182,0.22)] hover:shadow-lg transition-all flex items-center gap-2">
              <i class="fas fa-plus"></i>
              Create New
            </button>
          </router-link>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-[#dce7f3]">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="relative flex-1">
            <input
              v-model="filter"
              type="text"
              placeholder="Search by tender title or date..."
              class="w-full pl-10 pr-10 py-2.5 border border-[#d9e6f3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition text-[#183b63] placeholder:text-[#a4b8cf]"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
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

          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#1f9d8b]/30 text-[#1f9d8b] bg-[#edfaf7] hover:bg-[#d4f3ec] transition-all flex items-center gap-2"
              :disabled="isExporting || isLoading || !filteredData.length"
            >
              <i class="fas fa-file-excel"></i>
              Excel
            </button>

            <button
              @click="exportToPDF"
              class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-[#e87461]/30 text-[#e87461] bg-[#fef2f0] hover:bg-[#fde3df] transition-all flex items-center gap-2"
              :disabled="isExporting || isLoading || !filteredData.length"
            >
              <i class="fas fa-file-pdf"></i>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Chips -->
      <div class="mb-6 grid grid-cols-3 gap-4">
        <div class="bg-white px-5 py-4 rounded-xl shadow-sm border border-[#dce7f3] text-center">
          <p class="text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Total Records</p>
          <p class="text-2xl font-bold text-[#183b63]">{{ intentions.length }}</p>
        </div>
        <div class="bg-white px-5 py-4 rounded-xl shadow-sm border border-[#dce7f3] text-center">
          <p class="text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Filtered</p>
          <p class="text-2xl font-bold text-[#2f78dd]">{{ filteredData.length }}</p>
        </div>
        <div class="bg-white px-5 py-4 rounded-xl shadow-sm border border-[#dce7f3] text-center">
          <p class="text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Page</p>
          <p class="text-2xl font-bold text-[#1f9d8b]">{{ currentPage }} / {{ totalPages || 1 }}</p>
        </div>
      </div>

      <!-- Table / Content -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#dce7f3]">
        <!-- Loading -->
        <div v-if="isLoading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-[#2f78dd] border-[#edf4fb]"></div>
          <p class="mt-4 text-[#7a93af]">Loading intentions...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="paginatedData.length === 0" class="p-12 text-center">
          <div class="w-14 h-14 bg-[#edf4fb] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-folder-open text-[#7d94ac] text-2xl"></i>
          </div>
          <h3 class="text-[15px] font-semibold text-[#183b63]">
            {{ filter ? 'No matching intentions found' : 'No intentions yet' }}
          </h3>
          <p class="mt-2 text-[13px] text-[#7a93af]">
            {{ filter ? 'Try a different search term.' : 'Create your first intention to award.' }}
          </p>
          <router-link
            v-if="!filter"
            to="/create/intention-to-award"
            class="mt-6 inline-block bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            Create Intention
          </router-link>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#edf2fa]">
            <thead class="bg-[#f7faff] sticky top-0 z-10">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">#</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Tender</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Document</th>
                <th class="px-6 py-4 text-left text-[10px] font-semibold text-[#7d94ac] uppercase tracking-[0.18em]">Created At</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-[#edf2fa]">
              <tr
                v-for="(intention, index) in paginatedData"
                :key="intention.intention_id"
                class="hover:bg-[#f7faff] transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#67819d] font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#183b63]">
                  {{ intention.tender?.title || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="intention.intention_file"
                    @click="downloadIntentionFile(intention.intention_file)"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-[#2f78dd] bg-[#edf4fb] rounded-xl hover:bg-[#dce7f3] transition"
                  >
                    <i class="fas fa-download mr-1.5"></i>
                    Download PDF
                  </button>
                  <span v-else class="text-[#a4b8cf]">No file</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4a6a8a]">
                  {{ formatDate(intention.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredData.length > 0" class="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e4edf7] bg-[#f7faff]">
          <div class="text-[13px] text-[#7a93af]">
            Showing <span class="font-semibold text-[#183b63]">{{ rangeStart }}</span>–<span class="font-semibold text-[#183b63]">{{ rangeEnd }}</span> of
            <span class="font-semibold text-[#183b63]">{{ filteredData.length }}</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1.5 text-sm rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 transition"
              :disabled="currentPage === 1"
              @click="changePage(1)"
            >
              First
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 transition"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              Prev
            </button>

            <button
              v-for="p in visiblePages"
              :key="p"
              class="px-3 py-1.5 text-sm rounded-xl border min-w-[36px]"
              :class="{
                'bg-[linear-gradient(135deg,#194f92_0%,#2f78dd_100%)] text-white border-[#2f78dd] shadow-md': p === currentPage,
                'bg-white text-[#4a6a8a] border-[#d9e6f3] hover:bg-[#f7faff]': p !== currentPage && p !== '...',
                'border-transparent cursor-default text-[#a4b8cf]': p === '...'
              }"
              :disabled="p === '...'"
              @click="p !== '...' && changePage(p)"
            >
              {{ p }}
            </button>

            <button
              class="px-3 py-1.5 text-sm rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 transition"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              Next
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-xl border border-[#d9e6f3] bg-white text-[#4a6a8a] hover:bg-[#f7faff] disabled:opacity-40 transition"
              :disabled="currentPage === totalPages"
              @click="changePage(totalPages)"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const intentions = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(true)
const searchFocused = ref(false)

// ── Fetch Data ───────────────────────────────────────────────
onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('api/intention-to-award')
    intentions.value = response.data.data || []
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// ── Download ─────────────────────────────────────────────────
async function downloadIntentionFile(fileUrl) {
  if (!fileUrl) {
    toast.error('No file available')
    return
  }

  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' })
    saveAs(response.data, 'intention_to_award.pdf')
  } catch (error) {
    toast.error('Failed to download file')
  }
}

// ── Computed ─────────────────────────────────────────────────
const filteredData = computed(() => {
  const q = filter.value.toLowerCase().trim()
  if (!q) return intentions.value

  return intentions.value.filter(item =>
    (item.tender?.title || '').toLowerCase().includes(q) ||
    (item.created_at || '').toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage) || 1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

const rangeStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredData.value.length))

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = [1]
  const start = Math.max(2, cur - 2)
  const end = Math.min(total - 1, cur + 2)

  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
})

// ── Watchers ─────────────────────────────────────────────────
watch(filter, () => {
  currentPage.value = 1
})

// ── Pagination ───────────────────────────────────────────────
function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Date Helpers ─────────────────────────────────────────────
function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function formatTime(str) {
  if (!str) return ''
  return new Date(str).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ── Exports ──────────────────────────────────────────────────
function exportToExcel() {
  const rows = filteredData.value.map((item, i) => ({
    No: i + 1,
    Tender: item.tender?.title || 'N/A',
    'Intention File': item.intention_file ? 'Attached' : 'N/A',
    'Created At': formatDate(item.created_at) + ' ' + formatTime(item.created_at)
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Intentions')
  XLSX.writeFile(wb, `Intentions_to_Award_${new Date().toISOString().slice(0,10)}.xlsx`)
}

function exportToPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const timeStr = today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  // Colors
  const DARK = [25, 79, 146]      // #194f92
  const ACCENT = [31, 157, 139]   // #1f9d8b
  const MUTED = [100, 110, 120]

  // Draw header banner
  function drawHeader() {
    doc.setFillColor(...DARK)
    doc.rect(0, 0, pageWidth, 30, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('INTENTIONS TO AWARD', margin, 18)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 190, 200)
    doc.text('Confidential Report • Generated on ' + dateStr + ' ' + timeStr, margin, 25)
  }

  // Draw footer
  function drawFooter(pageNum, totalPages) {
    const y = pageHeight - 12
    doc.setDrawColor(200, 210, 220)
    doc.setLineWidth(0.3)
    doc.line(margin, y - 3, pageWidth - margin, y - 3)

    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text('Confidential • Intentions to Award', margin, y)
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, y, { align: 'center' })
    doc.text(dateStr + ' ' + timeStr, pageWidth - margin, y, { align: 'right' })
  }

  drawHeader()

  // Summary pills
  const pillY = 38
  const pillWidth = (pageWidth - margin * 2 - 8) / 3
  const pills = [
    { label: 'Total Records', value: intentions.value.length, color: DARK },
    { label: 'Filtered', value: filteredData.value.length, color: [59, 130, 246] },
    { label: 'Status', value: 'Active', color: ACCENT }
  ]

  pills.forEach((p, i) => {
    const x = margin + i * (pillWidth + 4)
    doc.setFillColor(245, 247, 250)
    doc.roundedRect(x, pillY, pillWidth, 16, 3, 3, 'F')
    doc.setFillColor(...p.color)
    doc.roundedRect(x, pillY, 4, 16, 2, 2, 'F')

    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.text(p.label, x + 8, pillY + 6)

    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'bold')
    doc.text(String(p.value), x + 8, pillY + 13)
  })

  // Table
  const tableY = pillY + 26

  const tableRows = filteredData.value.map((item, i) => [
    i + 1,
    item.tender?.title || 'N/A',
    item.intention_file ? 'PDF Attached' : 'N/A',
    formatDate(item.created_at) + '\n' + formatTime(item.created_at)
  ])

  autoTable(doc, {
    startY: tableY,
    head: [['#', 'Tender Title', 'Document', 'Created At']],
    body: tableRows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [45, 55, 72],
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 90 },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 40 }
    },
    didDrawPage: (data) => {
      drawHeader()
      drawFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages())
    }
  })

  // Fix page numbers in footer
  const finalTotalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= finalTotalPages; i++) {
    doc.setPage(i)
    drawHeader()
    drawFooter(i, finalTotalPages)
  }

  doc.save('Intentions_to_Award_' + new Date().toISOString().slice(0,10) + '.pdf')
}

// ── Error Handler ────────────────────────────────────────────
function handleError(error) {
  const msg = error.response?.data?.message || 'Failed to load data'
  toast.error(msg)
}
</script>

<style scoped>
/* ─── Page ─── */
.intentions-page {
  position: relative;
}

.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.06;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: #2f78dd;
  top: -150px;
  right: -150px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: #1f9d8b;
  bottom: -100px;
  left: -100px;
}

/* Budget design system - btn styles now inline */

.table-row {
  transition: background 0.15s;
}

.table-row:hover {
  background: #f9fafb;
}
</style>