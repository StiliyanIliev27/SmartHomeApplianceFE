import baseApi from './baseApi'

export const chatApi = {
    sendMessage: (prompt) => baseApi.get('/ChatBot/chat', { params: { prompt } })
}

export default chatApi