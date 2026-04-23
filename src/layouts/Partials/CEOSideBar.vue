<template>
  <div class="flex flex-col h-full text-white ceo-sidebar-shell">
    <!-- Logo Section -->
    <div class="px-4 py-4 border-b ceo-sidebar-section">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-black/15 ceo-sidebar-brand-icon">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 class="text-sm font-bold text-white">Executive</h1>
          <p class="text-xs text-white/60">CEO Portal</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-2 py-3 space-y-1 overflow-y-auto ceo-sidebar-nav">
      <template v-for="item in simpleMenuItems" :key="item.name || 'separator'">
        <!-- Separator -->
        <div v-if="item.type === 'separator'" class="border-t my-2 ceo-sidebar-divider"></div>
        
        <!-- Regular Menu Item -->
        <router-link
          v-else
          :to="item.path"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group text-sm ceo-menu-item',
            isActive(item.name)
              ? 'bg-white text-[#174278] shadow-[0_16px_30px_rgba(8,38,74,0.22)]'
              : 'text-white/90 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
          ]"
        >
          <div :class="[
            'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 ceo-menu-icon',
            isActive(item.name)
              ? 'bg-[#deebfd] shadow-inner'
              : 'bg-white/10 group-hover:bg-white/16'
          ]">
            <svg class="w-4 h-4" :class="isActive(item.name) ? 'text-[#174278]' : 'text-white/72'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ item.label }}</p>
          </div>
          <div v-if="item.badge" class="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            {{ item.badge }}
          </div>
        </router-link>
      </template>

   

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
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-sm ceo-menu-child',
            isActive(child.name)
              ? 'bg-white text-[#174278] shadow-[0_10px_22px_rgba(8,38,74,0.16)]'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          ]"
        >
          <i :class="[child.icon, 'w-3 h-3 text-xs']"></i>
          <span class="text-sm">{{ child.label }}</span>
        </router-link>
      </div>

      <!-- TERA Systems Module -->
      <div
        @click="toggleTERASystems"
        :class="[
          'flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer text-sm ceo-menu-item',
          isTERASystemsActive
            ? 'bg-white text-[#174278] shadow-[0_16px_30px_rgba(8,38,74,0.22)]'
            : 'text-white/90 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
        ]"
      >
        <div :class="[
          'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 ceo-menu-icon',
          isTERASystemsActive
            ? 'bg-[#deebfd] shadow-inner'
            : 'bg-white/10 group-hover:bg-white/16'
        ]">
          <i :class="['fas fa-network-wired text-xs', isTERASystemsActive ? 'text-[#174278]' : 'text-white/72']"></i>
        </div>
        <div class="flex-1">
          <p class="font-medium">TERA Systems</p>
        </div>
        <svg 
          class="w-4 h-4 transition-transform duration-200" 
          :class="[
            teraSystemsOpen ? 'rotate-180' : '',
            isTERASystemsActive ? 'text-[#174278]' : 'text-white/72'
          ]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- TERA Systems Children -->
      <div
        v-if="teraSystemsOpen"
        class="ml-4 space-y-1"
      >
        <router-link
          v-for="child in teraSystemsChildren"
          :key="child.name"
          :to="child.path"
          :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-sm ceo-menu-child',
            isActive(child.name)
              ? 'bg-white text-[#174278] shadow-[0_10px_22px_rgba(8,38,74,0.16)]'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          ]"
        >
          <i :class="[child.icon, 'w-3 h-3 text-xs']"></i>
          <span class="text-sm">{{ child.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- User Profile Section -->
    <div class="px-2 py-2 border-t ceo-sidebar-section">
      <div class="relative">
        <!-- Profile Button -->
        <button 
          @click="toggleProfileMenu" 
          class="w-full flex items-center gap-2 p-2 rounded-xl transition-all group ceo-profile-shell"
        >
          <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1e4d8e] text-sm font-bold shadow-lg group-hover:scale-105 transition-transform">
            {{ (user?.name || 'CEO')[0]?.toUpperCase() }}
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-semibold text-white">{{ user?.name || 'CEO' }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click.stop="goToProfile" 
              class="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all"
              title="View Profile"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button 
              @click.stop="logout" 
              class="p-1.5 rounded-md text-white/70 hover:text-red-300 hover:bg-white/10 transition-all"
              title="Logout"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </button>

        <!-- Profile Dropdown Menu -->
        <div 
          v-if="profileMenuOpen" 
          class="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl overflow-hidden z-50 ceo-profile-menu"
        >
          <router-link 
            to="/ceo/profile" 
            @click="closeProfileMenu"
            class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
          >
            <svg class="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">My Profile</p>
            </div>
          </router-link>
          
          <div class="border-t ceo-sidebar-divider"></div>
          
          <button 
            @click="handleLogout" 
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
          >
            <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <div class="flex-1 text-left">
              <p class="text-sm font-medium text-red-400">Logout</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '@/axios';
import AuthStorage from '@/utils/authStorage';

const router = useRouter();
const route = useRoute();
const user = ref(null);
const profileMenuOpen = ref(false);

const simpleMenuItems = ref([
  {
    name: 'CEODashboard',
    label: 'Dashboard',
    description: 'Overview & analytics',
    path: '/ceo/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  // {
  //   name: 'CEOAnalytics',
  //   label: 'Analytics',
  //   description: 'Advanced business intelligence',
  //   path: '/ceo/analytics',
  //   icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  // },

   {
    name: 'CEOFinancialRecords',
    label: 'Financial Records',
    description: 'Complete financial overview & exports',
    path: '/ceo/financial-records',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
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
    description: 'Tenders & quotations',
    path: '/ceo/tenders',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    badge: 0
  },
  {
    name: 'CEOPerformance',
    label: 'Performance',
    description: 'Employee performance reviews',
    path: '/ceo/performance-evaluations',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  // {
  //   name: 'CEOLeaveManagement',
  //   label: 'Leave Management',
  //   description: 'Manage employee leave requests',
  //   path: '/ceo/leave-management',
  //   icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  // },
  {
    name: 'CEOPendingRequests',
    label: 'Staff Requests',
    description: 'Review and approve staff requests',
    path: '/ceo/requests',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
  },
  { type: 'separator' },
  {
    name: 'CEOProjects',
    label: 'Projects',
    description: 'Company projects overview',
    path: '/ceo/projects',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  
  {
    name: 'CEODepartments',
    label: 'Departments',
    description: 'Manage company departments',
    path: '/ceo/departments',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  {
    name: 'CEOTeam',
    label: 'Team',
    description: 'Manage users, roles & departments',
    path: '/ceo/team',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
  },
  { type: 'separator' },

 
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

// TERA Systems Module
const teraSystemsOpen = ref(false);
const teraSystemsChildren = ref([
  {
    icon: "fas fa-envelope-open-text text-purple-500",
    label: "Tera Invites",
    name: "TeraInvites",
    path: "/ceo/tera-invites",
    active: false,
  },
  {
    icon: "fas fa-cash-register text-orange-500",
    label: "Tera POS",
    name: "TeraPOS",
    path: "/ceo/tera-pos",
    active: false,
  },
  {
    icon: "fas fa-truck text-blue-500",
    label: "Vehicle Tracking (VTS)",
    name: "VTS",
    path: "/ceo/vts",
    active: false,
  },
  {
    icon: "fas fa-boxes text-green-500",
    label: "Inventory",
    name: "CEOInventory",
    path: "/ceo/inventory",
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

    // Combined badge on the unified Tenders item
    const tendersItem = simpleMenuItems.value.find(item => item.name === 'CEOTenders');
    if (tendersItem) tendersItem.badge = pendingTenders + pendingQuotations;

    // Inventory stock alerts badge
    try {
      const inventoryRes = await axios.get('api/inventory/overview', { timeout: 5000 });

      if (inventoryRes.data?.success) {
        const stockAlerts = inventoryRes.data.data?.stockAlerts;
        const totalAlerts = (stockAlerts?.outOfStockCount || 0) + (stockAlerts?.lowStockCount || 0);
        
        const inventoryItem = simpleMenuItems.value.find(item => item.name === 'CEOInventory');
        if (inventoryItem) inventoryItem.badge = totalAlerts;
      }
    } catch (inventoryError) {
      console.warn('Failed to fetch inventory alerts:', inventoryError);
      // Don't show error to user, just don't update badge
    }

    // VTS system alerts badge
    try {
      const vtsRes = await axios.get('api/vts/dashboard', { timeout: 5000 });

      if (vtsRes.data?.success) {
        const vtsData = vtsRes.data.data;
        // Show badge for inactive users or pending requisitions
        const inactiveUsers = (vtsData.system_overview?.total_users - vtsData.system_overview?.active_users) || 0;
        const alertCount = inactiveUsers + (vtsData.system_overview?.total_requisitions || 0);
        
        const vtsItem = simpleMenuItems.value.find(item => item.name === 'VTS');
        if (vtsItem) vtsItem.badge = alertCount;
      }
    } catch (vtsError) {
      console.warn('Failed to fetch VTS alerts:', vtsError);
      // Don't show error to user, just don't update badge
    }
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

// TERA Systems functions
const isTERASystemsActive = computed(() => {
  return teraSystemsChildren.value.some(child => isActive(child.name));
});

function toggleTERASystems() {
  teraSystemsOpen.value = !teraSystemsOpen.value;
}

function logout() {
  // Clear auth and redirect to login
  AuthStorage.clearAuth();
  router.push({ name: 'Login' });
}

// Profile menu functions
function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value;
}

function closeProfileMenu() {
  profileMenuOpen.value = false;
}

function goToProfile() {
  closeProfileMenu();
  router.push('/ceo/profile');
}

function handleLogout() {
  closeProfileMenu();
  logout();
}

// Close profile menu when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

function handleClickOutside(event) {
  const profileSection = event.target.closest('.relative');
  if (!profileSection) {
    profileMenuOpen.value = false;
  }
}
</script>

<style scoped>
.ceo-sidebar-shell {
  background:
    radial-gradient(circle at top left, rgba(124, 181, 255, 0.24), transparent 22%),
    linear-gradient(180deg, #174278 0%, #1f5aa5 58%, #163d71 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.04);
}

.ceo-sidebar-section {
  border-color: rgba(255, 255, 255, 0.1);
}

.ceo-sidebar-brand-icon {
  background: linear-gradient(135deg, #2c6cc0 0%, #4a8ce3 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.ceo-sidebar-nav {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 40%);
}

.ceo-sidebar-divider {
  border-color: rgba(255, 255, 255, 0.1);
}

.ceo-menu-item {
  backdrop-filter: blur(8px);
}

.ceo-menu-icon {
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ceo-menu-child {
  backdrop-filter: blur(8px);
}

.ceo-profile-shell {
  background: linear-gradient(180deg, rgba(69, 126, 205, 0.86), rgba(34, 86, 157, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 24px rgba(8, 34, 67, 0.22);
}

.ceo-profile-menu {
  background: linear-gradient(180deg, rgba(38, 95, 170, 0.98), rgba(22, 61, 113, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.router-link-active {
  transform: translateX(4px);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.22);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.32);
}
</style>
