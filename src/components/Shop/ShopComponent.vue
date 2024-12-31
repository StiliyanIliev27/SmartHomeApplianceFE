<script>
import NavBar from '../NavBar.vue'
import Footer from '../Footer.vue'
import Chatbot from '../HomePage/Chatbot.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { debounce } from 'lodash';
import { cartService } from '@/services/cartService'

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
    const toast = useToast()
    return { authStore, chatStore, toast }
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
      pageSize: 8,
      minPrice: 0,
      maxPrice: 1000,
      loading: true,
      allProducts: [],
      isMobileMenuOpen: false,
      showAddedAnimation: false
    }
  },
  async created() {
    await this.fetchInitialProducts()
    this.setupScrollListener()
  },
  methods: {
    goToProductDetails(productId, event) {
      if (!event.target.closest('button')) {
        this.$router.push(`/product/${productId}`)
      }
    },
    async fetchInitialProducts() {
      try {
        const response = await axios.get('https://localhost:7200/api/Product')
        this.allProducts = response.data.result
        this.products = [...this.allProducts]
      } catch (error) {
        console.error('Error fetching products:', error)
        this.toast.error('Failed to load products. Please try again later.')
      } finally {
        this.loading = false
      }
    },
    async fetchProducts() {
      this.loading = true
      try {
        let filteredProducts = [...this.allProducts]

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

        filteredProducts.sort((a, b) =>
          this.sortBy === 'price-low' ? a.price - b.price : b.price - a.price
        )

        this.products = filteredProducts

        const maxPage = Math.ceil(filteredProducts.length / this.pageSize)
        if (this.currentPage > maxPage) {
          this.currentPage = 1
        }
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
    async addToCart(productId, quantity, event) {
      if (!this.isAuthenticated) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.path } });
        return
      }

      event.stopPropagation()
      try {
        this.showAddedAnimation = true;
        await cartService.addToCart(productId, quantity);
        this.toast.success('Product added to cart successfully!', {
          position: 'top-right',
          duration: 3000,
          icon: '🛍️'
        });
        setTimeout(() => {
          this.showAddedAnimation = false;
        }, 1000);
      } catch (error) {
        this.toast.error('Failed to add product to cart', {
          position: 'top-right',
          duration: 3000
        });
      }
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    goToPage(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
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
    totalPages() {
      return Math.max(1, Math.ceil(this.products.length / this.pageSize))
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      return this.products.slice(startIndex, endIndex)
    },
    hasProducts() {
      return this.products.length > 0
    }
  },
  watch: {
    searchQuery: debounce(function () {
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
      <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
      <!-- Hero Section -->
      <div class="text-center mb-8 sm:mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 sm:py-12 rounded-3xl shadow-xl">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">Smart Home Collection</h1>
        <p class="text-base sm:text-lg lg:text-xl opacity-90">Discover the future of home automation with our curated selection</p>
      </div>

      <!-- Enhanced Search and Filter Section -->
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-8 sm:mb-12">
        <!-- Search Bar -->
        <div class="relative mb-6 sm:mb-8">
          <input type="text" v-model="searchQuery" placeholder="Search products..."
            class="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm bg-white/60" />
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <!-- Price Range Filter -->
          <div class="w-full lg:w-1/3">
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-2xl shadow-inner">
              <h3 class="text-lg sm:text-xl font-bold text-emerald-800 mb-4 sm:mb-6">Price Range</h3>
              <div class="space-y-4 sm:space-y-6">
                <div class="relative">
                  <label class="text-sm font-medium text-emerald-700 mb-2 block">Minimum Price</label>
                  <input type="number" v-model="minPrice" placeholder="0"
                    class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/70" />
                  <span class="absolute left-4 top-[calc(50%+6px)] transform -translate-y-1/2 text-emerald-600 font-medium">$</span>
                </div>
                <div class="relative">
                  <label class="text-sm font-medium text-emerald-700 mb-2 block">Maximum Price</label>
                  <input type="number" v-model="maxPrice" placeholder="1000"
                    class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/70" />
                  <span class="absolute left-4 top-[calc(50%+6px)] transform -translate-y-1/2 text-emerald-600 font-medium">$</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="w-full lg:w-2/3 relative">
            <h3 class="text-lg sm:text-xl font-bold text-emerald-800 mb-4 sm:mb-6">Categories</h3>
            <!-- Mobile Categories Menu -->
            <div class="lg:hidden relative" style="position: relative; isolation: isolate;">
              <button @click="toggleMobileMenu"
                class="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl flex items-center justify-between shadow-lg hover:shadow-xl transition-all relative z-[1]">
                <span class="text-base sm:text-lg font-medium">{{ selectedCategory }}</span>
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <transition name="fade">
                <div v-if="isMobileMenuOpen"
                  class="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-emerald-100 max-h-[60vh] overflow-y-auto z-[9999]">
                  <button v-for="category in categories" :key="category" @click="filterByCategory(category)"
                    class="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-emerald-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    :class="{ 'bg-emerald-100 text-emerald-700 font-medium': selectedCategory === category }">
                    {{ category }}
                  </button>
                </div>
              </transition>
            </div>
            <!-- Desktop Categories -->
            <div class="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-3">
              <button v-for="category in categories" :key="category" @click="filterByCategory(category)" :class="[
                'px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium border-2 shadow-sm hover:shadow-lg',
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent transform scale-105'
                  : 'bg-white/70 backdrop-blur-sm text-gray-700 border-emerald-100 hover:border-emerald-500 hover:text-emerald-600'
              ]">
                {{ category }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center my-12 sm:my-16">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-emerald-200"></div>
          <div class="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-emerald-500 border-t-transparent absolute top-0"></div>
        </div>
      </div>

      <!-- No Products Found Message -->
      <div v-else-if="!hasProducts" class="text-center my-12 sm:my-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg">
        <svg class="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-lg sm:text-xl text-gray-600">
          No products found matching your criteria. Try adjusting your filters.
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div v-for="product in paginatedProducts" :key="product.id" @click="goToProductDetails(product.id, $event)"
            class="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden">
            <div class="relative overflow-hidden">
              <img :src="product.imageUrl" :alt="product.name" loading="lazy"
                class="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div v-if="product.stockQuantity === 0"
                class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                Out of Stock
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2">{{ product.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${{ product.price }}
                </span>
                <button @click="addToCart(product.id, 1, $event)" :disabled="product.stockQuantity === 0" :class="[
                  'px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 transform flex items-center gap-2',
                  product.stockQuantity === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                ]">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-12 sm:mt-16 mb-6 sm:mb-8">
          <button @click="previousPage"
            class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center gap-2"
            :class="currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-md hover:shadow-lg'">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div class="flex gap-2">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
              class="w-8 h-8 sm:w-12 sm:h-12 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              :class="currentPage === page 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white transform scale-110' 
                : 'bg-white text-gray-700 hover:bg-emerald-50'">
              {{ page }}
            </button>
          </div>

          <button @click="nextPage"
            class="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center gap-2"
            :class="currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-md hover:shadow-lg'">
            Next
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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