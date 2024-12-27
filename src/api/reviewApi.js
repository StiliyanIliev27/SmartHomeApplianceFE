import baseApi from './baseApi'

export const reviewApi = {
    getReviews: (productId) => baseApi.get(`/review/?productId=${productId}`),
    postReview: (reviewDto) => baseApi.post('/review', reviewDto),
    editReview: (reviewDto) => baseApi.patch('/review', reviewDto),
    deleteReview: (reviewId) => baseApi.delete(`/review/?reviewId=${reviewId}`)
}

export default reviewApi