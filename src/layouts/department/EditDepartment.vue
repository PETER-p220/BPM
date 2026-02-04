<template>
    <div class="py-5 edit-department" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Department</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Department Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
  
            <div v-if="!isLoading" class="grid grid-cols-1 gap-4">
              <div>
                <label for="departmentName" class="font-semibold form-label">Department Name</label>
                <input type="text" id="departmentName" class="w-full px-3 py-2 border rounded form-control" v-model="departmentData.name" />
              </div>
              <div class="mt-4">
                <label for="departmentLocation" class="font-semibold form-label">Location</label>
                <textarea id="departmentLocation" class="w-full px-3 py-2 border rounded form-control" v-model="departmentData.location" rows="3"></textarea>
              </div>
            </div>
  
            <div class="flex gap-4 mt-4">
              <button 
                @click="updateDepartment"
                class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" 
                style="background-color: #283747;"
                :disabled="isLoading" 
              >
                Save changes
                <span> <!-- Loading Spinner -->
                  <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                    <i class="fa fa-spinner fa-spin"></i> Loading...
                  </span></span>
              </button>
              
              <span>
                <router-link to="/departments" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  
  const departmentData = ref({ name: '', location: '' });
  const isLoading = ref(false); // Loading state
  
  onMounted(async () => {
    await fetchDepartmentData();
  });
  
  async function fetchDepartmentData() {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(`api/departments/${route.params.department_id}`); // Use department_id
    departmentData.value = response.data.data; // Access the 'data' property from the response and set it to departmentData
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false after request is complete
  }
}

  
  async function updateDepartment() {
    isLoading.value = true; // Set loading to true while updating
    try {
      const response = await axios.put(`api/departments/${route.params.department_id}`, departmentData.value); // Use department_id
      toast.success('Department updated successfully');
      router.push('/departments');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false; // Set loading to false after request is complete
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
  .edit-department {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  