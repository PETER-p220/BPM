<template>
  <div class="view-updates-container">
    <div class="page-header">
      <h2 class="page-title">HR Updates</h2>
      <p class="page-subtitle">View and manage HR updates</p>
    </div>

    <div class="updates-list" v-if="!isLoading">
      <div v-if="updates.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No updates found</p>
      </div>
      
      <div v-else class="updates-grid">
        <div
          v-for="update in updates"
          :key="update.id"
          class="update-card"
        >
          <div class="update-header">
            <h3 class="update-title">{{ update.title }}</h3>
            <span class="update-priority" :class="getPriorityClass(update.priority)">
              {{ update.priority }}
            </span>
          </div>
          
          <div class="update-content">
            <p class="update-description">{{ update.description }}</p>
            <div class="update-meta">
              <span class="update-date">
                <i class="fas fa-calendar"></i>
                {{ formatDate(update.created_at) }}
              </span>
              <span class="update-author">
                <i class="fas fa-user"></i>
                {{ update.author || 'HR Admin' }}
              </span>
            </div>
          </div>
          
          <div class="update-actions">
            <button class="btn btn-sm btn-primary" @click="editUpdate(update)">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteUpdate(update.id)">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading updates...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';

const updates = ref([]);
const isLoading = ref(true);

const fetchUpdates = async () => {
  isLoading.value = true;
  
  try {
    const response = await axios.get('/api/updates');
    updates.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching updates:', error);
    updates.value = [];
  } finally {
    isLoading.value = false;        
  }
};

const getPriorityClass = (priority) => {
  const classes = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high'
  };
  return classes[priority] || 'priority-medium';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const editUpdate = (update) => {
  // Navigate to edit page or open modal
  console.log('Edit update:', update);
};

const deleteUpdate = async (id) => {
  if (confirm('Are you sure you want to delete this update?')) {
    try {
      await axios.delete(`/api/updates/${id}`);
      updates.value = updates.value.filter(u => u.id !== id);
      alert('Update deleted successfully');
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Failed to delete update');
    }
  }
};

onMounted(() => {
  fetchUpdates();
});
</script>

<style scoped>
.view-updates-container {
  max-width: 1200px;
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

.updates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.update-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.update-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.update-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.update-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-low {
  background: #dbeafe;
  color: #1e40af;
}

.priority-medium {
  background: #fed7aa;
  color: #d97706;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.update-content {
  margin-bottom: 1rem;
}

.update-description {
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.update-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.update-date,
.update-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.update-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
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
</style>
