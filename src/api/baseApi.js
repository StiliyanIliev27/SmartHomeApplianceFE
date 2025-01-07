import axios from 'axios'

const baseApi = axios.create({
   baseURL: 'https://localhost:7200/api',
   headers: {
       'Accept': 'application/json'
   }
})

baseApi.interceptors.request.use(config => {
   const token = localStorage.getItem('token')
   const expiration = localStorage.getItem('tokenExpiration')
   if (token && expiration && new Date().getTime() < expiration) {
       config.headers.Authorization = `Bearer ${token}`
   } else {
       localStorage.removeItem('token')
       localStorage.removeItem('tokenExpiration')
   }

   // Remove `Content-Type` header for FormData requests
   if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
}

   return config
})

export default baseApi