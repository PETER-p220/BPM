<template>
  <div class="ir-shell">

    <!-- Page header -->
    <div class="ir-header">
      <div class="ir-header-text">
        <h1 class="ir-title">Intention Reports</h1>
        <p class="ir-subtitle">Search and export intention-to-award records by date range</p>
      </div>
    </div>

    <!-- Search bar card -->
    <div class="search-card">
      <div class="search-card-inner">
        <div class="search-fields">
          <div class="sfield">
            <label class="sfield-label">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              From Date
            </label>
            <input type="date" v-model="dateRange.from" class="sfield-input" id="fromDate" required />
          </div>
          <div class="sfield-divider">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
          <div class="sfield">
            <label class="sfield-label">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              To Date
            </label>
            <input type="date" v-model="dateRange.to" class="sfield-input" id="toDate" required />
          </div>
        </div>

        <div class="search-actions">
          <button @click="searchData" :disabled="isLoading" class="sbtn sbtn--primary">
            <svg v-if="isLoading" class="sbtn-ico spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <svg v-else class="sbtn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            {{ isLoading ? 'Searching…' : 'Search' }}
          </button>
          <button @click="exportToExcel" :disabled="!isSearched || intentions.length === 0" class="sbtn sbtn--excel">
            <svg class="sbtn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Excel
          </button>
          <button @click="exportToPDF" :disabled="!isSearched || intentions.length === 0" class="sbtn sbtn--pdf">
            <svg class="sbtn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Results area -->
    <div class="results-area">

      <!-- Filter row (only shown after search) -->
      <div v-if="isSearched" class="results-toolbar">
        <div class="filter-wrap">
          <svg class="filter-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" v-model="filter" placeholder="Filter by tender, user…" class="filter-input" />
          <button v-if="filter" @click="filter = ''" class="filter-clear">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="results-meta">
          <span class="results-count">
            <strong>{{ filteredData.length }}</strong> record{{ filteredData.length !== 1 ? 's' : '' }} found
          </span>
        </div>
      </div>

      <!-- Pre-search state -->
      <div v-if="!isSearched" class="state-panel">
        <div class="state-icon state-icon--idle">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <h3 class="state-title">Select a date range to begin</h3>
        <p class="state-body">Choose a From and To date above, then click <strong>Search</strong> to load intention reports.</p>
      </div>

      <!-- Empty search result -->
      <div v-else-if="isSearched && filteredData.length === 0" class="state-panel">
        <div class="state-icon state-icon--empty">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 class="state-title">No records found</h3>
        <p class="state-body">No intention reports match your selected date range{{ filter ? ' or filter' : '' }}.</p>
      </div>

      <!-- Table -->
      <div v-else class="table-card">
        <div class="table-scroll">
          <table class="ir-table" id="data-table">
            <thead>
              <tr>
                <th class="th-num">#</th>
                <th>Tender</th>
                <th>Created By</th>
                <th class="th-center">Intention File</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(intention, index) in paginatedData" :key="intention.intention_id" class="ir-row">
                <td class="td-num">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="td-title">
                  <div class="tender-title">{{ intention.tender?.title || '—' }}</div>
                </td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ getInitial(intention.user?.name) }}</div>
                    <span class="user-name">{{ intention.user?.name || '—' }}</span>
                  </div>
                </td>
                <td class="td-center">
                  <button
                    class="dl-btn"
                    @click="downloadIntentionFile(intention.intention_file)"
                    title="Download PDF"
                  >
                    <svg class="dl-btn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download PDF
                  </button>
                </td>
                <td>
                  <span class="date-chip">{{ formatDate(intention.created_at) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="ir-pagination">
          <p class="pag-info">
            Showing <strong>{{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</strong>
            of <strong>{{ filteredData.length }}</strong>
          </p>
          <div class="pag-controls">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pag-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <span class="pag-pages">
              <button
                v-for="p in pageNumbers"
                :key="p"
                @click="changePage(p)"
                :class="['pag-num', p === currentPage ? 'pag-num--active' : '']"
              >{{ p }}</button>
            </span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage * itemsPerPage >= filteredData.length" class="pag-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const intentions  = ref([])
const filter      = ref('')
const dateRange   = ref({ from: '', to: '' })
const currentPage = ref(1)
const itemsPerPage = 10
const isSearched  = ref(false)
const isLoading   = ref(false)

function getInitial(name) {
  if (!name) return '?'
  return name.trim()[0].toUpperCase()
}

async function searchData() {
  if (!dateRange.value.from || !dateRange.value.to) {
    toast.error('Please select both From and To dates.')
    return
  }
  isLoading.value = true
  isSearched.value = true
  filter.value = ''
  currentPage.value = 1
  try {
    const response = await axios.get('api/intention-reports', {
      params: { from: dateRange.value.from, to: dateRange.value.to }
    })
    intentions.value = response.data.data
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

async function downloadIntentionFile(fileUrl) {
  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' })
    saveAs(response.data, 'intention_to_award.pdf')
  } catch (error) {
    handleError(error)
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const filteredData = computed(() =>
  intentions.value.filter(entry => {
    const q = filter.value.toLowerCase()
    return (
      (entry.tender?.title?.toLowerCase() || '').includes(q) ||
      (entry.user?.name?.toLowerCase()    || '').includes(q) ||
      (entry.created_at?.toLowerCase()    || '').includes(q)
    )
  })
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage)))

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 4)   return [1, 2, 3, 4, 5, '…', total]
  if (cur >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total]
  return [1, '…', cur-1, cur, cur+1, '…', total]
})

function changePage(page) {
  if (typeof page !== 'number') return
  if (page > 0 && page <= totalPages.value) currentPage.value = page
}

function handleError(error) {
  let message = 'An unexpected error occurred'
  if (error.response)        message = error.response.data?.message || error.response.statusText
  else if (error.request)    message = 'No response from the server. Check your connection.'
  else                       message = error.message
  toast.error(message)
}

function exportToExcel() {
  if (!isSearched.value || intentions.value.length === 0) {
    toast.error('Please search first before exporting.')
    return
  }
  const ws = XLSX.utils.json_to_sheet(
    filteredData.value.map((entry, i) => ({
      No: i + 1,
      'Tender Title': entry.tender?.title || 'N/A',
      'Created By':   entry.user?.name    || 'N/A',
      'Intention File': entry.intention_file || 'N/A',
      'Created At':   formatDate(entry.created_at),
    }))
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Intention Reports')
  XLSX.writeFile(wb, 'Intention_Reports.xlsx')
  toast.success('Excel exported!')
}

function exportToPDF() {
  if (!isSearched.value || intentions.value.length === 0) {
    toast.error('Please search first before exporting.')
    return
  }
  const doc = new jsPDF({ orientation: 'landscape' })
  const pageW = doc.internal.pageSize.getWidth()

  // Header bar
  doc.setFillColor(13, 17, 23)
  doc.rect(0, 0, pageW, 44, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(255, 255, 255)
  doc.text('Intention Reports', 14, 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(160, 160, 160)
  doc.text(`${dateRange.value.from}  →  ${dateRange.value.to}`, 14, 32)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, pageW - 14, 32, { align: 'right' })

  autoTable(doc, {
    head: [['#', 'Tender Title', 'Created By', 'Created At']],
    body: filteredData.value.map((entry, i) => [
      i + 1,
      entry.tender?.title  || 'N/A',
      entry.user?.name     || 'N/A',
      formatDate(entry.created_at),
    ]),
    startY: 52,
    theme: 'grid',
    headStyles: { fillColor: [13, 17, 23], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold', cellPadding: { top: 7, bottom: 7, left: 8, right: 8 } },
    bodyStyles: { fontSize: 9, cellPadding: { top: 6, bottom: 6, left: 8, right: 8 }, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [249, 249, 247] },
    tableLineColor: [220, 220, 215], tableLineWidth: 0.4,
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(8); doc.setTextColor(160, 160, 160)
      doc.text(`Page ${data.pageNumber}`, pageW / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
    }
  })

  doc.save('Intention_Reports.pdf')
  toast.success('PDF exported!')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0 }

.ir-shell {
  min-height: 100vh;
  background: #f4f4f0;
  font-family: 'Sora', sans-serif;
  color: #1a1a1a;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Header ── */
.ir-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px }
.ir-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #111;
  margin-bottom: 4px;
}
.ir-subtitle { font-size: 13.5px; color: #888 }

/* ── Search card ── */
.search-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 24px 28px;
}

.search-card-inner {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.search-fields {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex: 1;
  flex-wrap: wrap;
}

.sfield { display: flex; flex-direction: column; gap: 7px; flex: 1; min-width: 160px }

.sfield-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #666;
}
.sfield-label svg { width: 13px; height: 13px }

.sfield-input {
  padding: 10px 13px;
  border: 1.5px solid #d4d4d4;
  border-radius: 9px;
  font-size: 13.5px;
  font-family: 'Sora', sans-serif;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
  -webkit-appearance: none;
}
.sfield-input:focus {
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17,17,17,.07);
  background: #fff;
}

.sfield-divider {
  padding-bottom: 10px;
  color: #ccc;
  flex-shrink: 0;
}
.sfield-divider svg { width: 18px; height: 18px }

.search-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap }

.sbtn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  border: none;
  cursor: pointer;
  transition: background .15s, opacity .15s, transform .1s;
  white-space: nowrap;
}
.sbtn:disabled { opacity: .45; cursor: not-allowed }
.sbtn:not(:disabled):active { transform: translateY(1px) }

.sbtn--primary { background: #111; color: #fff }
.sbtn--primary:not(:disabled):hover { background: #2a2a2a }

.sbtn--excel { background: #15803d; color: #fff }
.sbtn--excel:not(:disabled):hover { background: #166534 }

.sbtn--pdf { background: #dc2626; color: #fff }
.sbtn--pdf:not(:disabled):hover { background: #b91c1c }

.sbtn-ico { width: 15px; height: 15px; flex-shrink: 0 }

/* ── Results area ── */
.results-area { display: flex; flex-direction: column; gap: 14px }

.results-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.filter-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}
.filter-ico {
  position: absolute;
  left: 12px;
  width: 15px;
  height: 15px;
  color: #aaa;
  pointer-events: none;
}
.filter-input {
  width: 100%;
  padding: 9px 36px 9px 36px;
  border: 1.5px solid #d4d4d4;
  border-radius: 9px;
  font-size: 13.5px;
  font-family: 'Sora', sans-serif;
  color: #111;
  background: #fff;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.filter-input:focus {
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17,17,17,.07);
}
.filter-clear {
  position: absolute;
  right: 9px;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: #e5e5e5; border-radius: 50%;
  cursor: pointer; color: #666;
  transition: background .12s;
}
.filter-clear:hover { background: #d0d0d0 }
.filter-clear svg { width: 11px; height: 11px }

.results-meta { margin-left: auto }
.results-count { font-size: 13px; color: #888 }
.results-count strong { color: #111 }

/* ── States ── */
.state-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  gap: 14px;
  text-align: center;
}
.state-icon {
  width: 60px; height: 60px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
}
.state-icon svg { width: 30px; height: 30px }
.state-icon--idle { background: #f0f0ee; color: #bbb }
.state-icon--empty { background: #fef9c3; color: #ca8a04 }
.state-title { font-size: 16px; font-weight: 700; color: #333 }
.state-body { font-size: 13.5px; color: #aaa; max-width: 360px; line-height: 1.6 }

/* ── Table card ── */
.table-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  overflow: hidden;
}

.table-scroll { overflow-x: auto }

.ir-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.ir-table thead {
  background: #0f1117;
}

.ir-table th {
  padding: 13px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: .07em;
  white-space: nowrap;
}
.th-num  { width: 52px; text-align: center }
.th-center { text-align: center }

.ir-row { border-bottom: 1px solid #f0f0ee; transition: background .1s }
.ir-row:last-child { border-bottom: none }
.ir-row:hover { background: #fafaf8 }

.ir-table td { padding: 13px 18px; vertical-align: middle; color: #444 }

.td-num {
  text-align: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #bbb;
}
.td-center { text-align: center }
.td-title { max-width: 280px }

.tender-title {
  font-weight: 600;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

/* User cell */
.user-cell { display: flex; align-items: center; gap: 10px }
.user-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #374151, #111827);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-name { font-size: 13.5px; color: #333; white-space: nowrap }

/* Download button */
.dl-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
  font-size: 12.5px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background .14s, border-color .14s, box-shadow .14s, transform .1s;
  white-space: nowrap;
}
.dl-btn:hover {
  background: #dcfce7;
  border-color: #86efac;
  box-shadow: 0 2px 8px rgba(21,128,61,.15);
  transform: translateY(-1px);
}
.dl-btn:active { transform: translateY(0) }
.dl-btn-ico { width: 14px; height: 14px; flex-shrink: 0 }

/* Date chip */
.date-chip {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #666;
  background: #f4f4f0;
  padding: 3px 9px;
  border-radius: 6px;
  white-space: nowrap;
}

/* ── Pagination ── */
.ir-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #f0f0ee;
  flex-wrap: wrap;
  gap: 12px;
}

.pag-info { font-size: 13px; color: #888 }
.pag-info strong { color: #111 }

.pag-controls { display: flex; align-items: center; gap: 4px }

.pag-btn {
  width: 34px; height: 34px;
  border: 1.5px solid #d4d4d4;
  border-radius: 8px;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #555;
  transition: background .12s, border-color .12s;
}
.pag-btn svg { width: 14px; height: 14px }
.pag-btn:hover:not(:disabled) { background: #f5f5f5; border-color: #bbb }
.pag-btn:disabled { opacity: .4; cursor: not-allowed }

.pag-pages { display: flex; align-items: center; gap: 3px; margin: 0 4px }

.pag-num {
  min-width: 34px; height: 34px;
  border: 1.5px solid transparent;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Sora', sans-serif;
  padding: 0 6px;
  transition: all .12s;
}
.pag-num:hover { background: #f0f0f0; color: #111 }
.pag-num--active { background: #111; color: #fff; border-color: #111 }

/* Spin animation */
@keyframes spin { to { transform: rotate(360deg) } }
.spin { animation: spin .7s linear infinite }

/* Responsive */
@media (max-width: 900px) {
  .ir-shell { padding: 24px 20px }
  .search-card-inner { flex-direction: column; align-items: stretch }
  .search-actions { justify-content: flex-start }
  .results-toolbar { flex-direction: column; align-items: stretch }
  .filter-wrap { max-width: 100% }
  .results-meta { margin-left: 0 }
}
@media (max-width: 600px) {
  .search-fields { flex-direction: column }
  .sfield-divider { display: none }
}
</style>