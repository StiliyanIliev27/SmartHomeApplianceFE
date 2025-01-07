<script setup>
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import { adminApi } from '../../api/adminApi'
import { ref, onMounted } from 'vue'
import { generatePDF } from '../../utils/generateAdminDashboardPdf'

const dashboardData = ref({})
const recentActivities = ref([])
const topProducts = ref([])
const overallRating = ref(0)
const inventoryStatus = ref({})

const generateAdminDashboardPDF = () => {
    generatePDF(dashboardData, recentActivities, topProducts, overallRating, inventoryStatus)
}

onMounted(async () => {
    try {
        const response = await adminApi.getDashboardData()
        dashboardData.value = response.data.result
        
        // Simulated data for demo purposes
        const recentActivitiesResponse = await adminApi.getRecentActivities()
        recentActivities.value = recentActivitiesResponse.data

        const topProductsResponse = await adminApi.getTopProducts()
        topProducts.value = topProductsResponse.data       

        const overallRatingResponse = await adminApi.getOverallRating()
        overallRating.value = overallRatingResponse.data

        const inventoryStatusResponse = await adminApi.getInventoryStatus()
        inventoryStatus.value = inventoryStatusResponse.data
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    }
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <Navbar />
        
        <main class="lg:pl-60 pt-16 px-4">
            <div class="p-4 lg:p-6">
                <!-- Welcome Message -->
                <div class="mb-6">
                    <h1 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Welcome to Admin Dashboard</h1>
                    <p class="text-sm lg:text-base text-gray-600">Here's your business overview for today</p>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow duration-300">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-xs lg:text-sm font-medium text-gray-500 mb-1">Total Users</div>
                                <div class="text-xl lg:text-2xl font-bold text-gray-900">{{ dashboardData.totalUsersCount }}</div>
                            </div>
                            <div class="bg-indigo-100 p-2 lg:p-3 rounded-lg">
                                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow duration-300">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-xs lg:text-sm font-medium text-gray-500 mb-1">Revenue</div>
                                <div class="text-xl lg:text-2xl font-bold text-gray-900">${{ dashboardData.totalRevenue }}</div>
                            </div>
                            <div class="bg-emerald-100 p-2 lg:p-3 rounded-lg">
                                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow duration-300">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-xs lg:text-sm font-medium text-gray-500 mb-1">Orders</div>
                                <div class="text-xl lg:text-2xl font-bold text-gray-900">{{ dashboardData.totalOrdersCount }}</div>
                            </div>
                            <div class="bg-sky-100 p-2 lg:p-3 rounded-lg">
                                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow duration-300">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-xs lg:text-sm font-medium text-gray-500 mb-1">Products</div>
                                <div class="text-xl lg:text-2xl font-bold text-gray-900">{{ dashboardData.totalProductsCount }}</div>
                            </div>
                            <div class="bg-violet-100 p-2 lg:p-3 rounded-lg">
                                <svg class="w-5 h-5 lg:w-6 lg:h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Content -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <!-- Recent Activities -->
                    <div class="bg-white rounded-xl p-4 lg:p-6 shadow">
                        <h2 class="text-base lg:text-lg font-bold text-gray-900 mb-4">Recent Activities</h2>
                        <div class="space-y-4">
                            <div v-for="(activity, index) in recentActivities" :key="index" 
                                class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                                <div>
                                    <p class="text-xs lg:text-sm text-gray-800 font-medium">{{ activity.activityDescription }}</p>
                                    <p class="text-xs text-gray-500 mt-1">{{ activity.activityCreatedAt }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Products -->
                    <div class="bg-white rounded-xl p-4 lg:p-6 shadow">
                        <h2 class="text-base lg:text-lg font-bold text-gray-900 mb-4">Top Performing Products</h2>
                        <div class="space-y-4">
                            <div v-for="(product, index) in topProducts" :key="index" 
                                class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                                <div>
                                    <p class="text-xs lg:text-sm font-medium text-gray-900">{{ product.productName }}</p>
                                    <p class="text-xs text-gray-500 mt-1">Sales: {{ product.salesCount }} | Revenue: ${{ product.totalRevenue }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Sections -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Customer Satisfaction -->
                    <div class="bg-white rounded-xl p-4 lg:p-6 shadow">
                        <h2 class="text-base lg:text-lg font-bold text-gray-900 mb-4">Customer Satisfaction</h2>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-xs lg:text-sm font-medium text-gray-700">Overall Rating</span>
                                <span class="text-lg lg:text-xl font-bold text-amber-500">{{ overallRating }}/5.0</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2">
                                <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" :style="{ width: (overallRating / 5 * 100) + '%' }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Inventory Status -->
                    <div class="bg-white rounded-xl p-4 lg:p-6 shadow">
                        <h2 class="text-base lg:text-lg font-bold text-gray-900 mb-4">Inventory Status</h2>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-xs lg:text-sm font-medium text-gray-700">Low Stock Items</span>
                                <span class="text-xs lg:text-sm font-semibold text-red-500">{{ inventoryStatus.lowStockItems }} items</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-xs lg:text-sm font-medium text-gray-700">Out of Stock</span>
                                <div v-if="inventoryStatus.outOfStockItems > 0">
                                    <span class="text-xs lg:text-sm font-semibold text-red-500">{{ inventoryStatus.outOfStockItems }} items</span>
                                </div>
                                <div v-else>
                                    <span class="text-xs lg:text-sm font-semibold text-emerald-500">All items in stock</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-white rounded-xl p-4 lg:p-6 shadow">
                        <h2 class="text-base lg:text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div class="grid grid-cols-2 gap-2 lg:gap-3">
                            <button class="p-2 lg:p-3 text-xs lg:text-sm font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
                                Add Product
                            </button>
                            <button class="p-2 lg:p-3 text-xs lg:text-sm font-medium bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                                New Order
                            </button>
                            <button @click="generateAdminDashboardPDF" class="p-2 lg:p-3 text-xs lg:text-sm font-medium bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors duration-200">
                                Generate Report
                            </button>
                            <button class="p-2 lg:p-3 text-xs lg:text-sm font-medium bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors duration-200">
                                Support Tickets
                            </button>
                        </div>
                    </div>
                </div>

                <router-view></router-view>
            </div>
        </main>
    </div>
</template>