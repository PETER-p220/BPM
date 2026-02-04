<template>
  <div class="container p-6 mx-auto" style="font-family: 'cygre', serif; font-size: 17px">
    <h1 class="mb-8 text-3xl font-semibold text-center">Activity Details</h1>
    <div v-if="activity" class="p-6 bg-white rounded-lg shadow-lg">
      <div class="mb-8">
        <div v-if="activity.activity_photo" class="relative w-full mb-6 overflow-hidden rounded-lg h-80">
          <img
            :src="activity.activity_photo"
            alt="Activity Image"
            class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        <p v-else class="text-center text-gray-500">No image available</p>
      </div>
      <div class="mb-6">
        <h2 class="mb-4 text-2xl font-medium text-gray-800">{{ activity.activity_category }}</h2>
        <p><strong class="font-semibold">Project:</strong> {{ activity.project_name }}</p>
        <p><strong class="font-semibold">Department:</strong> {{ activity.department_name }}</p>
        <p><strong class="font-semibold">Task Status:</strong> {{ activity.task_status }}</p>
        <p><strong class="font-semibold">Status:</strong> {{ activity.is_viewed }}</p>
        <p><strong class="font-semibold">Created At:</strong> {{ new Date(activity.created_at).toLocaleString() }}</p>
        <p class="mt-4 text-gray-700"><strong class="font-semibold">Description:</strong> {{ activity.description }}</p>

        <a
          v-if="activity.activity_file"
          :href="activity.activity_file"
          target="_blank"
          class="inline-block mt-6 text-blue-500 hover:underline"
        >
          Download Activity File
        </a>
        <p v-else class="mt-4 text-gray-500">No activity file available</p>
      </div>

      <!-- Edit Button -->
      <button
        class="px-4 py-2 text-white rounded hover:bg-blue-600"
        @click="showModal = true"
        style="background-color: #283747;">
        Edit Activity
      </button>
    </div>
    <div v-else class="text-center">
      <p>Loading...</p>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="p-6 bg-white rounded-lg shadow-lg w-[500px]">
        <h2 class="mb-4 text-xl font-semibold">Edit Activity</h2>
        <form @submit.prevent="saveChanges">
          <div class="mb-4">
            <label for="activity_category" class="block mb-1 font-medium">Activity Category</label>
            <input
              v-model="form.activity_category"
              type="text"
              id="activity_category"
              class="w-full px-3 py-2 border rounded"
            />
          </div>

          <!-- Select Head of Department -->
          <div class="mt-4">
            <label for="user_id" class="font-semibold form-label">Select Head of Department</label>
            <select
              id="user_id"
              v-model="form.user_id"
              class="w-full px-3 py-2 border rounded form-control"
            >
              <option value="">None</option>
              <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                {{ user.name }} ({{ user.role_category }})
              </option>
            </select>
          </div>

          <!-- Select Department -->
          <div class="mt-4">
            <label for="department_id" class="font-semibold form-label">Select Department</label>
            <select
              id="department_id"
              v-model="form.department_id"
              class="w-full px-3 py-2 border rounded form-control"
            >
              <option value="">None</option>
              <option v-for="department in departments" :key="department.department_id" :value="department.department_id">
                {{ department.name }}
              </option>
            </select>
          </div>

          <!-- Select Project -->
          <div class="mt-4">
            <label for="project_id" class="font-semibold form-label">Select Project</label>
            <select
              id="project_id"
              v-model="form.project_id"
              class="w-full px-3 py-2 border rounded form-control"
            >
              <option value="">None</option>
              <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                {{ project.project_name }}
              </option>
            </select>
          </div>

          <!-- Task Status -->
          <div class="mt-4">
            <label for="task_status" class="font-semibold form-label">Task Status</label>
            <select
              id="task_status"
              v-model="form.task_status"
              class="w-full px-3 py-2 border rounded form-control"
            >
              <option value="">None</option>
              <option value="on-progress">On Progress</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="description" class="block mb-1 font-medium">Description</label>
            <textarea
              v-model="form.description"
              id="description"
              class="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              class="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              @click="showModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white rounded hover:bg-blue-600"
              style="background-color: #283747;">
              Save Changes
              <span v-if="isLoading" class="ml-2 spinner-border spinner-border-sm">
                <svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
                </svg>
                Looding...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification'; 
import { useRouter, useRoute } from 'vue-router';
import axios from '@/axios';

const route = useRoute();
const router = useRouter();
const activity_id = route.params.activity_id;
const activity = ref(null);
const showModal = ref(false);
const isLoading = ref(false);  // For loading indicator
const toast = useToast();  // Toast instance
const form = reactive({
  activity_category: '',
  project_id: '',
  department_id: '',
  user_id: '',
  description: '',
  task_status: '' // Added for task_status
});

const users = ref([]);
const departments = ref([]);
const projects = ref([]);

// Fetch all dropdown data
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchDepartments(), fetchProjects()]);
  await fetchActivityDetails();
});

async function fetchUsers() {
  try {
    const response = await axios.get('api/dropdown/hod');
    users.value = response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function fetchDepartments() {
  try {
    const response = await axios.get('api/dropdown/department');
    departments.value = response.data.departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}

async function fetchProjects() {
  try {
    const response = await axios.get('api/dropdown/projects');
    projects.value = response.data.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

async function fetchActivityDetails() {
  try {
    const response = await axios.get(`api/project/activities/${activity_id}`);
    if (response.data.status === 'success') {
      const data = response.data.activity;
      activity.value = {
        activity_photo: data.activity_photo,
        activity_file: data.activity_file,
        project_name: data.project.project_name,
        activity_category: data.activity_category,
        task_status: data.task_status,
        is_viewed: data.is_viewed,
        created_at: data.created_at,
        department_name: data.department.name,
        description: data.description
      };

      // Initialize form fields
      form.activity_category = data.activity_category;
      form.project_id = data.project.project_id;
      form.department_id = data.department.department_id;
      form.user_id = data.user_id || '';
      form.description = data.description;
      form.task_status = data.task_status;
    }
  } catch (error) {
    console.error('Error fetching activity details:', error);
  }
}

async function saveChanges() {
  isLoading.value = true;
  try {
    // Change from POST to PUT method to match backend
    const response = await axios.put(`api/project/activities/${activity_id}`, form);
    if (response.data.status === 'success') {
      toast.success('Activity details updated successfully!');
      router.push('/my-activity'); // Navigate to the specified route after success
    } else {
      toast.error('Failed to update activity details.');
    }
  } catch (error) {
    toast.error('An error occurred while updating activity details.');
  } finally {
    isLoading.value = false;
    showModal.value = false;
  }
}
</script>

