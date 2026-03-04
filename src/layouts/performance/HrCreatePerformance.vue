<template>
  <div class="min-h-screen bg-[#f5f6fa] dark:bg-[#0d0f14] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <button
            @click="$router.go(-1)"
            class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
            Back to Performance Management
          </button>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Performance Evaluation</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Evaluate employee performance for the selected period</p>
      </div>

      <form @submit.prevent="submitEvaluation" class="space-y-6">
        <!-- Employee Selection -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Employee Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Employee <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.employee_id"
                required
                @change="loadEmployeeDetails"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose an employee...</option>
                <option v-for="employee in employees" :key="employee.user_id" :value="employee.user_id">
                    {{ employee.name }} - {{ employee.department?.name || employee.department_id }}
                  </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Review Period <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.review_period"
                placeholder="e.g., Q1 2024, Annual 2024"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div v-if="selectedEmployee" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {{ getInitials(selectedEmployee.name) }}
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ selectedEmployee.name }}</p>
                <p class="text-sm text-gray-500">{{ selectedEmployee.email }}</p>
                <p class="text-sm text-gray-500">{{ selectedEmployee.department?.name || selectedEmployee.department_id }} • {{ selectedEmployee.position || 'Employee' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Criteria -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Performance Criteria</h2>
          
          <div class="space-y-6">
            <!-- Job Knowledge -->
            <div class="border-b pb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900">Job Knowledge & Skills</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Rating:</span>
                  <select
                    v-model="form.job_knowledge"
                    required
                    class="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2">Demonstrates understanding of job requirements and possesses necessary skills</p>
              <textarea
                v-model="form.job_knowledge_comments"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific examples and feedback..."
              ></textarea>
            </div>

            <!-- Work Quality -->
            <div class="border-b pb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900">Work Quality</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Rating:</span>
                  <select
                    v-model="form.work_quality"
                    required
                    class="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2">Accuracy, thoroughness, and attention to detail in work completed</p>
              <textarea
                v-model="form.work_quality_comments"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific examples and feedback..."
              ></textarea>
            </div>

            <!-- Productivity -->
            <div class="border-b pb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900">Productivity & Efficiency</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Rating:</span>
                  <select
                    v-model="form.productivity"
                    required
                    class="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2">Volume of work completed and ability to meet deadlines</p>
              <textarea
                v-model="form.productivity_comments"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific examples and feedback..."
              ></textarea>
            </div>

            <!-- Communication -->
            <div class="border-b pb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900">Communication Skills</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Rating:</span>
                  <select
                    v-model="form.communication"
                    required
                    class="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2">Clarity, effectiveness, and appropriateness of communication</p>
              <textarea
                v-model="form.communication_comments"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific examples and feedback..."
              ></textarea>
            </div>

            <!-- Teamwork -->
            <div class="border-b pb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900">Teamwork & Collaboration</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Rating:</span>
                  <select
                    v-model="form.teamwork"
                    required
                    class="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2">Ability to work effectively with others and contribute to team goals</p>
              <textarea
                v-model="form.teamwork_comments"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific examples and feedback..."
              ></textarea>
            </div>

            <!-- Initiative -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900">Initiative & Problem Solving</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Rating:</span>
                  <select
                    v-model="form.initiative"
                    required
                    class="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2">Proactiveness, creativity, and ability to solve problems independently</p>
              <textarea
                v-model="form.initiative_comments"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific examples and feedback..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Overall Assessment -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Overall Assessment</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.overall_rating"
                required
                @change="calculateOverallRating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Overall Rating</option>
                <option value="5">5 - Outstanding</option>
                <option value="4">4 - Exceeds Expectations</option>
                <option value="3">3 - Meets Expectations</option>
                <option value="2">2 - Needs Improvement</option>
                <option value="1">1 - Unsatisfactory</option>
              </select>
              
              <div v-if="calculatedRating" class="mt-2 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                  <strong>Calculated Average:</strong> {{ calculatedRating.toFixed(2) }}
                </p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Review Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                v-model="form.review_date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Overall Comments <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.overall_comments"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide comprehensive summary of employee's performance, strengths, and areas for development..."
            ></textarea>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Goals for Next Period
            </label>
            <textarea
              v-model="form.goals_next_period"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Set specific, measurable, achievable, relevant, and time-bound (SMART) goals..."
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$router.go(-1)"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Creating...
            </span>
            <span v-else>Create Evaluation</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const employees = ref([])
const selectedEmployee = ref(null)
const isSubmitting = ref(false)

const form = ref({
  employee_id: '',
  review_period: '',
  job_knowledge: '',
  job_knowledge_comments: '',
  work_quality: '',
  work_quality_comments: '',
  productivity: '',
  productivity_comments: '',
  communication: '',
  communication_comments: '',
  teamwork: '',
  teamwork_comments: '',
  initiative: '',
  initiative_comments: '',
  overall_rating: '',
  overall_comments: '',
  goals_next_period: '',
  review_date: new Date().toISOString().split('T')[0]
})

const calculatedRating = computed(() => {
  const ratings = [
    parseFloat(form.value.job_knowledge) || 0,
    parseFloat(form.value.work_quality) || 0,
    parseFloat(form.value.productivity) || 0,
    parseFloat(form.value.communication) || 0,
    parseFloat(form.value.teamwork) || 0,
    parseFloat(form.value.initiative) || 0
  ].filter(r => r > 0)
  
  if (ratings.length === 0) return 0
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
})

watch(calculatedRating, (newValue) => {
  if (newValue > 0 && !form.value.overall_rating) {
    form.value.overall_rating = Math.round(newValue).toString()
  }
})

onMounted(async () => {
  await fetchEmployees()
})

async function fetchEmployees() {
  try {
    const response = await axios.get('/api/all/users')
    employees.value = response.data.users || []
    console.log('Employees fetched:', employees.value)
  } catch (error) {
    toast.error('Failed to fetch employees')
    console.error('Error:', error)
  }
}

function loadEmployeeDetails() {
  selectedEmployee.value = employees.value.find(emp => emp.user_id === parseInt(form.value.employee_id))
}

function calculateOverallRating() {
  // This is handled by the computed property and watcher
}

async function submitEvaluation() {
  if (!form.value.employee_id) {
    toast.error('Please select an employee')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const evaluationData = {
      ...form.value,
      calculated_rating: calculatedRating.value
    }
    
    await axios.post('/api/performance/evaluations', evaluationData)
    
    toast.success('Performance evaluation created successfully')
    router.push('/hr/performance-management')
  } catch (error) {
    toast.error('Failed to create performance evaluation')
    console.error('Error:', error)
  } finally {
    isSubmitting.value = false
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
