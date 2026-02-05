<template>
  <div class="manage-attendance-container">
    <div class="page-header">
      <h2 class="page-title">Manage HR Attendance</h2>
      <p class="page-subtitle">View and edit attendance records</p>
    </div>

    <div class="filters-section">
      <div class="filter-group">
        <label for="date_filter" class="filter-label">Filter by Date</label>
        <input
          type="date"
          id="date_filter"
          v-model="filters.date"
          class="filter-input"
          @change="fetchAttendance"
        />
      </div>
      
      <div class="filter-group">
        <label for="type_filter" class="filter-label">Filter by Type</label>
        <select id="type_filter" v-model="filters.type" class="filter-select" @change="fetchAttendance">
          <option value="">All Types</option>
          <option value="staff">Staff Meeting</option>
          <option value="board">Board Meeting</option>
          <option value="training">Training Session</option>
          <option value="review">Performance Review</option>
        </select>
      </div>
    </div>

    <div class="attendance-table-container" v-if="!isLoading">
      <div v-if="attendance.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <p>No attendance records found</p>
      </div>
      
      <div v-else class="table-wrapper">
        <table class="attendance-table">
          <thead>
            <tr>
              <th>Meeting Type</th>
              <th>Date</th>
              <th>Location</th>
              <th>Attendees</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in attendance"
              :key="record.att_id"
              class="table-row"
            >
              <td class="meeting-type-cell">{{ record.meeting_type }}</td>
              <td class="date-cell">
                <i class="fas fa-calendar"></i>
                {{ formatDate(record.meeting_date) }}
              </td>
              <td class="location-cell">{{ record.location }}</td>
              <td class="attendees-cell">
                <div class="attendees-list">
                  <span
                    v-for="(attendee, index) in getAttendeesList(record.attendees)"
                    :key="index"
                    class="attendee-tag"
                  >
                    {{ attendee }}
                  </span>
                </div>
              </td>
              <td class="notes-cell">
                <p class="notes-content">{{ record.notes || '-' }}</p>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-primary" @click="editAttendance(record)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteAttendance(record.att_id)" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading attendance records...</p>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Attendance Record</h3>
          <button class="modal-close" @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="editingRecord">
          <div class="form-group">
            <label class="form-label">Meeting Date</label>
            <input
              type="date"
              v-model="editingRecord.meeting_date"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Meeting Type</label>
            <select v-model="editingRecord.meeting_type" class="form-select" required>
              <option value="staff">Staff Meeting</option>
              <option value="board">Board Meeting</option>
              <option value="training">Training Session</option>
              <option value="review">Performance Review</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Location</label>
            <input
              type="text"
              v-model="editingRecord.location"
              class="form-input"
              placeholder="Enter meeting location"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Attendees</label>
            <textarea
              v-model="editingRecord.attendees"
              class="form-textarea"
              placeholder="List of attendees (one per line)"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Meeting Notes</label>
            <textarea
              v-model="editingRecord.notes"
              class="form-textarea"
              placeholder="Meeting notes and agenda"
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" @click="updateAttendance">
            Update Record
          </button>
          <button class="btn btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <div class="toast-content">
        <i :class="toastIcon"></i>
        <span>{{ toast.message }}</span>
      </div>
      <button class="toast-close" @click="hideToast">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button class="modal-close" @click="cancelDelete">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="confirmation-content">
            <div class="warning-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="confirmation-text">
              <h4>Are you sure you want to delete this attendance record?</h4>
              <p>This action cannot be undone. The attendance record will be permanently removed from the system.</p>
              <div class="record-details" v-if="recordToDelete">
                <strong>Meeting Type:</strong> {{ recordToDelete.meeting_type }}<br>
                <strong>Date:</strong> {{ formatDate(recordToDelete.meeting_date) }}<br>
                <strong>Location:</strong> {{ recordToDelete.location }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelDelete">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button class="btn btn-danger" @click="confirmDelete">
            <i class="fas fa-trash"></i>
            Delete Record
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';

const attendance = ref([]);
const isLoading = ref(true);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editingRecord = ref(null);
const recordToDelete = ref(null);

// Toast notification state
const toast = ref({
  show: false,
  message: '',
  type: 'success' // success, error, warning, info
});

const filters = ref({
  date: '',
  type: ''
});

const fetchAttendance = async () => {
  isLoading.value = true;
  
  try {
    const params = new URLSearchParams();
    if (filters.value.date) params.append('date', filters.value.date);
    if (filters.value.type) params.append('type', filters.value.type);
    
    const response = await axios.get(`/api/attendances?${params}`);
    attendance.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    attendance.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getAttendeesList = (attendeesString) => {
  if (!attendeesString) return [];
  return attendeesString.split('\n').filter(a => a.trim());
};

// Toast notification functions
const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message: message,
    type: type
  };
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    hideToast();
  }, 3000);
};

const hideToast = () => {
  toast.value.show = false;
};

const toastIcon = computed(() => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  return icons[toast.value.type] || icons.info;
});

const editAttendance = (record) => {
  editingRecord.value = { ...record };
  showEditModal.value = true;
};

const updateAttendance = async () => {
  if (!editingRecord.value) return;
  
  try {
    const response = await axios.put(`/api/attendances/${editingRecord.value.att_id}`, editingRecord.value);
    
    if (response.data.status === 'success') {
      showToast('Attendance record updated successfully!', 'success');
      showEditModal.value = false;
      editingRecord.value = null;
      fetchAttendance(); // Refresh the list
    } else {
      showToast('Failed to update attendance record: ' + response.data.message, 'error');
    }
  } catch (error) {
    console.error('Error updating attendance record:', error);
    showToast('An error occurred while updating attendance record', 'error');
  }
};

const cancelEdit = () => {
  showEditModal.value = false;
  editingRecord.value = null;
};

const deleteAttendance = async (id) => {
  // Find the record to delete
  const record = attendance.value.find(a => a.att_id === id);
  recordToDelete.value = record;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!recordToDelete.value) return;
  
  try {
    await axios.delete(`/api/attendances/${recordToDelete.value.att_id}`);
    attendance.value = attendance.value.filter(a => a.att_id !== recordToDelete.value.att_id);
    showToast('Attendance record deleted successfully', 'success');
    showDeleteModal.value = false;
    recordToDelete.value = null;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    showToast('Failed to delete attendance record', 'error');
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  recordToDelete.value = null;
};

onMounted(() => {
  fetchAttendance();
});
</script>

<style scoped>
.manage-attendance-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.filters-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
}

.filter-group {
  flex: 1;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.attendance-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.attendance-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.attendance-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.attendance-table tbody tr:hover {
  background-color: #f9fafb;
}

.attendance-table tbody tr:last-child {
  border-bottom: none;
}

.attendance-table td {
  padding: 1rem;
  color: #4b5563;
  font-size: 0.875rem;
  vertical-align: top;
}

.meeting-type-cell {
  font-weight: 600;
  color: #1f2937;
  min-width: 150px;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.date-cell i {
  color: #6b7280;
}

.location-cell {
  min-width: 120px;
}

.attendees-cell {
  min-width: 200px;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.attendee-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.notes-cell {
  max-width: 300px;
}

.notes-content {
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.actions-cell {
  min-width: 100px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 1024px) {
  .attendance-table {
    font-size: 0.8rem;
  }
  
  .attendance-table th,
  .attendance-table td {
    padding: 0.75rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body .form-group {
  margin-bottom: 1.5rem;
}

.modal-body .form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.modal-body .form-input,
.modal-body .form-textarea,
.modal-body .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.modal-body .form-input:focus,
.modal-body .form-textarea:focus,
.modal-body .form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-body .form-textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* Responsive modal */
@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}

/* Toast Notifications */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.25rem;
}

.toast-content span {
  font-weight: 500;
  color: white;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast types */
.toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
  border-left: 4px solid #047857;
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-left: 4px solid #b91c1c;
}

.toast.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-left: 4px solid #b45309;
}

.toast.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-left: 4px solid #1d4ed8;
}

/* Toast animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive toast */
@media (max-width: 640px) {
  .toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}

/* Delete Confirmation Modal */
.confirmation-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1rem 0;
}

.warning-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: #fef3c7;
  border: 3px solid #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
  font-size: 1.5rem;
}

.confirmation-text {
  flex: 1;
}

.confirmation-text h4 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 1.125rem;
  font-weight: 600;
}

.confirmation-text p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.5;
}

.record-details {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #e5e7eb;
  margin-top: 1rem;
}

.record-details strong {
  color: #374151;
  font-weight: 600;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: 1px solid #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #b91c1c;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>