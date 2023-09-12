// import { useAppStore } from "../store/app";
// import { Component } from "vue";
// import { RouteLocationNormalized, createRouter, createWebHistory } from "vue-router";

// const Home = () => import('../views/Home.vue');

// /** 
//  * 
//  * */
// export interface RouterMenu {
//     path: string,
//     name: string,
//     component: Component,
//     children?: RouterMenuChild[]
//     meta: Meta,
//     [key: string]: any
// }

// /**
//  * 
//  */
// export interface RouterMenuChild {
//     path: string;
//     name: string;
//     component: Component;
//     meta: Meta;
//     [key: string]: any;
// }


// /**
//  * 路由元信息 meta
//  **/
// interface Meta {
//     title: string,
//     menuOrder: number,
//     name: string,
//     ChildComp: string
//     [key: string]: any;
// }

// // 初始化权限和基础数据
// async function initAuthBaseData(to:RouteLocationNormalized,from:RouteLocationNormalized) {
//     const store = useAppStore();
//     // 将路由菜单存放在store中
//     await store.filterLeftMenus();
// }

// // 自动生成路由
// //import.meta.glob(),https://cn.vitejs.dev/guide/features.html#glob-import-as
// //1.寻找views文件夹中所有的page.ts
// const pages = import.meta.glob('../views/**/page.ts', {
//     eager: true,
//     import: 'default'
// }) as Record<string, Meta>;

// //3. 寻找views文件夹中所有的*.vue组件
// const pageComps = import.meta.glob('../views/**/*.vue');
// console.log(Object.entries(pages))

// // 不在左侧菜单的路由
// export const otherRoutes = <RouterMenu[]>[];
// // layout左侧菜单的路由
// export const appRoutes = <RouterMenu[]>[];

// // 2.使用Object.entries()将pages对象的每个键值对生成对应键值对数组，即[path, meta]，
// // 并用map映射出一个路由配置数组,即[{path:'',name:'',...},{path:'',name:'',...}]
// Object.entries(pages).forEach(([path, meta]) => {
//     // 2-1暂存page.ts路径
//     const pageJSPath = path;

//     // 2-2将page.ts路径使用replace替换截取出文件夹路径后续作为path值
//     path = path.replace('../views', '').replace('/page.ts', '');

//     // 2-3将截取出文件夹路径使用split分割生成数组，并使用filter过滤掉空字符串，剩下的字符串使用join连接
//     const name = path.split('/').filter(Boolean).join('-');

//     // 2-4 将暂存page.ts的路径。替换生成组件路径，即../views/**/*.vue
//     const compPath = pageJSPath.replace('/page.ts', meta.compPath);
//     const pageRoute ={
//         path,
//         name,
//         component: pageComps[compPath],
//         meta
//     } 

//     if(meta.isChilrd){
//         otherRoutes.push(pageRoute);
//     }else{
//         appRoutes.push(pageRoute);
//     }
// });

// const routes = [{
//     path:'/',
//     name:'Home',
//     component: Home,
//     children:appRoutes,
//     beforeEnter:[initAuthBaseData]
// }] as any[];

// //4.创建路由
// const router = createRouter({
//     // 使用h5模式
//     history: createWebHistory(),
//     routes
// })

// // 5.导出路由器
// export default router;



