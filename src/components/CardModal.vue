<script setup lang="ts">
import { useSlots } from 'vue'
const slots = useSlots()

const props = defineProps<{
  desktop?: boolean
  modelValue: boolean
}>()
</script>

<template>
  <div v-if="modelValue" class="card-modal" :class="{ desktop: props.desktop }" role="dialog">
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
  gap: 8px;
  /* background: radial-gradient(#000000, transparent); */
  background: rgb(0, 0, 0, 0.7);
}

.card-modal.desktop .card-modal-content {
  gap: 10px;
}

.card-modal.desktop .card-modal-header {
  padding: 15px;
  gap: 15px;
  border-radius: 8px;
}
</style>
