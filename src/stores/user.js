import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref('Player')
  const dificult = ref({})

  const setName = (inputName) => {
    name.value = inputName
    console.log('nombre :',inputName)
  }
  return { name, dificult,setName }
},{persist:true})
