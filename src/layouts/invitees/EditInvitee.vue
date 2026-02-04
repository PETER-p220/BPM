<template>
    <div class="py-5 edit-invitee" style="font-family: 'Euclid Circular', sans-serif;">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Invitee</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Invitee Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Edit Invitee</h3>
  
            <!-- Form Fields -->
            <div class="mb-4">
              <label for="name" class="font-semibold form-label">Invitee Name</label>
              <input type="text" id="name" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.name" />
            </div>
            <div class="mb-4">
              <label for="email" class="font-semibold form-label">Email</label>
              <input type="email" id="email" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.email" />
            </div>
            <div class="mb-4">
              <label for="phone" class="font-semibold form-label">Phone</label>
              <input type="text" id="phone" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.phone" />
            </div>
            <div class="mb-4">
              <label for="singleAmount" class="font-semibold form-label">Single Amount</label>
              <input type="number" id="singleAmount" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.for_single_amount" placeholder=".eg 20000.00" />
            </div>
            <div class="mb-4">
              <label for="doubleAmount" class="font-semibold form-label">Double Amount</label>
              <input type="number" id="doubleAmount" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.for_double_amount" placeholder=".eg 30000.00"/>
            </div>
            <div class="mb-4">
              <label for="venue" class="font-semibold form-label">Venue</label>
              <input type="text" id="venue" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.venue" />
            </div>
            <div class="mb-4">
              <label for="eventTime" class="font-semibold form-label">Event Time</label>
              <input type="datetime-local" id="eventTime" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.event_time" />
            </div>
            <div class="mb-4">
              <label for="physicalAddress" class="font-semibold form-label">Physical Address</label>
              <input type="text" id="physicalAddress" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.physical_address" />
            </div>
            <div class="mb-4">
              <label for="isConfirmed" class="font-semibold form-label">Is Confirmed</label>
              <select id="isConfirmed" class="w-full px-3 py-2 border rounded form-control" v-model="inviteeData.is_confirmed">
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
  
            <!-- Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="updateInvitee" class="px-4 py-2 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
                <i class="fa fa-pencil"></i> Update Invitee
                 <!-- Loading Spinner -->
            <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
              </button>
              <span>
                <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                  <a href="my/invitees"><i class="fa fa-times"></i> Cancel</a>
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
  
  const inviteeData = ref({
    name: '',
    email: '',
    phone: '',
    for_single_amount: null,
    for_double_amount: null,
    venue: '',
    event_time: '',
    physical_address: '',
    is_confirmed: 'pending', // Default value
  });
  
  const isLoading = ref(false);
  
  const fetchInviteeData = async () => {
    try {
      const response = await axios.get(`api/invitees/${route.params.invitee_id}`);
      inviteeData.value = response.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  async function updateInvitee() {
    isLoading.value = true;
    try {
      const response = await axios.put(`api/invitees/${route.params.invitee_id}`, inviteeData.value);
      toast.success('Invitee updated successfully');
      router.push('/my/invitees');
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
  
  onMounted(() => {
    fetchInviteeData();
  });
  </script>
  
  <style scoped>
  .edit-invitee {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  