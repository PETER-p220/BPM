<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="container px-4 mx-auto max-w-3xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Create New Role</h1>
        <p class="mt-2 text-sm text-gray-600">Define a new role with its category and description</p>
      </div>

      <!-- Main Card -->
      <div class="overflow-hidden bg-white shadow-sm rounded-lg">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200" style="background-color: #283747;">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="text-white fa fa-user-shield"></i>
              <h2 class="text-lg font-semibold text-white">Role Information</h2>
            </div>
            <router-link 
              to="/roles" 
              class="text-white transition-colors hover:text-gray-200"
              aria-label="Close"
            >
              <i class="fa fa-times"></i>
            </router-link>
          </div>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="addRole" class="p-6">
          <!-- Role Category -->
          <div class="mb-6">
            <label for="roleCategory" class="block mb-2 text-sm font-medium text-gray-700">
              Role Category <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="roleCategory"
              v-model="newRoleData.category"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Administrator, Manager, User"
              required
              :disabled="isLoading"
            />
            <p class="mt-1 text-xs text-gray-500">Enter the category or name for this role</p>
          </div>

          <!-- Role Description -->
          <div class="mb-6">
            <label for="roleDescription" class="block mb-2 text-sm font-medium text-gray-700">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="roleDescription"
              v-model="newRoleData.description"
              rows="5"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Provide a detailed description of the role's responsibilities and permissions..."
              required
              :disabled="isLoading"
            ></textarea>
            <!-- <div class="flex items-center justify-between mt-1">
              <p class="text-xs text-gray-500">Describe the role's responsibilities and access level</p>
              <span class="text-xs text-gray-500">{{ newRoleData.description.length }} characters</span>
            </div> -->
          </div>

          <!-- Role Permissions Preview (Optional Enhancement) -->
          <!-- <div class="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex items-start gap-3">
              <i class="mt-1 text-blue-600 fas fa-info-circle"></i>
              <div>
                <h4 class="text-sm font-semibold text-blue-900">Role Preview</h4>
                <p class="mt-1 text-xs text-blue-700">
                  <strong>Category:</strong> {{ newRoleData.category || 'Not specified' }}
                </p>
                <p class="mt-1 text-xs text-blue-700">
                  <strong>Description:</strong> {{ newRoleData.description || 'Not specified' }}
                </p>
              </div>
            </div>
          </div> -->

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
            <router-link 
              to="/roles" 
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <i class="fa fa-times"></i>
              Cancel
            </router-link>
            
            <button 
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #283747;"
              :class="{ 'hover:opacity-90': !isLoading && isFormValid }"
            >
              <i v-if="!isLoading" class="fa fa-save"></i>
              <i v-else class="fa fa-spinner fa-spin"></i>
              {{ isLoading ? 'Saving...' : 'Save Role' }}
            </button>
          </div>
        </form>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

const newRoleData = ref({ 
  category: '', 
  description: '' 
});

const isLoading = ref(false);

// Form validation
const isFormValid = computed(() => {
  return newRoleData.value.category.trim().length > 0 && 
         newRoleData.value.description.trim().length > 0;
});

// Add new role function
async function addRole() {
  // Validate form before submission
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post('api/auth/roles', {
      category: newRoleData.value.category.trim(),
      description: newRoleData.value.description.trim()
    });

    toast.success(response.data.message || 'Role created successfully!');
    
    // Clear the form after successful addition
    newRoleData.value = { category: '', description: '' };
    
    // Redirect to roles list after a short delay
    setTimeout(() => {
      router.push('/roles');
    }, 1000);

  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function validateForm() {
  // Check if category is provided
  if (!newRoleData.value.category?.trim()) {
    toast.error('Please enter a role category.');
    return false;
  }

  // Check if category length is appropriate
  if (newRoleData.value.category.trim().length < 2) {
    toast.error('Role category must be at least 2 characters long.');
    return false;
  }

  if (newRoleData.value.category.trim().length > 100) {
    toast.error('Role category must not exceed 100 characters.');
    return false;
  }

  // Check if description is provided
  if (!newRoleData.value.description?.trim()) {
    toast.error('Please enter a role description.');
    return false;
  }

  // Check if description length is appropriate
  if (newRoleData.value.description.trim().length < 10) {
    toast.error('Role description must be at least 10 characters long.');
    return false;
  }

  if (newRoleData.value.description.trim().length > 500) {
    toast.error('Role description must not exceed 500 characters.');
    return false;
  }

  return true;
}

function handleError(error) {
  let message = 'An unexpected error occurred. Please try again.';
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.data?.errors) {
    // Handle validation errors from backend
    const errors = error.response.data.errors;
    message = Object.values(errors).flat().join(' ');
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
  console.error('Role creation error:', error);
}
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Smooth transitions */
input, textarea, button {
  transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus, textarea:focus {
  outline: none;
}

/* Animation for form */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: slideIn 0.3s ease-out;
}
</style>