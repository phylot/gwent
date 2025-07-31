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
  overlap?: boolean
  shake?: boolean
  typeIcon?: string
  value?: number
  valueIncreased?: boolean
}>()

const animationClass = computed(() => {
  return props.animationName ?? null
})

const smallCardClasses = computed(() => {
  return {
    active: props.active,
    disabled: props.disabled,
    overlap: props.overlap,
    shake: props.shake,
    'value-increased': props.valueIncreased
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
    class="small-card"
    :class="smallCardClasses"
    @click="disabled ? null : $emit('smallcard-click', $event)"
    @keyup.enter="disabled ? null : $emit('smallcard-enter', $event)"
    @keyup.space="disabled ? null : $emit('smallcard-space', $event)"
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
.small-card {
  height: 70px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.small-card.overlap {
  overflow: hidden;
}

.small-card.disabled {
  cursor: not-allowed;
}

.small-card.active {
  border-color: chartreuse;
  animation: pulse 1.1s infinite;
}

.small-card:last-child,
.small-card:hover,
.small-card.active {
  overflow: visible;
}

.small-card .card-wrap {
  width: 50px;
  height: 100%;
  box-sizing: content-box;
  border-radius: 4px;
}

.small-card .card {
  height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #000000;
}

.small-card .card-stat-badge {
  width: 18px;
  height: 18px;
  font-size: 12px;
}

.small-card .card-stat-badge.type {
  bottom: 2px;
}

.small-card.value-increased .card-stat-badge.value {
  animation: 0.2s scale-pulse 5;
}

.small-card.shake {
  animation: 0.1s small-shake 3;
}

.small-card .placeholder {
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
  .small-card {
    height: 110px;
  }

  .small-card .card-wrap {
    width: 90px;
  }

  .small-card .card-stat-badge {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  .small-card .card-stat-badge.type {
    bottom: 3px;
  }
}
</style>
