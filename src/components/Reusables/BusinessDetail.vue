<script lang="ts">
import NavBar from './NavBar.vue'
import ReviewCard from './ReviewCard.vue'
import { defineComponent, PropType } from 'vue'
import { Business } from '../../types/types'
import { FirebaseService } from '../../services/firebaseService'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useToast } from 'vue-toastification'
import firebase from 'firebase/compat/app'

SwiperCore.use([Navigation, Pagination, A11y])
const firebaseService = new FirebaseService()
const toast = useToast()

export default defineComponent({
    name: 'BusinessDetail',
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
            ],
            social: [
                { name: 'facebook', url: '/assets/facebookIcon.svg' },
                { name: 'instagram', url: '/assets/instagramIcon.svg' },
                { name: 'phone', url: '/assets/phoneIcon.svg' },
                { name: 'website', url: '/assets/webIcon.svg' },
            ],
            star_false: '/assets/star_empty.svg',
            star_true: '/assets/star2.svg',
            user_rating: [0, 1, 2, 3, 4],
            disabled: [true, true, true, true, true],
            temp_value: null,
            value: null,
            disable_func: false,
            final_value: 0,
            final_review: '',
            rating_obj: { 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 },
            rating_sum: 0,
            error: false,
        }
    },
    beforeMount() {
        this.getDataByID(this.business_id)
    },
    mounted() {
        const { search } = window.location
        const updated = new URLSearchParams(search).get('updated')
        if (updated === '1') {
            toast.success('Review added successfully.', { timeout: 5000 })
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters.getUser
        },
    },
    methods: {
        getDataByID: async function (business_id: String): Promise<void> {
            this.businessData = await firebaseService.getDataByID(
                Number(business_id)
            )

            if (Object.keys(this.businessData.ratings).length > 0) {
                this.getRating()
                this.findSum()
            }
        },
        findPercentage(input): string {
            var percent = (input / this.rating_sum) * 100
            return 'width: ' + percent + '%'
        },
        findSum() {
            for (let [key, value] of Object.entries(this.rating_obj)) {
                this.rating_sum += value
            }
        },
        star_over(index) {
            if (!this.disable_func) {
                this.temp_value = this.value
                for (var i = 0; i < index + 1; i++) {
                    if (this.disabled[i] == true) {
                        this.disabled[i] = false
                    }
                }
                return (this.value = index)
            }
        },
        star_out() {
            if (!this.disable_func) {
                for (var i = 0; i < this.value + 1; i++) {
                    if (this.disabled[i] == false) {
                        this.disabled[i] = true
                    }
                }
                return (this.value = this.temp_value)
            }
        },
        set(value) {
            if (!this.disable_func) {
                this.temp_value = value
                for (var i = 0; i < this.value + 1; i++) {
                    this.disabled[i] = false
                }
                this.disable_func = true
                this.final_value = value
                return (this.value = value)
            } else {
                this.disable_func = false
                this.final_value = 0
            }
        },
        getRating() {
            for (let value of Object.values(this.businessData.ratings)) {
                this.rating_obj[value['ratingscore'] - 1] += 1
            }
        },
        submitRating() {
            if (!this.isLoggedIn) {
                this.error = true
            } else {
                this.error = false
                const user = firebase.auth().currentUser
                user.getIdToken()
                    .then((token) => {
                        firebaseService.updateRating(
                        this.business_id - 1,
                        user.uid,
                        user.displayName,
                        this.final_value + 1,
                        this.final_review,
                        Date.now(),
                        token
                        )
                    })
            }
        },
    },
    components: { NavBar, Swiper, SwiperSlide, ReviewCard },
})
</script>

<template>
    <div :class="{ dark: this.$store.getters.getDarkMode }">
        <NavBar></NavBar>
        <div class="bg-white dark:bg-slate-900 h-screen">
            <div>
                <div class="hidden md:block pt-4 px-10 lg:px-14">
                    <div class="grid grid-cols-1 md:gap-6 md:grid-cols-2">
                        <div>
                            <img
                                class="rounded-xl object-cover w-full max-h-[26rem]"
                                :src="businessData.images[4]" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <div
                                v-bind:style="{
                                    backgroundImage:
                                        'url(' + businessData.images[3] + ')',
                                }"
                                class="h-full rounded-xl bg-cover bg-center"></div>
                            <div
                                :style="{
                                    backgroundImage:
                                        'url(' + businessData.images[2] + ')',
                                }"
                                class="h-full rounded-xl mt-4 bg-cover bg-center"></div>
                        </div>
                    </div>
                </div>
                <div class="block md:hidden">
                    <swiper
                        :slides-per-view="1"
                        :space-between="30"
                        :pagination="{ clickable: true } as any"
                        class="default-slider">
                        <swiper-slide v-for="index in 5" :key="index">
                            <img
                                class="object-cover w-screen max-h-72"
                                :src="businessData.images[5 - index]" />
                            <div class="swiper-pagination"></div></swiper-slide
                    ></swiper>
                </div>
            </div>
            <!-- Name + Desc -->
            <div
                class="flex flex-col md:flex-row mt-6 pb-10 md:gap-12 px-5 md:px-10 lg:px-14 bg-white dark:bg-slate-900">
                <div class="w-full md:w-3/4 flex flex-col items-start">
                    <h1
                        class="text-gray-900 dark:text-white transition duration-500 ease font-bold text-2xl lg:text-4xl pb-2">
                        {{ businessData.name }}
                    </h1>
                    <div
                        class="text-gray-900 dark:text-white transition duration-500 ease text-sm border-b pb-4 w-full lg:text-lg text-left">
                        {{ businessData.description }}
                    </div>
                    <!-- Extra information -->
                    <div class="w-full">
                        <div class="pt-4 flex items-center">
                            <img
                                :style="[
                                    this.$store.getters.getDarkMode
                                        ? {
                                              filter: 'invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                                          }
                                        : { filter: 'none' },
                                ]"
                                class="w-[35px]"
                                src="/assets/categoryIcon.svg" />
                            <div
                                class="pl-4 text-gray-900 dark:text-white transition duration-500 ease font-semibold">
                                {{ businessData.mode }}
                            </div>
                        </div>
                        <div class="pt-4 flex items-center">
                            <img
                                :style="[
                                    this.$store.getters.getDarkMode
                                        ? {
                                              filter: 'invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                                          }
                                        : { filter: 'none' },
                                ]"
                                class="w-[35px] bg-transparent"
                                src="/assets/productIcon.svg" />
                            <div
                                class="pl-4 text-gray-900 dark:text-white transition duration-500 ease font-semibold">
                                {{ businessData.products }}
                            </div>
                        </div>
                        <div class="pt-4 pb-4 border-b flex items-center">
                            <img
                                :style="[
                                    this.$store.getters.getDarkMode
                                        ? {
                                              filter: 'invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                                          }
                                        : { filter: 'none' },
                                ]"
                                class="w-[35px]"
                                src="/assets/priceIcon.svg" />
                            <div
                                class="pl-4 text-gray-900 dark:text-white transition duration-500 ease font-semibold"
                                v-if="businessData.pricerange == 3">
                                $100 to $1000
                            </div>
                            <div
                                class="pl-4 text-gray-900 dark:text-white transition duration-500 ease font-semibold"
                                v-if="businessData.pricerange == 2">
                                $10 to $100
                            </div>
                            <div
                                class="pl-4 text-gray-900 dark:text-white transition duration-500 ease font-semibold"
                                v-if="businessData.pricerange == 1">
                                $0 to $10
                            </div>
                        </div>
                        <!-- Ratings -->
                        <div
                            v-if="businessData.ratings !== undefined"
                            class="pt-4 pb-4 border-b">
                            <div class="flex flex-col md:flex-row">
                                <div
                                    class="flex flex-col justify-center items-baseline md:items-center pb-4 md:pb-0">
                                    <div class="flex">
                                        <img
                                            class="w-[35px]"
                                            src="/assets/star2.svg" />
                                        <h1
                                            class="pl-4 md:pl-4 text-gray-900 dark:text-white transition duration-500 ease text-2xl font-semibold flex">
                                            Overall Ratings
                                        </h1>
                                    </div>
                                </div>
                                <div class="md:pl-10 lg:pl-24 w-full">
                                    <div
                                        v-for="index in 5"
                                        class="relative mb-2 flex pt-1 items-center">
                                        <div
                                            class="flex mr-2 items-center justify-between">
                                            <div>
                                                <div
                                                    class="text-sm font-semibold flex items-center py-2 px-3 uppercase rounded-full text-amber-600 bg-amber-200">
                                                    <span class="pr-2"
                                                        >{{ 6 - index }}
                                                    </span>
                                                    <span
                                                        ><img
                                                            class="w-10 lg:w-5"
                                                            src="/assets/star.svg"
                                                    /></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="overflow-hidden flex w-full h-2 lg:h-3 mr-2 text-sm rounded-2xl bg-amber-200">
                                            <div
                                                :style="
                                                    findPercentage(
                                                        rating_obj[5 - index]
                                                    )
                                                "
                                                class="shadow-none flex w-full flex-col text-center rounded-2xl whitespace-nowrap text-white justify-center bg-amber-500"></div>
                                        </div>

                                        <div
                                            class="text-xs font-semibold inline-block text-amber-600">
                                            {{ rating_obj[5 - index] }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Reviews -->
                        <div class="flex text-left flex-col pt-4 pb-4">
                            <div v-if="businessData.ratings !== undefined">
                                <h1
                                    class="text-gray-900 dark:text-white transition duration-500 ease text-2xl font-semibold pb-4">
                                    Reviews ({{
                                        Object.keys(businessData.ratings)
                                            .length
                                    }})
                                </h1>
                                <ReviewCard
                                    :rating="businessData.ratings"></ReviewCard>
                            </div>
                            <div v-else>
                                <h1
                                    class="text-gray-900 dark:text-white transition duration-500 ease text-2xl font-semibold pb-4">
                                    No Reviews (yet)
                                </h1>
                            </div>

                            <div class="relative overflow-hidden mt-5">
                                <div
                                    class="w-full rounded-2xl border-2 border-gray-100 p-8">
                                    <div class="flex flex-col items-center">
                                        <h3
                                            class="text-gray-900 dark:text-white transition duration-500 ease max-w-2xl text-center text-2xl font-bold leading-tight sm:text-3xl md:text-4xl md:leading-tight"
                                            v-if="
                                                businessData.ratings ===
                                                undefined
                                            ">
                                            Be the first to leave a review!
                                        </h3>
                                        <h3
                                            class="text-gray-900 dark:text-white transition duration-500 ease max-w-2xl text-center text-2xl font-bold leading-tight sm:text-3xl md:text-4xl md:leading-tight"
                                            v-else>
                                            Leave your review now!
                                        </h3>
                                        <div class="flex items-center">
                                            <div class="flex items-center">
                                                <div
                                                    v-for="rating in user_rating"
                                                    class="star-rating">
                                                    <button
                                                        v-on:click="set(rating)"
                                                        v-on:mouseover="
                                                            star_over(rating)
                                                        "
                                                        v-on:mouseout="star_out"
                                                        :value="rating"
                                                        class="px-2 py-4 hover:border-transparent focus-visible:outline-none focus:outline-none bg-transparent cursor-pointer">
                                                        <img
                                                            v-if="
                                                                disabled[rating]
                                                            "
                                                            class="w-10 h-10"
                                                            :src="star_false" />
                                                        <img
                                                            v-else
                                                            class="w-10 h-10"
                                                            :src="star_true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="w-full flex flex-col items-end">
                                            <label
                                                for="large-input"
                                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 transition duration-500 ease"></label>
                                            <textarea
                                                v-model="final_review"
                                                placeholder="Leave your review"
                                                type="text"
                                                id="large-input"
                                                wrap="soft"
                                                class="block focus-visible:outline-0 mb-4 md:min-h-[8rem] p-4 w-full text-gray-900 transition duration-500 ease bg-gray-50 rounded-lg border border-gray-300 sm:text-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"></textarea>
                                            <div v-if="error"
                                                class="flex w-full mt-2 mb-4 text-sm text-red-700 rounded-lg"
                                                role="alert">
                                                <svg
                                                    aria-hidden="true"
                                                    class="flex-shrink-0 inline w-5 h-5 mr-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                <div>
                                                    Please sign up or sign in to leave a review!
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                class="w-full md:w-auto rounded bg-emerald-500 px-10 py-4 font-bold text-white"
                                                @click="submitRating">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:relative md:block md:w-1/4 md:ml-4">
                    <div
                        class="sticky top-12 md:max-w-sm rounded-2xl border overflow-hidden">
                        <div class="px-6 py-4">
                            <div
                                class="text-gray-900 dark:text-white text-base flex flex-col">
                                <div
                                    class="bg-sky-100 w-full rounded-full p-3 text-sm font-semibold text-gray-700 mb-4">
                                    Contacts
                                </div>
                                <div>
                                    <div
                                        v-for="elem in social"
                                        class="flex md:flex-col lg:flex-row items-center pb-4">
                                        <img
                                            class="w-[35px] mb-3 lg:mb-0"
                                            :src="elem.url" />
                                        <div
                                            v-if="
                                                businessData.socialmedia[
                                                    elem.name
                                                ] !== 'null'
                                            "
                                            class="text-xs text-left lg:text-sm pl-3 md:pl-0 lg:pl-3 break-all md:text-center lg:text-left text-gray-900 dark:text-white font-semibold">
                                            <a :href="businessData.socialmedia[elem.name]">{{
                                                businessData.socialmedia[
                                                    elem.name
                                                ]
                                            }}</a>
                                        </div>
                                        <div
                                            v-else
                                            class="text-xs text-left lg:text-sm pl-3 md:pl-0 lg:pl-3 break-all md:text-center lg:text-left text-gray-900 dark:text-white font-semibold">
                                            Not Stated
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.default-slider .swiper-slide {
    display: flex;
    height: unset !important;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 24px;
    font-weight: 700;
}
</style>
