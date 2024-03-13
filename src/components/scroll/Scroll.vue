<template>
  <div class="fs-estimated-virtuallist-container">
    <div class="fs-estimated-virtuallist-content" ref="contentRef">
      <div class="fs-estimated-virtuallist-list" ref="listRef" :style="scrollStyle">
        <div class="fs-estimated-virtuallist-list-item" v-for="i in renderList" :key="i.id" :id="String(i.id)">
          <slot name="item" :item="i"></slot>
        </div>
      </div>
    </div>
  </div>
  <div v-if="props.loading">获取数据中...</div>
</template>

<script setup lang="ts" generic="T extends {id:number}">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, nextTick, CSSProperties } from "vue";
import { IEstimatedListProps, IPosInfo } from "./type";

const props = defineProps<IEstimatedListProps<T>>();

//插槽类型约束
defineSlots<{
  item(props: { item: T }): any;
}>();

const emit = defineEmits<{
  getMoreData: []
}>()

const contentRef = ref<HTMLDivElement>();

const listRef = ref<HTMLDivElement>();

const positions = ref<IPosInfo[]>([]);//需要记录每一项的高度

const state = reactive({
  viewHeight: 0,
  listHeight: 0,
  startIndex: 0,
  maxCount: 0,
  preLen: 0,
});


//获取最后的截取索引
const endIndex = computed(() => Math.min(props.dataSource.length, state.startIndex + state.maxCount));
//获取截取后的数据
const renderList = computed(() => props.dataSource.slice(state.startIndex, endIndex.value));
// 计算偏移量
const offsetDis = computed(() => state.startIndex > 0 ? positions.value[state.startIndex - 1].bottom : 0)

const scrollStyle = computed(() => ({
  height: `${state.listHeight - offsetDis.value}px`,
  transform: `transform3d(0,${offsetDis.value},0)`
} as CSSProperties))

//监听当前 listRef 和 数据源数量变化
watch([() => listRef.value, () => props.dataSource.length], () => {
  props.dataSource.length && initPosition();
  nextTick(() => {
    props.dataSource.length && setPosition();
  });
});

watch(() => state.startIndex, () => {
  console.log("监听startIndex变化")
  setPosition();
});

//初始化，拿到数据源初始化 pos 数组
// const initPosition = () => {
//   const pos: IPosInfo[] = [];
//   const disLen = props.dataSource.length - state.preLen;
//   const preTop = positions.value[positions.value.length - 1] ? positions.value[positions.value.length - 1].top : 0;
//   const preBottom = positions.value[positions.value.length - 1] ? positions.value[positions.value.length - 1].bottom : 0;
//   for (let i = 0; i < disLen; i++) {
//     const item = props.dataSource[state.preLen + i];
//     pos.push({
//       index: item.id,//元素索引
//       height: props.estimatedHeight,//预设高度
//       top: preTop ? preTop + i * props.estimatedHeight : item.id * props.estimatedHeight,
//       bottom: preBottom ? preBottom + (i + 1) * props.estimatedHeight : (item.id + 1) * props.estimatedHeight,
//       dHeight: 0
//     });
//     positions.value = [...positions.value, ...pos];

//   }
// };
const initPosition = () => {
  const pos: IPosInfo[] = [];

  for (let i = 0; i < props.dataSource.length; i++) {
    // const item = props.dataSource[state.preLen + i];
    pos.push({
      index: i,//元素索引
      height: props.estimatedHeight,//预设高度
      top: i * props.estimatedHeight,
      bottom: (i + 1) * props.estimatedHeight,
      dHeight: 0
    });
  }
  positions.value = [...positions.value, ...pos];
};

//数据 item 渲染完成后，更新数据item的真实高度
const setPosition = () => {
  const nodes = listRef.value?.children;//获取 所有渲染的元素 item

  if (!nodes || !nodes.length) return;
  [...nodes].forEach((node: Element) => {
    const rect = node.getBoundingClientRect(); // 获取对应的元素信息
    const item = positions.value[+node.id];//+node.id 将 string 转换为 number
    const dHeight = item.height - rect.height;// 差值

    if (dHeight) {
      item.height = rect.height;//真实高度
      item.bottom = item.bottom - dHeight;
      item.dHeight = dHeight;//将差值保留
    }
  });

  //  重新计算整体的高度
  const startId = +nodes[0].id;
  const len = positions.value.length;
  let startHeight = positions.value[startId].dHeight;
  positions.value[startId].dHeight = 0;
  for (let i = startId + 1; i < len; i++) {
    const item = positions.value[i];
    item.top = positions.value[i - 1].bottom;
    item.bottom = item.bottom - startHeight;
    if (item.dHeight !== 0) {
      startHeight += item.dHeight;
      item.dHeight = 0;
    }

  }
  // 重新计算子列表的高度
  state.listHeight = positions.value[len - 1].bottom;
}

//初始化
const init = () => {
  state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
  state.maxCount = Math.ceil(state.viewHeight / props.estimatedHeight) + 1;

  contentRef.value && contentRef.value.addEventListener("scroll", handleScroll);
}

//销毁
const destroy = () => {
  contentRef.value && contentRef.value.removeEventListener("scroll", handleScroll);
}

//滚动监听事件
const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = contentRef.value!;
  state.startIndex = bianrySearch(positions.value, scrollTop);
  // 滚动条距离的高度
  const bottom = scrollHeight - clientHeight - scrollTop;
  if (bottom <= 20) {
    // !props.loading && emit("getMoreData");
  }
}
/**
 * @description 二分查找
 * @param list 每条item高度信息
 * @param value scrollTop值
 * */
const bianrySearch = (list: IPosInfo[], value: number) => {
  let start = 0, end = list.length - 1, templateIndex = -1;
  while (start < end) {
    const midIndex = Math.floor((start + end) / 2);
    const midValue = list[midIndex].bottom;

    if (midValue === value) return midIndex;
    else if (midValue < value) start = midIndex + 1;
    else if (midValue > value) {
      if (templateIndex === -1 || templateIndex > midIndex) templateIndex = midIndex;
      end = midIndex;
    }
  }
  return templateIndex;
}

onMounted(() => {
  init();
})

onBeforeUnmount(() => {
  destroy();
})

</script>

<style lang="less" scoped>
.fs-estimated-virtuallist {
  &-container {
    width: 100%;
    height: 100%;
  }

  &-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  &-list-item {
    width: 100%;
    box-sizing: border-box;

  }
}
</style>