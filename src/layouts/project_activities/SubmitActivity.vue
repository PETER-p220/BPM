<template>
  <div class="py-5 add-activity" style="font-family: 'cygre', serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-plus"></i> Submit Project Activity</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Project Activity Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>

          <!-- Activity Category Section -->
          <div class="mb-4">
            <label for="activity_category" class="form-label">Activity Category</label>
            <input type="text" id="activity_category" class="w-full px-3 py-2 border rounded form-control" v-model="activityData.activity_category" />
          </div>

          <!-- Activity Photo Section -->
          <div class="mb-4">
            <label for="activity_photo" class=" form-label">Activity Photo (Image)</label>
            <input type="file" id="activity_photo" class="w-full px-3 py-2 border rounded form-control" @change="handlePhotoUpload" />
          </div>

          <!-- Activity File Section -->
          <div class="mb-4">
            <label for="activity_file" class=" form-label">Activity File (PDF, Excel, etc.)</label>
            <input type="file" id="activity_file" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
          </div>

          <!-- Select Head of Department, Department, Project -->
          <div class="mt-4 row">
            <div class="col-sm-6">
              <label for="user_id" class="form-label">Select Head of Department</label>
              <select id="user_id" class="w-full px-3 py-2 border rounded form-control" v-model="activityData.user_id">
                <option value="">None</option>
                <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                  {{ user.name }} ({{ user.role_category }})
                </option>
              </select>
            </div>
            <div class="col-sm-6">
              <label for="department_id" class=" form-label">Select Department</label>
              <select id="department_id" class="w-full px-3 py-2 border rounded form-control" v-model="activityData.department_id">
                <option value="">None</option>
                <option v-for="department in departments" :key="department.department_id" :value="department.department_id">
                  {{ department.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Select Project -->
          <div class="mt-4">
            <label for="project_id" class="form-label">Select Project</label>
            <select id="project_id" class="w-full px-3 py-2 border rounded form-control" v-model="activityData.project_id">
              <option value="">None</option>
              <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                {{ project.project_name }}
              </option>
            </select>
          </div>

          <!-- Description Section -->
          <div class="mt-4">
            <label for="description" class="form-label">Description</label>
            <textarea id="description" class="w-full px-3 py-2 border rounded form-control" v-model="activityData.description"></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="submitActivity" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color:#283747;">
              <i class="fa fa-plus"></i> Save chages
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/my-activity" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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

const activityData = ref({
  activity_category: '',
  project_id: null,
  department_id: null,
  user_id: null,
  description: '',
  activity_photo: null,
  activity_file: null,
});

const users = ref([]);
const departments = ref([]);
const projects = ref([]);
const isLoading = ref(false);

// Fetch data on mount
onMounted(async () => {
  await fetchUsers();
  await fetchDepartments();
  await fetchProjects();
});

// Fetch users from API
async function fetchUsers() {
  try {
    const response = await axios.get('api/dropdown/hod');
    users.value = response.data.users;
  } catch (error) {
    handleError(error);
  }
}

// Fetch departments from API
async function fetchDepartments() {
  try {
    const response = await axios.get('api/dropdown/department');
    departments.value = response.data.departments;
  } catch (error) {
    handleError(error);
  }
}

// Fetch projects from API
async function fetchProjects() {
  try {
    const response = await axios.get('api/dropdown/projects');
    projects.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// Handle photo file upload
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  activityData.value.activity_photo = file;
}

// Handle general file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  activityData.value.activity_file = file;
}

// Submit activity
async function submitActivity() {
  isLoading.value = true;

  // Validation: Ensure all required fields are filled
  if (!activityData.value.activity_category || !activityData.value.user_id || !activityData.value.department_id || !activityData.value.project_id) {
    toast.error('Please fill in all required fields.');
    isLoading.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append('activity_category', activityData.value.activity_category);
    formData.append('user_id', activityData.value.user_id);
    formData.append('department_id', activityData.value.department_id);
    formData.append('project_id', activityData.value.project_id);
    formData.append('description', activityData.value.description);
    if (activityData.value.activity_photo) {
      formData.append('activity_photo', activityData.value.activity_photo);
    }
    if (activityData.value.activity_file) {
      formData.append('activity_file', activityData.value.activity_file);
    }

    const response = await axios.post('api/project/activities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success(response.data.message);
    router.push('/my-activity');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  const errorMessage = error.response && error.response.data && error.response.data.message 
    ? error.response.data.message 
    : 'Something went wrong!';
  toast.error(errorMessage);
  isLoading.value = false;
}
</script>
