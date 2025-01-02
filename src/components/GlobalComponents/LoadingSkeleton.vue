<template>
    <div class="space-y-6">
        <div v-for="n in 3" :key="n" class="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg animate-pulse">
            <div class="flex items-center space-x-8">
                <div class="w-48 h-48 bg-gray-200 rounded-2xl"></div>
                <div class="flex-1 space-y-4">
                    <div class="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                    <div class="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                    <div class="h-6 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
            </div>
        </div>
    </div>
</template>