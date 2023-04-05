<script lang="ts">
import { defineAsyncComponent } from 'vue'
import NavBar from '../Reusables/NavBar.vue'
import { Business, CategoryEnum } from '../../types/types'
import { FirebaseService } from '../../services/firebaseService'
import { Category } from '../../types/types'
import axios from 'axios'

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
            orders: null
        }
    },
    beforeMount() {
        if (this.$store.getters.getCat != '') {
            this.getByCategory([CategoryEnum[this.$store.getters.getCat]])
        } else {
            this.getAllData()
        }
        axios.get('https://unpkg.com/axios/dist/axios.min.js')
        axios.get('https://js.stripe.com/v2/')
        this.fetchOrders()
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
        fetchOrders: async function(): Promise<void> {
            try {
                const response = await axios.get('http://localhost:5000/order/hawker/0')
                this.orders = response.data.data.orders
                console.log(this.orders)
            } catch (error) {
                console.error(error)
            }
        },
        rejectOrder: async function(): Promise<void> {
            try {
                const data = {
                    "orderID": "7"                
                }
                console.log(data)
                await axios.post('http://localhost:5101/reject_order',data)
            } catch (error) {
                console.error(error)
            }
        },
        showOrderForUpcoming: function (item) {
            if(item['status'] == 'open'){
                return true
            }
            else {
                return false
            }
        },
        showOrderForCompleted: function (item) {
            if(item['status'] == 'open'){
                return false
            }
            else {
                return true
            }
        },
        // rejectOrder: async function(orderid): Promise<void> {
        //     try {
        //         const data = {
        //             "orderID": String(orderid)
        //         }
        //         console.log(data)
        //         await axios.post('http://localhost:5101/reject_order',data)
        //     } catch (error) {
        //         console.error(error)
        //     }
        // },
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
                class="bg-white px-8 md:px-20 py-8 w-full grid grid-cols-1 gap-6 dark:bg-slate-900 text-black">
                <!-- <div v-if="filteredData" v-for="business of filteredData">
                    <lazyPictureLoad :data="business"></lazyPictureLoad>
                </div>
                <div v-else v-for="business of businessData">
                    <lazyPictureLoad :data="business"></lazyPictureLoad>
                </div> -->
                <div v-show="isUpcomingVisible">
                    <div>
                        <table class="table-fixed mx-auto">
                            <thead>
                                <tr>
                                    <th class="p-4">Customer name</th>
                                    <th class="p-4">OrderID</th>
                                    <th class="p-4">Item information (Qty)</th>
                                    <th class="p-4">Phone number</th>
                                    <th class="p-4">Total price</th>
                                    <th class="p-4">Confirm/Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in orders" v-show="showOrderForUpcoming(item)">
                                    <td>{{ item['customer_name'] }}</td>
                                    <td>{{ item['orderID'] }}</td>
                                    <td>
                                        <ol>
                                            <li v-for="food in item['order_items']">
                                                {{ food['item_name'] }} ({{ food['quantity'] }})
                                            </li>
                                        </ol>
                                    </td>
                                    <td>{{ item['phone_no'] }}</td>
                                    <td>${{ item['total_price'] }}</td>
                                    <td>
                                        <div class="p-3">
                                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-5 rounded">Confirm</button>
                                            <button @click=" rejectOrder()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded">Reject</button>
                                            <!-- <button @click=" rejectOrder(item['orderID'])" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded">Reject</button> -->
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-show="isCompletedVisible">
                    <div>
                        <table class="table-fixed mx-auto">
                            <thead>
                                <tr>
                                    <th class="p-4">Customer name</th>
                                    <th class="p-4">OrderID</th>
                                    <th class="p-4">Item information (Qty)</th>
                                    <th class="p-4">Phone number</th>
                                    <th class="p-4">Total price</th>
                                    <th class="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in orders" v-show="showOrderForCompleted(item)">
                                    <td>{{ item['customer_name'] }}</td>
                                    <td>{{ item['orderID'] }}</td>
                                    <td>
                                        <ol>
                                            <li v-for="food in item['order_items']">
                                                {{ food['item_name'] }} ({{ food['quantity'] }})
                                            </li>
                                        </ol>
                                    </td>
                                    <td>{{ item['phone_no'] }}</td>
                                    <td>${{ item['total_price'] }}</td>
                                    <td>{{ item['status'] }}</td>
                                </tr>
                            </tbody>
                        </table>
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
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
