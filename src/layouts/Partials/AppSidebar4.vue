<template>
  <aside class="flex-shrink-0">
    <div class="hidden lg:block w-60 h-full">
      <AccoutantSideBar />
    </div>
    <MobileSidebar4 class="lg:hidden" />
  </aside>
</template>

<script setup>
import AccoutantSideBar from './AccoutantSideBar.vue'
import MobileSidebar4 from './MobileSidebar4.vue'
</script>