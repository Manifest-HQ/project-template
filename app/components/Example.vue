<template>
  <div>
    {{ GITHUB_BRANCH }}
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const GITHUB_BRANCH = config.NUXT_PUBLIC_GITHUB_BRANCH
</script>
