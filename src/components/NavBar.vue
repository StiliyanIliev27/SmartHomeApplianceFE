<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    HomeIcon,
    ShoppingCartIcon,
    TagIcon,
    PhoneIcon,
    ArrowRightStartOnRectangleIcon,
    ShoppingBagIcon,
    HeartIcon,
    InformationCircleIcon,
    XMarkIcon as XIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon
} from '@heroicons/vue/24/outline'
import { cartService } from '@/services/cartService'
import cartApi from '@/api/cartApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toastification'

export default {
    name: 'NavBar',
    components: {
        Menu,
        MenuButton,
        MenuItems,
        MenuItem,
        UserCircleIcon,
        Bars3Icon,
        XMarkIcon,
        BellIcon,
        ShoppingCartIcon,
        TagIcon,
        PhoneIcon,
        ArrowRightStartOnRectangleIcon,
        ShoppingBagIcon,
        HeartIcon,
        InformationCircleIcon,
        XIcon,
        ClipboardDocumentListIcon
    },
    props: {
        isAuthenticated: Boolean,
        user: Object
    },
    setup() {
        return { 
            authStore: useAuthStore(),
            toast: useToast()
        }
    },
    data() {
        return {
            mobileMenuOpen: false,
            notifications: [
                {
                    id: 1,
                    title: 'Order Shipped',
                    message: 'Your order #1234 has been shipped',
                    time: '1 hour ago',
                    read: false
                },
                {
                    id: 2, 
                    title: 'Price Drop Alert',
                    message: 'An item in your wishlist is now on sale',
                    time: '2 hours ago',
                    read: false
                },
                {
                    id: 3,
                    title: 'New Product Available',
                    message: 'Check out our latest home decor collection',
                    time: '1 day ago',
                    read: true
                }
            ],
            showNotifications: false,
            showCartPreview: false,
            cartHoverTimeout: null,
            cartItems: [],
            guestNavigation: [
                { name: 'Home', href: '/', icon: HomeIcon },
                { name: 'Products', href: '/shop', icon: ShoppingCartIcon },
                { name: 'About', href: '/about', icon: InformationCircleIcon },
                { name: 'Support', href: '/support', icon: PhoneIcon }
            ],
            authenticatedNavigation: [             
                { name: 'Products', href: '/shop', icon: ShoppingBagIcon },
                { name: 'My Orders', href: '/orders', icon: ClipboardDocumentListIcon },
                { name: 'Cart', href: '/cart', icon: ShoppingCartIcon },
                { name: 'Technicians', href: '/technicians', icon: UserGroupIcon },
                { name: 'Support', href: '/support', icon: PhoneIcon },
                { name: 'About', href: '/about', icon: InformationCircleIcon },
            ],
        }
    },
    methods: {
        async updateQuantity(productId, newQuantity, event) {
           if (newQuantity < 1) return;
           
           try {
               event.preventDefault();
               event.stopPropagation();
               
               if (newQuantity < 1) {
                    await cartService.removeFromCart(productId);
                } else {
                    await cartService.updateCart(productId, newQuantity);
                }

                await this.refreshCart();
                this.toast.success('Cart updated successfully');
           } catch (error) {
               console.error('Error updating quantity:', error);
               this.toast.error('Failed to update cart');
           }
       },
       async refreshCart() {
           try {
               const response = await cartApi.getCart();
               // Filter out products with quantity 0 or undefined
               const validProducts = response.data.result.cartProducts.filter(product => product.quantity > 0);
               this.authStore.user.cartProducts = validProducts;
               this.cartItems = validProducts;
           } catch (error) {
               console.error('Error refreshing cart:', error);
               // Reset cart items if there's an error
               this.cartItems = [];
               this.authStore.user.cartProducts = [];
           }
       },
       incrementQuantity(productId, currentQuantity, event) {
           event.preventDefault();
           event.stopPropagation();
           this.updateQuantity(productId, currentQuantity + 1, event);
       },     
       async decrementQuantity(productId, currentQuantity, event) {
           event.preventDefault(); 
           event.stopPropagation();
           try {
               if (currentQuantity > 1) {
                   await this.updateQuantity(productId, currentQuantity - 1, event);
               } else if(currentQuantity === 1) {
                    await cartService.removeFromCart(productId);
                    await this.refreshCart();
                    this.toast.success('Product removed from cart');
               }
           } catch (error) {
               this.toast.error('Failed to update cart');
           }
       },
        handleSignOut() {
            this.$emit('sign-out')
        },
        navigateTo(href) {
            if (href === '#') {
                this.handleSignOut()
                return
            }
            this.mobileMenuOpen = false
            this.$router.push(href).catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    throw err
                }
            })
        },
        handleImageError(event) {
            event.target.style.display = 'none';
        },
        showCart() {
            if (this.cartHoverTimeout) {
                clearTimeout(this.cartHoverTimeout);
            }
            this.showCartPreview = true;
        },
        hideCart() {
            this.cartHoverTimeout = setTimeout(() => {
                this.showCartPreview = false;
            }, 300);
        },
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
        },
        markAsRead(notificationId) {
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
            }
        }
    },
    watch: {
        isAuthenticated(newVal) {
            if (newVal) {
                this.refreshCart();
            } else {
                // Clear cart when logged out
                this.cartItems = [];
            }
        },
        user: {
            handler(newVal) {
                if (newVal) {
                    this.refreshCart();
                }
            },
            deep: true
        },
        '$route'() {
            this.mobileMenuOpen = false
        }
    },
    computed: {
        navigation() {
            return this.isAuthenticated ? this.authenticatedNavigation : this.guestNavigation
        },
        userNavigation() {
            return [
                { name: 'Your Profile', href: '/profile', icon: UserCircleIcon },
                { name: 'Sign out', href: '#', icon: ArrowRightStartOnRectangleIcon, actions: this.handleSignOut }
            ]
        },
        getFullName() {
            if (!this.user) return '';
            return `${this.user.firstName} ${this.user.lastName}`;
        },
        userProfilePicture() {
            return this.user?.profilePictureUrl || '';
        },
        cartTotal() {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
        },
        unreadNotificationsCount() {
            return this.notifications.filter(n => !n.read).length;
        }
    },
    async mounted() {
        if (this.isAuthenticated) {
            await this.refreshCart();
        }
    },
    beforeDestroy() {
        if (this.cartHoverTimeout) {
            clearTimeout(this.cartHoverTimeout);
        }
    }
}
</script>

<template>
    <nav class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <router-link to="/" class="text-2xl font-bold text-emerald-600 mr-8">HomeCraft</router-link>
                    </div>
                    <div class="hidden md:ml-6 md:flex md:space-x-8">
                        <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                            class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600 relative"
                            active-class="text-indigo-600 border-b-2 border-indigo-600"
                            @mouseenter="item.name === 'Cart' ? showCart() : null"
                            @mouseleave="item.name === 'Cart' ? hideCart() : null">
                            <component :is="item.icon" class="h-5 w-5 mr-1.5" />
                            {{ item.name }}
                            <span v-if="item.name === 'Cart' && user?.cartProducts?.length"
                                class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {{ user.cartProducts.length }}
                            </span>

                            <!-- Cart Preview Popup -->
                            <div v-if="item.name === 'Cart' && showCartPreview && user?.cartProducts?.length > 0"
                                class="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50 transform transition-all duration-200 ease-in-out"
                                @mouseenter="showCart()"
                                @mouseleave="hideCart()">
                                <div class="p-4">
                                    <div class="flex justify-between items-center mb-3">
                                        <h3 class="text-base font-semibold text-gray-900">Cart Preview</h3>
                                        <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                            {{ user.cartProducts.length }}
                                        </span>
                                    </div>
                                    <div class="max-h-48 overflow-y-auto custom-scrollbar">
                                        <div v-for="product in user.cartProducts.slice(0,3)" :key="product.productId"
                                            class="flex items-center py-2 border-b border-gray-50 last:border-b-0 group hover:bg-gray-50 rounded-md px-2 transition-all duration-150">
                                            <img :src="product.imageUrl || '/placeholder.png'"
                                                class="w-12 h-12 object-cover rounded-md shadow-sm"
                                                :alt="product.name">
                                            <div class="ml-3 flex-grow">
                                                <h4 class="text-xs font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{{ product.productName }}</h4>
                                                <div class="flex justify-between items-center mt-1">
                                                    <div class="flex items-center space-x-2">
                                                        <button @click="decrementQuantity(product.productId, product.quantity, $event)" 
                                                                class="text-xs w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600">
                                                            -
                                                        </button>
                                                        <span class="text-xs text-gray-500">{{ product.quantity }}</span>
                                                        <button @click="incrementQuantity(product.productId, product.quantity, $event)"
                                                                class="text-xs w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600">
                                                            +
                                                        </button>
                                                    </div>
                                                    <span class="text-xs font-medium text-indigo-600">${{ product.price }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3 pt-2 border-t border-gray-100">
                                        <div class="flex justify-between items-center mb-3">
                                            <span class="text-sm font-medium text-gray-900">Total</span>
                                            <span class="text-sm font-bold text-indigo-600">
                                                ${{ cartTotal }}
                                            </span>
                                        </div>
                                        <div class="space-y-2">
                                            <router-link to="/cart"
                                                class="block w-full text-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
                                                View Cart
                                            </router-link>
                                            <router-link to="/checkout"
                                                class="block w-full text-center px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-md hover:bg-gray-100 transition-colors">
                                                Checkout
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div class="flex items-center">
                    <!-- Desktop Navigation -->
                    <div class="hidden lg:flex lg:items-center lg:space-x-6">
                        <template v-if="isAuthenticated">
                            <!-- Notifications -->
                            <div class="relative">
                                <button type="button" @click="toggleNotifications"
                                    class="relative rounded-full bg-white p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <BellIcon class="h-5 w-5" />
                                    <span v-if="unreadNotificationsCount"
                                        class="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-xs font-bold text-white">
                                        {{ unreadNotificationsCount }}
                                    </span>
                                </button>

                                <!-- Notifications Dropdown -->
                                <div v-if="showNotifications" 
                                    class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div class="p-4">
                                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Notifications</h3>
                                        <div v-if="notifications.length === 0" class="py-4 text-center text-gray-500">
                                            No notifications at the moment
                                        </div>
                                        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                                            <div v-for="notification in notifications" 
                                                :key="notification.id"
                                                :class="['p-3 rounded-lg transition-colors', notification.read ? 'bg-gray-50' : 'bg-indigo-50']"
                                                @click="markAsRead(notification.id)">
                                                <div class="flex justify-between items-start">
                                                    <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
                                                    <span class="text-xs text-gray-500">{{ notification.time }}</span>
                                                </div>
                                                <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- User Menu -->
                            <Menu as="div" class="relative">
                                <div>
                                    <MenuButton class="flex rounded-full ring-2 ring-gray-200 hover:ring-indigo-500 transition-all focus:outline-none">
                                        <img v-if="userProfilePicture" :src="user.profilePictureUrl"
                                            class="h-8 w-8 rounded-full object-cover block" :alt="user?.name"
                                            @error="handleImageError" />
                                        <UserCircleIcon v-else class="h-8 w-8 text-gray-400" />
                                    </MenuButton>
                                </div>
                                <transition enter-active-class="transition ease-out duration-200"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems
                                        class="absolute right-0 z-10 mt-3 w-64 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div class="px-4 py-3 border-b border-gray-100">
                                            <p class="text-base font-semibold text-gray-900">{{ user.name }}</p>
                                            <p class="text-sm text-gray-600 mt-1">{{ user.email }}</p>
                                            <p class="text-sm text-gray-500 mt-1">{{ user.address }}</p>
                                        </div>
                                        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                        <a :href="item.href" @click.prevent="navigateTo(item.href)"
                                            :class="[active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700', 'flex items-center px-4 py-3 text-base hover:bg-indigo-50 hover:text-indigo-700 transition-colors']">
                                            <component :is="item.icon" class="h-4 w-4 mr-3 text-gray-400" />
                                            {{ item.name }}
                                        </a>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>

                            <!-- Admin Panel Button -->
                            <div v-if="user.isAdmin">
                                <router-link to="/admin" 
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
                                    text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-150
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Admin Panel
                                </router-link>
                            </div>
                        </template>
                        <template v-else>
                            <router-link to="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                                text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all">
                                Sign in
                            </router-link>
                        </template>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button type="button" @click="mobileMenuOpen = !mobileMenuOpen"
                        class="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 ml-4">
                        <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
                        <XMarkIcon v-else class="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="lg:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    active-class="bg-indigo-50 text-indigo-600">
                    <div class="flex items-center">
                        <component :is="item.icon" class="h-5 w-5 mr-3" />
                        {{ item.name }}
                        <span v-if="item.badge"
                            class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {{ item.badge }}
                        </span>
                    </div>
                </router-link>
            </div>
            
            <div class="border-t border-gray-200 pb-3 pt-4">
                <template v-if="isAuthenticated">
                    <div class="flex items-center px-4">
                        <div class="flex-shrink-0">
                            <img v-if="userProfilePicture" :src="user.profilePictureUrl"
                                class="h-10 w-10 rounded-full object-cover" :alt="user.name" />
                            <UserCircleIcon v-else class="h-10 w-10 text-gray-400" />
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
                            <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
                        </div>
                    </div>
                    <div class="mt-3 space-y-1 px-2">
                        <router-link v-if="user?.isAdmin" to="/admin"
                            class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                            <div class="flex items-center">
                                <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                Admin Panel
                            </div>
                        </router-link>
                        <router-link v-for="item in userNavigation" :key="item.name" :to="item.href"
                            @click="item.href === '#' ? handleSignOut() : null"
                            class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                            <div class="flex items-center">
                                <component :is="item.icon" class="h-5 w-5 mr-3" />
                                {{ item.name }}
                            </div>
                        </router-link>
                    </div>
                </template>
                <template v-else>
                    <div class="px-4">
                        <router-link to="/login" class="block w-full text-center px-4 py-2 text-sm font-medium rounded-md 
                            text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                            Sign in
                        </router-link>
                    </div>
                </template>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.router-link-active {
    color: #4f46e5;
    border-bottom: 2px solid #4f46e5;
}

.router-link-active.bg-indigo-600 {
    color: white !important;
    border-bottom: none;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e5e7eb transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 2px;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>