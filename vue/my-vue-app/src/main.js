import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ✅ Matches src/router.js

createApp(App).use(router).mount('#app');

