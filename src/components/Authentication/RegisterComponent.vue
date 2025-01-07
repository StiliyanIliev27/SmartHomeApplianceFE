<script>
import NavBar from '../NavBar.vue'
import Chatbot from '../HomePage/Chatbot.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'

export default {
    components: {
        NavBar,
        Chatbot
    },
    setup(){
        return { authStore: useAuthStore(), chatStore: useChatStore() };
    },
    data() {
        return {
            showPassword: false,
            showConfirmPassword: false,
            isLoading: false,
            previewImage: null,
            form: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                profilePicture: null
            },
            errors: {
                email: '',
                password: '',
                confirmPassword: '',
                general: ''
            },
            validFields: {
                firstName: false,
                lastName: false,
                email: false,
                password: false,
                confirmPassword: false
            }
        }
    },
    methods: {
        validateFirstName() {
            this.validFields.firstName = this.form.firstName.length > 2;
            this.errors.firstName = 'First name must be at least 3 characters long';
        },
        validateLastName() {
            this.validFields.lastName = this.form.lastName.length > 2;
            this.errors.lastName = 'Last name must be at least 3 characters long';
        },
        validateEmail() {
            this.errors.email = '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.form.email) {
                this.errors.email = 'Email is required';
                this.validFields.email = false;
                return false;
            }
            if (!emailRegex.test(this.form.email)) {
                this.errors.email = 'Please enter a valid email address';
                this.validFields.email = false;
                return false;
            }
            this.validFields.email = true;
            return true;
        },
        validatePassword() {
            this.errors.password = '';
            if (this.form.password.length < 8) {
                this.errors.password = 'Password must be at least 8 characters long';
                this.validFields.password = false;
                return false;
            }
            if (!/[A-Z]/.test(this.form.password)) {
                this.errors.password = 'Password must contain at least one uppercase letter';
                this.validFields.password = false;
                return false;
            }
            if (!/[0-9]/.test(this.form.password)) {
                this.errors.password = 'Password must contain at least one number';
                this.validFields.password = false;
                return false;
            }
            this.validFields.password = true;
            return true;
        },
        validateConfirmPassword() {
            this.errors.confirmPassword = '';
            if (this.form.password !== this.form.confirmPassword) {
                this.errors.confirmPassword = 'Passwords do not match';
                this.validFields.confirmPassword = false;
                return false;
            }
            this.validFields.confirmPassword = true;
            return true;
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.form.profilePicture = file;
                this.previewImage = URL.createObjectURL(file);
            }
        },
        removeImage() {
            this.form.profilePicture = null;
            this.previewImage = null;
            const input = document.getElementById('profilePicture');
            if (input) input.value = '';
        },
        async handleSubmit() {
            if (!this.validateEmail() || !this.validatePassword() || !this.validateConfirmPassword()) {
                return;
            }
            this.isLoading = true;

            try {
                const userData = {
                    firstName: this.form.firstName,
                    lastName: this.form.lastName,
                    email: this.form.email,
                    password: this.form.password,
                    profilePicture: this.form.profilePicture
                };

                const formData = new FormData();
                formData.append('firstName', userData.firstName);
                formData.append('lastName', userData.lastName);
                formData.append('email', userData.email);
                formData.append('password', userData.password);

                if (userData.profilePicture) {
                    formData.append('profilePicture', userData.profilePicture);
                }

                const response = await this.authStore.registerAsync(formData);

                if (response.status === 400 || response.status === 500) {
                    const errorData = await response.json();
                    throw new Error(errorData.errorMessages[0] || 'Registration failed');
                }

                const data = response.data;
                console.log('Registration successful:', data);

                localStorage.setItem('pendingConfirmationEmail', this.form.email);

                this.$router.push('/confirm-email-pending');
            } catch (error) {
                console.error('Registration error:', error);
                this.errors.general = error.message;
            } finally {
                this.isLoading = false;
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

    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 sm:px-6 lg:px-8 pt-20">
        <div class="w-full max-w-4xl space-y-6">
            <div class="text-center">
                <img class="mx-auto h-16 w-auto transform hover:scale-110 transition-transform duration-300" 
                     src="/smart-home-logo.png" 
                     alt="Smart Home Logo" />
                <h2 class="mt-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 animate-fade-in-down">
                    Create Account
                </h2>
                <p class="mt-2 text-sm text-gray-600 animate-fade-in">
                    Join our smart home community
                </p>
            </div>

            <div class="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
                <form class="flex flex-wrap gap-6" @submit.prevent="handleSubmit">
                    <div class="flex-1 min-w-[300px] space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="relative group">
                                <label for="firstName" class="block text-sm font-medium text-gray-700">First name <span class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <input v-model="form.firstName" 
                                           @blur="validateFirstName" 
                                           id="firstName"
                                           name="firstName" 
                                           type="text" 
                                           placeholder="Enter your first name" 
                                           required
                                           class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                                    <svg v-if="validFields.firstName" class="h-5 w-5 text-green-500 absolute right-2 top-9"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div class="relative group">
                                <label for="lastName" class="block text-sm font-medium text-gray-700">Last name <span class="text-red-500">*</span></label>
                                <div class="mt-1">
                                    <input v-model="form.lastName" 
                                           @blur="validateLastName" 
                                           id="lastName" 
                                           name="lastName"
                                           type="text" 
                                           placeholder="Enter your last name" 
                                           required
                                           class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                                    <svg v-if="validFields.lastName" class="h-5 w-5 text-green-500 absolute right-2 top-9"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="relative">
                            <label for="email" class="block text-sm font-medium text-gray-700">Email address <span class="text-red-500">*</span></label>
                            <div class="mt-1">
                                <input v-model="form.email" 
                                       @blur="validateEmail" 
                                       id="email" 
                                       name="email" 
                                       type="email"
                                       placeholder="Enter your email address" 
                                       autocomplete="email" 
                                       required
                                       class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                                <svg v-if="validFields.email" class="h-5 w-5 text-green-500 absolute right-2 top-9"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
                        </div>

                        <div class="relative">
                            <label for="password" class="block text-sm font-medium text-gray-700">Password <span class="text-red-500">*</span></label>
                            <div class="mt-1 relative">
                                <input v-model="form.password" 
                                       @blur="validatePassword" 
                                       id="password" 
                                       name="password"
                                       placeholder="Enter your password" 
                                       :type="showPassword ? 'text' : 'password'" 
                                       required
                                       class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                                <button type="button" 
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        @click="showPassword = !showPassword">
                                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        :class="{ 'hidden': showPassword }" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" 
                                        fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        :class="{ 'hidden': !showPassword }" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" 
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                            clip-rule="evenodd" />
                                        <path
                                            d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                </button>
                            </div>
                            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
                        </div>

                        <div class="relative">
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password <span class="text-red-500">*</span></label>
                            <div class="mt-1 relative">
                                <input v-model="form.confirmPassword" 
                                       @blur="validateConfirmPassword" 
                                       id="confirmPassword"
                                       name="confirmPassword" 
                                       placeholder="Confirm your password"
                                       :type="showConfirmPassword ? 'text' : 'password'" 
                                       required
                                       class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300" />
                                <button type="button" 
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        @click="showConfirmPassword = !showConfirmPassword">
                                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        :class="{ 'hidden': showConfirmPassword }" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" 
                                        fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        :class="{ 'hidden': !showConfirmPassword }" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" 
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                            clip-rule="evenodd" />
                                        <path
                                            d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                </button>
                            </div>
                            <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">{{ errors.confirmPassword }}</p>
                        </div>
                    </div>

                    <div class="flex-1 min-w-[300px] space-y-6">
                        <div class="relative">
                            <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <div class="mt-1 space-y-4">
                                <input @change="handleImageUpload" 
                                       id="profilePicture"
                                       name="profilePicture" 
                                       type="file" 
                                       accept="image/*"
                                       class="block w-full text-sm text-gray-500 
                                              file:mr-4 file:py-2 file:px-4 
                                              file:rounded-full file:border-0 
                                              file:text-sm file:font-semibold 
                                              file:bg-indigo-50 file:text-indigo-600 
                                              hover:file:bg-indigo-100
                                              transition-all duration-200" />
                                
                                <div v-if="previewImage" class="relative w-48 h-48 mx-auto">
                                    <img :src="previewImage" 
                                         alt="Profile preview" 
                                         class="w-full h-full object-cover rounded-lg shadow-md" />
                                    <button @click="removeImage" 
                                            type="button"
                                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="errors.general" class="rounded-lg bg-red-50 p-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">{{ errors.general }}</h3>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button type="submit" 
                                    :disabled="isLoading"
                                    :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
                                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:-translate-y-0.5 transition-all duration-200">
                                <span class="flex items-center">
                                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {{ isLoading ? 'Creating account...' : 'Create account' }}
                                </span>
                            </button>
                        </div>

                        <div class="text-center">
                            <p class="text-sm text-gray-600">
                                Already have an account?
                                <a @click="goToLogin" 
                                   href="#" 
                                   class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>