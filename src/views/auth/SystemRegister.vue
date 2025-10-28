<template>
  <div class="register">
    <div class="content">
      <div class="content-left">fdfd</div>
      <div class="content-right">dfdf</div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.register {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: $before_login_background;
  .content {
    width: 70%;
    height: 65vh;
    border-radius: 40px;
    background-color: aliceblue;
    padding: 20px;
    display: flex;
    gap: 5px;
    .content-left {
      flex: 1;
    }
    .content-right {
      flex: 1;
    }
  }
}
</style>
