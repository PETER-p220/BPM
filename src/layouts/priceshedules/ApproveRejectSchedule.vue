<template>
  <div class="py-5 edit-schedule" style="font-family: 'cygre', serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-edit"></i> Approve/Reject Schedule</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Schedule Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>

          

          <!-- Tender (Non-editable) -->
          <div class="mb-4">
            <label for="tender" class=" form-label">Tender</label>
            <input type="text" id="tender" class="w-full px-3 py-2 border rounded form-control" :value="scheduleData.tender.title" disabled />
          </div>

          <!-- Schedule File (Non-editable) -->
          <div class="mb-4">
            <label for="schedule_file" class=" form-label">Schedule File</label>
            <input type="text" id="schedule_file" class="w-full px-3 py-2 border rounded form-control" :value="scheduleData.schedule_file" disabled />
          </div>


          <!-- User Details (Non-editable) -->
          <div class="mb-4">
            <label for="user_name" class=" form-label">Engineer</label>
            <input type="text" id="user_name" class="w-full px-3 py-2 border rounded form-control" :value="scheduleData.user.name" disabled />
          </div>


          <!-- Department Details (Non-editable) -->
          <div class="mb-4">
            <label for="department_name" class=" form-label">Department</label>
            <input type="text" id="department_name" class="w-full px-3 py-2 border rounded form-control" :value="scheduleData.department.name" disabled />
          </div>

          <!-- Created At (Non-editable) -->
          <div class="mb-4">
            <label for="created_at" class=" form-label">Created At</label>
            <input type="text" id="created_at" class="w-full px-3 py-2 border rounded form-control" :value="scheduleData.created_at" disabled />
          </div>


          
          <!-- Status Dropdown (Editable) -->
          <div class="mb-4">
            <label for="status" class=" form-label">Select Status To Confirm or Reject</label>
            <select id="status" class="w-full px-3 py-2 border rounded form-control" v-model="scheduleData.status">
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="passed">Passed</option>
            </select>
          </div>

          <!-- Reason for Rejection (Editable) -->
          <div class="mb-4" v-if="scheduleData.status === 'rejected'">
            <label for="reason_for_reject" class="font-semibold form-label">Reason for Rejection</label>
            <textarea id="reason_for_reject" class="w-full px-3 py-2 border rounded form-control" v-model="scheduleData.reason_for_reject"></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="updateSchedule" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
              <i class="fa fa-pencil"></i> Save changes
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/all-schedules"><i class="fa fa-times"></i> Cancel</a>
              </button>
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
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const scheduleData = ref({
  schedule_id: '',
  tender: {},
  schedule_file: '',
  status: 'pending',
  reason_for_reject: '',
  user: {},
  department: {},
  created_at: ''
});

const isLoading = ref(false);

// Fetch the schedule data by schedule_id
async function fetchScheduleData() {
  try {
    const response = await axios.get(`api/price-sheduling/${route.params.schedule_id}`);
    scheduleData.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// Update the schedule with the provided data
async function updateSchedule() {
  isLoading.value = true;
  try {
    const response = await axios.put(`api/price-sheduling/${route.params.schedule_id}`, scheduleData.value);
    toast.success('Schedule updated successfully');
    router.push('/all-schedules');  // Redirect to schedules page after success
  } catch (error) {
    handleError(error);  // Handle error if API call fails
  } finally {
    isLoading.value = false;  // Stop loading indicator
  }
}

// Handle errors and show appropriate messages
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data && error.response.data.message) {
    message = error.response.data.message;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);  // Show error message using toast
}

// Fetch the schedule data when component is mounted
onMounted(() => {
  fetchScheduleData();
});
</script>

<style scoped>
/* Additional styling here */
</style>
