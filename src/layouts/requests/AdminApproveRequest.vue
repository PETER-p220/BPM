<template>
    <div class="py-5 edit-assignment" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i> Approve/Reject Project Request</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Project Request Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Approve/reject project request here</h3>
  
            <!-- Select Department, Project (col-md-6 for both fields) -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="department" class="font-semibold form-label">Select Department</label>
                <select id="department" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.department_id">
                  <option value="">None</option>
                  <option v-for="department in departments" :key="department.department_id" :value="department.department_id">
                    {{ department.name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="project" class="font-semibold form-label">Select Project</label>
                <select id="project" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.project_id">
                  <option value="">None</option>
                  <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                    {{ project.project_name }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- Description Field -->
            <div class="mt-4">
              <label for="description" class="font-semibold form-label">Description</label>
              <textarea id="description" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.description" rows="4"></textarea>
            </div>
  
            <!-- Amount Field -->
            <div class="mt-4">
              <label for="amount" class="font-semibold form-label">Amount</label>
              <input type="number" id="amount" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.amount">
            </div>
  
            <!-- Approval Status Field -->
            <div class="mt-4">
              <label for="is_approved" class="font-semibold form-label">Approval Status</label>
              <select id="is_approved" class="w-full px-3 py-2 border rounded form-control" v-model="requestData.is_approved">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
  
            <!-- Submit Button -->
            <div class="flex gap-4 mt-4">
              <button @click="updateRequest" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
                Save Changes
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/adminview-projectsrequests" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  
  const requestData = ref({
    department_id: '',
    project_id: '',
    description: '',
    amount: '',
    is_approved: 'pending', // Default to pending
    item: [], // Make sure item is handled properly as an array
  });
  
  const departments = ref([]);
  const projects = ref([]);
  const isLoading = ref(false);
  
  onMounted(async () => {
    await fetchRequestData();
    await fetchDepartments();
    await fetchProjects();
  });
  
  async function fetchRequestData() {
    try {
      const response = await axios.get(`api/requests-for-projects/${route.params.request_id}`);
      requestData.value = response.data.data;
      // Set the item as an array
      requestData.value.item = requestData.value.item.split(" | ");
    } catch (error) {
      handleError(error);
    }
  }
  
  async function fetchDepartments() {
    try {
      const response = await axios.get('api/dropdown/department');
      departments.value = response.data.departments;
    } catch (error) {
      handleError(error);
    }
  }
  
  async function fetchProjects() {
    try {
      const response = await axios.get('api/dropdown/projects');
      projects.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  async function updateRequest() {
    isLoading.value = true;
    try {
      // Make sure to join the items before sending
      requestData.value.item = requestData.value.item.join(" | ");
      const response = await axios.put(`api/requests-for-projects/${route.params.request_id}`, requestData.value);
      toast.success(response.data.message);
      router.push('/adminview-projectsrequests');
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
  