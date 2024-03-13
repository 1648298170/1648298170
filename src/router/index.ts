import { RouteLocationNormalized, createRouter, createWebHistory } from "vue-router";
import { Component } from "vue";
import Layout from '../views/layout/Layout.vue';
import { useAppStore } from "../store/app";


// 1.动态路由
const User = () => import('../views/system/User.vue');
const UserDetail = () => import('../views/system/UserDetail.vue');
const Test = () => import('../views/test/Test.vue');
const Scroll = () => import('../views/scroll/Scroll.vue');

/** 
 * 
 * */
export interface RouterMenu {
    path: string;
    name: string;
    title: string;
    component: Component;
    children?: RouterMenuChild[];
    [key: string]: any;
}

/**
 * 
 */
export interface RouterMenuChild {
    path: string;
    name: string;
    component: Component;
    meta: RouterChildMenuMeta;
    [key: string]: any;
}


/**
 * 路由元信息 meta
 **/
interface RouterChildMenuMeta {
    menuKey: string;
    historyTitle: string;
    [key: string]: any;
}

// 初始化权限和基础数据
async function initAuthBaseData(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
) {
    const store = useAppStore();
    // 将路由菜单存放在store中
    await store.filterLeftMenus();
}

/**
 * 跳转路由前：重定向tab导航栏对应的路由记录
 * 
 * */
function beforeHistoryRecord(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
) {
    const store = useAppStore();
    // 获取历史路由记录信息
    const getHistoryRouters = store.getHistoryRouters;
    // 添加新路由记录tab
    let historyTitle: string = (to.meta.historyTitle as string) || '新标签';
    // 重定向路有记录
    let exist = getHistoryRouters.find((recordItem) => recordItem.path == to.path);
    // 如果重定向路由记录不存在
    if (!exist) {
        // 向状态中的路由记录信息push新的路由记录
        store.addHistoryRoutersItem({
            title: historyTitle,
            path: to.path,
            query: to.query,
            params: to.params,
            time: Date.now()
        })
    }

}


// 2.创建路由数据配置
// 左侧菜单路由
export const appRoutes = <RouterMenu[]>[
    {
        path: '/system',
        name: 'system',
        title: '用户管理',
        component: Layout,
        beforeEnter: [initAuthBaseData],
        children: [
            {
                path: '/',
                name: 'User',
                component: User,
                title: '用户信息',
                beforeEnter: [beforeHistoryRecord],
                meta: {
                    menuKey: 'User',
                    historyTitle: '用户信息'
                }
            },
        ]
    },
    {
        path: '/test',
        name: 'test',
        title: 'Test',
        component: Layout,
        beforeEnter: [initAuthBaseData],
        children: [
            {
                path: '/test',
                name: 'Test',
                title: '测试',
                component: Test,
                beforeEnter: [beforeHistoryRecord],
                meta: {
                    menuKey: 'Test',
                    historyTitle: '测试'
                }
            },
        ]
    },
    {
        path: '/scroll',
        name: 'scroll',
        title: 'Scroll',
        component: Layout,
        beforeEnter: [initAuthBaseData],
        children: [
            {
                path: '/scroll',
                name: 'Scroll',
                title: '测试',
                component: Scroll,
                beforeEnter: [beforeHistoryRecord],
                meta: {
                    menuKey: 'Scroll',
                    historyTitle: '滑动列表'
                }
            },
        ]
    },
];
// 非左侧菜单路由
export const otherRoutes = <RouterMenu[]>[
    {
        path: '/system',
        name: 'system',
        title: '用户管理',
        component: Layout,
        childrend: [
            {
                path: 'UserDetail/:id?',
                name: 'UserDetail',
                component: UserDetail,
                beforeEnter: [beforeHistoryRecord],
                meta: {
                    menuKey: 'User',
                    historyTitle: '用户详情'
                }
            },
        ]
    },
];

//3.创建路由
const router = createRouter({
    // 使用h5模式
    history: createWebHistory(),
    routes: [
        ...(appRoutes as any)
    ]
})

// 4.导出路由器
export default router;



