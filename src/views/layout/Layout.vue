<template>
    <div>
        <div class="">
            <el-container>
                <el-aside>
                    <div class="layout-menu-container">
                        <el-menu :collapse="false" :default-openeds="computeds.openName.value" text-color="#2D3748"
                            active-text-color="#2D3748" :default-active="computeds.activeName.value" unique-opened>
                            <!-- 下拉菜单 -->
                            <el-sub-menu v-for="item in store.getLeftMenuList" :key="item.name" :index="item.name">
                                <template #title>
                                    <img style="width:15px;height:15px;margin-right: 10px;" src="../assets/vue.svg">
                                    <span>{{ item.title }}</span>
                                </template>
                                <el-menu-item v-for="child in item.children" @click="methods.goMenuRouter(child.name)"
                                    :key="child.name" :index="child.meta.menuKey">{{ child.title }}</el-menu-item>
                            </el-sub-menu>
                        </el-menu>
                    </div>
                </el-aside>
                <el-container>
                    <el-header>导航头</el-header>
                    <el-main>
                        <div class="layout">
                            <router-view></router-view>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../store/app';
import { computed } from 'vue';


const store = useAppStore();
const router = useRouter();
const route = useRoute();


console.log(route);
console.log(store.getLeftMenuList)
const methods = {
    //左侧菜单跳转路由
    goMenuRouter(routeName: string) {
        router.push({ name: routeName });
    }
}

const computeds = {
    openName: computed(() => {
        return route.name!.toString().split('/');
    }),
    activeName: computed(() => {
        let info = route.matched.find((item) => {
            console.log(item)
            return item.meta.menuKey;
        });
        console.log("info>>",info)
        if (info) {
            return info.meta.menuKey as string;
        }
        return '';
    })
}


</script>

<style scoped>
.layout {
    background-color: pink;
}
</style>