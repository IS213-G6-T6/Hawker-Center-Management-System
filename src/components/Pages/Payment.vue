<script lang="ts">
import NavBar from '../Reusables/NavBar.vue'
import ReviewCard from '../Reusables/ReviewCard.vue'
import { defineComponent, PropType } from 'vue'
import { Business, MenuFields } from '../../types/types'
import { FirebaseService } from '../../services/firebaseService'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper'
import 'swiper/swiper.min.css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useToast } from 'vue-toastification'
import firebase from 'firebase/compat/app'
import MenuModal from '../Reusables/MenuModal.vue'

SwiperCore.use([Navigation, Pagination, A11y])
const firebaseService = new FirebaseService()
const toast = useToast()

export default defineComponent({
    name: 'Payment',
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
            menuData: null as Business[] | null,
            menuVisible: false as boolean,
            cart: [],
            isCartEmpty: true as boolean,
            totalAmount: 0,
        }
    },
    beforeMount() {
        this.getDataByID(this.business_id)
        this.getCart()
            .then((cart)=>{
                this.cart = cart
                if(this.cart && Object.keys(this.cart).length != 0){
                    this.isCartEmpty = false
                    for (let item in this.cart){
                        this.totalAmount += this.cart[item]['qty'] * this.cart[item]['price']
                    }
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        // const cart = JSON.parse(this.$route.query.cart);
    },
    mounted() {
        // const { search } = window.location
        // const updated = new URLSearchParams(search).get('updated')
        // if (updated === '1') {
        //     toast.success('Review added successfully.', { timeout: 5000 })
        // }
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
        },
        getCart: async function (): Promise<any> {
            return new Promise((resolve, reject) => {
                try {
                const urlParams = new URLSearchParams(window.location.search);
                const cartQueryParam = urlParams.get('cart');
                if (!cartQueryParam) {
                    reject(new Error('Cart query parameter is missing'));
                }
                const decodedCartQueryParam = decodeURIComponent(cartQueryParam);
                const cart = JSON.parse(decodedCartQueryParam);
                resolve(cart);
                } catch (error) {
                reject(error);
                }
            });
        },
        showMenu(): void {
            this.menuVisible = true
        },
        closeMenu(): void {
            this.menuVisible = false
        },
        menuData(menuFields: MenuFields): void {
            // filter by mode
            this.menuData = this.businessData
            if (menuFields.mode !== '') {
                this.menuData = this.menuData.filter(
                    (business: Business) => {
                        return business.mode == menuFields.mode
                    }
                )
            }

            // filter by price
            if (menuFields.price !== 0) {
                this.menuData = this.menuData.filter(
                    (business: Business) => {
                        return business.pricerange == menuFields.price
                    }
                )
            }

            // filter by rating
            if (menuFields.rating !== '') {
                this.menuData = this.menuData.filter(
                    (business: Business) => {
                        if (business.ratings) {
                            let sum = 0
                            // get the average ratings
                            for (const index in business.ratings) {
                                sum += business.ratings[index].ratingscore
                            }
                            const avg =
                                sum / Object.keys(business.ratings).length

                            return avg >= Number(menuFields.rating)
                        }
                    }
                )
            }
        },
    },
    components: { NavBar, Swiper, SwiperSlide, ReviewCard, MenuModal },
})
</script>

<template>
    <div :class="{ dark: this.$store.getters.getDarkMode }">
        <NavBar></NavBar>
        <div class="bg-white dark:bg-slate-900 h-screen text-gray-500">
            <div v-if="!isCartEmpty" class="flex flex-col md:flex-row pb-10 md:gap-12 px-5 md:px-10 lg:px-14 bg-white dark:bg-slate-900">
                
                <!-- display cart -->
                <div class="w-full md:w-3/4 flex flex-col items-start">
                    <div class="pl-12">
                        <div><p class="font-bold text-xl text-left">Your Cart</p></div>
                        <div><p class="font-bold text-md text-left">{{ this.businessData['name'] }}</p></div>
                    </div>
                    <div class="px-12 pt-4 grid grid-cols-4">
                        <div class="col-span-1 rounded-lg border-2 border-gray-200 px-6 pt-6 mx-2" v-for="item in Object.keys(this.cart)">
                            <div class="w-full md:w-auto">
                                <img :src="this.cart[item].image" class="object-cover w-[20rem] h-[16rem] rounded-lg">
                            </div>
                            <div class="w-full md:w-auto pt-3">
                                    {{ item }}
                            </div>
                            <div class="w-full md:w-auto pt-3">
                                    Quantity: {{ this.cart[item].qty }}
                            </div>
                            <div class="w-full md:w-auto p-3">
                                    Price: ${{ this.cart[item].price }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- display payment details entry -->
                <div class="w-full md:relative md:block md:w-1/4 md:ml-4">

                    <div class="relative p-6 flex-auto">
                        <div class="space-y-4 md:space-y-6">
                            <div>
                                <label
                                    for="email"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                    >Your email</label
                                >
                                <input
                                    id="email2"
                                    v-model="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com" />
                            </div>
                            <div>
                                <label
                                    for="password2"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                    >Password</label
                                >
                                <input
                                    type="password"
                                    name="password"
                                    v-model="password"
                                    id="password"
                                    placeholder="••••••••"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <button
                                @click="loginUser()"
                                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-5 rounded w-full">
                                Checkout - ${{ this.totalAmount }}
                            </button>
                            <section id="firebaseui-auth-container"></section>
                        </div>
                    </div>

                </div>

            </div>

            <div v-else>
                Cart is empty!
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


