<script lang="ts">
import { submit } from 'dom7'
import { DeliveryOptionsEnum, FilterFields, ModeEnum } from '../../types/types'

export default {
    name: 'Filter',
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
        }
    },
    methods: {
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

            const filterFields: FilterFields = {
                price: this.selected_price,
                mode: mode,
                rating: this.selected_rating
            }

            this.$emit('filter-push', filterFields)
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
                <p class="flex justify-center font-bold text-xl">Filter</p>
            </div>
            <!-- price range -->
            <div class="my-5 md:my-10 text-left px-6 md:px-12">
                <p class="font-bold pb-3">Price Range</p>
                <div class="w-full flex justify-between flex-wrap gap-3">
                    <div class="w-full md:w-auto" v-for="price in price_range">
                        <button
                            :value="price"
                            @click="checkPrice(price)"
                            class="w-full md:w-auto md:min-w-[115px] hover:bg-gray-50 font-semibold focus:outline-none py-2 px-5 rounded-lg border-2 border-gray-200 cursor-pointer"
                            :class="{
                                'bg-transparent border-blue-500':
                                    price.length === selected_price,
                                'bg-transparent text-gray-500 ':
                                    price.length !== selected_price,
                            }">
                            {{ price }}
                        </button>
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
</style>
