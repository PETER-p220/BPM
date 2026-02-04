<template>
  <div class="py-5 add-user" style="font-family: 'cygre', sans-serif; font-size: 17px">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #283747;">
          <div><i class="mr-2 fa fa-plus"></i> Assign Project</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="p-6 bg-white card-body">
          <h3 class="mb-4 text-lg font-semibold">Fill Form Below To Assign Project</h3>

          <!-- Validation Error Summary -->
          <div v-if="Object.keys(errors).length" class="p-4 mb-4 text-red-700 bg-red-100 rounded">
            <h4 class="mb-2 font-bold">Please fix the following errors:</h4>
            <ul class="pl-4 list-disc">
              <li v-for="(errorList, field) in errors" :key="field" class="mb-1">
                {{ errorList[0] }}
              </li>
            </ul>
          </div>

          <!-- First Row: Project Name, Tender, Contract -->
          <div class="row">
            <div class="col-sm-4">
              <label for="projectName" class="form-label">Project Name</label>
              <input type="text" id="projectName" class="w-full px-3 py-2 border rounded form-control" 
                     :class="{ 'border-red-500': errors.project_name }"
                     v-model="projectData.project_name" />
              <span v-if="errors.project_name" class="text-sm text-red-500">{{ errors.project_name[0] }}</span>
            </div>
            
            <div class="col-sm-4">
              <label for="tenderSelect" class="form-label">Select Tender</label>
              <select id="tenderSelect" class="w-full px-3 py-2 border rounded form-control" 
                      :class="{ 'border-red-500': errors.tender_id }"
                      v-model="projectData.tender_id">
                <option value="" disabled>Select a tender</option>
                <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                  {{ tender.title }}
                </option>
              </select>
              <span v-if="errors.tender_id" class="text-sm text-red-500">{{ errors.tender_id[0] }}</span>
            </div>

            <div class="col-sm-4">
              <label for="contractSelect" class="form-label">Select Contract</label>
              <select id="contractSelect" class="w-full px-3 py-2 border rounded form-control" 
                      :class="{ 'border-red-500': errors.contract_id }"
                      v-model="projectData.contract_id">
                <option value="" disabled>Select a contract</option>
                <option v-for="contract in contracts" :key="contract.contract_id" :value="contract.contract_id">
                  {{ contract.title }}
                </option>
              </select>
              <span v-if="errors.contract_id" class="text-sm text-red-500">{{ errors.contract_id[0] }}</span>
            </div>
          </div>

          <!-- Second Row: Engineer, Members, Dates -->
          <div class="mt-4 row">
            <div class="col-sm-4">
              <label for="engineerSelect" class="form-label">Select Engineer</label>
              <select id="engineerSelect" class="w-full px-3 py-2 border rounded form-control" 
                      :class="{ 'border-red-500': errors.user_id }"
                      v-model="projectData.user_id">
                <option value="" disabled>Select an engineer</option>
                <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                  {{ user.name }}
                </option>
              </select>
              <span v-if="errors.user_id" class="text-sm text-red-500">{{ errors.user_id[0] }}</span>
            </div>

            <div class="col-sm-4">
              <label for="memberSelect" class="form-label">Add Members</label>
              <select id="memberSelect" class="w-full px-3 py-2 border rounded form-control" 
                      :class="{ 'border-red-500': errors.member_id }"
                      v-model="selectedMember">
                <option value="" disabled>Select a member</option>
                <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                  {{ user.name }}
                </option>
              </select>
              <button @click="addMember" class="px-2 py-1 mt-2 text-white rounded" style="background-color: #283747;">
                Add
              </button>
              <ul class="mt-2">
                <li v-for="member in projectData.member_id" :key="member" 
                    class="flex items-center justify-between">
                  {{ getMemberName(member) }}
                  <button @click="removeMember(member)" class="text-red-500">
                    <i class="fa fa-trash"></i>
                  </button>
                </li>
              </ul>
              <span v-if="errors.member_id" class="text-sm text-red-500">{{ errors.member_id[0] }}</span>
            </div>

            <div class="col-sm-4">
              <label for="startDate" class="form-label">Start Date</label>
              <input type="date" id="startDate" class="w-full px-3 py-2 border rounded form-control" 
                     :class="{ 'border-red-500': errors.start_date }"
                     v-model="projectData.start_date" />
              <span v-if="errors.start_date" class="text-sm text-red-500">{{ errors.start_date[0] }}</span>
            </div>

            <div class="col-sm-4 mt-4">
              <label for="endDate" class="form-label">End Date</label>
              <input type="date" id="endDate" class="w-full px-3 py-2 border rounded form-control" 
                     :class="{ 'border-red-500': errors.end_date }"
                     v-model="projectData.end_date" />
              <span v-if="errors.end_date" class="text-sm text-red-500">{{ errors.end_date[0] }}</span>
            </div>
          </div>

          <!-- Created By -->
          <div class="mt-4 row">
            <div class="col-sm-6">
              <label for="created_by" class="form-label">Assigned By</label>
              <input type="text" id="created_by" class="w-full px-3 py-2 border rounded form-control" 
                     :class="{ 'border-red-500': errors.created_by }"
                     v-model="projectData.created_by" />
              <span v-if="errors.created_by" class="text-sm text-red-500">{{ errors.created_by[0] }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4">
            <button @click="storeProject" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700" 
                    style="background-color: #283747;" :disabled="isLoading">
              <i class="fa fa-plus"></i> Save changes
              <span v-if="isLoading" class="flex items-center gap-2">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
            </button>
            <router-link to="/manage/projects" 
                         class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              <i class="fa fa-times"></i> Cancel
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

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

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchTenders(), fetchContracts(), fetchEngineers()]);
});

async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender');
    tenders.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function fetchContracts() {
  try {
    const response = await axios.get('api/c-dropdown');
    contracts.value = response.data.data;
  } catch (error) {
    handleError(error);
  }
}

async function fetchEngineers() {
  try {
    const response = await axios.get('api/dropdown/engineer');
    engineers.value = response.data.users;
  } catch (error) {
    handleError(error);
  }
}

function addMember() {
  if (selectedMember.value && !projectData.value.member_id.includes(selectedMember.value)) {
    projectData.value.member_id.push(selectedMember.value);
    selectedMember.value = '';
  } else {
    toast.error('Please select a valid member or avoid duplicates.');
  }
}

function removeMember(memberId) {
  projectData.value.member_id = projectData.value.member_id.filter(id => id !== memberId);
}

function getMemberName(memberId) {
  const member = engineers.value.find(user => user.user_id === memberId);
  return member ? member.name : 'Unknown';
}

async function storeProject() {
  isLoading.value = true;
  errors.value = {}; // Reset errors

  try {
    const formData = new FormData();
    
    // Append all fields correctly
    formData.append('project_name', projectData.value.project_name);
    formData.append('tender_id', projectData.value.tender_id);
    formData.append('user_id', projectData.value.user_id);
    formData.append('contract_id', projectData.value.contract_id);
    formData.append('created_by', projectData.value.created_by);
    formData.append('start_date', projectData.value.start_date);
    formData.append('end_date', projectData.value.end_date);

    // Append member_id as array
    projectData.value.member_id.forEach(id => {
      formData.append('member_id[]', id);
    });

    const response = await axios.post('api/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success(response.data.message);
    router.push('/manage/projects');
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.errors) {
      // Handle validation errors
      errors.value = error.response.data.errors;
    } else {
      handleError(error);
    }
  } finally {
    isLoading.value = false;
  }
}

function handleError(error) {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  toast.error(message);
}
</script>