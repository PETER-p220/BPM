<template>
    <div class="relative flex justify-between h-16 shrink-0" style="background-color: white; font-family: 'Trirong', sans-serif;box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;">
        <div class="flex items-center space-x-4">
            <div class="flex items-center">
            </div>
            <i class="text-gray-500 fas fa-bars lg:hidden dark:text-gray-300" @click="setSidebar('mobile')"></i>
        </div>
        <div class="flex items-center justify-between px-4 space-x-4">
            <i class="text-white cursor-pointer fas fa-sun" v-if="display == 'dark'" @click="setDisplay('light')"></i>
            <i class="text-white cursor-pointer fas fa-moon" v-if="display == 'light'" @click="setDisplay('dark')"></i>
            <div class="flex items-center">
                <ProfileDropdown4 />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppHeader4'
}
</script>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"

const store = useStore()

const display = computed(() => store.getters.getDisplay)

const setDisplay = (display) => {
    store.dispatch('setDisplay', display)
}

const setSidebar = (sidebar) => {
    store.dispatch('setSidebar', sidebar)
}
</script>
