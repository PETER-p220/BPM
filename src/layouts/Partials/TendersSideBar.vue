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

          <!-- Nav link (flat, no dropdowns) -->
          <router-link
            v-else
            :to="{ name: item.path }"
            class="tsb-parent"
            :class="{ 'tsb-parent-active': isActive(item) }"
          >
            <div class="tsb-parent-left">
              <span class="tsb-icon-wrap">
                <i :class="item.icon"></i>
              </span>
              <span class="tsb-label">{{ item.label }}</span>
            </div>
          </router-link>
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
  { icon: 'fas fa-chart-line',      label: 'Dashboard',            name: 'Dashboard',                  path: 'TendersDashboard' },

  { divider: 'Tender Operations' },

  { icon: 'fas fa-file-contract',   label: 'Tenders',              name: 'Tenders',                    path: 'Tenders' },


  // { divider: 'Projects' },

  // { icon: 'fas fa-plus-circle',     label: 'Assign Projects',      name: 'HrAssignProject',            path: 'HrAssignProject' },
  // { icon: 'fas fa-tasks',           label: 'Manage Projects',      name: 'HrManageProject',            path: 'HrManageProject' },
  // { icon: 'fas fa-folder-open',     label: 'Project Portfolio',    name: 'ProjectPortofolio',          path: 'ProjectPortofolio' },
  // { icon: 'fas fa-shield-alt',      label: 'Insurance Bonds',      name: 'insuranceBond',              path: 'insuranceBond' },
  // { icon: 'fas fa-lock',            label: 'Security Declarations',name: 'securityDeclaration',        path: 'securityDeclaration' },

  { divider: 'Activity & Reports' },

  { icon: 'fas fa-list',            label: 'My Updates',           name: 'TenderUserViewUpdates',      path: 'TenderUserViewUpdates' },
  { icon: 'fas fa-calendar-plus',   label: 'Create Attendance',    name: 'TenderUserCreateAttendance', path: 'TenderUserCreateAttendance' },
  { icon: 'fas fa-calendar-check',  label: 'View Attendance',      name: 'TenderUserViewAttendance',   path: 'TenderUserViewAttendance' },
  { icon: 'fas fa-plus',            label: 'Create Minutes',       name: 'TenderUserCreateMinutes',    path: 'TenderUserCreateMinutes' },
  { icon: 'fas fa-file-alt',        label: 'View Minutes',         name: 'TenderUserViewMinutes',      path: 'TenderUserViewMinutes' },
  { icon: 'fas fa-file-contract',   label: 'Tender Reports',       name: 'TenderUserReports',          path: 'TenderUserReports' },
  { icon: 'fas fa-trophy',          label: 'Award Reports',        name: 'TenderUserAwardReports',     path: 'TenderUserAwardReports' },

  { divider: 'Account' },

  { icon: 'fas fa-shield-alt',      label: 'Compliance',           name: 'tenderComplianceSubmission', path: 'tenderComplianceSubmission' },
  { icon: 'fas fa-paper-plane',    label: 'My Requests',     name: 'TenderMyRequests',  path: 'TenderMyRequests' },
  { icon: 'fas fa-user-circle',     label: 'My Profile',           name: 'UserProfile2',               path: 'UserProfile2' },
])

function isActive(item) {
  return item.path && route.name === item.path
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.tsb-root {
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
  border: 1px solid rgba(255, 255, 255, 0.18);
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
  text-decoration: none;
}
.tsb-parent:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.06);
}

/* Active link */
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

.tsb-parent-left { display: flex; align-items: center; gap: 11px; }

.tsb-icon-wrap {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: rgba(255,255,255,.72);
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.08);
  transition: color .18s, background .18s;
}
.tsb-parent:hover .tsb-icon-wrap { color: #fff; background: rgba(255,255,255,.16); }

.tsb-label {
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,.90);
  transition: color .18s; white-space: nowrap;
}
.tsb-parent:hover .tsb-label { color: #fff; }

/* ── FOOTER ── */
.tsb-footer {
  padding: 12px 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative; z-index: 1;
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(69, 126, 205, 0.15), rgba(34, 86, 157, 0.2));
}
.tsb-footer-user { display: flex; align-items: center; gap: 10px; }
.tsb-footer-avatar {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: rgba(255,255,255,.72);
}
.tsb-footer-info { display: flex; flex-direction: column; gap: 1px; }
.tsb-footer-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.85); }
.tsb-footer-year { font-size: 10px; color: rgba(255,255,255,.45); }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>