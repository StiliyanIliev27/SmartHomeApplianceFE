<script>
    export default{
        props: {
            goToShop: Function,
            discountCode: String,
            discountPercentage: Number
        },
        data() {
            return {
                remainingHours: 24,
                remainingMinutes: 0,
                remainingSeconds: 0
            }
        },
        mounted() {
            // Set initial end time 24 hours from now
            const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            
            // Update countdown every second
            this.timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = endTime - now;
                
                this.remainingHours = Math.floor((distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                this.remainingMinutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
                this.remainingSeconds = Math.floor((distance % (60 * 1000)) / 1000);
                
                if (distance < 0) {
                    clearInterval(this.timer);
                }
            }, 1000);
        },
        beforeUnmount() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        methods: {
            goToShop() {
                this.goToShop()
            }
        }
    }
</script>

<template>
    <div class="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-2 sm:p-3 md:p-4 lg:p-5 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('/sparkles.png')] opacity-30 animate-sparkle"></div>
        <div class="max-w-7xl mx-auto text-center relative">
            <div class="flex flex-col items-center gap-2">
                <!-- Mobile view (flex-col) -->
                <div class="flex flex-col items-center gap-2 px-2 sm:hidden">
                    <div class="flex items-center text-2xl sm:text-3xl animate-bounce-rotate">⚡️</div>
                    <p class="text-white font-bold text-xs sm:text-sm tracking-wider uppercase">
                        HURRY UP! Only {{ remainingHours }}h {{ remainingMinutes }}m {{ remainingSeconds }}s remaining!
                    </p>
                    <span class="bg-white/20 px-3 py-1.5 rounded-lg font-mono font-bold border-2 border-white/50 
                        shadow-glow text-white text-sm sm:text-base animate-pulse-slow-enhanced transform hover:scale-105 transition-transform">
                        {{ discountCode }}
                    </span>
                    <span class="bg-red-500/40 px-3 py-1.5 rounded-lg font-bold border-2 border-white/50 
                        shadow-glow text-white text-sm sm:text-base animate-text-glow-enhanced">
                        SAVE {{ discountPercentage }}% NOW!
                    </span>
                    <button @click="goToShop()" 
                        class="inline-flex items-center px-4 py-1.5 text-sm font-bold text-white bg-white/20 
                        border-2 border-white/30 rounded-md hover:bg-white/30 transition-all duration-200 hover:scale-105">
                        CLAIM OFFER NOW
                        <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <div class="flex items-center text-2xl sm:text-3xl animate-bounce-rotate">⚡️</div>
                </div>

                <!-- Tablet view -->
                <div class="hidden sm:flex md:hidden flex-wrap items-center justify-center gap-3 px-3">
                    <div class="flex items-center text-2xl animate-bounce-rotate">⚡️</div>
                    <p class="text-white font-bold text-sm tracking-wider uppercase">
                        HURRY UP! Only {{ remainingHours }}h {{ remainingMinutes }}m {{ remainingSeconds }}s remaining!
                    </p>
                    <span class="bg-white/20 px-3 py-1.5 rounded-lg font-mono font-bold border-2 border-white/50 
                        shadow-glow text-white text-base animate-pulse-slow-enhanced transform hover:scale-105 transition-transform">
                        {{ discountCode }}
                    </span>
                    <span class="bg-red-500/40 px-3 py-1.5 rounded-lg font-bold border-2 border-white/50 
                        shadow-glow text-white text-base animate-text-glow-enhanced">
                        SAVE {{ discountPercentage }}% NOW!
                    </span>
                    <button @click="goToShop()" 
                        class="inline-flex items-center px-5 py-2 text-base font-bold text-white bg-white/20 
                        border-2 border-white/30 rounded-md hover:bg-white/30 transition-all duration-200 group hover:scale-105">
                        CLAIM OFFER NOW
                        <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <div class="flex items-center text-2xl animate-bounce-rotate">⚡️</div>
                </div>

                <!-- Desktop view -->
                <div class="hidden md:flex items-center justify-center gap-4 px-4">
                    <div class="flex items-center text-3xl animate-bounce-rotate">⚡️</div>
                    <p class="text-white font-bold text-base lg:text-xl tracking-wider whitespace-nowrap uppercase">
                        HURRY UP! Only {{ remainingHours }}h {{ remainingMinutes }}m {{ remainingSeconds }}s remaining!
                    </p>
                    <span class="bg-white/20 px-4 py-2 rounded-lg font-mono font-bold border-2 border-white/50 
                        shadow-glow text-white text-base lg:text-lg animate-pulse-slow-enhanced transform hover:scale-105 transition-transform">
                        {{ discountCode }}
                    </span>
                    <span class="bg-red-500/40 px-4 py-2 rounded-lg font-bold border-2 border-white/50 
                        shadow-glow text-white text-base lg:text-lg animate-text-glow-enhanced">
                        SAVE {{ discountPercentage }}% NOW!
                    </span>
                    <button @click="goToShop()" 
                        class="inline-flex items-center px-6 py-2 text-base font-bold text-white bg-white/20 
                        border-2 border-white/30 rounded-md hover:bg-white/30 transition-all duration-200 
                        group hover:scale-105">
                        CLAIM OFFER NOW
                        <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <div class="flex items-center text-3xl animate-bounce-rotate">⚡️</div>
                </div>

                <p class="text-white font-semibold text-xs sm:text-sm md:text-base italic animate-pulse px-2">
                    ⚠️ DON'T MISS OUT! This exclusive promo code is about to expire! Act now before it's gone forever! ⚠️
                </p>
            </div>
        </div>
    </div>
</template>