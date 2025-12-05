import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faBookmark, 
  faFilm, 
  faTv, 
  faClock, 
  faCalendarDays,
  faArrowDownAZ,
  faStar,
  faMagnifyingGlass,
  faVideo,
  faFilter
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBookmark, 
  faFilm, 
  faTv, 
  faClock, 
  faCalendarDays,
  faArrowDownAZ,
  faStar,
  faMagnifyingGlass,
  faVideo,
  faFilter
)

import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    console.log("Nova versão disponível");
  },
  onOfflineReady() {
    console.log("App pronto para uso offline");
  }
})

const app = createApp(App)
const pinia = createPinia()
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)
app.mount('#app')
