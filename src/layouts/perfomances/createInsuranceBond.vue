<template>
  <div class="py-5 add-user" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-plus"></i> Create Insurance Bond</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Insurance Bond Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>
          
          <!-- Tender Selection -->
          <div class="row">
            <div class="col-sm-6">
              <label for="tenderSelect" class="form-label">Select Tender</label>
              <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="insuranceBondData.tender_id">
                <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
              </select>
            </div>
          </div>

          <!-- Insurance Bond File -->
          <div class="mt-4 row">
            <div class="col-sm-6">
              <label for="insuranceFile" class="form-label">Insurance Bond Document (PDF)</label>
              <input type="file" id="insuranceFile" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
            </div>
          </div>

          <!-- Receiver Email -->
          <div class="mt-4 row">
            <div class="col-sm-6">
              <label for="receiverEmail" class="form-label">Receiver Email (Optional)</label>
              <input 
                type="email" 
                id="receiverEmail" 
                class="w-full px-3 py-2 border rounded form-control" 
                v-model="insuranceBondData.receiver_email" 
                placeholder="Enter receiver email"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="createInsuranceBond" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
              <i class="fa fa-plus"></i> Save Insurance Bond
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/insurance-bond" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
const insuranceBondData = ref({
  tender_id: '',
  insurance_file: null,
  receiver_email: '',
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
    insuranceBondData.value.insurance_file = file;
  } else {
    toast.error('Please upload a PDF file.');
  }
}

// Create insurance bond
async function createInsuranceBond() {
  isLoading.value = true;

  // Validation
  if (!insuranceBondData.value.tender_id || !insuranceBondData.value.insurance_file) {
    toast.error('Please fill in all required fields');
    isLoading.value = false;
    return;
  }

  // Validate receiver_email if provided
  if (insuranceBondData.value.receiver_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(insuranceBondData.value.receiver_email)) {
    toast.error('Please enter a valid receiver email');
    isLoading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append('tender_id', insuranceBondData.value.tender_id);
  formData.append('insurance_file', insuranceBondData.value.insurance_file);
  if (insuranceBondData.value.receiver_email) {
    formData.append('receiver_email', insuranceBondData.value.receiver_email);
  }

  try {
    const response = await axios.post('api/insurance-bond', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.status) {
      toast.success(response.data.message);
      router.push('/insurance-bond');
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
    if (error.response.data.results?.insurance_bond?.error) {
      message += ': ' + error.response.data.results.insurance_bond.error;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}
</script>