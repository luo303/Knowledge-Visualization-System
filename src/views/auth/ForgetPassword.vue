<template>
  <div class="register">
    <div class="content">
      <div class="content-left">
        <el-form
          style="width: 100%"
          size="large"
          :model="formdata"
          :rules="rules"
          ref="formRef"
          :hide-required-asterisk="true"
          label-position="right"
          label-width="auto"
        >
          <el-form-item prop="account" label="手机号/邮箱:">
            <el-input
              type="text"
              v-model="formdata.account"
              placeholder="请输入手机号或邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code" label="验证码:" class="parent">
            <el-input
              type="text"
              v-model="formdata.code"
              placeholder="请输入验证码"
            ></el-input>
            <el-button
              v-if="show"
              size="large"
              type="primary"
              text
              class="mix"
              @click="getcode"
              >获取验证码</el-button
            >
            <el-button
              v-else
              type="default"
              text
              class="mix"
              size="large"
              @click="getcode"
              disabled
              >{{ countdown }}s</el-button
            >
          </el-form-item>
          <el-form-item prop="new_password" label="新密码:">
            <el-input
              type="password"
              show-password
              v-model="formdata.new_password"
              placeholder="请输入新的密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirm_password" label="确认密码:">
            <el-input
              type="password"
              show-password
              v-model="formdata.confirm_password"
              placeholder="再次确认新密码"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="forget-button" @click="confirm"
              >确认</el-button
            >
          </el-form-item>
          <el-link type="primary" class="back" @click="back"
            >返回主页面</el-link
          >
        </el-form>
      </div>
      <div class="content-right">
        <div class="image"></div>
        <h1>知识可视化系统</h1>
        <ul>
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
import { useRouter } from 'vue-router'
import { Forgetpwd, Getcode } from '@/api/user'
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
const router = useRouter()
const formdata = ref({
  confirm_password: '',
  new_password: '',
  account: '',
  account_type: '',
  code: ''
})
const Code = computed(() => ({
  account: formdata.value.account,
  account_type: formdata.value.account_type
}))
const phoneReg = /^1[3-9]\d{9}$/
const emailReg =
  /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
const formRef = ref()
const rules = ref({
  confirm_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (value !== formdata.value.new_password) {
          cb('两次密码不一致')
        } else {
          cb()
        }
      },
      trigger: 'blur'
    }
  ],
  new_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '密码必须为6到10位', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入正确的电话号码或邮箱', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (phoneReg.test(value)) {
          formdata.value.account_type = 'phone'
          cb()
        } else if (emailReg.test(value)) {
          formdata.value.account_type = 'email'
          cb()
        } else {
          cb('请输入正确的电话号码或邮箱')
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
//获取验证码
const countdown = ref(60)
const show = ref(true)
let timer: any = null
const getcode = async () => {
  await formRef.value.validateField(['account'])
  clearInterval(timer)
  countdown.value = 60
  show.value = !show.value
  timer = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timer)
      show.value = !show.value
      countdown.value = 60 // 重置
    } else {
      countdown.value--
    }
  }, 1000)
  try {
    const res = await Getcode(Code.value)
    if ((res as any).code === 200) {
      ElMessage.success('验证码发送成功')
    } else {
      ElMessage.error((res as any).Message || '获取验证码失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('发送请求失败')
  }
}
//返回主页面
const back = () => {
  router.push('/login')
}
//确认按钮
const confirm = async () => {
  await formRef.value.validate()

  try {
    const res = await Forgetpwd(formdata.value)
    if ((res as any).code === 200) {
      ElMessage.success('重置成功')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      ElMessage.error((res as any).Message || '重置失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('发送请求失败')
  }
}
</script>

<style lang="scss" scoped>
.register {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: $before_login_background;
  .content {
    width: 916.8px;
    height: 479.95px;
    border-radius: 40px;
    background-color: white;
    padding: 0 20px;
    display: flex;
    gap: 15px;
    .content-left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .forget-button {
        width: 35%;
        margin-left: 21.5%;
      }
      .back {
        margin-left: 21.5%;
      }
      .parent {
        position: relative;
        .mix {
          position: absolute;
          right: 0;
          cursor: pointer;
        }
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
.el-button {
  width: 30%;
}
</style>
