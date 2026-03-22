<template>
  <div class="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-950 min-h-screen">
    <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div class="px-6 py-5 bg-slate-700 text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h2 class="text-xl font-semibold">Submit Tender Response</h2>
            <p class="text-sm text-slate-200 mt-1">Upload the final bid document for a tender assigned to you</p>
          </div>
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

      <div class="p-6 md:p-8">
        <form @submit.prevent="submitTender" class="space-y-8">
          <div>
            <label for="tenderSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assigned Tender <span class="text-red-500">*</span>
            </label>
            <select
              id="tenderSelect"
              v-model="submissionData.tender_id"
              required
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-gray-900 dark:text-white"
            >
              <option value="" disabled>Select assigned tender</option>
              <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                {{ tender.title }} - {{ tender.tender_number || 'No Tender No.' }}
              </option>
            </select>
            <p v-if="!tenders.length && !isLoading" class="mt-2 text-sm text-amber-600 dark:text-amber-400">
              No assigned tenders available for submission.
            </p>
          </div>

          <div v-if="selectedTender" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Tender Summary</h3>
            <div class="grid gap-3 md:grid-cols-2 text-sm">
              <div>
                <span class="text-slate-500 dark:text-slate-400">Entity</span>
                <p class="font-medium text-slate-900 dark:text-white">{{ selectedTender.procurement_entity || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-slate-500 dark:text-slate-400">Type</span>
                <p class="font-medium text-slate-900 dark:text-white">{{ selectedTender.tender_type || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-slate-500 dark:text-slate-400">Submission Deadline</span>
                <p class="font-medium text-slate-900 dark:text-white">{{ formatDate(selectedTender.bid_submission) }}</p>
              </div>
              <div>
                <span class="text-slate-500 dark:text-slate-400">Closing Date</span>
                <p class="font-medium text-slate-900 dark:text-white">{{ formatDate(selectedTender.expired_at) }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="qualifications" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Submission Notes / Qualifications
            </label>
            <textarea
              id="qualifications"
              v-model="submissionData.qualifications"
              rows="4"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-gray-900 dark:text-white"
              placeholder="Summarize compliance status, key assumptions, exclusions, or any important notes for this bid submission."
            ></textarea>
          </div>

          <div>
            <label for="submissionDocument" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Final Tender Document (PDF) <span class="text-red-500">*</span>
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
                    for="submissionDocument"
                    class="relative cursor-pointer rounded-md font-medium text-slate-600 dark:text-slate-400 hover:text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2"
                  >
                    <span>Upload a PDF file</span>
                    <input
                      id="submissionDocument"
                      name="submissionDocument"
                      type="file"
                      class="sr-only"
                      accept="application/pdf"
                      @change="handleFileUpload"
                      required
                    />
                  </label>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PDF only (max 2MB)
                </p>
                <p v-if="submissionData.submission_document" class="mt-2 text-sm text-green-600 dark:text-green-400">
                  Selected: {{ submissionData.submission_document.name }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              type="submit"
              :disabled="isLoading || !canSubmit"
              class="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              <span v-if="isLoading">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
              <span v-else>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit Tender Response
              </span>
            </button>

            <router-link
              to="/submitted-tenders"
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
import { computed, onMounted, ref } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const submissionData = ref({
  tender_id: '',
  submission_document: null,
  qualifications: '',
})

const tenders = ref([])
const isLoading = ref(false)

const selectedTender = computed(() =>
  tenders.value.find(tender => tender.tender_id === submissionData.value.tender_id)
)

const canSubmit = computed(() =>
  Boolean(submissionData.value.tender_id && submissionData.value.submission_document)
)

onMounted(async () => {
  await fetchAssignedTenders()
})

async function fetchAssignedTenders() {
  isLoading.value = true
  try {
    const response = await axios.get('api/your/tender')
    const assigned = response.data.data || []
    tenders.value = assigned.map(item => ({
      tender_id: item.tender?.tender_id,
      title: item.tender?.title,
      tender_number: item.tender?.tender_number,
      tender_type: item.tender?.tender_type,
      procurement_entity: item.tender?.procurement_entity,
      bid_submission: item.tender?.bid_submission,
      expired_at: item.tender?.expired_at,
      is_assigned: item.is_assigned,
    })).filter(item => item.tender_id && item.is_assigned !== 'submitted')
  } catch (error) {
    toast.error('Failed to load your assigned tenders')
  } finally {
    isLoading.value = false
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed')
    event.target.value = ''
    return
  }

  submissionData.value.submission_document = file
  toast.success(`Selected: ${file.name}`)
}

async function submitTender() {
  if (!canSubmit.value) {
    toast.error('Please select an assigned tender and upload a PDF file')
    return
  }

  isLoading.value = true

  const formData = new FormData()
  formData.append('tender_id', submissionData.value.tender_id)
  formData.append('submission_document', submissionData.value.submission_document)
  if (submissionData.value.qualifications.trim()) {
    formData.append('qualifications', submissionData.value.qualifications.trim())
  }

  try {
    const response = await axios.post('api/submit/tender', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    toast.success(response.data.message || 'Tender submitted successfully')
    router.push('/submitted-tenders')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit tender')
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function closeModal() {
  router.push('/submitted-tenders')
}
</script>

<style scoped>
.shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
