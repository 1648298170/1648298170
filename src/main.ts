import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router);
app.use(ElementPlus);
// 导入所有图标并进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app');
