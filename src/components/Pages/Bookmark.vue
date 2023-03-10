<script lang="ts">
import NavBar from '../Reusables/NavBar.vue'
import { Category } from '../../types/types'
import { UserService } from '../../services/userService'
import { FirebaseService } from '../../services/firebaseService'
import { Business } from '../../types/types'
import firebase from 'firebase/compat/app'

const userService = new UserService()
const firebaseService = new FirebaseService()

export default {
    name: 'MyList',
    data() {
        return {
            categories: [
                { name: 'services', url: '/assets/services.svg' },
                { name: 'fnb', url: '/assets/f&b.svg' },
                { name: 'fashion', url: '/assets/fashion.svg' },
                { name: 'crafts', url: '/assets/crafts.svg' },
                { name: 'experiences', url: '/assets/experiences.svg' },
            ] as Category[],
            bookmark_list: Object,
            businesses: Object,
            business_list: Object,
            businessData: null as Business | null,
            businessID: null,
        }
    },
    components: { NavBar },
    mounted() {
        this.getList()
    },
    methods: {
        addFav(input): void {
            this.businessID = input
            var bookmarksArray: number[] = this.$store.state.userBookmarks
            const user = firebase.auth().currentUser

            if (bookmarksArray.includes(this.businessID)) {
                // if it has been bookmarked
                bookmarksArray.splice(
                    bookmarksArray.indexOf(this.businessID),
                    1
                )
                user.getIdToken()
                    .then((token) => {
                        userService.updateBookmarks(user.uid, bookmarksArray, 'remove', token)
                    })
            } else {
                // if it is not already bookmarked
                bookmarksArray.push(this.business_id)
                user.getIdToken()
                    .then((token) => {
                        userService.updateBookmarks(user.uid, bookmarksArray, 'add', token)
                    })
            }
            // lazy method of updating, will improve if time permits
            this.$store.dispatch('commitUserBookmarks', bookmarksArray)
        },
        async getList() {
            this.businesses = this.$store.getters.getUserBookmarks
            let tempArr = []
            for (let value of this.businesses) {
                if (value !== null) {
                    tempArr.push(await this.getDataByID(value))
                }
            }
            this.business_list = tempArr
        },
        getDataByID: async function (
            business_id: String
        ): Promise<void | Business[]> {
            const res = await firebaseService.getDataByID(Number(business_id))
            return res
        },
        imageSource(business_id): string {
            if (this.$store.state.userBookmarks) {
                if (
                    Object.values(this.$store.state.userBookmarks).includes(
                        business_id
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
}
</script>

<template>
    <div
        class="bg-white dark:bg-slate-900"
        :class="{ dark: this.$store.getters.getDarkMode }">
        <NavBar></NavBar>
        <div class="bg-[#d4e6ff] p-5 w-full flex justify-between">
            <div class="container overflow-auto flex mx-auto">
                <div class="flex items-center px-3 mr-5">
                    <RouterLink to="/Home">
                        <img class="w-6 h-6 mr-4" src="/assets/back.svg" />
                    </RouterLink>
                    <div
                        class="font-bold ml-5 text-sm md:text-xl text-gray-900">
                        My Favourite
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white h-screen dark:bg-slate-900 w-full">
            <template v-if="this.$store.getters.getUserBookmarks.length > 0">
                <div
                    v-for="(business, index) in business_list"
                    class="w-full bg-white dark:bg-slate-900 px-8 lg:px-16 py-5 flex flex-col md:flex-row justify-center p-3 border-gray-300"
                    :class="{
                        'border-b': Number(index) !== business_list.length - 1,
                    }">
                    <RouterLink
                        class="flex flex-col md:flex-row flex-1"
                        :to="{
                            name: 'BusinessDetail',
                            params: { business_id: business['id'] },
                        }">
                        <img
                            class="m-3 rounded-2xl flex-initial basis-1/4 max-w-none md:w-14 min-h-[200px] max-h-52 object-cover"
                            :src="business['images'][0]" />
                        <div
                            class="p-4 w-full text-left flex-col self-center justify-between leading-normal">
                            <div class="mb-4 flex text-left justify-between">
                                <div class="flex-wrap flex">
                                    <div
                                        class="inline py-1 mr-2 px-3 text-xs border-solid border-2 border-blue-400 rounded-2xl text-gray-700 dark:text-white transition duration-500 ease">
                                        {{ business['category'] }}
                                    </div>
                                    <div
                                        class="inline py-1 px-3 text-xs border-solid border-2 border-rose-300 rounded-2xl text-gray-700 dark:text-white transition duration-500 ease">
                                        {{ business['mode'] }}
                                    </div>
                                </div>
                                <img
                                    @click="addFav(business['id'])"
                                    class="block md:hidden w-[20px]"
                                    :src="imageSource(business['id'])" />
                            </div>
                            <div class="mb-8">
                                <p
                                    class="text-sm text-gray-600 flex items-center"></p>
                                <div
                                    class="text-gray-900 dark:text-white transition duration-500 ease font-bold text-xl mb-2">
                                    {{ business['name'] }}
                                </div>
                                <p
                                    class="text-gray-700 dark:text-white transition duration-500 ease text-base">
                                    {{ business['description'] }}
                                </p>
                            </div>
                        </div>
                    </RouterLink>
                    <div>
                        <img
                            @click="addFav(business['id'])"
                            class="hidden md:block w-[30px] pt-10"
                            :src="imageSource(business['id'])" />
                    </div>
                </div>
            </template>
            <div
                class="bg-white dark:bg-slate-900 w-full flex flex-col items-center flex-wrap"
                v-else>
                <img
                    v-if="!this.$store.getters.getDarkMode"
                    class="max-w-[15rem] sm:max-w-none sm:min-w-[25rem]"
                    src="/assets/shop_placeholder.svg" />
                <img
                    v-else
                    class="max-w-[15rem] sm:max-w-none sm:min-w-[25rem]"
                    src="/assets/shopdark_placeholder.svg" />
                <div
                    class="w-full font-bold mb-5 text-sm md:text-xl text-gray-700 dark:text-gray-200">
                    Nothing Saved Yet
                </div>
                <div class="w-full px-3 md:px-0 md:w-96 font-normal text-gray-700 dark:text-gray-200">
                    When you find something you like, click the heart icon to
                    save it. Share with your friends your favourite bookmarked
                    businesses!
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
}

#cat_button:focus {
    outline: none;
}

#filterBtn:focus {
    border-color: transparent;
    outline: none;
}
</style>
