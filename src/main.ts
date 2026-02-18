import { createApp } from 'vue'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'
import './assets/main.css'

ModuleRegistry.registerModules([AllCommunityModule])

const app = createApp(App)
app.use(router)
app.use(naive)
app.mount('#app')
