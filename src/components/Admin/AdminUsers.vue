<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import SearchComponent from './SearchComponent.vue'
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
const showAddUserDialog = ref(false)
const showPassword = ref(false)
const showDeletionConfirmation = ref(false)
const userToDelete = ref(null)
const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  profilePicture: null
})

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

const addNewUser = async () => {
  try {
    const formData = {
      firstName: newUser.value.firstName,
      lastName: newUser.value.lastName,
      email: newUser.value.email,
      password: newUser.value.password,
      profilePicture: newUser.value.profilePicture
    };

    const userData = new FormData();
    userData.append('firstName', formData.firstName);
    userData.append('lastName', formData.lastName);
    userData.append('email', formData.email);
    userData.append('password', formData.password);

    if (formData.profilePicture) {
      userData.append('profilePicture', formData.profilePicture);
    }

    const response = await adminApi.newUser(userData)

    if (response.data.isSuccess) {
      users.value.push(response.data.user)
      showAddUserDialog.value = false
      newUser.value = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profilePicture: null
      }
      alert("Please check your email to activate new user's account")
    }
  } catch (error) {
    console.error('Error adding new user:', error)
    alert(error.response?.data?.errorMessages?.[0] || 'Error adding new user')
  }
}

const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeletionConfirmation.value = true
}

const deleteUser = async () => {
  try {
    const response = await adminApi.deleteUser(userToDelete.value.id)
    if (response.data.isSuccess) {
      users.value = users.value.filter(user => user.id !== userToDelete.value.id)
      showDeletionConfirmation.value = false
      alert(response.data.message)
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    alert(error.response?.data?.errorMessages?.[0] || 'Error deleting user')
  }
}

const handleProfilePicture = (event) => {
  const file = event.target.files[0]
  if (file) {
    newUser.value.profilePicture = file
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'pointer-events-none': showRoleDialog || showAddUserDialog || showDeletionConfirmation }">
    <Sidebar />
    <Navbar />

    <main class="lg:pl-60 pt-16 px-4">
      <div class="p-4 lg:p-8">
        <SearchComponent
            title="Users Management"
            description="Manage your system users"
            v-model:searchQuery="searchQuery"
            v-model:showOnlyActive="showOnlyActive"
            :isUserPage="true"
            buttonText="Add User"
            placeholder="Search users..."
            @buttonClick="showAddUserDialog = true"
        />

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="5" class="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">Loading users...</td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="5" class="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">No users found</td>
              </tr>
              <tr v-else v-for="user in filteredUsers" :key="user.email" class="hover:bg-gray-50">
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                      <img class="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                        :src="user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`"
                        :alt="user.fullName">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm lg:text-base font-medium text-gray-900">{{ user.fullName }}</div>
                      <div class="text-xs lg:text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.lastLoginDate || 'Never' }}
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="openRoleDialog(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    Change Role
                  </button>
                  <button @click="confirmDeleteUser(user)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <!-- Role Dialog -->
  <div v-if="showRoleDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 lg:p-6 max-w-sm w-full">
      <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-4">
        Change Role for {{ selectedUser?.fullName }}
      </h3>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Role
        </label>
        <select v-model="selectedRole"
          class="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option v-for="role in availableRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>

      <div class="flex justify-end gap-3">
        <button @click="showRoleDialog = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancel
        </button>
        <button @click="assignRole"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Save
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Dialog -->
  <div v-if="showDeletionConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 lg:p-6 max-w-sm w-full">
      <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-4">
        Confirm Deletion
      </h3>
      <p class="text-sm text-gray-600 mb-4">
        Are you sure you want to delete user {{ userToDelete?.fullName }}? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button @click="showDeletionConfirmation = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancel
        </button>
        <button @click="deleteUser"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- Add User Dialog -->
  <div v-if="showAddUserDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 lg:p-6 max-w-md w-full">
      <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-4">Add New User</h3>

      <form @submit.prevent="addNewUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input v-model="newUser.firstName" type="text" required
            class="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input v-model="newUser.lastName" type="text" required
            class="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="newUser.email" type="email" required
            class="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input v-model="newUser.password" :type="showPassword ? 'text' : 'password'" required
              class="w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <button type="button" @click="togglePasswordVisibility" class="absolute right-2 top-2.5 text-gray-500">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input type="file" accept="image/*" @change="handleProfilePicture"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="showAddUserDialog = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>
</template>