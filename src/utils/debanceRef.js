// 自定义防抖ref
import { ref, onMounted, customRef } from 'vue';

export function useDebounceRef(value, delay = 300) {
  let timer 
  return customRef((track, trigger) =>({
    get(){
      track()
      return value
    },
    set(val){
      clearTimeout(timer)
      timer = setTimeout(() => {
        value = val
        trigger()
      }, delay)
    }
  }))
}