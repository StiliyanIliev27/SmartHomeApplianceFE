<script>
import NavBar from './NavBar.vue'
import Chatbot from './HomePage/Chatbot.vue'
import Footer from './Footer.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { ref } from 'vue'

export default {
    name: 'Support',
    components: {
        NavBar,
        Chatbot,
        Footer
    },
    setup() {
        const selectedCategory = ref('general')
        const scrolled = ref(false)

        const handleScroll = () => {
            scrolled.value = window.scrollY > 20
        }

        return { 
            authStore: useAuthStore(), 
            chatStore: useChatStore(),
            selectedCategory,
            scrolled,
            handleScroll
        }
    },
    data() {
        return {
            faqCategories: [
                { id: 'general', name: 'General Questions', icon: '❓' },
                { id: 'orders', name: 'Orders & Shipping', icon: '📦' },
                { id: 'returns', name: 'Returns & Refunds', icon: '↩️' },
                { id: 'technical', name: 'Technical Support', icon: '🔧' }
            ],
            faqs: {
                general: [
                    { q: 'How do I create an account?', a: 'Click the "Sign Up" button in the top right corner and follow the instructions.' },
                    { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption to protect your data.' },
                    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers.' },
                    { q: 'Do you have a mobile app?', a: 'Not yet, but we\'re working on it! Stay tuned for updates.' }
                ],
                orders: [
                    { q: 'How long does shipping take?', a: '2-5 business days for domestic orders.' },
                    { q: 'Can I track my order?', a: 'Yes, you\'ll receive a tracking number via email once your order ships.' },
                    { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries. International shipping typically takes 7-14 business days.' },
                    { q: 'What are your shipping rates?', a: 'Domestic shipping is free for orders over $50. Standard shipping is $5.99.' }
                ],
                returns: [
                    { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unused items in original packaging.' },
                    { q: 'How do I initiate a return?', a: 'Log into your account, go to your orders, and click "Return Item".' },
                    { q: 'Who pays for return shipping?', a: 'We provide a free return shipping label for defective items. Otherwise, return shipping is customer responsibility.' },
                    { q: 'How long do refunds take?', a: 'Refunds are processed within 3-5 business days after we receive the returned item.' }
                ],
                technical: [
                    { q: 'How do I set up my smart home device?', a: 'Each device comes with a detailed setup guide. Basic steps: 1) Download our app 2) Connect device to power 3) Follow in-app instructions.' },
                    { q: 'What if my device won\'t connect to WiFi?', a: 'Try resetting the device and ensure you\'re using 2.4GHz WiFi network. For detailed troubleshooting, email us.' },
                    { q: 'Are your devices compatible with Alexa/Google Home?', a: 'Yes, all our devices are compatible with major smart home platforms.' },
                    { q: 'How do I update device firmware?', a: 'Firmware updates are automatic when connected to WiFi. You can check current version in device settings.' }
                ]
            }
        }
    },
    methods: {
        handleScroll() {
            this.scrolled = window.scrollY > 20
        },
        handleSignOut() {
            this.authStore.logout();
            this.$router.push('/');
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }
}
</script>

<template>
    <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/90': scrolled }">
            <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
        </div>

        <div class="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Hero Section -->
            <div class="text-center mb-16">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                <p class="text-lg text-gray-600 mb-8">Browse our frequently asked questions below. Can't find what you're looking for? Email us at homecraftwebapp@gmail.com</p>
            </div>

            <!-- Categories -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <button v-for="category in faqCategories" 
                        :key="category.id"
                        @click="selectedCategory = category.id"
                        class="p-6 rounded-xl transition-all duration-200 hover:scale-105"
                        :class="selectedCategory === category.id ? 'bg-emerald-100 shadow-lg' : 'bg-white shadow-md hover:shadow-lg'">
                    <div class="text-4xl mb-4">{{ category.icon }}</div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                </button>
            </div>

            <!-- FAQs -->
            <div class="max-w-3xl mx-auto">
                <div v-for="(faq, index) in faqs[selectedCategory]" 
                     :key="index"
                     class="mb-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <details class="group">
                        <summary class="flex justify-between items-center p-6 cursor-pointer">
                            <h3 class="text-lg font-medium text-gray-900">{{ faq.q }}</h3>
                            <span class="ml-6 flex-shrink-0 text-emerald-500 group-open:rotate-180 transition-transform">
                                ▼
                            </span>
                        </summary>
                        <div class="px-6 pb-6 text-gray-600">
                            {{ faq.a }}
                        </div>
                    </details>
                </div>
            </div>
        </div>

        <Chatbot :user="authStore.user" />
    </div>
    <Footer />
</template>