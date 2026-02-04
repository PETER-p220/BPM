<template>
    <div class="py-5 add-user" style="font-family: 'cygre', serif; font-size: 23px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-plus"></i> Assign Tender</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Tender Assignment Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Assign Awarded Tender</h3>
  
            <!-- Tender and Engineer Selection -->
            <div class="row">
              <div class="col-sm-6">
                <label for="tenderSelect" class=" form-label">Select Tender</label>
                <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.tender_id">
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
                </select>
              </div>
              <div class="col-sm-6">
                <label for="engineerSelect" class=" form-label">Select Engineer</label>
                <select id="engineerSelect" class="w-full px-3 py-2 border rounded form-control" v-model="assignmentData.user_id">
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
                </select>
              </div>
            </div>
  
            <!-- Description and Document -->
            <div class="mt-4 row">
              <div class="col-sm-12">
                <label for="awardedDocument" class=" form-label">Awarded Document (PDF, DOC, DOCX)</label>
                <input type="file" id="awardedDocument" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="assignTender" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
                <i class="fa fa-plus"></i> Assign Tender
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/adminview-awardedtender" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  const assignmentData = ref({
    tender_id: '',
    user_id: '',
    awarded_document: null,
  });
  const tenders = ref([]);
  const engineers = ref([]);
  const isLoading = ref(false);
  
  // Fetch tenders and engineers on component mount
  onMounted(async () => {
    await fetchTenders();
    await fetchEngineers();
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
  
  // Fetch engineers from API
  async function fetchEngineers() {
    try {
      const response = await axios.get('api/dropdown/engineer');
      engineers.value = response.data.users;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Handle file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      assignmentData.value.awarded_document = file;
    } else {
      toast.error('Please upload a PDF, DOC, or DOCX file.');
    }
  }
  
  // Assign tender to user
  async function assignTender() {
    isLoading.value = true;
  
    // Validation
    if (!assignmentData.value.tender_id || !assignmentData.value.user_id || !assignmentData.value.awarded_document) {
      toast.error('Please fill in all required fields');
      isLoading.value = false;
      return;
    }
  
    const formData = new FormData();
    formData.append('tender_id', assignmentData.value.tender_id);
    formData.append('user_id', assignmentData.value.user_id);
    formData.append('awarded_document', assignmentData.value.awarded_document);
  
    try {
      const response = await axios.post('api/awarded-tender', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      router.push('/adminview-awardedtender');
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
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
    toast.error(message);
  }
  </script>
  
  <style scoped>
  /* Add custom styles here */
  </style>
  