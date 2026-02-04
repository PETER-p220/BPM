<template>
    <div v-if="sidebar === 'mobile'" class="fixed inset-0 flex z-40 lg:hidden">
      <div class="relative w-72 py-3 bg-white dark:bg-dark-header dark:text-gray-400 border-r border-primary dark:border-gray-700">
        <i class="absolute top-6 right-6 fas fa-times" @click="toggleSidebar"></i>
        <img
          class="px-4 h-10 w-auto"
          src="../../assets/images/logo.png"
          alt="logo"
        />
        <div class="mt-5 flex-1 h-0">
          <nav>
            <div class="space-y-1">
              <AppNavigation1></AppNavigation1>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  import { useStore } from "vuex";
  import AppNavigation1 from "./AppNavigation1.vue";
  
  // Access Vuex store
  const store = useStore();
  
  // Get the sidebar state from Vuex
  const sidebar = computed(() => store.getters.getSidebar);
  
  // Toggle the sidebar state between 'mobile' and 'full'
  const toggleSidebar = () => {
    const newSidebarState = sidebar.value === 'mobile' ? 'full' : 'mobile';
    store.dispatch('setSidebar', newSidebarState);
  };
  </script>
  