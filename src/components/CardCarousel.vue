<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Card } from './../types'
import BigCard from './BigCard.vue'

const props = defineProps<{
  modelValue: number
  cards: Card[]
  desktop: boolean
  disabled: boolean
}>()

let localCards = ref(props.cards)

watch(
  () => props.cards,
  (val) => {
    localCards.value = val
  },
  { deep: true }
)

const emit = defineEmits<{
  (e: 'btn-click'): void
  (e: 'update:model-value', val: number): void
}>()

function changeSlide(back?: boolean) {
  let newIndex = back ? props.modelValue - 1 : props.modelValue + 1

  if (newIndex === props.cards.length) {
    newIndex = 0
  }
  if (newIndex < 0) {
    newIndex = props.cards.length - 1
  }
  emit('update:model-value', newIndex)
  emit('btn-click')
}
</script>

<template>
  <div class="card-carousel" :class="{ desktop: props.desktop }">
    <div class="slides">
      <BigCard
        v-for="(card, i) in localCards"
        :ability="card.ability"
        :ability-icon="card.abilityIcon"
        :animation-name="card.animationName"
        class="slide fade-in"
        :class="{ active: i === modelValue }"
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
      class="prev-btn"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled"
      role="button"
      tabindex="2"
      @click="props.disabled ? null : changeSlide(true)"
    >
      <v-icon class="icon" name="hi-chevron-left" />
    </button>
    <button
      class="next-btn"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled"
      role="button"
      tabindex="2"
      @click="props.disabled ? null : changeSlide()"
    >
      <v-icon class="icon" name="hi-chevron-right" />
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
}

.card-carousel .slides {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.card-carousel .slide {
  display: none;
}

.card-carousel .slide.active {
  display: block;
}

.card-carousel .prev-btn,
.card-carousel .next-btn {
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -25px;
  border: 1px solid #ffffff;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #000000;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.card-carousel .next-btn {
  left: auto;
  right: 0;
}

.card-carousel .prev-btn .icon,
.card-carousel .next-btn .icon {
  width: 20px;
  height: 20px;
}

.card-carousel .prev-btn .icon {
  margin-left: -2px;
}

.card-carousel .next-btn .icon {
  margin-right: -2px;
}

.card-carousel .prev-btn.disabled,
.card-carousel .prev-btn:disabled,
.card-carousel .next-btn.disabled,
.card-carousel .next-btn:disabled {
  transform: none !important;
  cursor: not-allowed;
}

.card-carousel .prev-btn:active,
.card-carousel .next-btn:active {
  transform: translate(0, 3px);
}

.card-carousel .prev-btn:focus:not(.disabled):not(:disabled),
.card-carousel .next-btn:focus:not(.disabled):not(:disabled) {
  outline: none;
  box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.2);
}

/* Hover animation on supported devices only */
@media (hover: hover) {
  .card-carousel .prev-btn:hover,
  .card-carousel .next-btn:hover {
    transform: scale(1.2);
  }

  .card-carousel .prev-btn:active,
  .card-carousel .next-btn:active {
    transform: translate(0, 3px) scale(1.2);
  }
}

/* Desktop Styles */

.card-carousel.desktop {
  width: 460px;
}

.card-carousel.desktop .prev-btn,
.card-carousel.desktop .next-btn {
  width: 70px;
  height: 70px;
  line-height: 70px;
  margin-top: -35px;
}

.card-carousel.desktop .prev-btn:focus:not(.disabled):not(:disabled),
.card-carousel.desktop .next-btn:focus:not(.disabled):not(:disabled) {
  outline: none;
  box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.2);
}

.card-carousel.desktop .prev-btn .icon,
.card-carousel.desktop .next-btn .icon {
  width: 30px;
  height: 30px;
}
</style>
