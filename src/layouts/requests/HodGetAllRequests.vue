


<template>
    <div class="p-4 space-y-4" style="font-family: 'Trirong', sans-serif; font-size: 17px">
      <PageHeader subtitle="Requests for project">
        <div class="flex flex-col sm:flex-row sm:space-x-2"></div>
      </PageHeader>
  
      <div class="flex items-center mb-4 space-x-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search..."
          class="w-full p-2 border rounded sm:w-auto"
        />
  
        <button @click="exportToExcel" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color:white;color:#229954 ;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          Export to Excel
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel" style="color:#edbb99"></i></span>
        </button>
  
        <button @click="exportToPDF" class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color:white;color:#229954 ;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          Export to PDF
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
        </button>
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table"
          style="box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;">
          <thead class="bg-gray-50 dark:bg-neutral-700"
            style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Item/Items</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">For Project</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created By</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Amount</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is Approved?</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(request, index) in filteredRequests" :key="request.request_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ request.item }}</td>
              <td class="table-data">{{ request.project.project_name }}</td>
              <td class="table-data">{{ request.user.name }}</td>
              <td class="table-data">{{ request.amount }}</td>
              <td class="table-data">{{ request.description }}</td>
              <td class="table-data">
    <button :class="{
      'bg-green-700': request.is_approved === 'approved', 
      'bg-red-500': request.is_approved !== 'approved'
    }" 
    class="btn text-white w-full rounded-full" style="border-radius:17px">
      {{ request.is_approved }}
    </button>
  </td>
  
              <td class="table-data">{{ request.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'; // Import useRouter hook
  import axios from '@/axios'; // Ensure this points to your axios instance
  import { useToast } from 'vue-toastification';
  import * as XLSX from '@e965/xlsx';
  import jsPDF from 'jspdf';
  
  // Initialize router using useRouter
  const router = useRouter();
  
  const requests = ref([]);
  const filter = ref("");
  const filteredRequests = computed(() => {
    return requests.value.filter(request => {
      return request.item.toLowerCase().includes(filter.value.toLowerCase()) || 
             request.project.project_name.toLowerCase().includes(filter.value.toLowerCase()) || 
             request.user.name.toLowerCase().includes(filter.value.toLowerCase());
    });
  });
  
  onMounted(async () => {
    try {
      const response = await axios.get('/api/requests-for-projects');
      if (response.data.status) {
        requests.value = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  });
  

  
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRequests.value);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requests");
    XLSX.writeFile(wb, "requests.xlsx");
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Requests List", 10, 10);
    filteredRequests.value.forEach((request, index) => {
      doc.text(`${index + 1}. ${request.item}`, 10, 20 + index * 10);
    });
    doc.save("requests.pdf");
  };
  
  const editRequest = (requestId) => {
    // Logic to handle editing or approving/rejecting the request
  };
  </script>
  