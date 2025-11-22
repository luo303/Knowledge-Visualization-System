<template>
  <div ref="mind" class="Mind"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import MindMap from 'simple-mind-map'
import type { MindMapOptions } from '@/utils/type'
const baseMap = {
  layout: 'mindMap',
  root: {
    data: {
      text: '根节点'
    },
    children: []
  }
}
const props = defineProps<{
  Map: MindMapOptions
}>()
//避开使用id绑定容器，否则无法实现同一个组件多次渲染
const mind = ref()
let mindMap: any = null
onMounted(() => {
  mindMap = new MindMap({
    el: mind.value,
    data: props.Map.root || baseMap.root,
    layout: props.Map.layout,
    fit: true,
    readonly: true,
    mousewheelAction: 'zoom',
    scaleRatio: 0.05
  } as any) //实在是配不出来ts类型呜呜
  //将背景色设置为白色
  mindMap.setThemeConfig({
    lineStyle: 'curve'
  })
  // 监听容器尺寸变化，自动调整画布
  const resizeObserver = new ResizeObserver(() => {
    mindMap.resize()
    mindMap.view.fit()
  })
  resizeObserver.observe(mind.value)

  // 组件卸载时停止监听
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<style lang="scss" scoped>
.Mind {
  width: 100%;
  height: 100%;
}
.Mind * {
  margin: 0;
  padding: 0;
}
</style>
