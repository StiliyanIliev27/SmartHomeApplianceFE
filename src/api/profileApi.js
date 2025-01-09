import baseApi from './baseApi'

export const profileApi = {
    getProfile: () => baseApi.get('/profile'),
    updateProfile: (data) => baseApi.put('/profile', data)
}

export default profileApi