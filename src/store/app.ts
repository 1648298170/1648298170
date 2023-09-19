import { RouterMenu, appRoutes } from '../router';
import { fromJS } from 'immutable';
import { defineStore } from 'pinia';

// 历史路由信息
export interface HistoryRouterItem {
    title: string;
    path: string;
    query: any;
    params: any;
    // 本地记录时间
    time: Date | number;
}

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            // 左侧菜单路由信息
            leftMenuList: <RouterMenu[]>[],
            // 历史路由记录信息
            historyRouters: <HistoryRouterItem[]>[]
        }
    },
    getters: {
        /**
         * 获取左侧菜单路由信息
         * */
        getLeftMenuList: (state) => fromJS(state.leftMenuList).toJS()
        ,
        /**
         * 获取tab导航的路由记录信息 historyRouters
         **/
        getHistoryRouters: (state) => {
            for (let i = 1; i < 50; i++) {
                let item = {
                    title: '测试测试测试' + i,
                    path: '/system',
                    query: {},
                    params: {},
                    // 本地记录时间
                    time: Date.now(),
                }
                state.historyRouters.push(item);
            }
            return fromJS(state.historyRouters).toJS() as HistoryRouterItem[]
        }
    },
    actions: {
        /**
         * menu 左侧菜单导航
         * */
        // 根据权限过滤路由
        async filterLeftMenus() {
            const list: RouterMenu[] = fromJS(appRoutes).toJS() as RouterMenu[];
            this.leftMenuList = list;
        },
        /**
         * tab 导航栏 增删
        */
        /**
         * 增： 向tab导航栏添加历史路由记录信息
         * @param hRouterItem 单个路由记录信息
         **/
        addHistoryRoutersItem(hRouterItem: HistoryRouterItem) {
            // 存储新跳转路由记录信息
            let newRecord = fromJS(hRouterItem).toJS() as unknown as HistoryRouterItem;
            // 将新跳转的路由记录信息push
            this.historyRouters.push(newRecord);
        },
        /**
         * 单个删：通过索引删除历史路由记录---用于删除单个路由菜单记录
         * @param index 对应的索引值
         * */
        removeHistoryRouterItem(index: number) {
            // 删除对应索引的路由记录
            this.historyRouters.splice(index, 1);
        },
        /**
         * 单个删：通过路由path删除历史路由记录信息---主要用于详情页新增保存/取消后删除当前页的路由记录信息
         * @param path 路由路径信息
         * */
        removeHistoryRouterItemByPath(path: string) {
            // 过滤掉当前路由记录信息
            this.historyRouters = this.historyRouters.filter(
                (item) => item.path != path
            )
        },
        /**
         * 删除多个：传入过滤后的数组重新设置路由记录的数据
         * 主要用于删除右侧或者其它的路由记录信息
         * @param newHistoryRouters 过滤后新的路由记录数组
         **/
        setHistoryRuoters(newHistoryRouters: HistoryRouterItem[]) {
            let newList = fromJS(newHistoryRouters).toJS() as unknown as HistoryRouterItem[];
            this.historyRouters = newList;
        }
    }

})