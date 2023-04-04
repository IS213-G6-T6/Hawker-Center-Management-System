<script lang="ts">
import { defineAsyncComponent } from 'vue'
import NavBar from '../Reusables/NavBar.vue'
import { Business, CategoryEnum } from '../../types/types'
import { FirebaseService } from '../../services/firebaseService'
import { Category } from '../../types/types'

const firebaseService = new FirebaseService()
const lazyPictureLoad = defineAsyncComponent(
    () => import('../Reusables/BusinessCard.vue')
)

export default {
    name: 'HomeHawker',
    data() {
        return {
            categories: [
                { name: 'Upcoming', url: '/assets/upcoming.svg' },
                { name: 'Completed', url: '/assets/completed.svg' },
            ] as Category[],
            CategoryEnum,
            businessData: null as Business[] | null,
            filteredData: null as Business[] | null,
            filterVisible: false as boolean,
            isCompletedVisible: false as boolean,
            isUpcomingVisible: true as boolean,
        }
    },
    beforeMount() {
        if (this.$store.getters.getCat != '') {
            this.getByCategory([CategoryEnum[this.$store.getters.getCat]])
        } else {
            this.getAllData()
        }
    },
    methods: {
        getAllData: async function (): Promise<void> {
            this.businessData = await firebaseService.getAll()
            this.filteredData = null
        },
        showUpcoming: function () {
            this.isUpcomingVisible = true
            this.isCompletedVisible = false
        },
        showCompleted: function () {
            this.isUpcomingVisible = false
            this.isCompletedVisible = true
        },
    },
    components: { NavBar, lazyPictureLoad },
}
</script>

<template>
    <div
        class="h-screen"
        :class="filterVisible ? 'overflow-y-hidden' : 'sm:overflow-y-auto'">
        <div :class="{ dark: this.$store.getters.getDarkMode }">
            <NavBar></NavBar>
            <div class="bg-[#d4e6ff] px-8 md:px-20 w-full flex justify-between">
                <div
                    class="container overflow-auto flex justify-evenly mx-auto">
                    <div>
                        <button
                            id="cat_button"
                            v-on:click="
                                showUpcoming()
                            "
                            class="bg-[#a4cafe00] mr-7 md:mr-0 flex flex-col items-center">
                            <img
                                id="icon"
                                src='/assets/upcoming.svg'
                                class="w-6 h-6 mb-2" />
                            <span class="text-xs text-gray-700 md:text-sm">Upcoming</span>
                        </button>
                    </div>
                    <div>
                        <button
                            id="cat_button"
                            v-on:click="
                                showCompleted()
                            "
                            class="bg-[#a4cafe00] mr-7 md:mr-0 flex flex-col items-center">
                            <img
                                id="icon"
                                src='/assets/completed.svg'
                                class="w-6 h-6 mb-2" />
                            <span class="text-xs text-gray-700 md:text-sm">Completed</span>
                        </button>
                    </div>

                </div>
            </div>
            <div
                class="bg-white px-8 md:px-20 py-8 w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 dark:bg-slate-900 text-black">
                <!-- <div v-if="filteredData" v-for="business of filteredData">
                    <lazyPictureLoad :data="business"></lazyPictureLoad>
                </div>
                <div v-else v-for="business of businessData">
                    <lazyPictureLoad :data="business"></lazyPictureLoad>
                </div> -->
                <div v-show="isUpcomingVisible">
                    <div>
                        <p>Test 1</p>
                        <p>Test 2</p>
                        <p>Test 3</p>
                    </div>
                </div>
                <div v-show="isCompletedVisible">
                    <div>
                        <p>Test 4</p>
                        <p>Test 5</p>
                        <p>Test 6</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#icon {
    min-width: 1.5rem !important;
    min-height: 1.5rem !important;
}

#cat_button {
    position: relative;
    border-radius: unset;
}

#cat_button:hover,
#filterBtn:hover {
    border-color: transparent;
}

#cat_button:focus,
#filterBtn:hover {
    outline: none;
}

#cat_button:focus:after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

#cat_button:after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #0087ca;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
}

#cat_button:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

#filterBtn:focus {
    border-color: transparent;
    outline: none;
}
</style>
