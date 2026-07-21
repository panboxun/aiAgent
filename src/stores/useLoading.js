import { defineStore } from  "pinia"
    
import { ref } from "vue"

export const useLoading = defineStore("loading", () =>{
    const globalLoading = ref(false)
  
    return{
      globalLoading
    }
})