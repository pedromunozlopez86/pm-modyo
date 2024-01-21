<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import { useUserStore } from '../stores/user'
import { useMemoryStore } from '../stores/memory'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const memoryStore = useMemoryStore()
const inputName = ref('')
const levelSelected = ref('medium')
const name = storeToRefs(userStore)

const start = () => {
  userStore.setName(inputName.value)
  memoryStore.setLevel(levelSelected.value)
  console.log('Comenzando...', inputName.value)
  router.push('/home')
}

onMounted(() => {
  console.log(name.value)
})
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-200 text-center">
    <h1 class="font-bold text-indigo-600 text-2xl">Juego de Memoria</h1>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm container w-1/4 text-center">
      <form class="space-y-6" @submit.prevent="start">
        <div>
          <label for="name" class="block text-sm text-center font-medium leading-6 text-gray-900">Ingresa tu
            nombre</label>
          <div class="mt-2">
            <input v-model="inputName" v-bind="name" id="name" name="name" type="name" required="true"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" />
          </div>
        </div>
        <div>
          <label class="inline-flex items-center">
            <input type="radio" v-model="levelSelected" value="easy" class="form-radio text-indigo-600" />
            <span class="mx-2">Fácil</span>
          </label>

          <label class="inline-flex items-center">
            <input type="radio" v-model="levelSelected" value="medium" class="form-radio text-indigo-600" />
            <span class="mx-2">Medio</span>
          </label>

          <label class="inline-flex items-center">
            <input type="radio" v-model="levelSelected" value="hard" class="form-radio text-indigo-600" />
            <span class="mx-2">Dificil</span>
          </label>

        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Comenzar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
