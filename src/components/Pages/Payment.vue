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
import axios from 'axios'


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
                // console.log(this.cart)
                if(this.isCartEmpty && this.cart && Object.keys(this.cart).length != 0){
                    this.isCartEmpty = false
                    // console.log(this.isCartEmpty)
                    for (let item in this.cart){
                        // console.log(this.cart[item]['qty'])
                        // console.log(this.cart[item]['price'])
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

        // window.onload = function() {
        //     let script = document.createElement('script')
        //     script.src = 'https://unpkg.com/axios/dist/axios.min.js'
        //     document.body.appendChild(script)
        //     script = document.createElement('script')
        //     script.src = 'https://js.stripe.com/v2/'
        //     document.body.appendChild(script)
        // }

        // let recaptchaScript = document.createElement('script')
        // recaptchaScript.setAttribute('src', 'https://unpkg.com/axios/dist/axios.min.js')
        // document.body.appendChild(recaptchaScript)
        // recaptchaScript = document.createElement('script')
        // recaptchaScript.setAttribute('src', 'https://js.stripe.com/v2/')
        // document.body.appendChild(recaptchaScript)

        // window.onload = function() {
            // const axios = require('axios')
            axios.get('https://unpkg.com/axios/dist/axios.min.js')
            axios.get('https://js.stripe.com/v2/')

            const form = document.getElementById('product-form').querySelector('button[type="submit"]');
            // console.log(form)
            form.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('Click event listener activated')
            //   const name = document.getElementById('name').value;
            //   const price = document.getElementById('price').value;
            //   const quantity = document.getElementById('quantity').value;

            //   const data = {
            //     name: name,
            //     price: price * 100,
            //     quantity: quantity,
            //     orderID: "2"
            //   };

            const data = {
                "customerID": "10",
                "customer_name": "q",
                "hawkerID":"1",
                "phone_no": "9420000",
                "total_price": "100.00",
                "status": "testing",
                "order_items": [
                {
                    "item_name": "rice",
                    "itemID": 9,
                    "quantity": 100
                },
                {
                    "item_name": "fish",
                    "itemID": 10,
                    "quantity": 200
                }
                ]
            };

            // const data = {
            //     "orderID": "10",
            //     "name": "10",
            //     "price": 100.00,
            //     "quantity": 2
            // };

            axios.post('http://localhost:5100/placeOrder', data)
                .then(response => {
                    // console.log("axios post success")
                    // console.log("Response data",response.data)
                    // console.log("Data",data)
                    window.open(response.data.url)
                    // window.location.href = response.data.url;
                })
                .catch(error => {
                    console.error(error);
                });
            });
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
            <div v-show="!isCartEmpty" class="flex flex-col md:flex-row pb-10 md:gap-12 px-5 md:px-10 lg:px-14 bg-white dark:bg-slate-900">
                
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
                        <div class="space-y-4 md:space-y-6" id="product-form">
                            <button
                                type = "submit"
                                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-5 rounded w-full">
                                Checkout - ${{ this.totalAmount }}
                            </button>
                            <section id="firebaseui-auth-container"></section>
                        </div>
                    </div>

                </div>

            </div>

            <div v-show="isCartEmpty">
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

