<template>
  <div class="h-screen">
    <div class="pt-safe bg-orange-300 h-full">
      Date is: 08/10/2023 1:50, end.
      <Example />
    </div>
  </div>
</template>

<script setup>
import { CapacitorUpdater } from '@capgo/capacitor-updater'

onMounted(() => {
  // TODO use this only on ios and android, not web
  CapacitorUpdater.notifyAppReady()
})
</script>

<style lang="sass">
@import "@/main.sass"
</style>
