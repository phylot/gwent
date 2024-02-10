<script setup lang="ts">
import { ref, watch } from 'vue'

defineExpose({
  show,
  hide
})

const props = defineProps<{
  avatar?: string
  buttons?: []
  desktop?: boolean
  icon?: string
  modelValue?: boolean
  title: string
}>()

let localModelValue = ref(false)
let resolvePromise = ref()
let rejectPromise = ref()

watch(
  () => props.modelValue,
  (val) => {
    localModelValue.value = val
  }
)

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
    <div v-if="localModelValue" class="modal" role="dialog">
      <slot>
        <div class="heading">
          <div v-if="avatar" class="avatar" :style="{ backgroundImage: `url(${props.avatar})` }"></div>
          <v-icon v-if="icon" :name="icon" class="icon" :scale="desktop ? 3 : 1.5" />
          <h2>{{ props.title }}</h2>
        </div>

        <div v-if="props.buttons" class="btn-container">
          <button
            v-for="(button, i) in buttons"
            class="btn large"
            :class="{ primary: i === 0 }"
            @click="
              resolvePromise(i + 1);
              hide();
            "
            @keydown.enter="
              resolvePromise(i + 1);
              hide();
            "
          >
            {{ button }}
          </button>
        </div>
      </slot>
    </div>
  </transition>
</template>
