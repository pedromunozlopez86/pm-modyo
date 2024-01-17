<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemoryStore } from '@/stores/memory'

const memoryStore = useMemoryStore()
const { cardsData, mistakes, successes, level } = storeToRefs(memoryStore)
const { levels} = useMemoryStore()

const cardFliped = ref(0)
const firstCardFliped = ref(undefined)
const secondCardFliped = ref(undefined)
const levelSelected = ref({})
console.log(levels)

watch(successes, () => {
  console.log(successes.value)
  if (successes.value === 9) {
    setTimeout(() => {
      alert('gameover')
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
      // console.log(`primera carta: ${JSON.stringify(firstCardFliped.value.meta.name) ?? 'GG'}`)
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

const manageMistake = () => {
  cardFliped.value = 0
  firstCardFliped.value = undefined
  secondCardFliped.value = undefined
  cardsData.value.forEach((card) => {
    card.isHidden = true
  })
  console.log(
    `estado turnReset: fliped:${cardFliped.value} - 1st:${firstCardFliped.value} - 2nd:${secondCardFliped.value}`
  )
}

const manageSuccess = (firstCard, secondCard) => {
  // set cards state as NotHidden
  cardsData.value.find((c) => c.id === firstCard.id).hasBeenMatched = true
  cardsData.value.find((c) => c.id === secondCard.id).hasBeenMatched = true
  console.log(cardsData.value)
  cardFliped.value = 0
  // TODO logica para acierto
}

const setDificult = (level) => {
  console.log(levelSelected.value, level)
  memoryStore.setLevel(levelSelected.value)

}

onMounted(() => {
  memoryStore.getAllPhotos()
})


</script>

<template>
  <main>
    <div>
      <select name="levelSelected" id="" v-model="levelSelected" @change="setDificult">
        <option v-for="lvl in levels" :key="lvl" :value="lvl">{{ lvl.name }}</option>
        {{ levels }}
      </select>

    </div>
    <div class="my-10 ml-12">
      <div>Succeses: {{ successes }}</div>
      <div>Errors: {{ mistakes }}</div>
      <div>cards: {{ cardFliped }}</div>
    </div>
    <div class="grid grid-cols-6 gap-3">
      <div v-for="(card, i) in cardsData" :key="i" @click="switchCard(card, i)">
        <div id="main__hidden" class="w-full" v-if="card.isHidden">
          <div class="opacity-2">
            <img src="../assets/img/33777.svg" alt="" width="180px" />
          </div>
        </div>
        <div class="bg-slate-400 w-full pl-11" v-else-if="card.hasBeenMatched || card.isHidden == false">
          <img :src="card.fields.image.url" alt="" class="w-full aspect-square" />
        </div>
        <!-- <div class="bg-slate-400 w-full pl-11" v-else>
          <img :src="card.fields.image.url" alt="" class="w-full aspect-square" />
        </div> -->
      </div>
    </div>
  </main>
</template>
