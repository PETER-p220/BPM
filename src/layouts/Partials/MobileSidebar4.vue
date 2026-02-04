<template>
    <div v-if="sidebar == 'mobile'" class="fixed inset-0 z-40 flex lg:hidden">
        <div class="relative py-3 bg-white border-r w-72 dark:bg-dark-header dark:text-gray-400 border-primary dark:border-gray-700">
            <i class="absolute top-6 right-6 fas fa-times" @click="setSidebar('full')"></i>
            <img
                class="w-auto h-10 px-4"
               src="../../assets/images/logo.png"
                alt="logo"
            />
            <div class="flex-1 h-0 mt-5">
                <nav>
                    <div class="space-y-1">
                        <AccoutantSideBar></AccoutantSideBar>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MobileSidebar4'
}
</script>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"

const store = useStore()

const sidebar = computed(() => store.getters.getSidebar)

const setSidebar = (sidebar) => {
    store.dispatch('setSidebar', sidebar)
}
</script>