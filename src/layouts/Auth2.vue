<template>
    <div class="flex h-screen bg-white">
        <!-- Tender Sidebar -->
        <div class="hidden lg:block w-60 flex-shrink-0">
            <TendersSideBar />
        </div>
        <MobileSidebar2 />

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Mobile top bar (hamburger only) -->
            <div class="lg:hidden flex items-center h-12 px-4 border-b border-gray-100 bg-white flex-shrink-0">
                <button @click="setSidebar('mobile')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-bars text-lg"></i>
                </button>
            </div>
            <main class="flex-1 overflow-y-auto main-scroll">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import TendersSideBar from '@layouts/Partials/TendersSideBar.vue'
import MobileSidebar2 from '@layouts/Partials/MobileSidebar2.vue'

const store = useStore()
const setSidebar = (val) => store.dispatch('setSidebar', val)
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