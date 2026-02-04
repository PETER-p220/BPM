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
          
          <!-- Project and Engineer Selection -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="tenderSelect" class="form-label">Select Tender</label>
              <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.tender_id">
                <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
              </select>
            </div>
            <div>
              <label for="engineerSelect" class="form-label">Select Engineer</label>
              <select id="engineerSelect" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.user_id">
                <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
              </select>
            </div>
          </div>

          <!-- Other Fields: HOD, Status, Contract Title -->
          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="hodSelect" class="form-label">Select Head of Department (HOD)</label>
              <select id="hodSelect" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.is_sent_to_hod">
                <option value="">None</option>
                <option v-for="user in hods" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
              </select>
            </div>
            <div>
              <label for="projectStatus" class="form-label">Project Status</label>
              <input type="text" id="projectStatus" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.project_status" disabled />
            </div>
          </div>

          <!-- Contract Title (Read-only) -->
          <div class="mt-4">
            <label for="contractTitle" class="form-label">Contract Title</label>
            <input type="text" id="contractTitle" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.contract.title" disabled />
          </div>

          <!-- Follow Up -->
          <div class="mt-4">
            <label for="followUp" class="form-label">Follow Up</label>
            <input type="text" id="followUp" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.follow_up" />
          </div>

          <!-- Performance Status Selection -->
          <div class="mt-4">
            <label for="performanceStatus" class="form-label">Performance Status</label>
            <select id="performanceStatus" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.performance_status">
              <option value="poor">Poor</option>
              <option value="at-least-good">At Least Good</option>
              <option value="good">Good</option>
              <option value="very-good">Very Good</option>
              <option value="best">Best</option>
            </select>
          </div>

          <!-- Date Fields -->
          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="startDate" class="form-label">Start Date</label>
              <input type="date" id="startDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.start_date" />
            </div>
            <div>
              <label for="endDate" class="form-label">End Date</label>
              <input type="date" id="endDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.end_date" />
            </div>
          </div>

          <!-- Extended Date Field -->
          <div class="mt-4">
            <label for="extendedDate" class="form-label">Extended Date</label>
            <input type="date" id="extendedDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.extended_date" />
          </div>

          <!-- Budget and Description -->
          <div class="mt-4">
            <label for="budget" class="form-label">Budget</label>
            <input type="text" id="budget" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.budget" />
          </div>

          <div class="mt-4">
            <label for="description" class="form-label">Description</label>
            <textarea id="description" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.description"></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="updateProject" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
              Update Project
              <!-- Loading Spinner -->
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/adminview-assignedprojects" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const projectData = ref({
  project_id: '',
  project_name: '',
  tender_id: '',
  user_id: '',
  contract_id: '',
  contract: { title: '' },
  member_id: '',
  created_by: '',
  project_status: '',
  follow_up: '',
  start_date: '',
  end_date: '',
  extended_date: '',
  budget: '',
  is_sent_to_hod: '',
  description: '',
  performance_status: '',
  created_at: '',
  updated_at: ''
});
const tenders = ref([]);
const engineers = ref([]);
const hods = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  await fetchProjectData();
  await fetchTenders();
  await fetchEngineers();
  await fetchHods();
});

async function fetchProjectData() {
  try {
    const response = await axios.get(`api/projects/${route.params.project_id}`);
    const data = response.data.data;
    projectData.value = {
      project_id: data.project_id || '',
      project_name: data.project_name || '',
      tender_id: data.tender_id || '',
      user_id: data.user_id || '',
      contract_id: data.contract_id || '',
      contract: { title: data.contract?.title || 'NA' },
      member_id: data.member_id || '',
      created_by: data.created_by || '',
      project_status: data.project_status || '',
      follow_up: data.follow_up || '',
      start_date: formatDateForInput(data.start_date) || '',
      end_date: formatDateForInput(data.end_date) || '',
      extended_date: formatDateForInput(data.extended_date) || '',
      budget: data.budget || '',
      is_sent_to_hod: data.is_sent_to_hod || '',
      description: data.description || '',
      performance_status: data.performance_status || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || ''
    };
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

async function fetchEngineers() {
  try {
    const response = await axios.get('api/dropdown/engineer');
    engineers.value = response.data.users;
  } catch (error) {
    handleError(error);
  }
}

async function fetchHods() {
  try {
    const response = await axios.get('api/dropdown/hod');
    hods.value = response.data.users;
  } catch (error) {
    handleError(error);
  }
}

async function updateProject() {
  isLoading.value = true;
  try {
    const payload = {
      project_name: projectData.value.project_name,
      tender_id: projectData.value.tender_id,
      user_id: projectData.value.user_id,
      contract_id: projectData.value.contract_id,
      member_id: projectData.value.member_id,
      created_by: projectData.value.created_by,
      project_status: projectData.value.project_status,
      follow_up: projectData.value.follow_up,
      start_date: projectData.value.start_date,
      end_date: projectData.value.end_date,
      extended_date: projectData.value.extended_date || null,
      budget: projectData.value.budget || null,
      is_sent_to_hod: projectData.value.is_sent_to_hod || null,
      description: projectData.value.description || null,
      performance_status: projectData.value.performance_status || ''
    };
    const response = await axios.put(`api/projects/${route.params.project_id}`, payload);
    toast.success(response.data.message);
    router.push('/adminview-assignedprojects');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function formatDateForInput(date) {
  if (!date || date === 'NA') return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
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

function closeModal() {
  router.push('/adminview-assignedprojects');
}
</script>