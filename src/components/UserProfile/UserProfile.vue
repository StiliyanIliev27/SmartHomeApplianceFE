<script setup>
import NavBar from '../NavBar.vue';
import Chatbot from '../HomePage/Chatbot.vue';
import Footer from '../Footer.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import profileApi from '@/api/profileApi';

const authStore = useAuthStore();
const scrolled = ref(false);
const router = useRouter();
const profileData = ref({});
const isEditing = ref(false);
const editedData = ref({});
const activeTab = ref('overview');
const showPasswordModal = ref(false);
const showImageModal = ref(false);
const selectedImage = ref(null);
const imagePreview = ref(null);
const bulgarianCities = [
    'Sofia',
    'Plovdiv',
    'Varna',
    'Burgas',
    'Ruse',
    'Stara Zagora',
    'Pleven',
    'Sliven',
    'Dobrich',
    'Shumen'
];

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
    const file = event.target.files[0];
    if (file) {
        selectedImage.value = file;
        imagePreview.value = URL.createObjectURL(file);
        showImageModal.value = false;
    }
};

const uploadImage = () => {
    if (!selectedImage.value) return;
    editedData.value.profileImage = imagePreview.value;
    showImageModal.value = false;
};

</script>

<template>
    <div class="min-h-screen font-poppins bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <!-- Navigation Bar -->
        <div class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="{ 'bg-transparent': !scrolled, 'shadow-lg backdrop-blur-md bg-white/90': scrolled }">
            <NavBar :is-authenticated="authStore.isAuthenticated" :user="authStore.user" @sign-out="handleSignOut" />
        </div>

        <!-- Main Content -->
        <div class="min-h-screen pt-24 pb-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Profile Header -->
                <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg bg-white/90">
                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <!-- Profile Image -->
                        <div class="relative group">
                            <div
                                class="w-48 h-48 rounded-full overflow-hidden ring-4 ring-emerald-500 ring-offset-4 shadow-2xl">
                                <img :src="imagePreview || profileData.profileImage || '/default-avatar.png'"
                                    alt="Profile Picture"
                                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                            </div>
                            <div
                                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button @click="showImageModal = true"
                                    class="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl hover:bg-emerald-700 transform hover:scale-105 transition-all">
                                    Update Photo
                                </button>
                            </div>
                        </div>

                        <!-- Profile Info -->
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <div v-if="isEditing" class="flex gap-4 mb-2">
                                        <input v-model="firstName"
                                            class="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 focus:outline-none bg-transparent"
                                            placeholder="First Name" />
                                        <input v-model="lastName"
                                            class="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 focus:outline-none bg-transparent"
                                            placeholder="Last Name" />
                                    </div>
                                    <h1 v-else class="text-4xl font-bold text-gray-900 mb-2">
                                        {{ profileData.fullName }}
                                    </h1>
                                    <p class="text-emerald-600 font-medium">{{ profileData.role || 'Member' }}</p>
                                </div>
                                <div v-if="profileData.isVerified"
                                    class="flex items-center text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="font-semibold">Verified Account</span>
                                </div>
                            </div>

                            <!-- Profile Navigation -->
                            <div class="flex space-x-4 mb-6 border-b border-gray-200">
                                <button @click="activeTab = 'overview'"
                                    class="px-4 py-2 font-medium transition-colors duration-200"
                                    :class="activeTab === 'overview' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600'">
                                    Overview
                                </button>
                                <button @click="activeTab = 'security'"
                                    class="px-4 py-2 font-medium transition-colors duration-200"
                                    :class="activeTab === 'security' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600'">
                                    Security
                                </button>
                                <button @click="activeTab = 'preferences'"
                                    class="px-4 py-2 font-medium transition-colors duration-200"
                                    :class="activeTab === 'preferences' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600'">
                                    Preferences
                                </button>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <label class="text-sm font-medium text-gray-600">Email</label>
                                    <p class="text-lg font-semibold text-gray-900 mt-1">{{ profileData.email }}</p>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <label class="text-sm font-medium text-gray-600">Member Since</label>
                                    <p class="text-lg font-semibold text-gray-900 mt-1">
                                        {{ profileData.createdAt }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Technician Details -->
                <div v-if="authStore.user.isTechnician"
                    class="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-white/90">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Technician Details</h2>
                        <div class="flex items-center text-sm text-gray-600">
                            <span class="mr-2">Profile Completion:</span>
                            <div class="w-32 h-2 bg-gray-200 rounded-full">
                                <div class="h-full bg-emerald-500 rounded-full"
                                    :style="{ width: `${profileData.completionPercentage || 70}%` }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <label class="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                            <input v-if="isEditing" v-model="editedData.phoneNumber"
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                type="tel" />
                            <p v-else class="text-lg font-semibold text-gray-900">{{ profileData.phoneNumber }}</p>
                        </div>
                        <div class="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                            <div class="mt-1">
                                <select v-if="isEditing" v-model="editedData.city" id="city" name="city" required
                                    class="block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300">
                                    <option value="">Select a city</option>
                                    <option v-for="city in bulgarianCities" :key="city" :value="city">
                                        {{ city }}
                                    </option>
                                </select>
                                <p v-else class="text-lg font-semibold text-gray-900">{{ profileData.city }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Security Section -->
                <div v-if="activeTab === 'security'"
                    class="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-white/90">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    <div class="space-y-6">
                        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 class="font-semibold text-gray-900">Password</h3>
                                <p class="text-sm text-gray-600">Last changed 3 months ago</p>
                            </div>
                            <button @click="showPasswordModal = true"
                                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                Change Password
                            </button>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 class="font-semibold text-gray-900">Two-Factor Authentication</h3>
                                <p class="text-sm text-gray-600">Enhance your account security</p>
                            </div>
                            <button
                                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                Enable
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Preferences Section -->
                <div v-if="activeTab === 'preferences'"
                    class="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-white/90">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                    <div class="space-y-6">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 class="font-semibold text-gray-900">Email Notifications</h3>
                                <p class="text-sm text-gray-600">Receive updates about your account</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" checked>
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600">
                                </div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 class="font-semibold text-gray-900">Language</h3>
                                <p class="text-sm text-gray-600">Choose your preferred language</p>
                            </div>
                            <select class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 flex justify-center">
                    <button v-if="!isEditing" @click="startEditing"
                        class="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        Edit Profile
                    </button>
                    <div v-else class="flex gap-4">
                        <button @click="cancelEditing"
                            class="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-300">
                            Cancel
                        </button>
                        <button @click="saveChanges"
                            class="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Password Change Modal -->
        <div v-if="showPasswordModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
                        <input type="password" v-model="passwordForm.currentPassword"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                        <input type="password" v-model="passwordForm.newPassword"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
                        <input type="password" v-model="passwordForm.confirmPassword"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button @click="showPasswordModal = false"
                        class="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button @click="updatePassword"
                        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        Update Password
                    </button>
                </div>
            </div>
        </div>

        <!-- Image Upload Modal -->
        <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Update Profile Picture</h3>
                <div class="space-y-4">
                    <div class="flex justify-center">
                        <div class="w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-500">
                            <img :src="imagePreview || profileData.profileImage || '/default-avatar.png'"
                                alt="Profile Preview" class="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-600 mb-2">Choose Image</label>
                        <input type="file" @change="handleImageSelect" accept="image/*"
                            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button @click="showImageModal = false"
                        class="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button @click="uploadImage"
                        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        Upload Image
                    </button>
                </div>
            </div>
        </div>

        <Chatbot :user="authStore.user" />
        <Footer />
    </div>
</template>