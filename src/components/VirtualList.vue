<template>
  <div ref="container" class="virtual-scroll-container" @scroll="handleScroll">
    <div class="virtual-scroll-phantom" :style="{ height: phantomHeight + 'px' }"></div>
    <div class="virtual-scroll-list" :style="{ transform: `translate3d(0, ${offset}px, 0)` }">
      <div
        v-for="item in visibleData"
        :key="item.id || item.name"
        class="virtual-scroll-item"
        :style="{ height: itemHeight + 'px', lineHeight: itemHeight + 'px' }"
      >
        <slot :item="item">{{ item.name }} - {{ item.age }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface VirtualListItem {
  id?: number | string
  [key: string]: any
}

const props = withDefaults(defineProps<{
  items: VirtualListItem[]
  itemHeight?: number
  containerHeight?: number
}>(), {
  itemHeight: 50,
  containerHeight: 400
});

const container = ref<HTMLElement | null>(null);
const startIndex = ref(0);
const offset = ref(0);

const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight));
const endIndex = computed(() => startIndex.value + visibleCount.value);
const visibleData = computed(() => props.items.slice(startIndex.value, endIndex.value + 1));
const phantomHeight = computed(() => props.items.length * props.itemHeight);

const handleScroll = () => {
  if (!container.value) return;
  const scrollTop = container.value.scrollTop;
  startIndex.value = Math.floor(scrollTop / props.itemHeight);
  offset.value = scrollTop - (scrollTop % props.itemHeight);
  
};
</script>

<style scoped>
.virtual-scroll-container {
  height: v-bind(containerHeight + 'px');
  overflow-y: auto;
  position: relative;
  border: 1px solid #ccc;
}

.virtual-scroll-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-scroll-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}

.virtual-scroll-item {
  padding: 0 15px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
</style>
