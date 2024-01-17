<script setup>
import { ref, onMounted } from 'vue'
import { apiPhotos } from '../config/axios/apiPhotos.axios'
// import FormComponent from '@/components/FormComponent.vue'

const fotos = ref()

// onMounted(async () => {
//   await apiPhotos.get().then((res) => {
//     console.log(res.data)
//     fotos.value = res.data.entries
//   })
// })
</script>
<template>
  <div>
    <h1 class="text-center">Login</h1>
    <!-- <FormComponent /> -->
    <div class="grid grid-cols-6 gap-4">

      <div v-for="photo in fotos" :key="photo" class="">
        <img :src="photo.fields.image.url" alt="" class="w-full aspect-square" />
      </div>
    </div>
    <div class="w-1/8">
      <img src="../assets/img/33777.svg" alt="" />
    </div>
  </div>
</template>
