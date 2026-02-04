<template>
  <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
    <PageHeader title="Bookings Table" subtitle="Bookings">
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
      
      <button @click="exportToExcel" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
      style="background-color:white;color:#edbb99;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
        Export to Excel 
        <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
      </button>
    
      <button @click="exportToPDF" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
      style="background-color:white;color:#edbb99;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
        Export to PDF 
        <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
      </button>
    </div>
    

    <div class="overflow-x-auto">
      <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
        <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
          <tr>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Name</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Type</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Venue</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Email</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(booking, index) in filteredData" :key="booking.book_id">
            <td class="table-data">{{ index + 1 }}</td>
            <td class="table-data">{{ booking.name }}</td>
            <td class="table-data">{{ booking.event_type }}</td>
            <td class="table-data">{{ booking.venue_name }}</td>
            <td class="table-data"><p class="text-center btn" style="background-color:#1b4f72;color:white">{{ booking.is_confirmed  }}</p></td>
            <td class="table-data">{{ booking.email }}</td>
            <td class="table-data">
              <i @click="editBooking(booking.book_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
              <i @click="deleteBooking(booking.book_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
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
import axios from '@/axios'; 
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const bookings = ref([]);
const filter = ref('');

// Fetch bookings when component is mounted
onMounted(async () => {
  await fetchBookings();
});

// Function to fetch bookings from API
async function fetchBookings() {
  try {
    const response = await axios.get('api/bookings');
    bookings.value = response.data;
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter bookings based on input
const filteredData = computed(() => {
  return bookings.value.filter(booking =>
    booking.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    booking.email.toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Navigate to edit booking page
function editBooking(bookId) {
  router.push({ name: 'EditBookingClient', params: { book_id: bookId } });
}

// Function to delete a booking with toast confirmation
async function deleteBooking(bookId) {
  const deleteToast = toast(
    "Are you sure you want to delete this booking?",
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
      // Fixed API route to match 'api/bookings/{book_id}'
      await axios.delete(`api/bookings/${bookId}`);
      bookings.value = bookings.value.filter(booking => booking.book_id !== bookId);
      toast.success("Booking deleted successfully.");
    } catch (error) {
      handleError(error);
    }
    toast.dismiss(deleteToast);
  };

  const cancelButton = document.createElement('button');
  cancelButton.innerText = "Cancel";
  cancelButton.className = "cancel-btn";
  cancelButton.onclick = () => {
    toast.info("Booking deletion cancelled.");
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

// Export filtered data to Excel
function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(booking => ({
    Name: booking.name,
    EventType: booking.event_type,
    Venue: booking.venue_name,
    Status: booking.is_confirmed ? 'Confirmed' : 'Pending',
    Email: booking.email
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
  XLSX.writeFile(workbook, 'Bookings.xlsx');
}

// Export filtered data to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = "Booking Data";
  const headers = [['No', 'Name', 'Event Type', 'Venue', 'Status', 'Email']];
  const data = filteredData.value.map((booking, index) => [
    index + 1,
    booking.name,
    booking.event_type,
    booking.venue_name,
    booking.is_confirmed ? 'Confirmed' : 'Pending',
    booking.email
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(12);
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30
  });

  doc.save('Bookings.pdf');
}
</script>

<style scoped>
.custom-toast-body {
  display: flex;
  justify-content: space-between;
}

.confirm-btn, .cancel-btn {
  padding: 6px 12px;
  margin-left: 10px;
  background-color: #21618c;
  color: white;
  border: none;
  cursor: pointer;
}

.confirm-btn {
  background-color: #1a5a63;
}

.cancel-btn {
  background-color: #b53b0a;
}

.table-data {
  padding: 8px;
  text-align: left;
  font-size: 14px;
}
</style>
