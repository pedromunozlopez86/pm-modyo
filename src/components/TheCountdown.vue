<script setup>
import { onMounted, computed, defineProps,ref, defineEmits } from 'vue'


const countdownProps = defineProps({
    time: 60
})
const emit = defineEmits({
    gameover : ()=>{
        console.log('desde emit te aviso que fuiste bueno')
    }
})
console.log(countdownProps.time)
const timeRemaining = ref(countdownProps.time);

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
            console.log('¡Tiempo agotado!');
            emit('gameover')
        }
    }, 1000);
}

onMounted(() => {
    startCountdown()
})
</script>


<template>
    <div class="container mx-auto text-center">
        <h1 class="text-2xl text-blue-600 font-bold shadow-3">{{ countdown }}</h1>
    </div>
</template>
  
 