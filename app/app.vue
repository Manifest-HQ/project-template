<template>
  <div class="h-screen" tag-id="tag-4F57HrTt">
    <div class="pt-safe bg-purple-400 h-full px-6 ml-2" tag-id="tag-LwLddRu5">
      <div tag-id="tag-CHYIGDnb">level 1</div>
      <div tag-id="tag-H1GF8SUG">
        <span tag-id="tag-hvfmKtUz">level 2</span>
        <div tag-id="tag-rzBmtjqq">level 3</div>
        <img src="https://via.placeholder.com/150" tag-id="tag-LbcXXuZb">
      </img></div>
    </div>
    <div class="h-full" tag-id="tag-DzslJVj5">
      test adding tag-id
    </div>

    <NuxtPage tag-id="tag-Xt3h6fyE"/>
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

    const htmlBody = document.body
    window.parent.postMessage({
      type: 'htmlBody',
      htmlBody: htmlBody.innerHTML
    }, '*')
  })
}
</script>

<style lang="sass">
@import "@/main.sass"
</style>
