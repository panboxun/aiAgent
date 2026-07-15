<template>
  <div class="">
    走马灯
    <div class="crossLight"></div>
  </div>
</template>

<script setup  name='Index' lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const crossLight = ref("red")
async function delay(time: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, time);
  })
}
interface CrossLight<T> {
  color: string | number
  index: number
  time?: number
}

let obj: CrossLight<string> = {
  color: "red",
  index: 0
}
onMounted(() => {
  changeColor()
})

async function changeColor() {
  while (true) {
    crossLight.value = "red"
    await delay(3000)
    crossLight.value = "yellow"
    await delay(1000)
    crossLight.value = "green"
    await delay(3000)
  }
}

</script>

<style scoped >
.crossLight {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: v-bind(crossLight);
}
</style>
