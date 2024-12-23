import { cartApi } from '@/api/cartApi'
import { useAuthStore } from '@/stores/useAuthStore'

export const cartService = {
    addToCart: async (productId, quantity) => {
        const authStore = useAuthStore()
        const response = await cartApi.addToCart(productId, quantity)

        const userProducts = authStore.user.cartProducts;
        const existingProduct = userProducts.find(item => item.productId === productId)
        if (existingProduct) {
            existingProduct.quantity += quantity || 1
        } else {
            userProducts.push({ productId, quantity: quantity || 1 })
        }

        return response
    },
    removeFromCart: async (productId) => {
        const authStore = useAuthStore()
        if(!authStore.isAuthenticated){
            return false
        }

        const index = authStore.user.cartProducts.findIndex(item => item.productId === productId)
        if (index > -1) {
            const item = authStore.user.cartProducts[index]
            if (item.quantity > 1) {
                item.quantity--
            } else {
                authStore.user.cartProducts.splice(index, 1)
            }
        }

        const response = await cartApi.removeFromCart(productId)
        return response
    },
    updateCart: async (productId, quantity) => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
            return false
        }
        const response = await cartApi.updateCart(productId, quantity)
        return response
    }
}