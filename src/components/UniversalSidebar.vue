<template>
  <div class="flex flex-col h-full bg-slate-900 dark:bg-slate-950">
    <!-- Logo Section -->
    <div class="p-6 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">{{ roleConfig.title }}</h1>
          <p class="text-xs text-slate-400">{{ roleConfig.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <template v-for="item in currentMenuItems" :key="item.name || 'separator'">
        <!-- Separator -->
        <div v-if="item.type === 'separator'" class="border-t border-slate-700 my-2"></div>
        
        <!-- Dropdown Menu Item -->
        <div v-else-if="item.children && item.children.length > 0" class="mb-2">
          <button
            @click="toggleDropdown(item.name)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              isDropdownOpen(item.name) || isActive(item.name)
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            ]"
          >
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
              isDropdownOpen(item.name) || isActive(item.name)
                ? 'bg-white/20 shadow-inner'
                : 'bg-slate-800 group-hover:bg-slate-700'
            ]">
              <svg class="w-5 h-5" :class="isDropdownOpen(item.name) || isActive(item.name) ? 'text-white' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
              </svg>
            </div>
            <div class="flex-1 text-left">
              <p class="font-medium">{{ item.label }}</p>
              <p class="text-xs opacity-70">{{ item.description }}</p>
            </div>
            <svg 
              class="w-4 h-4 transition-transform duration-200" 
              :class="[
                isDropdownOpen(item.name) ? 'rotate-180 text-white' : 'text-slate-400'
              ]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Dropdown Items -->
          <div v-if="isDropdownOpen(item.name)" class="ml-4 mt-2 space-y-1">
            <router-link
              v-for="child in item.children"
              :key="child.name"
              :to="child.path"
              :class="[
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group',
                isActive(child.name)
                  ? 'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              ]"
            >
              <i v-if="child.icon && child.icon.includes('fas')" :class="child.icon" class="w-4 h-4"></i>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="child.icon || 'M9 5l7 7-7 7'" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ child.label }}</p>
              </div>
              <div v-if="child.badge" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                {{ child.badge }}
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- Regular Menu Item -->
        <router-link
          v-else
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
            isActive(item.name)
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
            isActive(item.name)
              ? 'bg-white/20 shadow-inner'
              : 'bg-slate-800 group-hover:bg-slate-700'
          ]">
            <svg class="w-5 h-5" :class="isActive(item.name) ? 'text-white' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ item.label }}</p>
            <p class="text-xs opacity-70">{{ item.description }}</p>
          </div>
          <div v-if="item.badge" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            {{ item.badge }}
          </div>
        </router-link>
      </template>
    </nav>

    <!-- Profile Section -->
    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
          {{ userInitials }}
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-white">{{ userName }}</p>
          <p class="text-xs text-slate-400">{{ roleConfig.title }}</p>
        </div>
        <div class="relative">
          <button
            @click="toggleProfileMenu"
            class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          <!-- Profile Dropdown -->
          <div 
            v-if="profileMenuOpen" 
            class="absolute bottom-full right-0 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 w-48"
          >
            <router-link 
              :to="roleConfig.profilePath"
              @click="closeProfileMenu"
              class="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm">My Profile</span>
            </router-link>
            
            <div class="border-t border-slate-700"></div>
            
            <button 
              @click="handleLogout" 
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-red-400 hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Reactive data
const openDropdowns = ref([])
const profileMenuOpen = ref(false)
const userRole = ref(7) // Default to CEO
const userName = ref('Admin User')

// Role configurations
const roleConfigs = {
  1: {
    title: 'Administrator',
    subtitle: 'System Admin',
    profilePath: '/admin/profile',
    menuItems: [
      {
        name: 'AdminDashboard',
        label: 'Dashboard',
        description: 'System overview & analytics',
        path: '/admin/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'UserManagement',
        label: 'User Management',
        description: 'Manage system users',
        path: '/admin/users',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/admin/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  },
  2: {
    title: 'HOD Portal',
    subtitle: 'Head of Department',
    profilePath: '/hod/profile',
    menuItems: [
      {
        name: 'HODDashboard',
        label: 'Dashboard',
        description: 'Department overview',
        path: '/hod/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'HODReports',
        label: 'Reports',
        description: 'Department reports',
        path: '/hod/reports',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/hod/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  },
  3: {
    title: 'User Portal',
    subtitle: 'Employee Dashboard',
    profilePath: '/user/profile',
    menuItems: [
      {
        name: 'UserDashboard',
        label: 'Dashboard',
        description: 'Personal dashboard',
        path: '/user/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'UserTasks',
        label: 'My Tasks',
        description: 'Assigned tasks',
        path: '/user/tasks',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/user/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  },
  4: {
    title: 'Tenders Portal',
    subtitle: 'Tender Management',
    profilePath: '/tenders/profile',
    menuItems: [
      {
        name: 'TenderDashboard',
        label: 'Dashboard',
        description: 'Tender overview',
        path: '/tenders/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'TenderList',
        label: 'Tenders',
        description: 'Manage tenders',
        path: '/tenders/view-tenders',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/tenders/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  },
  5: {
    title: 'Accounting Portal',
    subtitle: 'Financial Management',
    profilePath: '/accountant/profile',
    menuItems: [
      {
        name: 'AccountantDashboard',
        label: 'Dashboard',
        description: 'Financial overview',
        path: '/accountant/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'FinancialRecords',
        label: 'Financial Records',
        description: 'Manage financial data',
        path: '/accountant/financial-records',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/accountant/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  },
  6: {
    title: 'HR Portal',
    subtitle: 'Human Resources',
    profilePath: '/hr/profile',
    menuItems: [
      {
        name: 'HRDashboard',
        label: 'Dashboard',
        description: 'HR overview',
        path: '/hr/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'EmployeeManagement',
        label: 'Employee Management',
        description: 'Manage employees',
        path: '/hr/employee-management',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
      },
      {
        name: 'LeaveManagement',
        label: 'Leave Management',
        description: 'Manage leave requests',
        path: '/hr/leave-management',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      {
        name: 'PerformanceManagement',
        label: 'Performance',
        description: 'Performance reviews',
        path: '/hr/performance-management',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/hr/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  },
  7: {
    title: 'Executive',
    subtitle: 'CEO Portal',
    profilePath: '/ceo/profile',
    menuItems: [
      {
        name: 'CEODashboard',
        label: 'Dashboard',
        description: 'Executive overview & analytics',
        path: '/ceo/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      },
      {
        name: 'CEOAnalytics',
        label: 'Analytics',
        description: 'Advanced analytics & insights',
        path: '/ceo/analytics',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      },
      {
        name: 'BudgetManagement',
        label: 'Budget',
        description: 'Budget planning & tracking',
        path: '/ceo/budget',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        name: 'CEOFinancialRecords',
        label: 'Financial Records',
        description: 'Complete financial overview & exports',
        path: '/ceo/financial-records',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        name: 'AdvancedReporting',
        label: 'Reports',
        description: 'Custom reports & analytics',
        path: '/ceo/reports',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      },
      {
        name: 'CEOTenders',
        label: 'Tenders',
        description: 'Manage all tenders',
        path: '/ceo/view-tenders',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      {
        name: 'CEOQuotations',
        label: 'Quotations',
        description: 'Price schedules',
        path: '/ceo/quotations',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        badge: 0
      },
      {
        name: 'CEOPerformance',
        label: 'Performance',
        description: 'Employee performance reviews',
        path: '/ceo/performance-evaluations',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        name: 'CEOLeaveManagement',
        label: 'Leave Management',
        description: 'Manage employee leave requests',
        path: '/ceo/leave-management',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      { type: 'separator' },
      {
        name: 'TERASystems',
        label: 'TERA Systems',
        description: 'External system integrations',
        path: '/ceo/tera-systems',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        children: [
          {
            icon: "fas fa-users text-blue-500",
            label: "Tera Invites",
            name: "TeraInvites",
            path: "/ceo/tera-invites",
            active: false,
          },
          {
            icon: "fas fa-store text-green-500",
            label: "Tera POS",
            name: "TeraPOS",
            path: "/ceo/tera-pos",
            active: false,
          },
          {
            icon: "fas fa-truck text-orange-500",
            label: "VTS",
            name: "VTS",
            path: "/ceo/vts",
            active: false,
          },
          {
            icon: "fas fa-box text-purple-500",
            label: "Inventory",
            name: "Inventory",
            path: "/ceo/inventory",
            active: false,
          }
        ]
      },
      { type: 'separator' },
      {
        name: 'Profile',
        label: 'Profile',
        description: 'Personal settings & information',
        path: '/ceo/profile',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
    ]
  }
}

// Computed properties
const roleConfig = computed(() => roleConfigs[userRole.value] || roleConfigs[7])
const currentMenuItems = computed(() => roleConfig.value.menuItems)
const userInitials = computed(() => {
  if (!userName.value) return 'U'
  return userName.value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Methods
const isActive = (routeName) => {
  return route.name === routeName || route.name?.includes(routeName)
}

const isDropdownOpen = (dropdownName) => {
  return openDropdowns.value.includes(dropdownName)
}

const toggleDropdown = (dropdownName) => {
  const index = openDropdowns.value.indexOf(dropdownName)
  if (index > -1) {
    openDropdowns.value.splice(index, 1)
  } else {
    openDropdowns.value = [dropdownName]
  }
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const closeProfileMenu = () => {
  profileMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await axios.post('/api/auth/logout')
    AuthStorage.clearAuth()
    router.push('/login')
    toast.success('Logged out successfully')
  } catch (error) {
    console.error('Logout error:', error)
    // Still logout on client side even if server fails
    AuthStorage.clearAuth()
    router.push('/login')
    toast.success('Logged out successfully')
  }
}

const fetchUserData = async () => {
  try {
    const token = AuthStorage.getItem('token')
    const roleId = AuthStorage.getItem('role_id')
    const name = AuthStorage.getItem('user_name')
    
    if (token && roleId) {
      userRole.value = parseInt(roleId)
      userName.value = name || 'User'
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #64748b;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Dropdown animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Badge animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
