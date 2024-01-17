import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiPhotos } from '../config/axios/apiPhotos.axios'


export const useMemoryStore = defineStore('memory', () => {
    const mistakes = ref(0);
    const successes = ref(0);
    const cardsData = ref()

    const getAllPhotos = async () => {
        try {
            const { data } = await apiPhotos.get()
            // duplicates the cards to get the matches
            let arrayData = [...data.entries, ...data.entries]
            let id = 0
            // set array with properties for the game
            cardsData.value = arrayData.map((card) => {
                return {
                    ...card,
                    isHidden: true,
                    hasBeenMatched: false,
                    id: id++
                }
            })
            // random order photos
            randomizePhotos(cardsData.value)
            // console.log(cardsData.value)
        } catch (error) {
            console.error(error)
        }
    }
     // function to randomize the photos on start
   const randomizePhotos = (photos) => {
        function random() {
            return Math.random() - 0.5
        }
        photos.sort(random)
    }

    const manageMistakes = () => {
        mistakes.value++
        console.log('A mistake has been ocurred')

    }

    const manageSuccesses = () => {
        successes.value++
        console.log('A success has been ocurred')

    }

    const restartGame = () => {
        mistakes.value = 0;
        successes.value = 0
        console.log('the game has been restarted!')
    }


    return { mistakes, successes, cardsData, getAllPhotos, manageMistakes, manageSuccesses, restartGame }
})