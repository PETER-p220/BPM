<template>
  <div class="min-h-screen bg-gray-50/50 px-4 py-8 md:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">HOD Dashboard</h1>
          <p class="mt-1 text-gray-600">
            Overview of department tenders, projects, updates, attendance, minutes and requests
          </p>
        </div>
        <button
          @click="refreshAll"
          :disabled="isRefreshing"
          class="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
        >
          <i class="fas fa-sync-alt mr-2 text-sm" :class="{ 'animate-spin': isRefreshing }"></i>
          Refresh Data
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <!-- 1. Assigned Tenders -->
        <router-link
          :to="{ name: 'HodTenders' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-200">
              <i class="fas fa-file-contract text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Assigned Tenders</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalAssignedTenders || 0 }}</p>
              <p class="text-sm text-gray-500">View all assigned tenders</p>
            </div>
          </div>
        </router-link>

        <!-- 2. HOD Projects -->
        <router-link
          :to="{ name: 'HodViewProjects' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-200">
              <i class="fas fa-folder-tree text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Department Projects</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalProjects || 0 }}</p>
              <p class="text-sm text-gray-500">View & approve projects</p>
            </div>
          </div>
        </router-link>

        <!-- 3. Project Activities (via approve activity route as entry point) -->
        <router-link
          :to="{ name: 'HodApproveActivity', params: { activity_id: 'list' } }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition-colors group-hover:bg-amber-200">
              <i class="fas fa-list-check text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Project Activities</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalProjectActivities || 0 }}</p>
              <p class="text-sm text-gray-500">Review & approve activities</p>
            </div>
          </div>
        </router-link>

        <!-- 4. Updates / Chats -->
        <router-link
          :to="{ name: 'HodViewUpdate' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition-colors group-hover:bg-indigo-200">
              <i class="fas fa-sync text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Department Updates</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalChats || 0 }}</p>
              <p class="text-sm text-gray-500">View & manage updates</p>
            </div>
          </div>
        </router-link>

        <!-- 5. Attendance -->
        <router-link
          :to="{ name: 'HodManageAllAttendance' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-colors group-hover:bg-green-200">
              <i class="fas fa-user-check text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Attendance Records</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalAttendances || 0 }}</p>
              <p class="text-sm text-gray-500">Manage department attendance</p>
            </div>
          </div>
        </router-link>

        <!-- 6. Meeting Minutes -->
        <router-link
          :to="{ name: 'HodGetMinutes' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 transition-colors group-hover:bg-purple-200">
              <i class="fas fa-handshake text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Meeting Minutes</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalMeetingMinutes || 0 }}</p>
              <p class="text-sm text-gray-500">View & create minutes</p>
            </div>
          </div>
        </router-link>

        <!-- 7. Project Requests / Approvals -->
        <router-link
          :to="{ name: 'HodGetAllRequests' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 transition-colors group-hover:bg-rose-200">
              <i class="fas fa-file-signature text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Project Requests</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalRequests || 0 }}</p>
              <p class="text-sm text-gray-500">Review & approve requests</p>
            </div>
          </div>
        </router-link>

        <!-- 8. Submitted Tenders (for oversight) -->
        <router-link
          :to="{ name: 'HodViewSubmittedTenders' }"
          class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 transition-colors group-hover:bg-cyan-200">
              <i class="fas fa-file-upload text-2xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Submitted Tenders</h2>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalSubmittedTenders || 0 }}</p>
              <p class="text-sm text-gray-500">Review submissions</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';

// Reactive state – add more if needed
const totalAssignedTenders   = ref(0);
const totalProjects          = ref(0);
const totalProjectActivities = ref(0);
const totalChats             = ref(0);
const totalAttendances       = ref(0);
const totalMeetingMinutes    = ref(0);
const totalRequests          = ref(0);
const totalSubmittedTenders  = ref(0);

const isRefreshing = ref(false);

// Fetch functions (your original ones – slightly cleaned)
const fetchTotalAssignedTenders = async () => {
  try {
    const res = await axios.get('api/count/hod-tenders');
    totalAssignedTenders.value = res.data.count ?? 0;
  } catch (err) {
    console.error('Failed to load assigned tenders:', err);
  }
};

const fetchTotalProjects = async () => {
  try {
    const res = await axios.get('/api/count/hod-projects');
    totalProjects.value = res.data.count_total_hod_projects ?? 0;
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
};

const fetchTotalProjectActivities = async () => {
  try {
    const res = await axios.get('api/count/proj-activity-for-hod');
    totalProjectActivities.value = res.data.count ?? 0;
  } catch (err) {
    console.error('Failed to load activities:', err);
  }
};

const fetchTotalChats = async () => {
  try {
    const res = await axios.get('api/count/total-updates');
    totalChats.value = res.data.data?.updates_count ?? 0;
  } catch (err) {
    console.error('Failed to load updates:', err);
  }
};

const fetchTotalAttendances = async () => {
  try {
    const res = await axios.get('api/count/attendances');
    totalAttendances.value = res.data.data?.total_attendances ?? 0;
  } catch (err) {
    console.error('Failed to load attendances:', err);
  }
};

const fetchTotalMeetingMinutes = async () => {
  try {
    const res = await axios.get('api/count/meeting-minutes');
    totalMeetingMinutes.value = res.data.total_meeting_minutes ?? 0;
  } catch (err) {
    console.error('Failed to load minutes:', err);
  }
};

// Optional: fetch requests & submitted tenders if you have endpoints
// Add similar functions here if needed

const refreshAll = async () => {
  isRefreshing.value = true;
  await Promise.all([
    fetchTotalAssignedTenders(),
    fetchTotalProjects(),
    fetchTotalProjectActivities(),
    fetchTotalChats(),
    fetchTotalAttendances(),
    fetchTotalMeetingMinutes(),
    // add others...
  ]);
  isRefreshing.value = false;
};

onMounted(() => {
  refreshAll();
});
</script>