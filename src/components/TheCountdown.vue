<script setup>
import { onMounted, computed, defineProps, ref, defineExpose, defineEmits } from 'vue'

const countdownProps = defineProps({
    time: 60
})
const timeRemaining = ref(countdownProps.time);

const emit = defineEmits(["gameover"])
const countdown = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

let interval;

const startCountdown = () => {
    interval = setInterval(() => {
        if (timeRemaining.value > 0) {
            timeRemaining.value--;
        } else {
            clearInterval(interval);
            emit('gameover')
        }
    }, 1000);
}

const resetTime = () => {
    timeRemaining.value = countdownProps.time
}
onMounted(() => {
    startCountdown()
})
defineExpose({ resetTime, startCountdown });
</script>


<template>
    <div class="container mx-auto text-center">

        <h1 class=" text-md md:pt-0 pt-9 pr-3 md:pr-0 md:text-2xl  text-blue-600 font-bold  drop-shadow-lg"><p
                class="material-icons text-blue-500 text-2xl font-bold -mb-4">av_timer</p> {{ countdown }}
        </h1>
    </div>
</template>
  
 