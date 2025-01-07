<script setup>
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api/adminApi'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id
const order = ref(null)
const loading = ref(true)

const getOrderDetails = async () => {
  try {
    loading.value = true
    const response = await adminApi.getOrderById(orderId)
    order.value = response.data.result
  } catch (error) {
    console.error('Error fetching order details:', error)
  } finally {
    loading.value = false
  }
}

const returnToOrders = () => {
  router.push('/admin/orders')
}

onMounted(() => {
  getOrderDetails()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <Navbar />
    <main class="lg:pl-60 pt-16 px-2 sm:px-4 pb-12">
      <div class="max-w-7xl mx-auto p-2 sm:p-4 lg:p-8">
        <!-- Return to Orders button -->
        <div class="mb-4 sm:mb-8">
          <button @click="returnToOrders" 
            class="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <svg class="-ml-0.5 sm:-ml-1 mr-2 sm:mr-2.5 h-4 sm:h-5 w-4 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Orders
          </button>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-96">
          <div class="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="order" class="space-y-4 sm:space-y-8">
          <!-- Order Header -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Order #{{ order.orderId }}</h1>
                <p class="text-xs sm:text-sm lg:text-base text-gray-500 mt-1">Placed on {{ order.orderDate }}</p>
              </div>
              <div class="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
                <div class="flex flex-col gap-2">
                  <span class="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide">Payment Status</span>
                  <span :class="{
                    'px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center shadow-md border': true,
                    'bg-emerald-100 text-emerald-800 border-emerald-200': order.paymentStatus === 'Completed',
                    'bg-amber-100 text-amber-800 border-amber-200': order.paymentStatus === 'Pending',
                    'bg-red-100 text-red-800 border-red-200': order.paymentStatus === 'Failed' || order.paymentStatus === 'Cancelled'
                  }">
                    <span class="w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-2 sm:mr-3" :class="{
                      'bg-emerald-500 ring-2 sm:ring-4 ring-emerald-200': order.paymentStatus === 'Completed',
                      'bg-amber-500 ring-2 sm:ring-4 ring-amber-200': order.paymentStatus === 'Pending',
                      'bg-red-500 ring-2 sm:ring-4 ring-red-200': order.paymentStatus === 'Failed' || order.paymentStatus === 'Cancelled'
                    }"></span>
                    {{ order.paymentStatus }}
                  </span>
                </div>

                <div class="flex flex-col gap-2">
                  <span class="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide">Order Status</span>
                  <span :class="{
                    'px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center shadow-md border': true,
                    'bg-emerald-100 text-emerald-800 border-emerald-200': order.orderStatus === 'Delivered',
                    'bg-blue-100 text-blue-800 border-blue-200': order.orderStatus === 'Shipped',
                    'bg-amber-100 text-amber-800 border-amber-200': order.orderStatus === 'Processing',
                    'bg-gray-100 text-gray-800 border-gray-200': order.orderStatus === 'Pending',
                    'bg-red-100 text-red-800 border-red-200': order.orderStatus === 'Cancelled'
                  }">
                    <span class="w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-2 sm:mr-3" :class="{
                      'bg-emerald-500 ring-2 sm:ring-4 ring-emerald-200': order.orderStatus === 'Delivered',
                      'bg-blue-500 ring-2 sm:ring-4 ring-blue-200': order.orderStatus === 'Shipped',
                      'bg-amber-500 ring-2 sm:ring-4 ring-amber-200': order.orderStatus === 'Processing',
                      'bg-gray-500 ring-2 sm:ring-4 ring-gray-200': order.orderStatus === 'Pending',
                      'bg-red-500 ring-2 sm:ring-4 ring-red-200': order.orderStatus === 'Cancelled'
                    }"></span>
                    {{ order.orderStatus }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Customer Information</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              <div class="flex items-center space-x-3 sm:space-x-4">
                <img :src="order.customerProfilePicture" alt="Profile" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-gray-100">
                <div>
                  <p class="text-base sm:text-lg font-medium text-gray-900">{{ order.customerFullName }}</p>
                  <p class="text-sm sm:text-base text-gray-500">{{ order.customerEmail }}</p>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div class="space-y-1 text-sm sm:text-base text-gray-600">
                  <p>Full Name: {{ order.stripePaymentDetails.shippingDetails.firstName }} {{ order.stripePaymentDetails.shippingDetails.lastName }}</p>
                  <p>Address: {{ order.stripePaymentDetails.shippingDetails.street }}</p>
                  <p>City: {{ order.stripePaymentDetails.shippingDetails.city }}, {{ order.stripePaymentDetails.shippingDetails.postalCode }}</p>
                  <p>Country: {{ order.stripePaymentDetails.shippingDetails.country }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Order Items</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in order.products" :key="product.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                      <div class="flex items-center">
                        <img :src="product.productImage" alt="Product" class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover">
                        <div class="ml-3 sm:ml-4">
                          <p class="text-xs sm:text-sm lg:text-base font-medium text-gray-900">{{ product.productName }}</p>
                          <p class="text-xs sm:text-sm text-gray-500 mt-1">Category: {{ product.productCategory }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-xs sm:text-sm lg:text-base text-gray-500">{{ product.quantity }}</td>
                    <td class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-xs sm:text-sm lg:text-base text-gray-500">${{ product.pricePerProduct }}</td>
                    <td class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-xs sm:text-sm lg:text-base font-medium text-gray-900">${{ product.pricePerProduct * product.quantity }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-right">Total</td>
                    <td class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg font-semibold text-gray-900">${{ order.totalPrice }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm p-4 sm:p-8 text-center flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div class="flex flex-col items-center justify-center max-w-md mx-auto">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">Order Not Found</h3>
            <p class="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8">We couldn't find the order you're looking for. It might have been deleted or doesn't exist.</p>
            <button @click="$router.push('/admin/orders')" 
              class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Return to Orders
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>