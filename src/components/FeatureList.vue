// src/components/FeatureList.vue

<template>
  <ul class="feature-list">
    <li v-for="(feature, index) in features" :key="index">
      <svg
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
      >
        <path
          d="M480 480m-160 0a2.5 2.5 0 1 0 320 0 2.5 2.5 0 1 0-320 0Z"
          fill="#1296db"
        ></path>
      </svg>
      {{ feature }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

const props = withDefaults(
  defineProps<{
    features?: string[]
  }>(),
  {
    // 内置默认功能列表
    features: () => [
      '支持上传多种文件格式',
      'AI问答及自动逻辑优化',
      '一键保存及导出',
      '通过对话修改导图内容及结构'
    ]
  }
)

const { features } = props
</script>

<style scoped>
.feature-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
}

.icon {
  flex-shrink: 0;
}
</style>
