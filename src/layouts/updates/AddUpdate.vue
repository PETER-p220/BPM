<template>
  <div class="py-5 add-update" style="font-family: 'cygre', serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-plus"></i> Submit New Update</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>
          <div class="mb-4">
            <label for="titles" class=" form-label">Titles</label>
            <div v-for="(title, index) in newUpdateData.titles" :key="index" class="flex items-center gap-2 mb-2">
              <input
                type="text"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="newUpdateData.titles[index]"
                placeholder="Enter title"
              />
              <button class="px-3 py-1 text-white bg-red-600 rounded" @click="removeTitle(index)">Remove</button>
            </div>
            <button class="px-3 py-1 mt-2 text-white rounded" @click="addTitle" style="background-color: #154360;">+ Add Title</button>
          </div>
          
          <div class="mb-4">
            <label for="description" class=" form-label">More Details</label>
            <textarea
              id="description"
              class="w-full px-3 py-2 border rounded form-control"
              rows="4"
              v-model="newUpdateData.description"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="updatePhoto" class=" form-label">Upload Photo(Optional)</label>
            <input type="file" id="updatePhoto" @change="handlePhotoUpload" class="w-full px-3 py-2 border rounded form-control" />
          </div>
          
          <div class="mb-4">
            <label for="updateFile" class="form-label">Upload File(Optional)</label>
            <input type="file" id="updateFile" @change="handleFileUpload" class="w-full px-3 py-2 border rounded form-control" />
          </div>

          <div class="flex gap-4 mt-4">
            <button @click="addUpdate" class="px-4 py-2 text-white rounded" style="background-color: #154360;">
              <i class="fa fa-plus"></i> Save changes
              <span v-if="isLoading">
                <i class="fa fa-spinner fa-spin"></i> Updating...
              </span>
            </button>
            
            <router-link to="/my/updates" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              <i class="fa fa-times"></i> Cancel
            </router-link>
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

const toast = useToast();
const newUpdateData = ref({ titles: [''], description: '', updatePhoto: null, updateFile: null });
const isLoading = ref(false);

const addTitle = () => {
  newUpdateData.value.titles.push('');
};

const removeTitle = (index) => {
  newUpdateData.value.titles.splice(index, 1);
};

const handlePhotoUpload = (event) => {
  newUpdateData.value.updatePhoto = event.target.files[0];
};

const handleFileUpload = (event) => {
  newUpdateData.value.updateFile = event.target.files[0];
};

const addUpdate = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    newUpdateData.value.titles.forEach(title => formData.append('titles[]', title));
    formData.append('description', newUpdateData.value.description);
    if (newUpdateData.value.updatePhoto) formData.append('update_photo', newUpdateData.value.updatePhoto);
    if (newUpdateData.value.updateFile) formData.append('update_file', newUpdateData.value.updateFile);

    await axios.post('api/updates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success('Update added successfully');
    newUpdateData.value = { titles: [''], description: '', updatePhoto: null, updateFile: null };
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred');
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  // Close modal logic here
};
</script>

<style scoped>
.add-update {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>