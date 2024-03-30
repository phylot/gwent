<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  abilityIcon?: string
  animationName?: string
  active?: boolean
  defaultValue?: number
  desktop?: boolean
  disabled?: boolean
  faction?: string
  hero?: boolean
  imageUrl?: string | undefined
  typeIcon?: string
  value?: number
}>()

const animationClass = computed(() => {
  return props.animationName ? props.animationName : null
})

const classes = computed(() => {
  return {
    active: props.active,
    disabled: props.disabled
  }
})

const cardClasses = computed(() => {
  return {
    decreased: props.value && props.defaultValue && props.value < props.defaultValue,
    hero: props.hero,
    increased: props.value && props.defaultValue && props.value > props.defaultValue
  }
})
</script>

<template>
  <div
    class="board-card"
    :class="classes"
    @click="disabled ? null : $emit('boardcard-click', $event)"
    @keyup.enter="disabled ? null : $emit('boardcard-enter', $event)"
    @keyup.space="disabled ? null : $emit('boardcard-space', $event)"
  >
    <div class="card-wrap">
      <div class="animation-overlay" :class="animationClass"></div>
      <div
        class="card"
        :class="cardClasses"
        :style="{
          backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : 'none',
          backgroundColor: props.imageUrl ? '#000000' : '#a4a4a4'
        }"
      >
        <template v-if="props.imageUrl">
          <div v-if="defaultValue || defaultValue === 0" class="value card-stat-badge">
            {{ value }}
          </div>
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
