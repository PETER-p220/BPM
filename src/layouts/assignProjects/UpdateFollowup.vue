<template>
  <div class="edit-assignment">
    <!-- Background texture -->
    <div class="bg-texture"></div>

    <div class="page-wrapper">
      
      <div class="main-card">
        <!-- Header -->
        <div class="card-header">
          <div class="header-left">
            <div class="header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div class="header-text">
              <span class="header-title">Edit Project</span>
              <span class="header-sub">Modify project details below</span>
            </div>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="card-body">

          <!-- Error summary -->
          <transition name="slide-down">
            <div v-if="Object.keys(errors).length" class="error-summary">
              <div class="error-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="error-content">
                <p class="error-title">Please fix the following:</p>
                <ul>
                  <li v-for="(errorList, field) in errors" :key="field">{{ errorList[0] }}</li>
                </ul>
              </div>
            </div>
          </transition>

          <!-- Fields grid -->
          <div class="fields-grid">

            <!-- Contract Title (read-only) -->
            <div class="field-group full-width">
              <label class="field-label" for="contractTitle">
                <span class="label-dot"></span>
                Contract Title
                <span class="label-badge">Read Only</span>
              </label>
              <div class="input-wrapper readonly">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                <input type="text" id="contractTitle" v-model="projectData.contract.title" readonly />
                <div class="readonly-indicator">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Contract Select -->
            <div class="field-group">
              <label class="field-label" for="contractSelect">
                <span class="label-dot"></span>
                Select Contract
              </label>
              <div class="input-wrapper" :class="{ 'has-error': errors.contract_id }">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <select id="contractSelect" v-model="projectData.contract_id">
                  <option value="">Select a contract</option>
                  <option v-for="contract in contracts" :key="contract.contract_id" :value="contract.contract_id">
                    {{ contract.title }}
                  </option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <transition name="fade">
                <span v-if="errors.contract_id" class="field-error">{{ errors.contract_id[0] }}</span>
              </transition>
            </div>

            <!-- Project Status -->
            <div class="field-group">
              <label class="field-label" for="projectStatus">
                <span class="label-dot"></span>
                Project Status
              </label>
              <div class="input-wrapper" :class="{ 'has-error': errors.project_status }">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <select id="projectStatus" v-model="projectData.project_status">
                  <option value="">Select status</option>
                  <option value="on-progress">On Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <!-- Status pill preview -->
              <transition name="fade">
                <div v-if="projectData.project_status" class="status-preview">
                  <span :class="['status-pill', `status-${projectData.project_status}`]">
                    <span class="status-dot"></span>
                    {{ projectData.project_status === 'on-progress' ? 'On Progress' : projectData.project_status.charAt(0).toUpperCase() + projectData.project_status.slice(1) }}
                  </span>
                </div>
              </transition>
              <transition name="fade">
                <span v-if="errors.project_status" class="field-error">{{ errors.project_status[0] }}</span>
              </transition>
            </div>

            <!-- Follow Up -->
            <div class="field-group full-width">
              <label class="field-label" for="followUp">
                <span class="label-dot"></span>
                Follow Up
              </label>
              <div class="input-wrapper" :class="{ 'has-error': errors.follow_up }">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z"/>
                </svg>
                <select id="followUp" v-model="projectData.follow_up">
                  <option value="">None</option>
                  <option value="on-progress">On Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <transition name="fade">
                <span v-if="errors.follow_up" class="field-error">{{ errors.follow_up[0] }}</span>
              </transition>
            </div>

          </div>

          <!-- Divider -->
          <div class="section-divider"></div>

          <!-- Actions -->
          <div class="action-bar">
            <button @click="updateProject" class="btn-primary" :disabled="isLoading" :class="{ 'loading': isLoading }">
              <transition name="fade" mode="out-in">
                <span v-if="!isLoading" class="btn-content" key="idle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Update Project
                </span>
                <span v-else class="btn-content" key="loading">
                  <svg class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Saving…
                </span>
              </transition>
            </button>

            <router-link to="/follow-up" class="btn-cancel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const projectData = ref({
  project_id: '',
  contract_id: '',
  contract: { title: '' },
  project_status: '',
  follow_up: ''
});
const contracts = ref([]);
const errors = ref({});
const isLoading = ref(false);

onMounted(async () => {
  await Promise.all([fetchProjectData(), fetchContracts()]);
});

async function fetchProjectData() {
  try {
    const response = await axios.get(`api/projects/${route.params.project_id}`);
    const data = response.data.data;
    projectData.value = {
      project_id: data.project_id || '',
      contract_id: data.contract_id || '',
      contract: { title: data.contract?.title || 'NA' },
      project_status: data.project_status || '',
      follow_up: data.follow_up || ''
    };
  } catch (error) {
    handleError(error);
  }
}

async function fetchContracts() {
  try {
    const response = await axios.get('api/c-dropdown');
    contracts.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function updateProject() {
  isLoading.value = true;
  errors.value = {};
  try {
    const payload = {
      contract_id: projectData.value.contract_id,
      project_status: projectData.value.project_status,
      follow_up: projectData.value.follow_up || null
    };
    const response = await axios.put(`api/projects/${route.params.project_id}`, payload);
    toast.success(response.data.message);
    router.push('/follow-up');
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      handleError(error);
    }
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  toast.error(message);
}

function closeModal() {
  router.push('/follow-up');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

/* ── Root ── */
.edit-assignment {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
}

/* Subtle dot pattern texture */
.bg-texture {
  position: fixed;
  inset: 0;
  background-size: 28px 28px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

/* ── Layout ── */
.page-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 760px;
  animation: pageIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Sidebar accent ── */
.sidebar-accent {
  width: 52px;
  flex-shrink: 0;
  background: #111827;
  border-radius: 12px 0 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 28px 0 24px;
  gap: 16px;
}

.accent-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.accent-label span {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: #6b7280;
  text-transform: uppercase;
}

.accent-label span:first-child {
  color: #d1d5db;
}

.accent-line {
  width: 1px;
  flex: 1;
  background: #374151;
  margin: 0 auto;
}

/* ── Main card ── */
.main-card {
  flex: 1;
  background: #ffffff;
  border-radius: 0 12px 12px 0;
  border: 1px solid #e5e7eb;
  border-left: none;
  box-shadow:
    0 1px 2px rgba(0,0,0,0.04),
    0 4px 16px rgba(0,0,0,0.06),
    0 12px 40px rgba(0,0,0,0.04);
  overflow: hidden;
}

/* ── Card header ── */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 38px;
  height: 38px;
  background: #111827;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
}

.header-sub {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.close-btn:hover {
  background: #f9fafb;
  color: #111827;
  border-color: #d1d5db;
}

/* ── Card body ── */
.card-body {
  padding: 28px 28px 24px;
}

/* ── Error summary ── */
.error-summary {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 24px;
}

.error-icon {
  flex-shrink: 0;
  color: #ef4444;
  margin-top: 1px;
}

.error-content {
  flex: 1;
}

.error-title {
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 6px;
}

.error-content ul {
  margin: 0;
  padding-left: 16px;
}

.error-content li {
  font-size: 13px;
  color: #b91c1c;
  margin-bottom: 2px;
}

/* ── Fields ── */
.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-group.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.label-dot {
  width: 5px;
  height: 5px;
  background: #111827;
  border-radius: 50%;
  flex-shrink: 0;
}

.label-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 500;
  font-family: 'DM Mono', monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: #f3f4f6;
  color: #9ca3af;
  padding: 2px 7px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
}

/* ── Input wrapper ── */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}

.input-wrapper:focus-within:not(.readonly) {
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.07);
}

.input-wrapper.has-error {
  border-color: #fca5a5;
  background: #fff9f9;
}

.input-wrapper.readonly {
  background: #f9fafb;
  border-color: #e5e7eb;
  cursor: default;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  pointer-events: none;
  flex-shrink: 0;
}

.input-wrapper input,
.input-wrapper select {
  width: 100%;
  padding: 10px 12px 10px 36px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #111827;
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.input-wrapper input[readonly] {
  color: #6b7280;
  cursor: default;
}

.input-wrapper select {
  padding-right: 36px;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: #9ca3af;
  pointer-events: none;
}

.readonly-indicator {
  position: absolute;
  right: 12px;
  color: #d1d5db;
}

/* ── Status preview ── */
.status-preview {
  margin-top: 2px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 3px 10px 3px 8px;
  border-radius: 20px;
  font-family: 'DM Mono', monospace;
  text-transform: uppercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-on-progress {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fcd34d;
}
.status-on-progress .status-dot { background: #f59e0b; }

.status-completed {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #86efac;
}
.status-completed .status-dot { background: #22c55e; }

.status-failed {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fda4af;
}
.status-failed .status-dot { background: #f43f5e; }

/* ── Field error ── */
.field-error {
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── Section divider ── */
.section-divider {
  margin: 24px 0;
  height: 1px;
  background: #f3f4f6;
  position: relative;
}

.section-divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 1px;
  background: #111827;
}

/* ── Action bar ── */
.action-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Primary button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: #111827;
  color: #ffffff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid #111827;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  letter-spacing: -0.01em;
}

.btn-primary:hover:not(:disabled) {
  background: #1f2937;
  box-shadow: 0 4px 12px rgba(17,24,39,0.2);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

/* Cancel button */
.btn-cancel {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  background: #ffffff;
  color: #374151;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

/* ── Spinner ── */
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Transitions ── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 560px) {
  .sidebar-accent { display: none; }
  .main-card { border-radius: 12px; border-left: 1px solid #e5e7eb; }
  .fields-grid { grid-template-columns: 1fr; }
  .field-group.full-width { grid-column: 1; }
  .card-body { padding: 20px; }
}
</style>