import { defineStore } from 'pinia'
import { authApi } from '@/api/authService'
import { cartApi } from '@/api/cartService'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        token: null,
        loading: false,
        error: null
    }),
    
    actions: {
        async registerAsync(userData){
            try {
                this.loading = true;
                this.error = null;

                const response = await authApi.register(userData);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Something went wrong';
                throw error;
            }
        },
        async login(credentials) {
            try {
                this.loading = true
                this.error = null
                
                const response = await authApi.login(credentials)
                const { user, token } = response.data.result

                this.token = token
                localStorage.setItem('token', token)
                
                try{
                    const cartResponse = await cartApi.getCart()
                    let cartProducts = []
                    if(cartResponse.status === 200) {
                        cartProducts = cartResponse.data.result.cartProducts
                    }
                } catch (error) {
                    if(error.response?.status === 404) {
                        console.log('Cart not found')
                    } else {
                        console.error('Error fetching cart items:', error)
                    }
                }

                this.user = {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    profilePictureUrl: user.profilePictureUrl,
                    cartProducts: [...cartProducts]
                }
                
                this.isAuthenticated = true 

                localStorage.setItem('user', JSON.stringify(user))
                
                return true
            } catch (error) {
                this.error = error.response?.data?.message || 'Something went wrong'
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            try {
                await authApi.logout()
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.user = null
                this.token = null
                this.isAuthenticated = false
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        },

        async initializeFromStorage() {
            const token = localStorage.getItem('token')
            const user = JSON.parse(localStorage.getItem('user'))
            
            if (token && user) {
                try {
                    const response = await authApi.getUser()
                    this.user = {
                        id: response.data.id,
                        email: response.data.email,
                        name: `${response.data.firstName} ${response.data.lastName}`,
                        profilePictureUrl: response.data.profilePictureUrl
                    }
                    this.token = token
                    this.isAuthenticated = true
                } catch (error) {
                    this.logout()
                }
            }
        }
    }
})