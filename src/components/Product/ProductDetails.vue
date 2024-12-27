<script>
import { cartService } from '@/services/cartService'
import NavBar from '@/components/NavBar.vue'
import Chatbot from '@/components/HomePage/Chatbot.vue'
import Footer from '@/components/Footer.vue';
import productApi from '@/api/productApi';
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toastification'
import { reviewApi } from '@/api/reviewApi'

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
                { name: 'PayPal', icon: 'fab fa-cc-paypal' }
            ]
        }
    },
    computed: {
        isAuthenticated() {
            return this.authStore.isAuthenticated
        },
        // Add computed property for average rating
        averageRating() {
            if (!this.reviews.length) return 0;
            return (this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length).toFixed(1);
        }
    },
    watch: {
        // Add watcher for isZoomed to handle body overflow
        isZoomed(newValue) {
            document.body.style.overflow = newValue ? 'hidden' : 'auto';
        }
    },
    methods: {
        async addToCart(productId, quantity) {
            try {
                await cartService.addToCart(productId, quantity);
                this.toast.success('Product added to cart successfully!', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '🛍️'
                });
            } catch (error) {
                this.toast.error('Failed to add product to cart', {
                    position: 'top-right',
                    duration: 3000
                });
            }
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
            if (!this.isAuthenticated) {
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
            if (!this.isAuthenticated) {
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
            if (!this.isAuthenticated) {
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
            this.authStore.signOut();
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
        // Cleanup body overflow style when component is destroyed
        document.body.style.overflow = 'auto';
    }
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <NavBar :is-authenticated="isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />

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
            <nav class="mb-12">
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
                    <div
                        class="h-[300px] md:h-[600px] rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                        <img :src="product.data.imageUrl" :alt="product.data.name"
                            class="w-full h-full object-cover object-center cursor-zoom-in transform hover:scale-105 transition-transform duration-500"
                            @click="toggleZoom">
                    </div>
                    <!-- Thumbnail Gallery -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                        <div v-for="n in 4" :key="n"
                            class="aspect-square rounded-xl bg-white shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <img :src="product.data.imageUrl" :alt="product.data.name"
                                class="w-full h-full object-cover">
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="flex flex-col bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    <h1
                        class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                        {{ product.data.name }}
                    </h1>

                    <!-- Rating -->
                    <div class="flex flex-wrap items-center gap-4 md:gap-6 mb-4">
                        <div class="flex">
                            <template v-for="i in 5" :key="i">
                                <div class="relative">
                                    <!-- Empty star (background) -->
                                    <i class="fas fa-star text-gray-200"></i>
                                    <!-- Filled star overlay with clip-path -->
                                    <i class="fas fa-star text-yellow-400 absolute top-0 left-0" :style="{
                                        clipPath: i <= Math.floor(product.data.rating)
                                            ? 'inset(0 0 0 0)'
                                            : i === Math.ceil(product.data.rating)
                                                ? `inset(0 ${100 - ((product.data.rating % 1) * 100)}% 0 0)`
                                                : 'inset(0 100% 0 0)'
                                    }
                                        ">
                                    </i>
                                </div>
                            </template>
                        </div>
                        <span class="text-base md:text-lg text-gray-600 font-medium">({{ averageRating }} / 5) • {{
                            reviews.length }}
                            Reviews</span>
                    </div>

                    <!-- Price -->
                    <div
                        class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 mb-4 transform hover:scale-[1.02] transition-all">
                        <div class="flex items-center gap-4 md:gap-6">
                            <p class="text-3xl md:text-4xl font-bold text-indigo-600">
                                ${{ product.data.price.toFixed(2) }}
                            </p>
                            <div class="flex flex-col">
                                <span class="text-base md:text-lg text-gray-500 line-through">${{ (product.data.price *
                                    1.2).toFixed(2)
                                    }}</span>
                                <span class="text-sm md:text-base text-green-600 font-semibold">20% OFF</span>
                            </div>
                        </div>
                    </div>

                    <!-- Benefits -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div v-for="benefit in benefits" :key="benefit.text"
                            class="flex items-center gap-3 justify-center bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-all transform hover:scale-[1.02]">
                            <span class="font-medium text-gray-800 text-sm">{{ benefit.text }}</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="prose prose-sm mb-4">
                        <p class="text-gray-700 leading-relaxed">{{ product.data.description }}</p>
                    </div>

                    <!-- Stock Status -->
                    <div class="mb-4">
                        <div class="inline-flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base font-medium shadow-sm transform hover:scale-[1.02] transition-all"
                            :class="product.data.stockQuantity > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                            <i class="fas text-lg md:text-xl mr-2"
                                :class="product.data.stockQuantity > 0 ? 'fa-check-circle' : 'fa-times-circle'"></i>
                            <span>{{ product.data.stockQuantity > 0 ? 'In Stock' : 'Out of Stock' }}</span>
                            <span class="ml-2">({{ product.data.stockQuantity }} available)</span>
                        </div>
                    </div>

                    <!-- Add to Cart -->
                    <div class="mt-auto space-y-4">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <span class="text-base md:text-lg text-gray-700 font-medium">Quantity</span>
                            <div class="flex items-center gap-4">
                                <button @click="decrementQuantity"
                                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all transform hover:scale-[1.1]">
                                    <span class="text-gray-600 text-lg md:text-xl font-semibold">-</span>
                                </button>
                                <span class="text-xl md:text-2xl font-medium text-gray-700 w-6 md:w-8 text-center">{{
                                    quantity }}</span>
                                <button @click="incrementQuantity"
                                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all transform hover:scale-[1.1]">
                                    <span class="text-gray-600 text-lg md:text-xl font-semibold">+</span>
                                </button>
                            </div>
                        </div>

                        <button
                            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3 md:py-4 px-4 md:px-6 text-base md:text-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                            @click="addToCart(product.data.id, quantity)" :disabled="product.data.stockQuantity === 0">
                            Add to Cart
                        </button>

                        <!-- Payment Methods -->
                        <div class="flex flex-col items-center gap-3 pt-4 border-t">
                            <span class="text-xs text-gray-500 font-medium">Secure Payment Methods</span>
                            <div class="flex flex-wrap justify-center gap-4">
                                <i v-for="method in paymentMethods" :key="method.name" :class="[method.icon]"
                                    class="text-2xl md:text-3xl text-gray-600 hover:text-gray-800 transition-all transform hover:scale-[1.1]">
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reviews Section -->
            <div class="mt-12 md:mt-20 bg-white rounded-2xl shadow-xl p-6 md:p-10">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Customer Reviews</h2>
                    <div class="flex items-center gap-4">
                        <span class="text-4xl md:text-5xl font-bold text-indigo-600">{{ product.data.rating }}</span>
                        <div class="flex flex-col">
                            <div class="flex text-yellow-400">
                                <i v-for="i in 5" :key="i" class="fas fa-star text-lg md:text-xl"
                                    :class="i <= product.data.rating ? 'text-yellow-400' : 'text-gray-200'">
                                </i>
                            </div>
                            <span class="text-sm text-gray-500">Based on {{ reviews.length }} reviews</span>
                        </div>
                    </div>
                </div>

                <!-- Add Review Form -->
                <form @submit.prevent="submitReview"
                    class="mb-12 md:mb-16 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 md:p-8">
                    <h3 class="text-xl md:text-2xl font-semibold mb-6">Write a Review</h3>
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div class="flex gap-3">
                                <button v-for="star in 5" :key="star" type="button" @click="newReview.rating = star"
                                    class="text-2xl md:text-3xl focus:outline-none transition-colors"
                                    :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'">
                                    <i class="fas fa-star"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea v-model="newReview.comment" rows="4"
                                class="w-full rounded-xl p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                required></textarea>
                        </div>
                        <button type="submit"
                            class="bg-indigo-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl text-base md:text-lg font-medium hover:bg-indigo-700 transition-colors transform hover:scale-[1.02]">
                            Submit Review
                        </button>
                    </div>
                </form>

                <!-- Reviews List -->
                <div class="space-y-8 md:space-y-10">
                    <div v-for="review in reviews" :key="review.id" class="border-b pb-6 md:pb-8">
                        <div class="flex justify-between items-start gap-4 mb-4 md:mb-6">
                            <div class="flex items-start gap-4">
                                <img :src="review.userProfilePicture" :alt="review.userFullName"
                                    class="w-12 h-12 rounded-full object-cover">
                                <div>
                                    <div class="flex flex-wrap items-center gap-3 mb-2">
                                        <h4 class="font-medium text-lg md:text-xl text-gray-900">{{ review.userFullName
                                            }}</h4>
                                        <div v-if="review.userId === authStore.user?.id" class="flex gap-3">
                                            <button @click="startEditReview(review)"
                                                class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                                Edit
                                            </button>
                                            <button @click="deleteReview(review.id)"
                                                class="text-red-600 hover:text-red-800 text-sm font-medium">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div class="flex gap-1">
                                            <template v-if="editingReview?.id === review.id">
                                                <button v-for="star in 5" :key="star"
                                                    @click="editingReview.rating = star" class="fas fa-star"
                                                    :class="star <= editingReview.rating ? 'text-yellow-400' : 'text-gray-200'">
                                                </button>
                                            </template>
                                            <template v-else>
                                                <i v-for="star in 5" :key="star" class="fas fa-star"
                                                    :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'">
                                                </i>
                                            </template>
                                        </div>
                                        <span class="text-sm text-gray-500">{{ review.reviewDate }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="editingReview?.id === review.id">
                            <textarea v-model="editingReview.comment" rows="4"
                                class="w-full rounded-xl p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 mb-4">
                </textarea>
                            <div class="flex gap-4">
                                <button @click="updateReview(review)"
                                    class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700">
                                    Save Changes
                                </button>
                                <button @click="cancelEditReview"
                                    class="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium">
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <p v-else class="text-gray-700 leading-relaxed text-base md:text-lg">{{ review.comment }}</p>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>