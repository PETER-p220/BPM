<template>
  <div class="flex h-screen bg-white">
    <!-- CEO Sidebar -->
    <div class="w-60 flex-shrink-0">
      <CEOSideBar />
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto main-scroll">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import CEOSideBar from '@/layouts/Partials/CEOSideBar.vue';
</script>

<style scoped>
.main-scroll::-webkit-scrollbar {
  width: 6px;
}
.main-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.04);
}
.main-scroll::-webkit-scrollbar-thumb {
  background: rgba(30, 77, 142, 0.18);
  border-radius: 3px;
}
.main-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 77, 142, 0.28);
}
</style>
