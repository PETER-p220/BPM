<template>
  <div class="tsb-root">

    <!-- ── LOGO / BRAND ── -->
    <div class="tsb-brand">
      <div class="tsb-brand-icon">
        <i class="fas fa-file-contract"></i>
      </div>
      <div class="tsb-brand-text">
        <span class="tsb-brand-name">TERA BPM</span>
        <span class="tsb-brand-role">Tender Management</span>
      </div>
    </div>

    <!-- ── NAV ── -->
    <nav class="tsb-nav" role="navigation">
      <ul class="tsb-list">
        <li
          v-for="(item, index) in navigations"
          :key="item.name || index"
          class="tsb-item"
          :style="{ animationDelay: `${index * 0.04}s` }"
        >

          <!-- Section divider label -->
          <div v-if="item.divider" class="tsb-divider">
            <span>{{ item.divider }}</span>
          </div>

          <!-- Parent row (skip for dividers) -->
          <div
            v-if="!item.divider"
            class="tsb-parent"
            :class="{
              'tsb-parent-active':    isActive(item),
              'tsb-parent-open':      item.active && hasChild(item),
              'tsb-parent-child-active': hasChild(item) && isChildActive(item),
            }"
            @click="clickNavigation(item, index)"
          >
            <div class="tsb-parent-left">
              <span class="tsb-icon-wrap">
                <i :class="item.icon"></i>
              </span>
              <span class="tsb-label">{{ item.label }}</span>
            </div>
            <span v-if="hasChild(item)" class="tsb-chevron" :class="{ 'tsb-chevron-open': item.active }">
              <i class="fas fa-chevron-right"></i>
            </span>
          </div>

          <!-- Submenu -->
          <transition name="tsb-sub">
            <ul v-if="!item.divider && hasChild(item) && item.active" class="tsb-sub-list">
              <li v-for="child in item.children" :key="child.name" class="tsb-sub-item">
                <div
                  class="tsb-child"
                  :class="{ 'tsb-child-active': child.path && $route.name === child.path }"
                  @click="navigateToChild(child)"
                >
                  <span class="tsb-child-dot"></span>
                  <span class="tsb-child-icon-wrap">
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

    <!-- ── FOOTER ── -->
    <div class="tsb-footer">
      <div class="tsb-footer-user">
        <div class="tsb-footer-avatar">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="tsb-footer-info">
          <span class="tsb-footer-name">Tender Officer</span>
          <span class="tsb-footer-year">© {{ new Date().getFullYear() }} TERA</span>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

const navigations = ref([
  {
    icon: 'fas fa-chart-line',
    label: 'Dashboard',
    name: 'Dashboard',
    path: 'TendersDashboard',
    active: false,
  },

  { divider: 'Tender Operations' },

  {
    icon: 'fas fa-file-contract',
    label: 'Tenders',
    name: 'TendersManagement',
    active: false,
    children: [
      { icon: 'fas fa-pen-square',   label: 'Register Tender',    name: 'Tenders',             path: 'Tenders' },
      { icon: 'fas fa-tasks',        label: 'Assign Tender',      name: 'AllAssignedTenders',  path: 'AllAssignedTenders' },
      { icon: 'fas fa-folder-open',  label: 'Submitted Tenders',  name: 'TendersDocSubmission',path: 'TendersDocSubmission' },
    ],
  },

  {
    icon: 'fas fa-trophy',
    label: 'Awards',
    name: 'AwardsManagement',
    active: false,
    children: [
      { icon: 'fas fa-envelope',   label: 'Awarding Letters',    name: 'ViewAwardLetter',       path: 'ViewAwardLetter' },
      { icon: 'fas fa-lightbulb',  label: 'Intentions to Award', name: 'ViewIntentionToAwards', path: 'ViewIntentionToAwards' },
    ],
  },

  {
    icon: 'fas fa-shield-alt',
    label: 'Performances',
    name: 'PerformancesManagement',
    active: false,
    children: [
      { icon: 'fas fa-shield-alt', label: 'Insurance Bonds',       name: 'insuranceBond',       path: 'insuranceBond' },
      { icon: 'fas fa-lock',       label: 'Security Declarations', name: 'securityDeclaration', path: 'securityDeclaration' },
    ],
  },

  { divider: 'Activity & Reports' },

  {
    icon: 'fas fa-upload',
    label: 'Updates',
    name: 'UpdatesManagement',
    active: false,
    children: [
      { icon: 'fas fa-plus-circle', label: 'Submit Update',  name: 'TenderUserCreateUpdate', path: 'TenderUserCreateUpdate' },
      { icon: 'fas fa-list',        label: 'Manage Updates', name: 'TenderUserViewUpdates',  path: 'TenderUserViewUpdates' },
    ],
  },

  {
    icon: 'fas fa-users',
    label: 'Meetings',
    name: 'MeetingsManagement',
    active: false,
    children: [
      { icon: 'fas fa-calendar-plus',  label: 'Create Attendance', name: 'TenderUserCreateAttendance', path: 'TenderUserCreateAttendance' },
      { icon: 'fas fa-calendar-check', label: 'View Attendance',   name: 'TenderUserViewAttendance',   path: 'TenderUserViewAttendance' },
      { icon: 'fas fa-plus',           label: 'Create Minutes',    name: 'TenderUserCreateMinutes',    path: 'TenderUserCreateMinutes' },
      { icon: 'fas fa-file-alt',       label: 'View Minutes',      name: 'TenderUserViewMinutes',      path: 'TenderUserViewMinutes' },
    ],
  },

  {
    icon: 'fas fa-chart-bar',
    label: 'Reports',
    name: 'ReportsManagement',
    active: false,
    children: [
      { icon: 'fas fa-file-contract', label: 'Tender Reports', name: 'TenderUserReports',      path: 'TenderUserReports' },
      { icon: 'fas fa-trophy',        label: 'Award Reports',  name: 'TenderUserAwardReports', path: 'TenderUserAwardReports' },
    ],
  },

  { divider: 'Account' },

  {
    icon: 'fas fa-shield-alt',
    label: 'Compliance',
    name: 'tenderComplianceSubmission',
    path: 'tenderComplianceSubmission',
    active: false,
  },

  {
    icon: 'fas fa-calendar-alt',
    label: 'Leave Management',
    name: 'LeaveManagement',
    path: 'TenderUserLeaveManagement',
    active: false,
  },

  {
    icon: 'fas fa-user-circle',
    label: 'My Profile',
    name: 'UserProfile2',
    path: 'UserProfile2',
    active: false,
  },
])

/* ─── Logic ─── */
function clickNavigation(item, index) {
  if (item.divider) return          // ignore clicks on divider rows
  if (hasChild(item)) {
    navigations.value.forEach((nav, i) => {
      if (i !== index && !nav.divider) nav.active = false
    })
    item.active = !item.active
  } else if (hasPath(item)) {
    router.push({ name: item.path })
  }
}

function navigateToChild(child) {
  if (child.path) router.push({ name: child.path })
}

const hasChild  = (item) => item.children && item.children.length > 0
const hasPath   = (item) => !!item.path

function isActive(item) {
  if (item.path && route.name === item.path) return true
  return false
}

function isChildActive(item) {
  if (!hasChild(item)) return false
  return item.children.some(c => c.path && route.name === c.path)
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.tsb-root {
  --navy:       #0d2b5e;
  --navy-deep:  #081d40;
  --navy-mid:   #112858;
  --navy-light: #153470;
  --blue:       #1a56db;
  --blue-lt:    #3b72f0;
  --blue-glow:  rgba(26,86,219,.35);
  --blue-dim:   rgba(26,86,219,.12);
  --white:      #ffffff;
  --text-muted: rgba(255,255,255,.45);
  --text-dim:   rgba(255,255,255,.25);
  --border:     rgba(255,255,255,.07);

  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, var(--navy-deep) 0%, var(--navy) 100%);
  font-family: 'Nunito Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow: hidden;
}

/* subtle background dot-grid */
.tsb-root::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%);
}

/* ── BRAND ── */
.tsb-brand {
  display: flex; align-items: center; gap: 12px;
  padding: 20px 18px 18px;
  border-bottom: 1px solid var(--border);
  position: relative; z-index: 1;
  flex-shrink: 0;
}
.tsb-brand-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-lt) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #fff; flex-shrink: 0;
  box-shadow: 0 4px 14px var(--blue-glow);
}
.tsb-brand-text { display: flex; flex-direction: column; gap: 1px; }
.tsb-brand-name {
  font-size: 14px; font-weight: 800; color: #fff;
  letter-spacing: .04em; line-height: 1;
}
.tsb-brand-role {
  font-size: 10.5px; color: var(--text-muted);
  font-weight: 500; letter-spacing: .04em;
}

/* ── NAV ── */
.tsb-nav {
  flex: 1; overflow-y: auto; padding: 12px 10px 8px;
  position: relative; z-index: 1;
}
.tsb-nav::-webkit-scrollbar { width: 4px; }
.tsb-nav::-webkit-scrollbar-track { background: transparent; }
.tsb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 999px; }

.tsb-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }

.tsb-item { animation: slideIn .35s ease both; }

/* Section divider */
.tsb-divider {
  display: flex; align-items: center; gap: 8px;
  padding: 16px 8px 6px;
}
.tsb-divider span {
  font-size: 9.5px; font-weight: 800; letter-spacing: .18em;
  text-transform: uppercase; color: var(--text-dim);
  white-space: nowrap;
}
.tsb-divider::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* ── PARENT ROW ── */
.tsb-parent {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 12px; border-radius: 9px; cursor: pointer;
  transition: background .18s, color .18s;
  position: relative; overflow: hidden;
  border: 1px solid transparent;
}
.tsb-parent:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.06);
}

/* Active parent (no children) */
.tsb-parent-active {
  background: var(--blue-dim) !important;
  border-color: rgba(26,86,219,.3) !important;
}
.tsb-parent-active::before {
  content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 3px; border-radius: 0 3px 3px 0;
  background: var(--blue-lt);
  box-shadow: 0 0 8px var(--blue-glow);
}
.tsb-parent-active .tsb-icon-wrap { color: var(--blue-lt); }
.tsb-parent-active .tsb-label     { color: #fff; font-weight: 700; }

/* Parent with active child */
.tsb-parent-child-active .tsb-icon-wrap { color: var(--blue-lt); }
.tsb-parent-child-active .tsb-label     { color: rgba(255,255,255,.85); font-weight: 600; }

/* Open (expanded) state */
.tsb-parent-open {
  background: rgba(255,255,255,.05);
  border-color: rgba(255,255,255,.05);
}

.tsb-parent-left { display: flex; align-items: center; gap: 11px; }

.tsb-icon-wrap {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--text-muted);
  background: rgba(255,255,255,.06);
  transition: color .18s, background .18s;
}
.tsb-parent:hover .tsb-icon-wrap { color: rgba(255,255,255,.8); background: rgba(255,255,255,.1); }

.tsb-label {
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  transition: color .18s; white-space: nowrap;
}
.tsb-parent:hover .tsb-label { color: rgba(255,255,255,.9); }

.tsb-chevron {
  font-size: 10px; color: var(--text-dim); transition: transform .22s ease;
}
.tsb-chevron-open { transform: rotate(90deg); color: rgba(255,255,255,.5); }

/* ── SUBMENU ── */
.tsb-sub-list {
  list-style: none; margin: 4px 0 4px 8px; padding: 0;
  border-left: 1px solid rgba(255,255,255,.1);
  display: flex; flex-direction: column; gap: 1px;
}

.tsb-child {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px 8px 14px; border-radius: 8px;
  cursor: pointer; transition: background .15s, color .15s;
  position: relative;
}
.tsb-child:hover { background: rgba(255,255,255,.06); }

.tsb-child-dot {
  width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,.2); transition: background .15s, transform .15s;
}
.tsb-child:hover .tsb-child-dot     { background: rgba(255,255,255,.5); transform: scale(1.3); }
.tsb-child-active .tsb-child-dot    { background: var(--blue-lt); transform: scale(1.4); box-shadow: 0 0 6px var(--blue-glow); }

.tsb-child-icon-wrap {
  font-size: 12px; color: var(--text-dim);
  width: 18px; text-align: center; flex-shrink: 0;
  transition: color .15s;
}
.tsb-child:hover .tsb-child-icon-wrap     { color: rgba(255,255,255,.6); }
.tsb-child-active .tsb-child-icon-wrap    { color: var(--blue-lt); }

.tsb-child-label {
  font-size: 12.5px; font-weight: 500; color: var(--text-muted);
  transition: color .15s; line-height: 1;
}
.tsb-child:hover .tsb-child-label  { color: rgba(255,255,255,.85); }
.tsb-child-active .tsb-child-label { color: #fff; font-weight: 700; }

/* Active child gets a left glow strip */
.tsb-child-active {
  background: var(--blue-dim);
  border: 1px solid rgba(26,86,219,.2);
}
.tsb-child-active::before {
  content: ''; position: absolute; left: 0; top: 15%; bottom: 15%;
  width: 2px; border-radius: 0 2px 2px 0;
  background: var(--blue-lt); box-shadow: 0 0 6px var(--blue-glow);
}

/* ── FOOTER ── */
.tsb-footer {
  padding: 12px 14px 16px;
  border-top: 1px solid var(--border);
  position: relative; z-index: 1;
  flex-shrink: 0;
}
.tsb-footer-user { display: flex; align-items: center; gap: 10px; }
.tsb-footer-avatar {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,.08); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--text-muted);
}
.tsb-footer-info { display: flex; flex-direction: column; gap: 1px; }
.tsb-footer-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.6); }
.tsb-footer-year { font-size: 10px; color: var(--text-dim); }

/* ── TRANSITIONS ── */
.tsb-sub-enter-active { transition: all .22s ease; }
.tsb-sub-leave-active { transition: all .18s ease; }
.tsb-sub-enter-from  { opacity: 0; transform: translateY(-6px); max-height: 0; }
.tsb-sub-leave-to    { opacity: 0; transform: translateY(-4px); max-height: 0; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>