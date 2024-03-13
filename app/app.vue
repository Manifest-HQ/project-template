<template>
  <div class="h-screen">
    <div class="pt-safe bg-zinc-100 h-full px-4">
      hola v0.6
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
