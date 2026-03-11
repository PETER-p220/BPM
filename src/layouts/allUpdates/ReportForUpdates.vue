<template>
  <div class="eu-shell">

    <!-- Page header -->
    <div class="eu-header">
      <div>
        <h1 class="eu-title">Employee Updates</h1>
        <p class="eu-subtitle">View, filter and export daily employee progress updates</p>
      </div>
      <div v-if="reports.length" class="eu-header-stat">
        <span class="eu-stat-num">{{ reports.length }}</span>
        <span class="eu-stat-label">updates</span>
      </div>
    </div>

    <!-- Filter card -->
    <div class="filter-card">
      <!-- Quick ranges -->
      <div class="quick-ranges">
        <button
          v-for="range in quickRanges"
          :key="range.value"
          :class="['quick-btn', selectedQuickRange === range.value ? 'quick-btn--active' : '']"
          @click="applyQuickRange(range)"
        >{{ range.label }}</button>
      </div>

      <div class="filter-row">
        <div class="filter-fields">
          <div class="ffield">
            <label class="ffield-label">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              From
            </label>
            <input type="date" v-model="fromDate" :max="toDate || undefined" @change="selectedQuickRange = null" class="ffield-input" />
          </div>
          <div class="ffield-arrow">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
          <div class="ffield">
            <label class="ffield-label">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              To
            </label>
            <input type="date" v-model="toDate" :min="fromDate || undefined" @change="selectedQuickRange = null" class="ffield-input" />
          </div>
        </div>

        <div class="filter-actions">
          <button @click="fetchReport" :disabled="isLoading || !fromDate || !toDate" class="fbtn fbn--primary">
            <svg v-if="isLoading" class="fbn-ico spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <svg v-else class="fbn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            {{ isLoading ? 'Loading…' : 'Fetch' }}
          </button>
          <button @click="resetFilter" :disabled="isLoading" class="fBtn fbn--ghost">
            <svg class="fbn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Reset
          </button>
          <div class="export-divider"></div>
          <button @click="exportToExcel" :disabled="isLoading || !reports.length" class="fBtn fbn--excel">
            <svg class="fbn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Excel
          </button>
          <button @click="exportToPDF" :disabled="isLoading || !reports.length" class="fBtn fbn--pdf">
            <svg class="fbn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Skeleton loader -->
    <div v-if="isLoading" class="skeleton-wrap">
      <div v-for="i in 6" :key="i" class="skeleton-row"></div>
    </div>

    <!-- Table -->
    <div v-else-if="reports.length > 0" class="table-card">
      <div class="table-topbar">
        <p class="table-count">
          Showing <strong>{{ startIndex }}–{{ endIndex }}</strong> of <strong>{{ reports.length }}</strong> updates
        </p>
        <div class="per-page-wrap">
          <label class="per-page-label">Per page</label>
          <select v-model="itemsPerPage" @change="currentPage = 1" class="per-page-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <div class="table-scroll">
        <table class="eu-table">
          <thead>
            <tr>
              <th class="th-no">#</th>
              <th>Employee</th>
              <th>Title</th>
              <th class="th-desc">Description</th>
              <th>Date</th>
              <th class="th-center">Photo</th>
              <th class="th-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(report, index) in paginatedReports"
              :key="report.chat_id"
              class="eu-row"
              @click="viewUpdate(report)"
              tabindex="0"
              @keydown.enter="viewUpdate(report)"
            >
              <td class="td-no">{{ startIndex + index }}</td>
              <td>
                <div class="emp-cell">
                  <div class="emp-avatar" :style="{ background: avatarColor(report.user?.name) }">
                    {{ initials(report.user?.name) }}
                  </div>
                  <span class="emp-name">{{ report.user?.name || '—' }}</span>
                </div>
              </td>
              <td>
                <span class="title-tag" :title="report.title">{{ report.title || '—' }}</span>
              </td>
              <td class="td-desc">
                <span class="desc-clamp" :title="report.description || '—'">{{ report.description || '—' }}</span>
              </td>
              <td>
                <span class="date-mono">{{ formatDate(report.created_at) }}</span>
              </td>
              <td class="td-center" @click.stop>
                <img
                  v-if="report.update_photo"
                  :src="report.update_photo"
                  alt="Update photo"
                  class="thumb"
                  @click="openImageModal(report.update_photo)"
                  loading="lazy"
                />
                <span v-else class="td-empty">—</span>
              </td>
              <td class="td-center td-actions" @click.stop>
                <button class="act-btn act-btn--view" @click="viewUpdate(report)" title="View details">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button
                  v-if="report.update_file"
                  class="act-btn act-btn--dl"
                  @click="downloadFile(report.update_file, `update_${report.chat_id}.pdf`)"
                  title="Download PDF"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="eu-pagination">
        <p class="pag-info">Page <strong>{{ currentPage }}</strong> of <strong>{{ totalPages }}</strong></p>
        <div class="pag-controls">
          <button class="pag-btn" @click="changePage(1)" :disabled="currentPage === 1">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          </button>
          <button class="pag-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            v-for="p in visiblePages"
            :key="p"
            :class="['pag-num', p === currentPage ? 'pag-num--active' : '', p === '…' ? 'pag-ellipsis' : '']"
            @click="p !== '…' && changePage(p)"
            :disabled="p === '…'"
          >{{ p }}</button>
          <button class="pag-btn" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          <button class="pag-btn" @click="changePage(totalPages)" :disabled="currentPage >= totalPages">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Pre-fetch state -->
    <div v-else-if="!hasFetched" class="state-panel">
      <div class="state-gfx state-gfx--blue">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>
      <h3 class="state-title">Ready to load updates</h3>
      <p class="state-body">Pick a date range using the quick filters above, then press <strong>Fetch</strong>.</p>
      <div class="hint-strip">
        <span class="hint-chip">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Click <strong>Today</strong> for instant results
        </span>
        <span class="hint-chip">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          All employees included
        </span>
        <span class="hint-chip">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export to Excel or PDF
        </span>
      </div>
    </div>

    <!-- No results -->
    <div v-else class="state-panel state-panel--empty">
      <div class="state-gfx state-gfx--gray">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
      </div>
      <h3 class="state-title">No updates found</h3>
      <p class="state-body">
        Nothing between
        <code class="date-code">{{ fromDate }}</code> and
        <code class="date-code">{{ toDate }}</code>.
        Try a wider range.
      </p>
      <div class="state-cta">
        <button @click="applyQuickRange(quickRanges[0])" class="fBtn fbn--primary">Try Today</button>
        <button @click="applyQuickRange(quickRanges[2])" class="fBtn fbn--ghost">Last 7 Days</button>
        <button @click="resetFilter" class="fBtn fbn--ghost">Reset</button>
      </div>
    </div>

    <!-- ══ VIEW DETAIL MODAL ══ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showViewModal" class="modal-backdrop" @mousedown.self="closeViewModal">
          <div class="eu-modal" @mousedown.stop>

            <div class="modal-hd">
              <div class="modal-hd-left">
                <div class="modal-hd-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div>
                  <p class="modal-hd-tag">Update Details</p>
                  <h2 class="modal-hd-title">{{ selectedUpdate?.title || 'Untitled' }}</h2>
                </div>
              </div>
              <button class="modal-close" @click="closeViewModal">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="modal-bd">
              <!-- Employee row -->
              <div class="modal-emp-row">
                <div class="emp-avatar emp-avatar--lg" :style="{ background: avatarColor(selectedUpdate?.user?.name) }">
                  {{ initials(selectedUpdate?.user?.name) }}
                </div>
                <div>
                  <p class="modal-emp-name">{{ selectedUpdate?.user?.name || 'Unknown' }}</p>
                  <p class="modal-emp-date">{{ formatDate(selectedUpdate?.created_at) }}</p>
                </div>
              </div>

              <!-- Description -->
              <div class="modal-section">
                <p class="modal-section-label">Description</p>
                <div class="modal-section-body">{{ selectedUpdate?.description || 'No description provided.' }}</div>
              </div>

              <!-- Photo -->
              <div v-if="selectedUpdate?.update_photo" class="modal-section">
                <p class="modal-section-label">Photo</p>
                <div class="modal-photo-wrap" @click="openImageModal(selectedUpdate.update_photo)">
                  <img :src="selectedUpdate.update_photo" alt="Update photo" class="modal-photo" />
                  <div class="modal-photo-overlay">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v4m0 0v-4m0 4h4m-4 0H6"/></svg>
                    Click to enlarge
                  </div>
                </div>
              </div>

              <!-- Attachment -->
              <div v-if="selectedUpdate?.update_file" class="modal-section">
                <p class="modal-section-label">Attachment</p>
                <button
                  class="fBtn fbn--primary"
                  @click="downloadFile(selectedUpdate.update_file, `update_${selectedUpdate.chat_id}.pdf`)"
                >
                  <svg class="fbn-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download PDF
                </button>
              </div>
            </div>

            <div class="modal-ft">
              <button class="fBtn fbn--ghost" @click="closeViewModal">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ IMAGE LIGHTBOX ══ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showImageModal" class="lightbox" @click="closeImageModal">
          <button class="lightbox-close" @click="closeImageModal">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <img :src="selectedImage" alt="Full size" class="lightbox-img" />
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toast = useToast()

const reports             = ref([])
const fromDate            = ref('')
const toDate              = ref('')
const currentPage         = ref(1)
const itemsPerPage        = ref(10)
const isLoading           = ref(false)
const showViewModal       = ref(false)
const showImageModal      = ref(false)
const selectedUpdate      = ref(null)
const selectedImage       = ref('')
const selectedQuickRange  = ref(null)
const hasFetched          = ref(false)
const pagination          = ref(null)

const quickRanges = [
  { label: 'Today',        value: 'today' },
  { label: 'Yesterday',    value: 'yesterday' },
  { label: 'Last 7 days',  value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'This month',   value: 'this-month' },
  { label: 'Last month',   value: 'last-month' },
]

function toLocalDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function applyQuickRange(range) {
  selectedQuickRange.value = range.value
  const now = new Date()
  const todayStr = toLocalDateStr(now)
  let from, to

  switch (range.value) {
    case 'today':       from = todayStr; to = todayStr; break
    case 'yesterday': { const y = new Date(now); y.setDate(now.getDate()-1); const s = toLocalDateStr(y); from=s; to=s; break }
    case '7d':        { const d = new Date(now); d.setDate(now.getDate()-6); from=toLocalDateStr(d); to=todayStr; break }
    case '14d':       { const d = new Date(now); d.setDate(now.getDate()-13); from=toLocalDateStr(d); to=todayStr; break }
    case '30d':       { const d = new Date(now); d.setDate(now.getDate()-29); from=toLocalDateStr(d); to=todayStr; break }
    case 'this-month':{ from=toLocalDateStr(new Date(now.getFullYear(),now.getMonth(),1)); to=todayStr; break }
    case 'last-month':{ from=toLocalDateStr(new Date(now.getFullYear(),now.getMonth()-1,1)); to=toLocalDateStr(new Date(now.getFullYear(),now.getMonth(),0)); break }
    default: return
  }

  fromDate.value = from
  toDate.value   = to
  fetchReport()
}

function resetFilter() {
  fromDate.value = ''; toDate.value = ''; selectedQuickRange.value = null
  reports.value = []; hasFetched.value = false; currentPage.value = 1
}

const totalPages = computed(() =>
  pagination.value ? pagination.value.last_page : Math.ceil(reports.value.length / itemsPerPage.value) || 1
)

const paginatedReports = computed(() => {
  if (pagination.value) return reports.value
  const start = (currentPage.value - 1) * itemsPerPage.value
  return reports.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => {
  if (pagination.value) return pagination.value.from || 0
  return reports.value.length === 0 ? 0 : (currentPage.value-1)*itemsPerPage.value+1
})

const endIndex = computed(() => {
  if (pagination.value) return pagination.value.to || 0
  return Math.min(startIndex.value + itemsPerPage.value - 1, reports.value.length)
})

const visiblePages = computed(() => {
  const total = totalPages.value, cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i+1)
  if (cur <= 4)         return [1,2,3,4,5,'…',total]
  if (cur >= total - 3) return [1,'…',total-4,total-3,total-2,total-1,total]
  return [1,'…',cur-1,cur,cur+1,'…',total]
})

const PALETTE = ['#2563eb','#0ea5e9','#8b5cf6','#ec4899','#f43f5e','#14b8a6','#22c55e','#f59e0b']
function avatarColor(name) {
  if (!name) return PALETTE[0]
  let h = 0; for (let i=0;i<name.length;i++) h = name.charCodeAt(i)+((h<<5)-h)
  return PALETTE[Math.abs(h) % PALETTE.length]
}
function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]?.toUpperCase()||'').join('').slice(0,2)
}
function formatDate(d) {
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-GB',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(d))
}
function changePage(p) {
  if (p<1||p>totalPages.value) return
  currentPage.value = p
  fetchReport()
}

async function fetchReport() {
  if (!fromDate.value||!toDate.value) { toast.error('Select both From and To dates.'); return }
  if (fromDate.value > toDate.value)  { toast.error('"From" date cannot be after "To" date.'); return }
  isLoading.value = true
  try {
    const { data } = await axios.get('/api/reports/for-updates', {
      params: { from: fromDate.value, to: `${toDate.value} 23:59:59`, exclude_admin: true, page: currentPage.value, per_page: 10 }
    })
    if (data.pagination) { reports.value = data.data||[]; pagination.value = data.pagination }
    else { reports.value = data.data||[]; pagination.value = null }
    hasFetched.value = true
    const count = pagination.value ? pagination.value.total : reports.value.length
    if (!count) toast.info(`No updates found between ${fromDate.value} and ${toDate.value}`)
    else toast.success(`Found ${count} update${count!==1?'s':''}`)
  } catch { toast.error('Failed to fetch updates. Please try again.') }
  finally { isLoading.value = false }
}

async function downloadFile(url, filename) {
  if (!url) return toast.error('No file attached.')
  try {
    const res = await axios.get(url,{responseType:'blob'})
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([res.data],{type:'application/pdf'}))
    a.download = filename; a.click(); URL.revokeObjectURL(a.href)
  } catch { toast.error('Download failed.') }
}

function exportToExcel() {
  if (!reports.value.length) return toast.warning('No data to export.')
  const ws = XLSX.utils.json_to_sheet(reports.value.map((r,i) => ({
    '#': i+1, Employee: r.user?.name||'—', Title: r.title||'—',
    Description: r.description||'—', 'Has Photo': r.update_photo?'Yes':'No',
    'Has File': r.update_file?'Yes':'No', Submitted: formatDate(r.created_at)
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Updates')
  XLSX.writeFile(wb, `Employee_Updates_${fromDate.value}_to_${toDate.value}.xlsx`)
  toast.success('Excel exported!')
}

function exportToPDF() {
  if (!reports.value.length) return toast.warning('No data to export.')
  const doc = new jsPDF({ orientation: 'landscape' })
  const pageW = doc.internal.pageSize.getWidth()
  doc.setFillColor(13,17,23); doc.rect(0,0,pageW,44,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(15); doc.setTextColor(255,255,255)
  doc.text('Employee Updates Report',14,20)
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(160,160,160)
  doc.text(`${fromDate.value}  →  ${toDate.value}`,14,32)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`,pageW-14,32,{align:'right'})
  autoTable(doc, {
    startY: 52,
    head: [['#','Employee','Title','Description','Photo','File','Date']],
    body: reports.value.map((r,i) => [i+1,r.user?.name||'—',r.title||'—',r.description||'—',r.update_photo?'Yes':'No',r.update_file?'Yes':'No',formatDate(r.created_at)]),
    theme: 'grid',
    headStyles: { fillColor:[13,17,23], textColor:[255,255,255], fontSize:9, fontStyle:'bold', cellPadding:{top:7,bottom:7,left:8,right:8} },
    bodyStyles: { fontSize:9, cellPadding:{top:6,bottom:6,left:8,right:8}, textColor:[40,40,40] },
    alternateRowStyles: { fillColor:[249,249,247] },
    columnStyles: { 3:{cellWidth:70} },
    margin: { left:14, right:14 },
  })
  doc.save(`Employee_Updates_${fromDate.value}_to_${toDate.value}.pdf`)
  toast.success('PDF exported!')
}

function viewUpdate(report)    { selectedUpdate.value = report; showViewModal.value = true }
function closeViewModal()      { showViewModal.value = false; selectedUpdate.value = null }
function openImageModal(src)   { selectedImage.value = src; showImageModal.value = true }
function closeImageModal()     { showImageModal.value = false; selectedImage.value = '' }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0 }

.eu-shell {
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
.eu-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.eu-title { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; color: #111; margin-bottom: 4px }
.eu-subtitle { font-size: 13.5px; color: #888 }
.eu-header-stat { text-align: right }
.eu-stat-num { font-size: 36px; font-weight: 700; color: #111; line-height: 1; display: block }
.eu-stat-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: .08em; font-family: 'IBM Plex Mono', monospace }

/* ── Filter card ── */
.filter-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 22px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.quick-ranges { display: flex; flex-wrap: wrap; gap: 7px }
.quick-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid #e5e5e5;
  background: #fafaf8;
  font-size: 12.5px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: all .14s;
}
.quick-btn:hover { background: #f0f0ee; border-color: #bbb; color: #111 }
.quick-btn--active { background: #111; color: #fff; border-color: #111 }

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-fields {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}

.ffield { display: flex; flex-direction: column; gap: 7px; flex: 1; min-width: 150px }
.ffield-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #666;
}
.ffield-label svg { width: 13px; height: 13px }
.ffield-input {
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
.ffield-input:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(17,17,17,.07); background: #fff }
.ffield-arrow { padding-bottom: 10px; color: #ccc; flex-shrink: 0 }
.ffield-arrow svg { width: 18px; height: 18px }

.filter-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; flex-shrink: 0 }

.export-divider { width: 1px; height: 32px; background: #e5e5e5; margin: 0 2px; align-self: center }

/* Buttons */
.fBtn, .fBtn:is(button) {
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
/* duplicate class for template typo-resilience */
.fBtn { }
.fbn--primary, .fbn--primary { background: #111; color: #fff }
.fbn--primary:not(:disabled):hover { background: #2a2a2a }
.fbn--ghost { background: transparent; color: #555; border: 1.5px solid #d4d4d4 }
.fbn--ghost:not(:disabled):hover { background: #f0f0ee }
.fbn--excel { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0 }
.fbn--excel:not(:disabled):hover { background: #dcfce7 }
.fbn--pdf { background: #fff1f2; color: #b91c1c; border: 1.5px solid #fecdd3 }
.fbn--pdf:not(:disabled):hover { background: #fee2e2 }
.fBtn:disabled, button:disabled { opacity: .45; cursor: not-allowed }
.fBtn:not(:disabled):active { transform: translateY(1px) }

.fbn-ico { width: 15px; height: 15px; flex-shrink: 0 }

/* ── Skeleton ── */
.skeleton-wrap { display: flex; flex-direction: column; gap: 10px }
.skeleton-row {
  height: 66px;
  border-radius: 10px;
  background: linear-gradient(90deg,#f0f0ee 25%,#e5e5e2 50%,#f0f0ee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Table card ── */
.table-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  overflow: hidden;
}

.table-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  border-bottom: 1px solid #f0f0ee;
  gap: 12px;
  flex-wrap: wrap;
}
.table-count { font-size: 13px; color: #888 }
.table-count strong { color: #111 }
.per-page-wrap { display: flex; align-items: center; gap: 8px }
.per-page-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #aaa }
.per-page-select {
  border: 1.5px solid #d4d4d4;
  border-radius: 7px;
  padding: 5px 10px;
  font-size: 13px;
  font-family: 'Sora', sans-serif;
  background: #fafafa;
  color: #111;
  outline: none;
}

.table-scroll { overflow-x: auto }

.eu-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.eu-table thead { background: #0f1117 }

.eu-table th {
  padding: 13px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: .07em;
  white-space: nowrap;
}
.th-no { width: 52px; text-align: center }
.th-center { text-align: center }
.th-desc { max-width: 260px }

.eu-row { border-bottom: 1px solid #f0f0ee; transition: background .1s; cursor: pointer }
.eu-row:last-child { border-bottom: none }
.eu-row:hover, .eu-row:focus-within { background: #fafaf8 }

.eu-table td { padding: 13px 18px; vertical-align: middle; color: #444 }

.td-no { text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #bbb }
.td-center { text-align: center }
.td-desc { max-width: 260px }
.td-actions { display: flex; gap: 7px; justify-content: center }
.td-empty { color: #ddd; font-family: 'IBM Plex Mono', monospace }

.emp-cell { display: flex; align-items: center; gap: 10px }
.emp-avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.emp-avatar--lg { width: 44px; height: 44px; border-radius: 11px; font-size: 16px }
.emp-name { font-weight: 600; color: #111; white-space: nowrap }

.title-tag {
  display: inline-block;
  background: #f4f4f0;
  border: 1px solid #e5e5e5;
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 12.5px;
  font-weight: 500;
  color: #555;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  color: #777;
  font-size: 13px;
}

.date-mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px;
  color: #888;
  white-space: nowrap;
  background: #f4f4f0;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
}

.thumb {
  width: 48px; height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  cursor: zoom-in;
  transition: transform .18s, box-shadow .18s;
}
.thumb:hover { transform: scale(1.08); box-shadow: 0 6px 18px rgba(0,0,0,.14) }

/* Action buttons */
.act-btn {
  width: 32px; height: 32px;
  border-radius: 7px;
  border: 1.5px solid;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all .14s;
}
.act-btn svg { width: 14px; height: 14px }
.act-btn--view { background: #eff6ff; border-color: #bfdbfe; color: #2563eb }
.act-btn--view:hover { background: #dbeafe; transform: translateY(-1px) }
.act-btn--dl { background: #f0fdf4; border-color: #bbf7d0; color: #15803d }
.act-btn--dl:hover { background: #dcfce7; transform: translateY(-1px) }

/* ── Pagination ── */
.eu-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
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
  cursor: pointer; color: #555;
  transition: background .12s, border-color .12s;
}
.pag-btn svg { width: 14px; height: 14px }
.pag-btn:hover:not(:disabled) { background: #f0f0ee; border-color: #aaa }
.pag-btn:disabled { opacity: .4; cursor: not-allowed }
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
.pag-num:hover { background: #f0f0ee; color: #111 }
.pag-num--active { background: #111; color: #fff; border-color: #111 }
.pag-ellipsis { cursor: default; color: #ccc }

/* ── States ── */
.state-panel {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
}
.state-panel--empty { border-style: dashed }

.state-gfx {
  width: 72px; height: 72px;
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.state-gfx svg { width: 32px; height: 32px }
.state-gfx--blue { background: #eff6ff; color: #2563eb }
.state-gfx--gray { background: #f4f4f0; color: #aaa }

.state-title { font-size: 17px; font-weight: 700; color: #222 }
.state-body { font-size: 13.5px; color: #aaa; max-width: 380px; line-height: 1.6 }
.state-body strong { color: #333 }

.hint-strip { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 4px }
.hint-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: #f4f4f0;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 12.5px;
  color: #777;
}
.hint-chip svg { width: 13px; height: 13px; flex-shrink: 0; opacity: .65 }
.hint-chip strong { color: #333 }

.state-cta { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center }

.date-code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  background: #f4f4f0;
  border: 1px solid #e5e5e5;
  color: #333;
  padding: 2px 7px;
  border-radius: 5px;
}

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.eu-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 92vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 80px rgba(0,0,0,.3);
}

.modal-hd {
  background: #0f1117;
  padding: 20px 24px;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}
.modal-hd-left { display: flex; align-items: center; gap: 13px }
.modal-hd-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.modal-hd-icon svg { width: 20px; height: 20px; color: #60a5fa }
.modal-hd-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #555; margin-bottom: 3px }
.modal-hd-title { font-size: 15px; font-weight: 700; color: #fff }
.modal-close {
  background: none; border: none; color: #555; cursor: pointer;
  padding: 6px; border-radius: 6px; display: flex; align-items: center;
  transition: color .14s, background .14s;
}
.modal-close:hover { color: #fff; background: rgba(255,255,255,.1) }
.modal-close svg { width: 18px; height: 18px }

.modal-bd {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.modal-emp-row { display: flex; align-items: center; gap: 14px }
.modal-emp-name { font-size: 16px; font-weight: 700; color: #111; margin-bottom: 3px }
.modal-emp-date { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #aaa }

.modal-section { display: flex; flex-direction: column; gap: 8px }
.modal-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: #bbb;
}
.modal-section-body {
  background: #f4f4f0;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  padding: 14px 16px;
  font-size: 13.5px;
  line-height: 1.65;
  color: #444;
  white-space: pre-wrap;
}

.modal-photo-wrap {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: zoom-in;
  border: 1px solid #e5e5e5;
}
.modal-photo { width: 100%; height: 220px; object-fit: cover; display: block }
.modal-photo-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.4);
  color: #fff;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 13px; font-weight: 600;
  opacity: 0; transition: opacity .18s;
}
.modal-photo-wrap:hover .modal-photo-overlay { opacity: 1 }
.modal-photo-overlay svg { width: 18px; height: 18px }

.modal-ft {
  padding: 16px 28px;
  border-top: 1px solid #f0f0ee;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

/* ── Lightbox ── */
.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.92);
  display: flex; align-items: center; justify-content: center;
  z-index: 1100; padding: 40px;
}
.lightbox-img {
  max-width: 96%; max-height: 94vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 30px 80px rgba(0,0,0,.6);
}
.lightbox-close {
  position: absolute; top: 20px; right: 20px;
  width: 44px; height: 44px;
  border-radius: 11px;
  background: rgba(255,255,255,.12);
  border: none; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px); transition: background .14s;
}
.lightbox-close:hover { background: rgba(255,255,255,.25) }
.lightbox-close svg { width: 20px; height: 20px }

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all .22s ease }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(.97) }
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }

@keyframes spin { to { transform: rotate(360deg) } }
.spin { animation: spin .7s linear infinite }

/* Responsive */
@media (max-width: 900px) {
  .eu-shell { padding: 24px 20px }
  .filter-row { flex-direction: column; align-items: stretch }
  .filter-actions { justify-content: flex-start }
}
@media (max-width: 600px) {
  .filter-fields { flex-direction: column }
  .ffield-arrow { display: none }
  .eu-pagination { flex-direction: column; align-items: center }
}
</style>