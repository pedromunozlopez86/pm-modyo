import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const name = ref('Player')
    const setName = (inputName) => {
      name.value = inputName
      console.log('nombre :', inputName)
    }
    return { name, setName }
  },
  { persist: true }
)
