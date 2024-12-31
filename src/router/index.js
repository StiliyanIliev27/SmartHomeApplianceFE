import { createRouter, createWebHistory } from 'vue-router'
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
import { useAuthStore } from '@/stores/useAuthStore'

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
