<script setup>
import { menuItems } from '@/router/index.js';
import { useRoute } from 'vue-router';

const route = useRoute()

const isActiveRoute = (path) => {
    return route.path === path
}
</script>

<template>
    <aside class="fixed inset-y-0 left-0 bg-white shadow-lg max-h-screen w-60">
        <div class="flex flex-col justify-between h-full">
            <div class="flex-grow">
                <div class="px-4 py-6 text-center border-b">
                    <h1 class="text-xl font-bold leading-none text-indigo-700">
                        <span class="text-2xl">✨</span> Admin Panel
                    </h1>
                </div>
                <div class="p-4">
                    <ul class="space-y-1">
                        <li v-for="item in menuItems" :key="item.path">
                            <router-link :to="item.path"
                                class="flex items-center bg-white hover:bg-indigo-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4"
                                :class="{ 'bg-indigo-50 text-indigo-700': isActiveRoute(item.path) }">
                                <component :is="item.icon" class="w-5 h-5 mr-3" />
                                {{ item.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </aside>
</template>