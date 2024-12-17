<script>
import NavBar from '../NavBar.vue'
import Chatbot from '../HomePage/Chatbot.vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { authApi } from '@/api'

export default {
    name: 'LoginComponent',
    components: {
        NavBar,
        Chatbot
    },
    setup() {
        return { authStore: useAuthStore(), chatStore: useChatStore() }
    },
    data() {
        return {
            showPassword: false,
            isLoading: false,
            form: {
                email: '',
                password: ''
            },
            error: null,
            message: null,
            validFields: {
                email: true,
                password: true
            },
            rememberMe: false
        }
    },
    methods: {
        validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(this.form.email)) {
                this.validFields.email = false
                return false
            }
            this.validFields.email = true
            return true
        },
        validatePassword() {
            if (!this.form.password || this.form.password.length < 6) {
                this.validFields.password = false
                return false
            }
            this.validFields.password = true
            return true
        },
        async handleSubmit() {
            this.error = null
            
            const isEmailValid = this.validateEmail()
            const isPasswordValid = this.validatePassword()
            
            if (!isEmailValid || !isPasswordValid) {
                return;
            }

            this.isLoading = true

            try {
                await this.authStore.login({
                    ...this.form,
                    rememberMe: this.rememberMe
                })
                await this.$nextTick()
                this.$router.push('/')
            } catch (error) {
                this.error = error.response?.data.errorMessages[0] || 'Invalid email or password'
                console.error('Login error:', error)
            } finally {
                this.isLoading = false
            }
        },
        goToRegister() {
            this.$router.push('/register')
        },
        goToHome() {
            this.$router.push('/')
        },
        async handleForgotPassword() {
            if (!this.form.email) {
                this.error = 'Please enter your email address'
                return;
            }
            try {
                const response = await authApi.forgotPassword(this.form.email);
                if(response.data.statusCode === 200){
                    this.error = null; 
                    this.message = 'The password reset email has been sent successfully.';
                } else{
                    this.error = response.data.errorMessages[0];
                }
            } catch (error) {
                this.error = error.response?.data.errorMessages[0] || 'Failed to send reset email'
            }
        }
    }
}
</script>

<template>
    <div class="absolute top-0 left-0 w-full z-10">
        <NavBar />
    </div>
    <Chatbot :user="authStore.user"/>
    <div
        class="flex min-h-screen flex-1 flex-col justify-center bg-gradient-to-br from-indigo-50 to-white px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
            <img class="mx-auto h-16 w-auto" src="/smart-home-logo.png"
                alt="Your Company" />
            <h2
                class="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl animate-slide-down">
                Sign in</h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
            <div
                class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 transition-all duration-300 hover:shadow-2xl animate-fade-in">
                <form class="space-y-6" @submit.prevent="handleSubmit">
                    <div v-if="error" class="rounded-md bg-red-50 p-4">
                        <div class="text-sm text-red-700">{{ error }}</div>
                    </div>

                    <div v-if="message" class="rounded-md bg-green-50 p-4">
                        <div class="text-sm text-green-700">{{ message }}</div>
                    </div>

                    <div class="relative">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1">
                            <input v-model.trim="form.email" @blur="validateEmail" id="email" name="email" type="email"
                                placeholder="Enter your email address" autocomplete="email" required
                                :class="{'border-red-500': !validFields.email}"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <p v-if="!validFields.email" class="mt-1 text-sm text-red-500">Please enter a valid email address</p>
                        </div>
                    </div>

                    <div class="relative">
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1 relative">
                            <input v-model.trim="form.password" @blur="validatePassword" id="password" name="password"
                                :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" required
                                :class="{'border-red-500': !validFields.password}"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                @click="showPassword = !showPassword">
                                <svg class="h-5 w-5 text-gray-400 hover:text-gray-500"
                                    :class="{ 'hidden': showPassword }" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <svg class="h-5 w-5 text-gray-400 hover:text-gray-500"
                                    :class="{ 'hidden': !showPassword }" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                        clip-rule="evenodd" />
                                    <path
                                        d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                            <p v-if="!validFields.password" class="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input v-model="rememberMe" id="remember-me" name="remember-me" type="checkbox"
                                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                        </div>

                        <div class="text-sm">
                            <a @click.prevent="handleForgotPassword" href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" :disabled="isLoading"
                            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span v-if="isLoading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                            <span v-else>Sign in</span>
                        </button>
                    </div>
                </form>

                <p class="mt-6 text-center text-sm text-gray-600 animate-fade-in">
                    Don't have an account?
                    {{ ' ' }}
                    <a @click.prevent="goToRegister" href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Sign
                        up</a>
                </p>
                <div class="flex justify-center mt-1">
                    <a @click.prevent="goToHome" href="#" class="font-medium text-indigo-600 hover:text-indigo-500 text-sm">Back to
                        home page</a>
                </div>
            </div>
        </div>
    </div>
</template>
