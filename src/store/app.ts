import { RouterMenu, appRoutes } from '../router';
import { fromJS } from 'immutable';
import {defineStore} from 'pinia';

export const useAppStore = defineStore('app',{
    state:()=>{
        return{
            // 左侧菜单路由信息
            leftMenuList:<RouterMenu[]>[],
        }
    },
    getters:{
        //获取左侧菜单路由信息
        getLeftMenuList(state){
            let list = fromJS(state.leftMenuList).toJS();
            return list;
        }
    },
    actions:{
       async filterLeftMenus(){
            const list:RouterMenu[] = fromJS(appRoutes).toJS() as RouterMenu[];
            console.log(list)
            this.leftMenuList = list;
        }
    }
    
})