import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initOttAnalytics, loginOtt } from './analytics/growise'
import { useUserStore } from './stores/user'
import './assets/ott.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

void initOttAnalytics(() => {
  const session = useUserStore().user
  if (session) loginOtt(session.id, { Name: session.name, Email: session.email })
})
