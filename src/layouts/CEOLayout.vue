<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-900">
    <!-- CEO Sidebar -->
    <CEOSideBar />
    
    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import CEOSideBar from '@/layouts/Partials/CEOSideBar.vue';
</script>

<style scoped>
/* Custom scrollbar for main content */
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
</style>
