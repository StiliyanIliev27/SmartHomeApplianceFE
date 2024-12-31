<script>
import NavBar from '../NavBar.vue';
import Footer from '../Footer.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from 'vue-toastification';

export default {
    components: {
        NavBar,
        Footer
    },
    setup() {
        return { 
            authStore: useAuthStore(),
            toast: useToast()
        };
    },
    created() {
        this.toast.error('Payment was cancelled', {
            position: 'top-right',
            duration: 5000,
            icon: '❌'
        });
    },
    methods: {
        handleSignOut() {
            this.authStore.logout();
            this.$router.push('/');
        }
    }
}
</script>

<template>
    <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
    
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-16">
        <div class="max-w-2xl mx-auto px-4">
            <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div class="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
                
                <h1 class="text-3xl font-bold text-gray-900 mb-4">
                    Payment Cancelled
                </h1>
                
                <p class="text-gray-600 mb-8">
                    Your payment was cancelled. Your cart items are still saved.
                </p>

                <div class="space-y-4">
                    <router-link 
                        to="/cart" 
                        class="block w-full py-3 px-4 text-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                        Return to Cart
                    </router-link>
                    
                    <router-link 
                        to="/shop" 
                        class="block w-full py-3 px-4 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Continue Shopping
                    </router-link>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>