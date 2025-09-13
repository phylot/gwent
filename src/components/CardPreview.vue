<script setup lang="ts">
import { type Card } from './../types'
import BigCard from './BigCard.vue'

const props = defineProps<{
  card?: Card | undefined
  desktop?: boolean
  modelValue: boolean
  player?: boolean
}>()
</script>

<template>
  <TransitionGroup
    class="card-preview"
    :class="{ player: player }"
    :name="player ? 'card-preview-player' : 'card-preview-opponent'"
    tag="div"
  >
    <BigCard
      v-if="modelValue && card"
      :ability="card.ability"
      :ability-icon="card.abilityIcon"
      :default-value="card.defaultValue"
      :desktop="props.desktop"
      :faction="card.faction"
      :hero="card.hero"
      :image-url="card.imageUrl"
      :name="card.name"
      no-description
      :type-icon="card.typeIcon"
      :value="card.value"
    ></BigCard>
  </TransitionGroup>
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
  bottom: 100px;
}

.card-preview-player-enter-active,
.card-preview-opponent-enter-active {
  transition: all 0.8s cubic-bezier(0, 1, 0.62, 1);
}

.card-preview-player-leave-active,
.card-preview-opponent-leave-active {
  transition: all 0.5s cubic-bezier(0.45, 1, 0, 1);
}

.card-preview-player-enter-from {
  transform: translateX(-80px);
  opacity: 0;
}

.card-preview-player-leave-to {
  transform: translateX(80px);
  opacity: 0;
}

.card-preview-opponent-enter-from {
  transform: translateX(80px);
  opacity: 0;
}

.card-preview-opponent-leave-to {
  transform: translateX(-80px);
  opacity: 0;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
(min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .card-preview.player {
    top: auto;
    bottom: 140px;
  }
}
</style>
