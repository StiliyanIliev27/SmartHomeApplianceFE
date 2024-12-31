import baseApi from './baseApi'

export const orderApi = {
    createCheckoutSession: (promoCodePerc) => baseApi.post('/order/create-checkout-session', null, { 
        params: { 
            promoCodePerc 
        } 
    })
}

export default orderApi