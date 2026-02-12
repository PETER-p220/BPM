<template>
  <div class="min-h-screen py-8 bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <!-- Card -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div
          class="px-6 py-5 flex items-center justify-between text-white"
          style="background: linear-gradient(135deg, #1e3a8a 0%, #283747 100%);"
        >
          <div class="flex items-center gap-3">
            <i class="fas fa-plus-circle text-xl"></i>
            <h2 class="text-xl font-semibold">Create Extension Request</h2>
          </div>
          <button
            @click="closeModal"
            class="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 sm:p-8">
          <form @submit.prevent="createExtensionRequest" class="space-y-6">
            <!-- Project Selection -->
            <div>
              <label for="projectSelect" class="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                id="projectSelect"
                v-model="requestData.project_id"
                @change="fetchAnalysisItems"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
                :class="{ 'text-gray-400': !requestData.project_id }"
              >
                <option value="" disabled>Select a project</option>
                <option v-for="project in projects" :key="project.project_id" :value="project.project_id">
                  {{ project.project_name }}
                </option>
              </select>
            </div>

            <!-- Analysis Item Selection -->
            <div>
              <label for="analysisSelect" class="block text-sm font-medium text-gray-700 mb-1">
                Analysis Item
              </label>
              <select
                id="analysisSelect"
                v-model="requestData.analysis_id"
                :disabled="!requestData.project_id"
                @change="onAnalysisSelected"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Select an analysis item</option>
                <option
                  v-for="analysis in analysisItems"
                  :key="analysis.analysis_id"
                  :value="analysis.analysis_id"
                >
                  {{ analysis.items?.[0] || analysis.item_description || 'N/A' }}
                  (Qty: {{ analysis.quantity || 0 }} • Amt: {{ analysis.amount || 0 }})
                </option>
              </select>

              <div v-if="selectedAnalysis" class="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div>
                  <span class="font-medium">Available Quantity:</span>
                  <span class="ml-1">{{ selectedAnalysis.quantity || 0 }}</span>
                </div>
                <div>
                  <span class="font-medium">Available Amount:</span>
                  <span class="ml-1">{{ selectedAnalysis.amount || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Quantity Extended -->
            <div>
              <label for="quantityExtended" class="block text-sm font-medium text-gray-700 mb-1">
                Quantity Extended
              </label>
              <input
                type="number"
                id="quantityExtended"
                v-model.number="requestData.quantity_extended"
                min="1"
                placeholder="Enter quantity to extend"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>

            <!-- Amount Extended -->
            <div>
              <label for="amountExtended" class="block text-sm font-medium text-gray-700 mb-1">
                Amount Extended
              </label>
              <input
                type="number"
                id="amountExtended"
                v-model.number="requestData.amount_extended"
                min="0"
                step="0.01"
                placeholder="e.g. 4000.00"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>

            <!-- Reason -->
            <div>
              <label for="reasonForExtend" class="block text-sm font-medium text-gray-700 mb-1">
                Reason for Extension
              </label>
              <textarea
                id="reasonForExtend"
                v-model="requestData.reason_for_extend"
                rows="4"
                placeholder="Please explain the reason for this extension request..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm resize-y"
              ></textarea>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                :disabled="isLoading || !formIsValid"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#283747] text-white font-medium rounded-lg hover:bg-[#1e2e5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                <span>{{ isLoading ? 'Submitting...' : 'Submit Request' }}</span>
              </button>

              <router-link
                to="/user/extentions-for-project"
                class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
              >
                <i class="fas fa-times"></i>
                Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const requestData = ref({
  project_id: '',
  analysis_id: '',
  quantity_extended: null,
  amount_extended: null,
  reason_for_extend: '',
});

const projects = ref([]);
const analysisItems = ref([]);
const selectedAnalysis = ref(null);
const isLoading = ref(false);

const formIsValid = computed(() => {
  return (
    requestData.value.project_id &&
    requestData.value.analysis_id &&
    requestData.value.quantity_extended >= 1 &&
    requestData.value.amount_extended >= 0 &&
    requestData.value.reason_for_extend?.trim()
  );
});

onMounted(() => {
  fetchProjects();
});

async function fetchProjects() {
  try {
    const res = await axios.get('/api/dropdown/projects');
    if (res.data.status && Array.isArray(res.data.data)) {
      projects.value = res.data.data;
    }
  } catch (err) {
    handleError(err);
  }
}

async function fetchAnalysisItems() {
  analysisItems.value = [];
  requestData.value.analysis_id = '';
  selectedAnalysis.value = null;

  if (!requestData.value.project_id) return;

  try {
    const res = await axios.get('/api/items-dropdown', {
      params: { project_id: requestData.value.project_id },
    });
    if (res.data.status === 200) {
      analysisItems.value = res.data.data;
    }
  } catch (err) {
    handleError(err);
  }
}

function onAnalysisSelected() {
  selectedAnalysis.value = analysisItems.value.find(
    (item) => item.analysis_id === requestData.value.analysis_id
  ) || null;

  if (selectedAnalysis.value && (!selectedAnalysis.value.quantity || !selectedAnalysis.value.amount)) {
    toast.warning('This analysis item has no quantity or amount values set.');
  }
}

async function createExtensionRequest() {
  if (!formIsValid.value) {
    toast.error('Please complete all required fields correctly.');
    return;
  }

  isLoading.value = true;

  const payload = { ...requestData.value };

  try {
    const res = await axios.post('/api/extend-request', payload);

    if (res.data.status) {
      toast.success(res.data.message || 'Extension request created successfully');
      router.push('/user/extentions-for-project');
    } else {
      toast.error(res.data.message || 'Failed to create request');
    }
  } catch (err) {
    handleError(err);
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  let message = 'An error occurred. Please try again.';
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.data?.errors) {
    message = Object.values(error.response.data.errors).flat().join(' • ');
  }
  toast.error(message);
}

function closeModal() {
  router.push('/user/requests');
}
</script>

<style scoped>
/* Optional: Add subtle focus ring improvements */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
</style>