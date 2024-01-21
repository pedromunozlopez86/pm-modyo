import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const playerName = ref('')
    const haveName = ref(false)
    const dificult = ref({})
    const setName = (inputName) => {
      playerName.value = inputName
      haveName.value = true
    }
    return { playerName, setName, haveName, dificult }
  },
  { persist: true }
)
