<template>
  <div class="dashboard-container" :class="{ 'light-mode': isLightMode }">
    <!-- Premium Navigation Bar -->
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="brand">
          <div class="brand-mark">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M8 12L20 4L32 12V28L20 36L8 28V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="brand-identity">
            <h1>Admin Control</h1>
            <span>Analytics Dashboard</span>
          </div>
        </div>
        
        <div class="nav-tools">
          <div class="search-input">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input type="text" placeholder="Search..." />
          </div>
          
          <button class="nav-icon-btn" title="Notifications">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span class="pulse-dot"></span>
          </button>

          <button class="nav-icon-btn theme-toggle" @click="toggleTheme" title="Toggle Theme">
            <svg v-if="isLightMode" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
          </button>
          
          <button class="refresh-btn" @click="refreshAllData" :disabled="isRefreshing">
            <svg :class="{ 'spinning': isRefreshing }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
            </svg>
          </button>
          
          <div class="date-display">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            <span>{{ currentDate }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Dashboard -->
    <main class="dashboard-main">
      <!-- Key Metrics -->
      <section class="metrics-section">
        <div class="metric-card primary">
          <div class="metric-header">
            <div class="metric-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="trend-indicator up">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 2L10 6H7V10H5V6H2L6 2Z"/>
              </svg>
              <span>12%</span>
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ totalTenders }}</div>
            <div class="metric-label">Total Tenders</div>
          </div>
          <div class="metric-footer">
            <span>{{ totalAssignedTenders }} assigned</span>
            <span class="divider">•</span>
            <span>{{ totalTenderSubmissions }} submitted</span>
          </div>
        </div>

        <div class="metric-card success">
          <div class="metric-header">
            <div class="metric-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="trend-indicator up">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 2L10 6H7V10H5V6H2L6 2Z"/>
              </svg>
              <span>8%</span>
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ totalCompletedProjects }}</div>
            <div class="metric-label">Completed</div>
          </div>
          <div class="metric-footer">
            <span>{{ projectCompletionRate }}% completion</span>
          </div>
        </div>

        <div class="metric-card warning">
          <div class="metric-header">
            <div class="metric-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="trend-indicator neutral">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <rect x="2" y="5" width="8" height="2" rx="1"/>
              </svg>
              <span>0%</span>
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ totalOnProgressTenders }}</div>
            <div class="metric-label">In Progress</div>
          </div>
          <div class="metric-footer">
            <span>{{ totalOnProgressProjects }} active</span>
          </div>
        </div>

        <div class="metric-card danger">
          <div class="metric-header">
            <div class="metric-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="trend-indicator down">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 10L2 6H5V2H7V6H10L6 10Z"/>
              </svg>
              <span>5%</span>
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ totalExpiredTenders }}</div>
            <div class="metric-label">Expired</div>
          </div>
          <div class="metric-footer">
            <span>{{ totalDeadlineReachedTenders }} near deadline</span>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="left-col">
          <!-- Tenders Pipeline -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Tenders Pipeline</h3>
                <p>Complete lifecycle tracking</p>
              </div>
              <button class="icon-btn">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>
            </div>
            <div class="card-body">
              <div class="pipeline-items">
                <div class="pipeline-row">
                  <div class="pipeline-label">
                    <span class="status-dot primary"></span>
                    <span>Registered</span>
                  </div>
                  <div class="pipeline-data">
                    <span class="count">{{ totalTenders }}</span>
                    <div class="mini-bar">
                      <div class="fill primary" style="width: 100%"></div>
                    </div>
                  </div>
                </div>

                <div class="pipeline-row">
                  <div class="pipeline-label">
                    <span class="status-dot info"></span>
                    <span>Assigned</span>
                  </div>
                  <div class="pipeline-data">
                    <span class="count">{{ totalAssignedTenders }}</span>
                    <div class="mini-bar">
                      <div class="fill info" :style="{ width: calculatePercentage(totalAssignedTenders, totalTenders) + '%' }"></div>
                    </div>
                  </div>
                </div>

                <div class="pipeline-row">
                  <div class="pipeline-label">
                    <span class="status-dot success"></span>
                    <span>Submitted</span>
                  </div>
                  <div class="pipeline-data">
                    <span class="count">{{ totalTenderSubmissions }}</span>
                    <div class="mini-bar">
                      <div class="fill success" :style="{ width: calculatePercentage(totalTenderSubmissions, totalTenders) + '%' }"></div>
                    </div>
                  </div>
                </div>

                <div class="pipeline-row">
                  <div class="pipeline-label">
                    <span class="status-dot warning"></span>
                    <span>In Progress</span>
                  </div>
                  <div class="pipeline-data">
                    <span class="count">{{ totalOnProgressTenders }}</span>
                    <div class="mini-bar">
                      <div class="fill warning" :style="{ width: calculatePercentage(totalOnProgressTenders, totalTenders) + '%' }"></div>
                    </div>
                  </div>
                </div>

                <div class="pipeline-row">
                  <div class="pipeline-label">
                    <span class="status-dot orange"></span>
                    <span>Deadline Reached</span>
                  </div>
                  <div class="pipeline-data">
                    <span class="count">{{ totalDeadlineReachedTenders }}</span>
                    <div class="mini-bar">
                      <div class="fill orange" :style="{ width: calculatePercentage(totalDeadlineReachedTenders, totalTenders) + '%' }"></div>
                    </div>
                  </div>
                </div>

                <div class="pipeline-row">
                  <div class="pipeline-label">
                    <span class="status-dot danger"></span>
                    <span>Expired</span>
                  </div>
                  <div class="pipeline-data">
                    <span class="count">{{ totalExpiredTenders }}</span>
                    <div class="mini-bar">
                      <div class="fill danger" :style="{ width: calculatePercentage(totalExpiredTenders, totalTenders) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Status -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Projects Overview</h3>
                <p>Real-time monitoring</p>
              </div>
            </div>
            <div class="card-body">
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-icon total">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="stat-value">{{ totalProjects }}</div>
                  <div class="stat-name">Total</div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon progress">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="stat-value">{{ totalOnProgressProjects }}</div>
                  <div class="stat-name">Active</div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon completed">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="stat-value">{{ totalCompletedProjects }}</div>
                  <div class="stat-name">Done</div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon failed">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="stat-value">{{ totalFailedProjects }}</div>
                  <div class="stat-name">Failed</div>
                </div>
              </div>

              <div class="completion-bar">
                <div class="bar-header">
                  <span>Completion Rate</span>
                  <span class="percentage">{{ projectCompletionRate }}%</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: projectCompletionRate + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Chart -->
          <div class="card chart-card">
            <div class="card-header">
              <div>
                <h3>Performance Analytics</h3>
                <p>Comprehensive overview</p>
              </div>
              <div class="chart-controls">
                <button class="chart-btn active">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                </button>
                <button class="chart-btn">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="card-body chart-body">
              <apexchart 
                type="bar" 
                :options="chartOptions" 
                :series="chartSeries" 
                height="280"
              />
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-col">
          <!-- Financial -->
          <div class="card featured">
            <div class="featured-tag">Priority</div>
            <div class="card-header">
              <div>
                <h3>Financial Overview</h3>
                <p>Budget & analysis</p>
              </div>
            </div>
            <div class="card-body">
              <div class="financial-main">
                <div class="amount-label">Total Budget</div>
                <div class="amount-value">{{ formatCurrency(totalAmountRequired) }}</div>
              </div>
              <div class="financial-grid">
                <div class="fin-item">
                  <div class="fin-label">Submitted</div>
                  <div class="fin-value">{{ totalAnalyses }}</div>
                </div>
                <div class="fin-item success">
                  <div class="fin-label">Approved</div>
                  <div class="fin-value">{{ totalPassedAnalyses }}</div>
                </div>
                <div class="fin-item danger">
                  <div class="fin-label">Rejected</div>
                  <div class="fin-value">{{ totalRejectedAnalyses }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Organization -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Organization</h3>
                <p>Team structure</p>
              </div>
            </div>
            <div class="card-body">
              <div class="org-items">
                <div class="org-row">
                  <div class="org-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                  <div class="org-info">
                    <div class="org-value">{{ totalRoles }}</div>
                    <div class="org-label">User Roles</div>
                  </div>
                </div>
                <div class="org-row">
                  <div class="org-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                    </svg>
                  </div>
                  <div class="org-info">
                    <div class="org-value">{{ totalUsers }}</div>
                    <div class="org-label">Total Users</div>
                  </div>
                </div>
                <div class="org-row">
                  <div class="org-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="org-info">
                    <div class="org-value">{{ totalDepartments }}</div>
                    <div class="org-label">Departments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quotations -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Quotations</h3>
                <p>Submission status</p>
              </div>
            </div>
            <div class="card-body">
              <div class="quote-main">
                <div class="quote-total">{{ totalSchedules }}</div>
                <div class="quote-label">Total Submitted</div>
              </div>
              <div class="quote-breakdown">
                <div class="quote-row success">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="quote-count">{{ totalPassedSchedules }}</span>
                  <span class="quote-text">Approved</span>
                </div>
                <div class="quote-row danger">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <span class="quote-count">{{ totalRejectedSchedules }}</span>
                  <span class="quote-text">Rejected</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Requests -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Requests</h3>
                <p>Approval workflow</p>
              </div>
            </div>
            <div class="card-body">
              <div class="request-main">
                <div class="request-total">{{ totalRequests }}</div>
                <div class="request-label">Total Requests</div>
              </div>
              <div class="request-progress">
                <div class="req-segment approved" :style="{ width: calculatePercentage(approvedRequests, totalRequests) + '%' }"></div>
                <div class="req-segment rejected" :style="{ width: calculatePercentage(rejectedRequests, totalRequests) + '%' }"></div>
              </div>
              <div class="request-stats">
                <div class="req-stat approved">
                  <span class="req-dot"></span>
                  <span>{{ approvedRequests }} Approved</span>
                </div>
                <div class="req-stat rejected">
                  <span class="req-dot"></span>
                  <span>{{ rejectedRequests }} Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios';
import VueApexCharts from 'vue3-apexcharts';

const isLightMode = ref(false);

const toggleTheme = () => {
  isLightMode.value = !isLightMode.value;
  localStorage.setItem('theme', isLightMode.value ? 'light' : 'dark');
};

const formatCurrency = (value) => {
  if (!value) return 'TZS 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

const isRefreshing = ref(false);
const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  month: 'short', 
  day: 'numeric',
  year: 'numeric'
}));

const totalTenders = ref(0);
const totalAssignedTenders = ref(0);
const totalTenderSubmissions = ref(0);
const totalProjects = ref(0);
const totalFailedProjects = ref(0);
const totalCompletedProjects = ref(0);
const totalOnProgressTenders = ref(0);
const totalDeadlineReachedTenders = ref(0);
const totalExpiredTenders = ref(0);
const totalOnProgressProjects = ref(0);
const totalUsers = ref(0);
const totalRoles = ref(0);
const totalDepartments = ref(0);
const totalAnalyses = ref(0);
const totalPassedAnalyses = ref(0);
const totalRejectedAnalyses = ref(0);
const totalAmountRequired = ref(0);
const totalSchedules = ref(0);
const totalPassedSchedules = ref(0);
const totalRejectedSchedules = ref(0);
const totalRequests = ref(0);
const approvedRequests = ref(0);
const rejectedRequests = ref(0);

const projectCompletionRate = computed(() => {
  if (totalProjects.value === 0) return 0;
  return Math.round((totalCompletedProjects.value / totalProjects.value) * 100);
});

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: "'Inter', sans-serif",
    background: 'transparent'
  },
  colors: ['#2563EB', '#0EA5E9', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 6,
      columnWidth: '70%',
      dataLabels: { position: 'top' }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val,
    offsetY: -20,
    style: {
      fontSize: '11px',
      fontWeight: '700',
      colors: [isLightMode.value ? '#0F172A' : '#F1F5F9']
    }
  },
  legend: { show: false },
  grid: {
    borderColor: isLightMode.value ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
    strokeDashArray: 3,
    padding: { top: 0, right: 5, bottom: 0, left: 5 }
  },
  xaxis: {
    categories: ['Registered', 'Assigned', 'Submitted', 'Projects', 'Analyses', 'Requests', 'Completed'],
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '600',
        colors: isLightMode.value ? '#64748B' : '#94A3B8'
      }
    },
    axisBorder: {
      show: true,
      color: isLightMode.value ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)'
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: isLightMode.value ? '#64748B' : '#94A3B8'
      }
    }
  },
  tooltip: {
    theme: isLightMode.value ? 'light' : 'dark',
    y: { formatter: (val) => val + ' items' }
  }
}));

const chartSeries = computed(() => [
  {
    name: 'Count',
    data: [
      totalTenders.value,
      totalAssignedTenders.value,
      totalTenderSubmissions.value,
      totalProjects.value,
      totalAnalyses.value || 0,
      totalRequests.value || 0,
      totalCompletedProjects.value
    ]
  }
]);

const fetchTotalTenders = async () => {
  try {
    const response = await axios.get('api/count/registered-tenders');
    totalTenders.value = response.data.registered_tenders;
  } catch (error) {
    console.error('Error fetching total tenders:', error);
  }
};

const fetchTotalAssignedTenders = async () => {
  try {
    const response = await axios.get('api/count/all-assigned/tenders');
    totalAssignedTenders.value = response.data.assignedCount;
  } catch (error) {
    console.error('Error fetching assigned tenders:', error);
  }
};

const fetchTotalTenderSubmissions = async () => {
  try {
    const response = await axios.get('api/count/tenders-submissions');
    totalTenderSubmissions.value = response.data.submitted_tenders;
  } catch (error) {
    console.error('Error fetching tender submissions:', error);
  }
};

const fetchTotalProjects = async () => {
  try {
    const response = await axios.get('api/count/total-projects');
    totalProjects.value = response.data.count_total_projects;
  } catch (error) {
    console.error('Error fetching total projects:', error);
  }
};

const fetchTotalFailedProjects = async () => {
  try {
    const response = await axios.get('api/count/failed-projects');
    totalFailedProjects.value = response.data.total_failed_projects;
  } catch (error) {
    console.error('Error fetching failed projects:', error);
  }
};

const fetchTotalCompletedProjects = async () => {
  try {
    const response = await axios.get('api/count/completed-projects');
    totalCompletedProjects.value = response.data.total_completed_projects;
  } catch (error) {
    console.error('Error fetching completed projects:', error);
  }
};

const fetchTotalOnProgressTenders = async () => {
  try {
    const response = await axios.get('api/count/on-progress/tender');
    if (response.data.status) {
      totalOnProgressTenders.value = response.data.onProgressCount;
    }
  } catch (error) {
    console.error('Error fetching on-progress tenders:', error);
  }
};

const fetchTotalOnProgressProjects = async () => {
  try {
    const response = await axios.get('api/count/all/on-progress/projects');
    totalOnProgressProjects.value = response.data.total_on_progress_projects;
  } catch (error) {
    console.error('Error fetching on-progress projects:', error);
  }
};

const fetchTotalDeadlineReachedTenders = async () => {
  try {
    const response = await axios.get('api/count/all/deadline-reached-tenders');
    totalDeadlineReachedTenders.value = response.data.expired_tenders;
  } catch (error) {
    console.error('Error fetching tenders nearing deadline:', error);
  }
};

const fetchTotalExpiredTenders = async () => {
  try {
    const response = await axios.get('api/count/all-expired/tenders');
    totalExpiredTenders.value = response.data.expired_tenders;
  } catch (error) {
    console.error('Error fetching expired tenders:', error);
  }
};

const fetchTotalUsers = async () => {
  try {
    const response = await axios.get('api/count/users');
    totalUsers.value = response.data.total_users;
  } catch (error) {
    console.error('Error fetching total users:', error);
  }
};

const fetchTotalRoles = async () => {
  try {
    const response = await axios.get('api/count/roles');
    totalRoles.value = response.data.user_roles;
  } catch (error) {
    console.error('Error fetching total roles:', error);
  }
};

const fetchTotalDepartments = async () => {
  try {
    const response = await axios.get('api/count/departments');
    totalDepartments.value = response.data.total_departments;
  } catch (error) {
    console.error('Error fetching total departments:', error);
  }
};

const fetchTotalAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses');
    totalAnalyses.value = response.data.total_count;
  } catch (error) {
    console.error('Error fetching total analyses:', error);
  }
};

const fetchTotalPassedAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses/passed');
    totalPassedAnalyses.value = response.data.passed_count;
  } catch (error) {
    console.error('Error fetching passed analyses:', error);
  }
};

const fetchTotalRejectedAnalyses = async () => {
  try {
    const response = await axios.get('api/count/all-analyses/rejected');
    totalRejectedAnalyses.value = response.data.rejected_count;
  } catch (error) {
    console.error('Error fetching rejected analyses:', error);
  }
};

const fetchTotalAmountRequired = async () => {
  try {
    const response = await axios.get('api/count/all/total-amount-required');
    totalAmountRequired.value = response.data.total_amount_required;
  } catch (error) {
    console.error('Error fetching total amount required:', error);
  }
};

const fetchTotalSchedules = async () => {
  try {
    const response = await axios.get('api/count-all/schedule');
    totalSchedules.value = response.data.total_count;
  } catch (error) {
    console.error('Error fetching total schedules:', error);
  }
};

const fetchTotalPassedSchedules = async () => {
  try {
    const response = await axios.get('api/count-passed/schedule');
    totalPassedSchedules.value = response.data.passed_count;
  } catch (error) {
    console.error('Error fetching passed schedules:', error);
  }
};

const fetchTotalRejectedSchedules = async () => {
  try {
    const response = await axios.get('api/count-rejected/schedule');
    totalRejectedSchedules.value = response.data.rejected_count;
  } catch (error) {
    console.error('Error fetching rejected schedules:', error);
  }
};

const fetchTotalRequests = async () => {
  try {
    const response = await axios.get('api/count-all/requests');
    totalRequests.value = response.data.totalRequests;
  } catch (error) {
    console.error('Error fetching total requests:', error);
  }
};

const fetchApprovedRequests = async () => {
  try {
    const response = await axios.get('api/count-approved/requests');
    approvedRequests.value = response.data.approvedRequests;
  } catch (error) {
    console.error('Error fetching approved requests:', error);
  }
};

const fetchRejectedRequests = async () => {
  try {
    const response = await axios.get('api/count-rejected/requests');
    rejectedRequests.value = response.data.rejectedRequests;
  } catch (error) {
    console.error('Error fetching rejected requests:', error);
  }
};

const refreshAllData = async () => {
  isRefreshing.value = true;
  await Promise.all([
    fetchTotalTenders(),
    fetchTotalAssignedTenders(),
    fetchTotalTenderSubmissions(),
    fetchTotalProjects(),
    fetchTotalFailedProjects(),
    fetchTotalCompletedProjects(),
    fetchTotalOnProgressTenders(),
    fetchTotalOnProgressProjects(),
    fetchTotalDeadlineReachedTenders(),
    fetchTotalExpiredTenders(),
    fetchTotalUsers(),
    fetchTotalRoles(),
    fetchTotalDepartments(),
    fetchTotalAnalyses(),
    fetchTotalPassedAnalyses(),
    fetchTotalRejectedAnalyses(),
    fetchTotalAmountRequired(),
    fetchTotalSchedules(),
    fetchTotalPassedSchedules(),
    fetchTotalRejectedSchedules(),
    fetchTotalRequests(),
    fetchApprovedRequests(),
    fetchRejectedRequests()
  ]);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 500);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isLightMode.value = true;
  }
  refreshAllData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ============================================
   THEME SYSTEM
============================================ */
.dashboard-container {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-card: rgba(30, 41, 59, 0.6);
  --bg-elevated: rgba(51, 65, 85, 0.8);
  --border-color: rgba(255, 255, 255, 0.1);
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;
  --shadow: rgba(0, 0, 0, 0.3);
  
  --primary: #2563EB;
  --primary-light: rgba(37, 99, 235, 0.15);
  --success: #10B981;
  --success-light: rgba(16, 185, 129, 0.15);
  --warning: #F59E0B;
  --warning-light: rgba(245, 158, 11, 0.15);
  --danger: #EF4444;
  --danger-light: rgba(239, 68, 68, 0.15);
  --info: #0EA5E9;
  --orange: #FB923C;
}

.dashboard-container.light-mode {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-card: #FFFFFF;
  --bg-elevated: #F8FAFC;
  --border-color: #E2E8F0;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #64748B;
  --shadow: rgba(0, 0, 0, 0.05);
}

.dashboard-container {
  min-height: 100vh;
  background: var(--bg-primary);
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ============================================
   NAVIGATION
============================================ */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
}

.nav-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.brand-mark {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary) 0%, #1D4ED8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.brand-mark svg {
  width: 22px;
  height: 22px;
}

.brand-identity h1 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.125rem;
}

.brand-identity span {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-input {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s ease;
}

.search-input input::placeholder {
  color: var(--text-tertiary);
}

.search-input input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.nav-icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-icon-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.nav-icon-btn svg {
  width: 18px;
  height: 18px;
}

.pulse-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  background: var(--danger);
  border-radius: 50%;
  border: 2px solid var(--bg-card);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.refresh-btn {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--primary) 0%, #1D4ED8 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.date-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 600;
}

.date-display svg {
  width: 16px;
  height: 16px;
}

/* ============================================
   DASHBOARD MAIN
============================================ */
.dashboard-main {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* ============================================
   METRICS SECTION
============================================ */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px var(--shadow);
  border-color: currentColor;
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card.primary::before { background: var(--primary); }
.metric-card.success::before { background: var(--success); }
.metric-card.warning::before { background: var(--warning); }
.metric-card.danger::before { background: var(--danger); }

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-card.primary .metric-icon { background: var(--primary); }
.metric-card.success .metric-icon { background: var(--success); }
.metric-card.warning .metric-icon { background: var(--warning); }
.metric-card.danger .metric-icon { background: var(--danger); }

.metric-icon svg {
  width: 22px;
  height: 22px;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.trend-indicator svg {
  width: 12px;
  height: 12px;
}

.trend-indicator.up {
  background: var(--success-light);
  color: var(--success);
}

.trend-indicator.down {
  background: var(--danger-light);
  color: var(--danger);
}

.trend-indicator.neutral {
  background: var(--bg-elevated);
  color: var(--text-tertiary);
}

.metric-body {
  margin-bottom: 0.875rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.375rem;
  letter-spacing: -0.5px;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.metric-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.divider {
  color: var(--border-color);
}

/* ============================================
   CONTENT GRID
============================================ */
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1rem;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px var(--shadow);
}

.card.featured {
  position: relative;
  border: 2px solid var(--primary);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
}

.featured-tag {
  position: absolute;
  top: -10px;
  right: 1.25rem;
  background: linear-gradient(135deg, var(--primary) 0%, #1D4ED8 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 1;
}

.card-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.card-header p {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.icon-btn {
  width: 32px;
  height: 32px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.icon-btn svg {
  width: 16px;
  height: 16px;
}

.card-body {
  padding: 1.25rem;
}

/* ============================================
   PIPELINE
============================================ */
.pipeline-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pipeline-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pipeline-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 140px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.primary { background: var(--primary); }
.status-dot.info { background: var(--info); }
.status-dot.success { background: var(--success); }
.status-dot.warning { background: var(--warning); }
.status-dot.orange { background: var(--orange); }
.status-dot.danger { background: var(--danger); }

.pipeline-label span:last-child {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.pipeline-data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
  flex: 1;
}

.count {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.mini-bar {
  width: 100%;
  max-width: 160px;
  height: 6px;
  background: var(--bg-elevated);
  border-radius: 10px;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease;
}

.fill.primary { background: var(--primary); }
.fill.info { background: var(--info); }
.fill.success { background: var(--success); }
.fill.warning { background: var(--warning); }
.fill.orange { background: var(--orange); }
.fill.danger { background: var(--danger); }

/* ============================================
   STATS GRID
============================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-box {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-box:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 38px;
  height: 38px;
  margin: 0 auto 0.625rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.total { background: #6366F1; }
.stat-icon.progress { background: var(--warning); }
.stat-icon.completed { background: var(--success); }
.stat-icon.failed { background: var(--danger); }

.stat-icon svg {
  width: 20px;
  height: 20px;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.375rem;
  letter-spacing: -0.5px;
}

.stat-name {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.completion-bar {
  background: var(--primary-light);
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 1rem;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

.bar-header span:first-child {
  color: var(--text-secondary);
}

.percentage {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.5px;
}

.bar-track {
  height: 10px;
  background: var(--bg-elevated);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, #1D4ED8 100%);
  border-radius: 10px;
  transition: width 1s ease;
}

/* ============================================
   CHART
============================================ */
.chart-controls {
  display: flex;
  gap: 0.375rem;
}

.chart-btn {
  width: 32px;
  height: 32px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.chart-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.chart-btn svg {
  width: 16px;
  height: 16px;
}

.chart-body {
  padding: 1rem 0.5rem;
}

/* ============================================
   FINANCIAL
============================================ */
.financial-main {
  background: var(--primary-light);
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  margin-bottom: 1rem;
}

.amount-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-tertiary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.amount-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.financial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.fin-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.875rem;
  text-align: center;
}

.fin-item.success {
  border-left: 3px solid var(--success);
}

.fin-item.danger {
  border-left: 3px solid var(--danger);
}

.fin-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.fin-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

/* ============================================
   ORGANIZATION
============================================ */
.org-items {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.org-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.org-row:hover {
  transform: translateX(4px);
}

.org-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--info) 0%, #0284C7 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.org-icon svg {
  width: 22px;
  height: 22px;
}

.org-info {
  flex: 1;
}

.org-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
  letter-spacing: -0.5px;
}

.org-label {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

/* ============================================
   QUOTATIONS
============================================ */
.quote-main {
  text-align: center;
  padding: 1rem;
  background: var(--bg-elevated);
  border-radius: 10px;
  margin-bottom: 1rem;
}

.quote-total {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.375rem;
  letter-spacing: -0.5px;
}

.quote-label {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.quote-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quote-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.quote-row.success {
  border-left: 3px solid var(--success);
}

.quote-row.success svg {
  color: var(--success);
}

.quote-row.danger {
  border-left: 3px solid var(--danger);
}

.quote-row.danger svg {
  color: var(--danger);
}

.quote-row svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.quote-count {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.quote-text {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  font-weight: 600;
  margin-left: auto;
}

/* ============================================
   REQUESTS
============================================ */
.request-main {
  text-align: center;
  padding: 1rem;
  background: var(--bg-elevated);
  border-radius: 10px;
  margin-bottom: 1rem;
}

.request-total {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.375rem;
  letter-spacing: -0.5px;
}

.request-label {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.request-progress {
  height: 8px;
  background: var(--bg-elevated);
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  margin-bottom: 0.875rem;
}

.req-segment {
  height: 100%;
  transition: width 0.8s ease;
}

.req-segment.approved {
  background: var(--success);
}

.req-segment.rejected {
  background: var(--danger);
}

.request-stats {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.req-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

.req-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.req-stat.approved {
  color: var(--success);
}

.req-stat.approved .req-dot {
  background: var(--success);
}

.req-stat.rejected {
  color: var(--danger);
}

.req-stat.rejected .req-dot {
  background: var(--danger);
}

/* ============================================
   RESPONSIVE
============================================ */
@media (max-width: 1280px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .metrics-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-main {
    padding: 1.25rem;
  }
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
  }

  .nav-tools {
    width: 100%;
    justify-content: space-between;
  }

  .search-input {
    width: 100%;
    order: -1;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .metrics-section {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .financial-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .brand-identity {
    display: none;
  }

  .date-display span {
    display: none;
  }

  .metric-value {
    font-size: 1.75rem;
  }
}
</style>