<template>
  <div class="acc-root">

    <!-- ── LOGO / BRAND ── -->
    <div class="acc-brand">
      <div class="acc-brand-icon">
        <i class="fas fa-calculator"></i>
      </div>
      <div class="acc-brand-text">
        <span class="acc-brand-name">TERA BPM</span>
        <span class="acc-brand-role">Finance Portal</span>
      </div>
    </div>

    <!-- ── NAV ── -->
    <nav class="acc-nav" role="navigation">
      <ul class="acc-list">
        <li
          v-for="(item, index) in navigations"
          :key="item.name || index"
          class="acc-item"
          :style="{ animationDelay: `${index * 0.04}s` }"
        >
          <!-- Section divider label -->
          <div v-if="item.divider" class="acc-divider">
            <span>{{ item.divider }}</span>
          </div>

          <!-- Dropdown parent -->
          <template v-else-if="item.children && item.children.length">
            <div
              class="acc-parent"
              :class="{ 'acc-parent-active': isChildActive(item) }"
              @click="toggleDropdown(item, index)"
            >
              <div class="acc-parent-left">
                <span class="acc-icon-wrap"><i :class="item.icon"></i></span>
                <span class="acc-label">{{ item.label }}</span>
              </div>
              <svg
                class="acc-chevron"
                :class="{ 'acc-chevron-open': item.active }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <transition
              enter-active-class="acc-dropdown-enter-active"
              enter-from-class="acc-dropdown-enter-from"
              enter-to-class="acc-dropdown-enter-to"
              leave-active-class="acc-dropdown-leave-active"
              leave-from-class="acc-dropdown-leave-from"
              leave-to-class="acc-dropdown-leave-to"
            >
              <ul v-if="item.active" class="acc-children">
                <li v-for="child in item.children" :key="child.name">
                  <router-link
                    :to="{ name: child.path }"
                    class="acc-child"
                    :class="{ 'acc-child-active': isActive(child) }"
                  >
                    <i :class="child.icon" class="acc-child-icon"></i>
                    <span class="acc-child-label">{{ child.label }}</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </template>

          <!-- Flat nav link -->
          <router-link
            v-else
            :to="{ name: item.path }"
            class="acc-parent"
            :class="{ 'acc-parent-active': isActive(item) }"
          >
            <div class="acc-parent-left">
              <span class="acc-icon-wrap"><i :class="item.icon"></i></span>
              <span class="acc-label">{{ item.label }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- ── FOOTER ── -->
    <div class="acc-footer">
      <div class="acc-footer-user">
        <div class="acc-footer-avatar">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="acc-footer-info">
          <span class="acc-footer-name">Accountant</span>
          <span class="acc-footer-year">© {{ new Date().getFullYear() }} TERA</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navigations = ref([
  { icon: 'fas fa-chart-line', label: 'Dashboard', name: 'AccountantDashbaord', path: 'AccountantDashbaord' },

  // { divider: 'Projects & Requests' },

  // {
  //   icon: 'fas fa-project-diagram', label: 'Projects', name: 'Projects', active: false,
  //   children: [
  //     { icon: 'fas fa-chart-bar', label: 'Analysis', name: 'AccViewAnalysis', path: 'AccViewAnalysis' },
  //     { icon: 'fas fa-folder-open', label: 'Project Portfolio', name: 'AccViewPortfolio', path: 'AccViewPortofolio' },
  //     { icon: 'fas fa-money-check-alt', label: 'Payment Follow-Up', name: 'AccFollowUp', path: 'Followup' },
  //   ]
  // },
  

  { icon: 'fas fa-coins', label: 'Financial Records', name: 'FinancialRecords', path: 'FinancialRecords' },
  { icon: 'fas fa-calculator', label: 'Budget Management', name: 'BudgetManagement', path: 'AccMyBudgets' },
  { icon: 'fas fa-receipt', label: 'Receipts', name: 'AccntntGetALlReceipts', path: 'AccntntGetALlReceipts' },
  { icon: 'fas fa-file-invoice-dollar', label: 'Invoices', name: 'AccManageInvoices', path: 'AccManageInvoices' },
  
  

 

  // { icon: 'fas fa-shield-alt', label: 'Compliance', name: 'accountantComplianceSubmission', path: 'accountantComplianceSubmission' },
  {
    icon: 'fas fa-inbox', label: 'Requests', name: 'RequestsManagement', active: false,
    children: [
      { icon: 'fas fa-check-circle', label: 'Approve Requests', name: 'AccManageRequests', path: 'AccManageRequests' },
      { icon: 'fas fa-clock', label: 'Extension Requests', name: 'AccManageExtendedRequests', path: 'AccManageExtendedRequests' },
    ]
  },
  { icon: 'fas fa-paper-plane', label: 'My Requests', name: 'AccMyRequests', path: 'AccMyRequests' },
  { icon: 'fas fa-user-circle', label: 'My Profile', name: 'UserProfile4', path: 'UserProfile4' },
  { icon: 'fas fa-list', label: 'My Updates', name: 'AccntantViewUpdate', path: 'AccntantViewUpdate' },
])

function isActive(item) {
  return item.path && route.name === item.path
}

function isChildActive(item) {
  return item.children?.some(child => route.name === child.path)
}

function toggleDropdown(item, index) {
  navigations.value.forEach((nav, idx) => {
    if (idx !== index && nav.children) nav.active = false
  })
  item.active = !item.active
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.acc-root {
  --navy:       #1f5aa5;
  --navy-deep:  #174278;
  --navy-mid:   #1b4f94;
  --navy-light: #2468b8;
  --blue:       #2c6cc0;
  --blue-lt:    #4a8ce3;
  --blue-glow:  rgba(44,108,192,.35);
  --blue-dim:   rgba(44,108,192,.15);
  --white:      #ffffff;
  --text-muted: rgba(255,255,255,.90);
  --text-dim:   rgba(255,255,255,.40);
  --border:     rgba(255,255,255,.08);

  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background:
    radial-gradient(circle at top left, rgba(124, 181, 255, 0.24), transparent 22%),
    linear-gradient(180deg, var(--navy-deep) 0%, var(--navy) 58%, #163d71 100%);
  font-family: 'Nunito Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.04);
}

/* subtle background dot-grid */
.acc-root::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%);
}

/* ── BRAND ── */
.acc-brand {
  display: flex; align-items: center; gap: 12px;
  padding: 20px 18px 18px;
  border-bottom: 1px solid var(--border);
  position: relative; z-index: 1;
  flex-shrink: 0;
}
.acc-brand-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-lt) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #fff; flex-shrink: 0;
  box-shadow: 0 4px 14px var(--blue-glow);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.acc-brand-text { display: flex; flex-direction: column; gap: 1px; }
.acc-brand-name {
  font-size: 14px; font-weight: 800; color: #fff;
  letter-spacing: .04em; line-height: 1;
}
.acc-brand-role {
  font-size: 10.5px; color: var(--text-muted);
  font-weight: 500; letter-spacing: .04em;
}

/* ── NAV ── */
.acc-nav {
  flex: 1; overflow-y: auto; padding: 12px 10px 8px;
  position: relative; z-index: 1;
}
.acc-nav::-webkit-scrollbar { width: 4px; }
.acc-nav::-webkit-scrollbar-track { background: transparent; }
.acc-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 999px; }

.acc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }

.acc-item { animation: accSlideIn .35s ease both; }

/* Section divider */
.acc-divider {
  display: flex; align-items: center; gap: 8px;
  padding: 16px 8px 6px;
}
.acc-divider span {
  font-size: 9.5px; font-weight: 800; letter-spacing: .18em;
  text-transform: uppercase; color: var(--text-dim);
  white-space: nowrap;
}
.acc-divider::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* ── PARENT ROW ── */
.acc-parent {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 12px; border-radius: 9px; cursor: pointer;
  transition: background .18s, color .18s;
  position: relative; overflow: hidden;
  border: 1px solid transparent;
  text-decoration: none; color: inherit;
}
.acc-parent:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.06);
}

/* Active link */
.acc-parent-active {
  background: var(--blue-dim) !important;
  border-color: rgba(26,86,219,.3) !important;
}
.acc-parent-active::before {
  content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 3px; border-radius: 0 3px 3px 0;
  background: var(--blue-lt);
  box-shadow: 0 0 8px var(--blue-glow);
}
.acc-parent-active .acc-icon-wrap { color: var(--blue-lt); }
.acc-parent-active .acc-label     { color: #fff; font-weight: 700; }

.acc-parent-left { display: flex; align-items: center; gap: 11px; }

.acc-icon-wrap {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: rgba(255,255,255,.72);
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.08);
  transition: color .18s, background .18s;
}
.acc-parent:hover .acc-icon-wrap { color: #fff; background: rgba(255,255,255,.16); }

.acc-label {
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,.90);
  transition: color .18s; white-space: nowrap;
}
.acc-parent:hover .acc-label { color: #fff; }

/* Chevron */
.acc-chevron {
  width: 16px; height: 16px; color: rgba(255,255,255,.40);
  transition: transform .25s ease, color .18s;
  flex-shrink: 0;
}
.acc-chevron-open { transform: rotate(180deg); }
.acc-parent:hover .acc-chevron { color: rgba(255,255,255,.72); }

/* ── CHILDREN ── */
.acc-children {
  list-style: none; margin: 2px 0 0; padding: 0 0 0 14px;
  border-left: 2px solid rgba(255,255,255,.08);
  margin-left: 20px;
  display: flex; flex-direction: column; gap: 1px;
}
.acc-child {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 7px;
  text-decoration: none; color: rgba(255,255,255,.72);
  transition: background .18s, color .18s;
  font-size: 12.5px; font-weight: 500;
}
.acc-child:hover { background: rgba(255,255,255,.06); color: #fff; }
.acc-child-active {
  background: var(--blue-dim) !important;
  color: #fff !important;
  border-left: 2px solid var(--blue-lt);
}
.acc-child-icon { font-size: 11px; width: 16px; text-align: center; }
.acc-child-label { white-space: nowrap; }

/* Dropdown transitions */
.acc-dropdown-enter-active { transition: all .25s ease-out; }
.acc-dropdown-leave-active { transition: all .18s ease-in; }
.acc-dropdown-enter-from, .acc-dropdown-leave-to { opacity: 0; max-height: 0; overflow: hidden; }
.acc-dropdown-enter-to, .acc-dropdown-leave-from { opacity: 1; max-height: 500px; }

/* ── FOOTER ── */
.acc-footer {
  padding: 12px 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative; z-index: 1;
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(69, 126, 205, 0.15), rgba(34, 86, 157, 0.2));
}
.acc-footer-user { display: flex; align-items: center; gap: 10px; }
.acc-footer-avatar {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: rgba(255,255,255,.72);
}
.acc-footer-info { display: flex; flex-direction: column; gap: 1px; }
.acc-footer-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.85); }
.acc-footer-year { font-size: 10px; color: rgba(255,255,255,.45); }

@keyframes accSlideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>