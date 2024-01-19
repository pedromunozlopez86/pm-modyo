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

const cardFliped = ref(0)
const firstCardFliped = ref(undefined)
const secondCardFliped = ref(undefined)
const levelSelected = ref({})
console.log(levels)

watch(successes, () => {
  console.log(successes.value)
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
      manageSuccess(firstCardFliped.value, secondCardFliped.value)
    } else {
      console.log('nones siga participando')
      mistakes.value++
      setTimeout((e) => {
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
  // TODO logica para acierto
}

// const setDificult = (level) => {
//   console.log(levelSelected.value, level)
//   memoryStore.setLevel(levelSelected.value)
// }

const isGrayScale = computed((condition) => {
  return condition ? 'grayscale' : 'grayscale-0'
})
onMounted(() => {
  memoryStore.getAllPhotos()
})
</script>

<template>
  <header class="text-center my-10 ml-12">
    <div>Succeses: {{ successes }}</div>
    <div>Errors: {{ mistakes }}</div>
    <div>cards: {{ cardFliped }}</div>
  </header>
  <main>
    <section class="container mx-auto">
      <div
        class="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-6 md:gap-3 lg:grid-cols-6 lg:gap-7"
      >
        <div
          v-for="(card, i) in cardsData"
          :key="i"
          @click="switchCard(card, i)"
          class="2xl:size-60 xl:size-40 lg:size-36 md:size-24 sm:size-44 size-44 bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          <div class="flex justify-center mt-8" v-if="card.isHidden" id="card__hidden">
            <img src="../assets/img/icon_question.svg" alt="question-mark" class="text-white w-1/3 pt-0 md:pt-5" />
          </div>
          <div
            class="h-full w-full"
            v-else-if="card.hasBeenMatched || card.isHidden == false"
            id="card__revealed"
            :class="isGrayScale(card.hasBeenMatched)"
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
  </main>
</template>
