<template>
    <div class="py-5 add-tender" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
            <div><i class="mr-2 fa fa-plus"></i> Create New Tender</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>              
          </div>
  
          <!-- New Tender Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Add New Tender</h3>
  
            <!-- Form Fields -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="tenderTitle" class="font-semibold form-label">Tender Title</label>
                <input
                  type="text"
                  id="tenderTitle"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.title"
                />
              </div>
              <div>
                <label for="procurementEntity" class="font-semibold form-label">Procurement Entity</label>
                <input
                  type="text"
                  id="procurementEntity"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.procurement_entity"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="tenderNumber" class="font-semibold form-label">Tender Number</label>
                <input
                  type="text"
                  id="tenderNumber"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.tender_number"
                />
              </div>
              <div>
                <label for="dateOfPublication" class="font-semibold form-label">Date of Publication</label>
                <input
                  type="date"
                  id="dateOfPublication"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.date_of_Publication"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="expiredAt" class="font-semibold form-label">Expiration Date</label>
                <input
                  type="date"
                  id="expiredAt"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.expired_at"
                />
              </div>
              <div>
                <label for="bidSubmission" class="font-semibold form-label">Bid Submission Date</label>
                <input
                  type="date"
                  id="bidSubmission"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.bid_submission"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="siteVisit" class="font-semibold form-label">Site Visit</label>
                <input
                  type="date"
                  id="siteVisit"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.site_visit"
                />
              </div>
              <div>
                <label for="bidMeetDate" class="font-semibold form-label">Bid Meeting Date</label>
                <input
                  type="date"
                  id="bidMeetDate"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.bid_meet_date"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="tenderSecurity" class="font-semibold form-label">Tender Security</label>
                <input
                  type="text"
                  id="tenderSecurity"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.tender_security"
                />
              </div>
              <div>
                <label for="officeTender" class="font-semibold form-label">Office Tender</label>
                <input
                  type="text"
                  id="officeTender"
                  class="w-full px-3 py-2 border rounded form-control"
                  v-model="newTenderData.office_tender"
                />
              </div>
            </div>
  
            <!-- Description field at the bottom -->
            <div class="mb-4">
              <label for="description" class="font-semibold form-label">Description</label>
              <textarea
                id="description"
                class="w-full px-3 py-2 border rounded form-control"
                rows="4"
                v-model="newTenderData.description"
              ></textarea>
            </div>
  
            <!-- File Upload -->
            <div class="mb-4">
              <label for="attachment" class="font-semibold form-label">Attachment</label>
              <input
                type="file"
                id="attachment"
                class="w-full px-3 py-2 border rounded form-control"
                @change="handleFileUpload"
              />
            </div>
  
            <div class="flex gap-4 mt-4">
              <button
                @click="addTender"
                class="px-4 py-2 text-white rounded hover:bg-blue-700"
                style="background-color: #283747;"
                :disabled="isLoading" 
              >
                <i class="fa fa-plus"></i> Add Tender
                <span v-if="isLoading" class="flex items-center gap-2 mt-4">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
              </button>
              <span>
                <router-link to="/adminview-tenders" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
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
  import { ref } from 'vue';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  const newTenderData = ref({
    title: '',
    procurement_entity: '',
    tender_number: '',
    description: '',
    date_of_Publication: '',
    expired_at: '',
    bid_submission: '',
    site_visit: '',
    bid_meet_date: '',
    tender_security: '',
    office_tender: '',
    attachment: null,
  });
  const isLoading = ref(false); // Loading state
  
  // Handle file upload
  function handleFileUpload(event) {
    newTenderData.value.attachment = event.target.files[0];
  }
  
  // Add new tender function
  async function addTender() {
    isLoading.value = true;
    try {
      const formData = new FormData();
      Object.keys(newTenderData.value).forEach(key => {
        formData.append(key, newTenderData.value[key]);
      });
  
      const response = await axios.post('/api/tenders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.status) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const messages = Object.values(error.response.data.errors).flat();
        messages.forEach(msg => toast.error(msg));
      } else {
        toast.error('An error occurred while creating the tender.');
      }
    } finally {
      isLoading.value = false;
    }
  }
  
  // Reset form
  function resetForm() {
    newTenderData.value = {
      title: '',
      procurement_entity: '',
      tender_number: '',
      description: '',
      date_of_Publication: '',
      expired_at: '',
      bid_submission: '',
      site_visit: '',
      bid_meet_date: '',
      tender_security: '',
      office_tender: '',
      attachment: null,
    };
  }
  </script>
  
  <style scoped>
  .card-header {
    font-size: 1.25rem;
    font-weight: bold;
  }
  .form-label {
    margin-bottom: 0.5rem;
  }
  </style>
  