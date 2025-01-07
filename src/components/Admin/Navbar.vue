<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const isProfileMenuOpen = ref(false)
const isNotificationsOpen = ref(false)
const authStore = useAuthStore()

const goToHome = () => {
    router.push('/')
}

const toggleProfileMenu = () => {
    isProfileMenuOpen.value = !isProfileMenuOpen.value
    if (isProfileMenuOpen.value) {
        isNotificationsOpen.value = false
    }
}

const signOut = () => {
    authStore.logout()
    router.push('/login')
}

const toggleNotifications = () => {
    isNotificationsOpen.value = !isNotificationsOpen.value
    if (isNotificationsOpen.value) {
        isProfileMenuOpen.value = false
    }
}
</script>

<template>
    <nav class="fixed top-0 lg:left-60 left-0 right-0 z-10 bg-white h-16 border-b shadow-sm">
        <div class="px-4 lg:px-6 h-full flex items-center justify-between">
            <div class="flex items-center gap-2 lg:gap-4">
                <button 
                    @click="goToHome"
                    class="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                        />
                    </svg>
                    <span class="hidden lg:inline">Home</span>
                </button>
                <button class="text-gray-400 hover:text-gray-600 transition-colors duration-200 hidden lg:block">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            <div class="flex items-center gap-2 lg:gap-4">
                <div class="relative">
                    <button 
                        @click="toggleNotifications"
                        class="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-all duration-200"
                    >
                        <span class="sr-only">Notifications</span>
                        <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    
                    <!-- Notifications Dropdown -->
                    <div v-if="isNotificationsOpen" 
                        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div class="px-4 py-2 border-b border-gray-100">
                            <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div class="max-h-96 overflow-y-auto">
                            <!-- Add notifications here -->
                            <div class="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                                <p class="text-sm text-gray-600">No new notifications</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <button 
                        @click="toggleProfileMenu"
                        class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <img class="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200" 
                            src="https://ui-avatars.com/api/?name=Admin+User"
                            alt="Admin User" />
                        <span class="text-sm font-medium text-gray-700 hidden lg:inline">Admin</span>
                    </button>

                    <!-- Profile Dropdown -->
                    <div v-if="isProfileMenuOpen"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                            Profile Settings
                        </a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                            Account Settings
                        </a>
                        <div class="border-t border-gray-100 my-1"></div>
                        <a @click="signOut" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer">
                            Sign Out
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>