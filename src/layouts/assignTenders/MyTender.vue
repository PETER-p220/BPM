<template>
  <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 23px">
    <PageHeader subtitle="Assigned Tenders">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
      </div>
    </PageHeader>

    <div class="flex items-center mb-4 space-x-4">
      <input
        type="text"
        v-model="filter"
        placeholder="Search..."
        class="w-full p-2 border rounded sm:w-auto"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-neutral-700">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Title</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Type</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Procurement Entity</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Tender Number</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date Of Publication</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Date Of Submission</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Attachment</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(assignedTender, index) in paginatedData" :key="assignedTender.assign_id">
            <td class="table-data">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="table-data">{{ assignedTender.title }}</td>
            <td class="table-data">{{ assignedTender.tender_type }}</td>
            <td class="table-data">{{ assignedTender.procurement_entity }}</td>
            <td class="table-data">{{ assignedTender.tender_number }}</td>
            <td class="table-data">{{ formatDate(assignedTender.date_of_Publication) }}</td>
            <td class="table-data">{{ formatDate(assignedTender.bid_submission) }}</td>
            <td class="table-data">
              <button
                class="btn-block btn"
                :style="getStatusStyle(assignedTender)"
                style="width:170px; color:white; border-radius:12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >
                {{ getStatusText(assignedTender) }}
              </button>
            </td>
            <td class="table-data">
              <button 
                v-if="assignedTender.attachment" 
                @click="downloadFile(assignedTender.attachment)" 
                class="btn-block btn" 
                style="width:100px;background-color:#27ae60;color:white;border-radius:17px">
                Download File
              </button>
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
        :disabled="currentPage * itemsPerPage >= filteredData.length" 
        @click="changePage(currentPage + 1)" 
        class="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios'; 
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const assignedTenders = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Fetch data when component is mounted
onMounted(async () => {
  await fetchData();
});

// Fetch data for the table
async function fetchData() {
  try {
    const response = await axios.get('api/your/tender'); 
    assignedTenders.value = response.data.data.map(assignedTender => ({
      assign_id: assignedTender.assign_id,
      title: assignedTender.tender.title,  
      tender_type: assignedTender.tender.tender_type,
      procurement_entity: assignedTender.tender.procurement_entity,
      tender_number: assignedTender.tender.tender_number,
      date_of_Publication: assignedTender.tender.date_of_Publication,
      bid_submission: assignedTender.tender.bid_submission,
      expired_at: assignedTender.tender.expired_at, 
      user_name: assignedTender.user.name,  
      attachment: assignedTender.tender.attachment,
      is_assigned: assignedTender.is_assigned
    }));
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

// Computed property to filter the data
const filteredData = computed(() => {
  return assignedTenders.value.filter(entry =>
    entry.title.toLowerCase().includes(filter.value.toLowerCase()) ||
    entry.user_name.toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Computed property for paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});

// Change page function
function changePage(newPage) {
  if (newPage > 0 && newPage <= Math.ceil(filteredData.value.length / itemsPerPage.value)) {
    currentPage.value = newPage;
  }
}

// Download file function
function downloadFile(fileUrl) {
  if (!fileUrl) {
    toast.error("File URL is missing!");
    return;
  }

  axios({
    url: fileUrl,
    method: "GET",
    responseType: "blob",
  })
    .then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      toast.error("Failed to download file. Please try again.");
      console.error("Download error:", error);
    });
}

// Function to format date
function formatDate(dateString, includeTime = false) {
  if (!dateString) return "N/A";
  const options = includeTime
    ? { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(dateString).toLocaleString('en-US', options);
}

// Function to get status text
function getStatusText(tender) {
  if (tender.is_assigned === 'submitted') {
    return "Submitted";
  }
  const currentDate = new Date();
  const expirationDate = new Date(tender.expired_at);
  return currentDate > expirationDate 
    ? `Expired ${formatDate(tender.expired_at, true)}`
    : `Due ${formatDate(tender.expired_at, true)}`;
}

// Function to get status style
function getStatusStyle(tender) {
  if (tender.is_assigned === 'submitted') {
    return { backgroundColor: '#28a745' }; // Green for submitted
  }

  const currentDate = new Date();
  const expirationDate = new Date(tender.expired_at);
  const diffDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

  if (currentDate > expirationDate) {
    return { backgroundColor: '#c0392b' }; // Deep red for expired
  } else if (diffDays <= 3) {
    return { backgroundColor: '#e74c3c' }; // Shallow red for 3 days or less
  } else if (diffDays <= 6) {
    return { backgroundColor: '#f1c40f' }; // Yellow for 6 days or less
  } else {
    return { backgroundColor: '#2ecc71' }; // Green for more than 6 days
  }
}
</script>