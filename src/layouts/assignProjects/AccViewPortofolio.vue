<template>
  <div class="engineers-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Engineers & Projects</h1>
          <p class="page-subtitle">Overview of project assignments and performance metrics</p>
        </div>
        
        <div class="header-actions">
          <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              v-model="filter"
              placeholder="Search by name or email..."
              class="search-input"
            />
          </div>
          
          <div class="export-buttons">
            <button
              v-if="filteredUsers.length"
              @click="exportToExcel"
              class="btn-export btn-excel"
            >
              <i class="fas fa-file-excel"></i>
              <span>Excel</span>
            </button>
            <button
              v-if="filteredUsers.length"
              @click="exportToPDF"
              class="btn-export btn-pdf"
            >
              <i class="fas fa-file-pdf"></i>
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Engineers</p>
          <p class="stat-value">{{ filteredUsers.length }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: red;">
          <i class="fas fa-project-diagram"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Projects</p>
          <p class="stat-value">{{ totalProjects }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #f59e0b;">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">In Progress</p>
          <p class="stat-value">{{ totalInProgress }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: green;">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Completed</p>
          <p class="stat-value">{{ totalCompleted }}</p>
        </div>
      </div>
    </div>

    <!-- Engineers List -->
    <div class="engineers-container">
      <div
        v-for="user in paginatedUsers"
        :key="user.user_id"
        @click="openModal(user)"
        class="engineer-card"
      >
        <div class="engineer-header">
          <div class="engineer-avatar">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="engineer-info">
            <h3 class="engineer-name">{{ user.name || 'N/A' }}</h3>
            <p class="engineer-email">{{ user.email || 'N/A' }}</p>
          </div>
          <div class="engineer-badge">
            <span class="badge" :class="getBadgeClass(user.status)">
              {{ user.status || 'N/A' }}
            </span>
          </div>
        </div>
        
        <div class="engineer-stats">
          <div class="mini-stat">
            <i class="fas fa-folder-open"></i>
            <div>
              <p class="mini-stat-value">{{ user.total_projects || 0 }}</p>
              <p class="mini-stat-label">Total</p>
            </div>
          </div>
          
          <div class="mini-stat">
            <i class="fas fa-spinner" style="color: #3b82f6;"></i>
            <div>
              <p class="mini-stat-value">{{ user.on_progress_projects || 0 }}</p>
              <p class="mini-stat-label">Active</p>
            </div>
          </div>
          
          <div class="mini-stat">
            <i class="fas fa-check" style="color: #10b981;"></i>
            <div>
              <p class="mini-stat-value">{{ user.completed_projects || 0 }}</p>
              <p class="mini-stat-label">Done</p>
            </div>
          </div>
          
          <div class="mini-stat">
            <i class="fas fa-times" style="color: #ef4444;"></i>
            <div>
              <p class="mini-stat-value">{{ user.failed_projects || 0 }}</p>
              <p class="mini-stat-label">Failed</p>
            </div>
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-label">
            <span>Completion Rate</span>
            <span class="progress-percentage">{{ getCompletionRate(user) }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: getCompletionRate(user) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredUsers.length" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="pagination-btn"
      >
        <i class="fas fa-chevron-left"></i>
        Previous
      </button>
      
      <div class="pagination-info">
        <span class="current-page">Page {{ currentPage }}</span>
        <span class="total-pages">of {{ totalPages }}</span>
      </div>
      
      <button
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
        class="pagination-btn"
      >
        Next
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div
        v-if="selectedUser"
        class="modal-overlay"
        @click="closeModal"
      >
        <div
          class="modal-container"
          @click.stop
        >
          <div class="modal-header">
            <div class="modal-title-section">
              <h2 class="modal-title">Engineer Details</h2>
              <p class="modal-subtitle">Comprehensive project overview and performance metrics</p>
            </div>
            <button @click="closeModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-content">
            <!-- Engineer Profile -->
            <div class="profile-section">
              <div class="profile-header">
                <div class="profile-avatar-large">
                  <i class="fas fa-user-tie"></i>
                </div>
                <div class="profile-details">
                  <h3>{{ selectedUser.name || 'N/A' }}</h3>
                  <p class="profile-email">{{ selectedUser.email || 'N/A' }}</p>
                  <div class="profile-meta">
                    <span class="meta-item">
                      <i class="fas fa-briefcase"></i>
                      {{ selectedUser.role || 'N/A' }}
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-building"></i>
                      {{ selectedUser.department || 'N/A' }}
                    </span>
                    <span class="badge" :class="getBadgeClass(selectedUser.status)">
                      {{ selectedUser.status || 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Performance Stats -->
              <div class="performance-grid">
                <div class="perf-card total">
                  <i class="fas fa-project-diagram"></i>
                  <div>
                    <p class="perf-value">{{ selectedUser.total_projects || 0 }}</p>
                    <p class="perf-label">Total Projects</p>
                  </div>
                </div>
                
                <div class="perf-card progress">
                  <i class="fas fa-spinner"></i>
                  <div>
                    <p class="perf-value">{{ selectedUser.on_progress_projects || 0 }}</p>
                    <p class="perf-label">In Progress</p>
                  </div>
                </div>
                
                <div class="perf-card completed">
                  <i class="fas fa-check-circle"></i>
                  <div>
                    <p class="perf-value">{{ selectedUser.completed_projects || 0 }}</p>
                    <p class="perf-label">Completed</p>
                  </div>
                </div>
                
                <div class="perf-card failed">
                  <i class="fas fa-times-circle"></i>
                  <div>
                    <p class="perf-value">{{ selectedUser.failed_projects || 0 }}</p>
                    <p class="perf-label">Failed</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects List -->
            <div class="projects-section">
              <h3 class="section-title">
                <i class="fas fa-folder-open"></i>
                Assigned Projects
              </h3>
              
              <div v-if="selectedUser.projects && selectedUser.projects.length" class="projects-list">
                <div
                  v-for="project in selectedUser.projects"
                  :key="project.project_id"
                  class="project-card"
                >
                  <div class="project-header">
                    <h4 class="project-name">{{ project.project_name || 'N/A' }}</h4>
                    <span class="project-status" :class="getProjectStatusClass(project.project_status)">
                      {{ project.project_status || 'N/A' }}
                    </span>
                  </div>
                  
                  <div class="project-details-grid">
                    <div class="detail-item">
                      <i class="fas fa-calendar-alt"></i>
                      <div>
                        <p class="detail-label">Start Date</p>
                        <p class="detail-value">{{ formatDate(project.start_date) }}</p>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <i class="fas fa-calendar-check"></i>
                      <div>
                        <p class="detail-label">End Date</p>
                        <p class="detail-value">{{ formatDate(project.end_date) }}</p>
                      </div>
                    </div>
                    
                    <div class="detail-item" v-if="project.extended_date">
                      <i class="fas fa-calendar-plus"></i>
                      <div>
                        <p class="detail-label">Extended Date</p>
                        <p class="detail-value">{{ formatDate(project.extended_date) }}</p>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <i class="fas fa-user-plus"></i>
                      <div>
                        <p class="detail-label">Created By</p>
                        <p class="detail-value">{{ project.created_by || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Team Members -->
                  <div v-if="project.members && project.members.length" class="team-section">
                    <p class="team-label">
                      <i class="fas fa-users"></i>
                      Team Members
                    </p>
                    <div class="team-members">
                      <span v-for="(member, index) in project.members" :key="index" class="member-tag">
                        {{ member }}
                      </span>
                    </div>
                  </div>

                  <!-- Contract Info -->
                  <div v-if="project.contract" class="contract-info">
                    <div class="info-header">
                      <i class="fas fa-file-contract"></i>
                      <span>Contract Information</span>
                    </div>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Title:</span>
                        <span class="info-value">{{ project.contract.title || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value">{{ project.contract.status || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Timeline:</span>
                        <span class="info-value">{{ project.contract.time_line_category || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Guarantee:</span>
                        <span class="info-value">{{ project.contract.performance_guarantee || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Tender Info -->
                  <div v-if="project.tender" class="tender-info">
                    <div class="info-header">
                      <i class="fas fa-gavel"></i>
                      <span>Tender Information</span>
                    </div>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Type:</span>
                        <span class="info-value">{{ project.tender.tender_type || 'N/A' }}</span>
                      </div>
                      <div class="info-item" v-if="project.tender.attachment">
                        <span class="info-label">Attachment:</span>
                        <span class="info-value">{{ project.tender.attachment }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="no-projects">
                <i class="fas fa-folder-open"></i>
                <p>No projects assigned to this engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const users = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 9;
const selectedUser = ref(null);

onMounted(async () => {
  await fetchUsers();
});

async function fetchUsers() {
  try {
    const response = await axios.get('/api/users-with-project-summary');
    if (response.data.status) {
      users.value = response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    handleError(error);
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    (user.name || 'N/A').toLowerCase().includes(filter.value.toLowerCase()) ||
    (user.email || 'N/A').toLowerCase().includes(filter.value.toLowerCase())
  );
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const totalProjects = computed(() => {
  return users.value.reduce((sum, user) => sum + (user.total_projects || 0), 0);
});

const totalInProgress = computed(() => {
  return users.value.reduce((sum, user) => sum + (user.on_progress_projects || 0), 0);
});

const totalCompleted = computed(() => {
  return users.value.reduce((sum, user) => sum + (user.completed_projects || 0), 0);
});

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function openModal(user) {
  selectedUser.value = user;
}

function closeModal() {
  selectedUser.value = null;
}

function getBadgeClass(status) {
  const statusLower = (status || '').toLowerCase();
  if (statusLower === 'active') return 'badge-active';
  if (statusLower === 'inactive') return 'badge-inactive';
  return 'badge-default';
}

function getProjectStatusClass(status) {
  const statusLower = (status || '').toLowerCase();
  if (statusLower.includes('complete')) return 'status-completed';
  if (statusLower.includes('progress') || statusLower.includes('active')) return 'status-progress';
  if (statusLower.includes('fail')) return 'status-failed';
  return 'status-default';
}

function getCompletionRate(user) {
  const total = user.total_projects || 0;
  if (total === 0) return 0;
  const completed = user.completed_projects || 0;
  return Math.round((completed / total) * 100);
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from server';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function exportToExcel() {
  const exportData = filteredUsers.value.map((user, index) => ({
    No: index + 1,
    Name: user.name || 'N/A',
    Email: user.email || 'N/A',
    Status: user.status || 'N/A',
    Role: user.role || 'N/A',
    Department: user.department || 'N/A',
    'Total Projects': user.total_projects || 0,
    'On Progress Projects': user.on_progress_projects || 0,
    'Completed Projects': user.completed_projects || 0,
    'Failed Projects': user.failed_projects || 0,
    'Completion Rate': getCompletionRate(user) + '%'
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Engineers Project Summary');
  XLSX.writeFile(wb, 'engineers_project_summary.xlsx');
}

function exportToPDF() {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Engineers & Projects Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  
  const tableData = filteredUsers.value.map((user, index) => [
    index + 1,
    user.name || 'N/A',
    user.email || 'N/A',
    user.total_projects || 0,
    user.on_progress_projects || 0,
    user.completed_projects || 0,
    user.failed_projects || 0,
    getCompletionRate(user) + '%'
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['No', 'Name', 'Email', 'Total', 'Active', 'Done', 'Failed', 'Rate']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 9 }
  });

  doc.save('engineers_project_summary.pdf');
}
</script>

<style scoped>
.engineers-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Header */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.title-section {
  flex: 1;
  min-width: 250px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-container {
  position: relative;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.875rem;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.export-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.btn-excel {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.btn-excel:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-pdf {
  background: red;
}

.btn-pdf:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(185, 26, 26, 0.3);
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1;
}

/* Engineers Grid */
.engineers-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.engineer-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
  border: 2px solid transparent;
}

.engineer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.engineer-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.engineer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgb(45, 8, 137);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.engineer-info {
  flex: 1;
  min-width: 0;
}

.engineer-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.engineer-email {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.engineer-badge {
  flex-shrink: 0;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-active {
  background: #dcfce7;
  color: #166534;
}

.badge-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.badge-default {
  background: #f1f5f9;
  color: #475569;
}

.engineer-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: #f8fafc;
  border-radius: 8px;
}

.mini-stat i {
  font-size: 1rem;
  color: #64748b;
}

.mini-stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1;
}

.mini-stat-label {
  font-size: 0.6875rem;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-bar-container {
  margin-top: 0.75rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.progress-percentage {
  color: #6366f1;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #6366f1;
  color: #6366f1;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.current-page {
  font-weight: 600;
  color: #1e293b;
}

.total-pages {
  color: #64748b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px 16px 0 0;
}

.modal-title-section {
  flex: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-content {
  padding: 1.5rem;
}

/* Profile Section */
.profile-section {
  margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
}

.profile-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
}

.profile-details {
  flex: 1;
}

.profile-details h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.375rem 0;
}

.profile-email {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #475569;
  padding: 0.375rem 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.meta-item i {
  color: #94a3b8;
  font-size: 0.75rem;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.perf-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.perf-card i {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.perf-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.perf-label {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.perf-card.total { background: white; color: black; }
.perf-card.total i { color: #3b82f6; }

.perf-card.progress { background: white; color: black; }
.perf-card.progress i { color: black; }

.perf-card.completed { background: white; color: black; }
.perf-card.completed i { color: #10b981; }

.perf-card.failed { background: white; color: black; }
.perf-card.failed i { color: #ef4444; }

/* Projects Section */
.projects-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #6366f1;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.project-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.status-completed {
  background: #dcfce7;
  color: #166534;
}

.status-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

.status-default {
  background: #f1f5f9;
  color: #475569;
}

.project-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.detail-item i {
  color: #6366f1;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
  margin: 0;
}

.team-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.team-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.625rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.team-label i {
  color: #6366f1;
}

.team-members {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.member-tag {
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #475569;
}

.contract-info,
.tender-info {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.info-header i {
  color: #6366f1;
}

.info-grid {
  display: grid;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
}

.info-label {
  color: #64748b;
  font-weight: 500;
  min-width: 100px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

.no-projects {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
}

.no-projects i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-projects p {
  font-size: 0.9375rem;
  margin: 0;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .engineers-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .header-content {
    flex-direction: column;
  }

  .search-container {
    min-width: 100%;
  }

  .export-buttons {
    width: 100%;
  }

  .btn-export {
    flex: 1;
  }

  .stats-overview {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .engineers-container {
    grid-template-columns: 1fr;
  }

  .engineer-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .performance-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .project-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>