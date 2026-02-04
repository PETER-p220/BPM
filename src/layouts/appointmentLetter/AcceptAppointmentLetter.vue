<template>
    <div class="py-5 edit-assignment" style="font-family: 'cygre', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i> Accept/Reject Appointment Letter</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Appointment Letter Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold"></h3>
  
            <!-- Tender Information (Read-Only) -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="tenderTitle" class="form-label">Tender</label>
                <input
                  id="tenderTitle"
                  class="w-full px-3 py-2 border rounded form-control"
                  :value="appointmentLetterData.tender?.title || 'N/A'"
                  disabled
                />
              </div>
            </div>
  
            <!-- Letter File (Read-Only) -->
            <div class="mt-4">
              <label for="letterFile" class="form-label">Appointment Letter File</label>
              <div class="flex items-center gap-2">
                <input
                  id="letterFile"
                  class="w-full px-3 py-2 border rounded form-control"
                  :value="appointmentLetterData.letter_file ? 'Letter Available' : 'N/A'"
                  disabled
                />
                <button
                  v-if="appointmentLetterData.letter_file"
                  @click="downloadLetterFile(appointmentLetterData.letter_file)"
                  class="px-4 py-2 text-white rounded"
                  style="background-color: #27ae60;"
                >
                  Download PDF
                </button>
              </div>
            </div>
  
            <!-- Status Selection (Editable) -->
            <div class="mt-4">
              <label for="status" class="font-semibold form-label">Status</label>
              <select
                id="status"
                class="w-full px-3 py-2 border rounded form-control"
                v-model="appointmentLetterData.status"
              >
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button
                @click="updateAppointmentLetter"
                class="px-4 py-2 text-white rounded hover:bg-blue-700"
                style="background-color: #283747;"
                :disabled="isLoading"
              >
                Submit
                <span v-if="isLoading" class="flex items-center gap-2">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link
                  to="/user/appointment-letters"
                  class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
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
      appointmentLetterData.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  async function updateAppointmentLetter() {
    isLoading.value = true;
    try {
      const response = await axios.put(`api/appointment-letter/${route.params.letter_id}`, {
        status: appointmentLetterData.value.status,
      });
  
      // Check for notification failures
      const emailResults = response.data.results?.email?.details || [];
      const failedEmails = emailResults.filter(result => !result.status);
  
      if (failedEmails.length > 0) {
        const errorMessages = failedEmails.map(result => result.message).join('; ');
        toast.error(`Some notifications failed: ${errorMessages}`);
      } else {
        toast.success(response.data.message);
      }
  
      router.push('/user/appointment-letters');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  async function downloadLetterFile(fileUrl) {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      saveAs(response.data, 'appointment_letter.pdf');
    } catch (error) {
      handleError(error);
    }
  }
  
  function handleError(error) {
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
      if (error.response.data.errors) {
        message += ': ' + Object.values(error.response.data.errors).flat().join(' ');
      }
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
    toast.error(message);
  }
  
  function closeModal() {
    router.push('/appointment-letter');
  }
  </script>