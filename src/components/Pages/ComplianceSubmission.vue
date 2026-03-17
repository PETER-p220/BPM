<template>
  <div class="cs-root">

    <!-- ══ PAGE HEADER ══ -->
    <div class="cs-header">
      <div class="cs-header-bg" aria-hidden="true">
        <div class="cs-header-grid"></div>
        <div class="cs-header-glow"></div>
      </div>
      <div class="cs-header-inner">
        <div class="cs-breadcrumb">
          <i class="fas fa-shield-alt"></i>
          Compliance &rsaquo; New Submission
        </div>
        <h1 class="cs-page-title">Submit Compliance Report</h1>
        <p class="cs-page-sub">All submissions are reviewed anonymously by HR — your identity is fully protected</p>

        <!-- Step progress bar -->
        <div class="cs-steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="cs-step"
            :class="{
              'cs-step-done':    i < currentStep,
              'cs-step-active':  i === currentStep,
              'cs-step-future':  i > currentStep,
            }"
          >
            <div class="cs-step-circle">
              <i v-if="i < currentStep" class="fas fa-check"></i>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="cs-step-label">{{ step }}</span>
            <div v-if="i < steps.length - 1" class="cs-step-line" :class="{ 'cs-step-line-done': i < currentStep }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ BODY ══ -->
    <div class="cs-body">
      <form @submit.prevent="submitCompliance" class="cs-form" novalidate>

        <!-- ── STEP 1: Basic Information ── -->
        <div v-show="currentStep === 0" class="cs-step-panel" :class="{ 'cs-panel-enter': currentStep === 0 }">
          <div class="cs-card">
            <div class="cs-card-header">
              <div class="cs-card-header-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div>
                <div class="cs-card-title">Basic Information</div>
                <div class="cs-card-sub">Identify the nature of this compliance submission</div>
              </div>
            </div>
            <div class="cs-card-body">

              <div class="cs-field cs-field-full">
                <label class="cs-label">Report Title <span class="cs-req">*</span></label>
                <div class="cs-input-wrap">
                  <i class="fas fa-heading cs-input-icon"></i>
                  <input
                    v-model="submission.title"
                    type="text"
                    placeholder="e.g. Q1 Safety Compliance Report"
                    class="cs-input"
                    :class="{ 'cs-input-error': errors.title }"
                  />
                </div>
                <span v-if="errors.title" class="cs-error-msg"><i class="fas fa-exclamation-circle"></i> {{ errors.title }}</span>
              </div>

              <div class="cs-row-2">
                <div class="cs-field">
                  <label class="cs-label">Category <span class="cs-req">*</span></label>
                  <div class="cs-input-wrap">
                    <i class="fas fa-folder cs-input-icon"></i>
                    <select v-model="submission.category" class="cs-input cs-select" :class="{ 'cs-input-error': errors.category }">
                      <option value="">Select category</option>
                      <option value="safety">Safety Compliance</option>
                      <option value="financial">Financial Compliance</option>
                      <option value="operational">Operational Compliance</option>
                      <option value="legal">Legal Compliance</option>
                      <option value="environmental">Environmental Compliance</option>
                      <option value="hr">HR Policy Compliance</option>
                    </select>
                  </div>
                  <span v-if="errors.category" class="cs-error-msg"><i class="fas fa-exclamation-circle"></i> {{ errors.category }}</span>
                </div>

                <div class="cs-field">
                  <label class="cs-label">Priority Level <span class="cs-req">*</span></label>
                  <div class="cs-priority-row">
                    <button
                      v-for="p in priorities"
                      :key="p.value"
                      type="button"
                      class="cs-priority-btn"
                      :class="[`cs-priority-${p.value}`, { 'cs-priority-active': submission.priority === p.value }]"
                      @click="submission.priority = p.value"
                    >
                      <i :class="p.icon"></i>
                      {{ p.label }}
                    </button>
                  </div>
                  <span v-if="errors.priority" class="cs-error-msg"><i class="fas fa-exclamation-circle"></i> {{ errors.priority }}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="cs-nav-row">
            <div></div>
            <button type="button" @click="goNext" class="cs-btn cs-btn-primary">
              Continue
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- ── STEP 2: Description ── -->
        <div v-show="currentStep === 1" class="cs-step-panel">
          <div class="cs-card">
            <div class="cs-card-header">
              <div class="cs-card-header-icon">
                <i class="fas fa-align-left"></i>
              </div>
              <div>
                <div class="cs-card-title">Detailed Description</div>
                <div class="cs-card-sub">Describe the compliance issue or report in full</div>
              </div>
            </div>
            <div class="cs-card-body">

              <div class="cs-field cs-field-full">
                <label class="cs-label">Description <span class="cs-req">*</span></label>
                <textarea
                  v-model="submission.description"
                  placeholder="Provide a full description of the compliance matter — include relevant dates, departments, processes, or personnel involved (anonymised where appropriate)..."
                  class="cs-textarea"
                  :class="{ 'cs-input-error': errors.description }"
                  rows="10"
                ></textarea>
                <div class="cs-textarea-footer">
                  <span v-if="errors.description" class="cs-error-msg"><i class="fas fa-exclamation-circle"></i> {{ errors.description }}</span>
                  <span class="cs-char-count" :class="{ 'cs-char-warn': submission.description.length > 1800 }">
                    {{ submission.description.length }} / 2000
                  </span>
                </div>
              </div>

              <div class="cs-anon-banner">
                <div class="cs-anon-icon">
                  <i class="fas fa-user-secret"></i>
                </div>
                <div class="cs-anon-text">
                  <strong>Anonymous Review Guaranteed</strong>
                  Your identity is stripped before this report reaches any reviewer. HR sees only the compliance information — not your name, department, or role.
                </div>
              </div>

            </div>
          </div>
          <div class="cs-nav-row">
            <button type="button" @click="goPrev" class="cs-btn cs-btn-ghost">
              <i class="fas fa-arrow-left"></i>
              Back
            </button>
            <button type="button" @click="goNext" class="cs-btn cs-btn-primary">
              Continue
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- ── STEP 3: Attachments & Submit ── -->
        <div v-show="currentStep === 2" class="cs-step-panel">
          <div class="cs-card">
            <div class="cs-card-header">
              <div class="cs-card-header-icon">
                <i class="fas fa-paperclip"></i>
              </div>
              <div>
                <div class="cs-card-title">Supporting Documents</div>
                <div class="cs-card-sub">Attach up to 5 supporting files (PDF, Word, Excel, images)</div>
              </div>
            </div>
            <div class="cs-card-body">

              <!-- Drop zone -->
              <div
                class="cs-drop-zone"
                :class="{ 'cs-drop-zone-over': isDragOver, 'cs-drop-zone-has-files': attachments.length > 0 }"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleFileDrop"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  @change="handleFileSelect"
                  class="cs-file-input"
                />
                <div class="cs-drop-content">
                  <div class="cs-drop-icon-wrap" :class="{ 'cs-drop-icon-over': isDragOver }">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p class="cs-drop-title">
                    <span v-if="isDragOver">Release to upload</span>
                    <span v-else>Drop files here or <span class="cs-drop-link">browse</span></span>
                  </p>
                  <p class="cs-drop-hint">PDF, Word, Excel, JPG, PNG &nbsp;·&nbsp; Max 10 MB per file &nbsp;·&nbsp; Up to 5 files</p>
                </div>
              </div>

              <!-- Attachment list -->
              <transition-group name="cs-attach-list" tag="div" class="cs-attach-list" v-if="attachments.length > 0">
                <div v-for="(file, idx) in attachments" :key="file.name + idx" class="cs-attach-item">
                  <div class="cs-attach-icon" :style="{ background: getFileColor(file.name) + '18', color: getFileColor(file.name) }">
                    <i :class="getFileIcon(file.name)"></i>
                  </div>
                  <div class="cs-attach-info">
                    <span class="cs-attach-name">{{ file.name }}</span>
                    <span class="cs-attach-size">{{ formatFileSize(file.size) }}</span>
                  </div>
                  <div class="cs-attach-prog">
                    <div class="cs-attach-prog-bar"></div>
                  </div>
                  <button type="button" @click.stop="removeAttachment(idx)" class="cs-attach-remove">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </transition-group>

            </div>
          </div>

          <!-- Review summary before submit -->
          <div class="cs-review-card">
            <div class="cs-review-title"><i class="fas fa-clipboard-check"></i> Review Your Submission</div>
            <div class="cs-review-grid">
              <div class="cs-review-item">
                <span class="cs-review-label">Title</span>
                <span class="cs-review-value">{{ submission.title || '—' }}</span>
              </div>
              <div class="cs-review-item">
                <span class="cs-review-label">Category</span>
                <span class="cs-review-value">{{ getCategoryLabel(submission.category) }}</span>
              </div>
              <div class="cs-review-item">
                <span class="cs-review-label">Priority</span>
                <span class="cs-review-value cs-review-priority" :class="`cs-review-priority-${submission.priority}`">
                  {{ submission.priority ? submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1) : '—' }}
                </span>
              </div>
              <div class="cs-review-item">
                <span class="cs-review-label">Attachments</span>
                <span class="cs-review-value">{{ attachments.length }} file{{ attachments.length !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>

          <div class="cs-nav-row">
            <button type="button" @click="goPrev" class="cs-btn cs-btn-ghost">
              <i class="fas fa-arrow-left"></i>
              Back
            </button>
            <div class="cs-submit-group">
              <button type="button" @click="resetForm" class="cs-btn cs-btn-outline">
                <i class="fas fa-redo"></i>
                Reset
              </button>
              <button type="submit" :disabled="isSubmitting" class="cs-btn cs-btn-primary cs-btn-submit">
                <span v-if="isSubmitting" class="cs-spinner"></span>
                <i v-else class="fas fa-paper-plane"></i>
                {{ isSubmitting ? 'Submitting…' : 'Submit Report' }}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>

    <!-- ══ SUCCESS MODAL ══ -->
    <teleport to="body">
      <transition name="cs-modal-fade">
        <div v-if="showSuccessModal" class="cs-overlay" @click.self="showSuccessModal = false">
          <div class="cs-modal">
            <div class="cs-modal-confetti" aria-hidden="true">
              <span v-for="n in 12" :key="n" class="cs-confetti-dot" :style="{ '--i': n }"></span>
            </div>
            <div class="cs-modal-check">
              <i class="fas fa-check"></i>
            </div>
            <h3 class="cs-modal-title">Submission Received!</h3>
            <p class="cs-modal-desc">Your compliance report has been submitted and will be reviewed anonymously by the HR team.</p>

            <div class="cs-modal-detail-block">
              <div class="cs-modal-row">
                <span class="cs-modal-key">Reference</span>
                <span class="cs-modal-val cs-modal-ref">{{ submissionResult.reference || 'REF-' + Date.now().toString(36).toUpperCase() }}</span>
              </div>
              <div class="cs-modal-row">
                <span class="cs-modal-key">Category</span>
                <span class="cs-modal-val">{{ getCategoryLabel(submissionResult.category || submission.category) }}</span>
              </div>
              <div class="cs-modal-row">
                <span class="cs-modal-key">Status</span>
                <span class="cs-modal-status">
                  <span class="cs-modal-status-dot"></span>
                  Pending Review
                </span>
              </div>
            </div>

            <button @click="showSuccessModal = false" class="cs-btn cs-btn-primary cs-modal-btn">
              <i class="fas fa-check"></i>
              Done
            </button>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>


<script setup>
import { ref, reactive, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

/* ─── State ─── */
const currentStep   = ref(0)
const isSubmitting  = ref(false)
const isDragOver    = ref(false)
const showSuccessModal = ref(false)
const attachments   = ref([])
const submissionResult = ref({})
const fileInputRef  = ref(null)
const errors        = reactive({ title: '', category: '', priority: '', description: '' })

const steps = ['Basic Info', 'Description', 'Documents']

const priorities = [
  { value: 'high',   label: 'High',   icon: 'fas fa-arrow-up' },
  { value: 'medium', label: 'Medium', icon: 'fas fa-minus' },
  { value: 'low',    label: 'Low',    icon: 'fas fa-arrow-down' },
]

const categories = {
  safety:        'Safety Compliance',
  financial:     'Financial Compliance',
  operational:   'Operational Compliance',
  legal:         'Legal Compliance',
  environmental: 'Environmental Compliance',
  hr:            'HR Policy Compliance',
}

const submission = reactive({
  title: '', category: '', priority: '', description: '',
})

/* ─── Navigation ─── */
function validateStep(step) {
  let valid = true
  errors.title = errors.category = errors.priority = errors.description = ''

  if (step === 0) {
    if (!submission.title.trim())    { errors.title    = 'Title is required';    valid = false }
    if (!submission.category)        { errors.category = 'Please select a category'; valid = false }
    if (!submission.priority)        { errors.priority = 'Please select a priority level'; valid = false }
  }
  if (step === 1) {
    if (!submission.description.trim()) { errors.description = 'Description is required'; valid = false }
    if (submission.description.length > 2000) { errors.description = 'Description must be under 2000 characters'; valid = false }
  }
  return valid
}

function goNext() {
  if (validateStep(currentStep.value)) currentStep.value++
}
function goPrev() {
  if (currentStep.value > 0) currentStep.value--
}

/* ─── Files ─── */
function triggerFileInput() { fileInputRef.value?.click() }

function handleFileSelect(e) { addFiles(Array.from(e.target.files)); e.target.value = '' }
function handleFileDrop(e)   { isDragOver.value = false; addFiles(Array.from(e.dataTransfer.files)) }

function addFiles(files) {
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10 MB`); return }
    if (attachments.value.length >= 5) { toast.error('Maximum 5 attachments'); return }
    if (attachments.value.find(f => f.name === file.name)) { toast.warning(`${file.name} already added`); return }
    attachments.value.push(file)
  })
}
function removeAttachment(i) { attachments.value.splice(i, 1) }

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))              return 'fas fa-file-pdf'
  if (['doc','docx'].includes(ext))       return 'fas fa-file-word'
  if (['xls','xlsx'].includes(ext))       return 'fas fa-file-excel'
  if (['jpg','jpeg','png'].includes(ext)) return 'fas fa-file-image'
  return 'fas fa-file'
}
function getFileColor(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))              return '#ef4444'
  if (['doc','docx'].includes(ext))       return '#3b82f6'
  if (['xls','xlsx'].includes(ext))       return '#16a34a'
  if (['jpg','jpeg','png'].includes(ext)) return '#8b5cf6'
  return '#64748b'
}
function formatFileSize(b) {
  if (!b) return '0 B'
  const k = 1024, s = ['B','KB','MB','GB'], i = Math.floor(Math.log(b)/Math.log(k))
  return `${parseFloat((b/Math.pow(k,i)).toFixed(1))} ${s[i]}`
}
function getCategoryLabel(val) { return categories[val] || '—' }

/* ─── Submit ─── */
async function submitCompliance() {
  if (!validateStep(1)) { currentStep.value = 1; return }

  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('title', submission.title)
    fd.append('description', submission.description)
    fd.append('category', submission.category)
    fd.append('priority', submission.priority)
    attachments.value.forEach((f, i) => fd.append(`attachments[${i}]`, f))

    const res = await axios.post('/api/compliance/submissions', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    submissionResult.value = res.data.data
    showSuccessModal.value = true
    resetForm()
    toast.success('Compliance report submitted successfully!')
  } catch (err) {
    if (err.response?.status === 422) {
      Object.values(err.response.data.errors).forEach(e => toast.error(e[0]))
    } else {
      toast.error('Submission failed. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  Object.keys(submission).forEach(k => submission[k] = '')
  attachments.value = []
  currentStep.value = 0
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

/* ── Tokens ── */
.cs-root {
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
  background: var(--off);
  color: var(--ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* ── HEADER ── */
.cs-header {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
  padding: 32px 0 44px; position: relative; overflow: hidden;
}
.cs-header-bg { position: absolute; inset: 0; pointer-events: none; }
.cs-header-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.1) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black 30%, transparent 100%);
}
.cs-header-glow {
  position: absolute; top: -20%; right: -10%;
  width: 50vw; height: 50vw; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,86,219,.25) 0%, transparent 65%);
  filter: blur(60px);
}
.cs-header-inner {
  max-width: 820px; margin: 0 auto; padding: 0 28px;
  position: relative; z-index: 1; text-align: center;
}
.cs-breadcrumb {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,255,255,.5); margin-bottom: 12px;
}
.cs-breadcrumb i { color: rgba(255,255,255,.4); font-size: 11px; }
.cs-page-title {
  font-family: 'Playfair Display', serif; font-size: clamp(1.7rem, 4vw, 2.3rem);
  font-weight: 700; color: #fff; margin: 0 0 8px; line-height: 1.2;
  animation: fadeUp .6s ease both .1s;
}
.cs-page-sub {
  font-size: 13.5px; color: rgba(255,255,255,.6); margin: 0 0 32px;
  font-weight: 300; line-height: 1.6;
  animation: fadeUp .6s ease both .2s;
}

/* Step progress */
.cs-steps {
  display: flex; align-items: center; justify-content: center; gap: 0;
  animation: fadeUp .6s ease both .3s;
}
.cs-step { display: flex; align-items: center; gap: 0; position: relative; }
.cs-step-circle {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; transition: all .25s;
  border: 2px solid rgba(255,255,255,.25); color: rgba(255,255,255,.5);
  background: rgba(255,255,255,.08);
}
.cs-step-done .cs-step-circle   { background: var(--green); border-color: var(--green); color: #fff; }
.cs-step-active .cs-step-circle { background: var(--white); border-color: var(--white); color: var(--navy); }
.cs-step-label {
  font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: rgba(255,255,255,.4); margin: 0 10px; transition: color .25s; white-space: nowrap;
}
.cs-step-done .cs-step-label   { color: rgba(255,255,255,.7); }
.cs-step-active .cs-step-label { color: #fff; }
.cs-step-line {
  width: 48px; height: 2px; background: rgba(255,255,255,.15);
  border-radius: 999px; flex-shrink: 0; transition: background .25s;
}
.cs-step-line-done { background: var(--green); }

/* ── BODY ── */
.cs-body { max-width: 820px; margin: -20px auto 0; padding: 0 28px 60px; position: relative; z-index: 1; }
.cs-form { display: flex; flex-direction: column; gap: 0; }
.cs-step-panel { display: flex; flex-direction: column; gap: 18px; animation: fadeUp .4s ease both; }

/* ── CARD ── */
.cs-card {
  background: var(--white); border: 1px solid var(--g200);
  border-radius: 14px; overflow: hidden;
  box-shadow: var(--shadow);
}
.cs-card-header {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 22px; border-bottom: 1px solid var(--g100);
  background: linear-gradient(90deg, var(--navy) 0%, var(--navy-2) 100%);
}
.cs-card-header-icon {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #fff;
}
.cs-card-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #fff; }
.cs-card-sub   { font-size: 11.5px; color: rgba(255,255,255,.6); margin-top: 2px; }
.cs-card-body  { padding: 22px; display: flex; flex-direction: column; gap: 18px; }

/* ── FIELDS ── */
.cs-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cs-field  { display: flex; flex-direction: column; gap: 6px; }
.cs-field-full { grid-column: 1 / -1; }

.cs-label {
  font-size: 11.5px; font-weight: 800; color: #1e3a5f;
  letter-spacing: .06em; text-transform: uppercase;
}
.cs-req { color: var(--red); margin-left: 2px; }

.cs-input-wrap { position: relative; display: flex; align-items: center; }
.cs-input-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  font-size: 13px; color: #4a7ab5; pointer-events: none; z-index: 1;
}
.cs-input, .cs-select {
  width: 100%; padding: 11px 14px 11px 40px;
  border-radius: 9px; border: 2px solid #b0c4de;
  background: #ffffff; color: #0d2b5e;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px; font-weight: 600; outline: none;
  transition: border-color .18s, box-shadow .18s;
  -webkit-text-fill-color: #0d2b5e;
}
.cs-input::placeholder, .cs-select::placeholder {
  color: #9badc4; font-weight: 400; -webkit-text-fill-color: #9badc4;
}
.cs-input:focus, .cs-select:focus {
  border-color: var(--blue); box-shadow: 0 0 0 4px rgba(26,86,219,.14);
}
.cs-input:hover:not(:focus), .cs-select:hover:not(:focus) { border-color: #7a9cbf; }
.cs-input-error { border-color: var(--red) !important; }
.cs-select { cursor: pointer; }

/* Priority buttons */
.cs-priority-row { display: flex; gap: 8px; }
.cs-priority-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 12px; border-radius: 9px; border: 2px solid var(--g200);
  background: var(--white); font-family: 'Nunito Sans', sans-serif;
  font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all .18s;
  color: var(--g600);
}
.cs-priority-btn:hover { border-color: var(--g400); background: var(--g100); }
.cs-priority-high.cs-priority-active   { border-color: #ef4444; background: #fef2f2; color: #dc2626; }
.cs-priority-medium.cs-priority-active { border-color: #f59e0b; background: #fffbeb; color: #d97706; }
.cs-priority-low.cs-priority-active    { border-color: #22c55e; background: #f0fdf4; color: #16a34a; }

/* Error messages */
.cs-error-msg {
  font-size: 11.5px; color: var(--red); display: flex; align-items: center; gap: 5px;
  font-weight: 600;
}

/* Textarea */
.cs-textarea {
  width: 100%; padding: 13px 16px; border-radius: 9px;
  border: 2px solid #b0c4de; background: #ffffff; color: #0d2b5e;
  font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 500;
  outline: none; resize: vertical; line-height: 1.7;
  transition: border-color .18s, box-shadow .18s;
  -webkit-text-fill-color: #0d2b5e; min-height: 200px;
}
.cs-textarea::placeholder { color: #9badc4; font-weight: 400; -webkit-text-fill-color: #9badc4; }
.cs-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(26,86,219,.14); }
.cs-textarea:hover:not(:focus) { border-color: #7a9cbf; }

.cs-textarea-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 4px;
}
.cs-char-count { font-size: 11px; color: var(--g400); font-weight: 600; margin-left: auto; }
.cs-char-warn  { color: var(--amber); }

/* Anon banner */
.cs-anon-banner {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 18px; border-radius: 10px;
  background: var(--blue-pale); border: 1px solid var(--blue-soft);
}
.cs-anon-icon {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: var(--blue); color: #fff; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
}
.cs-anon-text { font-size: 12.5px; color: var(--g600); line-height: 1.65; }
.cs-anon-text strong { color: var(--navy); display: block; margin-bottom: 2px; font-size: 13px; }

/* ── DROP ZONE ── */
.cs-drop-zone {
  border: 2.5px dashed var(--g200); border-radius: 12px;
  padding: 40px 24px; text-align: center; cursor: pointer;
  transition: all .2s; background: var(--off); position: relative;
  overflow: hidden;
}
.cs-drop-zone:hover   { border-color: var(--blue); background: var(--blue-pale); }
.cs-drop-zone-over    { border-color: var(--blue); background: var(--blue-pale); transform: scale(1.005); }
.cs-drop-zone-has-files { padding: 24px; }
.cs-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

.cs-drop-icon-wrap {
  width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 14px;
  background: var(--g100); border: 1px solid var(--g200);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: var(--g400); transition: all .2s;
}
.cs-drop-icon-over { background: var(--blue-soft); border-color: var(--blue); color: var(--blue); transform: scale(1.1); }
.cs-drop-title { font-size: 14.5px; font-weight: 700; color: var(--g800); margin-bottom: 5px; }
.cs-drop-link  { color: var(--blue); text-decoration: underline; }
.cs-drop-hint  { font-size: 12px; color: var(--g400); }

/* Attachment list */
.cs-attach-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.cs-attach-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 9px;
  border: 1px solid var(--g200); background: var(--white);
  box-shadow: var(--shadow);
}
.cs-attach-icon {
  width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
}
.cs-attach-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cs-attach-name { font-size: 13px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cs-attach-size { font-size: 11px; color: var(--g400); }
.cs-attach-prog { flex: 1; height: 3px; background: var(--g100); border-radius: 999px; overflow: hidden; max-width: 80px; }
.cs-attach-prog-bar { height: 100%; background: var(--green); border-radius: 999px; width: 100%; animation: fillBar .5s ease both; }
.cs-attach-remove {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--g200);
  background: var(--red-lt); color: var(--red); cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 11px;
  transition: all .15s; flex-shrink: 0;
}
.cs-attach-remove:hover { background: var(--red); color: #fff; }

/* Review card */
.cs-review-card {
  background: var(--white); border: 1px solid var(--g200); border-radius: 12px;
  padding: 18px 20px; box-shadow: var(--shadow);
}
.cs-review-title {
  font-size: 12px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: var(--navy); display: flex; align-items: center; gap: 7px; margin-bottom: 14px;
}
.cs-review-title i { color: var(--blue); }
.cs-review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--g100); border: 1px solid var(--g100); border-radius: 8px; overflow: hidden; }
.cs-review-item { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; background: var(--white); }
.cs-review-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--g400); }
.cs-review-value { font-size: 13.5px; font-weight: 600; color: var(--ink); }
.cs-review-priority { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; }
.cs-review-priority-high   { background: #fef2f2; color: #dc2626; }
.cs-review-priority-medium { background: #fffbeb; color: #d97706; }
.cs-review-priority-low    { background: #f0fdf4; color: #16a34a; }

/* ── NAVIGATION ── */
.cs-nav-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 0;
}
.cs-submit-group { display: flex; gap: 10px; }

/* ── BUTTONS ── */
.cs-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 11px 22px; border-radius: 9px; border: none;
  font-family: 'Nunito Sans', sans-serif; font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: all .18s; letter-spacing: .01em; white-space: nowrap;
}
.cs-btn:disabled { opacity: .6; cursor: not-allowed; }
.cs-btn-primary {
  background: var(--blue); color: #fff;
  box-shadow: 0 3px 12px rgba(26,86,219,.35);
}
.cs-btn-primary:hover:not(:disabled) { background: var(--blue-lt); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,86,219,.4); }
.cs-btn-ghost   { background: var(--g100); color: var(--g600); border: 1px solid var(--g200); }
.cs-btn-ghost:hover { background: var(--g200); }
.cs-btn-outline { background: var(--white); color: var(--g600); border: 1.5px solid var(--g200); }
.cs-btn-outline:hover { border-color: var(--g400); background: var(--g100); }
.cs-btn-submit { padding: 12px 28px; font-size: 14px; }

/* Spinner */
.cs-spinner {
  width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  animation: spin .7s linear infinite; flex-shrink: 0;
}

/* ── MODAL ── */
.cs-overlay {
  position: fixed; inset: 0; background: rgba(8,18,40,.75);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 999;
}
.cs-modal {
  background: #fff; border-radius: 18px; width: 100%; max-width: 440px;
  padding: 36px 32px; text-align: center; position: relative; overflow: hidden;
  box-shadow: 0 24px 80px rgba(8,18,40,.35);
  animation: modalIn .3s cubic-bezier(.16,1,.3,1) both;
}
.cs-modal-check {
  width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 18px;
  background: var(--green-lt); color: var(--green);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; position: relative; z-index: 1;
  box-shadow: 0 0 0 8px rgba(5,150,105,.1);
  animation: popIn .5s cubic-bezier(.16,1,.3,1) both .2s;
}
.cs-modal-title {
  font-family: 'Playfair Display', serif; font-size: 1.4rem;
  color: var(--navy); margin: 0 0 10px;
}
.cs-modal-desc { font-size: 13.5px; color: var(--g600); line-height: 1.7; margin: 0 0 24px; }
.cs-modal-detail-block {
  background: var(--off); border: 1px solid var(--g100); border-radius: 10px;
  padding: 4px 0; margin-bottom: 24px; text-align: left;
}
.cs-modal-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 16px; border-bottom: 1px solid var(--g100);
}
.cs-modal-row:last-child { border-bottom: none; }
.cs-modal-key { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--g400); }
.cs-modal-val { font-size: 13px; font-weight: 600; color: var(--ink); }
.cs-modal-ref { font-family: 'Courier New', monospace; color: var(--blue); }
.cs-modal-status {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
  background: var(--amber-lt); color: #92400e;
}
.cs-modal-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); }
.cs-modal-btn { width: 100%; justify-content: center; padding: 13px; font-size: 14px; }

/* Confetti dots */
.cs-modal-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.cs-confetti-dot {
  position: absolute; width: 8px; height: 8px; border-radius: 50%;
  top: -10px; left: calc(var(--i) * 8%);
  background: hsl(calc(var(--i) * 30), 80%, 60%);
  animation: confettiFall 1.2s ease calc(var(--i) * 0.08s) both;
}

/* ── TRANSITIONS ── */
.cs-modal-fade-enter-active { transition: opacity .25s; }
.cs-modal-fade-leave-active { transition: opacity .2s; }
.cs-modal-fade-enter-from,
.cs-modal-fade-leave-to { opacity: 0; }

.cs-attach-list-enter-active { transition: all .25s ease; }
.cs-attach-list-leave-active  { transition: all .2s ease; }
.cs-attach-list-enter-from    { opacity: 0; transform: translateY(-8px); }
.cs-attach-list-leave-to      { opacity: 0; transform: translateX(12px); }

/* ── KEYFRAMES ── */
@keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
@keyframes popIn   { from { opacity:0; transform:scale(.5); } to { opacity:1; transform:scale(1); } }
@keyframes fillBar { from { width:0; } to { width:100%; } }
@keyframes confettiFall {
  0%   { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
}

/* ── RESPONSIVE ── */
@media (max-width: 700px) {
  .cs-header-inner, .cs-body { padding-left: 16px; padding-right: 16px; }
  .cs-row-2 { grid-template-columns: 1fr; }
  .cs-priority-row { flex-direction: column; }
  .cs-steps { gap: 0; }
  .cs-step-label { display: none; }
  .cs-step-line  { width: 28px; }
  .cs-review-grid { grid-template-columns: 1fr; }
  .cs-nav-row { flex-direction: column; gap: 10px; align-items: stretch; }
  .cs-btn { justify-content: center; }
  .cs-submit-group { flex-direction: column; }
}
</style>