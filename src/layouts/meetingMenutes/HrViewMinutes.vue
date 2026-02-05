<template>
  <div class="view-minutes-container">
    <div class="page-header">
      <h2 class="page-title">HR Meeting Minutes</h2>
      <p class="page-subtitle">View and manage meeting minutes</p>
    </div>

    <div class="filters-section">
      <div class="filter-group">
        <label for="date_filter" class="filter-label">
          <i class="fas fa-calendar-alt"></i> Date
        </label>
        <input
          type="date"
          id="date_filter"
          v-model="filters.date"
          class="filter-input"
          @change="fetchMinutes"
        />
      </div>

      <div class="filter-group">
        <label for="search_filter" class="filter-label">
          <i class="fas fa-search"></i> Search
        </label>
        <input
          type="text"
          id="search_filter"
          v-model="filters.search"
          class="filter-input"
          placeholder="Title, attendees..."
          @input="debouncedFetchMinutes"
        />
      </div>
    </div>

    <div class="table-container" v-if="!isLoading">
      <div v-if="minutes.length === 0" class="empty-state">
        <i class="fas fa-file-alt"></i>
        <p>No meeting minutes found.</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="minutes-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Attendees</th>
              <th>Agenda</th>
              <th>Decisions</th>
              <th>Next Meeting</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="minute in minutes" :key="minute.minutes_id">
              <td class="title">
                <strong>{{ minute.meeting_title || 'Untitled' }}</strong>
              </td>
              <td class="date">
                {{ formatDate(minute.meeting_date) || '-' }}
              </td>
              <td class="attendees">
                <div class="attendees-list">
                  <span
                    v-for="(attendee, i) in getAttendeesList(minute.attendees)"
                    :key="i"
                    class="attendee-tag"
                  >
                    {{ attendee }}
                  </span>
                </div>
              </td>
              <td class="text-cell">
                <div class="truncated">{{ minute.agenda || '-' }}</div>
              </td>
              <td class="text-cell">
                <div class="truncated">{{ minute.decisions || '-' }}</div>
              </td>
              <td class="text-cell">
                <div class="truncated">{{ minute.next_meeting || '-' }}</div>
              </td>
              <td class="actions">
                <button class="btn btn-edit" @click="editMinute(minute)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" @click="deleteMinute(minute.minutes_id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <i :class="toastIcon"></i>
      <span>{{ toast.message }}</span>
      <button class="toast-close" @click="hideToast">×</button>
    </div>

    <!-- Edit Modal and Delete Modal remain the same – omitted here for brevity -->
    <!-- You can keep them exactly as they were -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { debounce } from 'lodash'; // add lodash if not already present, or write simple debounce

const minutes = ref([]);
const isLoading = ref(true);
const toast = ref({ show: false, message: '', type: 'success' });

const filters = ref({
  date: '',
  search: ''
});

const fetchMinutes = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams();
    if (filters.value.date) params.append('date', filters.value.date);
    if (filters.value.search) params.append('search', filters.value.search);

    const response = await axios.get(`/api/meeting-minutes?${params}`);
    minutes.value = response.data.status === true ? response.data.data || [] : [];
  } catch (error) {
    console.error('Error fetching minutes:', error);
    minutes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Optional: debounce search to avoid too many requests
const debouncedFetchMinutes = debounce(fetchMinutes, 500);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getAttendeesList = (str) => {
  return str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];
};

const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(hideToast, 3500);
};

const hideToast = () => {
  toast.value.show = false;
};

const toastIcon = () => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle'
  };
  return icons[toast.value.type] || 'fas fa-info-circle';
};

const editMinute = (minute) => {
  // your existing edit logic
  console.log('Editing:', minute);
};

const deleteMinute = (id) => {
  // your existing delete logic
  console.log('Deleting:', id);
};

onMounted(fetchMinutes);
</script>

<style scoped>
.view-minutes-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.filters-section {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 220px;
}

.filter-label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}

.filter-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.minutes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.minutes-table th,
.minutes-table td {
  padding: 1rem 1.1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.minutes-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.4px;
}

.minutes-table td {
  color: #475569;
  vertical-align: top;
}

.title strong {
  color: #1e293b;
}

.date {
  color: #64748b;
  white-space: nowrap;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.attendee-tag {
  background: #e0f2fe;
  color: #1e40af;
  padding: 0.25rem 0.6rem;
  border-radius: 5px;
  font-size: 0.78rem;
  white-space: nowrap;
}

.text-cell .truncated {
  max-height: 3.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.actions {
  white-space: nowrap;
}

.btn {
  padding: 0.45rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  margin-right: 0.4rem;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 5rem 1rem;
  color: #64748b;
}

.empty-state i,
.loading-state i {
  font-size: 3.5rem;
  opacity: 0.4;
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast – keep your existing toast styles or use this minimal version */
.toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 1000;
  border-left: 4px solid;
}

.toast.success { border-left-color: #10b981; }
.toast.error { border-left-color: #ef4444; }
</style>