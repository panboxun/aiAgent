<template>
    <div class="aiTalk">
        <!-- 头部 -->
        <div class="aiTalkHeader">
            <div class="aiTalkHeaderLeft">Ai助手</div>
            <div class="aiTalkHeaderRight" @click="createNewSession">
                <el-icon size="16">
                    <Plus />
                </el-icon>
            </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="aiTalkBody">
            <div class="chat-message">
                <!-- 欢迎用语 -->
                <div class="message-item ai-message" v-if="messages.length === 0">
                    <div class="message-avatar">
                        <el-icon size="16">
                            <Service />
                        </el-icon>
                    </div>
                    <div class="message-content-container">
                        <div class="message-content">
                            您好，我是Ai助手，有什么我可以帮助您的吗？？
                        </div>
                        <span class="message-time"> 刚刚</span>
                    </div>
                </div>
                <!-- 普通消息 -->
                <div v-for="msg in messages" :key="msg.id" class="message-item" :class="msg.senderType == '1' ? 'user-message' : 'ai-message'">
                    <div :class=" msg.senderType == '1' ? 'message-user' : 'message-avatar'">
                        <el-icon size="16">
                            <component :is="msg.senderType == '1'? UserFilled : Service" />
                        </el-icon>
                    </div>
                    <div class="message-content-container">
                        <div class="message-content">
                           
                            <div v-if="msg.senderType == '2' && isAiTying && !msg.content" class="typing-indicator">
                                <el-icon size="16">
                                    <Loading />
                                </el-icon>
                            </div>

                            <div v-else style="min-width: 199px;" >
                                 {{ msg.content }}
                            </div>
                        </div>
                        <span class="message-time"> {{ msg.senderType == '2' && isAiTying && !msg.content ? '正在思考中...' : formatTime(msg.createdAt) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="aiTalkFooter">
            <el-input
                v-model="inputValue"
                maxlength="500"
                type="textarea"
                :rows="3"
                style="width: 100%; "
                placeholder="请输入您想要分享的内容..."
                show-word-limit
                :disabled="isAiTying"
                @keydown="handleKeyDown"
            />
            <el-button type="primary" @click="handleSendMessage">发送</el-button>
        </div>
    </div>
</template>

<script setup name='Index'>
import { nextTick, onMounted, ref, reactive } from 'vue';
import { Plus, Service,UserFilled,Loading } from '@element-plus/icons-vue';
import { startChat,getSessionList } from '@/api/ai';
import { ElMessage } from 'element-plus';
import emitter from '@/utils/mitt';
import { fetchEventSource } from '@microsoft/fetch-event-source'
// 定义对话消息
const messages = ref([])
const inputValue = ref('')
const isAiTying = ref(false)
let currentController = null // 保存当前的 AbortController


onMounted(() => {
    createNewSession()
    emitter.on('getSessionMessages', handleGetSessionMessages)
    emitter.on('updateSession', handleUpdateSession)
})
// 获取会话消息
const handleGetSessionMessages = (data) => {
    messages.value = data
}

// 更新当前会话对象
const handleUpdateSession = (data) => {
    currentSession.value = data
}
// 发送消息
const handleSendMessage = async() => {
    if(isAiTying.value ){
        ElMessage.warning('请稍后再发送')
        return
    }
    if (!inputValue.value.trim()) {
        return
    }
    const message = inputValue.value
    inputValue.value = ''
    messages.value.push({
        id: Date.now(),
        senderType: '1',
        content: message,
        createdAt: new Date().toISOString(),
       
    })
    if(currentSession.value?.status == "TEMP"){
        startNewSession(message)
    }else{
        
        // 继续会话
        startAiStreaming(currentSession.value?.sessionId , message)
    }
    
}
const startNewSession = async(message ) =>{
    let params = {
        initialMessage: message,
    }
    if(currentSession.value?.sessionTitle == "新会话"){
        params.sessionTitle = `Ai助手 - ${new Date().toLocaleString()}`
    }else{
        params.sessionTitle = currentSession.value?.sessionTitle
    }

    let res  = await startChat(params)
    if(res.code == 200){
        isAiTying.value = false
        const newSessionData = {
            sessionId: res.data.sessionId,
            status:"ACTIVE",
            sessionTitle: params.sessionTitle,
        }
        //如果是临时会话，更新数据
        if(currentSession.value && currentSession.value.status == "TEMP"){
            //更新会话数据
            Object.assign(currentSession.value, newSessionData)
        }else{
            //创建新会话
            currentSession.value = newSessionData
        }
        //更新会话列表
        getSessionPage(currentSession.value?.sessionId)
        // 开始流式对话
        startAiStreaming(newSessionData.sessionId , message)
    }
}
// 开始流式对话
const startAiStreaming = async(sessionId,message) =>{
    if(isAiTying.value){
        ElMessage.warning('AI正在思考中,请稍后再发送')
        return
    }

    // 如果有之前的请求，先中断
    if(currentController){
        currentController.abort()
    }

    isAiTying.value = true
    const aiMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        senderType: '2',
        content: '',
        createdAt: new Date().toISOString(),
    
    }
    messages.value.push(aiMessage)
    // 调用流式接口
    currentController = new AbortController() //中断fetch请求
    fetchEventSource("/api/psychological-chat/stream" , {
        method: 'POST',
        body: JSON.stringify({
            sessionId: sessionId,
            userMessage: message,
        }),
        headers: {
            'Content-Type': 'application/json',
            "Token": localStorage.getItem("token"),
            "Accept": "text/event-stream",
        },
        signal: currentController.signal, //中断fetch请求
        onopen: (res) => {
            if(res.headers.get('Content-Type') !== 'text/event-stream'){
                ElMessage.error('AI返回错误')
            }
        },
        onmessage: (event) => {
            if (!event.data)  return
            const raw =  event.data.trim()
            const eventName = event.event
            // 当前会话的ai消息
            const aiMessage =  messages.value[messages.value.length - 1]
         
            
            if(eventName == "done"){
                isAiTying.value = false // 重置思考状态
                if(currentController){
                    currentController.abort() // 中断fetch请求 
                    currentController = null
                }
                return
            }
           const payload= JSON.parse(raw)
           const ok =  payload.code == "200"
           if(ok && payload.data && payload.data.content){
                aiMessage.content += payload.data.content
           }else if(!ok){
                // 处理错误情况
               handleError(payload.message || 'AI返回错误') 
           }
        },
        onerror: (error) => {
            currentController = null
            handleError(error || 'AI返回错误') 
        },
        onclose: () => {
            isAiTying.value = false
            currentController = null
        },
    })
}

const handleError = (err) => {
    const aiMessage =  messages.value[messages.value.length - 1]
    if(aiMessage){
        aiMessage.content = "Ai回复失败,请重试"
    }
    isAiTying.value = false // 重置思考状态
    currentController = null // 清理 controller
    ElMessage.error(err)
}

// 格式化时间
const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// 新建会话
const createNewSession = async() => {
    const newSession = {
        sessionId: `temp_${Date.now()}` ,
        status:"TEMP",
        sessionTitle:"新会话"
    }
    currentSession.value = newSession
}

//定义当前会话对象 
const currentSession = ref(null)



const getSessionPage = async() =>{
    let res  = await getSessionList({
       pageNum: 1,
       pageSize: 10,
    })
    if(res.code == 200){
        // 使用事件总线通知会话列表组件更新
        emitter.emit('updateSessionList', res.data.records)
    }
}
// 键盘事件处理
const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
    }
}
</script>

<style scoped>
.aiTalk {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f7f7f7;
}

.aiTalkHeader {
    flex-shrink: 0;
    background: linear-gradient(135deg, #b6801b 0%, #d4952b 100%);
    height: 70px;
    padding: 15px 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(182, 128, 27, 0.15);
}

.aiTalkHeaderLeft {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
}

.aiTalkHeaderRight {
    width: 36px;
    height: 36px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.aiTalkHeaderRight:hover {
    transform: scale(1.1) rotate(90deg);
    background-color: #fffaf0;
}

.aiTalkBody {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding: 20px 25px;
    box-sizing: border-box;
    min-height: 0;
    background: linear-gradient(180deg, #faf9f7 0%, #f5f5f5 100%);
}

/* 自定义滚动条 */
.aiTalkBody::-webkit-scrollbar {
    width: 6px;
}

.aiTalkBody::-webkit-scrollbar-track {
    background: transparent;
}

.aiTalkBody::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #e8c88a, #b6801b);
    border-radius: 3px;
}

.chat-message {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.message-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 12px;
    animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.user-message {
    flex-direction: row-reverse;
}

.user-message .message-content-container {
    align-items: flex-end;
}

.user-message .message-content {
    background-color: #fff;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-message .message-time {
    text-align: right;
}

.message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #b6801b 0%, #d4952b 100%);
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.message-user{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #333;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.message-content {
    max-width: 65%;
    border-radius: 16px;
    padding: 14px 18px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    word-break: break-word;
    text-align: left;
    line-height: 1.6;
    font-size: 15px;
    color: #333;
}

.ai-message .message-content {
    border-top-left-radius: 4px;
    background: linear-gradient(135deg, #b6801b 0%, #d4952b 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(182, 128, 27, 0.2);
}

.user-message .message-content {
    border-top-right-radius: 4px;
}

.message-content-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    justify-content: flex-start;
    max-width: calc(100% - 52px);
}

.message-time {
    font-size: 12px;
    color: #999;
    padding: 0 4px;
}

.typing-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.aiTalkFooter {
    flex-shrink: 0;
    padding: 20px 25px;
    min-height: 120px;
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
}

.aiTalkFooter .el-input {
    flex: 1;
}

.aiTalkFooter .el-input :deep(.el-textarea__inner) {
    border-radius: 12px;
    border: 2px solid #f0f0f0;
    transition: all 0.3s ease;
    font-size: 15px;
}

.aiTalkFooter .el-input :deep(.el-textarea__inner):focus {
    border-color: #b6801b;
    box-shadow: 0 0 0 3px rgba(182, 128, 27, 0.1);
}

.aiTalkFooter .el-button {
    border-radius: 12px;
    font-weight: 600;
    padding: 0 24px;
    height: 44px;
    background: linear-gradient(135deg, #b6801b 0%, #d4952b 100%);
    border: none;
    transition: all 0.3s ease;
}

.aiTalkFooter .el-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(182, 128, 27, 0.3);
}

.aiTalkFooter .el-button:active {
    transform: translateY(0);
}
</style>
