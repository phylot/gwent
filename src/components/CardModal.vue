<script setup lang="ts">
import { useSlots } from 'vue'
const slots = useSlots()

defineProps<{
  modelValue: boolean
}>()
</script>

<template>
  <div v-if="modelValue" class="card-modal">
    <div class="card-modal-content">
      <div v-if="slots.header" class="card-modal-header">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style>
.card-modal {
  z-index: 3000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #ffffff;
}

.card-modal .card-modal-header {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background-color: #000000;
}

.card-modal .card-modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* background: radial-gradient(#000000, transparent); */
  background: rgb(0, 0, 0, 0.7);
}

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .card-modal .card-modal-header {
    padding: 15px;
    gap: 15px;
    border-radius: 8px;
  }
}
</style>
