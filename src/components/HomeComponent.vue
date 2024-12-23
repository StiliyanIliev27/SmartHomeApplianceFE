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
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import Chatbot from './HomePage/Chatbot.vue'
import SpecialOfferBanner from './HomePage/SpecialOfferBanner.vue'
import Footer from './Footer.vue'
import { productApi } from '@/api/productApi'
import { cartService } from '@/services/cartService'
import { cartApi } from '@/api/cartApi'

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
        Chatbot,
        SpecialOfferBanner,
        Footer
    },
    setup() {
        return { authStore: useAuthStore(), chatStore: useChatStore(), cartService: cartService }
    },
    data() {
        return {
            mobileMenuOpen: false,
            latestProducts: [],
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
                    discountPercentage: 20,
                    description: `Get 20% off when you buy 3 or more devices`,
                    code: '#HOLIDAY20',
                    validUntil: '2024-12-31'
                },
                {
                    title: 'Free Installation',
                    description: 'Professional installation included with premium packages',
                    code: '#FREEINSTALL',
                    validUntil: '2024-06-30'
                }
            ],
            scrolled: false,
            cartItems: [], // Added missing cartItems array
            user: null // Added missing user object
        }
    },
    methods: {
        async getLatestThreeProducts() {
            try {
                const response = await productApi.getLatestThreeProducts();
                this.latestProducts = response.data.result || [];
            } catch (error) {
                console.error('Error fetching latest products:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to load latest products',
                    type: 'error'
                });
            }
        },
        async clickAddToCart(productId, quantity) {
            if (!this.isAuthenticated) {
                this.goToLogin();
                return;
            }

            try {
                await this.cartService.addToCart(productId, quantity);
                this.$notify({
                    title: 'Success',
                    text: 'Product added to cart',
                    type: 'success'
                });
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to add product to cart',
                    type: 'error'
                });
            }
        },
        async handleUpdateCart(productId, newQuantity, type) {
            try {
                if (newQuantity < 1) {
                    // Премахване на продукта от количката
                    await cartService.removeFromCart(productId);
                } else {
                    // Актуализиране на количеството
                    await cartService.updateCart(productId, newQuantity);
                }

                // Получаване на актуалното състояние на количката
                const response = await cartApi.getCart();
                this.authStore.user.cartProducts = response.data.result.cartProducts;

                console.log('Cart updated successfully');
            } catch (error) {
                console.error('Error updating cart:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to update cart',
                    type: 'error'
                });
            }
        },
        closeMobileMenu() {
            this.mobileMenuOpen = false;
        },
        openMobileMenu() {
            this.mobileMenuOpen = true;
        },
        goToLogin() {
            this.$router.push('/login');
        },
        goToShop() {
            this.$router.push('/shop');
        },
        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                this.closeMobileMenu();
            }
        },
        async handleSignOut() {
            try {
                await this.authStore.logout();
                this.$router.push('/login');
                this.$notify({
                    title: 'Success',
                    text: 'Successfully logged out',
                    type: 'success'
                });
            } catch (error) {
                console.error('Error signing out:', error);
                this.$notify({
                    title: 'Error',
                    text: 'Failed to sign out',
                    type: 'error'
                });
            }
        },
        updateAuthStatus() {
            const user = this.authStore.user;
            this.user = user ? {
                name: user.name || '',
                email: user.email || '',
                id: user.id || '',
                profilePictureUrl: user.profilePictureUrl || '/default-user.png'
            } : null;
        },
        handleScroll() {
            this.scrolled = window.scrollY > 50; // Increased threshold for better UX
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
            });
        },
        applyDiscount(code) {
            const offer = this.specialOffers.find(offer => offer.code === code);
            if (!offer) {
                this.$notify({
                    title: 'Invalid Code',
                    text: 'Please enter a valid discount code',
                    type: 'error',
                    duration: 3000
                });
                return false;
            }

            const validUntil = new Date(offer.validUntil);
            if (validUntil < new Date()) {
                this.$notify({
                    title: 'Expired Code',
                    text: 'This discount code has expired',
                    type: 'error',
                    duration: 3000
                });
                return false;
            }

            this.$notify({
                title: 'Success',
                text: 'Discount code applied successfully',
                type: 'success',
                duration: 3000
            });
            return true;
        },
        checkout() {
            if (!this.isAuthenticated) {
                this.goToLogin();
                return;
            }

            if (!this.cartItems.length) {
                this.$notify({
                    title: 'Empty Cart',
                    text: 'Please add items to your cart before checkout',
                    type: 'warning',
                    duration: 3000
                });
                return;
            }

            this.$router.push('/checkout');
        }
    },
    computed: {
        isAuthenticated() {
            return this.authStore.isAuthenticated;
        },
        userProfile() {
            return this.authStore.user || {
                name: '',
                email: '',
                id: '',
                profilePictureUrl: '/default-user.png'
            };
        }
    },
    async created() {
        await this.getLatestThreeProducts();
        const response = await cartApi.getCart();
        this.authStore.user.cartProducts = response.data.result.cartProducts;
    },
    async mounted() {
        this.updateAuthStatus();

        this.$watch(
            () => this.authStore.user,
            () => {
                this.updateAuthStatus();
            },
            { deep: true }
        );

        window.addEventListener('scroll', this.handleScroll, { passive: true });
        document.documentElement.style.scrollBehavior = 'smooth';

        // Add resize event listener for responsive design
        window.addEventListener('resize', this.handleResize, { passive: true });
        this.handleResize();
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.documentElement.style.scrollBehavior = '';
    }
}
</script>
<template>
    <div class="bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 font-poppins">
        <!-- Fixed Header section -->
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/10': scrolled }">
            <NavBar :is-authenticated="isAuthenticated" :user="authStore.user" @sign-out="handleSignOut"
                @update-cart="handleUpdateCart" />
        </div>

        <Chatbot :user="authStore.user" />

        <!-- Hero section with enhanced animations -->
        <div class="relative isolate pt-16">
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-800/90 via-teal-800/90 to-cyan-800/90 z-10">
                </div>
                <div class="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80"
                        alt="Smart Home Background"
                        class="h-full w-full object-cover object-center transform hover:scale-110 transition-all duration-1000 animate-ken-burns"
                        loading="lazy" />
                </div>
            </div>
            <div class="relative px-4 sm:px-6 pt-14 lg:px-8 z-20">
                <div class="mx-auto max-w-3xl py-24 sm:py-32 lg:py-48">
                    <div class="text-center animate-slide-up">
                        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white 
                            hover:scale-105 transition-transform duration-500 text-shadow-2xl font-montserrat leading-tight
                            animate-text-glow-enhanced bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white
                            drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                            Transform Your Home with Smart Technology
                        </h1>
                        <p class="mt-6 sm:mt-8 text-lg sm:text-xl leading-8 sm:leading-9 text-white font-light 
                            transition-all duration-500 animate-fade-in-delay-enhanced backdrop-blur-sm 
                            bg-white/10 p-6 rounded-xl shadow-2xl hover:bg-white/20 max-w-2xl mx-auto
                            border border-white/20">
                            Experience the future of home automation. Control your entire home from your smartphone,
                            save energy, and enhance your comfort and security.
                        </p>
                        <div class="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button @click="goToShop()" class="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 
                                px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-2xl hover:shadow-3xl 
                                hover:scale-110 transition-all duration-500 animate-pulse-slow-enhanced
                                border border-white/20 backdrop-blur-sm text-center cursor-pointer
                                hover:from-emerald-500 hover:to-teal-500 min-w-[200px]">
                                Shop Now
                            </button>
                            <button @click="scrollToSection('shop')" class="w-full sm:w-auto text-base sm:text-lg font-semibold leading-6 text-white 
                                hover:text-emerald-200 transition-all duration-500 group flex items-center justify-center
                                relative overflow-hidden px-8 py-4 rounded-xl hover:bg-white/10 cursor-pointer
                                hover:shadow-2xl border border-white/20 min-w-[200px]">
                                View Products
                                <span aria-hidden="true" class="ml-3 inline-block transition-transform duration-500 
                                    group-hover:translate-x-3 animate-float text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Special Offers Banner with enhanced styling -->
    <SpecialOfferBanner :goToShop="goToShop" :discountCode="specialOffers[0].code"
        :discountPercentage="specialOffers[0].discountPercentage"
        class="animate-fade-in transform hover:scale-105 transition-all duration-500" />

    <!-- Image Showcase Section with improved animations -->
    <div
        class="bg-gradient-to-br from-fuchsia-900 via-violet-900 to-indigo-900 py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div v-for="(image, index) in showcaseImages" :key="index" class="group relative overflow-hidden rounded-2xl transform hover:scale-105 
                        transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] cursor-pointer">
                    <div class="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img :src="image.src" :alt="image.alt" class="h-64 sm:h-80 lg:h-96 w-full object-cover transition duration-500 
                            group-hover:scale-110 filter group-hover:brightness-110" loading="lazy" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white transform translate-y-4 
                                group-hover:translate-y-0 transition-transform duration-300">
                            <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 
                                    bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                {{ image.title }}
                            </h3>
                            <p class="mt-2 text-sm sm:text-base text-gray-200 group-hover:text-white transition-colors">
                                {{ image.description }}
                            </p>
                            <div class="flex items-center mt-4 space-x-2">
                                <div class="flex">
                                    <span v-for="n in 5" :key="n"
                                        :class="[n <= image.rating ? 'text-yellow-300' : 'text-gray-500']"
                                        class="text-base sm:text-lg transform hover:scale-125 transition-transform cursor-pointer">★</span>
                                </div>
                                <span class="text-yellow-300 font-semibold group-hover:text-yellow-200">
                                    {{ image.rating }}/5
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Enhanced Features section with improved animations -->
    <div id="features"
        class="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-fuchsia-800 via-purple-800 to-indigo-800 relative">
        <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:text-center">
                <h2 class="text-base font-semibold leading-7 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
                        bg-clip-text text-transparent animate-pulse">Smart Features</h2>
                <p class="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-center 
                        bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent
                        hover:scale-105 transition-transform duration-300">
                    Everything you need to control your smart home
                </p>
            </div>
            <div class="mx-auto mt-12 sm:mt-16 lg:mt-20">
                <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="feature in features" :key="feature.name" class="flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 
                            group hover:bg-white/5 rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-lg">
                        <div class="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px]">
                            <div class="rounded-full bg-black/30 backdrop-blur-lg p-3 sm:p-4 
                                    group-hover:bg-black/50 transition-all duration-300">
                                <component :is="feature.icon" class="h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:scale-110 
                                        transition-transform" aria-hidden="true" />
                            </div>
                        </div>
                        <dt class="mt-4 font-bold text-lg sm:text-xl bg-gradient-to-r from-pink-400 to-purple-400 
                                bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                            {{ feature.name }}
                        </dt>
                        <dd class="mt-2 text-sm sm:text-base leading-7 text-gray-300 flex-grow
                                group-hover:text-white transition-colors">
                            {{ feature.description }}
                        </dd>
                        <div class="mt-4">
                            <a href="#learn-more" class="inline-flex items-center text-transparent bg-gradient-to-r 
                                    from-pink-400 to-purple-400 bg-clip-text hover:from-pink-300 
                                    hover:to-purple-300 transition-all duration-300 group cursor-pointer
                                    font-semibold">
                                Learn more
                                <span class="ml-2 transform group-hover:translate-x-2 
                                        transition-transform">→</span>
                            </a>
                        </div>
                    </div>
                </dl>
            </div>
        </div>
    </div>

    <!-- Popular Products Section with enhanced animations -->
    <div id="shop" class="bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900 
            py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r 
                        from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent
                        hover:scale-105 transition-transform duration-300">
                    Popular Products
                </h2>
            </div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="product in latestProducts" :key="product.name" class="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl 
                        p-4 sm:p-6 transform hover:scale-105 transition-all duration-300 
                        border border-white/10 hover:border-purple-500/50 
                        hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] cursor-pointer">
                    <div class="relative overflow-hidden rounded-lg">
                        <img :src="product.imageUrl" :alt="product.name" class="w-full h-40 sm:h-48 object-cover rounded-lg transform 
                                group-hover:scale-110 transition-transform duration-500 
                                filter group-hover:brightness-110" loading="lazy" />
                        <div class="absolute inset-0 bg-gradient-to-t from-purple-900/80 
                                to-transparent opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"></div>
                    </div>
                    <h3 class="mt-4 text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-400 
                            to-purple-400 bg-clip-text text-transparent group-hover:scale-105 
                            transition-transform">{{ product.name }}</h3>
                    <div class="flex items-center mt-2">
                        <div class="flex">
                            <span v-for="n in 5" :key="n"
                                :class="[n <= product.rating ? 'text-yellow-300' : 'text-gray-600']" class="text-base sm:text-lg cursor-pointer transform 
                                    hover:scale-125 transition-transform">★</span>
                        </div>
                        <span class="ml-2 text-gray-300 text-sm sm:text-base group-hover:text-white 
                                transition-colors">({{ product.reviews }} reviews)</span>
                    </div>
                    <p class="mt-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 
                            to-teal-400 bg-clip-text text-transparent group-hover:scale-105 
                            transition-transform">{{ product.price }}</p>
                    <button @click="clickAddToCart(product.id, 1)" :disabled="!product.stockQuantity" class="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 
                            text-white px-4 py-2 rounded-lg hover:from-purple-500 
                            hover:to-pink-500 transition-all duration-300 disabled:opacity-50 
                            disabled:hover:from-purple-600 disabled:hover:to-pink-600 
                            transform hover:scale-105 text-sm sm:text-base cursor-pointer
                            disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                            group-hover:translate-y-1">
                        {{ product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Testimonials Section with improved animations -->
    <div class="bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900 
            py-16 sm:py-24 lg:py-32 relative overflow-hidden">
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
    </div>

    <!-- Stats section -->
    <div
        class="bg-gradient-to-r from-fuchsia-800 via-purple-800 to-indigo-800 py-8 sm:py-12 md:py-16 lg:py-24 relative">
        <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-10 animate-sparkle"></div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <dl class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <div v-for="stat in stats" :key="stat.label" class="group flex flex-col gap-y-2 sm:gap-y-4 p-4 sm:p-6 rounded-lg bg-white/5 backdrop-blur-sm
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
    <Footer />
</template>
