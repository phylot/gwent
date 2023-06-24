<script setup lang="ts">
const props = defineProps<{
  ability?: string
  defaultValue?: number
  // description: string
  faction?: string
  hero?: boolean
  image?: string
  // name: string
  // type: string
  value?: number
}>()
const imageUrl = new URL(`../assets/images/${props.image}`, import.meta.url)
</script>

<template>
  <div class="card-wrapper">
    <!--  <div class="card-wrapper">-->
    <div class="card" :class="{ 'hero': props.hero }" :style="{ backgroundImage: `url(${imageUrl})` }">
      <template v-if="props.image">
        <div v-if="defaultValue" class="value stat-counter">{{ value }}</div>
        <div v-if="ability" class="ability stat-counter">{{ ability }}</div>
      </template>
      <div v-else style="color: #ffffff">Placeholder</div>
    </div>
  </div>
</template>
