<template>
  <div class="py-5 edit-user" style="font-family: 'Trirong', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-user-edit"></i> Edit User</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit User Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold"></h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="userName" class=" form-label">Name</label>
              <input type="text" id="userName" class="w-full px-3 py-2 border rounded form-control" v-model="userData.name" />
            </div>
            <div>
              <label for="userEmail" class=" form-label">Email</label>
              <input type="email" id="userEmail" class="w-full px-3 py-2 border rounded form-control" v-model="userData.email" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="userRole" class=" form-label">Role</label>
              <select id="userRole" class="w-full px-3 py-2 border rounded form-control" v-model="userData.role_id">
                <option v-for="role in roles" :key="role.role_id" :value="role.role_id">{{ role.category }}</option>
              </select>
            </div>
            <div>
              <label for="userStatus" class=" form-label">Status</label>
              <select id="userStatus" class="w-full px-3 py-2 border rounded form-control" v-model="userData.status">
                <option value="is_active">Active</option>
                <option value="not_active">Not Active</option>
              </select>
            </div>
          </div>

          <!-- Department Dropdown -->
          <div class="mt-4">
            <label for="userDepartment" class="font-semibold form-label">Department (Optional)</label>
            <select id="userDepartment" class="w-full px-3 py-2 border rounded form-control" v-model="userData.department_id">
              <option value="">Select Department</option>
              <option v-for="department in departments" :key="department.department_id" :value="department.department_id">{{ department.name }}</option>
            </select>
          </div>

          <div class="mt-4">
            <label for="userPassword" class="font-semibold form-label">Password (optional)</label>
            <input type="password" id="userPassword" class="w-full px-3 py-2 border rounded form-control" v-model="userData.password" placeholder="Leave blank to keep current password" />
          </div>

          <div class="flex gap-4 mt-4">
            <button @click="updateUser" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;">
              Save chages
              <!-- Loading Spinner -->
              <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <span>
              <router-link to="/users" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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

const toast = useToast();
const route = useRoute();
const router = useRouter();

const userData = ref({ 
  name: '', 
  email: '', 
  role_id: '', 
  department_id: '', // Added department field
  status: 'is_active', // Default to active
  password: '' 
});
const roles = ref([]);
const departments = ref([]); // Added departments list
const isLoading = ref(false);

onMounted(async () => {
  await fetchUserData();
  await fetchRoles();
  await fetchDepartments(); // Fetch departments on mount
});

async function fetchUserData() {
  try {
    const response = await axios.get(`api/user/${route.params.user_id}`);
    userData.value = response.data;
  } catch (error) {
    handleError(error);
  }
}

async function fetchRoles() {
  try {
    const response = await axios.get('api/auth/roles');
    roles.value = response.data;
  } catch (error) {
    handleError(error);
  }
}

// Fetch departments
async function fetchDepartments() {
  try {
    const response = await axios.get('api/dropdown/department');
    departments.value = response.data.departments;
  } catch (error) {
    handleError(error);
  }
}

async function updateUser() {
  isLoading.value = true;
  try {
    const response = await axios.put(`api/user/${route.params.user_id}`, userData.value);
    toast.success(response.data.message);
    router.push('/users');
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
.edit-user {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>
