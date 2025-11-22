<template>
  <div class="nav">
    <el-menu
      router
      unique-opened
      :default-active="$route.path"
      :collapse="LayoutStore.isCollapse"
    >
      <el-menu-item index="/layout/mymind"
        ><el-icon><Folder /></el-icon><span>我的导图</span></el-menu-item
      >
      <el-menu-item index="/layout/createmind"
        ><el-icon><Share /></el-icon><span>生成导图</span></el-menu-item
      >
      <el-menu-item index="/layout/handedit"
        ><el-icon><EditPen /></el-icon><span>手动编辑</span></el-menu-item
      >
      <el-menu-item
        @click="
          () => {
            ElMessage('讲解模式待开发中')
          }
        "
        ><el-icon><VideoPlay /></el-icon><span>讲解模式</span></el-menu-item
      >
      <el-menu-item index="/layout/personalcenter"
        ><el-icon><Tools /></el-icon><span>设置</span></el-menu-item
      >
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  EditPen,
  Tools,
  Folder,
  Share,
  VideoPlay
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const LayoutStore = useLayoutStore()
onMounted(() => {
  //默认保持折叠
  LayoutStore.isCollapse = true
})
</script>

<style lang="scss" scoped>
.nav {
  padding-top: 20px;
  height: 90%;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: white;
}
.el-menu {
  border-right: 0;
}
</style>
