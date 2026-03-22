<template>
  <div class="tsb-root">

    <!-- Brand -->
    <div class="tsb-brand">
      <div class="tsb-brand-icon">
        <i class="fas fa-briefcase"></i>
      </div>
      <div class="tsb-brand-text">
        <span class="tsb-brand-name">User Portal</span>
        <span class="tsb-brand-role">Dashboard</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="tsb-nav" role="navigation">
      <ul class="tsb-list">
        <li
          v-for="(item, index) in navigations"
          :key="item.name || index"
          class="tsb-item"
          :style="{ animationDelay: `${index * 0.035}s` }"
        >
          <!-- Divider -->
          <div v-if="item.divider" class="tsb-divider">
            <span>{{ item.divider }}</span>
          </div>

          <!-- Parent row -->
          <div
            v-if="!item.divider"
            class="tsb-parent"
            :class="{
              'tsb-parent--active':       isActive(item),
              'tsb-parent--open':         item.active && hasChild(item),
              'tsb-parent--child-active': hasChild(item) && isChildActive(item),
            }"
            @click="clickNavigation(item, index)"
          >
            <div class="tsb-parent-left">
              <span class="tsb-icon-wrap">
                <i :class="item.icon"></i>
              </span>
              <span class="tsb-label">{{ item.label }}</span>
            </div>
            <span v-if="hasChild(item)" class="tsb-chevron" :class="{ 'tsb-chevron--open': item.active }">
              <i class="fas fa-chevron-right"></i>
            </span>
          </div>

          <!-- Submenu -->
          <transition name="tsb-sub">
            <ul v-if="!item.divider && hasChild(item) && item.active" class="tsb-sub-list">
              <li v-for="child in item.children" :key="child.name" class="tsb-sub-item">
                <div
                  class="tsb-child"
                  :class="{ 'tsb-child--active': child.path && $route.name === child.path }"
                  @click="navigateToChild(child)"
                >
                  <span class="tsb-child-dot"></span>
                  <span class="tsb-child-icon">
                    <i :class="child.icon"></i>
                  </span>
                  <span class="tsb-child-label">{{ child.label }}</span>
                </div>
              </li>
            </ul>
          </transition>

        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="tsb-footer">
      <div class="tsb-footer-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="tsb-footer-info">
        <span class="tsb-footer-name">My Account</span>
        <span class="tsb-footer-copy">© {{ new Date().getFullYear() }} Portal</span>
      </div>
      <div class="tsb-footer-status"></div>
    </div>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route  = useRoute()

const navigations = ref([
  {
    icon: 'fas fa-chart-line',
    label: 'Dashboard',
    name: 'Dashboard',
    path: 'UserDashboard',
    active: false,
  },

  { divider: 'Tenders & Projects' },

  {
    icon: 'fas fa-file-contract',
    label: 'Tenders',
    name: 'TendersManagement',
    active: false,
    children: [
      { icon: 'fas fa-tasks',       label: 'Assigned Tenders', name: 'UserAssignedTenders',   path: 'MyTender' },
      { icon: 'fas fa-paper-plane', label: 'Submit Tender',    name: 'UserTenderSubmissions', path: 'MySubmissions' },
      { icon: 'fas fa-calculator',  label: 'Submit Quotation', name: 'UserQuotations',        path: 'MySchedules' },
    ],
  },
  {
    icon: 'fas fa-project-diagram',
    label: 'Projects',
    name: 'ProjectsManagement',
    active: false,
    children: [
      { icon: 'fas fa-file-signature', label: 'Appointment Letter', name: 'UserAppointmentLetter',   path: 'UserAppointmentLetter' },
      { icon: 'fas fa-tasks',          label: 'Assigned Projects',  name: 'UserAssignedProjects',    path: 'MyProjects' },
      { icon: 'fas fa-chart-bar',      label: 'Submit Analysis',    name: 'UserAnalysisSubmissions', path: 'UserAnalyses' },
      { icon: 'fas fa-envelope',       label: 'Submit Request',     name: 'UserRequests',            path: 'MyRequests' },
      { icon: 'fas fa-clock',          label: 'Extend Request',     name: 'UserExtensionRequests',   path: 'UserExtentions' },
    ],
  },

  { divider: 'Finance' },

  {
    icon: 'fas fa-file-invoice',
    label: 'Receipts',
    name: 'ReceiptsManagement',
    active: false,
    children: [
      { icon: 'fas fa-upload', label: 'Submit Receipt',  name: 'UserSubmitReceipt',  path: 'SubmitReceipt' },
      { icon: 'fas fa-search', label: 'Manage Receipts', name: 'UserManageReceipts', path: 'Myreceipts' },
    ],
  },

  { divider: 'Activity' },

  {
    icon: 'fas fa-file-upload',
    label: 'Updates',
    name: 'UpdatesManagement',
    active: false,
    children: [
      { icon: 'fas fa-plus', label: 'Create Update',  name: 'UserCreateUpdate',  path: 'UserSubmitUpdate' },
      { icon: 'fas fa-eye',  label: 'Manage Updates', name: 'UserManageUpdates', path: 'UserUpdates' },
    ],
  },

  { divider: 'Account' },

  {
    icon: 'fas fa-calendar-alt',
    label: 'Leave Management',
    name: 'LeaveManagement',
    path: 'UserLeaveManagement',
    active: false,
  },
  {
    icon: 'fas fa-user-circle',
    label: 'Profile',
    name: 'engineerProfile',
    path: 'engineerProfile',
    active: false,
  },
  {
    icon: 'fas fa-ellipsis-h',
    label: 'Others',
    name: 'Others',
    path: 'Others',
    active: false,
  },
])

function clickNavigation(item, index) {
  if (item.divider) return
  if (hasChild(item)) {
    navigations.value.forEach((nav, i) => { if (i !== index && !nav.divider) nav.active = false })
    item.active = !item.active
  } else if (item.path) {
    router.push({ name: item.path })
  }
}

function navigateToChild(child) {
  if (child.path) router.push({ name: child.path })
}

const hasChild = (item) => item.children?.length > 0

function isActive(item) {
  return !!(item.path && route.name === item.path)
}
function isChildActive(item) {
  return hasChild(item) && item.children.some(c => c.path && route.name === c.path)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.tsb-root {
  --c-bg:        #0b1f45;
  --c-deep:      #07152e;
  --c-card:      rgba(255,255,255,.04);
  --c-hover:     rgba(255,255,255,.055);
  --c-active:    rgba(59,114,240,.15);
  --c-border:    rgba(255,255,255,.07);
  --c-blue:      #3b72f0;
  --c-glow:      rgba(59,114,240,.4);
  --c-dim-blue:  rgba(59,114,240,.18);
  --c-text:      rgba(255,255,255,.9);
  --c-muted:     rgba(255,255,255,.45);
  --c-dim:       rgba(255,255,255,.22);

  display: flex; flex-direction: column; height: 100vh; min-height: 100vh;
  background: linear-gradient(175deg, var(--c-bg) 0%, var(--c-deep) 100%);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow: hidden;
}

.tsb-root::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.032) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
}
.tsb-root::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 2;
  background: linear-gradient(90deg, transparent 0%, var(--c-blue) 40%, rgba(59,114,240,.3) 100%);
}

.tsb-brand {
  display: flex; align-items: center; gap: 11px;
  padding: 18px 16px 16px; border-bottom: 1px solid var(--c-border);
  position: relative; z-index: 1; flex-shrink: 0;
}
.tsb-brand-icon {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, #1a56db 0%, var(--c-blue) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #fff;
  box-shadow: 0 0 0 1px rgba(59,114,240,.3), 0 4px 16px var(--c-glow);
}
.tsb-brand-text { display: flex; flex-direction: column; gap: 2px; }
.tsb-brand-name { font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: .06em; line-height: 1; }
.tsb-brand-role { font-size: 10px; color: var(--c-muted); font-weight: 500; letter-spacing: .05em; }

.tsb-nav {
  flex: 1; overflow-y: auto; padding: 10px 8px 8px;
  position: relative; z-index: 1;
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.1) transparent;
}
.tsb-nav::-webkit-scrollbar { width: 3px; }
.tsb-nav::-webkit-scrollbar-track { background: transparent; }
.tsb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 999px; }

.tsb-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.tsb-item { animation: tsb-slide .3s ease both; }

.tsb-divider { display: flex; align-items: center; gap: 8px; padding: 14px 6px 5px; }
.tsb-divider span { font-size: 9px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--c-dim); white-space: nowrap; }
.tsb-divider::after { content: ''; flex: 1; height: 1px; background: var(--c-border); }

.tsb-parent {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  position: relative; overflow: hidden; border: 1px solid transparent;
  transition: background .15s, border-color .15s;
}
.tsb-parent:hover         { background: var(--c-hover); border-color: rgba(255,255,255,.05); }
.tsb-parent--open         { background: var(--c-hover); border-color: rgba(255,255,255,.06); }
.tsb-parent--active       { background: var(--c-active) !important; border-color: rgba(59,114,240,.25) !important; }
.tsb-parent--active::before {
  content: ''; position: absolute; left: 0; top: 18%; bottom: 18%;
  width: 3px; border-radius: 0 3px 3px 0;
  background: var(--c-blue); box-shadow: 0 0 10px var(--c-glow);
}
.tsb-parent--active .tsb-icon-wrap { background: var(--c-dim-blue); color: var(--c-blue); }
.tsb-parent--active .tsb-label     { color: #fff; font-weight: 600; }
.tsb-parent--child-active .tsb-icon-wrap { color: var(--c-blue); }
.tsb-parent--child-active .tsb-label     { color: rgba(255,255,255,.85); font-weight: 600; }

.tsb-parent-left { display: flex; align-items: center; gap: 10px; }

.tsb-icon-wrap {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--c-muted); background: var(--c-card);
  transition: background .15s, color .15s;
}
.tsb-parent:hover .tsb-icon-wrap { background: rgba(255,255,255,.09); color: rgba(255,255,255,.75); }
.tsb-parent--open .tsb-icon-wrap { color: rgba(255,255,255,.75); }

.tsb-label { font-size: 12.5px; font-weight: 500; color: var(--c-muted); transition: color .15s; white-space: nowrap; }
.tsb-parent:hover .tsb-label { color: var(--c-text); }
.tsb-parent--open .tsb-label { color: rgba(255,255,255,.8); }

.tsb-chevron { font-size: 9px; color: var(--c-dim); transition: transform .22s ease, color .15s; }
.tsb-chevron--open { transform: rotate(90deg); color: var(--c-muted); }
.tsb-parent:hover .tsb-chevron { color: var(--c-muted); }

.tsb-sub-list {
  list-style: none; margin: 3px 0 3px 10px; padding: 2px 0;
  border-left: 1px solid rgba(255,255,255,.09);
  display: flex; flex-direction: column; gap: 1px;
}

.tsb-child {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px 7px 13px; border-radius: 7px; cursor: pointer;
  border: 1px solid transparent; transition: background .15s; position: relative;
}
.tsb-child:hover { background: rgba(255,255,255,.05); }

.tsb-child-dot {
  width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,.18); margin-left: -1rem;
  transition: background .15s, transform .15s, box-shadow .15s;
}
.tsb-child:hover .tsb-child-dot   { background: rgba(255,255,255,.45); transform: scale(1.3); }
.tsb-child--active .tsb-child-dot { background: var(--c-blue); transform: scale(1.4); box-shadow: 0 0 7px var(--c-glow); }

.tsb-child-icon { font-size: 11px; color: var(--c-dim); flex-shrink: 0; width: 16px; text-align: center; transition: color .15s; }
.tsb-child:hover .tsb-child-icon   { color: rgba(255,255,255,.55); }
.tsb-child--active .tsb-child-icon { color: var(--c-blue); }

.tsb-child-label { font-size: 12px; font-weight: 500; color: var(--c-muted); transition: color .15s; }
.tsb-child:hover .tsb-child-label   { color: rgba(255,255,255,.8); }
.tsb-child--active .tsb-child-label { color: #fff; font-weight: 600; }

.tsb-child--active { background: var(--c-active); border-color: rgba(59,114,240,.18); }
.tsb-child--active::before {
  content: ''; position: absolute; left: 0; top: 18%; bottom: 18%;
  width: 2px; border-radius: 0 2px 2px 0;
  background: var(--c-blue); box-shadow: 0 0 6px var(--c-glow);
}

.tsb-footer {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px 14px; border-top: 1px solid var(--c-border);
  position: relative; z-index: 1; flex-shrink: 0;
}
.tsb-footer-avatar {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,.06); border: 1px solid var(--c-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--c-muted);
}
.tsb-footer-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.tsb-footer-name { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,.55); }
.tsb-footer-copy { font-size: 10px; color: var(--c-dim); }
.tsb-footer-status { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.5); flex-shrink: 0; }

.tsb-sub-enter-active { transition: opacity .2s ease, transform .2s ease; }
.tsb-sub-leave-active { transition: opacity .15s ease, transform .15s ease; }
.tsb-sub-enter-from  { opacity: 0; transform: translateY(-5px); }
.tsb-sub-leave-to    { opacity: 0; transform: translateY(-3px); }

@keyframes tsb-slide {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>