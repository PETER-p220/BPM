<template>
  <div class="sidebar-wrapper">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="logo-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="logo-text">
          <h3 class="logo-title">Admin Portal</h3>
          <p class="logo-subtitle">Management Console</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <ul class="navigation-list">
      <li
        v-for="(navigation, index) in navigations"
        :key="navigation.name || index"
        class="nav-item"
        :class="{ 'is-empty': !navigation.name, 'is-active': isActive(navigation) }"
      >
        <!-- Separator for empty items -->
        <div v-if="!navigation.name" class="nav-separator"></div>

        <!-- Navigation Item -->
        <div v-else>
          <div 
            class="nav-link" 
            :class="{ 
              'has-children': hasChild(navigation),
              'is-expanded': navigation.active
            }"
            @click="clickNavigation(navigation, index)"
          >
            <div class="nav-content">
              <div class="nav-left">
                <div class="icon-wrapper">
                  <i :class="navigation.icon"></i>
                </div>
                <span class="nav-label">{{ navigation.label }}</span>
              </div>
              <div class="nav-right" v-if="hasChild(navigation)">
                <i 
                  class="chevron-icon fas" 
                  :class="navigation.active ? 'fa-chevron-up' : 'fa-chevron-down'"
                ></i>
              </div>
            </div>
          </div>

          <!-- Child Navigation -->
          <transition
            name="submenu"
            @enter="enter"
            @leave="leave"
          >
            <ul v-if="hasChild(navigation) && navigation.active" class="submenu-list">
              <li
                v-for="child in navigation.children"
                :key="child.name"
                class="submenu-item"
                @click="navigateToChild(child)"
              >
                <div class="submenu-link">
                  <div class="submenu-icon">
                    <i :class="child.icon"></i>
                  </div>
                  <span class="submenu-label">{{ child.label }}</span>
                  <div class="submenu-indicator"></div>
                </div>
              </li>
            </ul>
          </transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const navigations = ref([
  {},
  {
    icon: "fas fa-chart-line text-blue-500",
    label: "Dashboard",
    name: "Dashboard",
    path: "Dashboard",
    active: false,
  },
  {},
  {
    icon: 'fas fa-user-cog text-red-500',
    label: 'Users & Departments',
    name: 'ManageRoles',
    active: false,
    children: [
      {
        icon: 'fas fa-users text-yellow-500',
        label: 'Manage Roles',
        name: 'Roles',
        path: 'Roles',
        active: false,
      },
      {
        icon: 'fas fa-users-cog text-purple-500',
        label: 'Manage Users',
        name: 'AllUsers',
        path: 'AllUsers',
        active: false,
      },
      {
        icon: 'fas fa-tasks text-blue-500',
        label: 'Manage Departments',
        name: 'Departments',
        path: 'Departments',
        active: false,
      },
      {
        icon: 'fas fa-user-clock text-red-500', 
        label: 'User Logs',
        name: 'AuditTrail',
        path: 'AuditTrail',
        active: false,
      }
    ],
  },
  {
    icon: "fas fa-file-contract text-yellow-400",
    label: "Tenders",
    name: "Tenders Management",
    active: false,
    children: [
      { 
        icon: "fas fa-pen-square text-blue-500",
        label: "Registered Tender",
        name: "AdminGetTenders", 
        path: "AdminGetTenders",
        active: false,
      },
      { 
        icon: "fas fa-tasks text-blue-500",
        label: "Assigned Tender",
        name: "AdminViewAssignedTenders",
        path: "AdminViewAssignedTenders",
        active: false,
      },
      { 
        icon: "fas fa-folder-open text-green-500",
        label: "Submitted Tenders",
        name: "AdminViewSubmittedTenders",
        path: "AdminViewSubmittedTenders",
        active: false,
      },
    ],
  },
  {
    icon: "fas fa-trophy text-yellow-400",
    label: "Awards",
    name: "Awards",
    active: false,
    children: [
      { 
        icon: "fas fa-lightbulb text-orange-500",
        label: "Intentions to Award",
        name: "AdminViewIntentions", 
        path: "AdminViewIntentions",
        active: false
      },
      { 
        icon: "fas fa-envelope text-purple-500",
        label: "Awarding Letters",
        name: "AdminViewAwardedLetters",
        path: "AdminViewAwardedLetters",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-chart-line text-red-400",
    label: "Performances",
    name: "Performances",
    active: false,
    children: [
      { 
        icon: "fas fa-shield-alt text-teal-500",
        label: "Insurance Bonds",
        name: "AdminViewInsuranceBond", 
        path: "AdminViewInsuranceBond",
        active: false
      },
      { 
        icon: "fas fa-lock text-indigo-500",
        label: "Security Declarations",
        name: "AdminViewSecurityDeclaration",
        path: "AdminViewSecurityDeclaration",
        active: false
      },
    ]
  },
  {
    icon: "fas fa-dollar-sign text-silver-300",
    label: "Quotations",
    name: "ProjectRequests",
    active: false,
    children: [
      {
        icon: "fas fa-check-circle text-green-500",
        label: "Approve Quotation",
        name: "AdminManageSchedule",
        path: "AdminManageSchedule",
        active: false
      }
    ],
  },
  {
    icon: "fas fa-project-diagram text-teal-500",
    label: "Projects",
    name: "Projects Management",
    active: false,
    children: [
      {
        icon: "fas fa-envelope text-blue-600",
        label: "Send Appointment Letter",
        name: "AppointmentLetters",
        path: "AppointmentLetters",
        active: false
      },
      {
        icon: "fas fa-project-diagram text-indigo-600",
        label: "Assign Projects",
        name: "AllAssignedProjects",
        path: "AllAssignedProjects",
        active: false
      },
      {
        icon: "fas fa-project-diagram text-indigo-600",
        label: "Project Portfolio",
        name: "AdminViewProjectPortofolio",
        path: "AdminViewProjectPortofolio",
        active: false
      },
      {
        icon: "fas fa-check-circle text-green-600",
        label: "Approve Analyses",
        name: "Analyses",
        path: "Analyses",
        active: false
      },
      {
        icon: "fas fa-thumbs-up text-teal-600",
        label: "Requests",
        name: "AdminViewProjectRequests",
        path: "AdminViewProjectRequests",
        active: false
      },
      {
        icon: "fas fa-hourglass-half text-purple-600",
        label: "Extensions for Requests",
        name: "Extentions",
        path: "Extentions",
        active: false
      },
      {
        icon: "fas fa-clock text-orange-600",
        label: "Extend Project Timeline",
        name: "ExtendedProjects",
        path: "ExtendedProjects",
        active: false
      }
    ],
  },
  {
    icon: "fas fa-clipboard-list text-red-500",
    label: "Print Reports Here",
    name: "Tenders Management",
    active: false,
    children: [
      { 
        icon: "fas fa-print text-blue-500",
        label: "Registered Tenders",
        name: "TendersReport", 
        path: "TendersReport",
        active: false,
      },
      { 
        icon: "fas fa-print text-blue-500",
        label: "Assigned Tender",
        name: "ReportForAssignsTenders",
        path: "ReportForAssignsTenders",
        active: false,
      },
      { 
        icon: "fas fa-print text-green-500",
        label: "Submitted Tenders",
        name: "ReportForTenderDocuSubmission",
        path: "ReportForTenderDocuSubmission",
        active: false,
      },
      { 
        icon: "fas fa-print text-orange-500",
        label: "Intentions to Award",
        name: "IntentionToAwardsReport", 
        path: "IntentionToAwardsReport",
        active: false
      },
      { 
        icon: "fas fa-print text-purple-500",
        label: "Awarding Letters",
        name: "AwardLettersReport",
        path: "AwardLettersReport",
        active: false
      },
      { 
        icon: "fas fa-print text-teal-500",
        label: "Insurance Bonds",
        name: "InsuranceBondReport", 
        path: "InsuranceBondReport",
        active: false
      },
      { 
        icon: "fas fa-print text-indigo-500",
        label: "Security Declarations",
        name: "SecurityDeclaREports",
        path: "SecurityDeclaReports",
        active: false
      },
      { 
        icon: "fas fa-print text-yellow-500",
        label: "Projects",
        name: "ReportForProjects",
        path: "ReportForProjects",
        active: false,
      },
      { 
        icon: "fas fa-print text-brown-500",
        label: "Submitted Receipts",
        name: "ReportForSubmittedReceipts",
        path: "ReportForSubmittedReceipts",
        active: false,
      },
      { 
        icon: "fas fa-print text-pink-500",
        label: "Posted Updates",
        name: "ReportForUpdates",
        path: "ReportForUpdates",
        active: false,
      },
      { 
        icon: "fas fa-print text-blue-700",
        label: "Attendance",
        name: "AdminViewAttendance",
        path: "AdminViewAttendance",
        active: false,
      },
      { 
        icon: "fas fa-print text-green-700",
        label: "Meeting Minutes",
        name: "AdminViewMinutes",
        path: "AdminViewMinutes",
        active: false,
      },
    ],
  },
  { 
    icon: 'fas fa-ellipsis-h text-gray-500',
    label: 'Others',
    name: 'Others',
    path: 'Others',
    active: false
  },
]);

const clickNavigation = (navigation, index) => {
  if (hasChild(navigation)) {
    // Close all other navigation menus
    navigations.value.forEach((item, idx) => {
      if (idx !== index && item.name) item.active = false;
    });
    navigations.value[index].active = !navigations.value[index].active;
  } else {
    navigateToPath(navigation);
  }
};

const navigateToPath = (navigation) => {
  if (hasPath(navigation)) {
    router.push({ name: navigation.path });
  }
};

const navigateToChild = (child) => {
  if (hasPath(child)) {
    router.push({ name: child.path });
  }
};

const hasPath = (navigation) => navigation.hasOwnProperty('path');
const hasChild = (navigation) => navigation.children && navigation.children.length > 0;
const isActive = (navigation) => navigation.active === true;

// Animation handlers
const enter = (el) => {
  el.style.height = '0';
  el.style.opacity = '0';
  setTimeout(() => {
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
  });
};

const leave = (el) => {
  el.style.transition = 'height 0.2s ease, opacity 0.2s ease';
  el.style.height = '0';
  el.style.opacity = '0';
};
</script>

<style scoped>
.sidebar-wrapper {
  height: 780px;
  background: linear-gradient(to bottom, #1e293b, #0f172a);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Sidebar Header */
.sidebar-header {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logo-text {
  flex: 1;
}

.logo-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.01em;
}

.logo-subtitle {
  font-size: 0.6875rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Navigation List */
.navigation-list {
  list-style: none;
  margin: 0;
  padding: 0.75rem 0.5rem;
  overflow-y: auto;
  flex: 1;
}

.navigation-list::-webkit-scrollbar {
  width: 6px;
}

.navigation-list::-webkit-scrollbar-track {
  background: transparent;
}

.navigation-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.navigation-list::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Navigation Item */
.nav-item {
  margin-bottom: 0.25rem;
}

.nav-item.is-empty {
  padding: 0;
}

.nav-separator {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 0.75rem 0;
}

/* Navigation Link */
.nav-link {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.is-expanded {
  background: rgba(255, 255, 255, 0.08);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.nav-link:hover .icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.icon-wrapper i {
  font-size: 0.875rem;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #cbd5e1;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link:hover .nav-label {
  color: white;
}

.nav-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.chevron-icon {
  font-size: 0.75rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.nav-link:hover .chevron-icon {
  color: #94a3b8;
}

.nav-link.is-expanded .chevron-icon {
  color: #94a3b8;
}

/* Submenu List */
.submenu-list {
  list-style: none;
  margin: 0.25rem 0 0.5rem 0;
  padding: 0 0 0 0.5rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  margin-left: 1rem;
  overflow: hidden;
}

.submenu-item {
  margin-bottom: 0.125rem;
}

.submenu-link {
  padding: 0.625rem 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  position: relative;
}

.submenu-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.submenu-link:hover .submenu-indicator {
  opacity: 1;
  transform: translateX(0);
}

.submenu-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.submenu-link:hover .submenu-icon {
  background: rgba(255, 255, 255, 0.1);
}

.submenu-icon i {
  font-size: 0.75rem;
}

.submenu-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94a3b8;
  transition: color 0.2s ease;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submenu-link:hover .submenu-label {
  color: #cbd5e1;
}

.submenu-indicator {
  width: 4px;
  height: 4px;
  background: #3b82f6;
  border-radius: 50%;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

/* Transitions */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to {
  opacity: 1;
  max-height: 1000px;
}

.submenu-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Color overrides for Tailwind color classes */
.text-blue-500 { color: #3b82f6 !important; }
.text-yellow-400 { color: #fbbf24 !important; }
.text-yellow-500 { color: #eab308 !important; }
.text-green-500 { color: #22c55e !important; }
.text-green-600 { color: #16a34a !important; }
.text-green-700 { color: #15803d !important; }
.text-purple-500 { color: #a855f7 !important; }
.text-purple-600 { color: #9333ea !important; }
.text-teal-500 { color: #14b8a6 !important; }
.text-teal-600 { color: #0d9488 !important; }
.text-indigo-500 { color: #6366f1 !important; }
.text-indigo-600 { color: #4f46e5 !important; }
.text-orange-500 { color: #f97316 !important; }
.text-orange-600 { color: #ea580c !important; }
.text-red-400 { color: #f87171 !important; }
.text-red-500 { color: #ef4444 !important; }
.text-blue-600 { color: #2563eb !important; }
.text-blue-700 { color: #1d4ed8 !important; }
.text-gray-500 { color: #6b7280 !important; }
.text-brown-500 { color: #92400e !important; }
.text-pink-500 { color: #ec4899 !important; }
.text-silver-300 { color: #cbd5e1 !important; }
</style>