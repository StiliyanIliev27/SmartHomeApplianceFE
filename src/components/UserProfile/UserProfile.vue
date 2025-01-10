<script setup>
import NavBar from '../NavBar.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import Footer from '../Footer.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import profileApi from '@/api/profileApi';
import { productApi } from '@/api/productApi';
import { technicianApi } from '@/api/technicianApi';

const authStore = useAuthStore();
const scrolled = ref(false);
const router = useRouter();
const profileData = ref({});
const isEditing = ref(false);
const isSaving = ref(false);
const editedData = ref({});
const activeTab = ref('personal');
const showPasswordModal = ref(false);
const showImageModal = ref(false);
const selectedImage = ref(null);
const imagePreview = ref(null);
const showAddProductModal = ref(false);
const newProduct = ref({
    productId: '',
    installationPrice: ''
});

const selectedProductDetails = ref(null);

const bulgarianCities = [
    'Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse',
    'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen'
];

const availableProducts = ref([]);

const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Computed properties for first and last name
const firstName = computed({
    get: () => editedData.value.fullName?.split(' ')[0] || '',
    set: (value) => {
        const lastName = editedData.value.fullName?.split(' ')[1] || '';
        editedData.value.fullName = `${value} ${lastName}`;
    }
});

const lastName = computed({
    get: () => editedData.value.fullName?.split(' ')[1] || '',
    set: (value) => {
        const firstName = editedData.value.fullName?.split(' ')[0] || '';
        editedData.value.fullName = `${firstName} ${value}`;
    }
});

const handleScroll = () => {
    scrolled.value = window.scrollY > 0;
};

onMounted(async () => {
    var response = await profileApi.getProfile();
    profileData.value = response.data.result;
    editedData.value = { ...profileData.value };
    window.addEventListener('scroll', handleScroll);
});

const handleSignOut = () => {
    authStore.logout();
    router.push('/');
};

const startEditing = () => {
    isEditing.value = true;
    editedData.value = { ...profileData.value };
};

const saveChanges = async () => {
    try {
        isSaving.value = true;
        const formData = new FormData();
        formData.append('firstName', firstName.value);
        formData.append('lastName', lastName.value);

        if (editedData.value.phoneNumber && editedData.value.city) {
            formData.append('phoneNumber', editedData.value.phoneNumber);
            formData.append('city', editedData.value.city);
        }

        if (selectedImage.value) {
            formData.append('profileImage', selectedImage.value);
        }

        const response = await profileApi.updateProfile(formData);
        alert(response.data.message);

        profileData.value = { ...editedData.value };
        if (imagePreview.value) {
            profileData.value.profileImage = imagePreview.value;
        }

        authStore.updateUserData({
            name: `${firstName.value} ${lastName.value}`,
            profilePictureUrl: profileData.value.profileImage
        });

        isEditing.value = false;
        selectedImage.value = null;
        imagePreview.value = null;
    } catch (error) {
        alert('Failed to update profile');
    } finally {
        isSaving.value = false;
    }
};

const cancelEditing = () => {
    isEditing.value = false;
    editedData.value = { ...profileData.value };
    selectedImage.value = null;
    imagePreview.value = null;
};

const updatePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        return;
    }
    try {
        await profileApi.updatePassword(passwordForm.value);
        showPasswordModal.value = false;
    } catch (error) {
        console.error('Failed to update password:', error);
    }
};

const handleImageSelect = (event) => {
    if (!isEditing.value) return;
    
    const file = event.target.files[0];
    if (file) {
        selectedImage.value = file;
        imagePreview.value = URL.createObjectURL(file);
        uploadImage();
    }
};

const uploadImage = () => {
    if (!isEditing.value || !selectedImage.value) return;
    editedData.value.profileImage = imagePreview.value;
    showImageModal.value = false;
};

const addProduct = async () => {
    try {
        const response = await technicianApi.addProductToTechnician(newProduct.value.productId, newProduct.value.installationPrice);
        const selectedProduct = availableProducts.value.find(p => p.id === newProduct.value.productId);
        const productToAdd = {
            ...newProduct.value,
            productName: selectedProduct.name,
            productImage: selectedProduct.imageUrl
        };
        profileData.value.products = [...profileData.value.products, productToAdd];
        showAddProductModal.value = false;
        newProduct.value = {
            productId: '',
            installationPrice: ''
        };
        alert(response.data.message);
        selectedProductDetails.value = null;
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    } catch (error) {
        alert(error.response.data.errorMessages[0]);
    }
};

const openAddProductModal = async () => {
    showAddProductModal.value = true;
    const response = await productApi.getProducts();
    availableProducts.value = response.data.result;
    document.body.style.overflow = 'hidden'; // Disable scrolling
};

const closeAddProductModal = () => {
    showAddProductModal.value = false;
    selectedProductDetails.value = null;
    document.body.style.overflow = 'auto'; // Re-enable scrolling
};

const handleProductSelect = (productId) => {
    selectedProductDetails.value = availableProducts.value.find(p => p.id === productId);
};

const removeProduct = async (productId) => {
    try {
        const response = await technicianApi.removeProductFromTechnician(productId);
        profileData.value.products = profileData.value.products.filter(p => p.productId !== productId);
        alert(response.data.message);
    } catch (error) {
        alert(error.response.data.errorMessages[0]);
    }
};

</script>

<template>
    <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />

        <div class="container mx-auto px-4 py-8">
            <!-- Profile Header -->
            <div class="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <div class="flex items-center gap-8">
                    <!-- Profile Image -->
                    <div class="relative">
                        <img :src="imagePreview || profileData.profileImage || '/default-avatar.png'" 
                             alt="Profile Picture"
                             class="w-32 h-32 rounded-full object-cover border-4 border-emerald-100" />
                        <label v-if="isEditing" 
                               class="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white p-3 rounded-full shadow-lg cursor-pointer">
                            <input type="file" 
                                   @change="handleImageSelect" 
                                   accept="image/*" 
                                   class="hidden" />
                            <span class="sr-only">Update Photo</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </label>
                    </div>

                    <!-- Basic Info -->
                    <div>
                        <div v-if="isEditing" class="flex gap-3">
                            <input v-model="firstName" class="border rounded-full px-4 py-2" placeholder="First Name" />
                            <input v-model="lastName" class="border rounded-full px-4 py-2" placeholder="Last Name" />
                        </div>
                        <h1 v-else class="text-3xl font-bold text-gray-800">{{ profileData.fullName }}</h1>
                        <p class="text-emerald-600 mt-2 text-lg">{{ profileData.role || 'Member' }}</p>
                    </div>
                </div>

                <!-- Tab Navigation -->
                <div class="flex gap-4 mt-8 border-b">
                    <button @click="activeTab = 'personal'"
                            :class="['px-6 py-3 font-medium transition-colors', 
                            activeTab === 'personal' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600']">
                        Personal Info
                    </button>
                    <button @click="activeTab = 'security'"
                            :class="['px-6 py-3 font-medium transition-colors',
                            activeTab === 'security' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600']">
                        Security
                    </button>
                    <button @click="activeTab = 'preferences'"
                            :class="['px-6 py-3 font-medium transition-colors',
                            activeTab === 'preferences' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600']">
                        Preferences
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="mt-6">
                    <!-- Personal Info Tab -->
                    <div v-if="activeTab === 'personal'" class="space-y-4">
                        <div class="bg-gray-50 p-6 rounded-2xl">
                            <h3 class="text-lg font-medium mb-4">Contact Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="text-sm text-gray-600 block mb-2">Email</label>
                                    <p class="font-medium">{{ profileData.email }}</p>
                                </div>
                                <div>
                                    <label class="text-sm text-gray-600 block mb-2">Member Since</label>
                                    <p class="font-medium">{{ profileData.createdAt }}</p>
                                </div>
                                <div v-if="authStore.user.isTechnician">
                                    <label class="text-sm text-gray-600 block mb-2">Phone Number</label>
                                    <input v-if="isEditing" 
                                           v-model="editedData.phoneNumber"
                                           class="border rounded-full px-4 py-2 w-full"
                                           placeholder="Enter phone number" />
                                    <p v-else class="font-medium">{{ profileData.phoneNumber || 'Not provided' }}</p>
                                </div>
                                <div v-if="authStore.user.isTechnician">
                                    <label class="text-sm text-gray-600 block mb-2">City</label>
                                    <select v-if="isEditing"
                                            v-model="editedData.city"
                                            class="border rounded-full px-4 py-2 w-full bg-white">
                                        <option value="">Select city</option>
                                        <option v-for="city in bulgarianCities" 
                                                :key="city" 
                                                :value="city">{{ city }}</option>
                                    </select>
                                    <p v-else class="font-medium">{{ profileData.city || 'Not provided' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Security Tab -->
                    <div v-if="activeTab === 'security'" class="space-y-4">
                        <div class="bg-gray-50 p-6 rounded-2xl">
                            <h3 class="text-lg font-medium mb-4">Password & Security</h3>
                            <button @click="showPasswordModal = true" 
                                    class="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-6 py-3 rounded-full">
                                Change Password
                            </button>
                        </div>
                    </div>

                    <!-- Preferences Tab -->
                    <div v-if="activeTab === 'preferences'" class="space-y-4">
                        <div class="bg-gray-50 p-6 rounded-2xl">
                            <h3 class="text-lg font-medium mb-4">Language & Regional</h3>
                            <select class="w-full border rounded-full px-4 py-2 bg-white">
                                <option>English</option>
                                <option>Bulgarian</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Products Section -->
            <div v-if="authStore.user.isTechnician" class="bg-white rounded-3xl shadow-lg p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">My Products</h2>
                    <button @click="openAddProductModal"
                            class="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-6 py-3 rounded-full">
                        Add Product
                    </button>
                </div>

                <!-- Add Product Modal -->
                <div v-if="showAddProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-2xl p-6 max-w-md w-full" @click.stop>
                        <h3 class="text-xl font-bold mb-4">Add New Product</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                                <select v-model="newProduct.productId" 
                                        @change="handleProductSelect($event.target.value)"
                                        class="w-full border rounded-lg px-3 py-2">
                                    <option value="">Choose a product</option>
                                    <option v-for="product in availableProducts" 
                                            :key="product.id" 
                                            :value="product.id">
                                        {{ product.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Product Details -->
                            <div v-if="selectedProductDetails" class="bg-gray-50 p-4 rounded-lg">
                                <div class="flex items-start gap-4">
                                    <img :src="selectedProductDetails.imageUrl" 
                                         :alt="selectedProductDetails.name"
                                         class="w-24 h-24 object-cover rounded-lg" />
                                    <div>
                                        <h4 class="font-medium">{{ selectedProductDetails.name }}</h4>
                                        <p class="text-sm text-gray-600 mt-1">{{ selectedProductDetails.description }}</p>
                                        <p class="text-sm text-gray-600 mt-1">Category: {{ selectedProductDetails.category }}</p>
                                        <p class="text-sm font-medium text-emerald-600 mt-1">Price: ${{ selectedProductDetails.price }}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Installation Price ($)</label>
                                <input v-model="newProduct.installationPrice" 
                                       type="number" 
                                       class="w-full border rounded-lg px-3 py-2"
                                       placeholder="Enter installation price" />
                            </div>
                            <div class="flex justify-end gap-3 mt-6">
                                <button @click="closeAddProductModal"
                                        class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button @click="addProduct"
                                        class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="product in profileData.products" 
                         :key="product.id"
                         class="bg-gray-50 rounded-2xl p-6">
                        <div class="flex flex-col">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="font-medium text-lg">{{ product.productName }}</h3>
                                <button @click="removeProduct(product.productId)"
                                        class="text-red-500 hover:text-red-600 transition-colors p-2">
                                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="relative w-full h-48 mb-4">
                                <img :src="product.productImage" 
                                     alt="Product Image" 
                                     class="w-full h-full object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                     @click="selectedImage = product.productImage; showImageModal = true" />
                            </div>
                            <p class="text-gray-600">
                                Installation: ${{ product.installationPrice }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex justify-center gap-4">
                <button v-if="!isEditing" 
                        @click="startEditing"
                        class="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-8 py-3 rounded-full shadow-lg">
                    Edit Profile
                </button>
                <template v-else>
                    <button @click="cancelEditing"
                            :disabled="isSaving"
                            class="border hover:bg-gray-50 transition-colors px-8 py-3 rounded-full">
                        Cancel
                    </button>
                    <button @click="saveChanges"
                            :disabled="isSaving"
                            class="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2">
                        <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isSaving ? 'Saving...' : 'Save Changes' }}
                    </button>
                </template>
            </div>
        </div>

        <Chatbot :user="authStore.user" />
        <Footer />
    </div>
</template>