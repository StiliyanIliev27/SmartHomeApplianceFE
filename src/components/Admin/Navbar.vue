<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const goToHome = () => {
    router.push('/')
}
</script>

<template>
    <nav class="fixed top-0 left-60 right-0 z-10 bg-white h-16 border-b shadow-sm">
        <div class="px-6 h-full flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button 
                    @click="goToHome"
                    class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                        />
                    </svg>
                    <span>Home</span>
                </button>
                <button class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
            <div class="flex items-center gap-4">
                <button class="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-all duration-200">
                    <span class="sr-only">Notifications</span>
                    <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
                <button class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <img class="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200" 
                        src="https://ui-avatars.com/api/?name=Admin+User"
                        alt="Admin User" />
                    <span class="text-sm font-medium text-gray-700">Admin</span>
                </button>
            </div>
        </div>
    </nav>
</template>