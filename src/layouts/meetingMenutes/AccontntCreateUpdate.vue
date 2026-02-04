<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200/70 dark:border-neutral-800">
        
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-white/10 rounded-lg">
              <i class="fas fa-file-signature text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold tracking-tight">Create Meeting Minutes</h2>
              <p class="text-sm text-slate-300 mt-0.5">Record key points, progress and decisions</p>
            </div>
          </div>
          <router-link
            to="/account-view-minutes"
            class="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="applyMeetingMinutes" class="p-6 lg:p-8 space-y-7">
          <!-- Dynamic Minute Points -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Minute Points / Current Updates <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                @click="addMinutePoint"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Point
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(point, index) in requestData.minute_point"
                :key="index"
                class="flex items-start gap-3"
              >
                <textarea
                  v-model="requestData.minute_point[index]"
                  rows="2"
                  required
                  placeholder="e.g. Reviewed project timeline – Phase 2 delayed by 2 weeks"
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all resize-y"
                ></textarea>

                <button
                  v-if="requestData.minute_point.length > 1"
                  type="button"
                  @click="removeMinutePoint(index)"
                  class="mt-1 p-2.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  title="Remove this point"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Plans / Progress / Details -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plans / Progress / Additional Details
            </label>
            <textarea
              v-model="requestData.if_more_detail"
              rows="5"
              placeholder="Detailed notes, decisions made, next steps, responsible persons..."
              class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all resize-y min-h-[120px]"
            ></textarea>
          </div>

          <!-- Selects – Three columns on larger screens -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Project -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project <span class="text-red-500">*</span>
              </label>
              <select
                v-model="requestData.project_id"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              >
                <option value="">Select project</option>
                <option v-for="proj in projects" :key="proj.project_id" :value="proj.project_id">
                  {{ proj.project_name }}
                </option>
              </select>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <select
                v-model="requestData.department_id"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              >
                <option value="">Select department</option>
                <option v-for="dept in departments" :key="dept.department_id" :value="dept.department_id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Engineer -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department Engineer <span class="text-red-500">*</span>
              </label>
              <select
                v-model="requestData.user_id"
                required
                class="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm transition-all"
              >
                <option value="">Select engineer</option>
                <option v-for="eng in engineers" :key="eng.user_id" :value="eng.user_id">
                  {{ eng.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200 dark:border-neutral-800">
            <router-link
              to="/account-view-minutes"
              class="px-6 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-700 font-medium transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-arrow-left"></i>
              Cancel
            </router-link>

            <button
              type="submit"
              :disabled="isLoading || !formIsValid"
              class="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-w-[180px]"
            >
              <template v-if="isLoading">
                <i class="fas fa-spinner fa-spin"></i>
                Saving...
              </template>
              <template v-else>
                <i class="fas fa-save"></i>
                Save Minutes
              </template>
            </button>
          </div>
        </form>
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

const requestData = ref({
  minute_point: [''],
  if_more_detail: '',
  department_id: null,
  user_id: null,
  project_id: null,
})

const departments = ref([])
const engineers = ref([])
const projects = ref([])
const isLoading = ref(false)

const formIsValid = computed(() => {
  return (
    requestData.value.minute_point.every(p => p.trim()) &&
    requestData.value.department_id &&
    requestData.value.user_id &&
    requestData.value.project_id
  )
})

onMounted(async () => {
  await Promise.all([
    fetchDepartments(),
    fetchEngineers(),
    fetchProjects()
  ])
})

async function fetchDepartments() {
  try {
    const { data } = await axios.get('api/dropdown/department')
    departments.value = data.departments || []
  } catch (err) {
    toast.error('Failed to load departments')
  }
}

async function fetchEngineers() {
  try {
    const { data } = await axios.get('api/dropdown/engineer')
    engineers.value = data.users || []
  } catch (err) {
    toast.error('Failed to load engineers')
  }
}

async function fetchProjects() {
  try {
    const { data } = await axios.get('api/dropdown/projects')
    projects.value = data.data || []
  } catch (err) {
    toast.error('Failed to load projects')
  }
}

function addMinutePoint() {
  requestData.value.minute_point.push('')
}

function removeMinutePoint(index) {
  if (requestData.value.minute_point.length > 1) {
    requestData.value.minute_point.splice(index, 1)
  } else {
    toast.warning('At least one minute point is required')
  }
}

async function applyMeetingMinutes() {
  if (!formIsValid.value) {
    toast.warning('Please complete all required fields')
    return
  }

  isLoading.value = true

  try {
    // Clean empty points
    const cleanPoints = requestData.value.minute_point.filter(p => p.trim())

    const payload = {
      minute_point: cleanPoints,
      if_more_detail: requestData.value.if_more_detail.trim() || null,
      department_id: requestData.value.department_id,
      user_id: requestData.value.user_id,
      project_id: requestData.value.project_id,
    }

    const response = await axios.post('api/meeting-minutes', payload)

    toast.success(response.data.message || 'Meeting minutes saved successfully')
    resetForm()
    router.push('/account-view-minutes')
  } catch (error) {
    let msg = 'Failed to save meeting minutes'

    if (error.response?.data?.message) {
      msg = error.response.data.message
    } else if (error.response?.data?.errors) {
      msg = Object.values(error.response.data.errors).flat().join(' • ')
    }

    toast.error(msg)
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  requestData.value = {
    minute_point: [''],
    if_more_detail: '',
    department_id: null,
    user_id: null,
    project_id: null,
  }
}
</script>