import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router);
app.use(ElementPlus);

app.mount('#app');
