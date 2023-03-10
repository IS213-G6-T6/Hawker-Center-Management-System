<script lang="ts">
import NavBar from '../Reusables/NavBar.vue'

export default {
    name: 'Profile',
    components: { NavBar },
    data() {
        return {
            user: Object,
        }
    },
    beforeMount() {
        this.user = this.$store.getters.getUser
    },
}
</script>

<template>
    <NavBar></NavBar>
    <div
        class="dark:bg-slate-900"
        :class="{ dark: this.$store.getters.getDarkMode }">
        <div
            class="bg-[url('/assets/profilebg.png')] min-h-screen grid place-items-center px-5 bg-slate-100 dark:bg-slate-900">
            <div class="bg-white rounded-2xl dark:bg-gray-800 shadow-lg my-16 md:my-0">
                <div class="md:flex px-4 leading-none max-w-5xl">
                    <div class="flex-none md:pr-2">
                        <img
                            src="/assets/bp.jpg"
                            alt="pic"
                            class="w-full md:w-72 h-80 object-cover rounded-md shadow-2xl transform -translate-y-4 border-4 border-gray-300" />
                    </div>

                    <div class="flex flex-col text-gray-700 dark:text-gray-300">
                        <p class="pt-4 pb-4 text-2xl font-bold">
                            {{ user['displayName'] }}
                        </p>
                        <hr class="hr-text" data-content="" />
                        <div class="text-md flex justify-between px-4 my-2">
                            <span class="pt-4 font-bold">About</span>
                        </div>
                        <p class="px-4 py-2 text-sm text-left">
                            There is fun and practical purpose to shopping
                            local. So when you have the chance to choose between
                            the local business and a big superstore, go with
                            local option for the reasons that we’ve talked about
                            and you’ll see soon enough that it is going to be
                            the right choice for you and your community’s
                            future.
                        </p>
                        <div class="text-md flex justify-between px-4 my-2">
                            <span class="font-bold">Email</span>
                        </div>
                        <p class="px-4 py-2 text-sm text-left">
                            {{ user['email'] }}
                        </p>
                        <RouterLink to="/MyList">
                            <button
                                type="button"
                                class="w-full border mb-4 border-gray-400 text-gray-700 dark:text-gray-400 rounded-md px-4 py-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline">
                                BOOKMARKED BUSINESSES
                        </button>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
