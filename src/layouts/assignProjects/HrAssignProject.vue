<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <!-- Card -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <!-- Header -->
        <div class="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <h2 class="text-lg font-semibold">Assign New Project</h2>
          </div>
          <button 
            @click="closeModal" 
            class="rounded-full p-1.5 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 lg:p-8">
          <!-- Error Summary -->
          <div 
            v-if="Object.keys(errors).length" 
            class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
          >
            <h4 class="mb-2 text-sm font-semibold text-red-800 dark:text-red-300">
              Please correct the following errors:
            </h4>
            <ul class="ml-5 list-disc space-y-1 text-sm text-red-700 dark:text-red-400">
              <li v-for="(errorList, field) in errors" :key="field">
                {{ errorList[0] }}
              </li>
            </ul>
          </div>

          <form @submit.prevent="storeProject" class="space-y-6">
            <!-- Row 1: Project Name, Tender, Contract -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label for="projectName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="projectName"
                  v-model="projectData.project_name"
                  type="text"
                  class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-teal-500 sm:text-sm"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.project_name }"
                  placeholder="Enter project name"
                />
                <p v-if="errors.project_name" class="mt-1 text-xs text-red-600 dark:text-red-400">
                  {{ errors.project_name[0] }}
                </p>
              </div>

              <div>
                <label for="tenderSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tender <span class="text-red-500">*</span>
                </label>
                <select
                  id="tenderSelect"
                  v-model="projectData.tender_id"
                  class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.tender_id }"
                >
                  <option value="" disabled>Select tender</option>
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                    {{ tender.title }}
                  </option>
                </select>
                <p v-if="errors.tender_id" class="mt-1 text-xs text-red-600 dark:text-red-400">
                  {{ errors.tender_id[0] }}
                </p>
              </div>

              <div>
                <label for="contractSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contract <span class="text-red-500">*</span>
                </label>
                <select
                  id="contractSelect"
                  v-model="projectData.contract_id"
                  class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.contract_id }"
                >
                  <option value="" disabled>Select contract</option>
                  <option v-for="contract in contracts" :key="contract.contract_id" :value="contract.contract_id">
                    {{ contract.title }}
                  </option>
                </select>
                <p v-if="errors.contract_id" class="mt-1 text-xs text-red-600 dark:text-red-400">
                  {{ errors.contract_id[0] }}
                </p>
              </div>
            </div>

            <!-- Row 2: Engineer, Members, Dates -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label for="engineerSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Engineer <span class="text-red-500">*</span>
                </label>
                <select
                  id="engineerSelect"
                  v-model="projectData.user_id"
                  class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.user_id }"
                >
                  <option value="" disabled>Select engineer</option>
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                    {{ user.name }}
                  </option>
                </select>
                <p v-if="errors.user_id" class="mt-1 text-xs text-red-600 dark:text-red-400">
                  {{ errors.user_id[0] }}
                </p>
              </div>

              <div class="sm:col-span-2 lg:col-span-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Members
                </label>
                <div class="mt-1 flex flex-col gap-2">
                  <div class="flex gap-2">
                    <select
                      v-model="selectedMember"
                      class="block flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                    >
                      <option value="" disabled>Add team member</option>
                      <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                        {{ user.name }}
                      </option>
                    </select>
                    <button
                      type="button"
                      @click="addMember"
                      class="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-50"
                      :disabled="!selectedMember"
                    >
                      Add
                    </button>
                  </div>

                  <div v-if="projectData.member_id.length" class="mt-2 space-y-1.5">
                    <div
                      v-for="memberId in projectData.member_id"
                      :key="memberId"
                      class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <span class="text-gray-900 dark:text-gray-100">{{ getMemberName(memberId) }}</span>
                      <button
                        type="button"
                        @click="removeMember(memberId)"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p v-if="errors.member_id" class="mt-1 text-xs text-red-600 dark:text-red-400">
                    {{ errors.member_id[0] }}
                  </p>
                </div>
              </div>

              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="startDate"
                  v-model="projectData.start_date"
                  type="date"
                  class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.start_date }"
                />
                <p v-if="errors.start_date" class="mt-1 text-xs text-red-600 dark:text-red-400">
                  {{ errors.start_date[0] }}
                </p>
              </div>

              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="endDate"
                  v-model="projectData.end_date"
                  type="date"
                  class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.end_date }"
                />
                <p v-if="errors.end_date" class="mt-1 text-xs text-red-600 dark:text-red-400">
                  {{ errors.end_date[0] }}
                </p>
              </div>
            </div>

            <!-- Assigned By -->
            <div>
              <label for="created_by" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assigned By <span class="text-red-500">*</span>
              </label>
              <input
                id="created_by"
                v-model="projectData.created_by"
                type="text"
                class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.created_by }"
                placeholder="Your name or ID"
              />
              <p v-if="errors.created_by" class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.created_by[0] }}
              </p>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                @click="closeModal"
                class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isLoading"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="isLoading" class="flex items-center gap-2">
                  <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"/>
                  </svg>
                  Saving...
                </span>
                <span v-else>
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Save Project
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const errors = ref({})
const isLoading = ref(false)
const selectedMember = ref('')

const projectData = ref({
  project_name: '',
  tender_id: '',
  user_id: '',
  contract_id: '',
  member_id: [],
  created_by: '',
  start_date: '',
  end_date: '',
})

const tenders = ref([])
const contracts = ref([])
const engineers = ref([])

onMounted(async () => {
  await Promise.all([
    fetchTenders(),
    fetchContracts(),
    fetchEngineers(),
  ])
})

async function fetchTenders() {
  try {
    const res = await axios.get('api/dropdown/tender')
    tenders.value = res.data.data || []
  } catch (err) {
    handleError(err)
  }
}

async function fetchContracts() {
  try {
    const res = await axios.get('api/c-dropdown')
    contracts.value = res.data.data || []
  } catch (err) {
    handleError(err)
  }
}

async function fetchEngineers() {
  try {
    const res = await axios.get('api/dropdown/engineer')
    engineers.value = res.data.users || []
  } catch (err) {
    handleError(err)
  }
}

function addMember() {
  if (!selectedMember.value) return

  if (projectData.value.member_id.includes(selectedMember.value)) {
    toast.warning('Member already added')
    return
  }

  projectData.value.member_id.push(selectedMember.value)
  selectedMember.value = ''
}

function removeMember(memberId) {
  projectData.value.member_id = projectData.value.member_id.filter(id => id !== memberId)
}

function getMemberName(id) {
  const member = engineers.value.find(u => u.user_id === id)
  return member ? member.name : 'Unknown'
}

async function storeProject() {
  isLoading.value = true
  errors.value = {}

  try {
    const formData = new FormData()
    formData.append('project_name', projectData.value.project_name)
    formData.append('tender_id', projectData.value.tender_id)
    formData.append('user_id', projectData.value.user_id)
    formData.append('contract_id', projectData.value.contract_id)
    formData.append('created_by', projectData.value.created_by)
    formData.append('start_date', projectData.value.start_date)
    formData.append('end_date', projectData.value.end_date)

    projectData.value.member_id.forEach(id => {
      formData.append('member_id[]', id)
    })

    const response = await axios.post('api/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.success(response.data.message || 'Project created successfully')
    router.push('/manage/projects')
  } catch (error) {
    if (error.response?.status === 422 && error.response.data.errors) {
      errors.value = error.response.data.errors
      toast.warning('Please check the form for errors')
    } else {
      handleError(error)
    }
  } finally {
    isLoading.value = false
  }
}

function handleError(error) {
  const msg = error.response?.data?.message || error.message || 'Something went wrong'
  toast.error(msg)
}

function closeModal() {
  router.push('/manage/projects') // or emit close event if it's a modal
}
</script>