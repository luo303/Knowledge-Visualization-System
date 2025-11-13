<template>
  <div class="login">
    <div class="content">
      <div class="content-left">
        <el-form
          :model="formdata"
          label-width="auto"
          style="max-width: 600px"
          size="large"
          :rules="rules"
          ref="formRef"
        >
          <!-- 邮箱输入框 -->
          <el-form-item prop="email">
            <el-input v-model="formdata.account" placeholder="请输入电话/邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              v-model="formdata.password"
              placeholder="请输入密码"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="isLoading"
              >登录</el-button
            >
          </el-form-item>
          <el-link type="primary" class="register" @click="register"
            >一键注册新账号</el-link
          >
          <el-link type="primary" class="reset-password" @click="resetPassword"
            >忘记密码？</el-link
          >

          <div class="third-party-login">
            <!-- 标题与分割线 -->
            <div class="login-title">
              <div class="line"></div>
              <span class="text">使用第三方登录</span>
              <div class="line"></div>
            </div>

            <!-- 第三方图标区域 -->
            <div class="icons-container">
              <!-- 微信登录图标 -->
              <div class="icon-item">
                <!-- @click="handleLogin('wechat')" -->
                <img src="@/assets/wechat.png" class="icon" alt="微信登录" />
              </div>

              <!-- github登录图标 -->
              <div class="icon-item">
                <!-- @click="handleLogin('github')" -->
                <img
                  src="@/assets/github-fill.png"
                  class="icon"
                  alt="微信登录"
                />
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="content-right">
        <div class="image"></div>
        <h1>知识可视化系统</h1>
        <ul class="feature-list">
          <li>
            <svg
              t="1761804560082"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6367"
              width="30"
              height="30"
            >
              <path
                d="M480 480m-160 0a2.5 2.5 0 1 0 320 0 2.5 2.5 0 1 0-320 0Z"
                p-id="6368"
                fill="#1296db"
              ></path></svg
            >支持上传多种文件格式
          </li>
          <li>
            <svg
              t="1761804560082"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6367"
              width="30"
              height="30"
            >
              <path
                d="M480 480m-160 0a2.5 2.5 0 1 0 320 0 2.5 2.5 0 1 0-320 0Z"
                p-id="6368"
                fill="#1296db"
              ></path></svg
            >AI问答及自动逻辑优化
          </li>
          <li>
            <svg
              t="1761804560082"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6367"
              width="30"
              height="30"
            >
              <path
                d="M480 480m-160 0a2.5 2.5 0 1 0 320 0 2.5 2.5 0 1 0-320 0Z"
                p-id="6368"
                fill="#1296db"
              ></path></svg
            >一键保存及导出
          </li>
          <li>
            <svg
              t="1761804560082"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6367"
              width="30"
              height="30"
            >
              <path
                d="M480 480m-160 0a2.5 2.5 0 1 0 320 0 2.5 2.5 0 1 0-320 0Z"
                p-id="6368"
                fill="#1296db"
              ></path></svg
            >通过对话修改导图内容及结构
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { Login } from '@/api/user/index'
import { useUserStore } from '@/stores/modules/user' // 导入用户仓库

// 表单响应式数据
const formdata = ref({
  account: '',
  password: '',
  account_type: ''
})
const phoneReg = /^1[3-9]\d{9}$/
const emailReg =
  /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
const formRef = ref()
const router = useRouter()
const isLoading = ref(false) // 防止重复提交
const pwdReg =
  /^(?![a-zA-Z]+$)(?![a-z0-9]+$)(?![A-Z0-9]+$)(?![a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$)(?![a-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$)(?![A-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$).{8,16}$/

// 表单验证规则
const rules = ref({
  account: [
    { required: true, message: '请输入电话号码或邮箱地址', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        // 检查是否是有效的电话号码或邮箱
        const isValidPhone = phoneReg.test(value)
        const isValidEmail = emailReg.test(value)
        if (isValidPhone || isValidEmail) {
          cb()
        } else {
          cb(new Error('请输入正确的电话号码或邮箱地址'))
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (pwdReg.test(value)) {
          cb()
        } else {
          cb('长度需为8-16位,含大小写字母、数字、特殊字符中的至少3种')
        }
      },
      trigger: 'blur'
    }
  ]
})

// 登录请求：
const onSubmit = async () => {
  isLoading.value = true
  try {
    await formRef.value.validate()
    const res = await Login(formdata.value)
    if ((res as any).code === 200 && (res as any).Data.success) {
      ElMessage.success('登录成功, 正在跳转...')
      // 存储用户信息到仓库：
      const userStore = useUserStore()
      userStore.setUserInfo((res as any).Data)
      setTimeout(() => {
        router.push('/layout')
      }, 1000)
    } else {
      ElMessage.error((res as any).Message || '登录失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('发送登录请求失败')
  } finally {
    isLoading.value = false
  }
}

// 注册跳转
const register = () => {
  router.push('/register')
}

// 忘记密码跳转
const resetPassword = () => {
  router.push('/forgetpwd')
}
</script>

<style lang="scss" scoped>
// 登录页面
.login {
  background-image: $before_login_background;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    width: 916.8px;
    height: 479.95px;
    border-radius: 40px;
    background-color: white;
    padding: 20px;
    display: flex;
    gap: 5px;

    .content-left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 50px;

      .register {
        float: left;
        margin-left: 1%;
      }
      .reset-password {
        float: right;
        margin-right: 1%;
      }
    }

    .content-right {
      flex: 1;
      position: relative;
      .image {
        height: 70%;
        width: 90%;
        background-image: url('@/assets/images/logo.png');
        background-size: cover;
        background-position: center;
        border: none;
      }
      h1 {
        position: absolute;
        display: inline-block;
        top: 30%;
        width: 90%;
        font-family: 'Microsoft YaHei';
        text-align: center;
        white-space: nowrap;
        font-weight: 600;
        letter-spacing: 1vw;
        color: #333;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        font-size: 1.7vw;
      }
      ul {
        position: absolute;
        display: flex;
        top: 50%;
        left: 10%;
        height: 30%;
        color: gray;
        flex-direction: column;
        justify-content: space-between;
        li {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
// 登录按钮
.el-button {
  width: 100%;
}

.third-party-login {
  width: 100%;
  padding: 20px 0;
}

/* 标题与分割线样式 */
.login-title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.line {
  width: 80px;
  height: 1px;
  background-color: #e5e5e5; /* 分割线颜色 */
  margin-top: 30px;
}

.text {
  margin: 0 16px;
  font-size: 14px;
  color: #999; /* 文字颜色 */
  margin-top: 30px;
}

/* 图标容器 */
.icons-container {
  display: flex;
  justify-content: center;
  gap: 40px; /* 图标间距 */
  margin-top: 20px;
}

/* 图标样式 */
.icon-item {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5; /* 图标背景色 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.icon-item:hover {
  background-color: #ebebeb; /*  hover 背景色 */
}

.icon {
  width: 35px;
  height: 35px;
}
</style>
