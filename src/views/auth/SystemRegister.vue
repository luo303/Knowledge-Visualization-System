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
          <el-form-item prop="username" label="用户名:">
            <el-input
              type="text"
              v-model="formdata.username"
              placeholder="请设置用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号/邮箱:">
            <el-input
              type="text"
              v-model="formdata.phone"
              placeholder="可用于登录或找回密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密 码:">
            <el-input
              type="password"
              show-password
              v-model="formdata.password"
              placeholder="请设置登录密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="test" label="验证码:" class="parent">
            <el-input
              type="text"
              v-model="formdata.test"
              placeholder="请输入验证码"
            ></el-input>
            <el-button
              v-if="show"
              size="large"
              type="primary"
              text
              class="mix"
              @click="gettest"
              >获取验证码</el-button
            >
            <el-button
              v-else
              type="default"
              text
              class="mix"
              size="large"
              @click="gettest"
              disabled
              >{{ countdown }}s</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="register-button" @click="register"
              >注册</el-button
            >
          </el-form-item>
          <el-link type="primary" class="back" @click="back"
            >返回主页面</el-link
          >
        </el-form>
      </div>
      <div class="content-right">dfdf</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const formdata = ref({
  username: '',
  password: '',
  phone: '',
  email: '',
  test: ''
})
const phoneReg = /^1[3-9]\d{9}$/
const emailReg =
  /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
const formRef = ref()
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名必须为3到10个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '密码必须为6到10位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入正确的电话号码或邮箱', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (phoneReg.test(value) || emailReg.test(value)) {
          cb()
        } else {
          cb('请输入正确的电话号码或邮箱')
        }
      },
      trigger: 'blur'
    }
  ],
  test: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (phoneReg.test(value) || emailReg.test(value)) {
          cb()
        } else {
          cb('请输入正确的电话号码或邮箱')
        }
      },
      trigger: 'blur'
    }
  ]
})
//获取验证码
const countdown = ref(60)
const show = ref(true)
let timer: any = null
const gettest = () => {
  console.log(11)

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
}
//返回主页面
const back = () => {
  router.push('/login')
}
//注册
const register = () => {}
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
    width: 60%;
    height: 65vh;
    border-radius: 40px;
    background-color: aliceblue;
    padding: 20px;
    display: flex;
    gap: 5px;
    .content-left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .register-button {
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
    }
  }
}
.el-button {
  width: 30%;
}
</style>
