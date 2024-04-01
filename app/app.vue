<template>
  <div class="h-screen" tag-id="tag-4F57HrTt">
    <div class="pt-safe bg-blue-400 p-2" tag-id="tag-LwLddRu5">
      <div tag-id="tag-CHYIGDnb">level 1</div>
      <div tag-id="tag-H1GF8SUG">
        <span tag-id="tag-hvfmKtUz">level 2</span>
        <div tag-id="tag-rzBmtjqq">level 3</div>
        <img src="https://via.placeholder.com/150" tag-id="tag-LbcXXuZb">
      </img></div>
    </div>
    <div class="" tag-id="tag-DzslJVj5">
      test adding tag-id
    </div>

    <Accordion type="single" collapsible="" tag-id="tag-XcsQEwvC">
      <AccordionItem value="item-1" tag-id="tag-jmGpXcGA">
        <AccordionTrigger tag-id="tag-xqMsLm7M">Is it accessible?</AccordionTrigger>
        <AccordionContent tag-id="tag-CscHsiCN">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>

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
