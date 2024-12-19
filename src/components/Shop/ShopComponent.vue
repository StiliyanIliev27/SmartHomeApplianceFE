<script>
import NavBar from '../NavBar.vue'
import Footer from '../Footer.vue'
import Chatbot from '../HomePage/Chatbot.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import axios from 'axios'
import { debounce } from 'lodash';

export default {
  name: 'ShopComponent',
  components: {
    NavBar,
    Footer, 
    Chatbot
  },
  setup() {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    return { authStore, chatStore }
  },
  data() {
    return {
      cartItems: [],
      scrolled: false,
      products: [],
      categoryMapping: {
        'Security and Surveillance': 0,
        'Lighting and Ambiance': 1,
        'Heating and Cooling': 2,
        'Kitchen Appliances': 3,
        'Entertainment and Media': 4,
        'Energy Management': 5,
        'Cleaning and Household': 6,
        'Health and Fitness': 7,
        'Smart Hubs and Controllers': 8,
        'Outdoor and Garden': 9
      },
      categories: [
        'All',
        'Security and Surveillance',
        'Lighting and Ambiance', 
        'Heating and Cooling',
        'Kitchen Appliances',
        'Entertainment and Media',
        'Energy Management',
        'Cleaning and Household',
        'Health and Fitness',
        'Smart Hubs and Controllers',
        'Outdoor and Garden'
      ],
      selectedCategory: 'All',
      searchQuery: '',
      sortBy: 'price-low',
      currentPage: 1,
      pageSize: 12, // Increased for better UX
      minPrice: 0,
      maxPrice: 1000,
      loading: true,
      allProducts: [],
      isMobileMenuOpen: false
    }
  },
  async created() {
    await this.fetchInitialProducts()
    this.setupScrollListener()
  },
  methods: {
    async fetchInitialProducts() {
      try {
        const response = await axios.get('https://localhost:7200/api/Product')
        this.allProducts = response.data.result
        this.products = [...this.allProducts]
      } catch (error) {
        console.error('Error fetching products:', error)
        this.$notify({
          title: 'Error',
          text: 'Failed to load products. Please try again later.',
          type: 'error',
          duration: 3000
        })
      } finally {
        this.loading = false
      }
    },
    async fetchProducts() {
      this.loading = true
      try {
        let filteredProducts = [...this.allProducts]

        // Apply filters in order of most restrictive first
        if (this.selectedCategory !== 'All') {
          filteredProducts = filteredProducts.filter(product => 
            product.category === this.categoryMapping[this.selectedCategory]
          )
        }

        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
          )
        }

        filteredProducts = filteredProducts.filter(product => 
          product.price >= this.minPrice && product.price <= this.maxPrice
        )

        // Sort after filtering to improve performance
        filteredProducts.sort((a, b) => 
          this.sortBy === 'price-low' ? a.price - b.price : b.price - a.price
        )

        this.products = filteredProducts
      } catch (error) {
        console.error('Error filtering products:', error)
      } finally {
        this.loading = false
      }
    },
    handleSignOut() {
      this.authStore.logout()
      this.$router.push('/login')
    },
    addToCart(product) {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      const existingProduct = this.cartItems.find(item => item.id === product.id)
      if (existingProduct) {
        existingProduct.quantity++
      } else {
        this.cartItems.push({ ...product, quantity: 1 })
      }

      this.$notify({
        title: 'Added to Cart',
        text: `${product.name} has been added to your cart`,
        type: 'success',
        duration: 3000
      })
    },
    filterByCategory(category) {
      this.selectedCategory = category
      this.currentPage = 1
      this.fetchProducts()
      this.isMobileMenuOpen = false
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    goToPage(page) {
      this.currentPage = page
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    setupScrollListener() {
      const handleScroll = () => {
        this.scrolled = window.scrollY > 50
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('scroll', handleScroll)
      })
    }
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated
    },
    totalPages() {
      return Math.ceil(this.products.length / this.pageSize)
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      return this.products.slice(startIndex, startIndex + this.pageSize)
    },
    hasProducts() {
      return this.products.length > 0
    }
  },
  watch: {
    searchQuery: debounce(function() {
      this.currentPage = 1
      this.fetchProducts()
    }, 300),
    minPrice(newVal, oldVal) {
      if (newVal > this.maxPrice) {
        this.minPrice = oldVal
        return
      }
      this.currentPage = 1
      this.fetchProducts()
    },
    maxPrice(newVal, oldVal) {
      if (newVal < this.minPrice) {
        this.maxPrice = oldVal
        return
      }
      this.currentPage = 1
      this.fetchProducts()
    }
  }
}
</script>

<template>
  <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
    <!-- Navbar -->
    <div class="fixed top-0 w-full z-50 transition-all duration-300"
      :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/90': scrolled }">
      <NavBar :is-authenticated="isAuthenticated" :user="authStore.user"
        @sign-out="handleSignOut" />
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Smart Home Collection</h1>
        <p class="text-base lg:text-lg text-gray-600">Discover the future of home automation with our curated selection</p>
      </div>

      <!-- Enhanced Search and Filter Section -->
      <div class="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-12">
        <!-- Search Bar -->
        <div class="relative mb-6">
          <input type="text" v-model="searchQuery" placeholder="Search products..."
            class="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-base md:text-lg" />
          <svg class="w-6 h-6 md:w-7 md:h-7 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Price Range Filter -->
          <div class="w-full lg:w-1/3">
            <div class="bg-gray-50 p-4 md:p-6 rounded-xl">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Price Range</h3>
              <div class="space-y-4">
                <div class="relative">
                  <label class="text-sm text-gray-600 mb-2 block">Minimum Price</label>
                  <input type="number" v-model="minPrice" placeholder="0"
                    class="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" />
                  <span class="absolute left-3 top-[calc(50%+6px)] transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                </div>
                <div class="relative">
                  <label class="text-sm text-gray-600 mb-2 block">Maximum Price</label>
                  <input type="number" v-model="maxPrice" placeholder="1000"
                    class="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" />
                  <span class="absolute left-3 top-[calc(50%+6px)] transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="w-full lg:w-2/3">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
            <!-- Mobile Categories Menu -->
            <div class="lg:hidden mb-4">
              <button @click="toggleMobileMenu"
                class="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl flex items-center justify-between">
                <span>{{ selectedCategory }}</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="isMobileMenuOpen"
                class="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <button v-for="category in categories" :key="category" @click="filterByCategory(category)"
                  class="w-full px-4 py-2 text-left hover:bg-emerald-50"
                  :class="{ 'bg-emerald-100': selectedCategory === category }">
                  {{ category }}
                </button>
              </div>
            </div>
            <!-- Desktop Categories -->
            <div class="hidden lg:flex flex-wrap gap-3">
              <button v-for="category in categories" :key="category" @click="filterByCategory(category)" :class="[
                'px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium border-2',
                selectedCategory === category
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200 transform scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
              ]">
                {{ category }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center my-12 md:my-20">
        <div class="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-emerald-500 border-t-transparent"></div>
      </div>

      <!-- No Products Found Message -->
      <div v-else-if="!hasProducts" class="text-center my-12 md:my-20">
        <div class="text-gray-500 text-lg md:text-xl">
          No products found matching your criteria. Try adjusting your filters.
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="product in paginatedProducts" :key="product.id"
            class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
            <div class="relative overflow-hidden rounded-t-2xl">
              <img :src="product.imageUrl" :alt="product.name" loading="lazy"
                class="w-full h-48 sm:h-56 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div v-if="product.stockQuantity === 0"
                class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                Out of Stock
              </div>
            </div>
            <div class="p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-xl md:text-2xl font-bold text-emerald-600">${{ product.price }}</span>
                <button @click="addToCart(product)" :disabled="product.stockQuantity === 0" :class="[
                  'px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-medium transition-all duration-300 transform text-sm md:text-base',
                  product.stockQuantity === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 active:scale-95'
                ]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center mt-8 md:mt-12 mb-8 gap-2 md:gap-3">
          <button @click="previousPage"
            class="px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base"
            :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 hover:bg-emerald-50'">
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div class="flex gap-1 md:gap-2">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
              class="w-8 h-8 md:w-10 md:h-10 rounded-xl font-medium transition-all duration-300 flex items-center justify-center text-sm md:text-base"
              :class="currentPage === page ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-emerald-50'">
              {{ page }}
            </button>
          </div>

          <button @click="nextPage"
            class="px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base"
            :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 hover:bg-emerald-50'">
            Next
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Chatbot :user="authStore.user" />
    <Footer />
  </div>
</template>