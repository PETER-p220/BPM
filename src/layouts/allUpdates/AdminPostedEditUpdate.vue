<template>
    <div class="container p-6 mx-auto" style="font-family: 'cygre', serif; font-size: 23px">
      <h1 class="mb-8 text-3xl font-semibold text-center">Update Details</h1>
      <div v-if="chat" class="p-6 bg-white rounded-lg shadow-lg">
        <div class="mb-8">
          <div v-if="chat.update_photo" class="relative w-full mb-6 overflow-hidden rounded-lg h-80">
            <img
              :src="chat.update_photo"
              alt="Chat Image"
              class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
          <p v-else class="text-center text-gray-500">No image available</p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-2xl font-medium text-gray-800"><strong class="font-semibold">Title:</strong>{{ chat.title }}</h2>
          <p><strong class="font-semibold">Created At:</strong> {{ new Date(chat.created_at).toLocaleString() }}</p>
          <p class="mt-4 text-gray-700"><strong class="font-semibold">Description:</strong> {{ chat.description }}</p>
        </div>
  
        <!-- Edit Button -->
        <button
          class="px-4 py-2 text-white rounded hover:bg-blue-600"
          @click="showModal = true"
          style="background-color: #283747;">
          Edit Update
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
          <h2 class="mb-4 text-xl font-semibold">Edit Update</h2>
          <form @submit.prevent="saveChanges">
            <div class="mb-4">
              <label for="title" class="block mb-1 font-medium">Title</label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
  
            <div class="mb-4">
              <label for="description" class="block mb-1 font-medium">Description</label>
              <textarea
                v-model="form.description"
                id="description"
                class="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>
  
            <!-- Flex container for buttons -->
            <div class="flex justify-between mt-4">
              <button
                type="button"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                @click="cancelEdit"
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
                  Loading...
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
  const chat_id = route.params.chat_id; // Get chat_id from the route parameters
  const chat = ref(null);  // Holds chat details
  const showModal = ref(false);  // To toggle modal visibility
  const isLoading = ref(false);  // For loading indicator
  const toast = useToast();  // Toast instance
  const form = reactive({
    title: '', // Title for editing
    description: '', // Description for editing
  });
  
  // Fetch chat details on mount
  onMounted(async () => {
    await fetchChatDetails();
  });
  
  async function fetchChatDetails() {
    try {
      const response = await axios.get(`api/updates/${chat_id}`); // Ensure the correct endpoint
      if (response.data.status === 'success') {
        const data = response.data.data; // Access 'data' correctly here
        chat.value = {
          update_photo: data.update_photo,
          title: data.title,
          created_at: data.created_at,
          description: data.description,
        };
  
        // Populate form fields with the existing chat data
        form.title = data.title;
        form.description = data.description;
      } else {
        console.error('Failed to fetch chat details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
      toast.error('An error occurred while fetching chat details.');
    }
  }
  
  // Save edited chat data
  async function saveChanges() {
    isLoading.value = true;
    try {
      const response = await axios.put(`/api/updates/${chat_id}`, {
        title: form.title,
        description: form.description,
      });
  
      if (response.data.status === 'success') {
        toast.success('Chat updated successfully');
        showModal.value = false; // Close modal on success
  
        // Update the chat details in the UI with the newly saved data
        chat.value.title = form.title;
        chat.value.description = form.description;
      } else {
        toast.error('Failed to update chat');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    } finally {
      isLoading.value = false;
    }
  }
  
  // Cancel edit and navigate to '/user/update'
  function cancelEdit() {
    router.push('/admin-view/updates'); // Navigate to the desired path
  }
  </script>
  
  <style scoped>
  .spinner-border {
    border-top-color: #fff;
  }
  </style>
  