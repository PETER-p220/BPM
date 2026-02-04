<template>
  <div class="py-5 edit-contract" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-edit"></i> Edit Contract</div>
          <router-link to="/contracts" class="text-white">
            <i class="fa fa-times"></i>
          </router-link>
        </div>
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Contract</h3>
          <div v-if="isLoading" class="flex items-center justify-center">
            <i class="fa fa-spinner fa-spin mr-2"></i> Loading...
          </div>
          <div v-else>
            <div class="row">
              <div class="col-sm-6">
                <label for="title" class="form-label">Contract Title</label>
                <input type="text" id="title" class="w-full px-3 py-2 border rounded form-control" v-model="contractData.title" />
              </div>
              <div class="col-sm-6">
                <label for="timeLineCategory" class="form-label">Timeline Category</label>
                <input type="text" id="timeLineCategory" class="w-full px-3 py-2 border rounded form-control" v-model="contractData.time_line_category" />
              </div>
            </div>
            <div class="mt-4 row">
              <div class="col-sm-6">
                <label for="startDate" class="form-label">Start Date</label>
                <input type="date" id="startDate" class="w-full px-3 py-2 border rounded form-control" v-model="contractData.start_date" />
              </div>
              <div class="col-sm-6">
                <label for="endDate" class="form-label">End Date</label>
                <input type="date" id="endDate" class="w-full px-3 py-2 border rounded form-control" v-model="contractData.end_date" />
              </div>
            </div>
            <div class="mt-4">
              <label for="status" class="form-label">Status</label>
              <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="contractData.status">
                <option value="on-progress">On Progress</option>
                <option value="cancelled">Cancelled</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <div class="mt-4">
              <label for="performanceGuarantee" class="form-label">Performance Guarantee</label>
              <input type="text" id="performanceGuarantee" class="w-full px-3 py-2 border rounded form-control" v-model="contractData.performance_guarantee" />
            </div>
            <div class="mt-4">
              <label for="pdfFile" class="form-label">Upload New Contract PDF (optional)</label>
              <input type="file" id="pdfFile" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload('pdf_file', $event)" accept=".pdf" />
              <p v-if="contractData.pdf_file && typeof contractData.pdf_file === 'string'" class="text-sm text-gray-500">
                Current file: <a :href="contractData.pdf_file" target="_blank" class="text-blue-500 hover:underline">View PDF</a>
              </p>
            </div>
            <div class="flex gap-4 mt-4">
              <button @click="updateContract" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
                <i class="fa fa-save"></i> Update Contract
                <span v-if="isLoadingUpdate" class="flex items-center gap-2">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <router-link to="/contracts" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <i class="fa fa-times"></i> Cancel
              </router-link>
            </div>
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
const contractData = ref({
  title: '',
  time_line_category: '',
  start_date: '',
  end_date: '',
  status: '',
  performance_guarantee: '',
  pdf_file: null,
});
const isLoading = ref(false);
const isLoadingUpdate = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchContractData();
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
});

async function fetchContractData() {
  try {
    const response = await axios.get(`api/contracts/${route.params.contract_id}`);
    contractData.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

function handleFileUpload(fileKey, event) {
  contractData.value[fileKey] = event.target.files[0];
}

async function updateContract() {
  isLoadingUpdate.value = true;
  try {
    const formData = new FormData();
    Object.keys(contractData.value).forEach(key => {
      if (contractData.value[key] !== null && (key !== 'pdf_file' || contractData.value[key] instanceof File)) {
        formData.append(key, contractData.value[key]);
      }
    });

    const response = await axios.put(`api/contracts/${route.params.contract_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success(response.data.message);
    router.push('/contracts');
  } catch (error) {
    handleError(error);
  } finally {
    isLoadingUpdate.value = false;
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