<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  ability?: string
  abilityIcon?: string
  animationName?: string
  defaultValue?: number
  description?: string
  desktop?: boolean
  faction?: string
  hero?: boolean
  imageUrl: string | undefined
  name?: string
  typeIcon?: string
  value?: number
}>()

const animationClass = computed(() => {
  return props.animationName ? props.animationName : null
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
  <div class="carousel-card">
    <div class="card-wrap">
      <div class="animation-overlay" :class="animationClass"></div>
      <div class="card-border">
        <div
          class="card"
          :class="cardClasses"
          :style="{ backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : 'none' }"
        >
          <template v-if="props.imageUrl">
            <div v-if="defaultValue || defaultValue === 0" class="value card-stat-badge">
              {{ value }}
            </div>
            <div v-if="abilityIcon" class="ability card-stat-badge">
              <v-icon :name="abilityIcon" class="icon" :scale="desktop ? 2 : 1.2" />
            </div>
            <div v-if="typeIcon" class="type card-stat-badge">
              <v-icon :name="typeIcon" class="icon" :scale="desktop ? 2 : 1.2" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="carousel-card-details">
      <h2 v-html="props.name" class="title"></h2>
      <p v-if="props.description" v-html="props.description" class="description"></p>
    </div>
  </div>
</template>
