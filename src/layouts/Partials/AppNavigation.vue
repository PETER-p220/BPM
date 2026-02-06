<template>
  <div class="sidebar-wrapper">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="logo-icon">
          <i class="fas fa-briefcase"></i>
        </div>
        <div class="logo-text">
          <h3 class="logo-title">User Portal</h3>
          <p class="logo-subtitle">Dashboard</p>
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
    path: "UserDashboard",
    active: false,
  },
  {},
  {
    icon: "fas fa-file-contract text-yellow-400",
    label: "Tenders",
    name: "TendersManagement",
    active: false,
    children: [
      {
        icon: "fas fa-tasks text-blue-500",
        label: "Assigned Tenders",
        name: "UserAssignedTenders",
        path: "MyTender",
        active: false
      },
      {
        icon: "fas fa-paper-plane text-green-600",
        label: "Submit Tender",
        name: "UserTenderSubmissions",
        path: "MySubmissions",
        active: false
      },
      {
        icon: "fas fa-calculator text-purple-500",
        label: "Submit Quotation",
        name: "UserQuotations",
        path: "MySchedules",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-project-diagram text-teal-500",
    label: "Projects",
    name: "ProjectsManagement",
    active: false,
    children: [
      {
        icon: "fas fa-file-signature text-indigo-500",
        label: "Appointment Letter",
        name: "UserAppointmentLetter",
        path: "UserAppointmentLetter",
        active: false
      },
      {
        icon: "fas fa-tasks text-blue-500",
        label: "Assigned Projects",
        name: "UserAssignedProjects",
        path: "MyProjects",
        active: false
      },
      {
        icon: "fas fa-chart-bar text-purple-500",
        label: "Submit Analysis",
        name: "UserAnalysisSubmissions",
        path: "UserAnalyses",
        active: false
      },
      {
        icon: "fas fa-envelope text-orange-500",
        label: "Submit Request",
        name: "UserRequests",
        path: "MyRequests",
        active: false
      },
      {
        icon: "fas fa-clock text-yellow-600",
        label: "Extend Request",
        name: "UserExtensionRequests",
        path: "UserExtentions",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-file-invoice text-teal-500",
    label: "Receipts",
    name: "ReceiptsManagement",
    active: false,
    children: [
      {
        icon: "fas fa-upload text-yellow-500",
        label: "Submit Receipt",
        name: "UserSubmitReceipt",
        path: "SubmitReceipt",
        active: false
      },
      {
        icon: "fas fa-search text-blue-500",
        label: "Manage Receipts",
        name: "UserManageReceipts",
        path: "Myreceipts",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-file-upload text-green-500",
    label: "Updates",
    name: "UpdatesManagement",
    active: false,
    children: [
      {
        icon: "fas fa-plus text-yellow-500",
        label: "Create Update",
        name: "UserCreateUpdate",
        path: "SubmitUpdate",
        active: false
      },
      {
        icon: "fas fa-eye text-blue-500",
        label: "Manage Updates",
        name: "UserManageUpdates",
        path: "UserUpdates",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-calendar-alt text-indigo-500",
    label: "Meetings",
    name: "MeetingsManagement",
    active: false,
    children: [
      {
        icon: "fas fa-plus text-purple-500",
        label: "Create Attendance",
        name: "UserCreateAttendance",
        path: "MyAttendance",
        active: false
      },
      {
        icon: "fas fa-plus text-green-500",
        label: "Create Minutes",
        name: "UserCreateMinutes",
        path: "MeetingMenutes",
        active: false
      }
    ]
  },
  {
    icon: 'fas fa-ellipsis-h text-gray-500',
    label: 'Others',
    name: 'Others',
    path: 'Others',
    active: false
  }
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
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
.text-blue-500 {
  color: #3b82f6 !important;
}

.text-yellow-400 {
  color: #fbbf24 !important;
}

.text-green-600 {
  color: #16a34a !important;
}

.text-purple-500 {
  color: #a855f7 !important;
}

.text-teal-500 {
  color: #14b8a6 !important;
}

.text-indigo-500 {
  color: #6366f1 !important;
}

.text-orange-500 {
  color: #f97316 !important;
}

.text-yellow-600 {
  color: #ca8a04 !important;
}

.text-yellow-500 {
  color: #eab308 !important;
}

.text-green-500 {
  color: #22c55e !important;
}

.text-gray-500 {
  color: #6b7280 !important;
}
</style>