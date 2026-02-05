<template>
  <div class="create-attendance-container">
    <div class="page-header">
      <h2 class="page-title">Create HR Attendance</h2>
      <p class="page-subtitle">Record attendance for HR meetings</p>
    </div>

    <!-- Attendance Records Display -->
    <div class="attendance-records" v-if="attendanceRecords.length > 0">
      <h3 class="records-title">Recent Attendance Records</h3>
      <div class="table-container">
        <table class="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Meeting Type</th>
              <th>Location</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in attendanceRecords" :key="record.id">
              <td>{{ formatDate(record.meeting_date) }}</td>
              <td>{{ record.meeting_type }}</td>
              <td>{{ record.location }}</td>
              <td>
                <div class="attendees-list">
                  <span v-for="(attendee, index) in getAttendeesList(record.attendees)" :key="index" class="attendee-tag">
                    {{ attendee }}
                  </span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(record.is_present)">
                  {{ record.is_present }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-primary" @click="editRecord(record)">
                  <i class="fas fa-edit"></i>
                  Edit
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteRecord(record.id)">
                  <i class="fas fa-trash"></i>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="submitAttendance">
        <div class="form-row">
          <div class="form-group">
            <label for="meeting_date" class="form-label">Meeting Date</label>
            <input
              type="date"
              id="meeting_date"
              v-model="form.meeting_date"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="meeting_type" class="form-label">Meeting Type</label>
            <select id="meeting_type" v-model="form.meeting_type" class="form-select" required>
              <option value="">Select meeting type</option>
              <option value="staff">Staff Meeting</option>
              <option value="board">Board Meeting</option>
              <option value="training">Training Session</option>
              <option value="review">Performance Review</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="location" class="form-label">Location</label>
          <input
            type="text"
            id="location"
            v-model="form.location"
            class="form-input"
            placeholder="Enter meeting location"
            required
          />
        </div>

        <div class="form-group">
          <label for="attendees" class="form-label">Attendees</label>
          <textarea
            id="attendees"
            v-model="form.attendees"
            class="form-textarea"
            placeholder="List of attendees (one per line)"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="notes" class="form-label">Meeting Notes</label>
          <textarea
            id="notes"
            v-model="form.notes"
            class="form-textarea"
            placeholder="Meeting notes and agenda"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button v-if="!editingRecord" type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Record Attendance</span>
            <span v-else>Recording...</span>
          </button>
          <button v-if="editingRecord" type="button" class="btn btn-success" @click="updateRecord" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Update Record</span>
            <span v-else>Updating...</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';

const form = ref({
  meeting_date: '',
  meeting_type: '',
  location: '',
  attendees: '',
  notes: ''
});

const attendanceRecords = ref([]);
const isSubmitting = ref(false);
const editingRecord = ref(null);

// Fetch existing attendance records
const fetchAttendanceRecords = async () => {
  try {
    const response = await axios.get('/api/attendances');
    attendanceRecords.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
  }
};

const submitAttendance = async () => {
  if (!form.value.meeting_date || !form.value.meeting_type || !form.value.attendees) {
    alert('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const response = await axios.post('/api/attendances', form.value);
    
    if (response.data.status === 'success') {
      alert('Attendance recorded successfully!');
      resetForm();
      fetchAttendanceRecords(); // Refresh the list
    } else {
      alert('Failed to record attendance: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error recording attendance:', error);
    alert('An error occurred while recording attendance');
  } finally {
    isSubmitting.value = false;
  }
};

const editRecord = (record) => {
  editingRecord.value = { ...record };
  // Populate form with record data for editing
  form.value.meeting_date = record.meeting_date;
  form.value.meeting_type = record.meeting_type;
  form.value.location = record.location;
  form.value.attendees = record.attendees;
  form.value.notes = record.notes;
};

const deleteRecord = async (id) => {
  if (confirm('Are you sure you want to delete this attendance record?')) {
    try {
      await axios.delete(`/api/attendances/${id}`);
      attendanceRecords.value = attendanceRecords.value.filter(r => r.id !== id);
      alert('Attendance record deleted successfully');
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      alert('Failed to delete attendance record');
    }
  }
};

const updateRecord = async () => {
  if (!editingRecord.value) return;
  
  try {
    const response = await axios.put(`/api/attendances/${editingRecord.value.id}`, editingRecord.value);
    
    if (response.data.status === 'success') {
      alert('Attendance record updated successfully!');
      editingRecord.value = null;
      fetchAttendanceRecords(); // Refresh the list
      resetForm();
    } else {
      alert('Failed to update attendance record: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error updating attendance record:', error);
    alert('An error occurred while updating attendance record');
  }
};

const cancelEdit = () => {
  editingRecord.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = {
    meeting_date: '',
    meeting_type: '',
    location: '',
    attendees: '',
    notes: ''
  };
  editingRecord.value = null;
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

const getStatusClass = (status) => {
  const classes = {
    'present': 'status-present',
    'not-present': 'status-absent'
  };
  return classes[status] || 'status-unknown';
};
</script>

<style scoped>
.create-attendance-container {
  max-width: 800px;
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

.form-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
