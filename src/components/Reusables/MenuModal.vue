<script lang="ts">
import { submit } from 'dom7'
import { Business, DeliveryOptionsEnum, MenuFields, ModeEnum } from '../../types/types'
import { FirebaseService } from '../../services/firebaseService'
import { defineAsyncComponent } from 'vue'
import { defineComponent, PropType } from 'vue'

const firebaseService = new FirebaseService()
const lazyPictureLoad = defineAsyncComponent(
    () => import('../Reusables/BusinessCard.vue')
)

export default {
    name: 'Filter',
    props: {
        data: Object as PropType<Business>,
        business_id: String,
    },
    data() {
        return {
            lowerLimit: 0 as number,
            upperLimit: 100 as number,
            min: 0 as number,
            max: 100 as number,
            selectedMode: 'physical' as string,
            stars: ['1', '2', '3', '4', '5'] as string[],
            price_range: ['$', '$$', '$$$'] as string[],
            deliveryOptions: DeliveryOptionsEnum,
            selected_price: 0 as number,
            selected_rating: '' as string,
            selected_mode: [] as string[],
            businessData: null as Business[] | null,
        }
    },
    beforeMount() {
        this.getDataByID(this.business_id)
        console.log(this.businessData)
    },
    methods: {
        getDataByID: async function (business_id: String): Promise<void> {
            business_id= window.location.href.split('/').slice(-1)
            console.log(business_id)
            this.businessData = await firebaseService.getDataByID(
                Number(business_id)
            )
            console.log(this.businessData)
            console.log(this.businessData.menu)
            var menu= this.businessData.menu
            for (var item of menu) {
                var temp_array= []
                temp_array.push(item.image)
                temp_array.push(item.name)
                temp_array.push(item.price)
                console.log(temp_array)
                this.selected_mode.push(temp_array)
                console.log(this.selected_mode)
            }
        },
        add(): void {
            const plusButton = document.getElementById("plus-button");

            plusButton.addEventListener("click", () => {
                const curr_val = Number(document.getElementById("number-input").value)
                console.log(curr_val)
                document.getElementById("number-input").value = (curr_val + 1).toString();
            });
        },
        minus(): void {
            const minusButton = document.getElementById("minus-button");

            minusButton.addEventListener("click", () => {
                const curr_val = Number(document.getElementById("number-input").value)
                if (currentValue > 0) {
                document.getElementById("number-input").value = (curr_val - 1).toString();    
                }           
            });
        },
        close(): void {
            this.$emit('close')
        },
        checkPrice(price): void {
            if (this.selected_price.length == price) {
                this.selected_price = 0
            } else {
                this.selected_price = price.length
            }
        },
        checkRating(star): void {
            if (this.selected_rating == star) {
                this.selected_rating = ''
            } else {
                this.selected_rating = star
            }
        },
        checkMode(mode): void {
            if (!this.selected_mode.includes(mode)) {
                this.selected_mode.push(mode)
            } else {
                var index = this.selected_mode.indexOf(mode)
                if (index !== -1) {
                    this.selected_mode.splice(index, 1)
                }
            }
        },
        submit(): void {
            let mode = ''
            if (this.selected_mode.length == 1) {
                if (this.selected_mode[0] == 'physical') {
                    mode = ModeEnum.physical
                } else {
                    mode = ModeEnum.online
                }
            } else if (this.selected_mode.length == 2) {
                mode = ModeEnum.both
            }

            const MenuFields: MenuFields = {
                price: this.selected_price,
                mode: mode,
                rating: this.selected_rating
            }

            this.$emit('menu-push', MenuFields)
            this.close()
        },
    },
}

</script>

<template>
    <div
        class="fixed inset-0 z-40 px-6 justify-center items-center flex bg-slate-500/60">
        <div
            class="bg-white text-black relative max-h-[620px] rounded-2xl overflow-auto">
            <!-- cancel icon -->
            <div
                class="sticky top-0 z-20 bg-white pt-3 pb-3 px-12 w-full border-b">
                <img
                    class="absolute z-50 h-5 w-5 top-5 left-5 cursor-pointer"
                    @click="close"
                    src="/assets/cross.svg"
                    id="cancelbtn" />
                <p class="flex justify-center font-bold text-xl">Menu</p>
            </div>

            <!-- <div v-for="item in this.businessData.menu">
                {{ item.name }}
                {{ item.price }}
            </div> -->

            <!-- menu -->
            <div class="px-12 pt-12 grid grid-cols-4" v-for="items in selected_mode">
                <div class="col-span-1 rounded-lg border-2 border-gray-200 px-6 pt-6">
                    <div class="w-full md:w-auto">
                        <img :src="items[0]" class="max-w-full rounded-lg">
                    </div>
                    <div class="w-full md:w-auto font-bold pb-3">
                            {{ items[1] }}
                    </div>
                    <div class="w-full md:w-auto">
                            ${{ items[2] }}
                    </div>

                    <div class="quantity buttons_added">
	                    <input type="button" value="-" id="minus-button" class="minus" @click="add()"> 
                        <input type="number" value="0" id="number-input" min="0" name="quantity" title="Qty" size="4" class="input-text qty text">
                        <input type="button" value="+" id="plus-button" class="plus" @click="minus()">
                    </div>
                </div>
            </div>

            <!-- preferred mode -->
            <div class="text-left px-6 md:px-12">
                <p class="text-left font-bold pb-3">Mode</p>
                <ul class="grid gap-6 w-full md:grid-cols-2">
                    <li>
                        <input
                            type="checkbox"
                            id="physical"
                            class="hidden peer" />
                        <label
                            @click="checkMode('physical')"
                            for="physical"
                            class="inline-flex justify-between items-center text-gray-500 px-7 py-3 w-full bg-white rounded-lg border-2 border-gray-200 cursor-pointer peer-checked:border-blue-600 peer-checked:text-gray-700 hover:bg-gray-50">
                            <div class="block">
                                <div class="w-full text-lg font-semibold">
                                    Physical
                                </div>
                                <div class="w-full text-sm">
                                    Visit physical stores
                                </div>
                            </div>
                        </label>
                    </li>
                    <li>
                        <input
                            type="checkbox"
                            id="online"
                            class="hidden peer" />
                        <label
                            @click="checkMode('online')"
                            for="online"
                            class="inline-flex justify-between items-center text-gray-500 px-7 py-3 w-full bg-white rounded-lg border-2 border-gray-200 cursor-pointer peer-checked:border-blue-600 peer-checked:text-gray-700 hover:bg-gray-50">
                            <div class="block">
                                <div class="w-full text-lg font-semibold">
                                    Online
                                </div>
                                <div class="w-full text-sm">
                                    Delivery Services
                                </div>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>

            <!-- rating -->
            <div class="my-5 md:my-10 text-center md:text-left px-6 md:px-12">
                <p class="font-bold pb-3">Rating</p>
                <div class="w-full flex justify-between flex-wrap gap-3">
                    <div class="w-full md:w-auto" v-for="star in stars">
                        <button
                            :value="star"
                            @click="checkRating(star)"
                            class="flex items-center w-full md:w-auto md:min-w-[60px] hover:bg-gray-50 font-semibold focus:outline-none py-2 px-5 rounded-lg border-2 border-gray-200 cursor-pointer"
                            :class="{
                                'bg-transparent border-blue-500':
                                    star === selected_rating,
                                'bg-transparent text-gray-500 ':
                                    star !== selected_rating,
                            }">
                            {{ star
                            }}<span
                                ><img class="ml-4" src="/assets/star.svg"
                            /></span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- search -->
            <div class="my-10 text-center px-12">
                <button
                    @click="submit()"
                    id="searchBtn"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-full">
                    Search
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ratingBtn {
    display: none;
}
.rating {
    border: 2px solid black;
    border-radius: 5px;
    padding: 5px 10px;
    background-color: transparent;
    cursor: pointer;
}
.ratingBtn:hover + label {
    background-color: rgb(59 130 246 / 0.25);
    transition: 0.3s;
}
.ratingBtn:checked + label {
    background-color: rgb(59 130 246 / 0.5);
    transition: 0.3s;
}

.quantity {
 display: inline-block; }

.quantity .input-text.qty {
 width: 35px;
 height: 39px;
 padding: 0 5px;
 text-align: center;
 background-color: transparent;
 border: 1px solid #efefef;
}

.quantity.buttons_added {
 text-align: left;
 position: relative;
 white-space: nowrap;
 vertical-align: top; }

.quantity.buttons_added input {
 display: inline-block;
 margin: 0;
 vertical-align: top;
 box-shadow: none;
}

.quantity.buttons_added .minus,
.quantity.buttons_added .plus {
 padding: 7px 10px 8px;
 height: 41px;
 background-color: #ffffff;
 border: 1px solid #efefef;
 cursor:pointer;}

.quantity.buttons_added .minus {
 border-right: 0; }

.quantity.buttons_added .plus {
 border-left: 0; }

.quantity.buttons_added .minus:hover,
.quantity.buttons_added .plus:hover {
 background: #eeeeee; }

.quantity input::-webkit-outer-spin-button,
.quantity input::-webkit-inner-spin-button {
 -webkit-appearance: none;
 -moz-appearance: none;
 margin: 0; }
 
 .quantity.buttons_added .minus:focus,
.quantity.buttons_added .plus:focus {
 outline: none; }

</style>
