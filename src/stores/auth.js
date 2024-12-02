import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        token: null
    }),
    actions: {
        async login(data) {
            this.user = data.user
            this.token = data.token
            this.isAuthenticated = true
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
        },
        async logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        initializeFromStorage() {
            const token = localStorage.getItem('token')
            const user = JSON.parse(localStorage.getItem('user'))
            if (token && user) {
                this.token = token
                this.user = user
                this.isAuthenticated = true
            }
        }
    }
})