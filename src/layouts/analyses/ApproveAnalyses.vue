<template>
    <div class="py-5 edit-analysis" style="font-family: 'cygre', serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-edit"></i> Approve/Reject Analysis</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Analysis Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
  
            <!-- Project (Non-editable) -->
            <div class="mb-4">
              <label for="project" class="form-label">Project</label>
              <input type="text" id="project" class="w-full px-3 py-2 border rounded form-control" :value="analysisData.project.project_name" disabled />
            </div>
  
            <!-- Analysis File (Non-editable) -->
            <div class="mb-4">
              <label for="analysis_file" class="form-label">Analysis File</label>
              <input type="text" id="analysis_file" class="w-full px-3 py-2 border rounded form-control" :value="analysisData.excel_file" disabled />
            </div>
  
            <!-- User Details (Non-editable) -->
            <div class="mb-4">
              <label for="user_name" class="form-label">Engineer</label>
              <input type="text" id="user_name" class="w-full px-3 py-2 border rounded form-control" :value="analysisData.user.name" disabled />
            </div>
  
            <!-- Department Details (Non-editable) -->
            <div class="mb-4">
              <label for="department_name" class="form-label">Department</label>
              <input type="text" id="department_name" class="w-full px-3 py-2 border rounded form-control" :value="analysisData.department.name" disabled />
            </div>
  
            <!-- Created At (Non-editable) -->
            <div class="mb-4">
              <label for="created_at" class="form-label">Created At</label>
              <input type="text" id="created_at" class="w-full px-3 py-2 border rounded form-control" :value="analysisData.created_at" disabled />
            </div>
  
            <!-- Status Dropdown (Editable) -->
            <div class="mb-4">
              <label for="status" class="form-label">Select Status To Approve or Reject</label>
              <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="analysisData.status">
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
              </select>
            </div>
  
            <!-- Reason for Rejection (Editable) -->
            <div class="mb-4" v-if="analysisData.status === 'rejected'">
              <label for="reason_for_reject" class="font-semibold form-label">Reason for Rejection</label>
              <textarea id="reason_for_reject" class="w-full px-3 py-2 border rounded form-control" v-model="analysisData.reason_for_reject"></textarea>
            </div>
  
            <!-- Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="updateAnalysis" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
                <i class="fa fa-pencil"></i> Save changes
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                  <a href="/all-analyses"><i class="fa fa-times"></i> Cancel</a>
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
  import { useToast } from 'vue-toastification';
  import { useRoute, useRouter } from 'vue-router';
  
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();
  
  const analysisData = ref({
    project_id: '',
    project: {},
    excel_file: '',
    status: 'pending',
    reason_for_reject: '',
    user: {},
    department: {},
    created_at: ''
  });
  
  const isLoading = ref(false);
  
  // Fetch the analysis data by project_id
  async function fetchAnalysisData() {
    try {
      const response = await axios.get(`api/approve-analysis/${route.params.project_id}`);
      analysisData.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Update the analysis with the provided data
  async function updateAnalysis() {
    isLoading.value = true;
    try {
      const response = await axios.put(`api/approve-analysis`, {
        project_id: route.params.project_id,
        status: analysisData.value.status,
        reason_for_reject: analysisData.value.reason_for_reject
      });
      toast.success('Analysis updated successfully');
      router.push('/all-analyses');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Handle errors and show appropriate messages
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
  
  // Fetch the analysis data when component is mounted
  onMounted(() => {
    fetchAnalysisData();
  });
  </script>
  
  <style scoped>
  /* Additional styling here */
  </style>