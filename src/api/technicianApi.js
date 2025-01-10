import baseApi from './baseApi'

export const technicianApi = {
    getTechniciansByProductId: (productId) => baseApi.get('/technician', { params: { productId } }),
    addProductToTechnician: (productId, installationPrice) => baseApi.post('/technician', { productId, installationPrice }),
    removeProductFromTechnician: (productId) => baseApi.delete('/technician', { params: { productId } }),
}

export default technicianApi