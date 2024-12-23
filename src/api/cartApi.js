import baseApi from './baseApi'

export const cartApi = {
    getCart: () => baseApi.get('/cart'),
    addToCart: (productId, quantity) => baseApi.post('/cart/add', { productId, quantity }),
    updateCart: (productId, quantity) => baseApi.put('/cart', { productId, quantity }), 
    removeFromCart: (productId) => baseApi.delete('/cart/remove', {
        data: { productId }
    }),
}

export default cartApi