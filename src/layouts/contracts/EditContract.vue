<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 edit-contract">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
          Edit Contract
        </h1>
        <router-link
          to="/contracts"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Back to Contracts
        </router-link>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Contract Information
          </h2>
        </div>

        <div class="p-6 lg:p-8">
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p class="text-gray-600">Loading contract details...</p>
          </div>

          <div v-else>
            <form @submit.prevent="updateContract" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Title -->
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    Contract Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    v-model="contractData.title"
                    type="text"
                    required
                    class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- Timeline Category -->
                <div>
                  <label for="timeLineCategory" class="block text-sm font-medium text-gray-700 mb-1">
                    Timeline Category
                  </label>
                  <input
                    id="timeLineCategory"
                    v-model="contractData.time_line_category"
                    type="text"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- Start Date -->
                <div>
                  <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    v-model="contractData.start_date"
                    type="date"
                    required
                    class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <!-- End Date -->
                <div>
                  <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    v-model="contractData.end_date"
                    type="date"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <!-- Status -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  v-model="contractData.status"
                  required
                  class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="on-progress">On Progress</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              <!-- Performance Guarantee -->
              <div>
                <label for="performanceGuarantee" class="block text-sm font-medium text-gray-700 mb-1">
                  Performance Guarantee
                </label>
                <input
                  id="performanceGuarantee"
                  v-model="contractData.performance_guarantee"
                  type="text"
                  class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <!-- PDF Upload -->
              <div>
                <label for="pdfFile" class="block text-sm font-medium text-gray-700 mb-1">
                  Upload New Contract PDF (optional – replaces current file)
                </label>
                <div class="mt-1 flex items-center gap-4">
                  <label
                    class="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose PDF file
                    <input
                      id="pdfFile"
                      type="file"
                      class="hidden"
                      accept=".pdf"
                      @change="handleFileUpload('pdf_file', $event)"
                    />
                  </label>

                  <div class="text-sm text-gray-600">
                    <span v-if="selectedFileName">
                      Selected: <strong>{{ selectedFileName }}</strong>
                    </span>
                    <span v-else-if="contractData.pdf_file && typeof contractData.pdf_file === 'string'">
                      Current: 
                      <a
                        :href="contractData.pdf_file"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View current PDF
                      </a>
                    </span>
                    <span v-else>No file selected</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  :disabled="isLoadingUpdate"
                  class="inline-flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-1 sm:flex-none"
                >
                  <svg v-if="isLoadingUpdate" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isLoadingUpdate ? 'Updating...' : 'Update Contract' }}</span>
                </button>

                <router-link
                  to="/contracts"
                  class="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex-1 sm:flex-none"
                >
                  Cancel
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const contractData = ref({
  title: '',
  time_line_category: '',
  start_date: '',
  end_date: '',
  status: '',
  performance_guarantee: '',
  pdf_file: null
})

const isLoading = ref(false)
const isLoadingUpdate = ref(false)
const selectedFileName = ref('')

onMounted(async () => {
  isLoading.value = true
  try {
    await fetchContractData()
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
})

async function fetchContractData() {
  try {
    const response = await axios.get(`api/contracts/${route.params.contract_id}`)
    const data = response.data.data || {}
    
    // Format dates for HTML date inputs (yyyy-MM-dd)
    contractData.value = {
      ...data,
      start_date: data.start_date ? data.start_date.split('T')[0] : '',
      end_date: data.end_date ? data.end_date.split('T')[0] : ''
    }
  } catch (error) {
    handleError(error)
  }
}

function handleFileUpload(key, event) {
  const file = event.target.files[0]
  if (file) {
    contractData.value[key] = file
    selectedFileName.value = file.name
  }
}

async function updateContract() {
  if (!contractData.value.title?.trim()) {
    toast.warning('Contract title is required')
    return
  }

  isLoadingUpdate.value = true

  try {
    console.log('Contract data before update:', contractData.value)
    
    const formData = new FormData()
    
    // Only send the fields that the backend expects
    const allowedFields = ['title', 'time_line_category', 'start_date', 'end_date', 'status', 'performance_guarantee']
    
    allowedFields.forEach(key => {
      if (contractData.value[key] !== null && contractData.value[key] !== undefined) {
        console.log(`Appending ${key}:`, contractData.value[key])
        formData.append(key, contractData.value[key])
      }
    })

    // Only append pdf_file if it's a File object (new upload)
    if (contractData.value.pdf_file instanceof File) {
      console.log('Appending new pdf_file:', contractData.value.pdf_file.name)
      formData.append('pdf_file', contractData.value.pdf_file)
    }

    console.log('FormData contents:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    console.log('Sending update request...')
    const response = await axios.put(`api/contracts/${route.params.contract_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    console.log('Update response:', response.data)
    toast.success(response.data.message || 'Contract updated successfully')
    router.push({ path: '/contracts', query: { refresh: Date.now() } })
  } catch (error) {
    console.error('Update error:', error.response?.data || error)
    handleError(error)
  } finally {
    isLoadingUpdate.value = false
  }
}

function handleError(error) {
  let message = 'An unexpected error occurred'
  if (error.response?.data?.message) {
    message = error.response.data.message
  } else if (error.request) {
    message = 'No response from server. Please check your connection.'
  } else {
    message = error.message
  }
  toast.error(message)
}
</script>

<style scoped>
/* You can keep font-family: 'cygre', sans-serif; in global CSS if desired */
.edit-contract {
  font-family: 'cygre', system-ui, sans-serif;
}
</style>