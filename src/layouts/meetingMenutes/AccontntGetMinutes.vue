<template>
  <div class="min-h-screen page-bg" style="font-family: 'DM Sans', sans-serif;">
    <!-- Ambient background blobs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Sticky Header -->
    <header class="sticky top-0 z-30 header-glass border-b border-gray-100/70 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M3 10h18"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Meeting Minutes Report</h1>
            <p class="text-sm text-gray-500 mt-0.5">
              <span class="font-semibold text-indigo-600">{{ reportData.length }}</span> minute{{ reportData.length !== 1 ? 's' : '' }}
              <span v-if="selectedDate" class="mx-2 text-gray-300">•</span>
              <span v-if="selectedDate" class="text-gray-600 font-medium">{{ formattedDate }}</span>
            </p>
          </div>
        </div>

        <router-link
          to="/accountant-create-minutes"
          class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Minute
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <!-- Controls & Export -->
      <div class="controls-card fade-up">
        <div class="flex flex-col sm:flex-row sm:items-end gap-5 flex-wrap">
          <div class="flex-1 min-w-[240px]">
            <label class="input-label">Select Date</label>
            <input
              v-model="selectedDate"
              type="date"
              class="styled-input w-full"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="fetchReport"
              :disabled="loading || !selectedDate"
              class="btn-fetch inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Load Report
            </button>

            <div class="flex gap-3">
              <button
                @click="exportToExcel"
                :disabled="loading || reportData.length === 0"
                class="btn-export btn-excel inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="16" y2="17"/>
                </svg>
                Excel
              </button>

              <button
                @click="exportToPDF"
                :disabled="loading || reportData.length === 0"
                class="btn-export btn-pdf inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="16" y2="17"/>
                </svg>
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <transition name="fade">
        <div v-if="reportData.length > 0" class="summary-row fade-up">
          <div class="summary-card s-total">
            <div class="s-icon s-icon-total">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              </svg>
            </div>
            <div>
              <div class="s-num">{{ reportData.length }}</div>
              <div class="s-label">Total Minutes</div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Table -->
      <transition name="fade">
        <div v-if="reportData.length > 0" class="table-wrap fade-up">
          <div class="overflow-x-auto">
            <table class="att-table">
              <thead>
                <tr>
                  <th class="th-no">#</th>
                  <th>Department Engineer</th>
                  <th>Prepared By</th>
                  <th>Project</th>
                  <th>Minute Point</th>
                  <th>Details</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(minute, index) in reportData"
                  :key="minute.minutes_id"
                  class="table-row"
                  :style="{ animationDelay: `${index * 60}ms` }"
                >
                  <td class="td-no">{{ index + 1 }}</td>
                  <td>{{ minute.user?.name || '—' }}</td>
                  <td>{{ minute.logged_user?.name || '—' }}</td>
                  <td>{{ minute.project?.project_name || '—' }}</td>
                  <td class="td-point">{{ minute.minute_point || '—' }}</td>
                  <td class="td-details">{{ minute.if_more_detail || '—' }}</td>
                  <td class="td-date">{{ formatDate(minute.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>

      <!-- Empty / No Data -->
      <transition name="fade">
        <div
          v-if="!loading && reportData.length === 0 && selectedDate"
          class="empty-state fade-up"
        >
          <div class="empty-icon-wrap">
            <div class="empty-ring"></div>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
              <path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M3 10h18"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mt-6">No Meeting Minutes Found</h3>
          <p class="text-gray-500 mt-2 max-w-md mx-auto">
            No minutes recorded for <strong>{{ formattedDate }}</strong>.
          </p>
        </div>
      </transition>

      <!-- Loading -->
      <transition name="fade">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="mt-4 text-gray-600 font-medium">Loading meeting minutes report...</p>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from '@e965/xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const selectedDate = ref('')
const reportData = ref([])
const loading = ref(false)

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

async function fetchReport() {
  if (!selectedDate.value) {
    toast.warning('Please select a date first')
    return
  }

  loading.value = true
  reportData.value = []

  try {
    const response = await axios.post('api/meeting-minutes/report', {
      date: selectedDate.value
    })

    if (response.data.status === 'success') {
      reportData.value = response.data.data || []
      if (reportData.value.length === 0) {
        toast.info('No meeting minutes found for this date')
      }
    } else {
      toast.error(response.data.message || 'Failed to load report')
    }
  } catch (err) {
    toast.error('Could not fetch meeting minutes report')
    console.error(err)
  } finally {
    loading.value = false
  }
}

function exportToExcel() {
  if (!reportData.value.length) return

  const data = reportData.value.map((r, i) => ({
    '#': i + 1,
    'Department Engineer': r.user?.name || '—',
    'Prepared By': r.logged_user?.name || '—',
    Project: r.project?.project_name || '—',
    'Minute Point': r.minute_point || '—',
    Details: r.if_more_detail || '—',
    'Created At': formatDate(r.created_at)
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Minutes')
  XLSX.writeFile(wb, `Meeting_Minutes_${selectedDate.value || 'Report'}.xlsx`)

  toast.success('Excel file downloaded')
}

function exportToPDF() {
  if (!reportData.value.length) return

  const doc = new jsPDF()

  // Header
  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text(`Meeting Minutes Report – ${formattedDate.value}`, 14, 22)

  // Subtitle
  doc.setFontSize(11)
  doc.setTextColor(107, 114, 128)
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, 14, 30)

  const tableColumn = ['#', 'Dept Engineer', 'Prepared By', 'Project', 'Minute Point', 'Details', 'Created At']
  const tableRows = reportData.value.map((r, i) => [
    i + 1,
    r.user?.name || '—',
    r.logged_user?.name || '—',
    r.project?.project_name || '—',
    r.minute_point || '—',
    r.if_more_detail || '—',
    formatDate(r.created_at)
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 12 },
      4: { cellWidth: 50 },
      5: { cellWidth: 60 },
      6: { cellWidth: 40 }
    },
    margin: { top: 40, left: 14, right: 14 }
  })

  doc.save(`Meeting_Minutes_${selectedDate.value || new Date().toISOString().slice(0,10)}.pdf`)
  toast.success('PDF exported successfully')
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* ──────────────────────────────────────────────
   Background & Blobs (same as your other pages)
─────────────────────────────────────────────── */
.page-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  opacity: 0.6;
}

.blob-1 { width: 560px; height: 560px; background: radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%); top: -220px; right: -180px; }
.blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(124,58,237,0.11) 0%, transparent 70%); bottom: -140px; left: -120px; }
.blob-3 { width: 340px; height: 340px; background: radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%); top: 55%; left: 12%; }

/* ──────────────────────────────────────────────
   Header (Glassmorphism)
─────────────────────────────────────────────── */
.header-glass {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(79,70,229,0.35);
}

/* ──────────────────────────────────────────────
   Controls & Buttons
─────────────────────────────────────────────── */
.controls-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.btn-fetch {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
}

.btn-excel { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.btn-pdf   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

/* ──────────────────────────────────────────────
   Summary (only total for minutes – can add more later)
─────────────────────────────────────────────── */
.summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.summary-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.s-icon-total {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.s-num {
  font-size: 24px;
  font-weight: 800;
}

.s-label {
  font-size: 12.5px;
  color: #9ca3af;
  font-weight: 650;
}

/* ──────────────────────────────────────────────
   Table
─────────────────────────────────────────────── */
.table-wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
}

.att-table {
  width: 100%;
  border-collapse: collapse;
}

.att-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #f3f4f6;
}

.att-table th {
  padding: 14px 18px;
  text-align: left;
  font-size: 12.5px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.att-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.att-table tbody tr:hover {
  background: #f9fafb;
}

.att-table td {
  padding: 15px 18px;
  font-size: 14px;
  color: #4b5563;
}

.td-no {
  font-weight: 700;
  color: #9ca3af;
  width: 60px;
}

.td-point, .td-details {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.td-date {
  color: #9ca3af;
  white-space: nowrap;
}

/* ──────────────────────────────────────────────
   Empty & Loading
─────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
}

.empty-ring {
  position: absolute;
  inset: 0;
  border: 3px dashed rgba(79,70,229,0.25);
  border-radius: 50%;
  animation: spin 24s linear infinite;
}

.empty-icon {
  color: #4f46e5;
  opacity: 0.7;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ──────────────────────────────────────────────
   Animations
─────────────────────────────────────────────── */
.fade-up { animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

@keyframes spin { to { transform:rotate(360deg); } }
</style>