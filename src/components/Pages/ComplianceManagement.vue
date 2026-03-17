<template>
  <div class="compliance-root">
    <!-- Header -->
    <div class="compliance-header">
      <div class="compliance-header-inner">
        <div class="compliance-header-copy">
          <div class="compliance-breadcrumb">HR Management &rsaquo; Compliance</div>
          <h1 class="compliance-title">Compliance Management</h1>
          <p class="compliance-sub">{{ totalSubmissions }} submissions across {{ categories.length }} categories</p>
        </div>
        <div class="compliance-header-actions">
          <button @click="exportToExcel" :disabled="isExporting" class="compliance-btn compliance-btn-green">
            <i class="fas fa-file-excel"></i>
            {{ isExporting ? 'Exporting…' : 'Export Report' }}
          </button>
          <button @click="showStatsModal = true" class="compliance-btn compliance-btn-primary">
            <i class="fas fa-chart-bar"></i>
            Statistics
          </button>
        </div>
      </div>
    </div>

    <div class="compliance-body">
      <!-- Stats Cards -->
      <div class="compliance-stats">
        <div class="compliance-stat-card" v-for="stat in statCards" :key="stat.label" :style="{ '--accent': stat.color }">
          <div class="compliance-stat-icon-wrap">
            <i :class="stat.icon"></i>
          </div>
          <div class="compliance-stat-content">
            <span class="compliance-stat-value">{{ stat.value }}</span>
            <span class="compliance-stat-label">{{ stat.label }}</span>
          </div>
          <div class="compliance-stat-bar" :style="{ width: stat.pct + '%' }"></div>
        </div>
      </div>

      <!-- Filters -->
      <div class="compliance-filters">
        <div class="compliance-search-wrap">
          <i class="fas fa-search compliance-search-icon"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Search by title, employee, or reference..."
            class="compliance-search-input"
          />
          <button v-if="search" @click="search = ''" class="compliance-search-clear">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <select v-model="statusFilter" class="compliance-select">
          <option value="">All Status</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select v-model="categoryFilter" class="compliance-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <select v-model="priorityFilter" class="compliance-select">
          <option value="">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <div class="compliance-filter-info" v-if="filteredSubmissions.length !== submissions.length">
          <i class="fas fa-filter"></i>
          {{ filteredSubmissions.length }} of {{ submissions.length }} shown
        </div>
      </div>

      <!-- Table -->
      <div class="compliance-table-card">
        <div class="compliance-table-top">
          <div class="compliance-table-title">
            <i class="fas fa-clipboard-check"></i>
            Compliance Submissions
          </div>
          <div class="compliance-table-meta">{{ filteredSubmissions.length }} records</div>
        </div>

        <div class="compliance-table-scroll">
          <table class="compliance-table">
            <thead>
              <tr>
                <th class="compliance-th compliance-th-num">#</th>
                <th class="compliance-th">Submission Details</th>
                <th class="compliance-th">Category</th>
                <th class="compliance-th">Priority</th>
                <th class="compliance-th">Submitted</th>
                <th class="compliance-th">Status</th>
                <th class="compliance-th compliance-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredSubmissions.length === 0">
                <td colspan="7" class="compliance-empty-row">
                  <i class="fas fa-inbox"></i>
                  <span>No compliance submissions found</span>
                </td>
              </tr>
              <tr
                v-for="(submission, idx) in filteredSubmissions"
                :key="submission.id"
                class="compliance-tr"
                :style="{ animationDelay: `${idx * 0.03}s` }"
              >
                <td class="compliance-td compliance-td-num">{{ idx + 1 }}</td>
                <td class="compliance-td">
                  <div class="compliance-submission-cell">
                    <div class="compliance-submission-title">{{ submission.title }}</div>
                    <div class="compliance-submission-meta">
                      <span class="compliance-submission-ref">Ref: {{ submission.reference }}</span>
                      <span class="compliance-submission-date">{{ formatDate(submission.submitted_at) }}</span>
                    </div>
                  </div>
                </td>
                <td class="compliance-td">
                  <span class="compliance-category-badge">{{ submission.category }}</span>
                </td>
                <td class="compliance-td">
                  <span class="compliance-priority-badge" :class="`compliance-priority-${submission.priority}`">
                    {{ capitalize(submission.priority) }}
                  </span>
                </td>
                <td class="compliance-td">
                  <div class="compliance-date-cell">
                    <span class="compliance-date-main">{{ formatDate(submission.submitted_at) }}</span>
                    <span class="compliance-time-ago">{{ getTimeAgo(submission.submitted_at) }}</span>
                  </div>
                </td>
                <td class="compliance-td">
                  <span class="compliance-status-badge" :class="getStatusClass(submission.status)">
                    <span class="compliance-status-dot"></span>
                    {{ formatStatus(submission.status) }}
                  </span>
                </td>
                <td class="compliance-td compliance-td-center">
                  <div class="compliance-actions">
                    <button @click="viewSubmission(submission)" class="compliance-action-btn compliance-action-view" title="View details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="reviewSubmission(submission)" class="compliance-action-btn compliance-action-review" title="Review">
                      <i class="fas fa-gavel"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <teleport to="body">
      <transition name="compliance-modal">
        <div v-if="showViewModal" class="compliance-overlay" @click.self="showViewModal = false">
          <div class="compliance-modal">
            <div class="compliance-modal-header">
              <div class="compliance-modal-title">
                <i class="fas fa-clipboard-check"></i>
                Compliance Submission Details
              </div>
              <button @click="showViewModal = false" class="compliance-modal-close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="compliance-modal-body" v-if="selectedSubmission">
              <div class="compliance-view-section">
                <div class="compliance-view-section-title">
                  <i class="fas fa-info-circle"></i>
                  Submission Information
                </div>
                <div class="compliance-view-grid">
                  <div class="compliance-view-row">
                    <span class="compliance-view-label">Reference</span>
                    <span class="compliance-view-value compliance-mono">{{ selectedSubmission.reference }}</span>
                  </div>
                  <div class="compliance-view-row">
                    <span class="compliance-view-label">Title</span>
                    <span class="compliance-view-value">{{ selectedSubmission.title }}</span>
                  </div>
                  <div class="compliance-view-row">
                    <span class="compliance-view-label">Category</span>
                    <span class="compliance-view-value">{{ selectedSubmission.category }}</span>
                  </div>
                  <div class="compliance-view-row">
                    <span class="compliance-view-label">Priority</span>
                    <span class="compliance-priority-badge" :class="`compliance-priority-${selectedSubmission.priority}`">
                      {{ capitalize(selectedSubmission.priority) }}
                    </span>
                  </div>
                  <div class="compliance-view-row">
                    <span class="compliance-view-label">Submitted</span>
                    <span class="compliance-view-value">{{ formatDate(selectedSubmission.submitted_at) }}</span>
                  </div>
                  <div class="compliance-view-row">
                    <span class="compliance-view-label">Status</span>
                    <span class="compliance-status-badge" :class="getStatusClass(selectedSubmission.status)">
                      <span class="compliance-status-dot"></span>
                      {{ formatStatus(selectedSubmission.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="compliance-view-section">
                <div class="compliance-view-section-title">
                  <i class="fas fa-file-alt"></i>
                  Description
                </div>
                <p class="compliance-description">{{ selectedSubmission.description }}</p>
              </div>

              <div class="compliance-view-section" v-if="selectedSubmission.attachments">
                <div class="compliance-view-section-title">
                  <i class="fas fa-paperclip"></i>
                  Attachments
                </div>
                <div class="compliance-attachments">
                  <div v-for="file in selectedSubmission.attachments" :key="file.id" class="compliance-attachment">
                    <i class="fas fa-file"></i>
                    <span>{{ file.name }}</span>
                    <button class="compliance-download-btn">
                      <i class="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="compliance-modal-footer">
              <button @click="showViewModal = false" class="compliance-btn compliance-btn-ghost">Close</button>
              <button @click="reviewFromView" class="compliance-btn compliance-btn-primary">
                <i class="fas fa-gavel"></i>
                Review Submission
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Review Modal -->
    <teleport to="body">
      <transition name="compliance-modal">
        <div v-if="showReviewModal" class="compliance-overlay" @click.self="showReviewModal = false">
          <div class="compliance-modal">
            <div class="compliance-modal-header">
              <div class="compliance-modal-title">
                <i class="fas fa-gavel"></i>
                Review Compliance Submission
              </div>
              <button @click="showReviewModal = false" class="compliance-modal-close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form @submit.prevent="submitReview" class="compliance-modal-body" v-if="reviewingSubmission">
              <div class="compliance-review-section">
                <div class="compliance-review-section-title">
                  <i class="fas fa-info-circle"></i>
                  Submission Details
                </div>
                <div class="compliance-review-info">
                  <div class="compliance-review-info-row">
                    <span class="compliance-review-label">Reference:</span>
                    <span class="compliance-review-value">{{ reviewingSubmission.reference }}</span>
                  </div>
                  <div class="compliance-review-info-row">
                    <span class="compliance-review-label">Title:</span>
                    <span class="compliance-review-value">{{ reviewingSubmission.title }}</span>
                  </div>
                  <div class="compliance-review-info-row">
                    <span class="compliance-review-label">Category:</span>
                    <span class="compliance-review-value">{{ reviewingSubmission.category }}</span>
                  </div>
                </div>
              </div>

              <div class="compliance-review-section">
                <div class="compliance-review-section-title">
                  <i class="fas fa-balance-scale"></i>
                  Review Decision
                </div>
                <div class="compliance-review-grid">
                  <div class="compliance-review-field">
                    <label class="compliance-review-label">Decision <span class="compliance-req">*</span></label>
                    <select v-model="reviewDecision.status" required class="compliance-review-select">
                      <option value="">Select decision</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                      <option value="pending">Request More Information</option>
                    </select>
                  </div>
                  <div class="compliance-review-field compliance-review-field-full">
                    <label class="compliance-review-label">Review Comments <span class="compliance-req">*</span></label>
                    <textarea
                      v-model="reviewDecision.comments"
                      placeholder="Provide detailed feedback on your decision..."
                      required
                      class="compliance-review-textarea"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="compliance-modal-footer">
                <button type="button" @click="showReviewModal = false" class="compliance-btn compliance-btn-ghost">
                  <i class="fas fa-times"></i> Cancel
                </button>
                <button type="submit" class="compliance-btn compliance-btn-primary">
                  <i class="fas fa-check"></i>
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const submissions = ref([])
const search = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const priorityFilter = ref('')
const showViewModal = ref(false)
const showReviewModal = ref(false)
const showStatsModal = ref(false)
const isExporting = ref(false)
const selectedSubmission = ref(null)
const reviewingSubmission = ref(null)

const categories = [
  { id: 'safety', name: 'Safety Compliance' },
  { id: 'financial', name: 'Financial Compliance' },
  { id: 'operational', name: 'Operational Compliance' },
  { id: 'legal', name: 'Legal Compliance' },
  { id: 'environmental', name: 'Environmental Compliance' },
  { id: 'hr', name: 'HR Policy Compliance' },
]

const reviewDecision = ref({
  status: '',
  comments: '',
})

onMounted(() => fetchSubmissions())

const filteredSubmissions = computed(() =>
  submissions.value.filter(sub => {
    const q = search.value.toLowerCase()
    const matchSearch = !q ||
      sub.title.toLowerCase().includes(q) ||
      sub.reference.toLowerCase().includes(q)
    const matchStatus = !statusFilter.value || sub.status === statusFilter.value
    const matchCategory = !categoryFilter.value || sub.category === categoryFilter.value
    const matchPriority = !priorityFilter.value || sub.priority === priorityFilter.value
    return matchSearch && matchStatus && matchCategory && matchPriority
  })
)

const pendingSubmissions = computed(() => submissions.value.filter(s => s.status === 'pending').length)
const approvedSubmissions = computed(() => submissions.value.filter(s => s.status === 'approved').length)
const rejectedSubmissions = computed(() => submissions.value.filter(s => s.status === 'rejected').length)
const totalSubmissions = computed(() => submissions.value.length)

const statCards = computed(() => [
  { label: 'Total Submissions', value: totalSubmissions.value, icon: 'fas fa-clipboard-list', color: '#1a56db', pct: 100 },
  { label: 'Pending Review', value: pendingSubmissions.value, icon: 'fas fa-clock', color: '#d97706', pct: totalSubmissions.value ? Math.round(pendingSubmissions.value / totalSubmissions.value * 100) : 0 },
  { label: 'Approved', value: approvedSubmissions.value, icon: 'fas fa-check-circle', color: '#059669', pct: totalSubmissions.value ? Math.round(approvedSubmissions.value / totalSubmissions.value * 100) : 0 },
  { label: 'Rejected', value: rejectedSubmissions.value, icon: 'fas fa-times-circle', color: '#dc2626', pct: totalSubmissions.value ? Math.round(rejectedSubmissions.value / totalSubmissions.value * 100) : 0 },
])

async function fetchSubmissions() {
  try {
    const res = await axios.get('/api/compliance/submissions')
    submissions.value = res.data.data || []
  } catch {
    toast.error('Failed to load compliance submissions')
  }
}

function viewSubmission(submission) {
  selectedSubmission.value = submission
  showViewModal.value = true
}

function reviewSubmission(submission) {
  reviewingSubmission.value = submission
  reviewDecision.value = { status: '', comments: '' }
  showReviewModal.value = true
}

function reviewFromView() {
  reviewingSubmission.value = selectedSubmission.value
  reviewDecision.value = { status: '', comments: '' }
  showViewModal.value = false
  showReviewModal.value = true
}

async function submitReview() {
  try {
    await axios.post(`/api/compliance/submissions/${reviewingSubmission.value.id}/review`, reviewDecision.value)
    toast.success('Review submitted successfully')
    showReviewModal.value = false
    fetchSubmissions()
  } catch {
    toast.error('Failed to submit review')
  }
}

function getStatusClass(status) {
  return { 
    pending: 'compliance-status-pending', 
    approved: 'compliance-status-approved', 
    rejected: 'compliance-status-rejected' 
  }[status] || 'compliance-status-pending'
}

function formatStatus(status) {
  return { 
    pending: 'Pending Review', 
    approved: 'Approved', 
    rejected: 'Rejected' 
  }[status] || status
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : '' }

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getTimeAgo(date) {
  const minutes = Math.floor((Date.now() - new Date(date)) / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

async function exportToExcel() {
  isExporting.value = true
  try {
    const rows = filteredSubmissions.value.map((s, i) => ({
      '#': i + 1,
      'Reference': s.reference,
      'Title': s.title,
      'Category': s.category,
      'Priority': capitalize(s.priority),
      'Status': formatStatus(s.status),
      'Submitted': formatDate(s.submitted_at),
      'Reviewed': s.reviewed_at ? formatDate(s.reviewed_at) : 'Not reviewed',
    }))
    
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Compliance Report')
    XLSX.writeFile(wb, `TERA_Compliance_Report_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported successfully')
  } catch { toast.error('Export failed') } finally { isExporting.value = false }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

.compliance-root {
  --navy: #0d2b5e;
  --navy-2: #153470;
  --blue: #1a56db;
  --blue-lt: #3b72f0;
  --blue-pale: #eff6ff;
  --blue-soft: #dbeafe;
  --white: #ffffff;
  --off: #f8faff;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-400: #94a3b8;
  --gray-600: #475569;
  --gray-800: #1e293b;
  --ink: #0f172a;
  --green: #059669;
  --green-lt: #d1fae5;
  --amber: #d97706;
  --amber-lt: #fef3c7;
  --red: #dc2626;
  --red-lt: #fee2e2;
  --radius: 10px;
  --shadow: 0 1px 4px rgba(13,43,94,.08), 0 2px 12px rgba(13,43,94,.06);
  --shadow-md: 0 4px 20px rgba(13,43,94,.12), 0 2px 8px rgba(13,43,94,.06);
  --shadow-lg: 0 12px 48px rgba(13,43,94,.16);

  font-family: 'Nunito Sans', sans-serif;
  background: var(--off);
  color: var(--ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.compliance-header {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
  padding: 28px 0 36px; position: relative; overflow: hidden;
}
.compliance-header::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: rgba(255,255,255,.1);
}
.compliance-header-inner {
  max-width: 1440px; margin: 0 auto; padding: 0 32px;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;
  flex-wrap: wrap;
}
.compliance-breadcrumb {
  font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: rgba(255,255,255,.5); margin-bottom: 8px;
}
.compliance-title {
  font-family: 'DM Serif Display', serif; font-size: 2rem; font-weight: 400;
  color: #fff; margin: 0; line-height: 1.2;
}
.compliance-sub { font-size: 13px; color: rgba(255,255,255,.55); margin-top: 5px; }
.compliance-header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.compliance-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 8px; border: none;
  font-family: 'Nunito Sans', sans-serif; font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: all .18s; letter-spacing: .01em;
  white-space: nowrap;
}
.compliance-btn:disabled { opacity: .6; cursor: not-allowed; }
.compliance-btn-primary { background: var(--blue); color: #fff; box-shadow: 0 3px 12px rgba(26,86,219,.35); }
.compliance-btn-primary:hover:not(:disabled) { background: var(--blue-lt); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,86,219,.4); }
.compliance-btn-green { background: var(--green); color: #fff; box-shadow: 0 3px 12px rgba(5,150,105,.3); }
.compliance-btn-green:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.compliance-btn-ghost { background: var(--gray-100); color: var(--gray-600); border: 1px solid var(--gray-200); }
.compliance-btn-ghost:hover { background: var(--gray-200); }

.compliance-body {
  max-width: 1440px; margin: -16px auto 0; padding: 0 32px 48px;
  position: relative; z-index: 1;
}

.compliance-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.compliance-stat-card {
  background: var(--white); border-radius: var(--radius); padding: 18px 20px;
  border: 1px solid var(--gray-200); box-shadow: var(--shadow);
  display: flex; align-items: center; gap: 14px; position: relative; overflow: hidden;
  transition: box-shadow .2s, transform .2s;
}
.compliance-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.compliance-stat-card::after {
  content: ''; position: absolute; bottom: 0; left: 0; height: 3px;
  width: var(--pct, 0%); background: var(--accent, var(--blue));
  border-radius: 0 999px 999px 0; transition: width .6s ease .1s;
}
.compliance-stat-icon-wrap {
  width: 46px; height: 46px; border-radius: 11px; flex-shrink: 0;
  background: color-mix(in srgb, var(--accent, var(--blue)) 12%, white);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: var(--accent, var(--blue));
}
.compliance-stat-content { display: flex; flex-direction: column; gap: 2px; }
.compliance-stat-value { font-family: 'DM Serif Display', serif; font-size: 1.7rem; line-height: 1; color: var(--navy); }
.compliance-stat-label { font-size: 11.5px; color: var(--gray-600); font-weight: 600; letter-spacing: .02em; }

.compliance-filters {
  background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius);
  padding: 14px 18px; margin-bottom: 18px; box-shadow: var(--shadow);
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
.compliance-search-wrap { position: relative; flex: 1; min-width: 220px; }
.compliance-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-400); font-size: 13px; }
.compliance-search-input {
  width: 100%; padding: 9px 36px 9px 36px; border-radius: 8px;
  border: 1px solid var(--gray-200); font-family: 'Nunito Sans', sans-serif;
  font-size: 13.5px; color: var(--ink); outline: none; background: var(--off);
  transition: border-color .18s;
}
.compliance-search-input:focus { border-color: var(--blue); background: #fff; }
.compliance-search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 4px; font-size: 12px; }
.compliance-select {
  padding: 9px 14px; border-radius: 8px; border: 1px solid var(--gray-200);
  font-family: 'Nunito Sans', sans-serif; font-size: 13.5px; color: var(--gray-800);
  outline: none; background: var(--off); cursor: pointer; transition: border-color .18s;
  min-width: 140px;
}
.compliance-select:focus { border-color: var(--blue); background: #fff; }
.compliance-filter-info { font-size: 12px; color: var(--blue); font-weight: 600; white-space: nowrap; background: var(--blue-pale); padding: 6px 12px; border-radius: 999px; border: 1px solid var(--blue-soft); }

.compliance-table-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;
}
.compliance-table-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; border-bottom: 1px solid var(--gray-100);
}
.compliance-table-title { font-size: 14px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 8px; }
.compliance-table-title i { color: var(--blue); }
.compliance-table-meta { font-size: 12px; color: var(--gray-400); font-weight: 600; }
.compliance-table-scroll { overflow-x: auto; }

.compliance-table { width: 100%; border-collapse: collapse; }
.compliance-th {
  padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase; color: var(--gray-600);
  background: var(--gray-100); border-bottom: 1px solid var(--gray-200);
  white-space: nowrap;
}
.compliance-th-num { width: 48px; text-align: center; }
.compliance-th-center { text-align: center; }

.compliance-tr {
  transition: background .15s; animation: rowIn .35s ease both;
  border-bottom: 1px solid var(--gray-100);
}
.compliance-tr:last-child { border-bottom: none; }
.compliance-tr:hover { background: var(--off); }

.compliance-td { padding: 13px 16px; vertical-align: middle; font-size: 13.5px; }
.compliance-td-num { text-align: center; font-size: 12px; color: var(--gray-400); font-weight: 600; }
.compliance-td-center { text-align: center; }

.compliance-submission-cell { display: flex; flex-direction: column; gap: 4px; }
.compliance-submission-title { font-weight: 700; font-size: 13.5px; color: var(--navy); }
.compliance-submission-meta { display: flex; gap: 12px; font-size: 11.5px; color: var(--gray-400); }
.compliance-submission-ref { font-family: 'Courier New', monospace; }
.compliance-submission-date { color: var(--gray-600); }

.compliance-category-badge {
  display: inline-block; padding: 3px 9px; border-radius: 6px;
  background: var(--blue-pale); color: var(--blue); border: 1px solid var(--blue-soft);
  font-size: 11.5px; font-weight: 700; white-space: nowrap; letter-spacing: .02em;
}

.compliance-priority-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.compliance-priority-high { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
.compliance-priority-medium { background: var(--amber-lt); color: #92400e; border: 1px solid #fcd34d; }
.compliance-priority-low { background: var(--green-lt); color: #065f46; border: 1px solid #a7f3d0; }

.compliance-date-cell { display: flex; flex-direction: column; gap: 2px; }
.compliance-date-main { font-size: 13px; color: var(--gray-800); white-space: nowrap; font-weight: 500; }
.compliance-time-ago { font-size: 10.5px; color: var(--gray-400); font-weight: 600; letter-spacing: .02em; }

.compliance-status-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700;
  white-space: nowrap;
}
.compliance-status-dot { width: 6px; height: 6px; border-radius: 50%; }
.compliance-status-pending { background: var(--amber-lt); color: #92400e; }
.compliance-status-pending .compliance-status-dot { background: var(--amber); box-shadow: 0 0 0 2px #fcd34d; animation: pulse-dot 2s ease-in-out infinite; }
.compliance-status-approved { background: var(--green-lt); color: #065f46; }
.compliance-status-approved .compliance-status-dot { background: var(--green); box-shadow: 0 0 0 2px #a7f3d0; }
.compliance-status-rejected { background: var(--red-lt); color: #991b1b; }
.compliance-status-rejected .compliance-status-dot { background: var(--red); }

.compliance-actions { display: flex; align-items: center; gap: 4px; justify-content: center; }
.compliance-action-btn {
  width: 30px; height: 30px; border-radius: 7px; border: 1px solid transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px; transition: all .15s;
}
.compliance-action-view { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-soft); }
.compliance-action-view:hover { background: var(--blue); color: #fff; }
.compliance-action-review { background: #f0fdf4; color: var(--green); border-color: #bbf7d0; }
.compliance-action-review:hover { background: var(--green); color: #fff; }

.compliance-empty-row { padding: 60px 20px; text-align: center; color: var(--gray-400); }
.compliance-empty-row i { display: block; font-size: 32px; margin-bottom: 12px; opacity: .4; }
.compliance-empty-row span { font-size: 13.5px; }

.compliance-overlay {
  position: fixed; inset: 0;
  background: rgba(8,18,40,.72);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 24px 16px; z-index: 1000; overflow-y: auto;
}
.compliance-modal {
  background: #ffffff;
  border-radius: 16px; width: 100%; max-width: 680px;
  box-shadow: 0 24px 80px rgba(8,18,40,.35), 0 4px 20px rgba(8,18,40,.15);
  animation: modalIn .28s cubic-bezier(.16,1,.3,1) both;
  isolation: isolate; position: relative;
}
.compliance-modal-header {
  background: linear-gradient(135deg, #0d2b5e 0%, #153470 100%);
  border-radius: 16px 16px 0 0; padding: 20px 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.compliance-modal-title { font-family: 'DM Serif Display', serif; font-size: 1.15rem; color: #fff; display: flex; align-items: center; gap: 9px; }
.compliance-modal-title i { color: var(--blue); font-size: .9em; }
.compliance-modal-close {
  width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.1);
  color: rgba(255,255,255,.8); cursor: pointer; font-size: 13px;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.compliance-modal-close:hover { background: rgba(239,68,68,.8); border-color: #ef4444; color: #fff; }

.compliance-modal-body {
  padding: 24px; display: flex; flex-direction: column; gap: 20px;
  max-height: calc(100vh - 220px); overflow-y: auto; background: #ffffff;
}
.compliance-modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--gray-100); display: flex; gap: 10px; justify-content: flex-end; position: sticky; bottom: 0; background: var(--white); border-radius: 0 0 16px 16px;
}

.compliance-view-section { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 12px; overflow: hidden; }
.compliance-view-section-title {
  display: flex; align-items: center; gap: 10px; padding: 11px 16px;
  background: #f8faff; border-bottom: 1px solid var(--gray-200);
  font-size: 11px; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: var(--blue);
}
.compliance-view-section-title i { color: var(--blue); }
.compliance-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 18px 16px; background: #fff; }
.compliance-view-row { display: flex; flex-direction: column; gap: 3px; padding: 12px 16px; border-bottom: 1px solid var(--gray-100); border-right: 1px solid var(--gray-100); }
.compliance-view-row:nth-child(even) { border-right: none; }
.compliance-view-row:last-child { border-bottom: none; }
.compliance-view-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--gray-400); }
.compliance-view-value { font-size: 13.5px; color: var(--ink); font-weight: 500; }
.compliance-mono { font-family: 'Courier New', monospace; font-size: 12px; color: var(--gray-600); letter-spacing: .04em; }
.compliance-description { padding: 12px 16px; font-size: 13.5px; color: var(--gray-600); line-height: 1.7; margin: 0; white-space: pre-wrap; }

.compliance-attachments { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.compliance-attachment {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  background: var(--gray-100); border-radius: 8px; border: 1px solid var(--gray-200);
}
.compliance-download-btn { margin-left: auto; background: var(--blue); color: #fff; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer; }

.compliance-review-section { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 12px; overflow: hidden; }
.compliance-review-section-title {
  display: flex; align-items: center; gap: 10px; padding: 11px 16px;
  background: #f8faff; border-bottom: 1px solid var(--gray-200);
  font-size: 11px; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: var(--blue);
}
.compliance-review-info { padding: 16px; background: var(--off); }
.compliance-review-info-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--gray-200); }
.compliance-review-info-row:last-child { border-bottom: none; }
.compliance-review-label { font-size: 12px; font-weight: 600; color: var(--gray-600); min-width: 80px; }
.compliance-review-value { font-size: 13px; color: var(--ink); font-weight: 500; }

.compliance-review-grid { display: grid; grid-template-columns: 1fr; gap: 16px; padding: 18px 16px; background: #fff; }
.compliance-review-field { display: flex; flex-direction: column; gap: 6px; }
.compliance-review-field-full { grid-column: 1 / -1; }
.compliance-review-select {
  width: 100%; padding: 10px 12px; border-radius: 8px;
  border: 1.5px solid var(--gray-200); background: var(--off);
  color: var(--ink); font-family: 'Nunito Sans', sans-serif;
  font-size: 13.5px; font-weight: 500; outline: none;
  transition: border-color .18s, background .18s, box-shadow .18s;
}
.compliance-review-select:focus { border-color: var(--blue); background: #ffffff; box-shadow: 0 0 0 3px rgba(26,86,219,.12); }
.compliance-review-textarea {
  width: 100%; padding: 10px 12px; border-radius: 8px;
  border: 1.5px solid var(--gray-200); background: var(--off);
  color: var(--ink); font-family: 'Nunito Sans', sans-serif;
  font-size: 13.5px; font-weight: 500; outline: none; resize: vertical;
  transition: border-color .18s, background .18s, box-shadow .18s;
}
.compliance-review-textarea:focus { border-color: var(--blue); background: #ffffff; box-shadow: 0 0 0 3px rgba(26,86,219,.12); }
.compliance-req { color: var(--red); margin-left: 2px; }

@keyframes rowIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(.97) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 2px #a7f3d0; }
  50% { box-shadow: 0 0 0 4px #d1fae5; }
}

@media (max-width: 1100px) { .compliance-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .compliance-body { padding: 0 16px 40px; }
  .compliance-header-inner { padding: 0 16px; }
  .compliance-stats { grid-template-columns: repeat(2, 1fr); }
  .compliance-view-grid { grid-template-columns: 1fr; }
  .compliance-view-row { border-right: none; }
}
@media (max-width: 480px) {
  .compliance-stats { grid-template-columns: 1fr; }
  .compliance-filters { flex-direction: column; }
  .compliance-select, .compliance-search-input { width: 100%; }
}
</style>
