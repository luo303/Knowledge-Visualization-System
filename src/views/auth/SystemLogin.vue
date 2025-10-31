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
            <el-input v-model="formdata.email" placeholder="请输入电话/邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input v-model="formdata.password" placeholder="请输入密码">
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
        <h1>知识可视化系统</h1>
        <ul class="feature-list">
          <li>支持上传多种文件格式</li>
          <li>AI问答及自动逻辑优化</li>
          <li>一键保存及导出</li>
          <li>通过对话修改导图内容及结构</li>
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

// 表单数据类型
interface RuleForm {
  password: ''
  phone: ''
  email: ''
  test: ''
}

// 表单响应式数据
const formdata = ref<RuleForm>({
  password: '',
  phone: '',
  email: '',
  test: ''
})

const phoneReg = /^1[3-9]\d{9}$/
const emailReg =
  /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
const formRef = ref<FormInstance>()
const router = useRouter()

// 表单验证规则
const rules = ref<FormRules>({
  email: [
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

// 登录事件处理
const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(valid => {
    if (valid) {
      ElMessage.success('登录成功')
      router.push('/layout') // 登录成功后跳转到首页
    } else {
      ElMessage.error('请正确填写表单')
    }
  })
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
    width: 800px;
    height: 400px;
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
      padding: 40px;
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h1 {
        font-size: 40px;
        margin: 0 0 24px;
        color: black;
        font-weight: 600;
        letter-spacing: 3px;
        background-image: url('@/assets/TitleBcakground.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        padding: 5px;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      /* 列表样式 */
      .feature-list {
        list-style: none;
        padding: 0;
        margin: 0;
        color: #645e5ef6;

        li {
          font-size: 16px;
          margin-bottom: 16px;
          padding-left: 24px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #3b4680;
          }
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
