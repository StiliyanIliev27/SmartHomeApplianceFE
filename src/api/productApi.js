import baseApi from './baseApi'

export const productApi = {
    getProducts: () => baseApi.get('/product'),
    getLatestThreeProducts: () => baseApi.get(`/product/latest-three-products`),
    getProductById: (productId) => baseApi.get(`/product/product-by-id?productId=${productId}`)
}

export default productApi