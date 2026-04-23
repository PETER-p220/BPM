<template>
  <div class="flex h-screen bg-white">
    <AppSidebar4 />
    <main class="flex-1 overflow-y-auto acc-main-scroll">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppSidebar4 from '@/layouts/Partials/AppSidebar4.vue'
</script>

<style scoped>
.acc-main-scroll::-webkit-scrollbar {
  width: 6px;
}
.acc-main-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.04);
}
.acc-main-scroll::-webkit-scrollbar-thumb {
  background: rgba(30, 77, 142, 0.18);
  border-radius: 3px;
}
.acc-main-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 77, 142, 0.28);
}
</style>