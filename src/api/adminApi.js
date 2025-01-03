import baseApi from './baseApi'

export const adminApi = {
    getDashboardData: () => baseApi.get('/admin'),
    getRecentActivities: () => baseApi.get('/admin/recent-activities'),
    getTopProducts: () => baseApi.get('/admin/top-products'),
}

export default adminApi