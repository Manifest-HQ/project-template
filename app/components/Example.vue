<template>
  <div tag-id="tag-yt9C5UAL">
    This is an example
    {{ GITHUB_REPO }}
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const GITHUB_REPO = computed(() => {
  return config.public
})
</script>
