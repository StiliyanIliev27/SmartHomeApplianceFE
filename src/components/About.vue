<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Footer from './Footer.vue'
import NavBar from './NavBar.vue'
import Chatbot from './HomePage/Chatbot.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const teamMembers = ref([
    {
        name: 'Stiliyan Iliev',
        role: 'CEO & Founder',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        bio: 'Full-Stack Software Developer with .NET and Vue.js expertise. Passionate about creating innovative smart home solutions that enhance people\'s lives.',
        social: {
            linkedin: 'https://www.linkedin.com/in/stiliyan-iliev-55879a295/',
            github: 'https://github.com/StiliyanIliev27',
        },
        achievements: [
            'Led development of HomeCraft platform from concept to launch',
            'Designed scalable cloud architecture serving 10,000+ users', 
            'Implemented industry-leading security practices',
            'Developed comprehensive e-commerce platform',
            'Created intuitive user interfaces'
        ]
    }
])

const stats = ref([
    { label: 'Happy Customers', value: '10,000+', icon: '😊', color: 'from-emerald-400 to-teal-500' },
    { label: 'Products Sold', value: '50,000+', icon: '📦', color: 'from-blue-400 to-indigo-500' },
    { label: 'Countries Served', value: '25+', icon: '🌎', color: 'from-purple-400 to-pink-500' },
    { label: 'Support Team', value: '24/7', icon: '💪', color: 'from-orange-400 to-red-500' }
])

const scrolled = ref(false)
const isVisible = ref(false)

const handleScroll = () => {
    scrolled.value = window.scrollY > 20
    isVisible.value = window.scrollY > 100
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    setTimeout(() => isVisible.value = true, 500)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/90': scrolled }">
            <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
        </div>
        <Chatbot :user="authStore.user" />

        <div class="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Hero Section -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center">
                        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-1/2 lg:pb-28 xl:pb-32">
                            <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div class="sm:text-center lg:text-left">
                                    <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl animate-fade-in-up">
                                        <span class="block bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">Making Homes</span>
                                        <span class="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-cyan-200">Smarter Together</span>
                                    </h1>
                                    <p class="mt-3 text-base text-emerald-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up delay-200">
                                        We're on a mission to transform everyday homes into intelligent living spaces. Our
                                        innovative smart home solutions combine cutting-edge technology with user-friendly
                                        design.
                                    </p>
                                </div>
                            </main>
                        </div>
                        <div class="hidden lg:block lg:w-1/2">
                            <img src="https://images.unsplash.com/photo-1558002038-1055907df827" alt="Smart Home Technology" 
                                 class="object-cover h-full w-full rounded-l-3xl animate-fade-in-up" />
                        </div>
                    </div>
                </div>
                <div class="absolute right-0 top-0 h-full w-1/2 bg-[url('/hero-pattern.svg')] opacity-10 animate-pulse lg:hidden"></div>
            </div>

            <!-- Stats Section -->
            <div class="mt-16 rounded-3xl bg-white/80 backdrop-blur-lg shadow-xl transform hover:shadow-2xl transition-all duration-500">
                <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
                        <div v-for="stat in stats" :key="stat.label" 
                             class="text-center p-6 rounded-xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                             :class="stat.color">
                            <div class="text-5xl mb-3 animate-bounce">{{ stat.icon }}</div>
                            <p class="text-3xl font-extrabold text-white">{{ stat.value }}</p>
                            <p class="mt-2 text-sm font-medium text-white/90">{{ stat.label }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team and Features Section -->
            <div class="mt-16 flex flex-col lg:flex-row gap-8">
                <!-- Team Section -->
                <div class="w-full lg:w-1/2 rounded-3xl bg-white/80 backdrop-blur-lg shadow-xl transform hover:shadow-2xl transition-all duration-500">
                    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div class="text-center">
                            <h2 class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 sm:text-4xl">Meet Our Team</h2>
                            <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                                Dedicated professionals working to make your home smarter and life easier.
                            </p>
                        </div>
                        <div class="mt-12">
                            <div v-for="member in teamMembers" :key="member.name"
                                 class="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl shadow-lg overflow-hidden 
                                        transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                                <div class="relative group">
                                    <img class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" :src="member.image" :alt="member.name">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                </div>
                                <div class="p-6 bg-white/90 backdrop-blur-sm">
                                    <h3 class="text-xl font-bold text-gray-900">{{ member.name }}</h3>
                                    <p class="text-sm font-semibold text-emerald-600">{{ member.role }}</p>
                                    <p class="mt-3 text-base text-gray-600">{{ member.bio }}</p>
                                    
                                    <!-- Added achievements section -->
                                    <div v-if="member.achievements.length > 0" class="mt-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div class="flex items-center gap-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M5 3a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-9-1.43V7a2 2 0 012-2h2V3zm-4 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm2 0a1 1 0 011-1h10a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clip-rule="evenodd" />
                                            </svg>
                                            <p class="text-sm font-semibold text-emerald-700">Key Achievements</p>
                                        </div>
                                        <ul class="space-y-2">
                                            <li v-for="achievement in member.achievements" 
                                                :key="achievement" 
                                                class="flex items-start gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                                                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
                                                <span>{{ achievement }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mt-4 flex space-x-4">
                                        <a :href="member.social.linkedin" target="_blank" class="text-gray-400 hover:text-emerald-500 transition-colors duration-300">
                                            <i class="fab fa-linkedin text-xl"></i>
                                        </a>
                                        <a :href="member.social.github" target="_blank" class="text-gray-400 hover:text-emerald-500 transition-colors duration-300">
                                            <i class="fab fa-github text-xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="w-full lg:w-1/2 flex flex-col gap-8">
                    <div class="flex-1 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl p-8 transform hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                        <div class="relative">
                            <div class="absolute -top-12 right-0 text-6xl text-emerald-400 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                                🎯
                            </div>
                            <h3 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 mb-6">Our Mission</h3>
                            <p class="text-gray-700 leading-relaxed text-lg relative z-10">
                                To revolutionize home living through innovative smart technology solutions that enhance comfort, security, and efficiency for every household.
                            </p>
                        </div>
                    </div>

                    <div class="flex-1 rounded-3xl bg-gradient-to-br from-cyan-50 to-emerald-50 shadow-xl p-8 transform hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <h3 class="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                            <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Our Values</span>
                            <div class="flex-grow h-0.5 bg-gradient-to-r from-emerald-200 to-transparent ml-4"></div>
                        </h3>
                        <ul class="list-none space-y-6">
                            <li class="flex items-center text-gray-700 transform hover:translate-x-2 transition-transform duration-300">
                                <span class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                                    <i class="fas fa-lightbulb text-emerald-500"></i>
                                </span>
                                <span class="text-lg">Innovation in Every Product</span>
                            </li>
                            <li class="flex items-center text-gray-700 transform hover:translate-x-2 transition-transform duration-300">
                                <span class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                                    <i class="fas fa-heart text-teal-500"></i>
                                </span>
                                <span class="text-lg">Customer Satisfaction First</span>
                            </li>
                            <li class="flex items-center text-gray-700 transform hover:translate-x-2 transition-transform duration-300">
                                <span class="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M4.553 10.276a.75.75 0 01.223-1.032L9.5 6.5l4.724 2.744a.75.75 0 11-.754 1.296L9.5 8.132l-4.223 2.456a.75.75 0 01-1.032-.223.75.75 0 01.223-1.032l4.724-2.744L4.553 3.776a.75.75 0 01-.223-1.032.75.75 0 011.032-.223L9.5 4.868l4.223-2.456a.75.75 0 01.754 1.296L10.5 6.5l4.724 2.744a.75.75 0 01-.754 1.296L10.5 8.132 6.277 10.588a.75.75 0 01-1.032-.223.75.75 0 01.223-1.032l4.724-2.744-4.724-2.744a.75.75 0 01-.223-1.032z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                                <span class="text-lg">Sustainable Solutions</span>
                            </li>
                            <li class="flex items-center text-gray-700 transform hover:translate-x-2 transition-transform duration-300">
                                <span class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                                <span class="text-lg">Continuous Improvement</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>