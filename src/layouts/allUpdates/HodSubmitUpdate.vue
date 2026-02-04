<template>
    <div class="py-5 add-activity" style="font-family: 'cygre', serif; font-size: 23px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-plus"></i> Submit  Update</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Project Update Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
  
            <!-- Update Title Section -->
            <div class="mb-4">
              <label for="title" class="font-semibold form-label">Update Title</label>
              <div v-for="(title, index) in updateData.titles" :key="index" class="flex items-center mb-2">
                <input type="text" class="w-full px-3 py-2 border rounded form-control" v-model="updateData.titles[index]" />
                <button type="button" class="ml-2 text-red-500" @click="removeTitle(index)">
                  <i class="fa fa-minus-circle"></i>
                </button>
              </div>
              <button type="button" class="" @click="addTitle" style="color:#283747;">
                <i class="fa fa-plus-circle"></i> Add update
              </button>
            </div>
  
            <!-- Other sections remain the same -->
            <!-- Update Photo Section -->
            <div class="mb-4">
              <label for="update_photo" class="font-semibold form-label">Update Photo (Image)</label>
              <input type="file" id="update_photo" class="w-full px-3 py-2 border rounded form-control" @change="handlePhotoUpload" />
            </div>
  
            <!-- Update File Section -->
            <div class="mb-4">
              <label for="update_file" class="font-semibold form-label">Update File (PDF, Excel, etc.)</label>
              <input type="file" id="update_file" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
            </div>
  
            <!-- Description Section -->
            <div class="mt-4">
              <label for="description" class="font-semibold form-label">Description</label>
              <textarea id="description" class="w-full px-3 py-2 border rounded form-control" v-model="updateData.description"></textarea>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="submitUpdate" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
                <i class="fa fa-plus"></i> Submit Update
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/hodview-updates" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  import { ref } from 'vue';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  import { useRouter } from 'vue-router';
  
  const toast = useToast();
  const router = useRouter();
  
  const updateData = ref({
    titles: [''], // Array to store multiple titles
    description: '',
    update_photo: null,
    update_file: null,
  });
  
  const isLoading = ref(false);
  
  // Handle photo file upload
  function handlePhotoUpload(event) {
    const file = event.target.files[0];
    updateData.value.update_photo = file;
  }
  
  // Handle general file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    updateData.value.update_file = file;
  }
  
  // Add a new title input field
  function addTitle() {
    updateData.value.titles.push('');
  }
  
  // Remove a title input field
  function removeTitle(index) {
    if (updateData.value.titles.length > 1) {
      updateData.value.titles.splice(index, 1);
    } else {
      toast.error('At least one title is required.');
    }
  }
  
  // Submit update
  async function submitUpdate() {
    isLoading.value = true;
  
    // Validation: Ensure all required fields are filled
    if (updateData.value.titles.some(title => !title)) {
      toast.error('Please fill in all titles.');
      isLoading.value = false;
      return;
    }
  
    try {
      const formData = new FormData();
      updateData.value.titles.forEach((title, index) => {
        formData.append(`titles[${index}]`, title);
      });
      formData.append('description', updateData.value.description);
  
      if (updateData.value.update_photo) {
        formData.append('update_photo', updateData.value.update_photo);
      }
      if (updateData.value.update_file) {
        formData.append('update_file', updateData.value.update_file);
      }
  
      const response = await axios.post('api/updates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      toast.success(response.data.message);
      router.push('/hodview-updates');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Handle error
  function handleError(error) {
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : 'Something went wrong!';
    toast.error(errorMessage);
    isLoading.value = false;
  }
  </script>
  