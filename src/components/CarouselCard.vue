<script setup lang="ts">
const props = defineProps<{
  ability?: string
  abilityIcon?: string
  defaultValue?: number
  description?: string
  desktop?: boolean
  faction?: string
  hero?: boolean
  image?: string
  name?: string
  value?: number
  typeIcon?: string
}>()
const imageUrl = new URL(`../assets/images/${props.image}`, import.meta.url)
</script>

<template>
  <div class="carousel-card">
    <div class="card-border">
      <div
        class="card"
        :class="{ hero: props.hero }"
        :style="{ backgroundImage: `url(${imageUrl})` }"
      >
        <template v-if="props.image">
          <div v-if="defaultValue" class="value card-stat-badge">{{ value }}</div>
          <div v-if="abilityIcon" class="ability card-stat-badge">
            <v-icon :name="abilityIcon" class="icon" :scale="desktop ? 2 : 1.2" />
          </div>
          <div v-if="typeIcon" class="type card-stat-badge">
            <v-icon :name="typeIcon" class="icon" :scale="desktop ? 2 : 1.2" />
          </div>
        </template>
        <div v-else style="color: #ffffff">Placeholder</div>
      </div>
    </div>

    <div class="carousel-card-details">
      <div v-html="props.name" class="title"></div>
      <div v-html="props.description" class="description"></div>
    </div>
  </div>
</template>
