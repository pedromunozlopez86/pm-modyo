<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemoryStore } from '@/stores/memory'
import { useUserStore } from '@/stores/user'
import TheCountdown from '@/components/TheCountdown.vue'
import router from '@/router'
import TheDialog from '@/components/TheDialog.vue'

const memoryStore = useMemoryStore()
const userStore = useUserStore()
const { cardsData, mistakes, successes, level } = storeToRefs(memoryStore)
const { name } = storeToRefs(userStore)

const isError = ref(false)
const isSuccess = ref(false)
const launchModal = ref(false)
const cardFliped = ref(0)
const firstCardFliped = ref(undefined)
const secondCardFliped = ref(undefined)
const isTimeout = ref(false)

const clockComponent = ref()

watch(successes, () => {
  if (successes.value === 9) {
    setTimeout(() => {
      modal()
      restart()
    }, 500)
    return false
  }
})

const modal = () => {
  launchModal.value = !launchModal.value
}
const turnReset = () => {
  cardFliped.value = 0
  firstCardFliped.value = undefined
  secondCardFliped.value = undefined
  cardsData.value.forEach((card) => {
    if (card.isFlipped === true && card.hasBeenMatched === false) {
      card.isFlipped = false
    }
  })
}

const switchCard = (card) => {
  if (cardFliped.value === 0) {
    if (card.id == firstCardFliped?.value?.id) {
      alert('debes escoger otra carta')
    } else {
      cardFliped.value++
      let choosenCard = cardsData.value.find((c) => c.id === card.id)
      choosenCard.isFlipped = true
      firstCardFliped.value = choosenCard
    }
  } else if (cardFliped.value === 1) {
    if (card.id == firstCardFliped?.value?.id) {
      alert('debes escoger otra carta')
    } else {
      cardFliped.value++
      let secondChoosenCard = cardsData.value.find((c) => c.id === card.id)
      secondChoosenCard.isFlipped = true
      secondCardFliped.value = secondChoosenCard

      // logic for match cards
      let firstId = firstCardFliped.value.meta.uuid
      let secondId = secondCardFliped.value?.meta?.uuid
      const isMatch = compareCards(firstId, secondId)
      console.log('ids:', firstId, secondId)
      console.log('son match? ', isMatch)
      if (isMatch) {
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
          turnReset()
          console.warn('ejecute turnReset()')
        }, level.value.time)
      }
    }
  }
}

const compareCards = (firstId, secondId) => {
  if (firstId === secondId) {
    return true
  } else false
}

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

const restart = () => {
  mistakes.value = 0
  successes.value = 0
  cardsData.value.forEach((card) => {
    card.hasBeenMatched = false
  })
  turnReset()
  clockComponent.value.resetTime()
  console.log('reload')
  isTimeout.value = false
}

const timeOut = () => {
  isTimeout.value = true
  clockComponent.value.resetTime()
  
}
const back = () => {
  router.push('/')
}

const manageRestart = ()=>{
  console.log('restart')
}
</script>

<template>
  <header class="text-center mt-2 h-auto w-full">
    <div
      class="container mx-auto w-full flex justify-around mb-6 border-4 drop-shadow-sm bg-gray-100 py-3"
    >
      <div id="header__buttons" class=" ">
        <div class="flex justify-start pt-10 md:pt-0">
          <button
            @click="back"
            type="reload"
            class="flex justify-center rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span class="material-icons">fast_rewind</span>
          </button>
          <button
            @click="restart"
            type="reload"
            class="flex justify-center rounded-md bg-blue-400 ml-3 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span class="material-icons">replay</span>
          </button>
        </div>
      </div>
      <div id="header__scoreboard" class="flex flex-wrap justify-center">
        <div
          class="mx-2 text-green-500 text-md md:text-xl"
          :class="isSuccess ? 'text-xl font-bold' : ' '"
        >
          <p>Aciertos: {{ successes }}</p>
        </div>
        <div
          class="mx-2 text-red-500 text-md md:text-xl"
          :class="isError ? 'text-xl font-bold' : ' '"
        >
          <p>Errores: {{ mistakes }}</p>
        </div>
        <div class="mx-2 text-blue-500 text-md md:text-xl">
          <p>
            Jugador: <strong>{{ name }}</strong>
          </p>
        </div>
        <div class="mx-2 text-blue-500 text-md md:text-xl">
          <p>
            Nivel: <strong>{{ level.name }}</strong>
          </p>
        </div>
      </div>
      <div>
        <TheCountdown :time="level.countdown" @gameover="timeOut" ref="clockComponent" />
      </div>
    </div>
  </header>
  <main class="container mx-auto">
    <section class="border-blue-500 p-2 rounded-lg h-max">
      <div
        class="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-6 md:gap-3 lg:grid-cols-6 lg:gap-7 transition duration-300 ease-in-out pa-5"
      >
        <div
          class="card-container"
          @click="switchCard(card, i)"
          v-for="(card, i) in cardsData"
          :key="i"
        >
          <div
            class="card xl:w-44 xl:h-48 lg:w-40 lg:h-44 md:w-28 md:h-32 w-24 h-24"
            :class="{ flipped: !card.isFlipped }"
          >
            <div class="card-face front">
              <img src="../assets/img/icon_question.svg" alt="question-mark" class="m-10 w-full" />
            </div>
            <div class="card-face back">
              <img
                :src="card.fields.image.url"
                alt=""
                class="object-cover object-center h-full w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <TheDialog
        :openModal="launchModal"
        :playerName="name"
        :level="level.name"
        :isTimeout="isTimeout"
        @closeModal="manageRestart"
      />
    </div>
  </main>
</template>
<style scoped>
.card-container {
  perspective: 1000px;
}

.card {
  /* width: 11rem; */
  /* height: 12rem; */
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.flipped {
  transform: rotateY(180deg);
}

.card-face {
  border-radius: 20px;
  position: absolute;
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  --tw-gradient-from: #3b82f6 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(1, 223, 212) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.front {
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}
</style>
