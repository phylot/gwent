<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  ability?: string
  abilityIcon?: string
  animationName?: string
  bitten?: boolean
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

const computedClasses = computed(() => {
  return {
    [String(props.animationName)]: props.animationName,
    decreased:
      ((props.value || props.value === 0) &&
        props.defaultValue &&
        props.value < props.defaultValue) ||
      props.bitten,
    desktop: props.desktop,
    [String(props.faction)]: props.faction,
    glow: props.glow,
    hero: props.hero,
    increased:
      (props.value || props.value === 0) && props.defaultValue && props.value > props.defaultValue,
    'no-description': props.noDescription
  }
})
</script>

<template>
  <div :aria-label="name ?? ''" class="big-card" :class="computedClasses">
    <div class="card-wrap">
      <div class="animation-overlay"></div>
      <div class="card-border">
        <div
          class="card"
          :style="{ backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : 'none' }"
        >
          <template v-if="props.imageUrl">
            <div v-if="defaultValue || defaultValue === 0" class="card-value-badge">
              {{ value }}
            </div>
            <div v-if="abilityIcon" class="card-ability-badge">
              <v-icon class="icon" :name="abilityIcon" />
            </div>
            <div v-if="typeIcon" class="combat-type-badge">
              <v-icon class="icon" :name="typeIcon" />
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

.big-card.glow .card-wrap {
  animation: white-glow 2s infinite alternate;
}

@keyframes white-glow {
  from {
    box-shadow: 0 0 10px 3px rgb(255, 255, 255, 0.5);
  }
  to {
    box-shadow: 0 0 10px 10px rgb(255, 255, 255, 0.5);
  }
}

.big-card .animation-overlay {
  z-index: 100;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  background-position: center;
  background-size: cover;
}

.big-card.white-fade-in .animation-overlay {
  display: block;
  animation-name: fade-in;
  animation-duration: 0.4s;
  animation-timing-function: ease-out;
  background: #fff;
}

.big-card.white-fade-out .animation-overlay {
  display: block;
  animation-name: fade-out;
  animation-duration: 0.4s;
  animation-timing-function: ease-in;
  background: #fff;
}

.big-card.shine .animation-overlay {
  display: block;
  background: #fff;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(255, 255, 255, 0)),
    color-stop(50%, rgba(255, 255, 255, 0.8)),
    to(rgba(255, 255, 255, 0))
  );
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transform: skew(30deg);
  animation: shine 0.5s linear 1;
}

.big-card.shine-infinite .animation-overlay {
  display: block;
  background: #fff;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(255, 255, 255, 0)),
    color-stop(50%, rgba(255, 255, 255, 0.8)),
    to(rgba(255, 255, 255, 0))
  );
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transform: skew(30deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -50%;
    opacity: 0;
  }
  50% {
    left: 25%;
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
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

.big-card.british .card-border {
  background: linear-gradient(#c41a0a, #640d05);
}

.big-card.french .card-border {
  background: linear-gradient(#1d7eca, #04365e);
}

.big-card.undead .card-border {
  background: linear-gradient(#4bc40a, #045625);
}

.big-card.hero .card-border {
  background: linear-gradient(#d98c0e, #533503);
}

.big-card .card {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5px 5px 8px 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  border-radius: 1px;
  border: 1px solid #000000;
  box-sizing: border-box;
  background-position: center;
  background-size: cover;
  background-color: #000000;
  overflow: hidden;
}

.big-card .card-value-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000000;
  border-radius: 999px;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
  color: #000000;
  background-color: #ffffff;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.25) inset;
}

.big-card.increased .card-value-badge {
  color: #ffffff;
  border-color: #1fb854;
  background-color: #1a9f48;
}

.big-card.decreased .card-value-badge {
  color: #ffffff;
  border-color: #d92121;
  background-color: #9f1a1a;
}

.big-card.hero .card-value-badge {
  border-color: #be7500;
  color: #f9a825;
  background: linear-gradient(180deg, #000 0%, #404040 100%);
  box-shadow: none;
}

.big-card .card-ability-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4e4e4;
  border-radius: 999px;
  box-sizing: border-box;
  color: #ffffff;
  background: linear-gradient(180deg, #000 0%, #404040 100%);
}

.big-card .card-ability-badge .icon {
  width: 22px;
  height: 22px;
}

.big-card .combat-type-badge {
  width: 32px;
  height: 32px;
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

.big-card .combat-type-badge .icon {
  width: 22px;
  height: 22px;
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

.big-card .big-card-details .title {
  font-size: 12px;
}

.big-card .big-card-details .description {
  margin-top: 10px;
  font-size: 11px;
}

/* Desktop Styles */

.big-card.desktop {
  height: 490px;
}

.big-card.desktop.no-description {
  height: 350px;
}

.big-card.desktop .card-wrap {
  width: 250px;
  height: 350px;
}

.big-card.desktop .card-border {
  padding: 9px;
  border: 3px solid #000000;
  border-radius: 10px;
}

.big-card.desktop .card {
  padding: 8px 8px 12px 8px;
  gap: 5px;
  border: 2px solid #000000;
  border-radius: 2px;
}

.big-card.desktop .card-value-badge {
  width: 50px;
  height: 50px;
  border-width: 2px;
  font-size: 30px;
  box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.25) inset;
}

.big-card.desktop .card-ability-badge {
  width: 50px;
  height: 50px;
  border-width: 2px;
}

.big-card.desktop .card-ability-badge .icon {
  width: 34px;
  height: 34px;
}

.big-card.desktop .combat-type-badge {
  width: 50px;
  height: 50px;
  border-width: 2px;
}

.big-card.desktop .combat-type-badge .icon {
  width: 34px;
  height: 34px;
}

.big-card.desktop .big-card-details {
  padding: 15px;
  text-align: center;
  line-height: 22px;
  color: #ffffff;
  border-radius: 8px;
  background-color: #000000;
}

.big-card.desktop .big-card-details .title {
  font-size: 18px;
}

.big-card.desktop .big-card-details .description {
  margin-top: 15px;
  font-size: 14px;
}
</style>
