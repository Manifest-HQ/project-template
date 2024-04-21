<template>
  <div class="pt-safe bg-green-600 p-2" tag-id="tag-LwLddRu5">
    <div tag-id="tag-CHYIGDnb">level 1</div>
    <div tag-id="tag-H1GF8SUG">
      <div tag-id="tag-rzBmtjqq">level 3</div>
      <img src="https://via.placeholder.com/150" tag-id="tag-LbcXXuZb">
    </img></div>
  </div>
  <div class="" tag-id="tag-DzslJVj5">
    test adding tag-id
  </div>

  <div v-for="user in storeInfo.tables?.users" :key="user.id" tag-id="tag-qnGTjzJT">
    {{ user }}
  </div>
</template>

<script setup>
import { useStoreInfo } from '@/stores/Info'

const storeInfo = useStoreInfo()
</script>
