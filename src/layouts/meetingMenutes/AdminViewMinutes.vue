<template>
  <div class="view-minutes-container">
    <div class="page-header">
      <h2 class="page-title">HR Meeting Minutes</h2>
      <p class="page-subtitle">View and manage meeting minutes</p>
    </div>

    <div class="controls-section">
      <div class="filters-section">
        <div class="filter-group">
          <label for="date_filter" class="filter-label">
            <i class="fas fa-calendar-alt"></i> Date
          </label>
          <input
            type="date"
            id="date_filter"
            v-model="filters.date"
            class="filter-input"
            @change="fetchMinutes"
          />
        </div>

        <div class="filter-group">
          <label for="search_filter" class="filter-label">
            <i class="fas fa-search"></i> Search
          </label>
          <input
            type="text"
            id="search_filter"
            v-model="filters.search"
            class="filter-input"
            placeholder="Title, attendees..."
            @input="debouncedFetchMinutes"
          />
        </div>
      </div>

      <div class="export-buttons">
        <button class="btn btn-export pdf" @click="exportToPDF">
          <i class="fas fa-file-pdf"></i> Export PDF
        </button>
        <button class="btn btn-export excel" @click="exportToExcel">
          <i class="fas fa-file-excel"></i> Export Excel
        </button>
      </div>
    </div>

    <div class="table-container" v-if="!isLoading">
      <div v-if="paginatedMinutes.length === 0" class="empty-state">
        <i class="fas fa-file-alt"></i>
        <p>No meeting minutes found.</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="minutes-table">
          <thead>
            <tr>
              <th @click="sortByColumn('meeting_title')" class="sortable">
                Title <i :class="sortIcon('meeting_title')"></i>
              </th>
              <th @click="sortByColumn('meeting_date')" class="sortable">
                Date <i :class="sortIcon('meeting_date')"></i>
              </th>
              <th>Attendees</th>
              <th>Agenda</th>
              <th>Decisions</th>
              <th>Next Meeting</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="minute in paginatedMinutes" :key="minute.minutes_id" class="table-row">
              <td class="title">
                <strong>{{ minute.meeting_title || 'Untitled' }}</strong>
              </td>
              <td class="date">
                {{ formatDate(minute.meeting_date) || '-' }}
              </td>
              <td class="attendees">
                <button
                  class="attendees-btn"
                  @click="openAttendeesModal(minute)"
                  :title="`View ${getAttendeesList(minute.attendees).length} attendee(s)`"
                >
                  <svg class="attendees-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="attendees-btn-count">{{ getAttendeesList(minute.attendees).length }}</span>
                  <span class="attendees-btn-label">Attendee{{ getAttendeesList(minute.attendees).length !== 1 ? 's' : '' }}</span>
                  <svg class="attendees-btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </td>
              <td class="text-cell">
                <div class="truncated" :title="minute.agenda">{{ minute.agenda || '-' }}</div>
              </td>
              <td class="text-cell">
                <div class="truncated" :title="minute.decisions">{{ minute.decisions || '-' }}</div>
              </td>
              <td class="text-cell">
                <div class="truncated" :title="minute.next_meeting">{{ minute.next_meeting || '-' }}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination" v-if="totalPages > 1">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <i :class="toastIcon"></i>
      <span>{{ toast.message }}</span>
      <button class="toast-close" @click="hideToast">×</button>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ selectedMinute.meeting_title || 'Untitled' }}</h3>
        <div class="modal-body">
          <p><strong>Date:</strong> {{ formatDate(selectedMinute.meeting_date) || '-' }}</p>
          <p><strong>Attendees:</strong></p>
          <ul>
            <li v-for="(attendee, i) in getAttendeesList(selectedMinute.attendees)" :key="i">{{ attendee }}</li>
          </ul>
          <p><strong>Agenda:</strong> {{ selectedMinute.agenda || '-' }}</p>
          <p><strong>Discussion:</strong> {{ selectedMinute.discussion || '-' }}</p>
          <p><strong>Decisions:</strong> {{ selectedMinute.decisions || '-' }}</p>
          <p><strong>Next Meeting:</strong> {{ selectedMinute.next_meeting || '-' }}</p>
        </div>
        <button class="btn btn-close" @click="closeViewModal">Close</button>
      </div>
    </div>

    <!-- ══ ATTENDEES MODAL ══ -->
    <div v-if="showAttendeesModal" class="modal-overlay" @mousedown.self="closeAttendeesModal">
      <div class="attendees-modal" @mousedown.stop>

        <!-- Header -->
        <div class="am-header">
          <div class="am-header-left">
            <div class="am-header-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="am-title">Meeting Attendees</h3>
              <p class="am-subtitle">{{ activeMinute?.meeting_title || 'Untitled' }} · {{ formatDate(activeMinute?.meeting_date) }}</p>
            </div>
          </div>
          <button class="am-close" @click="closeAttendeesModal">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Count badge -->
        <div class="am-count-bar">
          <span class="am-count-badge">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:13px;height:13px">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ activeAttendees.length }} {{ activeAttendees.length === 1 ? 'person' : 'people' }} attended
          </span>
        </div>

        <!-- Attendees list -->
        <div class="am-body">
          <div v-if="activeAttendees.length === 0" class="am-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p>No attendees recorded for this meeting.</p>
          </div>
          <ul v-else class="am-list">
            <li v-for="(attendee, i) in activeAttendees" :key="i" class="am-item">
              <div class="am-avatar">{{ getInitial(attendee) }}</div>
              <span class="am-name">{{ attendee }}</span>
              <span class="am-number">#{{ i + 1 }}</span>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="am-footer">
          <button class="am-footer-btn" @click="closeAttendeesModal">Close</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { debounce } from 'lodash'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const minutes     = ref([])
const isLoading   = ref(true)
const toast       = ref({ show: false, message: '', type: 'success' })

const filters = ref({ date: '', search: '' })

const sortBy      = ref('meeting_date')
const sortDesc    = ref(true)
const currentPage = ref(1)
const itemsPerPage = 10

const showViewModal      = ref(false)
const selectedMinute     = ref({})

// Attendees modal state
const showAttendeesModal = ref(false)
const activeMinute       = ref(null)
const activeAttendees    = computed(() =>
  activeMinute.value ? getAttendeesList(activeMinute.value.attendees) : []
)

function openAttendeesModal(minute) {
  activeMinute.value = minute
  showAttendeesModal.value = true
}
function closeAttendeesModal() {
  showAttendeesModal.value = false
  activeMinute.value = null
}

function getInitial(name) {
  if (!name) return '?'
  return name.trim()[0].toUpperCase()
}

const fetchMinutes = async () => {
  isLoading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.date)   params.append('date', filters.value.date)
    if (filters.value.search) params.append('search', filters.value.search)
    const response = await axios.get(`/api/meeting-minutes?${params}`)
    minutes.value = response.data.status === true ? response.data.data || [] : []
  } catch (error) {
    console.error('Error fetching minutes:', error)
    minutes.value = []
  } finally {
    isLoading.value = false
  }
}

const debouncedFetchMinutes = debounce(fetchMinutes, 500)

const sortedMinutes = computed(() => {
  const list = [...minutes.value]
  return list.sort((a, b) => {
    let valA = a[sortBy.value]
    let valB = b[sortBy.value]
    if (sortBy.value === 'meeting_date') {
      valA = valA ? new Date(valA) : null
      valB = valB ? new Date(valB) : null
    }
    if (valA === null) return 1
    if (valB === null) return -1
    if (valA < valB) return sortDesc.value ? 1 : -1
    if (valA > valB) return sortDesc.value ? -1 : 1
    return 0
  })
})

const sortByColumn = (column) => {
  if (sortBy.value === column) sortDesc.value = !sortDesc.value
  else { sortBy.value = column; sortDesc.value = false }
}

const sortIcon = (column) => {
  if (sortBy.value !== column) return 'fas fa-sort'
  return sortDesc.value ? 'fas fa-sort-down' : 'fas fa-sort-up'
}

const totalPages     = computed(() => Math.ceil(sortedMinutes.value.length / itemsPerPage) || 1)
const paginatedMinutes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedMinutes.value.slice(start, start + itemsPerPage)
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getAttendeesList = (str) =>
  str ? str.split('\n').map(s => s.trim()).filter(Boolean) : []

const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(hideToast, 3500)
}
const hideToast = () => { toast.value.show = false }

const toastIcon = computed(() => {
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
  return icons[toast.value.type] || 'fas fa-info-circle'
})

const viewMinute     = (minute) => { selectedMinute.value = { ...minute }; showViewModal.value = true }
const closeViewModal = () => { showViewModal.value = false }

const exportToPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(16)
  doc.text('HR Meeting Minutes', 14, 20)
  autoTable(doc, {
    head: [['Title', 'Date', 'Attendees', 'Agenda', 'Decisions', 'Next Meeting']],
    body: sortedMinutes.value.map(m => [
      m.meeting_title || 'Untitled',
      formatDate(m.meeting_date) || '-',
      getAttendeesList(m.attendees).join(', '),
      m.agenda || '-',
      m.decisions || '-',
      m.next_meeting || '-'
    ]),
    startY: 30,
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0:{cellWidth:45}, 1:{cellWidth:28}, 2:{cellWidth:55}, 3:{cellWidth:60}, 4:{cellWidth:60}, 5:{cellWidth:45} },
    margin: { top: 30, left: 14, right: 14, bottom: 20 }
  })
  doc.save('hr-meeting-minutes.pdf')
  showToast('PDF exported successfully', 'success')
}

const exportToExcel = () => {
  const data = sortedMinutes.value.map(m => ({
    Title: m.meeting_title || 'Untitled',
    Date: formatDate(m.meeting_date) || '-',
    Attendees: getAttendeesList(m.attendees).join(', '),
    Agenda: m.agenda || '-',
    Decisions: m.decisions || '-',
    'Next Meeting': m.next_meeting || '-'
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Meeting Minutes')
  XLSX.writeFile(wb, 'hr-meeting-minutes.xlsx')
  showToast('Excel exported successfully', 'success')
}

onMounted(() => { fetchMinutes() })
</script>

<style scoped>
.view-minutes-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filters-section {
  display: flex;
  gap: 1.25rem;
  flex: 1;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 220px;
}

.filter-label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}

.filter-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.export-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-export {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-export.pdf { background: #dc2626; }
.btn-export.pdf:hover { background: #b91c1c; }
.btn-export.excel { background: #15803d; }
.btn-export.excel:hover { background: #166534; }

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-wrapper { overflow-x: auto; }

.minutes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.minutes-table th,
.minutes-table td {
  padding: 1rem 1.1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.minutes-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.4px;
}

.sortable { cursor: pointer; user-select: none; }
.sortable i { margin-left: 0.5rem; font-size: 0.85rem; color: #94a3b8; }

.minutes-table td { color: #475569; vertical-align: middle; }
.table-row:nth-child(even) { background: #f9fafb; }
.table-row:hover { background: #f1f5f9; }
.title strong { color: #1e293b; }
.date { color: #64748b; white-space: nowrap; }

/* ── Attendees button ── */
.attendees-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px 7px 10px;
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  border-radius: 8px;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s, border-color .15s, box-shadow .15s, transform .1s;
  white-space: nowrap;
  font-family: inherit;
}

.attendees-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  box-shadow: 0 2px 8px rgba(59, 130, 246, .18);
  transform: translateY(-1px);
}

.attendees-btn:active { transform: translateY(0); }

.attendees-btn-icon { width: 15px; height: 15px; flex-shrink: 0; }
.attendees-btn-arrow { width: 12px; height: 12px; flex-shrink: 0; opacity: .6; }

.attendees-btn-count {
  background: #2563eb;
  color: #fff;
  border-radius: 20px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.6;
}

.attendees-btn-label { font-size: 12.5px; }

/* Text cells */
.text-cell .truncated {
  max-height: 3.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: help;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.pagination-btn:hover:not(:disabled) { background: #e2e8f0; }
.pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination-info { color: #64748b; font-size: 0.9rem; }

.empty-state, .loading-state {
  text-align: center;
  padding: 5rem 1rem;
  color: #64748b;
}

.empty-state i, .loading-state i {
  font-size: 3.5rem;
  opacity: 0.4;
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 1000;
  border-left: 4px solid;
}

.toast.success { border-left-color: #10b981; }
.toast.error   { border-left-color: #ef4444; }

/* View Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,.2);
}

.modal-title { font-size: 1.5rem; margin-bottom: 1.5rem; color: #1e293b; }
.modal-body p { margin-bottom: 1rem; color: #475569; }
.modal-body ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }

.btn { padding: 0.45rem 0.8rem; border: none; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; }
.btn-close { background: #6b7280; color: white; width: 100%; margin-top: 1.5rem; padding: 0.75rem; }
.btn-close:hover { background: #4b5563; }

/* ══ ATTENDEES MODAL ══ */
.attendees-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,.25);
  overflow: hidden;
}

/* Header */
.am-header {
  background: #0f172a;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.am-header-left { display: flex; align-items: center; gap: 13px; }

.am-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255,255,255,.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.am-header-icon svg { width: 20px; height: 20px; color: #60a5fa; }

.am-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.am-subtitle { font-size: 12px; color: #64748b; }

.am-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color .15s, background .15s;
  flex-shrink: 0;
}
.am-close:hover { color: #fff; background: rgba(255,255,255,.1); }
.am-close svg { width: 18px; height: 18px; }

/* Count bar */
.am-count-bar {
  padding: 12px 22px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.am-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

/* Body / list */
.am-body { flex: 1; overflow-y: auto; padding: 16px 20px; }

.am-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #94a3b8;
  gap: 12px;
  text-align: center;
}
.am-empty svg { width: 44px; height: 44px; opacity: .4; }
.am-empty p { font-size: 14px; }

.am-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }

.am-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: background .12s, border-color .12s;
}

.am-item:hover { background: #eff6ff; border-color: #bfdbfe; }

.am-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.am-name { flex: 1; font-size: 13.5px; font-weight: 500; color: #1e293b; }

.am-number {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 7px;
  border-radius: 5px;
}

/* Footer */
.am-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.am-footer-btn {
  padding: 9px 22px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
  font-family: inherit;
}
.am-footer-btn:hover { background: #1e293b; }

@media (max-width: 1024px) {
  .controls-section { flex-direction: column; align-items: stretch; }
}
</style>