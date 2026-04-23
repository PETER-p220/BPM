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

    <!-- Footer / Profile -->
    <div class="tsb-footer">
      <!-- Avatar -->
      <div class="tsb-footer-avatar tsb-footer-avatar--letter">
        {{ (user?.name || 'U')[0]?.toUpperCase() }}
      </div>
      <!-- Info -->
      <div class="tsb-footer-info">
        <span class="tsb-footer-name">{{ user?.name || 'My Account' }}</span>
        <span class="tsb-footer-copy">{{ user?.email || '' }}</span>
      </div>
      <!-- Actions -->
      <div class="tsb-footer-actions">
        <button
          @click="router.push({ name: 'engineerProfile' })"
          class="tsb-footer-btn"
          title="View Profile"
        >
          <i class="fas fa-user text-[10px]"></i>
        </button>
        <button
          @click="logout"
          class="tsb-footer-btn tsb-footer-btn--danger"
          title="Logout"
        >
          <i class="fas fa-sign-out-alt text-[10px]"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const router = useRouter()
const route  = useRoute()

const user = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get('/api/user/profile')
    user.value = res.data.data
  } catch (e) {
    console.error('Failed to fetch user profile', e)
  }
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

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
    name: 'MyTender',
    path: 'MyTender',
    active: false,
  },
  {
    icon: 'fas fa-project-diagram',
    label: 'Projects',
    name: 'ProjectsManagement',
    active: false,
    children: [
    
      { icon: 'fas fa-tasks',          label: 'Assigned Projects',  name: 'UserAssignedProjects',    path: 'MyProjects' },
      
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
    path: 'Myreceipts' 
   
     
     
  },

  { divider: 'Activity' },

  {
    icon: 'fas fa-file-upload',
    label: 'Updates',
    name: 'UpdatesManagement',
    active: false,
    path: 'UserUpdates' 
    
  },

  { divider: 'Account' },

  {
    icon: 'fas fa-calendar-alt',
    label: 'My Requests',
    name: 'MyRequestsNav',
    path: 'UserMyRequests',
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

/* ── CEO-aligned design palette ──────────────────────────── */
.tsb-root {
  display: flex; flex-direction: column; height: 100vh; min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(124,181,255,0.24), transparent 22%),
    linear-gradient(180deg, #174278 0%, #1f5aa5 58%, #163d71 100%);
  border-right: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.04);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow: hidden;
}

/* Subtle dot texture overlay */
.tsb-root::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%);
}

/* Top accent line */
.tsb-root::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 2;
  background: linear-gradient(90deg, transparent 0%, rgba(124,181,255,0.6) 40%, rgba(74,140,227,0.3) 100%);
}

/* ── Brand header ──────────────────────────────────────────── */
.tsb-brand {
  display: flex; align-items: center; gap: 11px;
  padding: 18px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: relative; z-index: 1; flex-shrink: 0;
}
.tsb-brand-icon {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, #2c6cc0 0%, #4a8ce3 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #fff;
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 4px 14px rgba(8,34,67,0.3);
}
.tsb-brand-text { display: flex; flex-direction: column; gap: 2px; }
.tsb-brand-name { font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: .06em; line-height: 1; }
.tsb-brand-role { font-size: 10px; color: rgba(255,255,255,0.55); font-weight: 500; letter-spacing: .05em; }

/* ── Nav scroll area ──────────────────────────────────────── */
.tsb-nav {
  flex: 1; overflow-y: auto; padding: 10px 8px 8px;
  position: relative; z-index: 1;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.22) transparent;
}
.tsb-nav::-webkit-scrollbar { width: 3px; }
.tsb-nav::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); }
.tsb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
.tsb-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.32); }

.tsb-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.tsb-item { animation: tsb-slide .3s ease both; }

/* ── Section dividers ─────────────────────────────────────── */
.tsb-divider { display: flex; align-items: center; gap: 8px; padding: 14px 6px 5px; }
.tsb-divider span {
  font-size: 9px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,255,255,0.38); white-space: nowrap;
}
.tsb-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }

/* ── Nav items ────────────────────────────────────────────── */
.tsb-parent {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; border-radius: 10px; cursor: pointer;
  position: relative; border: 1px solid transparent;
  transition: background .15s, border-color .15s, box-shadow .15s, transform .18s;
  backdrop-filter: blur(8px);
}
.tsb-parent:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.1);
}
.tsb-parent--open {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.1);
}

/* Active = CEO white-card style */
.tsb-parent--active {
  background: #fff !important;
  border-color: rgba(255,255,255,0.9) !important;
  box-shadow: 0 16px 30px rgba(8,38,74,0.22) !important;
  transform: translateX(4px);
}
.tsb-parent--active .tsb-icon-wrap {
  background: #deebfd !important;
  color: #174278 !important;
}
.tsb-parent--active .tsb-label   { color: #174278 !important; font-weight: 700; }
.tsb-parent--active .tsb-chevron { color: #4a7fc0; }

/* Child-open parent — slight highlight */
.tsb-parent--child-active .tsb-icon-wrap { background: rgba(255,255,255,0.16); color: rgba(255,255,255,0.9); }
.tsb-parent--child-active .tsb-label     { color: #fff; font-weight: 600; }

.tsb-parent-left { display: flex; align-items: center; gap: 10px; }

/* Icon box */
.tsb-icon-wrap {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.08);
  transition: background .15s, color .15s;
}
.tsb-parent:hover .tsb-icon-wrap { background: rgba(255,255,255,0.16); color: #fff; }

/* Label */
.tsb-label {
  font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.82);
  transition: color .15s; white-space: nowrap;
}
.tsb-parent:hover .tsb-label { color: #fff; }
.tsb-parent--open .tsb-label { color: #fff; font-weight: 600; }

/* Chevron */
.tsb-chevron { font-size: 9px; color: rgba(255,255,255,0.38); transition: transform .22s ease, color .15s; }
.tsb-chevron--open  { transform: rotate(90deg); color: rgba(255,255,255,0.6); }
.tsb-parent:hover .tsb-chevron { color: rgba(255,255,255,0.55); }

/* ── Submenu ──────────────────────────────────────────────── */
.tsb-sub-list {
  list-style: none; margin: 3px 0 3px 10px; padding: 2px 0;
  border-left: 1px solid rgba(255,255,255,0.1);
  display: flex; flex-direction: column; gap: 1px;
}

.tsb-child {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px 7px 13px; border-radius: 8px; cursor: pointer;
  border: 1px solid transparent; transition: background .15s, box-shadow .15s, transform .18s;
  position: relative; backdrop-filter: blur(8px);
}
.tsb-child:hover { background: rgba(255,255,255,0.08); }

/* Child active = smaller white card */
.tsb-child--active {
  background: #fff !important;
  border-color: rgba(255,255,255,0.9) !important;
  box-shadow: 0 10px 22px rgba(8,38,74,0.16) !important;
  transform: translateX(3px);
}
.tsb-child--active .tsb-child-dot   { background: #2f78dd; transform: scale(1.4); box-shadow: 0 0 6px rgba(47,120,221,.5); }
.tsb-child--active .tsb-child-icon  { color: #174278; }
.tsb-child--active .tsb-child-label { color: #174278; font-weight: 700; }

.tsb-child-dot {
  width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,0.3); margin-left: -1rem;
  transition: background .15s, transform .15s, box-shadow .15s;
}
.tsb-child:hover .tsb-child-dot { background: rgba(255,255,255,0.6); transform: scale(1.3); }

.tsb-child-icon { font-size: 11px; color: rgba(255,255,255,0.4); flex-shrink: 0; width: 16px; text-align: center; transition: color .15s; }
.tsb-child:hover .tsb-child-icon { color: rgba(255,255,255,0.75); }

.tsb-child-label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.72); transition: color .15s; }
.tsb-child:hover .tsb-child-label { color: #fff; }

/* ── Footer ───────────────────────────────────────────────── */
.tsb-footer {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 10px 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: linear-gradient(180deg, rgba(69,126,205,0.86), rgba(34,86,157,0.92));
  position: relative; z-index: 1; flex-shrink: 0;
}
.tsb-footer-avatar {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: rgba(255,255,255,0.8);
}
.tsb-footer-avatar--letter {
  background: #fff;
  color: #1e4d8e;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(8,34,67,0.3);
}
.tsb-footer-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.tsb-footer-name { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.9); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tsb-footer-copy { font-size: 9.5px; color: rgba(255,255,255,0.45); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tsb-footer-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
.tsb-footer-btn {
  width: 26px; height: 26px; border-radius: 6px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
  transition: background .15s, color .15s;
}
.tsb-footer-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }
.tsb-footer-btn--danger:hover { background: rgba(255,80,80,0.18); color: #fca5a5; }

/* ── Transitions ─────────────────────────────────────────── */
.tsb-sub-enter-active { transition: opacity .2s ease, transform .2s ease; }
.tsb-sub-leave-active { transition: opacity .15s ease, transform .15s ease; }
.tsb-sub-enter-from  { opacity: 0; transform: translateY(-5px); }
.tsb-sub-leave-to    { opacity: 0; transform: translateY(-3px); }

@keyframes tsb-slide {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>