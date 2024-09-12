<template>
  <div class="h-screen">
    <NuxtPage />
  </div>
</template>

<script setup>
import { useStoreUpdates } from '../stores/Updates'

const storeUpdates = useStoreUpdates()

onMounted(async () => {
  storeUpdates.init()
})
</script>

<style lang="sass">
@import "@/main.sass"
</style>
