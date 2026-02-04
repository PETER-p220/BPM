<template>
    <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
      <PageHeader title="Table" subtitle="Venues">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <router-link to="/add-venue">
            <BaseButton @click="AddVenue" style="background-color: #2e4053;" class="w-full sm:w-auto">
              Add New Venue
              <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
            </BaseButton>
          </router-link>
        </div>
      </PageHeader>
  
      <div class="flex items-center mb-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search..."
          class="w-full p-2 border rounded sm:w-auto"
        />
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
          <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Venue Name</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Supervisor</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Location</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Seats</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Availability</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(venue, index) in filteredVenues" :key="venue.venue_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ venue.venue_name }}</td>
              <td class="table-data">{{ venue.supervisor }}</td>
              <td class="table-data">{{ venue.location }}</td>
              <td class="table-data">{{ venue.seats }}</td>
              <td class="table-data"><p class="text-center btn" style="background-color:#1b4f72;color:white">{{ venue.is_available }}</p></td>
              <td class="table-data">
                <i @click="editVenue(venue.venue_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
                <i @click="deleteVenue(venue.venue_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  
  <script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios'; // Ensure this points to your axios instance
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const venues = ref([]);
const filter = ref('');

// Fetch venues when component is mounted
onMounted(async () => {
  await fetchVenues();
});

// Function to fetch venues from API
async function fetchVenues() {
  try {
    const response = await axios.get('api/venues');
    venues.value = response.data;
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter venues based on input
const filteredVenues = computed(() => {
  return venues.value.filter(venue =>
    venue.venue_name.toLowerCase().includes(filter.value.toLowerCase()) ||
    venue.supervisor.toLowerCase().includes(filter.value.toLowerCase()) ||
    venue.location.toLowerCase().includes(filter.value.toLowerCase()) ||
    venue.is_available.toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Navigate to edit venue page
function editVenue(venueId) {
  router.push({ name: 'EditVenue', params: { venue_id: venueId } });
}

// Function to delete a venue with toast confirmation
async function deleteVenue(venueId) {
  const deleteToast = toast(
    "Are you sure you want to delete this venue?",
    {
      timeout: 0,
      closeOnClick: false,
      hideProgressBar: true,
      icon: "fas fa-info",
      position: "top-right",
      toastClassName: "custom-toast",
      bodyClassName: "custom-toast-body",
    }
  );

  const confirmButton = document.createElement('button');
  confirmButton.innerText = "Confirm";
  confirmButton.className = "confirm-btn";
  confirmButton.onclick = async () => {
    try {
      await axios.delete(`api/venues/${venueId}`);
      venues.value = venues.value.filter(venue => venue.venue_id !== venueId);
      toast.success("Venue deleted successfully.");
    } catch (error) {
      handleError(error);
    }
    toast.dismiss(deleteToast);
  };

  const cancelButton = document.createElement('button');
  cancelButton.innerText = "Cancel";
  cancelButton.className = "cancel-btn";
  cancelButton.onclick = () => {
    toast.info("Venue deletion cancelled.");
    toast.dismiss(deleteToast);
  };

  const toastBody = document.querySelector('.custom-toast-body');
  if (toastBody) {
    toastBody.appendChild(confirmButton);
    toastBody.appendChild(cancelButton);
  }
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response) {
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.response.statusText;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }

  toast.error(message);
}
</script>
