import { defineStore } from 'pinia'
import { authApi } from '@/api/authApi'
import { cartApi } from '@/api/cartApi'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        token: null,
        loading: false,
        error: null
    }),

    actions: {
        async registerAsync(userData) {
            this.loading = true
            this.error = null

            try {
                return await authApi.register(userData)
            } catch (error) {
                throw new Error(error.response.data.errorMessages[0] || 'Registration failed');
            } finally {
                this.loading = false
            }
        },

        async login(credentials) {
            this.loading = true
            this.error = null

            try {
                const { data: { result: { user, token, isAdmin, isTechnician } } } = await authApi.login(credentials)

                const decodedToken = jwtDecode(token)
                const tokenExpiration = decodedToken.exp * 1000; // Времето на изтичане в милисекунди

                // Запазване на токена и времето на изтичане
                localStorage.setItem('token', token)
                localStorage.setItem('tokenExpiration', tokenExpiration)

                const cartProducts = await this.fetchCartProducts()

                this.user = {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    profilePictureUrl: user.profilePictureUrl,
                    cartProducts: cartProducts ? cartProducts : [],
                    isAdmin,
                    isTechnician
                }

                this.isAuthenticated = true
                localStorage.setItem('user', JSON.stringify(this.user))
                return true
            } catch (error) {
                this.error = error.response?.data?.message || 'Something went wrong'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchCartProducts() {
            try {
                const { status, data } = await cartApi.getCart()
                return status === 200 ? data.result.cartProducts : []
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log('Cart not found')
                } else {
                    console.error('Error fetching cart items:', error)
                }
                return []
            }
        },

        async initializeFromStorage() {
            const token = localStorage.getItem('token')
            const tokenExpiration = localStorage.getItem('tokenExpiration')
            const user = JSON.parse(localStorage.getItem('user'))
            const currentTime = new Date().getTime();

            // Проверка за валидност на токена
            if (token && tokenExpiration && currentTime < tokenExpiration) {
                try {
                    // Fetch latest user data to check current role
                    const { data: { result: { isAdmin, isTechnician } } } = await authApi.getCurrentUser()
                    
                    this.token = token
                    this.isAuthenticated = true
                    this.user = {
                        ...user,
                        isAdmin,
                        isTechnician
                    }
                    localStorage.setItem('user', JSON.stringify(this.user))
                } catch (error) {
                    console.error('Error fetching current user:', error)
                    this.logout()
                }
            } else {
                this.logout()
            }
        },

        async logout() {
            // Изтриване на токена и потребителските данни
            localStorage.removeItem('token')
            localStorage.removeItem('tokenExpiration')
            this.user = null
            this.isAuthenticated = false
        },

        resetState() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            localStorage.removeItem('token')
            localStorage.removeItem('tokenExpiration')
            localStorage.removeItem('user')
        },

        updateUserData(userData) {
            this.user = {
                ...this.user,
                ...userData
            };
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    }
})