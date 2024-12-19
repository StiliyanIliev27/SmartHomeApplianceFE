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

export const cartApi = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
}

export default api