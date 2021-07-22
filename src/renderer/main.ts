import { createApp } from 'vue'

import App from './App.vue'
import { errorHandler } from './utils/error'

const app = createApp(App)
errorHandler(app)

app.mount('#app')
