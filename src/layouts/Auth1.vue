<template>
    <div class="relative flex h-screen overflow-hidden ">
        <AppSidebar1></AppSidebar1>

        <div class="flex flex-col flex-1 w-0 overflow-hidden">
            <AppHeader1></AppHeader1>

            <main class="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                <div class="space-y-4">
                    <router-view />
                </div>

                <FooterCredit />
            </main>
        </div>
    </div>
</template>

<script setup>
import FooterCredit from '@layouts/Partials/FooterCredit.vue'
</script>