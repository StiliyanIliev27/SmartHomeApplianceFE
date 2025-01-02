<script>
import NavBar from '../NavBar.vue';
import Footer from '../Footer.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import EmptyComponent from '../GlobalComponents/EmptyComponent.vue';
import ProfileHeader from '../GlobalComponents/ProfileHeader.vue';
import SpecialOfferBanner from '../HomePage/SpecialOfferBanner.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useToast } from 'vue-toastification';
import cartApi from '@/api/cartApi';
import orderApi from '@/api/orderApi';
import { loadStripe } from '@stripe/stripe-js';
import {
    DESCRIPTION_PROFILE_HEADER,
    DESCRIPTION_NULL_CART,
    TITLE_NULL_CART
} from '@/constants/globalConstants';
import LoadingSkeleton from '../GlobalComponents/LoadingSkeleton.vue';

export default {
    setup() {
        return { authStore: useAuthStore(), toast: useToast(), loadingStore: useLoadingStore() };
    },
    components: {
        NavBar,
        Footer,
        Chatbot,
        EmptyComponent,
        ProfileHeader,
        LoadingSkeleton,
        SpecialOfferBanner
    },
    data() {
        return {
            DESCRIPTION_PROFILE_HEADER,
            DESCRIPTION_NULL_CART,
            TITLE_NULL_CART,
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
            userFullName: '',
            userEmail: '',
            promoCode: '',
            discount: 0,
            discountPercentage: 0,
            isApplyingPromo: false,
            promoCodes: [{ code: '#HOLIDAY20', discount: 20 }],
            stripe: null,
            card: null,
            isProcessingPayment: false,
            windowWidth: window.innerWidth
        }
    },
    async created() {
        try {
            this.loadingStore.setLoading(true);
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
            this.loadingStore.setLoading(false);
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
                this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                this.discount = 0;
                this.discountPercentage = 0;
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
                if (!this.discountPercentage) {
                    response = await orderApi.createCheckoutSession();
                } else {
                    response = await orderApi.createCheckoutSession(this.discountPercentage, this.promoCode);
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
                    this.discount = (promoCode.discount / 100) * this.totalPrice;
                    this.discountPercentage = promoCode.discount;
                    const response = await cartApi.getCart(this.discountPercentage);
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
    <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <!-- Navbar -->
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/90': scrolled }">
            <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
        </div>

        <Chatbot :user="authStore.user" />

        <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Cart Header -->
                <ProfileHeader :description="DESCRIPTION_PROFILE_HEADER" :totalPrice="totalPrice" />

                <!-- Loading Skeleton -->
                <LoadingSkeleton v-if="loadingStore.isLoading" />

                <!-- Empty Cart State -->
                <EmptyComponent v-else-if="cartItems.length === 0" :title="TITLE_NULL_CART"
                    :description="DESCRIPTION_NULL_CART" />

                <!-- Cart Items -->
                <div v-else class="space-y-6">
                    <div v-for="item in cartItems" :key="item.id" class="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl border border-white/20
                               transform hover:-translate-y-1 transition-all duration-300">
                        <div class="flex items-center space-x-8">
                            <div
                                class="relative overflow-hidden rounded-2xl group-hover:shadow-2xl transition-all duration-300">
                                <img :src="item.image" :alt="item.name"
                                    class="w-48 h-48 object-cover transform group-hover:scale-110 transition-transform duration-500">
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ item.name }}</h3>
                                        <span
                                            class="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                                            {{ item.category }}
                                        </span>
                                    </div>
                                    <button @click="removeFromCart(item.id)"
                                        class="p-3 text-red-600 rounded-xl hover:bg-red-50 transform hover:scale-110 transition-all duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="flex items-center justify-between mt-6">
                                    <div class="flex items-center space-x-6">
                                        <span class="text-3xl font-bold text-emerald-600">${{ item.price }}</span>
                                        <span class="text-lg bg-gray-100 px-4 py-2 rounded-xl">Qty: {{ item.quantity
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Checkout Section -->
                    <div class="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
                        <!-- Promo Code Section -->
                        <div class="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                            <h3 class="text-xl font-bold text-emerald-700 mb-4">Promotional Code</h3>
                            <div class="flex space-x-4">
                                <input v-model="promoCode" type="text" placeholder="Enter your code" class="flex-1 px-6 py-4 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 
                                           focus:ring focus:ring-emerald-200 transition-all duration-200">
                                <button @click="applyPromoCode" :disabled="isApplyingPromo"
                                    class="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 
                                           transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ isApplyingPromo ? 'Applying...' : 'Apply Code' }}
                                </button>
                            </div>
                            <div v-if="discount > 0" class="mt-4 text-lg text-emerald-700 font-medium">
                                Discount applied: -${{ discount.toFixed(2) }}
                            </div>
                        </div>

                        <!-- Total Amount -->
                        <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                            <span class="text-2xl font-bold text-gray-900">Total Amount</span>
                            <div class="text-right">
                                <span v-if="discount > 0" class="block text-lg text-gray-500 line-through">
                                    ${{ totalPrice }}
                                </span>
                                <span class="text-3xl font-black text-emerald-600">${{ finalPrice.toFixed(2) }}</span>
                            </div>
                        </div>

                        <!-- Checkout Button -->
                        <button @click="checkout" :disabled="isProcessingPayment" class="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl font-bold 
                                   rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transform hover:scale-[1.02] 
                                   transition-all duration-300 flex items-center justify-center space-x-3 
                                   disabled:opacity-50 disabled:cursor-not-allowed">
                            <span>{{ isProcessingPayment ? 'Processing Payment...' : 'Proceed to Checkout' }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <SpecialOfferBanner :goToShop="goToShop" :discountCode="'#HOLIDAY20'"
            :discountPercentage="20"
        class="animate-fade-in transform hover:scale-105 transition-all duration-500" />
    </div>
    <Footer />
</template>