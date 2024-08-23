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
    <div v-if="localModelValue" class="card-unlock-modal" role="dialog">
      <h1 class="heading">New Card Unlocked!</h1>

      <BigCard
        v-if="card"
        :ability="card.ability"
        :ability-icon="card.abilityIcon"
        animation-name="shine-infinite"
        :default-value="card.defaultValue"
        :description="card.description"
        :desktop="props.desktop"
        :faction="card.faction"
        glow
        :hero="card.hero"
        :image-url="card.imageUrl"
        :name="card.name"
        :type-icon="card.typeIcon"
        :value="card.value"
      >
      </BigCard>

      <div class="btn-container">
        <button class="btn large primary" @click="resolvePromise(true) + hide()">
          Manage Deck
        </button>
        <button class="btn large" @click="resolvePromise(false) + hide()">Dismiss</button>
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
  padding: 20px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: safe center;
  align-items: center;
  gap: 40px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.85);
}

.card-unlock-modal .heading {
  text-align: center;
}

.card-unlock-modal .big-card {
  max-width: 300px;
}

.card-unlock-modal .btn-container {
  display: flex;
  flex-direction: column;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .card-unlock-modal .big-card {
    max-width: 420px;
  }
}
</style>
