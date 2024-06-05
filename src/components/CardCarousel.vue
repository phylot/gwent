<script setup lang="ts">
import { type Card } from './../types'
import BigCard from './BigCard.vue'

const props = defineProps<{
  cards: Card[]
  desktop: boolean
  disabled: boolean
}>()

// EVENTS

const emit = defineEmits<{
  (e: 'prev-click', val: number): void
  (e: 'next-click', val: number): void
}>()
</script>

<template>
  <div class="card-carousel">
    <div class="slides">
      <BigCard
        v-for="(card, i) in cards"
        :ability="card.ability"
        :ability-icon="card.abilityIcon"
        :animation-name="card.animationName"
        class="slide fade-in"
        :class="{ active: card.active }"
        :default-value="card.defaultValue"
        :description="card.description"
        :desktop="props.desktop"
        :faction="card.faction"
        :hero="card.hero"
        :image-url="card.imageUrl"
        :name="card.name"
        tabindex="2"
        :type-icon="card.typeIcon"
        :value="card.value"
        :key="i"
      >
      </BigCard>
    </div>
    <button
      class="prev-btn no-mobile-highlight"
      :class="{ disabled: disabled }"
      :disabled="disabled"
      role="button"
      tabindex="2"
      @click="disabled ? null : emit('prev-click', -1)"
    >
      <v-icon name="hi-chevron-left" class="icon" :scale="props.desktop ? 1.5 : 1" />
    </button>
    <button
      class="next-btn no-mobile-highlight"
      :class="{ disabled: disabled }"
      :disabled="disabled"
      role="button"
      tabindex="2"
      @click="disabled ? null : emit('next-click', 1)"
    >
      <v-icon name="hi-chevron-right" class="icon" :scale="props.desktop ? 1.5 : 1" />
    </button>
  </div>
</template>

<style>
.card-carousel {
  position: relative;
  display: flex;
  width: 300px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.slides {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.slide {
  display: none;
}

.slide.active {
  display: block;
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -25px;
  border: 2px solid black;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #000000;
}

.next-btn {
  left: auto;
  right: 0;
}

.prev-btn.disabled,
.next-btn.disabled {
  transform: none !important;
}

.prev-btn:active,
.next-btn:active {
  transform: translate(0, 3px);
}

.prev-btn:focus:not(.disabled),
.next-btn:focus:not(.disabled) {
  outline: none;
  box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.2);
}

.prev-btn .icon {
  margin-left: -2px;
}

.next-btn .icon {
  margin-right: -2px;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
(min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .prev-btn:focus:not(.disabled),
  .next-btn:focus:not(.disabled) {
    outline: none;
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.2);
  }
}
</style>
