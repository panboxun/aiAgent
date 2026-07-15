<template>
  <div class="headerbar">
    <div class="headerLeftBar">
      <el-button type="primary" @click="handleAsideClose">
        <el-icon>
          <Crop />
        </el-icon>
      </el-button>
      <div class="headerbarTitle">
        {{ title }}
      </div>
    </div>

    <div class="headerRightBar">
      <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click = "handleOut">退出登录</el-dropdown-item>
           
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup name='Index'>
import { nextTick, onMounted, ref } from 'vue';
import emitter from "@/utils/mitt"
import { useRouter } from 'vue-router';
import { useAdmin } from "@/stores/useAdmin"
import { logout } from '@/api/user';
import { ElMessage } from 'element-plus';

const router  = useRouter()
const admin = useAdmin()
const title = ref("数据分析")


emitter.on("title", res => {
  title.value = res
})

const handleAsideClose = () => {
  admin.changeCollapse()
}

// 退出登录
const handleOut = async() =>{
  try{
    await logout()
    // 清除 token + 跳转到登录页
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    ElMessage.success("退出登录成功")
    router.push("/login");
    
  }catch(err){
    console.log(err)
  }
 
}
</script>

<style scoped>
.headerbar {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.headerLeftBar {
  display: flex;
  align-items: center;

}

.headerbarTitle {
  margin-left: 20px;
  font-size: 24px;
  font-weight: 800;
}
.el-dropdown-link{
  font-weight: 800;
}
.headerRightBar{
  display: flex;
  align-items: center;
}
</style>
