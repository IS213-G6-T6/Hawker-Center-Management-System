<script lang="ts">
import { PropType } from 'vue'
import { Business } from '../../types/types'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { UserService } from '../../services/userService'
import { FirebaseService } from '../../services/firebaseService'
import { useToast } from 'vue-toastification'

import firebase from 'firebase/compat/app'

SwiperCore.use([Navigation, Pagination, A11y])
const userService = new UserService()
const firebaseService = new FirebaseService()

const toast = useToast()

export default {
    name: 'BusinessCard',
    props: {
        data: Object as PropType<Business>,
        business_id: String,
    },
    data() {
        return {
            businessData: null as Business | null,
            cards: [
                '/assets/fashion.jpg',
                '/assets/services.jpg',
                '/assets/crafts.jpg',
            ] as string[],
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
            },
            bookmark_list: Object,
            rating: 0
        }
    },
    components: {
        Swiper,
        SwiperSlide,
    },
    computed: {
        imageSource(): string {
            if (this.$store.state.userBookmarks) {
                if (
                    Object.values(this.$store.state.userBookmarks).includes(
                        this.data.id
                    )
                ) {
                    return '/assets/confirm.svg'
                } else {
                    return '/assets/love.svg'
                }
            } else {
                return '/assets/love.svg'
            }
        },
    },
    created(){
        this.findSum()
    },
    methods: {
        addFav(): void {
            if (this.$store.getters.getUser) {
                const business_id = this.data.id
                var bookmarksArray: number[] = this.$store.state.userBookmarks
                const user = firebase.auth().currentUser

                if (bookmarksArray.includes(business_id)) {
                    // if it has been bookmarked
                    bookmarksArray.splice(bookmarksArray.indexOf(business_id), 1)
                    user.getIdToken()
                        .then((token) => {
                            userService.updateBookmarks(user.uid, bookmarksArray, 'remove', token)
                        })
                } else {
                    // if it is not already bookmarked
                    bookmarksArray.push(business_id)
                    user.getIdToken()
                        .then((token) => {
                            userService.updateBookmarks(user.uid, bookmarksArray, 'add', token)
                        })
                }
                // lazy method of updating, will improve if time permits
                this.$store.dispatch('commitUserBookmarks', bookmarksArray)
                } else {
                    toast.error("Please log in to bookmark businesses.", { timeout: 5000 })
                }
        },
        async findSum() {
            var indiv_business: Business = await this.getDataByID(this.data.id)
            var sum = 0
            var counter = 0

            if (indiv_business.ratings) {
                for (let [key, value] of Object.entries(indiv_business.ratings)) {
                    sum += value.ratingscore
                    counter ++
                }
                this.rating = (sum/counter).toFixed(2)
            } else {
                this.rating = '-'
            }
        },
        getDataByID: async function (
            business_id: String
        ): Promise<void | Business[]> {
            const res = await firebaseService.getDataByID(Number(business_id))
            return res
        },
    },
}
</script>

<template>
    <div
        class="md:max-w-xs h-full flex justify-center mx-auto bg-white rounded-2xl border-gray-20 dark:bg-slate-900">
        <a class="flex flex-col items-center">
            <div class="w-72 h-72 relative">
                <RouterLink
                    :to="{
                        name: 'BusinessDetail',
                        params: { business_id: this.data.id },
                    }">
                    <swiper
                        :slides-per-view="1"
                        :space-between="30"
                        :pagination="{ clickable: true } as any"
                        class="default-slider rounded-2xl">
                        <swiper-slide v-for="index in 3" :key="index">
                            <img
                                v-if="this.data.images !== undefined"
                                class="rounded-2xl object-cover w-[17rem] h-[17rem]"
                                :src="this.data.images[index - 1]" />
                            <div class="swiper-pagination"></div></swiper-slide
                    ></swiper>
                </RouterLink>
                <img
                    @click="addFav()"
                    class="absolute m-4 top-4 right-3 z-10 w-[28px]"
                    :src="imageSource" />
            </div>
            <RouterLink
                :to="{
                    name: 'BusinessDetail',
                    params: { business_id: this.data.id },
                }">
                <div class="flex flex-col">
                    <div class="py-5 px-5 flex flex-col">
                        <div
                            class="mb-4 flex justify-between text-l text-left font-bold tracking-tight transition duration-500 ease text-gray-900 dark:text-white">
                            <span>{{ this.data.name }}</span>
                            <div class="text-right flex items-center">
                                <img class="pr-2" src="/assets/star.svg" />
                                <span>{{ rating }}</span>
                                <div></div>
                            </div>
                        </div>
                        <div class="mb-4 text-left">
                            <div
                                class="inline py-1 mr-2 px-3 text-xs border-solid border-2 border-blue-400 rounded-2xl transition duration-500 ease text-gray-700 dark:text-white">
                                {{ this.data.category }}
                            </div>
                            <div
                                class="inline py-1 px-3 text-xs border-solid border-2 border-rose-300 rounded-2xl transition duration-500 ease text-gray-700 dark:text-white">
                                {{ this.data.mode }}
                            </div>
                        </div>
                        <div
                            class="text-left w-64 text-sm line-clamp-2 font-normal transition duration-500 ease text-gray-700 dark:text-gray-200">
                            {{ this.data.description }}
                        </div>
                    </div>
                </div>
            </RouterLink>
        </a>
    </div>
</template>

<style>
.default-slider .swiper-slide {
    display: flex;
    height: 300px !important;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 24px;
    font-weight: 700;
}
</style>
