<script lang="ts">
export default {
    name: 'LogInModal',
    data() {
        return {
            valid_email: true as boolean,
            email: '' as string,
            password: '' as string,
        }
    },
    props: {
        closelogin: Function,
    },
    methods: {
        loginUser(): void {
            let data = {
                email: this.email,
                password: this.password,
            }

            this.$emit('login-email-user', data)
        },
    },
}
</script>

<template>
    <div
        class="fixed inset-0 z-50 justify-center items-center flex bg-slate-500/60">
        <div class="relative w-auto my-6 mx-auto max-w-6xl">
            <div
                class="border-0 rounded-2xl overflow-auto text-left shadow-lg relative flex flex-col md:w-full md:h-full bg-white md:min-w-[500px] max-h-[600px] w-[300px] md:min-h-[380px]">
                <div
                    class="flex items-center p-5 border-b border-solid border-slate-200 rounded-t">
                    <button class="bg-transparent" @click="closelogin()">
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
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded w-full">
                            Log in
                        </button>
                        <section id="firebaseui-auth-container"></section>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
