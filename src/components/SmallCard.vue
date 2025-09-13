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
  isNew?: boolean
  name?: string
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
    'value-increased': props.valueIncreased,
    placeholder: !props.imageUrl
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
    :aria-label="name ?? ''"
    class="small-card"
    :class="smallCardClasses"
    @click="disabled ? null : $emit('card-click', $event)"
    @keyup.enter="disabled ? null : $emit('card-enter', $event)"
    @keyup.space="disabled ? null : $emit('card-space', $event)"
  >
    <div class="card-wrap">
      <div class="animation-overlay" :class="animationClass"></div>
      <div
        class="card"
        :class="cardClasses"
        :style="{
          backgroundImage: props.imageUrl
            ? `url(${props.imageUrl})`
            : 'radial-gradient(#56291a, #442014)'
        }"
      >
        <template v-if="props.imageUrl">
          <div v-if="defaultValue || defaultValue === 0" class="card-value-badge">
            {{ value }}
          </div>
          <div v-if="abilityIcon" class="card-ability-badge">
            <v-icon :name="abilityIcon" class="icon" />
          </div>
          <div v-if="typeIcon" class="combat-type-badge">
            <v-icon :name="typeIcon" class="icon" />
          </div>
        </template>
        <div v-else class="placeholder-content">
          <v-icon name="gi-sunflower" class="icon" />
        </div>
      </div>
    </div>

    <div v-if="isNew" class="new-pill"><div class="new-pill-content">NEW</div></div>
  </div>
</template>

<style>
.small-card {
  position: relative;
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
  z-index: 1;
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
  padding: 1px 1px 3px 1px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  border-radius: 4px;
  border: 1px solid #000000;
  box-sizing: border-box;
  background-position: center;
  background-size: cover;
  background-color: #000000;
  overflow: hidden;
}

.small-card .card-value-badge {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #191919;
  border-radius: 999px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  color: #000000;
  background-color: #ffffff;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.25) inset;
}

.small-card .card.increased .card-value-badge {
  color: #ffffff;
  border-color: #1fb854;
  background-color: #1a9f48;
}

.small-card .card.decreased .card-value-badge {
  color: #ffffff;
  border-color: #d92121;
  background-color: #9f1a1a;
}

.small-card .card.hero .card-value-badge {
  border-color: #be7500;
  color: #f9a825;
  background: linear-gradient(180deg, #000 0%, #404040 100%);
  box-shadow: none;
}

.small-card .card-ability-badge {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4e4e4;
  border-radius: 999px;
  box-sizing: border-box;
  color: #ffffff;
  background: linear-gradient(180deg, #000 0%, #404040 100%);
}

.small-card .card-ability-badge .icon {
  width: 14px;
  height: 14px;
}

.small-card.value-increased .card-value-badge {
  animation: 0.2s scale-pulse 5;
}

.small-card .combat-type-badge {
  width: 20px;
  height: 20px;
  margin-top: auto;
  display: flex;
  align-self: end;
  align-items: center;
  justify-content: center;
  border: 1px solid #92631e;
  border-radius: 999px;
  box-sizing: border-box;
  color: #000000;
  background: radial-gradient(50% 50% at 50% 50%, #f3c135 0%, #dd8511 100%);
}

.small-card .combat-type-badge .icon {
  width: 14px;
  height: 14px;
}

.small-card .new-pill {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 2px;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  background-image: linear-gradient(to right, #f44bd5 0%, #c8d1ff 100%);
  border-radius: 999px;
}

.small-card .new-pill .new-pill-content {
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 999px;
  background-color: #000000;
}

.small-card.appear-animation {
  animation-name: fade-in, reduce-scale, small-shake;
  animation-delay: 0s, 0s, 0.25s;
  animation-duration: 0.2s, 0.2s, 0.1s;
  animation-iteration-count: 1, 1, 3;
  z-index: 6000;
}

@keyframes reduce-scale {
  from {
    scale: 3;
  }
  to {
    opacity: 1;
  }
}

.small-card.placeholder .card {
  border: 1px solid #7c4a1a;
}

.small-card.placeholder .placeholder-content {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #7c4a1a;
}

.small-card.placeholder .placeholder-content .icon {
  width: 23px;
  height: 23px;
  color: #7c4a1a;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .small-card {
    height: 110px;
  }

  .small-card .card-wrap {
    width: 84px;
  }

  .small-card .card {
    padding: 2px 2px 5px 2px;
    gap: 3px;
  }

  .small-card .card-value-badge {
    width: 28px;
    height: 28px;
    font-size: 16px;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.25) inset;
  }

  .small-card .card-ability-badge {
    width: 28px;
    height: 28px;
  }

  .small-card .card-ability-badge .icon {
    width: 20px;
    height: 20px;
  }

  .small-card .combat-type-badge {
    width: 28px;
    height: 28px;
  }

  .small-card .combat-type-badge .icon {
    width: 20px;
    height: 20px;
  }

  .small-card .new-pill {
    padding: 3px;
    font-size: 12px;
  }

  .small-card .new-pill .new-pill-content {
    padding: 4px 7px;
    font-size: 12px;
  }

  .small-card.placeholder .placeholder-content .icon {
    width: 39px;
    height: 39px;
  }
}
</style>
