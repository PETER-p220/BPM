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
      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- Status Badge -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Status</p>
              <span
                class="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
                :style="getExpirationBadgeStyle(tender.expired_at)"
              >
                {{ getExpirationStatus(tender.expired_at) }}
              </span>
            </div>
            <div class="text-2xl">
              <i class="fas fa-flag" :style="{ color: getExpirationBadgeStyle(tender.expired_at).color }"></i>
            </div>
          </div>
        </div>

        <!-- Days Left -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Time Remaining</p>
              <p class="text-xl font-bold text-gray-900">{{ getDaysRemaining(tender.expired_at) }}</p>
            </div>
            <div class="text-2xl text-blue-500">
              <i class="fas fa-clock"></i>
            </div>
          </div>
        </div>

      
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
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <label class="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-file-contract text-blue-500"></i>
                      Tender Number
                    </label>
                    <p class="mt-1 text-gray-900 font-mono text-lg font-semibold">{{ tender.tender_number }}</p>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <label class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-tag text-gray-500"></i>
                      Tender Type
                    </label>
                    <p class="mt-1 text-gray-900 font-medium">{{ tender.tender_type || 'N/A' }}</p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <label class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-building text-gray-500"></i>
                      Procurement Entity
                    </label>
                    <p class="mt-1 text-gray-900 font-medium">{{ tender.procurement_entity || 'N/A' }}</p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <label class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-globe text-gray-500"></i>
                      Tender Source
                    </label>
                    <p class="mt-1 text-gray-900 font-medium">{{ tender.tender_source || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-blue-500"></i>
                  Important Dates
                </h3>
                <div class="space-y-4">
                  <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                    <label class="text-sm font-semibold text-red-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-exclamation-triangle text-red-500"></i>
                      Bid Submission Deadline
                    </label>
                    <p class="mt-1 text-gray-900 font-semibold">{{ formatDate(tender.bid_submission) }}</p>
                    <p class="text-xs text-red-600 mt-1">{{ getUrgency(tender.bid_submission) }}</p>
                  </div>

                  <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <label class="text-sm font-semibold text-orange-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-hourglass-end text-orange-500"></i>
                      Expiry Date
                    </label>
                    <p class="mt-1 text-gray-900 font-semibold">{{ formatDate(tender.expired_at) }}</p>
                    <p class="text-xs text-orange-600 mt-1">{{ getUrgency(tender.expired_at) }}</p>
                  </div>

                  <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                    <label class="text-sm font-semibold text-green-700 flex items-center gap-2 mb-2">
                      <i class="fas fa-newspaper text-green-500"></i>
                      Published Date
                    </label>
                    <p class="mt-1 text-gray-900 font-semibold">{{ formatDate(tender.date_of_Publication) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="tender.scope_summary" class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-bullseye text-blue-500"></i>
              Scope Summary
            </h3>
            <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div class="prose max-w-none text-gray-700">
                <p class="whitespace-pre-wrap leading-relaxed">{{ tender.scope_summary }}</p>
              </div>
            </div>
          </div>

          <div v-if="tender.eligibility_criteria" class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-clipboard-check text-green-500"></i>
              Eligibility Requirements
            </h3>
            <div class="bg-green-50 rounded-lg p-6 border border-green-200">
              <div class="prose max-w-none text-gray-700">
                <p class="whitespace-pre-wrap leading-relaxed">{{ tender.eligibility_criteria }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Information Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-purple-500"></i>
              Additional Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="tender.bid_currency" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label class="text-sm font-semibold text-gray-700">Bid Currency</label>
                <p class="mt-1 text-gray-900 font-semibold">{{ tender.bid_currency }}</p>
              </div>
              <div v-if="tender.tender_category" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label class="text-sm font-semibold text-gray-700">Category</label>
                <p class="mt-1 text-gray-900 font-semibold">{{ tender.tender_category }}</p>
              </div>
              <div v-if="tender.tender_status" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label class="text-sm font-semibold text-gray-700">Status</label>
                <p class="mt-1 text-gray-900 font-semibold">{{ tender.tender_status }}</p>
              </div>
              <div v-if="tender.evaluation_criteria" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label class="text-sm font-semibold text-gray-700">Evaluation Criteria</label>
                <p class="mt-1 text-gray-900 font-semibold">{{ tender.evaluation_criteria }}</p>
              </div>
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
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-address-book text-blue-500"></i>
            Contact Information
          </h3>
          <div class="space-y-3">
            <div v-if="tender.contact_person" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label class="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-2">
                <i class="fas fa-user text-blue-500"></i>
                Contact Person
              </label>
              <p class="mt-1 text-gray-900 font-semibold">{{ tender.contact_person }}</p>
            </div>
            <div v-if="tender.contact_email" class="bg-green-50 rounded-lg p-4 border border-green-200">
              <label class="text-sm font-semibold text-green-700 flex items-center gap-2 mb-2">
                <i class="fas fa-envelope text-green-500"></i>
                Email
              </label>
              <p class="mt-1 text-gray-900 font-semibold">{{ tender.contact_email }}</p>
            </div>
            <div v-if="tender.contact_phone" class="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <label class="text-sm font-semibold text-purple-700 flex items-center gap-2 mb-2">
                <i class="fas fa-phone text-purple-500"></i>
                Phone
              </label>
              <p class="mt-1 text-gray-900 font-semibold">{{ tender.contact_phone }}</p>
            </div>
            <div v-if="!tender.contact_person && !tender.contact_email && !tender.contact_phone">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                <i class="fas fa-info-circle text-gray-400 text-2xl mb-2"></i>
                <p class="text-gray-500 italic">No contact information available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Information -->
        <div v-if="tender" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-money-bill-wave text-green-500"></i>
            Financial Information
          </h3>
          <div class="space-y-3">
            <div v-if="tender.budget_amount" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <label class="text-sm font-semibold text-green-700 flex items-center gap-2 mb-2">
                <i class="fas fa-piggy-bank text-green-500"></i>
                Budget Amount
              </label>
              <p class="mt-1 text-gray-900 font-bold text-lg">{{ formatCurrency(tender.budget_amount) }}</p>
            </div>
            <div v-if="tender.estimated_value" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <label class="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-2">
                <i class="fas fa-chart-line text-blue-500"></i>
                Estimated Value
              </label>
              <p class="mt-1 text-gray-900 font-bold text-lg">{{ formatCurrency(tender.estimated_value, tender.bid_currency) }}</p>
            </div>
            <div v-if="tender.tender_fee" class="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
              <label class="text-sm font-semibold text-yellow-700 flex items-center gap-2 mb-2">
                <i class="fas fa-file-invoice-dollar text-yellow-500"></i>
                Tender Fee
              </label>
              <p class="mt-1 text-gray-900 font-semibold">{{ formatCurrency(tender.tender_fee, tender.bid_currency) }}</p>
            </div>
            <div v-if="tender.bid_security_required" class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <label class="text-sm font-semibold text-red-700 flex items-center gap-2 mb-2">
                <i class="fas fa-shield-alt text-red-500"></i>
                Bid Security
              </label>
              <p class="mt-1 text-gray-900 font-semibold">
                {{ tender.bid_security_amount ? formatCurrency(tender.bid_security_amount, tender.bid_currency) : 'Required' }}
              </p>
            </div>
            <div v-if="!tender.budget_amount && !tender.estimated_value && !tender.tender_fee && !tender.bid_security_required">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                <i class="fas fa-coins text-gray-400 text-2xl mb-2"></i>
                <p class="text-gray-500 italic">No financial information available</p>
              </div>
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

function getDaysRemaining(expiredAt) {
  if (!expiredAt) return 'No expiry'
  const diffDays = Math.ceil((new Date(expiredAt) - new Date()) / 86400000)
  if (diffDays < 0) return 'Expired'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day'
  return `${diffDays} days`
}

function getUrgency(dateString) {
  if (!dateString) return ''
  const diffDays = Math.ceil((new Date(dateString) - new Date()) / 86400000)
  if (diffDays < 0) return 'This date has passed'
  if (diffDays === 0) return 'Due today!'
  if (diffDays <= 3) return `Only ${diffDays} day${diffDays === 1 ? '' : 's'} left!`
  if (diffDays <= 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} remaining`
  return `${diffDays} day${diffDays === 1 ? '' : 's'} remaining`
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
