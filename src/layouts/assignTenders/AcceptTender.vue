<template>
    <div class="py-5 edit-assignment" style="font-family: 'cygre', serif; font-size: 23px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i> Accept/Reject Assigned Tender</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Assignment Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Accept/reject assigned tender</h3>
            
            <!-- Tender and Engineer Selection -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="tenderSelect" class=" form-label">Select Tender</label>
                <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.tender_id" readonly>
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
                </select>
              </div>
              <div>
                <label for="engineerSelect" class=" form-label">Select Engineer</label>
                <select id="engineerSelect" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.user_id" readonly>
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
                </select>
              </div>
            </div>
  
            <!-- HOD and Status Selection -->
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="hodSelect" class=" form-label">Select Head of Department (HOD)</label>
                <select id="hodSelect" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.is_sent_to_hod" readonly>
                  <option v-for="user in hods" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
                </select>
              </div>
              <div>
                <label for="assignmentStatus" class=" form-label">Status</label>
                <select id="assignmentStatus" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.status" readonly>
                  <option value="assigned">Assigned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
  
            <!-- Date and Expiry Fields -->
            <div class="mt-4">
              <label for="dateOfSubmission" class=" form-label">Date of Submission</label>
              <input type="date" id="dateOfSubmission" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.date_of_submission"  readonly>
            </div>
            <div class="mt-4">
              <label for="expireDate" class=" form-label">Expire Date</label>
              <input type="date" id="expireDate" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.expire_date" readonly>
            </div>
  
            <div>
                <label for="assignmentrecieved_status" class=" form-label">Accept/Reject Tender</label>
                <select id="assignmentrecieved_status" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.recieved_status" readonly>
                  <option value="taken">Accepted</option>
                  <option value="cancelled">Rejected</option>
                </select>
              </div>
              
            <div class="flex gap-4 mt-4">
              <button @click="updateAssignment" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
                Update Assignment
                <!-- Loading Spinner -->
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/my-tender" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  
  const assignmentData = ref({ 
    tender_id: '', 
    user_id: '', 
    is_sent_to_hod: '', 
    status: 'assigned', 
    date_of_submission: '', 
    expire_date: '',
    recieved_status: ''
  });
  const tenders = ref([]);
  const engineers = ref([]);
  const hods = ref([]);
  const isLoading = ref(false);
  
  onMounted(async () => {
    await fetchAssignmentData();
    await fetchTenders();
    await fetchEngineers();
    await fetchHods();
  });
  
  async function fetchAssignmentData() {
    try {
      const response = await axios.get(`api/assign/tender/${route.params.assign_id}`);
      assignmentData.value = response.data.data;
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
  
  async function updateAssignment() {
    isLoading.value = true;
    try {
      const response = await axios.put(`api/assign/tender/${route.params.assign_id}`, assignmentData.value);
      toast.success(response.data.message);
      router.push('/my-tender');
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
  
  <style scoped>
  .edit-assignment {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  