import baseApi from './baseApi'

export const authApi = {
    login: (credentials) =>baseApi.post('/auth/login', credentials),
    register: (userData) => baseApi.post('/auth/register', userData),
    logout: () => baseApi.post('/auth/logout'),
    forgotPassword: (email) => baseApi.get('/auth/forgot-password', { params: { email } }),
    resetPassword: (newPassword, userId) => baseApi.patch('/auth/reset-password', { newPassword, userId }),
    confirmEmail: (token, userId) => baseApi.get('/auth/confirm-email', { params: { token, userId } }),
    getUser: () => baseApi.get('/auth/user')
}

export default authApi