import { defineStore } from  "pinia"
    
import { ref } from "vue"

export const useAdmin = defineStore("admin", () =>{
    const isCollapse = ref(false)
    const changeCollapse = () =>{
        isCollapse.value = !isCollapse.value
    }
    return{
      isCollapse,
      changeCollapse
    }
})