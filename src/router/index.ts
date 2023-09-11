import { createRouter, createWebHistory } from "vue-router";


//1.动态路由
const HelloWorld =()=> import('../components/HelloWorld.vue');
const Test =()=> import('../components/Test.vue');

// 2.创建路由数据配置
const routes = [
    {
        path:'/',
        name:'HelloWorld',
        component:HelloWorld
    },
    {
        path:'/test',
        name:'Test',
        component:Test
    },
]

//3.创建路由
const router = createRouter({
    // 使用h5模式
    history:createWebHistory(),
    routes
})

// 4.导出路由器
export default router;



