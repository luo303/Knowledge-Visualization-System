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
        >
          <!-- 邮箱输入框 -->
          <el-form-item name="email" class="input">
            <el-input v-model="formdata.email" placeholder="请输入电话/邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item name="password" class="input">
            <el-input v-model="formdata.password" placeholder="请输入密码">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
          <el-link type="primary" class="register">一键注册新账号</el-link>
          <!-- @click="register" -->
          <el-link type="primary" class="reset-password">忘记密码？</el-link>
          <!-- @click="resetPassword" -->

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
                <!-- @click="handleLogin('qq')" -->
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

import { Message, Lock } from '@element-plus/icons-vue'

// 表单响应式数据
const formdata = ref({
  password: '',
  phone: '',
  email: '',
  test: ''
})

// 登录事件处理
const onSubmit = () => {
  ElMessage.success('登录成功')
}
// 表单验证规则
const rules = ref()
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
