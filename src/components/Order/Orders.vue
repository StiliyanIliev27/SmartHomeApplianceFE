<script>
import NavBar from '../NavBar.vue'
import Footer from '../Footer.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';

export default {
    name: 'Orders',
    components: { NavBar, Footer, Chatbot },
    setup() {
        return {
            authStore: useAuthStore(),
            chatStore: useChatStore(),
            activeTab: ref('orders'),
            showStatsModal: ref(false),
            selectedTimeRange: ref('week'),
            salesChart: ref(null),
            orderStats: ref({
                total: 0,
                completed: 0,
                pending: 0,
                cancelled: 0
            }),
            recentActivity: ref([])
        };
    },
    data() {
        return {
            user: null,
            orders: [
                {
                    id: '1001',
                    date: '2024-03-15',
                    itemCount: 3,
                    total: 159.99,
                    status: 'Delivered',
                    items: ['Gaming Mouse', 'Keyboard', 'Mousepad'],
                    customerName: 'John Doe',
                    shippingAddress: '123 Main St, City, Country'
                },
                {
                    id: '1002',
                    date: '2024-03-14',
                    itemCount: 2,
                    total: 299.99,
                    status: 'Processing',
                    items: ['Smart Speaker', 'Security Camera'],
                    customerName: 'Jane Smith',
                    shippingAddress: '456 Oak Ave, Town, Country'
                },
                {
                    id: '1003',
                    date: '2024-03-14',
                    itemCount: 1,
                    total: 499.99,
                    status: 'Pending',
                    items: ['Smart TV'],
                    customerName: 'Mike Johnson',
                    shippingAddress: '789 Pine St, Village, Country'
                },
                {
                    id: '1004',
                    date: '2024-03-13',
                    itemCount: 4,
                    total: 249.99,
                    status: 'Shipped',
                    items: ['Smart Bulbs Pack', 'Motion Sensor', 'Door Lock', 'Smart Plug'],
                    customerName: 'Sarah Wilson',
                    shippingAddress: '321 Maple Rd, City, Country'
                },
                {
                    id: '1005',
                    date: '2024-03-12',
                    itemCount: 2,
                    total: 799.99,
                    status: 'Delivered',
                    items: ['Robot Vacuum', 'Air Purifier'],
                    customerName: 'Tom Brown',
                    shippingAddress: '654 Elm St, Town, Country'
                }
            ],
            currentPage: 1,
            perPage: 10,
            totalOrders: 10,
            dashboardStats: {
                totalRevenue: 5284.83,
                monthlyGrowth: 12.5,
                averageOrderValue: 245.96,
                customerSatisfaction: 4.8
            },
            notifications: [
                {
                    id: 1,
                    type: 'success',
                    message: 'New order #1001 received',
                    time: '2 minutes ago'
                },
                {
                    id: 2,
                    type: 'warning',
                    message: 'Low stock alert for Gaming Mouse',
                    time: '1 hour ago'
                }
            ],
            quickActions: [
                {
                    name: 'View Orders',
                    icon: '📦',
                    action: 'viewOrders'
                },
                {
                    name: 'Contact Support',
                    icon: '💬',
                    action: 'openSupport'
                }
            ]
        }
    },
    computed: {
        isAdmin() {
            return this.authStore.user?.role === 'admin';
        },
        orderStatusSummary() {
            return {
                pending: this.orders.filter(o => o.status === 'Pending').length,
                processing: this.orders.filter(o => o.status === 'Processing').length,
                shipped: this.orders.filter(o => o.status === 'Shipped').length,
                delivered: this.orders.filter(o => o.status === 'Delivered').length
            }
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        },
        async fetchOrders() {
            // Fetch only user's orders if not admin
            console.log('Fetching orders...');
        },
        async initializeCharts() {
            if (!this.isAdmin) return; // Only show charts for admin

            try {
                const ctx = document.getElementById('salesChart');
                if (ctx) {
                    this.salesChart = new Chart(ctx.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            datasets: [{
                                label: 'Sales',
                                data: [12, 19, 3, 5, 2, 3],
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        }
                    });
                }
            } catch (error) {
                console.error('Error initializing chart:', error);
            }
        },
        handleQuickAction(action) {
            switch (action) {
                case 'viewOrders':
                    this.activeTab = 'orders';
                    break;
                case 'openSupport':
                    this.chatStore.openChat();
                    break;
            }
        },
        setupWebSocket() {
            console.log('Setting up WebSocket...');
        },
        handleSignOut() {
            this.authStore.logout();
            this.$router.push('/login');
        }
    },
    async mounted() {
        try {
            await this.fetchOrders();
            await this.$nextTick();
            if (this.isAdmin) {
                this.initializeCharts();
            }
            this.setupWebSocket();
        } catch (error) {
            console.error('Error during component mount:', error);
        }
    }
}
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
                <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div class="flex items-center gap-6">
                            <div class="relative">
                                <img :src="authStore.user?.profilePictureUrl || '/default-avatar.png'"
                                    :alt="authStore.user?.name"
                                    class="w-20 h-20 rounded-2xl object-cover shadow-lg ring-4 ring-emerald-100">
                                <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Welcome back, {{ authStore.user?.name }}
                                </h1>
                                <p class="text-gray-600 mt-1">{{ isAdmin ? "Here's your store overview" : "Track your orders and account" }}</p>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-4">
                            <button v-for="action in quickActions" :key="action.name"
                                @click="handleQuickAction(action.action)"
                                class="inline-flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 
                                       bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 
                                       shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                                <span class="mr-2">{{ action.icon }}</span>
                                {{ action.name }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards - Only visible to admin -->
                <div v-if="isAdmin" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-800">Total Revenue</h3>
                            <span class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">↑ 12%</span>
                        </div>
                        <p class="mt-4 text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {{ formatCurrency(dashboardStats.totalRevenue) }}
                        </p>
                    </div>
                </div>

                <!-- Charts Section - Only visible to admin -->
                <div v-if="isAdmin" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <h3 class="text-xl font-semibold text-gray-800 mb-6">Sales Overview</h3>
                        <canvas id="salesChart" height="200"></canvas>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                        <h3 class="text-xl font-semibold text-gray-800 mb-6">Order Status</h3>
                    </div>
                </div>

                <!-- Main Content Tabs -->
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="border-b border-gray-200">
                        <nav class="flex">
                            <button v-for="tab in isAdmin ? ['orders', 'products', 'customers'] : ['orders']" :key="tab"
                                @click="activeTab = tab" 
                                class="relative px-8 py-4 text-sm font-medium transition-all duration-200"
                                :class="[
                                    activeTab === tab
                                        ? 'text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                ]">
                                {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                            </button>
                        </nav>
                    </div>

                    <!-- Orders Table -->
                    <div v-if="activeTab === 'orders'" class="p-6">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    <tr v-for="order in orders" :key="order.id" 
                                        class="hover:bg-gray-50 transition-colors duration-200">
                                        <td class="px-6 py-4">
                                            <span class="text-sm font-medium text-emerald-600">#{{ order.id }}</span>
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-500">
                                            {{ order.date }}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="text-sm font-medium text-gray-900">{{ order.customerName }}</span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex flex-col space-y-1">
                                                <span v-for="(item, index) in order.items" :key="index" 
                                                      class="text-sm text-gray-500">
                                                    {{ item }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(order.total) }}</span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="px-3 py-1 text-xs font-semibold rounded-full"
                                                :class="{
                                                    'bg-green-100 text-green-800': order.status === 'Delivered',
                                                    'bg-yellow-100 text-yellow-800': order.status === 'Processing',
                                                    'bg-blue-100 text-blue-800': order.status === 'Shipped',
                                                    'bg-gray-100 text-gray-800': order.status === 'Pending'
                                                }">
                                                {{ order.status }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>