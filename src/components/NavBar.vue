<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    Cog6ToothIcon,
    HomeIcon,
    ShoppingCartIcon,
    TagIcon,
    PhoneIcon,
    ArrowRightStartOnRectangleIcon,
    ShoppingBagIcon,
    HeartIcon,
    InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/useAuthStore'

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
        InformationCircleIcon
    },
    props: {
        isAuthenticated: Boolean,
        user: Object
    },
    data() {
        return {
            mobileMenuOpen: false,
            notifications: 3,
            guestNavigation: [
                { name: 'Home', href: '/', icon: HomeIcon },
                { name: 'Products', href: '/shop', icon: ShoppingCartIcon },
                { name: 'About', href: '/about', icon: InformationCircleIcon },
                { name: 'Support', href: '/support', icon: PhoneIcon }
            ],
            authenticatedNavigation: [
                { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
                { name: 'Products', href: '/shop', icon: ShoppingBagIcon },
                { name: 'Wishlist', href: '/wishlist', icon: HeartIcon },
                { name: 'Cart', href: '/cart', icon: ShoppingCartIcon, badge: '3' }
            ],
        }
    },
    methods: {
        handleSignOut() {
            this.$emit('sign-out')
        },
        navigateTo(href) {
            if (href === '#') {
                this.handleSignOut()
                return
            }
            // Close mobile menu after navigation
            this.mobileMenuOpen = false
            this.$router.push(href).catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    throw err
                }
            })
        },
        handleImageError(event) {
            // Заменяме със стандартна икона при грешка при зареждане на изображението
            event.target.style.display = 'none';
            // Можете да добавите допълнителна логика тук
        }
    },
    watch: {
        isAuthenticated(newVal) {
            console.log('Auth status changed:', newVal);
        },
        user: {
            handler(newVal) {
                console.log('User data changed:', newVal);
            },
            deep: true
        },
        '$route'() {
            // Close mobile menu on route change
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
                { name: 'My Orders', href: '/my-orders', icon: ShoppingBagIcon },
                { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
                { name: 'Sign out', href: '#', icon: ArrowRightStartOnRectangleIcon, actions: this.handleSignOut }
            ]
        },
        getFullName() {
            if (!this.user) return '';
            return `${this.user.firstName} ${this.user.lastName}`;
        },
        userProfilePicture() {
            return this.user?.profilePictureUrl || '';
        }
    },
    mounted() {
        console.log('User data in NavBar:', this.user);
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
                            class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                            active-class="text-indigo-600 border-b-2 border-indigo-600">
                            <component :is="item.icon" class="h-5 w-5 mr-1.5" />
                            {{ item.name }}
                            <span v-if="item.name === 'Cart'"
                                class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {{ user.cartProducts.length }}
                            </span>
                        </router-link>
                    </div>
                </div>
                <div class="hidden md:ml-6 md:flex md:items-center">
                    <template v-if="isAuthenticated">
                        <button type="button"
                            class="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                            <BellIcon class="h-6 w-6" />
                            <span v-if="notifications"
                                class="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {{ notifications }}
                            </span>
                        </button>

                        <Menu as="div" class="relative ml-3">
                            <div>
                                <MenuButton class="flex rounded-full bg-white text-sm focus:outline-none">
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
                                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div class="px-4 py-2 border-b">
                                        <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                                        <p class="text-xs text-gray-500">{{ user.email }}</p>
                                        <p class="text-xs text-gray-500 mt-1">{{ user.address }}</p>
                                    </div>
                                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                    <a :href="item.href" @click.prevent="navigateTo(item.href)"
                                        :class="[active ? 'bg-gray-100' : '', 'flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50']">
                                        <component :is="item.icon" class="h-5 w-5 mr-2 text-gray-500" />
                                        {{ item.name }}
                                    </a>
                                    </MenuItem>
                                </MenuItems>
                            </transition>
                        </Menu>
                    </template>
                    <template v-else>
                        <router-link to="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                            text-white bg-indigo-600 hover:bg-indigo-700">
                            Sign in
                        </router-link>
                    </template>
                </div>

                <div class="flex items-center md:hidden">
                    <button type="button" @click="mobileMenuOpen = !mobileMenuOpen"
                        class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
                        <XMarkIcon v-else class="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>

        <div v-if="mobileMenuOpen" class="md:hidden">
            <div class="space-y-1 pb-3 pt-2">
                <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                    class="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    active-class="text-indigo-600 bg-indigo-50">
                    <component :is="item.icon" class="h-5 w-5 mr-2" />
                    {{ item.name }}
                    <span v-if="item.badge"
                        class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {{ item.badge }}
                    </span>
                </router-link>
            </div>
            <template v-if="isAuthenticated">
                <div class="border-t border-gray-200 pb-3 pt-4">
                    <div class="flex items-center px-4">
                        <div class="flex-shrink-0">
                            <img v-if="userProfilePicture" :src="user.profilePictureUrl"
                                class="h-10 w-10 rounded-full object-cover block" :alt="user.name" />
                            <UserCircleIcon v-else class="h-10 w-10 text-gray-400" />
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
                            <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
                        </div>
                    </div>
                    <div class="mt-3 space-y-1">
                        <router-link v-for="item in userNavigation" :key="item.name" :to="item.href"
                            @click="item.href === '#' ? handleSignOut() : null"
                            class="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                            <component :is="item.icon" class="h-5 w-5 mr-2" />
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="px-4 py-3">
                    <router-link to="/login" class="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                        text-white bg-indigo-600 hover:bg-indigo-700 no-underline !text-white">
                        Sign in
                    </router-link>
                </div>
            </template>
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
</style>