<template>
    <div class="tab-nav-component">
        <template v-for="(historyRecordItem, index) in store.getHistoryRouters" :key="historyRecordItem.path">
            <div class="tab-nav-item">
                <div :class="['tab-nav-itemTitle', index == selectIndex && 'tab-navigator-item-active']"
                    @click.left="goTabRouter(historyRecordItem, index)"
                    @click.right.prevent="(e) => handRightClick(e, index)">
                    {{ historyRecordItem.title }}
                </div>
                <div class="close-container" v-show="store.getHistoryRouters.length > 1">
                    <el-icon @click.stop="removeRouterCard(historyRecordItem, index)">
                        <CloseBold />
                    </el-icon>
                </div>
            </div>
        </template>
        <Teleport to="body">
            <div v-show="dropVisible && store.getHistoryRouters.length > 1" :style="{
                top: `${dropModalState.y}px`,
                left: `${dropModalState.x}px`
            }" class="tab-drop-menu">
                <div @click="removeRouterCard(selectItem, rightClickIndex)">关闭本页</div>
                <div @click="removeTabRouters('right')">关闭右侧</div>
                <div @click="removeTabRouters('other')">关闭其他</div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { HistoryRouterItem, useAppStore } from "../store/app";
import { useRouter, useRoute } from 'vue-router';
import { fromJS } from "immutable";


const store = useAppStore();
const route = useRoute();
const router = useRouter();
const dropVisible = ref<boolean>(false);//是否显示右键菜单
let selectIndex = ref<number>(0);//当前历史路由菜单的索引值
const dropModalState = reactive({
    x: 0,
    y: 0
}) as { x: number, y: number };//被右击位置的坐标轴
const rightClickIndex = ref(0);//记录当前被右击的历史路由索引
let selectItem = ref<HistoryRouterItem | null>(null);//当前的路由对象

/**
 * 跳转当前被点击的路由页面 
 * @param tabItem 当前被点击的历史路由信息
 * @param tabItemIndex 当前被点击的历史路由索引
 **/
function goTabRouter(tabItem: HistoryRouterItem, tabItemIndex: number) {
    // 从路由历史记录中获取当前点击的路由信息
    let historyItem = store.getHistoryRouters[tabItemIndex];
    dropVisible.value = false;
    selectIndex.value = tabItemIndex;
    // 跳转到当前点击的路由菜单
    router.push({
        path: historyItem.path,
        params: historyItem.params,
        query: historyItem.query
    });
}

/**
 * 右击菜单
 * @param e 事件对象
 * @param index 当前被右击的历史路由索引
 * */
function handRightClick(e: MouseEvent, index: number) {
    dropModalState.x = e.pageX;
    dropModalState.y = e.pageY;
    rightClickIndex.value = index;
    dropVisible.value = true;
}

/**
 *删除单个记录和菜单 
 @param tabItem 当前历史路由对象
 @param tabItemIndex 当前历史路由所处的索引
 **/
function removeRouterCard(
    tabItem: HistoryRouterItem | null,
    tabItemIndex: number
) {
    // 移除菜单页
    if (store.getHistoryRouters && store.getHistoryRouters.length > 1) {
        store.removeHistoryRouterItem(tabItemIndex);
        // 跳转到最后一个菜单页
        let gotoIndex = tabItemIndex < (store.getHistoryRouters.length - 1) ? tabItemIndex : (store.getHistoryRouters.length - 1);
        // 记录当前被移除后要跳转的历史路由所处的索引
        selectIndex.value = gotoIndex;
        // 被移除后要跳转的历史路由对象
        let endHistoryRoute = store.getHistoryRouters[gotoIndex];
        router.replace({
            path: endHistoryRoute.path,
            query: endHistoryRoute.query,
            params: endHistoryRoute.params
        });
    }
}

/**
 * 关闭多个历史路由
 * @param removeType 'right' | 'other'
 * */
function removeTabRouters(removeType: 'right' | 'other') {
    // 获取被右击的历史路由
    let result = store.getHistoryRouters[rightClickIndex.value];
    // 如果是关闭其它
    if (removeType == 'other') {
        store.setHistoryRuoters([result]);
    }
    // 如果关闭右侧的历史路由,必须历史路由个数为...
    if (removeType == 'right' && rightClickIndex.value < store.getHistoryRouters.length) {
        let newList = fromJS(store.getHistoryRouters).toJS() as HistoryRouterItem[];
        //通过splice数组方法，将右侧的历史路由删除
        newList.splice(rightClickIndex.value + 1, newList.length - rightClickIndex.value);
        // 重新设置状态中历史路由数组数据
        store.setHistoryRuoters(newList)
    }
}

// 监听当前跳转的路由信息
watch(() => route.path, (newPath) => {
    store.getHistoryRouters.find((item, index) => {
        if (item.path == newPath) {
            selectIndex.value = index;
            selectItem.value = fromJS(item).toJS() as unknown as HistoryRouterItem;
        }
    })
})

</script>

<style scoped lang="less">
.tab-nav-component {
    display: flex;
    border: 1px solid red;

    .tab-nav-item {
        padding: 8px 10px;
        font-size: 14px;
        max-width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 1px solid rgb(105, 100, 100);

        .close-container {
            display: flex;
            align-items: center;
            margin-left: 5px;
        }
    }

    .tab-navigator-item-active {
        color: #4674c4;
        // overflow: auto;
        // text-overflow: clip;
        // white-space: normal;
        // border-radius: 5px;
        // width: 100px;
        // flex: 0 0 100px;
    }
}
</style>