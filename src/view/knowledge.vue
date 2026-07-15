<template>
  <div class="">
    知识文章
    <div id="data-container" class="container"></div>
  </div>
</template>

<script setup  name='Index' >  
import { nextTick, onMounted, ref } from 'vue';

const totalData = 100000;
const dataList = Array.from({ length: totalData }, (_, index) => ({
  id: index + 1,
  content: `数据项 ${index + 1} - 不使用虚拟列表分批渲染`
}));
// 2. 配置分批参数
const batchSize = 100; // 每批渲染100条（可根据性能调整，建议50-200条）
let currentIndex = 0; // 当前渲染到的索引




// 3. 分批渲染核心方法
function renderBatch() {
  const container = document.getElementById('data-container') ; // 渲染容器
  // 计算当前批次的起始和结束索引
  const start = currentIndex;
  const end = Math.min(start + batchSize, totalData);
  // 渲染当前批次数据
  const fragment = document.createDocumentFragment(); // 文档碎片，减少重排重绘
  for (let i = start; i < end; i++) {
    const item = document.createElement('div');
    item.className = 'data-item';
    item.textContent = dataList[i].content;
    fragment.appendChild(item); // 先插入文档碎片，避免多次DOM操作
  }
  container.appendChild(fragment); // 一次性插入页面，只触发1次重排

  // 更新当前索引
  currentIndex = end;

  // 若未渲染完成，继续利用空闲时间渲染下一批
  if (currentIndex < totalData) {
    requestIdleCallback(renderBatch, { timeout: 100 }); // 超时兜底，避免长时间不渲染
  }
}

// 4. 启动渲染
requestIdleCallback(renderBatch, { timeout: 100 });

</script>

<style scoped >
.data-item {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}
.container{
  height: 500px;
  overflow: auto;
}
</style>
