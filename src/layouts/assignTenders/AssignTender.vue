<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200/70 dark:border-neutral-800">
        
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-white/10 rounded-lg">
              <i class="fas fa-user-check text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold tracking-tight">Assign Tender</h2>
              <p class="text-sm text-slate-300 mt-0.5">Assign a tender to an engineer / responsible person</p>
            </div>
          </div>
          <router-link
            to="/assigned-tenders"
            class="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </router-link>
        </div>

        <!-- Form Content -->
        <div class="p-6 lg:p-8 space-y-8">
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <svg class="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600 dark:text-neutral-400">Loading tenders and engineers...</p>
          </div>

          <div v-else-if="errorMessage" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-5 text-center">
            <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
            <p class="text-red-700 dark:text-red-300 font-medium">{{ errorMessage }}</p>
            <button @click="retryFetch" class="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Try Again
            </button>
          </div>

          <form v-else @submit.prevent="assignTender" class="space-y-7">
            <!-- Tender Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Tender <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="assignment.tender_id"
                  required
                  class="block w-full px-4 py-3.5 pr-10 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all appearance-none"
                >
                  <option value="" disabled>Select tender to assign</option>
                  <option v-for="tender in tenders" :key="tender.tender_id" :value="tender.tender_id">
                    {{ tender.title }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-neutral-400">
                  <i class="fas fa-chevron-down text-sm"></i>
                </div>
              </div>
            </div>

            <!-- Engineer / User Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign to Engineer / Responsible Person <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="assignment.user_id"
                  required
                  class="block w-full px-4 py-3.5 pr-10 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all appearance-none"
                >
                  <option value="" disabled>Select engineer / user</option>
                  <option v-for="user in engineers" :key="user.user_id" :value="user.user_id">
                    {{ user.name }} {{ user.email ? `(${user.email})` : '' }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-neutral-400">
                  <i class="fas fa-chevron-down text-sm"></i>
                </div>
              </div>
            </div>

            <!-- Summary / Preview (optional enhancement) -->
            <div v-if="selectedTender || selectedEngineer" class="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-gray-200 dark:border-neutral-700">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Assignment Preview</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 text-sm">
                <div v-if="selectedTender">
                  <dt class="text-gray-500 dark:text-neutral-400">Tender</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ selectedTender.title }}</dd>
                </div>
                <div v-if="selectedEngineer">
                  <dt class="text-gray-500 dark:text-neutral-400">Assigned to</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ selectedEngineer.name }}</dd>
                </div>
              </dl>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
              <router-link
                to="/assigned-tenders"
                class="px-6 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-700 font-medium transition flex items-center justify-center gap-2"
              >
                <i class="fas fa-arrow-left"></i>
                Cancel
              </router-link>

              <button
                type="submit"
                :disabled="isSubmitting || !canSubmit"
                class="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-w-[160px]"
              >
                <template v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin"></i>
                  Assigning...
                </template>
                <template v-else>
                  <i class="fas fa-user-check"></i>
                  Assign Tender
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const assignment = ref({
  tender_id: '',
  user_id: '',
})

const tenders = ref([])
const engineers = ref([])
const loading = ref(true)
const errorMessage = ref(null)
const isSubmitting = ref(false)

const selectedTender = computed(() =>
  tenders.value.find(t => t.tender_id === assignment.value.tender_id)
)

const selectedEngineer = computed(() =>
  engineers.value.find(u => u.user_id === assignment.value.user_id)
)

const canSubmit = computed(() =>
  Boolean(assignment.value.tender_id && assignment.value.user_id)
)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  errorMessage.value = null

  try {
    const [tendersRes, engineersRes] = await Promise.all([
      axios.get('api/dropdown/tender'),
      axios.get('api/dropdown/engineer')
    ])

    tenders.value = tendersRes.data.data || []
    engineers.value = engineersRes.data.users || []
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to load required data. Please try again.'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

async function assignTender() {
  if (!canSubmit.value) {
    toast.warning('Please select both a tender and an engineer')
    return
  }

  isSubmitting.value = true

  try {
    const response = await axios.post('api/assign/tender', assignment.value)

    if (response.data.status) {
      toast.success(response.data.message || 'Tender assigned successfully')
      router.push('/assigned-tenders')
    } else {
      toast.error(response.data.message || 'Assignment failed')
    }
  } catch (error) {
    let msg = 'Failed to assign tender'

    if (error.response?.data?.message) {
      msg = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      msg = errors.join(' • ')
    }

    toast.error(msg)
  } finally {
    isSubmitting.value = false
  }
}

function retryFetch() {
  loadData()
}
</script>