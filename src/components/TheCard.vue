<script setup>
import { ref, defineProps, defineEmits, onUpdated } from 'vue'

const isFlipped = ref(false)
const cardProps = defineProps({
    card: Object,
})
const emits = defineEmits(["onFlipCard"])

const flipCard = () => {
    isFlipped.value = !isFlipped.value
    emits('onFlipCard',isFlipped.value)
}

const resetCard = () => {
    isFlipped.value = !isFlipped.value

}
</script>
<template>
    <div class="card-container" @click="flipCard">
        {{ isFlipped }}
        <div class="card" :class="{ 'flipped': isFlipped }">
            {{ card?.meta?.name ?? 'a' }}
            <div class="card-face front">
                <img src="../assets/img/icon_question.svg" alt="question-mark" height="8rem" class="m-5" />

            </div>
            <div class="card-face back">

                <img :src="cardProps.card.fields.image.url" alt="">
            </div>
        </div>
    </div>
</template>
  

  
<style>
.card-container {
    perspective: 1000px;
}

.card {
    width: 5rem;
    height: 7.5rem;
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