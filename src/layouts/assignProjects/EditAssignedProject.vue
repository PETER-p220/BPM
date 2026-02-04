<template>
  <div class="py-5 edit-assignment" style="font-family: 'cygre', serif; font-size: 23px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-edit"></i> Edit Project</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Project</h3>

          <!-- Validation Error Summary -->
          <div v-if="Object.keys(errors).length" class="p-4 mb-4 text-red-700 bg-red-100 rounded">
            <h4 class="mb-2 font-bold">Please fix the following errors:</h4>
            <ul class="pl-4 list-disc">
              <li v-for="(errorList, field) in errors" :key="field" class="mb-1">
                {{ errorList[0] }}
              </li>
            </ul>
          </div>

          <!-- Contract Title (Read-only) -->
          <div class="mt-4">
            <label for="contractTitle" class="form-label">Contract Title</label>
            <input type="text" id="contractTitle" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.contract.title" disabled />
          </div>

          <!-- Contract ID -->
          <div class="mt-4">
            <label for="contractSelect" class="form-label">Select Contract</label>
            <select id="contractSelect" class="w-full px-3 py-2 border rounded form-control" 
                    :class="{ 'border-red-500': errors.contract_id }" v-model="projectData.contract_id">
              <option value="" disabled>Select a contract</option>
              <option v-for="contract in contracts" :key="contract.contract_id" :value="contract.contract_id">
                {{ contract.title }}
              </option>
            </select>
            <span v-if="errors.contract_id" class="text-sm text-red-500">{{ errors.contract_id[0] }}</span>
          </div>

          <!-- Project Status -->
          <div class="mt-4">
            <label for="projectStatus" class="form-label">Project Status</label>
            <select id="projectStatus" class="w-full px-3 py-2 border rounded form-control" 
                    :class="{ 'border-red-500': errors.project_status }" v-model="projectData.project_status">
              <option value="" disabled>Select status</option>
              <option value="on-progress">On Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <span v-if="errors.project_status" class="text-sm text-red-500">{{ errors.project_status[0] }}</span>
          </div>

          <!-- Follow Up -->
          <div class="mt-4">
            <label for="followUp" class="form-label">Follow Up</label>
            <select id="followUp" class="w-full px-3 py-2 border rounded form-control" 
                    :class="{ 'border-red-500': errors.follow_up }" v-model="projectData.follow_up">
              <option value="">None</option>
              <option value="on-progress">On Progress</option>
              <option value="completed">Completed</option>
            </select>
            <span v-if="errors.follow_up" class="text-sm text-red-500">{{ errors.follow_up[0] }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="updateProject" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" 
                    style="background-color: #283747;" :disabled="isLoading">
              Update Project
              <span v-if="isLoading" class="flex items-center gap-2">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <router-link to="/adminview-assignedprojects" 
                         class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              <i class="fa fa-times"></i> Cancel
            </router-link>
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
  await Promise.all([fetchProjectData(), fetchContracts()]);
});

async function fetchProjectData() {
  try {
    const response = await axios.get(`api/projects/${route.params.project_id}`);
    const data = response.data.data;
    projectData.value = {
      project_id: data.project_id || '',
      contract_id: data.contract_id || '',
      contract: { title: data.contract?.title || 'NA' },
      project_status: data.project_status || '',
      follow_up: data.follow_up || ''
    };
  } catch (error) {
    handleError(error);
  }
}

async function fetchContracts() {
  try {
    const response = await axios.get('api/c-dropdown');
    contracts.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function updateProject() {
  isLoading.value = true;
  errors.value = {}; // Reset errors

  try {
    const payload = {
      contract_id: projectData.value.contract_id,
      project_status: projectData.value.project_status,
      follow_up: projectData.value.follow_up || null
    };
    const response = await axios.put(`api/projects/${route.params.project_id}`, payload);
    toast.success(response.data.message);
    router.push('/adminview-assignedprojects');
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      handleError(error);
    }
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  toast.error(message);
}

function closeModal() {
  router.push('/adminview-assignedprojects');
}
</script>