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
                Title
                <i :class="sortIcon('meeting_title')"></i>
              </th>
              <th @click="sortByColumn('meeting_date')" class="sortable">
                Date
                <i :class="sortIcon('meeting_date')"></i>
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
                <div class="attendees-list">
                  <span
                    v-for="(attendee, i) in getAttendeesList(minute.attendees)"
                    :key="i"
                    class="attendee-tag"
                  >
                    {{ attendee }}
                  </span>
                </div>
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
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1" 
            @click="currentPage--"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages" 
            @click="currentPage++"
          >
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
            <li v-for="(attendee, i) in getAttendeesList(selectedMinute.attendees)" :key="i">
              {{ attendee }}
            </li>
          </ul>
          <p><strong>Agenda:</strong> {{ selectedMinute.agenda || '-' }}</p>
          <p><strong>Discussion:</strong> {{ selectedMinute.discussion || '-' }}</p>
          <p><strong>Decisions:</strong> {{ selectedMinute.decisions || '-' }}</p>
          <p><strong>Next Meeting:</strong> {{ selectedMinute.next_meeting || '-' }}</p>
        </div>
        <button class="btn btn-close" @click="closeViewModal">Close</button>
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

const minutes = ref([])
const isLoading = ref(true)
const toast = ref({ show: false, message: '', type: 'success' })

const filters = ref({
  date: '',
  search: ''
})

const sortBy = ref('meeting_date')
const sortDesc = ref(true)
const currentPage = ref(1)
const itemsPerPage = 10

const showViewModal = ref(false)
const selectedMinute = ref({})

const fetchMinutes = async () => {
  isLoading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.date) params.append('date', filters.value.date)
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
  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value
  } else {
    sortBy.value = column
    sortDesc.value = false
  }
}

const sortIcon = (column) => {
  if (sortBy.value !== column) return 'fas fa-sort'
  return sortDesc.value ? 'fas fa-sort-down' : 'fas fa-sort-up'
}

const totalPages = computed(() => Math.ceil(sortedMinutes.value.length / itemsPerPage) || 1)

const paginatedMinutes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedMinutes.value.slice(start, start + itemsPerPage)
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getAttendeesList = (str) => {
  return str ? str.split('\n').map(s => s.trim()).filter(Boolean) : []
}

const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(hideToast, 3500)
}

const hideToast = () => {
  toast.value.show = false
}

const toastIcon = computed(() => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle'
  }
  return icons[toast.value.type] || 'fas fa-info-circle'
})

const viewMinute = (minute) => {
  selectedMinute.value = { ...minute }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
}

const editMinute = (minute) => {
  showToast('Edit functionality coming soon!', 'info')
  // TODO: Implement edit modal and API call
}

const deleteMinute = async (id) => {
  if (confirm('Are you sure you want to delete this meeting minute? This action cannot be undone.')) {
    try {
      await axios.delete(`/api/meeting-minutes/${id}`)
      minutes.value = minutes.value.filter(m => m.minutes_id !== id)
      showToast('Meeting minute deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting minute:', error)
      showToast('Failed to delete meeting minute', 'error')
    }
  }
}

const exportToPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape' })

  doc.setFontSize(16)
  doc.text('HR Meeting Minutes', 14, 20)

  const tableData = sortedMinutes.value.map(minute => [
    minute.meeting_title || 'Untitled',
    formatDate(minute.meeting_date) || '-',
    getAttendeesList(minute.attendees).join(', '),
    minute.agenda || '-',
    minute.decisions || '-',
    minute.next_meeting || '-'
  ])

  autoTable(doc, {
    head: [['Title', 'Date', 'Attendees', 'Agenda', 'Decisions', 'Next Meeting']],
    body: tableData,
    startY: 30,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left'
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 45 },  // Title
      1: { cellWidth: 28 },  // Date
      2: { cellWidth: 55 },  // Attendees
      3: { cellWidth: 60 },  // Agenda
      4: { cellWidth: 60 },  // Decisions
      5: { cellWidth: 45 }   // Next Meeting
    },
    margin: { top: 30, left: 14, right: 14, bottom: 20 }
  })

  doc.save('hr-meeting-minutes.pdf')
  showToast('PDF exported successfully', 'success')
}

const exportToExcel = () => {
  const data = sortedMinutes.value.map(minute => ({
    Title: minute.meeting_title || 'Untitled',
    Date: formatDate(minute.meeting_date) || '-',
    Attendees: getAttendeesList(minute.attendees).join(', '),
    Agenda: minute.agenda || '-',
    Decisions: minute.decisions || '-',
    'Next Meeting': minute.next_meeting || '-'
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Meeting Minutes')

  XLSX.writeFile(wb, 'hr-meeting-minutes.xlsx')
  showToast('Excel exported successfully', 'success')
}

onMounted(() => {
  fetchMinutes()
})
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
  transition: all 0.15s;
}

.btn-export.pdf {
  background: #dc2626;
}

.btn-export.pdf:hover {
  background: #b91c1c;
}

.btn-export.excel {
  background: #15803d;
}

.btn-export.excel:hover {
  background: #166534;
}

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

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

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable i {
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
}

.minutes-table td {
  color: #475569;
  vertical-align: top;
}

.table-row:nth-child(even) {
  background: #f9fafb;
}

.table-row:hover {
  background: #f1f5f9;
}

.title strong {
  color: #1e293b;
}

.date {
  color: #64748b;
  white-space: nowrap;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.attendee-tag {
  background: #e0f2fe;
  color: #1e40af;
  padding: 0.25rem 0.6rem;
  border-radius: 5px;
  font-size: 0.78rem;
  white-space: nowrap;
}

.text-cell .truncated {
  max-height: 3.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: help;
}

.actions {
  white-space: nowrap;
  display: flex;
  gap: 0.4rem;
}

.btn {
  padding: 0.45rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-view {
  background: #6366f1;
  color: white;
}

.btn-view:hover {
  background: #4f46e5;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

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

.pagination-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #64748b;
  font-size: 0.9rem;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 5rem 1rem;
  color: #64748b;
}

.empty-state i,
.loading-state i {
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

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
.toast.error { border-left-color: #ef4444; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
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
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.modal-body p {
  margin-bottom: 1rem;
  color: #475569;
}

.modal-body ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.btn-close {
  background: #6b7280;
  color: white;
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
}

.btn-close:hover {
  background: #4b5563;
}

@media (max-width: 1024px) {
  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>