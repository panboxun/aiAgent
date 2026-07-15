<template>
  <div class="mainContainer">
    <h2>数据展示 (虚拟滚动)</h2>
    <VirtualList :items="arr" :itemHeight="50" :containerHeight="500">
      <template #default="{ item }">
        <div class="item-content">
          <span>{{ item.name }}</span>
          <span>年龄: {{ item.age }}</span>
          <span>性别: {{ item.gender }}</span>
          <span>状态: {{ item.status }}</span>
        </div>
      </template>
    </VirtualList>
    

  </div>
</template>

<script setup name='Index' lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import _ from 'lodash'
import VirtualList from '../components/VirtualList.vue';


enum gender {
  Male = "男",
  Female = "女"
}

type status = number | string | boolean

const data: status = 123

enum Color {
  Red = "red",
  Yellow = "yellow",
  Green = "green"
}

type color = {
  red: number
  green: number
  blue: number
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

class person {

  constructor(
    public name: string, 
    public age: number, 
    public gender: gender, 
    public status: status
  ){}
}

class student extends person {
  id: number
  constructor(name: string, age: number, gender: gender, status: status, id: number) {
    super(name, age, gender, status)
    this.id = id
  } 
}



onMounted(async () => {
 
  
})

// 写一个长度为1000的对象数组 并使用虚拟滚动列表展示
// _.times是一个lodash方法，用于生成一个数组，数组的长度为第一个参数，数组的每个元素为第二个参数的结果。
// 这里我们使用它来生成一个长度为1000的对象数组，每个对象的属性为name、age、gender、status、id  
interface Student {
  id: number
  name: string
  age: number
  gender: gender
  status: status
}
interface StudentItem extends Student {
  id: number
}

// 学生列表
const arr: Student[] = _.times(1000, (i) => ({
  id: i,
  name: `姓名${i}`,
  age: 18 + (i % 50),
  gender: i % 2 === 0 ? gender.Male : gender.Female,
  status: 123 + i
}))


      











</script>

<style scoped>
.mainContainer {
  padding: 20px;
}

.item-content {
  display: flex;
  justify-content: space-around;
  width: 100%;
}


</style>
