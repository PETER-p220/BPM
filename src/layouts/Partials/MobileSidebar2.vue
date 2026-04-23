<template>
    <div v-if="sidebar == 'mobile'" class="fixed inset-0 flex z-40 lg:hidden">
        <div class="fixed inset-0 bg-black/50" @click="setSidebar('full')"></div>
        <div class="relative w-60 flex flex-col" style="z-index:1;">
            <button class="absolute top-4 right-4 text-white/50 hover:text-white z-10" @click="setSidebar('full')">
                <i class="fas fa-times text-lg"></i>
            </button>
            <TendersSideBar></TendersSideBar>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MobileSidebar2'
}
</script>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"
import TendersSideBar from './TendersSideBar.vue'

const store = useStore()

const sidebar = computed(() => store.getters.getSidebar)

const setSidebar = (sidebar) => {
    store.dispatch('setSidebar', sidebar)
}
</script>