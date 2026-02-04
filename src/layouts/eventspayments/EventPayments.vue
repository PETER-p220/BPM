<template>
    <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
      <PageHeader title="Table" subtitle="Event Payments">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <router-link to="/add-eventpayment">
            <BaseButton @click="addNewPayment" style="background-color: #2e4053;" class="w-full sm:w-auto">
              Add New Payment
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
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Event Type</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Amount</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Ref Number</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Payment Status</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Payment Methods</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(payment, index) in filteredPayments" :key="payment.ref_number">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ payment.event_type }}</td>
              <td class="table-data">{{ payment.amount }}</td>
              <td class="table-data">{{ payment.ref_number }}</td>
              <td class="table-data">
                <p class="text-center btn" :style="{backgroundColor: payment.payment_status === 'completed' ? '#28a745' : payment.payment_status === 'failed' ? '#dc3545' : '#ffc107', color: 'white'}">
                  {{ payment.payment_status }}
                </p>
              </td>
              <td class="table-data">{{ payment.payment_methods }}</td>
              <td class="table-data">{{ formatDate(payment.created_at) }}</td>
              <td class="table-data">
                <i @click="editPayment(payment.pay_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
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
  
  const eventPayments = ref([]);
  const filter = ref('');
  
  // Fetch event payments when component is mounted
  onMounted(async () => {
    await fetchEventPayments();
  });
  
  // Function to fetch event payments from API
  async function fetchEventPayments() {
    try {
      const response = await axios.get('api/my-payments');
      eventPayments.value = response.data.map(payment => ({
        amount: payment.amount,
        ref_number: payment.ref_number,
        payment_status: payment.payment_status,
        payment_methods: payment.payment_methods,
        created_at: payment.created_at,
        event_type: payment.event.event_type, // Mapping event type from event object
        pay_id: payment.pay_id, // Make sure to include pay_id in the response
      }));
    } catch (error) {
      handleError(error);
    }
  }
  
  // Computed property to filter event payments based on input
  const filteredPayments = computed(() => {
    return eventPayments.value.filter(payment =>
      payment.event_type.toLowerCase().includes(filter.value.toLowerCase()) ||
      payment.payment_status.toLowerCase().includes(filter.value.toLowerCase()) ||
      payment.ref_number.toLowerCase().includes(filter.value.toLowerCase()) ||
      payment.payment_methods.toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  
  // Navigate to edit payment page with pay_id
  function editPayment(payId) {
    router.push({ name: 'EditEventPayment', params: { pay_id: payId } });
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
  
  // Helper function to format the date (created_at)
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  </script>
  
  <style scoped>
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
  