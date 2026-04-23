<template>
  <div class="minutes-page">
    <div class="page-header">
      <div class="header-content">
        <div style="display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:0.5rem;">
          <div style="width:44px;height:44px;border-radius:16px;background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-file-alt" style="font-size:18px;color:#fff;"></i>
          </div>
        </div>
        <h1 class="page-title">Meeting Minutes</h1>
        <p class="page-subtitle">Create official HR meeting records</p>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.show" 
         class="notification" 
         :class="`notification--${notification.type}`"
         role="alert">
      <div class="notification-icon">
        <i v-if="notification.type === 'success'" class="fas fa-check-circle"></i>
        <i v-else-if="notification.type === 'error'" class="fas fa-exclamation-circle"></i>
      </div>
      <div class="notification-content">
        <strong>{{ notification.title }}</strong>
        <p>{{ notification.message }}</p>
      </div>
      <button class="notification-close" @click="notification.show = false">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Form Only -->
    <div class="form-card">
      <div class="card-header">
        <h2 class="card-title">Create New Meeting Record</h2>
      </div>

      <form @submit.prevent="submitMinutes" class="minutes-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Meeting Title <span class="required">*</span>
            </label>
            <input
              v-model="form.meeting_title"
              type="text"
              class="form-control"
              placeholder="e.g. HR Monthly Review – February 2026"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Meeting Date <span class="required">*</span>
            </label>
            <input
              v-model="form.meeting_date"
              type="date"
              class="form-control"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            Attendees <span class="required">*</span>
          </label>
          <textarea
            v-model="form.attendees"
            class="form-control textarea"
            placeholder="One name per line&#10;John Doe&#10;Jane Smith&#10;..."
            rows="5"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">
            Agenda <span class="required">*</span>
          </label>
          <textarea
            v-model="form.agenda"
            class="form-control textarea"
            placeholder="• Welcome and introductions&#10;• Review of previous action items&#10;..."
            rows="6"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Key Discussion Points</label>
          <textarea
            v-model="form.discussion"
            class="form-control textarea"
            placeholder="Summary of main topics discussed..."
            rows="6"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Decisions / Action Items</label>
          <textarea
            v-model="form.decisions"
            class="form-control textarea"
            placeholder="• Action: Prepare Q1 budget – Responsible: Finance – Due: 28 Feb&#10;..."
            rows="6"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Next Meeting</label>
          <input
            v-model="form.next_meeting"
            type="text"
            class="form-control"
            placeholder="e.g. 15 March 2026 at 10:00 AM"
          />
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <i class="fas fa-spinner fa-spin"></i> Saving...
            </span>
            <span v-else>
              <i class="fas fa-save"></i> Save Minutes
            </span>
          </button>

          <button
            type="button"
            class="btn btn-outline"
            @click="resetForm"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const form = ref({
  meeting_title: '',
  meeting_date: '',
  attendees: '',
  agenda: '',
  discussion: '',
  decisions: '',
  next_meeting: ''
})

const isSubmitting = ref(false)

const notification = ref({
  show: false,
  type: 'success', // success | error
  title: '',
  message: ''
})

const showNotification = (type, title, message, autoClose = true) => {
  notification.value = { show: true, type, title, message }
  if (autoClose) {
    setTimeout(() => { notification.value.show = false }, 4800)
  }
}

const submitMinutes = async () => {
  isSubmitting.value = true

  try {
    const response = await axios.post('/api/meeting-minutes', form.value)

    if (response.data?.status === true) {
      showNotification('success', 'Success', 'Meeting minutes created successfully')
      resetForm()
    } else {
      showNotification('error', 'Error', response.data?.message || 'Failed to save minutes')
    }
  } catch (err) {
    console.error(err)
    showNotification('error', 'Connection Error', 'Could not reach the server. Please check your internet connection.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    meeting_title: '',
    meeting_date: '',
    attendees: '',
    agenda: '',
    discussion: '',
    decisions: '',
    next_meeting: ''
  }
}

onMounted(() => {
  // No need to fetch records anymore
})
</script>

<style scoped>
.minutes-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #183b63;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #7a93af;
  font-size: 1.05rem;
}

/* Notification – top right fixed */
.notification {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.12);
  max-width: 400px;
  animation: slideIn 0.35s ease-out;
}

.notification--success {
  background: #ecfdf5;
  border-left: 5px solid #10b981;
  color: #065f46;
}

.notification--error {
  background: #fef2f2;
  border-left: 5px solid #ef4444;
  color: #7f1d1d;
}

.notification-icon { font-size: 1.5rem; }
.notification-content strong { display: block; margin-bottom: 0.25rem; }

.notification-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.notification-close:hover { opacity: 1; }

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #dce7f3;
  box-shadow: 0 4px 12px rgba(25,79,146,0.06);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #edf2fa;
  background: linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%);
}

.card-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #183b63;
}

/* Form Layout */
.minutes-form {
  padding: 1.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #183b63;
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-control {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #d9e6f3;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #183b63;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-control:focus {
  outline: none;
  border-color: #2f78dd;
  box-shadow: 0 0 0 3px rgba(47,120,221,0.12);
}

.textarea {
  resize: vertical;
  min-height: 110px;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid #edf2fa;
}

.btn {
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg,#194f92 0%,#2f78dd 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 20px rgba(35,96,182,0.22);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 12px 28px rgba(35,96,182,0.3);
}

.btn-outline {
  background: white;
  border: 1px solid #d9e6f3;
  color: #4a6a8a;
}

.btn-outline:hover:not(:disabled) {
  background: #f7faff;
  border-color: #2f78dd;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animation */
@keyframes slideIn {
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .minutes-page {
    padding: 1.25rem;
  }
  
  .form-card {
    margin: 0 -1rem;
  }
}
</style>