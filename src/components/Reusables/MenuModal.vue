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
            curr_val: 0 as number,
            cart: [] as string[]
        }
    },
    beforeMount() {
        this.getDataByID(this.business_id)
    },
    methods: {
        getDataByID: async function (business_id: String): Promise<void> {
            if(this.selected_mode.length == 0){
                business_id= window.location.href.split('/').slice(-1)
                this.businessData = await firebaseService.getDataByID(
                    Number(business_id)
                )
                var menu= this.businessData.menu
                for (var item of menu) {
                    var temp_array= []
                    temp_array.push(item.image)
                    temp_array.push(item.name)
                    temp_array.push(item.price)
                    this.selected_mode.push(temp_array)
                }
            }
        },
        add(item): void {
            this.curr_val = Number(document.getElementById("number-input-"+item).value)
            document.getElementById("number-input-"+item).value = (this.curr_val + 1).toString()
            // this.cart[this.businessData.menu[item]['name']]['qty'] += 1
            // this.cart[this.businessData.menu[item]['name']]['price'] = this.businessData.menu[item]['price']
        },
        minus(item): void {
            this.curr_val = Number(document.getElementById("number-input-"+item).value)
            if (this.curr_val > 0) {
                document.getElementById("number-input-"+item).value = (this.curr_val - 1).toString();    
            }  
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
            <div class="px-12 pt-12 grid grid-cols-4">
                <div class="col-span-1 rounded-lg border-2 border-gray-200 px-6 pt-6 mx-2" v-for="(items,x) in selected_mode">
                    <div class="w-full md:w-auto">
                        <img :src="items[0]" class="object-cover w-[20rem] h-[16rem] rounded-lg">
                    </div>
                    <div class="w-full md:w-auto font-bold pt-3">
                            {{ items[1] }}
                    </div>
                    <div class="w-full md:w-auto p-3">
                            ${{ items[2] }}
                    </div>

                    <div class="quantity buttons_added pb-3">
	                    <input type="button" value="-" id="minus-button" class="minus" @click="minus(x)"> 
                        <input type="number" value="0" :id="`number-input-${ x }`" min="0" name="quantity" title="Qty" size="4" class="input-text qty text">
                        <input type="button" value="+" id="plus-button" class="plus" @click="add(x)">
                    </div>
                </div>
            </div>

            <!-- search -->
            <div class="my-10 text-center px-12">
                <RouterLink     
                    :to="{
                        name: 'Payment',
                        params: { business_id: this.businessData.id },
                    }">
                    <button
                        id="searchBtn"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-96">
                        Submit
                    </button>
                </RouterLink>
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
