import baseApi from './baseApi'

export const orderApi = {
    getMyOrders: () => baseApi.get(`/order`),
    createCheckoutSession: (discountPercentage, discountCode) => baseApi.post('/order/create-checkout-session', null, { 
        params: { 
            discountPercentage,
            discountCode
        } 
    }),
    handleCancelledPayment: (orderId) => baseApi.post('/order/cancel', null, { 
        params: { orderId } 
    })
}   

export default orderApi