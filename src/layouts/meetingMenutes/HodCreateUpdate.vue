

  <template>
    <div class="py-5 add-request" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-plus"></i> Meeting Minutes</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Meeting Minutes Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Meeting Minutes</h3>
  
            <!-- Minute Points Section -->
            <div class="mb-4">
              <div v-for="(item, index) in requestData.minute_point" :key="index" class="flex gap-4 mb-4">
                <div class="w-full">
                  <label class="font-semibold form-label">Minute Point/Current Update</label>
                  <input type="text" v-model="requestData.minute_point[index]" class="w-full px-3 py-2 border rounded form-control" placeholder="Minute Point" />
                </div>
                <button @click="removeMinutePoint(index)" class="h-10 px-3 py-1 text-white bg-red-500 rounded hover:bg-red-700" v-if="requestData.minute_point.length > 1">
                  Remove
                </button>
              </div>
              <button @click="addMinutePoint" class="px-4 py-2 text-white rounded hover:bg-teal-700" style="background-color:#283747;">
                <i class="fa fa-plus"></i> Add More Minute Points
              </button>
            </div>
  
            <!-- Plans/Progress Section -->
            <div class="mt-4">
              <label class="block text-sm font-semibold text-gray-700">Plans/Progress</label>
              <textarea v-model="requestData.if_more_detail" rows="4" placeholder="Example plan one, plan two, etc..." class="w-full p-4 mt-2 border rounded-lg shadow-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
  
            <!-- Select Project -->
            <div class="mt-4">
              <label class="font-semibold form-label">Select Project</label>
              <select v-model="requestData.project_id" class="w-full px-3 py-2 border rounded form-control">
                <option value="">None</option>
                <option v-for="project in projects" :key="project.project_id" :value="project.project_id">{{ project.project_name }}</option>
              </select>
            </div>
  
            <!-- Select Department -->
            <div class="mt-4">
              <label class="font-semibold form-label">Select Department</label>
              <select v-model="requestData.department_id" class="w-full px-3 py-2 border rounded form-control">
                <option value="">None</option>
                <option v-for="department in departments" :key="department.department_id" :value="department.department_id">{{ department.name }}</option>
              </select>
            </div>
  
            <!-- Select Engineer -->
            <div class="mt-4">
              <label class="font-semibold form-label">Select Department Engineer</label>
              <select v-model="requestData.user_id" class="w-full px-3 py-2 border rounded form-control">
                <option value="">Select Engineer</option>
                <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">{{ user.name }}</option>
              </select>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="applyMeetingMinutes" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
                <i class="fa fa-plus"></i> Submit Minutes
                <span v-if="isLoading" class="ml-2">
                  <i class="fa fa-spinner fa-spin"></i>
                </span>
              </button>
              <router-link to="/hod/view-minutes" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <i class="fa fa-times"></i> Cancel
              </router-link>
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
  const requestData = ref({
    minute_point: [""],
    if_more_detail: "",
    department_id: null,
    user_id: null,
    project_id: null,
  });
  
  const departments = ref([]);
  const engineers = ref([]);
  const projects = ref([]);
  const isLoading = ref(false);
  
  onMounted(async () => {
    await fetchDepartments();
    await fetchEngineers();
    await fetchProjects();
  });
  
  async function fetchDepartments() {
    try {
      const response = await axios.get('api/dropdown/department');
      departments.value = response.data.departments;
    } catch (error) {
      handleError(error);
    }
  }
  
  async function fetchEngineers() {
    try {
      const response = await axios.get('api/dropdown/engineer');
      engineers.value = response.data.users;
    } catch (error) {
      handleError(error);
    }
  }
  
  async function fetchProjects() {
    try {
      const response = await axios.get('api/dropdown/projects');
      projects.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  function addMinutePoint() {
    requestData.value.minute_point.push("");
  }
  
  function removeMinutePoint(index) {
    if (requestData.value.minute_point.length > 1) {
      requestData.value.minute_point.splice(index, 1);
    }
  }
  
  async function applyMeetingMinutes() {
    isLoading.value = true;
    if (
      !requestData.value.minute_point.length ||
      requestData.value.minute_point.some(item => !item.trim()) ||
      !requestData.value.user_id ||
      !requestData.value.department_id ||
      !requestData.value.project_id
    ) {
      toast.error('Please fill in all required fields.');
      isLoading.value = false;
      return;
    }
  
    try {
      const response = await axios.post('api/meeting-minutes', requestData.value);
      toast.success(response.data.message);
      resetForm();
      router.push('/hod/create-minutes');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  function resetForm() {
    requestData.value = {
      minute_point: [""],
      if_more_detail: "",
      department_id: null,
      user_id: null,
      project_id: null,
    };
  }
  
  function handleError(error) {
    const errorMessage = error.response?.data?.message || 'Something went wrong!';
    toast.error(errorMessage);
    isLoading.value = false;
  }
  </script>
  
  <style scoped>
  .add-request {
    background-color: #f8f9fa;
  }
  .card {
    border-radius: 10px;
    overflow: hidden;
  }
  .card-header {
    font-size: 18px;
    font-weight: bold;
  }
  .card-body {
    background: #ffffff;
  }
  </style>
  