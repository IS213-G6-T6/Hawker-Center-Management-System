<script lang="ts">
export default {
    name: 'SignUpModal',
    data() {
        return {
            valid_email: true as boolean,
            valid_repw: true as boolean,
            name: '' as string,
            email: '' as string,
            pw: '' as string,
            repw: '' as string,
            disabled: true as boolean,
        }
    },
    props: {
        showModal: Function,
        openlogin: Function,
    },
    methods: {
        validateEmail(): void {
            if (
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)
            ) {
                this.valid_email = true
            } else {
                this.valid_email = false
            }
        },
        validateRePw(): void {
            if (this.pw == this.repw) {
                this.valid_repw = true
            } else {
                this.valid_repw = false
            }
        },
        validatePassword(): void {
            if (this.pw.length > 0) {
                //validate length
                this.checkLength()
                //validate upper and lowe
                this.checkUpperLower()
                //validate alphanumeric
                this.checkAlphanumeric()
                //validate special chars
                this.checkSpecial()
            }
        },
        signUpUser(): void {
            if (
                this.valid_email &&
                this.valid_repw &&
                this.checkLength() &&
                this.checkUpperLower() &&
                this.checkAlphanumeric() &&
                this.checkSpecial()
            ) {
                // run this block of code if all fields are correct
                const newUser = {
                    name: this.name,
                    email: this.email,
                    password: this.pw
                }
                this.$emit('create-email-user', newUser)
            }
        },
        checkPwInput(): boolean {
            return this.pw.length > 0
        },
        checkLength(): boolean {
            return this.pw.length >= 12
        },
        checkUpperLower(): boolean {
            const upper = /[A-Z]/.test(this.pw)
            const lower = /[a-z]/.test(this.pw)
            return upper && lower
        },
        checkAlphanumeric(): boolean {
            const valid = /[^0-9a-zA-Z]/.test(this.pw)
            return valid
        },
        checkSpecial(): boolean {
            const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
            return specialChars.test(this.pw)
        },
    },
    computed: {
        validBtn(): boolean {
            if (this.repw != '') {
                this.validateRePw()
                if (
                    this.valid_email == true &&
                    this.checkLength() &&
                    this.checkUpperLower() &&
                    this.checkAlphanumeric() &&
                    this.checkSpecial() &&
                    this.checkPwInput() &&
                    this.valid_repw == true
                ) {
                    return (this.disabled = false)
                } else {
                    return (this.disabled = true)
                }
            } else {
                return (this.disabled = true)
            }
        },
    },
}
</script>

<template>
    <div
        class="fixed inset-0 z-50 justify-center items-center flex bg-slate-500/60">
        <div class="relative w-auto my-6 mx-auto max-w-6xl">
            <div
                class="border-0 rounded-2xl overflow-auto text-left shadow-lg relative flex flex-col md:w-full md:h-full bg-white md:min-w-[500px] max-h-[620px] w-[300px] md:min-h-[380px]">
                <div
                    class="sticky top-0 z-20 bg-white flex items-center p-5 border-b border-solid border-slate-200 rounded-t">
                    <button class="bg-transparent" @click="showModal()">
                        <img class="w-4" src="/assets/cross.svg" />
                    </button>
                    <h3 class="text-lg pl-1 font-semibold text-gray-700">
                        Log in or Sign up
                    </h3>
                </div>
                <div class="relative p-6 flex-auto">
                    <div class="space-y-4 md:space-y-6">
                        <div>
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900"
                                >Display Name</label
                            >
                            <input
                                type="username"
                                name="username"
                                v-model="name"
                                id="username"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Nicholas Lee" />
                        </div>
                        <div>
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900"
                                >Your email</label
                            >
                            <input
                                @blur="validateEmail()"
                                v-model="email"
                                id="email1"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com" />
                            <div v-show="!valid_email" class="text-gray-900">
                                <div
                                    class="flex mt-2 mb-4 text-sm text-red-700 rounded-lg"
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
                                        Invalid email address. Email format:
                                        john.tan@gmail.com
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label
                                class="block mb-2 text-sm font-medium text-gray-900"
                                >Password</label
                            >
                            <input
                                @blur="validatePassword()"
                                v-model="pw"
                                type="password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <div
                                class="flex flex-col mt-2 mb-4 text-sm text-gray-400 rounded-lg">
                                <div
                                    :class="{
                                        'text-gray-400': !checkPwInput(),
                                        'text-red-700':
                                            checkPwInput() && !checkLength(),
                                        'text-emerald-500':
                                            checkPwInput() && checkLength(),
                                    }">
                                    • Contain at least 12 characters
                                </div>
                                <div
                                    :class="{
                                        'text-gray-400': !checkPwInput(),
                                        'text-red-700':
                                            checkPwInput() &&
                                            !checkUpperLower(),
                                        'text-emerald-500':
                                            checkPwInput() && checkUpperLower(),
                                    }">
                                    • A mixture of both uppercase and lowercase
                                    letters
                                </div>
                                <div
                                    :class="{
                                        'text-gray-400': !checkPwInput(),
                                        'text-red-700':
                                            checkPwInput() &&
                                            !checkAlphanumeric(),
                                        'text-emerald-500':
                                            checkPwInput() &&
                                            checkAlphanumeric(),
                                    }">
                                    • A mixture of letters and numbers
                                </div>
                                <div
                                    :class="{
                                        'text-gray-400': !checkPwInput(),
                                        'text-red-700':
                                            checkPwInput() && !checkSpecial(),
                                        'text-emerald-500':
                                            checkPwInput() && checkSpecial(),
                                    }">
                                    • Inclusion of at least one special
                                    character, e.g., ! @ # ? ]
                                </div>
                            </div>
                        </div>
                        <div>
                            <label
                                for="confirm-password"
                                class="block mb-2 text-sm font-medium text-gray-900"
                                >Confirm password</label
                            >
                            <input
                                @blur="validateRePw()"
                                v-model="repw"
                                type="password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <div v-show="!valid_repw" class="text-gray-900">
                                <div
                                    class="flex mt-2 mb-4 text-sm text-red-700 rounded-lg"
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
                                        Confirmed password does not match with
                                        the previous password
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                        id="createBtn"
                            :disabled="validBtn"
                            @click="signUpUser()"
                            class="bg-blue-500 disabled:bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-full">
                            Create an account
                        </button>
                        <p
                            class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account?
                            <a
                                @click="openlogin()"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >Login here</a
                            >
                        </p>
                        <section
                            v-if="!this.$store.getters.getUser"
                            id="firebaseui-auth-container"></section>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

#createBtn:disabled:hover{
    border-color: transparent;
}

#createBtn:disabled:focus, #createBtn:disabled:focus-visible {
    outline: none;
}
</style>
