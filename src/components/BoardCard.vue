<script setup lang="ts">
const props = defineProps<{
  // ability: string
  // description: string
  faction?: string
  image: string
  // name: string
  // type: string
  value?: number
}>()

const imageUrl = new URL(props.image, import.meta.url)
</script>

<template>
  <div class="card-wrapper">
    <!--  <div class="card-wrapper">-->
    <div class="card" :style="{ backgroundImage: `url(${imageUrl})` }">
      <!--      {{ value }}<br />-->
      <!--      {{ faction }}-->
    </div>
  </div>
</template>
