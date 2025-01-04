<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import { adminApi } from '@/api/adminApi'
import { useAuthStore } from '@/stores/useAuthStore'

const users = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const showOnlyActive = ref(false)
const showRoleDialog = ref(false)
const selectedUser = ref(null)
const selectedRole = ref('')
const availableRoles = ref(['User', 'Admin'])

const authStore = useAuthStore()

const filteredUsers = computed(() => {
  let filtered = users.value.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  
  if (showOnlyActive.value) {
    filtered = filtered.filter(user => user.isActive)
  }
  
  return filtered
})

onMounted(async () => {
  try {
    const response = await adminApi.getUsers()
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
})

const openRoleDialog = (user) => {
  selectedUser.value = user
  selectedRole.value = user.role
  showRoleDialog.value = true
}

const assignRole = async () => {
  try {
    const response = await adminApi.assignRole(authStore.user.id, selectedUser.value.id, selectedRole.value)

    if (response.data.isSuccess) {
      const userIndex = users.value.findIndex(u => u.id === selectedUser.value.id)
      if (userIndex !== -1) {
        users.value[userIndex].role = selectedRole.value
      }
      
      showRoleDialog.value = false
      alert(response.data.message)
    }
  } catch (error) {
    console.error('Error assigning role:', error)
    alert(error.response?.data?.errorMessages?.[0] || 'Error assigning role')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <Navbar />
    
    <main class="pl-60 pt-16">
      <div class="p-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="mt-2 text-sm text-gray-600">View and manage system users</p>
        </div>

        <!-- Search and Filters -->
        <div class="mb-6 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="relative w-96">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search users..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="showOnlyActive"
                class="form-checkbox h-5 w-5 text-indigo-600"
              >
              <span class="ml-2 text-gray-700">Show only active users</span>
            </label>
          </div>
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            Add New User
          </button>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Loading users...</td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No users found</td>
              </tr>
              <tr v-else v-for="user in filteredUsers" :key="user.email" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img 
                        class="h-10 w-10 rounded-full object-cover" 
                        :src="user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`" 
                        :alt="user.fullName"
                      >
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.lastLoginDate || 'Never' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="openRoleDialog(user)" 
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Change Role
                  </button>
                  <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <div v-if="showRoleDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Change Role for {{ selectedUser?.fullName }}
      </h3>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Role
        </label>
        <select
          v-model="selectedRole"
          class="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="role in availableRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
      
      <div class="flex justify-end gap-3">
        <button
          @click="showRoleDialog = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="assignRole"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>