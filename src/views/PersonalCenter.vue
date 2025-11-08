<template>
  <div class="personal-center">
    <div class="personal-info-container">
      <!-- 基本信息 -->
      <div class="section">
        <h3 class="section-title">基本信息</h3>
        <div class="basic-info">
          <!-- 头像 -->
          <div class="avator-wrapper">
            <div class="avator">
              <img
                src="@/assets/images/personal.png"
                alt="personal"
                class="avator-img"
              />
            </div>
            <button class="edit-avator-btn">修改头像</button>
          </div>

          <!-- 用户名 -->
          <div class="username-wrapper">
            <span class="label">用户名:</span>
            <span class="username">piaodaqiang</span>
            <button class="edit-btn">
              <el-icon><Edit /></el-icon>修改用户名
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.personal-info-container {
  width: 100%;
  max-height: 800px;
  padding: 20px;
}

// 通用区域样式:
.section {
  font-size: 18px;
  font-weight: 600;
  color: #4e4e4e;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid black;
}

// 基本信息:
.basic-info {
  display: flex;
  align-items: center;
  gap: 50px;
  padding: 10px 0;

  .avator-wrapper {
    margin-left: 6%;
    display: flex;
    flex-direction: column;
    align-items: center; // 修改头像 "按钮" y 轴居中
    gap: 10px; // 头像与按钮之间的间距

    .avator {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #ddd;

      .avator-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .edit-avator-btn {
      font-size: 14px;
      background-color: transparent;
      border: none;
      cursor: pointer;

      &:hover {
        color: #409eff;
      }
    }
  }

  .username-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;

    .label {
      color: #666;
    }

    .username {
      color: #333;
      font-weight: 500;
    }

    .edit-btn {
      font-size: 14px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      align-items: center;
      display: flex;
      gap: 5px;

      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
