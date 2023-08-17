<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  ability?: string
  abilityIcon?: string
  animationName?: string
  defaultValue?: number
  desktop?: boolean
  disabled?: boolean
  faction?: string
  hero?: boolean
  image?: string
  typeIcon?: string
  value?: number
}>()

const imageUrl = computed(() => {
  return new URL(`../assets/images/${props.image}`, import.meta.url)
})
const animationClass = computed(() => {
  return props.animationName ? props.animationName : null;
})
</script>

<template>
  <div
    class="board-card"
    :class="{ disabled: disabled }"
    @click="disabled ? null : $emit('boardcard-click', $event)"
  >
    <div class="card-wrap">
      <div class="animation-overlay" :class="animationClass"></div>
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
  </div>
</template>
