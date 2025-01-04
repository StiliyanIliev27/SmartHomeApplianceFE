import baseApi from './baseApi'

export const adminApi = {
    getDashboardData: () => baseApi.get('/admin'),
    getRecentActivities: () => baseApi.get('/admin/recent-activities'),
    getTopProducts: () => baseApi.get('/admin/top-products'),
    getOverallRating: () => baseApi.get('/admin/overall-rating'),
    getInventoryStatus: () => baseApi.get('/admin/inventory-status'),
    getUsers: () => baseApi.get('/admin/users'),
    assignRole: (currentUserId, userId, role) => baseApi.post('/admin/assign-role', { currentUserId, userId, role })
}

export default adminApi