<template>
  <div class="flex flex-col h-full bg-slate-900 dark:bg-slate-950">
    <!-- Logo Section -->
    <div class="p-6 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">Executive</h1>
          <p class="text-xs text-slate-400">CEO Portal</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <router-link
        v-for="item in simpleMenuItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          isActive(item.name)
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        ]"
      >
        <div :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          isActive(item.name)
            ? 'bg-white/20 shadow-inner'
            : 'bg-slate-800 group-hover:bg-slate-700'
        ]">
          <svg class="w-5 h-5" :class="isActive(item.name) ? 'text-white' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-medium">{{ item.label }}</p>
          <p class="text-xs opacity-70">{{ item.description }}</p>
        </div>
        <div v-if="item.badge" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
          {{ item.badge }}
        </div>
      </router-link>

      <!-- Print Reports Module -->
      <div
        @click="togglePrintReports"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer',
          isPrintReportsActive
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        ]"
      >
        <div :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          isPrintReportsActive
            ? 'bg-white/20 shadow-inner'
            : 'bg-slate-800 group-hover:bg-slate-700'
        ]">
          <i :class="['fas fa-clipboard-list text-red-500', isPrintReportsActive ? 'text-white' : 'text-slate-400']"></i>
        </div>
        <div class="flex-1">
          <p class="font-medium">Print Reports Here</p>
          <p class="text-xs opacity-70">Generate and print various reports</p>
        </div>
        <svg 
          class="w-4 h-4 transition-transform duration-200" 
          :class="[
            printReportsOpen ? 'rotate-180' : '',
            isPrintReportsActive ? 'text-white' : 'text-slate-400'
          ]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Print Reports Children -->
      <div
        v-if="printReportsOpen"
        class="ml-4 space-y-1"
      >
        <router-link
          v-for="child in printReportsChildren"
          :key="child.name"
          :to="child.path"
          :class="[
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
            isActive(child.name)
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <i :class="[child.icon, 'w-4 h-4']"></i>
          <span class="text-sm">{{ child.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- User Profile Section -->
    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
          {{ (user?.name || 'CEO')[0]?.toUpperCase() }}
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-white">{{ user?.name || 'CEO' }}</p>
          <p class="text-xs text-slate-400">Chief Executive Officer</p>
        </div>
        <button @click="logout" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '@/axios';

const router = useRouter();
const route = useRoute();
const user = ref(null);

const simpleMenuItems = ref([
  {
    name: 'CEODashboard',
    label: 'Dashboard',
    description: 'Overview & analytics',
    path: '/ceo/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'CEOAnalytics',
    label: 'Analytics',
    description: 'Advanced business intelligence',
    path: '/ceo/analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    name: 'BudgetManagement',
    label: 'Budget',
    description: 'Financial planning & analysis',
    path: '/ceo/budget',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'AdvancedReporting',
    label: 'Reports',
    description: 'Custom reports & analytics',
    path: '/ceo/reports',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    name: 'CEOTenders',
    label: 'Tenders',
    description: 'Manage all tenders',
    path: '/ceo/tenders',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    badge: 0
  },
  {
    name: 'CEOQuotations',
    label: 'Quotations',
    description: 'Price schedules',
    path: '/ceo/quotations',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    badge: 0
  },
  {
    name: 'CEOPerformance',
    label: 'Performance',
    description: 'Employee performance reviews',
    path: '/ceo/performance-evaluations',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'CEOLeaveManagement',
    label: 'Leave Management',
    description: 'Manage employee leave requests',
    path: '/ceo/leave-management',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  }
]);

// Print Reports Module
const printReportsOpen = ref(false);
const printReportsChildren = ref([
  {
    icon: "fas fa-print text-blue-500",
    label: "Registered Tenders",
    name: "TendersReport",
    path: "/ceo/tenders-report",
    active: false,
  },
  {
    icon: "fas fa-print text-blue-500",
    label: "Assigned Tender",
    name: "ReportForAssignsTenders",
    path: "/ceo/report-for/assigned-tenders",
    active: false,
  },
  {
    icon: "fas fa-print text-green-500",
    label: "Submitted Tenders",
    name: "ReportForTenderDocuSubmission",
    path: "/ceo/report-for/tender-docu-submission",
    active: false,
  },
  {
    icon: "fas fa-print text-orange-500",
    label: "Intentions to Award",
    name: "IntentionToAwardsReport",
    path: "/ceo/intention-reports",
    active: false
  },
  {
    icon: "fas fa-print text-purple-500",
    label: "Awarding Letters",
    name: "AwardLettersReport",
    path: "/ceo/awards-reports",
    active: false
  },
  {
    icon: "fas fa-print text-teal-500",
    label: "Insurance Bonds",
    name: "InsuranceBondReport",
    path: "/ceo/insurance-bond/reports",
    active: false
  },
  {
    icon: "fas fa-print text-indigo-500",
    label: "Security Declarations",
    name: "SecurityDeclaReports",
    path: "/ceo/s-declaration-reports",
    active: false
  },
  {
    icon: "fas fa-print text-yellow-500",
    label: "Projects",
    name: "ReportForProjects",
    path: "/ceo/report-for/projects",
    active: false,
  },
  {
    icon: "fas fa-print text-brown-500",
    label: "Submitted Receipts",
    name: "ReportForSubmittedReceipts",
    path: "/ceo/report-for/submittedreceipts",
    active: false,
  },
  {
    icon: "fas fa-print text-pink-500",
    label: "Posted Updates",
    name: "ReportForUpdates",
    path: "/ceo/report-for/updates",
    active: false,
  },
  {
    icon: "fas fa-print text-blue-700",
    label: "Attendance",
    name: "AdminViewAttendance",
    path: "/ceo/print-attendance",
    active: false,
  },
  {
    icon: "fas fa-print text-green-700",
    label: "Meeting Minutes",
    name: "AdminViewMinutes",
    path: "/ceo/print-minutes",
    active: false,
  },
]);

onMounted(async () => {
  await fetchUser();
  await updateBadges();
});

async function fetchUser() {
  try {
    const response = await axios.get('/api/user/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

async function updateBadges() {
  try {
    // Fetch pending counts for badges
    const [tendersRes, quotationsRes] = await Promise.all([
      axios.get('/api/tenders'),
      axios.get('/api/price-shedules')
    ]);
  
    const pendingTenders = tendersRes.data.data?.filter(t => t.status === 'pending')?.length || 0;
    const pendingQuotations = quotationsRes.data.data?.filter(q => q.status === 'pending')?.length || 0;

    // Update badges
    const tendersItem = simpleMenuItems.value.find(item => item.name === 'CEOTenders');
    const quotationsItem = simpleMenuItems.value.find(item => item.name === 'CEOQuotations');
    
    if (tendersItem) tendersItem.badge = pendingTenders;
    if (quotationsItem) quotationsItem.badge = pendingQuotations;
  } catch (error) {
    console.error('Error updating badges:', error);
  }
}

function isActive(routeName) {
  return route.name === routeName;
}

// Print Reports functions
const isPrintReportsActive = computed(() => {
  return printReportsChildren.value.some(child => isActive(child.name));
});

function togglePrintReports() {
  printReportsOpen.value = !printReportsOpen.value;
}

function logout() {
  // Clear auth and redirect to login
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}
</script>

<style scoped>
.router-link-active {
  transform: translateX(4px);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
