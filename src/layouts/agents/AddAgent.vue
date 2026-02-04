<template>
  <div class="py-5 add-user" style="font-family: 'Euclid Circular', sans-serif;">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
          <div><i class="mr-2 fa fa-user-plus"></i> Add New Agent</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <!-- New User Form -->
        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Add New Agent</h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label for="newUserName" class="font-semibold form-label">Full Name</label>
              <input type="text" id="newUserName" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.full_name" />
            </div>
            <div>
              <label for="newUserEmail" class="font-semibold form-label">Email</label>
              <input type="email" id="newUserEmail" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.email" />
            </div>
          </div>

          <!-- Additional fields for Application -->
          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="newUserPhone" class="font-semibold form-label">Phone</label>
              <input type="text" id="newUserPhone" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.phone_number" />
            </div>
            <div>
              <label for="newUserAddress" class="font-semibold form-label">Address</label>
              <input type="text" id="newUserAddress" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.address" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="newUserCountry" class="font-semibold form-label">Country</label>
              <select id="newUserCountry" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.country">
                <option value="" disabled selected>Select Country</option>
                <option v-for="country in countries" :key="country.code" :value="country.name">{{ country.name }}</option>
              </select>
            </div>
            <div>
              <label for="newUserRegion" class="font-semibold form-label">Region</label>
              <select id="newUserRegion" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.region" @change="fetchDistricts">
                <option value="" disabled selected>Select Region</option>
                <option v-for="region in tanzaniaRegions" :key="region" :value="region">{{ region }}</option>
              </select>
            </div>
          </div>

          <!-- Removed the District dropdown here -->

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="newUserIdAttachment" class="font-semibold form-label">ID Attachment</label>
              <input type="file" id="newUserIdAttachment" class="w-full px-3 py-2 border rounded form-control" @change="handleFileChange('id_attachment', $event)" />
            </div>
            <div>
              <label for="newUserDistrict" class="font-semibold form-label">District</label>
              <input type="text" id="newUserDistrict" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.district" required />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div>
              <label for="newUserBusinessLicense" class="font-semibold form-label">Business License</label>
              <input type="file" id="newUserBusinessLicense" class="w-full px-3 py-2 border rounded form-control" @change="handleFileChange('business_license_attachment', $event)" />
            </div>
            <div>
              <label for="newUserTinCertificate" class="font-semibold form-label">TIN Certificate</label>
              <input type="file" id="newUserTinCertificate" class="w-full px-3 py-2 border rounded form-control" @change="handleFileChange('tin_certificate_attachment', $event)" />
            </div>
          </div>

          <div class="flex gap-4 mt-4">
            <button @click="addUser" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" style="background-color: #154360;">
              <i class="fa fa-plus"></i> Add New Agent
                <!-- Loading Spinner -->
          <span v-if="isLoading" class="flex items-center gap-2 mt-4">
            <i class="fa fa-spinner fa-spin"></i> Loading...
          </span>
            </button>
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
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const newUserData = ref({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  country: '',
  region: '',
  district: '', // Added district field
  id_attachment: null,
  business_license_attachment: null,
  tin_certificate_attachment: null,
  status: 'is_active',
  is_active_from: '',
  is_active_upto: ''
});
const countries = ref([]);
const tanzaniaRegions = ref([
  'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Mtwara', 'Kagera', 'Morogoro', 'Kigoma', 'Singida', 'Shinyanga', 'Tabora', 'Ruvuma', 'Rukwa', 'Iringa', 'Manyara', 'Tanga', 'Zanzibar'
]);
const availableDistricts = ref([]);
const isLoading = ref(false); // For controlling the spinner visibility

onMounted(async () => {
  await fetchCountries();
});

async function fetchCountries() {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    countries.value = response.data.map(country => ({
      name: country.name.common,
      code: country.cca3
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    toast.error('Failed to load countries');
  }
}

function handleFileChange(field, event) {
  const file = event.target.files[0];
  newUserData.value[field] = file;
}

async function addUser() {
  isLoading.value = true; // Start loading

  const formData = new FormData();
  for (const [key, value] of Object.entries(newUserData.value)) {
    formData.append(key, value);
  }

  try {
    const response = await axios.post('api/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success(response.data.message);
    newUserData.value = {
      full_name: '', email: '', phone_number: '', address: '', country: '', region: '', district: '', id_attachment: null, business_license_attachment: null, tin_certificate_attachment: null, status: 'is_active', is_active_from: '', is_active_upto: ''
    };
    router.push('/agents');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false; // Stop loading
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
  .add-user {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  