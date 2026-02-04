<template>
    <div class="py-5 add-attendance" style="font-family: 'cygre', serif; font-size: 23px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-calendar-check"></i> Submit Attendance</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Attendance Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Submit Attendance</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="w-full">
                <label for="engineerSelect" class=" form-label">Select Engineer</label>
                <select id="engineerSelect" class="w-full px-3 py-2 border rounded form-control" v-model="attendanceData.attenda_id">
                  <option value="">Select Engineer</option>
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
                </select>
              </div>
              <div class="w-full">
                <label for="attendanceStatus" class=" form-label">Attendance Status</label>
                <select id="attendanceStatus" class="w-full px-3 py-2 border rounded form-control" v-model="attendanceData.is_present">
                  <option value="present">Present</option>
                  <option value="not-present">Not Present</option>
                </select>
              </div>
            </div>
  
            <div v-if="attendanceData.is_present === 'not-present'" class="mt-4">
              <label for="reason" class=" form-label">Reason (If Not Present)</label>
              <textarea id="reason" class="w-full px-3 py-2 border rounded form-control" v-model="attendanceData.if_not_present_and_have_reason"></textarea>
            </div>
  
            <div class="flex gap-4 mt-4">
              <button @click="submitAttendance" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
                <i class="fa fa-check"></i> Submit Attendance
                <!-- Loading Spinner -->
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Processing...
                </span>
              </button>
              <span>
                <router-link to="/hod/view-attendance" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
const attendanceData = ref({
  attenda_id: '',
  is_present: 'present',
  if_not_present_and_have_reason: '',
});
const engineers = ref([]);
const isLoading = ref(false);

// Fetch available engineers for attendance selection
onMounted(async () => {
  await fetchEngineers();
});

async function fetchEngineers() {
  try {
    const response = await axios.get('api/dropdown/engineer');
    engineers.value = response.data.users; // Assuming the backend returns a 'users' array
  } catch (error) {
    handleError(error);
  }
}

// Submit attendance record
async function submitAttendance() {
  isLoading.value = true;

  if (!attendanceData.value.attenda_id || !attendanceData.value.is_present) {
    toast.error('Please select an engineer and attendance status');
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.post('api/attendances', attendanceData.value);
    toast.success(response.data.message);
    
    // Reset form fields after successful submission
    attendanceData.value = {
      attenda_id: '',
      is_present: 'present',
      if_not_present_and_have_reason: '',
    };

    router.push('/hod/create-attendance');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
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

  
  
  <style scoped>
  .add-attendance {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  