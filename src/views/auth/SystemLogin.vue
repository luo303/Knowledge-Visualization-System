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
            <el-button type="primary" @click="onSubmit">登录</el-button>
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
import type { FormRules, FormInstance } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// import request from '@/utils/request' // 引入请求工具
import { Login } from '@/api/user/index'
import type {
  LoginParams,
  LoginSuccessData,
  ApiResponse
} from '@/api/user/type'

// 表单数据类型
interface RuleForm {
  password: ''
  account: ''
}

// 表单响应式数据
const formdata = ref<RuleForm>({
  password: '',
  account: ''
})

const phoneReg = /^1[3-9]\d{9}$/
const emailReg =
  /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
const formRef = ref<FormInstance>()
const router = useRouter()

// 表单验证规则
const rules = ref<FormRules>({
  account: [
    { required: true, message: '请输入电话号码或邮箱地址', trigger: 'blur' },
    {
      validator: (
        rule: any,
        value: any,
        cb: (error?: string | Error) => void
      ) => {
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
    { min: 6, max: 10, message: '密码必须为6到10位', trigger: 'blur' }
  ]
})

const onSubmit = async () => {
  if (!formRef.value) return

  // 表单验证
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    ElMessage.error('请正确填写表单')
    return
  }

  try {
    // 自动判断账号类型（phone/email）
    const accountType = phoneReg.test(formdata.value.account)
      ? 'phone'
      : 'email'

    // 构造请求参数
    const params: LoginParams = {
      account: formdata.value.account,
      password: formdata.value.password,
      account_type: accountType
    }

    // 调用登录接口
    const response: ApiResponse<LoginSuccessData> = await Login(params)

    // 处理响应
    if (response.Code === 200) {
      ElMessage.success('登录成功！')
      // 存储token和用户信息
      localStorage.setItem('token', response.Data.token)
      localStorage.setItem('userInfo', JSON.stringify(response.Data))
      // 跳转首页
      router.push('/layout')
    } else {
      ElMessage.error(response.Message || '登录失败，请重试')
    }
  } catch (error) {
    console.error('登录请求失败：', error)
    ElMessage.error('网络异常，请检查网络后重试')
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
