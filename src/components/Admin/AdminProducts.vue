<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import SearchComponent from './SearchComponent.vue'
import { ref, onMounted, computed } from 'vue'
import adminApi from '@/api/adminApi'
const products = ref([])
const showAddProductDialog = ref(false)
const showDeletionConfirmation = ref(false)
const showEditDialog = ref(false)
const selectedProduct = ref(null)
const productToDelete = ref(null)
const searchQuery = ref('')
const isLoading = ref(true)
const categories = ref(
  ['Security And Surveillance', 'Lighting And Ambiance',
    'Heating And Cooling', 'Kitchen Appliances',
    'Entertainment And Media', 'Energy Management',
    'Cleaning And Household', 'Health And Fitness',
    'Smart Hubs And Controllers', 'Outdoor And Garden'])

// Add product form data
const newProduct = ref({
  productName: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  category: '',
  productImage: '',
  productImageFile: null
})

// Edit product form data
const editProduct = ref({
  id: '',
  productName: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  category: '',
  productImage: '',
  productImageFile: null
})

const getProducts = async () => {
  const response = await adminApi.getProducts()
  products.value = response.data
}

onMounted(getProducts)

const filteredProducts = computed(() => {
  let filtered = products.value.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  return filtered
})

const openEditDialog = (product) => {
  selectedProduct.value = product
  editProduct.value = {
    id: product.id,
    productName: product.productName,
    description: product.description,
    price: product.price,
    stockQuantity: product.stockQuantity,
    category: product.category,
    productImage: product.productImage,
    productImageFile: null
  }
  showEditDialog.value = true
}

const handleImageChange = (event, isNewProduct = false) => {
  const file = event.target.files[0]
  if (file) {
    if (isNewProduct) {
      newProduct.value.productImageFile = file
      newProduct.value.productImage = URL.createObjectURL(file)
    } else {
      editProduct.value.productImageFile = file
      editProduct.value.productImage = URL.createObjectURL(file)
    }
  }
}

const removeImage = (isNewProduct = false) => {
  if (isNewProduct) {
    newProduct.value.productImage = ''
    newProduct.value.productImageFile = null
  } else {
    editProduct.value.productImage = ''
    editProduct.value.productImageFile = null
  }
}

const handleAddSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append('productName', newProduct.value.productName)
    formData.append('description', newProduct.value.description)
    formData.append('price', newProduct.value.price)
    formData.append('stockQuantity', newProduct.value.stockQuantity)
    formData.append('category', newProduct.value.category)
    
    if (newProduct.value.productImageFile) {
      formData.append('productImageFile', newProduct.value.productImageFile)
    }

    const response = await adminApi.addProduct(formData)

    if (response.data.isSuccess) {
      alert(response.data.message)
      showAddProductDialog.value = false
      getProducts()
      // Reset form
      newProduct.value = {
        productName: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
        productImage: '',
        productImageFile: null
      }
    } else {
      alert(response.data.message || 'Error adding product')
    }
  } catch (error) {
    console.error('Error adding product:', error)
    alert(error.response?.data?.message || 'Error adding product')
  }
}

const handleEditSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append('id', editProduct.value.id);
    formData.append('productName', editProduct.value.productName);
    formData.append('description', editProduct.value.description);
    formData.append('price', editProduct.value.price);
    formData.append('stockQuantity', editProduct.value.stockQuantity);
    formData.append('category', editProduct.value.category);
    formData.append('productImage', editProduct.value.productImage);

    if (editProduct.value.productImageFile) {
      formData.append('productImageFile', editProduct.value.productImageFile);
    }

    const response = await adminApi.editProduct(formData)

    if (response.data.isSuccess) {
      alert(response.data.message)
      showEditDialog.value = false
      getProducts()
    } else {
      alert(response.data.message || 'Error editing product')
    }
  } catch (error) {
    console.error('Error editing product:', error)
    if (error.response?.status === 404) {
      alert('Product not found')
    } else {
      alert(error.response?.data?.message || 'Error editing product')
    }
  }
}

const handleDeleteProduct = async () => {
  const response = await adminApi.deleteProduct(productToDelete.value.id)
  if (response.data.isSuccess) {
    alert(response.data.message)
    showDeletionConfirmation.value = false
    productToDelete.value = null
    getProducts()
  } else {
    alert(response.data.message || 'Error deleting product')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <Navbar />

    <main class="lg:pl-60 pt-16 px-4">
      <div class="p-4 lg:p-8">
        <SearchComponent title="Products Management"
          description="Manage your product inventory, add new products, edit details and monitor stock levels."
          v-model:searchQuery="searchQuery" :isUserPage="false" buttonText="Add Product"
          placeholder="Search products..." @buttonClick="showAddProductDialog = true" />

        <!-- Products grid -->
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div v-for="product in filteredProducts" :key="product.id"
            class="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div class="relative pt-[75%]">
              <img :src="product.productImage" :alt="product.name"
                class="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg" />
            </div>
            <div class="p-3 flex-1 flex flex-col">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-1">{{ product.productName }}</h3>
              <p class="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">{{ product.description }}</p>
              <div class="mt-2 flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">${{ product.price }}</p>
                <p class="text-xs text-gray-500">Stock: {{ product.stockQuantity }}</p>
              </div>
              <div class="mt-2 flex gap-1">
                <button @click="openEditDialog(product)"
                  class="flex-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100">
                  Edit
                </button>
                <button @click="productToDelete = product; showDeletionConfirmation = true"
                  class="flex-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeletionConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 lg:p-6 max-w-sm w-full">
      <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-4">
        Confirm Deletion
      </h3>
      <p class="text-sm text-gray-600 mb-4">
        Are you sure you want to delete product {{ productToDelete?.productName }}? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button @click="showDeletionConfirmation = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancel
        </button>
        <button @click="handleDeleteProduct"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Delete
        </button> 
        </div>
      </div>
    </div>

    <!-- Add Product Dialog -->
    <div v-if="showAddProductDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Add New Product</h2>
        <form @submit.prevent="handleAddSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" v-model="newProduct.productName" required
              class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="newProduct.description" rows="3" required
              class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" v-model="newProduct.price" step="0.01" required
                class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" v-model="newProduct.stockQuantity" required
                class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select v-model="newProduct.category" required
              class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div class="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div class="flex flex-col items-center">
                <img v-if="newProduct.productImage" :src="newProduct.productImage"
                  class="h-40 w-40 object-cover rounded-lg mb-4">
                <div class="flex flex-col items-center space-y-2">
                  <label class="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-md">
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" @change="e => handleImageChange(e, true)" class="hidden">
                  </label>
                  <button v-if="newProduct.productImage" type="button" @click="() => removeImage(true)"
                    class="text-sm text-red-600 hover:text-red-700 hover:underline">
                    Remove Image
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="showAddProductDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Product Dialog -->
    <div v-if="showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Edit Product</h2>
        <form @submit.prevent="handleEditSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" v-model="editProduct.productName"
              class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="editProduct.description" rows="3"
              class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" v-model="editProduct.price" step="0.01"
                class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" v-model="editProduct.stockQuantity"
                class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select v-model="editProduct.category"
              class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div class="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div class="flex flex-col items-center">
                <img v-if="editProduct.productImage" :src="editProduct.productImage"
                  class="h-40 w-40 object-cover rounded-lg mb-4">
                <div class="flex flex-col items-center space-y-2">
                  <label class="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-md">
                    <span>Change Image</span>
                    <input type="file" accept="image/*" @change="handleImageChange" class="hidden">
                  </label>
                  <button v-if="editProduct.productImage" type="button" @click="removeImage"
                    class="text-sm text-red-600 hover:text-red-700 hover:underline">
                    Remove Image
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="showEditDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>