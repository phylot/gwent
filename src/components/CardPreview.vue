<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Card } from './../types'
import BigCard from './BigCard.vue'

const props = defineProps<{
  card?: Card | undefined
  desktop?: boolean
  modelValue: boolean
  player?: boolean
}>()

let animate = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      setTimeout(() => {
        animate.value = true
      }, 10)
    } else {
      animate.value = false
    }
  }
)
</script>

<template>
  <div :class="{ player: player }" class="card-preview">
    <BigCard
      v-if="modelValue && card"
      :ability="card.ability"
      :ability-icon="card.abilityIcon"
      :class="{ animate: animate }"
      class="card-preview-card"
      :default-value="card.defaultValue"
      :desktop="props.desktop"
      :faction="card.faction"
      :hero="card.hero"
      :image-url="card.imageUrl"
      :type-icon="card.typeIcon"
      :value="card.value"
    ></BigCard>
  </div>
</template>

<style>
.card-preview {
  z-index: 3000;
  position: absolute;
  top: 30px;
  bottom: auto;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-preview.player {
  top: auto;
  bottom: 30px;
}

.card-preview-card {
  opacity: 0;
  transform: translateX(100px);
}

.player .card-preview-card {
  transform: translateX(-100px);
}

.card-preview-card.animate {
  transform: translateX(-100px);
  transition: all 1.2s cubic-bezier(0.27, 0.9, 0.76, 0.1);
  animation: fadein-pause-out 1.2s linear forwards;
}

.player .card-preview-card.animate {
  transform: translateX(100px);
}

@keyframes fadein-pause-out {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
