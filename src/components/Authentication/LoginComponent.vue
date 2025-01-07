<script>
import NavBar from '../NavBar.vue'
import Chatbot from '../HomePage/Chatbot.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { authApi } from '@/api/authApi'

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
                if(this.authStore.user.isAdmin){
                    const redirect = this.$route.query.redirect || '/admin';
                    this.$router.push(redirect)
                } else {
                    const redirect = this.$route.query.redirect || '/';
                    this.$router.push(redirect)
                }
                
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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
            <!-- Logo and Title -->
            <div class="text-center">
                <img class="mx-auto h-20 w-auto transform hover:scale-110 transition-transform duration-300" 
                     src="/smart-home-logo.png" alt="HomeCraft" />
                <h2 class="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 animate-fade-in-down">
                    Welcome Back
                </h2>
                <p class="mt-2 text-sm text-gray-600 animate-fade-in">
                    Sign in to continue to your account
                </p>
            </div>

            <!-- Login Form Card -->
            <div class="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform hover:shadow-2xl transition-all duration-300 space-y-6 animate-fade-in-up">
                <form class="space-y-6" @submit.prevent="handleSubmit">
                    <!-- Alert Messages -->
                    <div v-if="error" class="rounded-lg bg-red-50 p-4 border-l-4 border-red-500 animate-shake">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-700">{{ error }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="message" class="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-green-700">{{ message }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Email Field -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <input v-model.trim="form.email" 
                                   @blur="validateEmail" 
                                   id="email" 
                                   name="email" 
                                   type="email"
                                   placeholder="Enter your email address"
                                   autocomplete="email" 
                                   required
                                   :class="{'border-red-500 ring-red-500': !validFields.email}"
                                   class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                            <p v-if="!validFields.email" class="mt-1 text-sm text-red-500">Please enter a valid email address</p>
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <input v-model.trim="form.password" 
                                   @blur="validatePassword" 
                                   id="password" 
                                   name="password"
                                   :type="showPassword ? 'text' : 'password'" 
                                   placeholder="Enter your password"
                                   required
                                   :class="{'border-red-500 ring-red-500': !validFields.password}"
                                   class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                            <button type="button" 
                                    @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg class="h-5 w-5 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                                     :class="{ 'hidden': showPassword }" 
                                     xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20" 
                                     fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                                <svg class="h-5 w-5 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                                     :class="{ 'hidden': !showPassword }" 
                                     xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20" 
                                     fill="currentColor">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                            <p v-if="!validFields.password" class="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
                        </div>
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input v-model="rememberMe" 
                                   id="remember-me" 
                                   name="remember-me" 
                                   type="checkbox"
                                   class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200">
                            <label for="remember-me" class="ml-2 block text-sm text-gray-700">Remember me</label>
                        </div>

                        <div class="text-sm">
                            <a @click.prevent="handleForgotPassword" 
                               href="#" 
                               class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button type="submit" 
                                :disabled="isLoading"
                                :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
                                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:-translate-y-0.5 transition-all duration-200">
                            <span v-if="isLoading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                     xmlns="http://www.w3.org/2000/svg" 
                                     fill="none" 
                                     viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                            <span v-else>Sign in</span>
                        </button>
                    </div>
                </form>

                <!-- Footer Links -->
                <div class="space-y-4 text-center">
                    <p class="text-sm text-gray-600">
                        Don't have an account?
                        <a @click.prevent="goToRegister" 
                           href="#" 
                           class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">
                            Sign up
                        </a>
                    </p>
                    <a @click.prevent="goToHome" 
                       href="#" 
                       class="block text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">
                        Back to home page
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
