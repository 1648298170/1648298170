<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ScrollVue from '../../components/scroll/Scroll.vue';
import Mock from 'mockjs';

const dataSource = ref<Array<{
  id: number;
  content: string;
}>>([]);

const loading = ref(false);

// 模拟请求获取数据
const addData = () => {
  loading.value = true;
  setTimeout(() => {
    const newData = [];
    for (let i = 0; i < 20; i++) {
      const len: number = dataSource.value.length + newData.length;
      newData.push({
        id: len,
        content: Mock.mock("@csentence(40,100)")//内容
      });
    }
    dataSource.value = [...dataSource.value, ...newData];
    console.log("dataSource.value ??",dataSource.value )
    loading.value = false;
  }, 2000);
}

onMounted(() => {
  addData();
})
</script>

<template>
  <div class="test-estimated-list-containet">
    <ScrollVue :data-source="dataSource" :estimated-height="60" :loading="loading" @getMoreData="addData">
      <template #item="{ item }">
        <div class="list-item">{{ item.id }}-{{ item.content }}</div>
      </template>
    </ScrollVue>
  </div>
</template>

<style scoped lang="less">
.test-estimated-list-containet {
  width: 100%;
  height: 30%;
}
</style>
