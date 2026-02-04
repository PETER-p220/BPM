<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', sans-serif; font-size: 17px">
      <PageHeader subtitle="Extension Requests">
        <div class="flex flex-col sm:flex-row sm:space-x-2"></div>
      </PageHeader>
  
      <div class="flex items-center mb-4 space-x-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search..."
          class="w-full p-2 border rounded sm:w-auto"
        />
        <button
          @click="exportToExcel"
          class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color: white; color: #229954; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        >
          Export to Excel
          <span class="ml-2" aria-hidden="true">
            <i class="fas fa-file-excel" style="color: #edbb99"></i>
          </span>
        </button>
        <button
          @click="exportToPDF"
          class="flex items-center p-2 space-x-2 text-white rounded hover:bg-green-600"
          style="background-color: white; color: #229954; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        >
          Export to PDF
          <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
        </button>
      </div>
  
      <div class="space-y-4">
        <div
          v-for="project in filteredProjects"
          :key="project.project_id"
          class="shadow-lg rounded-lg bg-white dark:bg-dark-header"
        >
          <div
            class="px-6 py-3 bg-gray-50 dark:bg-neutral-700 rounded-t-lg"
            style="box-shadow: rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
          >
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Project: {{ project.project_name }}
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Engineer</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Item Description</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Quantity Extended</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Amount Extended</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Reason for Extension</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Rejection Reason</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
                  <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
                <tr v-for="(request, index) in project.requests" :key="request.extend_id">
                  <td class="table-data">{{ index + 1 }}</td>
                  <td class="table-data">{{ request.user?.name || 'N/A' }}</td>
                  <td class="table-data">{{ request.analysis?.item_description || 'N/A' }}</td>
                  <td class="table-data">{{ request.quantity_extended || 'N/A' }}</td>
                  <td class="table-data">{{ request.amount_extended || 'N/A' }}</td>
                  <td class="table-data">{{ request.reason_for_extend || 'N/A' }}</td>
                  <td class="table-data">
                    <span
                      :class="{
                        'px-2 py-1 rounded text-white': true,
                        'bg-yellow-500': request.status === 'pending',
                        'bg-green-500': request.status === 'accepted',
                        'bg-red-500': request.status === 'rejected',
                      }"
                    >
                      {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                    </span>
                  </td>
                  <td class="table-data">
                    <span v-if="request.status === 'rejected' && request.rejection_reason">
                      {{ request.rejection_reason }}
                      <span
                        class="ml-1 cursor-pointer"
                        @click="showRejectionReason(request.rejection_reason)"
                        title="View rejection reason"
                      >
                        <i class="fas fa-info-circle"></i>
                      </span>
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td class="table-data">{{ formatDate(request.created_at) }}</td>
                  <td class="table-data">
                    <div v-if="request.status === 'pending'" class="flex space-x-2">
                     
                    </div>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Dialog for Approve/Reject -->
      <div v-if="showDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-dark-header rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">
            {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }} Request
          </h3>
          <p class="mb-4">Are you sure you want to {{ dialogStatus === 'accepted' ? 'approve' : 'reject' }} this request?</p>
          <div v-if="dialogStatus === 'rejected'" class="mb-4">
            <label for="rejection_reason" class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Rejection Reason (required)</label
            >
            <textarea
              v-model="rejectionReason"
              id="rejection_reason"
              class="w-full p-2 border rounded dark:bg-neutral-700 dark:text-gray-200"
              rows="4"
              placeholder="Enter reason for rejection..."
              required
            ></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="showDialog = false"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-neutral-600 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              @click="submitStatus"
              class="px-4 py-2 text-white rounded"
              :class="dialogStatus === 'accepted' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'"
              :disabled="dialogStatus === 'rejected' && !rejectionReason.trim()"
            >
              {{ dialogStatus === 'accepted' ? 'Approve' : 'Reject' }}
            </button>
          </div>
        </div>
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
  
  const extensionRequests = ref([]);
  const filter = ref('');
  const showDialog = ref(false);
  const dialogStatus = ref('');
  const selectedRequest = ref(null);
  const rejectionReason = ref('');
  
  // Fetch data when component is mounted
  onMounted(async () => {
    await fetchData();
  });
  
  async function fetchData() {
    try {
      const response = await axios.get('/api/extend-request');
      if (response.data.status) {
        extensionRequests.value = response.data.data.map((request) => ({
          ...request,
          rejection_reason: request.rejection_reason || null, // Ensure rejection_reason is always defined
        }));
      } else {
        throw new Error(response.data.message || 'Failed to fetch extension requests');
      }
    } catch (error) {
      handleError(error);
    }
  }
  
  // Open dialog for approve/reject
  function openDialog(request, status) {
    selectedRequest.value = request;
    dialogStatus.value = status;
    rejectionReason.value = '';
    showDialog.value = true;
  }
  
  // Submit status update
  async function submitStatus() {
    if (dialogStatus.value === 'rejected' && !rejectionReason.value.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
  
    try {
      const payload = {
        extend_id: selectedRequest.value.extend_id,
        status: dialogStatus.value,
      };
      if (dialogStatus.value === 'rejected') {
        payload.rejection_reason = rejectionReason.value.trim();
      }
  
      const response = await axios.post('/api/extention/approve', payload);
      if (response.data.status) {
        toast.success(`Request ${dialogStatus.value} successfully. Notification sent to creator.`);
        await fetchData(); // Refresh data
        showDialog.value = false;
      } else {
        throw new Error(response.data.message || 'Failed to update request');
      }
    } catch (error) {
      handleError(error);
      await fetchData(); // Refetch data to ensure UI consistency
    }
  }
  
  // Show rejection reason in a toast
  function showRejectionReason(reason) {
    toast.info(`Rejection Reason: ${reason}`);
  }
  
  // Format date to East Africa Time
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Africa/Nairobi',
    }).format(date);
  }
  
  // Group requests by project_id
  const groupedByProject = computed(() => {
    const grouped = {};
    extensionRequests.value.forEach((request) => {
      const projectId = request.project_id;
      if (!grouped[projectId]) {
        grouped[projectId] = {
          project_id: projectId,
          project_name: request.project?.project_name || 'Unknown Project',
          requests: [],
        };
      }
      grouped[projectId].requests.push(request);
    });
    return Object.values(grouped);
  });
  
  // Computed Property for Filtering
  const filteredProjects = computed(() => {
    return groupedByProject.value
      .map((project) => {
        const filteredRequests = project.requests.filter((request) => {
          const searchText = filter.value.toLowerCase();
          return (
            (request.user?.name?.toLowerCase() || '').includes(searchText) ||
            (request.analysis?.item_description?.toLowerCase() || '').includes(searchText) ||
            (request.quantity_extended?.toString() || '').includes(searchText) ||
            (request.amount_extended?.toString() || '').includes(searchText) ||
            (request.reason_for_extend?.toLowerCase() || '').includes(searchText) ||
            (request.status?.toLowerCase() || '').includes(searchText) ||
            (request.rejection_reason?.toLowerCase() || '').includes(searchText) ||
            (project.project_name?.toLowerCase() || '').includes(searchText)
          );
        });
        return { ...project, requests: filteredRequests };
      })
      .filter((project) => project.requests.length > 0);
  });
  
  // Handle Errors
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
  
  // Export to Excel
  function exportToExcel() {
    const data = filteredProjects.value.flatMap((project) =>
      project.requests.map((request, index) => ({
        'Project Name': project.project_name,
        No: index + 1,
        Engineer: request.user?.name || 'N/A',
        'Item Description': request.analysis?.item_description || 'N/A',
        'Quantity Extended': request.quantity_extended || 'N/A',
        'Amount Extended': request.amount_extended || 'N/A',
        'Reason for Extension': request.reason_for_extend || 'N/A',
        Status: request.status || 'N/A',
        'Rejection Reason': request.status === 'rejected' ? request.rejection_reason || 'N/A' : 'N/A',
        'Created At': formatDate(request.created_at) || 'N/A',
      }))
    );
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Extension Requests');
    XLSX.writeFile(workbook, 'Extension_Requests.xlsx');
  }
  
  // Export to PDF
  function exportToPDF() {
    const doc = new jsPDF();
    const title = 'Extension Requests Data';
    doc.setFontSize(18);
    doc.text(title, 14, 22);
  
    filteredProjects.value.forEach((project) => {
      const headers = [
        [
          'No',
          'Engineer',
          'Item Description',
          'Quantity Extended',
          'Amount Extended',
          'Reason for Extension',
          'Status',
          'Rejection Reason',
          'Created At',
        ],
      ];
      const data = project.requests.map((request, index) => [
        index + 1,
        request.user?.name || 'N/A',
        request.analysis?.item_description || 'N/A',
        request.quantity_extended || 'N/A',
        request.amount_extended || 'N/A',
        request.reason_for_extend || 'N/A',
        request.status || 'N/A',
        request.status === 'rejected' ? request.rejection_reason || 'N/A' : 'N/A',
        formatDate(request.created_at) || 'N/A',
      ]);
  
      doc.setFontSize(14);
      doc.text(project.project_name, 14, doc.lastAutoTable.finalY + 20);
      doc.setFontSize(12);
      autoTable(doc, {
        head: headers,
        body: data,
        startY: doc.lastAutoTable.finalY + 30,
      });
    });
  
    doc.save('Extension_Requests.pdf');
  }
  </script>
  
  <style scoped>
  .table-data {
    @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200;
  }
  
  .rounded-table {
    border-radius: 8px;
    overflow: hidden;
  }
  </style>