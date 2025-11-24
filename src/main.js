import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"

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

app.use(pinia)   // <-- Apenas UMA vez
app.use(router)

app.mount("#app")
