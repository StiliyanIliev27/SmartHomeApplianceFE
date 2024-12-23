import baseApi from './baseApi'

export const productApi = {
    getProducts: () => baseApi.get('/product'),
    getLatestThreeProducts: () => baseApi.get(`/product/latest-three-products`),
}

export default productApi