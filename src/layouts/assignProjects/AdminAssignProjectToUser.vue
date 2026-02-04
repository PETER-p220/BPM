<template>
  <div class="min-h-screen py-8 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="container px-4 mx-auto max-w-6xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Assign Project</h1>
        <p class="mt-2 text-sm text-gray-600">Create and assign a new project to engineers and team members</p>
      </div>

      <!-- Validation Error Summary -->
      <div v-if="Object.keys(errors).length > 0" class="p-4 mb-6 border-l-4 border-red-500 rounded-lg bg-red-50">
        <div class="flex items-start gap-3">
          <i class="mt-1 text-red-500 fas fa-exclamation-circle"></i>
          <div class="flex-1">
            <h4 class="mb-2 text-sm font-bold text-red-900">Please fix the following errors:</h4>
            <ul class="space-y-1 text-sm text-red-700 list-disc list-inside">
              <li v-for="(errorList, field) in errors" :key="field">
                {{ errorList[0] }}
              </li>
            </ul>
          </div>
          <button @click="errors = {}" class="text-red-500 hover:text-red-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Main Card -->
      <div class="overflow-hidden bg-white shadow-sm rounded-lg">
        <!-- Card Header -->
        <div class="px-6 py-4 border-b border-gray-200" style="background-color: #283747;">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="text-white fa fa-project-diagram"></i>
              <h2 class="text-lg font-semibold text-white">Project Assignment Details</h2>
            </div>
            <router-link 
              to="/assigned-projects" 
              class="text-white transition-colors hover:text-gray-200"
              aria-label="Close"
            >
              <i class="fa fa-times"></i>
            </router-link>
          </div>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="storeProject" class="p-6">
          <!-- Project Information Section -->
          <div class="mb-8">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-info-circle text-blue-600"></i>
              Project Information
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <!-- Project Name -->
              <div>
                <label for="projectName" class="block mb-2 text-sm font-medium text-gray-700">
                  Project Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  v-model="projectData.project_name"
                  class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="errors.project_name ? 'border-red-500' : 'border-gray-300'"
                  placeholder="Enter project name"
                  required
                  :disabled="isLoading"
                />
                <p v-if="errors.project_name" class="mt-1 text-xs text-red-500">
                  {{ errors.project_name[0] }}
                </p>
              </div>

              <!-- Select Tender -->
              <div>
                <label for="tenderSelect" class="block mb-2 text-sm font-medium text-gray-700">
                  Tender <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="text-gray-400 fas fa-folder-open"></i>
                  </div>
                  <select
                    id="tenderSelect"
                    v-model="projectData.tender_id"
                    class="w-full pl-10 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    :class="errors.tender_id ? 'border-red-500' : 'border-gray-300'"
                    required
                    :disabled="isLoading || isLoadingTenders"
                  >
                    <option value="" disabled>Select a tender</option>
                    <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                      {{ tender.title }}
                    </option>
                  </select>
                </div>
                <p v-if="errors.tender_id" class="mt-1 text-xs text-red-500">
                  {{ errors.tender_id[0] }}
                </p>
                <p v-else class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingTenders"></i>
                  {{ isLoadingTenders ? 'Loading tenders...' : `${tenders.length} tenders available` }}
                </p>
              </div>

              <!-- Select Contract -->
              <div>
                <label for="contractSelect" class="block mb-2 text-sm font-medium text-gray-700">
                  Contract <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="text-gray-400 fas fa-file-contract"></i>
                  </div>
                  <select
                    id="contractSelect"
                    v-model="projectData.contract_id"
                    class="w-full pl-10 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    :class="errors.contract_id ? 'border-red-500' : 'border-gray-300'"
                    required
                    :disabled="isLoading || isLoadingContracts"
                  >
                    <option value="" disabled>Select a contract</option>
                    <option v-for="contract in contracts" :key="contract.contract_id" :value="contract.contract_id">
                      {{ contract.title }}
                    </option>
                  </select>
                </div>
                <p v-if="errors.contract_id" class="mt-1 text-xs text-red-500">
                  {{ errors.contract_id[0] }}
                </p>
                <p v-else class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingContracts"></i>
                  {{ isLoadingContracts ? 'Loading contracts...' : `${contracts.length} contracts available` }}
                </p>
              </div>
            </div>
          </div>

          <!-- Team Assignment Section -->
          <div class="mb-8">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-users text-green-600"></i>
              Team Assignment
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Select Engineer (Lead) -->
              <div>
                <label for="engineerSelect" class="block mb-2 text-sm font-medium text-gray-700">
                  Lead Engineer <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="text-gray-400 fas fa-user-tie"></i>
                  </div>
                  <select
                    id="engineerSelect"
                    v-model="projectData.user_id"
                    class="w-full pl-10 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    :class="errors.user_id ? 'border-red-500' : 'border-gray-300'"
                    required
                    :disabled="isLoading || isLoadingEngineers"
                  >
                    <option value="" disabled>Select lead engineer</option>
                    <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
                <p v-if="errors.user_id" class="mt-1 text-xs text-red-500">
                  {{ errors.user_id[0] }}
                </p>
                <p v-else class="mt-1 text-xs text-gray-500">
                  <i class="fas fa-spinner fa-spin" v-if="isLoadingEngineers"></i>
                  {{ isLoadingEngineers ? 'Loading engineers...' : 'Primary engineer responsible for the project' }}
                </p>
              </div>

              <!-- Add Team Members -->
              <div>
                <label for="memberSelect" class="block mb-2 text-sm font-medium text-gray-700">
                  Add Team Members <span class="text-gray-400">(Optional)</span>
                </label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <i class="text-gray-400 fas fa-user-plus"></i>
                    </div>
                    <select
                      id="memberSelect"
                      v-model="selectedMember"
                      class="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :disabled="isLoading || isLoadingEngineers"
                    >
                      <option value="" disabled>Select a member</option>
                      <option 
                        v-for="user in availableMembers" 
                        :key="user.user_id" 
                        :value="user.user_id"
                      >
                        {{ user.name }}
                      </option>
                    </select>
                  </div>
                  <button
                    type="button"
                    @click="addMember"
                    class="px-4 py-2.5 text-white rounded-lg transition-colors hover:opacity-90"
                    style="background-color: #283747;"
                    :disabled="!selectedMember || isLoading"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <p v-if="errors.member_id" class="mt-1 text-xs text-red-500">
                  {{ errors.member_id[0] }}
                </p>
                <p v-else class="mt-1 text-xs text-gray-500">
                  {{ projectData.member_id.length }} member(s) added
                </p>
              </div>
            </div>

            <!-- Selected Members List -->
            <div v-if="projectData.member_id.length > 0" class="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 class="mb-3 text-sm font-semibold text-gray-900">
                <i class="mr-2 fas fa-users"></i>
                Team Members ({{ projectData.member_id.length }})
              </h4>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="member in projectData.member_id"
                  :key="member"
                  class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-green-500 to-green-600">
                      {{ getInitials(getMemberName(member)) }}
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ getMemberName(member) }}</span>
                  </div>
                  <button
                    type="button"
                    @click="removeMember(member)"
                    class="p-1.5 text-red-600 transition-colors rounded hover:bg-red-50"
                    :disabled="isLoading"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Section -->
          <div class="mb-8">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-calendar-alt text-purple-600"></i>
              Project Timeline
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Start Date -->
              <div>
                <label for="startDate" class="block mb-2 text-sm font-medium text-gray-700">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  v-model="projectData.start_date"
                  class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="errors.start_date ? 'border-red-500' : 'border-gray-300'"
                  required
                  :disabled="isLoading"
                />
                <p v-if="errors.start_date" class="mt-1 text-xs text-red-500">
                  {{ errors.start_date[0] }}
                </p>
              </div>

              <!-- End Date -->
              <div>
                <label for="endDate" class="block mb-2 text-sm font-medium text-gray-700">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  v-model="projectData.end_date"
                  :min="projectData.start_date"
                  class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="errors.end_date ? 'border-red-500' : 'border-gray-300'"
                  required
                  :disabled="isLoading"
                />
                <p v-if="errors.end_date" class="mt-1 text-xs text-red-500">
                  {{ errors.end_date[0] }}
                </p>
                <p v-else-if="projectDuration" class="mt-1 text-xs text-gray-500">
                  Duration: {{ projectDuration }}
                </p>
              </div>
            </div>
          </div>

          <!-- Assignment Information Section -->
          <div class="mb-6">
            <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
              <i class="fas fa-signature text-orange-600"></i>
              Assignment Information
            </h3>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Assigned By -->
              <div>
                <label for="created_by" class="block mb-2 text-sm font-medium text-gray-700">
                  Assigned By <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="created_by"
                  v-model="projectData.created_by"
                  class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="errors.created_by ? 'border-red-500' : 'border-gray-300'"
                  placeholder="Name of person assigning the project"
                  required
                  :disabled="isLoading"
                />
                <p v-if="errors.created_by" class="mt-1 text-xs text-red-500">
                  {{ errors.created_by[0] }}
                </p>
              </div>
            </div>
          </div>

          <!-- Project Summary Preview -->
          <div class="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex items-start gap-3">
              <i class="mt-1 text-blue-600 fas fa-info-circle"></i>
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-blue-900">Project Assignment Summary</h4>
                <div class="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p class="text-xs font-medium text-blue-700">Project Name</p>
                    <p class="mt-1 text-sm text-blue-900">{{ projectData.project_name || 'Not specified' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Lead Engineer</p>
                    <p class="mt-1 text-sm text-blue-900">{{ getEngineerName(projectData.user_id) || 'Not selected' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Team Size</p>
                    <p class="mt-1 text-sm text-blue-900">{{ projectData.member_id.length + 1 }} person(s)</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Tender</p>
                    <p class="mt-1 text-sm text-blue-900">{{ getTenderTitle(projectData.tender_id) || 'Not selected' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Contract</p>
                    <p class="mt-1 text-sm text-blue-900">{{ getContractTitle(projectData.contract_id) || 'Not selected' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Timeline</p>
                    <p class="mt-1 text-sm text-blue-900">{{ projectDuration || 'Not specified' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
            <router-link 
              to="/assigned-projects" 
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <i class="fa fa-times"></i>
              Cancel
            </router-link>
            
            <button 
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: #283747;"
              :class="{ 'hover:opacity-90': !isLoading && isFormValid }"
            >
              <i v-if="!isLoading" class="fa fa-project-diagram"></i>
              <i v-else class="fa fa-spinner fa-spin"></i>
              {{ isLoading ? 'Assigning Project...' : 'Assign Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

const errors = ref({});
const projectData = ref({
  project_name: '',
  tender_id: '',
  user_id: '',
  contract_id: '',
  member_id: [],
  created_by: '',
  start_date: '',
  end_date: '',
});

const tenders = ref([]);
const contracts = ref([]);
const engineers = ref([]);
const selectedMember = ref('');
const isLoading = ref(false);
const isLoadingTenders = ref(false);
const isLoadingContracts = ref(false);
const isLoadingEngineers = ref(false);

// Computed Properties
const isFormValid = computed(() => {
  return projectData.value.project_name.trim() &&
         projectData.value.tender_id &&
         projectData.value.user_id &&
         projectData.value.contract_id &&
         projectData.value.created_by.trim() &&
         projectData.value.start_date &&
         projectData.value.end_date;
});

const availableMembers = computed(() => {
  return engineers.value.filter(eng => 
    eng.user_id !== projectData.value.user_id && 
    !projectData.value.member_id.includes(eng.user_id)
  );
});

const projectDuration = computed(() => {
  if (!projectData.value.start_date || !projectData.value.end_date) return '';
  
  const start = new Date(projectData.value.start_date);
  const end = new Date(projectData.value.end_date);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Same day';
  if (diffDays === 1) return '1 day';
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s)`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month(s)`;
  return `${Math.floor(diffDays / 365)} year(s)`;
});

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchTenders(), fetchContracts(), fetchEngineers()]);
});

async function fetchTenders() {
  isLoadingTenders.value = true;
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data || [];
  } catch (error) {
    handleError(error, 'Failed to load tenders');
  } finally {
    isLoadingTenders.value = false;
  }
}

async function fetchContracts() {
  isLoadingContracts.value = true;
  try {
    const response = await axios.get('api/c-dropdown');
    contracts.value = response.data.data || [];
  } catch (error) {
    handleError(error, 'Failed to load contracts');
  } finally {
    isLoadingContracts.value = false;
  }
}

async function fetchEngineers() {
  isLoadingEngineers.value = true;
  try {
    const response = await axios.get('api/dropdown/engineer');
    engineers.value = response.data.users || [];
  } catch (error) {
    handleError(error, 'Failed to load engineers');
  } finally {
    isLoadingEngineers.value = false;
  }
}

// Helper Functions
function getInitials(name) {
  if (!name || name === 'Unknown') return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getMemberName(memberId) {
  const member = engineers.value.find(user => user.user_id === memberId);
  return member ? member.name : 'Unknown';
}

function getEngineerName(userId) {
  if (!userId) return null;
  const engineer = engineers.value.find(e => e.user_id === userId);
  return engineer ? engineer.name : null;
}

function getTenderTitle(tenderId) {
  if (!tenderId) return null;
  const tender = tenders.value.find(t => t.tender_id === tenderId);
  return tender ? tender.title : null;
}

function getContractTitle(contractId) {
  if (!contractId) return null;
  const contract = contracts.value.find(c => c.contract_id === contractId);
  return contract ? contract.title : null;
}

// Member Management
function addMember() {
  if (!selectedMember.value) {
    toast.error('Please select a member to add.');
    return;
  }

  if (selectedMember.value === projectData.value.user_id) {
    toast.error('Lead engineer is already assigned to the project.');
    return;
  }

  if (projectData.value.member_id.includes(selectedMember.value)) {
    toast.error('This member is already added to the team.');
    return;
  }

  projectData.value.member_id.push(selectedMember.value);
  toast.success(`${getMemberName(selectedMember.value)} added to the team`);
  selectedMember.value = '';
}

function removeMember(memberId) {
  projectData.value.member_id = projectData.value.member_id.filter(id => id !== memberId);
  toast.info('Member removed from team');
}

// Form Submission
async function storeProject() {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  errors.value = {};

  try {
    const formData = new FormData();
    
    formData.append('project_name', projectData.value.project_name.trim());
    formData.append('tender_id', projectData.value.tender_id);
    formData.append('user_id', projectData.value.user_id);
    formData.append('contract_id', projectData.value.contract_id);
    formData.append('created_by', projectData.value.created_by.trim());
    formData.append('start_date', projectData.value.start_date);
    formData.append('end_date', projectData.value.end_date);

    // Append member_id as array
    projectData.value.member_id.forEach(id => {
      formData.append('member_id[]', id);
    });

    const response = await axios.post('api/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success(response.data.message || 'Project assigned successfully!');
    
    setTimeout(() => {
      router.push('/assigned-projects');
    }, 1000);

  } catch (error) {
    if (error.response?.status === 400 && error.response.data.errors) {
      errors.value = error.response.data.errors;
      toast.error('Please fix the validation errors');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleError(error);
    }
  } finally {
    isLoading.value = false;
  }
}

function validateForm() {
  // Validate dates
  if (projectData.value.start_date && projectData.value.end_date) {
    if (new Date(projectData.value.end_date) < new Date(projectData.value.start_date)) {
      toast.error('End date must be after start date');
      return false;
    }
  }

  return true;
}

function handleError(error, defaultMessage = 'An unexpected error occurred') {
  const message = error.response?.data?.message || error.message || defaultMessage;
  toast.error(message);
  console.error('Error:', error);
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Smooth transitions */
input, select, button {
  transition: all 0.2s ease-in-out;
}

/* Focus states */
input:focus, select:focus {
  outline: none;
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: slideIn 0.3s ease-out;
}
</style>