<template>
  <div class="py-5 edit-tender" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-edit"></i> Edit Tender</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Tender Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Tender</h3>

          <div v-if="!isLoading" class="grid grid-cols-1 gap-4">
            <!-- Title Field -->
            <div>
              <label for="title" class="form-label">Title</label>
              <input type="text" id="title" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.title" />
            </div>

            <!-- Procurement Entity Field -->
            <div class="mt-4">
              <label for="procurement_entity" class="form-label">Procurement Entity</label>
              <input type="text" id="procurement_entity" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.procurement_entity" />
            </div>

            <!-- Tender Number Field -->
            <div class="mt-4">
              <label for="tender_number" class="form-label">Tender Number</label>
              <input type="text" id="tender_number" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.tender_number" />
            </div>

            <!-- Tender Type Field -->
            <div class="mt-4">
              <label for="tender_type" class=" form-label">Tender Type</label>
              <input type="text" id="tender_type" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.tender_type" />
            </div>

            <!-- Date of Publication Field -->
            <div class="mt-4">
              <label for="date_of_Publication" class=" form-label">Date of Publication</label>
              <input type="date" id="date_of_Publication" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.date_of_Publication" />
            </div>

            <!-- Expiry Date Field -->
            <div class="mt-4">
              <label for="expired_at" class="form-label">Expiry Date</label>
              <input type="date" id="expired_at" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.expired_at" />
            </div>

            <!-- Bid Submission Field -->
            <div class="mt-4">
              <label for="bid_submission" class=" form-label">Bid Submission Date</label>
              <input type="date" id="bid_submission" class="w-full px-3 py-2 border rounded form-control" v-model="tenderData.bid_submission" />
            </div>

            <!-- Attachment Field -->
            <div class="mt-4">
              <label for="attachment" class=" form-label">Attachment</label>
              <input type="file" id="attachment" class="w-full px-3 py-2 border rounded form-control" @change="handleFileUpload" />
            </div>

            <!-- Existing Attachment -->
            <div class="mt-4" v-if="tenderData.attachment">
              <p>Current Attachment: <a :href="tenderData.attachment" target="_blank" class="text-blue-600 underline">View Attachment</a></p>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 mt-4">
              <button @click="updateTender" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #283747;" :disabled="isLoading">
                Save changes
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>

              <span>
                <router-link to="/tenders" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                  <i class="fa fa-times"></i> Cancel
                </router-link>
              </span>
            </div>
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

const tenderData = ref({
  title: '',
  procurement_entity: '',
  tender_number: '',
  tender_type: '',
  date_of_Publication: '',
  expired_at: '',
  bid_submission: '',
  attachment: null,
});
const isLoading = ref(false); // Loading state

onMounted(async () => {
  await fetchTenderData();
});

async function fetchTenderData() {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(`api/tenders/${route.params.tender_id}`);
    let data = response.data.data;

    // Ensure the date fields are in YYYY-MM-DD format
    data.date_of_Publication = formatDate(data.date_of_Publication);
    data.bid_submission = formatDate(data.bid_submission);
    data.expired_at = formatDate(data.expired_at);

    tenderData.value = data;
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Set loading to false after request is complete
  }
}

// Helper function to format date to YYYY-MM-DD
function formatDate(date) {
  if (!date) return ''; // Return empty string if date is not available
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Return the date part of ISO string (YYYY-MM-DD)
}

async function updateTender() {
  isLoading.value = true;
  try {
    const response = await axios.put(
      `api/tenders/${route.params.tender_id}`,
      tenderData.value,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    toast.success('Tender updated successfully');
    router.push('/tenders');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    // Check file size (10MB limit)
    if (file.size > 10485760) { // 10 MB limit
      toast.error('File size exceeds 10MB.');
      tenderData.value.attachment = null;  // Clear the attachment
    } 
    // Check file type (PDF, DOC, DOCX)
    else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast.error('Only PDF, DOC, DOCX files are allowed.');
      tenderData.value.attachment = null;  // Clear the attachment
    } 
    else {
      // File is valid, set it to the attachment field
      tenderData.value.attachment = file;
      toast.success('File selected successfully.');
    }
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response && error.response.data && error.response.data.error) {
    message = error.response.data.error;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
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
  