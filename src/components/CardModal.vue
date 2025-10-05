<script setup lang="ts">
import { ref, useSlots } from 'vue'
const slots = useSlots()

defineExpose({
  show
})

const props = defineProps<{
  cancelText?: string
  confirmText?: string
  desktop?: boolean
  disabled?: boolean
  modelValue: boolean
  persistent?: boolean
}>()

let resolvePromise = ref()
let rejectPromise = ref()

const emit = defineEmits<{
  (e: 'update:model-value', val: boolean): void
}>()

function show() {
  return new Promise((resolve, reject) => {
    emit('update:model-value', true)
    resolvePromise.value = resolve
    rejectPromise.value = reject
  })
}
</script>

<template>
  <div v-if="modelValue" class="card-modal" :class="{ desktop: props.desktop }" role="dialog">
    <div class="card-modal-content" @click.self="props.persistent ? null : resolvePromise(false)">
      <div v-if="slots.header" class="card-modal-header">
        <slot name="header"></slot>
      </div>

      <slot></slot>

      <button
        v-if="props.confirmText"
        class="btn primary"
        :class="{ large: props.desktop }"
        :disabled="props.disabled"
        tabindex="2"
        type="button"
        @click="resolvePromise(true)"
      >
        {{ props.confirmText }}
      </button>
      <button
        v-if="props.cancelText"
        class="btn"
        :class="{ large: props.desktop }"
        :disabled="props.disabled"
        tabindex="2"
        type="button"
        @click="resolvePromise(false)"
      >
        {{ props.cancelText }}
      </button>
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
