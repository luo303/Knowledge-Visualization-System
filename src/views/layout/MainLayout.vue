<template>
  <div class="main">
    <div class="SystemTop"><SystemTop></SystemTop></div>
    <div class="SystemCenter">
      <div class="Nav"><NavBar></NavBar></div>
      <div class="SystemContent"><router-view></router-view></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SystemTop from '../SystemTop.vue'
import NavBar from '../NavBar.vue'
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100vh;
  background-image: $after_login_background;
  .SystemTop {
    width: 100%;
    height: 15%;
  }
  .SystemCenter {
    width: 100%;
    height: 85%;
    display: flex;
    padding: 0 2%;
    gap: 1vw;
    .SystemContent {
      flex: 1;
    }
  }
}
</style>
