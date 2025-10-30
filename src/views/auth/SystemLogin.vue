<template>
  <div class="login">
    <div class="content">
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
            <el-icon><Message /></el-icon>
          </el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item name="password" class="input">
          <el-input v-model="formdata.password" placeholder="请输入密码">
            <el-icon><Lock /></el-icon>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
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
  display: flex;
  justify-content: center;
  align-items: center;
}

// 登录卡片
.el-form {
  width: 600px;
  height: 300px;
  background-color: #fff;
  padding: 30px;
  border-radius: 30px;
  border: bold 1px #0b0808;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

// 登录按钮
.el-button {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(69, 114, 212);
}
</style>
