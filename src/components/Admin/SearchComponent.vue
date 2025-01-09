<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    title: String,
    description: String,
    searchQuery: {
        type: String,
        required: true
    },
    showOnlyActive: {
        type: Boolean,
        default: false,
        required: false
    },
    isUserPage: {
        type: Boolean,
        default: false,
        required: false
    },
    buttonText: String,
    placeholder: String
})

const emit = defineEmits(['update:searchQuery', 'update:showOnlyActive', 'buttonClick'])

const updateSearch = (value) => {
    emit('update:searchQuery', value)
}

const updateShowOnlyActive = (value) => {
    emit('update:showOnlyActive', value)
}

const handleButtonClick = () => {
    emit('buttonClick')
}
</script>

<template>
    <div class="mb-6 lg:mb-8">
        <h1 class="text-xl lg:text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p class="mt-2 text-sm lg:text-base text-gray-600">{{ description }}</p>
    </div>

    <div class="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
            <div class="relative w-full lg:w-96">
                <input 
                    :value="searchQuery"
                    @input="updateSearch($event.target.value)"
                    type="text" 
                    :placeholder="placeholder"
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <label v-if="isUserPage" class="flex items-center">
                <input 
                    type="checkbox" 
                    :checked="showOnlyActive"
                    @change="updateShowOnlyActive($event.target.checked)"
                    class="form-checkbox h-5 w-5 text-indigo-600"
                >
                <span class="ml-2 text-sm lg:text-base text-gray-700">Show only active users</span>
            </label>
        </div>
        <button v-if="buttonText"
            @click="handleButtonClick"
            class="w-full lg:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
            {{ buttonText }}
        </button>
    </div>
</template>