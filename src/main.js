import './assets/main.css'
import './assets/global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faHome,
    faShoppingBag,
    faHeart,
    faBell,
    faCog,
    faShoppingCart,
    faHeadset
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
const pinia = createPinia()

library.add(
    faHome,
    faShoppingBag,
    faHeart,
    faBell,
    faCog,
    faShoppingCart,
    faHeadset
)

const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
}

app.use(pinia)
app.use(router)
app.use(Toast, options)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')