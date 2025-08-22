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
  glow?: boolean
  hero?: boolean
  imageUrl: string | undefined
  name?: string
  noDescription?: boolean
  typeIcon?: string
  value?: number
}>()

const animationClass = computed(() => {
  return props.animationName ?? null
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
  <div class="big-card" :class="{ 'no-description': props.noDescription }">
    <div class="card-wrap" :class="{ glow: props.glow }">
      <div class="animation-overlay" :class="animationClass"></div>
      <div class="card-border" :class="cardBorderClasses">
        <div
          class="card"
          :class="cardClasses"
          :style="{ backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : 'none' }"
        >
          <template v-if="props.imageUrl">
            <div v-if="defaultValue || defaultValue === 0" class="card-value-badge">
              {{ value }}
            </div>
            <div v-if="abilityIcon" class="card-ability-badge">
              <v-icon :name="abilityIcon" class="icon" :scale="desktop ? 2 : 1.2" />
            </div>
            <div v-if="typeIcon" class="combat-type-badge">
              <v-icon :name="typeIcon" class="icon" :scale="desktop ? 2 : 1.2" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <div v-if="!props.noDescription" class="big-card-details">
      <h3 v-if="props.name" v-html="props.name" class="title"></h3>
      <p v-if="props.description" v-html="props.description" class="description"></p>
    </div>
  </div>
</template>

<style>
.big-card {
  height: 300px;
}

.big-card.no-description {
  height: 200px;
}

.big-card .card-wrap {
  position: relative;
  width: 150px;
  height: 200px;
  margin: 0 auto;
  box-sizing: content-box;
  border-radius: 8px;
  overflow: hidden;
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
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1px;
  border: 1px solid #000000;
  box-sizing: border-box;
  background-position: center;
  background-size: cover;
  background-color: #000000;
  overflow: hidden;
}

.big-card .card-value-badge {
  width: 30px;
  height: 30px;
  margin: 2px 0 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000000;
  border-radius: 999px;
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  background-color: #ffffff;
}

.big-card .card.increased .card-value-badge,
.big-card .card.decreased .card-value-badge {
  border-color: #ffffff;
  font-weight: bold;
  color: #ffffff;
}

.big-card .card.increased .card-value-badge {
  background-color: #24871a;
}

.big-card .card.decreased .card-value-badge {
  background-color: #e51715;
}

.big-card .card.hero .card-value-badge {
  border-style: dotted;
  border-color: #f9a825;
  color: #f9a825;
  background-color: #000000;
}

.big-card .card-ability-badge {
  width: 30px;
  height: 30px;
  margin: 2px 0 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  border-radius: 999px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  background-color: #000000;
}

.big-card .combat-type-badge {
  position: absolute;
  width: 30px;
  height: 30px;
  bottom: 4px;
  right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #775022;
  border-radius: 999px;
  color: #000000;
  background-color: #c9883a;
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

  .big-card.no-description {
    height: 350px;
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

  .big-card .card-value-badge,
  .big-card .card-ability-badge {
    width: 50px;
    height: 50px;
    margin: 5px 0 0 5px;
    font-size: 30px;
  }

  .big-card .combat-type-badge {
    bottom: 10px;
    right: 5px;
    width: 50px;
    height: 50px;
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
