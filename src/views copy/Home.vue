<!-- <template>
    <div>
        <div class="">
            <el-container>
                <el-aside>
                    <div class="layout-menu-container">
                        <el-menu :collapse="isCollapse" :default-openeds="computeds.oepnNames.value" text-color="#2D3748"
                            active-text-color="#2D3748" :default-active="computeds.activeName.value" unique-opened>
                            下拉菜单
                            <el-sub-menu v-for="item in store.getLeftMenuList" :key="item.name" :index="item.name">
                                <template #title>
                                    <img style="width:15px;height:15px;margin-right: 10px;"
                                        src="../assets/vue.svg">
                                    <span>{{ item.meta.title }}</span>
                                </template>
                                <el-menu-item v-for="child in item.children" @click="methods.goMenuRouter(child.name)"
                                    :key="child.name" :index="child.meta.menuKey">{{ child.title }}</el-menu-item>
                            </el-sub-menu>
                        </el-menu>
                    </div>
                </el-aside>
                <el-container>
                    <el-header>导航头</el-header>
                    <el-main>主页</el-main>
                </el-container>
            </el-container>
        </div>
        <div>
            <div v-for="item in store.getLeftMenuList" :key="item.name" @click="methods.goMenuRouter(item.name)">
                {{ item.meta.title }}
            </div>
        </div>
        <div class="layout">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '../store/app';


const store = useAppStore();
const router = useRouter();

const methods = {
    //左侧菜单跳转路由
    goMenuRouter(routeName: string) {
        router.push({ name: routeName });
    }
}


</script>

<style scoped>
.layout {
    background-color: pink;
}
</style> -->