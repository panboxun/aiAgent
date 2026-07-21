<script setup>
import { onMounted } from 'vue'

  onMounted(() => {
    createWaterMark()
  })
  
  // 创建水印
  function createWaterMark(text = '内部文档', fontSize = 14, color = 'rgba(180,180,180,0.18)') {
    // 先移除旧水印
    // const oldMark = document.getElementById('water-mark-box')
    // if (oldMark) oldMark.remove()
    let username =  JSON.parse(localStorage.getItem("username"))
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // 单个水印格子宽高
    const width = 240
    const height = 160
    canvas.width = width
    canvas.height = height

    ctx.rotate(-22 * Math.PI / 180) // 倾斜角度
    ctx.font = `${fontSize}px Microsoft YaHei`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText( username?username:text, width / 3, height / 2)

    // 生成水印图片
    const imgUrl = canvas.toDataURL('image/png')

    // 创建水印容器
    const markBox = document.createElement('div')
    markBox.id = 'water-mark-box'
    markBox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background-image: url(${imgUrl});
      background-repeat: repeat;
      pointer-events: none; /* 不拦截鼠标点击 */
      user-select: none;
    `
    document.body.appendChild(markBox)

    // 监听dom删除，自动恢复水印（防控制台删除div）
    const observer = new MutationObserver(() => {
      if (!document.getElementById('water-mark-box')) {
        createWaterMark(text, fontSize, color)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
  
</script>

<template>
  <keep-alive>
    <RouterView v-if="$route.meta.keepAlive" />
  </keep-alive>
    <!-- 不需要缓存的视图组件 -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  <!-- 实现一个全局水印 使用svg的方式-->

</template>
