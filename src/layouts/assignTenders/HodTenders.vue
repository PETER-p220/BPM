<template>
  <div class="page-wrapper">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Assigned Tenders</h1>
          <p>Manage and track all tender assignments</p>
        </div>
        <div class="header-stats">
          <div class="stat-badge">
            <span class="stat-value">{{ filteredData.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-badge success">
            <span class="stat-value">{{ acceptedCount }}</span>
            <span class="stat-label">Accepted</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input
            type="text"
            v-model="filter"
            placeholder="Search by title, user, or status..."
            class="search-input"
          />
          <span v-if="filter" class="clear-search" @click="filter = ''">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </span>
        </div>
      </div>
      
      <div class="toolbar-right">
        <button @click="exportToExcel" class="export-btn excel">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"/>
          </svg>
          <span>Excel</span>
        </button>
        
        <button @click="exportToPDF" class="export-btn pdf">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"/>
          </svg>
          <span>PDF</span>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-cell">#</th>
              <th class="th-cell">Assigned To</th>
              <th class="th-cell">Tender Details</th>
              <th class="th-cell">Timeline</th>
              <th class="th-cell">Status</th>
              <th class="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignedtender, index) in paginatedData" :key="assignedtender.assign_id" class="table-row">
              <!-- Number -->
              <td class="td-cell">
                <span class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
              </td>
              
              <!-- Assigned To -->
              <td class="td-cell">
                <div class="user-info">
                  <div class="user-avatar">
                    {{ getInitials(assignedtender.user.name) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ assignedtender.user.name }}</div>
                    <div class="user-meta">Assignee</div>
                  </div>
                </div>
              </td>
              
              <!-- Tender Details -->
              <td class="td-cell">
                <div class="tender-info">
                  <div class="tender-title">{{ assignedtender.tender.title }}</div>
                  <div class="tender-meta">
                    <span class="meta-badge">{{ assignedtender.status }}</span>
                  </div>
                </div>
              </td>
              
              <!-- Timeline -->
              <td class="td-cell">
                <div class="timeline-info">
                  <div class="timeline-item">
                    <svg class="timeline-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <div class="timeline-label">Assigned</div>
                      <div class="timeline-date">{{ formatDate(assignedtender.date_of_submission) }}</div>
                    </div>
                  </div>
                  <div class="timeline-item" :class="{ 'expired': isExpired(assignedtender.expire_date) }">
                    <svg class="timeline-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                      <div class="timeline-label">Expires</div>
                      <div class="timeline-date">{{ formatDate(assignedtender.expire_date) }}</div>
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Status -->
              <td class="td-cell">
                <div class="status-wrapper">
                  <span class="status-badge" :class="getStatusClass(assignedtender.recieved_status)">
                    <span class="status-dot"></span>
                    {{ assignedtender.recieved_status }}
                  </span>
                </div>
              </td>
              
              <!-- Actions -->
              <td class="td-cell">
                <div class="action-buttons">
                  <button 
                    @click="downloadTenderPdf(assignedtender.tender.attachment)" 
                    class="action-btn primary"
                    title="Download PDF">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredData.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
          </svg>
          <h3>No tenders found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredData.length > 0" class="pagination">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }} results
        </div>
        <div class="pagination-controls">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Previous
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              :class="['page-btn', { active: currentPage === page }]">
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-btn">
            Next
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const users = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const response = await axios.get('api/hod/tenders');
    users.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function downloadTenderPdf(attachment) {
  try {
    const response = await axios.get(attachment, { responseType: 'blob' });
    const fileBlob = response.data;
    saveAs(fileBlob, 'tender_attachment.pdf');
    toast.success('PDF downloaded successfully');
  } catch (error) {
    handleError(error);
  }
}

const filteredData = computed(() => {
  return users.value.filter(entry =>
    entry.tender.title.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.user.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.status.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.recieved_status.toLowerCase().includes(filter.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

const acceptedCount = computed(() => {
  return users.value.filter(entry => entry.recieved_status.toLowerCase() === 'accepted').length;
});

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function isExpired(dateString) {
  return new Date(dateString) < new Date();
}

function getStatusClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('accepted') || statusLower.includes('approved')) return 'success';
  if (statusLower.includes('pending') || statusLower.includes('waiting')) return 'warning';
  if (statusLower.includes('rejected') || statusLower.includes('declined')) return 'danger';
  return 'default';
}

function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response) {
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.response.statusText;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }

  toast.error(message);
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(entry => ({
    TenderTitle: entry.tender.title,
    UserName: entry.user.name,
    DateOfSubmission: entry.date_of_submission,
    ExpireDate: entry.expire_date,
    Status: entry.status,
    RecievedStatus: entry.recieved_status
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tender Assignments');
  XLSX.writeFile(workbook, 'TenderAssignments.xlsx');
  toast.success('Exported to Excel successfully');
}

function exportToPDF() {
  const doc = new jsPDF();
  const title = "Tender Assignment Data";
  const headers = [['No', 'Tender Title', 'User Name', 'Date of Submission', 'Expire Date', 'Status', 'Received Status']];
  const data = filteredData.value.map((entry, index) => [
    index + 1,
    entry.tender.title,
    entry.user.name,
    entry.date_of_submission,
    entry.expire_date,
    entry.status,
    entry.recieved_status
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(12);
  autoTable(doc, { head: headers, body: data, startY: 30 });

  doc.save('TenderAssignments.pdf');
  toast.success('Exported to PDF successfully');
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-wrapper {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #F8FAFC;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.header-text p {
  font-size: 0.9375rem;
  color: #6B7280;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  text-align: center;
  min-width: 100px;
}

.stat-badge.success {
  background: #ECFDF5;
  border-color: #10B981;
}

.stat-value {
  display: block;
  font-size: 1.875rem;
  font-weight: 800;
  color: #1F2937;
  line-height: 1;
  margin-bottom: 0.375rem;
}

.stat-badge.success .stat-value {
  color: #10B981;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #6B7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.toolbar-left {
  flex: 1;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9CA3AF;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 3rem;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.9375rem;
  color: #1F2937;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9CA3AF;
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-search:hover {
  color: #6B7280;
}

.clear-search svg {
  width: 100%;
  height: 100%;
}

.toolbar-right {
  display: flex;
  gap: 0.75rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: #374151;
}

.export-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.export-btn.excel {
  border-color: #10B981;
  color: #10B981;
}

.export-btn.excel:hover {
  background: #ECFDF5;
}

.export-btn.pdf {
  border-color: #EF4444;
  color: #EF4444;
}

.export-btn.pdf:hover {
  background: #FEF2F2;
}

.export-btn svg {
  width: 18px;
  height: 18px;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.th-cell {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6B7280;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

.table-row {
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #F9FAFB;
}

.td-cell {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #F3F4F6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.row-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #F3F4F6;
  border-radius: 8px;
  font-weight: 600;
  color: #6B7280;
  font-size: 0.8125rem;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-meta {
  font-size: 0.75rem;
  color: #9CA3AF;
}

/* Tender Info */
.tender-info {
  max-width: 300px;
}

.tender-title {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.tender-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: #FEF3C7;
  color: #92400E;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Timeline */
.timeline-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.timeline-item.expired {
  color: #EF4444;
}

.timeline-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #9CA3AF;
}

.timeline-item.expired .timeline-icon {
  color: #EF4444;
}

.timeline-label {
  font-size: 0.75rem;
  color: #6B7280;
  font-weight: 500;
}

.timeline-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.timeline-item.expired .timeline-date {
  color: #EF4444;
}

/* Status Badge */
.status-wrapper {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.status-badge.success {
  background: #ECFDF5;
  color: #10B981;
  border: 1px solid #10B981;
}

.status-badge.warning {
  background: #FEF3C7;
  color: #F59E0B;
  border: 1px solid #F59E0B;
}

.status-badge.danger {
  background: #FEF2F2;
  color: #EF4444;
  border: 1px solid #EF4444;
}

.status-badge.default {
  background: #F3F4F6;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: #374151;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  border-color: #3B82F6;
  color: #3B82F6;
}

.action-btn.primary:hover {
  background: #EFF6FF;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: #D1D5DB;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.875rem;
  color: #9CA3AF;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #F3F4F6;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6B7280;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 16px;
  height: 16px;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.page-btn.active {
  background: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

/* Responsive */
@media (max-width: 1024px) {
  .page-wrapper {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    max-width: 100%;
  }

  .toolbar-right {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .header-stats {
    width: 100%;
  }

  .stat-badge {
    flex: 1;
  }

  .data-table {
    font-size: 0.8125rem;
  }

  .th-cell,
  .td-cell {
    padding: 0.875rem 1rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .page-numbers {
    order: -1;
  }
}
</style>