<script setup>
import { ref } from 'vue'
import router from '@/router'
import { useUserStore } from '../stores/user'
// import { storeToRefs } from 'pinia';

const userStore = useUserStore()

const inputName = ref('')

const play = () => {
  userStore.setName(inputName.value)
  console.log('Comenzando...', inputName.value)
  router.push('/home')
}
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-200">
    
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm container w-1/4 text-center">
      <form class="space-y-6" @submit.prevent="play">
        <div>
          <label for="name" class="block text-sm text-center font-medium leading-6 text-gray-900"
            >Ingresa tu nombre</label
          >
          <div class="mt-2">
            <input
              v-model="inputName"
              id="name"
              name="name"
              type="name"
              required="true"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Comenzar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
