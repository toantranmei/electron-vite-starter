import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './router/guard'
import { errorHandler } from './utils/error'

import './assets/styles/global.css'

const app = createApp(App)
errorHandler(app)

app.use(router).mount('#app')
