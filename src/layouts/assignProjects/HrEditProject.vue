<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <!-- Card -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <!-- Header -->
        <div class="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h2 class="text-lg font-semibold">Edit Project</h2>
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

          <form @submit.prevent="updateProject" class="space-y-6">
            <!-- Contract Title (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Title
              </label>
              <input
                type="text"
                :value="projectData.contract.title"
                disabled
                class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 sm:text-sm cursor-not-allowed"
              />
            </div>

            <!-- Select Contract -->
            <div>
              <label for="contractSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Change Contract <span class="text-red-500">*</span>
              </label>
              <select
                id="contractSelect"
                v-model="projectData.contract_id"
                class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
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

            <!-- Project Status -->
            <div>
              <label for="projectStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Status <span class="text-red-500">*</span>
              </label>
              <select
                id="projectStatus"
                v-model="projectData.project_status"
                class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.project_status }"
              >
                <option value="" disabled>Select status</option>
                <option value="on-progress">On Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <p v-if="errors.project_status" class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.project_status[0] }}
              </p>
            </div>

            <!-- Follow Up -->
            <div>
              <label for="followUp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Follow Up
              </label>
              <select
                id="followUp"
                v-model="projectData.follow_up"
                class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.follow_up }"
              >
                <option value="">None</option>
                <option value="on-progress">On Progress</option>
                <option value="completed">Completed</option>
              </select>
              <p v-if="errors.follow_up" class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.follow_up[0] }}
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
                  Updating...
                </span>
                <span v-else>
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Update Project
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
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const projectData = ref({
  project_id: '',
  contract_id: '',
  contract: { title: '' },
  project_status: '',
  follow_up: ''
})

const contracts = ref([])
const errors = ref({})
const isLoading = ref(false)

onMounted(async () => {
  await Promise.all([fetchProjectData(), fetchContracts()])
})

async function fetchProjectData() {
  try {
    const { data } = await axios.get(`api/projects/${route.params.project_id}`)
    const p = data.data
    projectData.value = {
      project_id: p.project_id || '',
      contract_id: p.contract_id || '',
      contract: { title: p.contract?.title || 'N/A' },
      project_status: p.project_status || '',
      follow_up: p.follow_up || ''
    }
  } catch (err) {
    handleError(err)
  }
}

async function fetchContracts() {
  try {
    const { data } = await axios.get('api/c-dropdown')
    contracts.value = data.data || []
  } catch (err) {
    handleError(err)
  }
}

async function updateProject() {
  isLoading.value = true
  errors.value = {}

  try {
    const payload = {
      contract_id: projectData.value.contract_id,
      project_status: projectData.value.project_status,
      follow_up: projectData.value.follow_up || null
    }

    const response = await axios.put(`api/projects/${route.params.project_id}`, payload)

    toast.success(response.data.message || 'Project updated successfully')
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
  router.push('/manage/projects') // or '/adminview-assignedprojects' if needed
}
</script>