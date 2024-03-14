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
/**
 * @description 滚动容器的Ref
 */
const contentRef = ref<HTMLDivElement>();
/**
 * @description list元素Ref
 */
const listRef = ref<HTMLDivElement>();
/**
 * @description 收集列表里每一项的高度信息
 */
const positions = ref<IPosInfo[]>([]);

const state = reactive({
  viewHeight: 0,//滚动容器的像素高度
  listHeight: 0,//列表的高度
  startIndex: 0,//视图显示的第一个元素索引
  maxCount: 0,//滚动容器最大显示item个数，用来计算要截取的最后一个索引值
  preLen: 0,//记录之前的列表数据长度，加载更多时，循环初始化新的item信息
});


/**
 *@description 获取最后的截取索引
 */
const endIndex = computed(() => Math.min(props.dataSource.length, state.startIndex + state.maxCount));
/**
 * @description 获取截取后的数据
 */
const renderList = computed(() => props.dataSource.slice(state.startIndex, endIndex.value));
/**
 * @description 计算列表容器的偏移量
 */
const offsetDis = computed(() => state.startIndex > 0 ? positions.value[state.startIndex - 1].bottom : 0)

/**
 * @description 列表容器的偏移量
 */
const scrollStyle = computed(() => ({
  height: `${state.listHeight - offsetDis.value}px`,//当前列表的高度
  transform: `translate3d(0,${offsetDis.value}px,0)`//列表容器的偏移量
} as CSSProperties))

//监听当前 listRef 和 数据源数量变化
watch([() => listRef.value, () => props.dataSource.length], () => {
  props.dataSource.length && initPosition();
  nextTick(() => {
    props.dataSource.length && setPosition();
  });
});

//监听当前 列表显示处的第一个元素的索引值变化
watch(() => state.startIndex, () => {
  console.log("监听startIndex变化", state.startIndex)
  setPosition();
});

/**
 * @description 初始化，拿到数据源初始化 pos 数组
*/
const initPosition = () => {
  const pos: IPosInfo[] = [];
  const disLen = props.dataSource.length - state.preLen;//加载更多后，
  //加载之前的最后一个item的top
  const preTop = positions.value[positions.value.length - 1] ? positions.value[positions.value.length - 1].top : 0;
  //加载之前的最后一个item的bottom
  const preBottom = positions.value[positions.value.length - 1] ? positions.value[positions.value.length - 1].bottom : 0;
  for (let i = 0; i < disLen; i++) {
    //从新加载的第一个索引值开始
    const item = props.dataSource[state.preLen + i];
    pos.push({
      index: item.id,//元素索引
      height: props.estimatedHeight,//预设高度
      top: preTop ? preTop + i * props.estimatedHeight : item.id * props.estimatedHeight,
      bottom: preBottom ? preBottom + (i + 1) * props.estimatedHeight : (item.id + 1) * props.estimatedHeight,
      dHeight: 0
    });
  }
  positions.value = [...positions.value, ...pos];
  state.preLen = positions.value.length;
};

/**
 * @description 数据 item 渲染完成后，更新数据item的真实高度，并计算listHeight的高度
*/
const setPosition = () => {
  const nodes = listRef.value?.children;//获取 所有渲染后的元素 item
  if (!nodes || !nodes.length) return;
  //更新positions里所有预设的 item 高度信息
  [...nodes].forEach((node: Element) => {
    const rect = node.getBoundingClientRect(); // 获取对应的元素信息
    const item = positions.value[+node.id];//+node.id 将 string 转换为 number
    const dHeight = item.height - rect.height;// 与实际高度的差值
    if (dHeight) {
      item.height = rect.height;//真实高度
      item.bottom = item.bottom - dHeight;//第一次根据当前item自身的真实高度差计算底部高度
      item.dHeight = dHeight;//将差值保留，用于计算后面item的bottom值
    }
  });

  //  重新计算整体的高度：拿到第一个的
  const startId = +nodes[0].id;
  const len = positions.value.length;//获取长度
  let startHeight = positions.value[startId].dHeight;//缓存第一个的高度差，用于计算后面item的bottom值
  positions.value[startId].dHeight = 0;//将第一个的高度差设为0，因为当前的第一个item高度已经为真实高度，不存在高度差
  //从第二个开始遍历
  for (let i = startId + 1; i < len; i++) {
    const item = positions.value[i];
    item.top = positions.value[i - 1].bottom;//当前 item 的顶部高度为 前一个 的底部高度
    item.bottom = item.bottom - startHeight;//第二次根据前一个高度差计算当前item的底部高度，此时的底部高度才是为真实的底部高度
    if (item.dHeight !== 0) {
      startHeight += item.dHeight;//将所有的高度差累加，给下一个item计算bottom
      item.dHeight = 0;//将当前的高度差设为0，因为当前item的高度已经是真实的高度，不存在高度差
    }

  }
  // 重新计算子列表的高度，列表的高度就是为最后一个item的bottom值
  state.listHeight = positions.value[len - 1].bottom;
}

/**
 * @description 初始化最大显示个数 maxCount
 */
const init = () => {
  //获取滚动容器的像素高度，高度包含该元素的垂直内边距和边框
  state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
  //计算当前滚动容器最多能显示多少个item，加1为缓存item
  state.maxCount = Math.ceil(state.viewHeight / props.estimatedHeight) + 1;
  //给滚动容器绑定滚动事件
  contentRef.value && contentRef.value.addEventListener("scroll", handleScroll);
}

/**
 * @description 定时器
 */
const destroy = () => {
  //给滚动容器取消绑定滚动事件
  contentRef.value && contentRef.value.removeEventListener("scroll", handleScroll);
}

/**
 * @description 滚动容器的滚动事件
 */
const handleScroll = () => {
  //获取滚动容器的
  //scrollTop:元素的内容垂直滚动的像素数,
  //clientHeight:元素内部的高度(CSS height + CSS padding ),包含内边距，但不包括边框、外边距和水平滚动条（如果存在）
  //scrollHeight:元素内容高度的度量，包括由于溢出导致的视图中不可见内容
  const { scrollTop, clientHeight, scrollHeight } = contentRef.value!;

  //计算当前列表视图显示的第一个item的索引
  state.startIndex = bianrySearch(positions.value, scrollTop);
  // 滚动条距离的高度
  const bottom = scrollHeight - clientHeight - scrollTop;
  if (bottom <= 20) {
    !props.loading && emit("getMoreData");
  }
}
/**
 * @description 二分查找 计算当前滑动到了第几个item
 * @param list 每条item高度信息
 * @param value scrollTop值
 * @returns preIndex 当前滑动到的 item 对应的索引
 * */
const bianrySearch = (list: IPosInfo[], value: number) => {
  //start开始索引，end最后索引，templateIndex
  let start = 0, end = list.length - 1, templateIndex = -1;
  while (start < end) {
    //取中间值来判断，主要是为了减少不必要的计算，所以从中间开始取
    const midIndex = Math.floor((start + end) / 2);//当前列表的中间索引
    const midValue = list[midIndex].bottom;//获取当前列表中间索引对应的 item 缓存对象的bottom值

    //比较当前的bottom值是否与滚动容器的scrollTop
    if (midValue === value) return midIndex;//如果相等，说明当前item刚滑动到顶部隐藏位置，直接返回当前item的索引
    else if (midValue < value) start = midIndex + 1;//如果bottom<scrollTop，说明当前item已经被滑动过了，重新记录start值
    else if (midValue > value) {//如果bottom>scrollTop，说明还没有滑动到
      if (templateIndex === -1 || templateIndex > midIndex) templateIndex = midIndex;
      end = midIndex;//重新记录最后一项的索引值
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
    box-sizing: border-box; //设定每个item为怪异盒子：height = border + padding + 内容的高度

  }
}
</style>