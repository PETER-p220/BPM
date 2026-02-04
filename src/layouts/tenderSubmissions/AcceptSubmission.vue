<template>
    <div class="py-5 edit-role" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-edit"></i> Edit Tender Submission</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- Edit Tender Submission Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Edit Tender Submission</h3>
  
            <div v-if="!isLoading" class="grid grid-cols-1 gap-4">
              <div>
                <label for="tenderSelect" class="font-semibold form-label">Select Tender</label>
                <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" v-model="submissionData.tender_id">
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">{{ tender.title }}</option>
                </select>
              </div>
              <div class="mt-4">
                <label for="receivedStatus" class="font-semibold form-label">Received Status</label>
                <select id="receivedStatus" class="w-full px-3 py-2 border rounded form-control" v-model="submissionData.received_status">
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
              <div class="mt-4">
                <label for="isPublished" class="font-semibold form-label">Publication Status</label>
                <select id="isPublished" class="w-full px-3 py-2 border rounded form-control" v-model="submissionData.is_published">
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="mt-4">
                <label for="isAwarded" class="font-semibold form-label">Award Status</label>
                <select id="isAwarded" class="w-full px-3 py-2 border rounded form-control" v-model="submissionData.is_awarded">
                  <option value="on-progress">On Progress</option>
                  <option value="awarded">Awarded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
  
              <!-- Added End Description Field -->
              <div class="mt-4">
                <label for="description" class="font-semibold form-label">Description</label>
                <textarea
                  id="description"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="submissionData.description"
                  placeholder="Enter a brief description for this submission"
                  rows="3"
                ></textarea>
              </div>
            </div>
  
            <div class="flex gap-4 mt-4">
              <button 
                @click="updateSubmission"
                class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" 
                style="background-color: #283747;"
                :disabled="isLoading" 
              >
                Update Submission
                <span v-if="isLoading" class="flex items-center gap-2">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              
              <span>
                <router-link to="/tenders-submitted" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  
  const tenders = ref([]);
  const submissionData = ref({
    tender_id: null,
    received_status: 'pending',
    is_published: 'published',
    is_awarded: 'on-progress',
    description: '',
  });
  const isLoading = ref(false);
  
  onMounted(async () => {
    await fetchTenders();
    await fetchSubmissionData();
  });
  
  // Fetch available tenders
  async function fetchTenders() {
    try {
      const response = await axios.get('api/dropdown/tender');
      tenders.value = response.data.data;
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
  }
  
  // Fetch the specific submission data
  async function fetchSubmissionData() {
    isLoading.value = true;
    try {
      const response = await axios.get(`api/submit/tender/${route.params.submission_id}`);
      const submission = response.data.data;
      submissionData.value = {
        tender_id: submission.tender_id,
        received_status: submission.received_status,
        is_published: submission.is_published,
        is_awarded: submission.is_awarded,
        description: submission.description,
      };
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Update the submission data
  async function updateSubmission() {
    isLoading.value = true;
    try {
      await axios.put(`api/submit/tender/${route.params.submission_id}`, submissionData.value);
      toast.success('Submission updated successfully');
      router.push('/tenders-submitted');
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // Handle errors during requests
  function handleError(error) {
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    toast.error(message);
  }
  </script>
  
  <style scoped>
  .edit-role {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  