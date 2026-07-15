<template>
  <div class="aiAgent">
        <div class="iconAi">
            <el-icon size="32">
               <Service />
            </el-icon>
        </div>
        <div class="nameAi">Ai助手</div>
        <div class="statusAi">
            <div class="statusIcon"></div>
            在线服务中
        </div>
  </div>
</template>

<script setup  name='Index' lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { Service } from '@element-plus/icons-vue';
let status = ref("green");
</script>

<style scoped >
    .aiAgent{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 20px;
      box-sizing: border-box;
    }
    .iconAi{
        width: 80px;
        height: 80px;
        background-color: #b6801b;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #333;
    }
    .nameAi{
        font-size: 18px;
        color: #b6801b;
    }
    .statusIcon{
        width: 12px;
        height: 12px;
        background-color: v-bind(status);
        border-radius: 50%;
    }
    .statusAi{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 14px;
        color: v-bind(status);
    }
</style>
