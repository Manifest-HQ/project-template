<template>
  <NuxtLayout />
</template>

<script setup>
// font handling
const fontBody = ref('')
const fontHeading = ref('')

onMounted(() => {
  fontBody.value = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-body')
    .trim()
  fontHeading.value = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-heading')
    .trim()

  console.log(fontBody.value, fontHeading.value)
})

useHead(() => ({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    // Only include body font if it's not system-ui
    ...(fontBody.value !== 'system-ui'
      ? [
          {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?family=${fontBody.value
              .replace(/['"]+/g, '')
              .replace(' ', '+')}&display=swap`
          }
        ]
      : []),
    // Only include heading font if it's not system-ui
    ...(fontHeading.value !== 'system-ui'
      ? [
          {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?family=${fontHeading.value
              .replace(/['"]+/g, '')
              .replace(' ', '+')}&display=swap`
          }
        ]
      : [])
  ]
}))
// end font handling
</script>
