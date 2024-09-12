<template>
  <div class="bg-red-100 h-full pt-16 px-2 w-full">
    <div
      class="bg-white border-b border-zinc-200 fixed flex h-12 left-0 top-0 w-full">
      <div
        class="bg-blue-400 h-8 leading-8 m-2 mt-2 rounded-md text-center text-white text-xs w-8">
        logo
      </div>
    </div>

    <div class="mt-40 text-lg">Pets App</div>

    <div>This is an app to handle your pet needs</div>
  </div>
</template>

<script setup>
import { useStoreDB } from '@/stores/DB'

const storeDB = useStoreDB()
</script>
