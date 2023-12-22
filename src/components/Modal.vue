<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: boolean
  buttons?: []
  title: string
}>()

defineExpose({
  show,
  hide
})

watch(
  () => props.modelValue,
  (val) => {
    localModelValue.value = val
  }
)

let localModelValue = ref(false)
let resolvePromise = ref()
let rejectPromise = ref()
function show() {
  return new Promise((resolve, reject) => {
    localModelValue.value = true
    resolvePromise.value = resolve
    rejectPromise.value = reject
  })
}
function hide() {
  localModelValue.value = false
}
</script>

<template>
  <transition name="fade">
    <div v-if="localModelValue" class="modal">
      <slot>
        <h1>{{ props.title }}</h1>
        <div v-if="props.buttons" class="btn-container">
          <button
            v-for="(button, i) in buttons"
            class="btn"
            :class="{ primary: i === 0 }"
            @click="
              resolvePromise(i + 1);
              localModelValue = false;
            "
            @keydown.enter="
              resolvePromise(i + 1);
              localModelValue = false;
            "
          >
            {{ button }}
          </button>
        </div>
      </slot>
    </div>
  </transition>
</template>
