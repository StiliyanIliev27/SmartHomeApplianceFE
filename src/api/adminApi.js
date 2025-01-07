import baseApi from './baseApi'

export const adminApi = {
    getDashboardData: () => baseApi.get('/admin'),
    getRecentActivities: () => baseApi.get('/admin/recent-activities'),
    getTopProducts: () => baseApi.get('/admin/top-products'),
    getOverallRating: () => baseApi.get('/admin/overall-rating'),
    getInventoryStatus: () => baseApi.get('/admin/inventory-status'),
    getUsers: () => baseApi.get('/admin/users'),
    assignRole: (currentUserId, userId, role) => baseApi.post('/admin/assign-role', { currentUserId, userId, role }),
    newUser: (userData) => baseApi.post('/admin/new-user', userData),
    deleteUser: (userId) => baseApi.delete(`/admin/delete-user`, { params: { userId } }),
    getProducts: () => baseApi.get('/admin/products'),
    editProduct: (productData) => baseApi.put('/admin/edit-product', productData),
    addProduct: (productData) => baseApi.post('/admin/new-product', productData),
    deleteProduct: (productId) => baseApi.delete(`/admin/delete-product`, { params: { productId } }),
    getOrders: () => baseApi.get('/admin/orders'),
    getOrderById: (orderId) => baseApi.get('/admin/order-by-id', { params: { orderId } }),
    editOrderStatus: (orderId, orderStatus) => baseApi.patch('/admin/update-order', { orderId, orderStatus }),
}

export default adminApi