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

            <!-- Rejection Reason (only show when rejected) -->
            <div v-if="appointmentLetterData.status === 'rejected'">
              <label for="rejection_reason" class="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection <span class="text-red-500">*</span>
              </label>
              <textarea
                id="rejection_reason"
                v-model="appointmentLetterData.rejection_reason"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white shadow-sm"
                placeholder="Please provide a reason for rejecting this appointment letter..."
                :disabled="isLoading"
              ></textarea>
              <p class="mt-1 text-sm text-gray-600">
                This reason will be recorded and visible to administrators.
              </p>
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
  user_id: '',
  tender: { title: '' },
  letter_file: '',
  status: 'accepted',
  rejection_reason: '',
});

const isLoading = ref(false);

onMounted(async () => {
  await fetchAppointmentLetter();
});

async function fetchAppointmentLetter() {
  try {
    const response = await axios.get(`api/logged-user-appointment-letters`);
    const allLetters = response.data.data || [];
    const foundLetter = allLetters.find(letter => letter.letter_id == route.params.letter_id);
    
    if (foundLetter) {
      appointmentLetterData.value = foundLetter;
    } else {
      throw new Error('Appointment letter not found');
    }
    
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

  // Validate rejection reason if status is rejected
  if (appointmentLetterData.value.status === 'rejected' && !appointmentLetterData.value.rejection_reason?.trim()) {
    toast.error('Please provide a reason for rejection');
    return;
  }

  isLoading.value = true;

  try {
    let response;
    
    if (appointmentLetterData.value.status === 'accepted') {
      response = await axios.post(`api/appointment-letter/${route.params.letter_id}/accept`);
    } else {
      response = await axios.post(`api/appointment-letter/${route.params.letter_id}/reject`, {
        rejection_reason: appointmentLetterData.value.rejection_reason.trim()
      });
    }

    toast.success(response.data.message || 'Decision submitted successfully');

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