<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <button
              @click="goBack"
              class="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <i class="fas fa-arrow-left"></i>
              Back
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Tender Details</h1>
              <p class="text-sm text-gray-600 mt-1">View tender information</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              v-if="tender && tender.attachment"
              @click="downloadTenderPdf(tender.attachment)"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm font-medium"
              :disabled="isDownloading"
            >
              <i class="fas fa-download"></i>
              <span v-if="!isDownloading">Download PDF</span>
              <span v-else>Downloading...</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600">Loading tender details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-20">
      <div class="text-center max-w-md">
        <div class="mb-4">
          <i class="fas fa-exclamation-triangle text-6xl text-red-300"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Tender</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
        >
          <i class="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>
    </div>

    <!-- Tender Details -->
    <div v-else-if="tender" class="container mx-auto px-4 py-8">
      <!-- Status Badge -->
      <div v-if="tender" class="mb-6">
        <span
          class="inline-flex px-4 py-2 rounded-full text-sm font-semibold"
          :style="getExpirationBadgeStyle(tender.expired_at)"
        >
          {{ getExpirationStatus(tender.expired_at) }}
        </span>
      </div>

      <!-- Main Information Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ tender.title }}</h2>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Tender Number</label>
                    <p class="mt-1 text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">{{ tender.tender_number }}</p>
                  </div>
                  
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Tender Type</label>
                    <p class="mt-1 text-gray-900">{{ tender.tender_type || 'N/A' }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Procurement Entity</label>
                    <p class="mt-1 text-gray-900">{{ tender.procurement_entity || 'N/A' }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Tender Source</label>
                    <p class="mt-1 text-gray-900">{{ tender.tender_source || 'N/A' }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Procurement Method</label>
                    <p class="mt-1 text-gray-900">{{ tender.procurement_method || 'N/A' }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Submission Mode</label>
                    <p class="mt-1 text-gray-900">{{ tender.submission_mode || 'N/A' }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Contract Duration</label>
                    <p class="mt-1 text-gray-900">{{ tender.contract_duration || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Bid Submission Deadline</label>
                    <p class="mt-1 text-gray-900">{{ formatDate(tender.bid_submission) }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Expiry Date</label>
                    <p class="mt-1 text-gray-900">{{ formatDate(tender.expired_at) }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Published Date</label>
                    <p class="mt-1 text-gray-900">{{ formatDate(tender.date_of_Publication) }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Clarification Deadline</label>
                    <p class="mt-1 text-gray-900">{{ formatDate(tender.clarification_deadline) }}</p>
                  </div>

                  <div>
                    <label class="text-sm font-semibold text-gray-700">Site Visit / Pre-bid Meeting</label>
                    <p class="mt-1 text-gray-900">{{ formatDate(tender.site_visit_date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="tender.scope_summary" class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Scope Summary</h3>
            <div class="prose max-w-none text-gray-700">
              <p class="whitespace-pre-wrap">{{ tender.scope_summary }}</p>
            </div>
          </div>

          <div v-if="tender.eligibility_criteria" class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Eligibility Requirements</h3>
            <div class="prose max-w-none text-gray-700">
              <p class="whitespace-pre-wrap">{{ tender.eligibility_criteria }}</p>
            </div>
          </div>

          <!-- Attachment Section -->
          <div v-if="tender && tender.attachment" class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            <div class="flex items-center gap-4">
              <button
                @click="downloadTenderPdf(tender.attachment)"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium"
                :disabled="isDownloading"
              >
                <i class="fas fa-file-pdf"></i>
                <span>Download Tender Document</span>
                <i v-if="isDownloading" class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Contact Information -->
        <div v-if="tender" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div class="space-y-3">
            <div v-if="tender.contact_person">
              <label class="text-sm font-semibold text-gray-700">Contact Person</label>
              <p class="mt-1 text-gray-900">{{ tender.contact_person }}</p>
            </div>
            <div v-if="tender.contact_email">
              <label class="text-sm font-semibold text-gray-700">Email</label>
              <p class="mt-1 text-gray-900">{{ tender.contact_email }}</p>
            </div>
            <div v-if="tender.contact_phone">
              <label class="text-sm font-semibold text-gray-700">Phone</label>
              <p class="mt-1 text-gray-900">{{ tender.contact_phone }}</p>
            </div>
            <div v-if="!tender.contact_person && !tender.contact_email && !tender.contact_phone">
              <p class="text-gray-500 italic">No contact information available</p>
            </div>
          </div>
        </div>

        <!-- Financial Information -->
        <div v-if="tender" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
          <div class="space-y-3">
            <div v-if="tender.budget_amount">
              <label class="text-sm font-semibold text-gray-700">Budget Amount</label>
              <p class="mt-1 text-gray-900 font-semibold">{{ formatCurrency(tender.budget_amount) }}</p>
            </div>
            <div v-if="tender.estimated_value">
              <label class="text-sm font-semibold text-gray-700">Estimated Value</label>
              <p class="mt-1 text-gray-900 font-semibold">{{ formatCurrency(tender.estimated_value, tender.bid_currency) }}</p>
            </div>
            <div v-if="tender.tender_fee">
              <label class="text-sm font-semibold text-gray-700">Tender Fee</label>
              <p class="mt-1 text-gray-900">{{ formatCurrency(tender.tender_fee, tender.bid_currency) }}</p>
            </div>
            <div v-if="tender.bid_security_required">
              <label class="text-sm font-semibold text-gray-700">Bid Security</label>
              <p class="mt-1 text-gray-900">
                {{ tender.bid_security_amount ? formatCurrency(tender.bid_security_amount, tender.bid_currency) : 'Required' }}
              </p>
            </div>
            <div v-if="!tender.budget_amount && !tender.estimated_value && !tender.tender_fee && !tender.bid_security_required">
              <p class="text-gray-500 italic">No financial information available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { saveAs } from 'file-saver'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const tender = ref(null)
const isLoading = ref(true)
const error = ref('')
const isDownloading = ref(false)

onMounted(async () => {
  await fetchTenderDetails()
})

async function fetchTenderDetails() {
  isLoading.value = true
  error.value = ''
  
  try {
    const tenderId = route.params.tender_id
    const response = await axios.get(`api/tenders/${tenderId}`)
    tender.value = response.data.data
  } catch (err) {
    console.error('Error fetching tender details:', err)
    error.value = err.response?.data?.message || 'Failed to load tender details'
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getExpirationStatus(expiredAt) {
  if (!expiredAt) return 'No Expiry'
  const diffDays = Math.ceil((new Date(expiredAt) - new Date()) / 86400000)
  if (diffDays < 0) return 'Expired'
  if (diffDays <= 3) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`
  if (diffDays <= 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`
  return 'Active'
}

function getExpirationBadgeStyle(expiredAt) {
  if (!expiredAt) return { backgroundColor: '#e5e7eb', color: '#4b5563' }
  const diffDays = Math.ceil((new Date(expiredAt) - new Date()) / 86400000)
  if (diffDays < 0) return { backgroundColor: '#fee2e2', color: '#991b1b' }
  if (diffDays <= 3) return { backgroundColor: '#fef3c7', color: '#92400e' }
  return { backgroundColor: '#d1fae5', color: '#065f46' }
}

function formatCurrency(amount, currency = 'TZS') {
  if (!amount) return 'N/A'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency
  }).format(amount)
}

async function downloadTenderPdf(attachment) {
  if (!attachment) {
    toast.error('No attachment available')
    return
  }

  isDownloading.value = true
  
  try {
    const response = await axios.get(attachment, { responseType: 'blob' })
    const fileName = attachment.split('/').pop() || 'tender.pdf'
    saveAs(response.data, fileName)
    toast.success('File downloaded successfully')
  } catch (err) {
    console.error('Download error:', err)
    toast.error('Failed to download file')
  } finally {
    isDownloading.value = false
  }
}

function goBack() {
  router.go(-1) // Go back to previous page
}
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
