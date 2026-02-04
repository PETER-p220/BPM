<template>
    <div class="p-4 space-y-4">
      <PageHeader title="Table" subtitle="Applications" style="font-family: 'Euclid Circular', sans-serif;">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
           
          <router-link to="/add-agent">
            <BaseButton @click="AddAgent" style="background-color: #2e4053;" class="w-full sm:w-auto">
              Add New Agent
              <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
            </BaseButton>
          </router-link>
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
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Full Name</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Phone</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Email</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Address</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Country</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Region</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">District</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Agent Number</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(agent, index) in filteredData" :key="agent.agent_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ agent.full_name }}</td>
              <td class="table-data">{{ agent.phone_number }}</td>
              <td class="table-data">{{ agent.email }}</td>
              <td class="table-data">{{ agent.address }}</td>
              <td class="table-data">{{ agent.country }}</td>
              <td class="table-data">{{ agent.region }}</td>
              <td class="table-data">{{ agent.district }}</td>
              <td class="table-data">{{ agent.agent_number }}</td>
              <td class="table-data">
                <p 
                  :style="{
                    backgroundColor: agent.is_confirmed === 'confirmed' ? '#28b463' : (agent.is_confirmed === 'pending' ? '#f5eb58' : 'transparent'),
                    color: 'white'
                  }"
                >
                  {{ agent.is_confirmed }}
                </p>
              </td>
              
              <td class="table-data">
                <i @click="editAgent(agent.agent_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
                <i @click="deleteAgent(agent.agent_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
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
  
  const agents = ref([]);
  const filter = ref('');
  
  // Fetch agents when component is mounted
  onMounted(async () => {
    await fetchAgents();
  });
  
  // Function to fetch agents from API
  async function fetchAgents() {
    try {
      const response = await axios.get('/api/applications');
      agents.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Computed property to filter agents based on input
  const filteredData = computed(() => {
    return agents.value.filter(agent =>
      agent.full_name.toLowerCase().includes(filter.value.toLowerCase()) ||
      agent.email.toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  
  // Navigate to edit agent page
  function editAgent(agentId) {
    router.push({ name: 'EditAgent', params: { agent_id: agentId } });
  }
  
  
  async function deleteAgent(agentId) {
  const deleteToast = toast.info("Are you sure you want to delete this agent?", {
    timeout: 0, // Prevent auto-dismiss to allow user interaction
    closeOnClick: false,
    hideProgressBar: true,
    icon: "fas fa-info",
    position: "top-right",
    toastClassName: "custom-toast",
    bodyClassName: "custom-toast-body",
  });

  // Create custom buttons for confirm and cancel
  const confirmButton = document.createElement('button');
  confirmButton.innerText = "Yes";
  confirmButton.className = "confirm-btn";
  confirmButton.onclick = async () => {
    try {
      const response = await axios.delete(`/api/applications/${agentId}`);
      if (response.status === 200) {
        toast.success("Agent deleted successfully.");
        fetchAgents();  // Refetch agents after deletion
      } else {
        toast.error("Error deleting agent.");
      }
    } catch (error) {
      toast.error("Error deleting agent.");
    }
    toast.dismiss(deleteToast); // Dismiss the toast after action
  };

  const cancelButton = document.createElement('button');
  cancelButton.innerText = "No";
  cancelButton.className = "cancel-btn";
  cancelButton.onclick = () => {
    toast.info("Agent deletion cancelled.");
    toast.dismiss(deleteToast); // Dismiss the toast
  };

  // Append buttons to the toast
  const toastBody = document.querySelector('.custom-toast-body');
  if (toastBody) {
    toastBody.appendChild(confirmButton);
    toastBody.appendChild(cancelButton);
  }
}

  
  function handleError(error) {
    toast.error("An error occurred. Please try again.");
  }
  
  // Export filtered data to Excel
  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(agent => ({
      'Full Name': agent.full_name,
      'Phone': agent.phone_number,
      'Email': agent.email,
      'Address': agent.address,
      'Country': agent.country,
      'Region': agent.region,
      'District': agent.district,
      'Agent Number': agent.agent_number,
      'Status': agent.is_confirmed,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agents');
    XLSX.writeFile(workbook, 'Agents.xlsx');
  }
  
  // Export filtered data to PDF
  function exportToPDF() {
    const doc = new jsPDF();
    const title = "Agent Data";
    const headers = [['No', 'Full Name', 'Phone', 'Email', 'Address', 'Country', 'Region', 'District', 'Agent Number', 'Status']];
    const data = filteredData.value.map((agent, index) => [
      index + 1,
      agent.full_name,
      agent.phone_number,
      agent.email,
      agent.address,
      agent.country,
      agent.region,
      agent.district,
      agent.agent_number,
      agent.is_confirmed
    ]);
  
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(12);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30
    });
  
    doc.save('Agents.pdf');
  }
  </script>
  
  <style>
  .confirm-btn {
    background-color: green;
    color: white;
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: red;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
  }
  </style>
  