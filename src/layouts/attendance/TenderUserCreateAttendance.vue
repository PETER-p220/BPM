<template>
  <div class="min-h-screen" style="font-family: 'DM Sans', sans-serif; background: radial-gradient(circle at top right,rgba(48,120,221,0.08),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%)">
    <!-- Header Section -->
    <div style="background: linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%); border-bottom: 1px solid #dce7f3;">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <button 
            @click="goBack" 
            class="p-2 transition-colors rounded-lg hover:bg-[#edf4fb]"
            style="color:#4a6a8a;"
            title="Go back"
          >
            <i class="fa fa-arrow-left"></i>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
              <i class="fas fa-calendar-check text-white text-lg"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold" style="color:#183b63;">Record Attendance</h1>
              <p class="text-sm mt-0.5" style="color:#7a93af;">Record attendance for meetings and sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Attendance Form -->
      <div class="bg-white rounded-2xl shadow-sm border border-[#dce7f3] overflow-hidden">
        <div class="px-6 py-4 border-b border-[#edf2fa]" style="background:linear-gradient(135deg,#eef5ff 0%,#ffffff 46%,#f7fbff 100%);">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg" style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);">
              <i class="fas fa-calendar-check text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold" style="color:#183b63;">Meeting Attendance Form</h2>
              <p class="text-sm" style="color:#7a93af;">Complete all required fields to record attendance</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitAttendance">
          <div class="p-8">
            <!-- Meeting Details Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2" style="color:#183b63;">
                <span class="flex items-center justify-center w-8 h-8 bg-[#edf4fb] text-[#2f78dd] rounded-xl text-sm font-bold">1</span>
                Meeting Details
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Meeting Date -->
                <div>
                  <label for="meeting_date" class="block text-sm font-medium mb-2" style="color:#183b63;">
                    Meeting Date <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <i class="fas fa-calendar" style="color:#a4b8cf;"></i>
                    </div>
                    <input
                      type="date"
                      id="meeting_date"
                      v-model="form.meeting_date"
                      class="w-full pl-11 pr-4 py-3 border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition-all"
                      style="color:#183b63;"
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
                  <label for="meeting_type" class="block text-sm font-medium mb-2" style="color:#183b63;">
                    Meeting Type <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="meeting_type"
                      v-model="form.meeting_type"
                      class="w-full px-4 py-3 bg-white border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition-all appearance-none cursor-pointer"
                      style="color:#183b63;"
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
                      <i class="fa fa-chevron-down" style="color:#a4b8cf;"></i>
                    </div>
                  </div>
                  <p v-if="showErrors && !form.meeting_type" class="mt-1 text-sm text-red-600">
                    Meeting type is required
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t border-[#edf2fa] my-8"></div>

            <!-- Location Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2" style="color:#183b63;">
                <span class="flex items-center justify-center w-8 h-8 bg-[#edf4fb] text-[#2f78dd] rounded-xl text-sm font-bold">2</span>
                Location Information
              </h3>
              
              <div>
                <label for="location" class="block text-sm font-medium mb-2" style="color:#183b63;">
                  Meeting Location <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <i class="fas fa-map-marker-alt" style="color:#a4b8cf;"></i>
                  </div>
                  <input
                    type="text"
                    id="location"
                    v-model="form.location"
                    class="w-full pl-11 pr-4 py-3 border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition-all"
                    style="color:#183b63;"
                    :class="{'border-red-300 focus:ring-red-500': showErrors && !form.location}"
                    placeholder="e.g., Conference Room A, Main Office, Building 2"
                    required
                  />
                </div>
                <p v-if="showErrors && !form.location" class="mt-1 text-sm text-red-600">
                  Location is required
                </p>
                <p class="mt-2 text-xs" style="color:#7a93af;">
                  <i class="fas fa-info-circle mr-1"></i>
                  Specify the exact room or venue where the meeting took place
                </p>
              </div>
            </div>

            <div class="border-t border-[#edf2fa] my-8"></div>

            <!-- Attendees Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2" style="color:#183b63;">
                <span class="flex items-center justify-center w-8 h-8 bg-[#edf4fb] text-[#2f78dd] rounded-xl text-sm font-bold">3</span>
                Attendees
              </h3>
              
              <div>
                <label for="attendees" class="block text-sm font-medium mb-2" style="color:#183b63;">
                  List of Attendees <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="attendees"
                  v-model="form.attendees"
                  rows="8"
                  class="w-full px-4 py-3 border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition-all resize-none"
                  style="color:#183b63;"
                  :class="{'border-red-300 focus:ring-red-500': showErrors && !form.attendees}"
                  placeholder="Enter attendee names (one per line)"
                  required
                ></textarea>
                <div class="flex items-center justify-between mt-2">
                  <p v-if="showErrors && !form.attendees" class="text-sm text-red-600">
                    At least one attendee is required
                  </p>
                  <div class="flex items-center gap-4 ml-auto">
                    <p class="text-xs" style="color:#7a93af;">
                      <i class="fas fa-users mr-1"></i>
                      {{ getAttendeesCount(form.attendees) }} attendee(s)
                    </p>
                  </div>
                </div>
              
              </div>
            </div>

            <div class="border-t border-[#edf2fa] my-8"></div>

            <!-- Notes Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2" style="color:#183b63;">
                <span class="flex items-center justify-center w-8 h-8 bg-[#edf4fb] text-[#2f78dd] rounded-xl text-sm font-bold">4</span>
                 Notes
              </h3>
              
              <div>
                <label for="notes" class="block text-sm font-medium mb-2" style="color:#183b63;">
                  Meeting Notes & Agenda
                  <span class="font-normal ml-1" style="color:#7a93af;">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="6"
                  class="w-full px-4 py-3 border border-[#d9e6f3] rounded-xl focus:ring-2 focus:ring-[#2f78dd]/30 focus:border-[#2f78dd] transition-all resize-none"
                  style="color:#183b63;"
                  placeholder="Add meeting agenda, key discussion points, decisions made, or action items..."
                ></textarea>
               
              </div>
            </div>

           
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between px-8 py-6 border-t border-[#edf2fa]" style="background:#f7faff;">
            <button 
              type="button"
              @click="goBack"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#d9e6f3] rounded-xl hover:bg-[#f7faff] transition-all font-medium"
              style="color:#4a6a8a;"
              :disabled="isSubmitting"
            >
              <i class="fa fa-times"></i>
              <span>Cancel</span>
            </button>

            <button 
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 px-8 py-3 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);box-shadow:0 8px 20px rgba(35,96,182,0.22);"
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
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-[#dce7f3]">
          <div class="p-6 text-center">
            <!-- Success Icon -->
            <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4" style="background:linear-gradient(135deg,rgba(25,79,146,0.12),rgba(47,120,221,0.12));">
              <i class="fas fa-check text-3xl" style="color:#2f78dd;"></i>
            </div>

            <!-- Success Message -->
            <h3 class="text-xl font-bold mb-2" style="color:#183b63;">Attendance Recorded Successfully!</h3>
            <p class="mb-6" style="color:#7a93af;">
              The meeting attendance has been successfully recorded in the system.
            </p>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="recordAnother"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#d9e6f3] rounded-xl hover:bg-[#f7faff] transition-all font-medium"
                style="color:#4a6a8a;"
              >
                <i class="fas fa-plus"></i>
                <span>Record Another</span>
              </button>
              <button
                @click="closeSuccessModal"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl transition-all font-medium"
                style="background:linear-gradient(135deg,#194f92 0%,#2f78dd 100%);"
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