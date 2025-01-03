<script setup>
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import { adminApi } from '../../api/adminApi'
import { ref, onMounted } from 'vue'

const dashboardData = ref({})
const recentActivities = ref([])
const topProducts = ref([])

onMounted(async () => {
    try {
        const response = await adminApi.getDashboardData()
        dashboardData.value = response.data.result
        
        // Simulated data for demo purposes
        const recentActivitiesResponse = await adminApi.getRecentActivities()
        recentActivities.value = recentActivitiesResponse.data

        topProducts.value = [
            { name: 'Product A', sales: 120, revenue: 2400 },
            { name: 'Product B', sales: 95, revenue: 1900 },
            { name: 'Product C', sales: 85, revenue: 1700 }
        ]
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    }
})
</script>

<template>
    <div class="min-h-screen bg-gray-50/50">
        <!-- Sidebar -->
        <Sidebar />

        <!-- Main Content -->
        <main class="ml-60 pt-16 max-h-screen overflow-auto">
            <!-- Navbar -->
            <Navbar />

            <!-- Content -->
            <div class="p-6">
                <!-- Welcome Message -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
                    <p class="text-gray-600">Here's what's happening in your store today</p>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm text-gray-500 mb-1">Total Users</div>
                                <div class="text-2xl font-bold text-gray-900">{{ dashboardData.totalUsersCount }}</div>
                            </div>
                            <div class="bg-indigo-50 p-3 rounded-full">
                                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm text-gray-500 mb-1">Revenue</div>
                                <div class="text-2xl font-bold text-gray-900">${{ dashboardData.totalRevenue }}</div>
                            </div>
                            <div class="bg-green-50 p-3 rounded-full">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm text-gray-500 mb-1">Orders</div>
                                <div class="text-2xl font-bold text-gray-900">{{ dashboardData.totalOrdersCount }}</div>
                            </div>
                            <div class="bg-blue-50 p-3 rounded-full">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm text-gray-500 mb-1">Products</div>
                                <div class="text-2xl font-bold text-gray-900">{{ dashboardData.totalProductsCount }}</div>
                            </div>
                            <div class="bg-purple-50 p-3 rounded-full">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Content -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Recent Activities -->
                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <h2 class="text-lg font-semibold mb-4">Recent Activities</h2>
                        <div class="space-y-4">
                            <div v-for="(activity, index) in recentActivities" :key="index" 
                                class="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p class="text-sm text-gray-800">{{ activity.activityDescription }}</p>
                                    <p class="text-xs text-gray-500">{{ activity.activityCreatedAt }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Products -->
                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <h2 class="text-lg font-semibold mb-4">Top Performing Products</h2>
                        <div class="space-y-4">
                            <div v-for="(product, index) in topProducts" :key="index" 
                                class="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p class="text-sm font-medium text-gray-800">{{ product.name }}</p>
                                    <p class="text-xs text-gray-500">Sales: {{ product.sales }} | Revenue: ${{ product.revenue }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <router-view></router-view>
            </div>
        </main>
    </div>
</template>