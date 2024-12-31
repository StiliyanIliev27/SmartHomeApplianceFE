<script>
import NavBar from '../NavBar.vue';
import Footer from '../Footer.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from 'vue-toastification';
import cartApi from '@/api/cartApi';
import orderApi from '@/api/orderApi';
import { loadStripe } from '@stripe/stripe-js';
import { nextTick } from 'vue';

export default {
    setup() {
        return { authStore: useAuthStore(), toast: useToast() };
    },
    components: {
        NavBar,
        Footer,
        Chatbot
    },
    data() {
        return {
            cartItems: [],
            categoryMapping: {
                'SecurityAndSurveillance': 'Security and Surveillance',
                'LightingAndAmbiance': 'Lighting and Ambiance', 
                'HeatingAndCooling': 'Heating and Cooling',
                'KitchenAppliances': 'Kitchen Appliances',
                'EntertainmentAndMedia': 'Entertainment and Media',
                'EnergyManagement': 'Energy Management',
                'CleaningAndHousehold': 'Cleaning and Household',
                'HealthAndFitness': 'Health and Fitness',
                'SmartHubsAndControllers': 'Smart Hubs and Controllers',
                'OutdoorAndGarden': 'Outdoor and Garden'
            },
            totalPrice: 0,
            isLoading: true,
            userFullName: '',
            userEmail: '',
            promoCode: '',
            discount: 0,
            isApplyingPromo: false,
            promoCodes: [{ code: 'SUMMER24', discount: 10 },
            { code: 'WELCOME25', discount: 15 },
            { code: 'CYBER25', discount: 20 }
            ],
            stripe: null,
            card: null,
            isProcessingPayment: false,
            windowWidth: window.innerWidth
        }
    },
    async created() {
        try {
            this.isLoading = true;
            const response = await cartApi.getCart();
            const result = response.data.result;
            this.cartItems = result.cartProducts.map(item => ({
                id: item.productId,
                name: item.productName,
                price: item.price,
                image: item.imageUrl,
                quantity: item.quantity,
                category: this.categoryMapping[item.category] || item.category
            }));
            this.totalPrice = result.totalPrice;
            this.userFullName = result.userFullName;
            this.userEmail = result.userEmail;

            this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

            this.toast.success('Cart items loaded', {
                position: 'top-right',
                duration: 3000,
                icon: '🛍️'
            });
            this.isLoading = false;
        } catch (error) {
            if (error.response.data.errorMessages[0].includes('Cart for user')) {
                this.totalPrice = 0;
                this.userFullName = this.authStore.user.name;
                this.userEmail = this.authStore.user.email;
                return;
            } else {
                this.toast.error(error.response.data.errorMessages[0], {
                    position: 'top-right',
                    duration: 3000
                });
            }
        } finally {
            this.isLoading = false;
        }

        // Add resize event listener
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        // Remove resize event listener
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.windowWidth = window.innerWidth;
        },
        handleSignOut() {
            this.authStore.logout();
            this.$router.push('/');
        },
        async removeFromCart(productId) {
            try {
                await cartApi.removeFromCart(productId);
                this.cartItems = this.cartItems.filter(item => item.id !== productId);
                this.toast.success('Item removed from cart');
            } catch (error) {
                this.toast.error('Failed to remove item');
            }
        },
        async checkout() {
            try {
                this.isProcessingPayment = true;
                
                // Get the checkout session URL from backend
                let response;
                if (!this.discount) {
                    response = await orderApi.createCheckoutSession();
                } else {
                    response = await orderApi.createCheckoutSession(this.discount);
                }

                const { url } = response.data;

                // Redirect to Stripe Checkout
                window.location.href = url;

            } catch (error) {
                this.toast.error(error.message || 'Checkout failed');
            } finally {
                this.isProcessingPayment = false;
            }
        },
        async applyPromoCode() {
            if (!this.promoCode) {
                this.toast.error('Please enter a promotion code');
                return;
            }

            try {
                this.isApplyingPromo = true;
                const promoCode = this.promoCodes.find(code => code.code === this.promoCode);
                if (promoCode) {
                    this.discount = promoCode.discount;
                    const response = await cartApi.getCart(this.discount);
                    this.finalPrice = response.data.result.totalPrice;
                    this.toast.success('Promotion code applied successfully!');
                } else {
                    this.toast.error('Invalid promotion code');
                }
            } catch (error) {
                this.toast.error('Invalid promotion code');
            } finally {
                this.isApplyingPromo = false;
            }
        }
    },
    computed: {
        isAuthenticated() {
            return this.authStore.isAuthenticated
        },
        finalPrice() {
            return this.totalPrice - this.discount;
        },
        isMobile() {
            return this.windowWidth < 768;
        },
        isTablet() {
            return this.windowWidth >= 768 && this.windowWidth < 1024;
        },
        isDesktop() {
            return this.windowWidth >= 1024;
        }
    }
}
</script>

<template>
    <NavBar :is-authenticated="isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
    <Chatbot :user="authStore.user" />

    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div
                class="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                <div>
                    <h1
                        class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Your Shopping Cart
                    </h1>
                    <p v-if="authStore.isAuthenticated" class="text-sm sm:text-base lg:text-lg text-gray-600">{{ userFullName }} <span
                            class="text-gray-400">({{ userEmail }})</span></p>
                </div>
                <div class="mt-4 md:mt-0 text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 bg-emerald-50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
                    ${{ totalPrice }}
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4 sm:space-y-6 lg:space-y-8">
                <div v-for="n in 3" :key="n" class="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg animate-pulse">
                    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                        <div class="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-xl"></div>
                        <div class="flex-1 space-y-4 sm:space-y-6">
                            <div class="h-4 sm:h-6 bg-gray-200 rounded-lg w-3/4"></div>
                            <div class="h-3 sm:h-4 bg-gray-200 rounded-lg w-1/2"></div>
                            <div class="h-3 sm:h-4 bg-gray-200 rounded-lg w-1/4"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty Cart -->
            <div v-if="!isLoading && cartItems.length === 0" class="text-center py-12 sm:py-16 lg:py-20 bg-white rounded-2xl shadow-lg">
                <div class="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6 animate-bounce">🛒</div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
                <p class="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">Time to discover amazing smart home products!</p>
                <router-link to="/shop"
                    class="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200">
                    Start Shopping
                </router-link>
            </div>

            <!-- Cart Items -->
            <div v-if="!isLoading && cartItems.length > 0" class="space-y-4 sm:space-y-6">
                <div v-for="item in cartItems" :key="item.id"
                    class="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                        <img :src="item.image" :alt="item.name" class="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-md">
                        <div class="flex-1 text-center sm:text-left">
                            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ item.name }}</h3>
                            <span
                                class="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium mb-3 sm:mb-4">
                                {{ item.category }}
                            </span>
                            <div
                                class="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 space-y-3 sm:space-y-0">
                                <div class="flex items-center space-x-4">
                                    <span class="text-2xl sm:text-3xl font-bold text-emerald-600">${{ item.price }}</span>
                                    <span class="text-base sm:text-lg text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg">Qty: {{
                                        item.quantity }}</span>
                                </div>
                                <button @click="removeFromCart(item.id)"
                                    class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                                    <span>Remove</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Checkout Section -->
                <div class="mt-8 sm:mt-12 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                    <!-- Promotion Code Section -->
                    <div class="mb-6 sm:mb-8 p-4 sm:p-6 bg-emerald-50 rounded-xl">
                        <h3 class="text-lg sm:text-xl font-bold text-emerald-700 mb-3 sm:mb-4">Have a Promotion Code?</h3>
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            <input v-model="promoCode" type="text" placeholder="Enter your code"
                                class="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <button @click="applyPromoCode" :disabled="isApplyingPromo"
                                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50">
                                {{ isApplyingPromo ? 'Applying...' : 'Apply' }}
                            </button>
                        </div>
                        <div v-if="discount > 0" class="mt-3 sm:mt-4 text-emerald-700">
                            Discount applied: -${{ discount.toFixed(2) }}
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                        <span class="text-xl sm:text-2xl font-bold text-gray-900">Total Amount</span>
                        <div class="text-center sm:text-right">
                            <span v-if="discount > 0" class="block text-base sm:text-lg text-gray-500 line-through">${{ totalPrice }}</span>
                            <span class="text-2xl sm:text-3xl font-extrabold text-emerald-600">${{ finalPrice.toFixed(2) }}</span>
                        </div>
                    </div>
                    <button @click="checkout" :disabled="isProcessingPayment"
                        class="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-base sm:text-lg font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50">
                        <span>{{ isProcessingPayment ? 'Processing...' : 'Proceed to Payment' }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>