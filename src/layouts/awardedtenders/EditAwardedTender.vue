<template>
    <div class="py-5 edit-awarded-tender" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Awarded Tender</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Awarded Tender Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Edit Awarded Tender</h3>
  
            <!-- Awarded Tender Fields -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="tenderSelect" class="font-semibold form-label">Select Tender</label>
                <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="awardedTenderData.tender_id">
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
                </select>
              </div>
              <div>
                <label for="engineerSelect" class="font-semibold form-label">Select Engineer</label>
                <select id="engineerSelect" class="w-full px-3 py-2 border rounded form-control" v-model="awardedTenderData.user_id">
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
                </select>
              </div>
            </div>
  
            <!-- Additional Fields -->
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="isSent" class="font-semibold form-label">Is Sent</label>
                <select id="isSent" class="w-full px-3 py-2 border rounded form-control" v-model="awardedTenderData.is_sent">
                  <option value="sent">Sent</option>
                  <option value="not-sent">Not Sent</option>
                </select>
              </div>
            </div>
  
            <div class="flex gap-4 mt-4">
              <button @click="updateAwardedTender" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
                Update Awarded Tender
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/awarded/tenders" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  
  const awardedTenderData = ref({
    tender_id: '',
    user_id: '',
    is_sent: '',
  });
  
  const tenders = ref([]);
  const engineers = ref([]);
  const isLoading = ref(false);
  
  onMounted(async () => {
    await fetchAwardedTenderData();
    await fetchTenders();
    await fetchEngineers();
  });
  
  async function fetchAwardedTenderData() {
    try {
      const response = await axios.get(`api/awarded-tender/${route.params.award_id}`);
      awardedTenderData.value = response.data.data;
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
  
  async function updateAwardedTender() {
    isLoading.value = true;
    try {
      const response = await axios.put(`api/awarded-tender/${route.params.award_id}`, awardedTenderData.value);
      toast.success(response.data.message);
      router.push('/awarded/tenders');
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
  