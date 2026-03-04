<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <button 
            @click="goBack" 
            class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-200"
            title="Go back"
          >
            <i class="fa fa-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Record Attendance</h1>
            <p class="text-sm text-gray-600 mt-1">Record attendance for meetings and sessions</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Attendance Form -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-lg shadow-lg">
              <i class="fas fa-calendar-check text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Meeting Attendance Form</h2>
              <p class="text-sm text-gray-600">Complete all required fields to record attendance</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitAttendance">
          <div class="p-8">
            <!-- Meeting Details Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">1</span>
                Meeting Details
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Meeting Date -->
                <div>
                  <label for="meeting_date" class="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Date <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <i class="fas fa-calendar text-gray-400"></i>
                    </div>
                    <input
                      type="date"
                      id="meeting_date"
                      v-model="form.meeting_date"
                      class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                      :class="{'border-red-300 focus:ring-red-500': showErrors && !form.meeting_date}"
                      required
                    />
                  </div>
                  <p v-if="showErrors && !form.meeting_date" class="mt-1 text-sm text-red-600">
                    Meeting date is required
                  </p>
                </div>

                <!-- Meeting Type -->
                <div>
                  <label for="meeting_type" class="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="meeting_type"
                      v-model="form.meeting_type"
                      class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      :class="{'border-red-300 focus:ring-red-500': showErrors && !form.meeting_type}"
                      required
                    >
                      <option value="">Select meeting type</option>
                      <option value="staff">👥 Staff Meeting</option>
                      <option value="board">📊 Board Meeting</option>
                      <option value="training">🎓 Training Session</option>
                      <option value="review">⭐ Performance Review</option>
                      <option value="workshop">🛠️ Workshop</option>
                      <option value="conference">💼 Conference</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <i class="fa fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  <p v-if="showErrors && !form.meeting_type" class="mt-1 text-sm text-red-600">
                    Meeting type is required
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Location Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">2</span>
                Location Information
              </h3>
              
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Location <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <i class="fas fa-map-marker-alt text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    id="location"
                    v-model="form.location"
                    class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    :class="{'border-red-300 focus:ring-red-500': showErrors && !form.location}"
                    placeholder="e.g., Conference Room A, Main Office, Building 2"
                    required
                  />
                </div>
                <p v-if="showErrors && !form.location" class="mt-1 text-sm text-red-600">
                  Location is required
                </p>
                <p class="mt-2 text-xs text-gray-500">
                  <i class="fas fa-info-circle mr-1"></i>
                  Specify the exact room or venue where the meeting took place
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Attendees Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">3</span>
                Attendees
              </h3>
              
              <div>
                <label for="attendees" class="block text-sm font-medium text-gray-700 mb-2">
                  List of Attendees <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="attendees"
                  v-model="form.attendees"
                  rows="8"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                  :class="{'border-red-300 focus:ring-red-500': showErrors && !form.attendees}"
                  placeholder="Enter attendee names (one per line)"
                  required
                ></textarea>
                <div class="flex items-center justify-between mt-2">
                  <p v-if="showErrors && !form.attendees" class="text-sm text-red-600">
                    At least one attendee is required
                  </p>
                  <div class="flex items-center gap-4 ml-auto">
                    <p class="text-xs text-gray-500">
                      <i class="fas fa-users mr-1"></i>
                      {{ getAttendeesCount(form.attendees) }} attendee(s)
                    </p>
                  </div>
                </div>
              
              </div>
            </div>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Notes Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">4</span>
                 Notes
              </h3>
              
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Notes & Agenda
                  <span class="text-gray-500 font-normal ml-1">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="6"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                  placeholder="Add meeting agenda, key discussion points, decisions made, or action items..."
                ></textarea>
               
              </div>
            </div>

           
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between px-8 py-6 bg-gray-50 border-t border-gray-200">
            <button 
              type="button"
              @click="goBack"
              class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
              :disabled="isSubmitting"
            >
              <i class="fa fa-times"></i>
              <span>Cancel</span>
            </button>

            <button 
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 px-8 py-3 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 hover:bg-slate-700"
            >
              <i :class="isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'"></i>
              <span>{{ isSubmitting ? 'Recording Attendance...' : 'Record Attendance' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <Transition name="modal">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="closeSuccessModal"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
          <div class="p-6 text-center">
            <!-- Success Icon -->
            <div class="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <i class="fas fa-check text-3xl text-green-600"></i>
            </div>

            <!-- Success Message -->
            <h3 class="text-xl font-bold text-gray-900 mb-2">Attendance Recorded Successfully!</h3>
            <p class="text-gray-600 mb-6">
              The meeting attendance has been successfully recorded in the system.
            </p>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="recordAnother"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700"
              >
                <i class="fas fa-plus"></i>
                <span>Record Another</span>
              </button>
              <button
                @click="closeSuccessModal"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-all font-medium bg-green-600 hover:bg-green-700"
              >
                <i class="fas fa-check"></i>
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const form = ref({
  meeting_date: '',
  meeting_type: '',
  location: '',
  attendees: '',
  notes: ''
});

const isSubmitting = ref(false);
const showErrors = ref(false);
const showSuccessModal = ref(false);

const submitAttendance = async () => {
  showErrors.value = true;

  // Validation
  if (!form.value.meeting_date || !form.value.meeting_type || !form.value.location || !form.value.attendees) {
    toast.error('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const response = await axios.post('/api/attendances', form.value);
    
    if (response.data.status === 'success' || response.status === 201 || response.status === 200) {
      showSuccessModal.value = true;
    } else {
      toast.error(response.data.message || 'Failed to record attendance');
    }
  } catch (error) {
    console.error('Error submitting attendance:', error);
    
    let errorMessage = 'An error occurred while recording attendance';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  form.value = {
    meeting_date: '',
    meeting_type: '',
    location: '',
    attendees: '',
    notes: ''
  };
  showErrors.value = false;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  resetForm();
  router.back();
};

const recordAnother = () => {
  showSuccessModal.value = false;
  resetForm();
  toast.success('Form cleared. Ready for new attendance record!');
};

const goBack = () => {
  router.back();
};

const getAttendeesCount = (attendeesString) => {
  if (!attendeesString) return 0;
  return attendeesString.split('\n').filter(a => a.trim()).length;
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
</style>