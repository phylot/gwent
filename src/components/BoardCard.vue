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

<style>
.board-card {
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4px;
  cursor: pointer;
}

.board-card.disabled {
  cursor: not-allowed;
}

.board-card.active {
  border-color: chartreuse;
  animation: pulse 1.1s infinite;
}

.board-card:last-child,
.board-card:hover,
.board-card.active {
  overflow: visible;
}

.board-card .card-wrap {
  width: 50px;
  height: 100%;
  box-sizing: content-box;
  border-radius: 4px;
}

.board-card .card {
  height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #000000;
}

.board-card .card-stat-badge {
  width: 18px;
  height: 18px;
  font-size: 12px;
}

.board-card .card-stat-badge.type {
  bottom: 2px;
}

.board-card .placeholder {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #60656b;
}

.placeholder .icon {
  color: #60656b;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .board-card .card-wrap {
    width: 90px;
  }

  .board-card .card-stat-badge {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  .board-card .card-stat-badge.type {
    bottom: 3px;
  }
}
</style>
