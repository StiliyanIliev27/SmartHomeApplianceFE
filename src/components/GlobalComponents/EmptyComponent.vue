<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center">
        <div class="flex flex-col items-center gap-4">
            <div class="text-6xl">🛍️</div>
            <h3 class="text-2xl font-semibold text-gray-800">{{ title }}</h3>
            <p class="text-gray-600 max-w-md mx-auto">{{ description }}</p>
            <button @click="router.push('/shop')"
                class="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                Start Shopping
            </button>
        </div>
    </div>
</template>