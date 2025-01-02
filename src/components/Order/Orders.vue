<script setup>
import NavBar from '../NavBar.vue'
import Footer from '../Footer.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import EmptyComponent from '../GlobalComponents/EmptyComponent.vue';
import ProfileHeader from '../GlobalComponents/ProfileHeader.vue';
import LoadingSkeleton from '../GlobalComponents/LoadingSkeleton.vue';
import SpecialOfferBanner from '../HomePage/SpecialOfferBanner.vue';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { useLoadingStore } from '../../stores/useLoadingStore';
import { ref, onMounted } from 'vue';
import orderApi from '../../api/orderApi'; // Fixed import
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { generateOrdersPDF } from '@/utils/pdfGenerator';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();
const loadingStore = useLoadingStore();
const orders = ref([]);
const toast = useToast();
const scrolled = ref(false); // Added missing ref

const DESCRIPTION_PROFILE_HEADER = "Track your orders and account";
const DESCRIPTION_NULL_ORDERS = "Looks like you haven't placed any orders yet. Start shopping to see your orders here!";
const TITLE_NULL_ORDERS = "No Orders Yet";

const quickActions = [
    {
        name: 'Contact Support',
        icon: '💬', 
        action: 'openSupport'
    },
    {
        name: 'Download Report',
        icon: '📊',
        action: 'downloadReport'
    }
];

const formatCurrency = (value) => { 
    return `$${value.toFixed(2)}`;
};

const goToShop = () => {
    router.push('/shop');
};

const fetchOrders = async () => {
    try {
        loadingStore.setLoading(true);
        const response = await orderApi.getMyOrders();
        orders.value = response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders', { // Added error toast
            position: 'top-right',
            duration: 3000
        });
    } finally {
        loadingStore.setLoading(false);
    }
};

const handleGeneratePDF = () => {
    const success = generateOrdersPDF(orders.value, authStore.user);
    
    if (!success) {
        toast.error('No orders found!', {
            position: 'top-right',
            duration: 3000,
            icon: '🛍️'
        });
    }
};

const handleQuickAction = (action) => {
    switch (action) {
        case 'openSupport':
            chatStore.toggleChat();
            break;
        case 'downloadReport':
            handleGeneratePDF();
            break;
    }
};

const handleSignOut = () => {
    authStore.logout();
    router.push('/');
};

// Added scroll handler
const handleScroll = () => {
    scrolled.value = window.scrollY > 0;
};

onMounted(() => {
    fetchOrders();
    window.addEventListener('scroll', handleScroll); // Added scroll listener
});

</script>

<template>
    <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/90': scrolled }">
            <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
        </div>
        <Chatbot :user="authStore.user" />

        <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Dashboard Header -->
                <ProfileHeader :description="DESCRIPTION_PROFILE_HEADER" :quickActions="quickActions" :handle-quick-action="handleQuickAction" />

                <!-- Loading State -->
                <LoadingSkeleton v-if="loadingStore.isLoading" />

                <!-- Empty State -->
                <EmptyComponent v-else-if="!orders.length" :title="TITLE_NULL_ORDERS" 
                    :description="DESCRIPTION_NULL_ORDERS" />

                <!-- Orders Table -->
                <div v-else class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
                    <div class="p-4 sm:p-6 overflow-x-auto">
                        <table class="w-full divide-y divide-gray-200">
                            <thead class="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                                <tr>
                                    <th scope="col" class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" class="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" class="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" class="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Payment Status
                                    </th>
                                    <th scope="col" class="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                        Order Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-100">
                                <tr v-for="order in orders" :key="order.orderId" 
                                    class="hover:bg-emerald-50/50 transition-colors duration-200">
                                    <td class="px-4 sm:px-6 py-4">
                                        <span class="text-sm font-medium text-emerald-600">#{{ order.orderId }}</span>
                                    </td>
                                    <td class="hidden sm:table-cell px-6 py-4">
                                        <span class="text-sm text-gray-600">{{ order.orderDate }}</span>
                                    </td>
                                    <td class="hidden md:table-cell px-6 py-4">
                                        <div class="flex items-center space-x-3">
                                            <img :src="order.customerProfilePicture" alt="Customer Profile Picture" class="w-8 h-8 rounded-full object-cover">
                                            <span class="text-sm font-medium text-gray-700">{{ order.customer }}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4">
                                        <div class="flex flex-col space-y-1.5">
                                            <span v-for="(item, index) in order.products" :key="index" 
                                                  class="text-sm text-gray-600 flex items-center">
                                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
                                                {{ item.productName }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4">
                                        <span class="text-sm font-semibold text-emerald-700">{{ formatCurrency(order.totalPrice) }}</span>
                                    </td>
                                    <td class="hidden lg:table-cell px-6 py-4">
                                        <span class="px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center shadow-sm"
                                            :class="{
                                                'bg-gray-100 text-gray-700': order.paymentStatus === 'Pending',
                                                'bg-emerald-100 text-emerald-700': order.paymentStatus === 'Completed',
                                                'bg-red-100 text-red-700': order.paymentStatus === 'Cancelled',
                                            }">
                                            <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                                                :class="{
                                                    'bg-gray-500': order.paymentStatus === 'Pending',
                                                    'bg-emerald-500': order.paymentStatus === 'Completed',
                                                    'bg-red-500': order.paymentStatus === 'Cancelled',
                                                }">
                                            </span>
                                            {{ order.paymentStatus }}
                                        </span>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4">
                                        <span class="px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center shadow-sm"
                                            :class="{
                                                'bg-gray-100 text-gray-700': order.orderStatus === 'Pending',
                                                'bg-amber-100 text-amber-700': order.orderStatus === 'Processing',
                                                'bg-blue-100 text-blue-700': order.orderStatus === 'Shipped',
                                                'bg-emerald-100 text-emerald-700': order.orderStatus === 'Delivered',
                                                'bg-red-100 text-red-700': order.orderStatus === 'Cancelled',
                                            }">
                                            <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                                                :class="{
                                                    'bg-gray-500': order.orderStatus === 'Pending',
                                                    'bg-amber-500': order.orderStatus === 'Processing',
                                                    'bg-blue-500': order.orderStatus === 'Shipped',
                                                    'bg-emerald-500': order.orderStatus === 'Delivered',
                                                    'bg-red-500': order.orderStatus === 'Cancelled',
                                                }">
                                            </span>
                                            {{ order.orderStatus }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <SpecialOfferBanner :goToShop="goToShop" :discountCode="'#HOLIDAY20'"
            :discountPercentage="20"
        class="animate-fade-in transform hover:scale-105 transition-all duration-500" />
    </div>

    <Footer />
</template>