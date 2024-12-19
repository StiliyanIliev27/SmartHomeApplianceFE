import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [
            {
                text: "Hello! I'm your AI Smart Home Assistant. I'm here to help you with product information, installation guidance, troubleshooting, and any other questions about our smart home solutions. How can I assist you today?",
                sender: 'bot',
                timestamp: new Date(),
                seen: false
            }
        ],
        isChatOpen: false,
        isChatMinimized: false
    }),
    
    actions: {
        addMessage(message) {
            this.messages.push({
                ...message,
                timestamp: new Date(),
                seen: this.isChatOpen
            })
        },
        
        toggleChat() {
            this.isChatOpen = !this.isChatOpen
            if (this.isChatOpen) {
                this.messages.forEach(msg => msg.seen = true)
            }
        },
        
        toggleMinimize() {
            this.isChatMinimized = !this.isChatMinimized
        }
    }
})