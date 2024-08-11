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
    :class="{ 'player': player }"
    :name="player ? 'player-card-preview-fade' : 'opponent-card-preview-fade'"
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
      :type-icon="card.typeIcon"
      :value="card.value"
    >
    </BigCard>
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.card-preview.player {
  top: auto;
  bottom: 30px;
  justify-content: end;
}

.opponent-card-preview-fade-enter-active {
  transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.35);
}
.opponent-card-preview-fade-leave-active {
  transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.35);
}
.opponent-card-preview-fade-enter-from {
  transform: translateX(120px);
  opacity: 0;
}
.opponent-card-preview-fade-leave-to {
  transform: translateX(-120px);
  opacity: 0;
}

.player-card-preview-fade-enter-active {
  transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.35);
}
.player-card-preview-fade-leave-active {
  transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.35);
}
.player-card-preview-fade-enter-from {
  transform: translateX(-120px);
  opacity: 0;
}
.player-card-preview-fade-leave-to {
  transform: translateX(120px);
  opacity: 0;
}
</style>
