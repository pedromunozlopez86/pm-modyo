<script setup>
import { onMounted, computed, defineProps, ref, defineExpose } from 'vue'

const countdownProps = defineProps({
    time: 60
})
const timeRemaining = ref(countdownProps.time);

const countdown = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

let interval;

const startCountdown = () => {

    console.log('aaaa')
    interval = setInterval(() => {
        if (timeRemaining.value > 0) {
            timeRemaining.value--;
        } else {
            clearInterval(interval);
            console.log('¡Tiempo agotado!');
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
defineExpose({ resetTime });
</script>


<template>
    <div class="container mx-auto text-center">
        <h1 class="text-2xl text-blue-600 font-bold shadow-3">{{ countdown }}</h1>
    </div>
</template>
  
 