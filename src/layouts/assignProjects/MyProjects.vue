<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Project Assignments
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Manage and track your assigned projects
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {{ filteredProjects.length }} Projects
            </span>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search projects, assigners, status..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <button
              @click="exportToExcel"
              class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <i class="fas fa-file-excel mr-2"></i>
              Export Excel
            </button>
            <button
              @click="exportToPDF"
              class="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <i class="fas fa-file-pdf mr-2"></i>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  #
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Project Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Assigned By
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Timeline
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Contract
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(project, index) in paginatedProjects"
                :key="project.project_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openProjectModal(project.project_id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    {{ project.project_name || 'NA' }}
                  </button>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ID: {{ project.project_id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span class="text-white text-xs font-bold">
                        {{ (project.created_by || 'NA').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ project.created_by || 'NA' }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(project.created_at) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-100">
                    <div class="flex items-center mb-1">
                      <i class="fas fa-play text-green-500 text-xs mr-2"></i>
                      {{ formatDate(project.start_date) }}
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-stop text-red-500 text-xs mr-2"></i>
                      {{ formatDate(project.end_date) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    v-if="project.contract?.pdf_file"
                    @click="downloadFile(project.contract.pdf_file)"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm"
                  >
                    <i class="fas fa-download mr-2 text-xs"></i>
                    Contract
                  </button>
                  <span v-else class="text-gray-400 dark:text-gray-500 text-sm">No Contract</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': project.project_status === 'on-progress',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': project.project_status === 'completed',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': project.project_status === 'failed',
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': !project.project_status || project.project_status === 'NA'
                    }"
                    class="px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-full"
                  >
                    <span
                      :class="{
                        'bg-yellow-500': project.project_status === 'on-progress',
                        'bg-green-500': project.project_status === 'completed',
                        'bg-red-500': project.project_status === 'failed',
                        'bg-gray-500': !project.project_status || project.project_status === 'NA'
                      }"
                      class="w-2 h-2 rounded-full mr-2"
                    ></span>
                    {{ project.project_status || 'NA' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="editProject(project.project_id)"
                    class="inline-flex items-center justify-center w-9 h-9 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    title="Edit Project"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedProjects.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <i class="fas fa-inbox text-gray-300 dark:text-gray-600 text-5xl mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">No projects found</p>
                    <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProjects.length) }}</span>
              of
              <span class="font-medium">{{ filteredProjects.length }}</span>
              results
            </div>
            <div class="flex items-center space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i class="fas fa-chevron-left mr-2"></i>
                Previous
              </button>
              <div class="hidden sm:flex items-center space-x-1">
                <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
                  Page {{ currentPage }} of {{ Math.ceil(filteredProjects.length / itemsPerPage) || 1 }}
                </span>
              </div>
              <button
                :disabled="currentPage * itemsPerPage >= filteredProjects.length"
                @click="changePage(currentPage + 1)"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <i class="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Modal for Project Details -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeProjectModal"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80"></div>

          <!-- Modal panel -->
          <div class="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-project-diagram text-white"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Project Details</h2>
                    <p class="text-blue-100 text-sm">Complete project information</p>
                  </div>
                </div>
                <button
                  @click="closeProjectModal"
                  class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div v-if="selectedProject" class="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <!-- Project Overview -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                  Project Overview
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.project_name || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project ID</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.project_id || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</label>
                    <p class="mt-1">
                      <span
                        :class="{
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': selectedProject.project_status === 'on-progress',
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': selectedProject.project_status === 'completed',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': selectedProject.project_status === 'failed'
                        }"
                        class="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full"
                      >
                        {{ selectedProject.project_status || 'NA' }}
                      </span>
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned By</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.created_by || 'NA' }}</p>
                  </div>
                </div>
              </div>

              <!-- Team Information -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-users text-blue-500 mr-2"></i>
                  Team Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.user?.name || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team Members</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {{ selectedProject.members?.length ? selectedProject.members.join(', ') : 'NA' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Timeline -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-calendar-alt text-blue-500 mr-2"></i>
                  Timeline
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.start_date) || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.end_date) || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extended Date</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.extended_date) || 'NA' }}</p>
                  </div>
                </div>
              </div>

              <!-- Contract Details -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-file-contract text-blue-500 mr-2"></i>
                  Contract Details
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract Title</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.contract?.title || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timeline Category</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.contract?.time_line_category || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract Start</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.contract?.start_date) || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract End</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.contract?.end_date) || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract Status</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.contract?.status || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance Guarantee</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.contract?.performance_guarantee || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 md:col-span-2">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract PDF</label>
                    <div class="mt-2">
                      <button
                        v-if="selectedProject.contract?.pdf_file"
                        @click="downloadFile(selectedProject.contract.pdf_file)"
                        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <i class="fas fa-download mr-2"></i>
                        Download Contract
                      </button>
                      <span v-else class="text-gray-400 dark:text-gray-500 text-sm">No contract available</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tender Information -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-gavel text-blue-500 mr-2"></i>
                  Tender Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender Type</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.tender?.tender_type || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tender Attachment</label>
                    <div class="mt-2">
                      <button
                        v-if="selectedProject.tender?.attachment"
                        @click="downloadFile(selectedProject.tender.attachment)"
                        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <i class="fas fa-download mr-2"></i>
                        Download Attachment
                      </button>
                      <span v-else class="text-gray-400 dark:text-gray-500 text-sm">No attachment available</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i class="fas fa-clipboard-list text-blue-500 mr-2"></i>
                  Additional Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Follow Up</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedProject.follow_up || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.created_at) || 'NA' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</label>
                    <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedProject.updated_at) || 'NA' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
              <button
                @click="closeProjectModal"
                class="px-6 py-2.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 font-medium transition-colors"
              >
                Close
              </button>
              <button
                @click="editProject(selectedProject.project_id); closeProjectModal();"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const toast = useToast();

const projects = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showModal = ref(false);
const selectedProject = ref(null);

// Fetch data when component is mounted
onMounted(async () => {
  await fetchProjects();
});

// Fetch projects data
async function fetchProjects() {
  try {
    const response = await axios.get('api/my/projects');
    projects.value = response.data.data.map(project => ({
      project_id: project.project_id,
      project_name: project.project_name || 'NA',
      user: project.user || { name: 'NA' },
      members: project.members || [],
      created_by: project.created_by || 'NA',
      start_date: project.start_date || 'NA',
      end_date: project.end_date || 'NA',
      extended_date: project.extended_date || 'NA',
      project_status: project.project_status || 'NA',
      contract: project.contract || {
        title: 'NA',
        time_line_category: 'NA',
        start_date: 'NA',
        end_date: 'NA',
        pdf_file: 'NA',
        status: 'NA',
        performance_guarantee: 'NA'
      },
      tender: project.tender || {
        tender_type: 'NA',
        attachment: 'NA'
      },
      follow_up: project.follow_up || 'NA',
      created_at: project.created_at || 'NA',
      updated_at: project.updated_at || 'NA'
    }));
  } catch (error) {
    handleError(error);
  }
}

// Open modal and set selected project
async function openProjectModal(projectId) {
  try {
    const project = projects.value.find(p => p.project_id === projectId);
    if (project) {
      selectedProject.value = project;
      showModal.value = true;
    } else {
      toast.error('Project not found');
    }
  } catch (error) {
    handleError(error);
  }
}

// Close modal
function closeProjectModal() {
  showModal.value = false;
  selectedProject.value = null;
}

// Format date to a readable format
function formatDate(date) {
  if (!date || date === 'NA') return 'NA';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Navigate to edit project page
function editProject(projectId) {
  router.push({ name: 'AcceptAssignedProject', params: { project_id: projectId } });
}

// Computed property to filter the projects
const filteredProjects = computed(() => {
  return projects.value.filter(entry =>
    (entry.project_name || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.created_by || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.project_status || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.contract?.title || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.tender?.tender_type || 'NA').toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Computed property for paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProjects.value.slice(start, start + itemsPerPage.value);
});

// Change the current page
function changePage(page) {
  if (page > 0 && page <= Math.ceil(filteredProjects.value.length / itemsPerPage.value)) {
    currentPage.value = page;
  }
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.response.statusText;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Export filtered projects data to Excel
function exportToExcel() {
  try {
    const exportData = filteredProjects.value.map((project, index) => ({
      No: index + 1,
      'Project Name': project.project_name,
      'Engineer': project.user?.name || 'NA',
      'Team Members': project.members?.length ? project.members.join(', ') : 'NA',
      'Assigned By': project.created_by,
      'Start Date': formatDate(project.start_date),
      'End Date': formatDate(project.end_date),
      'Extended Date': formatDate(project.extended_date),
      'Project Status': project.project_status,
      'Contract Title': project.contract?.title || 'NA',
      'Contract Timeline Category': project.contract?.time_line_category || 'NA',
      'Contract Start Date': formatDate(project.contract?.start_date) || 'NA',
      'Contract End Date': formatDate(project.contract?.end_date) || 'NA',
      'Contract PDF': project.contract?.pdf_file || 'NA',
      'Contract Status': project.contract?.status || 'NA',
      'Performance Guarantee': project.contract?.performance_guarantee || 'NA',
      'Tender Type': project.tender?.tender_type || 'NA',
      'Tender Attachment': project.tender?.attachment || 'NA',
      'Created At': formatDate(project.created_at),
      'Updated At': formatDate(project.updated_at),
      'Follow Up': project.follow_up
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Assignments');
    XLSX.writeFile(workbook, 'ProjectAssignments.xlsx');
    toast.success('Excel file exported successfully!');
  } catch (error) {
    handleError(error);
  }
}

// Export filtered projects data to PDF
function exportToPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Project Assignments Report', 14, 15);
    
    // Add metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text(`Total Projects: ${filteredProjects.value.length}`, 14, 27);
    
    const tableData = filteredProjects.value.map((project, index) => [
      index + 1,
      project.project_name,
      project.user?.name || 'NA',
      project.created_by,
      formatDate(project.start_date),
      formatDate(project.end_date),
      project.project_status
    ]);
    
    autoTable(doc, {
      startY: 32,
      head: [['#', 'Project Name', 'Engineer', 'Assigned By', 'Start Date', 'End Date', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      margin: { top: 32 }
    });
    
    doc.save('ProjectAssignments.pdf');
    toast.success('PDF exported successfully!');
  } catch (error) {
    handleError(error);
  }
}

// Download file from URL
function downloadFile(url) {
  if (url && url !== 'NA') {
    saveAs(url);
    toast.success('Download started!');
  } else {
    toast.error('No file available for download');
  }
}
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .inline-block,
.modal-leave-active .inline-block {
  transition: all 0.3s ease;
}

.modal-enter-from .inline-block,
.modal-leave-to .inline-block {
  transform: scale(0.95);
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>