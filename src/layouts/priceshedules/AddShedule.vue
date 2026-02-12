<template>
  <div class="add-user py-6 md:py-10 min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div
          class="px-6 py-4 flex items-center justify-between text-white"
          style="background-color: #283747;"
        >
          <div class="flex items-center gap-3 text-lg font-semibold">
            <i class="fa fa-file-invoice"></i>
            Submit Quotation
          </div>
          <button
            type="button"
            class="p-2 rounded-full hover:bg-white/20 transition-colors"
            @click="closeModal"
          >
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 md:p-8">
          <form @submit.prevent="storeSchedule" class="space-y-6">
            <!-- Tender Selection -->
            <div>
              <label for="tenderSelect" class="block text-sm font-medium text-gray-700 mb-2">
                Select Tender <span class="text-red-500">*</span>
              </label>
              <select
                id="tenderSelect"
                v-model="scheduleData.tender_id"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                :disabled="isLoading"
              >
                <option value="" disabled>Select a Tender</option>
                <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                  {{ tender.title }}
                </option>
              </select>
            </div>

            <!-- File Upload -->
            <div>
              <label for="scheduleFile" class="block text-sm font-medium text-gray-700 mb-2">
                Upload Quotation File <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <label
                  for="scheduleFile"
                  class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  :class="{ 'border-blue-500 bg-blue-50': scheduleData.excel_file }"
                >
                  <div class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <i class="fa fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                    <p class="text-sm text-gray-600">
                      <span class="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Excel files only (.xlsx, .xls)
                    </p>
                    <p v-if="scheduleData.excel_file" class="text-sm text-green-600 mt-2 font-medium">
                      {{ scheduleData.excel_file.name }}
                    </p>
                  </div>
                  <input
                    id="scheduleFile"
                    type="file"
                    class="hidden"
                    accept=".xlsx,.xls"
                    @change="handleFileUpload('excel_file', $event)"
                    :disabled="isLoading"
                  />
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg shadow-md transition-all"
                :style="{ backgroundColor: '#283747' }"
                :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
                :disabled="isLoading"
              >
                <i class="fa fa-save"></i>
                Submit Quotation
                <span v-if="isLoading" class="ml-2 flex items-center gap-2">
                  <i class="fa fa-spinner fa-spin"></i>
                </span>
              </button>

              <router-link
                to="/user/schedules"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                <i class="fa fa-times"></i>
                Cancel
              </router-link>
            </div>
          </form>
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

onMounted(async () => {
  await fetchTenders();
});

async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

function handleFileUpload(fileKey, event) {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid Excel file (.xlsx or .xls)');
    event.target.value = '';
    return;
  }

  scheduleData.value[fileKey] = file;
}

async function storeSchedule() {
  if (!scheduleData.value.tender_id || !scheduleData.value.excel_file) {
    toast.error('Please select a tender and upload an Excel file.');
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('tender_id', scheduleData.value.tender_id);
    formData.append('excel_file', scheduleData.value.excel_file);

    const response = await axios.post('api/price-shedules', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success(
      `${response.data.message} (${response.data.rows_imported || 0} rows imported)`
    );
    router.push('/user/schedules');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response?.data) {
    message = error.response.data.message || message;
    if (error.response.data.error) message += `: ${error.response.data.error}`;
  } else if (error.request) {
    message = 'No response from server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function closeModal() {
  router.push('/user/schedules');
}
</script>

<style scoped>
/* Optional: Add subtle animations or extra polish if desired */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>