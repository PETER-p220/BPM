<template>
  <div class="py-5 add-request" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-plus"></i> Create Project Extension</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Project Extension Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>

          <!-- Project Selection -->
          <div class="row">
            <div class="col-sm-6">
              <label for="projectSelect" class="form-label">Select Project</label>
              <select
                id="projectSelect"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.project_id"
              >
                <option value="">Select a project</option>
                <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                  {{ project.project_name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Extended Date -->
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="extendedDate" class="form-label">Extended Date</label>
              <input
                type="date"
                id="extendedDate"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="requestData.extended_date"
                :min="tomorrow"
              />
            </div>
          </div>

          <!-- Extend Letter File -->
          <div class="row mt-4">
            <div class="col-sm-6">
              <label for="extendLetterFile" class="form-label">Extend Letter (PDF, max 2MB)</label>
              <input
                type="file"
                id="extendLetterFile"
                class="w-full px-3 py-2 border rounded form-control"
                accept="application/pdf"
                @change="handleFileUpload"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button
              @click="createProjectExtension"
              class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700"
              style="background-color: #283747;"
              :disabled="isLoading"
            >
              <i class="fa fa-plus"></i> Save Extension
              <span v-if="isLoading" class="flex items-center gap-2">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link
                to="/extended-project"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                <i class="fa fa-times"></i> Cancel
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const requestData = ref({
  project_id: '',
  extended_date: '',
  extend_letter_file: null,
});
const projects = ref([]);
const isLoading = ref(false);

// Compute tomorrow's date for min attribute
const tomorrow = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
});

// Fetch projects on component mount
onMounted(async () => {
  await fetchProjects();
});

// Fetch projects from API
async function fetchProjects() {
  try {
    const response = await axios.get('/api/dropdown/projects');
    if (response.data.status && Array.isArray(response.data.data)) {
      projects.value = response.data.data;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    handleError(error);
  }
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      requestData.value.extend_letter_file = null;
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must not exceed 2MB.');
      requestData.value.extend_letter_file = null;
      event.target.value = '';
      return;
    }
    requestData.value.extend_letter_file = file;
  }
}

// Create project extension
async function createProjectExtension() {
  isLoading.value = true;

  // Validation
  if (!requestData.value.project_id) {
    toast.error('Please select a project.');
    isLoading.value = false;
    return;
  }

  if (!requestData.value.extended_date) {
    toast.error('Please select an extended date.');
    isLoading.value = false;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const extendedDate = new Date(requestData.value.extended_date);
  if (extendedDate <= today) {
    toast.error('Extended date must be after today.');
    isLoading.value = false;
    return;
  }

  if (!requestData.value.extend_letter_file) {
    toast.error('Please upload a PDF letter file.');
    isLoading.value = false;
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('project_id', requestData.value.project_id);
  formData.append('extended_date', requestData.value.extended_date);
  formData.append('extend_letter_file', requestData.value.extend_letter_file);

  try {
    const response = await axios.post('/api/project-extension', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status) {
      toast.success(response.data.message);
      router.push('/extended-project');
    } else {
      toast.error(response.data.message || 'Failed to create project extension');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Handle errors
function handleError(error) {
  let message = 'An unexpected error occurred.';
  if (error.response) {
    if (error.response.status === 400 && error.response.data.errors) {
      message = Object.values(error.response.data.errors).flat().join(' ');
    } else if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
      if (error.response.data.results?.project_extension?.error) {
        message += ': ' + error.response.data.results.project_extension.error;
      }
    } else if (error.response.status === 500) {
      message = error.response.data.message || 'Server error occurred.';
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Close modal
function closeModal() {
  router.push('/extended-project');
}
</script>

<style scoped>
.add-request .card {
  border-radius: 8px;
}

.card-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.form-control {
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #283747;
  outline: none;
}
</style>