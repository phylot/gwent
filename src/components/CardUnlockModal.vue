<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Card } from './../types'
import BigCard from './BigCard.vue'

defineExpose({
  show
})

const props = defineProps<{
  card?: Card
  deck?: Card[]
  desktop?: boolean
  faction?: string
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

watch(
  () => localModelValue.value,
  (val) => {
    if (val) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  }
)

function show() {
  return new Promise((resolve, reject) => {
    localModelValue.value = true
    resolvePromise.value = resolve
    rejectPromise.value = reject
  })
}

function resolveModal(returnBool: boolean) {
  resolvePromise.value(returnBool)
  localModelValue.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    resolveModal(false)
  }
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
      <template v-if="card">
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
      </template>

      <template v-if="deck && deck.length">
        <h1 class="title">New Deck Unlocked!</h1>

        <div class="faction-heading">
          <div class="flag-icon" :class="props.faction"></div>
          <h2 class="faction-title">{{ props.faction }}</h2>
        </div>

        <div class="card-unlock-fan">
          <BigCard
            v-for="(card, i) in props.deck"
            :ability="card.ability"
            :ability-icon="card.abilityIcon"
            animation-name="shine-infinite"
            :class="`fan-card-${i + 1}`"
            :default-value="card.defaultValue"
            :description="card.description"
            :desktop="desktop"
            :faction="card.faction"
            glow
            :hero="card.hero"
            :image-url="card.imageUrl"
            :key="i"
            :name="card.name"
            no-description
            :type-icon="card.typeIcon"
            :value="card.value"
          >
          </BigCard>
        </div>
      </template>

      <div class="btn-container">
        <button
          class="btn primary"
          :class="{ large: props.desktop }"
          type="button"
          @click="resolveModal(true)"
        >
          Manage Deck
        </button>
        <button
          class="btn"
          :class="{ large: props.desktop }"
          type="button"
          @click="resolveModal(false)"
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
  gap: 30px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.85);
}

.card-unlock-modal .title {
  text-align: center;
  font-size: 24px;
}

.card-unlock-modal .faction-heading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.card-unlock-modal .faction-heading .faction-title {
  text-align: center;
  font-size: 20px;
  text-transform: capitalize;
}

.card-unlock-modal .faction-heading .flag-icon {
  width: 26px;
  height: 26px;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background-position: center;
  background-size: cover;
}

.card-unlock-modal .faction-heading .flag-icon.undead {
  background-image: url('./../assets/images/undead-flag.png');
}

.card-unlock-modal .big-card {
  max-width: 300px;
}

.card-unlock-modal .card-unlock-fan {
  position: relative;
  width: 150px;
  height: 200px;
}

.card-unlock-modal .card-unlock-fan .fan-card-1 {
  position: absolute;
  left: -70px;
  z-index: 1;
  transform: rotate(-20deg) scale(0.85);
}

.card-unlock-modal .card-unlock-fan .fan-card-2 {
  position: absolute;
  right: -70px;
  z-index: 2;
  transform: rotate(20deg) scale(0.85);
}

.card-unlock-modal .card-unlock-fan .fan-card-3 {
  position: absolute;
  z-index: 3;
}

.card-unlock-modal .btn-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Desktop Styles */

.card-unlock-modal.desktop {
  gap: 40px;
}

.card-unlock-modal.desktop .title {
  font-size: 40px;
}

.card-unlock-modal.desktop .faction-heading {
  gap: 15px;
}

.card-unlock-modal.desktop .faction-heading .faction-title {
  font-size: 32px;
}

.card-unlock-modal.desktop .faction-heading .flag-icon {
  width: 36px;
  height: 36px;
}

.card-unlock-modal.desktop .big-card {
  max-width: 420px;
}

.card-unlock-modal.desktop .card-unlock-fan {
  position: relative;
  width: 250px;
  height: 350px;
}

.card-unlock-modal.desktop .card-unlock-fan .fan-card-1 {
  left: -120px;
}

.card-unlock-modal.desktop .card-unlock-fan .fan-card-2 {
  right: -120px;
}

.card-unlock-modal.desktop .btn-container {
  gap: 20px;
}
</style>
