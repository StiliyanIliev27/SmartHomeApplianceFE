import { data } from 'autoprefixer'
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7200/api',
    headers: {
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (email) => api.get('/auth/forgot-password', { params: { email } }),
    resetPassword: (newPassword, userId) => api.patch('/auth/reset-password', { newPassword, userId }),
    getUser: () => api.get('/auth/user')
}

export default api