<template>
  <div class="py-5 add-user" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-plus"></i> Submit Quotation</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Schedule Creation Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>
          
          <!-- First Row: Tender -->
          <div class="row">
            <div class="col-sm-12">
              <label for="tenderSelect" class="form-label">Select Tender</label>
              <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="scheduleData.tender_id">
                <option value="">Select a Tender</option>
                <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
              </select>
            </div>
          </div>

          <!-- File Upload -->
          <div class="mt-4">
            <label for="scheduleFile" class="form-label">Upload Quotation File (Excel: .xlsx, .xls)</label>
            <input type="file" id="scheduleFile" class="w-full px-3 py-2 border rounded form-control" 
                   accept=".xlsx,.xls" @change="handleFileUpload('excel_file', $event)" />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="storeSchedule" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" 
                    style="background-color:#283747;" :disabled="isLoading">
              <i class="fa fa-plus"></i> Save changes
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/user/schedules" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
const scheduleData = ref({
  tender_id: '',
  excel_file: null,
});
const tenders = ref([]);
const isLoading = ref(false);

// Fetch tenders on mount
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
function handleFileUpload(fileKey, event) {
  const file = event.target.files[0];
  if (file && !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
    toast.error('Please upload a valid Excel file (.xlsx or .xls)');
    event.target.value = '';
    return;
  }
  scheduleData.value[fileKey] = file;
}

// Store the new schedule
async function storeSchedule() {
  isLoading.value = true;

  // Validation
  if (!scheduleData.value.tender_id || !scheduleData.value.excel_file) {
    toast.error('Please select a tender and upload an Excel file.');
    isLoading.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append('tender_id', scheduleData.value.tender_id);
    formData.append('excel_file', scheduleData.value.excel_file);

    const response = await axios.post('api/price-shedules', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success(response.data.message + ` (${response.data.rows_imported} rows imported)`);
    router.push('/user/schedules');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Handle errors
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data) {
    message = error.response.data.message || 'Error processing the request';
    if (error.response.data.error) {
      message += `: ${error.response.data.error}`;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Close modal (if used in a modal context)
function closeModal() {
  router.push('/user/schedules');
}
</script>