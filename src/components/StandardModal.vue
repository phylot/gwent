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
  disabled?: boolean
  icon?: string
  modelValue?: boolean
  noPrimary?: boolean
  persistent?: boolean
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
    <div
      v-if="localModelValue"
      class="standard-modal"
      :class="{ desktop: props.desktop }"
      role="dialog"
      @click.self="props.persistent ? null : resolvePromise(0) + hide()"
    >
      <div class="modal">
        <div v-if="props.title" class="heading">
          <div
            v-if="props.avatar"
            class="avatar"
            :style="{ backgroundImage: `url(${props.avatar})` }"
          ></div>
          <v-icon v-if="props.icon" class="icon" :name="props.icon" />

          <h1 class="title">{{ props.title }}</h1>
        </div>

        <div class="body">
          <slot></slot>
        </div>

        <div v-if="props.buttons" class="btn-container">
          <button
            v-for="(button, i) in props.buttons"
            class="btn"
            :class="{ large: props.desktop, primary: i === 0 && !props.noPrimary }"
            :disabled="props.disabled"
            :key="i"
            type="button"
            @click="resolvePromise(i + 1) + hide()"
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
  -webkit-user-select: none;
  user-select: none;
}

.standard-modal .modal {
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

.standard-modal .modal .heading {
  display: flex;
  align-items: center;
}

.standard-modal .modal .heading .title {
  font-size: 22px;
}

.standard-modal .modal .heading .avatar,
.standard-modal .modal .heading .icon {
  width: 40px;
  min-width: 40px;
  height: 40px;
  min-height: 40px;
  margin-right: 10px;
}

.standard-modal .modal .heading .avatar {
  border: 2px solid #ffffff;
  border-radius: 999px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.standard-modal .modal .body {
  display: flex;
  width: 100%;
  padding: 20px 0;
}

.standard-modal .modal .btn-container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  gap: 20px;
}

/* Desktop Styles */

.standard-modal.desktop .modal {
  max-width: 600px;
  padding: 20px 30px;
}

.standard-modal.desktop .modal .heading {
  padding: 10px 0;
}

.standard-modal.desktop .modal .heading .title {
  font-size: 40px;
}

.standard-modal.desktop .modal .heading .avatar {
  width: 70px;
  min-width: 70px;
  height: 70px;
  min-height: 70px;
  margin-right: 20px;
}

.standard-modal.desktop .modal h2 {
  margin-bottom: 20px;
}

.standard-modal.desktop .modal .btn-container {
  padding: 10px 0;
}
</style>
