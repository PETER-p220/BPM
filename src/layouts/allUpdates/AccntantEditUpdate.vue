<template>
  <div class="page-wrapper">
    <!-- Background texture -->
    <div class="bg-texture"></div>

    <div class="content-wrapper">
      <!-- Header -->
      <div class="page-header">
        <button class="back-btn" @click="cancelEdit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <div class="breadcrumb">
          <span>Updates</span>
          <span class="sep">›</span>
          <span class="active">Update Details</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!chat" class="loading-state">
        <div class="spinner"></div>
        <p>Loading update details...</p>
      </div>

      <!-- Main Card -->
      <div v-else class="main-card">
        <!-- Image Section -->
        <div class="image-section">
          <div v-if="chat.update_photo" class="image-container">
            <img :src="chat.update_photo" alt="Update Image" class="update-image" />
            <div class="image-overlay">
              <span class="image-badge">Update Photo</span>
            </div>
          </div>
          <div v-else class="no-image">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>No image attached</p>
          </div>
        </div>

        <!-- Content Section -->
        <div class="content-section">
          <!-- Meta info -->
          <div class="meta-row">
            <div class="meta-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {{ formatDate(chat.created_at) }}
            </div>
          </div>

          <!-- Title -->
          <h1 class="update-title">{{ chat.title }}</h1>

          <!-- Divider -->
          <div class="divider"></div>

          <!-- Description -->
          <div class="description-block">
            <label class="field-label">Description</label>
            <p class="description-text">{{ chat.description }}</p>
          </div>

          <!-- Actions -->
          <div class="action-row">
            <button class="edit-btn" @click="showModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="cancelEdit">
        <div class="modal-card">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h2 class="modal-title">Edit Update</h2>
            </div>
            <button class="close-btn" @click="showModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="saveChanges" class="modal-form">
            <div class="form-group">
              <label for="title" class="form-label">Title</label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                class="form-input"
                placeholder="Enter update title..."
              />
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea
                v-model="form.description"
                id="description"
                class="form-textarea"
                rows="5"
                placeholder="Enter description..."
              ></textarea>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="showModal = false">
                Cancel
              </button>
              <button type="submit" class="btn-save" :disabled="isLoading">
                <span v-if="!isLoading">Save Changes</span>
                <span v-else class="btn-loading">
                  <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
                  </svg>
                  Saving...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';
import axios from '@/axios';

const route = useRoute();
const router = useRouter();
const chat_id = route.params.chat_id;
const chat = ref(null);
const showModal = ref(false);
const isLoading = ref(false);
const toast = useToast();

const form = reactive({
  title: '',
  description: '',
});

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

onMounted(async () => {
  await fetchChatDetails();
});

async function fetchChatDetails() {
  try {
    const response = await axios.get(`api/updates/${chat_id}`);
    if (response.data.status === 'success') {
      const data = response.data.data;
      chat.value = {
        update_photo: data.update_photo,
        title: data.title,
        created_at: data.created_at,
        description: data.description,
      };
      form.title = data.title;
      form.description = data.description;
    } else {
      toast.error('Failed to fetch update details.');
    }
  } catch (error) {
    console.error('Error fetching chat details:', error);
    toast.error('An error occurred while fetching update details.');
  }
}

async function saveChanges() {
  isLoading.value = true;
  try {
    const response = await axios.put(`/api/updates/${chat_id}`, {
      title: form.title,
      description: form.description,
    });

    if (response.data.status === 'success') {
      toast.success('Update saved successfully.');
      showModal.value = false;
      chat.value.title = form.title;
      chat.value.description = form.description;
    } else {
      toast.error('Failed to save update.');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    toast.error('Failed to save changes.');
  } finally {
    isLoading.value = false;
  }
}

function cancelEdit() {
  router.push('/accntnantview-update');
}
</script>

<style scoped>
/* ── Fonts ─────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

/* ── Variables ──────────────────────────────────────────── */
:root {
  --navy:     #1a2535;
  --navy-mid: #283747;
  --navy-lt:  #354a60;
  --accent:   #3b8beb;
  --accent-lt:#e8f2fd;
  --surface:  #ffffff;
  --bg:       #f0f4f8;
  --border:   #dde3ec;
  --text:     #1a2535;
  --text-sm:  #5a6a7e;
  --radius:   14px;
  --shadow:   0 4px 24px rgba(26,37,53,0.10);
  --shadow-lg:0 12px 48px rgba(26,37,53,0.16);
}

/* ── Page ───────────────────────────────────────────────── */
.page-wrapper {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  position: relative;
}

.bg-texture {
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(59,139,235,0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(26,37,53,0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  padding: 36px 24px 60px;
}

/* ── Header ─────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: black;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: 'DM Sans', sans-serif;
}
.back-btn:hover {
  background: rgba(0, 0, 0, 0.588);
  color: #fff;
  border-color: var(--navy);
  transform: translateX(-2px);
}

.breadcrumb {
  font-size: 13px;
  color: var(--text-sm);
  display: flex;
  align-items: center;
  gap: 6px;
}
.breadcrumb .sep { opacity: 0.4; }
.breadcrumb .active { color: var(--navy); font-weight: 500; }

/* ── Loading ────────────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--text-sm);
  font-size: 14px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ── Main Card ──────────────────────────────────────────── */
.main-card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: cardIn 0.4s ease both;
}

/* ── Image Section ──────────────────────────────────────── */
.image-section {
  width: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
}

.update-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.image-container:hover .update-image {
  transform: scale(1.03);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26,37,53,0.5) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.image-badge {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 20px;
}

.no-image {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #f7f9fc;
  color: #b0bbc8;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}

/* ── Content Section ────────────────────────────────────── */
.content-section {
  padding: 32px 36px 36px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--accent-lt);
  color: var(--accent);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

.update-title {
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  font-weight: 400;
  color: var(--navy);
  line-height: 1.3;
  margin: 0 0 20px;
}

.divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 24px;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-sm);
  margin-bottom: 10px;
}

.description-text {
  font-size: 15px;
  color: #3d4f63;
  line-height: 1.75;
  margin: 0;
}

.action-row {
  margin-top: 32px;
  display: flex;
  gap: 12px;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background: green;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.18s ease;
  box-shadow: 0 2px 10px rgba(26,37,53,0.25);
}
.edit-btn:hover {
  background: rgb(9, 120, 9);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26,37,53,0.30);
}
.edit-btn:active {
  transform: translateY(0);
}

/* ── Modal ──────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(10,18,30,0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--border);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px;
  border-bottom: 1px solid var(--border);
  background: #fafbfd;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 36px;
  height: 36px;
  background: var(--navy);
  color: #fff;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: red;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.close-btn:hover {
  background: #f0f0f3;
  color: var(--navy);
}

/* ── Form ───────────────────────────────────────────────── */
.modal-form {
  padding: 28px;
  background: white;
  color: black;
  
}

.form-group {
  margin-bottom: 22px;
  
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: black;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: 9px;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: black;
  background: white;
  border-color: brown;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  box-sizing: border-box;
  outline: none;
  resize: vertical;
}
.form-input:focus,
.form-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59,139,235,0.12);
}
.form-input::placeholder,
.form-textarea::placeholder {
  color: #b0bbc8;
}

/* ── Modal Footer ───────────────────────────────────────── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
}

.btn-cancel {
  padding: 10px 20px;
  background: red;
  border: 1.5px solid var(--border);
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-sm);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s ease;
}
.btn-cancel:hover {
  background: rgb(175, 69, 69);
  border-color: #c5cdd8;
  color: var(--navy);
}

.btn-save {
  padding: 10px 24px;
  background: green;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.18s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-save:hover:not(:disabled) {
  background: rgb(42, 145, 71);
}
.btn-save:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spin-icon {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}

/* ── Transitions ────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}

/* ── Animations ─────────────────────────────────────────── */
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 600px) {
  .content-section { padding: 24px 20px 28px; }
  .update-title { font-size: 22px; }
  .modal-form { padding: 20px; }
  .modal-header { padding: 18px 20px; }
  .image-container { height: 220px; }
}
</style>