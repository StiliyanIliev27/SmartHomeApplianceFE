import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../components/HomeComponent.vue';
import LoginComponent from '../components/Authentication/LoginComponent.vue'
import RegisterComponent from '@/components/Authentication/RegisterComponent.vue';
import EmailConfirmationPending from '@/components/Email/EmailConfirmationPending.vue'
import EmailConfirmationSuccess from '@/components/Email/EmailConfirmationSuccess.vue'

const routes = [
  {
    path: '/',
    name: 'Landing Page',
    component: HomeComponent,
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
