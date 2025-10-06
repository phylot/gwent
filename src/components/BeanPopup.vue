<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  desktop?: boolean
  modelValue: boolean
}>()

let localModelValue = ref(false)
let showPopup = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localModelValue.value = val
      setTimeout(() => {
        showPopup.value = val
      }, 1)
    } else {
      showPopup.value = val

      setTimeout(() => {
        localModelValue.value = false
      }, 200)
    }
  }
)
</script>

<template>
  <div
    v-if="localModelValue"
    class="bean-popup"
    :class="{ active: showPopup, desktop: props.desktop }"
  ></div>
</template>

<style>
.bean-popup {
  z-index: 6500;
  position: absolute;
  bottom: 0;
  right: -144px;
  width: 144px;
  height: 170px;
  background: center / cover no-repeat url('/src/assets/images/sharpe-cutout.png');
  transition: transform 0.2s cubic-bezier(0.82, 0.085, 0.395, 0.895);
}

.bean-popup.active {
  transform: translateX(-124px);
}

.bean-popup.desktop {
  right: -254px;
  width: 254px;
  height: 300px;
}

.bean-popup.desktop.active {
  transform: translateX(-254px);
}
</style>
