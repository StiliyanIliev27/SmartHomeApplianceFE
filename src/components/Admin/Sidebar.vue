<script setup>
import { menuItems } from '@/router/index.js';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(false)

const isActiveRoute = (path) => {
    return route.path === path
}

const goToAdminPanel = () => {
    router.push('/admin')
}

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

</script>

<template>

    <button @click="toggleSidebar" class="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>

    <aside :class="[
        'bg-gradient-to-b from-white to-gray-50 shadow-xl h-screen fixed top-0 border-r border-gray-200 transition-all duration-300 z-10',
        'lg:w-60 lg:left-0',
        isSidebarOpen ? 'left-0 w-60' : '-left-60 w-60'
    ]">
        <div class="flex flex-col justify-between h-full">
            <div class="flex-grow">
                <div @click="goToAdminPanel"
                    class="px-6 py-8 text-center border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <h1
                        class="text-2xl font-extrabold leading-none bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        <span class="text-2xl">✨</span> Admin Panel
                    </h1>
                </div>
                <div class="p-4">
                    <ul class="space-y-2">
                        <li v-for="item in menuItems" :key="item.path">
                            <router-link :to="item.path" @click="isSidebarOpen = false"
                                class="flex items-center hover:bg-indigo-50 rounded-xl font-medium text-sm text-gray-600 py-3.5 px-4 transition-all duration-200 group"
                                :class="{ 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100': isActiveRoute(item.path) }">
                                <component :is="item.icon"
                                    class="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110"
                                    :class="{ 'text-indigo-600': isActiveRoute(item.path) }" />
                                {{ item.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </aside>

    <!-- Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden">
    </div>
</template>