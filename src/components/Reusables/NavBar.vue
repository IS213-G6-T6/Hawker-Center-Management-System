<script lang="ts">
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { UserService } from '../../services/userService'
import SignUpModal from './SignUpModal.vue'
import LogInModal from './LogInModal.vue'
import ProfileDropDown from './ProfileDropDown.vue'
import { auth } from '../../main'
import { EmailLoginData, EmailCreateData } from '../../types/types'
import { useToast } from "vue-toastification"

const userService = new UserService()
const toast = useToast()

export default {
    name: 'NavBar',
    el: '#app',
    data() {
        return {
            open: false as boolean,
            hide: false as boolean,
            modal_visible: false as boolean,
            login_visible: false as boolean,
            profile: false as boolean,
            valid_email2: true as boolean,
            userBookmarks: [] as number[],
        }
    },
    mounted() {
        if (!this.$store.getters.getUser) {
            let ui = firebaseui.auth.AuthUI.getInstance()
            if (!ui) {
                ui = new firebaseui.auth.AuthUI(firebase.auth())
            }
            var uiConfig = {
                callbacks: {
                    signInSuccessWithAuthResult: (authResult) => {
                        const isNewUser: boolean =
                            authResult.additionalUserInfo.isNewUser
                        if (isNewUser) {
                            authResult.user.getIdToken()
                                .then((token: string) => {
                                    userService.createUser(authResult.user, token)
                                    this.getBookmarks(authResult.user.uid, token)
                                })
                        }
                        toast.success(
                            `Successfully signed in! Welcome back, ${authResult.user.displayName}.`,
                            { timeout: 5000 }
                        )
                        return true
                    },
                },
                signInOptions: [
                    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                ],
            }
            ui.start('#firebaseui-auth-container', uiConfig)
        }
    },
    created() {
        window.addEventListener('scroll', this.handleScroll)
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.$store.dispatch('commitUser')
            }
        })

        const { search } = window.location
        const loggedOut = (new URLSearchParams(search)).get('loggedOut')
        if (loggedOut === '1') {
            toast.success("You have signed out successfully.", { timeout: 5000 })
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        toggle(): void {
            this.open = !this.open
        },
        handleScroll(): void {
            this.open = false
        },
        toggleMode(): void {
            this.$store.dispatch(
                'commitDarkMode',
                !this.$store.getters.getDarkMode
            )
        },
        showModal(): void {
            this.modal_visible = !this.modal_visible
        },
        toggleProfile(): void {
            this.profile = !this.profile
        },
        logout(): void {
            signOut(auth)
                .then(() => {
                    window.sessionStorage.clear()
                    window.location.href = '/Home?loggedOut=1'
                })
                .catch((error) => {
                    toast.error("Unable to log out, please try again later.", { timeout: 5000 })
                })
        },
        openlogin(): void {
            this.showModal()
            this.login_visible = !this.login_visible
        },
        closelogin(): void {
            this.login_visible = false
            this.valid_email2 = true
        },
        createUser(data: EmailCreateData): void {
            // once user is created it will auto log in
            createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    var user = firebase.auth().currentUser
                    user.getIdToken()
                        .then((token) => {
                            userService.createUserFromEmail(userCredential.user.uid, data.name, token)
                        })
                    user.updateProfile({
                        displayName: data.name
                    })
                    this.showModal()
                    toast.success(`Successfully created account! Welcome to BigRedDot, ${data.name}.`, { timeout: 5000 })
                })
                .catch((error) => {
                    toast.error("Error! Account not created.", { timeout: 5000 })
                })
        },
        loginUser(data: EmailLoginData) {
            signInWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    this.closelogin()
                    // then we retrieve the favourites from the user entity 
                    userCredential.user.getIdToken()
                        .then((token) => {
                            this.getBookmarks(userCredential.user.uid, token)
                        })
                    toast.success(`Successfully signed in! Welcome back, ${userCredential.user.displayName}.`, { timeout: 5000 })
                })
                .catch((error) => {
                    toast.error("Error! Unable to sign in! Please check your login credentials.", { timeout: 5000 })
                })
        },
        getBookmarks: async function (userId: string, token: string): Promise<void> {
            this.userBookmarks = await userService.getBookmarks(userId, token)
            if (this.userBookmarks) {
                this.$store.dispatch("commitUserBookmarks", this.userBookmarks)
            }
        }
    },
    components: {
        SignUpModal,
        LogInModal,
        ProfileDropDown,
    },
}
</script>

<template>
    <div :class="{ dark: this.$store.getters.getDarkMode }" id="app">
        <nav class="bg-white w-full py-2 px-5 dark:bg-slate-900 transition duration-200 ease">
            <div class="container flex flex-wrap justify-between mx-auto">
                <router-link to="/Home" class="flex">
                    <a class="flex items-center md:px-3">
                        <img
                            src="/assets/logo.png"
                            class="mr-3 h-8 sm:h-9"
                            alt="BigRedDot Logo" />
                        <span
                            class="self-center text-xl font-semibold whitespace-nowrap text-gray-500 dark:text-white">
                            BigRedDot
                        </span>
                    </a>
                </router-link>
                <div class="flex">
                    <button
                        id="mode_button"
                        class="bg-transparent p-0"
                        @click="toggleMode()">
                        <img
                            :style="[
                                this.$store.getters.getDarkMode
                                    ? {
                                          filter: 'brightness(0) saturate(100%) invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                                      }
                                    : { filter: 'none' },
                            ]"
                            class="w-5 h-5 block md:hidden"
                            src="/assets/dark_mode.svg" />
                    </button>
                    <button
                        @click="toggle()"
                        data-collapse-toggle="navbar-default"
                        type="button"
                        class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default">
                        <span class="sr-only">Open main menu</span>
                        <svg
                            class="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <div
                    v-on:scroll.native="handleScroll"
                    :class="open ? 'block' : 'hidden'"
                    class="w-full md:block md:w-auto"
                    id="navbar-default">
                    <ul
                        class="h-screen md:h-full flex items-baseline md:items-center flex-col p-4 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                        <li class="w-full md:w-auto mb-1 md:mb-0">
                            <div>
                                <router-link to="/Home">
                                    <a
                                        class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                        aria-current="page">
                                        Listing
                                    </a>
                                </router-link>
                            </div>
                        </li>
                        <li
                            class="w-full md:w-auto border-b md:border-b-0 mb-1 md:mb-0">
                            <router-link to="/About">
                                <a
                                    class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-[#87adff] dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    About Us
                                </a>
                            </router-link>
                        </li>
                        <li class="w-full md:w-auto h-0 md:h-auto">
                            <button
                                id="mode_button"
                                class="bg-transparent p-0"
                                @click="toggleMode()">
                                <img
                                    :style="[
                                        this.$store.getters.getDarkMode
                                            ? {
                                                  filter: 'brightness(0) saturate(100%) invert(98%) sepia(98%) saturate(6%) hue-rotate(127deg) brightness(102%) contrast(103%)',
                                              }
                                            : { filter: 'none' },
                                    ]"
                                    class="w-5 h-5 hidden md:block"
                                    src="/assets/dark_mode.svg" />
                            </button>
                        </li>
                        <li
                            v-if="!$store.state.user"
                            class="w-full md:w-auto mb-1 mt-3 md:mt-0 md:mb-0">
                            <button
                                @click="showModal(), toggle()"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-full md:w-auto">
                                Sign Up / Log In
                            </button>
                        </li>
                        <li
                            v-if="$store.state.user"
                            class="w-full md:hidden md:w-auto mb-1 md:mb-0">
                            <router-link to="/MyList">
                                <a
                                    class="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-sky-300 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    My Favourites
                                </a>
                            </router-link>
                        </li>
                        <li
                            v-if="$store.state.user"
                            class="w-full md:hidden md:w-auto mb-1 md:mb-0">
                            <router-link to="/Profile">
                                <a
                                    class="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-sky-300 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    Profile Settings
                                </a>
                            </router-link>
                        </li>
                        <li
                            v-if="$store.state.user"
                            class="w-full md:hidden md:w-auto mb-1 md:mb-0">
                            <button
                                @click="logout()"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-full md:w-auto">
                                Sign Out
                            </button>
                        </li>
                        <ProfileDropDown
                            v-if="$store.state.user"
                            :toggleProfile="toggleProfile"
                            :profile="profile"
                            :logout="logout" />
                    </ul>
                </div>
            </div>
        </nav>
        <SignUpModal
            v-show="modal_visible"
            :showModal="showModal"
            :openlogin="openlogin" 
            @create-email-user="createUser"/>
        <LogInModal v-show="login_visible" @login-email-user="loginUser" :closelogin="closelogin"/>
    </div>
</template>

<style scoped>
.router-link-active > a {
    color: #87adff;
}

.router-link-active > a:hover {
    color: #87adff;
}

#mode_button:hover,
#profile_button:hover {
    border-color: transparent;
}

#mode_button:focus,
#mode_button:focus-visible,
#profile_button:focus,
#profile_button:focus-visible {
    outline: none;
}
</style>
