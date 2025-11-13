<template>
  <div class="talk">
    <div class="container">
      <!-- 聊天列表视图 -->
      <div v-if="!isChatting" class="list_container">
        <div class="header">
          <span class="title">对话模式</span>
          <button @click="open(true)" class="NewBtn">+ 新对话</button>
        </div>

        <div class="chat_list">
          <div v-if="chat.length !== 0">
            <div
              v-for="(chat, id) in chat"
              :key="id"
              class="chat_item"
              @click="enterChat(chat.conversation_id)"
            >
              <div class="chat_info">
                <span class="chat_name"> {{ chat.title }}</span>
                <span class="last_msg">
                  <Markdown
                    :source="
                      chat.messages[chat.messages.length - 2]?.content ||
                      '无消息'
                    "
                /></span>
              </div>
              <div class="actions">
                <button>
                  <el-icon color="gray" @click.stop="edittitle(chat)"
                    ><EditPen
                  /></el-icon>
                </button>
                <button @click.stop="deleteChat(chat.conversation_id)">
                  🗑️
                </button>
              </div>
            </div>
          </div>
          <div v-else><el-empty description="新建一个对话吧" /></div>
        </div>
      </div>

      <!-- 聊天窗口视图 -->
      <div v-else class="dialog_container">
        <div class="header">
          <svg
            @click="backToList"
            t="1762418171275"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="14693"
            width="30"
            height="20"
          >
            <path
              d="M44.8 512L448 108.8l44.8 44.8-326.4 326.4h825.6v64H166.4l326.4 326.4-44.8 44.8z"
              p-id="14694"
              fill="#2c2c2c"
            ></path>
            <path
              d="M960 512H89.6 960M448 64L89.6 422.4 0 512l89.6 89.6L448 960l89.6-89.6L243.2 576H1024V448H243.2l294.4-294.4L448 64z"
              fill="#2c2c2c"
              p-id="14695"
            ></path>
          </svg>
          <span class="title"> {{ currentChat?.title }}</span>
        </div>

        <div class="talk_area" ref="messageArea">
          <div class="msg system_msg">
            欢迎来到对话系统，请问有什么可以帮您？
          </div>
          <div
            v-for="(msg, idx) in currentChat?.messages.filter(item => {
              return item.role === 'user' || item.role === 'assistant'
            })"
            :key="idx"
            :class="['msg', msg.role === 'user' ? 'user-msg' : 'system_msg']"
          >
            <template v-if="msg.role === 'user'">
              {{ msg.content }}
            </template>
            <template v-else-if="msg.role === 'assistant'">
              <Markdown :source="msg.content" />
            </template>
            <template v-else></template>
          </div>
        </div>

        <div class="input_area">
          <input
            v-model="inputContent"
            type="text"
            placeholder="输入消息..."
            @keyup.enter="sendMsg"
          />
          <button @click="sendMsg">发送</button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    @close="cancel"
    v-model="dialogFormVisible"
    :title="newtitle ? '新对话' : '修改标题'"
    width="400"
  >
    <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent>
      <el-form-item label="标题名称" prop="name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          @keyup.enter="handleEnter"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button v-if="newtitle" type="primary" @click="createNewChat">
          确认
        </el-button>
        <el-button v-else type="primary" @click="confirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import Markdown from 'vue3-markdown-it'
import { ElMessage } from 'element-plus'
import { ref, nextTick, onMounted } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { Chat, ChatList, Message } from '@/stores/modules/type'
import {
  NewChat,
  GetChat,
  DelChat,
  UpdateTitle,
  SendMessage,
  GetMapChatList
} from '@/api/user'
const LayoutStore = useLayoutStore()
// 所有对话数据（指定类型为Chat数组）
const { chat, currentChat, currentChatId } = storeToRefs(LayoutStore)
onMounted(() => {
  currentChatId.value = ''
})
//对对话记录进行时间排序(ascending 是否升序（true：最早在前，false：最新在前）)
const sortByUpdate = (
  conversations: ChatList[],
  ascending: boolean = false
): ChatList[] => {
  return [...conversations].sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime()
    const dateB = new Date(b.updated_at).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
}
const getconlist = async () => {
  try {
    const res = await GetMapChatList(LayoutStore.data.mapId)
    if ((res as any).Code === 200) {
      LayoutStore.chatlist = sortByUpdate((res as any).Data.list, false)
    } else {
      const message = (res as any).Message
      ElMessage.error(`${message}`)
    }
  } catch (error) {
    console.log(error)
  }
}

const getlist = async () => {
  getconlist()
  chat.value = []
  for (const item of LayoutStore.chatlist) {
    try {
      const res = await GetChat(item.conversation_id)
      if ((res as any).Code === 200) {
        chat.value.push({
          title: (res as any).Data.title as string,
          conversation_id: item.conversation_id as string,
          messages: (res as any).Data.messages as Message[]
        })
      } else {
        const message = (res as any).Message
        ElMessage.error(`${message}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
if (LayoutStore.data.mapId) {
  getlist()
}

const form = ref({
  name: ''
})
const formRef = ref()
//判断标题是否重复
const detect = (rule: any, value: any, callback: any) => {
  if (chat.value.every((item: Chat) => item.title !== value)) callback()
  else callback('标题已使用')
}
const rules = ref({
  name: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { validator: detect, trigger: 'blur' }
  ]
})

const dialogFormVisible = ref(false)
const newtitle = ref(true) //判断是新建标题还剩修改标题
const messageArea = ref<HTMLDivElement | null>(null)
// 滚动到最底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageArea.value) {
      messageArea.value.scrollTop = messageArea.value.scrollHeight
    }
  })
}
const handleEnter = (event: any) => {
  // 阻止回车键的默认行为（如表单提交）
  event.preventDefault()
  // 可选：添加自定义回车逻辑
  console.log(event)

  console.log('回车触发，但已阻止默认行为')
}
// 控制当前显示视图：false=列表，true=聊天窗口
const isChatting = ref<boolean>(false)

// 输入框内容
const inputContent = ref<string>('')

//编辑对话标题
const edittitle = (item: Chat) => {
  currentChatId.value = item.conversation_id
  form.value.name = item.title
  newtitle.value = false
  dialogFormVisible.value = true
}
//+新对话
const open = (item: boolean) => {
  if (LayoutStore.data.mapId) {
    dialogFormVisible.value = true
    newtitle.value = item
  } else {
    ElMessage.error('请先上传文件生成导图')
  }
}
//取消
const cancel = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
}
//确认
const confirm = async () => {
  await formRef.value.validate()
  // currentChat.value.title = form.value.name

  if (currentChat.value.conversation_id) {
    try {
      const res = await UpdateTitle(
        currentChat.value.conversation_id,
        form.value.name
      )
      if ((res as any).Code === 200) {
        getlist()
        dialogFormVisible.value = false
        formRef.value.resetFields()
        ElMessage.success('修改成功')
      } else {
        dialogFormVisible.value = false
        formRef.value.resetFields()
        const message = (res as any).Message
        ElMessage.error(`${message}`)
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    ElMessage.error('系统错误，当前没有导图')
  }
}
// 进入聊天窗口（添加参数类型）
const enterChat = async (id: string) => {
  console.log(id)

  currentChatId.value = id
  await nextTick()
  if (currentChat.value.conversation_id) {
    isChatting.value = true
    scrollToBottom()
  } else {
    console.log(currentChat.value)

    ElMessage.error('系统错误，当前聊天不存在')
  }
}

// 返回列表
const backToList = (): void => {
  isChatting.value = false
  getlist()
}

// 发送消息
const sendMsg = async () => {
  if (!inputContent.value.trim()) return
  const temp = inputContent.value
  // 添加用户消息
  currentChat.value.messages.push({
    content: inputContent.value,
    role: 'user'
  })
  // 清空输入框
  inputContent.value = ''
  scrollToBottom()
  try {
    const res = await SendMessage(
      currentChat.value.conversation_id,
      temp,
      LayoutStore.data
    )
    if ((res as any).Code === 200) {
      if ((res as any).Data.new_map_json) {
        LayoutStore.data = (res as any).Data.new_map_json
      }
      currentChat.value.messages.push({
        content: (res as any).Data.content,
        role: 'assistant'
      })
      scrollToBottom()
    } else {
      const message = (res as any).Message
      ElMessage.error(`${message}`)
    }
  } catch (error) {
    console.log(error)
  }

  // // 模拟系统回复
  // setTimeout(() => {
  //   currentChat.value.messages.push({
  //     // content:
  //     //   '该思维导图以“Eino大模型应用开发框架”为核心，从开源背景、解决痛点、核心优势、应用与未来四个维度系统展开，具体内容如下：  \n\n### **一、开源背景与目标**  \n作为字节跳动开源的Go语言大模型应用开发框架，其开源背景基于**内部半年使用迭代经验**，核心目标包括：  \n- 依托Go语言特性覆盖开发全流程  \n- 帮助开发者快速实现深度大模型应用  \n\n### **二、解决的开发痛点**  \n针对当前大模型开发中的典型难题，框架聚焦解决：  \n1. **入门门槛高**：降低大模型领域新手学习难度  \n2. **框架滞后性**：避免传统框架更新缓慢问题  \n3. **Python维护复杂**：对比解决Python代码冗长、维护成本高的痛点  \n4. **效果评估难**：简化模型效果量化评估流程  \n5. **工具链碎片化**：减少配套工具额外学习成本  \n\n### **三、核心特点与优势**  \n框架竞争力体现在四大核心维度：  \n\n#### **1. 内核稳定易用**  \n- **API设计**：简单易懂，降低使用复杂度  \n- **上手路径**：提供明确学习路线，实现平滑学习曲线  \n\n#### **2. 扩展性与可持续**  \n- **极致扩展能力**：支持灵活定制与功能扩展  \n- **研发活跃度**：团队开发高度活跃，保障框架持续迭代  \n- **长期发展**：定位可持续演进的开源项目  \n\n#### **3. 强类型语言优势**  \n- **基于Golang**：利用Go语言强类型特性，提升代码可读性与维护性  \n- **可靠性保障**：静态类型检查减少运行时错误，增强系统稳定性  \n\n#### **4. 实践与配套工具**  \n- **字节业务验证**：已在字节核心业务（如豆包、抖音）中实践验证  \n- **开箱即用工具**：提供配套工具链，无需额外学习第三方组件  \n\n### **四、应用情况与未来**  \n#### **1. 内部应用现状**  \n- 字节内部首选大模型开发框架  \n- 已接入豆包、抖音、扣子等核心产品，服务数百个业务场景  \n\n#### **2. 开源项目地址**  \n- 核心框架：github.com/cloudwego/eino  \n- 扩展组件：github.com/cloudwego/eino-ext  \n\n#### **3. 未来发展规划**  \n- 实现“内外一套代码”，统一内部与开源版本  \n- 推动社区共建，目标成为行业优秀开源框架  \n\n### **整体逻辑**  \n导图从“背景-痛点-方案-落地”闭环展开，先阐述开源必要性，再通过痛点分析凸显框架价值，最后以核心优势与应用案例佐证实用性，未来规划进一步强化长期发展信心，完整呈现Eino框架的技术定位与生态愿景。',
  //     content: '1.四道口附近',
  //     role: 'system',
  //     timestamp: createid()
  //   })
  //   scrollToBottom()
  // }, 1000)
}

// 创建新对话
const createNewChat = async () => {
  await formRef.value.validate()
  // const id = createid()
  // currentChatId.value = id
  try {
    const res = await NewChat(LayoutStore.data, form.value.name)
    if ((res as any).Code === 200) {
      currentChatId.value = (res as any).Data.conversation_id
      chat.value.push({
        title: form.value.name,
        conversation_id: (res as any).Data.conversation_id,
        messages: []
      })
      dialogFormVisible.value = false
      formRef.value.resetFields()
      ElMessage.success('新建成功')
      enterChat(currentChatId.value)
      getlist()
    } else {
      dialogFormVisible.value = false
      formRef.value.resetFields()
      const message = (res as any).Message
      ElMessage.error(`${message}`)
      return
    }
  } catch (error) {
    dialogFormVisible.value = false
    formRef.value.resetFields()
    console.log(error)
  }
  // chat.value.push({
  //   title: form.value.name,
  //   conversation_id: id,
  //   messages: []
  // })
}

// 删除对话
const deleteChat = async (id: string) => {
  if (chat.value.length <= 1) {
    ElMessage.error('至少保留一个对话')
    return
  }
  try {
    const res = await DelChat(id)
    if ((res as any).Code === 200) {
      //重新获取所有对话列表
      if (LayoutStore.data.mapId) {
        try {
          const res = await GetMapChatList(LayoutStore.data.mapId)
          if ((res as any).Code === 200) {
            LayoutStore.chatlist = sortByUpdate((res as any).Data.list, false)
          } else {
            const message = (res as any).Message
            ElMessage.error(`${message}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
      getlist()
      ElMessage.success('删除成功')
    } else {
      const message = (res as any).Message
      ElMessage.error(`${message}`)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.talk {
  height: 90%;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: white;
  .container {
    width: 100%;
    max-width: 100%;
    height: 100%;
    margin: 0 auto;

    box-sizing: border-box;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: white;
  }

  /* 列表视图样式 */
  .list_container {
    height: 97%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
  }

  /* 聊天窗口样式 */
  .dialog_container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* 通用头部样式 */
  .header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px 20px 0 0;
    border-bottom: 1px solid #eee;
    .icon {
      cursor: pointer;
    }
  }

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  /* 列表项样式 */
  .chat_list {
    flex: 1;
    overflow-y: auto;
    // 滚动条整体样式
    &::-webkit-scrollbar {
      width: 6px; // 滚动条宽度
      height: 6px; // 滚动条高度（横向滚动时）
    }

    // 滚动条轨道
    &::-webkit-scrollbar-track {
      background: #f1f1f1; // 轨道背景色
      border-radius: 10px; // 轨道圆角
    }

    // 滚动条滑块
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1; // 滑块颜色
      border-radius: 10px; // 滑块圆角
      transition: background 0.2s; // hover过渡效果
    }

    // 滚动条滑块hover状态
    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8; // 滑块hover颜色（略深）
    }

    // 滚动条角落（横竖滚动条交叉处）
    &::-webkit-scrollbar-corner {
      background: transparent; // 角落透明
    }
  }

  .chat_item {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background 0.2s;
  }

  .chat_item:hover {
    background: #f5f5f5;
  }

  .chat_info .last_msg {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    display: block;
  }
  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .actions button {
    border: none;
    background: transparent;
    color: #f44336;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .actions button:hover {
    opacity: 1;
  }

  /* 消息区域样式 */
  .talk_area {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    gap: 12px;
    // 滚动条整体样式
    &::-webkit-scrollbar {
      width: 6px; // 滚动条宽度
      height: 6px; // 滚动条高度（横向滚动时）
    }

    // 滚动条轨道
    &::-webkit-scrollbar-track {
      background: #f1f1f1; // 轨道背景色
      border-radius: 10px; // 轨道圆角
    }

    // 滚动条滑块
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1; // 滑块颜色
      border-radius: 10px; // 滑块圆角
      transition: background 0.2s; // hover过渡效果
    }

    // 滚动条滑块hover状态
    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8; // 滑块hover颜色（略深）
    }

    // 滚动条角落（横竖滚动条交叉处）
    &::-webkit-scrollbar-corner {
      background: transparent; // 角落透明
    }
  }

  .msg {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 12px;
    word-break: break-word;
  }

  .system_msg {
    background: #e9ecef;
    align-self: flex-start;
  }

  .user-msg {
    background: #409eff;
    color: white;
    align-self: flex-end;
  }

  /* 输入区域样式 */
  .input_area {
    display: flex;
    padding: 15px;
    gap: 10px;
    border-top: 1px solid #eee;
  }

  .input_area input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
  }

  .input_area button {
    padding: 0 15px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .input_area button:hover {
    background: #3086e8;
  }

  /* 其他按钮样式 */
  .NewBtn {
    padding: 5px 10px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
