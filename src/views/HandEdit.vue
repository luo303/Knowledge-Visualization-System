<template>
  <div class="content">
    <div class="left">
      <div class="Handedit">
        <div id="mindMapContainer"></div>
        <div class="bottom">
          <el-tooltip effect="dark" content="回退" placement="top">
            <el-icon @click="back"><Close /></el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销回退" placement="top">
            <el-icon @click="forward"><RefreshLeft /></el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="居中视图" placement="top">
            <svg
              @click="center"
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
          </el-tooltip>
          <el-tooltip effect="dark" content="放大" placement="top">
            <el-icon @click="bigger"><ZoomIn /></el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="缩小" placement="top">
            <el-icon @click="smaller"><ZoomOut /></el-icon>
          </el-tooltip>

          <el-input
            v-model="input"
            style="width: 240px"
            placeholder="Please input"
          />
          <el-tooltip effect="dark" content="添加节点" placement="top">
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
          </el-tooltip>
          <el-tooltip effect="dark" content="删除节点" placement="top">
            <el-icon @click="Del"><Delete /></el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="AI自动优化" placement="top">
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
          </el-tooltip>

          <el-dropdown @command="handleCommand">
            <el-icon><DocumentCopy /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logicalStructure"
                  >逻辑结构图</el-dropdown-item
                >
                <el-dropdown-item command="mindMap">思维导图</el-dropdown-item>
                <el-dropdown-item command="organizationStructure"
                  >组织结构图</el-dropdown-item
                >
                <el-dropdown-item command="catalogOrganization"
                  >目录组织图</el-dropdown-item
                >
                <el-dropdown-item command="fishbone">鱼骨图</el-dropdown-item>
                <el-dropdown-item command="timeline">时间轴</el-dropdown-item>
                <el-dropdown-item command="verticalTimeline"
                  >竖向时间轴</el-dropdown-item
                >
              </el-dropdown-menu>
            </template></el-dropdown
          >
          <el-tooltip effect="dark" content="保存" placement="top">
            <svg
              @click="save"
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
          </el-tooltip>
          <el-tooltip effect="dark" content="导出" placement="top">
            <el-icon @click="ToExport"><Upload /></el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="帮助" placement="top">
            <el-icon @click="drawer = true"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="footer">
        <div class="save">{{ status }}</div>
        <div class="name">当前导图：{{ baseMap.title }}</div>
      </div>
    </div>

    <div class="AiTalk">
      <el-input
        @change="search"
        ref="searchRef"
        v-model="search_content"
        class="search_input"
        placeholder="输入查找内容后按回车"
        :prefix-icon="Search"
        clearable
      />
      <AiTalk></AiTalk>
    </div>
    <div
      class="context-menu"
      v-show="show"
      :style="{ left: `${left}px`, top: `${top}px` }"
      @click.stop
    >
      <div v-if="type === 'node'">
        <div class="menu-item" @click="addNode()">添加子节点</div>
        <div class="menu-item" @click="pasteNode()">粘贴节点</div>
        <div class="menu-item" @click="delNode()">删除节点</div>
        <div class="menu-item" @click="copyNode()">复制节点</div>
        <div class="menu-item" @click="cutNode()">剪切节点</div>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="导出" width="500">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          prop="name"
          label="导出文件名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          prop="type"
          label="导出文件类型"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.type" placeholder="选择格式">
            <el-option label="png格式" value="png" />
            <el-option label="pdf格式" value="pdf" />
            <el-option label="xmind格式" value="xmind" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="Export">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="centerDialogVisible" title="Warning" width="400">
      <span> 是否要删除该节点，若有子节点会被一并删除 </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="No">取消删除</el-button>
          <el-button type="primary" @click="Yes"> 确认删除 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-drawer
      class="help"
      v-model="drawer"
      direction="rtl"
      size="40%"
      title="快捷键"
      resizable
    >
      <p>复制节点:Ctrl + C</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>剪切节点:Ctrl + X</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>删除节点:Backspace</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>添加子节点:Tab</p>
      <p>添加同级节点:Enter</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>文本换行:Shitf + Enter</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>缩放思维导图:既可以通过底部按钮也可以鼠标滚轮</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>多选:Ctrl + 左键</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <p>回退:Ctrl + Z</p>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import AiTalk from './AiTalk.vue'
import { onMounted, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import MindMap from 'simple-mind-map'
import {
  Close,
  RefreshLeft,
  ZoomIn,
  ZoomOut,
  Delete,
  DocumentCopy,
  Upload,
  QuestionFilled,
  StarFilled,
  Search
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { UpdateMap } from '@/api/user'
//是否保存
const status = ref('未保存')
//控制帮助页是否打开
const drawer = ref(false)
//控制导出页是否打开
const dialogFormVisible = ref(false)
//控制删除确认框
const centerDialogVisible = ref(false)
//导出页宽度
const formLabelWidth = '140px'
const form = ref({
  name: '',
  type: ''
})
const formRef = ref()
const rules = ref({
  name: [{ required: true, message: '导出名不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择导出类型', trigger: 'blur' }]
})
const LayoutStore = useLayoutStore()
const baseMap = {
  mapId: '123456',
  userId: '654321',
  title: '测试导图',
  desc: '该导图用于测试',
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
let mindMap: any = null
//判断是否在记录栈最前和最后
const isStart = ref(true)
const isEnd = ref(true)
//防抖
let timer: any = null
// 当前右键点击的类型
const type = ref('')
// 如果点击的节点，那么代表被点击的节点
const currentNode = shallowRef(null)
// 菜单显示的位置
const left = ref(0)
const top = ref(0)
// 是否显示菜单
const show = ref(false)
//隐藏右键菜单时菜单地状态
const hide = () => {
  show.value = false
  left.value = 0
  top.value = 0
  type.value = ''
}
//搜索节点框内容
const search_content = ref('')
const searchRef = ref()
let confirmResolve: ((value: boolean) => void) | null = null

onMounted(async () => {
  mindMap = new MindMap({
    el: document.getElementById('mindMapContainer'),
    data: LayoutStore.data.root || baseMap.root,
    layout: LayoutStore.data.layout || baseMap.layout,
    textAutoWrapWidth: 200,
    beforeShortcutRun: (key: any, activeNodes: any) => {
      if (key === 'Backspace' && activeNodes[0]?.isRoot) {
        ElMessage.error('根节点无法删除')
        return true
      }
      if (key === 'Backspace' && activeNodes.length !== 0) {
        centerDialogVisible.value = true
        return new Promise(resolve => {
          confirmResolve = resolve
        }).then(e => {
          if (!e) {
            mindMap.execCommand('REMOVE_NODE')
            ElMessage.success('删除成功')
          }
          return e
        })
      }
      return false
    }, //防止通过快捷键删除根节点
    scaleRatio: 0.05,
    mousewheelAction: 'zoom', // zoom（放大缩小）、move（上下移动）
    // 当mousewheelAction设为move时，可以通过该属性控制鼠标滚动一下视图移动的步长，单位px
    mousewheelMoveStep: 100,
    // 鼠标缩放是否以鼠标当前位置为中心点，否则以画布中心点
    mouseScaleCenterUseMousePosition: true,
    // 当mousewheelAction设为zoom时，或者按住Ctrl键时，默认向前滚动是缩小，向后滚动是放大，如果该属性设为true，那么会反过来
    mousewheelZoomActionReverse: true,
    // 禁止鼠标滚轮缩放，你仍旧可以使用api进行缩放
    disableMouseWheelZoom: false,
    fit: true, //一开始大小自适应
    maxZoomRatio: 150, //最大缩放倍数
    minZoomRatio: 20 //最小缩放倍数
  } as any)
  setTimeout(() => {
    mindMap.resize()
  }, 260)
  //删除Shift + Backspace快捷键
  mindMap.keyCommand.removeShortcut('Shift+Backspace')
  //监听搜索节点
  mindMap.on('search_info_change', (data: any) => {
    console.log(data)
    if (data.total === 0) {
      ElMessage.warning('未找到包含该内容的节点')
    } else {
      ElMessage.success(`共找到${data.total}个包含改内容的节点`)
    }
  })
  mindMap.on('node_click', hide)
  mindMap.on('draw_click', hide)
  mindMap.on('expand_btn_click', hide)
  mindMap.on('node_contextmenu', (e: any, node: any) => {
    type.value = 'node'
    left.value = e.clientX + 10
    top.value = e.clientY + 10
    show.value = true
    currentNode.value = node
  })

  //将背景色设置为白色
  mindMap.setThemeConfig({
    lineStyle: 'curve'
  })
  // 监听节点激活事件
  mindMap.on('node_active', (node: any, nodeList: any) => {
    activeNodes.value = nodeList
  })
  //监听导图节点发生变化(自动保存)
  mindMap.on('data_change', () => {
    status.value = '未保存'
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      const data = mindMap.getData(true)
      LayoutStore.data.layout = data.layout
      LayoutStore.data.root = data.root
      status.value = '已保存'
      ElMessage.success('本地已自动保存')
    }, 3000)
  })
  //监听视图变化

  let watch = true
  mindMap.on('view_data_change', (data: any) => {
    if (data.state.scale >= 1.5 && watch) {
      watch = false
      ElMessage.warning('已不可再放大')
      return
    } else if (data.state.scale <= 0.2 && watch) {
      watch = false
      ElMessage.warning('已不可再缩小')
      return
    } else {
    }
    if (data.state.scale < 1.5 && data.state.scale > 0.2) watch = true
  })
  //监听操作历史记录来决定撤销和回退撤销
  mindMap.on('back_forward', (index: number, len: number) => {
    isStart.value = index <= 0
    isEnd.value = index >= len - 1
  })
})
const search = () => {
  mindMap.search.search(search_content.value, () => {
    search_content.value = ''
  })
}
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
const save = async () => {
  const data = mindMap.getData(true)
  try {
    const res = await UpdateMap(LayoutStore.data)
    if ((res as any).Code === 200) {
      LayoutStore.data.layout = data.layout
      LayoutStore.data.root = data.root
      status.value = '已保存'
      ElMessage.success('保存成功')
      clearTimeout(timer)
    } else {
      ElMessage.error(`${(res as any).Message}` || '保存失败')
    }
  } catch (error) {
    console.log(error)
  }
  // status.value = '已保存'
  // ElMessage.success('保存成功')
  clearTimeout(timer)
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
  if (activeNodes.value.length === 0) {
    ElMessage.warning('请选择要操作节点')
    return
  }
  if ((activeNodes as any)._rawValue[0].isRoot) {
    ElMessage.error('根节点无法删除')
    return
  }
  centerDialogVisible.value = true
  new Promise<boolean>(resolve => {
    confirmResolve = resolve
  }).then(e => {
    if (!e) {
      // 用户确认删除
      mindMap.execCommand('REMOVE_NODE')
      ElMessage.success('删除成功')
    }
  })
}
//确认删除按钮
const Yes = () => {
  if (confirmResolve) {
    confirmResolve(false) // 传递true表示阻止删除
    confirmResolve = null // 重置，避免重复调用
    centerDialogVisible.value = false
  }
}
//取消删除
const No = () => {
  if (confirmResolve) {
    confirmResolve(true) // 传递true表示阻止删除
    confirmResolve = null // 重置，避免重复调用
    centerDialogVisible.value = false
  }
}
//切换结构
const handleCommand = (command: string) => {
  mindMap.setLayout(command)
  LayoutStore.data.layout = command
}
//居中按钮
const center = () => {
  mindMap.view.fit()
}
//放大
const bigger = () => {
  mindMap.view.enlarge()
}
//缩小
const smaller = () => {
  mindMap.view.narrow()
}
//导出按钮
const ToExport = () => {
  dialogFormVisible.value = true
}
//取消按钮
const cancel = () => {
  formRef.value.resetFields()
  dialogFormVisible.value = false
}
//导出
const Export = async () => {
  await formRef.value.validate()
  switch (form.value.type) {
    case 'png':
      mindMap.export('png', true, form.value.name)
      break
    case 'pdf':
      mindMap.export('pdf', true, form.value.name)
      break
    case 'xmind':
      mindMap.export('xmind', form.value.name)
      break
    default:
      ElMessage.error('出错啦')
  }
  dialogFormVisible.value = false
  formRef.value.resetFields()
}
const cutNode = () => {
  mindMap.renderer.cut()
  show.value = false
  ElMessage.success('剪切成功')
}
const copyNode = () => {
  mindMap.renderer.copy()
  show.value = false
  ElMessage.success('复制成功')
}
const delNode = () => {
  if ((activeNodes as any)._rawValue[0].isRoot) {
    ElMessage.error('根节点无法删除')
    show.value = false
    return
  }
  show.value = false
  centerDialogVisible.value = true
  new Promise<boolean>(resolve => {
    confirmResolve = resolve
  }).then(e => {
    if (!e) {
      // 用户确认删除
      mindMap.execCommand('REMOVE_NODE')
      ElMessage.success('删除成功')
    }
  })
}
const addNode = () => {
  mindMap.execCommand('INSERT_CHILD_NODE')
  show.value = false
  ElMessage.success('添加节点成功')
}
const pasteNode = () => {
  mindMap.renderer.paste()
  show.value = false
  ElMessage.success('粘贴成功')
}
//组件销毁前更新思维导图
onBeforeUnmount(async () => {
  if (LayoutStore.data.mapId) {
    try {
      const res = await UpdateMap(LayoutStore.data)
      if ((res as any).Code === 200) {
      } else {
        const message = (res as any).Message
        ElMessage.error(`${message}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
})
watch(
  () => LayoutStore.aidata,
  newData => {
    if (mindMap) {
      mindMap.updateData(newData.root)
      // 2. 单独设置布局（如果库有 setLayout 方法）
      mindMap.setLayout(newData.layout || 'logicalStructure')
      mindMap.resize()
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  height: 100%;
  display: flex;
  gap: 10px;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    .Handedit {
      flex: 1;
      width: 100%;
      height: 70%;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: white;
      display: flex;
      flex-direction: column;
      #mindMapContainer {
        border-radius: 20px 20px 0 0;
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
    .footer {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: gray;
    }
  }
  .AiTalk {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90%;
    width: 25%;
    .search_input {
      border-radius: 10px;
      height: 7%;
    }
  }
}
.context-menu {
  position: fixed;
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  border-radius: 8px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 3px 6px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  z-index: 9999;
  min-width: 120px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(2px);
}

.menu-item {
  padding: 9px 18px;
  cursor: pointer;
  font-size: 14px;
  color: #2d3748;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

/* hover时的背景光效 */
.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(59, 130, 246, 0.05);
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

.menu-item:hover {
  color: #2563eb;
  background: rgba(59, 130, 246, 0.03);
}

.menu-item:hover::before {
  transform: translateX(0);
}
.help {
  p {
    margin: 5px 0;
  }
}
</style>
