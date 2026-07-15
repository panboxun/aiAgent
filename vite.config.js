import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
  ],
  resolve: { 
    alias: {
      '@': path.resolve(__dirname, './src'), // 根据项目结构改为正确路径
    },
  },
  server: {
    proxy: {
      '/ai-agent-psi-lake.vercel.app/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ai-agent-psi-lake\.vercel\.app\/api/, ''),
      },
    },
  },
  // 分包配置
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
   
  },
})
