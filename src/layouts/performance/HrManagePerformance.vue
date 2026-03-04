<template>
  <div class="min-h-screen bg-[#f5f6fa] dark:bg-[#0d0f14] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Performance Management</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage employee performance evaluations and reviews</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="openAutoCalculateDialog"
            class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
          >
            <i class="fas fa-calculator"></i>
            Auto Calculate
          </button>
          <button
            @click="openCreateDialog"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-plus"></i>
            New Evaluation
          </button>
          <button
            @click="exportToExcel"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <i class="fas fa-file-excel text-green-600"></i>
            Export
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Evaluations</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalEvaluations }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <i class="text-blue-600 fas fa-chart-line"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Outstanding</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.outstanding }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <i class="text-green-600 fas fa-star"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Meets Expectations</p>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.meetsExpectations }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <i class="text-yellow-600 fas fa-check-circle"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Needs Improvement</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.needsImprovement }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <i class="text-red-600 fas fa-exclamation-triangle"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="text-gray-400 fas fa-search"></i>
              </div>
              <input
                type="text"
                v-model="filter"
                placeholder="Search by employee, department..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div class="flex gap-3">
            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="outstanding">Outstanding</option>
              <option value="meets_expectations">Meets Expectations</option>
              <option value="needs_improvement">Needs Improvement</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              v-model="departmentFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.department_id" :value="dept.name">
                {{ dept.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Performance Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Period</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Rating</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Date</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
                    <p class="text-gray-600">Loading performance data...</p>
                  </div>
                </td>
              </tr>
              
              <tr v-else-if="filteredData.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-chart-line text-5xl text-gray-300"></i>
                    <p class="text-lg font-medium text-gray-900">No performance evaluations found</p>
                    <p class="text-sm text-gray-600">Get started by creating your first performance evaluation</p>
                    <button
                      @click="openCreateDialog"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2"
                    >
                      <i class="fas fa-plus"></i>
                      Create Evaluation
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-else v-for="evaluation in paginatedData" :key="evaluation.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {{ getInitials(evaluation.employee?.name) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ evaluation.employee?.name }}</div>
                      <div class="text-sm text-gray-500">{{ evaluation.employee?.email }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {{ evaluation.employee?.department?.name || evaluation.employee?.department_id || 'N/A' }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ evaluation.review_period }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <i v-for="n in 5" :key="n" 
                         :class="n <= evaluation.overall_rating ? 'fas fa-star' : 'far fa-star'">
                      </i>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">({{ evaluation.overall_rating }}/5)</span>
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(evaluation.status)">
                    {{ formatStatus(evaluation.status) }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(evaluation.review_date) }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    @click="viewEvaluation(evaluation)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    @click="editEvaluation(evaluation)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteEvaluation(evaluation.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ startIndex + 1 }}</span> to
              <span class="font-medium">{{ endIndex }}</span> of
              <span class="font-medium">{{ filteredData.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Performance Evaluation' : 'Create Performance Evaluation' }}
          </h3>
          
          <form @submit.prevent="submitEvaluation">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Employee <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.employee_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.employee_id }"
                >
                  <option value="">Select Employee</option>
                  <option v-for="employee in employees" :key="employee.user_id" :value="employee.user_id">
                    {{ employee.name }} - {{ employee.department }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Review Period <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.review_period"
                  placeholder="e.g., Q1 2024"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.review_period }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Job Knowledge (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.job_knowledge"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.job_knowledge }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Work Quality (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.work_quality"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.work_quality }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Productivity (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.productivity"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.productivity }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Communication (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.communication"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.communication }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teamwork (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.teamwork"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.teamwork }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Initiative (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.initiative"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.initiative }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Overall Rating (1-5) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.overall_rating"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.overall_rating }"
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Outstanding</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Review Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="form.review_date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': !form.review_date }"
                />
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Overall Comments (min 10 characters) <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.overall_comments"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': !form.overall_comments }"
                placeholder="Enter detailed performance comments..."
              ></textarea>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {{ isEditing ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Auto Calculate Modal -->
    <div v-if="showAutoCalculateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-2/5 shadow-lg rounded-lg bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Auto Calculate Performance
          </h3>
          
          <form @submit.prevent="submitAutoCalculate">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  v-model="autoCalculateForm.employee_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Employee</option>
                  <option v-for="employee in employees" :key="employee.user_id" :value="employee.user_id">
                    {{ employee.name }} - {{ employee.department }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Review Period</label>
                <input
                  type="text"
                  v-model="autoCalculateForm.review_period"
                  placeholder="e.g., 2024-Q1, 2024-01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
                <p class="text-xs text-gray-500 mt-1">Format: YYYY-Q1, YYYY-Q2, YYYY-Q3, YYYY-Q4 or YYYY-MM</p>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="closeAutoCalculateModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isAutoCalculating"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                <span v-if="isAutoCalculating">Calculating...</span>
                <span v-else>Auto Calculate</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Evaluation Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeViewModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Performance Evaluation Details
          </h3>
          
          <div v-if="selectedEvaluation" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <p class="text-gray-900 font-medium">{{ selectedEvaluation.employee?.name }}</p>
                <p class="text-gray-500 text-sm">{{ selectedEvaluation.employee?.email }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p class="text-gray-900">{{ selectedEvaluation.employee?.department?.name || selectedEvaluation.employee?.department_id }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Review Period</label>
                <p class="text-gray-900">{{ selectedEvaluation.review_period }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Review Date</label>
                <p class="text-gray-900">{{ formatDate(selectedEvaluation.review_date) }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Knowledge</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-blue-600">{{ selectedEvaluation.job_knowledge }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" :style="{width: (selectedEvaluation.job_knowledge / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Work Quality</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-green-600">{{ selectedEvaluation.work_quality }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-green-600 h-2 rounded-full" :style="{width: (selectedEvaluation.work_quality / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Productivity</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-purple-600">{{ selectedEvaluation.productivity }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-purple-600 h-2 rounded-full" :style="{width: (selectedEvaluation.productivity / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Communication</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-yellow-600">{{ selectedEvaluation.communication }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-yellow-600 h-2 rounded-full" :style="{width: (selectedEvaluation.communication / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teamwork</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-indigo-600">{{ selectedEvaluation.teamwork }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-indigo-600 h-2 rounded-full" :style="{width: (selectedEvaluation.teamwork / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Initiative</label>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-red-600">{{ selectedEvaluation.initiative }}/5</span>
                  <div class="ml-2 flex-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-red-600 h-2 rounded-full" :style="{width: (selectedEvaluation.initiative / 5 * 100) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
              <div class="flex items-center">
                <span class="text-3xl font-bold text-gray-900">{{ selectedEvaluation.overall_rating }}/5</span>
                <div class="ml-3">
                  <span class="px-3 py-1 rounded-full text-sm font-medium" 
                    :class="getRatingClass(selectedEvaluation.overall_rating)">
                    {{ getRatingText(selectedEvaluation.overall_rating) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="selectedEvaluation.overall_comments" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700 whitespace-pre-wrap">{{ selectedEvaluation.overall_comments }}</p>
              </div>
            </div>
            
            <div v-if="selectedEvaluation.reviewer" class="mt-4 pt-4 border-t">
              <label class="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
              <p class="text-gray-900">{{ selectedEvaluation.reviewer?.name }}</p>
              <p class="text-gray-500 text-sm">{{ selectedEvaluation.reviewer?.email }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeViewModal"
              class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-times mr-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import { saveAs } from 'file-saver'
import * as XLSX from '@e965/xlsx'

const toast = useToast()

const evaluations = ref([])
const employees = ref([])
const departments = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const showAutoCalculateModal = ref(false)
const isAutoCalculating = ref(false)
const showViewModal = ref(false)
const selectedEvaluation = ref(null)
const filter = ref('')
const statusFilter = ref('')

// Auto calculate form
const autoCalculateForm = ref({
  employee_id: '',
  review_period: ''
})
const departmentFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const form = ref({
  employee_id: '',
  review_period: '',
  job_knowledge: '',
  work_quality: '',
  productivity: '',
  communication: '',
  teamwork: '',
  initiative: '',
  overall_rating: '',
  overall_comments: '',
  review_date: '',
  goals_next_period: '',
  job_knowledge_comments: '',
  work_quality_comments: '',
  productivity_comments: '',
  communication_comments: '',
  teamwork_comments: '',
  initiative_comments: ''
})

const stats = computed(() => {
  return {
    totalEvaluations: evaluations.value.length,
    outstanding: evaluations.value.filter(e => e.overall_rating >= 4.5).length,
    meetsExpectations: evaluations.value.filter(e => e.overall_rating >= 3 && e.overall_rating < 4.5).length,
    needsImprovement: evaluations.value.filter(e => e.overall_rating < 3).length
  }
})

const filteredData = computed(() => {
  let result = evaluations.value
  
  if (filter.value) {
    const search = filter.value.toLowerCase()
    result = result.filter(e => 
      e.employee?.name?.toLowerCase().includes(search) ||
      e.employee?.email?.toLowerCase().includes(search) ||
      e.employee?.department?.name?.toLowerCase().includes(search) ||
      e.review_period?.toLowerCase().includes(search)
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(e => e.status === statusFilter.value)
  }
  
  if (departmentFilter.value) {
    result = result.filter(e => e.employee?.department?.name === departmentFilter.value)
  }
  
  return result
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredData.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

onMounted(async () => {
  await Promise.all([
    fetchData(),
    fetchEmployees(),
    fetchDepartments()
  ])
})

async function fetchDepartments() {
  try {
    const response = await axios.get('/api/all/departments')
    departments.value = response.data.departments || []
    console.log('Departments fetched:', departments.value)
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

async function fetchData() {
  isLoading.value = true
  try {
    const response = await axios.get('/api/performance/evaluations')
    evaluations.value = response.data.data || []
  } catch (error) {
    toast.error('Failed to fetch performance evaluations')
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

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

function openCreateDialog() {
  isEditing.value = false
  form.value = {
    employee_id: '',
    review_period: '',
    job_knowledge: '',
    work_quality: '',
    productivity: '',
    communication: '',
    teamwork: '',
    initiative: '',
    overall_rating: '',
    overall_comments: '',
    review_date: new Date().toISOString().split('T')[0],
    goals_next_period: '',
    job_knowledge_comments: '',
    work_quality_comments: '',
    productivity_comments: '',
    communication_comments: '',
    teamwork_comments: '',
    initiative_comments: ''
  }
  showModal.value = true
}

function editEvaluation(evaluation) {
  isEditing.value = true
  form.value = { ...evaluation }
  showModal.value = true
}

function viewEvaluation(evaluation) {
  // Show evaluation details in a modal
  selectedEvaluation.value = evaluation
  showViewModal.value = true
}

async function deleteEvaluation(id) {
  if (!confirm('Are you sure you want to delete this performance evaluation?')) {
    return
  }
  
  try {
    await axios.delete(`/api/performance/evaluations/${id}`)
    toast.success('Performance evaluation deleted successfully')
    await fetchData()
  } catch (error) {
    toast.error('Failed to delete performance evaluation')
    console.error('Error:', error)
  }
}

async function submitEvaluation() {
  try {
    console.log('Submitting form data:', form.value)
    
    // Validate required fields
    const requiredFields = [
      'employee_id', 'review_period', 'job_knowledge', 'work_quality', 
      'productivity', 'communication', 'teamwork', 'initiative', 
      'overall_rating', 'overall_comments', 'review_date'
    ]
    
    const missingFields = requiredFields.filter(field => !form.value[field] || form.value[field] === '')
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      console.error('Missing fields:', missingFields)
      return
    }
    
    // Convert rating fields to integers for validation
    const submissionData = {
      ...form.value,
      job_knowledge: parseInt(form.value.job_knowledge),
      work_quality: parseInt(form.value.work_quality),
      productivity: parseInt(form.value.productivity),
      communication: parseInt(form.value.communication),
      teamwork: parseInt(form.value.teamwork),
      initiative: parseInt(form.value.initiative),
      overall_rating: parseInt(form.value.overall_rating)
    }
    
    console.log('Processed submission data:', submissionData)
    
    if (isEditing.value) {
      await axios.put(`/api/performance/evaluations/${form.value.id}`, submissionData)
      toast.success('Performance evaluation updated successfully')
    } else {
      console.log('Creating new evaluation with data:', submissionData)
      const response = await axios.post('/api/performance/evaluations', submissionData)
      console.log('Create response:', response.data)
      toast.success('Performance evaluation created successfully')
    }
    
    closeModal()
    await fetchData()
  } catch (error) {
    console.error('Submit error:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
      toast.error(`Failed: ${error.response.data.message || 'Unknown error'}`)
    } else {
      toast.error('Failed to save performance evaluation')
    }
  }
}

function closeModal() {
  showModal.value = false
  isEditing.value = false
  form.value = {
    employee_id: '',
    review_period: '',
    job_knowledge: '',
    work_quality: '',
    productivity: '',
    communication: '',
    teamwork: '',
    initiative: '',
    overall_rating: '',
    overall_comments: '',
    review_date: '',
    goals_next_period: '',
    job_knowledge_comments: '',
    work_quality_comments: '',
    productivity_comments: '',
    communication_comments: '',
    teamwork_comments: '',
    initiative_comments: ''
  }
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getStatusClass(status) {
  const classes = {
    outstanding: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    meets_expectations: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    needs_improvement: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
  }
  return classes[status] || classes.pending
}

function formatStatus(status) {
  return status ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Pending'
}

function closeViewModal() {
  showViewModal.value = false
  selectedEvaluation.value = null
}

function getRatingClass(rating) {
  if (rating >= 4.5) return 'bg-green-100 text-green-800'
  if (rating >= 3.5) return 'bg-blue-100 text-blue-800'
  if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getRatingText(rating) {
  if (rating >= 4.5) return 'Outstanding'
  if (rating >= 3.5) return 'Exceeds Expectations'
  if (rating >= 2.5) return 'Meets Expectations'
  if (rating >= 1.5) return 'Needs Improvement'
  return 'Unsatisfactory'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

async function exportToExcel() {
  try {
    const data = filteredData.value.map((e, index) => ({
      'No': index + 1,
      'Employee Name': e.employee?.name || 'N/A',
      'Department': e.employee?.department?.name || e.employee?.department_id || 'N/A',
      'Review Period': e.review_period,
      'Overall Rating': e.overall_rating,
      'Status': formatStatus(e.status),
      'Review Date': formatDate(e.review_date),
      'Comments': e.overall_comments || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance Evaluations')
    
    XLSX.writeFile(workbook, `Performance_Evaluations_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel file exported successfully')
  } catch (error) {
    toast.error('Failed to export to Excel')
    console.error('Error:', error)
  }
}

function openAutoCalculateDialog() {
  showAutoCalculateModal.value = true
  autoCalculateForm.value = {
    employee_id: '',
    review_period: ''
  }
}

function closeAutoCalculateModal() {
  showAutoCalculateModal.value = false
  autoCalculateForm.value = {
    employee_id: '',
    review_period: ''
  }
}

async function submitAutoCalculate() {
  isAutoCalculating.value = true
  try {
    const response = await axios.post('/api/performance/auto-calculate', autoCalculateForm.value)
    
    if (response.data.status) {
      toast.success('Performance evaluation auto-calculated successfully!')
      closeAutoCalculateModal()
      await fetchData() // Refresh the data
    } else {
      toast.error(response.data.message || 'Failed to auto-calculate performance')
    }
  } catch (error) {
    toast.error('Failed to auto-calculate performance')
    console.error('Error:', error)
  } finally {
    isAutoCalculating.value = false
  }
}
</script>
