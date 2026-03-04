<template>
  <div class="sidebar-wrapper">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="header-inner">
        <div class="logo-icon">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="logo-text">
          <h3 class="logo-title">HOD Portal</h3>
          <p class="logo-subtitle">Department Management</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="nav-container">
      <div
        v-for="(nav, index) in navigations"
        :key="index"
        class="nav-block"
      >
        <!-- Separator -->
        <div v-if="nav.type === 'separator'" class="nav-separator"></div>

        <!-- Menu Item -->
        <div v-else>
          <div
            @click="handleClick(nav, index)"
            class="nav-link"
            :class="{
              'is-active': !hasChildren(nav) && isCurrentRoute(nav.name),
              'is-open': hasChildren(nav) && nav.active
            }"
          >
            <div class="nav-left">
              <div class="icon-wrap">
                <i
                  class="nav-icon"
                  :class="[
                    nav.icon,
                    !hasChildren(nav) && isCurrentRoute(nav.name) ? 'icon-active' : ''
                  ]"
                ></i>
                <span
                  v-if="!hasChildren(nav) && isCurrentRoute(nav.name)"
                  class="active-dot"
                ></span>
              </div>
              <span
                class="nav-label"
                :class="{
                  'label-active': !hasChildren(nav) && isCurrentRoute(nav.name)
                }"
              >
                {{ nav.label }}
              </span>
            </div>

            <i
              v-if="hasChildren(nav)"
              class="fas chevron"
              :class="nav.active ? 'fa-chevron-down rotated' : 'fa-chevron-right'"
            />
          </div>

          <!-- Children Submenu -->
          <transition name="submenu" @enter="enter" @leave="leave">
            <div
              v-if="hasChildren(nav) && nav.active"
              class="submenu-list"
            >
              <div
                v-for="(child, childIndex) in nav.children"
                :key="childIndex"
                @click="navigate(child)"
                class="submenu-item"
                :class="{ 'submenu-item-active': isCurrentRoute(child.name) }"
              >
                <i
                  class="submenu-icon"
                  :class="[
                    child.icon,
                    isCurrentRoute(child.name) ? 'submenu-icon-active' : ''
                  ]"
                ></i>
                <span
                  class="submenu-label"
                  :class="{ 'submenu-label-active': isCurrentRoute(child.name) }"
                >
                  {{ child.label }}
                </span>
                <span v-if="isCurrentRoute(child.name)" class="submenu-dot"></span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const currentRoute = useRoute()

const navigations = ref([
  {
    icon: 'fas fa-tachometer-alt text-blue-400',
    label: 'Dashboard',
    name: 'HodDashboard',
  },
  { type: 'separator' },
  {
    icon: 'fas fa-file-contract text-red-400',
    label: 'Tenders',
    active: false,
    children: [
      { icon: 'fas fa-list-ul', label: 'Assigned Tenders', name: 'HodTenders' },
      { icon: 'fas fa-paper-plane', label: 'Submitted Tenders', name: 'HodViewSubmittedTenders' },
      { icon: 'fas fa-trophy', label: 'Awarded Tenders', name: 'HodViewAwardedTenders' },
    ],
  },
  { type: 'separator' },
  {
    icon: 'fas fa-project-diagram text-teal-400',
    label: 'Projects',
    active: false,
    children: [
      { icon: 'fas fa-list', label: 'Assigned Projects', name: 'HodViewProjects' },
      { icon: 'fas fa-tasks', label: 'Project Activities', name: 'HodActivities' },
    ],
  },
  { type: 'separator' },
  {
    icon: 'fas fa-inbox text-cyan-400',
    label: 'Requests & Schedules',
    active: false,
    children: [
      { icon: 'fas fa-list-ul', label: 'All Requests', name: 'HodGetAllRequests' },
      { icon: 'fas fa-file-invoice-dollar', label: 'Price Schedules', name: 'HodPriceSchedules' },
      { icon: 'fas fa-chart-bar', label: 'Project Analyses', name: 'HodViewAnalyses' },
    ],
  },
  { type: 'separator' },
  {
    icon: 'fas fa-users text-blue-400',
    label: 'Attendance',
    name: 'HodAttendance',
  },
  { type: 'separator' },
  {
    icon: 'fas fa-clock text-blue-400',
    label: 'Meeting Minutes',
    name: 'HodMeetingMinutes',
  },
  { type: 'separator' },
  {
    icon: 'fas fa-calendar-alt text-green-400',
    label: 'Leave Management',
    name: 'HodLeaveManagement',
  },
  { type: 'separator' },
  {
    icon: 'fas fa-upload text-blue-400',
    label: 'Updates',
    active: false,
    children: [
      { icon: 'fas fa-plus-circle', label: 'Submit Update', name: 'HodSubmitUpdate' },
      { icon: 'fas fa-list', label: 'View / Manage Updates', name: 'HodViewUpdate' },
    ],
  },
])

function handleClick(item, index) {
  if (item.type === 'separator') return
  if (hasChildren(item)) {
    navigations.value.forEach((n, i) => {
      if (i !== index) n.active = false
    })
    item.active = !item.active
  } else {
    navigate(item)
  }
}

function navigate(item) {
  if (item.name) router.push({ name: item.name })
}

const hasChildren = (item) => item.children && item.children.length > 0
const isCurrentRoute = (name) => currentRoute.name === name

watch(
  () => currentRoute.name,
  (newName) => {
    navigations.value.forEach((parent) => {
      if (hasChildren(parent)) {
        parent.active = parent.children.some((child) => child.name === newName)
      }
    })
  },
  { immediate: true }
)

// GPU-composited enter/leave using rAF
const enter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.28s ease, opacity 0.28s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
  })
}

const leave = (el) => {
  el.style.transition = 'height 0.2s ease, opacity 0.2s ease'
  el.style.height = '0'
  el.style.opacity = '0'
}
</script>

<style scoped>
/*
  For best performance, move this font link to index.html:
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
*/
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

/* =====================
   BASE
   ===================== */
.sidebar-wrapper {
  height: 100%;
  /* Original dark gradient preserved */
  background: linear-gradient(to bottom, #1a2332, #283747);
  color: #fff;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13.5px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Own compositor layer — prevents parent repaints from affecting sidebar */
  will-change: transform;
}

/* =====================
   HEADER
   ===================== */
.sidebar-header {
  padding: 1.25rem 1.125rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1, #9333ea);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}

.logo-text {
  flex: 1;
  min-width: 0;
}

.logo-title {
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.logo-subtitle {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  margin: 3px 0 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1;
}

/* =====================
   NAV CONTAINER
   ===================== */
.nav-container {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

.nav-container::-webkit-scrollbar {
  width: 4px;
}

.nav-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.nav-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.nav-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.28);
}

.nav-block {
  /* contain: layout style keeps reflows local to each block */
  contain: layout style;
}

/* =====================
   SEPARATOR
   ===================== */
.nav-separator {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent);
  margin: 0.375rem 0;
}

/* =====================
   NAV LINK
   Only animating background + transform (compositor-safe)
   ===================== */
.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.875rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.07);
}

.nav-link.is-active {
  background: linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2));
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.nav-link.is-open {
  background: rgba(255, 255, 255, 0.05);
}

/* =====================
   NAV LEFT
   ===================== */
.nav-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon {
  font-size: 14px;
  color: #94a3b8;
  transition: color 0.15s ease, transform 0.15s ease;
}

.nav-link:hover .nav-icon {
  color: #f1f5f9;
}

.nav-icon.icon-active {
  color: #818cf8;
  transform: scale(1.1);
}

/* GPU-animated pulse via transform+opacity only */
.active-dot {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 6px;
  height: 6px;
  background: #818cf8;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.75); }
}

.nav-label {
  font-size: 13.5px;
  font-weight: 500;
  color: #cbd5e1;
  letter-spacing: -0.01em;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}

.nav-link:hover .nav-label {
  color: #f1f5f9;
}

.nav-label.label-active {
  color: #a5b4fc;
  font-weight: 600;
}

/* =====================
   CHEVRON
   ===================== */
.chevron {
  font-size: 9.5px;
  color: #475569;
  flex-shrink: 0;
  /* transform is GPU-composited */
  transition: color 0.15s ease, transform 0.25s ease;
}

.nav-link:hover .chevron {
  color: #94a3b8;
}

.chevron.rotated {
  transform: rotate(180deg);
  color: #94a3b8;
}

/* =====================
   SUBMENU
   ===================== */
.submenu-list {
  margin-top: 3px;
  margin-left: 1rem;
  padding-left: 6px;
  border-left: 2px solid rgba(99, 102, 241, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.475rem 0.75rem;
  border-radius: 7px;
  cursor: pointer;
  position: relative;
  /* Only transition background + transform */
  transition: background 0.15s ease, transform 0.15s ease;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateX(2px);
}

.submenu-item.submenu-item-active {
  background: linear-gradient(to right, rgba(99, 102, 241, 0.18), rgba(147, 51, 234, 0.18));
  border-left: 2px solid #818cf8;
}

.submenu-icon {
  font-size: 11px;
  width: 14px;
  text-align: center;
  color: #64748b;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.submenu-item:hover .submenu-icon {
  color: #f1f5f9;
}

.submenu-icon.submenu-icon-active {
  color: #818cf8;
}

.submenu-label {
  font-size: 12.5px;
  font-weight: 400;
  color: #94a3b8;
  letter-spacing: -0.005em;
  line-height: 1.4;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}

.submenu-item:hover .submenu-label {
  color: #e2e8f0;
  font-weight: 500;
}

.submenu-label.submenu-label-active {
  color: #a5b4fc;
  font-weight: 500;
}

.submenu-dot {
  width: 5px;
  height: 5px;
  background: #818cf8;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(129, 140, 248, 0.6);
  margin-left: auto;
}

/* =====================
   SUBMENU TRANSITIONS
   max-height + opacity — no layout thrash
   ===================== */
.submenu-enter-active,
.submenu-leave-active {
  transition: max-height 0.25s ease, opacity 0.25s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  max-height: 600px;
  opacity: 1;
}

.text-blue-400  { color: #60a5fa !important; }
.text-red-400   { color: #f87171 !important; }
.text-teal-400  { color: #2dd4bf !important; }
.text-cyan-400  { color: #22d3ee !important; }
.text-gray-300  { color: #d1d5db !important; }
.text-gray-400  { color: #9ca3af !important; }
.text-indigo-400{ color: #818cf8 !important; }
.text-indigo-300{ color: #a5b4fc !important; }
</style>