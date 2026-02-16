<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'cygre', sans-serif">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p class="text-sm text-gray-600 mt-1">Complete view of your tender management system</p>
          </div>
          <button 
            @click="fetchDashboardData" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            :disabled="isLoading"
          >
            <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="text-gray-600"></i>
            <span class="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <!-- Statistics Grid Skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm animate-pulse">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-300 rounded-lg"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                <div class="h-6 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <i class="fas fa-exclamation-circle text-6xl text-red-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button 
            @click="fetchDashboardData" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            <i class="fas fa-redo"></i>
            <span>Retry</span>
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Quick Stats Grid - Responsive: 2 cols mobile, 3 cols tablet, 4 cols desktop -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <!-- Total Tenders -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-file-contract text-blue-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Total Tenders</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.tenders.registered }}</p>
            </div>
          </div>

          <!-- Assigned Tenders -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-tasks text-purple-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Assigned</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.tenders.assigned }}</p>
            </div>
          </div>

          <!-- Submitted Tenders -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-folder-open text-green-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Submitted</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.tenders.submitted }}</p>
            </div>
          </div>

          <!-- Active Projects -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-project-diagram text-teal-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Projects</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.projects.inProgress }}</p>
            </div>
          </div>

          <!-- Awards -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-trophy text-yellow-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Awards</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.awards.total }}</p>
            </div>
          </div>

          <!-- Awarding Letters -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-envelope text-indigo-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Letters</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.awards.letters }}</p>
            </div>
          </div>

          <!-- Insurance Bonds -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-shield-alt text-cyan-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Bonds</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.performances.insuranceBonds }}</p>
            </div>
          </div>

          <!-- Updates -->
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div class="flex flex-col items-center text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform mb-2">
                <i class="fas fa-upload text-orange-600 text-xl"></i>
              </div>
              <p class="text-xs text-gray-600 mb-1">Updates</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.updates.total }}</p>
            </div>
          </div>
        </div>

        <!-- Main Content Grid - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Tenders Overview Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg shadow-lg">
                    <i class="fas fa-file-contract text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">Tenders</h2>
                    <p class="text-xs text-gray-600">All activities</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-blue-600">{{ dashboardData.tenders.registered }}</p>
                  <p class="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="space-y-3">
                <!-- Registered -->
                <div class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
                      <i class="fas fa-pen-square text-white text-sm"></i>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">Registered</span>
                  </div>
                  <span class="text-lg font-bold text-blue-600">{{ dashboardData.tenders.registered }}</span>
                </div>

                <!-- Assigned -->
                <div class="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg">
                      <i class="fas fa-tasks text-white text-sm"></i>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">Assigned</span>
                  </div>
                  <span class="text-lg font-bold text-purple-600">{{ dashboardData.tenders.assigned }}</span>
                </div>

                <!-- Submitted -->
                <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                      <i class="fas fa-folder-open text-white text-sm"></i>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">Submitted</span>
                  </div>
                  <span class="text-lg font-bold text-green-600">{{ dashboardData.tenders.submitted }}</span>
                </div>

                <!-- In Progress -->
                <div class="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-lg">
                      <i class="fas fa-spinner text-white text-sm"></i>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">In Progress</span>
                  </div>
                  <span class="text-lg font-bold text-indigo-600">{{ dashboardData.tenders.inProgress }}</span>
                </div>

                <!-- Deadline & Expired -->
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center hover:bg-yellow-100 transition-all cursor-pointer">
                    <div class="flex items-center justify-center w-6 h-6 bg-yellow-500 rounded mx-auto mb-1">
                      <i class="fas fa-exclamation-triangle text-white text-xs"></i>
                    </div>
                    <p class="text-xs text-gray-600 mb-1">Deadline</p>
                    <p class="text-lg font-bold text-yellow-700">{{ dashboardData.tenders.deadlineReached }}</p>
                  </div>
                  <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-center hover:bg-red-100 transition-all cursor-pointer">
                    <div class="flex items-center justify-center w-6 h-6 bg-red-500 rounded mx-auto mb-1">
                      <i class="fas fa-times-circle text-white text-xs"></i>
                    </div>
                    <p class="text-xs text-gray-600 mb-1">Expired</p>
                    <p class="text-lg font-bold text-red-600">{{ dashboardData.tenders.expired }}</p>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-700">Submission Rate</span>
                  <span class="text-xs font-bold text-gray-900">{{ tenderSubmissionRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: tenderSubmissionRate + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Awards & Performance Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-lg shadow-lg">
                    <i class="fas fa-trophy text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">Awards</h2>
                    <p class="text-xs text-gray-600">Track awards</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-yellow-600">{{ dashboardData.awards.total }}</p>
                  <p class="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <!-- Awards Section -->
                <div class="space-y-2">
                  <!-- Intention to Awards -->
                  <div class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-all cursor-pointer">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-lg">
                        <i class="fas fa-lightbulb text-white text-sm"></i>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">Intentions</span>
                    </div>
                    <span class="text-lg font-bold text-yellow-600">{{ dashboardData.awards.intentions }}</span>
                  </div>

                  <!-- Awarding Letters -->
                  <div class="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all cursor-pointer">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-lg">
                        <i class="fas fa-envelope text-white text-sm"></i>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">Letters</span>
                    </div>
                    <span class="text-lg font-bold text-indigo-600">{{ dashboardData.awards.letters }}</span>
                  </div>
                </div>

                <!-- Performance Section -->
                <div class="pt-4 border-t border-gray-200">
                  <h3 class="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i class="fas fa-chart-line text-cyan-500"></i>
                    Performance
                  </h3>
                  <div class="space-y-2">
                    <!-- Insurance Bonds -->
                    <div class="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-all cursor-pointer">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center justify-center w-8 h-8 bg-cyan-500 rounded-lg">
                          <i class="fas fa-shield-alt text-white text-sm"></i>
                        </div>
                        <span class="text-sm font-semibold text-gray-900">Bonds</span>
                      </div>
                      <span class="text-lg font-bold text-cyan-600">{{ dashboardData.performances.insuranceBonds }}</span>
                    </div>

                    <!-- Security Declarations -->
                    <div class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-lg">
                          <i class="fas fa-lock text-white text-sm"></i>
                        </div>
                        <span class="text-sm font-semibold text-gray-900">Security</span>
                      </div>
                      <span class="text-lg font-bold text-gray-700">{{ dashboardData.performances.securityDeclarations }}</span>
                    </div>
                  </div>
                </div>

                <!-- Updates Section -->
                <div class="pt-4 border-t border-gray-200">
                  <h3 class="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i class="fas fa-upload text-orange-500"></i>
                    Updates
                  </h3>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center hover:bg-orange-100 transition-all cursor-pointer">
                      <p class="text-xs text-gray-600 mb-1">Total</p>
                      <p class="text-lg font-bold text-orange-600">{{ dashboardData.updates.total }}</p>
                    </div>
                    <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100 transition-all cursor-pointer">
                      <p class="text-xs text-gray-600 mb-1">Recent</p>
                      <p class="text-lg font-bold text-blue-600">{{ dashboardData.updates.recent }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Overview Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg shadow-lg">
                    <i class="fas fa-project-diagram text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">Projects</h2>
                    <p class="text-xs text-gray-600">Monitor status</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-green-600">{{ dashboardData.projects.total }}</p>
                  <p class="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="space-y-3">
                <!-- Total Projects -->
                <div class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
                      <i class="fas fa-folder text-white text-sm"></i>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">Total</span>
                  </div>
                  <span class="text-lg font-bold text-blue-600">{{ dashboardData.projects.total }}</span>
                </div>

                <!-- In Progress -->
                <div class="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg">
                      <i class="fas fa-tasks text-white text-sm"></i>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">In Progress</span>
                  </div>
                  <span class="text-lg font-bold text-orange-600">{{ dashboardData.projects.inProgress }}</span>
                </div>

                <!-- Completed & Failed -->
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-center hover:bg-green-100 transition-all cursor-pointer">
                    <div class="flex items-center justify-center w-6 h-6 bg-green-500 rounded mx-auto mb-1">
                      <i class="fas fa-check-circle text-white text-xs"></i>
                    </div>
                    <p class="text-xs text-gray-600 mb-1">Completed</p>
                    <p class="text-lg font-bold text-green-600">{{ dashboardData.projects.completed }}</p>
                  </div>
                  <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-center hover:bg-red-100 transition-all cursor-pointer">
                    <div class="flex items-center justify-center w-6 h-6 bg-red-500 rounded mx-auto mb-1">
                      <i class="fas fa-times-circle text-white text-xs"></i>
                    </div>
                    <p class="text-xs text-gray-600 mb-1">Failed</p>
                    <p class="text-lg font-bold text-red-600">{{ dashboardData.projects.failed }}</p>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-700">Success Rate</span>
                  <span class="text-xs font-bold text-gray-900">{{ projectSuccessRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: projectSuccessRate + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Distribution -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <h3 class="text-xs font-semibold text-gray-700 mb-2">Distribution</h3>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600">Active</span>
                    <span class="font-semibold text-gray-900">{{ projectActivePercentage }}%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600">Completed</span>
                    <span class="font-semibold text-gray-900">{{ projectCompletedPercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Summary Card - Full Width -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg shadow-lg">
                <i class="fas fa-chart-bar text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">System Overview</h2>
                <p class="text-sm text-gray-600">Complete system statistics</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Activity Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <i class="fas fa-file-contract text-blue-600 text-2xl mb-2"></i>
                <p class="text-2xl font-bold text-blue-600">{{ dashboardData.tenders.registered }}</p>
                <p class="text-xs text-gray-600 mt-1">Tenders</p>
              </div>
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <i class="fas fa-trophy text-green-600 text-2xl mb-2"></i>
                <p class="text-2xl font-bold text-green-600">{{ dashboardData.awards.total }}</p>
                <p class="text-xs text-gray-600 mt-1">Awards</p>
              </div>
              <div class="p-4 bg-cyan-50 border border-cyan-200 rounded-lg text-center">
                <i class="fas fa-shield-alt text-cyan-600 text-2xl mb-2"></i>
                <p class="text-2xl font-bold text-cyan-600">{{ dashboardData.performances.total }}</p>
                <p class="text-xs text-gray-600 mt-1">Performance</p>
              </div>
              <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <i class="fas fa-upload text-orange-600 text-2xl mb-2"></i>
                <p class="text-2xl font-bold text-orange-600">{{ dashboardData.updates.total }}</p>
                <p class="text-xs text-gray-600 mt-1">Updates</p>
              </div>
            </div>

            <!-- Overall Progress -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Overall System Completion</span>
                <span class="text-sm font-bold text-gray-900">{{ overallCompletion }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  :style="{ width: overallCompletion + '%' }"
                ></div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button class="flex flex-col items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium">
                  <i class="fas fa-plus-circle text-xl"></i>
                  <span>New Tender</span>
                </button>
                <button class="flex flex-col items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all text-sm font-medium">
                  <i class="fas fa-upload text-xl"></i>
                  <span>Submit Update</span>
                </button>
                <button class="flex flex-col items-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all text-sm font-medium">
                  <i class="fas fa-trophy text-xl"></i>
                  <span>View Awards</span>
                </button>
                <button class="flex flex-col items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all text-sm font-medium">
                  <i class="fas fa-chart-bar text-xl"></i>
                  <span>Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'

// ── State ────────────────────────────────────────────────
const isLoading = ref(true)
const error = ref(null)

const dashboardData = ref({
  tenders: {
    registered: 0,
    assigned: 0,
    submitted: 0,
    inProgress: 0,
    deadlineReached: 0,
    expired: 0
  },
  projects: {
    total: 0,
    inProgress: 0,
    completed: 0,
    failed: 0
  },
  awards: {
    total: 0,
    intentions: 0,
    letters: 0
  },
  performances: {
    total: 0,
    insuranceBonds: 0,
    securityDeclarations: 0
  },
  updates: {
    total: 0,
    recent: 0
  }
})

// ── Computed Properties ──────────────────────────────────
const tenderSubmissionRate = computed(() => {
  const total = dashboardData.value.tenders.registered
  if (total === 0) return 0
  const submitted = dashboardData.value.tenders.submitted
  return Math.round((submitted / total) * 100)
})

const projectSuccessRate = computed(() => {
  const total = dashboardData.value.projects.total
  if (total === 0) return 0
  const completed = dashboardData.value.projects.completed
  return Math.round((completed / total) * 100)
})

const projectActivePercentage = computed(() => {
  const total = dashboardData.value.projects.total
  if (total === 0) return 0
  const active = dashboardData.value.projects.inProgress
  return Math.round((active / total) * 100)
})

const projectCompletedPercentage = computed(() => {
  const total = dashboardData.value.projects.total
  if (total === 0) return 0
  const completed = dashboardData.value.projects.completed
  return Math.round((completed / total) * 100)
})

const overallCompletion = computed(() => {
  const totalItems = dashboardData.value.tenders.registered + 
                     dashboardData.value.projects.total +
                     dashboardData.value.awards.total +
                     dashboardData.value.performances.total

  if (totalItems === 0) return 0
  
  const completedItems = dashboardData.value.tenders.submitted +
                         dashboardData.value.projects.completed +
                         dashboardData.value.awards.letters
  
  return Math.round((completedItems / totalItems) * 100)
})

// ── Fetch Dashboard Data ─────────────────────────────────
const fetchDashboardData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { data } = await axios.get('api/dashboard/stats')
    
    // Update dashboard data - handle both direct data and nested data formats
    const responseData = data.data || data
    
    dashboardData.value = {
      tenders: {
        registered: Number(responseData.tenders?.registered || 0),
        assigned: Number(responseData.tenders?.assigned || 0),
        submitted: Number(responseData.tenders?.submitted || 0),
        inProgress: Number(responseData.tenders?.inProgress || 0),
        deadlineReached: Number(responseData.tenders?.deadlineReached || 0),
        expired: Number(responseData.tenders?.expired || 0)
      },
      projects: {
        total: Number(responseData.projects?.total || 0),
        inProgress: Number(responseData.projects?.inProgress || 0),
        completed: Number(responseData.projects?.completed || 0),
        failed: Number(responseData.projects?.failed || 0)
      },
      awards: {
        total: Number(responseData.awards?.total || 0),
        intentions: Number(responseData.awards?.intentions || 0),
        letters: Number(responseData.awards?.letters || 0)
      },
      performances: {
        total: Number(responseData.performances?.insuranceBonds || 0) + 
               Number(responseData.performances?.securityDeclarations || 0),
        insuranceBonds: Number(responseData.performances?.insuranceBonds || 0),
        securityDeclarations: Number(responseData.performances?.securityDeclarations || 0)
      },
      updates: {
        total: Number(responseData.updates?.total || 0),
        recent: Number(responseData.updates?.recent || 0)
      }
    }
  } catch (err) {
    console.error('Dashboard data loading failed:', err)
    error.value = 'Failed to load dashboard data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover effects */
.cursor-pointer:hover {
  transform: translateY(-2px);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Animation for progress bars */
@keyframes progressAnimation {
  from {
    width: 0%;
  }
}

.bg-gradient-to-r {
  animation: progressAnimation 1s ease-out;
}
</style>