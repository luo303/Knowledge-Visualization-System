<template>
  <div class="content">
    <div class="Handedit">
      <div id="mindMapContainer"></div>
      <div class="bottom">
        <el-icon @click="back"><Close /></el-icon>
        <el-icon @click="forward"><RefreshLeft /></el-icon>
        <svg
          t="1762055745625"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9295"
          width="1.5rem"
          height="1.5rem"
        >
          <path
            d="M128.064 560m0-48l0 0q0-48 48-48l672 0q48 0 48 48l0 0q0 48-48 48l-672 0q-48 0-48-48Z"
            fill="#2c2c2c"
            p-id="9296"
          ></path>
          <path
            d="M461.824 31.232m48 0l0 0q48 0 48 48l0 160q0 48-48 48l0 0q-48 0-48-48l0-160q0-48 48-48Z"
            fill="#2c2c2c"
            p-id="9297"
          ></path>
          <path
            d="M461.824 736.768m48 0l0 0q48 0 48 48l0 160q0 48-48 48l0 0q-48 0-48-48l0-160q0-48 48-48Z"
            fill="#2c2c2c"
            p-id="9298"
          ></path>
          <path
            d="M693.568 275.072l-164.288 179.84a25.6 25.6 0 0 1-38.848 0l-164.224-179.84a30.528 30.528 0 0 1 19.2-51.2l328.384 0a30.528 30.528 0 0 1 19.584 51.2z"
            fill="#2c2c2c"
            p-id="9299"
          ></path>
          <path
            d="M693.504 748.672l-164.48-179.904a25.6 25.6 0 0 0-38.848 0l-164.032 179.904a30.528 30.528 0 0 0 19.2 51.2l328.64 0a30.528 30.528 0 0 0 19.584-51.2z"
            fill="#2c2c2c"
            p-id="9300"
          ></path>
        </svg>
        <el-icon><ZoomIn /></el-icon>
        <el-icon><ZoomOut /></el-icon>
        <el-input
          v-model="input"
          style="width: 240px"
          placeholder="Please input"
        />
        <svg
          @click="addson"
          t="1762055879046"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11335"
          width="1.5rem"
          height="1.5rem"
        >
          <path
            d="M512 118.31808c217.15456 0 393.68704 176.52736 393.68704 393.68192S729.15456 905.68704 512 905.68704 118.31808 729.15456 118.31808 512 294.84544 118.31808 512 118.31808M512 31.744C246.9632 31.744 31.744 246.9632 31.744 512s215.2192 480.256 480.256 480.256 480.256-215.2192 480.256-480.256S777.0368 31.744 512 31.744z"
            p-id="11336"
          ></path>
          <path
            d="M778.97216 555.04384H245.02784c-18.86208 0-33.85344-19.34336-33.85344-43.04384 0-23.69536 14.99136-43.04384 33.85344-43.04384h533.4528c18.8672 0 33.85344 19.34336 33.85344 43.04384 0.49152 24.18176-14.98624 43.04384-33.36192 43.04384z"
            p-id="11337"
          ></path>
          <path
            d="M468.95616 778.97216V245.02784c0-18.86208 19.34336-33.85344 43.04384-33.85344s43.04384 14.99136 43.04384 33.85344v533.4528c0 18.8672-19.34336 33.85344-43.04384 33.85344-24.18176 0.49152-43.04384-14.98624-43.04384-33.36192z"
            p-id="11338"
          ></path>
        </svg>
        <el-icon @click="Del"><Delete /></el-icon>
        <svg
          t="1762055609616"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4586"
          width="1.5rem"
          height="1.5rem"
        >
          <path
            d="M992.33 416.37c17.66 0 31.98-14.32 31.98-31.98s-14.32-31.98-31.98-31.98h-63.98v-63.96h63.98c17.66 0 31.98-14.32 31.98-31.98s-14.32-31.98-31.98-31.98h-63.98v-95.94c0.01-8.48-3.36-16.62-9.35-22.62-6-6-14.14-9.37-22.62-9.36h-95.94V32.61c0-17.67-14.32-31.98-31.98-31.98-17.67 0-31.98 14.32-31.98 31.98v63.96h-63.96V32.61c0-17.67-14.32-31.98-31.98-31.98-17.67 0-31.98 14.32-31.98 31.98v63.96H544.6V32.61c0-17.67-14.32-31.98-31.98-31.98-17.67 0-31.98 14.32-31.98 31.98v63.96h-63.96V32.61c0-17.67-14.32-31.98-31.98-31.98s-31.98 14.32-31.98 31.98v63.96h-63.96V32.61c0-17.67-14.32-31.98-31.98-31.98S224.8 14.95 224.8 32.61v63.96h-95.94c-8.48 0-16.62 3.36-22.62 9.36s-9.36 14.14-9.36 22.62v95.94H32.92c-17.67 0-31.98 14.32-31.98 31.98s14.32 31.98 31.98 31.98h63.96v63.96H32.92c-17.67 0-31.98 14.32-31.98 31.98 0 17.67 14.32 31.98 31.98 31.98h63.96v63.97H32.92c-17.66 0-31.97 14.31-31.97 31.97 0 17.65 14.31 31.97 31.97 31.97h63.96v63.98H32.92c-17.66 0-31.97 14.31-31.97 31.97 0 17.66 14.31 31.97 31.97 31.97h63.96v63.98H32.92C15.26 736.18 0.95 750.5 0.95 768.15s14.31 31.97 31.97 31.97h63.96v95.95a31.944 31.944 0 0 0 9.36 22.62c6 5.99 14.14 9.36 22.62 9.35h95.94v63.98c0 17.66 14.32 31.98 31.98 31.98 17.67 0 31.98-14.32 31.98-31.98v-63.98h63.96v63.98c0 17.66 14.32 31.98 31.98 31.98 17.67 0 31.98-14.32 31.98-31.98v-63.98h63.96v63.98c0 17.66 14.32 31.98 31.98 31.98s31.98-14.32 31.98-31.98v-63.98h63.96v63.98c0 17.66 14.32 31.98 31.98 31.98s31.98-14.32 31.98-31.98v-63.98h63.96v63.98c0 17.66 14.32 31.98 31.98 31.98s31.98-14.32 31.98-31.98v-63.98h95.94c8.48 0.02 16.62-3.35 22.62-9.35s9.37-14.14 9.35-22.62v-95.95h63.98c17.65 0 31.97-14.31 31.97-31.97 0-17.66-14.31-31.97-31.97-31.97h-63.98V672.2h63.98c17.65 0 31.97-14.31 31.97-31.97 0-17.66-14.31-31.97-31.97-31.97h-63.98v-63.98h63.98c17.65 0 31.97-14.31 31.97-31.97 0-17.66-14.31-31.97-31.97-31.97h-63.98v-63.97h63.98zM864.41 864.1H160.84V160.53h703.57V864.1zM406.82 580.42h79.2l15.48 61.56h67.68l-83.16-267.84h-77.04l-83.16 267.84h65.52l15.48-61.56z m18-72.36c6.84-26.64 14.04-57.96 20.52-86.04h1.44c7.2 27.36 14.04 59.4 21.24 86.04l5.76 22.68h-54.72l5.76-22.68zM697.7 641.98h-64.44V374.14h64.44v267.84z"
            p-id="4587"
          ></path>
        </svg>
        <el-icon><DocumentCopy /></el-icon>
        <svg
          t="1762055830323"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10351"
          width="1.5rem"
          height="1.5rem"
        >
          <path
            d="M845.312 0.512H32.512v1022.976h958.976v-876.8L845.312 0.512z m-172.864 62.976v256H351.488v-256h320.96zM287.488 960.512V605.76l29.184-29.248h390.656l29.184 29.248v354.752H287.488z m640 0h-126.976V585.152L727.424 512H296.576L223.488 585.152v375.36H96.512V63.488h190.976v320.448h449.024V63.488h79.68l111.296 112.32v784.704z m-384-832h65.984v128H543.488v-128z"
            fill="#040000"
            p-id="10352"
          ></path>
        </svg>
        <el-icon><Upload /></el-icon>
        <el-icon><QuestionFilled /></el-icon>
      </div>
    </div>
    <div class="AiTalk">
      <AiTalk></AiTalk>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AiTalk from './AiTalk.vue'
import { onMounted, ref, shallowRef } from 'vue'
import MindMap from 'simple-mind-map'
import {
  Close,
  RefreshLeft,
  ZoomIn,
  ZoomOut,
  Delete,
  DocumentCopy,
  Upload,
  QuestionFilled
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores'
import { ElMessage } from 'element-plus'

const LayoutStore = useLayoutStore()
const baseMap = {
  layout: 'logicalStructure',
  root: {
    data: {
      text: '根节点'
    },
    children: [
      {
        data: {
          text: '二级节点'
        },
        children: []
      }
    ]
  }
}
const Map = LayoutStore.data || baseMap
let mindMap: any = null
const isStart = ref(true)
const isEnd = ref(true)
let timer: any = null
onMounted(() => {
  mindMap = new MindMap({
    el: document.getElementById('mindMapContainer'),
    data: Map.root,
    layout: Map.layout
  } as any) //实在是配不出来ts类型呜呜呜
  //将背景色设置为白色
  mindMap.setThemeConfig({
    backgroundColor: 'white'
  })
  // 监听节点激活事件
  mindMap.on('node_active', (node: any, nodeList: any) => {
    activeNodes.value = nodeList
  })
  //监听导图节点发生变化(自动保存)
  mindMap.on('data_change', () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      const data = mindMap.getData(true)
      LayoutStore.data = data
      ElMessage.success('已自动保存')
    }, 3000)
  })
  //监听操作历史记录来决定撤销和回退撤销
  mindMap.on('back_forward', (index: number, len: number) => {
    isStart.value = index <= 0
    isEnd.value = index >= len - 1
  })
})
const input = ref('')
// 当前激活的节点列表
const activeNodes = shallowRef([])
//插入子节点
const addson = () => {
  if (activeNodes.value.length === 0) {
    ElMessage.warning('请选择要操作节点')
    return
  }
  if (!input.value.trim()) {
    mindMap.execCommand('INSERT_CHILD_NODE')
  } else {
    mindMap.execCommand('INSERT_CHILD_NODE', true, [], {
      text: input.value
    })
    input.value = ''
  }
}
//手动保存
const save = () => {
  const data = mindMap.getData(true)
  LayoutStore.data = data
}
//回退
const back = () => {
  if (isStart.value) {
    ElMessage.error('当前已无可回退记录')
    return
  }
  mindMap.execCommand('BACK')
}
//撤销回退
const forward = () => {
  if (isEnd.value) {
    ElMessage.error('当前已无可撤销回退记录')
    return
  }
  mindMap.execCommand('FORWARD')
}
//删除节点按钮
const Del = () => {
  mindMap.execCommand('REMOVE_NODE')
}
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  height: 100%;
  display: flex;
  gap: 10px;
  .Handedit {
    flex: 1;
    height: 90%;
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: white;
    display: flex;
    flex-direction: column;
    #mindMapContainer {
      width: 100%;
      height: 90%;
      border-bottom: 1px solid rgb(191, 189, 189);
    }
    #mindMapContainer * {
      margin: 0;
      padding: 0;
    }
    .bottom {
      height: 10%;
      display: flex;
      gap: 2%;
      justify-content: center;
      align-items: center;
      svg {
        cursor: pointer;
      }
      .el-icon {
        font-size: 25px !important;
        cursor: pointer;
      }
    }
  }
  .AiTalk {
    width: 25%;
  }
}
</style>
