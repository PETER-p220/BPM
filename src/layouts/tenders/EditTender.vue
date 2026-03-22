<template>
  <div class="et-root">
    <div class="et-wrap">

      <!-- Page Header -->
      <div class="et-header">
        <div>
          <p class="et-eyebrow">Tenders</p>
          <h1 class="et-title">Edit Tender</h1>
          <p class="et-subtitle">Update tender information and documents</p>
        </div>
        <router-link to="/tenders" class="btn-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Tenders
        </router-link>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading && !tenderData.title" class="form-card">
        <div class="skeleton-hd">
          <div class="skel skel--icon"></div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div class="skel" style="width:90px;height:11px;border-radius:4px"></div>
            <div class="skel" style="width:200px;height:18px;border-radius:6px"></div>
          </div>
        </div>
        <div class="skeleton-body">
          <div v-for="i in 8" :key="i" class="skeleton-field">
            <div class="skel" style="width:110px;height:11px;border-radius:4px"></div>
            <div class="skel" style="height:42px;border-radius:8px"></div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div v-else class="form-card">

        <!-- Card Header -->
        <div class="card-hd">
          <div class="card-hd-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <p class="card-hd-eyebrow">Editing Record</p>
            <h2 class="card-hd-title">{{ tenderData.title || 'Tender Details' }}</h2>
          </div>
        </div>

        <!-- Form Body -->
        <div class="form-body">

          <!-- ── Section: Basic Info ── -->
          <div class="form-section">
            <div class="section-ttl">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Basic Information
            </div>
            <div class="form-grid form-grid--2">

              <div class="field">
                <label class="field-lbl" for="title">Title <span class="req">*</span></label>
                <input id="title" type="text" v-model="tenderData.title" class="field-input" placeholder="Enter tender title" />
              </div>

              <div class="field">
                <label class="field-lbl" for="procurement_entity">Procurement Entity <span class="req">*</span></label>
                <input id="procurement_entity" type="text" v-model="tenderData.procurement_entity" class="field-input" placeholder="Enter procurement entity" />
              </div>

              <div class="field">
                <label class="field-lbl" for="tender_number">Tender Number</label>
                <input id="tender_number" type="text" v-model="tenderData.tender_number" class="field-input field-mono" placeholder="e.g. TDR-2025-001" />
              </div>

              <div class="field">
                <label class="field-lbl" for="tender_type">Tender Type</label>
                <input id="tender_type" type="text" v-model="tenderData.tender_type" class="field-input" placeholder="e.g. Open, Restricted" />
              </div>

              <div class="field">
                <label class="field-lbl" for="procurement_method">Procurement Method</label>
                <input id="procurement_method" type="text" v-model="tenderData.procurement_method" class="field-input" placeholder="e.g. Open Tendering" />
              </div>

              <div class="field">
                <label class="field-lbl" for="submission_mode">Submission Mode</label>
                <input id="submission_mode" type="text" v-model="tenderData.submission_mode" class="field-input" placeholder="e.g. TANePS" />
              </div>

              <div class="field">
                <label class="field-lbl" for="bid_currency">Currency</label>
                <input id="bid_currency" type="text" v-model="tenderData.bid_currency" class="field-input field-mono" placeholder="TZS" />
              </div>

              <div class="field">
                <label class="field-lbl" for="estimated_value">Estimated Value</label>
                <input id="estimated_value" type="number" min="0" step="0.01" v-model="tenderData.estimated_value" class="field-input field-mono" placeholder="0.00" />
              </div>

              <div class="field">
                <label class="field-lbl" for="tender_fee">Tender Fee</label>
                <input id="tender_fee" type="number" min="0" step="0.01" v-model="tenderData.tender_fee" class="field-input field-mono" placeholder="0.00" />
              </div>

              <div class="field">
                <label class="field-lbl" for="contract_duration">Contract Duration</label>
                <input id="contract_duration" type="text" v-model="tenderData.contract_duration" class="field-input" placeholder="e.g. 12 months" />
              </div>

              <div class="field">
                <label class="field-lbl" for="bid_security_amount">Bid Security Amount</label>
                <input id="bid_security_amount" type="number" min="0" step="0.01" v-model="tenderData.bid_security_amount" class="field-input field-mono" placeholder="0.00" />
              </div>

              <div class="field field--toggle">
                <label class="field-lbl" for="bid_security_required">Bid Security Required</label>
                <input id="bid_security_required" type="checkbox" v-model="tenderData.bid_security_required" class="field-check" />
              </div>

              <div class="field">
                <label class="field-lbl" for="scope_summary">Scope Summary</label>
                <textarea id="scope_summary" v-model="tenderData.scope_summary" class="field-input field-textarea" rows="4" placeholder="Summarize the scope"></textarea>
              </div>

              <div class="field">
                <label class="field-lbl" for="eligibility_criteria">Eligibility Requirements</label>
                <textarea id="eligibility_criteria" v-model="tenderData.eligibility_criteria" class="field-input field-textarea" rows="4" placeholder="List mandatory eligibility requirements"></textarea>
              </div>

            </div>
          </div>

          <div class="form-divider"></div>

          <!-- ── Section: Dates ── -->
          <div class="form-section">
            <div class="section-ttl">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Key Dates
            </div>
            <div class="form-grid form-grid--3">

              <div class="field">
                <label class="field-lbl" for="date_of_Publication">Date of Publication</label>
                <input id="date_of_Publication" type="date" v-model="tenderData.date_of_Publication" class="field-input field-mono" />
              </div>

              <div class="field">
                <label class="field-lbl" for="bid_submission">Bid Submission</label>
                <input id="bid_submission" type="date" v-model="tenderData.bid_submission" class="field-input field-mono" />
              </div>

              <div class="field">
                <label class="field-lbl" for="expired_at">
                  Expiry Date
                  <span v-if="tenderData.expired_at" class="expiry-chip" :class="expiryClass">{{ expiryLabel }}</span>
                </label>
                <input id="expired_at" type="date" v-model="tenderData.expired_at" class="field-input field-mono" />
              </div>

              <div class="field">
                <label class="field-lbl" for="clarification_deadline">Clarification Deadline</label>
                <input id="clarification_deadline" type="date" v-model="tenderData.clarification_deadline" class="field-input field-mono" />
              </div>

              <div class="field">
                <label class="field-lbl" for="site_visit_date">Site Visit / Pre-bid Meeting</label>
                <input id="site_visit_date" type="date" v-model="tenderData.site_visit_date" class="field-input field-mono" />
              </div>

            </div>
          </div>

          <div class="form-divider"></div>

          <!-- ── Section: Attachment ── -->
          <div class="form-section">
            <div class="section-ttl">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              Document Attachment
            </div>

            <!-- Existing file pill -->
            <div v-if="existingAttachment" class="current-file-card">
              <div class="current-file-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div class="current-file-info">
                <p class="current-file-name">Current Attachment</p>
                <p class="current-file-sub">A file is already attached — upload a new one to replace it</p>
              </div>
              <a :href="existingAttachment" target="_blank" class="current-file-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View File
              </a>
            </div>

            <!-- Drop zone -->
            <div
              class="drop-zone"
              :class="{ 'drop-zone--drag': isDragging, 'drop-zone--filled': selectedFile }"
              @click="fileInputRef?.click()"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept=".pdf,.doc,.docx"
                class="drop-zone-input"
                @change="onFileChange"
              />

              <!-- Empty state -->
              <template v-if="!selectedFile">
                <div class="dz-upload-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p class="dz-title">Drop file here or <span class="dz-link">browse</span></p>
                <p class="dz-hint">PDF, DOC, DOCX · Max 10 MB</p>
              </template>

              <!-- File selected -->
              <template v-else>
                <div class="dz-file-row">
                  <div class="dz-file-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div class="dz-file-meta">
                    <p class="dz-file-name">{{ selectedFile.name }}</p>
                    <p class="dz-file-size">{{ formatSize(selectedFile.size) }} · Click to change</p>
                  </div>
                  <button class="dz-clear" @click.stop="clearFile" type="button" title="Remove file">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </template>
            </div>

          </div>
        </div>

        <!-- Form Footer -->
        <div class="form-footer">
          <router-link to="/tenders" class="btn-cancel">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Cancel
          </router-link>
          <button class="btn-save" @click="updateTender" :disabled="isLoading">
            <span v-if="isLoading" class="spin"></span>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {{ isLoading ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast  = useToast()
const route  = useRoute()
const router = useRouter()

const tenderData = ref({
  title: '', procurement_entity: '', tender_number: '',
  tender_type: '', procurement_method: '', submission_mode: '',
  bid_currency: 'TZS', estimated_value: '', tender_fee: '',
  bid_security_required: false, bid_security_amount: '',
  contract_duration: '', scope_summary: '', eligibility_criteria: '',
  date_of_Publication: '', expired_at: '', bid_submission: '',
  clarification_deadline: '', site_visit_date: '', attachment: null,
})

const isLoading     = ref(false)
const selectedFile  = ref(null)
const fileInputRef  = ref(null)
const isDragging    = ref(false)
const existingAttachment = ref('')

onMounted(fetchTenderData)

async function fetchTenderData() {
  isLoading.value = true
  try {
    const { data } = await axios.get(`api/tenders/${route.params.tender_id}`)
    const d = data.data
    d.date_of_Publication = toYMD(d.date_of_Publication)
    d.bid_submission      = toYMD(d.bid_submission)
    d.expired_at          = toYMD(d.expired_at)
    d.clarification_deadline = toYMD(d.clarification_deadline)
    d.site_visit_date = toYMD(d.site_visit_date)
    d.bid_security_required = Boolean(Number(d.bid_security_required ?? 0)) || d.bid_security_required === true
    if (typeof d.attachment === 'string' && d.attachment) {
      existingAttachment.value = d.attachment
      d.attachment = null
    }
    tenderData.value = d
  } catch (e) { handleError(e) }
  finally { isLoading.value = false }
}

function toYMD(date) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

async function updateTender() {
  if (!tenderData.value.title?.trim())
    return toast.error('Title is required')
  if (!tenderData.value.procurement_entity?.trim())
    return toast.error('Procurement entity is required')

  isLoading.value = true
  try {
    if (selectedFile.value) {
      const fd = new FormData()
      Object.entries(tenderData.value).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v)
      })
      fd.set('attachment', selectedFile.value)
      await axios.post(`api/tenders/${route.params.tender_id}?_method=PUT`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      const { attachment, ...payload } = tenderData.value
      await axios.put(`api/tenders/${route.params.tender_id}`, payload)
    }
    toast.success('Tender updated successfully')
    router.push('/tenders')
  } catch (e) { handleError(e) }
  finally { isLoading.value = false }
}

function onFileChange(e) { processFile(e.target.files[0]) }
function onDrop(e) {
  isDragging.value = false
  processFile(e.dataTransfer.files[0])
}

function processFile(file) {
  if (!file) return
  if (file.size > 10 * 1024 * 1024) return toast.error('File exceeds 10 MB limit')
  const ok = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!ok.includes(file.type)) return toast.error('Only PDF, DOC, DOCX allowed')
  selectedFile.value = file
  toast.success(`"${file.name}" selected`)
}

function clearFile() {
  selectedFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const expiryClass = computed(() => {
  if (!tenderData.value.expired_at) return ''
  const diff = new Date(tenderData.value.expired_at) - new Date()
  if (diff < 0) return 'chip--expired'
  if (diff < 7 * 86400000) return 'chip--soon'
  return 'chip--active'
})

const expiryLabel = computed(() => {
  if (!tenderData.value.expired_at) return ''
  const diff = new Date(tenderData.value.expired_at) - new Date()
  if (diff < 0) return 'Expired'
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 7)  return `${days}d left`
  return 'Active'
})

function handleError(e) {
  toast.error(e.response?.data?.error || e.response?.data?.message || e.message || 'Unexpected error')
}
</script>

<style scoped>
@import url('https://fonts.2?family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.et-root {
  --bg:           #f1f5f9;
  --white:        #ffffff;
  --surface:      #f8fafc;
  --border:       #e2e8f0;
  --border-mid:   #cbd5e1;
  --text:         #0f172a;
  --text-2:       #334155;
  --text-muted:   #64748b;
  --blue:         #2563eb;
  --blue-d:       #1d4ed8;
  --blue-bg:      #dbeafe;
  --blue-border:  #bfdbfe;
  --blue-text:    #1e40af;
  --green:        #15803d;
  --green-bg:     #dcfce7;
  --green-border: #bbf7d0;
  --yellow:       #b45309;
  --yellow-bg:    #fef9c3;
  --yellow-border:#fde68a;
  --red:          #b91c1c;
  --red-bg:       #fee2e2;
  --red-border:   #fecaca;
  --gray-bg:      #f1f5f9;
  --gray-text:    #475569;
  --radius:       12px;
  --font:         'Plus Jakarta Sans', sans-serif;
  --mono:         'IBM Plex Mono', monospace;

  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
  padding: 28px 20px 64px;
}

.et-wrap {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Page Header ── */
.et-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.et-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 5px;
}

.et-title {
  font-size: clamp(20px, 4vw, 26px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1.2;
}

.et-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  background: var(--white);
  border: 1.5px solid var(--border-mid);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.13s;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-back:hover { color: var(--text); background: var(--surface); }

/* ── Form Card ── */
.form-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 1px 4px #0f172a0d;
  overflow: hidden;
}

/* Card Header */
.card-hd {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1.5px solid var(--border);
  background: var(--surface);
}

.card-hd-icon {
  width: 44px;
  height: 44px;
  background: var(--blue-bg);
  border: 1.5px solid var(--blue-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--blue-text);
  flex-shrink: 0;
}

.card-hd-eyebrow {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 3px;
}

.card-hd-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

/* Form Body */
.form-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.form-section { padding-bottom: 22px; }

.section-ttl {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.form-divider { height: 1.5px; background: var(--border); margin-bottom: 22px; }

.form-grid { display: grid; gap: 16px; }
.form-grid--2 { grid-template-columns: 1fr 1fr; }
.form-grid--3 { grid-template-columns: 1fr 1fr 1fr; }

@media (max-width: 620px) {
  .form-grid--2, .form-grid--3 { grid-template-columns: 1fr; }
}

/* Fields */
.field { display: flex; flex-direction: column; gap: 6px; }
.field--toggle { justify-content: end; }

.field-lbl {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-2);
}

.req { color: var(--red); font-size: 14px; }

.field-input {
  height: 42px;
  padding: 0 13px;
  background: var(--white);
  border: 1.5px solid var(--border-mid);
  border-radius: 8px;
  font-family: var(--font);
  font-size: 13px;
  color: var(--text);
  outline: none;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input::placeholder { color: var(--text-muted); }
.field-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px var(--blue-bg);
}
.field-mono { font-family: var(--mono); font-size: 13px; }
.field-textarea {
  min-height: 112px;
  height: auto;
  padding: 12px 13px;
  resize: vertical;
}
.field-check {
  width: 18px;
  height: 18px;
  accent-color: var(--blue);
}

/* Expiry chip */
.expiry-chip {
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  border: 1.5px solid;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1;
}
.chip--active  { background: var(--green-bg);  color: var(--green);  border-color: var(--green-border); }
.chip--soon    { background: var(--yellow-bg); color: var(--yellow); border-color: var(--yellow-border); }
.chip--expired { background: var(--red-bg);   color: var(--red);    border-color: var(--red-border); }

/* Current file card */
.current-file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 9px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.current-file-icon {
  width: 40px;
  height: 40px;
  background: var(--red-bg);
  border: 1.5px solid var(--red-border);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--red);
  flex-shrink: 0;
}

.current-file-info { flex: 1; min-width: 0; }
.current-file-name { font-size: 13px; font-weight: 600; color: var(--text); }
.current-file-sub  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.current-file-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: var(--blue-bg);
  color: var(--blue-text);
  border: 1.5px solid var(--blue-border);
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.13s;
}
.current-file-link:hover { background: var(--blue-border); }

/* Drop zone */
.drop-zone {
  border: 2px dashed var(--border-mid);
  border-radius: 10px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  background: var(--surface);
  transition: border-color 0.15s, background 0.15s;
  user-select: none;
}

.drop-zone:hover    { border-color: var(--blue); background: var(--blue-bg); }
.drop-zone--drag    { border-color: var(--blue); background: var(--blue-bg); }
.drop-zone--filled  { border-style: solid; border-color: var(--green-border); background: var(--green-bg); }

.drop-zone-input { display: none; }

.dz-upload-icon {
  width: 52px;
  height: 52px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin: 0 auto 12px;
}

.dz-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: 4px;
}
.dz-link { color: var(--blue); text-decoration: underline; }
.dz-hint { font-size: 12px; color: var(--text-muted); }

/* File selected state */
.dz-file-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.dz-file-icon {
  width: 40px;
  height: 40px;
  background: var(--white);
  border: 1.5px solid var(--green-border);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--green);
  flex-shrink: 0;
}

.dz-file-meta { text-align: left; }
.dz-file-name { font-size: 13px; font-weight: 700; color: var(--text); font-family: var(--mono); }
.dz-file-size { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

.dz-clear {
  width: 28px;
  height: 28px;
  background: var(--white);
  border: 1.5px solid var(--red-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--red);
  flex-shrink: 0;
  transition: all 0.13s;
}
.dz-clear:hover { background: var(--red-bg); }

/* Skeleton */
.skeleton-hd {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1.5px solid var(--border);
  background: var(--surface);
}

.skeleton-body {
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.skeleton-field { display: flex; flex-direction: column; gap: 8px; }

.skel {
  background: var(--border);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.skel--icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
}

.skel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--border) 0%, var(--surface) 50%, var(--border) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Form Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1.5px solid var(--border);
  background: var(--surface);
}

.btn-cancel {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 18px;
  background: var(--gray-bg);
  border: 1.5px solid var(--border-mid);
  border-radius: 8px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-text);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.13s;
}
.btn-cancel:hover { background: #e2e8f0; color: var(--text); }

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 22px;
  background: var(--blue);
  color: #ffffff;
  border: 1.5px solid var(--blue);
  border-radius: 8px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 4px #2563eb44;
}
.btn-save:not(:disabled):hover {
  background: var(--blue-d);
  border-color: var(--blue-d);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px #2563eb55;
}
.btn-save:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }

/* Spinner */
.spin {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid #ffffff55;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
