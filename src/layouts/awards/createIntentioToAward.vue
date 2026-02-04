<template>
  <div class="page-wrapper">
    <!-- Ambient background -->
    <div class="bg-ambient">
      <div class="ambient-orb orb-1"></div>
      <div class="ambient-orb orb-2"></div>
    </div>

    <div class="page-inner">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/intention-to-award" class="crumb-link">
          <i class="fas fa-folder-open"></i> Intentions
        </router-link>
        <i class="fas fa-chevron-right crumb-sep"></i>
        <span class="crumb-current">Create New</span>
      </nav>

      <!-- Card -->
      <div class="form-card">
        <!-- Header -->
        <div class="card-head">
          <div class="head-left">
            <div class="head-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="head-text">
              <h1 class="head-title">Intention to Award</h1>
              <p class="head-sub">Fill in the details below to create a new intention</p>
            </div>
          </div>
          <router-link to="/intention-to-award" class="close-btn" title="Discard">
            <i class="fas fa-times"></i>
          </router-link>
        </div>

        <!-- Divider -->
        <div class="card-divider"></div>

        <!-- Body -->
        <div class="card-body">

          <!-- Step indicator -->
          <div class="steps">
            <div class="step active" :class="{ completed: stepCompleted(1) }">
              <div class="step-dot">
                <i v-if="stepCompleted(1)" class="fas fa-check"></i>
                <span v-else>1</span>
              </div>
              <span class="step-label">Select Tender</span>
            </div>
            <div class="step-line" :class="{ filled: stepCompleted(1) }"></div>
            <div class="step" :class="{ active: stepCompleted(1), completed: stepCompleted(2) }">
              <div class="step-dot">
                <i v-if="stepCompleted(2)" class="fas fa-check"></i>
                <span v-else>2</span>
              </div>
              <span class="step-label">Upload Document</span>
            </div>
            <div class="step-line" :class="{ filled: stepCompleted(2) }"></div>
            <div class="step" :class="{ active: stepCompleted(2) }">
              <div class="step-dot">
                <span>3</span>
              </div>
              <span class="step-label">Submit</span>
            </div>
          </div>

          <!-- Form fields -->
          <div class="fields">

            <!-- Tender Select -->
            <div class="field-group">
              <label class="field-label">
                <i class="fas fa-tag"></i>
                Select Tender
                <span class="required">*</span>
              </label>
              <div class="select-wrap" :class="{ focused: selectFocused, error: !intentionData.tender_id && submitted }">
                <select
                  v-model="intentionData.tender_id"
                  class="styled-select"
                  @focus="selectFocused = true"
                  @blur="selectFocused = false"
                >
                  <option disabled value="">Choose a tender...</option>
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                    {{ tender.title }}
                  </option>
                </select>
                <i class="fas fa-chevron-down select-arrow"></i>
              </div>
              <p v-if="!intentionData.tender_id && submitted" class="field-error">
                <i class="fas fa-exclamation-circle"></i> Please select a tender
              </p>
            </div>

            <!-- File Upload -->
            <div class="field-group">
              <label class="field-label">
                <i class="fas fa-paperclip"></i>
                Intention Document
                <span class="required">*</span>
              </label>

              <!-- Drop zone -->
              <div
                class="dropzone"
                :class="{
                  dragover: isDragOver,
                  hasFile: intentionData.intention_file,
                  error: !intentionData.intention_file && submitted
                }"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleDrop"
                @click="$refs.fileInput.click()"
              >
                <!-- No file state -->
                <div v-if="!intentionData.intention_file" class="dropzone-empty">
                  <div class="dropzone-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p class="dropzone-text">
                    <span class="dropzone-highlight">Click to upload</span> or drag &amp; drop
                  </p>
                  <p class="dropzone-hint">PDF files only · Max 10 MB</p>
                </div>

                <!-- File selected state -->
                <div v-else class="dropzone-file">
                  <div class="file-preview-icon">
                    <i class="fas fa-file-pdf"></i>
                  </div>
                  <div class="file-info">
                    <span class="file-name">{{ intentionData.intention_file.name }}</span>
                    <span class="file-size">{{ formatSize(intentionData.intention_file.size) }} · PDF</span>
                  </div>
                  <button type="button" class="file-remove" @click.stop="removeFile">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                class="hidden-input"
                @change="handleFileUpload"
              />

              <p v-if="!intentionData.intention_file && submitted" class="field-error">
                <i class="fas fa-exclamation-circle"></i> Please upload a PDF document
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <router-link to="/intention-to-award" class="btn-cancel">
              <i class="fas fa-arrow-left"></i> Cancel
            </router-link>
            <button class="btn-submit" @click="createIntention" :disabled="isLoading">
              <span v-if="!isLoading" class="btn-content">
                <i class="fas fa-check-circle"></i> Save Intention
              </span>
              <span v-else class="btn-content">
                <i class="fas fa-spinner fa-spin"></i> Saving...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const fileInput = ref(null);

const intentionData = ref({
  tender_id: '',
  intention_file: null,
});

const tenders = ref([]);
const isLoading = ref(false);
const isDragOver = ref(false);
const selectFocused = ref(false);
const submitted = ref(false);

onMounted(async () => {
  await fetchTenders();
});

async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

function stepCompleted(step) {
  if (step === 1) return !!intentionData.value.tender_id;
  if (step === 2) return !!intentionData.value.intention_file;
  return false;
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  validateAndSetFile(file);
}

function handleDrop(event) {
  isDragOver.value = false;
  const file = event.dataTransfer.files[0];
  validateAndSetFile(file);
}

function validateAndSetFile(file) {
  if (!file) return;
  if (file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must be under 10 MB.');
    return;
  }
  intentionData.value.intention_file = file;
}

function removeFile() {
  intentionData.value.intention_file = null;
  if (fileInput.value) fileInput.value.value = '';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

async function createIntention() {
  submitted.value = true;

  if (!intentionData.value.tender_id || !intentionData.value.intention_file) {
    toast.error('Please fill in all required fields.');
    return;
  }

  isLoading.value = true;

  const formData = new FormData();
  formData.append('tender_id', intentionData.value.tender_id);
  formData.append('intention_file', intentionData.value.intention_file);

  try {
    const response = await axios.post('api/intention-to-award', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.status) {
      toast.success(response.data.message);
      router.push('/intention-to-award');
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response?.data?.message) {
    message = error.response.data.message;
    if (error.response.data.results?.intention?.error) {
      message += ': ' + error.response.data.results.intention.error;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}
</script>

<style scoped>
/* ─── Reset ─── */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ─── Page ─── */
.page-wrapper {
  position: relative;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 2rem 1.5rem 3rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

/* Subtle ambient orbs */
.bg-ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.18;
}
.orb-1 {
  width: 420px; height: 420px;
  background: #3b82f6;
  top: -120px; left: -100px;
}
.orb-2 {
  width: 320px; height: 320px;
  background: #10b981;
  bottom: -80px; right: -80px;
}

.page-inner {
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
}

/* ─── Breadcrumb ─── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8125rem;
  color: #6b7280;
}
.crumb-link {
  color: #6b7280;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: color 0.2s;
}
.crumb-link:hover { color: #283747; }
.crumb-link i { font-size: 0.75rem; }
.crumb-sep { font-size: 0.625rem; color: #9ca3af; }
.crumb-current { color: #283747; font-weight: 600; }

/* ─── Card ─── */
.form-card {
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 1px 2px rgba(0,0,0,0.04),
    0 8px 32px rgba(0,0,0,0.07);
  border: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
  animation: cardIn 0.35s cubic-bezier(.22,.61,0,1) both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Header ─── */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem 1.25rem;
  background: linear-gradient(135deg, #1e293b 0%, #283747 100%);
}
.head-left { display: flex; align-items: center; gap: 1rem; }
.head-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
  color: #fff;
}
.head-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
.head-sub {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
  margin-top: 0.15rem;
}
.close-btn {
  width: 34px; height: 34px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.close-btn:hover {
  background: rgba(255,255,255,0.16);
  color: #fff;
}

/* ─── Divider ─── */
.card-divider { height: 1px; background: #eee; }

/* ─── Body ─── */
.card-body { padding: 1.75rem; }

/* ─── Steps ─── */
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 2rem;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
}
.step-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #9ca3af;
  transition: all 0.3s;
}
.step.active .step-dot {
  border-color: #283747;
  color: #283747;
}
.step.completed .step-dot {
  background: #283747;
  border-color: #283747;
  color: #fff;
}
.step-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: color 0.3s;
}
.step.active .step-label,
.step.completed .step-label { color: #283747; }
.step-line {
  width: 64px; height: 2px;
  background: #e5e7eb;
  margin-bottom: 1.35rem;
  border-radius: 1px;
  transition: background 0.4s;
}
.step-line.filled { background: #283747; }

/* ─── Fields ─── */
.fields { display: flex; flex-direction: column; gap: 1.6rem; }

.field-group { display: flex; flex-direction: column; gap: 0.45rem; }

.field-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.field-label i { color: #283747; font-size: 0.75rem; }
.required { color: #ef4444; margin-left: 0.1rem; }

/* ─── Select ─── */
.select-wrap {
  position: relative;
  border-radius: 10px;
  border: 1.5px solid #d1d5db;
  background: #fafafa;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.select-wrap.focused {
  border-color: #283747;
  box-shadow: 0 0 0 3px rgba(40,55,71,0.12);
  background: #fff;
}
.select-wrap.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
}
.styled-select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.7rem 2.2rem 0.7rem 1rem;
  font-size: 0.9rem;
  color: #111827;
  cursor: pointer;
  border-radius: 10px;
}
.styled-select option:first-child { color: #9ca3af; }
.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.7rem;
  pointer-events: none;
  transition: transform 0.25s;
}
.select-wrap.focused .select-arrow { transform: translateY(-50%) rotate(180deg); }

/* ─── Dropzone ─── */
.dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.dropzone:hover,
.dropzone.dragover {
  border-color: #283747;
  background: rgba(40,55,71,0.03);
}
.dropzone.dragover { transform: scale(1.015); }
.dropzone.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
}
.dropzone.hasFile {
  border-style: solid;
  border-color: #10b981;
  background: #f0fdf4;
}

/* Empty state */
.dropzone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 1rem;
  gap: 0.5rem;
}
.dropzone-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: rgba(40,55,71,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  color: #283747;
  margin-bottom: 0.3rem;
}
.dropzone-text {
  font-size: 0.88rem;
  color: #6b7280;
}
.dropzone-highlight {
  font-weight: 700;
  color: #283747;
}
.dropzone-hint {
  font-size: 0.775rem;
  color: #9ca3af;
}

/* File selected state */
.dropzone-file {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
}
.file-preview-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: #dcfce7;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.15rem;
  color: #16a34a;
  flex-shrink: 0;
}
.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}
.file-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-size {
  font-size: 0.775rem;
  color: #6b7280;
}
.file-remove {
  width: 30px; height: 30px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #9ca3af;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem;
  transition: all 0.2s;
  flex-shrink: 0;
}
.file-remove:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

/* Hidden input */
.hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 0;
  height: 0;
}

/* ─── Inline Errors ─── */
.field-error {
  font-size: 0.78rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  animation: shake 0.3s ease;
}
.field-error i { font-size: 0.72rem; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}

/* ─── Actions ─── */
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}
.btn-cancel {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}
.btn-cancel:hover {
  color: #283747;
  background: #f3f4f6;
}
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  padding: 0.65rem 1.6rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e293b 0%, #283747 100%);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.15s;
}
.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%);
  pointer-events: none;
}
.btn-submit:hover {
  box-shadow: 0 4px 14px rgba(40,55,71,0.35);
  transform: translateY(-1px);
}
.btn-submit:active { transform: translateY(0); }
.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>