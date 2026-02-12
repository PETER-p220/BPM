<template>
  <div class="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Card Container -->
    <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <!-- Header -->
      <div class="px-6 py-5 bg-slate-800 text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-xl font-semibold">Create Security Declaration</h2>
        </div>

        <button
          @click="closeModal"
          class="p-2 rounded-full hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 md:p-8">
        <form @submit.prevent="createSecurityDeclaration" class="space-y-8">
          <!-- Tender Selection -->
          <div>
            <label for="tenderSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Tender <span class="text-red-500">*</span>
            </label>
            <select
              id="tenderSelect"
              v-model="securityDeclarationData.tender_id"
              required
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-gray-900 dark:text-white"
            >
              <option value="" disabled>Select a tender</option>
              <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                {{ tender.title }}
              </option>
            </select>
          </div>

          <!-- File Upload -->
          <div>
            <label for="declarationFile" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Declaration Document (PDF) <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-slate-500 transition">
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    for="declarationFile"
                    class="relative cursor-pointer rounded-md font-medium text-slate-600 dark:text-slate-400 hover:text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2"
                  >
                    <span>Upload a PDF file</span>
                    <input
                      id="declarationFile"
                      name="declarationFile"
                      type="file"
                      class="sr-only"
                      accept="application/pdf"
                      @change="handleFileUpload"
                      required
                    />
                  </label>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PDF up to 10MB
                </p>

                <!-- Selected file name -->
                <p v-if="securityDeclarationData.declaration_file" class="mt-2 text-sm text-green-600 dark:text-green-400">
                  Selected: {{ securityDeclarationData.declaration_file.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Receiver Email (Optional) -->
          <div>
            <label for="receiverEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receiver Email (Optional)
            </label>
            <input
              type="email"
              id="receiverEmail"
              v-model="securityDeclarationData.receiver_email"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter receiver email (optional)"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              type="submit"
              :disabled="isLoading || !securityDeclarationData.tender_id || !securityDeclarationData.declaration_file"
              class="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <span v-if="isLoading">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Security Declaration
              </span>
            </button>

            <router-link
              to="/security-declaration"
              class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </router-link>
          </div>
        </form>
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

const securityDeclarationData = ref({
  tender_id: '',
  declaration_file: null,
  receiver_email: '',
})

const tenders = ref([])
const isLoading = ref(false)

// Fetch tenders on mount
onMounted(async () => {
  await fetchTenders()
})

async function fetchTenders() {
  try {
    const response = await axios.get('api/dropdown/tender')
    tenders.value = response.data.data || []
  } catch (error) {
    toast.error('Failed to load tenders')
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.type === 'application/pdf') {
      securityDeclarationData.value.declaration_file = file
      toast.success(`Selected: ${file.name}`)
    } else {
      toast.error('Only PDF files are allowed')
      event.target.value = '' // clear invalid file
    }
  }
}

async function createSecurityDeclaration() {
  if (!securityDeclarationData.value.tender_id || !securityDeclarationData.value.declaration_file) {
    toast.error('Please select a tender and upload a PDF file')
    return
  }

  // Optional email validation
  if (
    securityDeclarationData.value.receiver_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(securityDeclarationData.value.receiver_email)
  ) {
    toast.error('Please enter a valid email address')
    return
  }

  isLoading.value = true

  const formData = new FormData()
  formData.append('tender_id', securityDeclarationData.value.tender_id)
  formData.append('declaration_file', securityDeclarationData.value.declaration_file)
  if (securityDeclarationData.value.receiver_email) {
    formData.append('receiver_email', securityDeclarationData.value.receiver_email)
  }

  try {
    const response = await axios.post('api/security-declaration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.status) {
      toast.success(response.data.message || 'Security Declaration created successfully')
      router.push('/security-declaration')
    } else {
      toast.error(response.data.message || 'Failed to create declaration')
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred while saving')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Optional subtle hover effect on card */
.shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>