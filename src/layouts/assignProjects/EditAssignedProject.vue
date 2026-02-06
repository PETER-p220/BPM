<template>
  <div class="p-6 min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-3xl mx-auto">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-800 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="fas fa-edit text-lg"></i>
            <h2 class="text-xl font-semibold">Edit Project</h2>
          </div>
          <button
            @click="closeModal"
            class="text-gray-300 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
            title="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <!-- Validation Errors -->
          <div
            v-if="Object.keys(errors).length"
            class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
          >
            <h4 class="font-semibold mb-2">Please correct the following errors:</h4>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li v-for="(messages, field) in errors" :key="field">
                <span class="font-medium">{{ field.replace(/_/g, ' ') }}:</span>
                {{ messages[0] }}
              </li>
            </ul>
          </div>

          <form @submit.prevent="updateProject" class="space-y-6">
            <!-- Contract -->
            <div>
              <label for="contract" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contract <span class="text-red-500">*</span>
              </label>
              <select
                id="contract"
                v-model="projectData.contract_id"
                :class="{ 'border-red-500 focus:ring-red-500': errors.contract_id }"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="" disabled>Select Contract</option>
                <option v-for="contract in contracts" :key="contract.contract_id" :value="contract.contract_id">
                  {{ contract.title }}
                </option>
              </select>
              <p v-if="errors.contract_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.contract_id[0] }}
              </p>
            </div>

            <!-- Current Contract Title (read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Contract Title
              </label>
              <input
                type="text"
                :value="projectData.contract?.title || '—'"
                disabled
                class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            <!-- Project Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Status <span class="text-red-500">*</span>
              </label>
              <select
                id="status"
                v-model="projectData.project_status"
                :class="{ 'border-red-500 focus:ring-red-500': errors.project_status }"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="" disabled>Select Status</option>
                <option value="on-progress">On Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <p v-if="errors.project_status" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.project_status[0] }}
              </p>
            </div>

            <!-- Follow Up -->
            <div>
              <label for="followUp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Follow Up
              </label>
              <select
                id="followUp"
                v-model="projectData.follow_up"
                :class="{ 'border-red-500 focus:ring-red-500': errors.follow_up }"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="">None</option>
                <option value="on-progress">On Progress</option>
                <option value="completed">Completed</option>
              </select>
              <p v-if="errors.follow_up" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.follow_up[0] }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isLoading"
                class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
              >
                <span v-if="isLoading">
                  <i class="fas fa-spinner fa-spin"></i> Updating...
                </span>
                <span v-else>Update Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
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
  await Promise.all([
    fetchProjectData(),
    fetchContracts()
  ]);
});

async function fetchProjectData() {
  try {
    const response = await axios.get(`api/projects/${route.params.project_id}`);
    const data = response.data.data;

    projectData.value = {
      project_id: data.project_id || '',
      contract_id: data.contract_id || '',
      contract: { title: data.contract?.title || '' },
      project_status: data.project_status || '',
      follow_up: data.follow_up || ''
    };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load project');
  }
}

async function fetchContracts() {
  try {
    const response = await axios.get('api/c-dropdown');
    contracts.value = response.data.data || [];
  } catch (error) {
    toast.error('Failed to load contracts');
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

    toast.success(response.data.message || 'Project updated successfully');
    router.push('/adminview-assignedprojects');
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.errors) {
      errors.value = error.response.data.errors;
      toast.warning('Please correct the highlighted fields');
    } else {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  router.push('/adminview-assignedprojects');
}
</script>