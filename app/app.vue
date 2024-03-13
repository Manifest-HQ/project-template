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
  initIframeMessaging()
})

function initIframeMessaging() {
  document.addEventListener('click', function(event) {
    // Optional: Check if the clicked element is the one you're interested in
    const tagID = event.target.getAttribute('tag-id');
    if (!tagID) return
    // Send a message to the parent window with the clicked element's ID
    window.parent.postMessage({
      type: 'elementClicked',
      tagID: tagID,
      className: event.target.className,
      tagName: event.target.tagName,
      innerText: event.target.innerText
    }, '*')
  })
}
</script>

<style lang="sass">
@import "@/main.sass"
</style>
