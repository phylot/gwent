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

const emit = defineEmits<{
  (e: 'btn-click'): void
  (e: 'update:model-value', val: number): void
}>()

const localCards = ref(props.cards)
const internalModelChange = ref(false)

watch(
  () => props.cards,
  (val) => {
    localCards.value = val
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (newIndex, oldIndex) => {
    if (oldIndex === undefined || newIndex === oldIndex) {
      return
    }

    // changeSlide() has already determined the direction.
    // Don't overwrite it when the model update comes from here.
    if (internalModelChange.value) {
      internalModelChange.value = false
      return
    }

    // External change, e.g. handCardClick().
    // Treat increasing indexes as moving left through the carousel,
    // and decreasing indexes as moving right.
    transitionName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'

    isTransitioning.value = true
  }
)

// Direction of the next animation.
// 'left' means current card leaves left and new card enters from right.
// 'right' means current card leaves right and new card enters from left.
const transitionName = ref('slide-left')

// Prevent another navigation while the current animation is running.
const isTransitioning = ref(false)

// Drag state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragDistance = ref(0)

const DRAG_THRESHOLD = 50

function changeSlide(back = false) {
  if (props.disabled || isTransitioning.value || localCards.value.length <= 1) {
    return
  }

  transitionName.value = back ? 'slide-right' : 'slide-left'

  let newIndex = back ? props.modelValue - 1 : props.modelValue + 1

  if (newIndex === localCards.value.length) {
    newIndex = 0
  }

  if (newIndex < 0) {
    newIndex = localCards.value.length - 1
  }

  isTransitioning.value = true
  internalModelChange.value = true

  emit('update:model-value', newIndex)
  emit('btn-click')
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled || isTransitioning.value || localCards.value.length <= 1) {
    return
  }

  isDragging.value = true
  dragStartX.value = event.clientX
  dragDistance.value = 0

  const currentTarget = event.currentTarget as HTMLElement
  currentTarget.setPointerCapture(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  dragDistance.value = event.clientX - dragStartX.value
}

function handlePointerUp(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  const distance = dragDistance.value

  isDragging.value = false
  dragDistance.value = 0

  const currentTarget = event.currentTarget as HTMLElement

  if (currentTarget.hasPointerCapture(event.pointerId)) {
    currentTarget.releasePointerCapture(event.pointerId)
  }

  if (Math.abs(distance) < DRAG_THRESHOLD) {
    return
  }

  // Drag left = next card
  // Drag right = previous card
  if (distance < 0) {
    changeSlide(false)
  } else {
    changeSlide(true)
  }
}

function handlePointerCancel(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  isDragging.value = false
  dragDistance.value = 0

  const currentTarget = event.currentTarget as HTMLElement

  if (currentTarget.hasPointerCapture(event.pointerId)) {
    currentTarget.releasePointerCapture(event.pointerId)
  }
}
</script>

<template>
  <div class="card-carousel" :class="{ desktop: props.desktop }">
    <div
      class="slides"
      :class="{ dragging: isDragging }"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
    >
      <Transition
        :name="transitionName"
        @after-enter="isTransitioning = false"
        @enter-cancelled="isTransitioning = false"
        @leave-cancelled="isTransitioning = false"
      >
        <BigCard
          v-if="localCards[modelValue]"
          :key="modelValue"
          :ability="localCards[modelValue].ability"
          :ability-icon="localCards[modelValue].abilityIcon"
          :animation-name="localCards[modelValue].animationName"
          :bitten="localCards[modelValue].bitten"
          class="slide"
          :default-value="localCards[modelValue].defaultValue"
          :description="localCards[modelValue].description"
          :desktop="props.desktop"
          :faction="localCards[modelValue].faction"
          :hero="localCards[modelValue].hero"
          :image-url="localCards[modelValue].imageUrl"
          :name="localCards[modelValue].name"
          :type-icon="localCards[modelValue].typeIcon"
          :value="localCards[modelValue].value"
        />
      </Transition>
    </div>

    <button
      class="prev-btn"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled"
      tabindex="2"
      type="button"
      @click="changeSlide(true)"
    >
      <v-icon class="icon" name="hi-chevron-left" />
    </button>

    <button
      class="next-btn"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled"
      tabindex="2"
      type="button"
      @click="changeSlide()"
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
  display: grid;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-items: center;
  overflow: hidden;
  touch-action: pan-y;
  cursor: grab;
}

.card-carousel .slides.dragging {
  cursor: grabbing;
}

.card-carousel .slide {
  grid-area: 1 / 1;
}

/*
 * Vue transition structure:
 *
 * Right navigation:
 *   current card: leaves to the left
 *   next card:    enters from the right
 *
 * Left navigation:
 *   current card: leaves to the right
 *   next card:    enters from the left
 */

.card-carousel .slide-left-enter-active,
.card-carousel .slide-left-leave-active,
.card-carousel .slide-right-enter-active,
.card-carousel .slide-right-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* Next card: enter from the right */
.card-carousel .slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

/* Current card: leave to the left */
.card-carousel .slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Previous card: enter from the left */
.card-carousel .slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

/* Current card: leave to the right */
.card-carousel .slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
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
