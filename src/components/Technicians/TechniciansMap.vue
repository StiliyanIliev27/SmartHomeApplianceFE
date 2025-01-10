<script setup>
import NavBar from '../NavBar.vue';
import Footer from '../Footer.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'vue-router';
import { technicianApi } from '@/api/technicianApi';
import { productApi } from '@/api/productApi';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const technicians = ref([]);
const products = ref([]);
const productId = ref('');
const selectedProduct = ref(null);
const map = ref(null);
const markers = ref([]);
const infoWindows = ref([]);
const scrolled = ref(false);
const categoryMapping = {
    0: "Security and Surveillance",
    1: "Lighting and Ambiance",
    2: "Heating and Cooling",
    3: "Kitchen Appliances",
    4: "Entertainment and Media",
    5: "Energy Management",
    6: "Cleaning and Household",
    7: "Health and Fitness",
    8: "Smart Hubs and Controllers",
    9: "Outdoor and Garden"
};

const handleSignOut = () => {
    authStore.signOut();
    router.push('/');
};

const getProducts = async () => {
    const response = await productApi.getProducts();
    products.value = response.data.result;
};

const getTechnicians = async () => {
    try {
        const response = await technicianApi.getTechniciansByProductId(productId.value);
        technicians.value = response.data;
        if (technicians.value.length > 0) {
            addMarkers();
        } else {
            clearMarkers();
        }
    } catch (error) {
        console.error('Error:', error);
        technicians.value = [];
        clearMarkers();
    }
};

const initMap = () => {
    map.value = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.7339, lng: 25.4858 },
        zoom: 7,
        styles: [
            {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [{ visibility: "simplified" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#e9e9e9" }]
            }
        ]
    });
};

const clearMarkers = () => {
    markers.value?.forEach(marker => marker?.setMap(null));
    markers.value = [];
    infoWindows.value = [];
};

const addMarkers = () => {
    clearMarkers();
    if (!map.value || !technicians.value) return;

    technicians.value.forEach(technician => {
        if (!technician.lat || !technician.long) return;

        try {
            const position = {
                lat: parseFloat(technician.lat),
                lng: parseFloat(technician.long)
            };

            if (isNaN(position.lat) || isNaN(position.lng)) return;

            const marker = new google.maps.Marker({
                position,
                map: map.value,
                title: technician.fullName,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="p-4 max-w-xs">
                        <div class="flex items-center gap-3 mb-2">
                            <img src="${technician.profileImage}" class="w-12 h-12 rounded-full object-cover">
                            <div>
                                <h3 class="font-bold">${technician.fullName}</h3>
                                <p class="text-sm text-blue-600">${technician.city}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            <span>${technician.phoneNumber}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <span>${technician.email}</span>
                        </div>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindows.value.forEach(w => w.close());
                infoWindow.open({
                    anchor: marker,
                    map: map.value
                });
            });

            markers.value.push(marker);
            infoWindows.value.push(infoWindow);
        } catch (error) {
            console.error('Error adding marker:', error);
        }
    });

    if (markers.value.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.value.forEach(marker => bounds.extend(marker.getPosition()));
        map.value.fitBounds(bounds);
    }
};

const showTechnicianOnMap = (technician) => {
    const marker = markers.value.find(m => {
        const pos = m.getPosition();
        return pos.lat() === parseFloat(technician.lat) && pos.lng() === parseFloat(technician.long);
    });

    if (marker) {
        map.value.setCenter(marker.getPosition());
        map.value.setZoom(15);
        google.maps.event.trigger(marker, 'click');
    }
};

watch(productId, async (newValue) => {
    if (newValue) {
        selectedProduct.value = products.value.find(p => p.id === newValue);
        await getTechnicians();
    } else {
        clearMarkers();
        technicians.value = [];
        selectedProduct.value = null;
    }
}, { immediate: true });

onMounted(async () => {
    await getProducts();
    initMap();
    window.addEventListener('scroll', () => scrolled.value = window.scrollY > 0);
});

onUnmounted(() => {
    window.removeEventListener('scroll', () => { });
    clearMarkers();
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg bg-white/95 backdrop-blur-md': scrolled }">
            <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
        </div>

        <div class="container mx-auto px-4 pt-24 pb-16">
            <!-- Product Selection -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div class="relative">
                    <select v-model="productId"
                        class="w-full p-3 pl-12 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-transparent">
                        <option value="">Select Product</option>
                        <option v-for="product in products" :key="product.id" :value="product.id">
                            {{ product.name }}
                        </option>
                    </select>
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-500" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <!-- Product Details -->
            <div v-if="selectedProduct" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="relative">
                        <img :src="selectedProduct.imageUrl" :alt="selectedProduct.name"
                            class="w-full md:w-56 h-56 object-cover rounded-xl shadow-md">
                        <div
                            class="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ${{ selectedProduct.price }}
                        </div>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold mb-3 text-gray-800">{{ selectedProduct.name }}</h2>
                        <p class="text-gray-600 mb-4 leading-relaxed">{{ selectedProduct.description }}</p>
                        <p class="text-gray-600 mb-4 leading-relaxed">{{ categoryMapping[selectedProduct.category] }}
                        </p>
                        <div class="flex items-center gap-2 text-blue-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span class="font-semibold">High Efficiency Product</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <!-- Technicians List -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex items-center gap-2 mb-6">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 class="text-xl font-bold text-gray-800">Available Technicians</h2>
                    </div>
                    <div v-if="!technicians.length"
                        class="flex flex-col items-center justify-center py-8 text-gray-500">
                        <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 12H4M12 20V4" />
                        </svg>
                        <p class="text-lg">No technicians available</p>
                    </div>
                    <div v-else class="space-y-4 max-h-[500px] overflow-auto pr-2 custom-scrollbar">
                        <div v-for="tech in technicians" :key="tech.id" @click="showTechnicianOnMap(tech)"
                            class="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                            <div class="flex gap-4">
                                <img :src="tech.profileImage" class="w-14 h-14 rounded-xl object-cover shadow-md">
                                <div>
                                    <h3 class="font-semibold text-gray-800">{{ tech.fullName }}</h3>
                                    <div class="flex items-center gap-2 text-gray-600 mt-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{{ tech.city }}, Bulgaria</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-gray-600">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{{ tech.phoneNumber }}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-gray-600">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>{{ tech.email }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Map -->
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div id="map" class="w-full h-[600px]"></div>
                </div>
            </div>
        </div>

        <Chatbot :user="authStore.user" />
        <Footer />
    </div>
</template>

<style scoped>
.container {
    max-width: 1400px;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #93C5FD transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #93C5FD;
    border-radius: 3px;
}
</style>