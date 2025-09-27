<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Card } from './../types'
import BigCard from './BigCard.vue'

defineExpose({
  show,
  hide
})

const props = defineProps<{
  card?: Card
  desktop?: boolean
  modelValue?: boolean
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
  <transition name="slow-fade">
    <div
      v-if="localModelValue"
      class="card-unlock-modal"
      :class="{ desktop: desktop }"
      role="dialog"
    >
      <h1 class="title">New Card Unlocked!</h1>

      <BigCard
        v-if="props.card"
        :ability="props.card.ability"
        :ability-icon="props.card.abilityIcon"
        animation-name="shine-infinite"
        :default-value="props.card.defaultValue"
        :description="props.card.description"
        :desktop="props.desktop"
        :faction="props.card.faction"
        glow
        :hero="props.card.hero"
        :image-url="props.card.imageUrl"
        :name="props.card.name"
        :type-icon="props.card.typeIcon"
        :value="props.card.value"
      >
      </BigCard>

      <div class="btn-container">
        <button
          class="btn primary"
          :class="{ large: props.desktop }"
          @click="resolvePromise(true) + hide()"
        >
          Manage Deck
        </button>
        <button
          class="btn"
          :class="{ large: props.desktop }"
          @click="resolvePromise(false) + hide()"
        >
          Dismiss
        </button>
      </div>
    </div>
  </transition>
</template>

<style>
.card-unlock-modal {
  z-index: 8500;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  padding: 0 20px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: safe center;
  align-items: center;
  gap: 40px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.85);
}

.card-unlock-modal .title {
  text-align: center;
  font-size: 22px;
}

.card-unlock-modal .big-card {
  max-width: 300px;
}

.card-unlock-modal .btn-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Desktop Styles */

.card-unlock-modal.desktop .title {
  font-size: 40px;
}

.card-unlock-modal.desktop .big-card {
  max-width: 420px;
}

.card-unlock-modal.desktop .btn-container {
  gap: 20px;
}
</style>
