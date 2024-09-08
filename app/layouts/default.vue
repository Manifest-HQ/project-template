<template>
  <div class="h-screen" tag-id="tag-4F57HrTt">
    <NuxtPage tag-id="tag-Xt3h6fyE" />
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
