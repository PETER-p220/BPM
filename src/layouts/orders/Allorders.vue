<template>
    <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
      <PageHeader title="Orders Table" subtitle="Orders">
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
        <table class="w-full divide-y divide-x-0-gray-200 text-c rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
          <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Full Name</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Phone Number</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Email</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Address</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">EventName</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Total Cards Needed</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is-complete</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Is-confirmed</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(order, index) in filteredData" :key="order.order_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ order.full_name }}</td>
              <td class="table-data">{{ order.phone_number }}</td>
              <td class="table-data">{{ order.email }}</td>
              <td class="table-data">{{ order.address }}</td>
              <td class="table-data">{{ order.card_type }}</td>
              <td class="table-data">{{ order.total_cards_needed }}</td>
              <td class="table-data">{{ order.description }}</td>
              <td class="table-data">
                <p class="text-center btn" style="background-color:#1b4f72;color:white">
                  {{ order.is_complete }}
                </p>
              </td>
                <td class="table-data">
                <p class="text-center btn" style="background-color:#1b4f72;color:white">
                    {{ order.is_confirmed }}
                  </p>
              </td>
              <td class="table-data">
                <i @click="editOrder(order.order_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
                <i @click="deleteOrder(order.order_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
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
  
  const orders = ref([]);
  const filter = ref('');
  
  // Fetch orders when component is mounted
  onMounted(async () => {
    await fetchOrders();
  });
  
  // Function to fetch orders from API
  async function fetchOrders() {
    try {
      const response = await axios.get('api/orders');
      orders.value = response.data.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Computed property to filter orders based on input
  const filteredData = computed(() => {
    return orders.value.filter(order =>
      order.full_name.toLowerCase().includes(filter.value.toLowerCase()) ||
      order.email.toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  
  // Navigate to edit order page
  function editOrder(orderId) {
    router.push({ name: 'Editorder', params: { order_id: orderId } });
  }
  
  // Function to delete an order with toast confirmation
  async function deleteOrder(orderId) {
    const deleteToast = toast(
      "Are you sure you want to delete this order?",
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
        // Fixed API route to match 'api/orders/{order_id}'
        await axios.delete(`api/orders/${orderId}`);
        orders.value = orders.value.filter(order => order.order_id !== orderId);
        toast.success("Order deleted successfully.");
      } catch (error) {
        handleError(error);
      }
      toast.dismiss(deleteToast);
    };
  
    const cancelButton = document.createElement('button');
    cancelButton.innerText = "Cancel";
    cancelButton.className = "cancel-btn";
    cancelButton.onclick = () => {
      toast.info("Order deletion cancelled.");
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
    const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(order => ({
      FullName: order.full_name,
      PhoneNumber: order.phone_number,
      Email: order.email,
      Address: order.address,
      CardType: order.card_type,
      TotalCardsNeeded: order.total_cards_needed,
      Iscomplete: order.is_complete,
      Isconfirmed: order.is_recieved,
      Description: order.description
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'Orders.xlsx');
  }
  
  // Export filtered data to PDF
  function exportToPDF() {
    const doc = new jsPDF();
    const title = "Order Data";
    const headers = [['No', 'Full Name', 'Phone Number', 'Email', 'Address', 'Card Type', 'Total Cards Needed', 'Iscomplete','Isconfirmed','Description']];
    const data = filteredData.value.map((order, index) => [
      index + 1,
      order.full_name,
      order.phone_number,
      order.email,
      order.address,
      order.card_type,
      order.total_cards_needed,
      order.is_complete,
      order.is_recieved,
      order.description
    ]);
  
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(12);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30
    });
  
    doc.save('Orders.pdf');
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
  