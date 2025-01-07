<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import SearchComponent from './SearchComponent.vue'
import { ref, onMounted, computed } from 'vue'
import { adminApi } from '../../api/adminApi'
import { useRouter } from 'vue-router'

const router = useRouter()
const orders = ref([])
const searchQuery = ref('')
const showAddOrderDialog = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showEditStatusDialog = ref(false)
const selectedOrder = ref(null)
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const getOrders = async () => {
  try {
    const response = await adminApi.getOrders()
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => 
    order.orderId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage.value)
})

const viewOrderDetails = (orderId) => {
  router.push(`/admin/orders/${orderId}`)
}

const openEditStatusDialog = (order) => {
  selectedOrder.value = order
  showEditStatusDialog.value = true
}

const updateOrderStatus = async () => {
  try {
    await adminApi.editOrderStatus(selectedOrder.value.orderId, selectedOrder.value.orderStatus)
    alert('Order status updated successfully')
    showEditStatusDialog.value = false
    await getOrders() // Refresh orders list
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

onMounted(() => {
  getOrders()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <Navbar />
    <main class="lg:pl-60 pt-16 px-2 sm:px-4 lg:px-8">
      <div class="p-2 sm:p-4 lg:p-8">
        <SearchComponent title="Orders Management"
          description="Manage your orders, track status and process customer orders."
          v-model:searchQuery="searchQuery" :isUserPage="false" buttonText="Add Order"
          placeholder="Search orders..." @buttonClick="showAddOrderDialog = true" />

        <!-- Mobile View Cards -->
        <div class="lg:hidden mt-4 space-y-4">
          <div v-for="order in paginatedOrders" :key="order.orderId" 
               class="bg-white rounded-lg shadow p-4 space-y-3">
            <div class="flex justify-between items-start">
              <span class="font-medium text-gray-900">#{{ order.orderId }}</span>
              <span class="text-sm text-gray-500">{{ order.orderDate }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <img :src="order.customerProfilePicture" alt="Profile" 
                   class="w-8 h-8 rounded-full object-cover">
              <div>
                <div class="text-sm font-medium">{{ order.customerFullName }}</div>
                <div class="text-xs text-gray-500">{{ order.customerEmail }}</div>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">${{ order.totalPrice }}</span>
              <div class="flex space-x-2">
                <button @click="viewOrderDetails(order.orderId)" 
                        class="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                  View
                </button>
                <button @click="openEditStatusDialog(order)" 
                        class="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                  Edit
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span :class="{
                'px-2 py-1 text-xs font-medium rounded-full': true,
                'bg-emerald-100 text-emerald-700': order.paymentStatus === 'Completed',
                'bg-amber-100 text-amber-700': order.paymentStatus === 'Pending',
                'bg-red-100 text-red-700': order.paymentStatus === 'Failed' || order.paymentStatus === 'Cancelled'
              }">
                {{ order.paymentStatus }}
              </span>
              <span :class="{
                'px-2 py-1 text-xs font-medium rounded-full': true,
                'bg-emerald-100 text-emerald-700': order.orderStatus === 'Delivered',
                'bg-blue-100 text-blue-700': order.orderStatus === 'Shipped',
                'bg-amber-100 text-amber-700': order.orderStatus === 'Processing',
                'bg-gray-100 text-gray-700': order.orderStatus === 'Pending',
                'bg-red-100 text-red-700': order.orderStatus === 'Cancelled'
              }">
                {{ order.orderStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- Desktop View Table -->
        <div class="hidden lg:block mt-8 bg-white rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in paginatedOrders" :key="order.orderId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.orderId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.orderDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center group relative">
                    <img :src="order.customerProfilePicture" alt="Profile" class="w-8 h-8 rounded-full mr-2 object-cover">
                    <span>{{ order.customerFullName }}</span>
                    <div class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                      {{ order.customerEmail }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ order.totalPrice }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center': true,
                    'bg-emerald-100 text-emerald-700': order.paymentStatus === 'Completed',
                    'bg-amber-100 text-amber-700': order.paymentStatus === 'Pending',
                    'bg-red-100 text-red-700': order.paymentStatus === 'Failed' || order.paymentStatus === 'Cancelled'
                  }">
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center': true,
                    'bg-emerald-100 text-emerald-700': order.orderStatus === 'Delivered',
                    'bg-blue-100 text-blue-700': order.orderStatus === 'Shipped',
                    'bg-amber-100 text-amber-700': order.orderStatus === 'Processing',
                    'bg-gray-100 text-gray-700': order.orderStatus === 'Pending',
                    'bg-red-100 text-red-700': order.orderStatus === 'Cancelled'
                  }">
                    {{ order.orderStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                  <button @click="viewOrderDetails(order.orderId)" 
                          class="text-blue-600 hover:text-blue-900 font-medium">View</button>
                  <button @click="openEditStatusDialog(order)" 
                          class="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
            
        <!-- Pagination -->
        <div class="mt-4 flex justify-center items-center space-x-4">
          <button @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button @click="currentPage++" 
                  :disabled="currentPage >= totalPages"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </main>

    <!-- Edit Status Dialog -->
    <div v-if="showEditStatusDialog" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-medium mb-4">Update Order Status</h3>
        <select v-model="selectedOrder.orderStatus" 
                class="w-full rounded-md border border-gray-300 p-2 mb-4">
          <option v-for="status in orderStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <div class="flex justify-end space-x-3">
          <button @click="showEditStatusDialog = false" 
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button @click="updateOrderStatus" 
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>