<script>
export default {
    data() {
        return {
            email: localStorage.getItem('pendingConfirmationEmail') || ''
        }
    },
    mounted() {
        // Start polling for confirmation status
        this.checkConfirmationStatus();
    },
    methods: {
        async checkConfirmationStatus() {
            try {
                const response = await fetch(`/auth/check-confirmation?email=${this.email}`);
                const data = await response.json();
                
                if (data.isConfirmed) {
                    // Clear stored email
                    localStorage.removeItem('pendingConfirmationEmail');
                    // Redirect to home page
                    this.$router.push('/');
                } else {
                    // Check again in 5 seconds
                    setTimeout(() => this.checkConfirmationStatus(), 5000);
                }
            } catch (error) {
                console.error('Error checking confirmation status:', error);
            }
        }
    }
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Check your email</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    We've sent a confirmation email to
                    <span class="font-medium text-indigo-600">{{ email }}</span>
                </p>
            </div>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div class="space-y-6">
                    <div class="bg-indigo-50 p-4 rounded-md">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-indigo-800">Next steps:</h3>
                                <div class="mt-2 text-sm text-indigo-700">
                                    <ul class="list-disc pl-5 space-y-1">
                                        <li>Check your email inbox</li>
                                        <li>Click the confirmation link in the email</li>
                                        <li>Return to this page after confirming</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>