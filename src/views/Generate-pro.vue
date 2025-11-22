<template>
  <div class="createmind-container">
    <div class="createmind-title">请点击底部按钮选择想要生成的导图</div>
    <div class="generatemap-container">
      <div class="singlemindmap-container" v-for="map in maps" :key="map.mapId">
        <div class="map-info">
          <h3 class="map-name">{{ map.root.data.text }}</h3>
          <div class="map-meta">
            <span class="map-time">{{ map.createTime }}</span>
          </div>
        </div>
        <div class="map-picture">
          <PreviewPage :Map="map" class="preview-img" />
        </div>
        <el-button
          type="primary"
          @click="handleCardClick(map)"
          style="
            width: 95%;
            height: 10%;
            margin: 10px 0px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <span>查看导图</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PreviewPage from '@/components/PreviewPage.vue'
import { ref } from 'vue'
import type { MindMapOptions } from '@/utils/type'
import { useRouter } from 'vue-router'

const router = useRouter()

const maps = ref<MindMapOptions[]>([
  {
    mapId: 'map-1001',
    root: {
      data: { text: '项目规划' },
      children: [
        { data: { text: '需求分析' } },
        { data: { text: '技术选型' } },
        { data: { text: '开发计划' } }
      ]
    },
    title: '项目规划',
    userId: '12313245646',
    desc: '这是一个项目规划',
    layout: 'mindMap',
    createTime: '2022-01-01 :00:00'
  },
  {
    mapId: 'map-1002',
    root: {
      data: { text: '问题排查' },
      children: [
        { data: { text: '前端问题' } },
        { data: { text: '后端问题' } },
        { data: { text: '网络问题' } }
      ]
    },
    title: '问题排查',
    userId: '12313245646',
    desc: '这是一个问题排查',
    layout: 'fishBone',
    createTime: '2022-01-02 12:00:00'
  },
  {
    mapId: 'map-1003',
    root: {
      data: { text: '团队成员' },
      children: [
        { data: { text: '产品经理' } },
        { data: { text: 'UI设计师' } },
        { data: { text: '前端开发' } },
        { data: { text: '后端开发' } }
      ]
    },
    title: '团队成员',
    userId: '12313245646',
    desc: '这是一个团队成员',
    layout: 'orgChart',
    createTime: '2022-01-03 12:00:00'
  }
])

// 卡片点击事件
const handleCardClick = (map: any) => {
  const currentMapId = map.mapId
  if (currentMapId && currentMapId !== 'xxx') {
    router.push({ name: 'handedit', query: { mapId: currentMapId } })
  }
}
</script>
<style lang="scss" scoped>
.createmind-container {
  margin-left: 10px;
  width: 95%;
  height: 90%;
  display: flex;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  flex-direction: column;

  .createmind-title {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .generatemap-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    gap: 10px;
    width: 100%;
    height: 90%;

    .singlemindmap-container {
      height: 100%;
      width: 100%;
      flex-direction: column;
      background-color: white;
      border-radius: 20px;
      border: 1px solid #ebebeb;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      box-shadow: 7px 14px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;
      &:hover {
        transform: translateY(-7px);
        box-shadow: 10px 17px 12px rgba(0, 0, 0, 0.15);
      }

      .map-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;

        .map-name {
          font-size: 16px;
          font-weight: bold;
          display: flex;
          white-space: nowrap;
          margin-right: 120px;
        }

        .map-meta {
          display: flex;
          justify-content: space-between;
          color: #585757;
          white-space: nowrap;
        }
      }

      .map-picture {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90%;
        width: 95%;
        border-radius: 20px;
        background-color: #f8f8f9;
        flex-direction: column;
        position: relative;

        .preview-img {
          width: 100%;
        }
      }

      /* 使用Element Plus按钮组件的内置样式 */
    }
  }
}
</style>
