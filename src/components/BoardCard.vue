<script setup lang="ts">
defineProps<{
  // ability: string
  // description: string
  // faction: string
  // image: string
  // name: string
  // type: string
  value: number
}>()
</script>

<template>
  <div class="card-wrapper">
    <div class="card">{{ value }}</div>
  </div>
</template>
