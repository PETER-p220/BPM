<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Manage HR Attendance</h1>
            <p class="text-sm text-gray-600 mt-1">View, edit, and export attendance records</p>
          </div>
          
          <!-- Export Buttons -->
          <div class="flex gap-2">
            <button
              @click="exportToExcel"
              :disabled="isExporting || attendance.length === 0"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isExporting ? 'fas fa-spinner fa-spin' : 'fas fa-file-excel'"></i>
              <span class="hidden sm:inline">Export Excel</span>
            </button>
            
            <button
              @click="exportToPDF"
              :disabled="isExporting || attendance.length === 0"
              class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isExporting ? 'fas fa-spinner fa-spin' : 'fas fa-file-pdf'"></i>
              <span class="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label for="date_filter" class="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i class="fas fa-calendar text-gray-400"></i>
              </div>
              <input
                type="date"
                id="date_filter"
                v-model="filters.date"
                @change="fetchAttendance"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div class="flex-1">
            <label for="type_filter" class="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <div class="relative">
              <select
                id="type_filter"
                v-model="filters.type"
                @change="fetchAttendance"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="staff">👥 Staff Meeting</option>
                <option value="board">📊 Board Meeting</option>
                <option value="training">🎓 Training Session</option>
                <option value="review">⭐ Performance Review</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <i class="fa fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <i class="fas fa-times"></i>
              <span>Clear</span>
            </button>
          </div>
        </div>
        
        <div v-if="filters.date || filters.type" class="mt-3 text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-900">{{ attendance.length }}</span> record(s)
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Loading attendance records...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="attendance.length === 0" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <i class="fas fa-users text-6xl text-gray-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Attendance Records</h3>
          <p class="text-gray-600 mb-6">No attendance records found matching your filters</p>
          <button
            @click="clearFilters"
            class="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all font-medium bg-blue-600 hover:bg-blue-700"
          >
            <i class="fas fa-redo"></i>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      <!-- Attendance Table -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Meeting Type</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Attendees</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="record in attendance" 
                :key="record.att_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                    :class="getMeetingTypeClass(record.meeting_type)">
                    <i :class="getMeetingTypeIcon(record.meeting_type)"></i>
                    {{ getMeetingTypeLabel(record.meeting_type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar text-gray-400"></i>
                    <span class="text-sm font-medium text-gray-900">{{ formatDate(record.meeting_date) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-map-marker-alt text-gray-400"></i>
                    <span class="text-sm text-gray-900">{{ record.location }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-users text-gray-400"></i>
                    <span class="text-sm font-semibold text-gray-900">{{ getAttendeesCount(record.attendees) }}</span>
                    <button
                      @click="viewAttendees(record)"
                      class="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-900 line-clamp-2">
                    {{ record.notes || '-' }}
                  </p>
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Transition name="modal">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="cancelEdit"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-xl font-bold text-gray-900">Edit Attendance Record</h3>
            <button
              @click="cancelEdit"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="updateAttendance" class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]" v-if="editingRecord">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    v-model="editingRecord.meeting_date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="editingRecord.meeting_type"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="staff">👥 Staff Meeting</option>
                    <option value="board">📊 Board Meeting</option>
                    <option value="training">🎓 Training Session</option>
                    <option value="review">⭐ Performance Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Location <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="editingRecord.location"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter meeting location"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Attendees <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="editingRecord.attendees"
                  rows="6"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="List of attendees (one per line)"
                  required
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Notes
                </label>
                <textarea
                  v-model="editingRecord.notes"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Meeting notes and agenda"
                ></textarea>
              </div>
            </div>
          </form>

          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              @click="cancelEdit"
              class="inline-flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <i class="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button
              @click="updateAttendance"
              :disabled="isUpdating"
              class="inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-all font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isUpdating ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
              <span>{{ isUpdating ? 'Updating...' : 'Update Record' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="cancelDelete"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <div class="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">Delete Attendance Record?</h3>
            <p class="text-gray-600 mb-4 text-center">
              This action cannot be undone. The attendance record will be permanently deleted.
            </p>

            <div v-if="recordToDelete" class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Meeting Type:</span>
                  <span class="font-semibold text-gray-900">{{ getMeetingTypeLabel(recordToDelete.meeting_type) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date:</span>
                  <span class="font-semibold text-gray-900">{{ formatDate(recordToDelete.meeting_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Location:</span>
                  <span class="font-semibold text-gray-900">{{ recordToDelete.location }}</span>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="cancelDelete"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700"
              >
                <i class="fas fa-times"></i>
                <span>Cancel</span>
              </button>
              <button
                @click="confirmDelete"
                :disabled="isDeleting"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-all font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="isDeleting ? 'fas fa-spinner fa-spin' : 'fas fa-trash'"></i>
                <span>{{ isDeleting ? 'Deleting...' : 'Delete' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- View Attendees Modal -->
    <Transition name="modal">
      <div
        v-if="showAttendeesModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="showAttendeesModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-gray-900">Attendees List</h3>
            <button
              @click="showAttendeesModal = false"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6">
            <div class="space-y-2">
              <div
                v-for="(attendee, index) in currentAttendees"
                :key="index"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <i class="fas fa-user text-blue-600 text-sm"></i>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ attendee }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import * as XLSX from '@e965/xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const toast = useToast();

const attendance = ref([]);
const isLoading = ref(true);
const isExporting = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showAttendeesModal = ref(false);
const editingRecord = ref(null);
const recordToDelete = ref(null);
const currentAttendees = ref([]);

const filters = ref({
  date: '',
  type: ''
});

onMounted(() => {
  fetchAttendance();
});

const fetchAttendance = async () => {
  isLoading.value = true;
  
  try {
    const params = new URLSearchParams();
    if (filters.value.date) params.append('date', filters.value.date);
    if (filters.value.type) params.append('type', filters.value.type);
    
    const response = await axios.get(`/api/attendances?${params}`);
    attendance.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    toast.error('Failed to load attendance records');
    attendance.value = [];
  } finally {
    isLoading.value = false;
  }
};

const clearFilters = () => {
  filters.value = {
    date: '',
    type: ''
  };
  fetchAttendance();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getAttendeesCount = (attendeesString) => {
  if (!attendeesString) return 0;
  return attendeesString.split('\n').filter(a => a.trim()).length;
};

const getAttendeesList = (attendeesString) => {
  if (!attendeesString) return [];
  return attendeesString.split('\n').filter(a => a.trim());
};

const getMeetingTypeLabel = (type) => {
  const labels = {
    'staff': 'Staff Meeting',
    'board': 'Board Meeting',
    'training': 'Training Session',
    'review': 'Performance Review'
  };
  return labels[type] || type;
};

const getMeetingTypeClass = (type) => {
  const classes = {
    'staff': 'bg-blue-100 text-blue-700',
    'board': 'bg-purple-100 text-purple-700',
    'training': 'bg-green-100 text-green-700',
    'review': 'bg-orange-100 text-orange-700'
  };
  return classes[type] || 'bg-gray-100 text-gray-700';
};

const getMeetingTypeIcon = (type) => {
  const icons = {
    'staff': 'fas fa-users',
    'board': 'fas fa-chart-line',
    'training': 'fas fa-graduation-cap',
    'review': 'fas fa-star'
  };
  return icons[type] || 'fas fa-calendar';
};

const viewAttendees = (record) => {
  currentAttendees.value = getAttendeesList(record.attendees);
  showAttendeesModal.value = true;
};

const editAttendance = (record) => {
  editingRecord.value = { ...record };
  showEditModal.value = true;
};

const updateAttendance = async () => {
  if (!editingRecord.value) return;
  
  isUpdating.value = true;
  
  try {
    const response = await axios.put(`/api/attendances/${editingRecord.value.att_id}`, editingRecord.value);
    
    if (response.data.status === 'success' || response.status === 200) {
      toast.success('Attendance record updated successfully');
      showEditModal.value = false;
      editingRecord.value = null;
      await fetchAttendance();
    } else {
      toast.error(response.data.message || 'Failed to update record');
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    toast.error('An error occurred while updating the record');
  } finally {
    isUpdating.value = false;
  }
};

const cancelEdit = () => {
  showEditModal.value = false;
  editingRecord.value = null;
};

const deleteAttendance = (record) => {
  recordToDelete.value = record;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!recordToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    await axios.delete(`/api/attendances/${recordToDelete.value.att_id}`);
    attendance.value = attendance.value.filter(a => a.att_id !== recordToDelete.value.att_id);
    toast.success('Attendance record deleted successfully');
    showDeleteModal.value = false;
    recordToDelete.value = null;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    toast.error('Failed to delete attendance record');
  } finally {
    isDeleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  recordToDelete.value = null;
};

// Export to Excel
const exportToExcel = async () => {
  if (attendance.value.length === 0) {
    toast.warning('No data to export');
    return;
  }

  isExporting.value = true;

  try {
    const dataToExport = attendance.value.map((record, index) => ({
      No: index + 1,
      MeetingType: getMeetingTypeLabel(record.meeting_type),
      Date: formatDate(record.meeting_date),
      Location: record.location || 'N/A',
      Attendees: getAttendeesCount(record.attendees),
      AttendeesList: record.attendees?.replace(/\n/g, ', ') || 'N/A',
      Notes: record.notes || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },   // No
      { wch: 20 },  // Meeting Type
      { wch: 15 },  // Date
      { wch: 25 },  // Location
      { wch: 10 },  // Attendees Count
      { wch: 40 },  // Attendees List
      { wch: 50 },  // Notes
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HR Attendance');
    XLSX.writeFile(workbook, `HR_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Excel file exported successfully');
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export Excel file');
  } finally {
    isExporting.value = false;
  }
};

// Export to PDF
const exportToPDF = async () => {
  if (attendance.value.length === 0) {
    toast.warning('No data to export');
    return;
  }

  isExporting.value = true;

  try {
    const doc = new jsPDF();
    const title = 'HR Attendance Records';
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Records: ${attendance.value.length}`, 14, 36);
    
    // Table
    const headers = [['#', 'Meeting Type', 'Date', 'Location', 'Attendees', 'Notes']];
    const data = attendance.value.map((record, index) => [
      index + 1,
      getMeetingTypeLabel(record.meeting_type),
      formatDate(record.meeting_date),
      record.location || 'N/A',
      getAttendeesCount(record.attendees),
      record.notes || 'N/A'
    ]);

    autoTable(doc, { 
      head: headers, 
      body: data, 
      startY: 45,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [46, 64, 83],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { 
        fillColor: [245, 245, 245] 
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 60 }
      }
    });

    doc.save(`HR_Attendance_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success('PDF file exported successfully');
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export PDF file');
  } finally {
    isExporting.value = false;
  }
};
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>