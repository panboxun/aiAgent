<template>
  <div class="container">
    <!-- 情绪日志 -->
     <div class="leftBar">
      <div class="emoBox">
        <AiAgent />
      </div>
      <div class="emoBox"></div>
      <div class="emoBox">
        <SessionList />
      </div>
     </div>
     <div class="rightBar">
        <AiTalk />
     </div>
    
  </div>
</template>

<script setup  name='Index' lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import AiAgent from './aiAgent.vue';
import AiTalk from './aiTalk.vue';
import SessionList from './sessionList.vue';
// 写一个方法，用于判断jwt是否过期
function isJwtExpired(jwt: string) {
  const parts = jwt.split('.');
  const payload = JSON.parse(atob(parts[1]));
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}
</script>

<style scoped >
.container{
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
}
.leftBar{
  flex: 0 0 350px;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  gap: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 0 20px;
  box-sizing: border-box;
  /* overflow: hidden; */
}
.rightBar{
  flex: 1;
  min-width: 0;
  max-height: 86vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  border-radius: 15px;
  background-color: #ffffff;
  overflow: hidden;
}
.emoBox{
  flex: 1;
  width: 100%;
  min-height: 0;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
/* .emoBox:hover{
  background-color: #e5e5e5;
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
} */
</style>
