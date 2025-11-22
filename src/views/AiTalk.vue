<template>
  <div class="talk">
    <div class="container">
      <!-- 聊天列表视图 -->
      <div v-if="!isChatting" class="list_container">
        <div class="header">
          <span class="title">AI编辑模式</span>
          <el-button
            type="primary"
            size="large"
            :icon="Plus"
            @click="open(true)"
            >新对话</el-button
          >
        </div>

        <div class="chat_list">
          <div v-if="chatlist.length !== 0">
            <div
              v-for="(chat, id) in chatlist"
              :key="id"
              class="chat_item"
              @click="enterChat(chat.conversation_id)"
            >
              <div class="chat_info">
                <span class="chat_name"> {{ chat.title }}</span>
              </div>
              <div class="actions">
                <button>
                  <el-icon color="gray" @click.stop="edittitle(chat)"
                    ><EditPen
                  /></el-icon>
                </button>
                <button @click.stop="openDel(chat.conversation_id)">
                  <svg
                    t="1763263899311"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5476"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M358.925672 596.814688v30.450522c0 17.248849 13.985526 31.233352 31.233352 31.233352 17.248849 0 31.233352-13.985526 31.233352-31.233352v-30.450522c0-17.248849-13.985526-31.233352-31.233352-31.233352-17.248849 0-31.233352 13.985526-31.233352 31.233352zM602.506317 596.814688v30.450522c0 17.248849 13.985526 31.233352 31.233352 31.233352s31.233352-13.985526 31.233351-31.233352v-30.450522c0-17.248849-13.984503-31.233352-31.233351-31.233352s-31.233352 13.985526-31.233352 31.233352zM437.047937 699.686636c-14.650675 9.104355-19.155269 28.360931-10.04989 43.01263 11.015891 17.73185 41.238216 47.740304 84.651982 47.740304 43.195801 0 73.79368-29.780257 85.059258-47.379077 9.216919-14.391778 5.03262-33.338293-9.237385-42.742477-14.270005-9.393951-33.576723-5.409197-43.159985 8.739035-0.12689 0.188288-13.049201 18.915815-32.661888 18.915815-19.028379 0-30.93864-17.274432-31.772634-18.530028-9.175987-14.412244-28.259624-18.788925-42.829458-9.756202zM907.576407 160.082952H699.352015v-26.882254c0-40.145325-32.692586-72.807213-72.878844-72.807213h-229.046626c-40.186258 0-72.878844 32.661887-72.878844 72.807213v26.882254H116.323309c-17.248849 0-31.233352 13.984503-31.233352 31.233352s13.984503 31.233352 31.233352 31.233351h791.253098c17.248849 0 31.233352-13.984503 31.233352-31.233351s-13.985526-31.233352-31.233352-31.233352z m-270.692119 0H387.014404v-26.882254c0-5.607718 4.768607-10.340509 10.411117-10.340509h229.046627c5.64251 0 10.411117 4.732791 10.411117 10.340509v26.882254z"
                      fill="#999999"
                      p-id="5477"
                    ></path>
                    <path
                      d="M824.286446 259.279185c-17.248849 0-31.233352 13.984503-31.233352 31.233352v530.07261c0 40.089044-32.692586 72.705905-72.878844 72.705906H303.725466c-40.186258 0-72.878844-32.616862-72.878844-72.705906v-530.07261c0-17.248849-13.984503-31.233352-31.233352-31.233352s-31.233352 13.984503-31.233352 31.233352v530.07261c0 74.535577 60.71378 135.172609 135.345548 135.172609h416.448784c74.632791 0 135.345548-60.637032 135.345548-135.172609v-530.07261c0-17.248849-13.984503-31.233352-31.233352-31.233352z"
                      fill="#999999"
                      p-id="5478"
                    ></path>
                    <path
                      d="M355.781052 259.279185c-17.248849 0-31.233352 13.984503-31.233351 31.233352v167.494758c0 17.248849 13.985526 31.233352 31.233351 31.233352 17.248849 0 31.233352-13.985526 31.233352-31.233352v-167.494758c0-17.248849-13.984503-31.233352-31.233352-31.233352zM699.352015 458.007295v-167.494758c0-17.248849-13.984503-31.233352-31.233351-31.233352s-31.233352 13.984503-31.233352 31.233352v167.494758c0 17.248849 13.985526 31.233352 31.233352 31.233352s31.233352-13.984503 31.233351-31.233352zM511.949858 489.240647c17.248849 0 31.233352-13.985526 31.233352-31.233352v-167.494758c0-17.248849-13.985526-31.233352-31.233352-31.233352s-31.233352 13.984503-31.233352 31.233352v167.494758c-0.001023 17.248849 13.984503 31.233352 31.233352 31.233352z"
                      fill="#999999"
                      p-id="5479"
                    ></path>
                  </svg>
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
          <div class="msg system_msg load" v-show="isloading">
            AI思考中
            <svg
              t="1763213934464"
              class="load_icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7965"
              width="50"
              height="30"
            >
              <path
                d="M480 96a32 32 0 0 1 64 0v192a32 32 0 0 1-64 0V96z m250.624 60.64a32 32 0 1 1 51.776 37.632l-112.832 155.328a32 32 0 0 1-51.808-37.632l112.864-155.328z m167.136 196.384a32 32 0 1 1 19.776 60.864l-182.624 59.328a32 32 0 0 1-19.776-60.864l182.624-59.328z m19.776 257.088a32 32 0 1 1-19.776 60.864l-182.624-59.328a32 32 0 0 1 19.776-60.864l182.624 59.328zM782.4 829.76a32 32 0 0 1-51.776 37.632l-112.864-155.328a32 32 0 1 1 51.808-37.632l112.832 155.328zM544 928a32 32 0 0 1-64 0v-192a32 32 0 0 1 64 0v192z m-250.624-60.64a32 32 0 0 1-51.776-37.632l112.832-155.328a32 32 0 0 1 51.808 37.632l-112.864 155.328z m-167.136-196.384a32 32 0 1 1-19.776-60.864l182.624-59.328a32 32 0 0 1 19.776 60.864l-182.624 59.328z m-19.776-257.088a32 32 0 0 1 19.776-60.864l182.624 59.328a32 32 0 1 1-19.776 60.864l-182.624-59.328zM241.6 194.24a32 32 0 1 1 51.776-37.632l112.864 155.328a32 32 0 1 1-51.808 37.632L241.6 194.24z"
                fill="#1296db"
                p-id="7966"
              ></path>
            </svg>
          </div>
        </div>

        <div class="input_area">
          <el-input
            class="input"
            v-model="inputContent"
            type="textarea"
            placeholder="输入部分文字后Tab键可AI智能补全"
            @keyup.enter="sendMsg"
            @keydown.tab="complete"
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
            word-limit-position="outside"
          />
          <el-button
            @click="sendMsg"
            type="primary"
            size="large"
            :disabled="isloading"
            >发送</el-button
          >
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
  <el-dialog
    v-model="DelDialogVisible"
    title="提示"
    width="400"
    @close="canceldel"
  >
    <span> 是否要删除该会话 </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="DelDialogVisible = false">取消删除</el-button>
        <el-button type="primary" @click="deleteChat(currentChatId)">
          确认删除
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import Markdown from 'vue3-markdown-it'
import { ElMessage } from 'element-plus'
import { ref, nextTick, onMounted, watch, onBeforeUnmount } from 'vue'
import { EditPen, Plus } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { ChatList, Message } from '@/stores/modules/type'
import {
  NewChat,
  GetChat,
  DelChat,
  UpdateTitle,
  SendMessage,
  GetMapChatList,
  TabComplete
} from '@/api/user'
const LayoutStore = useLayoutStore()
// 所有对话数据（指定类型为Chat数组）
const {
  chat,
  currentChat,
  currentChatId,
  newChatId,
  chatlist,
  needget,
  isloading,
  isChatting
} = storeToRefs(LayoutStore)

//对对话记录进行时间排序(ascending 是否升序（true：最早在前，false：最新在前）)
const sortByUpdate = (
  conversations: ChatList[],
  ascending: boolean = false
): ChatList[] => {
  if (conversations) {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime()
      const dateB = new Date(b.updated_at).getTime()
      return ascending ? dateA - dateB : dateB - dateA
    })
  } else return []
}
const getconlist = async () => {
  try {
    const res = await GetMapChatList(LayoutStore.data.mapId)
    if ((res as any).Code === 200) {
      LayoutStore.chatlist = []
      LayoutStore.chatlist = sortByUpdate((res as any).Data.list, false)
    } else {
      const message = (res as any).Message
      ElMessage.error(`${message}`)
    }
  } catch (error) {
    console.log(error)
  }
}

if (LayoutStore.data.mapId) {
  getconlist()
}

const form = ref({
  name: ''
})
const formRef = ref()
//判断标题是否重复
const detect = (rule: any, value: any, callback: any) => {
  if (chatlist.value.every((item: ChatList) => item.title !== value)) callback()
  else callback('标题已使用')
}
const rules = ref({
  name: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { validator: detect, trigger: 'blur' }
  ]
})
const DelDialogVisible = ref(false)
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
}
// 控制当前显示视图：false=列表，true=聊天窗口

// 输入框内容
const inputContent = ref<string>('')

//编辑对话标题
const edittitle = (item: ChatList) => {
  currentChatId.value = item.conversation_id
  form.value.name = item.title
  newtitle.value = false
  dialogFormVisible.value = true
}
//+新对话
const open = (item: boolean) => {
  if (LayoutStore.data.mapId) {
    dialogFormVisible.value = true
    form.value.name = ''
    newtitle.value = item
  } else {
    ElMessage.error('请先上传文件生成导图')
  }
}
//取消修改标题
const cancel = () => {
  dialogFormVisible.value = false
  currentChatId.value = ''
  formRef.value.resetFields()
}
//取消删除会话
const canceldel = () => {
  DelDialogVisible.value = false
  currentChatId.value = ''
}
//确认
const confirm = async () => {
  await formRef.value.validate()
  if (currentChat.value.conversation_id) {
    try {
      const res = await UpdateTitle(
        currentChat.value.conversation_id,
        form.value.name
      )
      if ((res as any).Code === 200) {
        getconlist()
        currentChat.value.title = form.value.name
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
  currentChatId.value = id
  if (currentChatId.value === newChatId.value) {
    newChatId.value = ''
  }
  await nextTick()
  if (needget.value) {
    try {
      const res = await GetChat(currentChatId.value)
      if ((res as any).Code === 200) {
        chat.value.push({
          title: (res as any).Data.title as string,
          conversation_id: (res as any).Data.conversation_id as string,
          messages: (res as any).Data.messages as Message[]
        })
        currentChat.value.title = (res as any).Data.title
        currentChat.value.conversation_id = (res as any).Data.conversation_id
        currentChat.value.messages = (res as any).Data.messages
      } else {
        const message = (res as any).Message
        ElMessage.error(`${message}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      needget.value = false
    }
  }
  if (currentChat.value.conversation_id) {
    isChatting.value = true
    scrollToBottom()
  } else {
    ElMessage.error('系统错误，当前聊天不存在')
  }
}

// 返回列表
const backToList = (): void => {
  isChatting.value = false
  currentChatId.value = ''
  currentChat.value = {
    title: '',
    conversation_id: '',
    messages: []
  }
  getconlist()
}

// 发送消息
const sendMsg = async () => {
  if (!inputContent.value.trim()) return
  if (isloading.value) {
    ElMessage.warning('AI努力中,请等待思考完')
    return
  }
  const mapid = LayoutStore.data.mapId
  const temp = inputContent.value
  const id = currentChat.value.conversation_id
  // 添加用户消息
  currentChat.value.messages.push({
    content: inputContent.value,
    role: 'user'
  })
  // 清空输入框
  inputContent.value = ''
  scrollToBottom()
  try {
    isloading.value = true
    const res = await SendMessage(
      currentChat.value.conversation_id,
      temp,
      LayoutStore.data
    )
    if ((res as any).Code === 200) {
      if ((res as any).Data.new_map_json) {
        LayoutStore.aidata = JSON.parse((res as any).Data.new_map_json)
        LayoutStore.data = JSON.parse((res as any).Data.new_map_json)
      }
      if (currentChatId.value === id) {
        //判断当前是否在发送消息的那个会话，防止用户发完消息去到别的会话
        currentChat.value.messages.push({
          content: (res as any).Data.content,
          role: 'assistant'
        })
      } else {
        const index: number = chat.value.findIndex(
          item => item.conversation_id === id
        )
        chat.value[index]?.messages.push({
          content: (res as any).Data.content,
          role: 'assistant'
        })
      }
      if (
        (!isChatting.value || currentChatId.value !== id) &&
        mapid === LayoutStore.data.mapId
      ) {
        newChatId.value = id
        ElMessage.success('有新的消息')
      }
      scrollToBottom()
    } else if ((res as any).Code === 5001) {
      ElMessage.warning(`${(res as any).Message}`)
    } else {
      ElMessage.error('发送失败，AI有点宕机了')
    }
  } catch (error) {
    console.log(error)
  } finally {
    isloading.value = false
  }
}

// 创建新对话
const createNewChat = async () => {
  await formRef.value.validate()
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
    ElMessage.error('创建失败')
    console.log(error)
  }
}

// 删除对话
const openDel = (id: string) => {
  if (chatlist.value.length <= 1) {
    ElMessage.error('至少保留一个对话')
    return
  }
  currentChatId.value = id
  DelDialogVisible.value = true
}
const deleteChat = async (id: string) => {
  try {
    const res = await DelChat(id)
    if ((res as any).Code === 200) {
      //重新获取所有对话列表
      if (LayoutStore.data.mapId) {
        try {
          const res = await GetMapChatList(LayoutStore.data.mapId)
          if ((res as any).Code === 200) {
            LayoutStore.chatlist = sortByUpdate((res as any).Data.list, false)
            const index = chat.value.findIndex(
              item => item.conversation_id === id
            )
            if (index !== -1) {
              chat.value.splice(index, 1)
            }
          } else {
            const message = (res as any).Message
            ElMessage.error(`${message}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
      ElMessage.success('删除成功')
    } else {
      const message = (res as any).Message
      ElMessage.error(`${message}`)
    }
  } catch (error) {
    console.log(error)
  } finally {
    DelDialogVisible.value = false
  }
}
// tab键智能补全（节流，立即执行）
let completeTimer: number | null = null
const complete = (e: any) => {
  e.preventDefault()
  if (completeTimer) return
  completeTimer = setTimeout(async () => {
    try {
      const res = await TabComplete(
        currentChat.value.conversation_id,
        inputContent.value,
        LayoutStore.data
      )
      if ((res as any).Code === 200) {
        inputContent.value = (res as any).Data.completed_text
      } else {
        ElMessage.error('补全失败')
      }
    } catch (error) {
      console.log(error)
    } finally {
      completeTimer = null
    }
  }, 0)
}
watch(
  () => LayoutStore.data.mapId,
  async newId => {
    if (newId) {
      getconlist()
    }
  }
)
//监听进入会话就自动滚动到底部
watch(
  () => isChatting.value,
  async newId => {
    if (newId) {
      await nextTick()
      scrollToBottom()
    }
  }
)
onMounted(() => {
  if (currentChatId.value && currentChat.value.conversation_id) {
    if (newChatId.value) {
      newChatId.value = ''
    }
    isChatting.value = true
    scrollToBottom()
  }
})
onBeforeUnmount(() => {
  isChatting.value = false
})
</script>

<style lang="scss" scoped>
.talk {
  height: 90%;
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(31, 38, 135, 0.12);
  background-color: #ffffff;
  backdrop-filter: saturate(120%);
  .container {
    width: 100%;
    max-width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 20px;
    box-shadow: 0 6px 20px rgba(31, 38, 135, 0.08);
    background-color: #ffffff;
  }

  // 列表视图
  .list_container {
    height: 97%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
  }

  // 聊天窗口
  .dialog_container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  // 通用头部
  .header {
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px 20px 0 0;
    border-bottom: 1px solid #eef2f6;
    background: linear-gradient(180deg, #ffffff, #fafbff);
    .icon {
      cursor: pointer;
      transition:
        transform 0.12s ease,
        opacity 0.2s;
    }
    .icon:hover {
      transform: translateY(-1px);
      opacity: 0.9;
    }
  }

  .title {
    font-weight: 600;
    font-size: 18px;
    color: #1f2937;
    letter-spacing: 0.2px;
  }

  /* 列表项样式 */
  .chat_list {
    flex: 1;
    overflow-y: auto;
    padding: 6px 8px 8px;
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
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.12s ease;
    border-radius: 12px;
  }

  .chat_item:hover {
    background: #f7fafc;
    transform: translateY(-1px);
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
    color: #6b7280;
    cursor: pointer;
    opacity: 0.8;
    transition:
      opacity 0.2s,
      color 0.2s;
  }

  .actions button:hover {
    opacity: 1;
    color: #374151;
  }

  /* 消息区域样式 */
  .talk_area {
    flex: 1;
    padding: 18px;
    overflow-y: auto;
    background: #f6f8fb;
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
    max-width: 100%;
    scroll-padding-bottom: 80px;
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
    max-width: clamp(240px, 68%, 680px);
    padding: 12px 16px;
    border-radius: 14px;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    position: relative;
    overflow-wrap: anywhere;
    box-sizing: border-box;
    line-height: 1.6;
  }
  .msg :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
  .msg :deep(pre) {
    max-width: 100%;
    overflow-x: auto;
    background: #0f172a0d;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 12px;
  }
  .msg :deep(code) {
    word-break: break-word;
    white-space: pre-wrap;
  }
  .msg :deep(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
  }
  .load {
    display: flex;
    align-items: center;
    .load_icon {
      animation: loading 1.2s linear infinite;
    }
  }
  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .system_msg {
    background: #eef2f7;
    align-self: flex-start;
    color: #374151;
    border: 1px solid #e5e7eb;
  }
  .system_msg::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 16px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #eef2f7;
  }

  .user-msg {
    background: linear-gradient(135deg, #409eff, #66b1ff);
    color: #ffffff;
    align-self: flex-end;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
  .user-msg::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 16px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #66b1ff;
  }

  .input_area {
    display: flex;
    padding: 16px 18px;
    gap: 10px;
    align-items: center;
    border-top: 1px solid #eef2f6;
    background: #ffffff;
    border-radius: 0 0 24px 24px;
  }

  .input_area .input {
    flex: 1;
    border-radius: 14px;
    outline: none;
    font-size: 14px;
  }

  :deep(.el-textarea__inner) {
    border-radius: 14px;
    border-color: #e5e7eb;
    background: #fbfbfd;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 10px 12px;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }
  :deep(.el-textarea__inner:focus) {
    border-color: #90c2ff;
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
  }
  :deep(.el-input__count) {
    color: #6b7280;
    font-weight: 500;
  }

  :deep(.el-button--primary) {
    padding: 10px 18px;
    box-shadow: 0 6px 14px rgba(64, 158, 255, 0.18);
    transition: transform 0.1s ease;
  }
  :deep(.el-button--primary:hover) {
    transform: translateY(-1px);
  }
  :deep(.el-button.is-disabled) {
    box-shadow: none;
    opacity: 0.7;
  }

  .NewBtn {
    padding: 5px 10px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  :deep(.el-dialog) {
    border-radius: 16px;
    box-shadow: 0 14px 28px rgba(31, 38, 135, 0.12);
    /* 新增：限制对话框最大宽度，防止撑开父盒子 */
    max-width: 90vw;
  }
  :deep(.el-dialog__header) {
    font-weight: 600;
    border-bottom: 1px solid #eef2f7;
    margin-bottom: 12px;
  }
  :deep(.el-dialog__footer) {
    padding-top: 8px;
    border-top: 1px solid #eef2f7;
  }
}
</style>
