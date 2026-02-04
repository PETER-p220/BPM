<template>
    <div class="py-5 edit-assignment" style="font-family: 'cygre', serif; font-size: 23px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i>Accept/Reject Project</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Project Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
            
            <!-- Project and Engineer Selection -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="tenderSelect" class=" form-label">Tender</label>
                <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.tender_id" disabled>
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
                </select>
              </div>
            </div>
  
            <!-- HOD and Status Selection -->
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          
              <div>
                <label for="projectStatus" class="font-semibold form-label">Project Status</label>
                <input type="text" id="budget" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.project_status" disabled />
              </div>
              
            </div>
  
           
              
           
  
            <!-- Date Fields -->
            <div class="mt-4">
              <label for="startDate" class="font-semibold form-label">Start Date</label>
              <input type="date" id="startDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.start_date" disabled />
            </div>
            <div class="mt-4">
              <label for="endDate" class="font-semibold form-label">End Date</label>
              <input type="date" id="endDate" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.end_date" disabled />
            </div>
  
  
            <!-- is_viewed Dropdown (Editable) -->
            <div class="mt-4">
              <label for="isViewed" class="font-semibold form-label">View Status</label>
              <select id="isViewed" class="w-full px-3 py-2 border rounded form-control" v-model="projectData.is_viewed">
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
  
            <div class="flex gap-4 mt-4">
              <button @click="updateProject" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
                Accept/Reject Project
                <!-- Loading Spinner -->
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                  <a href="/hodview-projects"><i class="fa fa-times"></i> Cancel</a>
                </button>
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
    project_name: '',
    tender_id: '',
    description: '',
    budget: '',
    user_id: '',
    created_by: '',
    is_sent_to_hod: '',
    project_status: 'on-progress',
    performance_status: 'poor',
    start_date: '',
    end_date: '',
    is_viewed: '' // Added is_viewed field
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
      const response = await axios.put(`api/projects/${route.params.project_id}`, projectData.value);
      toast.success(response.data.message);
      router.push('/hodview-projects');
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
  