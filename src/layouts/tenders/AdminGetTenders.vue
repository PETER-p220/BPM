<template>
  <div class="tenders-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-file-contract"></i>
            Registered Tenders
          </h1>
          <p class="page-subtitle">View and manage all registered tenders</p>
        </div>
        <div class="header-right">
          <button @click="exportToCSV" class="btn btn-csv" :disabled="filteredTenders.length === 0">
            <i class="fas fa-file-csv"></i>
            <span>Export to CSV</span>
          </button>
          <button @click="exportToPDF" class="btn btn-export" :disabled="filteredTenders.length === 0">
            <i class="fas fa-file-pdf"></i>
            <span>Export to PDF</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="filter"
          type="search"
          placeholder="Search by title, number, entity..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <div class="table-wrapper">
        <table class="tenders-table">
          <thead>
            <tr>
              <th class="th-no">No</th>
              <th class="th-title">Title</th>
              <th class="th-source">Source</th>
              <th class="th-type">Type</th>
              <th class="th-number">Tender No.</th>
              <th class="th-entity">Entity</th>
              <th class="th-file">File</th>
              <th class="th-published">Published</th>
              <th class="th-submission">Submission</th>
              <th class="th-expires">Expires</th>
              <th class="th-created">Created</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tender, index) in paginatedTenders"
              :key="tender.tender_id"
              class="table-row"
            >
              <td class="td-no">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="td-title" :title="tender.title">{{ tender.title || '—' }}</td>
              <td class="td-source">{{ tender.tender_source || 'N/A' }}</td>
              <td class="td-type">{{ tender.tender_type || '—' }}</td>
              <td class="td-number">{{ tender.tender_number || '—' }}</td>
              <td class="td-entity" :title="tender.procurement_entity">{{ tender.procurement_entity || '—' }}</td>
              <td class="td-file">
                <button
                  v-if="tender.attachment"
                  @click="downloadTenderPdf(tender.attachment)"
                  class="file-btn"
                  title="Download tender document"
                >
                  <i class="fas fa-file-pdf"></i>
                  <span>PDF</span>
                </button>
                <span v-else class="no-file">No file</span>
              </td>
              <td class="td-published">{{ formatDate(tender.date_of_Publication) || '—' }}</td>
              <td class="td-submission">{{ formatDate(tender.bid_submission) || '—' }}</td>
              <td class="td-expires">
                <span class="expiry-badge" :class="getExpirationClass(tender.expired_at)">
                  {{ formatDate(tender.expired_at) || 'N/A' }}
                </span>
              </td>
              <td class="td-created">{{ formatDate(tender.created_at) || '—' }}</td>
              <td class="td-actions">
                <div class="action-buttons">
                  <button
                    @click="editTender(tender.tender_id)"
                    class="action-btn btn-view"
                    title="View / Edit tender"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="tender.attachment"
                    @click="downloadTenderPdf(tender.attachment)"
                    class="action-btn btn-download"
                    title="Download attachment"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Loading / Empty state -->
            <tr v-if="loading || paginatedTenders.length === 0" class="empty-row">
              <td colspan="12">
                <div class="empty-state">
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-folder-open"></i>
                  <p class="empty-title">
                    {{ loading ? 'Loading tenders...' : 'No tenders found' }}
                  </p>
                  <p class="empty-subtitle" v-if="!loading">
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
    <div v-if="filteredTenders.length > 0" class="pagination-section">
      <div class="pagination-info">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }}–
        {{ Math.min(currentPage * itemsPerPage, filteredTenders.length) }} of {{ filteredTenders.length }}
      </div>

      <div class="pagination-controls">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i>
          Previous
        </button>
        <span class="page-number">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
          class="pagination-btn"
        >
          Next
          <i class="fas fa-chevron-right"></i>
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
import jsPDF from 'jspdf'

const router = useRouter()
const toast = useToast()

const tenders = ref([])
const filter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

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

const totalPages = computed(() => Math.ceil(filteredTenders.value.length / itemsPerPage))

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function getExpirationClass(expiredAt) {
  if (!expiredAt) return 'expired-unknown'
  const now = new Date()
  const exp = new Date(expiredAt)
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'expired-past'
  if (diffDays <= 3) return 'expired-critical'
  if (diffDays <= 7) return 'expired-warning'
  return 'expired-safe'
}

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
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// CSV Export Function (simpler alternative, no library needed)
function exportToCSV() {
  try {
    // Prepare CSV headers
    const headers = ['No', 'Title', 'Source', 'Type', 'Tender No.', 'Entity', 'Published', 'Submission', 'Expires', 'Created']
    
    // Prepare CSV rows
    const rows = filteredTenders.value.map((tender, index) => [
      index + 1,
      `"${(tender.title || '—').replace(/"/g, '""')}"`,
      `"${(tender.tender_source || 'N/A').replace(/"/g, '""')}"`,
      `"${(tender.tender_type || '—').replace(/"/g, '""')}"`,
      `"${(tender.tender_number || '—').replace(/"/g, '""')}"`,
      `"${(tender.procurement_entity || '—').replace(/"/g, '""')}"`,
      formatDate(tender.date_of_Publication) || '—',
      formatDate(tender.bid_submission) || '—',
      formatDate(tender.expired_at) || 'N/A',
      formatDate(tender.created_at) || '—'
    ])
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const filename = `tenders-report-${new Date().toISOString().split('T')[0]}.csv`
    saveAs(blob, filename)
    
    toast.success('CSV exported successfully!')
  } catch (error) {
    console.error('CSV export error:', error)
    toast.error('Failed to export CSV')
  }
}

// PDF Export Function
async function exportToPDF() {
  try {
    // Dynamically import jspdf-autotable
    const { default: autoTable } = await import('jspdf-autotable')
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    // Add title
    doc.setFontSize(18)
    doc.setTextColor(15, 23, 42)
    doc.text('Registered Tenders Report', 14, 15)
    
    // Add metadata
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 14, 22)
    doc.text(`Total Tenders: ${filteredTenders.value.length}`, 14, 27)
    
    // Prepare table data - use all filtered tenders for export, not paginated
    const tableData = filteredTenders.value.map((tender, index) => [
      index + 1,
      tender.title || '—',
      tender.tender_source || 'N/A',
      tender.tender_type || '—',
      tender.tender_number || '—',
      tender.procurement_entity || '—',
      formatDate(tender.date_of_Publication) || '—',
      formatDate(tender.bid_submission) || '—',
      formatDate(tender.expired_at) || 'N/A',
      formatDate(tender.created_at) || '—'
    ])
    
    // Add table using autoTable
    autoTable(doc, {
      startY: 32,
      head: [['No', 'Title', 'Source', 'Type', 'Tender No.', 'Entity', 'Published', 'Submission', 'Expires', 'Created']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85],
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 50 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 45 },
        6: { cellWidth: 22 },
        7: { cellWidth: 22 },
        8: { cellWidth: 22 },
        9: { cellWidth: 22 }
      },
      margin: { left: 14, right: 14 },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184)
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        )
      }
    })
    
    // Save the PDF
    doc.save(`tenders-report-${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF exported successfully!')
  } catch (error) {
    console.error('PDF export error:', error)
    toast.error('Failed to export PDF. Error: ' + error.message)
  }
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

<style scoped>
.tenders-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  color: #3b82f6;
  font-size: 1.75rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.9375rem;
  margin: 0;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-csv {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-csv:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.btn-export {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.btn-export:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.search-wrapper {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.875rem;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.tenders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.tenders-table thead {
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tenders-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.th-no {
  width: 60px;
  text-align: center;
}

.th-title {
  min-width: 250px;
}

.th-source, .th-type {
  min-width: 100px;
}

.th-number {
  min-width: 120px;
}

.th-entity {
  min-width: 200px;
}

.th-file {
  min-width: 100px;
  text-align: center;
}

.th-published, .th-submission, .th-expires, .th-created {
  min-width: 110px;
}

.th-actions {
  width: 100px;
  text-align: center;
}

.tenders-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.tenders-table tbody tr:hover {
  background: #f8fafc;
}

.tenders-table td {
  padding: 0.875rem 1rem;
  color: #475569;
}

.td-no {
  text-align: center;
  font-weight: 600;
  color: #1e293b;
}

.td-title {
  font-weight: 500;
  color: #1e293b;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.td-entity {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.td-file {
  text-align: center;
}

.file-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.no-file {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.75rem;
}

.expiry-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;
}

.expired-past {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  border: 1px solid #ef4444;
}

.expired-critical {
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  color: #9a3412;
  border: 1px solid #f97316;
}

.expired-warning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border: 1px solid #fbbf24;
}

.expired-safe {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: 1px solid #10b981;
}

.expired-unknown {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  color: #374151;
  border: 1px solid #9ca3af;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.625rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-view {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.btn-view:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-download {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-download:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

/* Empty State */
.empty-row td {
  padding: 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state i.fa-spinner {
  color: #3b82f6;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Scrollbar */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .tenders-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-section {
    flex-direction: column;
  }
}
</style>