<script setup lang="ts">
import { ref, watch } from 'vue'

defineExpose({
  show,
  hide
})

const props = defineProps<{
  avatar?: string
  buttons?: string[]
  desktop?: boolean
  icon?: string
  modelValue?: boolean
  noPrimary?: boolean
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
  <transition name="fast-fade">
    <div v-if="localModelValue" class="standard-modal" role="dialog">
      <div class="modal">
        <div v-if="props.title" class="heading">
          <div
            v-if="avatar"
            class="avatar"
            :style="{ backgroundImage: `url(${props.avatar})` }"
          ></div>
          <v-icon v-if="icon" :name="icon" class="icon" :scale="desktop ? 3 : 1.5" />
          <h1>{{ props.title }}</h1>
        </div>

        <div class="body">
          <slot></slot>
        </div>

        <div v-if="props.buttons" class="btn-container">
          <button
            v-for="(button, i) in buttons"
            class="btn large"
            :class="{ primary: i === 0 && !props.noPrimary }"
            :key="i"
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
      </div>
    </div>
  </transition>
</template>

<style>
.standard-modal {
  z-index: 8000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  max-height: 80%;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.9);
}

.modal .heading {
  display: flex;
  align-items: center;
}

.modal h2 {
  margin-bottom: 10px;
}

.modal .heading .avatar,
.modal .heading .icon {
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  margin-right: 10px;
}

.modal .heading .avatar {
  border: 2px solid #000000;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.modal .body {
  display: flex;
  width: 100%;
  padding: 20px 0;
}

.modal .btn-container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  /* General Modal (Desktop / Tablet) */

  .modal {
    max-width: 600px;
    padding: 20px 30px;
  }

  .modal .heading {
    padding: 10px 0;
  }

  .modal .heading .avatar {
    width: 70px;
    min-width: 70px;
    height: 70px;
    min-height: 70px;
    margin-right: 20px;
  }

  .modal h2 {
    margin-bottom: 20px;
  }

  .modal .btn-container {
    padding: 10px 0;
  }
}
</style>
