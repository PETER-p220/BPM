<template>
  <div class="at-root">
    <div class="at-container">

      <!-- Card -->
      <div class="at-card">

        <!-- Header -->
        <div class="at-header">
          <div class="at-header-left">
            <div class="at-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <h1 class="at-header-title">Register New Tender</h1>
              <p class="at-header-sub">Fill in the details below to submit a new procurement tender</p>
            </div>
          </div>
          <button class="at-close-btn" @click="closeModal" title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="at-body">

          <!-- Section: Basic Info -->
          <div class="at-section">
            <div class="at-section-label">
              <span class="at-section-num">01</span>
              Basic Information
            </div>

            <div class="at-grid-2">
              <div class="at-field">
                <label class="at-label" for="tenderTitle">Tender Title</label>
                <input
                  id="tenderTitle"
                  type="text"
                  class="at-input"
                  placeholder="e.g. Supply of Office Equipment"
                  v-model="newTenderData.title"
                />
              </div>
              <div class="at-field">
                <label class="at-label" for="tenderNumber">Tender Number</label>
                <input
                  id="tenderNumber"
                  type="text"
                  class="at-input"
                  placeholder="e.g. TDR-2024-089"
                  v-model="newTenderData.tender_number"
                />
              </div>
            </div>

            <div class="at-grid-2">
              <div class="at-field">
                <label class="at-label" for="tenderSource">Tender Source</label>
                <input
                  id="tenderSource"
                  type="text"
                  class="at-input"
                  placeholder="e.g. Government Portal"
                  v-model="newTenderData.tender_source"
                />
              </div>
              <div class="at-field">
                <label class="at-label" for="procurementEntity">Procurement Entity</label>
                <input
                  id="procurementEntity"
                  type="text"
                  class="at-input"
                  placeholder="e.g. Ministry of Finance"
                  v-model="newTenderData.procurement_entity"
                />
              </div>
            </div>
          </div>

          <div class="at-divider"></div>

          <!-- Section: Classification -->
          <div class="at-section">
            <div class="at-section-label">
              <span class="at-section-num">02</span>
              Classification &amp; Dates
            </div>

            <div class="at-grid-2">
              <div class="at-field">
                <label class="at-label" for="tenderType">Tender Type</label>
                <div class="at-select-wrap">
                  <select
                    id="tenderType"
                    class="at-select"
                    v-model="newTenderData.tender_type"
                  >
                    <option value="" disabled>Select a type…</option>
                    <option value="goods">Goods</option>
                    <option value="works">Works</option>
                    <option value="consultancy">Consultancy</option>
                    <option value="non-consultancy">Non-Consultancy</option>
                  </select>
                  <span class="at-select-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div class="at-field">
                <label class="at-label" for="dateOfPublication">Date of Publication</label>
                <input
                  id="dateOfPublication"
                  type="date"
                  class="at-input"
                  v-model="newTenderData.date_of_Publication"
                />
              </div>
            </div>

            <div class="at-grid-2">
              <div class="at-field">
                <label class="at-label" for="bidSubmission">Bid Submission Date</label>
                <input
                  id="bidSubmission"
                  type="date"
                  class="at-input"
                  v-model="newTenderData.bid_submission"
                />
              </div>
              <div class="at-field">
                <label class="at-label" for="expiredAt">Expiration Date</label>
                <input
                  id="expiredAt"
                  type="date"
                  class="at-input"
                  v-model="newTenderData.expired_at"
                />
              </div>
            </div>
          </div>

          <div class="at-divider"></div>

          <!-- Section: Attachment -->
          <div class="at-section">
            <div class="at-section-label">
              <span class="at-section-num">03</span>
              Attachment
            </div>

            <div
              class="at-dropzone"
              :class="{ 'at-dropzone--has-file': selectedFileName }"
              @dragover.prevent="dragover = true"
              @dragleave.prevent="dragover = false"
              @drop.prevent="handleDrop"
              :style="dragover ? 'border-color: var(--sage); background: var(--sage-pale);' : ''"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                id="attachment"
                style="display:none"
                @change="handleFileUpload"
              />
              <div v-if="!selectedFileName" class="at-dropzone-empty">
                <div class="at-drop-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p class="at-drop-title">Drag &amp; drop a file here, or <span class="at-drop-link">browse</span></p>
                <p class="at-drop-hint">PDF, DOC, DOCX, XLS up to 10 MB</p>
              </div>
              <div v-else class="at-dropzone-file">
                <div class="at-file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="at-file-info">
                  <span class="at-file-name">{{ selectedFileName }}</span>
                  <span class="at-file-size">{{ selectedFileSize }}</span>
                </div>
                <button class="at-file-remove" @click.stop="removeFile" title="Remove file">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="at-actions">
            <router-link to="/tenders" class="at-btn-cancel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </router-link>
            <button
              class="at-btn-submit"
              @click="addTender"
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="at-btn-submit-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Save Tender
              </span>
              <span v-else class="at-btn-submit-inner">
                <svg class="at-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                  <circle cx="12" cy="12" r="10" stroke-opacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
                </svg>
                Saving…
              </span>
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const fileInput = ref(null)
const dragover = ref(false)
const selectedFileName = ref('')
const selectedFileSize = ref('')

const newTenderData = ref({
  title: '',
  tender_source: '',
  procurement_entity: '',
  tender_number: '',
  tender_type: '',
  date_of_Publication: '',
  expired_at: '',
  bid_submission: '',
  attachment: null,
})
const isLoading = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) setFile(file)
}

function handleDrop(event) {
  dragover.value = false
  const file = event.dataTransfer.files[0]
  if (file) setFile(file)
}

function setFile(file) {
  newTenderData.value.attachment = file
  selectedFileName.value = file.name
  selectedFileSize.value = file.size > 1024 * 1024
    ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    : (file.size / 1024).toFixed(0) + ' KB'
}

function removeFile() {
  newTenderData.value.attachment = null
  selectedFileName.value = ''
  selectedFileSize.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function addTender() {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('title',                newTenderData.value.title)
    formData.append('tender_source',        newTenderData.value.tender_source)
    formData.append('procurement_entity',   newTenderData.value.procurement_entity)
    formData.append('tender_number',        newTenderData.value.tender_number)
    formData.append('tender_type',          newTenderData.value.tender_type)
    formData.append('date_of_Publication',  newTenderData.value.date_of_Publication)
    formData.append('expired_at',           newTenderData.value.expired_at)
    formData.append('bid_submission',       newTenderData.value.bid_submission)
    if (newTenderData.value.attachment) {
      formData.append('attachment', newTenderData.value.attachment)
    }

    const response = await axios.post('/api/tenders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.status === 'success') {
      toast.success(response.data.message)
      resetForm()
    } else {
      toast.error(response.data.message)
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.values(error.response.data.errors).flat().forEach(msg => toast.error(msg))
    } else {
      toast.error('An error occurred while creating the tender.')
    }
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  newTenderData.value = {
    title: '', tender_source: '', procurement_entity: '',
    tender_number: '', tender_type: '', date_of_Publication: '',
    expired_at: '', bid_submission: '', attachment: null,
  }
  removeFile()
}

function closeModal() {
  window.location.href = '/tenders'
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

.at-root {
  /* ── Palette: Slate / Sage / Terracotta / Cream ── */
  --slate-900: #1c1917;
  --slate-800: #292524;
  --slate-700: #44403c;
  --slate-500: #78716c;
  --slate-300: #d6d3d1;
  --slate-100: #f5f5f4;
  --slate-50:  #fafaf9;

  --sage:      #4d7c6f;
  --sage-deep: #2d5a4e;
  --sage-mid:  #3d6e60;
  --sage-lt:   #6b9e8e;
  --sage-pale: #edf5f2;
  --sage-soft: #c4ddd7;

  --terra:     #c2674a;
  --terra-pale:#fdf0eb;

  --cream:     #fefcf8;
  --cream-2:   #f7f3ed;

  --border:    rgba(28,25,23,.1);
  --border-md: rgba(28,25,23,.16);
  --shadow-sm: 0 1px 3px rgba(28,25,23,.07), 0 1px 2px rgba(28,25,23,.04);
  --shadow-lg: 0 12px 40px rgba(28,25,23,.1), 0 4px 16px rgba(28,25,23,.06);

  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  background: var(--cream-2);
  min-height: 100vh;
  padding: 48px 20px;
  -webkit-font-smoothing: antialiased;
}

.at-container {
  max-width: 820px;
  margin: 0 auto;
}

/* ── Card ── */
.at-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

/* ── Header ── */
.at-header {
  background: var(--sage-deep);
  padding: 22px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.at-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.at-header-icon {
  width: 42px; height: 42px; border-radius: 11px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.18);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.9); flex-shrink: 0;
}
.at-header-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 20px; font-weight: 400;
  color: #fff; margin: 0; line-height: 1.2;
}
.at-header-sub {
  font-size: 12px; color: rgba(255,255,255,.5);
  margin: 3px 0 0; font-weight: 400; line-height: 1.4;
}
.at-close-btn {
  width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(255,255,255,.22);
  background: rgba(255,255,255,.1); color: rgba(255,255,255,.7);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s; flex-shrink: 0;
}
.at-close-btn:hover { background: rgba(255,255,255,.2); color: #fff; }

/* ── Body ── */
.at-body { padding: 32px; display: flex; flex-direction: column; gap: 0; }

/* ── Section ── */
.at-section { margin-bottom: 8px; }
.at-section-label {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 700; letter-spacing: .18em;
  text-transform: uppercase; color: var(--slate-500);
  margin-bottom: 20px;
}
.at-section-num {
  font-family: 'DM Serif Display', serif;
  font-size: 20px; color: var(--cream-2);
  line-height: 1; font-weight: 400;
}

.at-divider {
  height: 1px; background: var(--border);
  margin: 24px 0;
}

/* ── Grid ── */
.at-grid-2 {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  margin-bottom: 20px;
}
.at-grid-2:last-child { margin-bottom: 0; }

/* ── Field ── */
.at-field { display: flex; flex-direction: column; gap: 7px; }
.at-label {
  font-size: 13px; font-weight: 600; color: var(--slate-700);
  letter-spacing: .01em;
}

/* ── Inputs ── */
.at-input {
  width: 100%; padding: 10px 14px;
  border: 1.5px solid var(--border-md);
  border-radius: 9px;
  background: var(--cream);
  color: var(--slate-900);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 400;
  outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.at-input::placeholder { color: var(--slate-300); }
.at-input:hover  { border-color: var(--sage-soft); }
.at-input:focus  {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgba(77,124,111,.15);
  background: #fff;
}
input[type="date"].at-input { color-scheme: light; }

/* ── Select ── */
.at-select-wrap { position: relative; }
.at-select {
  width: 100%; padding: 10px 36px 10px 14px;
  border: 1.5px solid var(--border-md);
  border-radius: 9px;
  background: var(--cream);
  color: var(--slate-900);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 400;
  appearance: none; outline: none; cursor: pointer;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.at-select:hover  { border-color: var(--sage-soft); }
.at-select:focus  {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgba(77,124,111,.15);
  background: #fff;
}
.at-select-arrow {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  pointer-events: none; color: var(--slate-500);
}

/* ── Dropzone ── */
.at-dropzone {
  border: 2px dashed var(--border-md);
  border-radius: 14px;
  background: var(--cream);
  padding: 32px 24px;
  text-align: center; cursor: pointer;
  transition: border-color .2s, background .2s;
}
.at-dropzone:hover { border-color: var(--sage-soft); background: var(--sage-pale); }
.at-dropzone--has-file { border-style: solid; border-color: var(--sage-soft); background: var(--sage-pale); }

.at-dropzone-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.at-drop-icon { color: var(--slate-300); }
.at-drop-title { font-size: 14px; color: var(--slate-700); font-weight: 500; }
.at-drop-link  { color: var(--sage); text-decoration: underline; cursor: pointer; }
.at-drop-hint  { font-size: 12px; color: var(--slate-500); }

.at-dropzone-file { display: flex; align-items: center; gap: 14px; text-align: left; }
.at-file-icon {
  width: 44px; height: 44px; border-radius: 10px;
  background: var(--sage-pale); color: var(--sage);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; border: 1px solid var(--sage-soft);
}
.at-file-info { flex: 1; min-width: 0; }
.at-file-name { display: block; font-size: 13.5px; font-weight: 600; color: var(--slate-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.at-file-size { display: block; font-size: 12px; color: var(--slate-500); margin-top: 3px; }
.at-file-remove {
  width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
  background: rgba(194,103,74,.1); border: 1px solid rgba(194,103,74,.2);
  color: var(--terra); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.at-file-remove:hover { background: rgba(194,103,74,.2); }

/* ── Actions ── */
.at-actions {
  display: flex; align-items: center; gap: 12px;
  margin-top: 32px; padding-top: 24px;
  border-top: 1px solid var(--border);
}
.at-btn-cancel {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px; border-radius: 9px;
  border: 1.5px solid var(--border-md);
  background: transparent; color: var(--slate-700);
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px; font-weight: 600;
  text-decoration: none; cursor: pointer;
  transition: border-color .15s, background .15s, color .15s;
}
.at-btn-cancel:hover { border-color: var(--slate-300); background: var(--slate-50); color: var(--slate-900); }

.at-btn-submit {
  display: inline-flex; align-items: center;
  padding: 10px 26px; border-radius: 9px;
  border: none; background: var(--sage);
  color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  transition: background .15s, transform .12s, opacity .15s;
  margin-left: auto;
}
.at-btn-submit:hover:not(:disabled) { background: var(--sage-mid); transform: translateY(-1px); }
.at-btn-submit:active:not(:disabled) { transform: scale(.97); }
.at-btn-submit:disabled { opacity: .65; cursor: not-allowed; }
.at-btn-submit-inner { display: flex; align-items: center; gap: 8px; }

/* Spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.at-spin { animation: spin .7s linear infinite; }

/* ── Responsive ── */
@media (max-width: 600px) {
  .at-root     { padding: 20px 12px; }
  .at-body     { padding: 20px; }
  .at-header   { padding: 18px 20px; }
  .at-grid-2   { grid-template-columns: 1fr; }
  .at-actions  { flex-direction: column-reverse; }
  .at-btn-cancel, .at-btn-submit { width: 100%; justify-content: center; margin: 0; }
}
</style>