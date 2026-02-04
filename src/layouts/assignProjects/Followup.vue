<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Professional Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Project Portfolio</h1>
            <p class="text-gray-600 dark:text-gray-300">Manage and track all your projects</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
              {{ filteredProjects.length }} Projects
            </span>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Search Input -->
          <div class="relative flex-1 w-full sm:max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filter"
              placeholder="Search projects, engineers, status..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          <!-- Export Buttons -->
          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-file-excel"></i>
              <span class="hidden sm:inline">Export Excel</span>
            </button>
            <button
              @click="exportToPDF"
              class="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-file-pdf"></i>
              <span class="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold">No</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Project Name</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Engineer</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Created By</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Timeline</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Contract</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Follow Up</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(project, index) in paginatedProjects"
                :key="project.project_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openProjectModal(project.project_id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    {{ project.project_name || 'NA' }}
                  </button>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-blue-600 dark:text-blue-400 text-xs"></i>
                    </div>
                    {{ project.user?.name || 'NA' }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ project.created_by || 'NA' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1 text-xs">
                      <i class="fas fa-calendar-alt text-gray-400"></i>
                      <span>{{ formatDate(project.start_date) }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs">
                      <i class="fas fa-calendar-check text-gray-400"></i>
                      <span>{{ formatDate(project.end_date) }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ project.contract?.title || 'NA' }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': project.project_status === 'on-progress',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': project.project_status === 'completed',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': project.project_status === 'failed',
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': !project.project_status || project.project_status === 'NA'
                    }"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span class="w-2 h-2 rounded-full" :class="{
                      'bg-yellow-500': project.project_status === 'on-progress',
                      'bg-green-500': project.project_status === 'completed',
                      'bg-red-500': project.project_status === 'failed'
                    }"></span>
                    {{ project.project_status || 'NA' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ project.follow_up || 'NA' }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="project.project_status !== 'completed' ? editProject(project.project_id) : null"
                    :disabled="project.project_status === 'completed'"
                    :class="{
                      'text-blue-600 hover:text-blue-800 cursor-pointer': project.project_status !== 'completed',
                      'text-gray-400 cursor-not-allowed': project.project_status === 'completed'
                    }"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    :title="project.project_status === 'completed' ? 'Cannot edit completed project' : 'Edit project'"
                  >
                    <i class="fas fa-edit text-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="filteredProjects.length === 0" class="text-center py-12">
            <i class="fas fa-folder-open text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400 text-lg">No projects found</p>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
              {{ Math.min(currentPage * itemsPerPage, filteredProjects.length) }} 
              of {{ filteredProjects.length }} projects
            </div>
            <div class="flex items-center gap-2">
              <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                :disabled="currentPage >= totalPages"
                @click="changePage(currentPage + 1)"
                class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Modal -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeProjectModal"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80"></div>

          <!-- Modal panel -->
          <div class="relative inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-2xl shadow-2xl sm:my-8 sm:align-middle">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-project-diagram text-white text-lg"></i>
                  </div>
                  <h3 class="text-xl font-bold text-white">Project Details</h3>
                </div>
                <button
                  @click="closeProjectModal"
                  class="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div v-if="selectedProject" class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Project Information -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-info-circle text-blue-600"></i>
                    Project Information
                  </h4>
                  <div class="space-y-3">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Name</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.project_name || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project ID</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.project_id || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</span>
                      <span
                        :class="{
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': selectedProject.project_status === 'on-progress',
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': selectedProject.project_status === 'completed',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': selectedProject.project_status === 'failed'
                        }"
                        class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 w-fit mt-1"
                      >
                        {{ selectedProject.project_status || 'NA' }}
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Follow Up</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.follow_up || 'NA' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Team Information -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-users text-blue-600"></i>
                    Team Information
                  </h4>
                  <div class="space-y-3">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lead Engineer</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.user?.name || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Team Members</span>
                      <div v-if="selectedProject.members?.length" class="mt-2 space-y-1">
                        <span
                          v-for="(member, idx) in selectedProject.members"
                          :key="idx"
                          class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-xs mr-1 mb-1"
                        >
                          {{ member }}
                        </span>
                      </div>
                      <span v-else class="text-sm font-medium text-gray-900 dark:text-white mt-1">NA</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created By</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.created_by || 'NA' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Timeline -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-calendar-alt text-blue-600"></i>
                    Timeline
                  </h4>
                  <div class="space-y-3">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Date</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(selectedProject.start_date) || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(selectedProject.end_date) || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Extended Date</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(selectedProject.extended_date) || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created At</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(selectedProject.created_at) || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Updated At</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(selectedProject.updated_at) || 'NA' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Contract Information -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-file-contract text-blue-600"></i>
                    Contract Details
                  </h4>
                  <div class="space-y-3">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contract Title</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.contract?.title || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Timeline Category</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.contract?.time_line_category || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contract Period</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {{ formatDate(selectedProject.contract?.start_date) || 'NA' }} - {{ formatDate(selectedProject.contract?.end_date) || 'NA' }}
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contract Status</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.contract?.status || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Performance Guarantee</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.contract?.performance_guarantee || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contract Document</span>
                      <button
                        v-if="selectedProject.contract?.pdf_file && selectedProject.contract?.pdf_file !== 'NA'"
                        @click="downloadFile(selectedProject.contract.pdf_file)"
                        class="mt-1 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        <i class="fas fa-download"></i>
                        Download Contract
                      </button>
                      <span v-else class="text-sm font-medium text-gray-900 dark:text-white mt-1">NA</span>
                    </div>
                  </div>
                </div>

                <!-- Tender Information -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 md:col-span-2">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i class="fas fa-clipboard-list text-blue-600"></i>
                    Tender Information
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tender Type</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ selectedProject.tender?.tender_type || 'NA' }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tender Attachment</span>
                      <button
                        v-if="selectedProject.tender?.attachment && selectedProject.tender?.attachment !== 'NA'"
                        @click="downloadFile(selectedProject.tender.attachment)"
                        class="mt-1 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium w-fit"
                      >
                        <i class="fas fa-download"></i>
                        Download Attachment
                      </button>
                      <span v-else class="text-sm font-medium text-gray-900 dark:text-white mt-1">NA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-end">
                <button
                  @click="closeProjectModal"
                  class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
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
const itemsPerPage = 10;
const showModal = ref(false);
const selectedProject = ref(null);

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage) || 1;
});

// Fetch data when component is mounted
onMounted(async () => {
  await fetchProjects();
});

// Fetch projects data from the API
async function fetchProjects() {
  try {
    const response = await axios.get('api/projects');
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
  router.push({ name: 'UpdateFollowup', params: { project_id: projectId } });
}

// Computed property to filter the projects
const filteredProjects = computed(() => {
  return projects.value.filter(entry =>
    (entry.project_name || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.created_by || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.project_status || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.contract?.title || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.follow_up || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.user?.name || 'NA').toLowerCase().includes(filter.value.toLowerCase()) ||
    (entry.tender?.tender_type || 'NA').toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Computed property for paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProjects.value.slice(start, start + itemsPerPage);
});

// Change page function
function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
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
    message = 'No response from server';
  }
  toast.error(message);
}

// Export to Excel
function exportToExcel() {
  const exportData = filteredProjects.value.map((project, index) => ({
    'No': index + 1,
    'Project Name': project.project_name,
    'Engineer': project.user?.name || 'NA',
    'Team Members': project.members?.length ? project.members.join(', ') : 'NA',
    'Created By': project.created_by,
    'Start Date': formatDate(project.start_date),
    'End Date': formatDate(project.end_date),
    'Extended Date': formatDate(project.extended_date),
    'Status': project.project_status,
    'Contract Title': project.contract?.title || 'NA',
    'Timeline Category': project.contract?.time_line_category || 'NA',
    'Contract Start': formatDate(project.contract?.start_date) || 'NA',
    'Contract End': formatDate(project.contract?.end_date) || 'NA',
    'Contract Status': project.contract?.status || 'NA',
    'Performance Guarantee': project.contract?.performance_guarantee || 'NA',
    'Tender Type': project.tender?.tender_type || 'NA',
    'Follow Up': project.follow_up,
    'Created At': formatDate(project.created_at),
    'Updated At': formatDate(project.updated_at)
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Auto-size columns
  const cols = Object.keys(exportData[0] || {}).map(() => ({ wch: 15 }));
  ws['!cols'] = cols;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Project Portfolio');
  XLSX.writeFile(wb, `Project_Portfolio_${new Date().toISOString().split('T')[0]}.xlsx`);
  
  toast.success('Excel file exported successfully!');
}

// Professional PDF Export
function exportToPDF() {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Add company header
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Background
  doc.setFillColor(37, 99, 235); // Blue color
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Company Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Portfolio Report', 15, 15);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Comprehensive Project Management Overview', 15, 22);

  // Date and metadata
  doc.setFontSize(9);
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated: ${today}`, 15, 28);
  doc.text(`Total Projects: ${filteredProjects.value.length}`, pageWidth - 15, 28, { align: 'right' });

  // Prepare table data
  const tableData = filteredProjects.value.map((project, index) => [
    index + 1,
    project.project_name,
    project.user?.name || 'NA',
    project.created_by,
    formatDate(project.start_date),
    formatDate(project.end_date),
    project.project_status,
    project.contract?.title || 'NA',
    project.follow_up
  ]);

  // Professional table styling
  autoTable(doc, {
    head: [['No', 'Project Name', 'Engineer', 'Created By', 'Start Date', 'End Date', 'Status', 'Contract', 'Follow Up']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [220, 220, 220]
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 22, halign: 'center' },
      7: { cellWidth: 30 },
      8: { cellWidth: 25 }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: function(data) {
      // Footer
      const footerY = pageHeight - 10;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
      );
      
      // Add a separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
    }
  });

  // Add summary page if there are many projects
  if (filteredProjects.value.length > 0) {
    doc.addPage();
    
    // Summary header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Summary Statistics', 15, 15);

    // Calculate statistics
    const totalProjects = filteredProjects.value.length;
    const completedProjects = filteredProjects.value.filter(p => p.project_status === 'completed').length;
    const onProgressProjects = filteredProjects.value.filter(p => p.project_status === 'on-progress').length;
    const failedProjects = filteredProjects.value.filter(p => p.project_status === 'failed').length;

    // Summary statistics
    let yPos = 40;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const stats = [
      { label: 'Total Projects:', value: totalProjects, color: [37, 99, 235] },
      { label: 'Completed Projects:', value: completedProjects, color: [34, 197, 94] },
      { label: 'In Progress Projects:', value: onProgressProjects, color: [234, 179, 8] },
      { label: 'Failed Projects:', value: failedProjects, color: [239, 68, 68] }
    ];

    stats.forEach(stat => {
      doc.setTextColor(100, 100, 100);
      doc.text(stat.label, 15, yPos);
      doc.setTextColor(...stat.color);
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value.toString(), 80, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 10;
    });
  }

  // Save the PDF
  doc.save(`Project_Portfolio_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  
  toast.success('PDF report generated successfully!');
}

// Download file from URL
function downloadFile(url) {
  if (url && url !== 'NA') {
    window.open(url, '_blank');
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

/* Scrollbar styling */
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

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>