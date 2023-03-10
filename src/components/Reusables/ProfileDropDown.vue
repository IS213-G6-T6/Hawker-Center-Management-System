<script lang="ts">

export default {
    name: "ProfileDropdown",
    props: {
        toggleProfile: Function,
        profile: Boolean,
        logout: Function,
    }
}

</script>

<template>
    <li class="w-full relative hidden md:block md:w-auto mb-1 mt-3 md:mt-0 md:mb-0">
        <div class="border rounded-2xl">
            <button
                id="profile_button"
                @click="toggleProfile()"
                data-collapse-toggle="navbar-default"
                type="button"
                class="mx-auto flex p-2 text-sm text-gray-500 rounded-lg dark:text-gray-400"
                aria-controls="navbar-default">
                <svg
                    class="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"></path>
                </svg>
                <img
                    :style="[
                        this.$store.getters.getDarkMode
                            ? {
                                  filter: 'brightness(0) saturate(100%) invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                              }
                            : { filter: 'none' },
                    ]"
                    class="ml-3"
                    src="/assets/profile.svg" />
            </button>
        </div>
        <div :class="profile ? 'block' : 'hidden'">
            <div
                class="absolute gap-5 flex flex-col z-50 right-0 mt-2 w-52 p-5 rounded-2xl bg-white shadow-[0_35px_60px_0px_rgba(0,0,0,0.3)]"
                aria-orientation="vertical"
                aria-labelledby="menu-button">
                <router-link to="/MyList">
                    <a
                        class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 d dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                        My Favourites
                    </a>
                </router-link>
                <router-link to="/Profile">
                    <a
                        class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                        Profile Settings
                    </a>
                </router-link>
                <button
                    @click="logout()"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-full md:w-auto">
                    Sign Out
                </button>
            </div>
        </div>
    </li>
</template>
