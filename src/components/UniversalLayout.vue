<template>
  <div class="relative flex h-screen overflow-hidden">
    <!-- Universal Sidebar -->
    <UniversalSidebar />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 w-0 overflow-hidden">
      <!-- Header Section -->
      <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <!-- Page Title -->
            <div class="flex items-center gap-3">
              <button
                @click="toggleMobileSidebar"
                class="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 class="text-xl font-semibold text-slate-900 dark:text-white">{{ pageTitle }}</h1>
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ pageSubtitle }}</p>
              </div>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-3">
              <!-- Notifications -->
              <button class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 relative">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- Theme Toggle -->
              <button
                @click="toggleTheme"
                class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg v-if="!isDark" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>

              <!-- Search -->
              <div class="hidden md:flex items-center">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    class="w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="relative z-0 flex-1 overflow-y-auto focus:outline-none">
        <div class="p-4 sm:p-6 lg:p-8">
          <router-view />
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <div>
              © {{ new Date().getFullYear() }} Business Process Management System. All rights reserved.
            </div>
            <div class="flex items-center gap-4 mt-2 sm:mt-0">
              <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Help</a>
              <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="mobileSidebarOpen"
      @click="toggleMobileSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import UniversalSidebar from './UniversalSidebar.vue'

const route = useRoute()
const mobileSidebarOpen = ref(false)
const isDark = ref(false)

// Computed properties
const pageTitle = computed(() => {
  return route.meta?.title || route.name?.replace(/([A-Z])/g, ' $1').trim() || 'Dashboard'
})

const pageSubtitle = computed(() => {
  return route.meta?.subtitle || ''
})

// Methods
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Here you would implement actual theme switching logic
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Initialize theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)
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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Mobile sidebar animation */
@media (max-width: 1023px) {
  .fixed.inset-0 {
    transition: opacity 0.3s ease-in-out;
  }
}
</style>
