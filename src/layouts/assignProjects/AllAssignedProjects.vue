<template>
  <div class="min-h-screen p-6 bg-gray-50" style="font-family: 'cygre', sans-serif;">
    <div class="mx-auto max-w-7xl">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Assigned Projects</h1>
            <p class="mt-1 text-sm text-gray-600">Track and manage all assigned engineering projects</p>
          </div>
          <router-link to="/assign-project">
            <button 
              class="inline-flex items-center gap-2 px-6 py-3 text-white transition-all rounded-lg shadow-sm hover:shadow-md hover:opacity-90"
              style="background-color: #2e4053;"
            >
              <i class="fas fa-plus"></i>
              <span class="font-medium">Assign New Project</span>
            </button>
          </router-link>
        </div>
      </div>

      <!-- Filters and Actions Bar -->
      <div class="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search Input -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i class="text-gray-400 fas fa-search"></i>
              </div>
              <input
                type="text"
                v-model="filter"
                placeholder="Search projects, engineers, status..."
                class="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button 
              @click="exportToExcel" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Export to Excel"
            >
              <i class="text-green-600 fas fa-file-excel"></i>
              <span class="hidden sm:inline">Export Excel</span>
            </button>

            <button 
              @click="exportToPDF" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Export to PDF"
            >
              <i class="text-red-600 fas fa-file-pdf"></i>
              <span class="hidden sm:inline">Export PDF</span>
            </button>

            <button 
              @click="fetchProjects" 
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Showing <strong>{{ paginatedProjects.length }}</strong> of <strong>{{ filteredProjects.length }}</strong> projects
            <span v-if="filter" class="ml-2 text-blue-600">
              <i class="fas fa-filter"></i> Filtered from {{ projects.length }} total
            </span>
          </span>
          <span class="text-gray-500">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
      </div>

      <!-- Projects Table -->
      <div class="overflow-hidden bg-white rounded-lg shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">#</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Project Name</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Lead Engineer</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Assigned By</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Timeline</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Contract</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Follow Up</th>
                <th scope="col" class="px-4 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="9" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-4xl text-gray-400 fas fa-spinner fa-spin"></i>
                    <p class="text-gray-600">Loading projects...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="paginatedProjects.length === 0">
                <td colspan="9" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="text-5xl text-gray-300 fas fa-project-diagram"></i>
                    <p class="text-lg font-medium text-gray-900">No projects found</p>
                    <p class="text-sm text-gray-600">
                      {{ filter ? 'Try adjusting your search criteria' : 'Get started by assigning your first project' }}
                    </p>
                    <router-link 
                      v-if="!filter" 
                      to="/assign-project"
                      class="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition-all rounded-lg shadow-sm hover:opacity-90"
                      style="background-color: #2e4053;"
                    >
                      <i class="fas fa-plus"></i>
                      Assign New Project
                    </router-link>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr 
                v-else
                v-for="(project, index) in paginatedProjects" 
                :key="project.project_id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="px-4 py-4 text-sm">
                  <button 
                    @click="openProjectModal(project.project_id)" 
                    class="font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                  >
                    {{ project.project_name }}
                  </button>
                  <div v-if="project.members && project.members.length > 0" class="mt-1 text-xs text-gray-500">
                    <i class="fas fa-users"></i> {{ project.members.length }} team member(s)
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      {{ getInitials(project.user?.name) }}
                    </div>
                    <span>{{ project.user?.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {{ project.created_by }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-xs text-gray-500">Start: {{ formatDate(project.start_date) }}</span>
                    <span class="text-xs text-gray-500">End: {{ formatDate(project.end_date) }}</span>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate">{{ project.contract?.title }}</div>
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <span 
                    class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(project.project_status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(project.project_status)"></span>
                    {{ formatStatus(project.project_status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600">
                  {{ project.follow_up }}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="openProjectModal(project.project_id)"
                      class="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="editProject(project.project_id)"
                      class="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                      title="Edit Project"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex flex-col items-center justify-between gap-4 mt-6 sm:flex-row">
        <div class="text-sm text-gray-600">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProjects.length }} results
        </div>
        
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-chevron-left"></i>
            <span class="hidden sm:inline">Previous</span>
          </button>

          <!-- Page Numbers -->
          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                currentPage === page
                  ? 'text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
              :style="currentPage === page ? 'background-color: #2e4053;' : ''"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Next</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-4 text-xs text-center text-gray-500">
        Last updated: {{ lastUpdated }}
      </div>
    </div>

    <!-- Enhanced Project Details Modal -->
    <Teleport to="body">
      <div 
        v-if="showModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="closeProjectModal"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200" style="background-color: #283747;">
            <div class="flex items-center gap-3">
              <i class="text-white fas fa-project-diagram"></i>
              <h2 class="text-xl font-semibold text-white">Project Details</h2>
            </div>
            <button 
              @click="closeProjectModal" 
              class="text-white transition-colors hover:text-gray-200"
            >
              <i class="text-xl fas fa-times"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div v-if="selectedProject" class="p-6 overflow-y-auto">
            <!-- Project Information -->
            <div class="mb-6">
              <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
                <i class="text-blue-600 fas fa-info-circle"></i>
                Project Information
              </h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Project Name</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.project_name }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Project ID</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.project_id }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Status</p>
                  <span 
                    class="inline-flex items-center gap-1.5 px-3 py-1 mt-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(selectedProject.project_status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(selectedProject.project_status)"></span>
                    {{ formatStatus(selectedProject.project_status) }}
                  </span>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Follow Up</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.follow_up }}</p>
                </div>
              </div>
            </div>

            <!-- Team Information -->
            <div class="mb-6">
              <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
                <i class="text-green-600 fas fa-users"></i>
                Team Information
              </h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Lead Engineer</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      {{ getInitials(selectedProject.user?.name) }}
                    </div>
                    <p class="text-sm font-semibold text-gray-900">{{ selectedProject.user?.name }}</p>
                  </div>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Assigned By</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.created_by }}</p>
                </div>
                <div class="col-span-full p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="mb-2 text-xs font-medium text-gray-500">Team Members ({{ selectedProject.members?.length || 0 }})</p>
                  <div v-if="selectedProject.members && selectedProject.members.length > 0" class="flex flex-wrap gap-2">
                    <span 
                      v-for="(member, idx) in selectedProject.members" 
                      :key="idx"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg"
                    >
                      <i class="fas fa-user"></i>
                      {{ member }}
                    </span>
                  </div>
                  <p v-else class="text-sm text-gray-500">No team members assigned</p>
                </div>
              </div>
            </div>

            <!-- Timeline Information -->
            <div class="mb-6">
              <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
                <i class="text-purple-600 fas fa-calendar-alt"></i>
                Timeline
              </h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Start Date</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.start_date) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">End Date</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.end_date) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Extended Date</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.extended_date) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Created At</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.created_at) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Updated At</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.updated_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Contract Information -->
            <div class="mb-6">
              <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
                <i class="text-orange-600 fas fa-file-contract"></i>
                Contract Details
              </h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Contract Title</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.contract?.title }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Timeline Category</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatTimelineCategory(selectedProject.contract?.time_line_category) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Contract Start</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.contract?.start_date) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Contract End</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatDate(selectedProject.contract?.end_date) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Contract Status</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ formatStatus(selectedProject.contract?.status) }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Performance Guarantee</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.contract?.performance_guarantee }}%</p>
                </div>
                <div class="col-span-full p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Contract Document</p>
                  <button
                    v-if="selectedProject.contract?.pdf_file && selectedProject.contract.pdf_file !== 'NA'"
                    @click="downloadFile(selectedProject.contract.pdf_file)"
                    class="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition-colors rounded-lg hover:opacity-90"
                    style="background-color: #27ae60;"
                  >
                    <i class="fas fa-download"></i>
                    Download Contract PDF
                  </button>
                  <p v-else class="mt-1 text-sm text-gray-500">No contract document available</p>
                </div>
              </div>
            </div>

            <!-- Tender Information -->
            <div>
              <h3 class="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-900 uppercase">
                <i class="text-indigo-600 fas fa-folder-open"></i>
                Tender Information
              </h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Tender Type</p>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ selectedProject.tender?.tender_type }}</p>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p class="text-xs font-medium text-gray-500">Tender Attachment</p>
                  <button
                    v-if="selectedProject.tender?.attachment && selectedProject.tender.attachment !== 'NA'"
                    @click="downloadFile(selectedProject.tender.attachment)"
                    class="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white transition-colors rounded-lg hover:opacity-90"
                    style="background-color: #27ae60;"
                  >
                    <i class="fas fa-download"></i>
                    Download Attachment
                  </button>
                  <p v-else class="mt-1 text-sm text-gray-500">No attachment available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              @click="closeProjectModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              @click="editProject(selectedProject.project_id); closeProjectModal();"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
              style="background-color: #2e4053;"
            >
              <i class="mr-2 fas fa-edit"></i>
              Edit Project
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
const isLoading = ref(false);
const lastUpdated = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  await fetchProjects();
});

async function fetchProjects() {
  isLoading.value = true;
  try {
    const response = await axios.get('api/projects');
    projects.value = response.data.data.map(project => ({
      project_id: project.project_id,
      project_name: project.project_name || 'N/A',
      user: project.user || { name: 'N/A' },
      members: project.members || [],
      created_by: project.created_by || 'N/A',
      start_date: project.start_date || 'N/A',
      end_date: project.end_date || 'N/A',
      extended_date: project.extended_date || 'N/A',
      project_status: project.project_status || 'N/A',
      contract: project.contract || { 
        title: 'N/A',
        time_line_category: 'N/A',
        start_date: 'N/A',
        end_date: 'N/A',
        pdf_file: 'N/A',
        status: 'N/A',
        performance_guarantee: 'N/A'
      },
      tender: project.tender || { 
        tender_type: 'N/A',
        attachment: 'N/A'
      },
      follow_up: project.follow_up || 'N/A',
      created_at: project.created_at || 'N/A',
      updated_at: project.updated_at || 'N/A'
    }));
    updateLastUpdated();
    toast.success('Projects loaded successfully');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Utility Functions
function getInitials(name) {
  if (!name || name === 'N/A') return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date) {
  if (!date || date === 'N/A') return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return date;
  }
}

function formatStatus(status) {
  if (!status || status === 'N/A') return 'N/A';
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTimelineCategory(category) {
  if (!category || category === 'N/A') return 'N/A';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getStatusClass(status) {
  const classes = {
    'on-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function getStatusDotClass(status) {
  const classes = {
    'on-progress': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'failed': 'bg-red-500'
  };
  return classes[status] || 'bg-gray-500';
}

function updateLastUpdated() {
  const now = new Date();
  lastUpdated.value = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Computed Properties
const filteredProjects = computed(() => {
  if (!filter.value) return projects.value;
  
  const searchText = filter.value.toLowerCase();
  return projects.value.filter(entry =>
    (entry.project_name || 'N/A').toLowerCase().includes(searchText) ||
    (entry.created_by || 'N/A').toLowerCase().includes(searchText) ||
    (entry.project_status || 'N/A').toLowerCase().includes(searchText) ||
    (entry.contract?.title || 'N/A').toLowerCase().includes(searchText) ||
    (entry.follow_up || 'N/A').toLowerCase().includes(searchText) ||
    (entry.tender?.tender_type || 'N/A').toLowerCase().includes(searchText) ||
    (entry.user?.name || 'N/A').toLowerCase().includes(searchText)
  );
});

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProjects.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, filteredProjects.value.length);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Modal Functions
function openProjectModal(projectId) {
  const project = projects.value.find(p => p.project_id === projectId);
  if (project) {
    selectedProject.value = project;
    showModal.value = true;
  } else {
    toast.error('Project not found');
  }
}

function closeProjectModal() {
  showModal.value = false;
  selectedProject.value = null;
}

// Navigation
function editProject(projectId) {
  router.push({ name: 'EditAssignedProject', params: { project_id: projectId } });
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Error Handling
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.response?.statusText) {
    message = error.response.statusText;
  } else if (error.request) {
    message = 'No response from server';
  } else if (error.message) {
    message = error.message;
  }
  toast.error(message);
  console.error('Error:', error);
}

// Export Functions
function exportToExcel() {
  try {
    const data = filteredProjects.value.map((project, index) => ({
      'No': index + 1,
      'Project Name': project.project_name,
      'Lead Engineer': project.user?.name || 'N/A',
      'Team Members': project.members?.length ? project.members.join(', ') : 'N/A',
      'Assigned By': project.created_by,
      'Start Date': formatDate(project.start_date),
      'End Date': formatDate(project.end_date),
      'Extended Date': formatDate(project.extended_date),
      'Status': formatStatus(project.project_status),
      'Contract Title': project.contract?.title || 'N/A',
      'Timeline Category': formatTimelineCategory(project.contract?.time_line_category) || 'N/A',
      'Contract Start': formatDate(project.contract?.start_date) || 'N/A',
      'Contract End': formatDate(project.contract?.end_date) || 'N/A',
      'Contract Status': formatStatus(project.contract?.status) || 'N/A',
      'Performance Guarantee': `${project.contract?.performance_guarantee || 'N/A'}%`,
      'Tender Type': project.tender?.tender_type || 'N/A',
      'Follow Up': project.follow_up,
      'Created At': formatDate(project.created_at),
      'Updated At': formatDate(project.updated_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
    
    // Auto-size columns
    const maxWidth = 50;
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.min(
        maxWidth,
        Math.max(
          key.length,
          ...data.map(row => String(row[key] || '').length)
        )
      )
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `Assigned_Projects_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel file exported successfully');
  } catch (error) {
    handleError(error);
  }
}

function exportToPDF() {
  try {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 55, 71);
    doc.text('Assigned Projects Report', 14, 15);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableData = filteredProjects.value.map((project, index) => [
      index + 1,
      project.project_name,
      project.user?.name || 'N/A',
      project.created_by,
      formatDate(project.start_date),
      formatDate(project.end_date),
      project.contract?.title || 'N/A',
      formatStatus(project.project_status),
      project.follow_up
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Project', 'Engineer', 'Assigned By', 'Start', 'End', 'Contract', 'Status', 'Follow Up']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [40, 55, 71],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 28 }
    });

    doc.save(`Assigned_Projects_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF file exported successfully');
  } catch (error) {
    handleError(error);
  }
}

function downloadFile(url) {
  if (url && url !== 'N/A') {
    try {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
        toast.success('File opened in new tab');
      } else {
        saveAs(url);
        toast.success('File download started');
      }
    } catch (error) {
      handleError(error);
    }
  } else {
    toast.error('No file available for download');
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: fadeIn 0.3s ease-out;
}

/* Smooth transitions */
button, a, input {
  transition: all 0.2s ease-in-out;
}

/* Table row hover effect */
tbody tr {
  transition: background-color 0.15s ease;
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
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>