<template>
  <div class="min-h-screen py-8 bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <!-- Card -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div
          class="px-6 py-5 flex items-center justify-between bg-slate-800 text-white"
        
        >
          <div class="flex items-center gap-3">
            <i class="fas fa-receipt text-xl"></i>
            <h2 class="text-xl font-semibold">Submit Receipt</h2>
          </div>
          <button
            @click="closeModal"
            class="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6 sm:p-8">
          <form @submit.prevent="submitReceipt" class="space-y-7">
            <!-- Accountant Selection -->
            <div>
              <label for="accountantSelect" class="block text-sm font-medium text-gray-700 mb-2">
                Select Accountant
              </label>
              <select
                id="accountantSelect"
                v-model="receiptData.accountant_id"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                :class="{ 'text-gray-400 bg-gray-50': !receiptData.accountant_id }"
                required
              >
                <option value="" disabled>Select an accountant</option>
                <option v-for="acc in accountants" :key="acc.user_id" :value="acc.user_id">
                  {{ acc.name }}
                </option>
              </select>
            </div>

            <!-- File Upload Area -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Upload Receipt Image
              </label>

              <div
                class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                :class="{
                  'border-blue-500 bg-blue-50': receiptData.receipt_file,
                  'border-red-400 bg-red-50': fileError
                }"
                @dragover.prevent
                @dragenter.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="handleDrop"
                @click="$refs.fileInput.click()"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  class="hidden"
                  @change="handleFileUpload"
                />

                <div v-if="receiptData.receipt_file" class="space-y-3">
                  <i class="fas fa-file-image text-5xl text-blue-600"></i>
                  <p class="text-base font-medium text-gray-800 truncate max-w-xs mx-auto">
                    {{ receiptData.receipt_file.name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ formatFileSize(receiptData.receipt_file.size) }}
                  </p>
                  <button
                    type="button"
                    @click.stop="clearFile"
                    class="text-sm text-red-600 hover:text-red-800 hover:underline"
                  >
                    Remove file
                  </button>
                </div>

                <div v-else-if="fileError" class="space-y-2">
                  <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
                  <p class="text-sm font-medium text-red-700">{{ fileError }}</p>
                </div>

                <div v-else class="space-y-3">
                  <i class="fas fa-cloud-upload-alt text-5xl text-gray-400"></i>
                  <p class="text-base font-medium text-gray-700">
                    Drag & drop your receipt here or
                    <span class="text-blue-600 font-semibold">click to browse</span>
                  </p>
                  <p class="text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF • Max 10 MB
                  </p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description / Notes 
              </label>
              <textarea
                id="description"
                v-model="receiptData.description"
                rows="4"
                placeholder="Add invoice number, date, purpose, amount, or any other details..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                :disabled="isLoading || !formIsValid"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#283747] text-white font-medium rounded-lg hover:bg-[#1e2e5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-upload"></i>
                {{ isLoading ? 'Submitting...' : 'Submit Receipt' }}
              </button>

              <router-link
                to="/my/receipt"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all shadow-sm"
              >
                <i class="fas fa-times"></i>
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
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const receiptData = ref({
  accountant_id: '',
  description: '',
  receipt_file: null,
});

const accountants = ref([]);
const isLoading = ref(false);
const fileInput = ref(null);
const fileError = ref(null);
const dragOver = ref(false);

const formIsValid = computed(() => {
  return receiptData.value.accountant_id && receiptData.value.receipt_file !== null;
});

onMounted(async () => {
  await fetchAccountants();
});

async function fetchAccountants() {
  try {
    const response = await axios.get('/api/dropdown/accountants');
    accountants.value = response.data.users || [];
  } catch (error) {
    handleError(error);
  }
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  validateAndSetFile(file);
}

function handleDrop(event) {
  event.preventDefault();
  dragOver.value = false;
  const file = event.dataTransfer.files?.[0];
  validateAndSetFile(file);
}

function validateAndSetFile(file) {
  fileError.value = null;

  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    fileError.value = 'Only JPG, PNG, or GIF images are allowed';
    toast.error(fileError.value);
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    fileError.value = 'File size must not exceed 10MB';
    toast.error(fileError.value);
    return;
  }

  receiptData.value.receipt_file = file;
  fileError.value = null;
}

function clearFile() {
  receiptData.value.receipt_file = null;
  fileError.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function submitReceipt() {
  if (!formIsValid.value) {
    toast.warning('Please select an accountant and upload a valid receipt image.');
    return;
  }

  isLoading.value = true;
  fileError.value = null;

  const formData = new FormData();
  formData.append('accountant_id', receiptData.value.accountant_id);
  formData.append('receipt_file', receiptData.value.receipt_file);
  if (receiptData.value.description.trim()) {
    formData.append('description', receiptData.value.description.trim());
  }

  try {
    const response = await axios.post('/api/receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success(response.data.message || 'Receipt submitted successfully!');
    router.push('/my/receipt');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  let message = 'Something went wrong. Please try again.';
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  }
  toast.error(message);
}

function closeModal() {
  router.push('/my/receipt');
}
</script>

<style scoped>
/* Better focus states */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
</style>