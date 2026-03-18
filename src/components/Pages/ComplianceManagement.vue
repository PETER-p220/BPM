<template>
  <div class="cm-root">

    <!-- ══ HEADER ══ -->
    <div class="cm-header">
      <div class="cm-header-bg" aria-hidden="true">
        <div class="cm-header-grid"></div>
        <div class="cm-header-glow"></div>
      </div>
      <div class="cm-header-inner">
        <div class="cm-breadcrumb">
          <i class="fas fa-clipboard-check"></i>
          HR Management &rsaquo; Compliance
        </div>
        <h1 class="cm-page-title">Compliance Management</h1>
        <p class="cm-page-sub">Review, manage and resolve anonymous compliance submissions</p>
      </div>
    </div>

    <div class="cm-body">

      <!-- ══ STAT CARDS ══ -->
      <div class="cm-stats">
        <div class="cm-stat" v-for="stat in statCards" :key="stat.label" :style="{ '--accent': stat.color }">
          <div class="cm-stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <div class="cm-stat-content">
            <span class="cm-stat-value">{{ stat.value }}</span>
            <span class="cm-stat-label">{{ stat.label }}</span>
          </div>
          <div class="cm-stat-bar"></div>
        </div>
      </div>

      <!-- ══ FILTERS ══ -->
      <div class="cm-filters-card">
        <div class="cm-filters-top">
          <div class="cm-filters-title">
            <i class="fas fa-filter"></i>
            Filter Submissions
          </div>
          <button @click="exportData" class="cm-btn cm-btn-green">
            <i class="fas fa-file-excel"></i>
            Export Excel
          </button>
        </div>

        <div class="cm-filters-grid">
          <div class="cm-filter-field">
            <label class="cm-filter-label">Status</label>
            <select v-model="filters.status" class="cm-filter-select">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div class="cm-filter-field">
            <label class="cm-filter-label">Category</label>
            <select v-model="filters.category" class="cm-filter-select">
              <option value="">All Categories</option>
              <option value="safety">Safety Compliance</option>
              <option value="financial">Financial Compliance</option>
              <option value="operational">Operational Compliance</option>
              <option value="legal">Legal Compliance</option>
              <option value="environmental">Environmental Compliance</option>
              <option value="hr">HR Policy Compliance</option>
            </select>
          </div>
          <div class="cm-filter-field">
            <label class="cm-filter-label">Priority</label>
            <select v-model="filters.priority" class="cm-filter-select">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div class="cm-filter-field">
            <label class="cm-filter-label">From Date</label>
            <input v-model="filters.date_from" type="date" class="cm-filter-select" />
          </div>
        </div>

        <div class="cm-search-wrap">
          <i class="fas fa-search cm-search-icon"></i>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by title or reference number…"
            class="cm-search-input"
          />
          <button v-if="filters.search" @click="filters.search = ''" class="cm-search-clear">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- ══ TABLE ══ -->
      <div class="cm-table-card">
        <div class="cm-table-top">
          <div class="cm-table-title">
            <i class="fas fa-table"></i>
            Submissions
          </div>
          <div class="cm-table-meta">{{ submissions.length }} records</div>
        </div>

        <div class="cm-table-scroll">
          <table class="cm-table">
            <thead>
              <tr>
                <th class="cm-th">Reference</th>
                <th class="cm-th">Title</th>
                <th class="cm-th">Category</th>
                <th class="cm-th">Priority</th>
                <th class="cm-th">Status</th>
                <th class="cm-th">Submitted</th>
                <th class="cm-th cm-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading state -->
              <tr v-if="loading">
                <td colspan="7" class="cm-loading-row">
                  <span class="cm-spinner"></span>
                  Loading submissions…
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-else-if="submissions.length === 0">
                <td colspan="7" class="cm-empty-row">
                  <i class="fas fa-clipboard-list"></i>
                  <span>No compliance submissions match your filters</span>
                </td>
              </tr>

              <!-- Data rows -->
              <tr
                v-else
                v-for="(sub, idx) in submissions"
                :key="sub.id"
                class="cm-tr"
                :style="{ animationDelay: `${idx * 0.03}s` }"
              >
                <td class="cm-td">
                  <span class="cm-ref">{{ sub.reference_number }}</span>
                </td>
                <td class="cm-td cm-td-title">{{ sub.title }}</td>
                <td class="cm-td">
                  <span class="cm-badge" :class="getCategoryClass(sub.category)">
                    {{ getCategoryLabel(sub.category) }}
                  </span>
                </td>
                <td class="cm-td">
                  <span class="cm-badge" :class="getPriorityClass(sub.priority)">
                    <span class="cm-badge-dot"></span>
                    {{ getPriorityLabel(sub.priority) }}
                  </span>
                </td>
                <td class="cm-td">
                  <span class="cm-badge" :class="getStatusClass(sub.status)">
                    {{ getStatusLabel(sub.status) }}
                  </span>
                </td>
                <td class="cm-td cm-td-date">{{ formatDate(sub.created_at) }}</td>
                <td class="cm-td cm-td-center">
                  <div class="cm-actions">
                    <button @click="viewSubmission(sub)" class="cm-action-btn cm-action-view" title="View details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="sub.status === 'pending' || sub.status === 'under_review'"
                      @click="reviewSubmission(sub)"
                      class="cm-action-btn cm-action-review"
                      title="Review submission"
                    >
                      <i class="fas fa-check-circle"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ══ VIEW MODAL ══ -->
    <teleport to="body">
      <transition name="cm-modal-fade">
        <div v-if="showViewModal" class="cm-overlay" @click.self="showViewModal = false">
          <div class="cm-modal cm-modal-wide">

            <div class="cm-modal-header">
              <div class="cm-modal-title">
                <i class="fas fa-clipboard-list"></i>
                Compliance Details
              </div>
              <button @click="showViewModal = false" class="cm-modal-close">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="cm-modal-body" v-if="selectedSubmission">
              <!-- Profile strip -->
              <div class="cm-detail-hero">
                <div class="cm-detail-ref">
                  <span class="cm-detail-ref-label">Reference</span>
                  <span class="cm-detail-ref-val">{{ selectedSubmission.reference_number }}</span>
                </div>
                <span class="cm-badge cm-badge-lg" :class="getStatusClass(selectedSubmission.status)">
                  {{ getStatusLabel(selectedSubmission.status) }}
                </span>
              </div>

              <!-- Detail grid -->
              <div class="cm-detail-sections">
                <div class="cm-detail-section">
                  <div class="cm-detail-section-title"><i class="fas fa-info-circle"></i> Submission Info</div>
                  <div class="cm-detail-grid">
                    <div class="cm-detail-row">
                      <span class="cm-detail-label">Title</span>
                      <span class="cm-detail-value">{{ selectedSubmission.title }}</span>
                    </div>
                    <div class="cm-detail-row">
                      <span class="cm-detail-label">Category</span>
                      <span class="cm-detail-value">{{ getCategoryLabel(selectedSubmission.category) }}</span>
                    </div>
                    <div class="cm-detail-row">
                      <span class="cm-detail-label">Priority</span>
                      <span class="cm-badge cm-badge-sm" :class="getPriorityClass(selectedSubmission.priority)">
                        {{ getPriorityLabel(selectedSubmission.priority) }}
                      </span>
                    </div>
                    <div class="cm-detail-row">
                      <span class="cm-detail-label">Submitted</span>
                      <span class="cm-detail-value">{{ formatDate(selectedSubmission.created_at) }}</span>
                    </div>
                  </div>
                </div>

                <div class="cm-detail-section">
                  <div class="cm-detail-section-title"><i class="fas fa-align-left"></i> Description</div>
                  <p class="cm-detail-desc">{{ selectedSubmission.description }}</p>
                </div>

                <div class="cm-detail-section" v-if="selectedSubmission.attachments && selectedSubmission.attachments.length > 0">
                  <div class="cm-detail-section-title"><i class="fas fa-paperclip"></i> Attachments</div>
                  <div class="cm-attach-list">
                    <div v-for="att in selectedSubmission.attachments" :key="att.id" class="cm-attach-item">
                      <i class="fas fa-file cm-attach-icon"></i>
                      <span class="cm-attach-name">{{ att.file_name }}</span>
                      <button @click="downloadAttachment(att)" class="cm-btn cm-btn-sm cm-btn-outline">
                        <i class="fas fa-download"></i> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cm-modal-footer">
              <button @click="showViewModal = false" class="cm-btn cm-btn-ghost">Close</button>
              <button
                v-if="selectedSubmission && (selectedSubmission.status === 'pending' || selectedSubmission.status === 'under_review')"
                @click="() => { showViewModal = false; reviewSubmission(selectedSubmission) }"
                class="cm-btn cm-btn-primary"
              >
                <i class="fas fa-check-circle"></i> Review
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ══ REVIEW MODAL ══ -->
    <teleport to="body">
      <transition name="cm-modal-fade">
        <div v-if="showReviewModal" class="cm-overlay" @click.self="showReviewModal = false">
          <div class="cm-modal">
            <div class="cm-modal-header">
              <div class="cm-modal-title">
                <i class="fas fa-clipboard-check"></i>
                Review Submission
              </div>
              <button @click="showReviewModal = false" class="cm-modal-close">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form @submit.prevent="submitReview" class="cm-modal-body">
              <div v-if="selectedSubmission" class="cm-review-sub-info">
                <span class="cm-ref">{{ selectedSubmission.reference_number }}</span>
                <span class="cm-review-sub-title">{{ selectedSubmission.title }}</span>
              </div>

              <div class="cm-field">
                <label class="cm-field-label">Review Status <span class="cm-req">*</span></label>
                <div class="cm-input-wrap">
                  <i class="fas fa-tag cm-input-icon"></i>
                  <select v-model="reviewForm.status" required class="cm-input cm-select">
                    <option value="">Select new status</option>
                    <option value="under_review">Mark as Under Review</option>
                    <option value="reviewed">Mark as Reviewed</option>
                    <option value="resolved">Mark as Resolved</option>
                    <option value="dismissed">Dismiss</option>
                  </select>
                </div>
              </div>

              <div class="cm-field">
                <label class="cm-field-label">Review Notes</label>
                <textarea
                  v-model="reviewForm.notes"
                  rows="5"
                  placeholder="Add internal review comments, action taken, or resolution details…"
                  class="cm-textarea"
                ></textarea>
              </div>

              <div class="cm-modal-footer">
                <button type="button" @click="showReviewModal = false" class="cm-btn cm-btn-ghost">Cancel</button>
                <button type="submit" :disabled="submittingReview" class="cm-btn cm-btn-primary">
                  <span v-if="submittingReview" class="cm-spinner"></span>
                  <i v-else class="fas fa-check"></i>
                  {{ submittingReview ? 'Submitting…' : 'Submit Review' }}
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
// ✅ FIX 1: Use @/axios (custom instance with base URL + Bearer token) NOT plain 'axios'
import axios from '@/axios'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

/* ─── State ─── */
const loading          = ref(false)
const showViewModal    = ref(false)
const showReviewModal  = ref(false)
const submittingReview = ref(false)
// ✅ FIX 5: Initialize as {} not null — prevents .reference_number crash
const selectedSubmission = ref({})
const submissions = ref([])

const statistics = reactive({
  total_submissions: 0,
  pending_review:    0,
  resolved:          0,
  critical_cases:    0,
})

const filters = reactive({
  status:    '',
  category:  '',
  priority:  '',
  search:    '',
  date_from: '',
})

const reviewForm = reactive({ status: '', notes: '' })

/* ─── Computed stat cards ─── */
const statCards = computed(() => [
  { label: 'Total Submissions', value: statistics.total_submissions, icon: 'fas fa-file-alt',            color: '#1a56db' },
  { label: 'Pending Review',    value: statistics.pending_review,    icon: 'fas fa-clock',                color: '#d97706' },
  { label: 'Resolved',          value: statistics.resolved,          icon: 'fas fa-check-circle',         color: '#059669' },
  { label: 'Critical Cases',    value: statistics.critical_cases,    icon: 'fas fa-exclamation-triangle',  color: '#dc2626' },
])

/* ─── Fetch ─── */
async function fetchSubmissions() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.status)    params.append('status',    filters.status)
    if (filters.category)  params.append('category',  filters.category)
    if (filters.priority)  params.append('priority',  filters.priority)
    if (filters.search)    params.append('search',    filters.search)
    if (filters.date_from) params.append('date_from', filters.date_from)

    const response = await axios.get(`/api/compliance/submissions?${params}`)
    submissions.value = response.data.data || []
  } catch (error) {
    // ✅ FIX 8: Use toast not alert
    toast.error('Failed to load compliance submissions')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchStatistics() {
  try {
    const response = await axios.get('/api/compliance/statistics')
    Object.assign(statistics, response.data)
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

/* ✅ FIX 2: Watch filters so table refreshes when user changes any dropdown/input */
watch(filters, fetchSubmissions, { deep: true })

onMounted(() => {
  fetchSubmissions()
  fetchStatistics()
})

/* ─── Actions ─── */
function viewSubmission(submission) {
  selectedSubmission.value = submission
  showViewModal.value = true
}

function reviewSubmission(submission) {
  selectedSubmission.value = submission
  reviewForm.status = ''
  reviewForm.notes  = ''
  showReviewModal.value = true
}

async function submitReview() {
  if (!reviewForm.status) { toast.warning('Please select a review status'); return }
  submittingReview.value = true
  try {
    await axios.post(
      `/api/compliance/submissions/${selectedSubmission.value.id}/review`,
      reviewForm
    )
    toast.success('Review submitted successfully')
    showReviewModal.value = false
    selectedSubmission.value = {}
    await fetchSubmissions()
    await fetchStatistics()
  } catch (error) {
    toast.error('Failed to submit review. Please try again.')
    console.error(error)
  } finally {
    submittingReview.value = false
  }
}

async function downloadAttachment(attachment) {
  try {
    const response = await axios.get(
      `/api/compliance/submissions/${attachment.submission_id}/attachments/${attachment.id}/download`,
      { responseType: 'blob' }
    )
    const url  = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success(`Downloaded: ${attachment.file_name}`)
  } catch (error) {
    // ✅ FIX 8: toast not alert
    toast.error('Failed to download attachment')
    console.error(error)
  }
}

async function exportData() {
  try {
    const params = new URLSearchParams()
    if (filters.status)    params.append('status',    filters.status)
    if (filters.category)  params.append('category',  filters.category)
    if (filters.priority)  params.append('priority',  filters.priority)
    if (filters.search)    params.append('search',    filters.search)
    if (filters.date_from) params.append('date_from', filters.date_from)

    const response = await axios.get(`/api/compliance/submissions/export?${params}`, {
      responseType: 'blob'
    })
    const url  = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `compliance_submissions_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success('Export downloaded successfully')
  } catch (error) {
    toast.error('Failed to export data')
    console.error(error)
  }
}

/* ─── Label/class helpers ─── */
const categoryLabels = {
  safety: 'Safety', financial: 'Financial', operational: 'Operational',
  legal: 'Legal', environmental: 'Environmental', hr: 'HR Policy',
  procurement: 'Procurement', ethical: 'Ethical', other: 'Other',
}
const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }
const statusLabels   = {
  pending: 'Pending', under_review: 'Under Review',
  reviewed: 'Reviewed', resolved: 'Resolved', dismissed: 'Dismissed',
}

const getCategoryLabel = (v) => categoryLabels[v] || v || '—'
const getPriorityLabel = (v) => priorityLabels[v] || v || '—'
const getStatusLabel   = (v) => statusLabels[v]   || v || '—'

const getCategoryClass = (v) => ({
  safety: 'cm-cat-safety', financial: 'cm-cat-financial', operational: 'cm-cat-operational',
  legal: 'cm-cat-legal', environmental: 'cm-cat-env', hr: 'cm-cat-hr',
  procurement: 'cm-cat-procurement', ethical: 'cm-cat-ethical', other: 'cm-cat-other',
}[v] || 'cm-cat-other')

const getPriorityClass = (v) => ({
  low: 'cm-pri-low', medium: 'cm-pri-medium', high: 'cm-pri-high', critical: 'cm-pri-critical',
}[v] || 'cm-pri-low')

const getStatusClass = (v) => ({
  pending: 'cm-st-pending', under_review: 'cm-st-review',
  reviewed: 'cm-st-reviewed', resolved: 'cm-st-resolved', dismissed: 'cm-st-dismissed',
}[v] || 'cm-st-pending')

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito+Sans:wght@400;500;600;700;800&display=swap');

/* ── Tokens ── */
.cm-root {
  --navy:      #0d2b5e;
  --navy-2:    #153470;
  --blue:      #1a56db;
  --blue-lt:   #3b72f0;
  --blue-pale: #eff6ff;
  --blue-soft: #dbeafe;
  --white:     #ffffff;
  --off:       #f8faff;
  --g100:      #f1f5f9;
  --g200:      #e2e8f0;
  --g400:      #94a3b8;
  --g600:      #475569;
  --g800:      #1e293b;
  --ink:       #0f172a;
  --green:     #059669;
  --green-lt:  #d1fae5;
  --amber:     #d97706;
  --amber-lt:  #fef3c7;
  --red:       #dc2626;
  --red-lt:    #fee2e2;
  --shadow:    0 1px 4px rgba(13,43,94,.08), 0 2px 12px rgba(13,43,94,.06);
  --shadow-md: 0 4px 20px rgba(13,43,94,.12);
  --shadow-lg: 0 12px 48px rgba(13,43,94,.16);

  font-family: 'Nunito Sans', sans-serif;
  background: var(--off); color: var(--ink);
  min-height: 100vh; -webkit-font-smoothing: antialiased;
}

/* ── HEADER ── */
.cm-header {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
  padding: 28px 0 38px; position: relative; overflow: hidden;
}
.cm-header-bg { position: absolute; inset: 0; pointer-events: none; }
.cm-header-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black 30%, transparent 100%);
}
.cm-header-glow {
  position: absolute; top: -30%; right: -10%;
  width: 50vw; height: 50vw; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,86,219,.2) 0%, transparent 65%);
  filter: blur(60px);
}
.cm-header-inner {
  max-width: 1440px; margin: 0 auto; padding: 0 32px;
  position: relative; z-index: 1;
}
.cm-breadcrumb {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
  color: rgba(255,255,255,.5); margin-bottom: 10px;
}
.cm-page-title {
  font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700; color: #fff; margin: 0 0 6px; line-height: 1.2;
}
.cm-page-sub { font-size: 13px; color: rgba(255,255,255,.55); margin: 0; font-weight: 300; }

/* ── BODY ── */
.cm-body { max-width: 1440px; margin: -18px auto 0; padding: 0 32px 48px; position: relative; z-index: 1; }

/* ── STAT CARDS ── */
.cm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
.cm-stat {
  background: var(--white); border: 1px solid var(--g200); border-radius: 12px;
  padding: 18px 20px; display: flex; align-items: center; gap: 14px;
  box-shadow: var(--shadow); position: relative; overflow: hidden;
  transition: box-shadow .2s, transform .2s;
}
.cm-stat:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.cm-stat::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: var(--accent, var(--blue)); border-radius: 999px 999px 0 0;
}
.cm-stat-icon {
  width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
  background: color-mix(in srgb, var(--accent, var(--blue)) 12%, white);
  color: var(--accent, var(--blue));
  display: flex; align-items: center; justify-content: center; font-size: 17px;
}
.cm-stat-content { display: flex; flex-direction: column; gap: 2px; }
.cm-stat-value { font-family: 'Playfair Display', serif; font-size: 1.7rem; line-height: 1; color: var(--navy); }
.cm-stat-label { font-size: 11.5px; color: var(--g600); font-weight: 600; letter-spacing: .02em; }

/* ── FILTERS ── */
.cm-filters-card {
  background: var(--white); border: 1px solid var(--g200); border-radius: 12px;
  padding: 18px 20px; margin-bottom: 18px; box-shadow: var(--shadow);
}
.cm-filters-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.cm-filters-title {
  font-size: 13px; font-weight: 700; color: var(--navy);
  display: flex; align-items: center; gap: 8px;
}
.cm-filters-title i { color: var(--blue); }
.cm-filters-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 12px; margin-bottom: 14px;
}
.cm-filter-field { display: flex; flex-direction: column; gap: 5px; }
.cm-filter-label { font-size: 11px; font-weight: 700; color: var(--g600); text-transform: uppercase; letter-spacing: .05em; }
.cm-filter-select {
  padding: 9px 12px; border-radius: 8px; border: 1.5px solid #b0c4de;
  background: #ffffff; color: #0d2b5e; font-family: 'Nunito Sans', sans-serif;
  font-size: 13.5px; font-weight: 500; outline: none;
  -webkit-text-fill-color: #0d2b5e;
  transition: border-color .18s, box-shadow .18s;
}
.cm-filter-select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(26,86,219,.12); }
.cm-filter-select[type="date"] { color-scheme: light; }

.cm-search-wrap { position: relative; }
.cm-search-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  font-size: 13px; color: #4a7ab5; pointer-events: none;
}
.cm-search-input {
  width: 100%; padding: 10px 40px 10px 38px;
  border-radius: 8px; border: 1.5px solid #b0c4de;
  background: #ffffff; color: #0d2b5e;
  font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 500;
  outline: none; -webkit-text-fill-color: #0d2b5e;
  transition: border-color .18s, box-shadow .18s;
}
.cm-search-input::placeholder { color: #9badc4; -webkit-text-fill-color: #9badc4; font-weight: 400; }
.cm-search-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(26,86,219,.12); }
.cm-search-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--g400); cursor: pointer; font-size: 12px; padding: 4px;
}

/* ── TABLE ── */
.cm-table-card {
  background: var(--white); border: 1px solid var(--g200);
  border-radius: 12px; box-shadow: var(--shadow); overflow: hidden;
}
.cm-table-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid var(--g100);
}
.cm-table-title { font-size: 14px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 8px; }
.cm-table-title i { color: var(--blue); }
.cm-table-meta { font-size: 12px; color: var(--g400); font-weight: 600; }
.cm-table-scroll { overflow-x: auto; }
.cm-table { width: 100%; border-collapse: collapse; }

.cm-th {
  padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase; color: var(--g600);
  background: var(--g100); border-bottom: 1px solid var(--g200); white-space: nowrap;
}
.cm-th-center { text-align: center; }

.cm-tr {
  border-bottom: 1px solid var(--g100); transition: background .15s;
  animation: rowIn .3s ease both;
}
.cm-tr:last-child { border-bottom: none; }
.cm-tr:hover { background: var(--off); }

.cm-td { padding: 13px 16px; vertical-align: middle; font-size: 13.5px; }
.cm-td-title { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: var(--navy); }
.cm-td-date  { font-size: 12.5px; color: var(--g600); white-space: nowrap; }
.cm-td-center { text-align: center; }

.cm-ref { font-family: 'Courier New', monospace; font-size: 12px; color: var(--blue); font-weight: 700; letter-spacing: .04em; }

/* Badges */
.cm-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700;
  white-space: nowrap;
}
.cm-badge-lg { font-size: 13px; padding: 5px 14px; }
.cm-badge-sm { font-size: 11px; padding: 2px 8px; }
.cm-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: .7; }

/* Category */
.cm-cat-safety      { background: #fef9c3; color: #713f12; }
.cm-cat-financial   { background: #dbeafe; color: #1e40af; }
.cm-cat-operational { background: #e0e7ff; color: #3730a3; }
.cm-cat-legal       { background: #fee2e2; color: #991b1b; }
.cm-cat-env         { background: #d1fae5; color: #065f46; }
.cm-cat-hr          { background: #fce7f3; color: #9d174d; }
.cm-cat-procurement { background: #f3e8ff; color: #6b21a8; }
.cm-cat-ethical     { background: #ccfbf1; color: #134e4a; }
.cm-cat-other       { background: var(--g100); color: var(--g600); }

/* Priority */
.cm-pri-low      { background: #d1fae5; color: #065f46; }
.cm-pri-medium   { background: var(--amber-lt); color: #92400e; }
.cm-pri-high     { background: #fee2e2; color: #991b1b; }
.cm-pri-critical { background: #dc2626; color: #fff; }

/* Status */
.cm-st-pending   { background: var(--g100); color: var(--g600); }
.cm-st-review    { background: var(--blue-pale); color: #1e40af; }
.cm-st-reviewed  { background: #f3e8ff; color: #6b21a8; }
.cm-st-resolved  { background: var(--green-lt); color: #065f46; }
.cm-st-dismissed { background: var(--red-lt); color: #991b1b; }

/* Actions */
.cm-actions { display: flex; align-items: center; gap: 6px; justify-content: center; }
.cm-action-btn {
  width: 30px; height: 30px; border-radius: 7px; border: 1px solid transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px; transition: all .15s;
}
.cm-action-view   { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-soft); }
.cm-action-view:hover   { background: var(--blue); color: #fff; }
.cm-action-review { background: var(--green-lt); color: var(--green); border-color: #a7f3d0; }
.cm-action-review:hover { background: var(--green); color: #fff; }

/* Loading / empty */
.cm-loading-row, .cm-empty-row {
  padding: 60px 20px; text-align: center; color: var(--g400);
  display: table-cell; /* stays in tbody row context */
}
.cm-loading-row { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; }
.cm-empty-row i  { display: block; font-size: 32px; margin-bottom: 12px; opacity: .4; }
.cm-empty-row span { font-size: 13.5px; }

/* ── BUTTONS ── */
.cm-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 8px; border: none;
  font-family: 'Nunito Sans', sans-serif; font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: all .18s; white-space: nowrap;
}
.cm-btn:disabled { opacity: .6; cursor: not-allowed; }
.cm-btn-primary { background: var(--blue); color: #fff; box-shadow: 0 3px 12px rgba(26,86,219,.35); }
.cm-btn-primary:hover:not(:disabled) { background: var(--blue-lt); transform: translateY(-1px); }
.cm-btn-green   { background: var(--green); color: #fff; box-shadow: 0 3px 12px rgba(5,150,105,.3); }
.cm-btn-green:hover { filter: brightness(1.1); transform: translateY(-1px); }
.cm-btn-ghost   { background: var(--g100); color: var(--g600); border: 1px solid var(--g200); }
.cm-btn-ghost:hover { background: var(--g200); }
.cm-btn-outline { background: var(--white); color: var(--g600); border: 1.5px solid var(--g200); }
.cm-btn-outline:hover { border-color: var(--g400); }
.cm-btn-sm { padding: 5px 12px; font-size: 12px; }

/* Spinner */
.cm-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
  animation: spin .7s linear infinite; flex-shrink: 0;
}

/* ── MODALS ── */
.cm-overlay {
  position: fixed; inset: 0; background: rgba(8,18,40,.75);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 24px 16px 40px; z-index: 1000; overflow-y: auto;
}
.cm-modal {
  background: #fff; border-radius: 16px; width: 100%; max-width: 560px;
  box-shadow: var(--shadow-lg); isolation: isolate;
  margin: 16px auto;
  animation: modalIn .25s cubic-bezier(.16,1,.3,1) both;
}
.cm-modal-wide { max-width: 680px; }

.cm-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px;
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
  border-radius: 16px 16px 0 0;
}
.cm-modal-title {
  font-family: 'Playfair Display', serif; font-size: 1rem;
  color: #fff; display: flex; align-items: center; gap: 9px;
}
.cm-modal-title i { color: rgba(255,255,255,.7); }
.cm-modal-close {
  width: 30px; height: 30px; border-radius: 7px;
  border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.1);
  color: rgba(255,255,255,.8); cursor: pointer; font-size: 12px;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.cm-modal-close:hover { background: rgba(239,68,68,.8); color: #fff; }

.cm-modal-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
.cm-modal-footer {
  padding: 14px 22px; border-top: 1px solid var(--g100);
  display: flex; justify-content: flex-end; gap: 10px;
  background: var(--off); border-radius: 0 0 16px 16px;
}

/* Detail hero */
.cm-detail-hero {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; background: var(--off); border: 1px solid var(--g200);
  border-radius: 10px;
}
.cm-detail-ref { display: flex; flex-direction: column; gap: 3px; }
.cm-detail-ref-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--g400); }
.cm-detail-ref-val { font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; color: var(--blue); }

/* Detail sections */
.cm-detail-sections { display: flex; flex-direction: column; gap: 14px; }
.cm-detail-section { border: 1px solid var(--g200); border-radius: 10px; overflow: hidden; }
.cm-detail-section-title {
  padding: 9px 14px; background: var(--g100); border-bottom: 1px solid var(--g200);
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em;
  color: var(--g600); display: flex; align-items: center; gap: 7px;
}
.cm-detail-section-title i { color: var(--blue); }
.cm-detail-grid { display: grid; grid-template-columns: 1fr 1fr; }
.cm-detail-row {
  display: flex; flex-direction: column; gap: 3px; padding: 11px 14px;
  border-bottom: 1px solid var(--g100); border-right: 1px solid var(--g100);
}
.cm-detail-row:nth-child(even) { border-right: none; }
.cm-detail-row:last-child, .cm-detail-row:nth-last-child(2):nth-child(odd) { border-bottom: none; }
.cm-detail-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--g400); }
.cm-detail-value { font-size: 13.5px; color: var(--ink); font-weight: 500; }
.cm-detail-desc { padding: 12px 14px; font-size: 13.5px; color: var(--g600); line-height: 1.7; margin: 0; white-space: pre-wrap; }

/* Attachment list in modal */
.cm-attach-list { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; }
.cm-attach-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--off); border: 1px solid var(--g200); border-radius: 8px; }
.cm-attach-icon { font-size: 16px; color: var(--blue); flex-shrink: 0; }
.cm-attach-name { flex: 1; font-size: 13px; font-weight: 500; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Review form fields */
.cm-review-sub-info {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; background: var(--blue-pale); border: 1px solid var(--blue-soft);
  border-radius: 9px;
}
.cm-review-sub-title { font-size: 13.5px; font-weight: 600; color: var(--navy); }

.cm-field { display: flex; flex-direction: column; gap: 6px; }
.cm-field-label { font-size: 11.5px; font-weight: 800; color: #1e3a5f; text-transform: uppercase; letter-spacing: .05em; }
.cm-req { color: var(--red); }
.cm-input-wrap { position: relative; display: flex; align-items: center; }
.cm-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 13px; color: #4a7ab5; pointer-events: none; z-index: 1; }
.cm-input, .cm-select {
  width: 100%; padding: 10px 14px 10px 38px; border-radius: 9px;
  border: 2px solid #b0c4de; background: #fff; color: #0d2b5e;
  font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 500; outline: none;
  -webkit-text-fill-color: #0d2b5e; transition: border-color .18s, box-shadow .18s;
}
.cm-input:focus, .cm-select:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(26,86,219,.14); }
.cm-select { cursor: pointer; }
.cm-textarea {
  width: 100%; padding: 11px 14px; border-radius: 9px;
  border: 2px solid #b0c4de; background: #fff; color: #0d2b5e;
  font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 500; outline: none;
  resize: vertical; line-height: 1.65; -webkit-text-fill-color: #0d2b5e;
  transition: border-color .18s, box-shadow .18s;
}
.cm-textarea::placeholder { color: #9badc4; -webkit-text-fill-color: #9badc4; font-weight: 400; }
.cm-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(26,86,219,.14); }

/* ── TRANSITIONS ── */
.cm-modal-fade-enter-active { transition: opacity .25s; }
.cm-modal-fade-leave-active { transition: opacity .2s; }
.cm-modal-fade-enter-from, .cm-modal-fade-leave-to { opacity: 0; }

@keyframes rowIn   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
@keyframes modalIn { from { opacity:0; transform:scale(.97) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
@keyframes spin    { to { transform: rotate(360deg); } }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) { .cm-stats { grid-template-columns: repeat(2, 1fr); } .cm-filters-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .cm-body { padding: 0 16px 40px; }
  .cm-header-inner { padding: 0 16px; }
  .cm-stats { grid-template-columns: repeat(2, 1fr); }
  .cm-filters-grid { grid-template-columns: 1fr; }
  .cm-detail-grid { grid-template-columns: 1fr; }
  .cm-detail-row { border-right: none; }
}
@media (max-width: 480px) { .cm-stats { grid-template-columns: 1fr; } }
</style>