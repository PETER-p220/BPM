<template>
  <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
    <PageHeader title="Table" subtitle="Invitees">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/add-invitee">
          <BaseButton @click="addNewInvitee" style="background-color: #2e4053;" class="w-full sm:w-auto">
            Add New Invitee
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
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Barcode Number</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Barcode Confirmation</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Name</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Email</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Phone</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Type</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Time</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">For Single Amount</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">For Double Amount</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Venue</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Physical Address</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(invitee, index) in filteredInvitees" :key="invitee.invitee_id">
            <td class="table-data">{{ index + 1 }}</td>
            <td class="table-data">{{ invitee.barcode_number }}</td>
            <td class="table-data"><p class="text-center btn" style="background-color:#a93226;color:white">{{ invitee.barcode_confirmation}}</p></td>
            <td class="table-data">{{ invitee.name }}</td>
            <td class="table-data">{{ invitee.email }}</td>
            <td class="table-data">{{ invitee.phone }}</td>
            <td class="table-data">{{ invitee.event.event_type }}</td>
            <td class="table-data">{{ invitee.event_time }}</td>
            <td class="table-data"> <p class="text-center btn" style="background-color:#1b4f72;color:white">{{ invitee.is_confirmed }}</p></td>
            <td class="table-data">{{ invitee.for_single_amount }}</td>
            <td class="table-data">{{ invitee.for_double_amount }}</td>
            <td class="table-data">{{ invitee.venue }}</td>
            <td class="table-data">{{ invitee.physical_address }}</td>
            <td class="table-data">
              <i @click="editInvitee(invitee.invitee_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
              <i @click="deleteInvitee(invitee.invitee_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
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

const invitees = ref([]);
const filter = ref('');

// Fetch invitees when the component is mounted
onMounted(async () => {
  await fetchInvitees();
});

// Function to fetch invitees from API
async function fetchInvitees() {
  try {
    const response = await axios.get('api/my-invitations');
    invitees.value = response.data;
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter invitees based on input
const filteredInvitees = computed(() => {
  return invitees.value.filter(invitee =>
    invitee.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    invitee.email.toLowerCase().includes(filter.value.toLowerCase()) ||
    (invitee.event && invitee.event.event_type.toLowerCase().includes(filter.value.toLowerCase())) // Fixed the issue
  );
});

// Navigate to edit invitee page
function editInvitee(inviteeId) {
  router.push({ name: 'EditInvitee', params: { invitee_id: inviteeId } });
}

// Function to delete an invitee
async function deleteInvitee(inviteeId) {
  try {
    await axios.delete(`api/invitees/${inviteeId}`);
    invitees.value = invitees.value.filter(invitee => invitee.invitee_id !== inviteeId);
    toast.success("Invitee deleted successfully.");
  } catch (error) {
    handleError(error);
  }
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}
</script>

<style scoped>
.table-data {
  padding: 8px;
  text-align: left;
}

.custom-toast-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirm-btn, .cancel-btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn {
  background-color: #2196f3;
  color: white;
}
</style>
