<template>
  <div class="sidebar-container">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="header-content">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="logo-text">
            <h3 class="logo-title">HR Portal</h3>
            <p class="logo-subtitle">Human Resources</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="nav-menu">
      <ul class="nav-list">
        <li
          v-for="(navigation, index) in navigations"
          :key="navigation.name || index"
          class="nav-item"
          :class="{ 'is-empty': !navigation.name }"
        >
          <!-- Separator for empty items -->
          <div v-if="!navigation.name" class="nav-separator"></div>

          <!-- Navigation Item -->
          <div v-else>
            <div
              class="nav-link"
              :class="{ 
                'is-active': !hasChild(navigation) && isCurrentRoute(navigation.path),
                'is-expanded': hasChild(navigation) && navigation.active
              }"
              @click="clickNavigation(navigation, index)"
            >
              <div class="nav-link-content">
                <!-- Icon and Label -->
                <div class="nav-link-left">
                  <div class="nav-icon-wrapper" :class="getIconWrapperClass(navigation)">
                    <i class="nav-icon" :class="navigation.icon"></i>
                  </div>
                  <span class="nav-label">{{ navigation.label }}</span>
                </div>

                <!-- Expand indicator or active dot -->
                <div class="nav-link-right">
                  <div 
                    v-if="!hasChild(navigation) && isCurrentRoute(navigation.path)" 
                    class="active-dot"
                  ></div>
                  <i
                    v-if="hasChild(navigation)"
                    class="expand-icon fas"
                    :class="navigation.active ? 'fa-chevron-up' : 'fa-chevron-down'"
                  ></i>
                </div>
              </div>

              <!-- Hover effect overlay -->
              <div class="nav-link-overlay"></div>
            </div>

            <!-- Child Navigation -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[1000px]"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-[1000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <ul v-if="hasChild(navigation) && navigation.active" class="child-list">
                <li
                  v-for="child in navigation.children"
                  :key="child.name"
                  class="child-item"
                >
                  <div
                    class="child-link"
                    :class="{ 'is-active': isCurrentRoute(child.path) }"
                    @click.stop="navigateToChild(child)"
                  >
                    <div class="child-link-content">
                      <div class="child-icon-wrapper">
                        <i class="child-icon" :class="child.icon"></i>
                      </div>
                      <span class="child-label">{{ child.label }}</span>
                      <div 
                        v-if="isCurrentRoute(child.path)" 
                        class="child-active-dot"
                      ></div>
                    </div>
                    <div class="child-link-overlay"></div>
                  </div>
                </li>
              </ul>
            </transition>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="footer-content">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <p class="user-name">HR Manager</p>
            <p class="user-role">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const currentRoute = useRoute();

const navigations = ref([
  {},
  {
    icon: "fas fa-chart-line",
    label: "Dashboard",
    name: "HrDashbaordDashbaord",
    path: "HrDashbaord",
    active: false,
  },
  {},
  {
    icon: "fas fa-file-contract",
    label: "Tenders",
    name: "TendersManagement",
    active: false,
    children: [
      {
        icon: "fas fa-list",
        label: "View Registered Tenders",
        name: "HrViewRegisteredTenders",
        path: "HrViewReisteredTenders",
        active: false
      },
      {
        icon: "fas fa-paper-plane",
        label: "View Submitted Tenders",
        name: "HrViewSubmittedTenders",
        path: "HrViewSubmittedTenders",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-file-signature",
    label: "Contracts",
    name: "ContractsManagement",
    active: false,
    children: [
      {
        icon: "fas fa-layer-group",
        label: "Manage Contracts",
        name: "HrManageContracts",
        path: "ManageContracts",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-project-diagram",
    label: "Projects",
    name: "ProjectsManagement",
    active: false,
    children: [
      {
        icon: "fas fa-plus-circle",
        label: "Assign Projects",
        name: "HrAssignProjects",
        path: "HrAssignProject",
        active: false
      },
      {
        icon: "fas fa-tasks",
        label: "Manage Projects",
        name: "HrManageProjects",
        path: "HrManageProject",
        active: false
      },
      {
        icon: "fas fa-folder-open",
        label: "Project Portfolio",
        name: "HrProjectPortfolio",
        path: "ProjectPortofolio",
        active: false
      },
      {
        icon: "fas fa-envelope",
        label: "View Requests",
        name: "HrViewProjectRequests",
        path: "HrViewProjectRequests",
        active: false
      },
      {
        icon: "fas fa-clock",
        label: "View Extension Requests",
        name: "HrViewExtensionRequests",
        path: "HrViewExtentions",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-upload",
    label: "Updates",
    name: "UpdatesManagement",
    active: false,
    children: [
      {
        icon: "fas fa-plus-circle",
        label: "Submit Update",
        name: "HrCreateUpdate",
        path: "AccntantCreateUpdate",
        active: false
      },
      {
        icon: "fas fa-list",
        label: "Manage Updates",
        name: "HrViewUpdates",
        path: "AccntantViewUpdate",
        active: false
      }
    ]
  },
  {
    icon: "fas fa-users",
    label: "Meetings",
    name: "MeetingsManagement",
    active: false,
    children: [
      {
        icon: "fas fa-user-check",
        label: "Create Attendance",
        name: "HrCreateAttendance",
        path: "AccntntCreateAttendance",
        active: false
      },
      {
        icon: "fas fa-clipboard-list",
        label: "Manage Attendance",
        name: "HrManageAttendance",
        path: "AccountantGetAttendance",
        active: false
      },
      {
        icon: "fas fa-plus",
        label: "Create Minutes",
        name: "HrCreateMinutes",
        path: "AccontntCreateUpdate",
        active: false
      },
      {
        icon: "fas fa-file-alt",
        label: "View Minutes",
        name: "HrViewMinutes",
        path: "AccontntGetMinutes",
        active: false
      }
    ]
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

const isCurrentRoute = (path) => {
  return currentRoute.name === path;
};

const getIconWrapperClass = (navigation) => {
  if (!hasChild(navigation) && isCurrentRoute(navigation.path)) {
    return 'is-active';
  }
  return '';
};
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #1e293b, #0f172a);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

/* Header */
.sidebar-header {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
}

.logo-wrapper {
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

/* Navigation Menu */
.nav-menu {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0.5rem;
}

.nav-menu::-webkit-scrollbar {
  width: 6px;
}

.nav-menu::-webkit-scrollbar-track {
  background: transparent;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.nav-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  position: relative;
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
  position: relative;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.nav-link:hover .nav-link-overlay {
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.is-active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.nav-link.is-expanded {
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.nav-link-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.nav-icon-wrapper {
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

.nav-icon-wrapper.is-active {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.nav-icon {
  font-size: 0.875rem;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.nav-link:hover .nav-icon,
.nav-link.is-active .nav-icon,
.nav-link.is-expanded .nav-icon {
  color: white;
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

.nav-link:hover .nav-label,
.nav-link.is-active .nav-label,
.nav-link.is-expanded .nav-label {
  color: white;
}

.nav-link-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.active-dot {
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.expand-icon {
  font-size: 0.75rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.nav-link:hover .expand-icon,
.nav-link.is-expanded .expand-icon {
  color: #94a3b8;
}

.nav-link-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  transition: background 0.2s ease;
  pointer-events: none;
}

/* Child List */
.child-list {
  list-style: none;
  margin: 0.25rem 0 0 0;
  padding: 0 0 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  margin-left: 1rem;
}

.child-item {
  position: relative;
}

.child-link {
  position: relative;
  padding: 0.625rem 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.child-link:hover .child-link-overlay {
  background: rgba(255, 255, 255, 0.05);
}

.child-link.is-active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
  border-left: 2px solid #3b82f6;
}

.child-link-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  z-index: 1;
}

.child-icon-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.child-icon {
  font-size: 0.75rem;
  color: #64748b;
  transition: color 0.2s ease;
}

.child-link:hover .child-icon,
.child-link.is-active .child-icon {
  color: #94a3b8;
}

.child-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94a3b8;
  transition: color 0.2s ease;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.child-link:hover .child-label,
.child-link.is-active .child-label {
  color: #cbd5e1;
}

.child-active-dot {
  width: 5px;
  height: 5px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
  flex-shrink: 0;
}

.child-link-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  transition: background 0.2s ease;
  pointer-events: none;
}

/* Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.footer-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.6875rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.max-h-0 {
  max-height: 0;
}

.max-h-\[1000px\] {
  max-height: 1000px;
}
</style>