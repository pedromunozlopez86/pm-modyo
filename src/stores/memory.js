import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiPhotos } from '../config/axios/apiPhotos.axios'

export const useMemoryStore = defineStore('memory', () => {
  const mistakes = ref(0)
  const successes = ref(0)
  const cardsData = ref([])
  const level = ref({
    name: 'Medio',
    value: 'medium',
    cards: 9,
    time: 1700,
    countdown: 120
  })
  const levels = [
    {
      name: 'Fácil',
      value: 'easy',
      cards: 6,
      time: 2500,
      countdown: 180
    },
    {
      name: 'Medio',
      value: 'medium',
      cards: 9,
      time: 1700,
      countdown: 120
    },
    {
      name: 'Dificil',
      value: 'hard',
      cards: 9,
      time: 1000,
      countdown: 60
    }
  ]
  const getAllPhotos = async () => {
    try {
      const { data } = await apiPhotos.get('', { params: { per_page: level.value.cards } })
      let arrayData = [...data.entries, ...data.entries]
      let id = 0
      cardsData.value = arrayData.map((card) => {
        return {
          ...card,
          isFlipped: false,
          hasBeenMatched: false,
          id: id++
        }
      })
      randomizePhotos(cardsData.value)
    } catch (error) {
      console.error(error)
    }
  }

  const randomizePhotos = (photos) => {
    function random() {
      return Math.random() - 0.5
    }
    photos.sort(random)
  }

  const manageMistakes = () => {
    mistakes.value++
  }

  const manageSuccesses = () => {
    successes.value++
  }

  const restartGame = () => {
    mistakes.value = 0
    successes.value = 0
  }

  const setLevel = (levelSelected) => {
    level.value = levels.find((l) => l.value === levelSelected)
    getAllPhotos()
  }

  return {
    mistakes,
    successes,
    level,
    levels,
    cardsData,
    getAllPhotos,
    manageMistakes,
    manageSuccesses,
    restartGame,
    setLevel
  }
})
