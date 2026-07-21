<template>
  <div v-show="visible" class="loading-mask">
    <div class="loading-box">
      <div class="loading-spin"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLoading } from '@/stores/useLoading'
const loadingStore = useLoading()
const visible = computed(() => loadingStore.globalLoading)

</script>

<style scoped>
.loading-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.loading-box {
  background: #fff;
  padding: 24px 32px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loading-spin {
  width: 36px;
  height: 36px;
  border: 4px solid #e5e7eb;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loading-text {
  margin-top: 12px;
  color: #666;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>