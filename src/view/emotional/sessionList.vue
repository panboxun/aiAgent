<template>
  <div class="emoPark">
    <div class="emoParkHeader">
      会话历史
    </div>
    <div class="sessionListContent">
      <div 
        v-for="session in sessionList" 
        :key="session.sessionId" 
        class="sessionItem"
        @click="handleClick(session)"
      >
        <div class="sessionIcon">
          <el-icon size="24" color="#b6801b"><ChatDotRound /></el-icon>
        
        </div>
        <div class="sessionContent">
          <div class="sessionHeader">
            <span class="sessionTitle">{{ session.sessionTitle || '心理AI助手会话' }}</span>
            <span class="sessionAction" @click.stop="handleDeleteClick(session)">
              <el-icon color="#ef4444"><Delete /></el-icon>
            </span>
          </div>
          <div class="sessionPreview">
            {{ session.lastMessageContent  }}
          </div>
          <div class="sessionTime">
            {{ formatTime(session.updateTime) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup  name='Index'>
import { nextTick, onMounted, ref, onUnmounted } from 'vue';
import { getSessionList, deleteSession,getSessionMessages } from '@/api/ai';
import emitter from '@/utils/mitt';
import { Delete, ChatDotRound } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { inject } from 'vue'
const $loading = inject('loading')


const sessionList = ref([])

// 格式化时间
const formatTime = (time) => {
  if (!time) return '刚刚';
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  
  // 如果小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
  }
  // 如果小于24小时
  else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  // 否则返回日期
  else {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}

// 获取会话列表
const getSessionPage = async() =>{
   
    let res  = await getSessionList({
       pageNum: 1,
       pageSize: 10,
    })
    if(res.code == 200){
        sessionList.value = res.data.records
    }
   
}

// 监听更新会话列表事件
const handleUpdateSessionList = (newList) => {
    sessionList.value = newList
}
// 点击会话
const handleClick = async(session) => {
  
  // 获取会话消息
  let res = await getSessionMessages(session.id)
  if(res.code == 200){
      
    //更新当前会话对象数据
    const sessionData ={
      sessionId: 'session_' + session.id,
      status: "ACTIVE",
      sessionTitle: session.sessionTitle , 
    }
    
    // 触发点击事件，将会话传递给父组件
    emitter.emit('getSessionMessages', res.data)
    // 触发点击事件，将会话传递给父组件
    emitter.emit('updateSession', sessionData)


    
  }
  
}
onMounted(() => {
    getSessionPage()
    // 注册事件监听
    emitter.on('updateSessionList', handleUpdateSessionList)
})

onUnmounted(() => {
    // 清理事件监听
    emitter.off('updateSessionList', handleUpdateSessionList)
})

// 删除会话
const handleDeleteClick = (session) => {
  // 确认删除
  console.log(session);
  
  ElMessageBox.confirm('确定删除该会话吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 调用删除接口
    deleteSession(session.id).then(() => {
      // 删除成功后，刷新会话列表
      getSessionPage();
    });
  })
}
</script>

<style scoped >
.emoPark {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #faf9f7 0%, #ffffff 100%);
}

.emoParkHeader {
  flex-shrink: 0;
  padding: 22px 20px 18px;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 1px solid #f0e8db;
  background: linear-gradient(135deg, #fffaf0 0%, #ffffff 100%);
  position: relative;
}

.emoParkHeader::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, #b6801b 0%, #e8c88a 50%, #b6801b 100%);
  border-radius: 2px;
  opacity: 0.3;
}

.sessionListContent {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fcfcfa;
}

/* 自定义滚动条 */
.sessionListContent::-webkit-scrollbar {
  width: 6px;
}

.sessionListContent::-webkit-scrollbar-track {
  background: transparent;
}

.sessionListContent::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #e8c88a, #b6801b);
  border-radius: 3px;
}

.sessionListContent::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #b6801b, #8a6014);
}

.sessionItem {
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #faf8f3 100%);
  border: 1px solid #f0e8db;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.sessionItem::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #b6801b, #e8c88a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  opacity: 0;
}

.sessionItem:hover {
  background: linear-gradient(135deg, #fffaf0 0%, #faf6eb 100%);
  border-color: #e8c88a;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(182, 128, 27, 0.12), 0 2px 6px rgba(182, 128, 27, 0.06);
}

.sessionItem:hover::before {
  transform: scaleX(1);
  opacity: 1;
}

.sessionIcon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fff7e6 0%, #ffecc8 100%);
  border-radius: 14px;
  margin-top: 2px;
  box-shadow: 0 2px 8px rgba(182, 128, 27, 0.08);
}

.sessionContent {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.sessionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sessionTitle {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.sessionAction {
  color: #b0b0b0;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.25s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sessionAction:hover {
  background-color: #fef2f2;
  transform: scale(1.1);
  cursor: pointer;
}

.sessionPreview {
  font-size: 13.5px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  text-align: left;
}

.sessionTime {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sessionTime::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
</style>
