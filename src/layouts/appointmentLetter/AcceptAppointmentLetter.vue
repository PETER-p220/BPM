<template>
  <div class="py-6 md:py-10 min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div
          class="px-6 py-4 flex items-center justify-between text-white"
          style="background-color: #283747;"
        >
          <div class="flex items-center gap-3 text-lg font-semibold">
            <i class="fa fa-file-signature"></i>
            Accept / Reject Appointment Letter
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
          <div class="space-y-6">
            <!-- Tender Information -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tender
              </label>
              <div class="relative">
                <input
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 cursor-not-allowed"
                  :value="appointmentLetterData.tender?.title || 'Not available'"
                  disabled
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i class="fa fa-lock text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Letter File -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Appointment Letter File
              </label>
              <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <div class="flex-1">
                  <div
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed flex items-center justify-between"
                  >
                    <span>
                      {{ appointmentLetterData.letter_file ? 'Letter Available (PDF)' : 'No file' }}
                    </span>
                    <i class="fa fa-file-pdf text-red-600 text-xl"></i>
                  </div>
                </div>

                <button
                  v-if="appointmentLetterData.letter_file"
                  @click="downloadLetterFile(appointmentLetterData.letter_file)"
                  type="button"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
                  :disabled="isLoading"
                >
                  <i class="fa fa-download"></i>
                  Download PDF
                </button>
              </div>
            </div>

            <!-- Status Selection -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Your Decision <span class="text-red-500">*</span>
              </label>
              <select
                id="status"
                v-model="appointmentLetterData.status"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                :disabled="isLoading"
              >
                <option value="accepted">Accept Appointment Letter</option>
                <option value="rejected">Reject Appointment Letter</option>
              </select>

              <!-- Visual feedback / hint -->
              <div class="mt-2 text-sm" :class="statusHintClass">
                <i :class="statusIconClass" class="mr-1.5"></i>
                {{ statusHintText }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                @click="updateAppointmentLetter"
                type="button"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg shadow-md transition-all"
                :style="{ backgroundColor: '#283747' }"
                :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
                :disabled="isLoading"
              >
                <i class="fa fa-check-circle"></i>
                Submit Decision
                <span v-if="isLoading" class="ml-2 flex items-center gap-2">
                  <i class="fa fa-spinner fa-spin"></i>
                </span>
              </button>

              <router-link
                to="/user/appointment-letters"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                <i class="fa fa-times"></i>
                Cancel
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { saveAs } from 'file-saver';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const appointmentLetterData = ref({
  letter_id: '',
  tender: { title: '' },
  letter_file: '',
  status: 'accepted',
});

const isLoading = ref(false);

onMounted(async () => {
  await fetchAppointmentLetter();
});

async function fetchAppointmentLetter() {
  try {
    const response = await axios.get(`api/appointment-letter/${route.params.letter_id}`);
    appointmentLetterData.value = response.data.data || {};
    // Ensure status has a default if missing
    if (!appointmentLetterData.value.status) {
      appointmentLetterData.value.status = 'accepted';
    }
  } catch (error) {
    handleError(error);
  }
}

async function updateAppointmentLetter() {
  if (!['accepted', 'rejected'].includes(appointmentLetterData.value.status)) {
    toast.error('Please select a valid decision (Accept or Reject)');
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.put(`api/appointment-letter/${route.params.letter_id}`, {
      status: appointmentLetterData.value.status,
    });

    const emailResults = response.data.results?.email?.details || [];
    const failedEmails = emailResults.filter(r => !r.status);

    if (failedEmails.length > 0) {
      toast.warning(
        `Decision saved, but some notifications failed: ${failedEmails.map(r => r.message).join('; ')}`
      );
    } else {
      toast.success(response.data.message || 'Decision submitted successfully');
    }

    // Check user role and redirect accordingly
    const userRole = localStorage.getItem('user_role'); // or however you store user role
    if (userRole === '1') {
      // Admin - redirect to admin appointment letters list
      router.push('/appointment-letters');
    } else {
      // User - redirect to user appointment letters list
      router.push('/user/appointment-letters');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

async function downloadLetterFile(fileUrl) {
  if (!fileUrl) return;
  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    saveAs(response.data, 'appointment_letter.pdf');
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response?.data) {
    message = error.response.data.message || message;
    if (error.response.data.errors) {
      message += ': ' + Object.values(error.response.data.errors).flat().join('; ');
    }
  } else if (error.request) {
    message = 'No response from server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

function closeModal() {
  // Check user role and redirect accordingly
  const userRole = localStorage.getItem('user_role'); // or however you store user role
  if (userRole === '1') {
    // Admin - redirect to admin appointment letters list
    router.push('/appointment-letters');
  } else {
    // User - redirect to user appointment letters list
    router.push('/user/appointment-letters');
  }
}

// Visual feedback helpers
const statusHintText = computed(() => {
  return appointmentLetterData.value.status === 'accepted'
    ? 'You are accepting this appointment letter.'
    : 'You are rejecting this appointment letter.';
});

const statusHintClass = computed(() => {
  return appointmentLetterData.value.status === 'accepted'
    ? 'text-green-700'
    : 'text-red-700';
});

const statusIconClass = computed(() => {
  return appointmentLetterData.value.status === 'accepted'
    ? 'fa fa-check-circle'
    : 'fa fa-times-circle';
});
</script>