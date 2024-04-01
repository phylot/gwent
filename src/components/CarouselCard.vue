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
      <h3 v-html="props.name" class="title"></h3>
      <p v-if="props.description" v-html="props.description" class="description"></p>
    </div>
  </div>
</template>

<style>
/* Carousel Card */

.carousel-card {
  height: 310px;
  overflow: hidden;
}

.carousel-card .card-wrap {
  width: 150px;
  height: 200px;
  margin: 0 auto;
  box-sizing: content-box;
  border-radius: 8px;
}

.carousel-card .card-border {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #ffffff;
  border-radius: 8px;
  background-color: #000000;
}

.carousel-card .card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 5px solid #000000;
  border-radius: 8px;
}

.carousel-card .card-stat-badge {
  width: 30px;
  height: 30px;
  font-size: 18px;
}

.carousel-card .card-stat-badge.value,
.carousel-card .card-stat-badge.ability {
  margin-top: 2px;
  margin-left: 2px;
}

.carousel-card .card-stat-badge.type {
  bottom: 4px;
  right: 2px;
}

.carousel-card .carousel-card-details {
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  line-height: 14px;
  color: #ffffff;
  background-color: #000000;
}

.carousel-card .carousel-card-details .description {
  margin-top: 10px;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .carousel-card {
    height: 490px;
  }

  .carousel-card .card-wrap {
    width: 250px;
    height: 350px;
  }

  .carousel-card .card-border {
    border-radius: 10px;
  }

  .carousel-card .card {
    border: 8px solid #000000;
    border-radius: 10px;
  }

  .carousel-card .card-stat-badge {
    width: 50px;
    height: 50px;
    font-size: 30px;
  }

  .carousel-card .card-stat-badge.value,
  .carousel-card .card-stat-badge.ability {
    margin-top: 5px;
    margin-left: 5px;
  }

  .carousel-card .card-stat-badge.type {
    bottom: 10px;
    right: 5px;
  }

  .carousel-card .carousel-card-details {
    padding: 15px;
    text-align: center;
    line-height: 22px;
    color: #ffffff;
    background-color: #000000;
  }

  .carousel-card .carousel-card-details .description {
    margin-top: 15px;
  }
}
</style>
