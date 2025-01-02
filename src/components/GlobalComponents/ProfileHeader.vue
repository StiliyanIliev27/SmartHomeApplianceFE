<script setup>
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();

const props = defineProps({
    description: {
        type: String,
        required: true
    },
    quickActions: {
        type: Array,
        required: false
    },
    totalPrice:{
        type: Number,
        required: false
    },
    handleQuickAction: {
        type: Function,
        required: false
    }
});


</script>

<template>
    <div
        class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div class="relative">
                    <img :src="authStore.user?.profilePictureUrl || '/default-avatar.png'" :alt="authStore.user?.name"
                        class="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl object-cover shadow-lg ring-4 ring-emerald-100">
                    <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white">
                    </div>
                </div>
                <div class="text-center sm:text-left">
                    <h1
                        class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Welcome back, {{ authStore.user?.name }}
                    </h1>
                    <p class="text-gray-600 mt-1">{{ description }}</p>
                </div>
            </div>
            <div class="flex flex-wrap justify-center sm:justify-start gap-4">
                <button v-if="quickActions" v-for="action in quickActions" :key="action.name" @click="handleQuickAction(action.action)"
                    class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 
                                       bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 
                                       shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95">
                    <span class="mr-2">{{ action.icon }}</span>
                    {{ action.name }}
                </button>
                <div v-if="totalPrice >= 0" class="mt-6 md:mt-0">
                    <div class="text-3xl font-bold text-emerald-600 bg-emerald-50/80 px-8 py-4 rounded-2xl shadow-inner">
                        ${{ totalPrice }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>