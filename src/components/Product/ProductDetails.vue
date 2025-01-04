<script>
import { cartService } from '@/services/cartService'
import NavBar from '@/components/NavBar.vue'
import Chatbot from '@/components/HomePage/Chatbot.vue'
import Footer from '@/components/Footer.vue';
import productApi from '@/api/productApi';
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toastification'
import { reviewApi } from '@/api/reviewApi'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
    name: 'ProductDetails',
    setup() {
        return { authStore: useAuthStore(), toast: useToast() }
    },
    components: {
        NavBar,
        Chatbot,
        Footer
    },
    data() {
        return {
            product: null,
            quantity: 1,
            selectedTab: 'description',
            isZoomed: false,
            isLoading: true,
            showGallery: false,
            showAddedAnimation: false,
            reviews: [],
            newReview: {
                rating: 5,
                comment: ''
            },
            editingReview: null,
            benefits: [
                { text: 'Free Shipping' },
                { text: '30 Days Return' },
                { text: '2 Year Warranty' },
                { text: '24/7 Support' }
            ],
            paymentMethods: [
                { name: 'Visa', icon: 'fab fa-cc-visa' },
                { name: 'Mastercard', icon: 'fab fa-cc-mastercard' },
                { name: 'American Express', icon: 'fab fa-cc-amex' },
                { name: 'PayPal', icon: 'fab fa-cc-paypal' },
                { name: 'Apple Pay', icon: 'fab fa-apple-pay' },
                { name: 'Google Pay', icon: 'fab fa-google-pay' }
            ],
            currentImageIndex: 0,
            imageGallery: [] // Will be populated with product images
        }
    },
    computed: {
        averageRating() {
            if (!this.reviews.length) return 0;
            return (this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length).toFixed(1);
        },
        ratingDistribution() {
            const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
            this.reviews.forEach(review => distribution[review.rating]++);
            return distribution;
        },
        ratingPercentages() {
            const total = this.reviews.length;
            return Object.entries(this.ratingDistribution).map(([rating, count]) => ({
                rating,
                percentage: total ? (count / total * 100).toFixed(1) : 0
            }));
        }
    },
    watch: {
        isZoomed(newValue) {
            document.body.style.overflow = newValue ? 'hidden' : 'auto';
        }
    },
    methods: {
        async addToCart(productId, quantity) {
            try {
                if(!this.authStore.isAuthenticated)
                    return this.$router.push({ name: 'Login', query: { redirect: this.$route.path } });
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
        async refreshReviews(){
            try{
                const reviewsResponse = await reviewApi.getReviews(this.product.data.id);
                this.reviews = reviewsResponse.data.result;
            } catch (error) {
                this.toast.error('Failed to refresh reviews', {
                    position: 'top-right',
                    duration: 3000
                });
            }
        },
        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.imageGallery.length;
        },
        previousImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.imageGallery.length) % this.imageGallery.length;
        },
        incrementQuantity() {
            if (this.quantity < this.product?.data?.stockQuantity) {
                this.quantity++;
            }
        },
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        toggleZoom() {
            this.isZoomed = !this.isZoomed;
        },
        toggleGallery() {
            this.showGallery = !this.showGallery;
        },
        startEditReview(review) {
            this.editingReview = {
                id: review.id,
                rating: review.rating,
                comment: review.comment
            };
        },
        cancelEditReview() {
            this.editingReview = null;
        },
        async updateReview(review) {
            if (!this.authStore.isAuthenticated) {
                this.toast.error('Please login to edit a review', {
                    position: 'top-right',
                    duration: 3000
                });
                return;
            }

            try {
                const editReviewDto = {
                    reviewId: this.editingReview.id,
                    newRating: this.editingReview.rating,
                    newComment: this.editingReview.comment.trim()
                }

                if (!editReviewDto.newComment) {
                    this.toast.error('Review comment cannot be empty', {
                        position: 'top-right',
                        duration: 3000
                    });
                    return;
                }

                await reviewApi.editReview(editReviewDto);

                const index = this.reviews.findIndex(r => r.id === review.id);
                if (index !== -1) {
                    this.reviews[index] = {
                        ...review,
                        rating: this.editingReview.rating,
                        comment: this.editingReview.comment
                    };
                }

                this.editingReview = null;
                this.toast.success('Review updated successfully!', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '✍️'
                });
            } catch (error) {
                this.toast.error('Failed to update review', {
                    position: 'top-right',
                    duration: 3000
                });
            }
        },
        async deleteReview(reviewId) {
            if (!this.authStore.isAuthenticated) {
                this.toast.error('Please login to delete a review', {
                    position: 'top-right',
                    duration: 3000
                });
                return;
            }

            try {
                await reviewApi.deleteReview(reviewId);
                this.reviews = this.reviews.filter(review => review.id !== reviewId);

                this.toast.success('Review deleted successfully!', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '🗑️'
                });
            } catch (error) {
                this.toast.error('Failed to delete review', {
                    position: 'top-right',
                    duration: 3000
                });
            }
        },
        async submitReview() {
            if (!this.authStore.isAuthenticated) {
                this.toast.error('Please login to submit a review', {
                    position: 'top-right',
                    duration: 3000
                });
                return;
            }

            if (!this.newReview.comment.trim()) {
                this.toast.error('Review comment cannot be empty', {
                    position: 'top-right',
                    duration: 3000
                });
                return;
            }

            try {
                const newReview = {
                    ...this.newReview,
                    productId: this.product.data.id,
                    userId: this.authStore.user.id,
                    comment: this.newReview.comment.trim()
                };

                const response = await reviewApi.postReview(newReview);
                this.reviews.unshift(response.data.result);
                this.resetReview();

                this.toast.success('Review submitted successfully!', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '✍️'
                });
            } catch (error) {
                this.toast.error('Failed to submit review', {
                    position: 'top-right',
                    duration: 3000
                });
            }
        },
        resetReview() {
            this.newReview = {
                rating: 5,
                comment: ''
            };
        },
        handleSignOut() {
            this.authStore.logout();
        }
    },
    async created() {
        try {
            const productId = this.$route.params.id;
            const [productResponse, reviewsResponse] = await Promise.all([
                productApi.getProductById(productId),
                reviewApi.getReviews(productId)
            ]);

            this.product = productResponse;
            this.reviews = reviewsResponse.data.result;
            
            // Populate image gallery (in real app, these would come from API)
            this.imageGallery = [
                this.product.data.imageUrl,
                this.product.data.imageUrl,
                this.product.data.imageUrl,
                this.product.data.imageUrl
            ];
        } catch (error) {
            this.toast.error('Error loading product details', {
                position: 'top-right',
                duration: 3000
            });
        } finally {
            this.isLoading = false;
        }
    },
    beforeUnmount() {
        document.body.style.overflow = 'auto';
    },
    watch:{
        reviews(newReviews){
            this.refreshReviews();
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

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="h-[300px] md:h-[600px] bg-gray-200 rounded-2xl animate-pulse"></div>
                <div class="space-y-6">
                    <div class="h-10 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                    <div class="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                    <div class="h-8 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
                </div>
            </div>
        </div>

        <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Breadcrumb -->
            <nav class="mb-12" aria-label="Breadcrumb">
                <ol class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <li><router-link to="/" class="hover:text-indigo-600 transition-colors">Home</router-link></li>
                    <li><span class="text-gray-400">/</span></li>
                    <li><router-link to="/shop" class="hover:text-indigo-600 transition-colors">Products</router-link>
                    </li>
                    <li><span class="text-gray-400">/</span></li>
                    <li class="text-indigo-600 font-medium">{{ product.data.name }}</li>
                </ol>
            </nav>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <!-- Product Image with Gallery -->
                <div class="space-y-6">
                    <div class="relative group">
                        <div
                            class="h-[300px] md:h-[600px] rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                            <img :src="imageGallery[currentImageIndex]" :alt="product.data.name"
                                class="w-full h-full object-cover object-center cursor-zoom-in transform hover:scale-105 transition-transform duration-500"
                                @click="toggleZoom">
                        </div>
                        
                        <!-- Navigation arrows -->
                        <button @click="previousImage"
                            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button @click="nextImage"
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <!-- Thumbnail Gallery -->
                    <div class="grid grid-cols-4 gap-4">
                        <div v-for="(image, index) in imageGallery" :key="index"
                            @click="currentImageIndex = index"
                            class="aspect-square rounded-xl bg-white shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                            :class="{'ring-2 ring-indigo-600': currentImageIndex === index}">
                            <img :src="image" :alt="product.data.name"
                                class="w-full h-full object-cover">
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="flex flex-col bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    <div class="sticky top-4">
                        <h1
                            class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                            {{ product.data.name }}
                        </h1>

                        <!-- Rating -->
                        <div class="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
                            <div class="flex">
                                <template v-for="i in 5" :key="i">
                                    <div class="relative">
                                        <i class="fas fa-star text-gray-200"></i>
                                        <i class="fas fa-star text-yellow-400 absolute top-0 left-0" :style="{
                                            clipPath: i <= Math.floor(product.data.rating)
                                                ? 'inset(0 0 0 0)'
                                                : i === Math.ceil(product.data.rating)
                                                    ? `inset(0 ${100 - ((product.data.rating % 1) * 100)}% 0 0)`
                                                    : 'inset(0 100% 0 0)'
                                        }"></i>
                                    </div>
                                </template>
                            </div>
                            <span class="text-base md:text-lg text-gray-600 font-medium">({{ averageRating }} / 5) • {{
                                reviews.length }} Reviews</span>
                        </div>

                        <!-- Price -->
                        <div
                            class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 transform hover:scale-[1.02] transition-all">
                            <div class="flex items-center gap-6">
                                <p class="text-4xl md:text-5xl font-bold text-indigo-600">
                                    ${{ product.data.price.toFixed(2) }}
                                </p>
                                <div class="flex flex-col">
                                    <span class="text-lg md:text-xl text-gray-500 line-through">${{ (product.data.price *
                                        1.2).toFixed(2) }}</span>
                                    <span class="text-base md:text-lg text-green-600 font-semibold">20% OFF</span>
                                </div>
                            </div>
                        </div>

                        <!-- Benefits -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div v-for="benefit in benefits" :key="benefit.text"
                                class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all transform hover:scale-[1.02]">
                                <svg v-if="benefit.text === 'Free Shipping'" class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-if="benefit.text === '30 Days Return'" class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <svg v-if="benefit.text === '2 Year Warranty'" class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <svg v-if="benefit.text === '24/7 Support'" class="w-6 h-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span class="font-medium text-gray-800">{{ benefit.text }}</span>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="prose prose-lg mb-6">
                            <p class="text-gray-700 leading-relaxed">{{ product.data.description }}</p>
                        </div>

                        <!-- Stock Status -->
                        <div class="mb-6">
                            <div class="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium shadow-sm transform hover:scale-[1.02] transition-all"
                                :class="product.data.stockQuantity > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                                <i class="fas text-xl mr-2"
                                    :class="product.data.stockQuantity > 0 ? 'fa-check-circle' : 'fa-times-circle'"></i>
                                <span>{{ product.data.stockQuantity > 0 ? 'In Stock' : 'Out of Stock' }}</span>
                                <span class="ml-2">({{ product.data.stockQuantity }} available)</span>
                            </div>
                        </div>

                        <!-- Add to Cart -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                                <span class="text-lg text-gray-700 font-medium">Quantity</span>
                                <div class="flex items-center gap-4">
                                    <button @click="decrementQuantity"
                                        class="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all transform hover:scale-[1.1]">
                                        <span class="text-gray-600 text-xl font-semibold">-</span>
                                    </button>
                                    <span class="text-2xl font-medium text-gray-700 w-8 text-center">{{ quantity }}</span>
                                    <button @click="incrementQuantity"
                                        class="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all transform hover:scale-[1.1]">
                                        <span class="text-gray-600 text-xl font-semibold">+</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                class="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-4 px-6 text-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden"
                                @click="addToCart(product.data.id, quantity)" :disabled="product.data.stockQuantity === 0">
                                <span :class="{'opacity-0': showAddedAnimation}">Add to Cart</span>
                                <span v-if="showAddedAnimation"
                                    class="absolute inset-0 flex items-center justify-center text-white">
                                    <i class="fas fa-check-circle text-2xl"></i>
                                </span>
                            </button>

                            <!-- Payment Methods -->
                            <div class="flex flex-col items-center gap-4 pt-6 border-t">
                                <span class="text-sm text-gray-500 font-medium">Secure Payment Methods</span>
                                <div class="flex flex-wrap justify-center gap-6">
                                    <i v-for="method in paymentMethods" :key="method.name" :class="[method.icon]"
                                        class="text-3xl text-gray-600 hover:text-gray-800 transition-all transform hover:scale-[1.1]">
                                    </i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reviews Section -->
            <div class="mt-20 bg-white rounded-2xl shadow-xl p-10">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <h2 class="text-3xl font-bold text-gray-900">Customer Reviews</h2>
                    <div class="flex items-center gap-8">
                        <div class="text-center">
                            <span class="text-5xl font-bold text-indigo-600">{{ averageRating }}</span>
                            <div class="flex text-yellow-400 justify-center mt-2">
                                <i v-for="i in 5" :key="i" class="fas fa-star text-xl"
                                    :class="i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'">
                                </i>
                            </div>
                            <span class="text-sm text-gray-500 mt-1 block">Based on {{ reviews.length }} reviews</span>
                        </div>
                        
                        <!-- Rating Distribution -->
                        <div class="space-y-2">
                            <div v-for="item in ratingPercentages.slice().reverse()" :key="item.rating" 
                                class="flex items-center gap-2">
                                <span class="text-sm text-gray-600 w-6">{{ item.rating }}★</span>
                                <div class="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-yellow-400 rounded-full"
                                        :style="{ width: `${item.percentage}%` }">
                                    </div>
                                </div>
                                <span class="text-sm text-gray-600">{{ item.percentage }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Review Form -->
                <form @submit.prevent="submitReview"
                    class="mb-16 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-8">
                    <h3 class="text-2xl font-semibold mb-6">Write a Review</h3>
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div class="flex gap-3">
                                <button v-for="star in 5" :key="star" type="button" @click="newReview.rating = star"
                                    class="text-3xl focus:outline-none transition-colors transform hover:scale-110"
                                    :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'">
                                    <i class="fas fa-star"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea v-model="newReview.comment" rows="4"
                                class="w-full rounded-xl p-4 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Share your thoughts about this product..."
                                required></textarea>
                        </div>
                        <button type="submit"
                            class="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors transform hover:scale-[1.02]">
                            Submit Review
                        </button>
                    </div>
                </form>

                <!-- Reviews List -->
                <div class="space-y-10">
                    <div v-for="review in reviews" :key="review.id" 
                        class="border-b pb-8 transition-all duration-300 hover:bg-gray-50 rounded-xl p-6">
                        <div class="flex justify-between items-start gap-4 mb-6">
                            <div class="flex items-start gap-4">
                                <img :src="review.userProfilePicture" :alt="review.userFullName"
                                    class="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100">
                                <div>
                                    <div class="flex flex-wrap items-center gap-3 mb-2">
                                        <h4 class="font-medium text-xl text-gray-900">{{ review.userFullName }}</h4>
                                        <div v-if="review.userId === authStore.user?.id" class="flex gap-3">
                                            <button @click="startEditReview(review)"
                                                class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                                                <i class="fas fa-edit"></i>
                                                Edit
                                            </button>
                                            <button @click="deleteReview(review.id)"
                                                class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1">
                                                <i class="fas fa-trash-alt"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div class="flex gap-1">
                                            <template v-if="editingReview?.id === review.id">
                                                <button v-for="star in 5" :key="star"
                                                    @click="editingReview.rating = star" 
                                                    class="fas fa-star text-xl transition-colors"
                                                    :class="star <= editingReview.rating ? 'text-yellow-400' : 'text-gray-200'">
                                                </button>
                                            </template>
                                            <template v-else>
                                                <i v-for="star in 5" :key="star" 
                                                    class="fas fa-star text-xl"
                                                    :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'">
                                                </i>
                                            </template>
                                        </div>
                                        <span class="text-sm text-gray-500">{{ review.reviewDate }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="editingReview?.id === review.id" class="space-y-4">
                            <textarea v-model="editingReview.comment" rows="4"
                                class="w-full rounded-xl p-4 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                            </textarea>
                            <div class="flex gap-4">
                                <button @click="updateReview(review)"
                                    class="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                                    <i class="fas fa-save"></i>
                                    Save Changes
                                </button>
                                <button @click="cancelEditReview"
                                    class="text-gray-600 hover:text-gray-800 px-6 py-2 text-sm font-medium flex items-center gap-2">
                                    <i class="fas fa-circle-xmark"></i>
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <p v-else class="text-gray-700 leading-relaxed text-lg">{{ review.comment }}</p>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>