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
    :class="{ desktop: props.desktop, player: props.player }"
    :name="props.player ? 'card-preview-player' : 'card-preview-opponent'"
    tag="div"
  >
    <BigCard
      v-if="modelValue && props.card"
      :ability="props.card.ability"
      :ability-icon="props.card.abilityIcon"
      :default-value="props.card.defaultValue"
      :desktop="props.desktop"
      :faction="props.card.faction"
      :hero="props.card.hero"
      :image-url="props.card.imageUrl"
      :name="props.card.name"
      no-description
      :type-icon="props.card.typeIcon"
      :value="props.card.value"
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

/* Desktop Styles */

.card-preview.desktop.player {
  top: auto;
  bottom: 140px;
}
</style>
