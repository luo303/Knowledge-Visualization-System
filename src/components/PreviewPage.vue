<template>
  <div id="mindMapContainer"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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

console.log(props.Map)

let mindMap: any = null
onMounted(() => {
  mindMap = new MindMap({
    el: document.getElementById('mindMapContainer'),
    data: props.Map.root || baseMap.root,
    layout: props.Map.layout,
    fit: true,
    initRootNodePosition: ['left', 'center'],
    fix: true,
    readonly: true,
    isDisableDrag: true, //是否禁止拖动画布
    isLimitMindMapInCanvas: true,
    notShowExpandBtn: true,
    disableMouseWheelZoom: true //是否禁止缩放
  } as any) //实在是配不出来ts类型呜呜
  //将背景色设置为白色
  mindMap.setThemeConfig({
    backgroundColor: 'white',
    lineStyle: 'curve',
    paddingX: 4,
    paddingY: 4,
    second: {
      fillColor: 'rgb(255, 255, 255)'
    }
  })
})
</script>

<style lang="scss" scoped>
#mindMapContainer {
  width: 100%;
  height: 100%;
}
#mindMapContainer * {
  margin: 0;
  padding: 0;
}
</style>
