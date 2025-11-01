<template>
  <div class="content">
    <div class="Handedit">手动编辑区</div>
    <div class="AiTalk">
      <AiTalk></AiTalk>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AiTalk from './AiTalk.vue'
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  display: flex;
  .Handedit {
    flex: 1;
  }
  .AiTalk {
    width: 220px;
  }
}
</style>
