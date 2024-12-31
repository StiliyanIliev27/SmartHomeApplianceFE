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
    data() {
        return {
            orderId: null
        }
    },
    created() {
        // Get the session_id from URL
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (sessionId) {
            this.toast.success('Payment successful!', {
                position: 'top-right',
                duration: 5000,
                icon: '✅'
            });
        }
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
                <div class="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                
                <h1 class="text-3xl font-bold text-gray-900 mb-4">
                    Payment Successful!
                </h1>
                
                <p class="text-gray-600 mb-8">
                    Thank you for your purchase. Your order has been processed successfully.
                </p>

                <div class="space-y-4">
                    <router-link 
                        to="/orders" 
                        class="block w-full py-3 px-4 text-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                        View Orders
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