<template>
  <div>
    <div class="SystemTop">
      <SystemTop></SystemTop>
    </div>
    <div class="SystemCenter">
      <NavBar></NavBar>
      <div class="Systemcontent">
        <router-view></router-view>
      </div>
    </div>
    <div class="SystemBottom">
      <SystemBottom></SystemBottom>
    </div>
  </div>
</template>

<script setup>
import SystemTop from '../SystemTop.vue'
import SystemBottom from '../SystemBottom.vue'
import NavBar from '../NavBar.vue'
</script>

<style scoped></style>
