<template>
  <div class="content">
    <div class="createmind">导图生成区</div>
    <div class="AiTalk">
      <AiTalk></AiTalk>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import AiTalk from './AiTalk.vue'
import { useLayoutStore } from '@/stores/modules/layout'

const LayoutStore = useLayoutStore()
onMounted(() => {
  //进入生成导图页面将导航栏展开
  LayoutStore.isCollapse = false
})
onUnmounted(() => {
  //离开生成导图页面将导航栏折叠
  LayoutStore.isCollapse = true
})
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  display: flex;
  .createmind {
    flex: 1;
  }
  .AiTalk {
    width: 220px;
  }
}
</style>
