<template>
  <div class="h-screen" tag-id="tag-4F57HrTt">
    <div class="pt-safe bg-purple-400 h-full px-6 ml-2" tag-id="tag-LwLddRu5">
      hola v0.9
    </div>
    <div class="h-full" tag-id="tag-DzslJVj5">
      test adding tag-id
    </div>

    <NuxtPage />
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
    console.log('click', event)
    // Optional: Check if the clicked element is the one you're interested in
    const tagID = event.target.getAttribute('tag-id')
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
