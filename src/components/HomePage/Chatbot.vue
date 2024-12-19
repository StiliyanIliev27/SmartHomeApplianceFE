<script>
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useChatStore } from '@/stores/useChatStore'

export default {
    data() {
        return {
            currentMessage: '',
        }
    },
    props: {
        user: Object
    },
    components: {
        ChatBubbleLeftRightIcon,
        XMarkIcon
    },
    setup() {
        return { chatStore: useChatStore() }
    },
    computed: {
        chatMessages() {
            return this.chatStore.messages
        },
        chatBotOpen: {
            get() {
                return this.chatStore.isChatOpen
            },
            set(value) {
                this.chatStore.isChatOpen = value
            }
        },
        isChatMinimized: {
            get() {
                return this.chatStore.isChatMinimized
            },
            set(value) {
                this.chatStore.isChatMinimized = value
            }
        }
    },
    methods: {
        toggleChatBot() {
            this.chatStore.toggleChat()
            if (this.chatBotOpen) {
                this.$nextTick(() => {
                    const chatContainer = this.$refs.chatContainer
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight
                    }
                })
            }
        },
        sendMessage() {
            if (!this.currentMessage.trim()) return

            // Add user message
            this.chatStore.addMessage({
                text: this.currentMessage,
                sender: 'user'
            })

            // Clear input
            this.currentMessage = ''

            // Simulate bot response
            this.chatStore.addMessage({
                text: "Thank you for your message. I'm processing your request...",
                sender: 'bot',
                loading: true
            })

            // Scroll to bottom
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight
                }
            })

            // Simulate API call delay
            setTimeout(() => {
                // Remove loading message
                this.chatStore.messages.pop()
                
                // Add actual response
                this.chatStore.addMessage({
                    text: "I understand you're interested in our smart home solutions. How can I help you today?",
                    sender: 'bot'
                })
            }, 1500)
        }
    }
}
</script>
<template>
    <!-- AI Chat Bot Button -->
    <button @click="toggleChatBot" class="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 
            text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transform hover:scale-110 
            transition-all duration-300 group cursor-pointer">
        <ChatBubbleLeftRightIcon class="h-5 w-5 sm:h-6 sm:w-6" />
        <span v-if="unreadMessages" class="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-2 py-1 
                flex items-center justify-center animate-bounce whitespace-nowrap">
            {{ unreadMessages }}
        </span>
    </button>

    <!-- AI Chat Bot Dialog -->
    <div v-if="chatBotOpen" class="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 z-50 w-[95%] sm:w-[400px] max-h-[80vh] sm:max-h-[500px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-3 sm:p-4 
            text-left align-middle shadow-2xl border border-purple-500/30 transition-all duration-300 mx-auto sm:mx-0">
            <div class="flex justify-between items-center mb-3 sm:mb-4">
                <div class="flex items-center gap-2">                       
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                        <img src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg" alt="AI Assistant"
                            class="w-full h-full object-cover" />
                    </div>
                    <div class="min-w-0">
                        <h3 class="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 
                                bg-clip-text text-transparent truncate">
                            AI Assistant
                        </h3>
                        <span class="text-[10px] sm:text-xs text-green-400 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button @click="chatStore.toggleMinimize" class="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 12H4" />
                        </svg>
                    </button>
                    <button @click="chatBotOpen = false"
                        class="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer">
                        <XMarkIcon class="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>
            </div>

            <div v-if="!isChatMinimized" class="flex flex-col h-[60vh] sm:h-[400px]">
                <div class="flex-1 overflow-y-auto mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-gray-900/50 
                        border border-purple-500/20 custom-scrollbar" ref="chatContainer">
                    <div v-for="(message, index) in chatMessages" :key="index" :class="[
                        'mb-2 sm:mb-3 max-w-[85%] sm:max-w-[80%] rounded-xl p-2 sm:p-3',
                        message.sender === 'user'
                            ? 'ml-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-100'
                    ]">
                        <div class="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <img v-if="message.sender === 'bot'"
                                src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg" alt="AI"
                                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-purple-500/30" />
                            <span v-if="message.sender === 'bot'" class="text-xs text-purple-300 object-cover">HomeCraft AI</span>
                            <img v-else :src="user?.profilePictureUrl || 'https://e7.pngegg.com/pngimages/24/650/png-clipart-computer-icons-service-avatar-user-guest-house-gaulish-language-purple-service.png' " alt="User"
                                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-purple-500/30 object-cover" />
                            <span v-if="message.sender === 'user'" class="text-xs text-purple-300"> {{ user?.name || 'Guest' }} </span>
                        </div>
                        <p :class="{ 'animate-pulse': message.loading }" class="leading-relaxed text-xs sm:text-sm break-words">
                            {{ message.text }}
                        </p>
                        <span class="text-[10px] sm:text-xs opacity-70 mt-1 block">
                            {{ message.timestamp.toLocaleTimeString() }}
                        </span>
                    </div>
                </div>

                <div class="flex gap-2 mt-auto">
                    <input type="text" v-model="currentMessage" @keyup.enter="sendMessage"
                        placeholder="Type a message..." class="flex-1 rounded-xl bg-gray-800 border border-purple-500/30 px-2 sm:px-3 py-1.5 sm:py-2 
                            text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                            focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm" />
                    <button @click="sendMessage" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 
                            rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-105 
                            focus:ring-2 focus:ring-purple-500/20 shadow-lg hover:shadow-purple-500/20 flex-shrink-0 text-xs sm:text-sm cursor-pointer">
                        <span class="hidden sm:inline">Send</span>
                        <span class="sm:hidden">→</span>
                    </button>
                </div>

                <div class="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                    <button v-for="suggestion in ['Product Features', 'Pricing', 'Installation Help', 'Support']"
                        :key="suggestion" @click="currentMessage = suggestion; sendMessage()" 
                        class="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-gray-800 text-gray-300 
                        hover:bg-purple-600 hover:text-white transition-all duration-300 border border-purple-500/30 
                        transform hover:scale-105 cursor-pointer">
                        {{ suggestion }}
                    </button>
                </div>
            </div>
        </div>
</template>
