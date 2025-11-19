<template>
  <div class="createmind-container">
    <div class="createmind-title">请选择想要生成的导图</div>
    <div class="generatemap-container">
      <div class="singlemindmap-container">
        <div class="map-picture"></div>
        <div class="map-info">
          <h3 class="map-name">第一个导图</h3>
          <div class="map-meta">
            <span class="map-type">树形图</span>
            <span class="map-time">2025-05-15</span>
          </div>
        </div>
      </div>
      <div class="singlemindmap-container">
        <div class="map-picture"></div>
        <div class="map-info">
          <h3 class="map-name">第二个导图</h3>
          <div class="map-meta">
            <span class="map-type">鱼骨图</span>
            <span class="map-time">2025-07-12</span>
          </div>
        </div>
      </div>
      <div class="singlemindmap-container">
        <div class="map-picture"></div>
        <div class="map-info">
          <h3 class="map-name">第三个导图</h3>
          <div class="map-meta">
            <span class="map-type">时间轴</span>
            <span class="map-time">2025-09-28</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.createmind-container {
  width: 95%;
  height: 90%;
  display: flex;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  flex-direction: column;

  .createmind-title {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .generatemap-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    gap: 10px;
    width: 100%;
    height: 90%;

    .singlemindmap-container {
      height: 100%;
      width: 100%;
      flex-direction: column;
      background-color: white;
      border-radius: 20px;
      border: 1px solid #ebebeb;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      box-shadow: 7px 14px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;
      &:hover {
        transform: translateY(-7px);
        background-color: #eaf2fb;
        box-shadow: 10px 17px 12px rgba(0, 0, 0, 0.15);
      }

      .map-picture {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80%;
        width: 95%;
        border-radius: 20px;
        background-color: #f8f8f9;
      }

      .map-info {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 110px;

        .map-name {
          font-size: 16px;
          font-weight: bold;
          display: flex;
        }

        .map-meta {
          display: flex;
          gap: 15px;
          justify-content: space-between;
          color: #585757;
        }
      }
    }
  }
}
</style>
