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
          <div v-if="chatList.length !== 0">
            <div
              v-for="(chat, id) in chatList"
              :key="id"
              class="chat_item"
              @click="enterChat(chat.conversation_id)"
            >
              <div class="chat_info">
                <span class="chat_name"> {{ chat.title }}</span>
                <span class="last_msg">{{
                  chat.messages[chat.messages.length - 1]?.content || '无消息'
                }}</span>
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
          <span class="title"> {{ currentChat.title }}</span>
        </div>

        <div class="talk_area" ref="messageArea">
          <div class="msg system_msg">
            欢迎来到对话系统，请问有什么可以帮您？
          </div>
          <div
            v-for="(msg, idx) in currentChat.messages"
            :key="idx"
            :class="['msg', msg.role === 'user' ? 'user-msg' : 'system_msg']"
          >
            {{ msg.content }}
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
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="标题名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
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
import { ElMessage } from 'element-plus'
import { ref, reactive, computed, nextTick } from 'vue'
import { EditPen } from '@element-plus/icons-vue'

// 定义消息类型接口
interface Message {
  content: string
  role: string
  timestamp: string
}

// 定义对话类型接口
interface Chat {
  title: string //本次对话标题
  conversation_id: string //本次对话唯一标识id
  messages: Message[]
}
const form = ref({
  name: ''
})
const formRef = ref()
//判断标题是否重复
const detect = (rule: any, value: any, callback: any) => {
  if (chatList.every(item => item.title !== value)) callback()
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
//用时间戳代替id
const createid = () => {
  const timestamp = Date.now()
  const id = timestamp.toString()
  return id
}
// 控制当前显示视图：false=列表，true=聊天窗口
const isChatting = ref<boolean>(false)

// 当前选中的对话ID
const currentChatId = ref<string>(createid())

// 输入框内容
const inputContent = ref<string>('')

// 所有对话数据（指定类型为Chat数组）
const chatList = reactive<Chat[]>([])

// 获取当前对话数据（添加返回值类型）
const currentChat = computed<Chat>(() => {
  return chatList.find(item => item.conversation_id === currentChatId.value)!
})
//编辑对话标题
const edittitle = (item: Chat) => {
  currentChatId.value = item.conversation_id
  form.value.name = item.title
  newtitle.value = false
  dialogFormVisible.value = true
}
//+新对话
const open = (item: boolean) => {
  dialogFormVisible.value = true
  newtitle.value = item
}
//取消
const cancel = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
}
//确认
const confirm = async () => {
  await formRef.value.validate()
  currentChat.value.title = form.value.name
  dialogFormVisible.value = false
}
// 进入聊天窗口（添加参数类型）
const enterChat = (id: string): void => {
  currentChatId.value = id
  isChatting.value = true
  scrollToBottom()
}

// 返回列表
const backToList = (): void => {
  isChatting.value = false
}

// 发送消息
const sendMsg = (): void => {
  if (!inputContent.value.trim()) return

  // 添加用户消息
  currentChat.value.messages.push({
    content: inputContent.value,
    role: 'user',
    timestamp: createid()
  })

  // 清空输入框
  inputContent.value = ''
  scrollToBottom()
  // 模拟系统回复
  setTimeout(() => {
    currentChat.value.messages.push({
      content: `已收到："${currentChat.value.messages[currentChat.value.messages.length - 1]?.content}"`,
      role: 'system',
      timestamp: createid()
    })
    scrollToBottom()
  }, 1000)
}

// 创建新对话
const createNewChat = async () => {
  await formRef.value.validate()
  const id = createid()
  currentChatId.value = id
  chatList.push({
    title: form.value.name,
    conversation_id: id,
    messages: []
  })
  dialogFormVisible.value = false
  formRef.value.resetFields()
  enterChat(currentChatId.value)
}

// 删除对话
const deleteChat = (id: string): void => {
  if (chatList.length <= 1) {
    ElMessage.error('至少保留一个对话')
    return
  }
  const index = chatList.findIndex(item => item.conversation_id === id)
  chatList.splice(index, 1)
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
