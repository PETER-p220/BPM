<template>
  <div class="py-5 edit-application" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-edit"></i> Edit/Confirm/Reject Agent Application</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- Edit Application Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Edit Application</h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="applicantName" class="font-semibold form-label">Applicant Name</label>
              <input type="text" id="applicantName" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.applicant_name" />
            </div>
            <div>
              <label for="applicantEmail" class="font-semibold form-label">Email</label>
              <input type="email" id="applicantEmail" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.email" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="applicantPhone" class="font-semibold form-label">Phone</label>
              <input type="text" id="applicantPhone" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.phone" />
            </div>
            <div>
              <label for="applicantAddress" class="font-semibold form-label">Address</label>
              <input type="text" id="applicantAddress" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.address" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="country" class="font-semibold form-label">Country</label>
              <input type="text" id="country" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.country" />
            </div>
            <div>
              <label for="region" class="font-semibold form-label">Region</label>
              <input type="text" id="region" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.region" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="district" class="font-semibold form-label">District</label>
              <input type="text" id="district" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.district" />
            </div>
            <div>
              <label for="agentNumber" class="font-semibold form-label">Agent Number</label>
              <input type="text" id="agentNumber" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.agent_number" disabled />
            </div>
          </div>

          <!-- Dropdown for is_confirmed -->
          <div class="mt-4">
            <label for="is_confirmed" class="font-semibold form-label">Application Status</label>
            <select id="is_confirmed" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.is_confirmed">
              <option value="" disabled>Select Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <hr>

          <!-- Attachments -->
          <div class="py-5 mt-4">
            <label for="id_attachment" class="font-semibold form-label">ID Attachment</label>
            <!-- Display ID Attachment directly from URL -->
            <div v-if="applicationData.id_attachment">
              <img :src="applicationData.id_attachment" alt="ID Attachment" class="w-full mt-2 border rounded" style="max-height: 200px; object-fit: cover;" />
              <a :href="applicationData.id_attachment" download class="block mt-2 text-blue-600">Download ID Attachment</a>
            </div>
          </div>

          <div class="mt-4">
            <label for="business_license_attachment" class="font-semibold form-label">Business License Attachment</label>
            <!-- Display Business License Attachment directly from URL -->
            <div v-if="applicationData.business_license_attachment">
              <img :src="applicationData.business_license_attachment" alt="Business License Attachment" class="w-full mt-2 border rounded" style="max-height: 200px; object-fit: cover;" />
              <a :href="applicationData.business_license_attachment" download class="block mt-2 text-blue-600">Download Business License</a>
            </div>
          </div>

          <div class="mt-4">
            <label for="tin_certificate_attachment" class="font-semibold form-label">TIN Certificate Attachment</label>
            <!-- Display TIN Certificate Attachment directly from URL -->
            <div v-if="applicationData.tin_certificate_attachment">
              <img :src="applicationData.tin_certificate_attachment" alt="TIN Certificate Attachment" class="w-full mt-2 border rounded" style="max-height: 200px; object-fit: cover;" />
              <a :href="applicationData.tin_certificate_attachment" download class="block mt-2 text-blue-600">Download TIN Certificate</a>
            </div>
          </div>

          <div class="mt-4">
            <label for="created_at" class="font-semibold form-label">Created At</label>
            <input type="text" id="created_at" class="w-full px-3 py-2 border rounded form-control" v-model="applicationData.created_at" disabled />
          </div>

          <div class="flex gap-4 mt-4">
            <button @click="updateApplication" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">Update Application</button>
            
            <span v-if="isLoading" class="flex items-center gap-2 mt-4">
              <i class="fa fa-spinner fa-spin"></i> Loading...
            </span>

            <span>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                <a href="/agents"><i class="fa fa-times"></i> Cancel</a>
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
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const applicationData = ref({
  applicant_name: '',
  email: '',
  phone: '',
  address: '',
  country: '', 
  region: '',  
  district: '', 
  id_attachment: null,
  business_license_attachment: null,
  tin_certificate_attachment: null,
  agent_number: '', 
  is_confirmed: null,
  created_at: '', 
});

const isLoading = ref(false);

onMounted(async () => {
  await fetchApplicationData();
});

async function fetchApplicationData() {
  try {
    isLoading.value = true;
    const response = await axios.get(`api/applications/${route.params.agent_id}`);
    const data = response.data.data;
    applicationData.value = {
      applicant_name: data.full_name,
      email: data.email,
      phone: data.phone_number,
      address: data.address,
      country: data.country,
      region: data.region,
      district: data.district,
      id_attachment: data.id_attachment,
      business_license_attachment: data.business_license_attachment,
      tin_certificate_attachment: data.tin_certificate_attachment,
      agent_number: data.agent_number,
      is_confirmed: data.is_confirmed || '',
      created_at: data.created_at,
    };
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

async function updateApplication() {
  try {
    isLoading.value = true;
    const updatedData = { ...applicationData.value };
    delete updatedData.id_attachment;
    delete updatedData.business_license_attachment;
    delete updatedData.tin_certificate_attachment;

    const response = await axios.patch(`api/applications/${route.params.agent_id}`, updatedData);
    toast.success(response.data.message || 'Application updated successfully!');
    router.push('/agents');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  console.error(error);
  if (error.response && error.response.data.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error("Something went wrong!");
  }
}
</script>

<style scoped>
.edit-user {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>
