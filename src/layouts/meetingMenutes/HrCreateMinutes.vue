<template>
  <div class="create-minutes-container">
    <div class="page-header">
      <h2 class="page-title">Create Meeting Minutes</h2>
      <p class="page-subtitle">Record minutes for HR meetings</p>
    </div>

    <!-- Create Form -->
    <div class="form-container">
      <h3 class="form-title">Create New Meeting Minutes</h3>
      <form @submit.prevent="submitMinutes" class="attendance-form">
        <div class="form-row">
          <div class="form-group">
            <label for="meeting_title" class="form-label">Meeting Title *</label>
            <input
              type="text"
              id="meeting_title"
              v-model="form.meeting_title"
              class="form-input"
              placeholder="Enter meeting title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="meeting_date" class="form-label">Meeting Date *</label>
            <input
              type="date"
              id="meeting_date"
              v-model="form.meeting_date"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="attendees" class="form-label">Attendees *</label>
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
          <label for="agenda" class="form-label">Agenda *</label>
          <textarea
            id="agenda"
            v-model="form.agenda"
            class="form-textarea"
            placeholder="Meeting agenda"
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="discussion" class="form-label">Discussion</label>
          <textarea
            id="discussion"
            v-model="form.discussion"
            class="form-textarea"
            placeholder="Meeting discussion points"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="decisions" class="form-label">Decisions</label>
          <textarea
            id="decisions"
            v-model="form.decisions"
            class="form-textarea"
            placeholder="Decisions made"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="next_meeting" class="form-label">Next Meeting</label>
          <input
            type="text"
            id="next_meeting"
            v-model="form.next_meeting"
            class="form-input"
            placeholder="Date and time of next meeting"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Create Minutes</span>
            <span v-else>Creating...</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
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
  meeting_title: '',
  meeting_date: '',
  attendees: '',
  agenda: '',
  discussion: '',
  decisions: '',
  next_meeting: ''
});

const minutesRecords = ref([]);
const isSubmitting = ref(false);

const submitMinutes = async () => {
  if (!form.value.meeting_date || !form.value.meeting_title || !form.value.attendees || !form.value.agenda) {
    alert('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const response = await axios.post('/api/meeting-minutes', form.value);
    
    if (response.data.status === true) {
      alert('Meeting minutes created successfully!');
      resetForm();
      fetchMinutesRecords(); // Refresh records
    } else {
      alert('Failed to create minutes: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error creating minutes:', error);
    alert('An error occurred while creating meeting minutes');
  } finally {
    isSubmitting.value = false;
  }
};

const fetchMinutesRecords = async () => {
  try {
    const response = await axios.get('/api/meeting-minutes');
    if (response.data.status === true) {
      minutesRecords.value = response.data.data.slice(0, 5); // Show last 5 records
    }
  } catch (error) {
    console.error('Error fetching minutes records:', error);
  }
};

const editRecord = (record) => {
  // Navigate to edit page or open edit modal
  console.log('Edit record:', record);
};

const deleteRecord = async (id) => {
  if (confirm('Are you sure you want to delete this meeting minute?')) {
    try {
      await axios.delete(`/api/meeting-minutes/${id}`);
      minutesRecords.value = minutesRecords.value.filter(r => r.minutes_id !== id);
      alert('Meeting minute deleted successfully');
    } catch (error) {
      console.error('Error deleting meeting minute:', error);
      alert('Failed to delete meeting minute');
    }
  }
};

const resetForm = () => {
  form.value = {
    meeting_date: '',
    meeting_title: '',
    attendees: '',
    agenda: '',
    discussion: '',
    decisions: '',
    next_meeting: ''
  };
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

// Load records on component mount
onMounted(() => {
  fetchMinutesRecords();
});
</script>

<style scoped>
.create-minutes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Records Table Styles */
.minutes-records {
  margin-bottom: 2rem;
}

.records-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.minutes-table {
  width: 100%;
  border-collapse: collapse;
}

.minutes-table th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.minutes-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.minutes-table tr:hover {
  background: #f9fafb;
}

.attendees-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.attendee-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.created {
  background: #d1fae5;
  color: #065f46;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

/* Form Styles */
.form-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
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

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .create-minutes-container {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
}
</style>
