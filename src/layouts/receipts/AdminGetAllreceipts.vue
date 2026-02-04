<template>
    <div class="p-4 space-y-4" style="font-family: 'cygre', serif; font-size: 17px">
      <PageHeader  subtitle="Receipts">
        <div class="flex flex-col sm:flex-row sm:space-x-2">
          <router-link to="/admin/create-receipt">
            <BaseButton @click="addNewUser" style="background-color: #2e4053;" class="w-full sm:w-auto">
              Submit receipt
              <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
            </BaseButton>
          </router-link>
  
        </div>
      </PageHeader>
      
      <div class="flex items-center mb-4 space-x-4">
        <input
          type="text"
          v-model="filter"
          placeholder="Search receipts..."
          class="w-full p-2 border rounded sm:w-auto"
        />
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Submitted By</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Description</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Receipt File</th>
              <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
            <tr v-for="(receipt, index) in filteredReceipts" :key="receipt.receipt_id">
              <td class="table-data">{{ index + 1 }}</td>
              <td class="table-data">{{ receipt.user_name }}</td>
              <td class="table-data">{{ receipt.description }}</td>
              <td class="table-data">
                <button class="btn-block btn" @click="downloadFile(receipt.receipt_file, 'receipt.jpg')" style="font-weight: bold;color: teal;">
                  Download Receipt
                </button>
              </td>
              <td class="table-data">{{ receipt.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from '@/axios';
  import { saveAs } from 'file-saver';
  
  const receipts = ref([]);
  const filter = ref('');
  
  onMounted(async () => {
    await fetchReceipts();
  });
  
  async function fetchReceipts() {
    try {
      const response = await axios.get('api/receipts');
      receipts.value = response.data.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  function downloadFile(fileUrl, fileName) {
    saveAs(fileUrl, fileName);
  }
  
  const filteredReceipts = computed(() => {
    return receipts.value.filter(entry =>
      entry.user_name.toLowerCase().includes(filter.value.toLowerCase()) ||
      entry.is_approved.toLowerCase().includes(filter.value.toLowerCase()) ||
      entry.description.toLowerCase().includes(filter.value.toLowerCase()) ||
      entry.created_at.toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  </script>
  