<template>
  <!-- 首页 -->
  <div class="common-layout">
    <el-container>
   
      <asider  class="asider-container"/>
      <el-container >
        <el-header   style="border-bottom: 1px solid #f1f5f6;">
          <headers/>
        </el-header>
        <el-main style="background-color: #eaeeef;">
         <router-view class="content-container"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup  name='Index'>
import { nextTick, onMounted, ref } from 'vue';
import asider from './asider.vue';
import headers  from './header.vue'

const sleep = async (delay) =>{
    return new Promise((res) =>{
      setTimeout(() => {
        res()
      }, delay); 
    })
}

async function init(){
  console.log('init')
  await sleep(1000)
  console.log('init end')
}

onMounted(() =>{
  init()
})
</script>

<style scoped >
.common-layout{
    height: 100vh;
     overflow: hidden;
}
.content-container{
  padding:  20px;
  background-color: #fff;
  min-height: 95%;
 
}
:deep(.el-aside){
  max-width: 300px;
}

@media screen and (max-width: 702px) {
  .asider-container{
    display: none;
   }
}
</style>
