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

const cardBorderClasses = computed(() => {
  return {
    [String(props.faction)]: props.faction,
    hero: props.hero
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
  <div class="big-card">
    <div class="card-wrap">
      <div class="animation-overlay" :class="animationClass"></div>
      <div class="card-border" :class="cardBorderClasses">
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

    <div class="big-card-details">
      <h3 v-html="props.name" class="title"></h3>
      <p v-if="props.description" v-html="props.description" class="description"></p>
    </div>
  </div>
</template>

<style>
.big-card {
  height: 300px;
  overflow: hidden;
}

.big-card .card-wrap {
  width: 150px;
  height: 200px;
  margin: 0 auto;
  box-sizing: content-box;
  border-radius: 8px;
}

.big-card .card-border {
  width: 100%;
  height: 100%;
  padding: 6px;
  box-sizing: border-box;
  border: 2px solid #000000;
  border-radius: 8px;
  background-color: #000000;
}

.big-card .card-border.british {
  background: linear-gradient(#e0452b, #bc1708);
}

.big-card .card-border.french {
  background: linear-gradient(#1d7eca, #0a66ae);
}

.big-card .card-border.hero {
  background: linear-gradient(#d98c0e, #a86c0b);
}

.big-card .card {
  width: 100%;
  height: 100%;
  border-radius: 1px;
  border: 1px solid #000000;
  background-color: #000000;
}

.big-card .card-stat-badge {
  width: 30px;
  height: 30px;
  font-size: 18px;
}

.big-card .card-stat-badge.value,
.big-card .card-stat-badge.ability {
  margin-top: 2px;
  margin-left: 2px;
}

.big-card .card-stat-badge.type {
  bottom: 4px;
  right: 2px;
}

.big-card .big-card-details {
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  line-height: 14px;
  color: #ffffff;
  border-radius: 4px;
  background-color: #000000;
}

.big-card .big-card-details .description {
  margin-top: 10px;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .big-card {
    height: 490px;
  }

  .big-card .card-wrap {
    width: 250px;
    height: 350px;
  }

  .big-card .card-border {
    padding: 9px;
    border: 3px solid #000000;
    border-radius: 10px;
  }

  .big-card .card {
    border: 2px solid #000000;
    border-radius: 2px;
  }

  .big-card .card-stat-badge {
    width: 50px;
    height: 50px;
    font-size: 30px;
  }

  .big-card .card-stat-badge.value,
  .big-card .card-stat-badge.ability {
    margin-top: 5px;
    margin-left: 5px;
  }

  .big-card .card-stat-badge.type {
    bottom: 10px;
    right: 5px;
  }

  .big-card .big-card-details {
    padding: 15px;
    text-align: center;
    line-height: 22px;
    color: #ffffff;
    border-radius: 8px;
    background-color: #000000;
  }

  .big-card .carousel-card-details .description {
    margin-top: 15px;
  }
}
</style>
