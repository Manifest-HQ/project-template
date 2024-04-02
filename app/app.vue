<template>
  <div class="h-screen" tag-id="tag-4F57HrTt">
    <NuxtPage tag-id="tag-Xt3h6fyE"/>
  </div>
</template>

<script setup>
import { CapacitorUpdater } from '@capgo/capacitor-updater'

onMounted(() => {
  // TODO use this only on ios and android, not web
  CapacitorUpdater.notifyAppReady()
  initIframeMessaging()
  sendMessageHTMLBody()
})

function initIframeMessaging() {
  document.addEventListener('click', function(event) {
    sendMessageElementClicked(event)
    sendMessageHTMLBody()
  })
}

function sendMessageElementClicked (event) {
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
}

function sendMessageHTMLBody() {
  const htmlBody = document.body
  window.parent.postMessage({
    type: 'htmlBody',
    htmlBody: htmlBody.innerHTML
  }, '*')
}
</script>

<style lang="sass">
@import "@/main.sass"
</style>
