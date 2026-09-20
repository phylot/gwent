<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  desktop?: boolean
  label: string
  iconFalse?: string
  iconTrue?: string
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:model-value', val: number): void
}>()

const sliderBar = ref<HTMLElement | null>(null)
const sliderStep = 0.05

const isMuted = computed(() => props.modelValue === 0)
const sliderPercentage = computed(() => props.modelValue * 100)

function toggleVolume() {
  emit('update:model-value', isMuted.value ? 1 : 0)
}

function updateSlider(event: PointerEvent) {
  if (!sliderBar.value) return
  const rect = sliderBar.value.getBoundingClientRect()
  let value = (event.clientX - rect.left) / rect.width
  value = Math.max(0, Math.min(1, value))
  emit('update:model-value', value)
}

function startDragging(event: PointerEvent) {
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)
  updateSlider(event)
}

function drag(event: PointerEvent) {
  const handle = event.currentTarget as HTMLElement
  if (!handle.hasPointerCapture(event.pointerId)) return
  updateSlider(event)
}

function stopDragging(event: PointerEvent) {
  const handle = event.currentTarget as HTMLElement
  if (handle.hasPointerCapture(event.pointerId)) {
    handle.releasePointerCapture(event.pointerId)
  }
}

function handleKeydown(event: KeyboardEvent) {
  let value = props.modelValue

  switch (event.key) {
    case 'ArrowLeft':
      value -= sliderStep
      break

    case 'ArrowRight':
      value += sliderStep
      break

    case 'Home':
      value = 0
      break

    case 'End':
      value = 1
      break

    default:
      return
  }

  event.preventDefault()

  value = Math.max(0, Math.min(1, value))

  emit('update:model-value', value)
}
</script>

<template>
  <div class="setting-slider" :class="{ desktop: props.desktop }">
    <button
      :aria-label="`Toggle ${label}`"
      :aria-pressed="isMuted"
      class="setting-slider-btn"
      @click="toggleVolume"
    >
      <v-icon class="setting-slider-btn-icon" :name="isMuted ? iconFalse : iconTrue" />
    </button>

    <div class="setting-slider-label">{{ label }}</div>

    <div ref="sliderBar" class="slider-bar" @pointerdown="updateSlider">
      <div class="slider-bar-fill" :style="{ width: `${sliderPercentage}%` }"></div>
      <button
        :aria-label="`${label} volume`"
        :aria-valuemax="1"
        :aria-valuemin="0"
        :aria-valuenow="modelValue"
        class="slider-bar-handle"
        role="slider"
        type="button"
        @keydown="handleKeydown"
        @pointercancel="stopDragging"
        @pointerdown.stop="startDragging"
        @pointermove="drag"
        @pointerup="stopDragging"
      ></button>
    </div>
  </div>
</template>

<style>
.setting-slider {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-slider .setting-slider-btn {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
  border-radius: 999px;
  color: #ffffff;
  background-color: #000000;
  cursor: pointer;
  transition: background-color 100ms ease-out, box-shadow 100ms ease-out;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.setting-slider .setting-slider-btn:hover:not(:disabled) {
  background-color: #191919;
}

.setting-slider .setting-slider-btn:focus {
  outline: none;
  box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.2);
}

.setting-slider .setting-slider-btn .setting-slider-btn-icon {
  width: 20px;
  height: 20px;
}

.setting-slider .setting-slider-label {
  width: 60px;
  font-size: 14px;
  font-weight: 700;
}

.setting-slider .slider-bar {
  position: relative;
  height: 12px;
  margin-right: 10px;
  flex: 1;
  border: 4px solid #000;
  border-radius: 999px;
  background-color: #000;
  cursor: pointer;
  touch-action: none;
}
.setting-slider .slider-bar .slider-bar-fill {
  height: 100%;
  border-radius: 999px;
  background-color: #fff;
  pointer-events: none;
}
.setting-slider .slider-bar .slider-bar-handle {
  position: absolute;
  top: 50%;
  left: v-bind('`${sliderPercentage}%`');
  width: 30px;
  height: 30px;
  padding: 0;
  border: 4px solid #000000;
  border-radius: 50%;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
  cursor: grab;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.setting-slider .slider-bar .slider-bar-handle:active {
  cursor: grabbing;
}
.setting-slider .slider-bar .slider-bar-handle:focus {
  outline: none;
  box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.2);
}

.setting-slider.desktop {
  gap: 15px;
}

.setting-slider.desktop .setting-slider-btn {
  width: 50px;
  height: 50px;
}

.setting-slider.desktop .setting-slider-btn .setting-slider-btn-icon {
  width: 30px;
  height: 30px;
}

.setting-slider.desktop .setting-slider-label {
  width: 80px;
  font-size: 20px;
}

.setting-slider.desktop .slider-bar {
  height: 16px;
  border-width: 5px;
}

.setting-slider.desktop .slider-bar .slider-bar-handle {
  width: 40px;
  height: 40px;
  border-width: 5px;
}
</style>
