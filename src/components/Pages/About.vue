<script lang="ts">
import NavBar from '../Reusables/NavBar.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination, A11y, Autoplay } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
SwiperCore.use([Navigation, Pagination, A11y, Autoplay])

interface ImageContent {
    url: string,
    title: string,
    desc: string,
}

export default {
    name: 'Home',
    setup() {
        onMounted(() => {
            gsap.to('.purpose', {
                scrollTrigger: '.purpose',
                y: 50,
                duration: 2,
            })
        })
    },
    data() {
        return {
            cards: [
                'https://static.thehoneycombers.com/wp-content/uploads/sites/2/2020/07/haji-lane-singapore-street.png',
                'https://upload.wikimedia.org/wikipedia/commons/6/6e/Temple_Street%2C_Singapore%2C_2014_%2803%29.JPG',
                'https://cdn01.vulcanpost.com/wp-uploads/2018/04/DSC00628.jpg',
            ] as string[],
            purposes: [
                { 
                    url: 'https://01kennyfyp.files.wordpress.com/2014/10/singaporean-cuisine-1.jpg', 
                    title: 'Variety', 
                    desc: 'Each local business has its own flair, and offers products that you will not see anywhere else!' 
                },
                { 
                    url: 'https://thehomeground.asia/wp-content/uploads/Souece-City-Developments-Limited_Featured-Image.jpg', 
                    title: 'Sustainability', 
                    desc: 'By shopping local, you reduce your reliance on the global supply chain, reducing your carbon emissions!' },
                { 
                    url: 'https://blog.transfez.com/wp-content/uploads/2022/07/21-Central-Business-District-Singapore-by-transfez.jpg', 
                    title: 'Economy', 
                    desc: 'Support your fellow Singaporeans in their businesses, and contribute to the local economy too!' },
            ] as ImageContent[],
        }
    },
    methods: {},
    components: { NavBar, Swiper, SwiperSlide },
}
</script>

<template>
    <div :class="{ dark: this.$store.getters.getDarkMode }">
        <NavBar></NavBar>
        <swiper
            :slides-per-view="1"
            :space-between="30"
            :autoplay="{'autoplay':true} as any"
            :pagination="{ clickable: true } as any"
            class="default-slider w-full md:h-screen relative">
            <swiper-slide v-for="card in cards" :key="card">
                <img class="object-cover w-full h-full" :src="card" />
                <div class="swiper-pagination"></div></swiper-slide
        ></swiper>
        <!-- Card component on carousel -->
        <div class="initial md:absolute bottom-28 left-20 z-10">
            <div class="md:max-w-sm w-full">
                <div
                    class="md:rounded-2xl bg-white p-6 flex flex-col justify-between leading-normal transition duration-500 ease dark:bg-slate-900">
                    <div class="mb-4">
                        <div
                            class="text-gray-900 dark:text-white transition duration-500 ease font-bold text-xl mb-2">
                            Support Singapore's local businesses
                        </div>
                        <p class="text-gray-700 dark:text-white transition duration-500 ease text-base">
                            Tired of the same old big chain stores, and the same old products? Why not shop #SGLocal? Find local businesses near you, offering unique and high-quality products and services that you will love!
                        </p>
                    </div>
                    <div class="flex items-center justify-evenly">
                        <router-link to="/Home">
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full">
                                Search for business
                            </button>
                        </router-link>
                        <button
                            onclick="(function() {window.location.href = '#purpose'})()"
                            class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Content - Purpose -->
        <div class="bg-white dark:bg-slate-900 overflow-auto h-screen pb-6 px-10 pt-2 lg:px-14">
            <div id="purpose" class="purpose">
                <h1
                    class="text-gray-900 dark:text-white transition duration-500 ease font-bold text-2xl lg:text-4xl pb-2">
                    Why #SGLocal?
                </h1>
                <div
                    class="text-gray-900 dark:text-white transition duration-500 ease text-sm w-full lg:text-lg pb-4">
                    Why you should start shopping local today!
                </div>
                <div class="flex flex-wrap justify-evenly gap-10 pb-6 md:pb-0">
                    <div v-for="purpose in purposes"
                        class="max-w-xs bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                        <img
                            class="rounded-t-lg object-cover"
                            :src="purpose.url"/>
                        <div class="p-5">
                            <a href="#">
                                <h5
                                    class="mb-2 text-2xl font-bold tracking-tight transition duration-500 ease text-gray-900 dark:text-white">
                                    {{purpose.title}}
                                </h5>
                            </a>
                            <p
                                class="mb-3 font-normal text-gray-700 transition duration-500 ease dark:text-gray-400">
                                {{purpose.desc}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media screen and (min-width: 700px) {
    .default-slider .swiper-slide {
        height: 100vh !important;
    }
}

.box {
    width: 50px;
    height: 50px;
    background: tomato;
}
</style>
