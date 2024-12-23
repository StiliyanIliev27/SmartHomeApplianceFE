<script>
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import NavBar from '@/components/NavBar.vue'
import Chatbot from '@/components/HomePage/Chatbot.vue'
import { authApi } from '@/api/authApi'

export default {
    setup() {
        return { authStore: useAuthStore(), chatStore: useChatStore() };
    },
    components: {
        NavBar,
        Chatbot
    },
    data() {
        return {
            newPassword: '',
            repeatPassword: '',
            error: null,
            message: null,
            isReset: false,
            errors: {
                password: ''
            },
            validFields: {
                password: false
            }
        }
    },
    methods: {
        validatePassword() {
            this.errors.password = '';
            if (this.newPassword.length < 8) {
                this.errors.password = 'Password must be at least 8 characters long';
                this.validFields.password = false;
                return false;
            }
            if (!/[A-Z]/.test(this.newPassword)) {
                this.errors.password = 'Password must contain at least one uppercase letter';
                this.validFields.password = false;
                return false;
            }
            if (!/[0-9]/.test(this.newPassword)) {
                this.errors.password = 'Password must contain at least one number';       
                this.validFields.password = false;
                return false;
            }
            this.validFields.password = true;
            return true;
        },
        async handleResetPassword() { 
            if(!this.validatePassword()){
                return;
            }

            if (this.newPassword !== this.repeatPassword) {
                this.error = 'Passwords do not match.';
                return;
            }

            try {        
                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('userId');

                const response = await authApi.resetPassword(this.newPassword, userId);
                if(response.data.statusCode === 200){
                    this.message = 'Your password has been reset successfully.';
                    this.newPassword = '';
                    this.repeatPassword = '';
                    this.isReset = true;
                } else{
                    this.error = response.data.errorMessages[0];
                }
            } catch (error) {
                this.error = 'Failed to reset password. Please try again.';
            }
        },
        goToLogin() {
            this.$router.push('/login');
        }
    }
}
</script>

<template>
    <div class="absolute top-0 left-0 w-full z-10">
        <NavBar />
    </div>
    <Chatbot :user="authStore.user"/>
    <div class="flex min-h-screen flex-col justify-center bg-gradient-to-br from-indigo-50 to-white px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Reset Password
            </h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                <form class="space-y-6" @submit.prevent="handleResetPassword">
                    <div v-if="error" class="rounded-md bg-red-50 p-4">
                        <div class="text-sm text-red-700">{{ error }}</div>
                    </div>

                    <div v-if="message" class="rounded-md bg-green-50 p-4">
                        <div class="text-sm text-green-700">{{ message }}</div>
                    </div>

                    <div class="relative">
                        <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
                        <div class="mt-1">
                            <input v-model="newPassword" @blur="validatePassword" id="new-password" name="new-password" type="password" placeholder="Enter your new password" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                    </div>

                    <div class="relative">
                        <label for="repeat-password" class="block text-sm font-medium text-gray-700">Repeat Password</label>
                        <div class="mt-1">
                            <input v-model="repeatPassword" id="repeat-password" name="repeat-password" type="password" placeholder="Repeat your new password" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <div v-if="!isReset">
                            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Reset Password
                            </button>
                        </div>
                        <div v-else>
                            <button @click="goToLogin" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Go to Login
                            </button>
                        </div>
                    </div>                
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>