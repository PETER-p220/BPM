<template>
    <div class="py-5 add-user" style="font-family: 'cygre', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-plus"></i> Create Award Letter</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Award Letter Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
            
            <!-- Tender Selection -->
            <div class="row">
              <div class="col-sm-6">
                <label for="tenderSelect" class="form-label">Select Tender</label>
                <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="awardLetterData.tender_id">
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
                </select>
              </div>
            </div>
  
            <!-- Award Letter File -->
            <div class="mt-4 row">
              <div class="col-sm-6">
                <label for="awardLetterFile" class="form-label">Award Letter Document (PDF)</label>
                <input type="file" id="awardLetterFile" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="createAwardLetter" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
                <i class="fa fa-plus"></i> Save Award Letter
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/awarding-letter" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  import { useToast } from 'vue-toastification';
  import { useRouter } from 'vue-router';
  
  const toast = useToast();
  const router = useRouter();
  const awardLetterData = ref({
    tender_id: '',
    awardletter_file: null,
  });
  const tenders = ref([]);
  const isLoading = ref(false);
  
  // Fetch tenders on component mount
  onMounted(async () => {
    await fetchTenders();
  });
  
  // Fetch tenders from API
  async function fetchTenders() {
    try {
      const response = await axios.get('api/dropdown/tender');
      tenders.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Handle file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      awardLetterData.value.awardletter_file = file;
    } else {
      toast.error('Please upload a PDF file.');
    }
  }
  
  // Create award letter
  async function createAwardLetter() {
    isLoading.value = true;
  
    // Validation
    if (!awardLetterData.value.tender_id || !awardLetterData.value.awardletter_file) {
      toast.error('Please fill in all required fields');
      isLoading.value = false;
      return;
    }
  
    const formData = new FormData();
    formData.append('tender_id', awardLetterData.value.tender_id);
    formData.append('awardletter_file', awardLetterData.value.awardletter_file);
  
    try {
      const response = await axios.post('api/award-letter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status) {
        toast.success(response.data.message);
        router.push('/awarding-letter');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Handle errors
  function handleError(error) {
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
      if (error.response.data.results?.award_letter?.error) {
        message += ': ' + error.response.data.results.award_letter.error;
      }
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
    toast.error(message);
  }
  </script>