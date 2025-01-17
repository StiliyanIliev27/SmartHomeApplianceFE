import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import HomeComponent from '../components/HomeComponent.vue';
import LoginComponent from '../components/Authentication/LoginComponent.vue'
import RegisterComponent from '@/components/Authentication/RegisterComponent.vue';
import EmailConfirmationPending from '@/components/Email/EmailConfirmationPending.vue'
import EmailConfirmationSuccess from '@/components/Email/EmailConfirmationSuccess.vue'
import ShopComponent from '@/components/Shop/ShopComponent.vue'
import ResetPassword from '@/components/Authentication/ResetPassword.vue'
import ProductDetails from '@/components/Product/ProductDetails.vue'
import CartComponent from '@/components/Cart/Cart.vue'
import PaymentSuccess from '@/components/Cart/PaymentSuccess.vue'
import PaymentCancel from '@/components/Cart/PaymentCancel.vue'
import Orders from '@/components/Order/Orders.vue'
import Support from '@/components/Support.vue'
import AdminPanel from '@/components/Admin/AdminPanel.vue'
import AdminUsers from '@/components/Admin/AdminUsers.vue'
import AdminProducts from '@/components/Admin/AdminProducts.vue'
import AdminOrders from '@/components/Admin/AdminOrders.vue'
import AdminOrderDetails from '@/components/Admin/AdminOrderDetails.vue'
import About from '@/components/About.vue'
import UserProfile from '@/components/UserProfile/UserProfile.vue'
import TechniciansMap from '@/components/Technicians/TechniciansMap.vue'

export const menuItems = [
  { path: '/admin/users', name: 'Users', icon: 'UserIcon' },
  { path: '/admin/products', name: 'Products', icon: 'ProductIcon' },
  { path: '/admin/orders', name: 'Orders', icon: 'OrderIcon' }
];

const routes = [
  {
    path: '/',
    name: 'Landing Page',
    component: HomeComponent
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent
  },
  {
    path: '/confirm-email-pending',
    name: 'EmailConfirmationPending',
    component: EmailConfirmationPending
  },
  {
    path: '/confirm-email',
    name: 'EmailConfirmationSuccess',
    component: EmailConfirmationSuccess
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopComponent
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: ProductDetails
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartComponent,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/cancel',
    name: 'PaymentCancel',
    component: PaymentCancel,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    name: 'Support',
    component: Support
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders/:id',
    name: 'AdminOrderDetails',
    component: AdminOrderDetails,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/technicians',
    name: 'TechniciansMap',
    component: TechniciansMap,
    meta: { requiresAuth: true }

  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from storage before checking
  await authStore.initializeFromStorage()
  
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.isAdmin

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Landing Page' })
  } else {
    next()
  }
})

export default router
