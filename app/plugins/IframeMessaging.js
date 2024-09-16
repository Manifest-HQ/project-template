export default defineNuxtPlugin((nuxtApp) => {
  if (process.dev) {
    const innerHTML = ref('')
    let checkInterval = null

    function sendMessageToParent() {
      // Check if we're in an iframe
      if (window.parent !== window) {
        window.parent.postMessage('update', '*')
      }
    }

    nuxtApp.vueApp.mixin({
      mounted() {
        innerHTML.value = document.body.innerHTML
        sendMessageToParent()

        checkInterval = setInterval(() => {
          const currentHTML = document.body.innerHTML
          if (currentHTML !== innerHTML.value) {
            innerHTML.value = currentHTML
            sendMessageToParent()
          }
        }, 100)
      },

      updated() {
        sendMessageToParent()
      },

      unmounted() {
        if (checkInterval) {
          clearInterval(checkInterval)
        }
      }
    })
  }
})
