<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineExpose({
  show,
  hide
})

const props = defineProps<{
  avatar?: string
  buttons?: []
  modelValue?: boolean
  title: string
}>()

let localModelValue = ref(false)
let resolvePromise = ref()
let rejectPromise = ref()

const avatarImg = computed(() => {
  return new URL(`../assets/images/${props.avatar}`, import.meta.url)
})

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
    <div v-if="localModelValue" class="modal">
      <slot>
        <div class="heading">
          <div v-if="avatar" class="avatar" :style="{ backgroundImage: `url(${avatarImg})` }"></div>
          <h1>{{ props.title }}</h1>
        </div>

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
