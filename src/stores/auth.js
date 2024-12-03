import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        token: null,
        loading: false,
        error: null
    }),
    
    actions: {
        async login(credentials) {
            try {
                this.loading = true
                this.error = null
                
                const response = await authApi.login(credentials)
                const { user, token } = response.data.result
                
                this.user = {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    profilePictureUrl: user.profilePictureUrl
                }
                this.token = token
                this.isAuthenticated = true
                
                localStorage.setItem('token', token)
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
                console.error('Грешка при изход:', error)
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