<template>
  <div class="profile">
    <Menu>
      <MenuButton class="inline-flex items-center justify-center">
        <img class="w-8 h-8 rounded-full" src="../../assets/male.png" alt="Profile" />
      </MenuButton>

      <MenuItems
        class="absolute right-0 z-20 w-48 mx-2 mt-1 overflow-hidden bg-white divide-y divide-gray-200 rounded-md top-12 dark:bg-dark-header dark:border dark:border-gray-700 dark:divide-gray-600"
      >
        <router-link :to="profileRoute">
          <MenuItem v-slot="{ active }">
            <div
              class="px-4 py-2 text-sm cursor-pointer"
              :class="{
                'bg-gray-100 text-gray-900 dark:bg-dark-body dark:text-gray-400': active,
                'text-gray-700 dark:text-gray-300': !active,
              }"
            >
              User Profile
            </div>
          </MenuItem>
        </router-link>

        <MenuItem v-slot="{ active }">
          <div
            @click="logout"
            class="px-4 py-2 text-sm cursor-pointer"
            :class="{
              'bg-gray-100 text-gray-900 dark:bg-dark-body dark:text-gray-400': active,
              'text-gray-700 dark:text-gray-300': !active,
            }"
          >
            Logout
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useRouter } from "vue-router";
import axios from "../../axios";

const router = useRouter();

// Role-to-profile-route mapping (matches role_ids in route.js)
const profileRoutes = {
  1: '/userprofile',          // Admin
  2: '/hod/profile',          // HOD
  3: '/userprofile',          // User
  4: '/tendersprofile',       // Tenders
  5: '/accntant/profile',     // Accountant
  6: '/hr/profile',           // HR
  7: '/ceo/profile',          // CEO
};

const profileRoute = computed(() => {
  const roleId = parseInt(localStorage.getItem('role_id'));
  return profileRoutes[roleId] ?? '/userprofile';
});

const logout = async () => {
  try {
    await axios.post('api/auth/logout', {});
    localStorage.removeItem('token');
    localStorage.removeItem('role_id');
    router.push('/');
  } catch (error) {
    console.error("Logout failed:", error.response ? error.response.data : error.message);
  }
};
</script>