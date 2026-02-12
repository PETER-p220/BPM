<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Card -->
      <div class="mb-6">
        <button
          @click="closeModal"
          class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to Projects
        </button>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Gradient Header -->
          <div class="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-tasks text-white text-xl"></i>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-white">Project Management</h1>
                  <p class="text-slate-100 text-sm">Update project status and details</p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Form Body -->
          <div class="p-8">
            <!-- Info Banner -->
            <div class="mb-6 bg-slate-50 dark:bg-slate-900 border-l-4 border-slate-500 rounded-lg p-4">
              <div class="flex items-start">
                <i class="fas fa-info-circle text-slate-500 mt-1 mr-3"></i>
                <div>
                  <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Project Information</h4>
                  <p class="text-sm text-slate-700 dark:text-slate-200">
                    Review the project details below and update the status accordingly. Some fields are read-only and cannot be modified.
                  </p>
                </div>
              </div>
            </div>

            <form @submit.prevent="updateProject" class="space-y-6">
              <!-- Tender Selection -->
              <div class="form-group">
                <label for="tenderSelect" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-file-contract text-slate-500 mr-2"></i>
                  Tender
                </label>
                <div class="relative">
                  <select
                    id="tenderSelect"
                    v-model="projectData.tender_id"
                    disabled
                    class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 cursor-not-allowed focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>Select a tender</option>
                    <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                      {{ tender.title }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i class="fas fa-lock text-gray-400"></i>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <i class="fas fa-lock text-xs mr-1"></i>
                  This field is locked and cannot be modified
                </p>
              </div>

              <!-- Date Fields Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Start Date -->
                <div class="form-group">
                  <label for="startDate" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <i class="fas fa-calendar-plus text-green-500 mr-2"></i>
                    Start Date
                  </label>
                  <div class="relative">
                    <input
                      type="date"
                      id="startDate"
                      v-model="projectData.start_date"
                      disabled
                      class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 cursor-not-allowed focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i class="fas fa-lock text-gray-400"></i>
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <i class="fas fa-lock text-xs mr-1"></i>
                    Read-only field
                  </p>
                </div>

                <!-- End Date -->
                <div class="form-group">
                  <label for="endDate" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <i class="fas fa-calendar-check text-red-500 mr-2"></i>
                    End Date
                  </label>
                  <div class="relative">
                    <input
                      type="date"
                      id="endDate"
                      v-model="projectData.end_date"
                      disabled
                      class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 cursor-not-allowed focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i class="fas fa-lock text-gray-400"></i>
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <i class="fas fa-lock text-xs mr-1"></i>
                    Read-only field
                  </p>
                </div>
              </div>

              <!-- Project Status -->
              <div class="form-group">
                <label for="projectStatus" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-flag text-purple-500 mr-2"></i>
                  Project Status *
                </label>
                <select
                  id="projectStatus"
                  v-model="projectData.project_status"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                >
                  <option value="" disabled>Select project status</option>
                  <option value="on-progress">
                    ⚡ On Progress
                  </option>
                  <option value="completed">
                    ✓ Completed
                  </option>
                  <option value="failed">
                    ✕ Cancelled
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <i class="fas fa-info-circle text-xs mr-1"></i>
                  Update the current status of this project
                </p>
              </div>

              <!-- Status Preview Card -->
              <div v-if="projectData.project_status" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': projectData.project_status === 'on-progress',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': projectData.project_status === 'completed',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': projectData.project_status === 'failed'
                    }"
                    class="px-4 py-2 inline-flex items-center text-sm font-semibold rounded-full"
                  >
                    <span
                      :class="{
                        'bg-yellow-500': projectData.project_status === 'on-progress',
                        'bg-green-500': projectData.project_status === 'completed',
                        'bg-red-500': projectData.project_status === 'failed'
                      }"
                      class="w-2 h-2 rounded-full mr-2 animate-pulse"
                    ></span>
                    {{ projectData.project_status === 'on-progress' ? 'On Progress' : 
                       projectData.project_status === 'completed' ? 'Completed' : 'Cancelled' }}
                  </span>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-200 dark:border-gray-700"></div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                </p>
                <div class="flex gap-3 w-full sm:w-auto">
                  <router-link
                    to="/my/projects"
                    class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 font-medium transition-all shadow-sm"
                  >
                    <i class="fas fa-times mr-2"></i>
                    Cancel
                  </router-link>
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i v-if="!isLoading" class="fas fa-save mr-2"></i>
                    <i v-else class="fas fa-spinner fa-spin mr-2"></i>
                    {{ isLoading ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </form>
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
  tender_id: '',
  start_date: '',
  end_date: '',
  project_status: '',
});

const tenders = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  await fetchProjectData();
  await fetchTenders();
});

async function fetchProjectData() {
  try {
    const response = await axios.get(`api/projects/${route.params.project_id}`);
    projectData.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function updateProject() {
  if (!projectData.value.project_status) {
    toast.error('Please select a project status');
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.put(`api/projects/${route.params.project_id}`, projectData.value);
    toast.success(response.data.message || 'Project updated successfully!');
    
    // Delay navigation slightly to show the success message
    setTimeout(() => {
      router.push('/my/projects');
    }, 1000);
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  router.push('/my/projects');
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data && error.response.data.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.form-group input,
.form-group select {
  transition: all 0.2s ease-in-out;
}

.form-group input:focus,
.form-group select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>