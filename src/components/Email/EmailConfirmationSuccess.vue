<script>
export default {
    data() {
        return {
            isConfirming: true,
            confirmationError: null
        }
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        const userId = urlParams.get('userId');

        if (token && userId) {
            try {
                const response = await fetch(`/api/Email/confirm-email?token=${token}&userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Email confirmation failed');
                }

                this.isConfirming = false;
            } catch (error) {
                console.error('Confirmation error:', error);
                this.confirmationError = error.message;
                this.isConfirming = false;
            }
        } else {
            this.confirmationError = 'Invalid confirmation link';
            this.isConfirming = false;
        }
    }
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="text-center">
                <!-- Loading State -->
                <div v-if="isConfirming" class="animate-spin mx-auto h-12 w-12 text-indigo-600">
                    <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>

                <!-- Success State -->
                <template v-else-if="!confirmationError">
                    <div class="mx-auto h-12 w-12 text-indigo-600 animate-bounce">
                        <svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Confirmed!</h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Your email has been successfully confirmed.
                    </p>
                </template>

                <!-- Error State -->
                <template v-else>
                    <div class="mx-auto h-12 w-12 text-red-600">
                        <svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Confirmation Failed</h2>
                    <p class="mt-2 text-center text-sm text-red-600">
                        {{ confirmationError }}
                    </p>
                </template>
            </div>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div class="text-center">
                    <p class="text-sm text-gray-600">
                        {{ !confirmationError ? 'You can now return to the website and log in with your account.' : 'Please try again or contact support if the problem persists.' }}
                    </p>
                    <div class="mt-6">
                        <button @click="$router.push('/login')" 
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>