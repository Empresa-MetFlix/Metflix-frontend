import { createApp } from "vue"
import App from "./App.vue"

createApp(App).mount("#app")

    import { createPinia } from 'pinia'; // <-- Adicione esta linha
    
   

    const app = createApp(App);

    app.use(createPinia()); // <-- Adicione esta linha
    // app.use(router);

