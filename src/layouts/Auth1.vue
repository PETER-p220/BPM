<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0">
      <AppNavigation />
    </div>

    <!-- Main Content Area -->
    <main class="relative flex-1 overflow-y-auto focus:outline-none user-main-scroll" style="background:radial-gradient(circle at top right,rgba(48,120,221,0.06),transparent 22%),linear-gradient(180deg,#eff5fb 0%,#eaf1f8 100%);">
      <router-view />
      <FooterCredit />
    </main>
  </div>
</template>

<script setup>
import FooterCredit from '@layouts/Partials/FooterCredit.vue'
import AppNavigation from '@/layouts/Partials/AppNavigation.vue'
</script>

<style scoped>
.user-main-scroll::-webkit-scrollbar { width: 6px; }
.user-main-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.04); }
.user-main-scroll::-webkit-scrollbar-thumb { background: rgba(30,77,142,0.18); border-radius: 3px; }
.user-main-scroll::-webkit-scrollbar-thumb:hover { background: rgba(30,77,142,0.28); }
</style>