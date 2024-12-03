<script>
import NavBar from '../NavBar.vue'

export default {
    components: {
        NavBar
    },
    data() {
        return {
            showPassword: false,
            showConfirmPassword: false,
            isLoading: false,
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
            this.validFields.firstName = this.form.firstName.length > 0;
        },
        validateLastName() {
            this.validFields.lastName = this.form.lastName.length > 0;
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
        async handleSubmit() {
            if (!this.validateEmail() || !this.validatePassword() || !this.validateConfirmPassword()) {
                return;
            }
            this.isLoading = true;

            try {
                // Създаваме обект с данните вместо FormData
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

                const response = await fetch('https://localhost:7200/api/auth/register', {
                    method: 'POST',
                    body: formData
                });

                if (response.status === 400 || response.status === 500) {
                    const errorData = await response.json();
                    throw new Error(errorData.errorMessages[0] || 'Registration failed');
                }

                const data = await response.json();
                console.log('Registration successful:', data);

                // Запазваме имейла за страницата за потвърждение
                localStorage.setItem('pendingConfirmationEmail', this.form.email);

                // Пренасочване към страницата за изчакване на потвърждение
                this.$router.push('/confirm-email-pending');
            } catch (error) {
                console.error('Registration error:', error);
                // Тук можете да добавите показване на грешката на потребителя
                // Например чрез добавяне на ново поле в data() за общи грешки
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

    <div
        class="flex min-h-screen flex-1 flex-col justify-center bg-gradient-to-br from-indigo-50 to-white px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
            <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" />
            <h2
                class="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl animate-slide-down">
                Sign up</h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
            <div
                class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 transition-all duration-300 hover:shadow-2xl animate-fade-in">
                <form class="space-y-6" @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div class="relative">
                            <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
                            <div class="mt-1">
                                <input v-model="form.firstName" @blur="validateFirstName" id="firstName"
                                    name="firstName" type="text" placeholder="Enter your first name" required
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                <svg v-if="validFields.firstName" class="h-5 w-5 text-green-500 absolute right-2 top-8"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div class="relative">
                            <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                            <div class="mt-1">
                                <input v-model="form.lastName" @blur="validateLastName" id="lastName" name="lastName"
                                    type="text" placeholder="Enter your last name" required
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                <svg v-if="validFields.lastName" class="h-5 w-5 text-green-500 absolute right-2 top-8"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="relative">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1">
                            <input v-model="form.email" @blur="validateEmail" id="email" name="email" type="email"
                                placeholder="Enter your email address" autocomplete="email" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <svg v-if="validFields.email" class="h-5 w-5 text-green-500 absolute right-2 top-8"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                    </div>

                    <div class="relative">
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1 relative">
                            <input v-model="form.password" @blur="validatePassword" id="password" name="password"
                                placeholder="Enter your password" :type="showPassword ? 'text' : 'password'" required
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
                            <svg v-if="validFields.password" class="h-5 w-5 text-green-500 absolute right-10 top-2"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                    </div>

                    <div class="relative">
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm
                            Password</label>
                        <div class="mt-1 relative">
                            <input v-model="form.confirmPassword" @blur="validateConfirmPassword" id="confirmPassword"
                                name="confirmPassword" placeholder="Confirm your password"
                                :type="showConfirmPassword ? 'text' : 'password'" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                @click="showConfirmPassword = !showConfirmPassword">
                                <svg class="h-5 w-5 text-gray-400 hover:text-gray-500"
                                    :class="{ 'hidden': showConfirmPassword }" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <svg class="h-5 w-5 text-gray-400 hover:text-gray-500"
                                    :class="{ 'hidden': !showConfirmPassword }" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                        clip-rule="evenodd" />
                                    <path
                                        d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                            <svg v-if="validFields.confirmPassword"
                                class="h-5 w-5 text-green-500 absolute right-10 top-2"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}
                        </p>
                    </div>

                    <div>
                        <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile
                            Picture</label>
                        <div class="mt-1">
                            <input @change="form.profilePicture = $event.target.files[0]" id="profilePicture"
                                name="profilePicture" type="file" accept="image/*"
                                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                        </div>
                    </div>

                    <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">
                                    {{ errors.general }}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button type="submit" :disabled="isLoading"
                            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {{ isLoading ? 'Signing up...' : 'Sign up' }}
                        </button>
                    </div>
                </form>

                <p class="mt-6 text-center text-sm text-gray-600 animate-fade-in">
                    Already have an account?
                    {{ ' ' }}
                    <a @click="goToLogin" href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
                </p>
            </div>
        </div>
    </div>
</template>