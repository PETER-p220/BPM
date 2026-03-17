<template>
  <div class="em-root">

    <!-- ══ PAGE HEADER ══ -->
    <div class="em-header">
      <div class="em-header-inner">
        <div class="em-header-copy">
          <div class="em-header-breadcrumb">HR Management &rsaquo; Employees</div>
          <h1 class="em-page-title">Employee Management</h1>
          <p class="em-page-sub">{{ employees.length }} employees across {{ departments.length }} departments</p>
        </div>
        <div class="em-header-actions">
          <button @click="exportToExcel" :disabled="isExporting" class="em-btn em-btn-green">
            <i class="fas fa-file-excel"></i>
            {{ isExporting ? 'Exporting…' : 'Export Excel' }}
          </button>
          <button @click="showAddModal = true" class="em-btn em-btn-primary">
            <i class="fas fa-plus"></i>
            Add Employee
          </button>
        </div>
      </div>
    </div>

    <div class="em-body">

      <!-- ══ STAT CARDS ══ -->
      <div class="em-stats">
        <div class="em-stat-card" v-for="stat in statCards" :key="stat.label" :style="{ '--accent': stat.color }">
          <div class="em-stat-icon-wrap">
            <i :class="stat.icon"></i>
          </div>
          <div class="em-stat-content">
            <span class="em-stat-value">{{ stat.value }}</span>
            <span class="em-stat-label">{{ stat.label }}</span>
          </div>
          <div class="em-stat-bar" :style="{ width: stat.pct + '%' }"></div>
        </div>
      </div>

      <!-- ══ FILTERS ══ -->
      <div class="em-filters">
        <div class="em-search-wrap">
          <i class="fas fa-search em-search-icon"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Search by name, email, phone, or national ID…"
            class="em-search-input"
          />
          <button v-if="search" @click="search = ''" class="em-search-clear">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <select v-model="statusFilter" class="em-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>
        <select v-model="departmentFilter" class="em-select">
          <option value="">All Departments</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
        <select v-model="genderFilter" class="em-select">
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div class="em-filter-info" v-if="filteredEmployees.length !== employees.length">
          <i class="fas fa-filter"></i>
          {{ filteredEmployees.length }} of {{ employees.length }} shown
        </div>
      </div>

      <!-- ══ TABLE ══ -->
      <div class="em-table-card">

        <div class="em-table-top">
          <div class="em-table-title">
            <i class="fas fa-table"></i>
            Employee Directory
          </div>
          <div class="em-table-meta">{{ filteredEmployees.length }} records</div>
        </div>

        <div class="em-table-scroll">
          <table class="em-table">
            <thead>
              <tr>
                <th class="em-th em-th-num">#</th>
                <th class="em-th">Employee</th>
                <th class="em-th">Contact</th>
                <th class="em-th">Department</th>
                <th class="em-th">Role / Position</th>
                <th class="em-th">National ID</th>
                <th class="em-th">Gender</th>
                <th class="em-th em-th-right">Salary (TZS)</th>
                <th class="em-th">Hire Date</th>
                <th class="em-th">Status</th>
                <th class="em-th em-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="11" class="em-empty-row">
                  <i class="fas fa-users-slash"></i>
                  <span>No employees match your filters</span>
                </td>
              </tr>
              <tr
                v-for="(emp, idx) in filteredEmployees"
                :key="emp.id"
                class="em-tr"
                :style="{ animationDelay: `${idx * 0.03}s` }"
              >
                <!-- # -->
                <td class="em-td em-td-num">{{ idx + 1 }}</td>

                <!-- Employee -->
                <td class="em-td">
                  <div class="em-emp-cell">
                    <div class="em-avatar" :style="{ background: getAvatarColor(emp.first_name) }">
                      {{ getInitials(emp.first_name, emp.last_name) }}
                    </div>
                    <div>
                      <div class="em-emp-name">{{ emp.first_name }} {{ emp.last_name }}</div>
                      <div class="em-emp-email">{{ emp.email }}</div>
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="em-td">
                  <div class="em-contact-cell">
                    <span class="em-contact-phone">
                      <i class="fas fa-phone"></i>
                      {{ emp.phone || '—' }}
                    </span>
                  </div>
                </td>

                <!-- Department -->
                <td class="em-td">
                  <span class="em-dept-badge">{{ emp.department || '—' }}</span>
                </td>

                <!-- Role / Position -->
                <td class="em-td">
                  <div class="em-role-cell">
                    <span class="em-role-name">{{ emp.position || emp.role || '—' }}</span>
                  </div>
                </td>

                <!-- National ID -->
                <td class="em-td">
                  <span class="em-mono">{{ emp.national_id || '—' }}</span>
                </td>

                <!-- Gender -->
                <td class="em-td">
                  <span v-if="emp.gender" class="em-gender-badge" :class="emp.gender === 'male' ? 'em-gender-m' : 'em-gender-f'">
                    <i :class="emp.gender === 'male' ? 'fas fa-mars' : 'fas fa-venus'"></i>
                    {{ capitalize(emp.gender) }}
                  </span>
                  <span v-else class="em-muted">—</span>
                </td>

                <!-- Salary -->
                <td class="em-td em-td-right">
                  <span v-if="emp.salary" class="em-salary">{{ formatSalary(emp.salary) }}</span>
                  <span v-else class="em-muted">N/A</span>
                </td>

                <!-- Hire Date -->
                <td class="em-td">
                  <div class="em-date-cell">
                    <span class="em-date-main">{{ formatDate(emp.hire_date) }}</span>
                    <span class="em-date-tenure">{{ getTenure(emp.hire_date) }}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="em-td">
                  <span class="em-status-badge" :class="getStatusClass(emp.status)">
                    <span class="em-status-dot"></span>
                    {{ formatStatus(emp.status) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="em-td em-td-center">
                  <div class="em-actions">
                    <button @click="viewEmployee(emp)" class="em-action-btn em-action-view" title="View details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editEmployee(emp)" class="em-action-btn em-action-edit" title="Edit">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button @click="deleteEmployee(emp.id)" class="em-action-btn em-action-delete" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer summary -->
        <div class="em-table-footer" v-if="filteredEmployees.length">
          <span>Showing {{ filteredEmployees.length }} of {{ employees.length }} employees</span>
          <span v-if="totalSalary > 0" class="em-payroll-total">
            Total monthly payroll: <strong>{{ formatSalary(totalSalary) }} TZS</strong>
          </span>
        </div>
      </div>
    </div>


    <!-- ══ ADD MODAL ══ -->
    <teleport to="body">
      <transition name="em-modal">
        <div v-if="showAddModal" class="em-add-overlay" @click.self="showAddModal = false">
          <div class="em-add-modal">

            <!-- Modal header -->
            <div class="em-add-header">
              <div class="em-add-header-left">
                <div class="em-add-header-icon">
                  <i class="fas fa-user-plus"></i>
                </div>
                <div>
                  <div class="em-add-title">Add New Employee</div>
                  <div class="em-add-subtitle">Fill in the details below to register a new employee</div>
                </div>
              </div>
              <button @click="showAddModal = false" class="em-add-close">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form @submit.prevent="addEmployee">
              <div class="em-add-body">

                <!-- Section 1: Personal Info -->
                <div class="em-add-section">
                  <div class="em-add-section-label">
                    <span class="em-add-section-num">01</span>
                    Personal Information
                  </div>
                  <div class="em-add-grid">
                    <div class="em-add-field">
                      <label class="em-add-label">Full Name <span class="em-req">*</span></label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-user em-add-input-icon"></i>
                        <input v-model="newEmployee.name" placeholder="e.g. John Doe" required class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Email Address <span class="em-req">*</span></label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-envelope em-add-input-icon"></i>
                        <input v-model="newEmployee.email" type="email" placeholder="john@tera.co.tz" required class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Phone Number</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-phone em-add-input-icon"></i>
                        <input v-model="newEmployee.phone" placeholder="+255 7XX XXX XXX" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">National ID</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-id-card em-add-input-icon"></i>
                        <input v-model="newEmployee.national_id" placeholder="National ID number" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Gender</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-venus-mars em-add-input-icon"></i>
                        <select v-model="newEmployee.gender" class="em-add-input em-add-select">
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Date of Birth</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-calendar em-add-input-icon"></i>
                        <input v-model="newEmployee.birth_date" type="date" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field em-add-field-full">
                      <label class="em-add-label">Address</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-map-marker-alt em-add-input-icon"></i>
                        <input v-model="newEmployee.address" placeholder="Physical address" class="em-add-input" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section 2: Employment -->
                <div class="em-add-section">
                  <div class="em-add-section-label">
                    <span class="em-add-section-num">02</span>
                    Employment Details
                  </div>
                  <div class="em-add-grid">
                    <div class="em-add-field">
                      <label class="em-add-label">Department <span class="em-req">*</span></label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-building em-add-input-icon"></i>
                        <select v-model="newEmployee.department_id" required class="em-add-input em-add-select">
                          <option value="">Select department</option>
                          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Role <span class="em-req">*</span></label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-briefcase em-add-input-icon"></i>
                        <select v-model="newEmployee.role_id" required class="em-add-input em-add-select">
                          <option value="">Select role</option>
                          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Monthly Salary (TZS)</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-coins em-add-input-icon"></i>
                        <input v-model="newEmployee.salary" type="number" step="0.01" placeholder="0.00" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Hire Date</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-calendar-check em-add-input-icon"></i>
                        <input v-model="newEmployee.hire_date" type="date" class="em-add-input" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section 3: Banking -->
                <div class="em-add-section">
                  <div class="em-add-section-label">
                    <span class="em-add-section-num">03</span>
                    Banking Information
                  </div>
                  <div class="em-add-grid">
                    <div class="em-add-field">
                      <label class="em-add-label">Bank Name</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-university em-add-input-icon"></i>
                        <input v-model="newEmployee.bank_name" placeholder="e.g. CRDB Bank" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Account Number</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-hashtag em-add-input-icon"></i>
                        <input v-model="newEmployee.bank_account" placeholder="Account number" class="em-add-input" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section 4: Emergency + Password -->
                <div class="em-add-section">
                  <div class="em-add-section-label">
                    <span class="em-add-section-num">04</span>
                    Emergency Contact &amp; Access
                  </div>
                  <div class="em-add-grid">
                    <div class="em-add-field">
                      <label class="em-add-label">Contact Name</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-user-shield em-add-input-icon"></i>
                        <input v-model="newEmployee.emergency_contact" placeholder="Next of kin name" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field">
                      <label class="em-add-label">Contact Phone</label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-phone-alt em-add-input-icon"></i>
                        <input v-model="newEmployee.emergency_phone" placeholder="+255 7XX XXX XXX" class="em-add-input" />
                      </div>
                    </div>
                    <div class="em-add-field em-add-field-full">
                      <label class="em-add-label">System Password <span class="em-req">*</span></label>
                      <div class="em-add-input-wrap">
                        <i class="fas fa-lock em-add-input-icon"></i>
                        <input v-model="newEmployee.password" type="password" placeholder="Minimum 8 characters" required class="em-add-input" />
                      </div>
                      <span class="em-add-hint">This will be the employee's login password for the TERA BPM system.</span>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Footer -->
              <div class="em-add-footer">
                <button type="button" @click="showAddModal = false" class="em-btn em-btn-ghost">
                  <i class="fas fa-times"></i> Cancel
                </button>
                <button type="submit" class="em-btn em-btn-primary em-btn-submit">
                  <i class="fas fa-user-plus"></i>
                  Add Employee
                </button>
              </div>
            </form>

          </div>
        </div>
      </transition>
    </teleport>


    <!-- ══ VIEW MODAL ══ -->
    <teleport to="body">
      <transition name="em-modal">
        <div v-if="showViewModal" class="em-overlay" @click.self="showViewModal = false">
          <div class="em-modal em-modal-wide">
            <div class="em-modal-header">
              <div class="em-modal-title"><i class="fas fa-id-card"></i> Employee Profile</div>
              <button @click="showViewModal = false" class="em-modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="em-modal-body" v-if="selectedEmployee">

              <!-- Profile hero -->
              <div class="em-profile-hero">
                <div class="em-profile-avatar" :style="{ background: getAvatarColor(selectedEmployee.first_name) }">
                  {{ getInitials(selectedEmployee.first_name, selectedEmployee.last_name) }}
                </div>
                <div class="em-profile-meta">
                  <div class="em-profile-name">{{ selectedEmployee.first_name }} {{ selectedEmployee.last_name }}</div>
                  <div class="em-profile-role">{{ selectedEmployee.position || selectedEmployee.role }}</div>
                  <div class="em-profile-dept">{{ selectedEmployee.department }}</div>
                  <span class="em-status-badge" :class="getStatusClass(selectedEmployee.status)">
                    <span class="em-status-dot"></span>
                    {{ formatStatus(selectedEmployee.status) }}
                  </span>
                </div>
              </div>

              <!-- Detail sections -->
              <div class="em-detail-sections">

                <div class="em-detail-section">
                  <div class="em-detail-section-title"><i class="fas fa-user"></i> Personal Information</div>
                  <div class="em-detail-grid">
                    <div class="em-detail-row"><span class="em-detail-label">Full Name</span><span class="em-detail-value">{{ selectedEmployee.first_name }} {{ selectedEmployee.last_name }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Email</span><span class="em-detail-value">{{ selectedEmployee.email }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Phone</span><span class="em-detail-value">{{ selectedEmployee.phone || '—' }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Gender</span><span class="em-detail-value">{{ capitalize(selectedEmployee.gender) || '—' }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Date of Birth</span><span class="em-detail-value">{{ selectedEmployee.birth_date ? formatDate(selectedEmployee.birth_date) : '—' }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">National ID</span><span class="em-detail-value em-mono">{{ selectedEmployee.national_id || '—' }}</span></div>
                    <div class="em-detail-row em-detail-row-full"><span class="em-detail-label">Address</span><span class="em-detail-value">{{ selectedEmployee.address || '—' }}</span></div>
                  </div>
                </div>

                <div class="em-detail-section">
                  <div class="em-detail-section-title"><i class="fas fa-briefcase"></i> Employment Details</div>
                  <div class="em-detail-grid">
                    <div class="em-detail-row"><span class="em-detail-label">Department</span><span class="em-detail-value">{{ selectedEmployee.department }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Position / Role</span><span class="em-detail-value">{{ selectedEmployee.position || selectedEmployee.role }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Hire Date</span><span class="em-detail-value">{{ formatDate(selectedEmployee.hire_date) }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Tenure</span><span class="em-detail-value">{{ getTenure(selectedEmployee.hire_date) }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Monthly Salary</span><span class="em-detail-value em-salary">{{ selectedEmployee.salary ? formatSalary(selectedEmployee.salary) + ' TZS' : '—' }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Status</span>
                      <span class="em-status-badge" :class="getStatusClass(selectedEmployee.status)">
                        <span class="em-status-dot"></span>{{ formatStatus(selectedEmployee.status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="em-detail-section">
                  <div class="em-detail-section-title"><i class="fas fa-university"></i> Banking Information</div>
                  <div class="em-detail-grid">
                    <div class="em-detail-row"><span class="em-detail-label">Bank Name</span><span class="em-detail-value">{{ selectedEmployee.bank_name || '—' }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Account Number</span><span class="em-detail-value em-mono">{{ selectedEmployee.bank_account || '—' }}</span></div>
                  </div>
                </div>

                <div class="em-detail-section">
                  <div class="em-detail-section-title"><i class="fas fa-phone-alt"></i> Emergency Contact</div>
                  <div class="em-detail-grid">
                    <div class="em-detail-row"><span class="em-detail-label">Contact Name</span><span class="em-detail-value">{{ selectedEmployee.emergency_contact || '—' }}</span></div>
                    <div class="em-detail-row"><span class="em-detail-label">Contact Phone</span><span class="em-detail-value">{{ selectedEmployee.emergency_phone || '—' }}</span></div>
                  </div>
                </div>

                <div class="em-detail-section" v-if="selectedEmployee.notes">
                  <div class="em-detail-section-title"><i class="fas fa-sticky-note"></i> Notes</div>
                  <p class="em-notes-text">{{ selectedEmployee.notes }}</p>
                </div>

              </div>
            </div>
            <div class="em-modal-footer">
              <button @click="showViewModal = false" class="em-btn em-btn-ghost">Close</button>
              <button @click="editFromView" class="em-btn em-btn-primary"><i class="fas fa-pen"></i> Edit Employee</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>


    <!-- ══ EDIT MODAL ══ -->
    <teleport to="body">
      <transition name="em-modal">
        <div v-if="showEditModal" class="em-overlay" @click.self="showEditModal = false">
          <div class="em-modal">
            <div class="em-modal-header">
              <div class="em-modal-title"><i class="fas fa-user-edit"></i> Edit Employee</div>
              <button @click="showEditModal = false" class="em-modal-close"><i class="fas fa-times"></i></button>
            </div>
            <form @submit.prevent="updateEmployee" class="em-modal-body" v-if="editingEmployee">
              <div class="em-form-grid">
                <div class="em-field">
                  <label>Full Name <span class="em-req">*</span></label>
                  <input v-model="editingEmployee.name" required class="em-input" />
                </div>
                <div class="em-field">
                  <label>Email <span class="em-req">*</span></label>
                  <input v-model="editingEmployee.email" type="email" required class="em-input" />
                </div>
                <div class="em-field">
                  <label>Phone</label>
                  <input v-model="editingEmployee.phone" class="em-input" />
                </div>
                <div class="em-field">
                  <label>National ID</label>
                  <input v-model="editingEmployee.national_id" class="em-input" />
                </div>
                <div class="em-field">
                  <label>Department <span class="em-req">*</span></label>
                  <select v-model="editingEmployee.department_id" required class="em-input em-select-input">
                    <option value="">Select department</option>
                    <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                  </select>
                </div>
                <div class="em-field">
                  <label>Role <span class="em-req">*</span></label>
                  <select v-model="editingEmployee.role_id" required class="em-input em-select-input">
                    <option value="">Select role</option>
                    <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                  </select>
                </div>
                <div class="em-field">
                  <label>Gender</label>
                  <select v-model="editingEmployee.gender" class="em-input em-select-input">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div class="em-field">
                  <label>Status</label>
                  <select v-model="editingEmployee.status" class="em-input em-select-input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
                <div class="em-field">
                  <label>Salary (TZS)</label>
                  <input v-model="editingEmployee.salary" type="number" step="0.01" class="em-input" />
                </div>
                <div class="em-field">
                  <label>Hire Date</label>
                  <input v-model="editingEmployee.hire_date" type="date" class="em-input" />
                </div>
                <div class="em-field">
                  <label>Bank Name</label>
                  <input v-model="editingEmployee.bank_name" class="em-input" />
                </div>
                <div class="em-field">
                  <label>Bank Account</label>
                  <input v-model="editingEmployee.bank_account" class="em-input" />
                </div>
                <div class="em-field em-field-full">
                  <label>Address</label>
                  <input v-model="editingEmployee.address" class="em-input" />
                </div>
              </div>
              <div class="em-modal-footer">
                <button type="button" @click="showEditModal = false" class="em-btn em-btn-ghost">Cancel</button>
                <button type="submit" class="em-btn em-btn-primary"><i class="fas fa-save"></i> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'

const toast = useToast()

/* ─── State ─────────────────────────────── */
const employees        = ref([])
const search           = ref('')
const statusFilter     = ref('')
const departmentFilter = ref('')
const genderFilter     = ref('')
const showAddModal     = ref(false)
const showViewModal    = ref(false)
const showEditModal    = ref(false)
const isExporting      = ref(false)
const selectedEmployee = ref(null)
const editingEmployee  = ref(null)

const departments = [
  { id: 1, name: 'Procurement' },
  { id: 2, name: 'Engineering' },
  { id: 3, name: 'Finance & Accounts' },
  { id: 4, name: 'Human Resources' },
  { id: 5, name: 'ICT' },
  { id: 6, name: 'Operations' },
  { id: 7, name: 'Logistics' },
]
const roles = [
  { id: 2, name: 'HOD' },
  { id: 3, name: 'Engineer' },
  { id: 4, name: 'Tender Officer' },
  { id: 5, name: 'Accountant' },
  { id: 6, name: 'HR Officer' },
  { id: 8, name: 'Staff' },
  { id: 9, name: 'User' },
]

const newEmployee = ref({
  name: '', email: '', phone: '', national_id: '',
  department_id: '', role_id: '', gender: '', birth_date: '',
  salary: '', hire_date: '', address: '',
  bank_name: '', bank_account: '',
  emergency_contact: '', emergency_phone: '',
  password: '', status: 'active',
})

/* ─── Fetch ──────────────────────────────── */
onMounted(() => fetchEmployees())

async function fetchEmployees() {
  try {
    const res = await axios.get('/api/employees')
    employees.value = res.data.data || []
  } catch {
    toast.error('Failed to load employees')
  }
}

/* ─── Computed ───────────────────────────── */
const filteredEmployees = computed(() =>
  employees.value.filter(emp => {
    const q = search.value.toLowerCase()
    const matchSearch = !q ||
      (emp.first_name + ' ' + emp.last_name).toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.phone?.includes(q) ||
      emp.national_id?.toLowerCase().includes(q)
    return (
      matchSearch &&
      (!statusFilter.value || emp.status === statusFilter.value) &&
      (!departmentFilter.value || String(emp.department_id) === String(departmentFilter.value)) &&
      (!genderFilter.value || emp.gender === genderFilter.value)
    )
  })
)

const activeEmployees   = computed(() => employees.value.filter(e => e.status === 'active').length)
const onLeaveEmployees  = computed(() => employees.value.filter(e => e.status === 'on_leave').length)
const inactiveEmployees = computed(() => employees.value.filter(e => e.status === 'inactive').length)
const totalSalary       = computed(() => filteredEmployees.value.reduce((s, e) => s + (Number(e.salary) || 0), 0))

const statCards = computed(() => [
  { label: 'Total Employees', value: employees.value.length, icon: 'fas fa-users',      color: '#1a56db', pct: 100 },
  { label: 'Active',          value: activeEmployees.value,  icon: 'fas fa-user-check', color: '#0e9f6e', pct: employees.value.length ? Math.round(activeEmployees.value / employees.value.length * 100) : 0 },
  { label: 'On Leave',        value: onLeaveEmployees.value, icon: 'fas fa-umbrella-beach', color: '#d97706', pct: employees.value.length ? Math.round(onLeaveEmployees.value / employees.value.length * 100) : 0 },
  { label: 'Inactive',        value: inactiveEmployees.value,icon: 'fas fa-user-slash', color: '#e02424', pct: employees.value.length ? Math.round(inactiveEmployees.value / employees.value.length * 100) : 0 },
])

/* ─── Helpers ────────────────────────────── */
const AVATAR_COLORS = ['#1a56db','#0e9f6e','#7e3af2','#d97706','#e02424','#0891b2','#4338ca','#059669']
function getAvatarColor(name = '') { return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length] }
function getInitials(f = '', l = '') { return (f[0] || '') + (l[0] || '') }
function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : '' }

function getStatusClass(status) {
  return { active: 'em-status-active', inactive: 'em-status-inactive', on_leave: 'em-status-leave' }[status] || 'em-status-inactive'
}
function formatStatus(status) {
  return { active: 'Active', inactive: 'Inactive', on_leave: 'On Leave' }[status] || status
}
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatSalary(n) {
  return new Intl.NumberFormat('en-TZ').format(Number(n))
}
function getTenure(hireDate) {
  if (!hireDate) return ''
  const months = Math.floor((Date.now() - new Date(hireDate)) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 1) return '< 1 mo'
  if (months < 12) return `${months} mo`
  const yrs = Math.floor(months / 12), mo = months % 12
  return mo ? `${yrs}y ${mo}m` : `${yrs} yr${yrs > 1 ? 's' : ''}`
}

/* ─── CRUD ───────────────────────────────── */
async function addEmployee() {
  try {
    await axios.post('/api/employees', newEmployee.value)
    toast.success('Employee added successfully')
    showAddModal.value = false
    fetchEmployees()
    Object.keys(newEmployee.value).forEach(k => { if (k !== 'status') newEmployee.value[k] = '' })
  } catch { toast.error('Failed to add employee') }
}

async function viewEmployee(emp) {
  try {
    const res = await axios.get(`/api/employees/${emp.id}`)
    selectedEmployee.value = res.data.data
    showViewModal.value = true
  } catch { toast.error('Failed to load employee') }
}

function editFromView() {
  editingEmployee.value = { ...selectedEmployee.value }
  showViewModal.value = false
  showEditModal.value = true
}

async function editEmployee(emp) {
  try {
    const res = await axios.get(`/api/employees/${emp.id}`)
    editingEmployee.value = { ...res.data.data }
    showEditModal.value = true
  } catch { toast.error('Failed to load employee') }
}

async function updateEmployee() {
  try {
    await axios.put(`/api/employees/${editingEmployee.value.id}`, editingEmployee.value)
    toast.success('Employee updated')
    showEditModal.value = false
    fetchEmployees()
  } catch { toast.error('Failed to update employee') }
}

async function deleteEmployee(id) {
  if (!confirm('Delete this employee? This cannot be undone.')) return
  try {
    await axios.delete(`/api/employees/${id}`)
    toast.success('Employee removed')
    fetchEmployees()
  } catch { toast.error('Failed to delete employee') }
}

async function exportToExcel() {
  isExporting.value = true
  try {
    const rows = filteredEmployees.value.map((e, i) => ({
      '#': i + 1,
      'Full Name': `${e.first_name} ${e.last_name}`,
      'Email': e.email,
      'Phone': e.phone || '',
      'National ID': e.national_id || '',
      'Gender': capitalize(e.gender) || '',
      'Department': e.department || '',
      'Role / Position': e.position || e.role || '',
      'Salary (TZS)': e.salary ? formatSalary(e.salary) : '',
      'Hire Date': formatDate(e.hire_date),
      'Tenure': getTenure(e.hire_date),
      'Status': formatStatus(e.status),
      'Bank': e.bank_name || '',
      'Bank Account': e.bank_account || '',
      'Emergency Contact': e.emergency_contact || '',
      'Emergency Phone': e.emergency_phone || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Employees')
    XLSX.writeFile(wb, `TERA_Employees_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported successfully')
  } catch { toast.error('Export failed') } finally { isExporting.value = false }
}
</script>


<style scoped>
/* ════════════════════════════════════════
   FONTS + ROOT
════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

.em-root {
  --navy:      #0d2b5e;
  --navy-2:    #153470;
  --blue:      #1a56db;
  --blue-lt:   #3b72f0;
  --blue-pale: #eff6ff;
  --blue-soft: #dbeafe;
  --white:     #ffffff;
  --off:       #f8faff;
  --gray-100:  #f1f5f9;
  --gray-200:  #e2e8f0;
  --gray-400:  #94a3b8;
  --gray-600:  #475569;
  --gray-800:  #1e293b;
  --ink:       #0f172a;
  --green:     #059669;
  --green-lt:  #d1fae5;
  --amber:     #d97706;
  --amber-lt:  #fef3c7;
  --red:       #dc2626;
  --red-lt:    #fee2e2;
  --radius:    10px;
  --shadow:    0 1px 4px rgba(13,43,94,.08), 0 2px 12px rgba(13,43,94,.06);
  --shadow-md: 0 4px 20px rgba(13,43,94,.12), 0 2px 8px rgba(13,43,94,.06);
  --shadow-lg: 0 12px 48px rgba(13,43,94,.16);

  font-family: 'Nunito Sans', sans-serif;
  background: var(--off);
  color: var(--ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* ════════════════════════════════════════
   HEADER
════════════════════════════════════════ */
.em-header {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
  padding: 28px 0 36px; position: relative; overflow: hidden;
}
.em-header::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: rgba(255,255,255,.1);
}
.em-header-inner {
  max-width: 1440px; margin: 0 auto; padding: 0 32px;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;
  flex-wrap: wrap;
}
.em-header-breadcrumb {
  font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: rgba(255,255,255,.5); margin-bottom: 8px;
}
.em-page-title {
  font-family: 'DM Serif Display', serif; font-size: 2rem; font-weight: 400;
  color: #fff; margin: 0; line-height: 1.2;
}
.em-page-sub { font-size: 13px; color: rgba(255,255,255,.55); margin-top: 5px; }
.em-header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* ════════════════════════════════════════
   BUTTONS
════════════════════════════════════════ */
.em-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 8px; border: none;
  font-family: 'Nunito Sans', sans-serif; font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: all .18s; letter-spacing: .01em;
  white-space: nowrap;
}
.em-btn:disabled { opacity: .6; cursor: not-allowed; }
.em-btn-primary { background: red; color: #fff; box-shadow: 0 3px 12px rgba(26,86,219,.35); }
.em-btn-primary:hover:not(:disabled) { background: blue; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,86,219,.4); }
.em-btn-green   { background: var(--green); color: #fff; box-shadow: 0 3px 12px rgba(5,150,105,.3); }
.em-btn-green:hover:not(:disabled)   { filter: brightness(1.1); transform: translateY(-1px); }
.em-btn-ghost   { background: var(--gray-100); color: var(--gray-600); border: 1px solid var(--gray-200); }
.em-btn-ghost:hover { background: var(--gray-200); }

/* ════════════════════════════════════════
   BODY
════════════════════════════════════════ */
.em-body {
  max-width: 1440px; margin: -16px auto 0; padding: 0 32px 48px;
  position: relative; z-index: 1;
}

/* ════════════════════════════════════════
   STAT CARDS
════════════════════════════════════════ */
.em-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.em-stat-card {
  background: var(--white); border-radius: var(--radius); padding: 18px 20px;
  border: 1px solid var(--gray-200); box-shadow: var(--shadow);
  display: flex; align-items: center; gap: 14px; position: relative; overflow: hidden;
  transition: box-shadow .2s, transform .2s;
}
.em-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.em-stat-card::after {
  content: ''; position: absolute; bottom: 0; left: 0; height: 3px;
  width: var(--pct, 0%); background: var(--accent, var(--blue));
  border-radius: 0 999px 999px 0; transition: width .6s ease .1s;
}
.em-stat-icon-wrap {
  width: 46px; height: 46px; border-radius: 11px; flex-shrink: 0;
  background: color-mix(in srgb, var(--accent, var(--blue)) 12%, white);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: var(--accent, var(--blue));
}
.em-stat-content { display: flex; flex-direction: column; gap: 2px; }
.em-stat-value { font-family: 'DM Serif Display', serif; font-size: 1.7rem; line-height: 1; color: var(--navy); }
.em-stat-label { font-size: 11.5px; color: var(--gray-600); font-weight: 600; letter-spacing: .02em; }

/* ════════════════════════════════════════
   FILTERS
════════════════════════════════════════ */
.em-filters {
  background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius);
  padding: 14px 18px; margin-bottom: 18px; box-shadow: var(--shadow);
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
.em-search-wrap { position: relative; flex: 1; min-width: 220px; }
.em-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-400); font-size: 13px; }
.em-search-input {
  width: 100%; padding: 9px 36px 9px 36px; border-radius: 8px;
  border: 1px solid var(--gray-200); font-family: 'Nunito Sans', sans-serif;
  font-size: 13.5px; color: var(--ink); outline: none; background: var(--off);
  transition: border-color .18s;
}
.em-search-input:focus { border-color: var(--blue); background: #fff; }
.em-search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 4px; font-size: 12px; }
.em-select {
  padding: 9px 14px; border-radius: 8px; border: 1px solid var(--gray-200);
  font-family: 'Nunito Sans', sans-serif; font-size: 13.5px; color: var(--gray-800);
  outline: none; background: var(--off); cursor: pointer; transition: border-color .18s;
  min-width: 140px;
}
.em-select:focus { border-color: var(--blue); background: #fff; }
.em-filter-info { font-size: 12px; color: var(--blue); font-weight: 600; white-space: nowrap; background: var(--blue-pale); padding: 6px 12px; border-radius: 999px; border: 1px solid var(--blue-soft); }

/* ════════════════════════════════════════
   TABLE CARD
════════════════════════════════════════ */
.em-table-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;
}
.em-table-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; border-bottom: 1px solid var(--gray-100);
}
.em-table-title { font-size: 14px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 8px; }
.em-table-title i { color: var(--blue); }
.em-table-meta { font-size: 12px; color: var(--gray-400); font-weight: 600; }
.em-table-scroll { overflow-x: auto; }

/* ── Table ── */
.em-table { width: 100%; border-collapse: collapse; }
.em-th {
  padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase; color: var(--gray-600);
  background: var(--gray-100); border-bottom: 1px solid var(--gray-200);
  white-space: nowrap;
}
.em-th-num    { width: 48px; text-align: center; }
.em-th-right  { text-align: right; }
.em-th-center { text-align: center; }

.em-tr {
  transition: background .15s; animation: rowIn .35s ease both;
  border-bottom: 1px solid var(--gray-100);
}
.em-tr:last-child { border-bottom: none; }
.em-tr:hover { background: var(--off); }

.em-td { padding: 13px 16px; vertical-align: middle; font-size: 13.5px; }
.em-td-num    { text-align: center; font-size: 12px; color: var(--gray-400); font-weight: 600; }
.em-td-right  { text-align: right; }
.em-td-center { text-align: center; }

/* Employee cell */
.em-emp-cell { display: flex; align-items: center; gap: 11px; }
.em-avatar {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; letter-spacing: .03em;
}
.em-emp-name  { font-weight: 700; font-size: 13.5px; color: var(--navy); white-space: nowrap; }
.em-emp-email { font-size: 11.5px; color: var(--gray-400); margin-top: 1px; }

/* Contact */
.em-contact-phone { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--gray-600); white-space: nowrap; }
.em-contact-phone i { color: var(--gray-400); font-size: 11px; }

/* Department badge */
.em-dept-badge {
  display: inline-block; padding: 3px 9px; border-radius: 6px;
  background: var(--blue-pale); color: var(--blue); border: 1px solid var(--blue-soft);
  font-size: 11.5px; font-weight: 700; white-space: nowrap; letter-spacing: .02em;
}

/* Role */
.em-role-name { font-size: 13px; font-weight: 600; color: var(--gray-800); white-space: nowrap; }

/* Mono (IDs) */
.em-mono { font-family: 'Courier New', monospace; font-size: 12px; color: var(--gray-600); letter-spacing: .04em; }

/* Gender */
.em-gender-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.em-gender-m { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.em-gender-f { background: #fdf2f8; color: #9d174d; border: 1px solid #fbcfe8; }
.em-muted { color: var(--gray-400); font-size: 13px; }

/* Salary */
.em-salary { font-weight: 700; color: var(--navy); font-size: 13px; font-variant-numeric: tabular-nums; }

/* Date */
.em-date-cell { display: flex; flex-direction: column; gap: 2px; }
.em-date-main  { font-size: 13px; color: var(--gray-800); white-space: nowrap; font-weight: 500; }
.em-date-tenure { font-size: 10.5px; color: var(--gray-400); font-weight: 600; letter-spacing: .02em; }

/* Status */
.em-status-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700;
  white-space: nowrap;
}
.em-status-dot { width: 6px; height: 6px; border-radius: 50%; }
.em-status-active   { background: var(--green-lt); color: #065f46; }
.em-status-active   .em-status-dot { background: var(--green); box-shadow: 0 0 0 2px #a7f3d0; animation: pulse-dot 2s ease-in-out infinite; }
.em-status-inactive { background: var(--red-lt); color: #991b1b; }
.em-status-inactive .em-status-dot { background: var(--red); }
.em-status-leave    { background: var(--amber-lt); color: #92400e; }
.em-status-leave    .em-status-dot { background: var(--amber); }

/* Actions */
.em-actions { display: flex; align-items: center; gap: 4px; justify-content: center; }
.em-action-btn {
  width: 30px; height: 30px; border-radius: 7px; border: 1px solid transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px; transition: all .15s;
}
.em-action-view   { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-soft); }
.em-action-view:hover   { background: var(--blue); color: #fff; }
.em-action-edit   { background: #f0fdf4; color: var(--green); border-color: #bbf7d0; }
.em-action-edit:hover   { background: var(--green); color: #fff; }
.em-action-delete { background: var(--red-lt); color: var(--red); border-color: #fecaca; }
.em-action-delete:hover { background: var(--red); color: #fff; }

/* Empty state */
.em-empty-row { padding: 60px 20px; text-align: center; color: var(--gray-400); }
.em-empty-row i { display: block; font-size: 32px; margin-bottom: 12px; opacity: .4; }
.em-empty-row span { font-size: 13.5px; }

/* Footer */
.em-table-footer {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  padding: 12px 22px; border-top: 1px solid var(--gray-100);
  font-size: 12.5px; color: var(--gray-400); font-weight: 500;
}
.em-payroll-total { color: var(--navy); }
.em-payroll-total strong { color: var(--blue); }

/* ════════════════════════════════════════
   MODALS
════════════════════════════════════════ */
.em-overlay {
  position: fixed; inset: 0;
  background: rgba(8,18,40,.75);       /* solid dark, no blur bleed */
  display: flex; align-items: flex-start; justify-content: center;
  padding: 12px 16px 40px; z-index: 1000; overflow-y: auto;
}
.em-modal {
  background: #ffffff;                 /* solid white, no transparency */
  border-radius: 16px; width: 100%; max-width: 560px;
  box-shadow: 0 24px 80px rgba(8,18,40,.35), 0 4px 20px rgba(8,18,40,.15);
  isolation: isolate;
  margin: 16px auto;
  animation: modalIn .25s cubic-bezier(.16,1,.3,1) both;
  /* No max-height — overlay scrolls, all fields always visible */
}
.em-modal-wide { max-width: 720px; }

.em-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; position: sticky; top: 0;
  background: linear-gradient(135deg, #0d2b5e 0%, #153470 100%);
  z-index: 10; border-radius: 16px 16px 0 0;
}
.em-modal-title {
  font-family: 'DM Serif Display', serif; font-size: 1.1rem;
  color: #ffffff; display: flex; align-items: center; gap: 9px;
}
.em-modal-title i { color: #a0c4f1; font-size: .9em; }
.em-modal-close {
  width: 32px; height: 32px; border-radius: 7px;
  border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.12);
  color: rgba(255,255,255,.8); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; transition: all .15s;
}
.em-modal-close:hover { background: rgba(239,68,68,.8); border-color: #ef4444; color: #fff; }

.em-modal-body { padding: 22px 24px; background: #ffffff; }
.em-modal-footer { padding: 16px 24px; border-top: 2px solid #dce8f5; display: flex; gap: 10px; justify-content: flex-end; background: #eef4ff; border-radius: 0 0 16px 16px; }

/* Form grid */
.em-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.em-field { display: flex; flex-direction: column; gap: 7px; }
.em-field-full { grid-column: 1 / -1; }
.em-field label { font-size: 12px; font-weight: 800; color: #1e3a5f; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 2px; display: block; }
.em-req { color: var(--red); }
.em-input {
  padding: 10px 12px; border-radius: 8px;
  border: 2px solid #b0c4de;           /* strong visible border */
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px; font-weight: 500;
  color: #0d2b5e;                       /* dark navy text */
  outline: none;
  background: #ffffff;                  /* solid white */
  transition: border-color .18s, box-shadow .18s;
  width: 100%;
  -webkit-text-fill-color: #0d2b5e;
}
.em-input::placeholder { color: #9badc4; -webkit-text-fill-color: #9badc4; }
.em-input:focus {
  border-color: var(--blue);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(26,86,219,.14);
  -webkit-text-fill-color: #0d2b5e;
}
.em-input:hover:not(:focus) { border-color: #7a9cbf; }
.em-input[type="date"] { color-scheme: light; -webkit-text-fill-color: #0d2b5e; }
.em-select-input { cursor: pointer; }

/* Profile hero */
.em-profile-hero {
  display: flex; align-items: center; gap: 20px; padding: 20px;
  background: var(--off); border-radius: 12px; margin-bottom: 22px;
  border: 1px solid var(--gray-200);
}
.em-profile-avatar {
  width: 72px; height: 72px; border-radius: 16px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,.15);
}
.em-profile-name { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--navy); }
.em-profile-role { font-size: 13.5px; font-weight: 600; color: var(--blue); margin: 2px 0; }
.em-profile-dept { font-size: 12px; color: var(--gray-600); margin-bottom: 8px; }

/* Detail sections */
.em-detail-sections { display: flex; flex-direction: column; gap: 18px; }
.em-detail-section { border: 1px solid var(--gray-200); border-radius: 10px; overflow: hidden; }
.em-detail-section-title {
  padding: 10px 16px; background: var(--gray-100); font-size: 11px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase; color: var(--gray-600);
  display: flex; align-items: center; gap: 7px; border-bottom: 1px solid var(--gray-200);
}
.em-detail-section-title i { color: var(--blue); }
.em-detail-grid { display: grid; grid-template-columns: 1fr 1fr; }
.em-detail-row {
  display: flex; flex-direction: column; gap: 3px; padding: 12px 16px;
  border-bottom: 1px solid var(--gray-100); border-right: 1px solid var(--gray-100);
}
.em-detail-row:nth-child(even) { border-right: none; }
.em-detail-row-full { grid-column: 1 / -1; border-right: none; }
.em-detail-row:last-child, .em-detail-row:nth-last-child(2):nth-child(odd) { border-bottom: none; }
.em-detail-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--gray-400); }
.em-detail-value { font-size: 13.5px; color: var(--ink); font-weight: 500; }
.em-notes-text { padding: 12px 16px; font-size: 13.5px; color: var(--gray-600); line-height: 1.7; margin: 0; white-space: pre-wrap; }

/* ════════════════════════════════════════
   ADD EMPLOYEE MODAL  (fully opaque, sectioned)
════════════════════════════════════════ */
.em-add-overlay {
  position: fixed; inset: 0;
  background: rgba(8,18,40,.72);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 12px 16px 40px; z-index: 1000; overflow-y: auto;
}
.em-add-modal {
  background: #ffffff;
  border-radius: 16px; width: 100%; max-width: 720px;
  box-shadow: 0 24px 80px rgba(8,18,40,.35), 0 4px 20px rgba(8,18,40,.15);
  animation: modalIn .28s cubic-bezier(.16,1,.3,1) both;
  isolation: isolate; position: relative;
  margin: 16px auto;   /* breathing room from viewport edges */
}
.em-add-header {
  background: linear-gradient(135deg, #0d2b5e 0%, #153470 100%);
  border-radius: 16px 16px 0 0; padding: 22px 26px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.em-add-header-left { display: flex; align-items: center; gap: 14px; }
.em-add-header-icon {
  width: 46px; height: 46px; border-radius: 12px;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #fff; flex-shrink: 0;
}
.em-add-title { font-family: 'DM Serif Display', serif; font-size: 1.15rem; color: #fff; }
.em-add-subtitle { font-size: 12px; color: rgba(255,255,255,.6); margin-top: 3px; }
.em-add-close {
  width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.1);
  color: rgba(255,255,255,.8); cursor: pointer; font-size: 13px;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.em-add-close:hover { background: rgba(239,68,68,.8); border-color: #ef4444; color: #fff; }

.em-add-body {
  padding: 24px 26px; display: flex; flex-direction: column; gap: 20px;
  background: #ffffff;
  /* No max-height restriction — the overlay itself scrolls.
     All 4 sections are fully visible without clipping. */
}

.em-add-section { background: #fff; border: 2px solid #dce8f5; border-radius: 12px; overflow: hidden; }
.em-add-section-label {
  display: flex; align-items: center; gap: 10px; padding: 12px 18px;
  background: #eef4ff; border-bottom: 2px solid #dce8f5;
  font-size: 11px; font-weight: 800; letter-spacing: .16em;
  text-transform: uppercase; color: #0d2b5e;
}
.em-add-section-num {
  font-family: 'DM Serif Display', serif; font-size: 15px; font-weight: 700;
  color: #ffffff; background: #1a56db; border-radius: 6px;
  padding: 2px 8px; line-height: 1.4; letter-spacing: .02em;
}
.em-add-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 20px 18px; background: #fff; }
.em-add-field { display: flex; flex-direction: column; gap: 7px; }
.em-add-field-full { grid-column: 1 / -1; }

.em-add-label { font-size: 12px; font-weight: 800; color: #1e3a5f; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 2px; }
.em-req { color: #dc2626; margin-left: 2px; }

.em-add-input-wrap { position: relative; display: flex; align-items: center; }
.em-add-input-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  font-size: 14px; color: #4a7ab5; pointer-events: none; z-index: 1;
}
.em-add-input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border-radius: 8px;
  border: 2px solid #b0c4de;          /* strong visible slate-blue border */
  background: #ffffff;                 /* pure white */
  color: #0d2b5e;                      /* dark navy text */
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px; font-weight: 600;
  outline: none; line-height: 1.4;
  transition: border-color .18s, box-shadow .18s;
  -webkit-text-fill-color: #0d2b5e;
}
.em-add-input::placeholder {
  color: #9badc4; font-weight: 400;
  -webkit-text-fill-color: #9badc4;
}
.em-add-input:focus {
  border-color: #1a56db;
  box-shadow: 0 0 0 4px rgba(26,86,219,.15);
  background: #ffffff;
  -webkit-text-fill-color: #0d2b5e;
}
.em-add-input:hover:not(:focus) { border-color: #7a9cbf; }
.em-add-input[type="date"] { color-scheme: light; -webkit-text-fill-color: #0d2b5e; }
.em-add-select { cursor: pointer; }
.em-add-hint { font-size: 11.5px; color: #64748b; margin-top: 4px; line-height: 1.5; }

.em-add-footer {
  padding: 18px 26px; border-top: 2px solid #dce8f5; background: #eef4ff;
  border-radius: 0 0 16px 16px;
  display: flex; justify-content: flex-end; gap: 10px;
}
.em-btn-submit { padding: 11px 28px; font-size: 14px; box-shadow: 0 4px 16px rgba(26,86,219,.35); }
.em-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(26,86,219,.45); }

/* ════════════════════════════════════════
   TRANSITIONS & KEYFRAMES
════════════════════════════════════════ */
.em-modal-enter-active { transition: opacity .25s, transform .25s; }
.em-modal-leave-active { transition: opacity .2s; }
.em-modal-enter-from  { opacity: 0; }
.em-modal-leave-to    { opacity: 0; }

@keyframes rowIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 2px #a7f3d0; }
  50%       { box-shadow: 0 0 0 4px #d1fae5; }
}

/* ════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════ */
@media (max-width: 1100px) { .em-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  {
  .em-body { padding: 0 16px 40px; }
  .em-header-inner { padding: 0 16px; }
  .em-stats { grid-template-columns: repeat(2, 1fr); }
  .em-form-grid { grid-template-columns: 1fr; }
  .em-detail-grid { grid-template-columns: 1fr; }
  .em-detail-row { border-right: none; }
}
@media (max-width: 480px) {
  .em-stats { grid-template-columns: 1fr; }
  .em-filters { flex-direction: column; }
  .em-select, .em-search-input { width: 100%; }
  .em-add-grid { grid-template-columns: 1fr; }
  .em-add-field-full { grid-column: 1; }
}
</style>