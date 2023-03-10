<script lang="ts">
import { defineAsyncComponent } from 'vue'
import NavBar from '../Reusables/NavBar.vue'
import { Business, CategoryEnum, FilterFields } from '../../types/types'
import { FirebaseService } from '../../services/firebaseService'
import FilterModal from '../Reusables/FilterModal.vue'
import { Category } from '../../types/types'

const firebaseService = new FirebaseService()
const lazyPictureLoad = defineAsyncComponent(
    () => import('../Reusables/BusinessCard.vue')
)

export default {
    name: 'Home',
    data() {
        return {
            categories: [
                { name: 'services', url: '/assets/services.svg' },
                { name: 'fnb', url: '/assets/f&b.svg' },
                { name: 'fashion', url: '/assets/fashion.svg' },
                { name: 'crafts', url: '/assets/crafts.svg' },
                { name: 'experiences', url: '/assets/experiences.svg' },
            ] as Category[],
            CategoryEnum,
            businessData: null as Business[] | null,
            filteredData: null as Business[] | null,
            filterVisible: false as boolean,
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
        getByCategory: async function (
            categories: CategoryEnum[]
        ): Promise<void> {
            this.businessData = await firebaseService.getDataByCategory(
                categories
            )
            this.filteredData = null
        },
        showFilter(): void {
            this.filterVisible = true
        },
        closeFilter(): void {
            this.filterVisible = false
        },
        filterData(filterFields: FilterFields): void {
            // filter by mode
            this.filteredData = this.businessData
            if (filterFields.mode !== '') {
                this.filteredData = this.filteredData.filter(
                    (business: Business) => {
                        return business.mode == filterFields.mode
                    }
                )
            }

            // filter by price
            if (filterFields.price !== 0) {
                this.filteredData = this.filteredData.filter(
                    (business: Business) => {
                        return business.pricerange == filterFields.price
                    }
                )
            }

            // filter by rating
            if (filterFields.rating !== '') {
                this.filteredData = this.filteredData.filter(
                    (business: Business) => {
                        if (business.ratings) {
                            let sum = 0
                            // get the average ratings
                            for (const index in business.ratings) {
                                sum += business.ratings[index].ratingscore
                            }
                            const avg =
                                sum / Object.keys(business.ratings).length

                            return avg >= Number(filterFields.rating)
                        }
                    }
                )
            }
        },
    },
    components: { NavBar, FilterModal, lazyPictureLoad },
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
                    class="container overflow-auto flex justify-between mx-auto">
                    <div>
                        <button
                            id="cat_button"
                            v-on:click="getAllData()"
                            class="bg-[#a4cafe00] mr-7 md:mr-0 flex flex-col items-center">
                            <img
                                id="icon"
                                class="w-6 h-6 mb-2"
                                src="/assets/all.svg" />
                            <span class="text-xs text-gray-700 md:text-sm">
                                all
                            </span>
                        </button>
                    </div>
                    <div v-for="category in categories">
                        <button
                            id="cat_button"
                            v-on:click="
                                getByCategory([CategoryEnum[category.name]])
                            "
                            class="bg-[#a4cafe00] mr-7 md:mr-0 flex flex-col items-center">
                            <img
                                id="icon"
                                :src="category.url"
                                class="w-6 h-6 mb-2" />
                            <span class="text-xs text-gray-700 md:text-sm">{{
                                category.name
                            }}</span>
                        </button>
                    </div>
                    <div>
                        <button
                            id="filterBtn"
                            @click="showFilter"
                            class="bg-[#a4cafe00] mr-7 md:mr-0 flex flex-col items-center h-full">
                            <img
                                class="w-6 h-6 my-auto max-w-none"
                                src="/assets/filter.svg" />
                        </button>
                    </div>
                </div>
            </div>
            <FilterModal
                @close="closeFilter"
                @filter-push="filterData"
                v-if="filterVisible"></FilterModal>
            <div
                :class="{
                    'h-screen': filteredData && filteredData.length <= 4 && filteredData.length > 0,
                }"
                class="bg-white px-8 md:px-20 py-8 w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 dark:bg-slate-900">
                <div v-if="filteredData" v-for="business of filteredData">
                    <lazyPictureLoad :data="business"></lazyPictureLoad>
                </div>
                <div v-else v-for="business of businessData">
                    <lazyPictureLoad :data="business"></lazyPictureLoad>
                </div>
            </div>
            <div class="bg-white dark:bg-slate-900 flex flex-col items-center h-screen" v-if="filteredData && filteredData.length == 0">
                <img
                    v-if="!this.$store.getters.getDarkMode"
                    class="max-w-[15rem] sm:max-w-none sm:min-w-[25rem]"
                    src="/assets/question_light.svg" />
                <img
                    v-else
                    class="max-w-[15rem] sm:max-w-none sm:min-w-[25rem]"
                    src="/assets/question_dark.svg" />
                <div class="font-bold mb-5 text-sm md:text-xl text-gray-700 dark:text-gray-200">
                    No search result. Please try again.
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
