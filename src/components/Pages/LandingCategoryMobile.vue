<script lang="ts">
import { Category } from '../../types/types'

export default {
    name: 'LandingCategory',
    data() {
        return {
            categories: [
                { name: 'services', url: '/assets/services.jpg' },
                { name: 'fnb', url: '/assets/f&b.jpg' },
                { name: 'fashion', url: '/assets/fashion.jpg' },
                { name: 'crafts', url: '/assets/crafts.jpg' },
                { name: 'experiences', url: '/assets/experiences.jpeg' },
            ] as Category[],
            darkmode: false as boolean,
        }
    },
    methods: {
        routePage(): void {
            this.$router.push('/Home')
        },
        toggleMode(): void {
            this.darkmode = !this.darkmode
        },
    },
}
</script>

<template>
    <div :class="{ dark: darkmode }">
        <div
            class="bg-white border-gray-200 w-full py-2 px-5 dark:bg-slate-900">
            <div class="container flex flex-wrap justify-between mx-auto">
                <div class="flex items-center md:px-3">
                    <a>
                        <img
                            src="/assets/logo.png"
                            class="mr-3 h-6 sm:h-9"
                            alt="BigRedDot Logo" />
                    </a>
                    <h1
                        class="text-xl font-semibold whitespace-nowrap text-gray-500 dark:text-white">
                        Category
                    </h1>
                </div>
                <button
                    id="mode_button"
                    class="bg-transparent p-0"
                    @click="toggleMode()">
                    <img
                        :style="[
                            darkmode
                                ? {
                                      filter: 'brightness(0) saturate(100%) invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                                  }
                                : { filter: 'none' },
                        ]"
                        class="w-5 h-5 block md:hidden"
                        src="/assets/dark_mode.svg" />
                </button>
            </div>
        </div>
        <div
            class="bg-white px-5 py-4 h-screen w-full flex flex-col items-center dark:bg-slate-900">
            <div class="grid grid-cols-2 gap-6 dark:bg-slate-900">
                <div
                    v-for="n in 5"
                    class="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <button
                        @click="
                            this.$store.dispatch(
                                'commitCat',
                                categories[n - 1].name
                            ),
                                routePage()
                        ">
                        <img
                            class="rounded-t-lg max-h-[150px]"
                            :src="categories[n - 1].url" />
                        <p
                            class="text-lg p-2 font-semibold tracking-tight text-gray-700 dark:text-white">
                            {{ categories[n - 1].name }}
                        </p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
button {
    all: unset;
}
</style>
