<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Card, type CardCollection } from '@/types'
import SmallCard from '../components/SmallCard.vue'

const props = defineProps<{
  cardCollection: CardCollection
  desktop: boolean
  leaderCards: Card
}>()

let localCardCollection = ref()
let factionKeys = ref(Object.keys(props.cardCollection))
let factionIndex = ref(0)

// HOOKS

onMounted(() => {
  localCardCollection.value = props.cardCollection
  console.log('MOUNTED localCardCollection.value: ', localCardCollection.value)
})

function changeFaction(index: number) {
  if (index < 0) {
    factionIndex.value = factionKeys.value.length - 1
  } else if (index > factionKeys.value.length - 1) {
    factionIndex.value = 0
  } else {
    factionIndex.value = index
  }
}

function cardClick(card: Card) {
  console.log('cardClick() card: ', card)
}
</script>

<template>
  <div class="deck-manager">
    <div class="deck-manager-container">
      <div class="deck-manager-heading" style="display: inline-flex">
        <button class="btn" @click="changeFaction(factionIndex - 1)">LEFT</button>
        <h1 style="color: white">{{ factionKeys[factionIndex] }}</h1>
        <button class="btn" @click="changeFaction(factionIndex + 1)">RIGHT</button>
      </div>

      <div v-if="localCardCollection" class="deck-manager-content">
        <SmallCard
          v-for="(card, i) in localCardCollection[factionKeys[factionIndex]].deck"
          :ability-icon="card.abilityIcon"
          :active="card.active"
          :animation-name="card.animationName"
          class="no-mobile-highlight"
          :default-value="card.defaultValue"
          :desktop="props.desktop"
          :faction="card.faction"
          :hero="card.hero"
          :image-url="card.imageUrl"
          :key="i"
          role="button"
          tabindex="4"
          :type-icon="card.typeIcon"
          :value="card.value"
          @smallcard-click="cardClick(card)"
          @smallcard-enter="cardClick(card)"
          @smallcard-space="cardClick(card)"
        />
      </div>
      <div v-if="localCardCollection" class="deck-manager-content">
        <SmallCard
          v-for="(card, i) in localCardCollection[factionKeys[factionIndex]].cards"
          :ability-icon="card.abilityIcon"
          :active="card.active"
          :animation-name="card.animationName"
          class="no-mobile-highlight"
          :default-value="card.defaultValue"
          :desktop="props.desktop"
          :faction="card.faction"
          :hero="card.hero"
          :image-url="card.imageUrl"
          :key="i"
          role="button"
          tabindex="4"
          :type-icon="card.typeIcon"
          :value="card.value"
          @smallcard-click="cardClick(card)"
          @smallcard-enter="cardClick(card)"
          @smallcard-space="cardClick(card)"
        />
      </div>
    </div>
  </div>
</template>

<style>
.deck-manager {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
}

.deck-manager .deck-manager-container {
  width: 100%;
  min-width: 320px;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: #893b93;
}

.deck-manager .deck-manager-content {
  height: 70px;
  display: flex;
}

/* Desktop Styles */

@media (min-width: 1200px) and (min-height: 880px) and (orientation: landscape) {
  .deck-manager-container {
    width: 80%;
    max-width: 1600px;
  }
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .deck-manager .deck-manager-content {
    height: 110px;
  }
}
</style>
