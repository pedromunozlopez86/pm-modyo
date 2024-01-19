<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemoryStore } from '@/stores/memory'
import { useUserStore } from '@/stores/user'

const memoryStore = useMemoryStore()
const userStore = useUserStore()
const { cardsData, mistakes, successes, level } = storeToRefs(memoryStore)
const { levels } = useMemoryStore()
const { name } = storeToRefs(userStore)

const isError = ref(false)
const isSuccess = ref(false)
const cardFliped = ref(0)
const firstCardFliped = ref(undefined)
const secondCardFliped = ref(undefined)
const levelSelected = ref({})

watch(successes, () => {
  if (successes.value === 9) {
    setTimeout(() => {
      alert(`Has ganado: ${name.value}!!`)
    }, 500)
    return false
  }
})
const turnReset = () => {
  cardFliped.value = 0
  firstCardFliped.value = undefined
  secondCardFliped.value = undefined
  cardsData.value.forEach((card) => {
    if (card.isHidden === false && card.hasBeenMatched === false) {
      card.isHidden = true
    } else {
      return
    }
  })
  console.log(cardsData.value)
}

const switchCard = (card) => {
  if (cardFliped.value === 2) {
    if (card.id === firstCardFliped.value.id || card.id === secondCardFliped.value.id) {
      console.log('debes clickear otra carta')
    } else {
      // turnReset()
      // set card clicked to visible
      cardFliped.value++
      let choosenCard = cardsData.value.find((c) => c.id === card.id)
      choosenCard.isHidden = false
      firstCardFliped.value = choosenCard
    }
  } else if (cardFliped.value === 0) {
    if (card.id == firstCardFliped?.value?.id) {
      alert('debes escoger otra carta')
    } else {
      cardFliped.value++
      let choosenCard = cardsData.value.find((c) => c.id === card.id)
      choosenCard.isHidden = false
      firstCardFliped.value = choosenCard
      console.log(
        `estado 2do if: fliped:${cardFliped.value} - 1st:${firstCardFliped.value.meta.name} - 2nd:${secondCardFliped.value?.meta?.name}`
      )
    }
  } else if (cardFliped.value === 1) {
    cardFliped.value++
    let secondChoosenCard = cardsData.value.find((c) => c.id === card.id)
    secondChoosenCard.isHidden = false
    secondCardFliped.value = secondChoosenCard
    console.log(
      `estado 3er IF: fliped:${cardFliped.value} - 1st:${firstCardFliped.value.meta.name} - 2nd:${secondCardFliped.value.meta.name}`
    )

    // logic for match cards
    let firstId = firstCardFliped.value.meta.uuid
    let secondId = secondCardFliped.value?.meta?.uuid
    console.log('ids:', firstId, secondId)
    const isMatch = compareCards(firstId, secondId)

    if (isMatch) {
      console.log(`YES checo P1: ${isMatch}`)
      successes.value++
      isSuccess.value = true
      setTimeout((e) => {
        isSuccess.value = false
        manageSuccess(firstCardFliped.value, secondCardFliped.value)
      }, level.value.time)
    } else {
      console.log('nones siga participando')
      mistakes.value++
      isError.value = true
      setTimeout((e) => {
        isError.value = false
        console.log(e)
        turnReset()
        console.warn('ejecute turnReset()')
      }, level.value.time)
    }
  }
}

const compareCards = (firstId, secondId) => {
  if (firstId === secondId) {
    return true
  } else false
}

// const manageMistake = () => {
//   cardFliped.value = 0
//   firstCardFliped.value = undefined
//   secondCardFliped.value = undefined
//   cardsData.value.forEach((card) => {
//     card.isHidden = true
//   })
//   console.log(
//     `estado turnReset: fliped:${cardFliped.value} - 1st:${firstCardFliped.value} - 2nd:${secondCardFliped.value}`
//   )
// }

const manageSuccess = (firstCard, secondCard) => {
  // set cards state as NotHidden
  cardsData.value.find((c) => c.id === firstCard.id).hasBeenMatched = true
  cardsData.value.find((c) => c.id === secondCard.id).hasBeenMatched = true
  console.log(cardsData.value)
  cardFliped.value = 0
}

onMounted(() => {
  memoryStore.getAllPhotos()
})

const reload = () => {
  mistakes.value = 0
  successes.value = 0
  turnReset()
  console.log('reload')
}
</script>

<template>
  <header class="text-center my-10 ml-12 h-10">
    <div class="container mx-auto w-1/3 flex justify-center mb-6 border-4">
      <div class="mx-2 text-green-500" :class="isSuccess ? 'text-xl font-bold' : ' '">
        <p>Succeses: {{ successes }}</p>
      </div>
      <div class="mx-2 text-red-500" :class="isError ? 'text-xl font-bold' : ' '">
        <p>Errors: {{ mistakes }}</p>
      </div>
      <div class="mx-2 text-blue-500">
        <p>
          Jugador: <strong>{{ name }}</strong>
        </p>
      </div>
    </div>
  </header>
  <main class="mt-7">
    <section class="container mx-auto border-4 border-blue-500 p-2 rounded-lg">
      <div
        class="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-6 md:gap-3 lg:grid-cols-6 lg:gap-7 transition duration-300 ease-in-out pa-5"
      >
        <div
          v-for="(card, i) in cardsData"
          :key="i"
          @click="switchCard(card, i)"
          class="rounded-lg shadow-lg 2xl:size-60 xl:size-40 lg:size-36 md:size-24 sm:size-44 size-44 bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          <div class="flex justify-center mt-8" v-if="card.isHidden" id="card__hidden">
            <img
              src="../assets/img/icon_question.svg"
              alt="question-mark"
              class="text-white w-1/3 pt-0 md:pt-5"
            />
          </div>
          <div
            class="h-full w-full rounded-lg"
            v-else-if="card.hasBeenMatched || card.isHidden == false"
            id="card__revealed"
            :class="card.hasBeenMatched ? 'grayscale ' : 'grayscale-0'"
          >
            <img
              :src="card.fields.image.url"
              alt="image-card"
              class="object-cover object-center h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
    <div class="flex justify-center mt-10">
      <button
        @click="reload"
        type="reload"
        class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Reiniciar
      </button>
    </div>
  </main>
</template>
