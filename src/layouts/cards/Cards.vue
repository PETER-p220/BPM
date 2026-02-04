<template>
  <div class="p-4 space-y-4" style="font-family: 'Euclid Circular', sans-serif;">
    <PageHeader title="Table" subtitle="Cards">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/add-card">
          <BaseButton @click="addNewCard" style="background-color: #2e4053;" class="w-full sm:w-auto">
            Add New Card
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
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Card Type</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Agent</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">ClientName</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Quantity</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Amount</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(card, index) in filteredCards" :key="card.card_id">
            <td class="table-data">{{ index + 1 }}</td>
            <td class="table-data">{{ card.card_type }}</td>
            <td class="table-data">{{ card.application ? card.application.full_name : 'N/A' }}</td>
            <td class="table-data">{{ card.order ? card.order.full_name : 'N/A' }}</td>
            <td class="table-data">{{ card.quantity }}</td>
            <td class="table-data">{{ card.amount }}</td>
            <td class="table-data">
              <p
                class="text-center btn"
                :style="{ backgroundColor: card.status === 'created' ? '#1b4f72' : '#a93226', color: 'white' }"
              >
                {{ card.status }}
              </p>
            </td>
            <td class="table-data">
              <i @click="editCard(card.card_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
              <i @click="deleteCard(card.card_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
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

const router = useRouter();
const toast = useToast();

const cards = ref([]);
const filter = ref('');

onMounted(async () => {
  await fetchCards();
});

async function fetchCards() {
  try {
    const response = await axios.get('/api/cards');
    cards.value = response.data.cards;
  } catch (error) {
    handleError(error);
  }
}

const filteredCards = computed(() => {
  return cards.value.filter(card =>
    card.card_type.toLowerCase().includes(filter.value.toLowerCase()) ||
    (card.agent && card.agent.full_name.toLowerCase().includes(filter.value.toLowerCase())) ||
    (card.application && card.application.full_name.toLowerCase().includes(filter.value.toLowerCase())) ||
    card.quantity.toString().includes(filter.value) ||
    card.amount.toString().includes(filter.value) ||
    card.status.toLowerCase().includes(filter.value.toLowerCase())
  );
});

function editCard(cardId) {
  router.push({ name: 'EditCard', params: { card_id: cardId } });
}

async function deleteCard(cardId) {
  try {
    await axios.delete(`/api/cards/${cardId}`);
    cards.value = cards.value.filter(card => card.card_id !== cardId);
    toast.success("Card deleted successfully.");
  } catch (error) {
    handleError(error);
  }
}

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
