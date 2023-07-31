<script setup lang="ts">
const props = defineProps<{
  ability?: string
  abilityIcon?: string
  defaultValue?: number
  desktop?: boolean
  faction?: string
  hero?: boolean
  image?: string
  value?: number
  typeIcon?: string
}>()
const imageUrl = new URL(`../assets/images/${props.image}`, import.meta.url)
</script>

<template>
  <div class="board-card">
    <div
      class="card"
      :class="{ hero: props.hero }"
      :style="{
        backgroundImage: `url(${imageUrl})`,
        backgroundColor: props.image ? '#000000' : 'grey'
      }"
    >
      <template v-if="props.image">
        <div v-if="defaultValue" class="value card-stat-badge">{{ value }}</div>
        <div v-if="abilityIcon" class="ability card-stat-badge">
          <v-icon :name="abilityIcon" class="icon" :scale="desktop ? 1 : 0.8" />
        </div>
        <div v-if="typeIcon" class="type card-stat-badge">
          <v-icon :name="typeIcon" class="icon" :scale="desktop ? 1 : 0.8" />
        </div>
      </template>
      <div v-else class="placeholder">
        <v-icon name="gi-sunflower" class="icon" :scale="desktop ? 2 : 1.2" />
      </div>
    </div>
  </div>
</template>
