<template>
  <div class="py-5 edit-assignment" style="font-family: 'cygre', serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-edit"></i> Accept/Reject Project</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Project Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"> </h3>

          <!-- Tender Selection -->
          <div class="mt-4">
            <label for="tenderSelect" class="form-label">Tender</label>
            <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.tender_id" disabled>
              <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
            </select>
          </div>

          <!-- Date Fields -->
          <div class="mt-4">
            <label for="startDate" class="form-label">Start Date</label>
            <input type="date" id="startDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.start_date" disabled />
          </div>
          <div class="mt-4">
            <label for="endDate" class="form-label">End Date</label>
            <input type="date" id="endDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.end_date" disabled />
          </div>

          <!-- Project Status -->
          <div>
            <label for="projectStatus" class="form-label">Project Status</label>
            <select id="projectStatus" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.project_status">
              <option value="on-progress">On Progress</option>
              <option value="failed">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="updateProject" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
              Save changes
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/my/projects" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  isLoading.value = true;
  try {
    const response = await axios.put(`api/projects/${route.params.project_id}`, projectData.value);
    toast.success(response.data.message);
    router.push('/my/projects');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
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
