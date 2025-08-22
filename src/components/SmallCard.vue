<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  abilityIcon?: string
  active?: boolean
  animationName?: string
  appearAnimation?: boolean
  defaultValue?: number
  desktop?: boolean
  disabled?: boolean
  faction?: string
  hero?: boolean
  imageUrl?: string | undefined
  overlap?: boolean
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
    'appear-animation': props.appearAnimation,
    disabled: props.disabled,
    overlap: props.overlap,
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
          <div v-if="defaultValue || defaultValue === 0" class="card-value-badge">
            {{ value }}
          </div>
          <div v-if="abilityIcon" class="card-ability-badge">
            <v-icon :name="abilityIcon" class="icon" :scale="desktop ? 1 : 0.8" />
          </div>
          <div v-if="typeIcon" class="combat-type-badge">
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
  position: relative;
  width: 50px;
  height: 100%;
  box-sizing: content-box;
  border-radius: 4px;
  overflow: hidden;
}

.small-card .card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid #000000;
  box-sizing: border-box;
  background-position: center;
  background-size: cover;
  background-color: #000000;
  overflow: hidden;
}

.small-card .card-value-badge {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000000;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  background-color: #ffffff;
}

.small-card .card.increased .card-value-badge,
.small-card .card.decreased .card-value-badge {
  border-color: #ffffff;
  font-weight: bold;
  color: #ffffff;
}

.small-card .card.increased .card-value-badge {
  background-color: #24871a;
}

.small-card .card.decreased .card-value-badge {
  background-color: #e51715;
}

.small-card .card.hero .card-value-badge {
  border-style: dotted;
  border-color: #f9a825;
  color: #f9a825;
  background-color: #000000;
}

.small-card .card-ability-badge {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  background-color: #000000;
}

.small-card.value-increased .card-value-badge {
  animation: 0.2s scale-pulse 5;
}

.small-card .combat-type-badge {
  position: absolute;
  right: 0;
  width: 18px;
  height: 18px;
  bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #775022;
  border-radius: 999px;
  color: #000000;
  background-color: #c9883a;
}

.small-card.appear-animation {
  animation-name: fade-in, reduce-scale, small-shake;
  animation-delay: 0s, 0s, 0.3s;
  animation-duration: 0.2s, 0.2s, 0.1s;
  animation-iteration-count: 1, 1, 3;
  z-index: 5000;
}

@keyframes reduce-scale {
  from {
    scale: 5;
  }
  to {
    opacity: 1;
  }
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

.small-card .placeholder .icon {
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

  .small-card .card-value-badge,
  .small-card .card-ability-badge {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  .small-card .combat-type-badge {
    width: 26px;
    height: 26px;
    bottom: 3px;
  }
}
</style>
