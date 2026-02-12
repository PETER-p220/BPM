<template>
  <div class="py-5 userprofile" style="font-family: 'Trirong', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color:  #283747;">
          <div><i class="mr-2 fa fa-user"></i> User Profile</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
            <span v-if="isEditing" class="ml-2">Cancel</span>
          </button>
        </div>
        <div class="p-6 bg-white card-body">
          <div class="container mx-auto">
            <!-- Display fetched user information -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="inputName" class="font-semibold form-label">Name</label>
                <input type="text" id="inputName" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.name" :readonly="!isEditing" :class="{ 'bg-white': isEditing, 'bg-gray-100': !isEditing }" />
              </div>
              <div>
                <label for="inputEmail4" class="font-semibold form-label">Email</label>
                <input type="email" id="inputEmail4" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.email" :readonly="!isEditing" :class="{ 'bg-white': isEditing, 'bg-gray-100': !isEditing }" />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="inputRole4" class="font-semibold form-label">Role</label>
                <input type="text" id="inputRole4" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.category" :readonly="!isEditing" :class="{ 'bg-white': isEditing, 'bg-gray-100': !isEditing }" />
              </div>
              <div>
                <label for="inputStatus4" class="font-semibold form-label">Status</label>
                <input type="text" id="inputStatus4" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.status" :readonly="!isEditing" :class="{ 'bg-white': isEditing, 'bg-gray-100': !isEditing }" />
              </div>
            </div>
           
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="inputDepartment" class="font-semibold form-label">Department</label>
                <input type="text" id="inputDepartment" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.department" :readonly="!isEditing" :class="{ 'bg-white': isEditing, 'bg-gray-100': !isEditing }" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="mt-6 text-center">
        <button 
          v-if="!isEditing"
          @click="editProfile"
          class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <i class="fas fa-edit mr-2"></i>
          Edit Profile
        </button>
        <button 
          v-if="isEditing"
          @click="saveProfile"
          class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          :disabled="isLoading"
        >
          <i class="fas fa-save mr-2" :class="{ 'fa-spin': isLoading }"></i>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios'; // Ensure this points to your axios instance
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const isEditing = ref(false);
const isLoading = ref(false);

// Object to store fetched user data
const userData = ref({
  name: '',
  email: '',
  category: '',
  status: '',
  department: 'N/A', // Default value if no department
});

// Store original data for cancel functionality
const originalUserData = ref({});

// Fetch user profile on component mount
onMounted(async () => {
  try {
    const response = await axios.get('api/user/profile');
    const fetchedData = response.data;

    // Ensure null values are replaced with 'N/A'
    userData.value.name = fetchedData.name || 'N/A';
    userData.value.email = fetchedData.email || 'N/A';
    userData.value.category = fetchedData.category || 'N/A';
    userData.value.status = fetchedData.status || 'N/A';
    userData.value.department = fetchedData.department || 'N/A'; // Handle optional department
    
    // Store original data for cancel functionality
    originalUserData.value = { ...userData.value };
  } catch (error) {
    handleError(error);
  }
});

// Handle errors and display appropriate messages
function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response) {
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.response.statusText;
    }
  } else if (error.request) {
    message = 'No response from server. Please check your connection.';
  } else {
    message = error.message;
  }

  toast.error(message); // Show error message with toast
}

// Close modal and navigate back to dashboard
function closeModal() {
  if (isEditing.value) {
    cancelEdit();
  } else {
    router.push('/dashboard');
  }
}

// Edit profile
function editProfile() {
  isEditing.value = true;
}

// Save profile
async function saveProfile() {
  isLoading.value = true;
  try {
    const response = await axios.post('api/update-profile', {
      name: userData.value.name,
      email: userData.value.email,
      department: userData.value.department,
    });

    if (response.data.status === 200 || response.data.success) {
      toast.success('Profile updated successfully!');
      isEditing.value = false;
      // Update original data
      originalUserData.value = { ...userData.value };
    } else {
      toast.error(response.data.message || 'Failed to update profile');
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Cancel edit
function cancelEdit() {
  // Restore original data
  userData.value = { ...originalUserData.value };
  isEditing.value = false;
  toast.info('Changes cancelled');
}
</script>


<style scoped>
.adduserform {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>
