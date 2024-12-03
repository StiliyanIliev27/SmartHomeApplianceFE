<script>
import { Dialog, DialogPanel } from '@headlessui/vue'
import {
    HomeIcon,
    LightBulbIcon,
    CogIcon,
    ShieldCheckIcon,
    DeviceTabletIcon,
    ChartBarIcon,
    ShoppingCartIcon,
    TagIcon,
    TruckIcon
} from '@heroicons/vue/24/outline'
import NavBar from './NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import Chatbot from './HomePage/Chatbot.vue'

export default {
    name: 'LandingPage',
    components: {
        NavBar,
        Dialog,
        DialogPanel,
        HomeIcon,
        LightBulbIcon,
        CogIcon,
        ShieldCheckIcon,
        ShoppingCartIcon,
        TagIcon,
        TruckIcon,
        Chatbot
    },
    setup() {
        const authStore = useAuthStore()
        const chatStore = useChatStore()
        return { authStore, chatStore }
    },
    data() {
        return {
            mobileMenuOpen: false,
            cartItems: [],
            features: [
                {
                    name: 'Smart Lighting',
                    description: 'Control your home lighting from anywhere. Set schedules, dim lights, and create perfect ambiance.',
                    icon: LightBulbIcon,
                    price: '$49.99',
                    inStock: true
                },
                {
                    name: 'Security',
                    description: 'Keep your home safe with smart cameras, door locks, and real-time notifications.',
                    icon: ShieldCheckIcon,
                    price: '$199.99',
                    inStock: true
                },
                {
                    name: 'Energy Management',
                    description: 'Monitor and optimize your energy usage. Save money while helping the environment.',
                    icon: ChartBarIcon,
                    price: '$149.99',
                    inStock: false
                },
                {
                    name: 'Mobile Control',
                    description: 'Control all your smart devices from our intuitive mobile app.',
                    icon: DeviceTabletIcon,
                    price: 'Free with device',
                    inStock: true
                }
            ],
            stats: [
                { value: '10K+', label: 'Active Users' },
                { value: '24/7', label: 'Support' },
                { value: '30%', label: 'Energy Savings' },
                { value: '99.9%', label: 'Uptime' }
            ],
            showcaseImages: [
                {
                    src: 'https://images.unsplash.com/photo-1558002038-1055907df827',
                    alt: 'Smart Home Living Room',
                    title: 'Modern Living',
                    description: 'Experience comfort and convenience',
                    price: '$299.99',
                    rating: 4.8
                },
                {
                    src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd',
                    alt: 'Smart Security System',
                    title: 'Advanced Security',
                    description: 'Keep your home safe 24/7',
                    price: '$399.99',
                    rating: 4.9
                },
                {
                    src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
                    alt: 'Energy Management',
                    title: 'Energy Efficient',
                    description: 'Save energy and reduce costs',
                    price: '$249.99',
                    rating: 4.7
                }
            ],
            testimonials: [
                {
                    content: "The smart home system has completely transformed how I live. Everything is just a tap away!",
                    author: "Sarah Johnson",
                    role: "Homeowner",
                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                    rating: 5,
                    verifiedPurchase: true
                },
                {
                    content: "Best investment I've made for my home. The energy savings alone made it worth it!",
                    author: "Michael Chen",
                    role: "Tech Enthusiast",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                    rating: 4,
                    verifiedPurchase: true
                },
                {
                    content: "The security features give me peace of mind when I'm away from home.",
                    author: "Emily Rodriguez",
                    role: "Business Owner",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                    rating: 5,
                    verifiedPurchase: true
                },
                {
                    content: "Setup was incredibly easy and the customer support is fantastic!",
                    author: "David Wilson",
                    role: "Smart Home Expert",
                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                    rating: 5,
                    verifiedPurchase: true
                },
                {
                    content: "The automation features have made my daily routines so much smoother.",
                    author: "Lisa Thompson",
                    role: "Interior Designer",
                    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
                    rating: 4,
                    verifiedPurchase: true
                },
                {
                    content: "Incredible value for money. My home feels like it's from the future!",
                    author: "James Anderson",
                    role: "Early Adopter",
                    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
                    rating: 5,
                    verifiedPurchase: true
                }
            ],
            popularProducts: [
                {
                    name: 'Smart Doorbell Pro',
                    price: '$129.99',
                    image: 'https://images.ctfassets.net/v6awd0kabi65/5Sw0Nt2dn8zUeMF2MSfPAb/224aca6d04ba5842c840f48ca5eb73f7/VDP_Carousel_1.jpg?w=1968&h=1553&fl=progressive&q=50&fm=jpg',
                    rating: 4.8,
                    reviews: 256,
                    inStock: true
                },
                {
                    name: 'Home Security Camera',
                    price: '$89.99',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeYY18zyMNvy8lYY10Ng-x9WKuoSetgAgLCw&s',
                    rating: 4.7,
                    reviews: 189,
                    inStock: true
                },
                {
                    name: 'Smart Thermostat',
                    price: '$159.99',
                    image: 'https://cdn.mos.cms.futurecdn.net/Ek2kyrb7BqbAZXepGvvVYL.jpg',
                    rating: 4.9,
                    reviews: 312,
                    inStock: false
                }
            ],
            specialOffers: [
                {
                    title: 'Holiday Bundle',
                    description: 'Get 20% off when you buy 3 or more devices',
                    code: 'HOLIDAY20',
                    validUntil: '2024-12-31'
                },
                {
                    title: 'Free Installation',
                    description: 'Professional installation included with premium packages',
                    code: 'FREEINSTALL',
                    validUntil: '2024-06-30'
                }
            ]
        }
    },
    methods: {
        closeMobileMenu() {
            this.mobileMenuOpen = false
        },
        openMobileMenu() {
            this.mobileMenuOpen = true
        },
        goToLogin() {
            this.$router.push('/login')
        },
        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId)
            element?.scrollIntoView({ behavior: 'smooth' })
            this.closeMobileMenu()
        },
        handleSignOut() {
            this.authStore.logout()
            this.$router.push('/login')
        },
        updateAuthStatus() {
            const user = this.authStore.user
            if (user) {
                this.user = {
                    name: user.name || '',
                    email: user.email || '',
                    id: user.id || '',
                    profilePictureUrl: user.profilePictureUrl || ''
                }
            } else {
                this.user = {
                    name: '',
                    email: '',
                    id: '',
                    profilePictureUrl: ''
                }
            }
        },
        addToCart(product) {
            if (!this.isAuthenticated) {
                this.goToLogin()
                return
            }
            
            if (!product.id) {
                product.id = Math.random().toString(36).substr(2, 9)
            }
            
            const existingProduct = this.cartItems.find(item => item.id === product.id)
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 1) + 1
            } else {
                this.cartItems.push({...product, quantity: 1})
            }

            // Show success notification
            this.$notify({
                title: 'Added to Cart',
                text: `${product.name} has been added to your cart`,
                type: 'success'
            })
        },
        removeFromCart(productId) {
            const index = this.cartItems.findIndex(item => item.id === productId)
            if (index > -1) {
                const item = this.cartItems[index]
                if (item.quantity > 1) {
                    item.quantity--
                } else {
                    this.cartItems.splice(index, 1)
                }
                
                // Show notification
                this.$notify({
                    title: 'Removed from Cart',
                    text: `Item has been removed from your cart`,
                    type: 'info'
                })
            }
        },
        applyDiscount(code) {
            const offer = this.specialOffers.find(offer => offer.code === code)
            if (!offer) {
                this.$notify({
                    title: 'Invalid Code',
                    text: 'Please enter a valid discount code',
                    type: 'error'
                })
                return false
            }
            
            const validUntil = new Date(offer.validUntil)
            if (validUntil < new Date()) {
                this.$notify({
                    title: 'Expired Code',
                    text: 'This discount code has expired',
                    type: 'error'
                })
                return false
            }
            
            this.$notify({
                title: 'Success',
                text: 'Discount code applied successfully',
                type: 'success'
            })
            return true
        },
        checkout() {
            if (!this.isAuthenticated) {
                this.goToLogin()
                return
            }
            
            if (this.cartItems.length === 0) {
                this.$notify({
                    title: 'Empty Cart',
                    text: 'Please add items to your cart before checkout',
                    type: 'warning'
                })
                return
            }
            
            this.$router.push('/checkout')
        }
    },
    computed: {
        isAuthenticated() {
            return this.authStore.isAuthenticated
        },
        userProfile() {
            return this.authStore.user || {
                name: '',
                email: '',
                id: '',
                profilePictureUrl: '/default-user.png'
            }
        }
    },
    mounted() {
        this.updateAuthStatus()
        
        // Watch for auth store changes
        this.$watch(
            () => this.authStore.user,
            () => {
                this.updateAuthStatus()
            },
            { deep: true }
        )

        // Add scroll event listener for navbar transparency
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeUnmount() {
        // Remove scroll event listener
        window.removeEventListener('scroll', this.handleScroll)
    }
}
</script>

<template>
    <div class="bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 min-h-screen font-poppins">
        <!-- Fixed Header section -->
        <div class="fixed top-0 w-full z-50 transition-all duration-300" 
             :class="{'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md': scrolled}">
            <NavBar 
                :is-authenticated="isAuthenticated" 
                :user="authStore.user" 
                :cart-items="cartItems"
                @sign-out="handleSignOut" />
        </div>

        <Chatbot :user="authStore.user"/>  

        <!-- Hero section with enhanced animations -->
        <div class="relative isolate pt-16">
            <div class="absolute inset-0">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 opacity-80 z-10">
                </div>
                <div class="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
                        alt="Smart Home Background"
                        class="h-full w-full object-cover object-center transform hover:scale-105 transition-all duration-700" />
                </div>
            </div>
            <div class="relative px-4 sm:px-6 pt-14 lg:px-8 z-20">
                <div class="mx-auto max-w-2xl py-24 sm:py-32 lg:py-48">
                    <div class="text-center animate-slide-up">
                        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white hover:scale-105 
                            transition-transform duration-300 text-shadow-xl font-montserrat leading-tight
                            animate-text-glow-enhanced">
                            Transform Your Home with Smart Technology
                        </h1>
                        <p
                            class="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-white font-light hover:text-white 
                            transition-colors duration-300 animate-fade-in-delay-enhanced backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                            Experience the future of home automation. Control your entire home from your smartphone,
                            save energy, and enhance your comfort and security.
                        </p>
                        <div
                            class="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
                            <button @click="scrollToSection('shop')" class="w-full sm:w-auto rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 
                                px-5 py-3 text-sm font-semibold text-white shadow-xl hover:shadow-2xl 
                                hover:scale-110 transition-all duration-300 animate-pulse-slow-enhanced
                                border border-white/20 backdrop-blur-sm text-center cursor-pointer">
                                Shop Now
                            </button>
                            <button @click="scrollToSection('features')" class="w-full sm:w-auto text-sm font-semibold leading-6 text-white 
                                hover:text-emerald-200 transition-colors duration-300 group flex items-center justify-center
                                relative overflow-hidden px-5 py-3 rounded-md hover:bg-white/10 cursor-pointer">
                                View Products
                                <span aria-hidden="true" class="ml-2 inline-block transition-transform 
                                    duration-300 group-hover:translate-x-2 animate-float">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Special Offers Banner -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 p-4 sm:p-6 relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-20 animate-sparkle"></div>
            <div class="max-w-7xl mx-auto text-center relative">
                <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 
                    transform hover:scale-105 transition-transform duration-300">
                    <span class="animate-bounce-rotate text-2xl hidden sm:inline">🎉</span>
                    <p class="text-white font-bold text-base sm:text-lg tracking-wide">
                        Limited Time Offer: Use code
                        <span class="inline-block bg-white/20 px-3 py-1 rounded-full font-mono border border-white/30 
                            shadow-glow my-2 sm:my-0">HOLIDAY20</span>
                        for 20% off on all products!
                        <button @click="scrollToSection('shop')" class="block sm:inline-flex mt-2 sm:mt-0 sm:ml-4 items-center px-4 py-2 rounded-full 
                            bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm group 
                            border border-white/30 justify-center transform hover:scale-105 cursor-pointer">
                            Shop Now
                            <span class="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </button>
                    </p>
                    <span class="animate-bounce-rotate text-2xl hidden sm:inline">🎉</span>
                </div>
            </div>
        </div>

        <!-- Image Showcase Section -->
        <div class="bg-gradient-to-br from-fuchsia-900 via-violet-900 to-indigo-900 py-16 sm:py-24 lg:py-32 relative">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="(image, index) in showcaseImages" :key="index" class="group relative overflow-hidden rounded-2xl transform hover:scale-105 
                        transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] cursor-pointer">
                        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <img :src="image.src" :alt="image.alt"
                            class="h-64 sm:h-80 lg:h-96 w-full object-cover transition duration-500 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white transform translate-y-4 
                                group-hover:translate-y-0 transition-transform duration-300">
                                <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 
                                    bg-clip-text text-transparent">{{ image.title }}</h3>
                                <p class="mt-2 text-sm sm:text-base text-gray-200">{{ image.description }}</p>
                                <div class="flex items-center mt-4 space-x-2">
                                    <div class="flex">
                                        <span v-for="n in 5" :key="n"
                                            :class="[n <= image.rating ? 'text-yellow-300' : 'text-gray-500']"
                                            class="text-base sm:text-lg transform hover:scale-125 transition-transform cursor-pointer">★</span>
                                    </div>
                                    <span class="text-yellow-300 font-semibold">{{ image.rating }}/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Features section -->
        <div id="features"
            class="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-fuchsia-800 via-purple-800 to-indigo-800 relative">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:text-center">
                    <h2 class="text-base font-semibold leading-7 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
                        bg-clip-text text-transparent animate-pulse">Smart Features</h2>
                    <p class="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-center 
                        bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                        Everything you need to control your smart home
                    </p>
                </div>
                <div class="mx-auto mt-12 sm:mt-16 lg:mt-20">
                    <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div v-for="feature in features" :key="feature.name" class="flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 
                            group hover:bg-white/5 rounded-xl p-4 sm:p-6 cursor-pointer">
                            <div
                                class="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px]">
                                <div
                                    class="rounded-full bg-black/30 backdrop-blur-lg p-3 sm:p-4 group-hover:bg-black/50 transition-all duration-300">
                                    <component :is="feature.icon" class="h-6 w-6 sm:h-8 sm:w-8 text-white"
                                        aria-hidden="true" />
                                </div>
                            </div>
                            <dt class="mt-4 font-bold text-lg sm:text-xl bg-gradient-to-r from-pink-400 to-purple-400 
                                bg-clip-text text-transparent">{{ feature.name }}</dt>
                            <dd class="mt-2 text-sm sm:text-base leading-7 text-gray-300 flex-grow">
                                {{ feature.description }}
                            </dd>
                            <div class="mt-4">
                                <a href="#learn-more"
                                    class="inline-flex items-center text-transparent bg-gradient-to-r from-pink-400 to-purple-400 
                                    bg-clip-text hover:from-pink-300 hover:to-purple-300 transition-all duration-300 group cursor-pointer">
                                    Learn more
                                    <span class="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                                </a>
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

        <!-- Popular Products Section -->
        <div class="bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900 py-16 sm:py-24 lg:py-32 relative">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r 
                        from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Popular Products
                    </h2>
                </div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="product in popularProducts" :key="product.name" class="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 
                        transform hover:scale-105 transition-all duration-300 border border-white/10 
                        hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] cursor-pointer">
                        <div class="relative overflow-hidden rounded-lg">
                            <img :src="product.image" :alt="product.name"
                                class="w-full h-40 sm:h-48 object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500" />
                            <div class="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <h3 class="mt-4 text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 
                            bg-clip-text text-transparent">{{ product.name }}</h3>
                        <div class="flex items-center mt-2">
                            <div class="flex">
                                <span v-for="n in 5" :key="n"
                                    :class="[n <= product.rating ? 'text-yellow-300' : 'text-gray-600']"
                                    class="text-base sm:text-lg cursor-pointer">★</span>
                            </div>
                            <span class="ml-2 text-gray-300 text-sm sm:text-base">({{ product.reviews }} reviews)</span>
                        </div>
                        <p class="mt-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                            bg-clip-text text-transparent">{{ product.price }}</p>
                        <button @click="addToCart(product)" :disabled="!product.inStock"
                            class="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg 
                            hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 
                            disabled:hover:from-purple-600 disabled:hover:to-pink-600 transform hover:scale-105 text-sm sm:text-base cursor-pointer">
                            {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Testimonials Section -->
        <div class="bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900 py-16 sm:py-24 lg:py-32 relative">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r 
                        from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        What Our Customers Say
                    </h2>
                </div>
                <div class="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="testimonial in testimonials" :key="testimonial.author"
                        class="group flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
                        backdrop-blur-lg p-4 sm:p-8 transform hover:scale-105 transition-all duration-300 
                        hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-white/10 hover:border-purple-500/50 cursor-pointer">
                        <div class="flex items-center mb-4 justify-between flex-wrap gap-2">
                            <div class="flex text-yellow-300">
                                <span v-for="n in testimonial.rating" :key="n"
                                    class="transform hover:scale-125 transition-transform text-base sm:text-lg cursor-pointer">★</span>
                            </div>
                            <span v-if="testimonial.verifiedPurchase" class="px-2 py-1 text-xs bg-gradient-to-r from-green-400 to-emerald-400 
                                text-white rounded-full">Verified Purchase</span>
                        </div>
                        <blockquote class="text-base sm:text-lg text-gray-300 italic">
                            "{{ testimonial.content }}"
                        </blockquote>
                        <div class="mt-6 flex items-center gap-x-4">
                            <div class="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-[2px]">
                                <img :src="testimonial.image" alt=""
                                    class="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" />
                            </div>
                            <div>
                                <div class="font-semibold text-sm sm:text-base bg-gradient-to-r from-pink-400 to-purple-400 
                                    bg-clip-text text-transparent">{{ testimonial.author }}</div>
                                <div class="text-xs sm:text-sm text-indigo-300">{{ testimonial.role }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats section -->
        <div class="bg-gradient-to-r from-fuchsia-800 via-purple-800 to-indigo-800 py-8 sm:py-12 md:py-16 lg:py-24 relative">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <dl class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div v-for="stat in stats" :key="stat.label" 
                        class="group flex flex-col gap-y-2 sm:gap-y-4 p-4 sm:p-6 rounded-lg bg-white/5 backdrop-blur-sm
                        hover:bg-white/10 transform hover:scale-105 transition-all duration-300 cursor-pointer">
                        <dt class="text-sm xs:text-base sm:text-lg leading-7 bg-gradient-to-r from-pink-400 to-purple-400 
                            bg-clip-text text-transparent font-semibold text-center">{{ stat.label }}</dt>
                        <dd class="order-first text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight 
                            bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent 
                            group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-indigo-300 
                            transition-all duration-300 text-center">
                            {{ stat.value }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <!-- Special Offers Section -->
        <div class="bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900 py-16 sm:py-24 lg:py-32 relative">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r 
                        from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Special Offers
                    </h2>
                </div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div v-for="offer in specialOffers" :key="offer.title" class="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-8 
                        transform hover:scale-105 transition-all duration-300 border border-white/10 
                        hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 
                            bg-clip-text text-transparent">{{ offer.title }}</h3>
                        <p class="mt-4 text-sm sm:text-base text-gray-300">{{ offer.description }}</p>
                        <div class="mt-6">
                            <span class="text-base sm:text-lg font-semibold text-indigo-300">Use code:</span>
                            <span class="ml-2 font-mono bg-gradient-to-r from-purple-600 to-pink-600 
                                px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white text-sm sm:text-base group-hover:from-purple-500 
                                group-hover:to-pink-500 transition-all duration-300">
                                {{ offer.code }}
                            </span>
                        </div>
                        <p class="mt-4 text-xs sm:text-sm text-indigo-300">
                            Valid until {{ new Date(offer.validUntil).toLocaleDateString() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gradient-to-br from-fuchsia-950 via-purple-950 to-indigo-950 relative"
            aria-labelledby="footer-heading">
            <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-5 animate-sparkle"></div>
            <h2 id="footer-heading" class="sr-only">Footer</h2>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 pt-12 sm:pt-16 lg:pt-20">
                <div class="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div class="space-y-8">
                        <p class="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-300">
                            Making the world better through smart home innovation.
                        </p>
                        <div class="flex space-x-6">
                            <!-- Social media links -->
                        </div>
                    </div>
                    <div class="mt-8 lg:mt-0 grid grid-cols-2 gap-8 lg:col-span-2">
                        <div class="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 class="text-sm font-semibold leading-6 bg-gradient-to-r from-pink-400 
                                    to-purple-400 bg-clip-text text-transparent">Solutions</h3>
                                <ul role="list" class="mt-6 space-y-4">
                                    <li>
                                        <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white 
                                            transition-colors duration-300 hover:translate-x-2 inline-block 
                                            hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 
                                            hover:to-purple-400 hover:bg-clip-text">
                                            Smart Lighting
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white 
                                            transition-colors duration-300 hover:translate-x-2 inline-block
                                            hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 
                                            hover:to-purple-400 hover:bg-clip-text">
                                            Security
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white 
                                            transition-colors duration-300 hover:translate-x-2 inline-block
                                            hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 
                                            hover:to-purple-400 hover:bg-clip-text">
                                            Energy Management
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="mt-8 md:mt-0">
                                <h3 class="text-sm font-semibold leading-6 bg-gradient-to-r from-pink-400 
                                    to-purple-400 bg-clip-text text-transparent">Support</h3>
                                <ul role="list" class="mt-6 space-y-4">
                                    <li>
                                        <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white 
                                            transition-colors duration-300 hover:translate-x-2 inline-block
                                            hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 
                                            hover:to-purple-400 hover:bg-clip-text">
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white 
                                            transition-colors duration-300 hover:translate-x-2 inline-block
                                            hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 
                                            hover:to-purple-400 hover:bg-clip-text">
                                            Guides
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="text-sm leading-6 text-gray-300 hover:text-white 
                                            transition-colors duration-300 hover:translate-x-2 inline-block
                                            hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 
                                            hover:to-purple-400 hover:bg-clip-text">
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 sm:mt-12 lg:mt-16 border-t border-white/10 pt-8">
                    <p class="text-xs leading-5 text-gray-400">&copy; 2024 HomeCraft, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

.font-montserrat {
    font-family: 'Montserrat', sans-serif;
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}

.text-shadow-xl {
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.shadow-glow {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
}

.animate-fade-in {
    animation: fadeIn 1s ease-in;
}

.animate-fade-in-delay-enhanced {
    animation: fadeInEnhanced 1.5s ease-in 0.7s backwards;
}

.animate-slide-up {
    animation: slideUp 1.2s ease-out;
}

.animate-text-glow-enhanced {
    animation: textGlowEnhanced 3s ease-in-out infinite alternate;
}

.animate-ken-burns {
    animation: kenBurns 20s ease infinite alternate;
}

.animate-pulse-slow-enhanced {
    animation: pulseSlowEnhanced 4s infinite;
}

.animate-bounce-rotate {
    animation: bounceRotate 2s infinite;
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-sparkle {
    animation: sparkle 4s linear infinite;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.5) rgba(17, 24, 39, 0.5);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(17, 24, 39, 0.5);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(139, 92, 246, 0.5);
    border-radius: 10px;
}

@keyframes fadeInEnhanced {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes textGlowEnhanced {
    0% {
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
            0 0 20px rgba(255, 255, 255, 0.3);
    }

    100% {
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
            0 0 30px rgba(255, 255, 255, 0.6),
            0 0 40px rgba(255, 255, 255, 0.4);
    }
}

@keyframes pulseSlowEnhanced {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
}

@keyframes bounceRotate {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(10deg);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

@keyframes sparkle {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 200% 200%;
    }
}

/* Rest of the existing animations */

.group:hover img {
    transform: scale(1.05);
}

@media (max-width: 640px) {
    .hero-text {
        font-size: 2.5rem;
    }
}
</style>
