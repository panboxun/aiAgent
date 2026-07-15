<template>
   
  <el-aside :width="isCollapse? '64px' : '264px'">
     <el-menu
        :collapse-transition="false"
        default-active="dashboard"
        class="asiderbar"
        @select="handleOpen"
        :collapse="isCollapse"
      >
      <div class="topbar" v-show = "!isCollapse">
        心理健康AI助手
      </div>
      <el-menu-item v-for="(item ,index) in routeOptions "  :index="item.path">
          <el-icon><component :is="item.meta.icon"/></el-icon>
          
          <span>{{ item.meta.title }}</span>
      </el-menu-item>

      </el-menu>
  </el-aside>
</template>

<script setup  name='Index'>
import { computed, nextTick, onMounted, ref } from 'vue';
import emitter from "@/utils/mitt"
import { useRouter } from "vue-router"
import { useAdmin } from "@/stores/useAdmin"
const router = useRouter()

const routeOptions = router.options.routes.find(item => item.path == "/index").children
const isCollapse  = computed(() =>
   useAdmin().isCollapse
)

// 路由跳转
const handleOpen  =(e) =>{
  
  router.push(`/index/${e}`)
  const selectedItem = routeOptions.find(item => item.path === e)
  const title = selectedItem ? selectedItem.meta.title : e
  emitter.emit("title" , title)
}

</script>

<style scoped >
.asiderbar{
  height: 100vh;
  border: 1px solid #f1f5f6;
}

.topbar{
  height: 60px;
  box-sizing: border-box;
  border: 1px solid #f1f5f6;
  line-height: 60px;
  text-align: center;
  font-weight: bolder;
}



</style>
