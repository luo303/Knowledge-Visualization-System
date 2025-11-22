<template>
  <div ref="mind" class="Mind"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, nextTick } from 'vue'
import MindMap from 'simple-mind-map'
import type { MindMapOptions } from '@/utils/type'

// 基础地图配置
const baseMap = {
  layout: 'mindMap',
  root: {
    data: {
      text: '根节点'
    },
    children: []
  }
}

// 定义属性
const props = defineProps<{
  Map: MindMapOptions
}>()

// 避开使用id绑定容器，否则无法实现同一个组件多次渲染
const mind = ref()
let mindMap: any = null
let resizeObserver: ResizeObserver | null = null

// 创建或更新思维导图实例
const createOrUpdateMindMap = () => {
  if (!mind.value) return

  // 确保有有效的根节点数据
  const rootData = props.Map?.root || baseMap.root
  const layout = props.Map?.layout || 'mindMap'

  try {
    // 如果实例已存在，先销毁
    if (mindMap) {
      mindMap.destroy()
    }

    // 创建新的思维导图实例
    mindMap = new MindMap({
      el: mind.value,
      data: rootData,
      layout: layout,
      fit: true,
      readonly: true,
      mousewheelAction: 'zoom',
      scaleRatio: 0.05
    } as any)

    // 设置主题配置
    mindMap.setThemeConfig({
      lineStyle: 'curve',
      backgroundColor: '#ffffff'
    })

    // 立即调整大小以确保正确显示
    nextTick(() => {
      if (mindMap) {
        mindMap.resize()
        mindMap.view.fit()
      }
    })
  } catch (error) {
    console.error('创建思维导图失败:', error)
  }
}

// 监听尺寸变化
const observeResize = () => {
  if (!mind.value) return

  // 清除之前的监听器
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  resizeObserver = new ResizeObserver(() => {
    if (mindMap) {
      mindMap.resize()
      mindMap.view.fit()
    }
  })
  resizeObserver.observe(mind.value)
}

// 组件挂载时初始化
onMounted(() => {
  createOrUpdateMindMap()
  observeResize()
})

// 监听Map属性变化，更新思维导图
watch(
  () => props.Map,
  () => {
    nextTick(() => {
      createOrUpdateMindMap()
    })
  },
  { deep: true }
)

// 组件卸载时清理
onUnmounted(() => {
  if (mindMap) {
    mindMap.destroy()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.Mind {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 确保子元素也正确继承尺寸 */
:deep(.smm-canvas) {
  width: 100% !important;
  height: 100% !important;
}

.Mind * {
  margin: 0;
  padding: 0;
}
</style>
