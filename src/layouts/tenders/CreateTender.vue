<template>
  <div class="min-h-screen bg-gray-50/40 dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200/70 dark:border-neutral-800">
        
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/10 rounded-lg">
              <i class="fas fa-file-signature text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold tracking-tight">Register New Tender</h2>
              <p class="text-sm text-slate-300 mt-0.5">Add a new procurement opportunity</p>
            </div>
          </div>
          <router-link
            to="/tenders"
            class="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close form"
          >
            <i class="fas fa-times text-xl"></i>
          </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="p-6 lg:p-8 space-y-7">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tender Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
                placeholder="e.g. Supply and Delivery of Laboratory Reagents – FY 2025/2026"
              />
            </div>

            <!-- Source & Entity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tender Source
              </label>
              <input
                v-model="form.tender_source"
                type="text"
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
                placeholder="e.g. PPRA, TANePS, UNGM, AfDB, etc."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Procurement Entity <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.procurement_entity"
                type="text"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
                placeholder="e.g. Ministry of Health, Community Development, Gender, Elderly and Children"
              />
            </div>

            <!-- Number & Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tender Number <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.tender_number"
                type="text"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all font-mono"
                placeholder="e.g. ME/004/2025-2026/HQ/NCS/..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tender Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.tender_type"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              >
                <option value="" disabled>Select tender category</option>
                <option value="goods">Goods</option>
                <option value="works">Works</option>
                <option value="consultancy">Consultancy Services</option>
                <option value="non-consultancy">Non-Consultancy Services</option>
              </select>
            </div>

            <!-- Dates -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date of Publication <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.date_of_Publication"
                type="date"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Expiration / Closing Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.expired_at"
                type="date"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bid Submission Deadline <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.bid_submission"
                type="date"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              />
            </div>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tender Document (PDF) <span class="text-red-500">*</span>
            </label>

            <div
              class="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-8 text-center hover:border-indigo-500/60 transition-all cursor-pointer group"
              @dragover.prevent
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept="application/pdf"
                class="hidden"
                @change="handleFileChange"
              />

              <div v-if="!form.attachment">
                <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 dark:text-neutral-600 group-hover:text-indigo-500 transition-colors mb-4"></i>
                <p class="text-gray-600 dark:text-neutral-400 mb-1">
                  <span class="font-medium text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p class="text-sm text-gray-500 dark:text-neutral-500">
                  PDF files only • max 10 MB
                </p>
              </div>

              <div v-else class="flex items-center justify-center gap-4 py-2">
                <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <i class="fas fa-file-pdf text-green-600 dark:text-green-400 text-2xl"></i>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white truncate max-w-md">
                    {{ form.attachment.name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-neutral-400">
                    {{ (form.attachment.size / 1024 / 1024).toFixed(2) }} MB
                  </p>
                </div>
                <button
                  type="button"
                  @click="clearFile"
                  class="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
            <router-link
              to="/tenders"
              class="px-6 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-700 font-medium transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-arrow-left"></i>
              Cancel
            </router-link>

            <button
              type="submit"
              :disabled="isSubmitting || !canSubmit"
              class="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <template v-if="isSubmitting">
                <i class="fas fa-spinner fa-spin"></i>
                Saving...
              </template>
              <template v-else>
                <i class="fas fa-check"></i>
                Register Tender
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const form = ref({
  title: '',
  tender_source: '',
  procurement_entity: '',
  tender_number: '',
  tender_type: '',
  date_of_Publication: '',
  expired_at: '',
  bid_submission: '',
  attachment: null,
})

const isSubmitting = ref(false)
const fileInput = ref(null)

const canSubmit = computed(() => {
  const f = form.value
  return Boolean(
    f.title?.trim() &&
    f.procurement_entity?.trim() &&
    f.tender_number?.trim() &&
    f.tender_type &&
    f.date_of_Publication &&
    f.expired_at &&
    f.bid_submission &&
    f.attachment
  )
})

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  validateAndSetFile(file)
}

function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files?.[0]
  if (file) validateAndSetFile(file)
}

function validateAndSetFile(file) {
  if (file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must not exceed 10 MB')
    return
  }
  form.value.attachment = file
}

function clearFile() {
  form.value.attachment = null
  if (fileInput.value) fileInput.value.value = ''
}

async function submitForm() {
  if (!canSubmit.value) {
    toast.warning('Please complete all required fields')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    Object.entries(form.value).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value)
      }
    })

    const response = await axios.post('/api/tenders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.success(response.data.message || 'Tender registered successfully')
    router.push('/tenders')
  } catch (error) {
    if (error.response?.status === 422) {
      const errs = error.response.data.errors || {}
      Object.values(errs).flat().forEach(msg => toast.error(msg))
    } else {
      toast.error(error.response?.data?.message || 'Failed to register tender')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>