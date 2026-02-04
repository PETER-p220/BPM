<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <PageHeader subtitle="Tenders">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/create-tender">
          
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
      <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table">
        <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Title</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Source</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Type</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Number</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Procurement-Entity</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">TenderFile</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date Of Publication</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date Of Submission</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Expiration Date</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(tender, index) in paginatedTenders" :key="tender.tender_id">
            <td class="table-data">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="table-data">{{ tender.title }}</td>
            <td class="table-data">{{ tender.tender_source || 'N/A' }}</td>
            <td class="table-data">{{ tender.tender_type }}</td>
            <td class="table-data">{{ tender.tender_number }}</td>
            <td class="table-data">{{ tender.procurement_entity }}</td>
            <td @click="downloadTenderPdf(tender.attachment)" class="table-data">
              <i class="fas fa-download"></i> DownloadFile
            </td>
            <td class="table-data">{{ tender.date_of_Publication }}</td>
            <td class="table-data">{{ formatDate(tender.bid_submission) }}</td>
            <td class="table-data">
              <button
                class="btn btn-block"
                :style="getExpirationStyle(tender.expired_at)"
                style="width:180px; color:white; border-radius:17px"
              >
                {{ formatDate(tender.expired_at, true) }}
              </button>
            </td>
            <td class="table-data">{{ formatDate(tender.created_at) }}</td>
            <td class="table-data">
              <i @click="editTender(tender.tender_id)" class="fas fa-eye" style="color:#21618c;font-weight:bold;font-size:17px"></i>
              <i @click="downloadTenderPdf(tender.attachment)" class="fas fa-download" style="color:#1c8a31;font-weight:bold;font-size:17px"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-4">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)" 
        class="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50">
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }}</span>
      <button 
        :disabled="currentPage * itemsPerPage >= filteredTenders.length" 
        @click="changePage(currentPage + 1)" 
        class="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { saveAs } from 'file-saver';

const router = useRouter();
const toast = useToast();

const tenders = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10; // Limit to 10 items per page

// Fetch tenders when component is mounted
onMounted(async () => {
  await fetchTenders();
});

// Function to fetch tenders from API
async function fetchTenders() {
  try {
    const response = await axios.get('api/tenders');
    tenders.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter tenders based on input
const filteredTenders = computed(() => {
  return tenders.value.filter(tender =>
    Object.values(tender).some(value =>
      String(value).toLowerCase().includes(filter.value.toLowerCase())
    )
  );
});

// Computed property to get paginated tenders
const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTenders.value.slice(start, start + itemsPerPage);
});

// Function to format date
function formatDate(dateString, includeTime = false) {
  if (!dateString) return "N/A";
  const options = includeTime
    ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(dateString).toLocaleString('en-US', options);
}

// Function to get expiration style
function getExpirationStyle(expiredAt) {
  if (!expiredAt) return {};
  const currentDate = new Date();
  const expirationDate = new Date(expiredAt);
  const diffDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    return { backgroundColor: '#e74c3c' }; // Red for urgent (3 days remaining)
  } else if (diffDays <= 6) {
    return { backgroundColor: '#f1c40f' }; // Yellow for warning (6 days remaining)
  }
  return { backgroundColor: '#2ecc71' }; // Green for safe
}

// Change page
function changePage(page) {
  currentPage.value = page;
}

// Navigate to edit tender page
function editTender(tenderId) {
  router.push({ name: 'EditTender', params: { tender_id: tenderId } });
}

// Function to download tender PDF
async function downloadTenderPdf(attachment) {
  try {
    const response = await axios.get(attachment, { responseType: 'blob' });
    saveAs(response.data, 'tender_attachment.pdf');
  } catch (error) {
    handleError(error);
  }
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response) {
    message = error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }

  toast.error(message);
}
</script>